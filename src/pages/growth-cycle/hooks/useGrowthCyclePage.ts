import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import {
  useUserGrowthCycleTemplates,
  useUserGrowthCycleTemplateMutations,
  useProductionSubjects,
  useProductionSubjectVariants,
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
  const { items: cropsList } = useProductionSubjects({
    params: {
      domainCode: "CROP",
      page: 0,
      size: 100,
      status: "active",
    },
  });

  // Fetch active crop varieties for naming resolution
  const { items: varietiesList } = useProductionSubjectVariants({
    params: {
      domainCode: "CROP",
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

  // Fetch from User/Combined Seasons API (/api/farm/seasons)
  const {
    items: apiSeasons,
    response: apiResponse,
    loading,
    error: apiError,
  } = useUserGrowthCycleTemplates({
    params: {
      domainCode: "CROP",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      cropId: cropId === "all" ? undefined : Number(cropId),
      subjectId: cropId === "all" ? undefined : Number(cropId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deleteTemplate } = useUserGrowthCycleTemplateMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map from API response to GrowthCycle UI model
  const growthCycles: GrowthCycle[] = useMemo(() => {
    return apiSeasons.map((item) => {
      const isFoundation = item.source === "MASTER";
      const cropIdVal = item.productionSubject?.id;
      const cropNameVal = item.productionSubject?.name;
      const varietyIdVal = item.productionSubjectVariant?.id;
      const varietyNameVal = item.productionSubjectVariant?.name;
      const scope =
        item.scopeType === "SUBJECT_GROUP"
          ? "group"
          : item.scopeType === "SUBJECT_VARIANT" || varietyIdVal
            ? "variety"
            : "crop";
      const scopeNames =
        scope === "group"
          ? (item.productionSubjectGroups || []).map((subject: any) => subject.name).filter(Boolean)
          : scope === "variety"
            ? (item.productionSubjectVariants || [item.productionSubjectVariant]).filter(Boolean).map((subject: any) => subject.name).filter(Boolean)
            : (item.productionSubjects || [item.productionSubject]).filter(Boolean).map((subject: any) => subject.name).filter(Boolean);
      const expectedDaysVal = item.stages?.reduce((sum: number, s: any) => sum + (s.durationDays || 0), 0) ?? 0;

      return {
        id: (isFoundation ? "foundation-" : "user-") + item.id,
        name: item.name,
        cycleType: item.metadataJson?.cycleType || "plant",
        scope,
        scopeNames,
        cropId: cropIdVal ? String(cropIdVal) : "",
        cropName: cropNameVal || "",
        variety: varietyNameVal || "",
        totalDays: expectedDaysVal,
        numStages: item.stages?.length || 0,
        stages:
          item.stages?.map((s: any) => ({
            id: String(s.id),
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
  }, [apiSeasons]);

  // Construct query metadata for DataTable component from API response
  const response = useMemo(() => {
    if (!apiResponse) return null;
    return {
      totalElements: apiResponse.totalElements,
      totalPages: apiResponse.totalPages,
      page: currentIndex,
      size: pageSize,
      content: growthCycles,
      first: apiResponse.first,
      last: apiResponse.last,
    };
  }, [apiResponse, currentIndex, pageSize, growthCycles]);

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
    growthCycles,
    loading,
    error,
    refetch: () => {}, // Invalidation invalidates cache automatically
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
    handleDelete,
    handleConfirmDelete,
    filters,
    handleFilterChange,
  };
}
