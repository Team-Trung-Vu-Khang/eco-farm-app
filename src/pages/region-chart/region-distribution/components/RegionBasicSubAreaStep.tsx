import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Edit2, Trash2, MapPin, Layers, Compass } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import type {
  RegionFormValues,
  SubAreaFormValues,
} from "../data/region-form.schema";
import { InvalidateMapSize } from "./InvalidateMapSize";

const subAreaMarkerIcon = getMarkerIcon("amber");
const DEFAULT_CENTER: [number, number] = [11.54, 106.895];

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapEvents = ({ onChange }: { onChange: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
};

interface SubAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: Partial<SubAreaFormValues> | null;
  onSave: (subArea: SubAreaFormValues) => void;
  regionCenterPoint?: { lat?: number; lng?: number };
  regionArea?: number;
  otherSubAreasArea?: number;
}

function SubAreaBasicDialog({
  open,
  onOpenChange,
  initialValue,
  onSave,
  regionCenterPoint,
  regionArea = 0,
  otherSubAreasArea = 0,
}: SubAreaDialogProps) {
  const { toast } = useToast();
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [area, setArea] = useState<string>("");
  const [landType, setLandType] = useState<string>("");
  const [terrain, setTerrain] = useState<string>("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();

  useEffect(() => {
    if (open) {
      if (initialValue) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(initialValue.name || "");
        setCode(initialValue.code || "");
        setArea(
          initialValue.area !== undefined ? String(initialValue.area) : "",
        );
        setLandType(initialValue.landType || "");
        setTerrain(initialValue.terrain || "");
        setLat(initialValue.centerPoint?.lat);
        setLng(initialValue.centerPoint?.lng);
      } else {
        setName("");
        setCode("");
        setArea("");
        setLandType("");
        setTerrain("");
        setLat(regionCenterPoint?.lat);
        setLng(regionCenterPoint?.lng);
      }
    }
  }, [open, initialValue, regionCenterPoint]);

  const markerPosition: [number, number] = useMemo(() => {
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    if (
      regionCenterPoint?.lat !== undefined &&
      regionCenterPoint?.lng !== undefined
    ) {
      return [regionCenterPoint.lat, regionCenterPoint.lng];
    }
    return DEFAULT_CENTER;
  }, [lat, lng, regionCenterPoint]);

  const markerRef = useRef<L.Marker>(null);

  const handleMarkerDrag = useCallback(() => {
    const marker = markerRef.current;
    if (marker != null) {
      const latlng = marker.getLatLng();
      setLat(parseFloat(latlng.lat.toFixed(6)));
      setLng(parseFloat(latlng.lng.toFixed(6)));
    }
  }, []);

  const handleMapClick = useCallback((latlng: L.LatLng) => {
    setLat(parseFloat(latlng.lat.toFixed(6)));
    setLng(parseFloat(latlng.lng.toFixed(6)));
  }, []);

  const handleApplyRegionCenter = () => {
    if (
      regionCenterPoint?.lat !== undefined &&
      regionCenterPoint?.lng !== undefined
    ) {
      setLat(regionCenterPoint.lat);
      setLng(regionCenterPoint.lng);
      toast({
        title: "Đã áp dụng tọa độ vùng",
        description: `Vĩ độ: ${regionCenterPoint.lat}, Kinh độ: ${regionCenterPoint.lng}`,
      });
    }
  };

  const maxAllowedArea = useMemo(() => {
    if (!regionArea || regionArea <= 0) return undefined;
    return Math.max(0, regionArea - otherSubAreasArea);
  }, [regionArea, otherSubAreasArea]);

  const parsedArea = area ? parseFloat(area) : undefined;
  const areaValidation = useMemo(() => {
    if (!area) return { error: null };
    if (isNaN(parsedArea!) || parsedArea! <= 0) {
      return { error: "Diện tích phải là số lớn hơn 0" };
    }
    if (regionArea > 0) {
      if (parsedArea! > regionArea + 1e-4) {
        return {
          error: `Diện tích không được lớn hơn diện tích vùng trồng (${regionArea} ha)`,
        };
      }
      if (maxAllowedArea !== undefined && parsedArea! > maxAllowedArea + 1e-4) {
        return {
          error: `Tổng diện tích sẽ vượt quá diện tích vùng trồng (${regionArea} ha). Khả dụng còn lại: ${Number(maxAllowedArea.toFixed(2))} ha`,
        };
      }
    }
    return { error: null };
  }, [area, parsedArea, regionArea, maxAllowedArea]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên khu vực",
        variant: "destructive",
      });
      return;
    }

    if (areaValidation.error) {
      toast({
        title: "Lỗi diện tích",
        description: areaValidation.error,
        variant: "destructive",
      });
      return;
    }

    const subAreaData: SubAreaFormValues = {
      id: initialValue?.id,
      code: code.trim() || undefined,
      name: name.trim(),
      area: parsedArea,
      landType: landType || undefined,
      terrain: terrain || undefined,
      status: initialValue?.status || "active",
      centerPoint:
        lat !== undefined && lng !== undefined ? { lat, lng } : undefined,
    };

    onSave(subAreaData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            {initialValue?.id
              ? "Chỉnh sửa khu vực con"
              : "Thêm mới khu vực con"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Tên khu vực <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Khu A, Lô 1..."
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Mã khu vực (tùy chọn)
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ví dụ: KHU-A"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Diện tích (ha)
                </Label>
                {regionArea > 0 && maxAllowedArea !== undefined && (
                  <span className="text-[11px] text-muted-foreground">
                    Khả dụng:{" "}
                    <strong className="text-primary font-semibold">
                      {maxAllowedArea.toFixed(2)} ha
                    </strong>
                  </span>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Nhập diện tích..."
                className={
                  areaValidation.error
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {areaValidation.error ? (
                <p className="text-[11px] font-medium text-destructive">
                  {areaValidation.error}
                </p>
              ) : regionArea > 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  Tổng diện tích vùng: {regionArea} ha
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Loại đất
              </Label>
              <Select value={landType} onValueChange={setLandType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  {lands.map((item) => (
                    <SelectItem
                      key={item.id || item.code}
                      value={String(item.id || item.code)}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Địa hình
              </Label>
              <Select value={terrain} onValueChange={setTerrain}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn địa hình" />
                </SelectTrigger>
                <SelectContent>
                  {terrains.map((item) => (
                    <SelectItem
                      key={item.id || item.code}
                      value={String(item.id || item.code)}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phần Tọa độ tâm khu vực */}
          <div className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Tọa độ vị trí khu vực (Tọa độ tâm)
              </div>
              {regionCenterPoint?.lat !== undefined && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleApplyRegionCenter}
                  className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 px-2 font-medium"
                >
                  <Compass className="h-3.5 w-3.5 mr-1" /> Dùng tọa độ vùng
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Vĩ độ (Lat)
                </Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={lat !== undefined ? lat : ""}
                  onChange={(e) =>
                    setLat(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  placeholder="VD: 11.540000"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Kinh độ (Lng)
                </Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={lng !== undefined ? lng : ""}
                  onChange={(e) =>
                    setLng(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  placeholder="VD: 106.895000"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Nhấp hoặc kéo thả ghim trên bản đồ vệ tinh bên dưới để chọn vị trí
              nhanh:
            </p>

            <div className="h-48 w-full rounded-lg border border-border overflow-hidden relative z-0">
              <MapContainer
                center={markerPosition}
                zoom={13}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
              >
                <InvalidateMapSize />
                <TileLayer
                  attribution='&copy; <a href="https://server.arcgisonline.com">ArcGIS</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <ChangeView center={markerPosition} />
                <MapEvents onChange={handleMapClick} />
                <Marker
                  position={markerPosition}
                  icon={subAreaMarkerIcon}
                  draggable={true}
                  ref={markerRef}
                  eventHandlers={{
                    dragend: handleMarkerDrag,
                  }}
                />
              </MapContainer>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {initialValue?.id ? "Cập nhật khu vực" : "Thêm khu vực"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function RegionBasicSubAreaStep() {
  const { watch, setValue } = useFormContext<RegionFormValues>();
  const rawSubAreas = watch("subAreas");
  const subAreas = useMemo(() => rawSubAreas || [], [rawSubAreas]);
  const regionCenterPoint = watch("centerPoint");
  const regionArea = watch("area") || 0;

  const { items: lands } = useCatalog("soil-types");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index: number) => {
    const updated = subAreas.filter((_, i) => i !== index);
    setValue("subAreas", updated, { shouldValidate: true, shouldDirty: true });
  };

  const handleSaveSubArea = (subArea: SubAreaFormValues) => {
    let updated: SubAreaFormValues[];
    if (editingIndex !== null && editingIndex >= 0) {
      updated = subAreas.map((item, i) =>
        i === editingIndex ? subArea : item,
      );
    } else {
      updated = [...subAreas, { ...subArea, id: `temp-${Date.now()}` }];
    }
    setValue("subAreas", updated, { shouldValidate: true, shouldDirty: true });
  };

  const currentEditingValue =
    editingIndex !== null && editingIndex >= 0 ? subAreas[editingIndex] : null;

  const totalSubAreaAcreage = useMemo(() => {
    return subAreas.reduce((acc, curr) => acc + (curr.area || 0), 0);
  }, [subAreas]);

  const otherSubAreasArea = useMemo(() => {
    if (editingIndex !== null && editingIndex >= 0) {
      return subAreas
        .filter((_, i) => i !== editingIndex)
        .reduce((sum, s) => sum + (s.area || 0), 0);
    }
    return totalSubAreaAcreage;
  }, [editingIndex, subAreas, totalSubAreaAcreage]);

  const isOverAllocated =
    regionArea > 0 && totalSubAreaAcreage > regionArea + 1e-4;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Phân chia khu vực con
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Khai báo các khu vực con (lô/thửa/phân khu) trực thuộc vùng trồng
            với thông tin cơ bản
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenAdd}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Thêm khu vực
        </Button>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {subAreas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-10 text-center bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Chưa có khu vực con nào được thêm
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Bạn có thể phân chia vùng trồng thành các khu vực con nhỏ hơn để
              dễ dàng quản lý canh tác (hoặc bỏ qua nếu vùng không chia nhỏ).
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenAdd}
              className="mt-4 gap-1.5"
            >
              <Plus className="h-4 w-4" /> Thêm khu vực đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Allocation summary banner */}
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  Đã tạo {subAreas.length} khu vực con
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Tổng diện tích:{" "}
                    <strong
                      className={
                        isOverAllocated
                          ? "text-destructive font-bold"
                          : "text-foreground font-semibold"
                      }
                    >
                      {totalSubAreaAcreage.toFixed(2)} ha
                    </strong>
                  </span>
                  {regionArea > 0 && (
                    <span className="text-muted-foreground">
                      / {regionArea} ha
                    </span>
                  )}
                  {isOverAllocated ? (
                    <Badge
                      variant="destructive"
                      className="text-[10px] font-semibold"
                    >
                      Vượt quá {(totalSubAreaAcreage - regionArea).toFixed(2)}{" "}
                      ha
                    </Badge>
                  ) : regionArea > 0 ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] text-primary bg-primary/10 font-semibold"
                    >
                      Còn lại{" "}
                      {Math.max(0, regionArea - totalSubAreaAcreage).toFixed(2)}{" "}
                      ha
                    </Badge>
                  ) : null}
                </div>
              </div>
              {regionArea > 0 && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverAllocated ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (totalSubAreaAcreage / regionArea) * 100,
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subAreas.map((sub, index) => {
                const landName =
                  lands.find(
                    (l) => String(l.id || l.code) === String(sub.landType),
                  )?.name || sub.landType;

                return (
                  <div
                    key={sub.id || index}
                    className="flex items-start justify-between p-3.5 rounded-lg border border-border bg-card shadow-xs hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {sub.name}
                        </h4>
                        {sub.code && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 font-mono text-muted-foreground"
                          >
                            {sub.code}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                        {sub.area !== undefined && (
                          <span className="font-semibold text-foreground">
                            {sub.area} ha
                          </span>
                        )}
                        {landName && (
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-normal"
                          >
                            {landName}
                          </Badge>
                        )}
                        {sub.centerPoint?.lat !== undefined && (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-normal text-muted-foreground gap-1"
                          >
                            <MapPin className="h-3 w-3 text-primary" />
                            {sub.centerPoint.lat.toFixed(4)},{" "}
                            {sub.centerPoint.lng.toFixed(4)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <SubAreaBasicDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          initialValue={currentEditingValue}
          onSave={handleSaveSubArea}
          regionCenterPoint={regionCenterPoint}
          regionArea={regionArea}
          otherSubAreasArea={otherSubAreasArea}
        />
      </CardContent>
    </Card>
  );
}
