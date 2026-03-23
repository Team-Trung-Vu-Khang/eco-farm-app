import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import useFertilizerStore from "../../../stores/useFertilizerStore";
import type { FertilizerFormData } from "../types/types";

export function useFertilizerCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/fertilizer/:id/edit");
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
    type: "",
    nutrientContent: "",
    description: "",
    hashtags: [],
    supplierDetails: [],
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
          type: item.type,
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
        type: formData.type,
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
        type: formData.type,
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
    setLocation("/fertilizer");
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
