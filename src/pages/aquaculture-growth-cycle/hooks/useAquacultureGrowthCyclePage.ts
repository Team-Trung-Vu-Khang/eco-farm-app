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
import type { GrowthCycle } from "../../growth-cycle/types/types";
import { formatDaysToDuration } from "../../growth-cycle/utils/duration";
import { useMemo } from "react";

export function useAquacultureGrowthCyclePage() {
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
      domainCode: "AQUACULTURE",
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const { items: varietiesList } = useProductionSubjectVariants({
    params: {
      domainCode: "AQUACULTURE",
      page: 0,
      size: 100,
    },
  });

  const filters = useMemo(() => {
    return [
      {
        key: "crop",
        label: "Thủy sản",
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
      domainCode: "AQUACULTURE",
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
      const groupItems = item.productionSubjectGroups || (item.productionSubjectGroupIds || []).map((id: any) => ({ id }));
      const cropItems = item.productionSubjects || (item.productionSubjectIds || []).map((id: any) => ({ id }));
      const varietyItems = item.productionSubjectVariants || (item.productionSubjectVariantIds || []).map((id: any) => ({ id }));
      const expectedDaysVal = item.stages?.reduce((sum: number, s: any) => sum + (s.durationDays || 0), 0) ?? 0;

      return {
        id: (isFoundation ? "foundation-" : "user-") + item.id,
        name: item.name,
        cycleType: item.metadataJson?.cycleType || "aquaculture",
        scope: item.scopeType === "SUBJECT_GROUP" || groupItems.length ? "group" : item.scopeType === "SUBJECT_VARIANT" || varietyItems.length ? "variety" : "crop",
        cropId: cropIdVal ? String(cropIdVal) : "",
        cropName: cropNameVal || "",
        variety: varietyNameVal || "",
        groupIds: groupItems.map((group: any) => String(group.id)),
        cropIds: cropItems.map((subject: any) => String(subject.id)),
        varietyIds: varietyItems.map((variety: any) => String(variety.id)),
        totalDays: expectedDaysVal,
        numStages: item.stages?.length || 0,
        stages:
          item.stages?.map((s: any, idx: number) => {
            const doc = s.documents?.[0];
            return {
              id: String(s.id || idx),
              name: s.name,
              duration: formatDaysToDuration(s.durationDays || 0),
              usePdf: !!doc,
              content: s.description || "",
              pdfFile: doc ? {
                name: doc.name || doc.fileName || "document.pdf",
                size: doc.sizeBytes || 0,
                url: doc.fileUrl || "",
              } : undefined,
            };
          }) || [],
        createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
        updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : 0,
        isFoundation,
      };
    });
  }, [apiSeasons]);

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
          setDeleteItem(null);
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
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    detailOpen,
    setDetailOpen,
    selectedId,
    setSelectedId,
    deleteOpen,
    setDeleteOpen,
    deleteItem,
    setDeleteItem,
    handleConfirmDelete,
    filters,
    handleFilterChange,
  };
}
