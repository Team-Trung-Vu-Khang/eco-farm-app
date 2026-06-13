import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";

import useCropFoundationStore from "@/stores/useCropFoundationStore";
import type { CropFoundation } from "../types/types";

export function useCropFoundationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { cropFoundations, deleteCropFoundation } = useCropFoundationStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CropFoundation | null>(null);

  const handleDelete = (item: CropFoundation) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: CropFoundation) => {
    setLocation(`/crop-foundation/${item.id}`);
  };

  const handleEdit = (item: CropFoundation) => {
    setLocation(`/crop-foundation/${item.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCropFoundation(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    cropFoundations,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
  };
}
