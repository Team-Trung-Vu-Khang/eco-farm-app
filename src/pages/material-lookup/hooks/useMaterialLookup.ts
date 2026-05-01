import { useState, useMemo, useEffect } from "react";
import usePesticideStore from "../../../stores/usePesticideStore";
import useFertilizerStore from "../../../stores/useFertilizerStore";
import useMaterialStore from "../../../stores/useMaterialStore";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import type { MaterialItem, MaterialFilters } from "../types/types";

export function useMaterialLookup() {
  const pesticides = usePesticideStore((state) => state.pesticides);
  const fertilizers = useFertilizerStore((state) => state.fertilizers);
  const materialsFromStore = useMaterialStore((state) => state.materials);
  const equipments = useEquipmentStore((state) => state.equipments);

  // Unified materials list
  const unifiedMaterials = useMemo(() => {
    const list: MaterialItem[] = [];

    // Map Pesticides
    pesticides.forEach((p) => {
      list.push({
        id: `pesticide-${p.id}`,
        originalId: p.id,
        code: p.code,
        name: p.name,
        category: "Pesticide",
        subCategory: p.group,
        status: p.status,
        createdAt: p.createdAt,
        manufacturer: p.origin,
        // Toxicity mapped if available, or default
        toxicityClass: "III",
        phi: 7,
        originalData: p,
      });
    });

    // Map Fertilizers
    fertilizers.forEach((f) => {
      list.push({
        id: `fertilizer-${f.id}`,
        originalId: f.id,
        code: f.code,
        name: f.name,
        category: "Fertilizer",
        subCategory: f.type,
        status: f.status,
        createdAt: f.createdAt,
        manufacturer: "N/A",
        originalData: f,
      });
    });

    // Map Materials
    materialsFromStore.forEach((m) => {
      list.push({
        id: `material-${m.id}`,
        originalId: m.id,
        code: m.code,
        name: m.name,
        category: "Material",
        subCategory: m.type,
        status: m.status,
        createdAt: m.createdAt,
        manufacturer: "N/A",
        originalData: m,
      });
    });

    // Map Equipment
    equipments.forEach((e) => {
      list.push({
        id: `equipment-${e.id}`,
        originalId: e.id,
        code: e.code,
        name: e.name,
        category: "Equipment",
        subCategory: e.type,
        status: e.status,
        createdAt: e.createdAt,
        manufacturer: "N/A",
        originalData: e,
      });
    });

    return list;
  }, [pesticides, fertilizers, materialsFromStore, equipments]);

  const [tempFilters, setTempFilters] = useState<MaterialFilters>({
    search: "",
    categories: ["Equipment", "Fertilizer", "Pesticide", "Material"],
    status: ["active", "inactive"],
    toxicity: ["I", "II", "III", "IV"],
    phiRange: [0, 60],
  });

  const [appliedFilters, setAppliedFilters] =
    useState<MaterialFilters>(tempFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredMaterials = useMemo(() => {
    return unifiedMaterials.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.code.toLowerCase().includes(appliedFilters.search.toLowerCase());

      const matchCategory = appliedFilters.categories.includes(item.category);
      const matchStatus = appliedFilters.status.includes(item.status);

      // Toxicity and PHI only apply to pesticides for now in this mock/store logic
      let matchToxicity = true;
      let matchPhi = true;
      if (item.category === "Pesticide") {
        matchToxicity = appliedFilters.toxicity.includes(
          item.toxicityClass || "IV",
        );
        matchPhi =
          (item.phi || 0) >= appliedFilters.phiRange[0] &&
          (item.phi || 0) <= appliedFilters.phiRange[1];
      }

      return (
        matchSearch && matchCategory && matchStatus && matchToxicity && matchPhi
      );
    });
  }, [unifiedMaterials, appliedFilters]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const totalCount = filteredMaterials.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedMaterials = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMaterials.slice(start, start + pageSize);
  }, [filteredMaterials, page, pageSize]);

  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters(tempFilters);
      setIsLoading(false);
    }, 300);
  };

  const resetFilters = () => {
    const defaultFilters: MaterialFilters = {
      search: "",
      categories: ["Equipment", "Fertilizer", "Pesticide", "Material"],
      status: ["active", "inactive"],
      toxicity: ["I", "II", "III", "IV"],
      phiRange: [0, 60],
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
    if (selectedIds.length === filteredMaterials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMaterials.map((m) => m.id));
    }
  };

  return {
    materials: paginatedMaterials,
    totalCount,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    tempFilters,
    setTempFilters,
    applyFilters,
    resetFilters,
    selectedIds,
    toggleIdSelection,
    selectAll,
  };
}
