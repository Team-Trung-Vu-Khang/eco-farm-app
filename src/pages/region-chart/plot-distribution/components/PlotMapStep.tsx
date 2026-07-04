import { useMemo, useCallback, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Maximize2, Plus, X } from "lucide-react";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import type { PlotFormValues } from "../data/plot-form.schema";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {
  formatLatLng,
  getBoundsFromPoints,
  type PointWarning,
} from "../utils";
import {
  toTurfPolygonFromCoords,
  getNearestPointOnPolygonBoundary,
} from "../utils";
import { point, polygon } from "@turf/helpers";

interface PlotMapStepProps {
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  editingPlotId?: string | number | null;
}

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: L.LatLng) => void;
}) => {
  useMapEvents({
    click(event) {
      onClick(event.latlng);
    },
  });
  return null;
};

// ── Map Layout Sub-component ───────────────────────────────────────────────────
interface MapLayoutProps {
  center: L.LatLng;
  areaPolygon: L.LatLng[];
  currentPoints: L.LatLng[];
  selectedAreaName?: string;
  selectedAreaId: number | null;
  existingPlots: any[];
  activePointIndex: number | null;
  pointWarnings: Record<number, PointWarning>;
  activePersistentWarning: PointWarning | null;
  plotWarningForDisplay: PointWarning | null;
  isDraggingPoint: boolean;
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  editingPlotId?: string | number | null;
  onMarkerSelect: (index: number, point: L.LatLng) => void;
  onPointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  onMapClick: (latlng: L.LatLng) => void;
  onApplySuggestedPoint: () => void;
  onRemovePoint: (index: number) => void;
  onPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  onAddPoint: () => void;
}

