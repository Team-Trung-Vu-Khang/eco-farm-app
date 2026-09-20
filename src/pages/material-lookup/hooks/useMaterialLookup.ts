import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply/api/farm-supply.api";
import type {
  SupplyItemResponse,
  SupplyQueryParams,
} from "@/features/farm-supply/types";
import type {
  MaterialItem,
  MaterialFilters,
  MaterialCategory,
} from "../types/types";

// NOTE: Hardcoding domainCode to "CROP" as configured for current cultivation scope.
const DEFAULT_DOMAIN_CODE = "CROP";

export function useMaterialLookup() {
  const [tempFilters, setTempFilters] = useState<MaterialFilters>({
    search: "",
    categories: ["Equipment", "Fertilizer", "Pesticide", "Material"],
    status: ["active", "inactive"],
    toxicityGroupIds: [],
    phiRange: [0, 60],
    onlyOwner: false,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<MaterialFilters>(tempFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters((prev) => {
        if (prev.search === tempFilters.search) return prev;
        return { ...prev, search: tempFilters.search };
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [tempFilters.search]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Translate frontend category selections to backend supplyType query parameter
  const supplyTypeParam = useMemo(() => {
    const cats = appliedFilters.categories;
    if (cats.length === 1) {
      if (cats[0] === "Pesticide") return "medicine";
      if (cats[0] === "Fertilizer") return "fertilizer";
      if (cats[0] === "Material") return "material";
      if (cats[0] === "Equipment") return "equipment";
    }
    // If all 4 or multiple categories selected, omit supplyType to query across all supply types
    return undefined;
  }, [appliedFilters.categories]);

  // Construct query parameters for GET /api/farm/supplies
  const queryParams: SupplyQueryParams = useMemo(() => {
    const params: SupplyQueryParams = {
      domainCode: DEFAULT_DOMAIN_CODE,
      supplyType: supplyTypeParam,
      page: page - 1, // API is 0-indexed
      size: pageSize,
    };

    if (appliedFilters.search.trim()) {
      params.keyword = appliedFilters.search.trim();
    }

    if (appliedFilters.onlyOwner) {
      params.onlyOwner = true;
    }

    // Status filter: if only single status selected
    if (appliedFilters.status.length === 1) {
      const s = appliedFilters.status[0];
      if (s === "active") params.status = "active";
      if (s === "inactive") params.status = "inactive";
    }

    // PHI range filter
    if (appliedFilters.phiRange) {
      params.phiFromDays = appliedFilters.phiRange[0];
      params.phiToDays = appliedFilters.phiRange[1];
    }

    // Toxicity group classification filter (must be provided together according to API validation)
    if (
      appliedFilters.toxicityGroupIds &&
      appliedFilters.toxicityGroupIds.length > 0
    ) {
      params.classification = "toxicity";
      params.classificationGroupIds = appliedFilters.toxicityGroupIds;
    }

    return params;
  }, [
    supplyTypeParam,
    appliedFilters.search,
    appliedFilters.onlyOwner,
    appliedFilters.status,
    appliedFilters.phiRange,
    appliedFilters.toxicityGroupIds,
    page,
    pageSize,
  ]);

  // Execute GET /api/farm/supplies query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["farm-supplies-lookup", queryParams],
    queryFn: () => farmSupplyApi.listAllSupplies(queryParams),
    staleTime: 60_000,
  });

  // Map backend PageResponse<SupplyItemResponse> to MaterialItem[]
  const materials: MaterialItem[] = useMemo(() => {
    if (!data?.content) return [];

    return data.content.map((item: SupplyItemResponse) => {
      let category: MaterialCategory = "Material";
      if (item.supplyType === "medicine") category = "Pesticide";
      else if (item.supplyType === "fertilizer") category = "Fertilizer";
      else if (item.supplyType === "material") category = "Material";
      else if (item.supplyType === "equipment") category = "Equipment";

      const subCategory =
        item.classifications?.[0]?.group?.name ||
        (category === "Pesticide"
          ? "Thuốc BVTV"
          : category === "Fertilizer"
            ? "Phân bón"
            : category === "Equipment"
              ? "Thiết bị"
              : "Vật tư");

      const codeStr = item.code || item.sku || `SUP-${item.id}`;
      const manufacturerStr =
        item.manufacturer || item.manufacturerOrganization?.name || "N/A";
      const createdAtStr = item.createdAt
        ? item.createdAt.substring(0, 10)
        : "N/A";

      return {
        id: `${item.supplyType}-${item.id}`,
        originalId: item.id,
        code: codeStr,
        name: item.name,
        category,
        subCategory,
        status: item.status === "archived" ? "inactive" : (item.status as any),
        createdAt: createdAtStr,
        manufacturer: manufacturerStr,
        toxicityClass: "III",
        phi: item.profile?.withdrawalPeriodDays || 7,
        source: item.source,
        rawSupplyItem: item,
        originalData: {
          id: item.id,
          code: codeStr,
          name: item.name,
          type: subCategory,
          group: subCategory,
          status: item.status,
          createdAt: createdAtStr,
          origin: manufacturerStr,
          form: item.profile?.usageMethod || "Dạng lỏng/bột",
          actionType: item.profile?.moaGroupCode || "N/A",
          activeIngredient: item.profile?.activeIngredient || "N/A",
          maintainanceInterval:
            item.profile?.maintenanceSchedule || "6 tháng/lần",
          description: item.description || "Chưa có mô tả",
        },
      };
    });
  }, [data]);

  const totalCount = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const applyFilters = (customFilters?: MaterialFilters) => {
    if (customFilters) {
      setTempFilters(customFilters);
      setAppliedFilters(customFilters);
    } else {
      setAppliedFilters({ ...tempFilters });
    }
  };

  const resetFilters = () => {
    const defaultFilters: MaterialFilters = {
      search: "",
      categories: ["Equipment", "Fertilizer", "Pesticide", "Material"],
      status: ["active", "inactive"],
      toxicityGroupIds: [],
      phiRange: [0, 60],
      onlyOwner: false,
    };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const toggleIdSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === materials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(materials.map((m) => m.id));
    }
  };

  return {
    materials,
    totalCount,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading: isLoading || isFetching,
    tempFilters,
    setTempFilters,
    applyFilters,
    resetFilters,
    selectedIds,
    toggleIdSelection,
    selectAll,
  };
}
