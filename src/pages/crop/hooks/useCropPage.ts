import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";

import useCropStore from "../../../stores/useCropStore";
import type { Crop } from "../types/types";

export function useCropPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { crops, deleteCrop } = useCropStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Crop | null>(null);

  const handleDelete = (item: Crop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: Crop) => {
    setLocation(`/crop/${item.id}`);
  };

  const handleEdit = (item: Crop) => {
    setLocation(`/crop/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCrop(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    crops,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
  };
}
