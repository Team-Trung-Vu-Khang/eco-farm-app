import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { SubArea } from "../../constants";
import { formatLatLng, getBoundsFromPoints, type PointWarning } from "../utils";

type LandOption = {
  id?: string | number;
  code?: string | number;
  name: string;
};

interface RegionSubAreaStepProps {
  regionPoints: L.LatLng[];
  subAreas: SubArea[];
  editingSubArea: Partial<SubArea> | null;
  setEditingSubArea: (subArea: Partial<SubArea> | null) => void;
  subAreaPoints: L.LatLng[];
  activeSubAreaPointIndex: number | null;
  subAreaPointWarnings: Record<number, PointWarning>;
  activePersistentSubAreaWarning: PointWarning | null;
  subAreaWarningForDisplay: PointWarning | null;
  isDraggingSubAreaPoint: boolean;
  lands: LandOption[];
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  onAddSubArea: () => void;
  onSaveSubArea: () => void;
  onRemoveSubArea: (id: string) => void;
  onLoadSubAreaForEdit: (subArea: SubArea) => void;
  onSetEditingSubArea: (subArea: Partial<SubArea>) => void;
  onRemoveSubAreaPoint: (index: number) => void;
  onSubAreaPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  onAddSubAreaPoint: () => void;
  onSubAreaPointSelect: (index: number, point: L.LatLng) => void;
  onSubAreaPointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  onApplySuggestedSubAreaPoint: () => void;
}

