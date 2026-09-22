import React, { useState, useMemo, useEffect } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Layers,
  MapPin,
  Target,
  Contact,
  Tag,
  Sprout,
  Activity,
  Hash,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  Tooltip,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useQueries } from "@tanstack/react-query";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { areaApi, plotApi } from "@/features/farm/api/farm.api";
import type { CultivationRegionDetailBodyCommonProps } from "./types";
import styles from "../../styles.module.css";

const getCoordinatePair = (c: any): [number, number] | null => {
  if (!c) return null;
  if (Array.isArray(c)) {
    const first = Number(c[0]);
    const second = Number(c[1]);
    if (isNaN(first) || isNaN(second)) return null;
    if (Math.abs(first) > 90) {
      return [second, first];
    }
    return [first, second];
  }
  const lat = Number(c.lat ?? c.latitude ?? c.Latitude);
  const lng = Number(c.lng ?? c.longitude ?? c.Longitude);
  if (isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
};

const getBoundaryPoints = (item: any): any[] | undefined => {
  if (!item) return undefined;
  const raw = item.boundary || item.coordinates;
  if (!raw) return undefined;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return Array.isArray(raw) && raw.length > 0 ? raw : undefined;
};

const getCenterPoint = (item: any): [number, number] | null => {
  if (!item) return null;
  return getCoordinatePair(item.centerPoint || item.center || item);
};

const RedMarker = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; background-color: #ef4444; border-radius: 50%; opacity: 0.3; transform: scale(1.4); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; width: 14px; height: 14px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      </style>
    `,
    className: "custom-center-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const MapController = ({
  center,
  zoom,
}: {
  center: { lat: number; lng: number };
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const MapResizeListener = () => {
  const map = useMap();
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [map]);

  return null;
};

const MapBoundsSync = ({
  bounds,
  centerPoint,
}: {
  bounds: [number, number][] | null;
  centerPoint: [number, number] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (centerPoint) {
      map.setView(centerPoint, 15);
    }
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      } else if (centerPoint) {
        map.setView(centerPoint, 15);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [bounds, centerPoint, map]);
  return null;
};

const childEntities = (areaGroup: any) =>
  (areaGroup.entities || []).filter((e: any) => e.typeCode !== "region");

const visibleAreaGroups = (group: any) =>
  Object.values(group.areas).filter(
    (areaGroup: any) => areaGroup.area || childEntities(areaGroup).length > 0,
  );

type ScopeAccent = "primary" | "slate" | "emerald";

const SCOPE_ACCENTS: Record<ScopeAccent, { label: string; iconWrap: string }> =
  {
    primary: {
      label: "text-primary",
      iconWrap: "bg-primary/10 text-primary",
    },
    slate: {
      label: "text-slate-400",
      iconWrap: "bg-slate-100 text-slate-500",
    },
    emerald: {
      label: "text-emerald-600",
      iconWrap: "bg-emerald-50 text-emerald-600",
    },
  };

const ScopeNodeCard = ({
  label,
  name,
  icon,
  accent,
}: {
  label: string;
  name: string;
  icon: React.ReactNode;
  accent: ScopeAccent;
}) => {
  const tone = SCOPE_ACCENTS[accent];

  return (
    <div className="flex items-start gap-2.5 py-1">
      <span className={cn("mt-0.5 shrink-0", tone.label)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "mb-0.5 text-[10px] font-bold uppercase tracking-wider leading-none",
            tone.label,
          )}
        >
          {label}
        </div>
        <div className="text-sm font-semibold text-slate-900 break-words">
          {name}
        </div>
      </div>
    </div>
  );
};

export const CultivationRegionOverviewTab = ({
  area,
  details,
}: CultivationRegionDetailBodyCommonProps) => {
  const [scopeMapView, setScopeMapView] = useState({
    center: { lat: 11.53, lng: 106.88 },
    zoom: 13,
  });

  // Fetch regions from API
  const { items: regions = [] } = useRegions({
    params: { page: 0, size: 100 },
  });

  const areaIds = useMemo(() => {
    if (!details?.selectedEntities) return [];
    const ids = new Set<number>();
    for (const e of details.selectedEntities) {
      if (e.typeCode === "area" && e.id) ids.add(Number(e.id));
      if (e.typeCode === "plot" && e.areaId) ids.add(Number(e.areaId));
    }
    return Array.from(ids);
  }, [details?.selectedEntities]);

  const plotIds = useMemo(() => {
    if (!details?.selectedEntities) return [];
    const ids = new Set<number>();
    for (const e of details.selectedEntities) {
      if (e.typeCode === "plot" && e.id) ids.add(Number(e.id));
    }
    return Array.from(ids);
  }, [details?.selectedEntities]);

  const areaQueries = useQueries({
    queries: areaIds.map((aid) => ({
      queryKey: ["farm", "areas", "detail", aid],
      queryFn: () => areaApi.getById(aid),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const plotQueries = useQueries({
    queries: plotIds.map((pid) => ({
      queryKey: ["farm", "plots", "detail", pid],
      queryFn: () => plotApi.getById(pid),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    for (const r of regions) {
      regionById.set(String(r.id), r);
      const childAreas = r.areas || (r as any).subAreas || [];
      for (const a of childAreas) {
        areaById.set(String(a.id), { area: a, region: r });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region: r });
        }
      }
    }

    areaQueries.forEach((q) => {
      if (q.data) {
        const fullArea = q.data;
        const aKey = String(fullArea.id);
        const existing = areaById.get(aKey);
        const reg = fullArea.region || existing?.region;
        areaById.set(aKey, { area: fullArea, region: reg });

        if (reg) {
          const rKey = String(reg.id);
          const existingRegion = regionById.get(rKey) || reg;
          const updatedAreas = (existingRegion.areas || []).map((a: any) =>
            String(a.id) === aKey ? fullArea : a,
          );
          regionById.set(rKey, { ...existingRegion, areas: updatedAreas });
        }
      }
    });

    plotQueries.forEach((q) => {
      if (q.data) {
        const fullPlot = q.data;
        const pKey = String(fullPlot.id);
        const existing = plotById.get(pKey);
        const fullArea = fullPlot.area || existing?.area;
        const reg = fullArea?.region || existing?.region;
        plotById.set(pKey, { plot: fullPlot, area: fullArea, region: reg });
      }
    });

    return { regionById, areaById, plotById };
  }, [regions, areaQueries, plotQueries]);

  const focusScopeMapToCoordinates = (coordinates?: any[]) => {
    if (!coordinates?.length) return;

    const parsedCoords = coordinates
      .map(getCoordinatePair)
      .filter((p): p is [number, number] => p !== null);

    if (!parsedCoords.length) return;

    const lats = parsedCoords.map((p) => p[0]);
    const lngs = parsedCoords.map((p) => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const span = Math.max(maxLat - minLat, maxLng - minLng);

    const nextCenter = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };

    const nextZoom =
      span > 1
        ? 8
        : span > 0.5
          ? 9
          : span > 0.2
            ? 10
            : span > 0.1
              ? 11
              : span > 0.05
                ? 12
                : span > 0.02
                  ? 13
                  : span > 0.01
                    ? 14
                    : 15;

    setScopeMapView({ center: nextCenter, zoom: nextZoom });
  };

  const scopeMapData = useMemo(() => {
    if (!area) return null;

    const explicitRegionIds = new Set<string>();
    const explicitAreaIds = new Set<string>();
    const explicitPlotIds = new Set<string>();

    const regionsMap = new Map<string, { region: any; explicit: boolean }>();
    const areasMap = new Map<string, { area: any; explicit: boolean }>();
    const plotsMap = new Map<string, { plot: any; explicit: boolean }>();

    const addRegion = (r: any, explicit: boolean) => {
      const key = String(r.id);
      const existing = regionsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      regionsMap.set(key, { region: r, explicit });
    };

    const addArea = (a: any, explicit: boolean) => {
      const key = String(a.id);
      const existing = areasMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      areasMap.set(key, { area: a, explicit });
    };

    const addPlot = (p: any, explicit: boolean) => {
      const key = String(p.id);
      const existing = plotsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      plotsMap.set(key, { plot: p, explicit });
    };

    for (const entity of details.selectedEntities || []) {
      const id = String(entity.id);
      if (entity.typeCode === "region") {
        const reg = regionIndex.regionById.get(id);
        if (reg) {
          explicitRegionIds.add(String(reg.id));
          addRegion(reg, true);
          const childAreas = reg.areas || reg.subAreas || [];
          for (const a of childAreas) {
            addArea(a, false);
            for (const p of a.plots || []) {
              addPlot(p, false);
            }
          }
        }
      } else if (entity.typeCode === "area") {
        const areaHit = regionIndex.areaById.get(id);
        if (areaHit) {
          explicitAreaIds.add(String(areaHit.area.id));
          addRegion(areaHit.region, false);
          addArea(areaHit.area, true);
          for (const p of areaHit.area.plots || []) {
            addPlot(p, false);
          }
        }
      } else if (entity.typeCode === "plot") {
        const plotHit = regionIndex.plotById.get(id);
        if (plotHit) {
          explicitPlotIds.add(String(plotHit.plot.id));
          addRegion(plotHit.region, false);
          addArea(plotHit.area, false);
          addPlot(plotHit.plot, true);
        }
      }
    }

    const regionsToRender = Array.from(regionsMap.values());
    const areasToRender = Array.from(areasMap.values());
    const plotsToRender = Array.from(plotsMap.values());

    const allCoords: [number, number][] = [];

    for (const r of regionsToRender) {
      const coords = getBoundaryPoints(r.region);
      if (coords) {
        coords.forEach((c: any) => {
          const pair = getCoordinatePair(c);
          if (pair) allCoords.push(pair);
        });
      }
    }
    for (const a of areasToRender) {
      const coords = getBoundaryPoints(a.area);
      if (coords) {
        coords.forEach((c: any) => {
          const pair = getCoordinatePair(c);
          if (pair) allCoords.push(pair);
        });
      }
    }
    for (const p of plotsToRender) {
      const coords = getBoundaryPoints(p.plot);
      if (coords) {
        coords.forEach((c: any) => {
          const pair = getCoordinatePair(c);
          if (pair) allCoords.push(pair);
        });
      }
    }

    const bounds = allCoords.length > 0 ? allCoords : null;

    let centerPoint: [number, number] | null = null;
    for (const r of regionsToRender) {
      const cp = getCenterPoint(r.region);
      if (cp) {
        centerPoint = cp;
        break;
      }
    }
    if (!centerPoint) {
      for (const a of areasToRender) {
        const cp = getCenterPoint(a.area);
        if (cp) {
          centerPoint = cp;
          break;
        }
      }
    }
    if (!centerPoint && allCoords.length > 0) {
      const sumLat = allCoords.reduce((acc, curr) => acc + curr[0], 0);
      const sumLng = allCoords.reduce((acc, curr) => acc + curr[1], 0);
      centerPoint = [sumLat / allCoords.length, sumLng / allCoords.length];
    }

    return {
      regions: regionsToRender,
      areas: areasToRender,
      plots: plotsToRender,
      bounds,
      centerPoint,
      explicitRegionIds,
      explicitAreaIds,
      explicitPlotIds,
    };
  }, [area, details, regionIndex]);

  const ScopeMapPolygons = () => {
    if (!scopeMapData) return null;

    return (
      <>
        {scopeMapData.regions.map(({ region, explicit }) => {
          const coords = getBoundaryPoints(region);
          if (!coords) return null;
          const positions = coords
            .map(getCoordinatePair)
            .filter((p): p is [number, number] => p !== null);
          if (positions.length < 3) return null;
          return (
            <Polygon
              key={`scope-region-${region.id}`}
              positions={positions}
              pathOptions={{
                color: "#3b82f6",
                weight: explicit ? 2.5 : 2,
                fillColor: "#3b82f6",
                fillOpacity: explicit ? 0.08 : 0,
              }}
              eventHandlers={{
                click: () => {
                  focusScopeMapToCoordinates(coords);
                },
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#1e293b" }}
                >
                  {region.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Vùng trồng
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {scopeMapData.areas.map(({ area: a, explicit }) => {
          const coords = getBoundaryPoints(a);
          if (!coords) return null;
          const positions = coords
            .map(getCoordinatePair)
            .filter((p): p is [number, number] => p !== null);
          if (positions.length < 3) return null;
          return (
            <Polygon
              key={`scope-area-${a.id}`}
              positions={positions}
              pathOptions={{
                color: "#10b981",
                weight: explicit ? 2.5 : 1.75,
                fillColor: "#10b981",
                fillOpacity: explicit ? 0.12 : 0.06,
              }}
              eventHandlers={{
                click: () => {
                  focusScopeMapToCoordinates(coords);
                },
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#1e293b" }}
                >
                  {a.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Khu vực
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {scopeMapData.plots.map(({ plot: p, explicit }) => {
          const coords = getBoundaryPoints(p);
          if (!coords) return null;
          const positions = coords
            .map(getCoordinatePair)
            .filter((p): p is [number, number] => p !== null);
          if (positions.length < 3) return null;
          return (
            <Polygon
              key={`scope-plot-${p.id}`}
              positions={positions}
              pathOptions={{
                color: "#f59e0b",
                weight: explicit ? 2.5 : 1.5,
                fillColor: "#f59e0b",
                fillOpacity: explicit ? 0.18 : 0.08,
              }}
              eventHandlers={{
                click: () => {
                  focusScopeMapToCoordinates(coords);
                },
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#1e293b" }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Lô đất
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
      </>
    );
  };

  return (
    <div className={cn(styles.overviewGrid, styles.noEnterprise)}>
      {/* Scope Card on Left */}
      <Card
        className={cn(
          styles.areaScope,
          "border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-150",
        )}
      >
        <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between shrink-0">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-base">Phạm vi địa lý</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <div className="divide-y divide-slate-100 px-4">
            {Object.values(details.groupedSelections).map((group: any) => (
              <div key={group.region.id} className="space-y-2 py-3">
                {/* Level 1: geographic region */}
                <ScopeNodeCard
                  label="Vùng địa lý"
                  name={group.region.name}
                  icon={<MapPin className="h-4.5 w-4.5" />}
                  accent="primary"
                />

                {area.scope !== "region" && (
                  <div className="ml-4 space-y-3 border-l-2 border-slate-100 pl-5">
                    {visibleAreaGroups(group).map((areaGroup: any) => (
                      <div
                        key={areaGroup.area?.id || "none"}
                        className="relative space-y-3"
                      >
                        <div className="absolute -left-5.5 top-6 h-px w-5 bg-slate-200" />

                        {areaGroup.area ? (
                          <>
                            {/* Level 2: area */}
                            <ScopeNodeCard
                              label="Khu vực"
                              name={areaGroup.area.name}
                              icon={<Layers className="h-4 w-4" />}
                              accent="slate"
                            />

                            {/* Level 3: plots */}
                            {(areaGroup.entities || []).filter(
                              (e: any) => e?.typeCode === "plot",
                            ).length > 0 && (
                              <div className="ml-4 space-y-3 border-l-2 border-slate-100 pl-5">
                                {(areaGroup.entities || [])
                                  .filter((e: any) => e?.typeCode === "plot")
                                  .map((plot: any) => (
                                    <div key={plot.id} className="relative">
                                      <div className="absolute -left-5.5 top-6 h-px w-5 bg-slate-200" />
                                      <ScopeNodeCard
                                        label="Lô đất"
                                        name={plot.name}
                                        icon={
                                          <Target className="h-3.5 w-3.5" />
                                        }
                                        accent="emerald"
                                      />
                                    </div>
                                  ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-3">
                            {(areaGroup.entities || []).map((entity: any) => (
                              <ScopeNodeCard
                                key={entity.id}
                                label={entity.type}
                                name={entity.name}
                                icon={
                                  entity.typeCode === "region" ? (
                                    <MapPin className="h-3.5 w-3.5" />
                                  ) : (
                                    <Target className="h-3.5 w-3.5" />
                                  )
                                }
                                accent={
                                  entity.typeCode === "region"
                                    ? "primary"
                                    : "emerald"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card on Top Right */}
      <Card className={cn(styles.areaInfo, "overflow-hidden border")}>
        <CardHeader className="border-b bg-slate-50 py-3 px-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Contact className="w-4 h-4 text-primary" />
            <span className="text-base">Thông tin chi tiết vùng trồng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1 uppercase tracking-wider font-bold">
                <Tag className="w-3.5 h-3.5 text-primary/70" />
                Tên vùng
              </div>
              <div className="font-bold text-slate-900 leading-tight text-sm">
                {area.name}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1 uppercase tracking-wider font-bold">
                <Hash className="w-3.5 h-3.5 text-blue-500/70" />
                Mã số ID
              </div>
              <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs">
                <span className="font-mono text-xs font-bold">{area.id}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1 uppercase tracking-wider font-bold">
                <Sprout className="w-3.5 h-3.5 text-emerald-600/70" />
                Diện tích canh tác
              </div>
              <div className="font-bold text-base text-emerald-600 flex items-baseline gap-1">
                {(details.totalArea * 0.9).toFixed(1)}
                <span className="text-xs font-medium text-muted-foreground">
                  ha
                </span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1 uppercase tracking-wider font-bold">
                <Activity className="w-3.5 h-3.5 text-purple-600/70" />
                Cập nhật sức khỏe
              </div>
              <div className="mt-0.5">
                <Badge
                  variant="outline"
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {area.healthUpdateMode === "individual" ||
                  area.healthUpdateMode === "INDIVIDUAL"
                    ? "Theo cá thể từng cây"
                    : "Theo phạm vi vùng"}
                </Badge>
              </div>
            </div>
          </div>

          {area.note && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-xs text-muted-foreground mb-0.5">
                Ghi chú
              </div>
              <p className="text-slate-700 text-xs">{area.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map visualization on Bottom Right */}
      <div
        className={cn(
          styles.areaMap,
          "rounded-xl z-10 min-h-[420px] h-full w-full overflow-hidden border border-slate-100 bg-slate-50 relative shadow-xs aspect-video",
        )}
      >
        <MapContainer
          center={[scopeMapView.center.lat, scopeMapView.center.lng]}
          zoom={scopeMapView.zoom}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <MapController
            center={scopeMapView.center}
            zoom={scopeMapView.zoom}
          />
          <MapResizeListener />
          <MapBoundsSync
            bounds={scopeMapData?.bounds ?? null}
            centerPoint={scopeMapData?.centerPoint ?? null}
          />
          <ScopeMapPolygons />
          {scopeMapData?.centerPoint && (
            <Marker position={scopeMapData.centerPoint} icon={RedMarker()}>
              <Tooltip sticky direction="top" opacity={0.95}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>
                  {details.region?.name || area.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Tọa độ trung tâm
                </div>
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
