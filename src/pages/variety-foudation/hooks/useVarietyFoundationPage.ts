import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useVarietyFoundationStore from "../../../stores/useVarietyFoundationStore";
import type { VarietyFoundation } from "../types/types";

export function useVarietyFoundationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { varieties, deleteVarietyFoundation, getVarietyFoundationById } = useVarietyFoundationStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<VarietyFoundation | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const selectedVarietyFoundation = selectedId ? getVarietyFoundationById(selectedId) : null;

  const handleDelete = (item: VarietyFoundation) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteVarietyFoundation(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng (nền tảng)" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleView = (item: VarietyFoundation) => {
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
    selectedVarietyFoundation,
    detailOpen,
    setDetailOpen: handleDetailOpenChange,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit: (item: VarietyFoundation) => setLocation(`/variety-foudation/${item.id}/edit`),
  };
}
