import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "../../../stores/useGrowthCycleStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import { CROP_OPTIONS } from "../../../constants/crops";
import type { CreateGrowthCycleForm, GrowthStage } from "../types/types";
import { initialEditorValue } from "../data/mocks";

export function useCreateGrowthCycleForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addGrowthCycle } = useGrowthCycleStore();
  const { varieties } = useVarietyStore();

  const [formData, setFormData] = useState<CreateGrowthCycleForm>({
    scope: "crop",
    cropId: "",
    variety: "",
    totalDays: 0,
    stages: [
      {
        id: "1",
        name: "Giai đoạn 1",
        duration: 0,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
  });

  const totalDays = useMemo(
    () =>
      formData.stages.reduce(
        (sum, stage) => sum + (Number(stage.duration) || 0),
        0,
      ),
    [formData.stages],
  );

  // Filtered varieties based on selected crop
  const filteredVarieties = useMemo(() => {
    if (!formData.cropId) return [];
    return varieties.filter((v) => v.crop === formData.cropId);
  }, [formData.cropId, varieties]);

  const handleComplete = () => {
    const cropName =
      CROP_OPTIONS.find((c) => c.name === formData.cropId)?.name ||
      formData.cropId;

    const varietyName =
      varieties.find((v) => v.id === formData.variety)?.varietyName ||
      formData.variety;

    addGrowthCycle({
      name: `Chu kỳ sinh trưởng ${cropName}${varietyName ? ` - ${varietyName}` : ""}`,
      scope: formData.scope,
      cropId: formData.cropId,
      cropName: cropName,
      variety: formData.variety,
      totalDays,
      stages: formData.stages.map((s) => ({
        ...s,
        pdfFile:
          s.pdfFile instanceof File
            ? { name: s.pdfFile.name, size: s.pdfFile.size }
            : s.pdfFile,
      })),
    });

    toast({
      title: "Thành công",
      description: "Đã tạo chu kỳ sinh trưởng mới",
    });
    setLocation("/growth-cycle");
  };

  const onAddStage = () => {
    const nextId = (formData.stages.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: nextId,
          name: `Giai đoạn ${nextId}`,
          duration: 0,
          usePdf: false,
          content: initialEditorValue,
        },
      ],
    }));
  };

  const onRemoveStage = (id: string) => {
    if (formData.stages.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }));
  };

  const updateStage = (id: string, updates: Partial<GrowthStage>) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const updateField = <K extends keyof CreateGrowthCycleForm>(
    field: K,
    value: CreateGrowthCycleForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    updateField,
    totalDays,
    filteredVarieties,
    varieties,
    handleComplete,
    onAddStage,
    onRemoveStage,
    updateStage,
    setLocation,
  };
}
