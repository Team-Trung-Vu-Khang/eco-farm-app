import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { MapController } from "../../components/DraggableRectangle";
import type { Plot } from "../../constants";
import type { PointWarning } from "../utils/map";

interface AreaPlotsStepProps {
  plotMapCenter: L.LatLng;
  areaPoints: L.LatLng[];
  formData: { plots?: Plot[] };
  editingPlot: Partial<Plot> | null;
  setEditingPlot: (plot: Partial<Plot> | null) => void;
  plotPoints: L.LatLng[];
  setPlotPoints: (points: L.LatLng[]) => void;
  activePlotPointIndex: number | null;
  plotPointWarnings: Record<number, PointWarning>;
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  setActivePlotPointIndex: (index: number | null) => void;
  setIsDraggingPlotPoint: (value: boolean) => void;
  setPlotPointWithValidation: (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => void;
  handlePlotPointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  plotWarningForDisplay: PointWarning | null;
  activePersistentPlotWarning: PointWarning | null;
  isDraggingPlotPoint: boolean;
  formatLatLng: (latlng: L.LatLng) => string;
  applySuggestedPlotPoint: () => void;
  handlePlotPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  removePlotPoint: (index: number) => void;
  handleAddPlotPoint: () => void;
  savePlot: () => void;
  addPlot: () => void;
  removePlot: (id: string) => void;
}

export function AreaPlotsStep({
  plotMapCenter,
  areaPoints,
  formData,
  editingPlot,
  setEditingPlot,
  plotPoints,
  setPlotPoints,
  activePlotPointIndex,
  plotPointWarnings,
  customIcon,
  activeIcon,
  invalidIcon,
  setActivePlotPointIndex,
  setIsDraggingPlotPoint,
  setPlotPointWithValidation,
  handlePlotPointDrag,
  plotWarningForDisplay,
  activePersistentPlotWarning,
  isDraggingPlotPoint,
  formatLatLng,
  applySuggestedPlotPoint,
  handlePlotPointInputChange,
  removePlotPoint,
  handleAddPlotPoint,
  savePlot,
  addPlot,
  removePlot,
}: AreaPlotsStepProps) {
  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader>
        <CardTitle>Danh sách lô ({formData.plots?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="relative h-full overflow-hidden rounded-lg border lg:col-span-3">
            <MapContainer center={plotMapCenter} zoom={14} className="h-full w-full">
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polygon
                positions={areaPoints}
                pathOptions={{
                  color: "blue",
                  fill: false,
                  dashArray: "5, 5",
                }}
              />

              {formData.plots?.map((plot) => {
                if (editingPlot && plot.id === editingPlot.id) {
                  return null;
                }
                if (!plot.coordinates || plot.coordinates.length < 3) {
                  return null;
                }

                return (
                  <Polygon
                    key={plot.id}
                    positions={plot.coordinates.map((coord) => [coord.lat, coord.lng]) as any}
                    pathOptions={{ color: "orange", weight: 2 }}
                    eventHandlers={{
                      click: () => {
                        setEditingPlot(plot);
                        if (plot.coordinates.length >= 3) {
                          setPlotPoints(
                            plot.coordinates.map((coord) =>
                              L.latLng(coord.lat, coord.lng),
                            ),
                          );
                        }
                      },
                    }}
                  />
                );
              })}

              {editingPlot && (
                <>
                  <Polygon
                    positions={plotPoints}
                    pathOptions={{
                      color: "orange",
                      weight: 2,
                      fillOpacity: 0.2,
                    }}
                  />
                  {plotPoints.map((point, idx) => {
                    const isActive = activePlotPointIndex === idx;
                    const isInvalid = Boolean(plotPointWarnings[idx]);
                    const markerIcon = isInvalid
                      ? invalidIcon
                      : isActive
                        ? activeIcon
                        : customIcon;

                    return (
                      <Marker
                        key={`plot-point-${idx}`}
                        position={point}
                        draggable
                        icon={markerIcon}
                        eventHandlers={{
                          click: () => {
                            setActivePlotPointIndex(idx);
                            setPlotPointWithValidation(idx, point, {
                              persist: true,
                              preview: false,
                            });
                          },
                          dragstart: (event) => {
                            setActivePlotPointIndex(idx);
                            setIsDraggingPlotPoint(true);
                            handlePlotPointDrag(idx, event.target.getLatLng(), {
                              finalize: false,
                            });
                          },
                          drag: (event) =>
                            handlePlotPointDrag(idx, event.target.getLatLng(), {
                              finalize: false,
                            }),
                          dragend: (event) => {
                            setIsDraggingPlotPoint(false);
                            handlePlotPointDrag(idx, event.target.getLatLng(), {
                              finalize: true,
                            });
                          },
                        }}
                      >
                        <Tooltip>Điểm {idx + 1}</Tooltip>
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
                </>
              )}
              <MapController center={plotMapCenter} />
            </MapContainer>

            {activePersistentPlotWarning && editingPlot && !isDraggingPlotPoint && (
              <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                  <p className="text-sm font-semibold text-red-600">
                    Vị trí{" "}
                    <span className="rounded-md border border-red-200 p-0.5 font-bold">
                      điểm {activePersistentPlotWarning.index + 1}
                    </span>{" "}
                    không hợp lệ
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Toạ độ hiện tại:{" "}
                    <span className="font-medium text-gray-900">
                      {formatLatLng(activePersistentPlotWarning.invalidLatLng)}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gợi ý hợp lệ:{" "}
                    <span className="font-medium text-gray-900">
                      {formatLatLng(activePersistentPlotWarning.suggestedLatLng)}
                    </span>
                  </p>
                  <Button size="sm" className="mt-3 w-full" onClick={applySuggestedPlotPoint}>
                    Áp dụng toạ độ hợp lệ
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex h-full flex-col overflow-hidden lg:col-span-2">
            {editingPlot ? (
              <div className="flex h-full flex-col gap-4 overflow-y-auto pr-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold">
                    {editingPlot.id?.startsWith("plot-") ? "Thêm lô mới" : "Chỉnh sửa lô"}
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setEditingPlot(null)}>
                    Hủy
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Mã lô</Label>
                      <Input
                        value={editingPlot.code || ""}
                        onChange={(e) =>
                          setEditingPlot({ ...editingPlot, code: e.target.value })
                        }
                        placeholder="Mã lô..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Tên lô</Label>
                      <Input
                        value={editingPlot.name || ""}
                        onChange={(e) =>
                          setEditingPlot({ ...editingPlot, name: e.target.value })
                        }
                        placeholder="Tên lô..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Diện tích (ha)</Label>
                      <Input
                        type="number"
                        value={editingPlot.area || ""}
                        onChange={(e) =>
                          setEditingPlot({
                            ...editingPlot,
                            area: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Độ cao (m)</Label>
                      <Input
                        type="number"
                        value={editingPlot.altitude || ""}
                        onChange={(e) =>
                          setEditingPlot({
                            ...editingPlot,
                            altitude: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Đường đồng mức</Label>
                    <Input
                      value={editingPlot.contour || ""}
                      onChange={(e) =>
                        setEditingPlot({ ...editingPlot, contour: e.target.value })
                      }
                      placeholder="VD: 100m"
                    />
                  </div>

                  <div className="mt-2 flex w-full flex-col overflow-hidden rounded-lg border bg-slate-50">
                    <div className="border-b bg-white p-3">
                      <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Chọn marker rồi kéo thả để điều chỉnh hoặc nhập tay.
                      </p>
                    </div>
                    <div className="max-h-[300px] flex-1 space-y-3 overflow-y-auto p-3">
                      {plotPoints.map((point, index) => (
                        <div
                          key={index}
                          className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
                        >
                          <div className="absolute right-2 top-2 flex gap-1">
                            {plotPoints.length > 3 && (
                              <button
                                onClick={() => removePlotPoint(index)}
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
                                  handlePlotPointInputChange(index, "lat", e.target.value)
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
                                  handlePlotPointInputChange(index, "lng", e.target.value)
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
                        onClick={handleAddPlotPoint}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Thêm điểm
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex gap-3 border-t pt-4">
                  <Button className="flex-1" onClick={savePlot}>
                    Lưu lô
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col rounded-lg border bg-slate-50">
                <div className="flex items-center justify-between border-b bg-white p-3">
                  <h4 className="text-sm font-semibold">Danh sách lô</h4>
                  <Button size="sm" onClick={addPlot}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm lô mới
                  </Button>
                </div>

                {!formData.plots || formData.plots.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-muted-foreground">
                    <p>Danh sách trống.</p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3 overflow-y-auto p-3">
                    {formData.plots.map((plot) => (
                      <div
                        key={plot.id}
                        className="group rounded-lg border bg-white p-3 shadow-sm transition-colors hover:border-orange-300"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex flex-col">
                            {plot.code && (
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                                {plot.code}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span className="font-medium">{plot.name}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setEditingPlot(plot);
                                if (plot.coordinates && plot.coordinates.length >= 3) {
                                  setPlotPoints(
                                    plot.coordinates.map((coord) =>
                                      L.latLng(coord.lat, coord.lng),
                                    ),
                                  );
                                }
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                              onClick={() => removePlot(plot.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span>DT: {plot.area} ha</span>
                          <span>Độ cao: {plot.altitude}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
