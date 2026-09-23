import { useDebounce } from "@/shared/hooks/useDebounce";
import { useMemo, useState } from "react";
import {
  countActiveFilters,
  toQueryParams,
  type SearchCropFilters,
} from "../utils/plant-identification.utils";

/**
 * Trạng thái ô tìm kiếm + bộ lọc. Giống trang Tìm kiếm vùng canh tác:
 * bộ lọc áp dụng ngay khi thay đổi, từ khóa áp dụng sau khi ngừng gõ.
 */
export function useSearchCropFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filters, setFilters] = useState<SearchCropFilters>({});

  const isAgeRangeInvalid =
    filters.ageFromMonths !== undefined &&
    filters.ageToMonths !== undefined &&
    filters.ageFromMonths > filters.ageToMonths;

  // Khoảng tuổi sai thì bỏ qua điều kiện tuổi thay vì gửi lên API
  const queryParams = useMemo(
    () =>
      toQueryParams(
        debouncedSearch,
        isAgeRangeInvalid
          ? { ...filters, ageFromMonths: undefined, ageToMonths: undefined }
          : filters,
      ),
    [debouncedSearch, filters, isAgeRangeInvalid],
  );

  const updateFilters = (partial: Partial<SearchCropFilters>) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    isAgeRangeInvalid,
    activeFilterCount: countActiveFilters(filters),
    queryParams,
  };
}
