import { useState, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CreateDocsForm } from "../types";

export function useCreateDocsForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateDocsForm>({
    id: "TL001",
    season: [],
    keywords: [],
    scope: "crop",
    cropId: "",
    variety: "",
    crop: "Sầu riêng",
    quickSummary: "",
    specifications: [
      { specName: "Mật độ trồng", specValue: "6 x 6 m (≈278 cây/ha)" },
      { specName: "Độ pH đất", specValue: "5.5 – 6.5" },
      { specName: "Nước tưới", specValue: "3–5 lít/gốc/ngày (tuỳ thời tiết)" },
      { specName: "Phủ gốc", specValue: "Rơm khô/compost 5–10 cm" },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    applyLevel: undefined,
  });

  const handleComplete = () => {
    console.log(formData);
    toast({
      title: "Thành công",
      description: `Đã tạo tài liệu "${formData.id}"`,
    });
    setLocation("/docs");
  };

  const handleChangeValue =
    (key: keyof typeof formData) =>
    (e: ChangeEvent<HTMLInputElement> | Array<string>) =>
      setFormData((prev) => ({
        ...prev,
        [key]: Array.isArray(e) ? e : e.target.value,
      }));

  const onAddSpecs = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...(prev?.specifications ?? []),
        { specName: "", specValue: "" },
      ],
    }));
  };

  const onAddAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachments: [
        ...(prev?.attachments ?? []),
        { attachmentName: "", attachmentValue: "" },
      ],
    }));
  };

  return {
    formData,
    setFormData,
    handleChangeValue,
    onAddSpecs,
    onAddAttachment,
    handleComplete,
    setLocation,
  };
}
