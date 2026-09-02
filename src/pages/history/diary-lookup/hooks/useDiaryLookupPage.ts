import { useMemo, useState } from "react";
import { MOCK_DIARY_ENTRIES } from "../data/mock-diary-entries";
import type { DiaryWorkType } from "../types";

export interface DiaryAdvancedFilters {
  workflowIds: number[];
  planIds: number[];
  workTypes: DiaryWorkType[];
  fromDate: string;
  toDate: string;
}

const EMPTY_FILTERS: DiaryAdvancedFilters = {
  workflowIds: [],
  planIds: [],
  workTypes: [],
  fromDate: "",
  toDate: "",
};

export function useDiaryLookupPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<DiaryAdvancedFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<DiaryAdvancedFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const workflowOptions = useMemo(() => {
    const map = new Map<number, { id: string; name: string }>();
    MOCK_DIARY_ENTRIES.forEach((entry) => {
      if (!map.has(entry.workflow.id)) {
        map.set(entry.workflow.id, {
          id: String(entry.workflow.id),
          name: entry.workflow.name,
        });
      }
    });
    return Array.from(map.values());
  }, []);

  const planOptions = useMemo(() => {
    const map = new Map<number, { id: string; name: string }>();
    MOCK_DIARY_ENTRIES.forEach((entry) => {
      if (!map.has(entry.plan.id)) {
        map.set(entry.plan.id, {
          id: String(entry.plan.id),
          name: `${entry.plan.code} - ${entry.plan.name}`,
        });
      }
    });
    return Array.from(map.values());
  }, []);

  const workTypeOptions = [
    { id: "cultivation", name: "Canh tác" },
    { id: "facility-upgrade", name: "Nâng cấp CSVC" },
    { id: "treatment", name: "Điều trị" },
    { id: "amendment", name: "Cải tạo đất" },
    { id: "harvest", name: "Thu hoạch" },
  ];

  const toggleFilter = (key: "workflowIds" | "planIds" | "workTypes", value: string) => {
    setDraftFilters((prev) => {
      const numericKeys: Array<typeof key> = ["workflowIds", "planIds"];
      if (numericKeys.includes(key)) {
        const list = prev[key] as number[];
        const numeric = Number(value);
        const next = list.includes(numeric)
          ? list.filter((v) => v !== numeric)
          : [...list, numeric];
        return { ...prev, [key]: next };
      }
      const list = prev.workTypes;
      const next = list.includes(value as DiaryWorkType)
        ? list.filter((v) => v !== value)
        : [...list, value as DiaryWorkType];
      return { ...prev, workTypes: next };
    });
  };

  const setDateFilter = (key: "fromDate" | "toDate", value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const activeFilterCount =
    appliedFilters.workflowIds.length +
    appliedFilters.planIds.length +
    appliedFilters.workTypes.length +
    (appliedFilters.fromDate ? 1 : 0) +
    (appliedFilters.toDate ? 1 : 0);

  const filteredEntries = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return MOCK_DIARY_ENTRIES.filter((entry) => {
      if (
        keyword &&
        !entry.name.toLowerCase().includes(keyword) &&
        !entry.code.toLowerCase().includes(keyword)
      )
        return false;
      if (
        appliedFilters.workflowIds.length &&
        !appliedFilters.workflowIds.includes(entry.workflow.id)
      )
        return false;
      if (
        appliedFilters.planIds.length &&
        !appliedFilters.planIds.includes(entry.plan.id)
      )
        return false;
      if (
        appliedFilters.workTypes.length &&
        !appliedFilters.workTypes.includes(entry.workType)
      )
        return false;
      if (appliedFilters.fromDate && entry.startDate < appliedFilters.fromDate)
        return false;
      if (appliedFilters.toDate && entry.startDate > appliedFilters.toDate)
        return false;
      return true;
    });
  }, [searchQuery, appliedFilters]);

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedId) ?? null;

  return {
    entries: filteredEntries,
    searchQuery,
    setSearchQuery,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    draftFilters,
    toggleFilter,
    setDateFilter,
    applyFilters,
    resetFilters,
    activeFilterCount,
    workflowOptions,
    planOptions,
    workTypeOptions,
    selectedId,
    setSelectedId,
    selectedEntry,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  };
}
