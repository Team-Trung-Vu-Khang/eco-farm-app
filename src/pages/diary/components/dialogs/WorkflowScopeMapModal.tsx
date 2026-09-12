import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, InfoWindow, OverlayView, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { Maximize2, MapPin, Layers } from "lucide-react";
import type { MockWorkflowItem } from "../../types/diary.types";

type LatLng = { lat: number; lng: number };
type LatLngTuple = [number, number];

interface WorkflowScopeMapModalProps {
  workflow?: MockWorkflowItem | null;
}

const DEFAULT_CENTER: LatLngTuple = [10.762072, 106.661672];

const mapContainerStyle = { width: "100%", height: "100%" };

const RedCenterMarker = ({ position, label }: { position: LatLng; label: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translate(-50%, -50%)",
        }}
      >
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              whiteSpace: "nowrap",
            }}
            className="rounded-md bg-white/95 px-2 py-1 shadow-sm border border-slate-200"
          >
            <div style={{ fontWeight: 600, fontSize: 12 }}>{label}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Tọa độ trung tâm</div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            backgroundColor: "#ef4444",
            borderRadius: "50%",
            opacity: 0.3,
            transform: "scale(1.4)",
            animation: "pulse-workflow-marker 2s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            backgroundColor: "#ef4444",
            border: "2px solid white",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        />
        <style>{`
          @keyframes pulse-workflow-marker {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }
        `}</style>
      </div>
    </OverlayView>
  );
};

const BoundaryPolygon = ({
  boundary,
  label,
  scopeTypeLabel,
  strokeColor,
  fillColor,
  strokeWeight,
  showTooltip,
}: {
  boundary: LatLngTuple[];
  label: string;
  scopeTypeLabel: string;
  strokeColor: string;
  fillColor: string;
  strokeWeight: number;
  showTooltip?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const paths = boundary.map(([lat, lng]) => ({ lat, lng }));
  const center = paths.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat / paths.length, lng: acc.lng + p.lng / paths.length }),
    { lat: 0, lng: 0 },
  );

  return (
    <>
      <Polygon
        paths={paths}
        options={{
          strokeColor,
          fillColor,
          fillOpacity: 0.35,
          strokeWeight,
        }}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      />
      {showTooltip && hovered && (
        <InfoWindow position={center} options={{ disableAutoPan: true }} onCloseClick={() => setHovered(false)}>
          <div>
            <div className="font-bold text-xs text-slate-900">{label}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              {scopeTypeLabel}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const WorkflowGoogleMap = ({
  boundary,
  centerPoint,
  workflowLabel,
  scopeTypeLabel,
  boundaryStyle,
  showTooltip,
}: {
  boundary?: LatLngTuple[];
  centerPoint: LatLngTuple;
  workflowLabel: string;
  scopeTypeLabel: string;
  boundaryStyle: { strokeColor: string; fillColor: string; strokeWeight: number };
  showTooltip?: boolean;
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const applyView = (map: google.maps.Map) => {
    if (boundary && boundary.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      boundary.forEach(([lat, lng]) => bounds.extend({ lat, lng }));
      map.fitBounds(bounds, 36);
      return;
    }
    map.setCenter({ lat: centerPoint[0], lng: centerPoint[1] });
    map.setZoom(15);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    applyView(map);
  }, [boundary, centerPoint]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: centerPoint[0], lng: centerPoint[1] }}
      zoom={15}
      options={{ mapTypeId: "satellite" }}
      onLoad={(map) => {
        mapRef.current = map;
        applyView(map);
      }}
    >
      {boundary && boundary.length > 0 && (
        <BoundaryPolygon
          boundary={boundary}
          label={workflowLabel}
          scopeTypeLabel={scopeTypeLabel}
          strokeColor={boundaryStyle.strokeColor}
          fillColor={boundaryStyle.fillColor}
          strokeWeight={boundaryStyle.strokeWeight}
          showTooltip={showTooltip}
        />
      )}
      <RedCenterMarker
        position={{ lat: centerPoint[0], lng: centerPoint[1] }}
        label={workflowLabel}
      />
    </GoogleMap>
  );
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

  const workflowLabel = workflow.scopeName || workflow.name;
  const scopeTypeLabel =
    workflow.scopeType === "REGION"
      ? "Vùng canh tác"
      : workflow.scopeType === "AREA"
        ? "Khu vực canh tác"
        : "Lô đất canh tác";

  const renderMapContent = (heightClass = "h-56") => (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-inner group z-0`}
    >
      <WorkflowGoogleMap
        boundary={boundary}
        centerPoint={effectiveCenterPoint}
        workflowLabel={workflowLabel}
        scopeTypeLabel={scopeTypeLabel}
        boundaryStyle={{ strokeColor: "#059669", fillColor: "#10b981", strokeWeight: 3 }}
        showTooltip
      />

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
            {workflowLabel}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 px-2 py-0.5"
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
              Bản đồ phạm vi: {workflowLabel}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 w-full relative z-0">
            <WorkflowGoogleMap
              boundary={boundary}
              centerPoint={effectiveCenterPoint}
              workflowLabel={workflowLabel}
              scopeTypeLabel={scopeTypeLabel}
              boundaryStyle={{ strokeColor: "#16a34a", fillColor: "#22c55e", strokeWeight: 4 }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
