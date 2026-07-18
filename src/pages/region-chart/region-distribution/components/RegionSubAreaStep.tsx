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
import readXlsxFile from "read-excel-file";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Plus, Trash2, X, Edit } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
  useMap,
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
  handleImportExcel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadSampleExcel: () => void;
  subAreaMapFitTrigger: number;
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
  handleImportExcel,
  handleDownloadSampleExcel,
}: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formSchema = useMemo(() => {
    return subAreaFormSchema.superRefine((data, ctx) => {
      if (regionArea > 0 && data.area > regionArea) {
        ctx.addIssue({
          code: "custom",
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

  useEffect(() => {
    form.reset({
      code: editingSubArea.code || "",
      name: editingSubArea.name || "",
      landType: editingSubArea.landType || "",
      area: (editingSubArea.area as number) || 0,
    });
  }, [editingSubArea, form]);

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
                <Label className="text-xs font-semibold">
                  Tọa độ ranh giới
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-primary"
                  onClick={handleAddSubAreaPoint}
                >
                  <Plus className="mr-1 h-3 w-3" /> Thêm điểm
                </Button>
              </div>
              <div className="mb-3 flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
                <a
                  download="mau_toa_do_khu_vuc.xlsx"
                  className="h-7 flex-1 text-[11px] text-primary border border-primary/20 hover:bg-primary/5 px-1 flex items-center justify-center rounded-md font-medium transition-colors"
                  href="https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/4189c31a-0465-48af-95e9-77cce96e5499-mau_toa_do_khu_vuc.xlsx"
                >
                  Tải file mẫu
                </a>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 flex-1 text-[11px] px-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Nhập Excel
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

const FitBoundsOnce = ({
  points,
  fitTrigger,
}: {
  points: L.LatLng[];
  fitTrigger?: number;
}) => {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (points.length > 0 && !hasFitRef.current) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
        hasFitRef.current = true;
      }
    }
  }, [points, map]);

  useEffect(() => {
    if (points.length > 0 && fitTrigger) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [fitTrigger, points, map]);

  return null;
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
  handleImportExcel,
  handleDownloadSampleExcel,
  subAreaMapFitTrigger,
}: SubAreaLayoutProps) => {
  return (
    <div className="grid h-auto lg:h-full w-full grid-cols-1 gap-6 p-4 lg:grid-cols-5 overflow-y-auto lg:overflow-hidden">
      <div className="relative z-0 h-96 lg:h-full w-full lg:col-span-3 shrink-0 lg:shrink overflow-hidden rounded-lg border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          className="h-full w-full"
        >
          <FitBoundsOnce points={regionPoints} />
          <FitBoundsOnce
            points={subAreaPoints}
            fitTrigger={subAreaMapFitTrigger}
          />
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

      <div className="flex h-[500px] lg:h-full w-full lg:col-span-2 shrink-0 lg:shrink flex-col overflow-hidden rounded-lg border bg-slate-50">
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
            handleImportExcel={handleImportExcel}
            handleDownloadSampleExcel={handleDownloadSampleExcel}
          />
        )}
      </div>
    </div>
  );
};

const isSegmentsIntersecting = (
  p1: L.LatLng,
  q1: L.LatLng,
  p2: L.LatLng,
  q2: L.LatLng,
) => {
  if (p1.equals(p2) || p1.equals(q2) || q1.equals(p2) || q1.equals(q2)) {
    return false;
  }
  const ccw = (A: L.LatLng, B: L.LatLng, C: L.LatLng) => {
    return (
      (C.lat - A.lat) * (B.lng - A.lng) > (B.lat - A.lat) * (C.lng - A.lng)
    );
  };
  return (
    ccw(p1, p2, q2) !== ccw(q1, p2, q2) && ccw(p1, q1, p2) !== ccw(p1, q1, q2)
  );
};

const isSelfIntersecting = (points: L.LatLng[]) => {
  const n = points.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const q1 = points[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if ((j + 1) % n === i) continue;
      const p2 = points[j];
      const q2 = points[(j + 1) % n];
      if (isSegmentsIntersecting(p1, q1, p2, q2)) {
        return true;
      }
    }
  }
  return false;
};

