import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

import useCropFoundationStore from "@/stores/useCropFoundationStore";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { initialEditorValue } from "../data/mocks";
import type {
  CreateCropFoundationForm,
  GrowthCycleDetail,
} from "../types/types";

export function useCropFoundationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCropFoundation } = useCropFoundationStore();

  const [formData, setFormData] = useState<CreateCropFoundationForm>({
    code: "TREE-" + Math.floor(1000 + Math.random() * 9000),
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
    growthCycles: [
      {
        id: "1",
        name: "Kiến thiết cơ bản",
        stages: ["Gieo hạt", "Cây con"],
        estimatedDays: "10",
      },
    ],
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
  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(
    null,
  );

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

  const handleRemoveGrowthCycle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateGrowthCycle = (
    id: string,
    updates: Partial<GrowthCycleDetail>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      growthCycles: prev.growthCycles.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
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
    const illustrationUrl = formData.illustration
      ? URL.createObjectURL(formData.illustration)
      : null;

    // Convert doc contents to HTML string if they are editor state
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

    addCropFoundation({
      code: formData.code,
      name: formData.name,
      cropFoundationType: formData.cropFoundationType,
      cropFoundationGroup: formData.cropFoundationGroup,
      harvestMethod: formData.harvestMethod,
      illustration: illustrationUrl,
      technicalSpecs: formData.technicalSpecs,
      // @ts-ignore - Assuming docs will be supported in the model
      docs: finalDocs,
    });

    toast({
      title: "Thành công",
      description: `Đã tạo cây trồng "${formData.name}"`,
    });
    setLocation("/crop-foundation");
  };

  const handleCancel = () => setLocation("/crop-foundation");

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
