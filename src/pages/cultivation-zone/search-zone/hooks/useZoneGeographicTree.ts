import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { regionApi, areaApi, plotApi } from "@/features/farm/api/farm.api";
import type {
  DashboardZoneNode,
  DashboardScopeNode,
  DashboardAreaNode,
  DashboardPlotNode,
} from "@/pages/dashboard/hooks/useDashboardData";

export const parseCenterPoint = (item: any): [number, number] | null => {
  if (!item) return null;
  const cp = item.centerPoint || item.center;
  if (cp) {
    const lat = Number(cp.latitude ?? cp.lat);
    const lng = Number(cp.longitude ?? cp.lng);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return Math.abs(lat) > 90 ? [lng, lat] : [lat, lng];
    }
  }
  const rootLat = Number(item.latitude ?? item.lat);
  const rootLng = Number(item.longitude ?? item.lng);
  if (!isNaN(rootLat) && !isNaN(rootLng) && rootLat !== 0 && rootLng !== 0) {
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

export const parseBoundary = (item: any): [number, number][] | null => {
  if (!item) return null;
  const raw = item.boundary || item.coordinates || item.polygon;
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
      if (Array.isArray(p) && p.length >= 2) {
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

export function useZoneGeographicTree(
  selectedZoneItem: any | null,
  zoneDetailResponse: any | null,
  workspaceId: number | null,
) {
  const options = useMemo(() => {
    return workspaceId
      ? { headers: { "X-Workspace-Id": String(workspaceId) } }
      : undefined;
  }, [workspaceId]);

  // 1. Identify region, area, plot IDs from zoneDetailResponse.scopes or direct properties
  const { regionIds, directAreaIds, directPlotIds } = useMemo(() => {
    const rSet = new Set<number>();
    const aSet = new Set<number>();
    const pSet = new Set<number>();

    if (zoneDetailResponse) {
      if (zoneDetailResponse.regionId) rSet.add(Number(zoneDetailResponse.regionId));
      if (zoneDetailResponse.region?.id) rSet.add(Number(zoneDetailResponse.region.id));

      if (Array.isArray(zoneDetailResponse.scopes)) {
        zoneDetailResponse.scopes.forEach((s: any) => {
          if (s.region?.id) rSet.add(Number(s.region.id));
          if (s.area?.id) aSet.add(Number(s.area.id));
          if (s.plot?.id) pSet.add(Number(s.plot.id));
        });
      }

      if (Array.isArray(zoneDetailResponse.productionRegions)) {
        zoneDetailResponse.productionRegions.forEach((r: any) => {
          if (r.id) rSet.add(Number(r.id));
        });
      }
      if (Array.isArray(zoneDetailResponse.productionAreas)) {
        zoneDetailResponse.productionAreas.forEach((a: any) => {
          if (a.id) aSet.add(Number(a.id));
        });
      }
    }

    return {
      regionIds: Array.from(rSet),
      directAreaIds: Array.from(aSet),
      directPlotIds: Array.from(pSet),
    };
  }, [zoneDetailResponse]);

  // 2. Fetch Region details sequentially / reactively via useQueries
  const regionQueries = useQueries({
    queries: regionIds.map((id) => ({
      queryKey: ["regionDetail", id, workspaceId],
      queryFn: () => regionApi.getById(id, options),
      enabled: !!id,
    })),
  });

  const detailedRegionMap = useMemo(() => {
    const map = new Map<number, any>();
    regionQueries.forEach((q) => {
      if (q.data && q.data.id) {
        map.set(Number(q.data.id), q.data);
      }
    });
    return map;
  }, [regionQueries]);

  // 3. Collect all Area IDs (from directAreaIds + areas inside fetched regions)
  const allAreaIds = useMemo(() => {
    const aSet = new Set<number>(directAreaIds);
    detailedRegionMap.forEach((r) => {
      const areas = r.areas || r.productionAreas || [];
      areas.forEach((a: any) => {
        if (a.id) aSet.add(Number(a.id));
      });
    });
    return Array.from(aSet);
  }, [directAreaIds, detailedRegionMap]);

  // 4. Fetch Area details
  const areaQueries = useQueries({
    queries: allAreaIds.map((id) => ({
      queryKey: ["areaDetail", id, workspaceId],
      queryFn: () => areaApi.getById(id, options),
      enabled: !!id,
    })),
  });

  const detailedAreaMap = useMemo(() => {
    const map = new Map<number, any>();
    areaQueries.forEach((q) => {
      if (q.data && q.data.id) {
        map.set(Number(q.data.id), q.data);
      }
    });
    return map;
  }, [areaQueries]);

  // 5. Collect all Plot IDs (from directPlotIds + plots inside fetched areas)
  const allPlotIds = useMemo(() => {
    const pSet = new Set<number>(directPlotIds);
    detailedAreaMap.forEach((a) => {
      const plots = a.plots || a.productionUnits || [];
      plots.forEach((p: any) => {
        if (p.id) pSet.add(Number(p.id));
      });
    });
    return Array.from(pSet);
  }, [directPlotIds, detailedAreaMap]);

  // 6. Fetch Plot details
  const plotQueries = useQueries({
    queries: allPlotIds.map((id) => ({
      queryKey: ["plotDetail", id, workspaceId],
      queryFn: () => plotApi.getById(id, options),
      enabled: !!id,
    })),
  });

  const detailedPlotMap = useMemo(() => {
    const map = new Map<number, any>();
    plotQueries.forEach((q) => {
      if (q.data && q.data.id) {
        map.set(Number(q.data.id), q.data);
      }
    });
    return map;
  }, [plotQueries]);

  // 7. Assemble DashboardZoneNode
  const zoneNode = useMemo<DashboardZoneNode | null>(() => {
    if (!selectedZoneItem && !zoneDetailResponse) return null;

    const id = String(selectedZoneItem?.id || zoneDetailResponse?.id || "");
    const name = selectedZoneItem?.name || zoneDetailResponse?.name || "Vùng canh tác";
    const description = selectedZoneItem?.description || zoneDetailResponse?.code || "";
    const totalAreaHa = selectedZoneItem?.acreageHa || zoneDetailResponse?.acreageHa || 0;

    // Build scopes array for DashboardZoneNode
    const builtScopes: DashboardScopeNode[] = regionIds.map((rId) => {
      const rDetail = detailedRegionMap.get(rId);
      const rawAreas = rDetail?.areas || rDetail?.productionAreas || [];

      const builtAreas: DashboardAreaNode[] = rawAreas.map((a: any) => {
        const aDetail = detailedAreaMap.get(Number(a.id)) || a;
        const rawPlots = aDetail?.plots || aDetail?.productionUnits || [];

        const builtPlots: DashboardPlotNode[] = rawPlots.map((p: any) => {
          const pDetail = detailedPlotMap.get(Number(p.id)) || p;
          return {
            id: String(pDetail.id),
            name: pDetail.name || `Lô ${pDetail.id}`,
            areaHa: pDetail.areaHa || pDetail.acreageHa || pDetail.area || 0,
            status: pDetail.status || "ACTIVE",
            isCountable: true,
            sickTrees: pDetail.sickTrees || 0,
            treatingTrees: pDetail.treatingTrees || 0,
            hasPestWarning: !!pDetail.hasPestWarning,
            isTreatingPest: !!pDetail.isTreatingPest,
            cropTypeName: pDetail.cropTypeName || pDetail.crop?.name,
            centerPoint: parseCenterPoint(pDetail),
            boundary: parseBoundary(pDetail),
          };
        });

        return {
          id: String(aDetail.id),
          name: aDetail.name || `Khu vực ${aDetail.id}`,
          totalAreaHa: aDetail.totalAreaHa || aDetail.acreageHa || aDetail.area || 0,
          isCountable: true,
          sickTrees: aDetail.sickTrees || 0,
          treatingTrees: aDetail.treatingTrees || 0,
          hasPestWarning: !!aDetail.hasPestWarning,
          isTreatingPest: !!aDetail.isTreatingPest,
          centerPoint: parseCenterPoint(aDetail),
          boundary: parseBoundary(aDetail),
          plots: builtPlots,
        };
      });

      return {
        id: String(rDetail?.id || rId),
        type: "region" as const,
        name: rDetail?.name || `Vùng ${rId}`,
        totalAreaHa: rDetail?.totalAreaHa || rDetail?.acreageHa || 0,
        isCountable: true,
        centerPoint: parseCenterPoint(rDetail),
        boundary: parseBoundary(rDetail),
        areas: builtAreas,
      };
    });

    // Top-level areas for direct area scopes if any
    const standaloneAreas: DashboardAreaNode[] = directAreaIds
      .filter((aId) => !builtScopes.some((s) => s.areas.some((a) => a.id === String(aId))))
      .map((aId) => {
        const aDetail = detailedAreaMap.get(aId);
        const rawPlots = aDetail?.plots || aDetail?.productionUnits || [];
        const builtPlots: DashboardPlotNode[] = rawPlots.map((p: any) => {
          const pDetail = detailedPlotMap.get(Number(p.id)) || p;
          return {
            id: String(pDetail.id),
            name: pDetail.name || `Lô ${pDetail.id}`,
            areaHa: pDetail.areaHa || pDetail.acreageHa || 0,
            status: pDetail.status || "ACTIVE",
            isCountable: true,
            sickTrees: 0,
            treatingTrees: 0,
            hasPestWarning: false,
            isTreatingPest: false,
            centerPoint: parseCenterPoint(pDetail),
            boundary: parseBoundary(pDetail),
          };
        });
        return {
          id: String(aId),
          name: aDetail?.name || `Khu vực ${aId}`,
          totalAreaHa: aDetail?.totalAreaHa || aDetail?.acreageHa || 0,
          isCountable: true,
          sickTrees: 0,
          treatingTrees: 0,
          hasPestWarning: false,
          isTreatingPest: false,
          centerPoint: parseCenterPoint(aDetail),
          boundary: parseBoundary(aDetail),
          plots: builtPlots,
        };
      });

    const parsedZoneCenter =
      parseCenterPoint(zoneDetailResponse) ||
      parseCenterPoint(selectedZoneItem) ||
      [11.53, 106.88];
    const parsedZoneBoundary =
      parseBoundary(zoneDetailResponse) || parseBoundary(selectedZoneItem);

    return {
      id,
      name,
      description,
      totalAreaHa,
      isCountable: true,
      coordinates: { lat: parsedZoneCenter[0], lng: parsedZoneCenter[1] },
      centerPoint: parsedZoneCenter,
      boundary: parsedZoneBoundary,
      scopes: builtScopes,
      areas: standaloneAreas,
    };
  }, [
    selectedZoneItem,
    zoneDetailResponse,
    regionIds,
    directAreaIds,
    detailedRegionMap,
    detailedAreaMap,
    detailedPlotMap,
  ]);

  const isLoading =
    regionQueries.some((q) => q.isLoading) ||
    areaQueries.some((q) => q.isLoading) ||
    plotQueries.some((q) => q.isLoading);

  return { zoneNode, isLoading };
}
