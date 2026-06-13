import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

import useCropFoundationStore from "@/stores/useCropFoundationStore";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { initialEditorValue } from "../data/mocks";
import type {
  CreateCropFoundationForm,
  GrowthCycleDetail,
} from "../types/types";

export function useCropFoundationEditForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getCropFoundationById, updateCropFoundation } = useCropFoundationStore();

  const [formData, setFormData] = useState<CreateCropFoundationForm>({
    code: "",
    name: "",
    cropFoundationGroup: "",
    cropFoundationType: "",
    variety: "",
    illustration: null,
    description: "",
    selectedSeedIds: [],
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "",
      family: "",
      origin: "",
      tempRange: "",
      humidityRange: "",
      phRange: "",
      plantingDensity: "",
      watering: "",
    },
    growthCycles: [],
    docs: {
      farmingTechnique: {
        type: "editor",
        content: initialEditorValue,
        file: null,
      },
      qualityStandard: {
        type: "editor",
        content: initialEditorValue,
        file: null,
      },
    },
  });

  const [seedSearch, setSeedSearch] = useState("");
  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(null);

  // Initialize form data from store
  useEffect(() => {
    if (!id) return;
    const cropFoundationId = parseInt(id, 10);
    const existingData = getCropFoundationById(cropFoundationId);

    if (existingData) {
      setFormData({
        code: existingData.code || "",
        name: existingData.name || "",
        cropFoundationGroup: existingData.cropFoundationGroup || "",
        cropFoundationType: existingData.cropFoundationType || "",
        variety: "",
        illustration: existingData.illustration || null,
        description: "",
        selectedSeedIds: [],
        harvestMethod: existingData.harvestMethod || "manual",
        technicalSpecs: existingData.technicalSpecs || {
          scientificName: "",
          family: "",
          origin: "",
          tempRange: "",
          humidityRange: "",
          phRange: "",
          plantingDensity: "",
          watering: "",
        },
        growthCycles: [],
        docs: existingData.docs || {
          farmingTechnique: { type: "editor", content: initialEditorValue, file: null },
          qualityStandard: { type: "editor", content: initialEditorValue, file: null },
        },
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin cây trồng",
        variant: "destructive",
      });
      setLocation("/crop-foundation");
    }
  }, [id, getCropFoundationById, setLocation, toast]);

  useEffect(() => {
    if (!formData.illustration) {
      setIllustrationPreview(null);
      return;
    }

    if (typeof formData.illustration === "string") {
      setIllustrationPreview(formData.illustration);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIllustrationPreview(reader.result as string);
    };
    reader.readAsDataURL(formData.illustration as File);
  }, [formData.illustration]);

  const handleUpdateField = (
    field: keyof CreateCropFoundationForm,
    value: any,
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "cropFoundationGroup") {
        newData.cropFoundationType = "";
        newData.variety = "";
      } else if (field === "cropFoundationType") {
        newData.variety = "";
      }
      return newData;
    });
  };

  const handleUpdateTechnicalSpecs = (
    updates: Partial<typeof formData.technicalSpecs>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: { ...prev.technicalSpecs, ...updates },
    }));
  };

  const handleAddGrowthCycle = () => {
    const newId = (formData.growthCycles.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      growthCycles: [
        ...prev.growthCycles,
        { id: newId, name: "", stages: [], estimatedDays: "" },
      ],
    }));
  };

  const handleRemoveGrowthCycle = (cycleId: string) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.filter((c) => c.id !== cycleId),
    }));
  };

  const handleUpdateGrowthCycle = (
    cycleId: string,
    updates: Partial<GrowthCycleDetail>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.map((c) =>
        c.id === cycleId ? { ...c, ...updates } : c,
      ),
    }));
  };

  const handleUpdateDocs = (
    docKey: "farmingTechnique" | "qualityStandard",
    updates: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        [docKey]: { ...prev.docs[docKey], ...updates },
      },
    }));
  };

  const handleComplete = async () => {
    if (!id) return;
    
    // If it's a new file, create object URL. If string, keep it.
    let illustrationUrl = formData.illustration as string | null;
    if (formData.illustration instanceof File) {
      illustrationUrl = URL.createObjectURL(formData.illustration);
    }

    const processDocContent = async (doc: any) => {
      if (doc.type === "editor" && typeof doc.content !== "string") {
        return await safeConvertLexicalToHtml(doc.content);
      }
      return doc.content;
    };

    const finalFarmingTechniqueContent = await processDocContent(
      formData.docs.farmingTechnique,
    );
    const finalQualityStandardContent = await processDocContent(
      formData.docs.qualityStandard,
    );

    const finalDocs = {
      farmingTechnique: {
        ...formData.docs.farmingTechnique,
        content: finalFarmingTechniqueContent,
      },
      qualityStandard: {
        ...formData.docs.qualityStandard,
        content: finalQualityStandardContent,
      },
    };

    updateCropFoundation(parseInt(id, 10), {
      code: formData.code,
      name: formData.name,
      cropFoundationType: formData.cropFoundationType,
      cropFoundationGroup: formData.cropFoundationGroup,
      harvestMethod: formData.harvestMethod,
      illustration: illustrationUrl,
      technicalSpecs: formData.technicalSpecs,
      // @ts-ignore
      docs: finalDocs,
    });

    toast({
      title: "Thành công",
      description: `Đã cập nhật cây trồng "${formData.name}"`,
    });
    setLocation(`/crop-foundation/${id}`);
  };

  const handleCancel = () => setLocation(id ? `/crop-foundation/${id}` : "/crop-foundation");

  return {
    formData,
    seedSearch,
    setSeedSearch,
    illustrationPreview,
    fileInputRef,
    handleUpdateField,
    handleUpdateTechnicalSpecs,
    handleAddGrowthCycle,
    handleRemoveGrowthCycle,
    handleUpdateGrowthCycle,
    handleUpdateDocs,
    handleComplete,
    handleCancel,
  };
}
