import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, MapPin, Layers, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { regionApi, areaApi, plotApi } from "@/features/farm/api/farm.api";
import type {
  FarmWorkflowResponse,
  FarmWorkflowScopeResponse,
} from "@/features/farm-workflow/types/farm-workflow.type";
import type { MockWorkflowItem } from "../../types/diary.types";

type LatLngTuple = [number, number];

export type WorkflowScopeInput =
  | MockWorkflowItem
  | FarmWorkflowResponse
  | (Record<string, unknown> & {
      scopes?: Array<Record<string, unknown>>;
      scopeType?: "REGION" | "AREA" | "PLOT";
      boundary?: Array<
        | [number, number]
        | { latitude?: number; longitude?: number; lat?: number; lng?: number }
      >;
      centerPoint?:
        | [number, number]
        | { latitude?: number; longitude?: number; lat?: number; lng?: number };
    })
  | null;

type CenterPointInput = {
  latitude: number;
  longitude: number;
};

interface WorkflowScopeMapModalProps {
  workflow?: WorkflowScopeInput;
}

interface GeoPointObject {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

type GeoPointInput = [number, number] | GeoPointObject | null | undefined;

const DEFAULT_CENTER: LatLngTuple = [10.762072, 106.661672];

// RedMarker definition matching OverviewTab.tsx
const RedMarker = () =>
  L.divIcon({
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

const MapSync = ({
  boundary,
  centerPoint,
}: {
  boundary?: LatLngTuple[];
  centerPoint: LatLngTuple;
}) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size so Leaflet renders properly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    if (boundary && boundary.length > 0) {
      const bounds = L.latLngBounds(boundary);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [36, 36], animate: true });
        return () => clearTimeout(timer);
      }
    }
    map.setView(centerPoint, 15, { animate: true });
    return () => clearTimeout(timer);
  }, [boundary, centerPoint, map]);

  return null;
};

