import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

import useCropStore from "../../../stores/useCropStore";
import { initialEditorValue } from "../data/mocks";
import type { CreateCropForm, GrowthCycleDetail } from "../types/types";

export function useCropForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCrop } = useCropStore();

  const [formData, setFormData] = useState<CreateCropForm>({
    code: "TREE-" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    cropGroup: "",
    cropType: "",
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
    const reader = new FileReader();
    reader.onloadend = () => {
      setIllustrationPreview(reader.result as string);
    };
    reader.readAsDataURL(formData.illustration);
  }, [formData.illustration]);

  const handleUpdateField = (field: keyof CreateCropForm, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "cropGroup") {
        newData.cropType = "";
        newData.variety = "";
      } else if (field === "cropType") {
        newData.variety = "";
      }
      return newData;
    });
  };

  const handleUpdateTechnicalSpecs = (updates: Partial<typeof formData.technicalSpecs>) => {
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

  const handleUpdateDocs = (docKey: "farmingTechnique" | "qualityStandard", updates: any) => {
    setFormData((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        [docKey]: { ...prev.docs[docKey], ...updates },
      },
    }));
  };

  const handleComplete = () => {
    const illustrationUrl = formData.illustration
      ? URL.createObjectURL(formData.illustration)
      : null;

    addCrop({
      code: formData.code,
      name: formData.name,
      cropType: formData.cropType,
      cropGroup: formData.cropGroup,
      harvestMethod: formData.harvestMethod,
      illustration: illustrationUrl,
      technicalSpecs: formData.technicalSpecs,
    });

    toast({
      title: "Thành công",
      description: `Đã tạo cây trồng "${formData.name}"`,
    });
    setLocation("/crop");
  };

  const handleCancel = () => setLocation("/crop");

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
