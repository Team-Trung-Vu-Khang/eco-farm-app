import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Plus, Trash2, X, Edit } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";

import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import {
  getBoundsFromPoints,
  getNearestPointOnPolygonBoundary,
  toTurfPolygonFromCoords,
  type PointWarning,
} from "../utils/map";

interface AreaPlotsStepProps {
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
}

const plotFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên lô"),
  code: z.string().min(1, "Vui lòng nhập mã lô"),
  acreage: z.coerce
    .number({
      error: "Vui lòng nhập diện tích",
    })
    .min(0.01, "Diện tích hợp lệ (> 0)"),
  elevation: z.number().optional(),
  contourInterval: z.number().optional(),
});

type PlotFormValues = z.infer<typeof plotFormSchema>;

interface PlotLayoutProps {
  regionArea: number;
  center: L.LatLng;
  regionPoints: L.LatLng[];
  plots: any[];
  editingPlot: any;
  activePlotPointIndex: number | null;
  plotPointWarnings: Record<number, any>;
  plotWarningForDisplay: any;
  plotPoints: L.LatLng[];
  lands: any[];
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  setEditingPlot: (val: any) => void;
  removePlotPoint: (index: number) => void;
  handlePlotPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddPlotPoint: () => void;
  addPlot: () => void;
  savePlot: (formData: PlotFormValues) => void;
  removePlot: (id: string) => void;
  onPlotPointSelect: (index: number, point: L.LatLng) => void;
  handlePlotPointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  applySuggestedPlotPoint: () => void;
  onLoadPlotForEdit: (plot: any) => void;
}

