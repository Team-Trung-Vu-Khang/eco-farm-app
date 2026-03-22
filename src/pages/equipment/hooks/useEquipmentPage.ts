import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import type { Equipment } from "../data/constants";

export function useEquipmentPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const equipments = useEquipmentStore((state) => state.equipments);
  const deleteEquipment = useEquipmentStore((state) => state.deleteEquipment);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Equipment | null>(null);

  const handleAdd = () => {
    setLocation("/equipment/create");
  };

  const handleEdit = (item: Equipment) => {
    setLocation(`/equipment/${item.id}/edit`);
  };

  const handleDelete = (item: Equipment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: Equipment) => {
    toast({ title: "Xem chi tiết", description: item.name });
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteEquipment(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa thiết bị" });
    }
    setDeleteOpen(false);
  };

  const navigateToDetail = (id: number) => {
    setLocation(`/equipment/${id}`);
  };

  return {
    equipments,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleConfirmDelete,
    navigateToDetail,
  };
}
