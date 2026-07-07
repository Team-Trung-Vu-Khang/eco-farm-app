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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

import type { SubArea } from "../../constants";
import {
  getBoundsFromPoints,
  getNearestPointOnPolygonBoundary,
  toTurfPolygonFromCoords,
  type PointWarning,
} from "../utils";

import { useCatalog } from "@/features/foundation/hooks/useCatalog";

interface RegionSubAreaStepProps {
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
}

const subAreaFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khu vực"),
  code: z.string().optional(),
  area: z.coerce
    .number({
      error: "Vui lòng nhập diện tích",
    })
    .min(0.01, "Diện tích hợp lệ (> 0)"),
  landType: z.string().min(1, "Vui lòng chọn loại đất"),
});

type SubAreaFormValues = z.infer<typeof subAreaFormSchema>;

interface SubAreaLayoutProps {
  regionArea: number;
  center: L.LatLng;
  regionPoints: L.LatLng[];
  subAreas: any[];
  editingSubArea: any;
  activeSubAreaPointIndex: number | null;
  subAreaPointWarnings: Record<number, any>;
  subAreaWarningForDisplay: any;
  subAreaPoints: L.LatLng[];
  isDraggingSubAreaPoint: boolean;
  lands: any[];
  customIcon: L.Icon;
  activeIcon: L.Icon;
  invalidIcon: L.Icon;
  setEditingSubArea: (val: any) => void;
  removeSubAreaPoint: (index: number) => void;
  handleSubAreaPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddSubAreaPoint: () => void;
  addSubArea: () => void;
  saveSubArea: (formData: SubAreaFormValues) => void;
  removeSubArea: (id: string) => void;
  onSubAreaPointSelect: (index: number, point: L.LatLng) => void;
  handleSubAreaPointDrag: (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => void;
  applySuggestedSubAreaPoint: () => void;
  setSubAreaPoints: (points: L.LatLng[]) => void;
  onLoadSubAreaForEdit: (subArea: any) => void;
}

const SubAreaEditForm = ({
  editingSubArea,
  subAreaWarningForDisplay,
  applySuggestedSubAreaPoint,
  lands,
  handleAddSubAreaPoint,
  subAreaPoints,
  activeSubAreaPointIndex,
  subAreaPointWarnings,
  removeSubAreaPoint,
  handleSubAreaPointInputChange,
  saveSubArea,
  setEditingSubArea,
  regionArea,
}: any) => {
  const formSchema = useMemo(() => {
    return subAreaFormSchema.superRefine((data, ctx) => {
      if (regionArea > 0 && data.area > regionArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["area"],
          message: `Diện tích không được lớn hơn diện tích vùng trồng (${regionArea} ha)`,
        });
      }
    });
  }, [regionArea]);

  const form = useForm<SubAreaFormValues>({
    resolver: zodResolver(formSchema as unknown as any),
    defaultValues: {
      code: editingSubArea.code,
      name: editingSubArea.name || "",
      landType: editingSubArea.landType || "",
      area: (editingSubArea.area as number) || 0,
    },
  });

  const onSubmit = (data: SubAreaFormValues) => {
    saveSubArea(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">
                {editingSubArea.code ? "Sửa khu vực" : "Thêm khu vực mới"}
              </h4>
              <p className="text-xs text-muted-foreground">
                Chỉnh sửa ranh giới và thông tin
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setEditingSubArea(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Warning Box */}
          {subAreaWarningForDisplay && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="font-semibold">Cảnh báo vị trí</div>
              <div className="mt-1">
                Điểm {subAreaWarningForDisplay.index + 1} nằm ngoài vùng trồng
                hoặc đè lên khu vực khác.
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                  onClick={applySuggestedSubAreaPoint}
                >
                  Chỉnh tự động
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel className="text-xs">
                    Tên khu vực <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Khu vực trồng lúa..."
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
                control={form.control}
                name="area"
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

              <FormField
                control={form.control}
                name="landType"
                render={({ field }) => (
                  <FormItem className="grid gap-2 space-y-0">
                    <FormLabel className="text-xs">
                      Loại đất <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Chọn loại đất" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lands.map((land: any) => (
                          <SelectItem
                            key={land.id}
                            value={String(land.id || land.code)}
                          >
                            {land.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  onClick={handleAddSubAreaPoint}
                >
                  <Plus className="mr-1 h-3 w-3" /> Thêm
                </Button>
              </div>

              <div className="space-y-2">
                {subAreaPoints.map((point: L.LatLng, index: number) => {
                  const isActive = activeSubAreaPointIndex === index;
                  const hasWarning = !!subAreaPointWarnings[index];

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
                        {subAreaPoints.length > 3 && (
                          <button
                            type="button"
                            onClick={() => removeSubAreaPoint(index)}
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
                            handleSubAreaPointInputChange(
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
                            handleSubAreaPointInputChange(
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
            Lưu khu vực
          </Button>
        </div>
      </form>
    </Form>
  );
};

const SubAreaLayout = ({
  center,
  regionPoints,
  subAreas,
  editingSubArea,
  activeSubAreaPointIndex,
  subAreaPointWarnings,
  subAreaWarningForDisplay,
  subAreaPoints,
  lands,
  customIcon,
  activeIcon,
  invalidIcon,
  setEditingSubArea,
  removeSubAreaPoint,
  handleSubAreaPointInputChange,
  handleAddSubAreaPoint,
  addSubArea,
  saveSubArea,
  removeSubArea,
  onSubAreaPointSelect,
  handleSubAreaPointDrag,
  applySuggestedSubAreaPoint,
  onLoadSubAreaForEdit,
  regionArea,
}: SubAreaLayoutProps) => {
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

          {subAreas.map((subArea) => {
            if (editingSubArea && subArea.id === editingSubArea.id) return null;
            if (!subArea.coordinates || subArea.coordinates.length < 3)
              return null;

            const positions = subArea.coordinates.map(
              (coordinate: Record<string, number>) =>
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
                        handleSubAreaPointDrag(
                          index,
                          event.target.getLatLng(),
                          {
                            finalize: false,
                          },
                        ),
                      drag: (event) =>
                        handleSubAreaPointDrag(
                          index,
                          event.target.getLatLng(),
                          {
                            finalize: false,
                          },
                        ),
                      dragend: (event) =>
                        handleSubAreaPointDrag(
                          index,
                          event.target.getLatLng(),
                          {
                            finalize: true,
                          },
                        ),
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
      </div>

      <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-slate-50 lg:col-span-2">
        {!editingSubArea ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b bg-white p-4">
              <div>
                <h4 className="font-semibold">Danh sách khu vực</h4>
                <p className="text-xs text-muted-foreground">
                  {subAreas.length} khu vực đã tạo
                </p>
              </div>
              <Button size="sm" onClick={addSubArea}>
                <Plus className="mr-2 h-4 w-4" /> Thêm mới
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {subAreas.map((subArea) => (
                <div
                  key={subArea.id}
                  className="group relative rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-primary/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">
                        {subArea.name}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{subArea.area} ha</span>
                        <span className="flex items-center gap-1">
                          •{" "}
                          {lands.find((l) => l.id === subArea.landType)?.name ||
                            "Chưa chọn đất"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => onLoadSubAreaForEdit(subArea)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => removeSubArea(subArea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {subAreas.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                  Chưa có khu vực nào
                  <br />
                  Nhấn "Thêm mới" để bắt đầu vẽ
                </div>
              )}
            </div>
          </div>
        ) : (
          <SubAreaEditForm
            regionArea={regionArea}
            editingSubArea={editingSubArea}
            subAreaWarningForDisplay={subAreaWarningForDisplay}
            applySuggestedSubAreaPoint={applySuggestedSubAreaPoint}
            lands={lands}
            handleAddSubAreaPoint={handleAddSubAreaPoint}
            subAreaPoints={subAreaPoints}
            activeSubAreaPointIndex={activeSubAreaPointIndex}
            subAreaPointWarnings={subAreaPointWarnings}
            removeSubAreaPoint={removeSubAreaPoint}
            handleSubAreaPointInputChange={handleSubAreaPointInputChange}
            saveSubArea={saveSubArea}
            setEditingSubArea={setEditingSubArea}
          />
        )}
      </div>
    </div>
  );
};

export const RegionSubAreaStep = ({
  customIcon,
  activeIcon,
  invalidIcon,
}: RegionSubAreaStepProps) => {
  const { watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { items: lands } = useCatalog("soil-types", { params: { size: 100 } });

  const coordinates = watch("coordinates") || [];
  const subAreas: SubArea[] = watch("subAreas") || [];
  const regionArea = watch("area") || 0;

  const regionPoints = useMemo(
    () => coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    [coordinates],
  );

  const generateNextSubAreaCode = useCallback(() => {
    return `AREA-${Date.now()}`;
  }, []);

  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );

  const [subAreaPoints, setSubAreaPoints] = useState<L.LatLng[]>([]);
  const [activeSubAreaPointIndex, setActiveSubAreaPointIndex] = useState<
    number | null
  >(null);
  const [subAreaPointWarnings, setSubAreaPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activeSubAreaDragWarning, setActiveSubAreaDragWarning] =
    useState<PointWarning | null>(null);
  const [isDraggingSubAreaPoint, setIsDraggingSubAreaPoint] = useState(false);

  const regionPolygonFeature = useMemo(() => {
    if (regionPoints.length < 3) return null;
    const coords = regionPoints.map((p: Record<string, number>) => [
      p.lng,
      p.lat,
    ]);
    const first = coords[0];
    const closed = [...coords, first];
    return polygon([closed]);
  }, [regionPoints]);

  const blockingSubAreaPolygons = useMemo(() => {
    if (!subAreas || subAreas.length === 0) return [];
    return subAreas
      .filter((sub) => {
        if (!sub.coordinates || sub.coordinates.length < 3) return false;
        if (editingSubArea && sub.id === editingSubArea.id) return false;
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
  }, [subAreas, editingSubArea]);

  const activePersistentSubAreaWarning = useMemo(() => {
    if (activeSubAreaPointIndex === null) return null;
    return subAreaPointWarnings[activeSubAreaPointIndex] ?? null;
  }, [activeSubAreaPointIndex, subAreaPointWarnings]);

  useEffect(() => {
    setSubAreaPointWarnings({});
    setActiveSubAreaPointIndex(null);
    setActiveSubAreaDragWarning(null);
    setIsDraggingSubAreaPoint(false);
  }, [editingSubArea]);

  const getNearestValidSubAreaPosition = useCallback(
    (latlng: L.LatLng) => {
      return getNearestPointOnPolygonBoundary(regionPolygonFeature, latlng);
    },
    [regionPolygonFeature],
  );

  const updateSubAreaWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setSubAreaPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: removedWarning, ...rest } = prev;
        void removedWarning;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftSubAreaWarningsAfterRemoval = (removedIndex: number) => {
    setSubAreaPointWarnings((prev) => {
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

  const setSubAreaPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setSubAreaPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const clearPreview = () => {
      if (preview) {
        setActiveSubAreaDragWarning((prev) =>
          prev?.index === index ? null : prev,
        );
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);

    let violationType: "outsideRegion" | "overlapsSubArea" | null = null;
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

    if (!violationType && blockingSubAreaPolygons.length > 0) {
      const overlapping = blockingSubAreaPolygons.find((subPoly) =>
        booleanPointInPolygon(pointFeature, subPoly.polygon),
      );
      if (overlapping) {
        violationType = "overlapsSubArea";
        overlapPolygon = overlapping.polygon;
      }
    }

    if (!violationType) {
      if (persist) {
        updateSubAreaWarningForIndex(index, null);
      }
      clearPreview();
      return;
    }

    let nearestValid: L.LatLng | null = null;
    if (violationType === "outsideRegion") {
      nearestValid = getNearestValidSubAreaPosition(latlng);
    } else if (violationType === "overlapsSubArea" && overlapPolygon) {
      nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
    }

    if (!nearestValid) {
      clearPreview();
      if (persist) {
        updateSubAreaWarningForIndex(index, null);
      }
      return;
    }

    const warningData: PointWarning = {
      index,
      invalidLatLng: latlng,
      suggestedLatLng: nearestValid,
    };

    if (preview) {
      setActiveSubAreaDragWarning(warningData);
    }

    if (persist) {
      updateSubAreaWarningForIndex(index, warningData);
    }
  };

  const applySuggestedSubAreaPoint = () => {
    if (!activePersistentSubAreaWarning) return;
    const { index, suggestedLatLng } = activePersistentSubAreaWarning;
    setSubAreaPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(index);
    updateSubAreaWarningForIndex(index, null);
    setActiveSubAreaDragWarning(null);
  };

  const handleSubAreaPointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActiveSubAreaPointIndex(index);
    setSubAreaPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActiveSubAreaDragWarning(null);
    }
  };

  const handleAddSubAreaPoint = () => {
    const mapCenter = getBoundsFromPoints(subAreaPoints).getCenter();
    const nextIndex = subAreaPoints.length;
    const newLatLng = L.latLng(mapCenter.lat + 0.002, mapCenter.lng + 0.002);
    setSubAreaPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(nextIndex);
    setActiveSubAreaDragWarning(null);
  };

  const removeSubAreaPoint = (index: number) => {
    if (subAreaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = subAreaPoints.filter((_, i) => i !== index);
    setSubAreaPoints(newPoints);
    setActiveSubAreaPointIndex(null);
    setActiveSubAreaDragWarning(null);
    shiftSubAreaWarningsAfterRemoval(index);
  };

  const handleSubAreaPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = subAreaPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setSubAreaPointWithValidation(index, updated, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(index);
    setActiveSubAreaDragWarning(null);
  };

  const addSubArea = () => {
    const newSub: Omit<SubArea, "regionId"> = {
      area: 0,
      plots: [],
      landType: "",
      coordinates: [],
      status: "active",
      name: "Khu vực mới",
      id: `sub-${Date.now()}`,
      terrain: watch("terrain") || "",
      createdAt: new Date().toISOString(),
    };

    setEditingSubArea(newSub);
    const mapCenter = getBoundsFromPoints(regionPoints).getCenter();
    setSubAreaPoints([
      L.latLng(mapCenter.lat - 0.002, mapCenter.lng - 0.002),
      L.latLng(mapCenter.lat + 0.002, mapCenter.lng - 0.002),
      L.latLng(mapCenter.lat + 0.002, mapCenter.lng + 0.002),
      L.latLng(mapCenter.lat - 0.002, mapCenter.lng + 0.002),
    ]);
  };

  const saveSubArea = (formData: SubAreaFormValues) => {
    if (!editingSubArea) return;

    if (subAreaPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho khu vực",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = subAreaPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const updatedSub = {
      ...editingSubArea,
      ...formData,
      code: formData.code?.trim() || editingSubArea.code,
      coordinates: fullCoords,
    } as SubArea;

    const currentSubs = watch("subAreas") || [];
    const index = currentSubs.findIndex((s: any) => s.id === updatedSub.id);

    let newSubs;
    if (index >= 0) {
      newSubs = [...currentSubs];
      newSubs[index] = updatedSub;
    } else {
      newSubs = [...currentSubs, updatedSub];
    }

    setValue("subAreas", newSubs, { shouldValidate: true });
    setEditingSubArea(null);
  };

  const removeSubArea = (id: string) => {
    setValue(
      "subAreas",
      subAreas.filter((s) => s.id !== id),
      { shouldValidate: true },
    );
  };

  const onLoadSubAreaForEdit = (subArea: SubArea) => {
    setEditingSubArea(subArea);
    if (subArea.coordinates && subArea.coordinates.length >= 3) {
      setSubAreaPoints(
        subArea.coordinates.map((coordinate) =>
          L.latLng(coordinate.lat, coordinate.lng),
        ),
      );
    }
  };

  const onSubAreaPointSelect = (index: number, point: L.LatLng) => {
    setActiveSubAreaPointIndex(index);
    setSubAreaPointWithValidation(index, point, {
      persist: true,
      preview: false,
    });
  };

  const subAreaWarningForDisplay =
    activeSubAreaDragWarning ?? activePersistentSubAreaWarning;

  const center = getBoundsFromPoints(regionPoints).getCenter();

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-4 pt-3">
        <CardTitle>Phân chia khu vực con</CardTitle>
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
          <SubAreaLayout
            center={center}
            regionPoints={regionPoints}
            subAreas={subAreas}
            editingSubArea={editingSubArea}
            activeSubAreaPointIndex={activeSubAreaPointIndex}
            subAreaPointWarnings={subAreaPointWarnings}
            subAreaWarningForDisplay={subAreaWarningForDisplay}
            subAreaPoints={subAreaPoints}
            isDraggingSubAreaPoint={isDraggingSubAreaPoint}
            regionArea={regionArea}
            lands={lands}
            customIcon={customIcon}
            activeIcon={activeIcon}
            invalidIcon={invalidIcon}
            setEditingSubArea={setEditingSubArea}
            removeSubAreaPoint={removeSubAreaPoint}
            handleSubAreaPointInputChange={handleSubAreaPointInputChange}
            handleAddSubAreaPoint={handleAddSubAreaPoint}
            addSubArea={addSubArea}
            saveSubArea={saveSubArea}
            removeSubArea={removeSubArea}
            onSubAreaPointSelect={onSubAreaPointSelect}
            handleSubAreaPointDrag={handleSubAreaPointDrag}
            applySuggestedSubAreaPoint={applySuggestedSubAreaPoint}
            setSubAreaPoints={setSubAreaPoints}
            onLoadSubAreaForEdit={onLoadSubAreaForEdit}
          />
        )}

        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="flex h-[95vh] max-w-[95vw] flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Phân chia khu vực con</h2>
            </div>
            {isFullscreen && (
              <SubAreaLayout
                center={center}
                regionPoints={regionPoints}
                subAreas={subAreas}
                editingSubArea={editingSubArea}
                activeSubAreaPointIndex={activeSubAreaPointIndex}
                subAreaPointWarnings={subAreaPointWarnings}
                subAreaWarningForDisplay={subAreaWarningForDisplay}
                subAreaPoints={subAreaPoints}
                isDraggingSubAreaPoint={isDraggingSubAreaPoint}
                regionArea={regionArea}
                lands={lands}
                customIcon={customIcon}
                activeIcon={activeIcon}
                invalidIcon={invalidIcon}
                setEditingSubArea={setEditingSubArea}
                removeSubAreaPoint={removeSubAreaPoint}
                handleSubAreaPointInputChange={handleSubAreaPointInputChange}
                handleAddSubAreaPoint={handleAddSubAreaPoint}
                addSubArea={addSubArea}
                saveSubArea={saveSubArea}
                removeSubArea={removeSubArea}
                onSubAreaPointSelect={onSubAreaPointSelect}
                handleSubAreaPointDrag={handleSubAreaPointDrag}
                applySuggestedSubAreaPoint={applySuggestedSubAreaPoint}
                setSubAreaPoints={setSubAreaPoints}
                onLoadSubAreaForEdit={onLoadSubAreaForEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
