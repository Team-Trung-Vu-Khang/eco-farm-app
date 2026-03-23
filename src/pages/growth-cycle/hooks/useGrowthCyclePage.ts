import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "../../../stores/useGrowthCycleStore";
import type { GrowthCycle } from "../types/types";

export function useGrowthCyclePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { growthCycles, deleteGrowthCycle } = useGrowthCycleStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleView = (item: GrowthCycle) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  const handleEdit = (item: GrowthCycle) => {
    setLocation(`/growth-cycle/${item.id}/edit`);
  };

  const handleDelete = (item: GrowthCycle) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteGrowthCycle(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa chu kỳ sinh trưởng" });
    }
    setDeleteOpen(false);
  };

  return {
    growthCycles,
    detailOpen,
    setDetailOpen,
    selectedId,
    handleView,
    deleteOpen,
    setDeleteOpen,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  };
}