const isOverlappingAny = (newPoints: L.LatLng[], existingSubs: any[]) => {
  const newPoly = toTurfPolygonFromCoords(
    newPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
  );
  if (!newPoly) return false;

  for (const sub of existingSubs) {
    if (!sub.coordinates || sub.coordinates.length < 3) continue;
    const subPoly = toTurfPolygonFromCoords(sub.coordinates);
    if (!subPoly) continue;

    // Check if any corner of the new sub-area is inside this existing sub-area
    for (const p of newPoints) {
      if (booleanPointInPolygon(point([p.lng, p.lat]), subPoly)) {
        return true;
      }
    }

    // Check if any corner of the existing sub-area is inside the new sub-area
    for (const c of sub.coordinates) {
      if (booleanPointInPolygon(point([c.lng, c.lat]), newPoly)) {
        return true;
      }
    }

    // Check if the center of either polygon is inside the other
    const newCenterLat =
      newPoints.reduce((sum, p) => sum + p.lat, 0) / newPoints.length;
    const newCenterLng =
      newPoints.reduce((sum, p) => sum + p.lng, 0) / newPoints.length;
    if (booleanPointInPolygon(point([newCenterLng, newCenterLat]), subPoly)) {
      return true;
    }

    const subCenterLat =
      sub.coordinates.reduce((sum: number, c: any) => sum + c.lat, 0) /
      sub.coordinates.length;
    const subCenterLng =
      sub.coordinates.reduce((sum: number, c: any) => sum + c.lng, 0) /
      sub.coordinates.length;
    if (booleanPointInPolygon(point([subCenterLng, subCenterLat]), newPoly)) {
      return true;
    }
  }

  return false;
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

  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );
  const [subAreaMapFitTrigger, setSubAreaMapFitTrigger] = useState(0);

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

  const validateAllSubAreaPoints = (points: L.LatLng[]) => {
    const newWarnings: Record<number, PointWarning> = {};

    points.forEach((latlng, idx) => {
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

      if (violationType) {
        let nearestValid: L.LatLng | null = null;
        if (violationType === "outsideRegion") {
          nearestValid = getNearestValidSubAreaPosition(latlng);
        } else if (violationType === "overlapsSubArea" && overlapPolygon) {
          nearestValid = getNearestPointOnPolygonBoundary(
            overlapPolygon,
            latlng,
          );
        }

        if (nearestValid) {
          newWarnings[idx] = {
            index: idx,
            invalidLatLng: latlng,
            suggestedLatLng: nearestValid,
          };
        }
      }
    });

    setSubAreaPointWarnings(newWarnings);
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
    if (options?.finalize) {
      setSubAreaPoints((prev) => {
        const next = [...prev];
        next[index] = latlng;

        if (next.length <= 2) {
          validateAllSubAreaPoints(next);
          return next;
        }

        // Only sort angularly if there's self-intersection (overlapping edges)
        if (isSelfIntersecting(next)) {
          let latSum = 0;
          let lngSum = 0;
          for (const p of next) {
            latSum += p.lat;
            lngSum += p.lng;
          }
          const centroidLat = latSum / next.length;
          const centroidLng = lngSum / next.length;

          // Sort coordinates angularly to prevent overlapping edges
          const sorted = [...next].sort((a, b) => {
            const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
            const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
            return angleA - angleB;
          });

          validateAllSubAreaPoints(sorted);
          return sorted;
        }

        // Otherwise, keep the original point order
        validateAllSubAreaPoints(next);
        return next;
      });
      setActiveSubAreaDragWarning(null);
    } else {
      setSubAreaPointWithValidation(index, latlng, {
        persist: false,
        preview: true,
      });
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
    const bounds = getBoundsFromPoints(regionPoints);
    const height = bounds.getNorth() - bounds.getSouth();
    const width = bounds.getEast() - bounds.getWest();

    // Sizing: 15% of the region dimensions to scale appropriately
    const sizeLat = Math.max(height * 0.15, 0.0005);
    const sizeLng = Math.max(width * 0.15, 0.0005);

    const regionPoly = toTurfPolygonFromCoords(
      regionPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
    );

    const currentSubs = watch("subAreas") || [];

    let bestCenter = bounds.getCenter();
    let foundValid = false;

    // Grid search for an unoccupied candidate position inside the region bounds
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        const candidateLat = bounds.getSouth() + (height * i) / 7;
        const candidateLng = bounds.getWest() + (width * j) / 7;

        const corners = [
          L.latLng(candidateLat - sizeLat / 2, candidateLng - sizeLng / 2),
          L.latLng(candidateLat + sizeLat / 2, candidateLng - sizeLng / 2),
          L.latLng(candidateLat + sizeLat / 2, candidateLng + sizeLng / 2),
          L.latLng(candidateLat - sizeLat / 2, candidateLng + sizeLng / 2),
        ];

        let isInsideRegion = true;
        if (regionPoly) {
          for (const corner of corners) {
            if (
              !booleanPointInPolygon(
                point([corner.lng, corner.lat]),
                regionPoly,
              )
            ) {
              isInsideRegion = false;
              break;
            }
          }
        }

        if (isInsideRegion) {
          const overlaps = isOverlappingAny(corners, currentSubs);
          if (!overlaps) {
            bestCenter = L.latLng(candidateLat, candidateLng);
            foundValid = true;
            break;
          }
        }
      }
      if (foundValid) break;
    }

    // Fallback: search for any candidate position inside the region bounds, relaxing the non-overlapping check
    if (!foundValid && regionPoly) {
      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
          const candidateLat = bounds.getSouth() + (height * i) / 7;
          const candidateLng = bounds.getWest() + (width * j) / 7;
          const corners = [
            L.latLng(candidateLat - sizeLat / 2, candidateLng - sizeLng / 2),
            L.latLng(candidateLat + sizeLat / 2, candidateLng - sizeLng / 2),
            L.latLng(candidateLat + sizeLat / 2, candidateLng + sizeLng / 2),
            L.latLng(candidateLat - sizeLat / 2, candidateLng + sizeLng / 2),
          ];

          let isInsideRegion = true;
          for (const corner of corners) {
            if (
              !booleanPointInPolygon(
                point([corner.lng, corner.lat]),
                regionPoly,
              )
            ) {
              isInsideRegion = false;
              break;
            }
          }
          if (isInsideRegion) {
            bestCenter = L.latLng(candidateLat, candidateLng);
            foundValid = true;
            break;
          }
        }
        if (foundValid) break;
      }
    }

    setSubAreaPoints([
      L.latLng(bestCenter.lat - sizeLat / 2, bestCenter.lng - sizeLng / 2),
      L.latLng(bestCenter.lat + sizeLat / 2, bestCenter.lng - sizeLng / 2),
      L.latLng(bestCenter.lat + sizeLat / 2, bestCenter.lng + sizeLng / 2),
      L.latLng(bestCenter.lat - sizeLat / 2, bestCenter.lng + sizeLng / 2),
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

  const handleDownloadSampleExcel = useCallback(() => {
    const link = document.createElement("a");
    link.href =
      "https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/4189c31a-0465-48af-95e9-77cce96e5499-mau_toa_do_khu_vuc.xlsx";
    link.download = "mau_toa_do_khu_vuc.xlsx";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleImportExcel = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const rows = await readXlsxFile(file);

        console.log("rows", rows);

        if (rows.length < 2) {
          toast({
            title: "Lỗi",
            description:
              "File excel không có dữ liệu hoặc không đúng định dạng.",
            variant: "destructive",
          });
          return;
        }

        const headers = rows[0] as string[];
        let latIdx = -1;
        let lngIdx = -1;

        headers.forEach((header, i) => {
          if (!header) return;
          const cleanHeader = header
            .toString()
            .normalize("NFC")
            .trim()
            .toLowerCase();
          const cleanHeaderNoDiacritics = cleanHeader
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/[đ]/g, "d");

          if (
            cleanHeader === "lat" ||
            cleanHeader.includes("latitude") ||
            cleanHeader.includes("vĩ độ") ||
            cleanHeaderNoDiacritics.includes("vi do")
          ) {
            latIdx = i;
          }
          if (
            cleanHeader === "lng" ||
            cleanHeader === "lon" ||
            cleanHeader.includes("longitude") ||
            cleanHeader.includes("kinh độ") ||
            cleanHeaderNoDiacritics.includes("kinh do")
          ) {
            lngIdx = i;
          }
        });

        if (latIdx === -1 || lngIdx === -1) {
          toast({
            title: "Lỗi",
            description:
              "Không tìm thấy cột Lat (Vĩ độ) hoặc Lng (Kinh độ) trong file Excel.",
            variant: "destructive",
          });
          return;
        }

        const parsedPoints: L.LatLng[] = [];
        const dataRows = rows.slice(1);

        for (const row of dataRows) {
          const latVal = parseFloat(row[latIdx]?.toString() || "");
          const lngVal = parseFloat(row[lngIdx]?.toString() || "");

          if (!isNaN(latVal) && !isNaN(lngVal)) {
            parsedPoints.push(L.latLng(latVal, lngVal));
          }
        }

        if (parsedPoints.length < 3) {
          toast({
            title: "Lỗi",
            description:
              "Cần ít nhất 3 điểm toạ độ hợp lệ để tạo thành đa giác khu vực.",
            variant: "destructive",
          });
          return;
        }

        let finalPoints = parsedPoints;
        if (isSelfIntersecting(parsedPoints)) {
          let latSum = 0;
          let lngSum = 0;
          for (const p of parsedPoints) {
            latSum += p.lat;
            lngSum += p.lng;
          }
          const centroidLat = latSum / parsedPoints.length;
          const centroidLng = lngSum / parsedPoints.length;

          finalPoints = [...parsedPoints].sort((a, b) => {
            const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
            const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
            return angleA - angleB;
          });
        }

        setSubAreaPoints(finalPoints);
        validateAllSubAreaPoints(finalPoints);
        setSubAreaMapFitTrigger(Date.now());

        toast({
          title: "Thành công",
          description: `Đã nhập thành công ${finalPoints.length} điểm toạ độ từ file Excel.`,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi đọc file Excel.",
          variant: "destructive",
        });
      } finally {
        event.target.value = "";
      }
    },
    [toast, validateAllSubAreaPoints],
  );

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
    <Card className="flex h-auto lg:h-[750px] min-h-[600px] lg:min-h-0 flex-col">
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
            handleImportExcel={handleImportExcel}
            handleDownloadSampleExcel={handleDownloadSampleExcel}
            subAreaMapFitTrigger={subAreaMapFitTrigger}
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
                handleImportExcel={handleImportExcel}
                handleDownloadSampleExcel={handleDownloadSampleExcel}
                subAreaMapFitTrigger={subAreaMapFitTrigger}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
