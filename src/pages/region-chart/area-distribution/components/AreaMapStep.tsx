import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Plus, X } from "lucide-react";
import { MapController } from "../../components/DraggableRectangle";
import type { Region, SubArea } from "../../constants";
import type { PointWarning } from "../utils/map";

interface AreaMapStepProps {
  areaMapCenter: L.LatLng;
  selectedRegionId: number | null;
  regions: Region[];
  currentRegion?: Region;
  isEditMode: boolean;
  editAreaId?: string;
  areaPoints: L.LatLng[];
  activePointIndex: number | null;
  areaPointWarnings: Record<number, PointWarning>;
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  setActivePointIndex: (index: number | null) => void;
  setIsDraggingAreaPoint: (value: boolean) => void;
  setAreaPointWithValidation: (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => void;
  handlePointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  areaWarningForDisplay: PointWarning | null;
  activePersistentAreaWarning: PointWarning | null;
  isDraggingAreaPoint: boolean;
  formatLatLng: (latlng: L.LatLng) => string;
  applySuggestedAreaPoint: () => void;
  removePoint: (index: number) => void;
  handlePointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddPoint: () => void;
}

export function AreaMapStep({
  areaMapCenter,
  selectedRegionId,
  regions,
  currentRegion,
  isEditMode,
  editAreaId,
  areaPoints,
  activePointIndex,
  areaPointWarnings,
  customIcon,
  activeIcon,
  invalidIcon,
  setActivePointIndex,
  setIsDraggingAreaPoint,
  setAreaPointWithValidation,
  handlePointDrag,
  areaWarningForDisplay,
  activePersistentAreaWarning,
  isDraggingAreaPoint,
  formatLatLng,
  applySuggestedAreaPoint,
  removePoint,
  handlePointInputChange,
  handleAddPoint,
}: AreaMapStepProps) {
  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader>
        <CardTitle>Định vị khu vực trên bản đồ</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="relative h-full flex-1 overflow-hidden rounded-lg border">
          <MapContainer center={areaMapCenter} zoom={14} className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {selectedRegionId && (
              <Polygon
                positions={
                  regions
                    .find((region) => region.id === selectedRegionId)
                    ?.coordinates.map((coord) => [coord.lat, coord.lng]) || []
                }
                pathOptions={{
                  color: "green",
                  fill: false,
                  dashArray: "5, 5",
                  weight: 2,
                }}
              />
            )}

            {currentRegion?.subAreas
              .filter((area) => !isEditMode || area.id !== editAreaId)
              .map((area: SubArea) => (
                <Polygon
                  key={`existing-${area.id}`}
                  positions={area.coordinates.map((coord) => [coord.lat, coord.lng])}
                  pathOptions={{
                    color: "gray",
                    fillColor: "gray",
                    fillOpacity: 0.1,
                    weight: 1,
                  }}
                >
                  <Tooltip sticky direction="top">
                    {area.name} (Sẵn có)
                  </Tooltip>
                </Polygon>
              ))}

            <Polygon positions={areaPoints} pathOptions={{ color: "blue", fillOpacity: 0.1 }} />

            {areaPoints.map((point, idx) => {
              const isActive = activePointIndex === idx;
              const isInvalid = Boolean(areaPointWarnings[idx]);
              const markerIcon = isInvalid
                ? invalidIcon
                : isActive
                  ? activeIcon
                  : customIcon;

              return (
                <Marker
                  key={`pt-${idx}`}
                  position={point}
                  draggable
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => {
                      setActivePointIndex(idx);
                      setAreaPointWithValidation(idx, point, {
                        persist: true,
                        preview: false,
                      });
                    },
                    dragstart: (event) => {
                      setActivePointIndex(idx);
                      setIsDraggingAreaPoint(true);
                      handlePointDrag(idx, event.target.getLatLng(), {
                        finalize: false,
                      });
                    },
                    drag: (event) =>
                      handlePointDrag(idx, event.target.getLatLng(), {
                        finalize: false,
                      }),
                    dragend: (event) => {
                      setIsDraggingAreaPoint(false);
                      handlePointDrag(idx, event.target.getLatLng(), {
                        finalize: true,
                      });
                    },
                  }}
                >
                  <Tooltip sticky direction="top" className="z-1000">
                    Điểm {idx + 1}
                  </Tooltip>
                </Marker>
              );
            })}

            {areaWarningForDisplay && (
              <Polyline
                positions={[
                  areaWarningForDisplay.invalidLatLng,
                  areaWarningForDisplay.suggestedLatLng,
                ]}
                pathOptions={{
                  color: "red",
                  weight: 2,
                  dashArray: "6, 6",
                }}
              />
            )}
            <MapController center={areaMapCenter} />
          </MapContainer>

          {activePersistentAreaWarning && !isDraggingAreaPoint && selectedRegionId && (
            <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
              <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                <p className="text-sm font-semibold text-red-600">
                  Vị trí{" "}
                  <span className="rounded-md border border-red-200 p-0.5 font-bold">
                    điểm {activePersistentAreaWarning.index + 1}
                  </span>{" "}
                  không hợp lệ
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Toạ độ hiện tại:{" "}
                  <span className="font-medium text-gray-900">
                    {formatLatLng(activePersistentAreaWarning.invalidLatLng)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Gợi ý hợp lệ:{" "}
                  <span className="font-medium text-gray-900">
                    {formatLatLng(activePersistentAreaWarning.suggestedLatLng)}
                  </span>
                </p>
                <Button size="sm" className="mt-3 w-full" onClick={applySuggestedAreaPoint}>
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
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {areaPoints.map((point, index) => (
              <div
                key={index}
                className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
              >
                <div className="absolute right-2 top-2 flex gap-1">
                  {areaPoints.length > 3 && (
                    <button
                      onClick={() => removePoint(index)}
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
                      onChange={(e) =>
                        handlePointInputChange(index, "lat", e.target.value)
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
                      onChange={(e) =>
                        handlePointInputChange(index, "lng", e.target.value)
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
              onClick={handleAddPoint}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm điểm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
