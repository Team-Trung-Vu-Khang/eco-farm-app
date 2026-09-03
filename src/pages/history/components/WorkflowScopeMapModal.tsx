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
import { Maximize2, MapPin, Layers } from "lucide-react";
import type { MockWorkflowItem } from "../mock/history.mock";

type LatLngTuple = [number, number];

interface WorkflowScopeMapModalProps {
  workflow?: MockWorkflowItem | null;
}

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

  if (!workflow) return null;

  const boundary = workflow.boundary as LatLngTuple[] | undefined;

  // Calculate effective center point (from workflow centerPoint, or average boundary, or default)
  const effectiveCenterPoint: LatLngTuple = useMemo(() => {
    if (
      workflow.centerPoint &&
      Array.isArray(workflow.centerPoint) &&
      workflow.centerPoint.length === 2
    ) {
      return workflow.centerPoint as LatLngTuple;
    }
    if (boundary && boundary.length > 0) {
      const sumLat = boundary.reduce((acc, curr) => acc + curr[0], 0);
      const sumLng = boundary.reduce((acc, curr) => acc + curr[1], 0);
      return [sumLat / boundary.length, sumLng / boundary.length];
    }
    return DEFAULT_CENTER;
  }, [workflow, boundary]);

  const renderMapContent = (heightClass = "h-56") => (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-inner group z-0`}
    >
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
              color: "#16a34a",
              fillColor: "#22c55e",
              fillOpacity: 0.35,
              weight: 3,
            }}
          >
            <Tooltip sticky direction="center" opacity={0.95}>
              <div className="font-bold text-xs text-slate-900">
                {workflow.scopeName || workflow.name}
              </div>
              <div className="text-[10px] text-green-700 font-semibold">
                {workflow.scopeType === "REGION"
                  ? "Vùng canh tác"
                  : workflow.scopeType === "AREA"
                    ? "Khu vực canh tác"
                    : "Lô đất canh tác"}
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* Center Point Red Marker with Tooltip (matching OverviewTab.tsx) */}
        <Marker position={effectiveCenterPoint} icon={RedMarker()}>
          <Tooltip sticky direction="top" opacity={0.95}>
            <div style={{ fontWeight: 600, fontSize: 12 }}>
              {workflow.scopeName || workflow.name}
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
        className="absolute top-3 right-3 z-[1000] h-9 w-9 rounded-xl bg-white shadow-md border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-green-600 transition-all cursor-pointer flex items-center justify-center font-bold"
        title="Phóng to bản đồ xem toàn màn hình"
      >
        <Maximize2 className="h-4.5 w-4.5 text-green-600" />
      </button>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-2 right-2 z-[1000] rounded-xl bg-white/95 px-3.5 py-2 shadow-sm border border-slate-200 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-xs font-extrabold text-slate-900 truncate">
            {workflow.scopeName || workflow.name}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-bold bg-green-50 text-green-700 border-green-200 shrink-0 px-2 py-0.5"
        >
          {workflow.scopeType === "REGION"
            ? "Vùng trồng"
            : workflow.scopeType === "AREA"
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
            <Layers className="h-3.5 w-3.5 text-green-600" />
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
              <MapPin className="h-5 w-5 text-green-600" />
              Bản đồ phạm vi: {workflow.scopeName || workflow.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 w-full relative z-0">
            <MapContainer
              center={effectiveCenterPoint}
              zoom={15}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                    {workflow.scopeName || workflow.name}
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
