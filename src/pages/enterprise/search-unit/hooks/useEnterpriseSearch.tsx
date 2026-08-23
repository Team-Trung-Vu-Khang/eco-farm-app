import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";

import {
  organizationApi,
  type OrganizationRecord,
  type OrganizationQueryParams,
} from "@/features/organization";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { CultivationRegion } from "@/stores/useCultivationRegionStore";
import useCultivationRegionStore from "@/stores/useCultivationRegionStore";
import useRegionStore from "@/stores/useRegionStore";
import type { Enterprise } from "../../data/constants";
import { type AdvancedFilters, POLYGON_COLORS } from "../data/constants";
import type { Plot, Region, SubArea } from "@/pages/region-chart/constants";

const MAP_FALLBACK_CENTER = { lat: 10.762622, lng: 106.660172 };
const MAP_DEFAULT_ZOOM = 9;
const DEFAULT_PAGE_SIZE = 100;

type SearchEnterprise = Omit<Enterprise, "classification" | "contacts" | "branches" | "bankAccounts" | "documents"> & {
  classification: Enterprise["classification"];
  contacts?: Enterprise["contacts"];
  branches?: Enterprise["branches"];
  bankAccounts?: Enterprise["bankAccounts"];
  documents?: NonNullable<Enterprise["documents"]>;
};

type MapLike = {
  fitBounds?: (bounds: Array<{ lat: number; lng: number }> | [number, number][]) => void;
  setCenter?: (center: { lat: number; lng: number }) => void;
  setZoom?: (zoom: number) => void;
  getZoom?: () => number;
  whenReady?: (cb: () => void) => void;
  _loaded?: boolean;
};

type RegionLookup = Pick<Region, "id" | "name" | "coordinates" | "subAreas">;
type AreaLookup = Pick<SubArea, "id" | "name" | "coordinates" | "plots">;
type PlotLookup = Pick<Plot, "id" | "name" | "coordinates">;
type CultivationRegionLookup = Pick<CultivationRegion, "enterpriseId" | "targetIds">;
type PolygonData = {
  id: string;
  rawId: string;
  type: "region" | "area" | "plot";
  name: string;
  coordinates: [number, number][];
  color: string;
};

const normalizeStatus = (
  status: OrganizationRecord["status"],
): "active" | "inactive" => (status === "inactive" ? "inactive" : "active");

const toClassificationValue = (
  line: { code?: string; name?: string } | null | undefined,
): Enterprise["classification"][number] | null => {
  const raw = `${line?.code || ""} ${line?.name || ""}`.toLowerCase();

  if (
    raw.includes("production") ||
    raw.includes("sản xuất") ||
    raw.includes("sx")
  ) {
    return "production";
  }

  if (
    raw.includes("processing") ||
    raw.includes("chế biến") ||
    raw.includes("cb")
  ) {
    return "processing";
  }

  if (
    raw.includes("trading") ||
    raw.includes("thương mại") ||
    raw.includes("tm")
  ) {
    return "trading";
  }

  if (
    raw.includes("service") ||
    raw.includes("dịch vụ") ||
    raw.includes("dv")
  ) {
    return "service";
  }

  return null;
};

