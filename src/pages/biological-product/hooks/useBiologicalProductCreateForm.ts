import {
  useToast,
  convertHtmlToLexical,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { isContaintHtmlTag, safeConvertLexicalToHtml } from "@/utils/commons";
import type { BiologicalProductFormData } from "../types/types";
import { parsePackagingSpec } from "../../pesticide/utils/form";
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { normalizeSku } from "@/shared/lib/sku";
import { SUPPLY_TYPE } from "../data/constants";

export function useBiologicalProductCreateForm() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [matchFarm, paramsFarm] = useRoute(
    "/cultivation-material/biological-product/:id/edit",
  );
  const [matchAdmin, paramsAdmin] = useRoute(
    "/admin/biological-product/:id/edit",
  );
  const isEdit =
    (matchFarm || matchAdmin) && !!(paramsFarm?.id || paramsAdmin?.id);
  const params = paramsFarm || paramsAdmin;
  const scope = matchAdmin || location.startsWith("/admin") ? "admin" : "farm";
  const { toast } = useToast();
  const { uploadImage } = useImageUploadWithCache();

  const [formData, setFormData] = useState<BiologicalProductFormData>({
    configMode: "SPEC",

    code: "",
    name: "",
    imageUrl: "",
    imageFile: null,

    nutritionalContentId: "macronutrients",
    originId: "inorganic",
    applicationStageId: "top_dressing",
    physicalFormId: "soil_application",
    nutrientContent: "",
    description: "",

    registrationNumber: "",
    scientificTechnicalName: "",
    biologicalProductOriginGroup: "",
    nutritionalComponents: "",
    biologicalProductType: "",
    physicalForm: "",
    mainIngredients: "",
    moaGroup: "",
    npkRatio: "",

    indications: "",
    applicationStage: "",
    targetCrops: [],
    recommendedDosage: "",
    applicationMethod: "",
    usageNotes: "",
    shelfLife: "",

    toxicityInfo: "",
    protectiveMeasures: "",
    firstAid: "",
    legalStatus: "allowed",
    legalDescription: "",
    standardsCompliance: [],

    manufacturerOrigin: null,
    importerRegistrant: null,
    distributor: null,
    referencePrice: "",
    packagingSpecs: [],

    hashtags: [],
    documents: [],
    quantity: "",
    unit: "",
    packaging: "",
    formType: "basic",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Metadata states
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);
  const [baseUnits, setBaseUnits] = useState<any[]>([]);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);

  // Load metadata and initial data for Edit
  useEffect(() => {
    setLoading(true);
    Promise.all([
      farmSupplyApi.listPackagingTypes(),
      farmSupplyApi.listBaseUnits(),
      farmSupplyApi.getClassificationGroups(SUPPLY_TYPE),
      farmSupplyApi.getTargetSubjects("CROP"),
      farmSupplyApi.listCertificateStandards(),
    ])
      .then(([pkgs, units, groups, subjects, certs]) => {
        setPackagingTypes(pkgs);
        setBaseUnits(units);
        setAllGroups(groups);
        setAllSubjects(subjects);
        setAllCertificates(certs);

        if (isEdit && params?.id) {
          return farmSupplyApi
            .getById(SUPPLY_TYPE, Number(params.id), "OWNER", scope)
            .then((item) => {
              const mapped = mapResponseToBiologicalProduct(item, certs);
              setFormData(mapped);
            });
        }
      })
      .catch((err) => {
        toast({
          title: "Lỗi",
          description: "Không tải được thông tin metadata hoặc vật tư",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isEdit, params?.id]);

  // Convert HTML back to Lexical for Rich Editor
  useEffect(() => {
    const hydrateFirstAid = async () => {
      if (!formData.firstAid || !isContaintHtmlTag(formData.firstAid)) {
        return;
      }
      const content = await convertHtmlToLexical(formData.firstAid);
      setFormData((prev) => ({
        ...prev,
        firstAid: content as any,
      }));
    };
    void hydrateFirstAid();
  }, [formData.code]);

  const updateField = (field: keyof BiologicalProductFormData, value: any) => {
    const nextValue =
      field === "code" && typeof value === "string"
        ? normalizeSku(value)
        : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
  };

  const resetForm = () => {
    setFormData((prev) => ({ ...prev, code: "" }));
  };

  const handleConfirmSubmit = async (isDetailMode?: boolean) => {
    const hasSimplePackagingRule =
      formData.configMode === "BASE_UNIT"
        ? Boolean(formData.unit)
        : Boolean(formData.packaging && formData.quantity && formData.unit);

    const hasAdvancedPackagingRule = (formData.packagingSpecs || []).length > 0;

    if (isDetailMode ? !hasAdvancedPackagingRule : !hasSimplePackagingRule) {
      toast({
        title: "Thiếu thông tin",
        description: isDetailMode
          ? "Vui lòng thêm ít nhất một quy cách đóng gói."
          : "Vui lòng nhập đủ quy cách, giá trị và đơn vị đóng gói.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const firstAidHtml = await safeConvertLexicalToHtml(formData.firstAid);
      const uploadedImageUrl = await uploadImage(
        formData.imageUrl,
        formData.imageFile,
        SUPPLY_TYPE,
      );

      // Dynamic Classifications matching
      const classifications: any[] = [];
      const addClasses = (classKey: string, names: string | string[]) => {
        const nameList = Array.isArray(names) ? names : names ? [names] : [];
        nameList.forEach((name, idx) => {
          if (!name) return;
          const matched = allGroups.find(
            (g) =>
              g.classification === classKey &&
              (g.name?.toLowerCase() === name.toLowerCase() ||
                g.code?.toLowerCase() === name.toLowerCase()),
          );
          if (matched) {
            classifications.push({
              classification: classKey,
              groupId: matched.id,
              displayOrder: idx,
            });
          }
        });
      };

      addClasses(
        "nutrient_composition",
        formData.biologicalProductType || formData.nutritionalContentId,
      );
      addClasses(
        "origin",
        formData.biologicalProductOriginGroups &&
          formData.biologicalProductOriginGroups.length > 0
          ? formData.biologicalProductOriginGroups
          : formData.biologicalProductOriginGroup || formData.originId,
      );
      addClasses(
        "effect_stage",
        formData.applicationStage || formData.applicationStageId,
      );
      addClasses(
        "physical_form",
        formData.physicalForm || formData.physicalFormId,
      );

      // Dynamic Subjects mapping
      const targetSubjectIds = formData.targetCrops
        .map(
          (name) =>
            allSubjects.find((s) => s.name.toLowerCase() === name.toLowerCase())
              ?.id,
        )
        .filter((id): id is number => id !== undefined);

      // Dynamic Certificates mapping
      const certificateIds = formData.standardsCompliance
        .map(
          (name) =>
            allCertificates.find(
              (c) => c.name.toLowerCase() === name.toLowerCase(),
            )?.id,
        )
        .filter((id): id is number => id !== undefined);

      // Process documents upload with cache
      const documentsPayload: any[] = [];
      if (formData.documents && formData.documents.length > 0) {
        for (let i = 0; i < formData.documents.length; i++) {
          const doc = formData.documents[i] as any;
          let fileUrl = doc.fileUrl || "";
          const fileToUpload = doc.file || doc.fileObj;
          if (fileToUpload) {
            const blobUrl =
              doc.fileUrl || (doc.file ? URL.createObjectURL(doc.file) : "");
            const uploadedUrl = await uploadImage(
              blobUrl,
              fileToUpload,
              SUPPLY_TYPE,
            );
            if (uploadedUrl) {
              fileUrl = uploadedUrl;
            }
          }
          if (fileUrl || doc.content) {
            documentsPayload.push({
              id: doc.id,
              documentType: doc.documentType || "MANUAL",
              fileName: doc.fileName || doc.name || "Tài liệu hướng dẫn",
              fileUrl: fileUrl || undefined,
              content: doc.content || undefined,
              displayOrder: i,
            });
          }
        }
      }

      const generatedSku =
        (isEdit ? formData.code?.trim() : normalizeSku(formData.code)) ||
        `PB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const payload: any = {
        name: formData.name,
        sku: generatedSku,
        displayOrder: 10,
        status: "active",
        domainCode: "CROP",
        manufacturerOrganizationId: formData.manufacturerOrigin?.id || null,
        importerOrganizationId: formData.importerRegistrant?.id || null,
        distributorOrganizationId: formData.distributor?.id || null,
        referencePrice: formData.referencePrice || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        legalStatus: formData.legalStatus || "allowed",
        legalDescription: formData.legalDescription || undefined,
        description: formData.description || undefined,
        hashtags: formData.hashtags,
        imageUrl: uploadedImageUrl || undefined,
        packagingVariants: parsePackagingSpecs(
          isDetailMode
            ? formData.packagingSpecs
            : formData.packaging || formData.quantity || formData.unit
              ? [
                  `${formData.packaging || "Bao"} ${formData.quantity || "1"} ${formData.unit || "kg"}`,
                ]
              : [],
          packagingTypes,
          baseUnits,
        ),
        certificates: certificateIds.map((cid, i) => ({
          certificateId: cid,
          displayOrder: i,
        })),
        classifications,
        targetSubjectIds,

        // Metadata for unsupported fields
        metadataJson: {
          origin: formData.biologicalProductOriginGroup || undefined,
          formType: isDetailMode ? "advanced" : "basic",
          shelfLife: formData.shelfLife || undefined,
          applicationStage: formData.applicationStage || undefined,
          mainIngredients: formData.mainIngredients || undefined,
        },

        // Profile details
        scientificName: formData.scientificTechnicalName || undefined,
        npkRatio: formData.npkRatio || undefined,
        detailedComposition:
          formData.nutrientContent ||
          formData.nutritionalComponents ||
          formData.mainIngredients ||
          undefined,
        moaOrNutrientNote: formData.moaGroup || undefined,
        mainUsage: formData.indications || undefined,
        recommendedDosage: formData.recommendedDosage || undefined,
        usageMethod: formData.applicationMethod || undefined,
        usageNotes: formData.usageNotes || undefined,
        shelfLife: formData.shelfLife || undefined,
        toxicityDescription: formData.toxicityInfo || undefined,
        protectiveMeasures: formData.protectiveMeasures || undefined,
        poisoningTreatment: firstAidHtml || undefined,

        documents: documentsPayload.length > 0 ? documentsPayload : undefined,
      };

      if (isEdit && params?.id) {
        await farmSupplyApi.update(
          SUPPLY_TYPE,
          Number(params.id),
          payload,
          scope,
        );
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin chế phẩm sinh học thành công",
        });
      } else {
        await farmSupplyApi.create(SUPPLY_TYPE, payload, scope);
        toast({
          title: "Thành công",
          description: "Đã thêm mới chế phẩm sinh học thành công",
        });
      }
      queryClient.invalidateQueries({
        queryKey: [scope === "admin" ? "admin-supplies" : "farm-supplies"],
      });
      setLocation(
        scope === "admin"
          ? "/admin/biological-product"
          : "/cultivation-material/biological-product",
      );
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: "Trùng lặp SKU",
          description:
            "Mã SKU này đã tồn tại trong hệ thống. Vui lòng nhập mã SKU khác.",
          variant: "destructive",
        });
      } else if (err.response?.status === 400) {
        toast({
          title: "Dữ liệu không hợp lệ",
          description:
            getApiErrorMessage(err) ||
            "Thông tin tổ chức không hợp lệ. Vui lòng kiểm tra lại.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: err.message || "Lưu thất bại",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return {
    isEdit,
    formData,
    setFormData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    setLocation,
    loading,
    submitting,
    scope,
  };
}

function mapResponseToBiologicalProduct(item: any, certs: any[]): any {
  const profile = item.profile || {};
  return {
    code: item.sku || item.code,
    name: item.name,
    imageUrl:
      (item.metadataJson && item.metadataJson?.imageUrl) || item.imageUrl || "",
    imageFile: null,
    formType: item.metadataJson?.formType || "basic",

    nutritionalContentId:
      item.classifications?.find(
        (c: any) => c.classification === "nutrient_composition",
      )?.group?.name || "macronutrients",
    originId:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name ||
      item.metadataJson?.origin ||
      "inorganic",
    applicationStageId:
      item.classifications?.find(
        (c: any) => c.classification === "effect_stage",
      )?.group?.name || "top_dressing",
    physicalFormId:
      item.classifications?.find(
        (c: any) => c.classification === "physical_form",
      )?.group?.name || "soil_application",
    nutrientContent: profile.detailedComposition || "",
    description: item.description || "",

    registrationNumber: item.registrationNumber || "",
    scientificTechnicalName: profile.scientificName || "",
    biologicalProductOriginGroup:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name ||
      item.metadataJson?.origin ||
      "",
    biologicalProductOriginGroups:
      item.classifications
        ?.filter((c: any) => c.classification === "origin")
        ?.map((c: any) => c.group?.name)
        ?.filter(Boolean) || [],
    nutritionalComponents: profile.detailedComposition || "",
    biologicalProductType:
      item.classifications?.find(
        (c: any) => c.classification === "nutrient_composition",
      )?.group?.name || "",
    physicalForm:
      item.classifications?.find(
        (c: any) => c.classification === "physical_form",
      )?.group?.name || "",
    mainIngredients: item.metadataJson?.mainIngredients || "",
    moaGroup: profile.moaOrNutrientNote || "",
    npkRatio: profile.npkRatio || "",

    indications: profile.mainUsage || "",
    applicationStage:
      item.classifications?.find(
        (c: any) => c.classification === "effect_stage",
      )?.group?.name ||
      item.metadataJson?.applicationStage ||
      "",
    targetCrops: item.targetSubjects?.map((t: any) => t.name) || [],
    recommendedDosage: profile.recommendedDosage || "",
    applicationMethod: profile.usageMethod || "",
    usageNotes: profile.usageNotes || "",
    shelfLife: profile.shelfLife || item.metadataJson?.shelfLife || "",

    toxicityInfo: profile.toxicityDescription || "",
    protectiveMeasures: profile.protectiveMeasures || "",
    firstAid: profile.poisoningTreatment || "",
    legalStatus: item.legalStatus || "allowed",
    legalDescription: item.legalDescription || "",
    standardsCompliance:
      item.certificates
        ?.map(
          (c: any) =>
            c.certificate?.name ||
            certs.find((x: any) => x.id === c.certificateId)?.name,
        )
        .filter(Boolean) || [],

    manufacturerOrigin: item.manufacturerOrganization || null,
    importerRegistrant: item.importerOrganization || null,
    distributor: item.distributorOrganization || null,
    referencePrice: item.referencePrice || "",
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: (item.hashtags || []).map((t: string) =>
      t.startsWith("#") ? t.slice(1) : t,
    ),
    documents: profile.documents || [],
    ...parsePackagingSpec(formatPackagingSpecs(item.packagingVariants)?.[0]),
  };
}