export const RegionSubAreaStep = ({
  regionPoints,
  subAreas,
  editingSubArea,
  setEditingSubArea,
  subAreaPoints,
  activeSubAreaPointIndex,
  subAreaPointWarnings,
  activePersistentSubAreaWarning,
  subAreaWarningForDisplay,
  isDraggingSubAreaPoint,
  lands,
  customIcon,
  activeIcon,
  invalidIcon,
  onAddSubArea,
  onSaveSubArea,
  onRemoveSubArea,
  onLoadSubAreaForEdit,
  onSetEditingSubArea,
  onRemoveSubAreaPoint,
  onSubAreaPointInputChange,
  onAddSubAreaPoint,
  onSubAreaPointSelect,
  onSubAreaPointDrag,
  onApplySuggestedSubAreaPoint,
}: RegionSubAreaStepProps) => {
  const center = getBoundsFromPoints(regionPoints).getCenter();

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader>
        <CardTitle>Phân chia khu vực con</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="relative overflow-hidden rounded-lg border lg:col-span-3">
            <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polygon
                positions={regionPoints}
                pathOptions={{
                  color: "blue",
                  fill: false,
                  dashArray: "5, 5",
                }}
              />

              {subAreas.map((subArea) => {
                if (editingSubArea && subArea.id === editingSubArea.id) return null;
                if (!subArea.coordinates || subArea.coordinates.length < 3) return null;

                const positions = subArea.coordinates.map((coordinate) =>
                  L.latLng(coordinate.lat, coordinate.lng),
                );

                return (
                  <Polygon
                    key={subArea.id}
                    positions={positions}
                    pathOptions={{ color: "green", weight: 2 }}
                    eventHandlers={{
                      click: () => onLoadSubAreaForEdit(subArea),
                    }}
                  />
                );
              })}

              {editingSubArea && (
                <>
                  <Polygon
                    positions={subAreaPoints}
                    pathOptions={{
                      color: "#22c55e",
                      weight: 2,
                      fillOpacity: 0.2,
                    }}
                  />

                  {subAreaPoints.map((point, index) => {
                    const isActive = activeSubAreaPointIndex === index;
                    const isInvalid = !!subAreaPointWarnings[index];
                    const markerIcon = isInvalid
                      ? invalidIcon
                      : isActive
                        ? activeIcon
                        : customIcon;

                    return (
                      <Marker
                        key={`sub-point-${index}`}
                        position={point}
                        draggable={true}
                        icon={markerIcon}
                        eventHandlers={{
                          click: () => onSubAreaPointSelect(index, point),
                          dragstart: (event) =>
                            onSubAreaPointDrag(index, event.target.getLatLng(), {
                              finalize: false,
                            }),
                          drag: (event) =>
                            onSubAreaPointDrag(index, event.target.getLatLng(), {
                              finalize: false,
                            }),
                          dragend: (event) =>
                            onSubAreaPointDrag(index, event.target.getLatLng(), {
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

                  {subAreaWarningForDisplay && (
                    <Polyline
                      positions={[
                        subAreaWarningForDisplay.invalidLatLng,
                        subAreaWarningForDisplay.suggestedLatLng,
                      ]}
                      pathOptions={{
                        color: "red",
                        weight: 2,
                        dashArray: "6, 6",
                      }}
                    />
                  )}
                </>
              )}
            </MapContainer>

            {activePersistentSubAreaWarning &&
              editingSubArea &&
              !isDraggingSubAreaPoint && (
                <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                  <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                    <p className="text-sm font-semibold text-red-600">
                      Vị trí{" "}
                      <span className="rounded-md border border-red-200 p-0.5 font-bold">
                        điểm {activePersistentSubAreaWarning.index + 1}
                      </span>{" "}
                      không hợp lệ
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Toạ độ hiện tại:{" "}
                      <span className="font-medium text-gray-900">
                        {formatLatLng(activePersistentSubAreaWarning.invalidLatLng)}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gợi ý hợp lệ:{" "}
                      <span className="font-medium text-gray-900">
                        {formatLatLng(activePersistentSubAreaWarning.suggestedLatLng)}
                      </span>
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={onApplySuggestedSubAreaPoint}
                    >
                      Áp dụng toạ độ hợp lệ
                    </Button>
                  </div>
                </div>
              )}
          </div>

          <div className="flex h-full flex-col overflow-hidden lg:col-span-2">
            {editingSubArea ? (
              <div className="flex h-full flex-col gap-4 overflow-y-auto pr-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold">
                    {editingSubArea.id?.startsWith("sub-")
                      ? "Thêm khu vực mới"
                      : "Chỉnh sửa khu vực"}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSubArea(null)}
                  >
                    Hủy
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Tên khu vực</Label>
                    <Input
                      value={editingSubArea.name || ""}
                      onChange={(event) =>
                        onSetEditingSubArea({
                          ...editingSubArea,
                          name: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Diện tích (ha)</Label>
                    <Input
                      type="number"
                      value={editingSubArea.area || ""}
                      onChange={(event) =>
                        onSetEditingSubArea({
                          ...editingSubArea,
                          area: parseFloat(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Loại đất</Label>
                    <Select
                      value={editingSubArea.landType || ""}
                      onValueChange={(value) =>
                        onSetEditingSubArea({
                          ...editingSubArea,
                          landType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đất" />
                      </SelectTrigger>
                      <SelectContent>
                        {lands.map((land) => (
                          <SelectItem
                            key={land.id || land.code}
                            value={(land.id || land.code || "").toString()}
                          >
                            {land.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-2 flex w-full flex-col overflow-hidden rounded-lg border bg-slate-50">
                  <div className="border-b bg-white p-3">
                    <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Chọn marker để đổi màu xanh rồi kéo thả hoặc dùng nút Thêm
                      điểm. Nếu ra khỏi vùng hoặc chồng lên khu vực khác điểm sẽ
                      đổi đỏ và hiển thị gợi ý hợp lệ.
                    </p>
                  </div>
                  <div className="max-h-[300px] flex-1 space-y-3 overflow-y-auto p-3">
                    {subAreaPoints.map((point, index) => (
                      <div
                        key={index}
                        className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
                      >
                        <div className="absolute right-2 top-2 flex gap-1">
                          {subAreaPoints.length > 3 && (
                            <button
                              type="button"
                              onClick={() => onRemoveSubAreaPoint(index)}
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
                                onSubAreaPointInputChange(
                                  index,
                                  "lat",
                                  event.target.value,
                                )
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
                                onSubAreaPointInputChange(
                                  index,
                                  "lng",
                                  event.target.value,
                                )
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
                      onClick={onAddSubAreaPoint}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Thêm điểm
                    </Button>
                  </div>
                </div>

                <Button className="mt-4 w-full" onClick={onSaveSubArea}>
                  Lưu và Đóng
                </Button>
              </div>
            ) : (
              <div className="flex h-full flex-col rounded-lg border bg-slate-50">
                <div className="flex items-center justify-between border-b bg-white p-3">
                  <h4 className="text-sm font-semibold">Danh sách khu vực</h4>
                  <Button size="sm" onClick={onAddSubArea}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khu vực
                  </Button>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-3">
                  {subAreas.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Chưa có khu vực con nào được tạo.
                    </div>
                  ) : (
                    subAreas.map((subArea) => (
                      <div
                        key={subArea.id}
                        className="group rounded-lg border bg-white p-3 shadow-sm transition-colors hover:border-blue-300"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-blue-700">
                              {subArea.name}
                            </h5>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {subArea.area} ha •{" "}
                              {
                                lands.find(
                                  (land) =>
                                    String(land.id || land.code) ===
                                    String(subArea.landType),
                                )?.name
                              }
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onLoadSubAreaForEdit(subArea)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                              onClick={() => onRemoveSubArea(subArea.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                          <div className="rounded bg-slate-50 p-1">
                            {subArea.coordinates?.length || 0} điểm toạ độ
                          </div>
                          {subArea.coordinates && subArea.coordinates.length > 0 && (
                            <div className="truncate rounded bg-slate-50 p-1">
                              {subArea.coordinates[0].lat.toFixed(4)},{" "}
                              {subArea.coordinates[0].lng.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
