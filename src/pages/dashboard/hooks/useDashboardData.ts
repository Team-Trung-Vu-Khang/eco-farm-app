import { useMemo } from "react";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useWorkspaceProductionHealthMetric } from "@/features/farm/hooks/useProductionHealthMetrics";
import { useFarmTaskStats } from "@/features/farm-task/hooks/useFarmTasks";
import { farmerZoneTreeData } from "../constants";

export interface DashboardZoneNode {
  id: string;
  name: string;
  description: string;
  totalAreaHa: number;
  coordinates: { lat: number; lng: number };
  centerPoint?: [number, number] | null;
  boundary?: [number, number][] | null;
  areas: {
    id: string;
    name: string;
    totalAreaHa: number;
    centerPoint?: [number, number] | null;
    boundary?: [number, number][] | null;
    plots: {
      id: string;
      name: string;
      areaHa: number;
      status: string;
      sickTrees: number;
      treatingTrees: number;
      centerPoint?: [number, number] | null;
      boundary?: [number, number][] | null;
    }[];
  }[];
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

  // Fallback: calculate centroid if boundary exists
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

export function useDashboardData() {
  // Call parallel React Query API hooks
  const cultivationZonesQuery = useCultivationZones({ params: { page: 0, size: 50 } });
  const regionsQuery = useRegions({ params: { page: 0, size: 50 } });
  const healthMetricQuery = useWorkspaceProductionHealthMetric();
  
  // Directly fetch task statistics from GET /api/farm/tasks/stats
  const taskStatsQuery = useFarmTaskStats();

  // Transform regions/zones API response to Tree Data structure
  const zoneTreeData = useMemo<DashboardZoneNode[]>(() => {
    const apiZones = cultivationZonesQuery.items || [];
    const apiRegions = regionsQuery.items || [];

    // Create lookup maps for regions by id, code, and name
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

    const findMatchingRegion = (z: any): any => {
      if (!z) return null;
      // 1. Check scopes for region reference
      if (Array.isArray(z.scopes)) {
        for (const scope of z.scopes) {
          if (scope.region?.id && regionByIdMap.has(scope.region.id)) {
            return regionByIdMap.get(scope.region.id);
          }
          if (scope.region?.code && regionByCodeMap.has(scope.region.code)) {
            return regionByCodeMap.get(scope.region.code);
          }
        }
      }
      // 2. Check z.regionId / z.region?.id / z.id
      if (z.regionId && regionByIdMap.has(z.regionId))
        return regionByIdMap.get(z.regionId);
      if (z.region?.id && regionByIdMap.has(z.region.id))
        return regionByIdMap.get(z.region.id);
      if (z.id && regionByIdMap.has(z.id))
        return regionByIdMap.get(z.id);

      // 3. Check z.code
      if (z.code && regionByCodeMap.has(z.code))
        return regionByCodeMap.get(z.code);

      // 4. Check z.name
      if (z.name && regionByNameMap.has(z.name.toLowerCase().trim())) {
        return regionByNameMap.get(z.name.toLowerCase().trim());
      }

      return null;
    };

    if (apiZones.length > 0) {
      return apiZones.map((z: any, idx: number) => {
        const matchedRegion = findMatchingRegion(z);
        const sourceForGeometry = matchedRegion || z;

        const center =
          parseCenterPoint(sourceForGeometry) ||
          parseCenterPoint(z) ||
          [13.9833 + idx * 0.02, 108.0];
        const boundary =
          parseBoundary(sourceForGeometry) || parseBoundary(z);

        return {
          id: `ZONE-${z.id || idx + 1}`,
          name: z.name || matchedRegion?.name || `Vùng canh tác #${z.id}`,
          description:
            z.notes ||
            z.note ||
            z.description ||
            matchedRegion?.address ||
            "Vùng canh tác nông nghiệp công nghệ cao",
          totalAreaHa:
            z.totalAreaHa ||
            z.areaHa ||
            z.acreage ||
            matchedRegion?.acreage ||
            0,
          coordinates: { lat: center[0], lng: center[1] },
          centerPoint: center as [number, number],
          boundary,
          areas: (
            z.areas ||
            z.productionAreas ||
            matchedRegion?.productionAreas ||
            matchedRegion?.areas ||
            []
          ).map((a: any, aIdx: number) => {
            const aCenter = parseCenterPoint(a);
            const aBoundary = parseBoundary(a);
            return {
              id: `AREA-${a.id || aIdx + 1}`,
              name: a.name || `Khu vực ${aIdx + 1}`,
              totalAreaHa: a.totalAreaHa || a.areaHa || a.acreage || 0,
              centerPoint: aCenter,
              boundary: aBoundary,
              plots: (a.plots || a.productionUnits || []).map(
                (p: any, pIdx: number) => ({
                  id: `PLOT-${p.id || pIdx + 1}`,
                  name: p.name || `Lô ${pIdx + 1}`,
                  areaHa: p.areaHa || p.acreage || 0,
                  status: p.status || "Đang trồng",
                  sickTrees: p.sickTrees || 0,
                  treatingTrees: p.treatingTrees || 0,
                  centerPoint: parseCenterPoint(p),
                  boundary: parseBoundary(p),
                }),
              ),
            };
          }),
        };
      });
    }

    // Fallback: if apiZones is empty but apiRegions exists, map apiRegions
    if (apiRegions.length > 0) {
      return apiRegions.map((r: any, idx: number) => {
        const center = parseCenterPoint(r) || [13.9833 + idx * 0.02, 108.0];
        const boundary = parseBoundary(r);
        return {
          id: `REGION-${r.id}`,
          name: r.name || `Vùng trồng #${r.id}`,
          description:
            r.note || r.description || r.address || "Vùng quy hoạch nông nghiệp",
          totalAreaHa: r.totalAreaHa || r.areaHa || r.acreage || 0,
          coordinates: { lat: center[0], lng: center[1] },
          centerPoint: center as [number, number],
          boundary,
          areas: (r.areas || r.productionAreas || []).map(
            (a: any, aIdx: number) => {
              const aCenter = parseCenterPoint(a);
              const aBoundary = parseBoundary(a);
              return {
                id: `AREA-${a.id || aIdx + 1}`,
                name: a.name || `Khu vực ${aIdx + 1}`,
                totalAreaHa: a.totalAreaHa || a.areaHa || a.acreage || 0,
                centerPoint: aCenter,
                boundary: aBoundary,
                plots: (a.plots || a.productionUnits || []).map(
                  (p: any, pIdx: number) => ({
                    id: `PLOT-${p.id || pIdx + 1}`,
                    name: p.name || `Lô ${pIdx + 1}`,
                    areaHa: p.areaHa || p.acreage || 0,
                    status: p.status || "Hoạt động",
                    sickTrees: p.sickTrees || 0,
                    treatingTrees: p.treatingTrees || 0,
                    centerPoint: parseCenterPoint(p),
                    boundary: parseBoundary(p),
                  }),
                ),
              };
            },
          ),
        };
      });
    }

    return [];
  }, [cultivationZonesQuery.items, regionsQuery.items]);

  // Aggregate health metrics from API
  const cropHealthMetrics = useMemo(() => {
    const data = healthMetricQuery.data;
    return {
      totalTrees: data?.totalTrees || 15420,
      healthyTrees: data?.healthyTrees || 14800,
      sickTrees: data?.sickTrees || 350,
      treatingTrees: data?.treatingTrees || 270,
    };
  }, [healthMetricQuery.data]);

  // Aggregate task statistics from GET /api/farm/tasks/stats response
  const taskStats = useMemo(() => {
    const item = taskStatsQuery.item;
    if (item) {
      return {
        completed: item.doneTasks ?? 42,
        inProgress: item.doingTasks ?? 14,
        pending: item.todoTasks ?? 8,
        overdue: item.overdueTasks ?? item.cancelledTasks ?? 3,
        total: item.totalTasks ?? 67,
      };
    }

    // Default initial display fallback for testing
    return {
      completed: 1245,
      inProgress: 85,
      pending: 42,
      overdue: 3,
      total: 1372,
    };
  }, [taskStatsQuery.item]);

  const isLoading =
    cultivationZonesQuery.loading ||
    regionsQuery.loading ||
    healthMetricQuery.isLoading ||
    taskStatsQuery.loading;

  return {
    zoneTreeData,
    cropHealthMetrics,
    taskStats,
    isLoading,
    isError: cultivationZonesQuery.isError || taskStatsQuery.isError,
    refetchAll: () => {
      cultivationZonesQuery.refetch();
      regionsQuery.refetch();
      healthMetricQuery.refetch();
      taskStatsQuery.refetch();
    },
  };
}
