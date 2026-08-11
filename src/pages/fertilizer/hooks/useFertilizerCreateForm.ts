import { useToast, convertHtmlToLexical } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { isContaintHtmlTag, safeConvertLexicalToHtml } from "@/utils/commons";
import useFertilizerStore from "../../../stores/useFertilizerStore";
import type { FertilizerFormData } from "../types/types";

export function useFertilizerCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/fertilizer/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  // Zustand store
  const getFertilizerById = useFertilizerStore(
    (state) => state.getFertilizerById,
  );
  const addFertilizer = useFertilizerStore((state) => state.addFertilizer);
  const updateFertilizer = useFertilizerStore(
    (state) => state.updateFertilizer,
  );

  const initialEditItem =
    isEdit && params?.id ? getFertilizerById(Number(params.id)) : undefined;

  const [formData, setFormData] = useState<FertilizerFormData>({
    code: "",
    name: "",
    imageUrl: "",

    // Existing fields
    nutritionalContentId: "macronutrients",
    originId: "inorganic",
    applicationStageId: "top_dressing",
    physicalFormId: "soil_application",
    nutrientContent: "",
    description: "",

    // New fields
    registrationNumber: "",
    scientificTechnicalName: "",
    fertilizerOriginGroup: "",
    nutritionalComponents: "",
    fertilizerType: "",
    physicalForm: "",
    mainIngredients: "",
    moaGroup: "",
    npkRatio: "",

    // Step 2
    indications: "",
    applicationStage: "",
    targetCrops: [],
    recommendedDosage: "",
    applicationMethod: "",
    usageNotes: "",

    // Step 3
    toxicityInfo: "",
    protectiveMeasures: "",
    firstAid: "",
    legalStatus: "Được phép lưu hành",
    standardsCompliance: [],

    // Step 4
    manufacturerOrigin: "",
    importerRegistrant: "",
    distributor: "",
    referencePrice: "",
    packagingSpecs: [],

    hashtags: [],
    supplierDetails: [],
    documents: [],
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && initialEditItem) {
      setFormData({
        code: initialEditItem.code || "",
        name: initialEditItem.name || "",
        imageUrl: initialEditItem.imageUrl || "",

        nutritionalContentId: initialEditItem.nutritionalContentId || "macronutrients",
        originId: initialEditItem.originId || "inorganic",
        applicationStageId: initialEditItem.applicationStageId || "top_dressing",
        physicalFormId: initialEditItem.physicalFormId || "soil_application",
        nutrientContent: initialEditItem.nutrientContent || "",
        description: initialEditItem.description || "",

        registrationNumber: initialEditItem.registrationNumber || "",
        scientificTechnicalName: initialEditItem.scientificTechnicalName || "",
        fertilizerOriginGroup: initialEditItem.fertilizerOriginGroup || "",
        nutritionalComponents: initialEditItem.nutritionalComponents || "",
        fertilizerType: initialEditItem.fertilizerType || "",
        physicalForm: initialEditItem.physicalForm || "",
        mainIngredients: initialEditItem.mainIngredients || "",
        moaGroup: initialEditItem.moaGroup || "",
        npkRatio: initialEditItem.npkRatio || "",

        indications: initialEditItem.indications || "",
        applicationStage: initialEditItem.applicationStage || "",
        targetCrops: initialEditItem.targetCrops || [],
        recommendedDosage: initialEditItem.recommendedDosage || "",
        applicationMethod: initialEditItem.applicationMethod || "",
        usageNotes: initialEditItem.usageNotes || "",

        toxicityInfo: initialEditItem.toxicityInfo || "",
        protectiveMeasures: initialEditItem.protectiveMeasures || "",
        firstAid: initialEditItem.firstAid || "",
        legalStatus: initialEditItem.legalStatus || "Được phép lưu hành",
        standardsCompliance: initialEditItem.standardsCompliance || [],

        manufacturerOrigin: initialEditItem.manufacturerOrigin || "",
        importerRegistrant: initialEditItem.importerRegistrant || "",
        distributor: initialEditItem.distributor || "",
        referencePrice: initialEditItem.referencePrice || "",
        packagingSpecs: initialEditItem.packagingSpecs || [],

        hashtags: initialEditItem.hashtags || ["HieuQuaCao"],
        supplierDetails: initialEditItem.supplierDetails || [],
        documents: initialEditItem.documents || [],
      });
    }
  }, [isEdit, initialEditItem]);

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
  }, [initialEditItem]);

  const updateField = (field: keyof FertilizerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmSubmit = async () => {
    const firstAidHtml = await safeConvertLexicalToHtml(formData.firstAid);

    const payload = {
      code: formData.code,
      name: formData.name,
      imageUrl: formData.imageUrl,

      nutritionalContentId: formData.nutritionalContentId,
      originId: formData.originId,
      applicationStageId: formData.applicationStageId,
      physicalFormId: formData.physicalFormId,
      nutrientContent: formData.nutrientContent || formData.npkRatio || "",
      description: formData.description,

      registrationNumber: formData.registrationNumber,
      scientificTechnicalName: formData.scientificTechnicalName,
      fertilizerOriginGroup: formData.fertilizerOriginGroup,
      nutritionalComponents: formData.nutritionalComponents,
      fertilizerType: formData.fertilizerType,
      physicalForm: formData.physicalForm,
      mainIngredients: formData.mainIngredients,
      moaGroup: formData.moaGroup,
      npkRatio: formData.npkRatio,

      indications: formData.indications,
      applicationStage: formData.applicationStage,
      targetCrops: formData.targetCrops,
      recommendedDosage: formData.recommendedDosage,
      applicationMethod: formData.applicationMethod,
      usageNotes: formData.usageNotes,

      toxicityInfo: formData.toxicityInfo,
      protectiveMeasures: formData.protectiveMeasures,
      firstAid: firstAidHtml,
      legalStatus: formData.legalStatus,
      standardsCompliance: formData.standardsCompliance,

      manufacturerOrigin: formData.manufacturerOrigin,
      importerRegistrant: formData.importerRegistrant,
      distributor: formData.distributor,
      referencePrice: formData.referencePrice,
      packagingSpecs: formData.packagingSpecs,

      status: "active" as const,
    };

    if (isEdit && params?.id) {
      updateFertilizer(Number(params.id), payload);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin phân bón",
      });
    } else {
      addFertilizer(payload);
      toast({
        title: "Thành công",
        description: "Đã thêm mới phân bón",
      });
    }
    setConfirmOpen(false);
    setLocation("/cultivation-material/fertilizer");
  };

  return {
    isEdit,
    formData,
    setFormData,
    updateField,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    setLocation,
  };
}
