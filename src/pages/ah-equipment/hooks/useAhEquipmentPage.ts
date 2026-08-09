import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import type { Equipment } from "../../equipment/data/constants";

export function useAhEquipmentPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const equipments = useEquipmentStore((state) => state.equipments);
  const deleteEquipment = useEquipmentStore((state) => state.deleteEquipment);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Equipment | null>(null);

  const handleAdd = () => {
    setLocation("/animal-husbandry-material/equipment/create");
  };

  const handleEdit = (item: Equipment) => {
    setLocation(`/animal-husbandry-material/equipment/${item.id}/edit`);
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
    setLocation(`/animal-husbandry-material/equipment/${id}`);
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
