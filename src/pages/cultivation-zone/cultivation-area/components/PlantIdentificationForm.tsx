import useEnterpriseStore from "@/stores/useEnterpriseStore";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type Step,
} from "@tankhang1/eco-shared-ui";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  Beaker,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Maximize2,
  Plus,
  Search,
  Sprout,
  Target,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useLocation } from "wouter";
import useCultivationAreaStore from "../../../../stores/useCultivationAreaStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useSeedStore from "../../../../stores/useSeedStore";
import { type Plant } from "../../../region-chart/constants";
import { EnterpriseSelector } from "./EnterpriseSelector";
import { ImportPlantDialog } from "./ImportPlantDialog";
import L from "leaflet";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
}

const getMarkerIcon = (color: string = "red") => {
  return L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" +
      color +
      ".png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  });
};

// --- Local Refined Components ---

const CultivationAreaSelector = ({
  areas,
  selectedId,
  onSelect,
  disabled,
}: {
  areas: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAreas = useMemo(() => {
    return areas.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [areas, searchTerm]);

  const selectedArea = areas.find((a) => a.id === selectedId);

  return (
    <>
      <div
        className={cn(
          "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
          selectedArea
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {selectedArea ? (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 truncate">
                {selectedArea.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="truncate">{selectedArea.targetName}</span>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 group-hover:text-primary"
              >
                Thay đổi
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="w-5 h-5" />
            <div className="text-sm font-medium">Chọn vùng canh tác</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-6">
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Chọn vùng canh tác
            </DialogTitle>
          </DialogHeader>

          <div className="w-full p-4 space-y-4">
            <div className="flex flex-col w-full gap-3">
              <div className="w-full relative">
                <Search className="z-10 absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  className="w-full pl-10 h-10 bg-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên vùng, tên đối tượng, mã..."
                />
              </div>
              <ScrollArea className="h-80 pr-4 w-full">
                <div className="space-y-2">
                  {filteredAreas.map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "flex items-center max-w-full justify-between p-3 rounded-xl border cursor-pointer transition-all",
                        selectedId === a.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "hover:bg-slate-50 bg-white border-slate-100",
                      )}
                      onClick={() => {
                        onSelect(a.id);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            selectedId === a.id
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-full">
                          <div className="font-bold text-sm text-slate-900 truncate">
                            {a.name}
                          </div>
                          <div className="flex max-w-md items-center gap-2">
                            <div className="text-[10px] max-w-full text-muted-foreground font-medium uppercase tracking-wider">
                              {a.targetName}
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedId === a.id ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-200" />
                      )}
                    </div>
                  ))}
                  {filteredAreas.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      {areas.length === 0
                        ? "Không có vùng canh tác nào"
                        : "Không tìm thấy vùng canh tác"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="w-full p-4 bg-slate-50 border-t">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Hủy bỏ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ---- Multi-plant entry type ----
interface PlantEntry {
  entryId: string; // local UI id
  height: string;
  ageValue: string;
  ageUnit: string;
  plantedDate: string;
  note: string;
  plotId: string;
  coordinate: { lat: number; lng: number };
  isInvalidBoundary?: boolean;
}

const makeEmptyPlant = (): PlantEntry => ({
  entryId: `plant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  height: "",
  ageValue: "",
  ageUnit: "years",
  plantedDate: new Date().toISOString().split("T")[0],
  note: "",
  plotId: "",
  coordinate: { lat: 11.548, lng: 106.896 },
  isInvalidBoundary: false,
});

// ---- Per-plant plot helper ----
const PlantCard = ({
  plant,
  index,
  geographicalUnits,
  onUpdate,
  onRemove,
  canRemove,
  isInvalidBoundary,
}: {
  plant: PlantEntry;
  index: number;
  geographicalUnits: any[];
  onUpdate: (partial: Partial<PlantEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
  isInvalidBoundary?: boolean;
}) => {
  const [expanded, setExpanded] = useState(true);
  const [tempLat, setTempLat] = useState(
    plant.coordinate?.lat?.toString() || "",
  );
  const [tempLng, setTempLng] = useState(
    plant.coordinate?.lng?.toString() || "",
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Ref to prevent the useEffect from clearing errors set by handleValidate
  const skipErrorReset = useRef(false);

  useEffect(() => {
    setTempLat(plant.coordinate?.lat?.toString() || "");
    setTempLng(plant.coordinate?.lng?.toString() || "");
    if (skipErrorReset.current) {
      skipErrorReset.current = false;
      return; // errors were just set by handleValidate — don't clear them
    }
    setValidationError(null);
    setSuggestion(null);
  }, [plant.coordinate?.lat, plant.coordinate?.lng]);

  const handleValidate = () => {
    const lat = parseFloat(tempLat);
    const lng = parseFloat(tempLng);
    if (isNaN(lat) || isNaN(lng)) {
      setValidationError("Vui lòng nhập toạ độ hợp lệ.");
      setSuggestion(null);
      return;
    }

    // Always run hierarchical detection: Plot (1) > Area (2) > Region (3)
    const pt = turf.point([lng, lat]);
    const sortedUnits = [...geographicalUnits].sort(
      (a, b) => a.level - b.level,
    );

    for (const unit of sortedUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          // Found the most specific unit — assign it
          onUpdate({
            coordinate: { lat, lng },
            plotId: unit.id,
            isInvalidBoundary: false,
          });
          setValidationError(null);
          setSuggestion(null);
          return;
        }
      } catch {
        // skip invalid polygons
      }
    }

    // Coordinate not inside any unit — mark invalid and suggest nearest boundary
    if (geographicalUnits.length === 0) {
      // No boundary data at all — just update coordinate freely
      onUpdate({ coordinate: { lat, lng } });
      setValidationError(null);
      setSuggestion(null);
      return;
    }

    let nearestSuggestion: { lat: number; lng: number } | null = null;
    let minDistance = Infinity;
    for (const unit of geographicalUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        const line = turf.polygonToLine(poly);
        const snapped = turf.nearestPointOnLine(line as any, pt);
        const dist = turf.distance(pt, snapped);
        if (dist < minDistance) {
          minDistance = dist;
          const [snapLng, snapLat] = snapped.geometry.coordinates;
          nearestSuggestion = { lat: snapLat, lng: snapLng };
        }
      } catch {}
    }

    skipErrorReset.current = true;
    onUpdate({ coordinate: { lat, lng }, isInvalidBoundary: true });
    setValidationError(
      "Toạ độ nằm ngoài mọi ranh giới. Vị trí gợi ý gần nhất được hiển thị bên dưới.",
    );
    setSuggestion(nearestSuggestion);
  };

  const selectedUnit = geographicalUnits.find((u) => u.id === plant.plotId);

  return (
    <div
      id={`plant-${plant.entryId}`}
      className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white"
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
            {`Cây trồng ${index + 1}`}
            {isInvalidBoundary && (
              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Tọa độ lỗi
              </span>
            )}
          </div>
        </div>
        {plant.plotId ? (
          <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full font-medium shrink-0">
            <MapPin className="w-2.5 h-2.5" />
            {selectedUnit?.name || "Đã chọn"}
          </div>
        ) : (
          <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium shrink-0">
            Chưa chọn vị trí
          </div>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {canRemove && (
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Card Body */}
      {expanded && (
        <div className="p-5 space-y-5">
          {/* Detected location display */}
          {(() => {
            if (!selectedUnit) {
              return (
                <div className="bg-amber-50 border border-dashed border-amber-200 rounded-xl p-4 text-center">
                  <div className="text-amber-600 text-[11px] font-medium mb-1">
                    Chưa xác định được đơn vị địa lý
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Vui lòng kéo marker trên bản đồ hoặc nhập tọa độ để nhận
                    diện.
                  </div>
                </div>
              );
            }

            // Build the ancestor chain from geographicalUnits
            // Try to get full context from the store
            const regionStore = useRegionStore.getState();
            let regionUnit: any = null;
            let areaUnit: any = null;
            let plotUnit: any = null;

            if (selectedUnit.level === 1) {
              plotUnit = selectedUnit;
              // Find parent area and region via store
              const pc = regionStore.getPlotById?.(selectedUnit.id);
              if (pc) {
                if (pc.area)
                  areaUnit = geographicalUnits.find(
                    (u: any) => u.id === pc.area.id?.toString(),
                  ) || {
                    id: pc.area.id?.toString(),
                    name: pc.area.name,
                    type: "Khu vực",
                    level: 2,
                  };
                if (pc.region)
                  regionUnit = geographicalUnits.find(
                    (u: any) => u.id === pc.region.id?.toString(),
                  ) || {
                    id: pc.region.id?.toString(),
                    name: pc.region.name,
                    type: "Vùng trồng",
                    level: 3,
                  };
              } else {
                // fallback: look up level 2 and 3 via name matching in geographicalUnits
                areaUnit = geographicalUnits.find((u: any) => u.level === 2);
                regionUnit = geographicalUnits.find((u: any) => u.level === 3);
              }
            } else if (selectedUnit.level === 2) {
              areaUnit = selectedUnit;
              const ac = regionStore.getAreaById?.(selectedUnit.id);
              if (ac?.region)
                regionUnit = geographicalUnits.find(
                  (u: any) => u.id === ac.region.id?.toString(),
                ) || {
                  id: ac.region.id?.toString(),
                  name: ac.region.name,
                  type: "Vùng trồng",
                  level: 3,
                };
              else
                regionUnit = geographicalUnits.find((u: any) => u.level === 3);
            } else {
              regionUnit = selectedUnit;
            }

            const chain = [regionUnit, areaUnit, plotUnit].filter(Boolean);

            const levelIcon = (level: number) => {
              if (level === 1)
                return (
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                );
              if (level === 2)
                return (
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                );
              return (
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              );
            };

            return (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                {/* Header: detected unit summary */}
                <div className="flex items-center gap-3 p-3 border-b bg-slate-50/60">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {selectedUnit.type}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {selectedUnit.name}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-white text-green-600 border-green-200 shrink-0"
                  >
                    Đã xác định
                  </Badge>
                </div>

                {/* Hierarchy chain */}
                <div className="px-3 py-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    Phân cấp quản lý
                  </div>
                  <div className="space-y-2">
                    {chain.map((unit: any, i: number) => {
                      const indent = i * 20; // px indent per level
                      const iconSize = 32; // w-8 = 32px
                      const halfIcon = iconSize / 2; // center of icon horizontally
                      return (
                        <div
                          key={unit.id}
                          className="flex items-center gap-2.5 relative"
                          style={{ paddingLeft: `${indent}px` }}
                        >
                          {/* L-shaped connector for non-root items */}
                          {i > 0 && (
                            <>
                              {/* Vertical segment from parent's icon center down */}
                              <div
                                className="absolute bg-slate-200"
                                style={{
                                  left: `${indent - 20 + halfIcon - 1}px`,
                                  top: `-10px`,
                                  width: "1px",
                                  height: "calc(50% + 10px)",
                                }}
                              />
                              {/* Horizontal segment connecting vertical to this icon */}
                              <div
                                className="absolute bg-slate-200"
                                style={{
                                  left: `${indent - 20 + halfIcon - 1}px`,
                                  top: "50%",
                                  width: `${20 - halfIcon + halfIcon}px`,
                                  height: "1px",
                                }}
                              />
                            </>
                          )}
                          {levelIcon(unit.level)}
                          <div className="min-w-0">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {unit.type}
                            </div>
                            <div
                              className={cn(
                                "text-sm font-semibold truncate",
                                i === chain.length - 1
                                  ? "text-primary"
                                  : "text-slate-700",
                              )}
                            >
                              {unit.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`height-${plant.entryId}`} className="text-xs">
                Chiều cao (m)
              </Label>
              <Input
                id={`height-${plant.entryId}`}
                type="number"
                step="0.1"
                placeholder="VD: 2.5"
                value={plant.height}
                onChange={(e) => onUpdate({ height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Độ tuổi</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Số"
                  className="flex-1"
                  value={plant.ageValue}
                  onChange={(e) => onUpdate({ ageValue: e.target.value })}
                />
                <Select
                  value={plant.ageUnit}
                  onValueChange={(val) => onUpdate({ ageUnit: val })}
                >
                  <SelectTrigger className="w-25">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Ngày</SelectItem>
                    <SelectItem value="months">Tháng</SelectItem>
                    <SelectItem value="years">Năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor={`date-${plant.entryId}`} className="text-xs">
                Ngày trồng
              </Label>
              <Input
                type="date"
                value={plant.plantedDate}
                id={`date-${plant.entryId}`}
                onChange={(e) => onUpdate({ plantedDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className="space-y-2 border border-slate-200 rounded-lg p-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                  Tọa độ
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleValidate}
                  className="h-7 text-[10px] px-2"
                >
                  Kiểm tra & Cập nhật
                </Button>
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex-1">
                  <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                    Vĩ độ
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    className="flex-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={tempLat}
                    onChange={(e) => setTempLat(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                    Kinh độ
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    className="flex-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={tempLng}
                    onChange={(e) => setTempLng(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {validationError && (
              <div className="text-[10px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  {validationError}
                </div>
                {suggestion && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-600">Gợi ý gần nhất:</span>
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200 font-bold">
                      {suggestion.lat.toFixed(5)}, {suggestion.lng.toFixed(5)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const lat = suggestion.lat;
                        const lng = suggestion.lng;
                        setTempLat(lat.toString());
                        setTempLng(lng.toString());

                        // Try hierarchical detection on the snapped point first
                        const pt = turf.point([lng, lat]);
                        const sorted = [...geographicalUnits].sort(
                          (a, b) => a.level - b.level,
                        );
                        let foundId = "";
                        for (const unit of sorted) {
                          if (!unit.coordinates || unit.coordinates.length < 3)
                            continue;
                          try {
                            const polyCoords = [
                              ...unit.coordinates.map((c: any) => [
                                c.lng,
                                c.lat,
                              ]),
                              [
                                unit.coordinates[0].lng,
                                unit.coordinates[0].lat,
                              ],
                            ];
                            const poly = turf.polygon([polyCoords]);
                            if (turf.booleanPointInPolygon(pt, poly)) {
                              foundId = unit.id;
                              break;
                            }
                          } catch {}
                        }

                        // If on-boundary (not strictly inside), pick nearest unit
                        if (!foundId && sorted.length > 0) {
                          let minDist = Infinity;
                          for (const unit of sorted) {
                            if (
                              !unit.coordinates ||
                              unit.coordinates.length < 3
                            )
                              continue;
                            try {
                              const polyCoords = [
                                ...unit.coordinates.map((c: any) => [
                                  c.lng,
                                  c.lat,
                                ]),
                                [
                                  unit.coordinates[0].lng,
                                  unit.coordinates[0].lat,
                                ],
                              ];
                              const poly = turf.polygon([polyCoords]);
                              const line = turf.polygonToLine(poly);
                              const snapped = turf.nearestPointOnLine(
                                line as any,
                                pt,
                              );
                              const d = turf.distance(pt, snapped);
                              if (d < minDist) {
                                minDist = d;
                                foundId = unit.id;
                              }
                            } catch {}
                          }
                        }

                        onUpdate({
                          coordinate: { lat, lng },
                          plotId: foundId || plant.plotId,
                          isInvalidBoundary: false,
                        });
                        setValidationError(null);
                        setSuggestion(null);
                      }}
                      className="ml-auto text-primary font-bold hover:underline"
                    >
                      Dùng gợi ý
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor={`note-${plant.entryId}`} className="text-xs">
              Ghi chú
            </Label>
            <textarea
              id={`note-${plant.entryId}`}
              rows={2}
              className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
              placeholder="Ghi nhận đặc điểm riêng của cây..."
              value={plant.note}
              onChange={(e) => onUpdate({ note: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Component to recenter map when coordinates change manually
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

// ---- Map: multiple markers + all plot boundaries ----
const AllPlantsMapContent = ({
  activeId,
  onPlantMove,
  onAutoAssign,
  clickable,
  plants,
  geographicalUnits,
  setActiveEntryId,
  suggestedCorrection,
}: {
  activeId: string;
  onPlantMove: (entryId: string, lat: number, lng: number) => void;
  onAutoAssign: (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => void;
  clickable?: boolean;
  plants: PlantEntry[];
  geographicalUnits: any[];
  setActiveEntryId: (id: string) => void;
  suggestedCorrection?: { entryId: string; lat: number; lng: number } | null;
}) => {
  const map = useMap();
  const activePlant = plants.find((p) => p.entryId === activeId);

  const findCurrentPlot = (lng: number, lat: number) => {
    // Use all geographical units sorted by most specific first (Plot > Area > Region)
    const sorted = [...geographicalUnits].sort((a, b) => a.level - b.level);
    for (const unit of sorted) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const pt = turf.point([lng, lat]);
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          return unit.id;
        }
      } catch {
        return null;
      }
    }
    return null;
  };

  // Inner component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!clickable || !activeId) return;
        const { lat, lng } = e.latlng;

        // If plant has no plotId: auto-detect which unit was clicked
        if (!activePlant?.plotId) {
          const plotId = findCurrentPlot(lng, lat);
          if (plotId) {
            onAutoAssign(activeId, plotId, lat, lng);
            return;
          }
          // Clicked outside all units — do nothing
          return;
        }

        // Plant already has a plotId — move within boundary
        onPlantMove(activeId, lat, lng);
      },
    });
    return null;
  };

  // Style helpers per level
  const getBoundaryStyle = (unit: any, isActiveUnit: boolean) => {
    if (isActiveUnit) {
      return {
        color: "#6366f1",
        weight: 2.5,
        fillOpacity: 0.18,
        dashArray: undefined,
      };
    }
    switch (unit.level) {
      case 1: // Plot
        return {
          color: "#f59e0b",
          weight: 1.5,
          fillOpacity: 0.06,
          dashArray: "5,4",
        };
      case 2: // Area
        return {
          color: "#10b981",
          weight: 2,
          fillOpacity: 0.08,
          dashArray: "8,4",
        };
      case 3: // Region
      default:
        return {
          color: "#3b82f6",
          weight: 2.5,
          fillOpacity: 0.05,
          dashArray: undefined,
        };
    }
  };

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri"
      />
      <MapClickHandler />
      {/* Auto-pan to active plant */}
      {activePlant?.plotId && (
        <RecenterMap
          lat={activePlant.coordinate.lat}
          lng={activePlant.coordinate.lng}
        />
      )}
      {/* All geographical boundaries — Region > Area > Plot, rendered outermost first */}
      {[...geographicalUnits]
        .sort((a, b) => b.level - a.level) // Region first so Plots render on top
        .map((unit) => {
          if (!unit.coordinates || unit.coordinates.length < 3) return null;
          const isActiveUnit = activePlant?.plotId === unit.id;
          const style = getBoundaryStyle(unit, isActiveUnit);
          const showTooltip = true; // show name for all units (Region, Area, Plot) on hover
          return (
            <Polygon
              key={unit.id}
              positions={unit.coordinates.map((c: any) => [c.lat, c.lng])}
              pathOptions={style}
            >
              {showTooltip && (
                <Tooltip sticky direction="top" opacity={0.95}>
                  <div
                    style={{ fontWeight: 600, fontSize: 12, lineHeight: "1.4" }}
                  >
                    {unit.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {unit.type}
                  </div>
                </Tooltip>
              )}
            </Polygon>
          );
        })}
      {/* All plant markers */}
      {plants.map((p) => {
        // if (!p.plotId) return null;
        const isActive = p.entryId === activeId;

        return (
          <Marker
            key={p.entryId}
            position={[p.coordinate.lat, p.coordinate.lng]}
            draggable={isActive}
            opacity={isActive ? 1 : 0.6}
            icon={
              !p.plotId
                ? getMarkerIcon("yellow")
                : p.isInvalidBoundary
                  ? getMarkerIcon("red")
                  : getMarkerIcon("green")
            }
            eventHandlers={{
              click() {
                if (!isActive) {
                  document
                    .getElementById(`plant-${p.entryId}`)
                    ?.scrollIntoView({
                      block: "center",
                      behavior: "smooth",
                    });
                }
                map.flyTo([p.coordinate.lat, p.coordinate.lng], map.getZoom(), {
                  duration: 0.5,
                });
                setActiveEntryId(p.entryId);
              },
              dragend(e) {
                if (!isActive) return;
                const pos = e.target.getLatLng();

                if (!p.plotId) {
                  const plotId = findCurrentPlot(pos.lng, pos.lat);
                  if (plotId) {
                    onAutoAssign(p.entryId, plotId, pos.lat, pos.lng);
                    return;
                  }
                }

                onPlantMove(p.entryId, pos.lat, pos.lng);
              },
            }}
          />
        );
      })}
      {/* Ghost marker for suggested correction */}
      {suggestedCorrection &&
        suggestedCorrection.entryId === activeId &&
        activePlant && (
          <>
            <Polyline
              positions={[
                [activePlant.coordinate.lat, activePlant.coordinate.lng],
                [suggestedCorrection.lat, suggestedCorrection.lng],
              ]}
              pathOptions={{ color: "#ef4444", dashArray: "5, 5", weight: 2 }}
            />
            <Marker
              position={[suggestedCorrection.lat, suggestedCorrection.lng]}
              opacity={0.5}
              eventHandlers={{
                click() {
                  // Clicking suggestion might not do anything specific, users use the Apply button
                },
              }}
            />
          </>
        )}
    </>
  );
};

const PlantIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
}: PlantIdentificationFormProps) => {
  const {} = useRegionStore();
  const { areas } = useCultivationAreaStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const { enterprises } = useEnterpriseStore();
  const [, setLocation] = useLocation();

  // ---- Shared state ----
  const [enterpriseId, setEnterpriseId] = useState(
    initialData?.enterpriseId || "",
  );
  const [cultivationAreaId, setCultivationAreaId] = useState(
    initialData?.cultivationAreaId || "",
  );
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([]);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // ---- Per-plant list ----
  const [plants, setPlants] = useState<PlantEntry[]>(() => {
    if (initialData) {
      return [
        {
          entryId: initialData.id || `plant-${Date.now()}`,
          height: initialData.height?.toString() || "",
          ageValue: initialData.ageValue?.toString() || "",
          ageUnit: initialData.ageUnit || "years",
          plantedDate:
            initialData.plantedDate || new Date().toISOString().split("T")[0],
          note: initialData.note || "",
          plotId: initialData.plotId || "",
          coordinate: initialData.coordinate || { lat: 11.548, lng: 106.896 },
          isInvalidBoundary: false,
        },
      ];
    }
    if (initialList && initialList.length > 0) {
      return initialList.map((item, index) => ({
        entryId: item.id || `plant-${Date.now()}-${index}`,
        height: item.height?.toString() || "",
        ageValue: item.ageValue?.toString() || "",
        ageUnit: item.ageUnit || "years",
        plantedDate: item.plantedDate || new Date().toISOString().split("T")[0],
        note: item.note || "",
        plotId: item.plotId || "",
        coordinate: item.coordinate || { lat: 11.548, lng: 106.896 },
        isInvalidBoundary: false,
      }));
    }
    return [makeEmptyPlant()];
  });

  const updatePlant = (entryId: string, partial: Partial<PlantEntry>) => {
    setPlants((prev) =>
      prev.map((p) => (p.entryId === entryId ? { ...p, ...partial } : p)),
    );
  };
  const removePlant = (entryId: string) => {
    setPlants((prev) => prev.filter((p) => p.entryId !== entryId));
  };
  const addPlant = () => {
    setPlants((prev) => [...prev, makeEmptyPlant()]);
  };

  // ---- Derived: cultivation area ----
  const filteredCultivationAreas = useMemo(() => {
    if (!enterpriseId) return [];
    return areas.filter(
      (a) =>
        a.enterpriseId === enterpriseId ||
        a.enterpriseId === `ent-${enterpriseId}` ||
        `ent-${a.enterpriseId}` === enterpriseId,
    );
  }, [areas, enterpriseId]);

  const selectedCultivationArea = areas.find((a) => a.id === cultivationAreaId);

  // ---- Logic to find smallest geographical units ----
  const geographicalUnits = useMemo(() => {
    if (!selectedCultivationArea) return [];
    const regionStore = useRegionStore.getState();
    const result: {
      id: string;
      name: string;
      type: string;
      level: number; // 1: Plot, 2: Area, 3: Region
      coordinates?: { lat: number; lng: number }[];
    }[] = [];

    const processedIds = new Set<string>();

    selectedCultivationArea.targetIds.forEach((id) => {
      // 1. Check if ID is a plot
      const pc = regionStore.getPlotById(id);
      if (pc && !processedIds.has(pc.plot.id)) {
        result.push({
          id: pc.plot.id,
          name: pc.plot.name,
          type: "Lô trồng",
          level: 1,
          coordinates: pc.plot.coordinates,
        });
        processedIds.add(pc.plot.id);

        // Also add its Area and Region context if not already added
        if (pc.area && !processedIds.has(pc.area.id.toString())) {
          result.push({
            id: pc.area.id.toString(),
            name: pc.area.name,
            type: "Khu vực",
            level: 2,
            coordinates: pc.area.coordinates,
          });
          processedIds.add(pc.area.id.toString());
        }
        if (pc.region && !processedIds.has(pc.region.id.toString())) {
          result.push({
            id: pc.region.id.toString(),
            name: pc.region.name,
            type: "Vùng trồng",
            level: 3,
            coordinates: pc.region.coordinates,
          });
          processedIds.add(pc.region.id.toString());
        }
        return;
      }

      // 2. Check if ID is an Area
      const ac = regionStore.getAreaById(id);
      if (ac && !processedIds.has(ac.area.id.toString())) {
        result.push({
          id: ac.area.id.toString(),
          name: ac.area.name,
          type: "Khu vực",
          level: 2,
          coordinates: ac.area.coordinates,
        });
        processedIds.add(ac.area.id.toString());

        ac.area.plots?.forEach((p: any) => {
          if (!processedIds.has(p.id)) {
            result.push({
              id: p.id,
              name: p.name,
              type: "Lô trồng",
              level: 1,
              coordinates: p.coordinates,
            });
            processedIds.add(p.id);
          }
        });

        if (ac.region && !processedIds.has(ac.region.id.toString())) {
          result.push({
            id: ac.region.id.toString(),
            name: ac.region.name,
            type: "Vùng trồng",
            level: 3,
            coordinates: ac.region.coordinates,
          });
          processedIds.add(ac.region.id.toString());
        }
        return;
      }

      // 3. Check if ID is a Region
      const region = regionStore.regions.find((r: any) => String(r.id) === id);
      if (region && !processedIds.has(region.id.toString())) {
        result.push({
          id: region.id.toString(),
          name: region.name,
          type: "Vùng trồng",
          level: 3,
          coordinates: region.coordinates,
        });
        processedIds.add(region.id.toString());

        region.subAreas?.forEach((sa: any) => {
          if (!processedIds.has(sa.id.toString())) {
            result.push({
              id: sa.id.toString(),
              name: sa.name,
              type: "Khu vực",
              level: 2,
              coordinates: sa.coordinates,
            });
            processedIds.add(sa.id.toString());
          }
          sa.plots?.forEach((p: any) => {
            if (!processedIds.has(p.id)) {
              result.push({
                id: p.id,
                name: p.name,
                type: "Lô trồng",
                level: 1,
                coordinates: p.coordinates,
              });
              processedIds.add(p.id);
            }
          });
        });
      }
    });

    return result;
  }, [selectedCultivationArea]);

  const scopedGeographicalUnits = useMemo(() => {
    if (!selectedScopeIds || selectedScopeIds.length === 0)
      return geographicalUnits;

    const regionStore = useRegionStore.getState();
    const resultIds = new Set<string>();

    selectedScopeIds.forEach((id) => {
      const scopeUnit = geographicalUnits.find((u) => u.id === id);
      if (!scopeUnit) return;

      if (scopeUnit.level === 3) {
        geographicalUnits.forEach((u) => resultIds.add(u.id));
      } else if (scopeUnit.level === 2) {
        resultIds.add(id);
        const ac = regionStore.getAreaById?.(id);
        const childPlotIds = (ac?.area?.plots || []).map((p: any) => p.id);
        childPlotIds.forEach((pid: string) => resultIds.add(pid));
      } else {
        resultIds.add(id);
      }
    });

    return geographicalUnits.filter((u) => resultIds.has(u.id));
  }, [selectedScopeIds, geographicalUnits]);

  // Smallest units for map rendering (only Plot if exists, else Area, else Region)
  // This is for Polygon rendering to avoid overlapping colors
  const smallestUnits = useMemo(() => {
    // Find the level with items
    const hasPlots = geographicalUnits.some((u) => u.level === 1);
    const hasAreas = geographicalUnits.some((u) => u.level === 2);

    if (hasPlots) return geographicalUnits.filter((u) => u.level === 1);
    if (hasAreas) return geographicalUnits.filter((u) => u.level === 2);
    return geographicalUnits;
  }, [geographicalUnits]);

  const findGeographicalUnit = (lat: number, lng: number) => {
    // Priority: Plot (level 1) > Area (level 2) > Region (level 3)
    const pt = turf.point([lng, lat]);

    // Use selectedScopeIds to find strictly within the chosen scope
    const sortedUnits = geographicalUnits
      .filter((u) => selectedScopeIds.includes(u.id))
      .sort((a, b) => a.level - b.level);

    for (const unit of sortedUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          return unit;
        }
      } catch (e) {
        // skip errors
      }
    }
    return null;
  };

  // ---- Technical config (based on area only, no per-plant plot needed for Step 1) ----
  const activeConfig = useMemo(() => {
    if (!selectedCultivationArea) return null;
    return {
      managerId: selectedCultivationArea.managerId,
      farmingMethodId: selectedCultivationArea.farmingMethodId,
      irrigationMethodId: selectedCultivationArea.irrigationMethodId,
      selectedCrops: selectedCultivationArea.selectedCrops || [],
      seedSelections: selectedCultivationArea.seedSelections || {},
    };
  }, [selectedCultivationArea]);

  const manager = personnel.find(
    (p: any) => String(p.id) === String(activeConfig?.managerId),
  );
  const farmingMethod = farmingMethods.find(
    (m: any) => m.id === activeConfig?.farmingMethodId,
  );
  const irrigationMethod = irrigationSystems.find(
    (s: any) => s.id === activeConfig?.irrigationMethodId,
  );

  const selectedCropsData = useMemo(() => {
    if (!activeConfig) return [];
    const result: any[] = [];
    if (
      activeConfig.seedSelections &&
      Object.keys(activeConfig.seedSelections).length > 0
    ) {
      Object.entries(activeConfig.seedSelections).forEach(([, seedIds]) => {
        (seedIds as string[]).forEach((seedId) => {
          const seed = seeds.find((s) => s.id === seedId);
          if (seed) result.push(seed);
        });
      });
    } else {
      activeConfig.selectedCrops.forEach((vId: string) => {
        result.push(...seeds.filter((s) => s.id === vId));
      });
    }
    return result;
  }, [activeConfig, seeds]);

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  // ---- Active plant on map ----
  const [activeEntryId, setActiveEntryId] = useState<string>("");
  const [suggestedCorrection, setSuggestedCorrection] = useState<{
    entryId: string;
    lat: number;
    lng: number;
  } | null>(null);

  const handleSetActiveEntry = (id: string) => {
    setActiveEntryId(id);
    setTimeout(() => {
      const element = document.getElementById(`plant-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  // Resolve effective active entry (fallback to first plant that has a plot)
  const effectiveActiveId =
    activeEntryId || plants.find((p) => p.plotId)?.entryId || "";

  // ---- Boundary validation helper ----
  const validateAndSnapToUnit = (
    plantEntryId: string,
    lat: number,
    lng: number,
  ) => {
    const unit = findGeographicalUnit(lat, lng);

    if (unit) {
      setSuggestedCorrection(null);
      updatePlant(plantEntryId, {
        plotId: unit.id,
        coordinate: { lat, lng },
        isInvalidBoundary: false,
      });
    } else {
      let nearestSuggestion: {
        lat: number;
        lng: number;
        entryId: string;
      } | null = null;
      let minDistance = Infinity;

      geographicalUnits
        .filter((u) => selectedScopeIds.includes(u.id))
        .forEach((u) => {
          if (!u.coordinates || u.coordinates.length < 3) return;
          try {
            const pt = turf.point([lng, lat]);
            const polyCoords = [
              ...u.coordinates.map((c: any) => [c.lng, c.lat]),
              [u.coordinates[0].lng, u.coordinates[0].lat],
            ];
            const poly = turf.polygon([polyCoords]);
            const line = turf.polygonToLine(poly);
            const snapped = turf.nearestPointOnLine(line as any, pt);

            const distance = turf.distance(pt, snapped);
            if (distance < minDistance) {
              minDistance = distance;
              const [snapLng, snapLat] = snapped.geometry.coordinates;
              nearestSuggestion = {
                entryId: plantEntryId,
                lat: snapLat,
                lng: snapLng,
              };
            }
          } catch {}
        });

      if (nearestSuggestion) {
        setSuggestedCorrection(nearestSuggestion);
      }

      updatePlant(plantEntryId, {
        coordinate: { lat, lng },
        isInvalidBoundary: true,
      });
    }
  };

  const handleAutoAssign = (
    entryId: string,
    _plotId: string, // ignored, we re-calculate
    lat: number,
    lng: number,
  ) => {
    validateAndSnapToUnit(entryId, lat, lng);
  };

  // ---- Submit: one plant per entry ----
  const handleComplete = () => {
    const newPlantArr = plants.map((p) => {
      return {
        ...initialData,
        height: p.height,
        enterpriseId,
        ageValue: p.ageValue,
        ageUnit: p.ageUnit,
        plantedDate: p.plantedDate,
        note: p.note,
        plotId: p.plotId,
        cultivationAreaId,
        coordinate: p.coordinate,
        id:
          initialData?.id ||
          `pl-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      } as any;
    });

    if (initialData) {
      onSubmit(newPlantArr[0]);
    } else {
      onSubmit(newPlantArr);
    }
  };

  const selectedEnterprise = enterprises.find(
    (e) => e.id.toString() === enterpriseId,
  );

  // ---- Default map center ----
  const mapCenter = useMemo(() => {
    const withCoord = plants.find((p) => p.plotId);
    if (withCoord)
      return [withCoord.coordinate.lat, withCoord.coordinate.lng] as [
        number,
        number,
      ];
    if (smallestUnits[0]?.coordinates?.[0]) {
      return [
        smallestUnits[0].coordinates[0].lat,
        smallestUnits[0].coordinates[0].lng,
      ] as [number, number];
    }
    return [11.548, 106.896] as [number, number];
  }, [plants, smallestUnits]);

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn vùng canh tác",
      description: "Chọn doanh nghiệp và vùng canh tác",
      isValid: !!(
        enterpriseId &&
        cultivationAreaId &&
        selectedScopeIds.length > 0
      ),
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-green-900">
                  Định vị vùng canh tác
                </h3>
                <p className="text-sm text-green-700/80">
                  Chọn doanh nghiệp và vùng canh tác trước. Vị trí cụ thể của
                  từng cây sẽ được chọn ở bước tiếp theo.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid md:grid-cols-2 gap-6 grid-col-1">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Doanh nghiệp sở hữu <span className="text-red-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <EnterpriseSelector
                    selectedId={enterpriseId}
                    onSelect={(id) => {
                      setEnterpriseId(id);
                      setCultivationAreaId("");
                      setPlants((prev) =>
                        prev.map((p) => ({
                          ...p,
                          plotId: "",
                          coordinate: { lat: 11.548, lng: 106.896 },
                        })),
                      );
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Vùng canh tác <span className="text-red-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <CultivationAreaSelector
                    areas={filteredCultivationAreas}
                    selectedId={cultivationAreaId}
                    onSelect={(val) => {
                      setCultivationAreaId(val);
                      setSelectedScopeIds([]);
                      setPlants((prev) =>
                        prev.map((p) => ({
                          ...p,
                          plotId: "",
                          coordinate: { lat: 11.548, lng: 106.896 },
                        })),
                      );
                    }}
                    disabled={!enterpriseId}
                  />
                  {!enterpriseId && (
                    <p className="text-xs text-muted-foreground italic">
                      Chọn doanh nghiệp trước để hiển thị các vùng canh tác.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Step 1 Part 3: Geographical scope picker (modal) — shown BEFORE tech config */}
            {selectedCultivationArea &&
              geographicalUnits.length > 0 &&
              (() => {
                const selectedScopeUnits = geographicalUnits.filter((u) =>
                  selectedScopeIds.includes(u.id),
                );

                // Build tree data for the modal
                const regionStore = useRegionStore.getState();
                const regions = geographicalUnits.filter((u) => u.level === 3);
                const areas = geographicalUnits.filter((u) => u.level === 2);
                const plots = geographicalUnits.filter((u) => u.level === 1);

                const areasByRegion: Record<string, any[]> = {};
                areas.forEach((area) => {
                  const ac = regionStore.getAreaById?.(area.id);
                  const rid = ac?.region?.id?.toString() || "";
                  if (!areasByRegion[rid]) areasByRegion[rid] = [];
                  areasByRegion[rid].push(area);
                });
                const plotsByArea: Record<string, any[]> = {};
                plots.forEach((plot) => {
                  const pc = regionStore.getPlotById?.(plot.id);
                  const aid = pc?.area?.id?.toString() || "";
                  if (!plotsByArea[aid]) plotsByArea[aid] = [];
                  plotsByArea[aid].push(plot);
                });

                // Calculate selected hierarchy for display
                const selectedHierarchy = regions
                  .filter(
                    (r) =>
                      selectedScopeIds.includes(r.id) ||
                      (areasByRegion[r.id] || []).some(
                        (a) =>
                          selectedScopeIds.includes(a.id) ||
                          (plotsByArea[a.id] || []).some((p) =>
                            selectedScopeIds.includes(p.id),
                          ),
                      ),
                  )
                  .map((r) => ({
                    ...r,
                    isSelected: selectedScopeIds.includes(r.id),
                    areas: (areasByRegion[r.id] || [])
                      .filter(
                        (a) =>
                          selectedScopeIds.includes(a.id) ||
                          selectedScopeIds.includes(r.id) ||
                          (plotsByArea[a.id] || []).some((p) =>
                            selectedScopeIds.includes(p.id),
                          ),
                      )
                      .map((a) => ({
                        ...a,
                        isSelected:
                          selectedScopeIds.includes(a.id) ||
                          selectedScopeIds.includes(r.id),
                        plots: (plotsByArea[a.id] || [])
                          .filter(
                            (p) =>
                              selectedScopeIds.includes(p.id) ||
                              selectedScopeIds.includes(a.id) ||
                              selectedScopeIds.includes(r.id),
                          )
                          .map((p) => ({
                            ...p,
                            isSelected:
                              selectedScopeIds.includes(p.id) ||
                              selectedScopeIds.includes(a.id) ||
                              selectedScopeIds.includes(r.id),
                          })),
                      })),
                  }));

                const ScopeModal = () => {
                  const [open, setOpen] = useState(false);
                  const [search, setSearch] = useState("");
                  const [tempIds, setTempIds] =
                    useState<string[]>(selectedScopeIds);
                  const [expandedRegions, setExpandedRegions] = useState<
                    string[]
                  >(regions.map((r) => r.id));
                  const [expandedAreas, setExpandedAreas] = useState<string[]>(
                    areas.map((a) => a.id),
                  );

                  const lowerSearch = search.toLowerCase();
                  const filteredRegions = regions.filter(
                    (r) =>
                      !search || r.name.toLowerCase().includes(lowerSearch),
                  );

                  const toggleId = (id: string, level: number) => {
                    const toAdd = new Set<string>();
                    const toRemove = new Set<string>();

                    const isCurrentlySelected = tempIds.includes(id);

                    if (level === 3) {
                      // Region: toggle region and all children
                      const regionAreas = areasByRegion[id] || [];
                      const allChildIds = [id];
                      regionAreas.forEach((area) => {
                        allChildIds.push(area.id);
                        (plotsByArea[area.id] || []).forEach((plot) =>
                          allChildIds.push(plot.id),
                        );
                      });

                      if (isCurrentlySelected) {
                        allChildIds.forEach((cid) => toRemove.add(cid));
                      } else {
                        allChildIds.forEach((cid) => toAdd.add(cid));
                      }
                    } else if (level === 2) {
                      // Area: toggle area and its plots
                      const allChildIds = [id];
                      (plotsByArea[id] || []).forEach((plot) =>
                        allChildIds.push(plot.id),
                      );

                      if (isCurrentlySelected) {
                        allChildIds.forEach((cid) => toRemove.add(cid));
                      } else {
                        allChildIds.forEach((cid) => toAdd.add(cid));
                      }
                    } else {
                      // Plot: just toggle self
                      if (isCurrentlySelected) {
                        toRemove.add(id);
                      } else {
                        toAdd.add(id);
                      }
                    }

                    setTempIds((prev) => {
                      const next = prev.filter((x) => !toRemove.has(x));
                      toAdd.forEach((aid) => {
                        if (!next.includes(aid)) next.push(aid);
                      });
                      return next;
                    });
                  };

                  const confirm = () => {
                    setSelectedScopeIds(tempIds);
                    setPlants((prev) =>
                      prev.map((p) => ({
                        ...p,
                        plotId: "",
                        coordinate: { lat: 11.548, lng: 106.896 },
                      })),
                    );
                    setOpen(false);
                  };

                  return (
                    <>
                      {/* Trigger card */}
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                        <CardHeader className="border-b py-4 bg-slate-50/80">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Phạm vi địa lý{" "}
                            <span className="text-red-500">*</span>
                            <span className="ml-auto text-[10px] font-normal text-slate-400">
                              Giới hạn địa lý tối đa của cây trồng ở bước 2
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          {selectedHierarchy.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <ChevronDown className="w-3 h-3" />
                                Phân cấp quản lý
                              </div>

                              <div className="space-y-0 relative ml-2">
                                {selectedHierarchy.map((region) => (
                                  <div key={region.id} className="relative">
                                    {/* Region Row */}
                                    <div className="flex items-start gap-3 relative pb-4">
                                      {/* Vertical line for region descendants */}
                                      {region.areas.length > 0 && (
                                        <div className="absolute left-[15px] top-[34px] bottom-0 w-px bg-slate-200" />
                                      )}

                                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 relative z-10">
                                        <MapPin className="w-4 h-4" />
                                      </div>
                                      <div className="pt-0.5">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                                          Vùng trồng
                                        </div>
                                        <div className="text-sm font-bold text-slate-800">
                                          {region.name}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Areas */}
                                    <div className="ml-[15px] space-y-0">
                                      {region.areas.map((area) => (
                                        <div
                                          key={area.id}
                                          className="relative pl-6 pb-4"
                                        >
                                          {/* Horizontal connector to area */}
                                          <div className="absolute left-0 top-4 w-5 h-px bg-slate-200" />

                                          {/* Vertical line for plot descendants */}
                                          {area.plots.length > 0 && (
                                            <div className="absolute left-[19px] top-[34px] bottom-0 w-px bg-slate-100" />
                                          )}

                                          <div className="flex items-start gap-3 relative">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 relative z-10">
                                              <Layers className="w-4 h-4" />
                                            </div>
                                            <div className="pt-0.5">
                                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                                                Khu vực
                                              </div>
                                              <div className="text-sm font-bold text-slate-800">
                                                {area.name}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Plots */}
                                          <div className="ml-[19px] space-y-0">
                                            {area.plots.map((plot: any) => (
                                              <div
                                                key={plot.id}
                                                className="relative pl-6 pt-4 first:pt-4"
                                              >
                                                {/* Horizontal connector to plot */}
                                                <div className="absolute left-0 top-8 w-5 h-px bg-slate-100" />

                                                <div className="flex items-start gap-3 relative">
                                                  <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0 relative z-10">
                                                    <Target className="w-4 h-4" />
                                                  </div>
                                                  <div className="pt-0.5">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                                                      Lô đất
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-800">
                                                      {plot.name}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                              Chưa chọn phạm vi địa lý — vui lòng chọn để tiếp
                              tục
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setTempIds(selectedScopeIds);
                              setOpen(true);
                            }}
                            className="w-full h-10 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-xl flex items-center justify-center text-sm mt-2"
                          >
                            <Plus className="w-4 h-4" />
                            {selectedScopeUnits.length > 0
                              ? `Chỉnh sửa phạm vi (${selectedScopeUnits.length})`
                              : "Chọn phạm vi địa lý"}
                          </button>
                        </CardContent>
                      </Card>

                      {/* Modal */}
                      <Dialog
                        open={open}
                        onOpenChange={(o) => {
                          setOpen(o);
                          if (!o) setSearch("");
                        }}
                      >
                        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
                          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
                            <DialogTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              Chọn phạm vi địa lý
                              {tempIds.length > 0 && (
                                <Badge className="ml-2 text-[10px]">
                                  {tempIds.length} đã chọn
                                </Badge>
                              )}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              Chọn một hoặc nhiều Vùng trồng, Khu vực hoặc Lô
                              đất. Cây trồng ở bước 2 sẽ bị giới hạn trong phạm
                              vi này.
                            </p>
                          </DialogHeader>

                          <div className="px-6 pb-5 border-b shrink-0 bg-white">
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <Input
                                placeholder="Tìm kiếm vùng, khu vực, lô..."
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                            </div>
                          </div>

                          <ScrollArea className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-4">
                              {filteredRegions.length === 0 &&
                                regions.length > 0 &&
                                search && (
                                  <div className="space-y-2">
                                    {areas
                                      .filter((a) =>
                                        a.name
                                          .toLowerCase()
                                          .includes(lowerSearch),
                                      )
                                      .map((area: any) => {
                                        const ac = regionStore.getAreaById?.(
                                          area.id,
                                        );
                                        const rid =
                                          ac?.region?.id?.toString() || "";
                                        const isInherited =
                                          tempIds.includes(rid);

                                        return (
                                          <button
                                            key={area.id}
                                            type="button"
                                            onClick={() => toggleId(area.id, 2)}
                                            disabled={isInherited}
                                            className={cn(
                                              "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                                              tempIds.includes(area.id)
                                                ? "bg-primary/10 border-primary/40"
                                                : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                              isInherited &&
                                                "opacity-60 cursor-not-allowed",
                                            )}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Layers className="w-4 h-4" />
                                              </div>
                                              <div>
                                                <div className="font-bold text-slate-800 text-sm">
                                                  {area.name}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                  Khu vực
                                                </div>
                                              </div>
                                            </div>
                                            {tempIds.includes(area.id) ? (
                                              <CheckCircle2 className="w-5 h-5 text-primary" />
                                            ) : (
                                              <div className="w-5 h-5 rounded border-2 border-slate-200" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    {plots
                                      .filter((p) =>
                                        p.name
                                          .toLowerCase()
                                          .includes(lowerSearch),
                                      )
                                      .map((plot: any) => {
                                        const pc = regionStore.getPlotById?.(
                                          plot.id,
                                        );
                                        const aid =
                                          pc?.area?.id?.toString() || "";
                                        const ac =
                                          regionStore.getAreaById?.(aid);
                                        const rid =
                                          ac?.region?.id?.toString() || "";
                                        const isInherited =
                                          tempIds.includes(rid) ||
                                          tempIds.includes(aid);

                                        return (
                                          <button
                                            key={plot.id}
                                            type="button"
                                            onClick={() => toggleId(plot.id, 1)}
                                            disabled={isInherited}
                                            className={cn(
                                              "w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all cursor-pointer",
                                              tempIds.includes(plot.id)
                                                ? "bg-primary/10 border-primary/40"
                                                : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                              isInherited &&
                                                "opacity-60 cursor-not-allowed",
                                            )}
                                          >
                                            <div className="flex items-center gap-2.5">
                                              <div className="w-2 h-2 rounded-full bg-slate-200" />
                                              <span className="font-medium text-slate-600 text-xs">
                                                {plot.name}
                                              </span>
                                            </div>
                                            {tempIds.includes(plot.id) ? (
                                              <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : (
                                              <div className="w-4 h-4 rounded border border-slate-200" />
                                            )}
                                          </button>
                                        );
                                      })}
                                  </div>
                                )}

                              {filteredRegions.map((r) => (
                                <div key={r.id} className="space-y-2">
                                  {/* Region row */}
                                  <div className="flex items-center gap-2 group">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedRegions((prev) =>
                                          prev.includes(r.id)
                                            ? prev.filter((x) => x !== r.id)
                                            : [...prev, r.id],
                                        )
                                      }
                                      className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
                                    >
                                      {expandedRegions.includes(r.id) ? (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                      )}
                                    </button>
                                    <div
                                      onClick={() => toggleId(r.id, 3)}
                                      className={cn(
                                        "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                                        tempIds.includes(r.id)
                                          ? "bg-primary/10 border-primary/40"
                                          : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                          <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="font-bold text-slate-800 text-sm">
                                            {r.name}
                                          </div>
                                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                            Vùng trồng
                                          </div>
                                        </div>
                                      </div>
                                      {tempIds.includes(r.id) ? (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle2 className="w-5 h-5 text-primary" />
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px] bg-primary/10 text-primary border-none"
                                          >
                                            Đã chọn
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Areas */}
                                  {expandedRegions.includes(r.id) && (
                                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                                      {(areasByRegion[r.id] || []).map(
                                        (area: any) => {
                                          const isInheritedArea =
                                            tempIds.includes(r.id);
                                          return (
                                            <div
                                              key={area.id}
                                              className="space-y-2"
                                            >
                                              <div className="flex items-center gap-2 group">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setExpandedAreas((prev) =>
                                                      prev.includes(area.id)
                                                        ? prev.filter(
                                                            (x) =>
                                                              x !== area.id,
                                                          )
                                                        : [...prev, area.id],
                                                    )
                                                  }
                                                  className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
                                                >
                                                  {expandedAreas.includes(
                                                    area.id,
                                                  ) ? (
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                  ) : (
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                  )}
                                                </button>
                                                <div
                                                  onClick={() =>
                                                    !isInheritedArea &&
                                                    toggleId(area.id, 2)
                                                  }
                                                  className={cn(
                                                    "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                                    tempIds.includes(area.id)
                                                      ? "bg-primary/10 border-primary/40"
                                                      : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                                    isInheritedArea &&
                                                      "opacity-60 cursor-not-allowed",
                                                  )}
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                                      <Layers className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-xs">
                                                      {area.name}
                                                    </span>
                                                  </div>
                                                  {tempIds.includes(area.id) ? (
                                                    <div className="flex items-center gap-2">
                                                      <CheckCircle2 className="w-4 h-4 text-primary" />
                                                      <Badge
                                                        variant="secondary"
                                                        className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0"
                                                      >
                                                        Đã chọn
                                                      </Badge>
                                                    </div>
                                                  ) : (
                                                    <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors" />
                                                  )}
                                                </div>
                                              </div>

                                              {/* Plots */}
                                              {expandedAreas.includes(
                                                area.id,
                                              ) && (
                                                <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                                                  {(
                                                    plotsByArea[area.id] || []
                                                  ).map((plot: any) => {
                                                    const isInheritedPlot =
                                                      isInheritedArea ||
                                                      tempIds.includes(area.id);
                                                    return (
                                                      <div
                                                        key={plot.id}
                                                        onClick={() =>
                                                          !isInheritedPlot &&
                                                          toggleId(plot.id, 1)
                                                        }
                                                        className={cn(
                                                          "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                                          tempIds.includes(
                                                            plot.id,
                                                          )
                                                            ? "bg-primary/10 border-primary/40"
                                                            : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                                          isInheritedPlot &&
                                                            "opacity-60 cursor-not-allowed",
                                                        )}
                                                      >
                                                        <div className="flex items-center gap-2.5">
                                                          <div
                                                            className={cn(
                                                              "w-2 h-2 rounded-full transition-colors",
                                                              tempIds.includes(
                                                                plot.id,
                                                              )
                                                                ? "bg-primary"
                                                                : "bg-slate-200 group-hover:bg-primary/50",
                                                            )}
                                                          />
                                                          <span className="font-medium text-slate-600 text-xs">
                                                            {plot.name}
                                                          </span>
                                                        </div>
                                                        {tempIds.includes(
                                                          plot.id,
                                                        ) ? (
                                                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                        ) : (
                                                          <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-primary transition-colors" />
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}

                              {filteredRegions.length === 0 && !search && (
                                <div className="text-center py-12">
                                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Search className="w-6 h-6 text-slate-300" />
                                  </div>
                                  <div className="text-slate-500 font-medium text-sm">
                                    Không có dữ liệu địa lý
                                  </div>
                                </div>
                              )}
                            </div>
                          </ScrollArea>

                          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
                            <Button
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={confirm}
                              disabled={tempIds.length === 0}
                            >
                              Xác nhận
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  );
                };

                return <ScopeModal key={selectedCultivationArea.id} />;
              })()}

            {selectedCultivationArea && (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                <CardHeader className="border-b py-4 bg-slate-50/80">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    Cấu hình kỹ thuật vùng canh tác
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                          Quản lý
                        </div>
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {manager?.fullName || "Chưa phân công"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <Beaker className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                          Kỹ thuật canh tác
                        </div>
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {farmingMethod?.name || "Chưa thiết lập"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {irrigationMethod?.name || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sprout className="w-3 h-3 text-green-500" />
                      Giống cây trồng
                    </div>
                    {selectedCropsData.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCropsData.map((c: any) => (
                          <div
                            key={c.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                              {c.illustration ? (
                                <img
                                  src={
                                    typeof c.illustration === "string"
                                      ? c.illustration
                                      : URL.createObjectURL(c.illustration)
                                  }
                                  alt={c.varietyName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Sprout className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-bold text-primary font-mono uppercase bg-primary/5 px-1 py-0.5 rounded">
                                  {c.varietyCode}
                                </span>
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {c.varietyName}
                                </span>
                              </div>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 border-green-200 text-green-600 bg-green-50/50"
                                >
                                  Nảy mầm: {c.germinationRate}%
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 border-blue-200 text-blue-600 bg-blue-50/50"
                                >
                                  Đồng đều: {c.uniformity}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                        Chưa có thông tin cây trồng cho vùng này
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "plants",
      title: "Thông tin cây trồng",
      description: "Thêm từng cây trồng, chọn vị trí và điền thông tin",
      isValid: plants.length > 0 && plants.every((p) => p.plotId),
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50 p-5 shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-blue-900">
                    Danh sách cây trồng
                  </h3>
                  <p className="text-sm text-blue-700/80">
                    Mỗi cây có thể thuộc một lô/vị trí khác nhau trong vùng canh
                    tác.
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                  {plants.length} cây
                </div>
              </div>
              {!initialData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportOpen(true)}
                  className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                >
                  <Upload className="w-4 h-4 mr-2" /> Nhập từ Excel
                </Button>
              )}
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Plant list */}
            <div className="space-y-4">
              {plants.map((plant, idx) => (
                <PlantCard
                  key={plant.entryId}
                  plant={plant}
                  index={idx}
                  geographicalUnits={scopedGeographicalUnits}
                  onUpdate={(partial) => updatePlant(plant.entryId, partial)}
                  onRemove={() => removePlant(plant.entryId)}
                  canRemove
                  isInvalidBoundary={plant.isInvalidBoundary}
                />
              ))}

              {!initialData && (
                <button
                  type="button"
                  onClick={addPlant}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:border-primary/60 hover:bg-primary/5 transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm cây trồng
                </button>
              )}
            </div>

            {/* Right: Shared map */}
            <div className="lg:sticky lg:top-6">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-3 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Vị trí các cây trên bản đồ
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMapExpanded(true)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative transition-all duration-100 ease-in-out">
                  {/* Plant selector tabs above map */}
                  {plants.length > 0 && (
                    <div className="px-4 py-3 border-b flex gap-2 flex-wrap bg-slate-50/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider self-center shrink-0">
                        Cây đang chỉnh:
                      </span>
                      {plants.map((p, idx) => {
                        const isActive = effectiveActiveId === p.entryId;
                        const hasPlot = !!p.plotId;
                        return (
                          <button
                            type="button"
                            key={p.entryId}
                            onClick={() => {
                              handleSetActiveEntry(p.entryId);
                              setSuggestedCorrection(null);
                              document
                                .getElementById(`plant-${p.entryId}`)
                                ?.scrollIntoView({
                                  block: "center",
                                  behavior: "smooth",
                                });
                            }}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                              isActive
                                ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                                : hasPlot
                                  ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                  : "bg-white text-slate-400 border-dashed border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                            >
                              {idx + 1}
                            </span>
                            {`Cây ${idx + 1}`}
                            {!hasPlot && (
                              <span className="ml-1 text-[10px] text-red-400">
                                *
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Out-of-bounds warning */}
                  {suggestedCorrection && (
                    <div className="absolute z-10 bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                        <span>
                          <span className="font-bold">
                            Ngoài phạm vi hợp lệ!
                          </span>{" "}
                          Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển
                          marker vào trong vùng hợp lệ hoặc áp dụng gợi ý.{" "}
                          <span className="text-red-500">
                            Vĩ độ: {suggestedCorrection.lat} - Kinh độ:{" "}
                            {suggestedCorrection.lng}
                          </span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-[10px] shrink-0 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          updatePlant(suggestedCorrection.entryId, {
                            coordinate: {
                              lat: suggestedCorrection.lat,
                              lng: suggestedCorrection.lng,
                            },
                            isInvalidBoundary: false,
                          });
                          setSuggestedCorrection(null);
                        }}
                      >
                        Áp dụng gợi ý
                      </Button>
                    </div>
                  )}
                  <div
                    className={cn(
                      "h-125 relative z-0 transition-all duration-100 ease-in-out",
                      isMapExpanded ? "hidden opacity-0" : "",
                    )}
                  >
                    <MapContainer
                      center={mapCenter}
                      zoom={17}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <AllPlantsMapContent
                        clickable={true}
                        plants={plants}
                        activeId={effectiveActiveId}
                        geographicalUnits={scopedGeographicalUnits}
                        setActiveEntryId={handleSetActiveEntry}
                        onPlantMove={validateAndSnapToUnit}
                        onAutoAssign={handleAutoAssign}
                        suggestedCorrection={suggestedCorrection}
                      />
                    </MapContainer>
                    <div className="absolute bottom-4 left-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      Bấm bản đồ hoặc kéo marker để thay đổi vị trí
                    </div>
                    {/* Legend */}
                    <div className="absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-2 rounded-lg space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-indigo-500 bg-indigo-500/20" />
                        Cây đang chỉnh
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-green-500 bg-green-500/20" />
                        Lô đã có cây
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-dashed border-orange-400 bg-orange-400/10" />
                        Lô trống
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expanded map dialog */}
          <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden border-none flex flex-col">
              <DialogHeader className="p-4 bg-white border-b shrink-0">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-primary" />
                  Bản đồ toàn bộ cây trồng
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 relative flex flex-col">
                {/* Plant selector tabs above expanded map */}
                {plants.length > 0 && (
                  <div className="px-4 py-3 border-b flex gap-2 flex-wrap bg-slate-50/60 shrink-0">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider self-center shrink-0">
                      Cây đang chỉnh:
                    </span>
                    {plants.map((p, idx) => {
                      const isActive = effectiveActiveId === p.entryId;
                      const hasPlot = !!p.plotId;
                      return (
                        <button
                          key={p.entryId}
                          type="button"
                          onClick={() => handleSetActiveEntry(p.entryId)}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                            isActive
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                              : hasPlot
                                ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                : "bg-white text-slate-400 border-dashed border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            {idx + 1}
                          </span>
                          {`Cây ${idx + 1}`}
                          {!hasPlot && (
                            <span className="ml-1 text-[10px] text-red-400">
                              *
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex-1 relative">
                  {suggestedCorrection && (
                    <div className="absolute z-[1000] bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                        <span>
                          <span className="font-bold">
                            Ngoài phạm vi hợp lệ!
                          </span>{" "}
                          Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển
                          marker vào trong vùng hợp lệ hoặc áp dụng gợi ý.
                          <span className="text-red-500">
                            Vĩ độ: {suggestedCorrection.lat} - Kinh độ:{" "}
                            {suggestedCorrection.lng}
                          </span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-[10px] shrink-0 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          updatePlant(suggestedCorrection.entryId, {
                            coordinate: {
                              lat: suggestedCorrection.lat,
                              lng: suggestedCorrection.lng,
                            },
                            isInvalidBoundary: false,
                          });
                          setSuggestedCorrection(null);
                        }}
                      >
                        Áp dụng gợi ý
                      </Button>
                    </div>
                  )}

                  <MapContainer
                    center={mapCenter}
                    zoom={18}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <AllPlantsMapContent
                      activeId={effectiveActiveId}
                      onPlantMove={validateAndSnapToUnit}
                      onAutoAssign={handleAutoAssign}
                      clickable={true}
                      plants={plants}
                      geographicalUnits={scopedGeographicalUnits}
                      setActiveEntryId={handleSetActiveEntry}
                      suggestedCorrection={suggestedCorrection}
                    />
                  </MapContainer>
                </div>
              </div>
              <DialogFooter className="p-4 bg-slate-50 border-t shrink-0">
                <Button
                  type="button"
                  className="w-full md:w-auto px-10"
                  onClick={() => setIsMapExpanded(false)}
                >
                  Đóng bản đồ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi lưu",
      isValid: true,
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 z-10 relative">
              Xác nhận thông tin
            </h3>
            <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
              Sắp {initialData ? "cập nhật thông tin" : "lưu"}{" "}
              <span className="font-bold">{plants.length} cây trồng</span>{" "}
              {initialData ? "thuộc" : "vào"} vùng{" "}
              <span className="font-bold">
                {selectedCultivationArea?.name || "—"}
              </span>
              .
            </p>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Overview row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col col-span-4 gap-4 w-full border rounded-xl p-4 shadow-sm bg-white">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-sm">
                  {selectedEnterprise?.image ? (
                    <img
                      src={selectedEnterprise?.image}
                      alt={selectedEnterprise?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Briefcase className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/20"
                    >
                      {selectedEnterprise?.code}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] py-0 h-4 bg-slate-100 capitalize font-medium"
                    >
                      {selectedEnterprise?.type}
                    </Badge>
                  </div>
                  <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                    {selectedEnterprise?.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span className="font-medium text-slate-500">MST:</span>
                    <span>{selectedEnterprise?.taxCode}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="bg-slate-100 p-1 rounded-md shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-medium text-slate-800 mr-1">
                      Địa chỉ:
                    </span>
                    {selectedEnterprise?.address}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-2 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {plants.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Số lượng cây trồng
              </div>
            </div>
            <div className="bg-white col-span-3 border rounded-xl p-4 text-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-left font-bold text-slate-900 truncate">
                    {selectedCultivationArea?.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span className="truncate">
                      {selectedCultivationArea?.targetName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedCultivationArea && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-800">
                  Cấu hình kỹ thuật được áp dụng
                </h4>
              </div>
              <div className="p-6 space-y-5 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                        Quản lý phụ trách
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {manager?.fullName || "Chưa phân công"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                      <Beaker className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                        Kỹ thuật canh tác
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {farmingMethod?.name || "Chưa thiết lập"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {irrigationMethod?.name || ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sprout className="w-3 h-3 text-green-500" />
                    Giống cây trồng
                  </div>
                  {selectedCropsData.length > 0 ? (
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="w-[80px]">Hình ảnh</TableHead>
                            <TableHead>Mã giống</TableHead>
                            <TableHead>Tên giống</TableHead>
                            <TableHead className="text-right">
                              Tỷ lệ nảy mầm
                            </TableHead>
                            <TableHead className="text-right">
                              Độ đồng đều
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCropsData.map((c: any) => (
                            <TableRow
                              key={c.id}
                              className="hover:bg-slate-50/30"
                            >
                              <TableCell>
                                <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                                  {c.illustration ? (
                                    <img
                                      src={
                                        typeof c.illustration === "string"
                                          ? c.illustration
                                          : URL.createObjectURL(c.illustration)
                                      }
                                      alt={c.varietyName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Sprout className="w-4 h-4 text-slate-300" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                  {c.varietyCode}
                                </span>
                              </TableCell>
                              <TableCell className="font-semibold text-slate-800">
                                {c.varietyName}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant="outline"
                                  className="border-green-100 text-green-600 bg-green-50/50 text-[10px]"
                                >
                                  {c.germinationRate}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant="outline"
                                  className="border-blue-100 text-blue-600 bg-blue-50/50 text-[10px]"
                                >
                                  {c.uniformity}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                      Chưa có thông tin cây trồng cho vùng này
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Plant list table */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">
                Danh sách cây trồng
              </h4>
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b">
                    <TableHead className="w-[50px] text-center font-bold text-[10px] uppercase tracking-wider">
                      #
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                      Vị trí (Lô/Khu vực)
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                      Ngày trồng
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider text-right">
                      Cao (m)
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider text-center">
                      Tuổi
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                      Tọa độ
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">
                      Ghi chú
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plants.map((p, idx) => {
                    const unit = geographicalUnits.find(
                      (u) => u.id === p.plotId,
                    );
                    return (
                      <TableRow
                        key={p.entryId}
                        className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="text-center font-medium text-slate-400 text-xs">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          {unit ? (
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded flex items-center justify-center shrink-0",
                                  unit.level === 3
                                    ? "bg-blue-50 text-blue-600"
                                    : unit.level === 2
                                      ? "bg-purple-50 text-purple-600"
                                      : "bg-green-50 text-green-600",
                                )}
                              >
                                {unit.level === 3 ? (
                                  <MapPin className="w-3 h-3" />
                                ) : unit.level === 2 ? (
                                  <Layers className="w-3 h-3" />
                                ) : (
                                  <Target className="w-3 h-3" />
                                )}
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {unit.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-400 italic text-xs flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Chưa chọn
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs">
                          {p.plantedDate
                            ? new Date(p.plantedDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-700">
                          {p.height || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 text-[10px] py-0 px-2 border-none"
                          >
                            {p.ageValue
                              ? `${p.ageValue} ${p.ageUnit === "years" ? "năm" : p.ageUnit === "months" ? "tháng" : "ngày"}`
                              : "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-slate-400">
                          {p.coordinate.lat.toFixed(5)},{" "}
                          {p.coordinate.lng.toFixed(5)}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate text-slate-500 text-xs italic">
                          {p.note || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Technical config */}
          {selectedCultivationArea && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-800">
                  Cấu hình kỹ thuật
                </h4>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Quản lý
                  </div>
                  <div className="font-medium text-slate-900">
                    {manager?.fullName || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Canh tác
                  </div>
                  <div className="font-medium text-slate-900">
                    {farmingMethod?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Tưới tiêu
                  </div>
                  <div className="font-medium text-slate-900">
                    {irrigationMethod?.name || "—"}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/plant-identification")}
        completeLabel={initialData ? "Cập nhật cây trồng" : "Lưu cây trồng"}
      />
      <ImportPlantDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={(importedList) => {
          if (importedList.length === 0) return;
          const newPlants: PlantEntry[] = importedList.map((item, index) => {
            const coord = item.coordinate || { lat: 11.548, lng: 106.896 };
            let autoPlotId = item.plotId || "";
            let invalid = true;

            if (!autoPlotId) {
              const pt = turf.point([coord.lng, coord.lat]);
              // Strictly check against selectedScopeIds only
              const sortedUnits = geographicalUnits
                .filter((u) => selectedScopeIds.includes(u.id))
                .sort((a, b) => a.level - b.level);

              for (const unit of sortedUnits) {
                if (unit.coordinates && unit.coordinates.length >= 3) {
                  try {
                    const polyCoords = [
                      ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
                      [unit.coordinates[0].lng, unit.coordinates[0].lat],
                    ];
                    const poly = turf.polygon([polyCoords]);
                    if (turf.booleanPointInPolygon(pt, poly)) {
                      autoPlotId = unit.id;
                      invalid = false;
                      break;
                    }
                  } catch {
                    // skip invalid polygon
                  }
                }
              }
            }

            return {
              entryId: `plant-import-${Date.now()}-${index}`,
              height: item.height?.toString() || "",
              ageValue: item.ageValue?.toString() || "",
              ageUnit: item.ageUnit || "years",
              plantedDate:
                item.plantedDate || new Date().toISOString().split("T")[0],
              note: item.note || "",
              plotId: autoPlotId,
              coordinate: coord,
              isInvalidBoundary: invalid,
            };
          });
          setPlants((prev) => {
            // override the initial empty plant row if untouched
            if (
              prev.length === 1 &&
              !prev[0].height &&
              !prev[0].ageValue &&
              !prev[0].plotId
            ) {
              return newPlants;
            }
            return [...prev, ...newPlants];
          });
        }}
      />
    </>
  );
};

export default PlantIdentificationForm;
