import { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useCultivationRegionStore from "@/stores/useCultivationRegionStore";
import useRegionStore from "@/stores/useRegionStore";
import { type AdvancedFilters, POLYGON_COLORS } from "../data/constants";

export function useEnterpriseSearch() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { enterprises } = useEnterpriseStore();
  const { areas: cultivationRegions } = useCultivationRegionStore();
  const { regions } = useRegionStore();

  // Basic States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<
    number | null
  >(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});

  // Search state for panels
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const mapRef = useRef<L.Map | null>(null);

  // Filter Logic
  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => {
      const matchesGlobal =
        !searchQuery ||
        enterprise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enterprise.brandName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        enterprise.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enterprise.taxCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enterprise.representative || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        enterprise.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        !advancedFilters.types?.length ||
        advancedFilters.types.includes(enterprise.type);

      const matchesClassification =
        !advancedFilters.classifications?.length ||
        enterprise.classification.some((c) =>
          advancedFilters.classifications?.includes(c),
        );

      const matchesStatus =
        !advancedFilters.status?.length ||
        advancedFilters.status.includes(enterprise.status);

      const matchesProvince =
        !advancedFilters.provinces?.length ||
        (enterprise.province &&
          advancedFilters.provinces.includes(enterprise.province));

      return (
        matchesGlobal &&
        matchesType &&
        matchesClassification &&
        matchesStatus &&
        matchesProvince
      );
    });
  }, [enterprises, searchQuery, advancedFilters]);

  // Selected Data
  const selectedEnterprise = useMemo(() => {
    if (selectedEnterpriseId === null) return null;
    return enterprises.find((e) => e.id === selectedEnterpriseId) || null;
  }, [enterprises, selectedEnterpriseId]);

  const enterpriseCultivationRegions = useMemo(() => {
    if (!selectedEnterprise) return [];
    return cultivationRegions.filter(
      (cr) =>
        String(cr.enterpriseId) === String(selectedEnterprise.id) ||
        cr.enterpriseId === selectedEnterprise.code,
    );
  }, [cultivationRegions, selectedEnterprise]);

  // Polygon Logic
  const visiblePolygons = useMemo(() => {
    const polygons: {
      id: string;
      rawId: string;
      type: "region" | "area" | "plot";
      name: string;
      coordinates: [number, number][];
      color: string;
    }[] = [];

    enterpriseCultivationRegions.forEach((cr) => {
      cr.targetIds.forEach((targetId) => {
        const region = regions.find((r) => String(r.id) === String(targetId));
        if (region && region.coordinates) {
          polygons.push({
            id: `region-${region.id}`,
            rawId: String(region.id),
            type: "region",
            name: region.name,
            coordinates: region.coordinates.map(
              (c) => [c.lat, c.lng] as [number, number],
            ),
            color: POLYGON_COLORS.region,
          });
        }

        regions.forEach((r) => {
          const area = r.subAreas?.find(
            (a) => String(a.id) === String(targetId),
          );
          if (area && area.coordinates) {
            polygons.push({
              id: `area-${area.id}`,
              rawId: String(area.id),
              type: "area",
              name: area.name,
              coordinates: area.coordinates.map(
                (c) => [c.lat, c.lng] as [number, number],
              ),
              color: POLYGON_COLORS.area,
            });
          }

          area?.plots?.forEach((p) => {
            if (p.coordinates) {
              polygons.push({
                id: `plot-${p.id}`,
                rawId: String(p.id),
                type: "plot",
                name: p.name,
                coordinates: p.coordinates.map(
                  (c) => [c.lat, c.lng] as [number, number],
                ),
                color: POLYGON_COLORS.plot,
              });
            }
          });
        });
      });
    });

    return polygons;
  }, [enterpriseCultivationRegions, regions]);

  // Actions
  const focusMapToPolygons = (polygons: any[]) => {
    if (!mapRef.current || !polygons.length) return;
    const bounds = L.latLngBounds(polygons.flatMap((p) => p.coordinates));
    mapRef.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.25 });
  };

  const toggleFilter = (key: keyof AdvancedFilters, value: string) => {
    setAdvancedFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const resetFilters = () => {
    setAdvancedFilters({});
    toast({ title: "Thông báo", description: "Đã đặt lại tất cả bộ lọc." });
  };

  const activeFilterCount = Object.keys(advancedFilters).reduce(
    (count, key) => {
      const val = advancedFilters[key as keyof AdvancedFilters];
      return count + (Array.isArray(val) ? val.length : 0);
    },
    0,
  );

  useEffect(() => {
    if (visiblePolygons.length > 0) {
      focusMapToPolygons(visiblePolygons);
    }
  }, [visiblePolygons]);

  return {
    enterprises: filteredEnterprises,
    allEnterprises: enterprises,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    selectedEnterprise,
    searchQuery,
    setSearchQuery,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    advancedFilters,
    setAdvancedFilters,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
    mapRef,
    visiblePolygons,
    activeFilterCount,
    toggleFilter,
    resetFilters,
    setLocation,
    toast,
  };
}