const MapLayout = ({
  center,
  areaPolygon,
  currentPoints,
  selectedAreaName,
  selectedAreaId,
  existingPlots,
  activePointIndex,
  pointWarnings,
  activePersistentWarning,
  plotWarningForDisplay,
  isDraggingPoint,
  customIcon,
  activeIcon,
  invalidIcon,
  editingPlotId,
  onMarkerSelect,
  onPointDrag,
  onMapClick,
  onApplySuggestedPoint,
  onRemovePoint,
  onPointInputChange,
  onAddPoint,
}: MapLayoutProps) => {
  return (
    <div className="flex flex-1 gap-4 overflow-hidden p-4 h-full w-full">
      <div className="relative z-0 h-full flex-1 overflow-hidden rounded-lg border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={17}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {areaPolygon.length > 0 && (
            <Polygon
              positions={areaPolygon}
              pathOptions={{
                color: "blue",
                fill: false,
                dashArray: "5, 5",
              }}
            >
              <Tooltip sticky direction="top">
                {selectedAreaName} (Khu vực)
              </Tooltip>
            </Polygon>
          )}

          {existingPlots.map((plot) => {
            if (!plot.boundary || plot.boundary.length < 3) return null;
            if (
              editingPlotId &&
              String(plot.id) === String(editingPlotId)
            ) {
              return null;
            }

            const positions = plot.boundary.map((b: any) =>
              L.latLng(b.latitude || 0, b.longitude || 0),
            );

            return (
              <Polygon
                key={`existing-plot-${plot.id}`}
                positions={positions}
                pathOptions={{
                  color: "gray",
                  weight: 1,
                  dashArray: "4, 4",
                  fillOpacity: 0,
                }}
              >
                <Tooltip sticky direction="top">
                  {plot.name} (Lô sẵn có)
                </Tooltip>
              </Polygon>
            );
          })}

          <Polygon
            positions={currentPoints}
            pathOptions={{ color: "orange", fillOpacity: 0.2 }}
          />

          {currentPoints.map((point, index) => {
            const isActive = activePointIndex === index;
            const isInvalid = !!pointWarnings[index];
            const markerIcon = isInvalid
              ? invalidIcon
              : isActive
                ? activeIcon
                : customIcon;

            return (
              <Marker
                key={`pt-${index}`}
                position={point}
                draggable={true}
                icon={markerIcon}
                eventHandlers={{
                  click: () => onMarkerSelect(index, point),
                  dragstart: (event) =>
                    onPointDrag(index, event.target.getLatLng(), {
                      finalize: false,
                    }),
                  drag: (event) =>
                    onPointDrag(index, event.target.getLatLng(), {
                      finalize: false,
                    }),
                  dragend: (event) =>
                    onPointDrag(index, event.target.getLatLng(), {
                      finalize: true,
                    }),
                }}
              >
                <Tooltip sticky direction="top" className="z-1000">
                  Điểm {index + 1}
                </Tooltip>
              </Marker>
            );
          })}

          {plotWarningForDisplay && (
            <Polyline
              positions={[
                plotWarningForDisplay.invalidLatLng,
                plotWarningForDisplay.suggestedLatLng,
              ]}
              pathOptions={{
                color: "red",
                weight: 2,
                dashArray: "6, 6",
              }}
            />
          )}

          <MapClickHandler onClick={onMapClick} />
        </MapContainer>

        {activePersistentWarning && !isDraggingPoint && selectedAreaId && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
            <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
              <p className="text-sm font-semibold text-red-600">
                Vị trí{" "}
                <span className="rounded-md border border-red-200 p-0.5 font-bold">
                  điểm {activePersistentWarning.index + 1}
                </span>{" "}
                không hợp lệ
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Toạ độ hiện tại:{" "}
                <span className="font-medium text-gray-900">
                  {formatLatLng(activePersistentWarning.invalidLatLng)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Gợi ý hợp lệ:{" "}
                <span className="font-medium text-gray-900">
                  {formatLatLng(activePersistentWarning.suggestedLatLng)}
                </span>
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={onApplySuggestedPoint}
              >
                Áp dụng toạ độ hợp lệ
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-full w-[300px] flex-col overflow-hidden rounded-lg border bg-slate-50">
        <div className="border-b bg-white p-3">
          <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Chọn marker để đổi màu xanh rồi kéo thả hoặc dùng nút Thêm điểm.
            Nếu ra khỏi khu vực hoặc đè lên lô sẵn có, điểm sẽ đổi đỏ và hiển
            thị gợi ý hợp lệ.
          </p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {currentPoints.map((point, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
            >
              <div className="absolute right-2 top-2 flex gap-1">
                {currentPoints.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onRemovePoint(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <span className="font-semibold">Điểm {index + 1}</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500">Lat</label>
                  <input
                    className="w-full rounded border px-1 py-0.5"
                    type="number"
                    value={point.lat}
                    onChange={(event) =>
                      onPointInputChange(index, "lat", event.target.value)
                    }
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Lng</label>
                  <input
                    className="w-full rounded border px-1 py-0.5"
                    type="number"
                    value={point.lng}
                    onChange={(event) =>
                      onPointInputChange(index, "lng", event.target.value)
                    }
                    step="0.0001"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={onAddPoint}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm điểm
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main PlotMapStep Component ──────────────────────────────────────────────────
export const PlotMapStep = ({
  customIcon,
  activeIcon,
  invalidIcon,
  editingPlotId,
}: PlotMapStepProps) => {
  const { watch, setValue } = useFormContext<PlotFormValues>();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const areaId = watch("areaId");
  const coordinates = watch("coordinates") || [];

  const { data: selectedArea } = useAreaById(areaId || 0, {
    enabled: !!areaId,
  });

  const areaPolygon = useMemo(() => {
    if (!selectedArea || !selectedArea.boundary) return [];
    return selectedArea.boundary.map((b) => L.latLng(b.latitude || 0, b.longitude || 0));
  }, [selectedArea]);

  const currentPoints = useMemo(() => {
    return coordinates.map((c) => L.latLng(c.lat, c.lng));
  }, [coordinates]);

  const setCoordinates = useCallback(
    (points: L.LatLng[]) => {
      setValue(
        "coordinates",
        points.map((p) => ({ lat: p.lat, lng: p.lng })),
        { shouldValidate: true },
      );
    },
    [setValue],
  );

  // States for interactive map editing
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [pointWarnings, setPointWarnings] = useState<Record<number, PointWarning>>({});
  const [activeDragWarning, setActiveDragWarning] = useState<PointWarning | null>(null);
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);

  const areaPolygonFeature = useMemo(() => {
    if (areaPolygon.length < 3) return null;
    const coords = areaPolygon.map((p) => [p.lng, p.lat]);
    const first = coords[0];
    const closed = [...coords, first];
    return polygon([closed]);
  }, [areaPolygon]);

  const blockingPlotPolygons = useMemo(() => {
    if (!selectedArea?.plots || selectedArea.plots.length === 0) return [];
    return selectedArea.plots
      .filter((plot) => {
        if (editingPlotId && String(plot.id) === String(editingPlotId)) {
          return false;
        }
        return true;
      })
      .map((plot) => {
        const poly = toTurfPolygonFromCoords(
          (plot.boundary || []).map((b) => ({ lat: b.latitude || 0, lng: b.longitude || 0 }))
        );
        if (!poly) return null;
        return { id: String(plot.id), polygon: poly };
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [selectedArea, editingPlotId]);

  const activePersistentWarning = useMemo(() => {
    if (activePointIndex === null) return null;
    return pointWarnings[activePointIndex] ?? null;
  }, [activePointIndex, pointWarnings]);

  const plotWarningForDisplay = activeDragWarning ?? activePersistentWarning;

  // Center coordinate calculation
  const center = useMemo(() => {
    return getBoundsFromPoints(
      areaPolygon.length ? areaPolygon : currentPoints,
    ).getCenter();
  }, [areaPolygon, currentPoints]);

  // Initializing default points inside area boundaries if coordinates is empty
  useEffect(() => {
    if (!selectedArea || !selectedArea.boundary || selectedArea.boundary.length === 0) {
      return;
    }
    if (coordinates.length === 0) {
      const areaLatLngs = selectedArea.boundary.map((b) =>
        L.latLng(b.latitude || 0, b.longitude || 0),
      );
      const bounds = L.latLngBounds(areaLatLngs);
      const c = bounds.getCenter();
      const defaultPoints = [
        { lat: c.lat - 0.0005, lng: c.lng - 0.0005 },
        { lat: c.lat + 0.0005, lng: c.lng },
        { lat: c.lat - 0.0005, lng: c.lng + 0.0005 },
      ];
      setValue("coordinates", defaultPoints, { shouldValidate: true });
    }
  }, [selectedArea, coordinates.length, setValue]);

  const getNearestValidPlotPosition = useCallback(
    (latlng: L.LatLng) => {
      return getNearestPointOnPolygonBoundary(areaPolygonFeature, latlng);
    },
    [areaPolygonFeature],
  );

  const updateWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: removedWarning, ...rest } = prev;
        void removedWarning;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftWarningsAfterRemoval = (removedIndex: number) => {
    setPointWarnings((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const next: Record<number, PointWarning> = {};
      Object.entries(prev).forEach(([idxStr, warning]) => {
        const idx = Number(idxStr);
        if (idx === removedIndex) return;
        const newIndex = idx > removedIndex ? idx - 1 : idx;
        next[newIndex] = { ...warning, index: newIndex };
      });
      return next;
    });
  };

  const setPointWithValidation = useCallback(
    (
      index: number,
      latlng: L.LatLng,
      options?: { persist?: boolean; preview?: boolean },
    ) => {
      const { persist = true, preview = false } = options || {};

      // Modify locally and push update
      const newPoints = [...currentPoints];
      newPoints[index] = latlng;
      setCoordinates(newPoints);

      const clearPreview = () => {
        if (preview) {
          setActiveDragWarning((prev) => (prev?.index === index ? null : prev));
        }
      };

      const pointFeature = point([latlng.lng, latlng.lat]);
      let violationType: "outsideArea" | "overlapsPlot" | null = null;
      let overlapPolygon: any = null;

      if (areaPolygonFeature) {
        const insideArea = booleanPointInPolygon(pointFeature, areaPolygonFeature);
        if (!insideArea) {
          violationType = "outsideArea";
        }
      }

      if (!violationType && blockingPlotPolygons.length > 0) {
        const overlapping = blockingPlotPolygons.find((plotPoly) =>
          booleanPointInPolygon(pointFeature, plotPoly.polygon),
        );
        if (overlapping) {
          violationType = "overlapsPlot";
          overlapPolygon = overlapping.polygon;
        }
      }

      if (!violationType) {
        if (persist) {
          updateWarningForIndex(index, null);
        }
        clearPreview();
        return;
      }

      let nearestValid: L.LatLng | null = null;
      if (violationType === "outsideArea") {
        nearestValid = getNearestValidPlotPosition(latlng);
      } else if (violationType === "overlapsPlot" && overlapPolygon) {
        nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
      }

      if (!nearestValid) {
        clearPreview();
        if (persist) {
          updateWarningForIndex(index, null);
        }
        return;
      }

      const warningData: PointWarning = {
        index,
        invalidLatLng: latlng,
        suggestedLatLng: nearestValid,
      };

      if (preview) {
        setActiveDragWarning(warningData);
      }
      if (persist) {
        updateWarningForIndex(index, warningData);
      }
    },
    [
      currentPoints,
      setCoordinates,
      areaPolygonFeature,
      blockingPlotPolygons,
      getNearestValidPlotPosition,
    ],
  );

  const applySuggestedPoint = useCallback(() => {
    if (!activePersistentWarning) return;
    const { index, suggestedLatLng } = activePersistentWarning;
    setPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(index);
    updateWarningForIndex(index, null);
    setActiveDragWarning(null);
  }, [activePersistentWarning, setPointWithValidation]);

  const removePoint = useCallback(
    (index: number) => {
      if (currentPoints.length <= 3) {
        toast({
          title: "Lỗi",
          description: "Cần ít nhất 3 điểm",
          variant: "destructive",
        });
        return;
      }
      const newPoints = currentPoints.filter((_, i) => i !== index);
      setCoordinates(newPoints);
      setActivePointIndex(null);
      setActiveDragWarning(null);
      shiftWarningsAfterRemoval(index);
    },
    [currentPoints, setCoordinates, toast],
  );

  const handlePointInputChange = useCallback(
    (index: number, field: "lat" | "lng", value: string) => {
      const val = parseFloat(value);
      if (isNaN(val)) return;

      const currentPoint = currentPoints[index];
      if (!currentPoint) return;
      const updated = L.latLng(
        field === "lat" ? val : currentPoint.lat,
        field === "lng" ? val : currentPoint.lng,
      );
      setPointWithValidation(index, updated, { persist: true, preview: false });
      setActivePointIndex(index);
      setActiveDragWarning(null);
    },
    [currentPoints, setPointWithValidation],
  );

  const handleAddPoint = useCallback(() => {
    const basePoints = currentPoints.length > 0 ? currentPoints : areaPolygon.length > 0 ? areaPolygon : [L.latLng(0, 0)];
    const c = getBoundsFromPoints(basePoints).getCenter();
    const nextIndex = currentPoints.length;
    const newLatLng = L.latLng(c.lat + 0.0002, c.lng + 0.0002);
    setPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(nextIndex);
    setActiveDragWarning(null);
  }, [currentPoints, areaPolygon, setPointWithValidation]);

  const handlePointDrag = useCallback(
    (index: number, latlng: L.LatLng, options?: { finalize?: boolean }) => {
      setActivePointIndex(index);
      setIsDraggingPoint(!(options?.finalize ?? false));
      setPointWithValidation(index, latlng, {
        persist: options?.finalize ?? false,
        preview: !(options?.finalize ?? false),
      });
      if (options?.finalize) {
        setActiveDragWarning(null);
      }
    },
    [setPointWithValidation],
  );

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      const nextIndex = currentPoints.length;
      setActivePointIndex(nextIndex);
      setPointWithValidation(nextIndex, latlng, {
        persist: true,
        preview: false,
      });
      setActiveDragWarning(null);
    },
    [currentPoints.length, setPointWithValidation],
  );

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-0 pt-3 px-4 space-y-0 bg-white border-b pb-3">
        <CardTitle>Bản đồ vị trí lô đất</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          title="Phóng to toàn màn hình"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        {!isFullscreen && (
          <MapLayout
            center={center}
            areaPolygon={areaPolygon}
            currentPoints={currentPoints}
            selectedAreaName={selectedArea?.name}
            selectedAreaId={areaId}
            existingPlots={selectedArea?.plots || []}
            activePointIndex={activePointIndex}
            pointWarnings={pointWarnings}
            activePersistentWarning={activePersistentWarning}
            plotWarningForDisplay={plotWarningForDisplay}
            isDraggingPoint={isDraggingPoint}
            customIcon={customIcon}
            activeIcon={activeIcon}
            invalidIcon={invalidIcon}
            editingPlotId={editingPlotId}
            onMarkerSelect={setActivePointIndex}
            onPointDrag={handlePointDrag}
            onMapClick={handleMapClick}
            onApplySuggestedPoint={applySuggestedPoint}
            onRemovePoint={removePoint}
            onPointInputChange={handlePointInputChange}
            onAddPoint={handleAddPoint}
          />
        )}

        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Bản đồ vị trí lô đất</h2>
            </div>
            {isFullscreen && (
              <MapLayout
                center={center}
                areaPolygon={areaPolygon}
                currentPoints={currentPoints}
                selectedAreaName={selectedArea?.name}
                selectedAreaId={areaId}
                existingPlots={selectedArea?.plots || []}
                activePointIndex={activePointIndex}
                pointWarnings={pointWarnings}
                activePersistentWarning={activePersistentWarning}
                plotWarningForDisplay={plotWarningForDisplay}
                isDraggingPoint={isDraggingPoint}
                customIcon={customIcon}
                activeIcon={activeIcon}
                invalidIcon={invalidIcon}
                editingPlotId={editingPlotId}
                onMarkerSelect={setActivePointIndex}
                onPointDrag={handlePointDrag}
                onMapClick={handleMapClick}
                onApplySuggestedPoint={applySuggestedPoint}
                onRemovePoint={removePoint}
                onPointInputChange={handlePointInputChange}
                onAddPoint={handleAddPoint}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
