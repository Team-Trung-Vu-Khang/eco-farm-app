import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MapPin,
  Layers,
  Globe,
  Scale3d,
  FileText,
  Award,
  Phone,
  Mail,
  User,
  Hash,
  Maximize2,
  X,
  Target,
  Contact,
  Tag,
  Sprout,
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
import { DISTRICTS, PROVINCES } from "../../../../region-chart/constants";
import styles from "../../styles.module.css";
import type { CultivationRegionDetails } from "../../useCultivationRegionDetail";

interface OverviewTabProps {
  area: any;
  details: CultivationRegionDetails;
  regionIndex: any;
}

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
  return item.boundary || item.coordinates;
};
const getCenterPoint = (item: any): [number, number] | null => {
  if (!item) return null;
  return getCoordinatePair(item.centerPoint || item.center);
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
    // Invalidate Leaflet map size on render/update to ensure correct drawing of layers/markers
    map.invalidateSize();

    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (centerPoint) {
      map.setView(centerPoint, 15);
    }

    // Schedule layout recalculation to run after the CSS transition of Dialog finishes (approx 300ms)
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

export const OverviewTab = ({
  area,
  details,
  regionIndex,
}: OverviewTabProps) => {
  const showEnterprise = false;
  const [isScopeMapExpanded, setIsScopeMapExpanded] = useState(false);

  const [scopeMapView, setScopeMapView] = useState({
    center: { lat: 11.53, lng: 106.88 },
    zoom: 13,
  });

  const formatFullAddress = (reg: any) => {
    if (!reg) return "";
    const p = PROVINCES.find((prov) => prov.id === reg.provinceId)?.name || "";
    const d = DISTRICTS.find((dist) => dist.id === reg.districtId)?.name || "";
    const w = reg.ward || "";
    const a = reg.address || "";
    return [a, w, d, p].filter(Boolean).join(", ");
  };

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
    if (allCoords.length === 0) {
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

    // --- CONFIGURATION FLAG ---
    // Set to true to ONLY render boundaries matching the exact scope level (region, area, or plot)
    // Set to false to render the entire hierarchy of region > area > plot
    const RENDER_BY_SCOPE_ONLY = false;

    const showRegions = !RENDER_BY_SCOPE_ONLY || area.scope === "region";
    const showAreas = !RENDER_BY_SCOPE_ONLY || area.scope === "area";
    const showPlots = !RENDER_BY_SCOPE_ONLY || area.scope === "plot";

    return (
      <>
        {showRegions &&
          scopeMapData.regions.map(({ region, explicit }) => {
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
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: "1.4",
                      color: "#1e293b",
                    }}
                  >
                    {region.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Vùng chăn nuôi
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {showAreas &&
          scopeMapData.areas.map(({ area: a, explicit }) => {
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
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: "1.4",
                      color: "#1e293b",
                    }}
                  >
                    {a.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Khu vực
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {showPlots &&
          scopeMapData.plots.map(({ plot: p, explicit }) => {
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
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: "1.4",
                      color: "#1e293b",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Chuồng/Lô
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
      </>
    );
  };

  return (
    <div
      className={cn(styles.overviewGrid, {
        [styles.noEnterprise]: !showEnterprise,
      })}
    >
      {/* Enterprise Card */}
      {showEnterprise && (
        <div className={styles.areaEnterprise}>
          {showEnterprise && details.enterprise && (
            <Card className="h-fit overflow-hidden relative shadow-md">
              <div className="h-50 bg-gray-100 flex items-center justify-center relative">
                <img
                  src={
                    details.enterprise.image ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                  }
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 z-10">
                  <div
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg rounded-bl-xl",
                      details.enterprise.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-500",
                    )}
                  >
                    {details.enterprise.status === "active"
                      ? "Đang hoạt động"
                      : "Dừng hoạt động"}
                  </div>
                </div>
              </div>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-20 h-20 -mt-12 rounded-full border-4 border-background bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                  {details.enterprise.image ? (
                    <img
                      src={details.enterprise.image}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {(
                        details.enterprise.brandName ||
                        details.enterprise.name ||
                        "?"
                      ).charAt(0)}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  {details.enterprise.brandName || details.enterprise.name}
                  {details.enterprise.status === "active" && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Mã ĐKKD: {details.enterprise.code || "Chưa cập nhật"}
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                <Separator className="mb-4" />
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {formatFullAddress(details.enterprise)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Đại diện: {details.enterprise.representative || "---"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{details.enterprise.phone || "---"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {details.enterprise.email ? (
                      <a
                        href={`mailto:${details.enterprise.email}`}
                        className="hover:underline hover:text-primary transition-colors"
                      >
                        {details.enterprise.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </div>
                  {details.enterprise.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={details.enterprise.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-primary transition-colors text-blue-600"
                      >
                        {details.enterprise.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Scope Card */}
      <Card
        className={cn(
          styles.areaScope,
          "border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-150",
        )}
      >
        <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between shrink-0">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-lg">
              Phạm vi vùng chăn nuôi ({details.selectedEntities.length} mục)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <div className="p-6 flex">
            <div className="space-y-8 flex-4">
              {Object.values(details.groupedSelections).map((group: any) => (
                <div key={group.region.id} className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      focusScopeMapToCoordinates(
                        getBoundaryPoints(
                          regionIndex.regionById.get(String(group.region.id)),
                        ) || getBoundaryPoints(group.region),
                      );
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                        Vùng chăn nuôi
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {group.region.name}
                      </div>
                    </div>
                  </button>

                  {area.scope !== "region" && (
                    <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                      {Object.values(group.areas).map((areaGroup: any) => (
                        <div
                          key={areaGroup.area?.id || "none"}
                          className="relative"
                        >
                          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                          {areaGroup.area ? (
                            <>
                              <button
                                type="button"
                                className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                onClick={() =>
                                  focusScopeMapToCoordinates(
                                    getBoundaryPoints(
                                      regionIndex.areaById.get(
                                        String(areaGroup.area.id),
                                      )?.area,
                                    ) || getBoundaryPoints(areaGroup.area),
                                  )
                                }
                              >
                                <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                  <Layers className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                    Khu vực
                                  </div>
                                  <div className="text-sm font-bold text-slate-900">
                                    {areaGroup.area.name}
                                  </div>
                                </div>
                              </button>

                              <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                {(areaGroup.entities || [])
                                  .filter((e: any) => e?.typeCode === "plot")
                                  .map((plot: any) => (
                                    <button
                                      key={plot.id}
                                      type="button"
                                      className="relative flex items-center gap-3 py-1 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                      onClick={() =>
                                        focusScopeMapToCoordinates(
                                          getBoundaryPoints(
                                            regionIndex.plotById.get(
                                              String(plot.id),
                                            )?.plot,
                                          ) || getBoundaryPoints(plot),
                                        )
                                      }
                                    >
                                      <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                      <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs shrink-0">
                                        <Target className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                          Chuồng/Lô
                                        </div>
                                        <div className="text-xs font-bold text-slate-800 truncate">
                                          {plot.name}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                {areaGroup.entities.some(
                                  (e: any) => e.typeCode === "area",
                                ) && (
                                  <div className="flex items-center gap-3 py-1 relative">
                                    <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                    >
                                      Đã chọn toàn bộ khu vực
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              {areaGroup.entities.map((entity: any) => (
                                <button
                                  key={entity.id}
                                  type="button"
                                  className="relative flex items-center gap-3 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                  onClick={() => {
                                    const ent =
                                      entity.typeCode === "region"
                                        ? regionIndex.regionById.get(
                                            String(entity.id),
                                          )
                                        : entity.typeCode === "area"
                                          ? regionIndex.areaById.get(
                                              String(entity.id),
                                            )?.area
                                          : regionIndex.plotById.get(
                                              String(entity.id),
                                            )?.plot;
                                    focusScopeMapToCoordinates(
                                      getBoundaryPoints(ent) ||
                                        getBoundaryPoints(entity),
                                    );
                                  }}
                                >
                                  <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                  <div
                                    className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs",
                                      entity.typeCode === "region"
                                        ? "bg-primary"
                                        : "bg-green-500",
                                    )}
                                  >
                                    {entity.typeCode === "region" ? (
                                      <MapPin className="w-4 h-4" />
                                    ) : (
                                      <Target className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div>
                                    <div
                                      className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
                                        entity.typeCode === "region"
                                          ? "text-primary"
                                          : "text-green-600",
                                      )}
                                    >
                                      {entity.type}
                                    </div>
                                    <div className="text-xs font-bold text-slate-800">
                                      {entity.name}
                                    </div>
                                  </div>
                                </button>
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
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className={cn(styles.areaInfo, "overflow-hidden border")}>
        <CardHeader className="border-b bg-slate-50 py-3 px-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Contact className="w-4 h-4 text-primary" />
            <span className="text-lg">Thông tin chi tiết vùng chăn nuôi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                <Tag className="w-3.5 h-3.5 text-primary/70" />
                Tên vùng
              </div>
              <div className="font-bold text-slate-900 leading-tight">
                {area.name}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                <Hash className="w-3.5 h-3.5 text-blue-500/70" />
                Mã số ID
              </div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shadow-sm transition-all hover:bg-blue-100/50">
                <span className="font-mono text-xs font-bold">{area.id}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                <Sprout className="w-3.5 h-3.5 text-green-600/70" />
                Diện tích chăn nuôi
              </div>
              <div className="font-bold text-lg text-green-600 flex items-baseline gap-1">
                {(details.totalArea * 0.9).toFixed(1)}
                <span className="text-xs font-medium text-muted-foreground">
                  ha
                </span>
              </div>
            </div>
          </div>

          {area.note && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="text-sm text-muted-foreground mb-1">Ghi chú</div>
              <p className="mt-1 text-slate-700 text-sm">{area.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map visualization */}
      <div
        className={cn(
          styles.areaMap,
          "rounded-xl z-10 min-h-[65vh] h-full w-full overflow-hidden border border-slate-100 bg-slate-50 relative shadow-sm aspect-video",
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

        <button
          type="button"
          onClick={() => setIsScopeMapExpanded(true)}
          className="absolute top-3 right-3 z-[1000] p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-white text-slate-600 transition-all active:scale-95"
          aria-label="Mở rộng bản đồ"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Expanded Map Dialog */}
      <Dialog open={isScopeMapExpanded} onOpenChange={setIsScopeMapExpanded}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-10000">
          <DialogHeader className="sr-only">
            <DialogTitle>Bản đồ phạm vi vùng chăn nuôi</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex-1 h-[50vh] md:h-auto relative bg-slate-100">
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
                  <Marker
                    position={scopeMapData.centerPoint}
                    icon={RedMarker()}
                  >
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

            <div className="md:w-[360px] h-[300px] md:h-full bg-white border-t md:border-t-0 md:border-l border-slate-100 flex flex-col overflow-hidden shrink-0">
              <div className="px-5 pt-5 pb-4 border-b bg-slate-50/60">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  Phạm vi địa lý
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Bấm vào từng cấp để tự zoom bản đồ.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto split-scrollbar p-5">
                <div className="space-y-8">
                  {Object.values(details.groupedSelections).map(
                    (group: any) => (
                      <div key={group.region.id} className="relative">
                        <button
                          type="button"
                          className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                          onClick={() =>
                            focusScopeMapToCoordinates(
                              getBoundaryPoints(
                                regionIndex.regionById.get(
                                  String(group.region.id),
                                ),
                              ) || getBoundaryPoints(group.region),
                            )
                          }
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                              Vùng chăn nuôi
                            </div>
                            <div className="text-sm font-bold text-slate-900 truncate">
                              {group.region.name}
                            </div>
                          </div>
                        </button>

                        {area.scope !== "region" && (
                          <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                            {Object.values(group.areas).map(
                              (areaGroup: any) => (
                                <div
                                  key={areaGroup.area?.id || "none"}
                                  className="relative"
                                >
                                  <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                                  {areaGroup.area ? (
                                    <>
                                      <button
                                        type="button"
                                        className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                        onClick={() =>
                                          focusScopeMapToCoordinates(
                                            getBoundaryPoints(
                                              regionIndex.areaById.get(
                                                String(areaGroup.area.id),
                                              )?.area,
                                            ) ||
                                              getBoundaryPoints(areaGroup.area),
                                          )
                                        }
                                      >
                                        <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                          <Layers className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                            Khu vực
                                          </div>
                                          <div className="text-sm font-bold text-slate-900 truncate">
                                            {areaGroup.area.name}
                                          </div>
                                        </div>
                                      </button>

                                      <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                        {(areaGroup.entities || [])
                                          .filter(
                                            (e: any) => e?.typeCode === "plot",
                                          )
                                          .map((plot: any) => (
                                            <button
                                              type="button"
                                              key={plot.id}
                                              className="relative flex items-center gap-3 py-1 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                              onClick={() =>
                                                focusScopeMapToCoordinates(
                                                  getBoundaryPoints(
                                                    regionIndex.plotById.get(
                                                      String(plot.id),
                                                    )?.plot,
                                                  ) || getBoundaryPoints(plot),
                                                )
                                              }
                                            >
                                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs shrink-0">
                                                <Target className="w-4 h-4" />
                                              </div>
                                              <div className="min-w-0">
                                                <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                                  Chuồng/Lô
                                                </div>
                                                <div className="text-xs font-bold text-slate-800 truncate">
                                                  {plot.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}

                                        {(areaGroup.entities || []).some(
                                          (e: any) => e?.typeCode === "area",
                                        ) && (
                                          <div className="flex items-center gap-3 py-1 relative">
                                            <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                            <Badge
                                              variant="outline"
                                              className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                            >
                                              Đã chọn toàn bộ khu vực
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="space-y-4">
                                      {(areaGroup.entities || []).map(
                                        (entity: any) => (
                                          <button
                                            type="button"
                                            key={entity.id}
                                            className="relative flex items-center gap-3 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                            onClick={() => {
                                              const ent =
                                                entity.typeCode === "region"
                                                  ? regionIndex.regionById.get(
                                                      String(entity.id),
                                                    )
                                                  : entity.typeCode === "area"
                                                    ? regionIndex.areaById.get(
                                                        String(entity.id),
                                                      )?.area
                                                    : regionIndex.plotById.get(
                                                        String(entity.id),
                                                      )?.plot;
                                              focusScopeMapToCoordinates(
                                                getBoundaryPoints(ent) ||
                                                  getBoundaryPoints(entity),
                                              );
                                            }}
                                          >
                                            <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                            <div
                                              className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0",
                                                entity.typeCode === "region"
                                                  ? "bg-primary"
                                                  : "bg-green-500",
                                              )}
                                            >
                                              {entity.typeCode === "region" ? (
                                                <MapPin className="w-4 h-4" />
                                              ) : (
                                                <Target className="w-4 h-4" />
                                              )}
                                            </div>
                                            <div className="min-w-0">
                                              <div
                                                className={cn(
                                                  "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
                                                  entity.typeCode === "region"
                                                    ? "text-primary"
                                                    : "text-green-600",
                                                )}
                                              >
                                                {entity.type}
                                              </div>
                                              <div className="text-xs font-bold text-slate-800 truncate">
                                                {entity.name}
                                              </div>
                                            </div>
                                          </button>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
