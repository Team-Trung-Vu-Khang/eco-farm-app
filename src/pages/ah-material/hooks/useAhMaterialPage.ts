import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useMaterialStore from "../../../stores/useMaterialStore";
import type { Material } from "../../material/types/types";

export function useAhMaterialPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const materials = useMaterialStore((state) => state.materials);
  const deleteMaterial = useMaterialStore((state) => state.deleteMaterial);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Material | null>(null);

  const handleAdd = () => {
    setLocation("/animal-husbandry-material/material/create");
  };

  const handleEdit = (item: Material) => {
    setLocation(`/animal-husbandry-material/material/${item.id}/edit`);
  };

  const handleView = (item: Material) => {
    toast({ title: "Xem chi tiết", description: item.name });
  };

  const handleDelete = (item: Material) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteMaterial(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa vật tư" });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    materials,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
    navigateToDetail: (id: number) =>
      setLocation(`/animal-husbandry-material/material/${id}`),
  };
}
