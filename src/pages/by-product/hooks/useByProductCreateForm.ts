import {
  useToast,
  convertHtmlToLexical,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { isContaintHtmlTag, safeConvertLexicalToHtml } from "@/utils/commons";
import type { ByProductFormData } from "../types/types";
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { normalizeSku } from "@/shared/lib/sku";
import { SUPPLY_TYPE } from "../data/constants";

export function useByProductCreateForm() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [matchFarm, paramsFarm] = useRoute(
    "/cultivation-material/byproduct/:id/edit",
  );
  const [matchAdmin, paramsAdmin] = useRoute("/admin/byproduct/:id/edit");
  const isEdit =
    (matchFarm || matchAdmin) && !!(paramsFarm?.id || paramsAdmin?.id);
  const params = paramsFarm || paramsAdmin;
  const scope = matchAdmin || location.startsWith("/admin") ? "admin" : "farm";
  const { toast } = useToast();
  const { uploadImage } = useImageUploadWithCache();

  const [formData, setFormData] = useState<ByProductFormData>({
    configMode: "SPEC",

    code: "",
    name: "",
    imageUrl: "",
    imageFile: null,

    registrationNumber: "",
    scientificTechnicalName: "",

    byProductOrigins: [],
    byProductPhysicoChemicals: [],
    byProductToxicityRegulations: [],

    detailedComposition: "",
    description: "",

    indications: "",
    applicationStage: "",
    effectStage: "",
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
              const mapped = mapResponseToByProduct(item, certs);
              setFormData(mapped);
            });
        }
      })
      .catch(() => {
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

  const updateField = (field: keyof ByProductFormData, value: any) => {
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
    const hasPackagingSpec =
      (formData.packagingSpecs && formData.packagingSpecs.length > 0) ||
      (formData.configMode === "BASE_UNIT"
        ? Boolean(formData.unit)
        : Boolean(formData.packaging && formData.quantity && formData.unit));

    if (!hasPackagingSpec) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đủ quy cách, giá trị và đơn vị đóng gói.",
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

      // Dynamic Classifications matching for 3 tabs
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

      addClasses("origin", formData.byProductOrigins || []);
      addClasses("physico_chemical", formData.byProductPhysicoChemicals || []);
      addClasses("toxicity_regulation", formData.byProductToxicityRegulations || []);

      // Dynamic Subjects mapping
      const targetSubjectIds = (formData.targetCrops || [])
        .map(
          (name) =>
            allSubjects.find((s) => s.name.toLowerCase() === name.toLowerCase())
              ?.id,
        )
        .filter((id): id is number => id !== undefined);

      // Dynamic Certificates mapping
      const certificateIds = (formData.standardsCompliance || [])
        .map(
          (name) =>
            allCertificates.find(
              (c) => c.name.toLowerCase() === name.toLowerCase(),
            )?.id,
        )
        .filter((id): id is number => id !== undefined);

      // Process documents upload
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
        `PP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
          formData.packagingSpecs && formData.packagingSpecs.length > 0
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

        // Metadata
        metadataJson: {
          formType: isDetailMode ? "advanced" : "basic",
          shelfLife: formData.shelfLife || undefined,
          effectStage: formData.effectStage || formData.applicationStage || undefined,
        },

        // Profile details
        scientificName: formData.scientificTechnicalName || undefined,
        detailedComposition: formData.detailedComposition || undefined,
        mainUsage: formData.indications || undefined,
        effectStage: formData.effectStage || formData.applicationStage || undefined,
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
        await farmSupplyApi.update(SUPPLY_TYPE, Number(params.id), payload, scope);
        toast({
          title: "Thành công",
          description: "Đã cập nhật phụ phẩm thành công.",
        });
      } else {
        await farmSupplyApi.create(SUPPLY_TYPE, payload, scope);
        toast({
          title: "Thành công",
          description: "Đã tạo mới phụ phẩm thành công.",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: [scope === "admin" ? "admin-supplies" : "farm-supplies"],
      });

      const redirectPath =
        scope === "admin"
          ? "/admin/byproduct"
          : "/cultivation-material/byproduct";
      setLocation(redirectPath);
    } catch (err: any) {
      toast({
        title: isEdit ? "Cập nhật thất bại" : "Tạo thất bại",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    loading,
    submitting,
    handleConfirmSubmit,
    isEdit,
    scope,
    goBack: () => {
      const redirectPath =
        scope === "admin"
          ? "/admin/byproduct"
          : "/cultivation-material/byproduct";
      setLocation(redirectPath);
    },
  };
}

function mapResponseToByProduct(item: any, certs: any[]): ByProductFormData {
  const profile = item.profile || {};
  const originGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "origin")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const physicoGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "physico_chemical")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const toxicityGroups =
    item.classifications
      ?.filter((c: any) => c.classification === "toxicity_regulation")
      ?.map((c: any) => c.group?.name)
      ?.filter(Boolean) || [];

  const mappedCerts =
    item.certificates
      ?.map(
        (c: any) =>
          c.certificate?.name ||
          certs.find((ct) => ct.id === c.certificateId)?.name,
      )
      ?.filter(Boolean) || [];

  const mappedSubjects =
    item.targetSubjects?.map((s: any) => s.name)?.filter(Boolean) || [];

  return {
    configMode: "SPEC",
    code: item.code || item.sku || "",
    name: item.name || "",
    imageUrl: item.imageUrl || "",
    imageFile: null,

    registrationNumber: item.registrationNumber || "",
    scientificTechnicalName: profile.scientificName || item.scientificName || "",

    byProductOrigins: originGroups,
    byProductPhysicoChemicals: physicoGroups,
    byProductToxicityRegulations: toxicityGroups,

    detailedComposition: profile.detailedComposition || item.detailedComposition || "",
    description: item.description || "",

    indications: profile.mainUsage || "",
    applicationStage: profile.effectStage || item.metadataJson?.effectStage || "",
    effectStage: profile.effectStage || item.metadataJson?.effectStage || "",
    targetCrops: mappedSubjects,
    recommendedDosage: profile.recommendedDosage || "",
    applicationMethod: profile.usageMethod || "",
    usageNotes: profile.usageNotes || "",
    shelfLife: profile.shelfLife || "",

    toxicityInfo: profile.toxicityDescription || "",
    protectiveMeasures: profile.protectiveMeasures || "",
    firstAid: profile.poisoningTreatment || "",
    legalStatus: item.legalStatus || "allowed",
    legalDescription: item.legalDescription || "",
    standardsCompliance: mappedCerts,

    manufacturerOrigin: item.manufacturerOrganization
      ? {
          id: item.manufacturerOrganization.id,
          name: item.manufacturerOrganization.name,
        }
      : null,
    importerRegistrant: item.importerOrganization
      ? {
          id: item.importerOrganization.id,
          name: item.importerOrganization.name,
        }
      : null,
    distributor: item.distributorOrganization
      ? {
          id: item.distributorOrganization.id,
          name: item.distributorOrganization.name,
        }
      : null,

    referencePrice: item.referencePrice || "",
    packagingSpecs: formatPackagingSpecs(item.packagingVariants || []),
    hashtags: item.hashtags || [],
    documents: (item.profile?.documents || item.documents || []).map((d: any) => ({
      name: d.fileName || d.name || "Tài liệu",
      size: 0,
      fileUrl: d.fileUrl,
      content: d.content,
      documentType: d.documentType,
    })),
    formType: item.metadataJson?.formType || "basic",
  };
}