const toEnterprise = (organization: OrganizationRecord): SearchEnterprise => {
  const primaryContact =
    organization.contacts?.find((contact) => contact.isPrimary) ??
    organization.contacts?.[0] ??
    null;

  const classification = Array.from(
    new Set(
      (organization.businessLines ?? [])
        .map((line) => toClassificationValue(line))
        .filter(
          (item): item is Enterprise["classification"][number] => item !== null,
        ),
    ),
  );

  return {
    id: Number(organization.id),
    code: organization.code || "",
    name: organization.name || "",
    image: organization.imageUrl || "",
    type:
      organization.type === "farm" || organization.type === "cooperative"
        ? organization.type
        : "enterprise",
    classification,
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: normalizeStatus(organization.status),
    createdAt: organization.createdAt || "",
    aliasName: organization.aliasName || "",
    brandName: organization.brandName || "",
    representative: organization.representative || "",
    foundedDate: organization.foundedDate || "",
    website: organization.website || "",
    province: organization.province || "",
    district: organization.district || "",
    ward: organization.ward || "",
    latitude: organization.latitude,
    longitude: organization.longitude,
    taxAddress: organization.taxAddress || "",
    taxAuthority: organization.taxAuthority || "",
    issueDate: organization.issueDate || "",
    description: organization.description || "",
    contacts:
      organization.contacts?.map((contact) => ({
        id: contact.id,
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      organization.branches?.map((branch) => ({
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      organization.bankAccounts?.map((account) => ({
        bankName: account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      organization.documents?.map((doc) => ({
        name: doc.name || "",
        type: doc.mimeType || doc.documentType || "",
        size: doc.sizeBytes
          ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
          : "",
        url: doc.fileUrl || "",
        date: doc.createdAt,
      })) ?? [],
  };
};

export function useEnterpriseSearch() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();
  const businessLinesQuery = useMasterData("business-lines", {
    params: { status: "active", page: 0, size: 100 },
  });
  const { areas: cultivationRegions } = useCultivationRegionStore();
  const { regions } = useRegionStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<
    number | null
  >(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>({});
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const mapRef = useRef<MapLike | null>(null);
  const mapRenderKey = useMemo(
    () => (selectedEnterpriseId === null ? 0 : selectedEnterpriseId + 1),
    [selectedEnterpriseId],
  );

  const searchParams: OrganizationQueryParams = {
    keyword: searchQuery.trim() || undefined,
    status: advancedFilters.status?.join(",") || undefined,
    businessLine: advancedFilters.classifications?.join(",") || undefined,
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  };

  const [loadedOrganizations, setLoadedOrganizations] = useState<OrganizationRecord[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  useEffect(() => {
    if (workspaceId === null) {
      setLoadedOrganizations([]);
      setIsLoadingOrganizations(false);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    setLoadedOrganizations([]);
    setIsLoadingOrganizations(true);

    const loadPages = async () => {
      let page = 0;
      let totalPages = 1;

      try {
        while (!isCancelled && page < totalPages) {
          const response = await organizationApi.search(
            { ...searchParams, page },
            workspaceId,
            controller.signal,
          );

          if (isCancelled) return;

          setLoadedOrganizations((previous) => [...previous, ...response.content]);
          totalPages = response.totalPages || 1;
          page += 1;
        }
      } catch (error) {
        if (!isCancelled && !controller.signal.aborted) {
          console.error("[SearchUnit] Failed to load organizations", error);
        }
      } finally {
        if (!isCancelled) setIsLoadingOrganizations(false);
      }
    };

    void loadPages();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [
    workspaceId,
    searchParams.keyword,
    searchParams.status,
    searchParams.businessLine,
  ]);

  const allEnterprises = useMemo(
    () => loadedOrganizations.map(toEnterprise),
    [loadedOrganizations],
  );

  const filterOptions = useMemo(() => {
    const classifications = businessLinesQuery.items.map((item) => ({
      id: item.code,
      name: item.name,
    }));
    const statuses = [
      { id: "active", name: "Đang hoạt động" },
      { id: "inactive", name: "Ngưng hoạt động" },
      { id: "archived", name: "Đã lưu trữ" },
    ];
    return { classifications, status: statuses };
  }, [allEnterprises, businessLinesQuery.items]);

  // The API response is the single source of truth. No local filtering is applied.
  const enterprises = allEnterprises;

  const selectedEnterprise = useMemo(() => {
    if (selectedEnterpriseId === null) return null;
    return allEnterprises.find((enterprise) => enterprise.id === selectedEnterpriseId) || null;
  }, [allEnterprises, selectedEnterpriseId]);

  const enterpriseMarkers = useMemo(() => {
    return enterprises
      .map((enterprise) => {
        const lat = Number(enterprise.latitude);
        const lng = Number(enterprise.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: enterprise.id,
          name: enterprise.name,
          code: enterprise.code,
          type: enterprise.type,
          image: enterprise.image || "",
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
          image: string;
          lat: number;
          lng: number;
        } => item !== null,
      );
  }, [enterprises]);

  const mapDefaultCenter = useMemo(() => {
    const markersFromAll = allEnterprises
      .map((enterprise) => {
        const lat = Number(enterprise.latitude);
        const lng = Number(enterprise.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { type: enterprise.type, lat, lng };
      })
      .filter(
        (item): item is { type: "enterprise" | "farm" | "cooperative"; lat: number; lng: number } =>
          item !== null,
      );

    const enterpriseMarker = markersFromAll.find((m) => m.type === "enterprise");
    if (enterpriseMarker) {
      return { lat: enterpriseMarker.lat, lng: enterpriseMarker.lng };
    }

    if (markersFromAll.length > 0) {
      return { lat: markersFromAll[0].lat, lng: markersFromAll[0].lng };
    }

    return MAP_FALLBACK_CENTER;
  }, [allEnterprises]);

  const visibleEnterpriseMarkers = useMemo(() => {
    if (selectedEnterpriseId === null) return enterpriseMarkers;
    return enterpriseMarkers.filter((marker) => marker.id === selectedEnterpriseId);
  }, [enterpriseMarkers, selectedEnterpriseId]);

  const selectedEnterpriseMarker = useMemo(() => {
    if (selectedEnterpriseId === null) return null;
    const enterprise = allEnterprises.find((item) => item.id === selectedEnterpriseId);
    if (!enterprise) return null;
    const lat = Number(enterprise.latitude);
    const lng = Number(enterprise.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [allEnterprises, selectedEnterpriseId]);

  const mapCurrentCenter = useMemo(() => {
    if (selectedEnterpriseMarker) return selectedEnterpriseMarker;
    return mapDefaultCenter;
  }, [selectedEnterpriseMarker, mapDefaultCenter]);

  const regionLogoMarkers = useMemo(() => {
    if (!selectedEnterprise) return [];

    const toCenter = (coordinates: [number, number][]) => {
      if (!coordinates?.length) return null;
      const sum = coordinates.reduce(
        (acc, [lat, lng]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
        { lat: 0, lng: 0 },
      );
      return {
        lat: sum.lat / coordinates.length,
        lng: sum.lng / coordinates.length,
      };
    };

    const enterpriseRegions: CultivationRegionLookup[] = cultivationRegions.filter(
      (cr) =>
        String(cr.enterpriseId) === String(selectedEnterprise.id) ||
        cr.enterpriseId === selectedEnterprise.code,
    );

    const regionById = new Map<string, RegionLookup>();
    const areaToRegionId = new Map<string, string>();
    const plotToRegionId = new Map<string, string>();
    regions.forEach((region) => {
      const regionId = String(region.id);
      regionById.set(regionId, region);
      (region.subAreas || []).forEach((area) => {
        const areaId = String(area.id);
        areaToRegionId.set(areaId, regionId);
        (area.plots || []).forEach((plot) => {
          plotToRegionId.set(String(plot.id), regionId);
        });
      });
    });

    const targetedRegionIds = new Set<string>();
    enterpriseRegions.forEach((cr) => {
      cr.targetIds.forEach((targetId) => {
        const key = String(targetId);
        if (regionById.has(key)) {
          targetedRegionIds.add(key);
          return;
        }
        const areaRegionId = areaToRegionId.get(key);
        if (areaRegionId) {
          targetedRegionIds.add(areaRegionId);
          return;
        }
        const plotRegionId = plotToRegionId.get(key);
        if (plotRegionId) {
          targetedRegionIds.add(plotRegionId);
        }
      });
    });

    return Array.from(targetedRegionIds)
      .map((regionId) => {
        const region = regionById.get(regionId);
        if (!region?.coordinates?.length) return null;
        const center = toCenter(
          region.coordinates.map((coordinate) => [
            coordinate.lat,
            coordinate.lng,
          ] as [number, number]),
        );
        if (!center) return null;
        return {
          id: `region-${region.id}`,
          enterpriseId: selectedEnterprise.id,
          name: selectedEnterprise.brandName || selectedEnterprise.name,
          image: selectedEnterprise.image || "",
          lat: center.lat,
          lng: center.lng,
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          enterpriseId: number;
          name: string;
          image: string;
          lat: number;
          lng: number;
        } => item !== null,
      );
  }, [selectedEnterprise, cultivationRegions, regions]);

  const enterpriseCultivationRegions = useMemo(() => {
    if (!selectedEnterprise) return [];
    return cultivationRegions.filter(
      (cr) =>
        String(cr.enterpriseId) === String(selectedEnterprise.id) ||
        cr.enterpriseId === selectedEnterprise.code,
    );
  }, [cultivationRegions, selectedEnterprise]);

  const visiblePolygons = useMemo(() => {
    const polygons: PolygonData[] = [];
    const polygonIds = new Set<string>();
    const unmatchedTargetIds = new Set<string>();

    const regionById = new Map<string, RegionLookup>();
    const areaById = new Map<string, { area: AreaLookup; region: RegionLookup }>();
    const plotById = new Map<
      string,
      { plot: PlotLookup; area: AreaLookup; region: RegionLookup }
    >();

    regions.forEach((region) => {
      regionById.set(String(region.id), region);
      (region.subAreas || []).forEach((area) => {
        areaById.set(String(area.id), { area, region });
        (area.plots || []).forEach((plot) => {
          plotById.set(String(plot.id), { plot, area, region });
        });
      });
    });

    const pushPolygon = (polygon: PolygonData) => {
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
            coordinates: region.coordinates.map((coordinate) => [
              coordinate.lat,
              coordinate.lng,
            ] as [number, number]),
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
            coordinates: areaHit.area.coordinates.map((coordinate) => [
              coordinate.lat,
              coordinate.lng,
            ] as [number, number]),
            color: POLYGON_COLORS.area,
          });

          (areaHit.area.plots || []).forEach((plot) => {
            if (!plot?.coordinates) return;
            pushPolygon({
              id: `plot-${plot.id}`,
              rawId: String(plot.id),
              type: "plot",
              name: plot.name,
              coordinates: plot.coordinates.map((coordinate) => [
                coordinate.lat,
                coordinate.lng,
              ] as [number, number]),
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
            coordinates: plotHit.plot.coordinates.map((coordinate) => [
              coordinate.lat,
              coordinate.lng,
            ] as [number, number]),
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

  const focusMapToPolygons = (polygons: PolygonData[]) => {
    if (!mapRef.current || !polygons.length) return;
    if (!mapRef.current._loaded) return;
    const allPoints = polygons.flatMap(
      (polygon) => polygon.coordinates as [number, number][],
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
    setDraftFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value) ? [] : [value];
      return { ...prev, [key]: next };
    });
  };

  const resetFilters = () => {
    setDraftFilters({});
    setAdvancedFilters({});
    toast({ title: "Thông báo", description: "Đã xóa các bộ lọc đang chọn." });
  };

  const applyFilters = () => {
    setAdvancedFilters(draftFilters);
    toast({ title: "Thông báo", description: "Đã áp dụng bộ lọc." });
  };

  useEffect(() => {
    if (isAdvancedSearchOpen) {
      setDraftFilters(advancedFilters);
    }
  }, [isAdvancedSearchOpen]);

  const activeFilterCount = Object.keys(advancedFilters).reduce((count, key) => {
    const val = advancedFilters[key as keyof AdvancedFilters];
    return count + (Array.isArray(val) ? val.length : 0);
  }, 0);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map._loaded) return;

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
      const timer = window.setTimeout(() => {
        focusMapToPolygons(visiblePolygons);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [selectedEnterpriseId, visiblePolygons]);

  return {
    enterprises,
    allEnterprises,
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
    filterOptions,
    draftFilters,
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
    regionLogoMarkers,
    activeFilterCount,
    toggleFilter,
    resetFilters,
    applyFilters,
    isLoadingOrganizations,
    setLocation,
    toast,
  };
}
