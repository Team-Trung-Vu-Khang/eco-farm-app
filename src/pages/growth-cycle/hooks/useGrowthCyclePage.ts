import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  useGrowthCycleTemplateMutations,
  useGrowthCycleTemplates,
} from "../../../features/foundation";
import type { GrowthCycle } from "../types/types";
import { formatDaysToDuration } from "../utils/duration";

export function useGrowthCyclePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    items: apiItems,
    loading,
    error,
    refetch,
  } = useGrowthCycleTemplates();
  const { deleteTemplate } = useGrowthCycleTemplateMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map from API response to GrowthCycle UI model
  const growthCycles: GrowthCycle[] = apiItems.map((item) => {
    const metadata = (item.metadataJson || {}) as Record<string, unknown>;
    const cycleType = String(metadata.cycleType || "plant") as
      | "plant"
      | "animal";

    return {
      id: String(item.id),
      name: item.name,
      cycleType: cycleType,
      scope: item.cropVarietyId ? "variety" : "crop",
      cropId: String(item.cropId),
      cropName: item.cropName || "",
      variety: item.cropVarietyName,
      totalDays: item.expectedDays || 0,
      numStages: item.stages?.length || 0,
      stages:
        item.stages?.map((s) => ({
          id: String(s.id),
          name: s.name,
          duration: formatDaysToDuration(s.durationDays || 0),
          usePdf: false,
          content: s.description || "",
        })) || [],
      createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
    };
  });

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
      deleteTemplate.mutate(Number(deleteItem.id), {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đã xóa chu kỳ sinh trưởng",
          });
          setDeleteOpen(false);
        },
        onError: (err: unknown) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err instanceof Error ? err.message : "Không thể xoá",
          });
        },
      });
    } else {
      setDeleteOpen(false);
    }
  };

  return {
    growthCycles,
    loading,
    error,
    refetch,
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
