import {
  useToast,
  convertHtmlToLexical,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { isContaintHtmlTag, safeConvertLexicalToHtml } from "@/utils/commons";
import type { FertilizerFormData } from "../types/types";
import { parsePackagingSpec } from "../../pesticide/utils/form";
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";

export function useFertilizerCreateForm() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/fertilizer/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();
  const { uploadImage } = useImageUploadWithCache();

  const [formData, setFormData] = useState<FertilizerFormData>({
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
    fertilizerOriginGroup: "",
    nutritionalComponents: "",
    fertilizerType: "",
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

    manufacturerOrigin: "",
    importerRegistrant: "",
    distributor: "",
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
      farmSupplyApi.getClassificationGroups("fertilizer"),
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
            .getById("fertilizer", Number(params.id), "OWNER")
            .then((item) => {
              const mapped = mapResponseToFertilizer(item, certs);
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

  const updateField = (field: keyof FertilizerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData((prev) => ({ ...prev, code: "" }));
  };

  const handleConfirmSubmit = async (isDetailMode?: boolean) => {
    setSubmitting(true);
    try {
      const firstAidHtml = await safeConvertLexicalToHtml(formData.firstAid);
      const uploadedImageUrl = await uploadImage(
        formData.imageUrl,
        formData.imageFile,
        "fertilizer",
      );

      // Dynamic Classifications matching
      const classifications: any[] = [];
      const addClass = (classKey: string, name: string) => {
        if (!name) return;
        const matched = allGroups.find(
          (g) =>
            g.classification === classKey &&
            g.name.toLowerCase() === name.toLowerCase(),
        );
        if (matched) {
          classifications.push({
            classification: classKey,
            groupId: matched.id,
            displayOrder: 0,
          });
        }
      };

      addClass(
        "nutrient_composition",
        formData.fertilizerType || formData.nutritionalContentId,
      );
      addClass("origin", formData.fertilizerOriginGroup || formData.originId);
      addClass(
        "effect_stage",
        formData.applicationStage || formData.applicationStageId,
      );
      addClass(
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

      const generatedSku =
        formData.code?.trim() ||
        `PB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const payload: any = {
        name: formData.name,
        sku: generatedSku,
        displayOrder: 10,
        status: "active",
        domainCode: "CROP",
        manufacturer: formData.manufacturerOrigin || undefined,
        importer: formData.importerRegistrant || undefined,
        distributor: formData.distributor || undefined,
        referencePrice: formData.referencePrice || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        legalStatus: formData.legalStatus || "allowed",
        legalDescription: formData.legalDescription || undefined,
        description: formData.description || undefined,
        hashtags: formData.hashtags,
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
          imageUrl: uploadedImageUrl || undefined,
          origin:
            formData.fertilizerOriginGroup ||
            formData.manufacturerOrigin ||
            undefined,
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

        documents: formData.documents || [],
      };

      if (isEdit && params?.id) {
        await farmSupplyApi.update("fertilizer", Number(params.id), payload);
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin phân bón thành công",
        });
      } else {
        await farmSupplyApi.create("fertilizer", payload);
        toast({
          title: "Thành công",
          description: "Đã thêm mới phân bón thành công",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["farm-supplies"] });
      setLocation("/cultivation-material/fertilizer");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: "Trùng lặp SKU",
          description:
            "Mã SKU này đã tồn tại trong hệ thống. Vui lòng nhập mã SKU khác.",
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
  };
}

function mapResponseToFertilizer(item: any, certs: any[]): any {
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
    fertilizerOriginGroup:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name ||
      item.metadataJson?.origin ||
      "",
    nutritionalComponents: profile.detailedComposition || "",
    fertilizerType:
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

    manufacturerOrigin: item.manufacturer || "",
    importerRegistrant: item.importer || "",
    distributor: item.distributor || "",
    referencePrice: item.referencePrice || "",
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: (item.hashtags || []).map((t: string) =>
      t.startsWith("#") ? t.slice(1) : t,
    ),
    documents: profile.documents || [],
    ...parsePackagingSpec(formatPackagingSpecs(item.packagingVariants)?.[0]),
  };
}
