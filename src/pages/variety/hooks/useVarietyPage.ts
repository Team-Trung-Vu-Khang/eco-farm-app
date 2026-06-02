import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useVarietyStore from "../../../stores/useVarietyStore";
import type { Variety } from "../types/types";

export function useVarietyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { varieties, deleteVariety, getVarietyById } = useVarietyStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const selectedVariety = selectedId ? getVarietyById(selectedId) : null;

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

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);

    if (!open) {
      setSelectedId(null);
    }
  };

  return {
    varieties,
    deleteOpen,
    setDeleteOpen,
    selectedId,
    selectedVariety,
    detailOpen,
    setDetailOpen: handleDetailOpenChange,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit: (item: Variety) => setLocation(`/variety/${item.id}/edit`),
  };
}
