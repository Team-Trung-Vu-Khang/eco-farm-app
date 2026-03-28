import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MAX_IMAGE_SIZE } from "../data/createTreatment.constants";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";

const initialFormData: CreateTreatmentFormData = {
  id: "PD-AUTO-001",
  name: "",
  crop: "",
  growthStage: "",
  diseaseType: "",
  description: "",
  tags: [],
  illustration: null,
  steps: [{ id: "1", day: "", title: "", type: "", description: "" }],
  materials: [{ id: "1", name: "", dosage: "" }],
  phi: "7 ngày",
  safetyNotes: "",
  estimatedCost: "",
};

export function useCreateTreatmentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateTreatmentFormData>(
    initialFormData,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const illustrationPreview = useMemo(
    () =>
      formData.illustration ? URL.createObjectURL(formData.illustration) : "",
    [formData.illustration],
  );

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng chọn file ảnh.",
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Ảnh quá lớn", description: "Tối đa 5MB." });
      return;
    }
    setFormData((prev) => ({ ...prev, illustration: file }));
  };

  const onDropIllustration = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    onPickIllustration(file);
  };

  useEffect(() => {
    return () => {
      if (illustrationPreview) {
        URL.revokeObjectURL(illustrationPreview);
      }
    };
  }, [illustrationPreview]);

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo phác đồ "${formData.name}"`,
    });
    setLocation("/treatment");
  };

  const onAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: (prev.steps.length + 1).toString(),
          day: "",
          title: "",
          type: "",
          description: "",
        },
      ],
    }));
  };

  const onRemoveStep = (id: string) => {
    if (formData.steps.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== id),
    }));
  };

  const onAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        { id: (prev.materials.length + 1).toString(), name: "", dosage: "" },
      ],
    }));
  };

  const onRemoveMaterial = (id: string) => {
    if (formData.materials.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((material) => material.id !== id),
    }));
  };

  return {
    formData,
    setFormData,
    illustrationPreview,
    fileInputRef,
    onPickIllustration,
    onDropIllustration,
    handleComplete,
    onAddStep,
    onRemoveStep,
    onAddMaterial,
    onRemoveMaterial,
    goBack: () => setLocation("/treatment"),
  };
}
