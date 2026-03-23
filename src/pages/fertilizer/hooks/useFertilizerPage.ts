import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import useFertilizerStore from "../../../stores/useFertilizerStore";
import type { Fertilizer } from "../data/constants";

export function useFertilizerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const fertilizers = useFertilizerStore((state) => state.fertilizers);
  const deleteFertilizer = useFertilizerStore(
    (state) => state.deleteFertilizer,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Fertilizer | null>(null);

  const handleAdd = () => {
    setLocation("/fertilizer/create");
  };

  const handleView = (item: Fertilizer) => {
    setLocation(`/fertilizer/${item.id}`);
  };

  const handleEdit = (item: Fertilizer) => {
    setLocation(`/fertilizer/${item.id}/edit`);
  };

  const handleDelete = (item: Fertilizer) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteFertilizer(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa phân bón" });
    }
    setDeleteOpen(false);
  };

  return {
    fertilizers,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  };
}
