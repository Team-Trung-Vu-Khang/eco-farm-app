import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useRegions, regionKeys } from "@/features/farm/hooks/useRegions";
import { regionApi, areaApi } from "@/features/farm/api/farm.api";
import { areaKeys } from "@/features/farm/hooks/useAreas";
import { useFarmProductionHealth } from "@/features/farm/hooks/useFarmDashboard";
import { useFarmTaskStats } from "@/features/farm-task/hooks/useFarmTasks";

export interface DashboardPlotNode {
  id: string;
  name: string;
  areaHa: number;
  status: string;
  isCountable: boolean;
  sickTrees: number;
  treatingTrees: number;
  hasPestWarning: boolean;
  isTreatingPest: boolean;
  cropTypeName?: string;
  centerPoint?: [number, number] | null;
  boundary?: [number, number][] | null;
}

export interface DashboardAreaNode {
  id: string;
  name: string;
  totalAreaHa: number;
  isCountable: boolean;
  sickTrees: number;
  treatingTrees: number;
  hasPestWarning: boolean;
  isTreatingPest: boolean;
  centerPoint?: [number, number] | null;
  boundary?: [number, number][] | null;
  plots: DashboardPlotNode[];
}

export interface DashboardScopeNode {
  id: string;
  type: "region" | "area";
  name: string;
  totalAreaHa: number;
  isCountable: boolean;
  sickTrees?: number;
  treatingTrees?: number;
  hasPestWarning?: boolean;
  isTreatingPest?: boolean;
  centerPoint?: [number, number] | null;
  boundary?: [number, number][] | null;
  areas: DashboardAreaNode[];
}

export interface DashboardZoneNode {
  id: string;
  name: string;
  description: string;
  totalAreaHa: number;
  isCountable: boolean;
  coordinates: { lat: number; lng: number };
  centerPoint?: [number, number] | null;
  boundary?: [number, number][] | null;
  scopes: DashboardScopeNode[];
  areas: DashboardAreaNode[];
}

const parseCenterPoint = (item: any): [number, number] | null => {
  if (!item) return null;
  const cp = item.centerPoint || item.center;
  if (cp) {
    const lat = Number(cp.latitude ?? cp.lat);
    const lng = Number(cp.longitude ?? cp.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return Math.abs(lat) > 90 ? [lng, lat] : [lat, lng];
    }
  }
  const rootLat = Number(item.latitude ?? item.lat);
  const rootLng = Number(item.longitude ?? item.lng);
  if (!isNaN(rootLat) && !isNaN(rootLng)) {
    return Math.abs(rootLat) > 90 ? [rootLng, rootLat] : [rootLat, rootLng];
  }

  const b = parseBoundary(item);
  if (b && b.length > 0) {
    const sumLat = b.reduce((acc, curr) => acc + curr[0], 0);
    const sumLng = b.reduce((acc, curr) => acc + curr[1], 0);
    return [sumLat / b.length, sumLng / b.length];
  }

  return null;
};

