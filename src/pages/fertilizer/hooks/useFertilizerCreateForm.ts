import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
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

  const [formData, setFormData] = useState<FertilizerFormData>({
    code: "",
    name: "",
    nutritionalContentId: "",
    originId: "",
    applicationStageId: "",
    physicalFormId: "",
    nutrientContent: "",
    description: "",
    hashtags: [],
    supplierDetails: [],
    usage: "",
    documents: [],
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getFertilizerById(Number(params.id));
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          nutritionalContentId: item.nutritionalContentId,
          originId: item.originId,
          applicationStageId: item.applicationStageId,
          physicalFormId: item.physicalFormId,
          nutrientContent: item.nutrientContent,
          description: item.description,
          hashtags: ["HieuQuaCao", "TangTruongNhanh"], // Mock data
          supplierDetails: [
            {
              supplierId: "sup1",
              quantity: "100",
              unit: "Bao",
              packaging: "Bao 50kg",
            },
          ],
          usage: "Bón lót hoặc bón thúc. Liều lượng: 200-300kg/ha tùy loại cây trồng.", // Mock
          documents: [
            {
              name: "Tai_lieu_ky_thuat_PB001.pdf",
              size: 2400000, // bytes
            }
          ]
        });
      }
    }
  }, [isEdit, params?.id, getFertilizerById]);

  const updateField = (field: keyof FertilizerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmSubmit = () => {
    if (isEdit && params?.id) {
      updateFertilizer(Number(params.id), {
        code: formData.code,
        name: formData.name,
        nutritionalContentId: formData.nutritionalContentId,
        originId: formData.originId,
        applicationStageId: formData.applicationStageId,
        physicalFormId: formData.physicalFormId,
        nutrientContent: formData.nutrientContent,
        description: formData.description,
        status: "active",
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin phân bón",
      });
    } else {
      addFertilizer({
        code: formData.code,
        name: formData.name,
        nutritionalContentId: formData.nutritionalContentId,
        originId: formData.originId,
        applicationStageId: formData.applicationStageId,
        physicalFormId: formData.physicalFormId,
        nutrientContent: formData.nutrientContent,
        description: formData.description,
        status: "active",
      });
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
