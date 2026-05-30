import { useState, useMemo, useEffect, useRef } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useCultivationRegionStore from "@/stores/useCultivationRegionStore";
import useRegionStore from "@/stores/useRegionStore";
import { type AdvancedFilters, POLYGON_COLORS } from "../data/constants";

const MAP_FALLBACK_CENTER = { lat: 10.762622, lng: 106.660172 };
const MAP_DEFAULT_ZOOM = 9;

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
  const [mapRenderKey, setMapRenderKey] = useState(0);

  const mapRef = useRef<any>(null);

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

  const enterpriseMarkers = useMemo(() => {
    return filteredEnterprises
      .map((enterprise) => {
        const lat = Number(enterprise.latitude);
        const lng = Number(enterprise.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: enterprise.id,
          name: enterprise.name,
          code: enterprise.code,
          type: enterprise.type,
          lat,
          lng,
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: number;
          name: string;
          code: string;
          type: "enterprise" | "farm" | "cooperative";
          lat: number;
          lng: number;
        } => item !== null,
      );
  }, [filteredEnterprises]);

  const mapDefaultCenter = useMemo(() => {
    const markersFromAll = enterprises
      .map((enterprise) => {
        const lat = Number(enterprise.latitude);
        const lng = Number(enterprise.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { type: enterprise.type, lat, lng };
      })
      .filter((item): item is { type: "enterprise" | "farm" | "cooperative"; lat: number; lng: number } => item !== null);

    const enterpriseMarker = markersFromAll.find((m) => m.type === "enterprise");
    if (enterpriseMarker) {
      return { lat: enterpriseMarker.lat, lng: enterpriseMarker.lng };
    }

    if (markersFromAll.length > 0) {
      return { lat: markersFromAll[0].lat, lng: markersFromAll[0].lng };
    }

    return MAP_FALLBACK_CENTER;
  }, [enterprises]);

  const visibleEnterpriseMarkers = useMemo(() => {
    if (selectedEnterpriseId === null) return enterpriseMarkers;
    return enterpriseMarkers.filter((marker) => marker.id === selectedEnterpriseId);
  }, [enterpriseMarkers, selectedEnterpriseId]);

  const selectedEnterpriseMarker = useMemo(() => {
    if (selectedEnterpriseId === null) return null;
    const enterprise = enterprises.find((e) => e.id === selectedEnterpriseId);
    if (!enterprise) return null;
    const lat = Number(enterprise.latitude);
    const lng = Number(enterprise.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [enterprises, selectedEnterpriseId]);

  const mapCurrentCenter = useMemo(() => {
    if (selectedEnterpriseMarker) return selectedEnterpriseMarker;
    return mapDefaultCenter;
  }, [selectedEnterpriseMarker, mapDefaultCenter]);

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
    const polygonIds = new Set<string>();
    const unmatchedTargetIds = new Set<string>();

    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    regions.forEach((region) => {
      regionById.set(String(region.id), region);
      (region.subAreas || []).forEach((area) => {
        areaById.set(String(area.id), { area, region });
        (area.plots || []).forEach((plot) => {
          plotById.set(String(plot.id), { plot, area, region });
        });
      });
    });

    const pushPolygon = (polygon: {
      id: string;
      rawId: string;
      type: "region" | "area" | "plot";
      name: string;
      coordinates: [number, number][];
      color: string;
    }) => {
      if (!polygon.coordinates?.length || polygonIds.has(polygon.id)) return;
      polygonIds.add(polygon.id);
      polygons.push(polygon);
    };

    enterpriseCultivationRegions.forEach((cr) => {
      cr.targetIds.forEach((targetId) => {
        const key = String(targetId);
        const region = regionById.get(key);
        if (region?.coordinates) {
          pushPolygon({
            id: `region-${region.id}`,
            rawId: String(region.id),
            type: "region",
            name: region.name,
            coordinates: region.coordinates.map(
              (c) => [c.lat, c.lng] as [number, number],
            ),
            color: POLYGON_COLORS.region,
          });
          return;
        }

        const areaHit = areaById.get(key);
        if (areaHit?.area?.coordinates) {
          pushPolygon({
            id: `area-${areaHit.area.id}`,
            rawId: String(areaHit.area.id),
            type: "area",
            name: areaHit.area.name,
            coordinates: areaHit.area.coordinates.map(
              (c: any) => [c.lat, c.lng] as [number, number],
            ),
            color: POLYGON_COLORS.area,
          });

          // Keep prior behavior: when an area is targeted, show all plots in that area.
          (areaHit.area.plots || []).forEach((plot: any) => {
            if (!plot?.coordinates) return;
            pushPolygon({
              id: `plot-${plot.id}`,
              rawId: String(plot.id),
              type: "plot",
              name: plot.name,
              coordinates: plot.coordinates.map(
                (c: any) => [c.lat, c.lng] as [number, number],
              ),
              color: POLYGON_COLORS.plot,
            });
          });
          return;
        }

        const plotHit = plotById.get(key);
        if (plotHit?.plot?.coordinates) {
          pushPolygon({
            id: `plot-${plotHit.plot.id}`,
            rawId: String(plotHit.plot.id),
            type: "plot",
            name: plotHit.plot.name,
            coordinates: plotHit.plot.coordinates.map(
              (c: any) => [c.lat, c.lng] as [number, number],
            ),
            color: POLYGON_COLORS.plot,
          });
          return;
        }

        unmatchedTargetIds.add(key);
      });
    });

    if (unmatchedTargetIds.size > 0) {
      console.warn(
        "[SearchUnit] Unmatched cultivation targetIds:",
        Array.from(unmatchedTargetIds),
      );
    }

    return polygons;
  }, [enterpriseCultivationRegions, regions]);

  // Actions
  const focusMapToPolygons = (polygons: any[]) => {
    if (!mapRef.current || !polygons.length) return;
    const allPoints = polygons.flatMap(
      (p) => p.coordinates as [number, number][],
    );
    if (!allPoints.length) return;

    const lats = allPoints.map(([lat]) => lat);
    const lngs = allPoints.map(([, lng]) => lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const center = { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };

    const map = mapRef.current;

    if (typeof map.fitBounds === "function") {
      // Map4D SDK versions may accept different bounds formats.
      try {
        map.fitBounds([
          { lat: minLat, lng: minLng },
          { lat: maxLat, lng: maxLng },
        ]);
        return;
      } catch {
        try {
          map.fitBounds([
            [minLat, minLng],
            [maxLat, maxLng],
          ]);
          return;
        } catch {
          // Fall back to center/zoom below.
        }
      }
    }

    if (typeof map.setCenter === "function") {
      map.setCenter(center);
    }

    if (typeof map.setZoom === "function") {
      map.setZoom(14);
    }
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
    setMapRenderKey((prev) => prev + 1);
    const map = mapRef.current;
    if (!map) return;

    if (typeof map.setZoom === "function") {
      map.setZoom(MAP_DEFAULT_ZOOM);
    }

    if (selectedEnterpriseMarker && typeof map.setCenter === "function") {
      map.setCenter({
        lat: selectedEnterpriseMarker.lat,
        lng: selectedEnterpriseMarker.lng,
      });
      return;
    }

    if (typeof map.setCenter === "function") {
      map.setCenter(mapDefaultCenter);
    }
  }, [selectedEnterpriseId, selectedEnterpriseMarker, mapDefaultCenter]);

  useEffect(() => {
    if (selectedEnterpriseId === null && visiblePolygons.length > 0) {
      focusMapToPolygons(visiblePolygons);
      // Retry once for the case map instance is initialized slightly later.
      const timer = window.setTimeout(() => {
        focusMapToPolygons(visiblePolygons);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [selectedEnterpriseId, visiblePolygons]);

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
    mapRenderKey,
    mapDefaultCenter,
    mapCurrentCenter,
    visiblePolygons,
    enterpriseMarkers: visibleEnterpriseMarkers,
    activeFilterCount,
    toggleFilter,
    resetFilters,
    setLocation,
    toast,
  };
}