const parseBoundary = (item: any): [number, number][] | null => {
  if (!item) return null;
  const raw = item.boundary || item.coordinates;
  if (!raw) return null;
  let points: any = raw;
  if (typeof raw === "string") {
    try {
      points = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (Array.isArray(points) && points.length > 0) {
    const coords: [number, number][] = [];
    points.forEach((p: any) => {
      if (Array.isArray(p)) {
        const lat = Number(p[0]);
        const lng = Number(p[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push(Math.abs(lat) > 90 ? [lng, lat] : [lat, lng]);
        }
      } else if (p && typeof p === "object") {
        const lat = Number(p.lat ?? p.latitude);
        const lng = Number(p.lng ?? p.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push(Math.abs(lat) > 90 ? [lng, lat] : [lat, lng]);
        }
      }
    });
    return coords.length > 0 ? coords : null;
  }
  return null;
};

interface UseFarmerDashboardDataOptions {
  enabled?: boolean;
}

export function useFarmerDashboardData({
  enabled = true,
}: UseFarmerDashboardDataOptions = {}) {
  // Call parallel React Query API hooks for Farmer View
  const cultivationZonesQuery = useCultivationZones({
    params: { page: 0, size: 50 },
    enabled,
  });
  const regionsQuery = useRegions({
    params: { page: 0, size: 50 },
    enabled,
  });
  const healthMetricQuery = useFarmProductionHealth({ enabled });

  // Directly fetch task statistics
  const taskStatsQuery = useFarmTaskStats({ enabled });

  // Collect region IDs to fetch detail API for areas & plots hierarchy
  const regionIds = useMemo(() => {
    if (!enabled) return [];
    const ids = new Set<number>();
    (regionsQuery.items || []).forEach((r: any) => {
      if (r.id) ids.add(Number(r.id));
    });
    (cultivationZonesQuery.items || []).forEach((z: any) => {
      if (z.regionId) ids.add(Number(z.regionId));
      if (z.region?.id) ids.add(Number(z.region.id));
      if (Array.isArray(z.scopes)) {
        z.scopes.forEach((s: any) => {
          if (s.region?.id) ids.add(Number(s.region.id));
        });
      }
    });
    return Array.from(ids);
  }, [enabled, regionsQuery.items, cultivationZonesQuery.items]);

  // Execute detail queries for each cultivation region
  const regionDetailQueries = useQueries({
    queries: regionIds.map((id) => ({
      queryKey: regionKeys.detail(id),
      queryFn: () => regionApi.getById(id),
      enabled: enabled && !!id,
    })),
  });

  // Build a lookup map of detailed region objects
  const detailedRegionMap = useMemo(() => {
    const map = new Map<number | string, any>();
    if (!enabled) return map;
    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const item = q.data;
        if (item.id !== undefined && item.id !== null) {
          map.set(item.id, item);
          map.set(Number(item.id), item);
          map.set(String(item.id), item);
        }
        if (item.code) map.set(item.code, item);
        if (item.name) map.set(item.name.toLowerCase().trim(), item);
      }
    });
    return map;
  }, [enabled, regionDetailQueries]);

  // Collect area IDs from region details & summary lists to fetch area detail API
  const areaIds = useMemo(() => {
    if (!enabled) return [];
    const ids = new Set<number>();

    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const areas = q.data.areas || q.data.productionAreas || [];
        areas.forEach((a: any) => {
          if (a.id) ids.add(Number(a.id));
        });
      }
    });

    (regionsQuery.items || []).forEach((r: any) => {
      const areas = r.areas || r.productionAreas || [];
      areas.forEach((a: any) => {
        if (a.id) ids.add(Number(a.id));
      });
    });

    (cultivationZonesQuery.items || []).forEach((z: any) => {
      const areas = z.areas || z.productionAreas || [];
      areas.forEach((a: any) => {
        if (a.id) ids.add(Number(a.id));
      });
    });

    return Array.from(ids);
  }, [
    enabled,
    regionDetailQueries,
    regionsQuery.items,
    cultivationZonesQuery.items,
  ]);

  // Execute detail queries for each cultivation area
  const areaDetailQueries = useQueries({
    queries: areaIds.map((id) => ({
      queryKey: areaKeys.detail(id),
      queryFn: () => areaApi.getById(id),
      enabled: enabled && !!id,
    })),
  });

  // Build a lookup map of detailed area objects
  const detailedAreaMap = useMemo(() => {
    const map = new Map<number | string, any>();
    if (!enabled) return map;
    areaDetailQueries.forEach((q) => {
      if (q.data) {
        const item = q.data;
        if (item.id !== undefined && item.id !== null) {
          map.set(item.id, item);
          map.set(Number(item.id), item);
          map.set(String(item.id), item);
        }
        if (item.code) map.set(item.code, item);
        if (item.name) map.set(item.name.toLowerCase().trim(), item);
      }
    });
    return map;
  }, [enabled, areaDetailQueries]);

  // Transform regions/zones API response to Tree Data structure
  const zoneTreeData = useMemo<DashboardZoneNode[]>(() => {
    if (!enabled) return [];
    const apiZones = cultivationZonesQuery.items || [];
    const apiRegions = regionsQuery.items || [];

    const regionByIdMap = new Map<number | string, any>();
    const regionByCodeMap = new Map<string, any>();
    const regionByNameMap = new Map<string, any>();

    apiRegions.forEach((r: any) => {
      if (r.id !== undefined && r.id !== null) {
        regionByIdMap.set(r.id, r);
        regionByIdMap.set(Number(r.id), r);
        regionByIdMap.set(String(r.id), r);
      }
      if (r.code) regionByCodeMap.set(r.code, r);
      if (r.name) regionByNameMap.set(r.name.toLowerCase().trim(), r);
    });

    if (apiZones.length > 0) {
      return apiZones.map((z: any, zIdx: number) => {
        const rawScopes =
          Array.isArray(z.scopes) && z.scopes.length > 0 ? z.scopes : null;

        const scopeNodes: DashboardScopeNode[] = [];
        const allAreasFlat: DashboardAreaNode[] = [];

        if (rawScopes) {
          rawScopes.forEach((scope: any, sIdx: number) => {
            const scopeRegion = scope.region;
            const scopeArea = scope.area;

            let matchedRegion = null;
            if (scopeRegion?.id && detailedRegionMap.has(scopeRegion.id)) {
              matchedRegion = detailedRegionMap.get(scopeRegion.id);
            } else if (
              scopeRegion?.code &&
              detailedRegionMap.has(scopeRegion.code)
            ) {
              matchedRegion = detailedRegionMap.get(scopeRegion.code);
            } else if (scopeRegion?.id && regionByIdMap.has(scopeRegion.id)) {
              matchedRegion = regionByIdMap.get(scopeRegion.id);
            } else if (
              scopeRegion?.code &&
              regionByCodeMap.has(scopeRegion.code)
            ) {
              matchedRegion = regionByCodeMap.get(scopeRegion.code);
            } else if (scopeRegion) {
              matchedRegion = scopeRegion;
            }

            const sourceForGeometry = matchedRegion || scopeArea || z;
            const center = parseCenterPoint(sourceForGeometry) ||
              parseCenterPoint(z) || [
                13.9833 + zIdx * 0.02 + sIdx * 0.005,
                108.0,
              ];
            const boundary =
              parseBoundary(sourceForGeometry) || parseBoundary(z);

            const rawAreas =
              matchedRegion?.areas ||
              matchedRegion?.productionAreas ||
              (scopeArea ? [scopeArea] : []);

            const areas: DashboardAreaNode[] = rawAreas.map(
              (a: any, aIdx: number) => {
                const detailedArea = detailedAreaMap.get(a.id) || a;
                const rawPlots =
                  detailedArea.plots || detailedArea.productionUnits || [];

                const plots: DashboardPlotNode[] = rawPlots.map(
                  (p: any, pIdx: number) => ({
                    id: String(p.id || `plot-${pIdx}`),
                    name: p.name || `Lô ${pIdx + 1}`,
                    areaHa: Number(p.acreage || p.area || 0.5),
                    status: p.status || "active",
                    isCountable: true,
                    sickTrees: p.sickTrees || 0,
                    treatingTrees: p.treatingTrees || 0,
                    hasPestWarning: Boolean(p.sickTrees && p.sickTrees > 0),
                    isTreatingPest: Boolean(
                      p.treatingTrees && p.treatingTrees > 0,
                    ),
                    cropTypeName: p.cropTypeName || p.cropType?.name,
                    centerPoint: parseCenterPoint(p) || [
                      center[0] + (aIdx + 1) * 0.002 + pIdx * 0.0005,
                      center[1] + (aIdx + 1) * 0.002 + pIdx * 0.0005,
                    ],
                    boundary: parseBoundary(p),
                  }),
                );

                const areaObj: DashboardAreaNode = {
                  id: String(detailedArea.id || `area-${aIdx}`),
                  name: detailedArea.name || `Khu vực ${aIdx + 1}`,
                  totalAreaHa: Number(
                    detailedArea.acreage || detailedArea.area || 2.5,
                  ),
                  isCountable: true,
                  sickTrees: detailedArea.sickTrees || 0,
                  treatingTrees: detailedArea.treatingTrees || 0,
                  hasPestWarning: Boolean(
                    detailedArea.sickTrees && detailedArea.sickTrees > 0,
                  ),
                  isTreatingPest: Boolean(
                    detailedArea.treatingTrees &&
                    detailedArea.treatingTrees > 0,
                  ),
                  centerPoint: parseCenterPoint(detailedArea) || [
                    center[0] + (aIdx + 1) * 0.002,
                    center[1] + (aIdx + 1) * 0.002,
                  ],
                  boundary: parseBoundary(detailedArea),
                  plots,
                };

                allAreasFlat.push(areaObj);
                return areaObj;
              },
            );

            scopeNodes.push({
              id: String(scope.id || scopeRegion?.id || `scope-${sIdx}`),
              type: scopeRegion ? "region" : "area",
              name:
                scopeRegion?.name ||
                matchedRegion?.name ||
                scopeArea?.name ||
                `Vùng ${sIdx + 1}`,
              totalAreaHa: Number(
                scopeRegion?.acreage ||
                  matchedRegion?.acreage ||
                  scopeArea?.acreage ||
                  10,
              ),
              isCountable: true,
              centerPoint: center,
              boundary: boundary,
              areas,
            });
          });
        }

        return {
          id: String(z.id || `zone-${zIdx}`),
          name: z.name || `Vùng canh tác ${zIdx + 1}`,
          description: z.description || "",
          totalAreaHa: Number(z.acreage || z.area || 15),
          isCountable: true,
          coordinates: {
            lat: Number(z.latitude || 13.9833 + zIdx * 0.02),
            lng: Number(z.longitude || 108.0),
          },
          centerPoint: parseCenterPoint(z) || [
            Number(z.latitude || 13.9833 + zIdx * 0.02),
            Number(z.longitude || 108.0),
          ],
          boundary: parseBoundary(z),
          scopes: scopeNodes,
          areas: allAreasFlat,
        };
      });
    }

    // Fallback: render summary regions if no zones exist
    return apiRegions.map((r: any, idx: number) => {
      const detailedReg = detailedRegionMap.get(r.id) || r;
      const rawAreas = detailedReg.areas || detailedReg.productionAreas || [];

      const areas: DashboardAreaNode[] = rawAreas.map(
        (a: any, aIdx: number) => {
          const detailedArea = detailedAreaMap.get(a.id) || a;
          const rawPlots =
            detailedArea.plots || detailedArea.productionUnits || [];

          const plots: DashboardPlotNode[] = rawPlots.map(
            (p: any, pIdx: number) => ({
              id: String(p.id || `plot-${pIdx}`),
              name: p.name || `Lô ${pIdx + 1}`,
              areaHa: Number(p.acreage || p.area || 0.5),
              status: p.status || "active",
              isCountable: true,
              sickTrees: p.sickTrees || 0,
              treatingTrees: p.treatingTrees || 0,
              hasPestWarning: Boolean(p.sickTrees && p.sickTrees > 0),
              isTreatingPest: Boolean(p.treatingTrees && p.treatingTrees > 0),
              cropTypeName: p.cropTypeName || p.cropType?.name,
              centerPoint: parseCenterPoint(p),
              boundary: parseBoundary(p),
            }),
          );

          return {
            id: String(detailedArea.id || `area-${aIdx}`),
            name: detailedArea.name || `Khu vực ${aIdx + 1}`,
            totalAreaHa: Number(
              detailedArea.acreage || detailedArea.area || 2.5,
            ),
            isCountable: true,
            sickTrees: detailedArea.sickTrees || 0,
            treatingTrees: detailedArea.treatingTrees || 0,
            hasPestWarning: Boolean(
              detailedArea.sickTrees && detailedArea.sickTrees > 0,
            ),
            isTreatingPest: Boolean(
              detailedArea.treatingTrees && detailedArea.treatingTrees > 0,
            ),
            centerPoint: parseCenterPoint(detailedArea),
            boundary: parseBoundary(detailedArea),
            plots,
          };
        },
      );

      return {
        id: String(r.id || `region-${idx}`),
        name: r.name || `Vùng ${idx + 1}`,
        description: r.note || "",
        totalAreaHa: Number(r.acreage || r.area || 10),
        isCountable: true,
        coordinates: {
          lat: Number(r.latitude || 13.9833 + idx * 0.02),
          lng: Number(r.longitude || 108.0),
        },
        centerPoint: parseCenterPoint(r),
        boundary: parseBoundary(r),
        scopes: [],
        areas,
      };
    });
  }, [
    enabled,
    cultivationZonesQuery.items,
    regionsQuery.items,
    detailedRegionMap,
    detailedAreaMap,
  ]);

  const isLoading =
    enabled &&
    (cultivationZonesQuery.isLoading ||
      regionsQuery.isLoading ||
      healthMetricQuery.isLoading ||
      taskStatsQuery.isLoading ||
      regionDetailQueries.some((q) => q.isLoading) ||
      areaDetailQueries.some((q) => q.isLoading));

  const healthSummary = healthMetricQuery.data?.summary;
  const cropHealthMetrics = healthSummary
    ? {
        totalTrees: healthSummary.totalCount ?? 0,
        healthyTrees: healthSummary.healthyCount ?? 0,
        sickTrees: healthSummary.pestCount ?? 0,
        treatingTrees: healthSummary.treatingCount ?? 0,
      }
    : null;

  const rawStats = taskStatsQuery.item;
  const taskStats = rawStats
    ? {
        pending: rawStats.todoTasks ?? 0,
        inProgress: rawStats.doingTasks ?? 0,
        completed: rawStats.doneTasks ?? 0,
        overdue: rawStats.overdueTasks ?? 0,
        total: rawStats.totalTasks ?? 0,
      }
    : undefined;

  return {
    zoneTreeData,
    cropHealthMetrics,
    taskStats,
    isLoading,
    refetchAll: () => {
      if (!enabled) return;
      cultivationZonesQuery.refetch();
      regionsQuery.refetch();
      healthMetricQuery.refetch();
      taskStatsQuery.refetch();
      regionDetailQueries.forEach((q) => q.refetch());
      areaDetailQueries.forEach((q) => q.refetch());
    },
  };
}
