import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import {
  useUserGrowthCycleTemplates,
  useUserGrowthCycleTemplateMutations,
  useProductionSubjects,
  useProductionSubjectVariants,
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

  // Fetch active crops/animals for filtering
  const { items: cropsList } = useProductionSubjects({
    params: {
      domainCode: "LIVESTOCK",
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const { items: varietiesList } = useProductionSubjectVariants({
    params: {
      domainCode: "LIVESTOCK",
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

  // Fetch from Seasons API (/api/farm/seasons) with domainCode LIVESTOCK
  const {
    items: apiItems,
    response: apiResponse,
    loading,
    error: apiError,
  } = useUserGrowthCycleTemplates({
    params: {
      domainCode: "LIVESTOCK",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      cropId: cropId === "all" ? undefined : Number(cropId),
      subjectId: cropId === "all" ? undefined : Number(cropId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deleteTemplate } = useUserGrowthCycleTemplateMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AnimalGrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map from API response to AnimalGrowthCycle UI model
  const animalGrowthCycles: AnimalGrowthCycle[] = useMemo(() => {
    return apiItems.map((item) => {
      const isFoundation = item.source === "MASTER";
      const cropIdVal = item.productionSubject?.id;
      const cropNameVal = item.productionSubject?.name;
      const varietyItems = item.productionSubjectVariants || [];
      const varietyIdVal = item.productionSubjectVariant?.id || varietyItems[0]?.id;
      const varietyNameVal = item.productionSubjectVariant?.name || varietyItems[0]?.name;
      const groupIds = (item.productionSubjectGroups || []).map((group: any) => group.id).filter((id: any) => id != null).concat(item.productionSubjectGroupIds || []);
      const subjectIds = (item.productionSubjectIds || []).map((id: any) => Number(id));
      const subjectVariantIds = (item.productionSubjectVariantIds || []).map((id: any) => Number(id));
      const expectedDaysVal = item.stages?.reduce((sum: number, s: any) => sum + (s.durationDays || 0), 0) ?? 0;

      return {
        id: (isFoundation ? "foundation-" : "user-") + item.id,
        name: item.name,
        cycleType: item.metadataJson?.cycleType || "animal",
        scope: groupIds.length > 0 ? "group" : varietyIdVal || varietyItems.length > 0 || subjectVariantIds.length > 0 ? "variety" : "crop",
        cropId: cropIdVal ? String(cropIdVal) : "",
        cropName: cropNameVal || "",
        variety: varietyNameVal || "",
        totalDays: expectedDaysVal,
        numStages: item.stages?.length || 0,
        stages:
          item.stages?.map((s: any, idx: number) => ({
            id: String(s.id || idx),
            name: s.name,
            duration: formatDaysToDuration(s.durationDays || 0),
            usePdf: false,
            content: s.description || "",
          })) || [],
        createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
        updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
        isFoundation,
      };
    });
  }, [apiItems]);

  const response = useMemo(() => {
    if (!apiResponse) return null;
    return {
      totalElements: apiResponse.totalElements,
      totalPages: apiResponse.totalPages,
      page: currentIndex,
      size: pageSize,
      content: animalGrowthCycles,
      first: apiResponse.first,
      last: apiResponse.last,
    };
  }, [apiResponse, currentIndex, pageSize, animalGrowthCycles]);

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
      const numericId = Number(
        deleteItem.id.replace(/^(foundation-|user-)/, ""),
      );
      deleteTemplate.mutate(numericId, {
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

  const error = apiError?.message ?? null;

  return {
    animalGrowthCycles,
    loading,
    error,
    refetch: () => {},
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
