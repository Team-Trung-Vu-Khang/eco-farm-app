import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useVarietyStore from "../../../stores/useVarietyStore";
import type { Variety } from "../types/types";

export function useVarietyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { varieties, deleteVariety } = useVarietyStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDelete = (item: Variety) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteVariety(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleView = (item: Variety) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  return {
    varieties,
    deleteOpen,
    setDeleteOpen,
    selectedId,
    detailOpen,
    setDetailOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit: (item: Variety) => setLocation(`/variety/${item.id}/edit`),
  };
}
