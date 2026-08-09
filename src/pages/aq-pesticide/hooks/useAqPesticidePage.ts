import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePesticideStore from "../../../stores/usePesticideStore";
import type { Pesticide } from "../../pesticide/types";

export function useAqPesticidePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const pesticides = usePesticideStore((state) => state.pesticides);
  const deletePesticide = usePesticideStore((state) => state.deletePesticide);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Pesticide | null>(null);

  const handleAdd = () => {
    setLocation("/aquaculture-material/pesticide/create");
  };

  const handleEdit = (item: Pesticide) => {
    setLocation(`/aquaculture-material/pesticide/${item.id}/edit`);
  };

  const handleDelete = (item: Pesticide) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: Pesticide) => {
    setLocation(`/aquaculture-material/pesticide/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePesticide(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa thuốc" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    pesticides,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
    handleConfirmDelete,
    navigateToDetail: (id: number) =>
      setLocation(`/aquaculture-material/pesticide/${id}`),
  };
}
