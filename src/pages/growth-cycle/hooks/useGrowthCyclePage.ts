import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import {
  useGrowthCycleTemplateMutations,
  useGrowthCycleTemplates,
  useCrops,
} from "../../../features/foundation";
import type { GrowthCycle } from "../types/types";
import { formatDaysToDuration } from "../utils/duration";
import { useMemo } from "react";

export function useGrowthCyclePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [cropId, setCropId] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    } else if (key === "crop") {
      setCropId(value);
      setCurrentIndex(1);
    }
  };

  // Fetch active crops for filtering
  const { items: cropsList } = useCrops({
    params: {
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const filters = useMemo(() => {
    return [
      {
        key: "crop",
        label: "Cây trồng",
        options: cropsList.map((c) => ({
          label: c.name,
          value: String(c.id),
        })),
      },
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Ngừng hoạt động", value: "inactive" },
          { label: "Đã lưu trữ", value: "archived" },
        ],
      },
    ];
  }, [cropsList]);

  const [, setLocation] = useLocation();

  const {
    items: apiItems,
    response,
    loading,
    error,
    refetch,
  } = useGrowthCycleTemplates({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      cropId: cropId === "all" ? undefined : Number(cropId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { deleteTemplate } = useGrowthCycleTemplateMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map from API response to GrowthCycle UI model
  const growthCycles: GrowthCycle[] = apiItems.map((item) => {
    const metadata = (item.metadataJson || {}) as Record<string, unknown>;
    const cycleType = String(metadata.cycleType || "plant");
    if (cycleType !== "plant") return null;

    return {
      id: String(item.id),
      name: item.name,
      cycleType: "plant",
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
  }).filter((item): item is GrowthCycle => item !== null);

  const handleView = (item: GrowthCycle) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  const handleEdit = (item: GrowthCycle) => {
    setLocation(`/growth-cycle/${item.id}/edit`);
  };

  const handleWorkflow = (item: GrowthCycle) => {
    setLocation(`/growth-cycle/${item.id}/workflow`);
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
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    detailOpen,
    setDetailOpen,
    selectedId,
    handleView,
    deleteOpen,
    setDeleteOpen,
    handleEdit,
    handleWorkflow,
    handleDelete,
    handleConfirmDelete,
    filters,
    handleFilterChange,
  };
}
