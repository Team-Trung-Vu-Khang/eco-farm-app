import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X } from "lucide-react";
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
import type { Plot } from "../../constants";
import { formatLatLng, getBoundsFromPoints, type PointWarning } from "../utils";

interface PlotMapEditorProps {
  areaPolygon: L.LatLng[];
  currentPoints: L.LatLng[];
  selectedAreaName?: string;
  selectedAreaId: string | null;
  existingPlots: Plot[];
  activePointIndex: number | null;
  pointWarnings: Record<number, PointWarning>;
  activePersistentWarning: PointWarning | null;
  plotWarningForDisplay: PointWarning | null;
  isDraggingPoint: boolean;
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  isEditMode: boolean;
  editingPlotId?: string | null;
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

export const PlotMapEditor = ({
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
  isEditMode,
  editingPlotId,
  onMarkerSelect,
  onPointDrag,
  onMapClick,
  onApplySuggestedPoint,
  onRemovePoint,
  onPointInputChange,
  onAddPoint,
}: PlotMapEditorProps) => {
  const center = getBoundsFromPoints(
    areaPolygon.length ? areaPolygon : currentPoints,
  ).getCenter();

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader>
        <CardTitle>Định vị lô đất</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="relative h-full flex-1 overflow-hidden rounded-lg border">
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
              if (!plot.coordinates || plot.coordinates.length < 3) return null;
              if (
                isEditMode &&
                editingPlotId &&
                String(plot.id) === String(editingPlotId)
              ) {
                return null;
              }

              const positions = plot.coordinates.map((coordinate) =>
                L.latLng(coordinate.lat, coordinate.lng),
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
      </CardContent>
    </Card>
  );
};