const PlotEditForm = ({
  editingPlot,
  plotWarningForDisplay,
  applySuggestedPlotPoint,
  handleAddPlotPoint,
  plotPoints,
  activePlotPointIndex,
  plotPointWarnings,
  removePlotPoint,
  handlePlotPointInputChange,
  savePlot,
  setEditingPlot,
  regionArea,
}: any) => {
  const formSchema = useMemo(() => {
    return plotFormSchema.superRefine((data, ctx) => {
      if (regionArea > 0 && data.acreage > regionArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["acreage"],
          message: `Diện tích không được lớn hơn diện tích khu vực (${regionArea} ha)`,
        });
      }
    });
  }, [regionArea]);

  const form = useForm<PlotFormValues>({
    resolver: zodResolver(formSchema as unknown as any),
    defaultValues: {
      name: editingPlot.name || "",
      code: editingPlot.code || "",
      acreage: (editingPlot.acreage as number) || 0,
      elevation:
        editingPlot.elevation !== undefined
          ? Number(editingPlot.elevation)
          : undefined,
      contourInterval:
        editingPlot.contourInterval !== undefined
          ? Number(editingPlot.contourInterval)
          : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: editingPlot?.name || "",
      code: editingPlot?.code || "",
      acreage: (editingPlot?.acreage as number) || 0,
      elevation:
        editingPlot?.elevation !== undefined
          ? Number(editingPlot.elevation)
          : undefined,
      contourInterval:
        editingPlot?.contourInterval !== undefined
          ? Number(editingPlot.contourInterval)
          : undefined,
    });
  }, [editingPlot, form]);

  const onSubmit = (data: PlotFormValues) => {
    savePlot(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col"
        onSubmit={form.handleSubmit(onSubmit as any)}
      >
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">
                {editingPlot.code ? "Sửa lô" : "Thêm lô mới"}
              </h4>
              <p className="text-xs text-muted-foreground">
                Chỉnh sửa ranh giới và thông tin
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setEditingPlot(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Warning Box */}
          {plotWarningForDisplay && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="font-semibold">Cảnh báo vị trí</div>
              <div className="mt-1">
                Điểm {plotWarningForDisplay.index + 1} nằm ngoài khu vực hoặc đè
                lên lô khác.
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                  onClick={applySuggestedPlotPoint}
                >
                  Chỉnh tự động
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel className="text-xs">
                    Tên lô <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Lô trồng lúa..."
                      className="h-8 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3 items-start">
              <FormField
                control={form.control as any}
                name="code"
                render={({ field }) => (
                  <FormItem className="grid gap-2 space-y-0">
                    <FormLabel className="text-xs">
                      Mã lô <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        clearable={false}
                        className="h-8 text-sm font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="acreage"
                render={({ field }) => (
                  <FormItem className="grid gap-2 space-y-0">
                    <FormLabel className="text-xs">
                      Diện tích (ha) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        clearable={false}
                        className="h-8 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-start">
              <FormField
                control={form.control as any}
                name="elevation"
                render={({ field }) => (
                  <FormItem className="grid gap-2 space-y-0">
                    <FormLabel className="text-xs">Độ cao (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        clearable={false}
                        className="h-8 text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : parseFloat(val),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="contourInterval"
                render={({ field }) => (
                  <FormItem className="grid gap-2 space-y-0">
                    <FormLabel className="text-xs">Đường bình độ</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        clearable={false}
                        className="h-8 text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : parseFloat(val),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs">Tọa độ ranh giới</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-primary"
                  onClick={handleAddPlotPoint}
                >
                  <Plus className="mr-1 h-3 w-3" /> Thêm
                </Button>
              </div>

              <div className="space-y-2">
                {plotPoints.map((point: L.LatLng, index: number) => {
                  const isActive = activePlotPointIndex === index;
                  const hasWarning = !!plotPointWarnings[index];

                  return (
                    <div
                      key={`coord-${index}`}
                      className={`rounded border p-2 transition-colors ${
                        hasWarning
                          ? "border-red-300 bg-red-50"
                          : isActive
                            ? "border-primary/50 bg-primary/5"
                            : "bg-white"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-semibold ${hasWarning ? "text-red-600" : ""}`}
                        >
                          Điểm {index + 1}
                        </span>
                        {plotPoints.length > 3 && (
                          <button
                            type="button"
                            onClick={() => removePlotPoint(index)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className={`h-6 px-1 text-[10px] ${hasWarning ? "border-red-200 focus-visible:ring-red-200" : ""}`}
                          type="number"
                          value={point.lat}
                          onChange={(e) =>
                            handlePlotPointInputChange(
                              index,
                              "lat",
                              e.target.value,
                            )
                          }
                          step="0.0001"
                        />
                        <Input
                          className={`h-6 px-1 text-[10px] ${hasWarning ? "border-red-200 focus-visible:ring-red-200" : ""}`}
                          type="number"
                          value={point.lng}
                          onChange={(e) =>
                            handlePlotPointInputChange(
                              index,
                              "lng",
                              e.target.value,
                            )
                          }
                          step="0.0001"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t bg-white p-4">
          <Button type="submit" className="w-full">
            Lưu lô
          </Button>
        </div>
      </form>
    </Form>
  );
};

const PlotLayout = ({
  center,
  regionPoints,
  plots,
  editingPlot,
  activePlotPointIndex,
  plotPointWarnings,
  plotWarningForDisplay,
  plotPoints,
  lands,
  customIcon,
  activeIcon,
  invalidIcon,
  setEditingPlot,
  removePlotPoint,
  handlePlotPointInputChange,
  handleAddPlotPoint,
  addPlot,
  savePlot,
  removePlot,
  onPlotPointSelect,
  handlePlotPointDrag,
  applySuggestedPlotPoint,
  onLoadPlotForEdit,
  regionArea,
}: PlotLayoutProps) => {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 p-4 lg:grid-cols-5">
      <div className="relative overflow-hidden rounded-lg border lg:col-span-3">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          className="h-full w-full"
        >
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

          {plots.map((plot) => {
            if (editingPlot && plot.id === editingPlot.id) return null;
            if (!plot.coordinates || plot.coordinates.length < 3) return null;

            const positions = plot.coordinates.map((coordinate: any) =>
              L.latLng(coordinate.lat, coordinate.lng),
            );

            return (
              <Polygon
                key={plot.id}
                positions={positions}
                pathOptions={{ color: "green", weight: 2 }}
                eventHandlers={{
                  click: () => onLoadPlotForEdit(plot),
                }}
              />
            );
          })}

          {editingPlot && (
            <>
              <Polygon
                positions={plotPoints}
                pathOptions={{
                  color: "#22c55e",
                  weight: 2,
                  fillOpacity: 0.2,
                }}
              />

              {plotPoints.map((point, index) => {
                const isActive = activePlotPointIndex === index;
                const isInvalid = !!plotPointWarnings[index];
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
                      click: () => onPlotPointSelect(index, point),
                      dragstart: (event) =>
                        handlePlotPointDrag(index, event.target.getLatLng(), {
                          finalize: false,
                        }),
                      drag: (event) =>
                        handlePlotPointDrag(index, event.target.getLatLng(), {
                          finalize: false,
                        }),
                      dragend: (event) =>
                        handlePlotPointDrag(index, event.target.getLatLng(), {
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
            </>
          )}
        </MapContainer>
      </div>

      <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-slate-50 lg:col-span-2">
        {!editingPlot ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b bg-white p-4">
              <div>
                <h4 className="font-semibold">Danh sách lô</h4>
                <p className="text-xs text-muted-foreground">
                  {plots.length} lô đã tạo
                </p>
              </div>
              <Button size="sm" onClick={addPlot}>
                <Plus className="mr-2 h-4 w-4" /> Thêm mới
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  className="group relative rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-primary/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-primary">
                        {plot.code}
                      </div>
                      <div className="text-sm font-semibold">{plot.name}</div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{plot.acreage} ha</span>
                        <span className="flex items-center gap-1">
                          •{" "}
                          {lands.find((l) => l.id === plot.landType)?.name ||
                            "Chưa chọn đất"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => onLoadPlotForEdit(plot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => removePlot(plot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {plots.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                  Chưa có lô nào
                  <br />
                  Nhấn "Thêm mới" để bắt đầu vẽ
                </div>
              )}
            </div>
          </div>
        ) : (
          <PlotEditForm
            regionArea={regionArea}
            editingPlot={editingPlot}
            plotWarningForDisplay={plotWarningForDisplay}
            applySuggestedPlotPoint={applySuggestedPlotPoint}
            handleAddPlotPoint={handleAddPlotPoint}
            plotPoints={plotPoints}
            activePlotPointIndex={activePlotPointIndex}
            plotPointWarnings={plotPointWarnings}
            removePlotPoint={removePlotPoint}
            handlePlotPointInputChange={handlePlotPointInputChange}
            savePlot={savePlot}
            setEditingPlot={setEditingPlot}
          />
        )}
      </div>
    </div>
  );
};

export const AreaPlotsStep = ({
  customIcon,
  activeIcon,
  invalidIcon,
}: AreaPlotsStepProps) => {
  const { watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { items: lands } = useCatalog("soil-types", { params: { size: 100 } });

  const coordinates = watch("coordinates") || [];
  const plots: any[] = watch("plots") || [];
  const regionArea = watch("acreage") || 0;

  const regionPoints = useMemo(
    () => coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    [coordinates],
  );

  const generateNextPlotCode = useCallback(() => {
    return `PLOT-${Date.now()}`;
  }, []);

  const [editingPlot, setEditingPlot] = useState<any | null>(null);

  const [plotPoints, setPlotPoints] = useState<L.LatLng[]>([]);
  const [activePlotPointIndex, setActivePlotPointIndex] = useState<
    number | null
  >(null);
  const [plotPointWarnings, setPlotPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activePlotDragWarning, setActivePlotDragWarning] =
    useState<PointWarning | null>(null);

  const regionPolygonFeature = useMemo(() => {
    if (regionPoints.length < 3) return null;
    const coords = regionPoints.map((p: L.LatLng) => [p.lng, p.lat]);
    const first = coords[0];
    if (!first) return null;
    const closed = [...coords, first];
    return polygon([closed]);
  }, [regionPoints]);

  const blockingPlotPolygons = useMemo(() => {
    if (!plots || plots.length === 0) return [];
    return plots
      .filter((sub) => {
        if (!sub.coordinates || sub.coordinates.length < 3) return false;
        if (editingPlot && sub.id === editingPlot.id) return false;
        return true;
      })
      .map((sub) => {
        const poly = toTurfPolygonFromCoords(sub.coordinates);
        if (!poly) return null;
        return { id: sub.id, polygon: poly };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          polygon: NonNullable<ReturnType<typeof toTurfPolygonFromCoords>>;
        } => item !== null,
      );
  }, [plots, editingPlot]);

  const activePersistentPlotWarning = useMemo(() => {
    if (activePlotPointIndex === null) return null;
    return plotPointWarnings[activePlotPointIndex] ?? null;
  }, [activePlotPointIndex, plotPointWarnings]);

  useEffect(() => {
    setPlotPointWarnings({});
    setActivePlotPointIndex(null);
    setActivePlotDragWarning(null);
  }, [editingPlot]);

  const getNearestValidPlotPosition = useCallback(
    (latlng: L.LatLng) => {
      return getNearestPointOnPolygonBoundary(regionPolygonFeature, latlng);
    },
    [regionPolygonFeature],
  );

  const updatePlotWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setPlotPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: removedWarning, ...rest } = prev;
        void removedWarning;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftPlotWarningsAfterRemoval = (removedIndex: number) => {
    setPlotPointWarnings((prev) => {
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

  const setPlotPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setPlotPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const clearPreview = () => {
      if (preview) {
        setActivePlotDragWarning((prev) =>
          prev?.index === index ? null : prev,
        );
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);

    let violationType: "outsideRegion" | "overlapsPlot" | null = null;
    let overlapPolygon: NonNullable<
      ReturnType<typeof toTurfPolygonFromCoords>
    > | null = null;

    if (regionPolygonFeature) {
      const insideRegion = booleanPointInPolygon(
        pointFeature,
        regionPolygonFeature,
      );
      if (!insideRegion) {
        violationType = "outsideRegion";
      }
    }

    if (!violationType && blockingPlotPolygons.length > 0) {
      const overlapping = blockingPlotPolygons.find((subPoly) =>
        booleanPointInPolygon(pointFeature, subPoly.polygon),
      );
      if (overlapping) {
        violationType = "overlapsPlot";
        overlapPolygon = overlapping.polygon;
      }
    }

    if (!violationType) {
      if (persist) {
        updatePlotWarningForIndex(index, null);
      }
      clearPreview();
      return;
    }

    let nearestValid: L.LatLng | null = null;
    if (violationType === "outsideRegion") {
      nearestValid = getNearestValidPlotPosition(latlng);
    } else if (violationType === "overlapsPlot" && overlapPolygon) {
      nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
    }

    if (!nearestValid) {
      clearPreview();
      if (persist) {
        updatePlotWarningForIndex(index, null);
      }
      return;
    }

    const warningData: PointWarning = {
      index,
      invalidLatLng: latlng,
      suggestedLatLng: nearestValid,
    };

    if (preview) {
      setActivePlotDragWarning(warningData);
    }

    if (persist) {
      updatePlotWarningForIndex(index, warningData);
    }
  };

  const applySuggestedPlotPoint = () => {
    if (!activePersistentPlotWarning) return;
    const { index, suggestedLatLng } = activePersistentPlotWarning;
    setPlotPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActivePlotPointIndex(index);
    updatePlotWarningForIndex(index, null);
    setActivePlotDragWarning(null);
  };

  const handlePlotPointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActivePlotPointIndex(index);
    setPlotPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActivePlotDragWarning(null);
    }
  };

  const handleAddPlotPoint = () => {
    const mapCenter = getBoundsFromPoints(plotPoints).getCenter();
    const nextIndex = plotPoints.length;
    const newLatLng = L.latLng(mapCenter.lat + 0.002, mapCenter.lng + 0.002);
    setPlotPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActivePlotPointIndex(nextIndex);
    setActivePlotDragWarning(null);
  };

  const removePlotPoint = (index: number) => {
    if (plotPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = plotPoints.filter((_, i) => i !== index);
    setPlotPoints(newPoints);
    setActivePlotPointIndex(null);
    setActivePlotDragWarning(null);
    shiftPlotWarningsAfterRemoval(index);
  };

  const handlePlotPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = plotPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setPlotPointWithValidation(index, updated, {
      persist: true,
      preview: false,
    });
    setActivePlotPointIndex(index);
    setActivePlotDragWarning(null);
  };

  const addPlot = () => {
    const newSub: any = {
      acreage: 0,
      code: generateNextPlotCode(),
      coordinates: [],
      name: "Lô mới",
      id: `sub-${Date.now()}`,
      landType: "",
    };

    setEditingPlot(newSub);
    const mapCenter = getBoundsFromPoints(regionPoints).getCenter();
    setPlotPoints([
      L.latLng(mapCenter.lat - 0.002, mapCenter.lng - 0.002),
      L.latLng(mapCenter.lat + 0.002, mapCenter.lng - 0.002),
      L.latLng(mapCenter.lat + 0.002, mapCenter.lng + 0.002),
      L.latLng(mapCenter.lat - 0.002, mapCenter.lng + 0.002),
    ]);
  };

  const savePlot = (formData: PlotFormValues) => {
    if (!editingPlot) return;

    if (plotPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho lô",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = plotPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const updatedSub = {
      ...editingPlot,
      ...formData,
      code: formData.code.trim() || generateNextPlotCode(),
      coordinates: fullCoords,
    } as any;

    const currentSubs = watch("plots") || [];
    const index = currentSubs.findIndex((s: any) => s.id === updatedSub.id);

    let newSubs;
    if (index >= 0) {
      newSubs = [...currentSubs];
      newSubs[index] = updatedSub;
    } else {
      newSubs = [...currentSubs, updatedSub];
    }

    setValue("plots", newSubs, { shouldValidate: true });
    setEditingPlot(null);
  };

  const removePlot = (id: string) => {
    setValue(
      "plots",
      plots.filter((s) => s.id !== id),
      { shouldValidate: true },
    );
  };

  const onLoadPlotForEdit = (plot: any) => {
    setEditingPlot(plot);
    if (plot.coordinates && plot.coordinates.length >= 3) {
      setPlotPoints(
        plot.coordinates.map((coordinate: any) =>
          L.latLng(coordinate.lat, coordinate.lng),
        ),
      );
    }
  };

  const onPlotPointSelect = (index: number, point: L.LatLng) => {
    setActivePlotPointIndex(index);
    setPlotPointWithValidation(index, point, {
      persist: true,
      preview: false,
    });
  };

  const plotWarningForDisplay =
    activePlotDragWarning ?? activePersistentPlotWarning;

  const center = getBoundsFromPoints(regionPoints).getCenter();

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-4 pt-3">
        <CardTitle>Phân chia lô</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          title="Phóng to toàn màn hình"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {!isFullscreen && (
          <PlotLayout
            center={center}
            regionPoints={regionPoints}
            plots={plots}
            editingPlot={editingPlot}
            activePlotPointIndex={activePlotPointIndex}
            plotPointWarnings={plotPointWarnings}
            plotWarningForDisplay={plotWarningForDisplay}
            plotPoints={plotPoints}
            regionArea={regionArea}
            lands={lands}
            customIcon={customIcon}
            activeIcon={activeIcon}
            invalidIcon={invalidIcon}
            setEditingPlot={setEditingPlot}
            removePlotPoint={removePlotPoint}
            handlePlotPointInputChange={handlePlotPointInputChange}
            handleAddPlotPoint={handleAddPlotPoint}
            addPlot={addPlot}
            savePlot={savePlot}
            removePlot={removePlot}
            onPlotPointSelect={onPlotPointSelect}
            handlePlotPointDrag={handlePlotPointDrag}
            applySuggestedPlotPoint={applySuggestedPlotPoint}
            onLoadPlotForEdit={onLoadPlotForEdit}
          />
        )}

        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="flex h-[95vh] max-w-[95vw] flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Phân chia lô</h2>
            </div>
            {isFullscreen && (
              <PlotLayout
                center={center}
                regionPoints={regionPoints}
                plots={plots}
                editingPlot={editingPlot}
                activePlotPointIndex={activePlotPointIndex}
                plotPointWarnings={plotPointWarnings}
                plotWarningForDisplay={plotWarningForDisplay}
                plotPoints={plotPoints}
                regionArea={regionArea}
                lands={lands}
                customIcon={customIcon}
                activeIcon={activeIcon}
                invalidIcon={invalidIcon}
                setEditingPlot={setEditingPlot}
                removePlotPoint={removePlotPoint}
                handlePlotPointInputChange={handlePlotPointInputChange}
                handleAddPlotPoint={handleAddPlotPoint}
                addPlot={addPlot}
                savePlot={savePlot}
                removePlot={removePlot}
                onPlotPointSelect={onPlotPointSelect}
                handlePlotPointDrag={handlePlotPointDrag}
                applySuggestedPlotPoint={applySuggestedPlotPoint}
                onLoadPlotForEdit={onLoadPlotForEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
