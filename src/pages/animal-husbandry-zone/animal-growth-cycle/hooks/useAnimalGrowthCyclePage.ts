import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import {
  useLifecycleTemplateMutations,
  useLifecycleTemplates,
  useCrops,
  useCropVarieties,
} from "../../../../features/foundation";
import type { AnimalGrowthCycle } from "../types/types";
import { formatDaysToDuration } from "../utils/duration";
import { useMemo } from "react";

export function useAnimalGrowthCyclePage() {
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

  const { items: varietiesList } = useCropVarieties({
    params: {
      page: 0,
      size: 100,
    },
  });

  const filters = useMemo(() => {
    return [
      {
        key: "crop",
        label: "Vật nuôi",
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
  } = useLifecycleTemplates({
    params: {
      domainCode: "LIVESTOCK",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      subjectId: cropId === "all" ? undefined : Number(cropId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { deleteTemplate } = useLifecycleTemplateMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AnimalGrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map from API response to AnimalGrowthCycle UI model
  const animalGrowthCycles: AnimalGrowthCycle[] = apiItems.map((item) => {
    const metadata = (item.metadataJson || {}) as Record<string, unknown>;
    const cycleType = String(metadata.cycleType || "animal") as
      | "animal"
      | "animal";

    const matchedCrop = cropsList.find(
      (c) => String(c.id) === String(item.subjectId),
    );
    const matchedVariety = varietiesList.find(
      (v) => String(v.id) === String(item.subjectVariantId),
    );

    return {
      id: String(item.id),
      name: item.name,
      cycleType: cycleType,
      scope: item.subjectVariantId ? "variety" : "crop",
      cropId: String(item.subjectId || ""),
      cropName: matchedCrop?.name || "",
      variety: matchedVariety?.name,
      totalDays: item.expectedDays || 0,
      numStages: item.stages?.length || 0,
      stages:
        item.stages?.map((s, idx) => ({
          id: String(s.id || idx),
          name: s.name,
          duration: formatDaysToDuration(s.durationDays || 0),
          usePdf: false,
          content: s.description || "",
        })) || [],
      createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
    };
  });

  const handleView = (item: AnimalGrowthCycle) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  const handleEdit = (item: AnimalGrowthCycle) => {
    setLocation(`/animal-growth-cycle/${item.id}/edit`);
  };

  const handleWorkflow = (item: AnimalGrowthCycle) => {
    setLocation(`/animal-growth-cycle/${item.id}/workflow`);
  };

  const handleDelete = (item: AnimalGrowthCycle) => {
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
    animalGrowthCycles,
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