export function WorkflowScopeMapModal({
  workflow,
}: WorkflowScopeMapModalProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // 1. Resolve active scope item and type
  const scopeItem: FarmWorkflowScopeResponse | Record<string, unknown> | null =
    useMemo(() => {
      if (!workflow) return null;
      if (
        "scopes" in workflow &&
        Array.isArray(workflow.scopes) &&
        workflow.scopes.length > 0
      ) {
        return workflow.scopes[0] as FarmWorkflowScopeResponse;
      }
      if (
        "scope" in workflow &&
        workflow.scope &&
        typeof workflow.scope === "object"
      ) {
        return workflow.scope as Record<string, unknown>;
      }
      return null;
    }, [workflow]);

  const resolvedScopeType: "REGION" | "AREA" | "PLOT" = useMemo(() => {
    if (scopeItem && "scopeType" in scopeItem && scopeItem.scopeType) {
      return scopeItem.scopeType as "REGION" | "AREA" | "PLOT";
    }
    if (workflow && "scopeType" in workflow && workflow.scopeType) {
      return workflow.scopeType as "REGION" | "AREA" | "PLOT";
    }
    if (scopeItem && "plot" in scopeItem && scopeItem.plot) return "PLOT";
    if (workflow && "plotId" in workflow && workflow.plotId) return "PLOT";
    if (scopeItem && "area" in scopeItem && scopeItem.area) return "AREA";
    if (workflow && "areaId" in workflow && workflow.areaId) return "AREA";
    return "REGION";
  }, [scopeItem, workflow]);

  const targetId: number | string | undefined = useMemo(() => {
    if (!scopeItem && !workflow) return undefined;

    const itemObj = (scopeItem || {}) as Record<string, unknown>;
    const wfObj = (workflow || {}) as Record<string, unknown>;

    const getRegionId = () => {
      const regionObj = itemObj.region as { id?: number } | undefined;
      return (
        regionObj?.id ??
        (itemObj.scopeId as number | undefined) ??
        (wfObj.regionId as number | undefined) ??
        (wfObj.scopeId as number | undefined) ??
        (typeof wfObj.id === "number" ? wfObj.id : undefined)
      );
    };

    const getAreaId = () => {
      const areaObj = itemObj.area as { id?: number } | undefined;
      return (
        areaObj?.id ??
        (itemObj.scopeId as number | undefined) ??
        (wfObj.areaId as number | undefined) ??
        (wfObj.scopeId as number | undefined)
      );
    };

    const getPlotId = () => {
      const plotObj = itemObj.plot as { id?: number } | undefined;
      return (
        plotObj?.id ??
        (itemObj.scopeId as number | undefined) ??
        (wfObj.plotId as number | undefined) ??
        (wfObj.scopeId as number | undefined)
      );
    };

    if (resolvedScopeType === "REGION") return getRegionId();
    if (resolvedScopeType === "AREA") return getAreaId();
    if (resolvedScopeType === "PLOT") return getPlotId();
    return (
      (itemObj.scopeId as number | undefined) ??
      (wfObj.scopeId as number | undefined)
    );
  }, [scopeItem, workflow, resolvedScopeType]);

  const scopeDisplayName: string = useMemo(() => {
    const itemObj = (scopeItem || {}) as Record<string, unknown>;
    const wfObj = (workflow || {}) as Record<string, unknown>;

    const regionName = (itemObj.region as { name?: string } | undefined)?.name;
    const areaName = (itemObj.area as { name?: string } | undefined)?.name;
    const plotName = (itemObj.plot as { name?: string } | undefined)?.name;
    const fallbackName =
      (wfObj.scopeName as string | undefined) ||
      (wfObj.name as string | undefined);

    if (resolvedScopeType === "REGION")
      return regionName || fallbackName || "Vùng trồng";
    if (resolvedScopeType === "AREA")
      return areaName || fallbackName || "Khu vực";
    if (resolvedScopeType === "PLOT")
      return plotName || fallbackName || "Lô đất";
    return fallbackName || "Phạm vi canh tác";
  }, [scopeItem, workflow, resolvedScopeType]);

  // 2. Query geo-entity by scopeType and targetId
  const { data: geoEntity, isLoading: isGeoLoading } = useQuery({
    queryKey: ["farm", "scope-geo-detail", resolvedScopeType, targetId],
    queryFn: async () => {
      if (!targetId || !resolvedScopeType) return null;
      const numId = Number(targetId);
      if (isNaN(numId)) return null;

      if (resolvedScopeType === "REGION") {
        return regionApi.getById(numId);
      }
      if (resolvedScopeType === "AREA") {
        return areaApi.getById(numId);
      }
      if (resolvedScopeType === "PLOT") {
        return plotApi.getById(numId);
      }
      return null;
    },
    enabled: Boolean(targetId && resolvedScopeType),
    staleTime: 5 * 60 * 1000,
  });

  // 3. Extract boundary points safely without any
  const boundary: LatLngTuple[] = useMemo(() => {
    const geoObj = geoEntity as { boundary?: GeoPointInput[] } | null;
    const wfObj = workflow as { boundary?: GeoPointInput[] } | null;
    const rawBoundary = geoObj?.boundary || wfObj?.boundary;

    if (!rawBoundary || !Array.isArray(rawBoundary)) return [];

    return rawBoundary
      .map((point: GeoPointInput): LatLngTuple | null => {
        if (Array.isArray(point) && point.length >= 2) {
          const lat = Number(point[0]);
          const lng = Number(point[1]);
          if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
        }
        if (point && typeof point === "object" && !Array.isArray(point)) {
          const lat = point.latitude ?? point.lat;
          const lng = point.longitude ?? point.lng;
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            return [lat, lng];
          }
        }
        return null;
      })
      .filter((point): point is LatLngTuple => Boolean(point));
  }, [geoEntity, workflow]);

  // 4. Determine effective center point safely without any
  const effectiveCenterPoint: LatLngTuple = useMemo(() => {
    const geoObj = geoEntity as { centerPoint?: CenterPointInput } | null;
    const wfObj = workflow as { centerPoint?: CenterPointInput } | null;

    const extractPoint = (input?: CenterPointInput): LatLngTuple | null => {
      if (!input) return null;
      if (Array.isArray(input) && input.length >= 2) {
        const lat = Number(input[0]);
        const lng = Number(input[1]);
        if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
      }
      if (typeof input === "object" && !Array.isArray(input)) {
        const lat = input.latitude;
        const lng = input.longitude;
        if (
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          return [lat, lng];
        }
      }
      return null;
    };

    const entityCenter = extractPoint(geoObj?.centerPoint);
    if (entityCenter) return entityCenter;

    const wfCenter = extractPoint(wfObj?.centerPoint);
    if (wfCenter) return wfCenter;

    if (boundary.length > 0) {
      const sumLat = boundary.reduce((acc, curr) => acc + curr[0], 0);
      const sumLng = boundary.reduce((acc, curr) => acc + curr[1], 0);
      return [sumLat / boundary.length, sumLng / boundary.length];
    }

    return DEFAULT_CENTER;
  }, [geoEntity, workflow, boundary]);

  if (!workflow) return null;

  const renderMapContent = (heightClass = "h-56") => (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-inner group z-0`}
    >
      {/* Loading Overlay */}
      {isGeoLoading && (
        <div className="absolute inset-0 z-[1001] bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Đang tải tọa độ ranh giới...</span>
        </div>
      )}

      <MapContainer
        center={effectiveCenterPoint}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSync boundary={boundary} centerPoint={effectiveCenterPoint} />

        {/* Boundary Polygon */}
        {boundary && boundary.length > 0 && (
          <Polygon
            positions={boundary}
            pathOptions={{
              color: "#059669",
              fillColor: "#10b981",
              fillOpacity: 0.35,
              weight: 3,
            }}
          >
            <Tooltip sticky direction="center" opacity={0.95}>
              <div className="font-bold text-xs text-slate-900">
                {scopeDisplayName}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                {resolvedScopeType === "REGION"
                  ? "Vùng canh tác"
                  : resolvedScopeType === "AREA"
                    ? "Khu vực canh tác"
                    : "Lô đất canh tác"}
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* Center Point Red Marker with Tooltip */}
        <Marker position={effectiveCenterPoint} icon={RedMarker()}>
          <Tooltip sticky direction="top" opacity={0.95}>
            <div style={{ fontWeight: 600, fontSize: 12 }}>
              {scopeDisplayName}
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              Tọa độ trung tâm
            </div>
          </Tooltip>
        </Marker>
      </MapContainer>

      {/* Top Right Fullscreen Button */}
      <button
        type="button"
        onClick={() => setIsFullscreenOpen(true)}
        className="absolute top-3 right-3 z-[1000] h-9 w-9 rounded-xl bg-white shadow-md border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition-all cursor-pointer flex items-center justify-center font-bold"
        title="Phóng to bản đồ xem toàn màn hình"
      >
        <Maximize2 className="h-4.5 w-4.5 text-emerald-600" />
      </button>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-2 right-2 z-[1000] rounded-xl bg-white/95 px-3.5 py-2 shadow-sm border border-slate-200 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-extrabold text-slate-900 truncate">
            {scopeDisplayName}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 px-2 py-0.5"
        >
          {resolvedScopeType === "REGION"
            ? "Vùng trồng"
            : resolvedScopeType === "AREA"
              ? "Khu vực"
              : "Lô đất"}
        </Badge>
      </div>
    </div>
  );

  return (
    <>
      {/* Embedded Map Card */}
      <div className="space-y-2 mt-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            Bản đồ phạm vi áp dụng vụ mùa
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            Tọa độ trung tâm (Chấm đỏ)
          </span>
        </div>
        {renderMapContent("h-56")}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col">
          <DialogHeader className="p-4 px-6 bg-slate-50 border-b shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Bản đồ phạm vi: {scopeDisplayName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 w-full relative z-0">
            {isGeoLoading && (
              <div className="absolute inset-0 z-[1001] bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                <span>Đang tải tọa độ ranh giới...</span>
              </div>
            )}

            <MapContainer
              center={effectiveCenterPoint}
              zoom={15}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapSync boundary={boundary} centerPoint={effectiveCenterPoint} />

              {boundary && boundary.length > 0 && (
                <Polygon
                  positions={boundary}
                  pathOptions={{
                    color: "#16a34a",
                    fillColor: "#22c55e",
                    fillOpacity: 0.35,
                    weight: 4,
                  }}
                />
              )}

              <Marker position={effectiveCenterPoint} icon={RedMarker()}>
                <Tooltip sticky direction="top" opacity={0.95}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>
                    {scopeDisplayName}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    Tọa độ trung tâm
                  </div>
                </Tooltip>
              </Marker>
            </MapContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
