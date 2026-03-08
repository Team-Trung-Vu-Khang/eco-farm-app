import {
  AdminLayout,
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
  DialogFooter,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  MapPin,
  ScrollText,
  Search,
  Sprout,
  Leaf,
  User,
  X,
  Building2,
  Check,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import kinks from "@turf/kinks";
import { point, polygon } from "@turf/helpers";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { MapController } from "../region-chart/components/DraggableRectangle";

import useCultivationAreaStore from "../../stores/useCultivationAreaStore";
import useEnterpriseCertificateStore from "../../stores/useEnterpriseCertificateStore";

import useFarmingMethodStore from "../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useRegionStore from "../../stores/useRegionStore";
import useVarietyStore from "../../stores/useVarietyStore";
import useDepartmentStore from "@/stores/useDepartmentStore";
import useSeedStore from "../../stores/useSeedStore";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import type { Region } from "../region-chart/constants";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");





const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};

const toTurfPolygonFromCoords = (coords: { lat: number; lng: number }[]) => {
  if (!coords || coords.length < 3) return null;
  const lngLat = coords.map((c) => [c.lng, c.lat]);
  const first = lngLat[0];
  const closed = [...lngLat, first];
  return polygon([closed]);
};

const getNearestPointOnPolygonBoundary = (
  polyFeature: any,
  latlng: L.LatLng,
) => {
  if (!polyFeature) return null;
  const lineFeature = polygonToLine(polyFeature);
  const line = Array.isArray((lineFeature as any).features)
    ? (lineFeature as any).features[0]
    : lineFeature;
  if (!line) return null;
  const snapped = nearestPointOnLine(
    line as any,
    point([latlng.lng, latlng.lat]),
  );
  if (!snapped) return null;
  return L.latLng(
    snapped.geometry.coordinates[1],
    snapped.geometry.coordinates[0],
  );
};

// ────────────────────────────────────────────
import type { SubArea } from "../region-chart/constants";

const FilterStep = ({
  step,
  label,
  done,
  active,
}: {
  step: number;
  label: string;
  done: boolean;
  active: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 text-xs font-bold transition-all",
      done
        ? "text-primary"
        : active
          ? "text-slate-700"
          : "text-slate-300",
    )}
  >
    <div
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors",
        done ? "bg-primary text-white" : active ? "bg-slate-200 text-slate-600" : "bg-slate-100 text-slate-300",
      )}
    >
      {done ? <Check size={10} /> : step}
    </div>
    {label}
  </div>
);

// ── SubArea (Khu vực) Selector Dialog (Enterprise → Region → SubArea) ────
const SubAreaSelectorDialog = ({
  open,
  onOpenChange,
  onSelect,
  enterpriseId,
  selectedRegionId,
  selectedAreaId,
  onRegionChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (region: Region, area: SubArea) => void;
  enterpriseId: string;
  selectedRegionId: string;
  selectedAreaId: string;
  onRegionChange: (regionId: string) => void;
}) => {
  const { regions } = useRegionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalRegionId, setInternalRegionId] = useState(selectedRegionId);

  useEffect(() => {
    if (open) {
      setInternalRegionId(selectedRegionId);
      setSearchTerm("");
    }
  }, [open, selectedRegionId]);

  const filteredRegions = useMemo(() => {
    return regions.filter((r) => {
      const matchesEnt =
        !enterpriseId ||
        r.enterpriseId === enterpriseId ||
        r.enterpriseId === `ent-${enterpriseId}`;
      return matchesEnt;
    });
  }, [regions, enterpriseId]);

  const selectedRegionObj = useMemo(
    () => regions.find((r) => r.id.toString() === internalRegionId),
    [regions, internalRegionId],
  );

  const filteredAreas = useMemo(() => {
    if (!selectedRegionObj) return [];
    return (selectedRegionObj.subAreas || []).filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [selectedRegionObj, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl flex flex-col max-h-[90vh] border-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-6 bg-linear-to-br from-primary/10 via-white to-primary/5 border-b relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Layers size={80} className="text-primary rotate-12" />
          </div>
          <DialogTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Layers className="text-white h-5 w-5" />
            </div>
            Chọn khu vực canh tác
          </DialogTitle>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Chọn vùng trồng, sau đó chọn khu vực cụ thể
          </p>

          <div className="flex items-center gap-4 mt-3">
            <FilterStep
              step={1}
              label="Chọn vùng trồng"
              done={!!internalRegionId}
              active={!internalRegionId}
            />
            <div className="flex-1 h-px bg-slate-200" />
            <FilterStep
              step={2}
              label="Chọn khu vực"
              done={false}
              active={!!internalRegionId}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col overflow-hidden flex-1">
          {/* Region selection */}
          <div className="px-6 py-4 bg-white border-b">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Vùng trồng
            </label>
            <Select
              value={internalRegionId}
              onValueChange={(val) => {
                setInternalRegionId(val);
                onRegionChange(val);
                setSearchTerm("");
              }}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                <SelectValue placeholder="Chọn vùng trồng..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {filteredRegions.length === 0 ? (
                  <div className="py-4 text-center text-sm text-slate-400">
                    {enterpriseId
                      ? "Không có vùng nào cho doanh nghiệp này"
                      : "Chọn doanh nghiệp trước"}
                  </div>
                ) : (
                  filteredRegions.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-primary/60" />
                        <span>{r.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({r.area} ha)
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* SubArea search + list */}
          {internalRegionId && (
            <>
              <div className="px-6 py-3 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm tên khu vực..."
                    className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 p-6 bg-slate-50/50 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {filteredAreas.map((area) => {
                    const isSelectedActive =
                      selectedAreaId === area.id.toString();
                    return (
                      <div
                        key={area.id}
                        onClick={() => {
                          onSelect(selectedRegionObj!, area);
                          onOpenChange(false);
                        }}
                        className={cn(
                          "group relative overflow-hidden p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white",
                          isSelectedActive
                            ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                            : "border-transparent hover:border-slate-200 hover:shadow-lg shadow-sm",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                                isSelectedActive
                                  ? "bg-primary text-white"
                                  : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                              )}
                            >
                              <Layers size={20} />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                                  {area.code}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {area.area} ha
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {area.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin size={11} className="text-slate-300" />
                                <span>{selectedRegionObj?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              isSelectedActive
                                ? "bg-primary border-primary text-white scale-110"
                                : "border-slate-200 bg-white",
                            )}
                          >
                            {isSelectedActive && (
                              <Check size={13} className="stroke-3" />
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {(area.plots || []).length} lô đất
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] border-none font-bold",
                              area.status === "active"
                                ? "text-emerald-500 bg-emerald-50"
                                : "text-slate-400 bg-slate-50",
                            )}
                          >
                            {area.status === "active" ? "Đang hoạt động" : "Tạm dừng"}
                          </Badge>
                        </div>

                        <div
                          className={cn(
                            "absolute -bottom-6 -right-6 w-20 h-20 rounded-full transition-all duration-500",
                            isSelectedActive
                              ? "bg-primary/5 scale-125"
                              : "bg-slate-50 scale-100",
                          )}
                        />
                      </div>
                    );
                  })}

                  {filteredAreas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Layers size={28} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-600">
                        Không có khu vực nào
                      </h3>
                      <p className="text-sm mt-1 text-center max-w-48">
                        Vùng này chưa có khu vực nào được thiết lập
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}

          {!internalRegionId && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MapPin size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium">Chọn vùng trồng để xem danh sách khu vực</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ────────────────────────────────────────────
// Manager Selector
// ────────────────────────────────────────────
const ManagerSelector = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { personnel } = usePersonnelStore();
  const selectedManager = personnel.find((m) => m.id.toString() === selectedId);
  const departmentsFromStore = useDepartmentStore((state) => state.departments);
  const departments = departmentsFromStore
    .filter((d) => d.status === "active")
    .map((d) => d.name);

  const filteredManagers = useMemo(() => {
    return personnel.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "all" || m.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, departmentFilter, personnel]);

  return (
    <>
      <div
        className={`group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer ${
          selectedManager
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selectedManager ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
              {selectedManager.avatar ? (
                <img
                  src={selectedManager.avatar}
                  alt={selectedManager.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">
                {selectedManager.fullName}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-normal text-xs bg-slate-100"
                >
                  {selectedManager.position}
                </Badge>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs">{selectedManager.department}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 group-hover:text-primary"
            >
              Thay đổi
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-dashed flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">Chọn quản lý vùng trồng</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn quản lý vùng trồng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, chức vụ..."
                  className="pl-10 bg-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-35 bg-slate-50">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-75 pr-4">
              <div className="space-y-2">
                {filteredManagers.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedId === m.id.toString()
                        ? "bg-primary/5 border border-primary/20 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                    onClick={() => {
                      onSelect(m.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold overflow-hidden text-slate-600">
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        m.fullName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {m.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.position} - {m.department}
                      </div>
                    </div>
                    {selectedId === m.id.toString() && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
                {filteredManagers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy quản lý nào
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ────────────────────────────────────────────
// Certificate Selector
// ────────────────────────────────────────────
const CertificateSelector = ({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => {
  const { standards } = useEnterpriseCertificateStore();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standards.map((cert) => (
          <div
            key={cert.code}
            className={`cursor-pointer border rounded-xl p-3 relative flex items-start gap-3 transition-all ${
              selectedIds.includes(cert.code)
                ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
            }`}
            onClick={() => onToggle(cert.code)}
          >
            <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Award
                  className={`w-6 h-6 ${
                    selectedIds.includes(cert.code)
                      ? "text-primary"
                      : "text-slate-400"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate pr-4">
                {cert.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {cert.code}
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">
                {cert.organizations.join(", ")}
              </div>
            </div>
            {selectedIds.includes(cert.code) && (
              <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// Seed Selector Dialog
// ────────────────────────────────────────────
const SeedSelectorDialog = ({
  isOpen,
  variety,
  onSelect,
  selectedSeedIds = [],
  onOpenChange,
}: {
  variety: any;
  onSelect: (seedIds: string[]) => void;
  selectedSeedIds?: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const { seeds } = useSeedStore();

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedSeedIds);
    }
  }, [isOpen]);

  const filteredSeeds = useMemo(() => {
    if (!variety) return [];
    return seeds.filter(
      (s) =>
        s.varietyCode === variety.varietyCode &&
        (s.varietyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.varietyCode.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [seeds, variety, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Chọn hạt giống cho {variety?.varietyName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm hạt giống..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-72 border rounded-xl bg-slate-50/50">
            <div className="p-2 space-y-2">
              {filteredSeeds.map((seed) => {
                const isSelected = tempSelectedIds.includes(seed.id);
                return (
                  <div
                    key={seed.id}
                    onClick={() => {
                      if (isSelected) {
                        setTempSelectedIds((prev) =>
                          prev.filter((id) => id !== seed.id),
                        );
                      } else {
                        setTempSelectedIds((prev) => [...prev, seed.id]);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white hover:border-primary/40",
                      isSelected && "bg-primary/5 border-primary",
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {seed.varietyName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {seed.varietyCode} - {seed.supplier}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                );
              })}
              {filteredSeeds.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  Không tìm thấy hạt giống phù hợp
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              onSelect(tempSelectedIds);
              onOpenChange(false);
            }}
            className="flex-1"
            disabled={tempSelectedIds.length === 0}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────
const CultivationAreaCreatePage = () => {
  const [, setLocation] = useLocation();

  const { addCultivationArea } = useCultivationAreaStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  // Dialog state
  const [areaSelectorOpen, setAreaSelectorOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedArea, setSelectedArea] = useState<SubArea | null>(null);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [cropSearchTerm, setCropSearchTerm] = useState("");

  // Map state
  const [areaPoints, setAreaPoints] = useState<L.LatLng[]>([]);
  const [mapCenter, setMapCenter] = useState<L.LatLng>(L.latLng(11.54, 106.9));
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [pointWarnings, setPointWarnings] = useState<Record<number, any>>({});
  const [activeDragWarning, setActiveDragWarning] = useState<any | null>(null);

  const [configs, setConfigs] = useState<
    Record<
      string,
      {
        farmingMethodId: string;
        irrigationMethodId: string;
        selectedCrops: string[];
        seedSelections?: Record<string, string[]>;
      }
    >
  >({});

  const CONFIG_KEY = "region-config";

  const effectiveConfig = configs[CONFIG_KEY] || {
    farmingMethodId: "",
    irrigationMethodId: "",
    selectedCrops: [],
    seedSelections: {},
  };

  const availableCrops = useMemo(() => {
    if (!effectiveConfig.farmingMethodId) return [];
    let list = varieties.filter((v) => v.status === "active");
    if (cropSearchTerm) {
      const lower = cropSearchTerm.toLowerCase();
      list = list.filter(
        (v) =>
          v.varietyName.toLowerCase().includes(lower) ||
          v.crop.toLowerCase().includes(lower),
      );
    }
    return list;
  }, [varieties, effectiveConfig.farmingMethodId, cropSearchTerm]);

  // Update map when region changes
  useEffect(() => {
    if (
      selectedRegion &&
      selectedRegion.coordinates &&
      selectedRegion.coordinates.length >= 3
    ) {
      const regionPoints = selectedRegion.coordinates.map((c) =>
        L.latLng(c.lat, c.lng),
      );
      const center = getBoundsFromPoints(regionPoints).getCenter();
      setMapCenter(center);

      // Initial triangle if points are empty
      if (areaPoints.length === 0) {
        setAreaPoints([
          L.latLng(center.lat - 0.005, center.lng - 0.005),
          L.latLng(center.lat + 0.005, center.lng),
          L.latLng(center.lat - 0.005, center.lng + 0.005),
        ]);
      }
    }
  }, [selectedRegion]);

  const regionPolygonFeature = useMemo(() => {
    if (!selectedRegion?.coordinates || selectedRegion.coordinates.length < 3)
      return null;
    return toTurfPolygonFromCoords(selectedRegion.coordinates);
  }, [selectedRegion]);

  const blockingAreaPolygons = useMemo(() => {
    if (!selectedRegion?.subAreas) return [];
    return selectedRegion.subAreas
      .filter(
        (area) =>
          area.coordinates &&
          area.coordinates.length >= 3 &&
          area.id !== selectedArea?.id,
      )
      .map((area) => ({
        id: area.id,
        polygon: toTurfPolygonFromCoords(area.coordinates as any),
      }))
      .filter((item) => item.polygon !== null);
  }, [selectedRegion, selectedArea]);

  const validatePoint = (latlng: L.LatLng, index: number) => {
    const pt = point([latlng.lng, latlng.lat]);

    // 1. Outside Region check
    if (
      regionPolygonFeature &&
      !booleanPointInPolygon(pt, regionPolygonFeature)
    ) {
      const nearest = getNearestPointOnPolygonBoundary(
        regionPolygonFeature,
        latlng,
      );
      return { type: "outside", label: "Ngoài Vùng trồng", suggested: nearest };
    }

    // 2. Overlap with other areas check
    for (const areaObj of blockingAreaPolygons) {
      if (areaObj.polygon && booleanPointInPolygon(pt, areaObj.polygon)) {
        const nearest = getNearestPointOnPolygonBoundary(areaObj.polygon, latlng);
        return { type: "overlap", label: "Trùng lặp với khu vực khác", suggested: nearest };
      }
    }

    // 3. Self-intersection check
    const tempCoords = areaPoints.map((p, i) => 
      i === index ? { lat: latlng.lat, lng: latlng.lng } : { lat: p.lat, lng: p.lng }
    );
    const tempPoly = toTurfPolygonFromCoords(tempCoords);
    if (tempPoly) {
      const selfIntersections = kinks(tempPoly);
      if (selfIntersections.features.length > 0) {
        return { 
          type: "intersect", 
          label: "Lỗi tự cắt (Self-intersection)", 
          suggested: null 
        };
      }
    }

    return null;
  };

  const handlePointDrag = (
    index: number,
    latlng: L.LatLng,
    finalize = false,
  ) => {
    setAreaPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const violation = validatePoint(latlng, index);
    if (finalize) {
      if (violation) {
        setPointWarnings((prev) => ({ ...prev, [index]: { ...violation, index } }));
      } else {
        setPointWarnings((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      }
      setActiveDragWarning(null);
    } else {
      setActiveDragWarning(violation ? { ...violation, index } : null);
    }
    setActivePointIndex(index);
  };

  // ── Step 1: General Info ──
  const renderGeneralInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* Left: Basic Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Tên khu vực canh tác <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Khu vực canh tác Sầu riêng Bình Phước"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Doanh nghiệp <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5">
                <EnterpriseSelector
                  selectedId={selectedEnterpriseId}
                  onSelect={(val) => {
                    setSelectedEnterpriseId(val);
                    setSelectedRegion(null);
                  }}
                />
              </div>
            </div>

            {/* Cascaded Area Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Khu vực canh tác <span className="text-red-500">*</span>
                </Label>
                {selectedArea && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                    Đã chọn
                  </Badge>
                )}
              </div>

              {/* Breadcrumb preview */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <Building2 size={10} className="text-slate-400" />
                <span className={selectedEnterpriseId ? "text-slate-700 font-medium" : ""}>DN</span>
                <span className="text-slate-300">›</span>
                <MapPin size={10} className="text-slate-400" />
                <span className={selectedRegion ? "text-slate-700 font-medium" : ""}>{selectedRegion?.name || "Vùng"}</span>
                <span className="text-slate-300">›</span>
                <Layers size={10} className="text-slate-400" />
                <span className={selectedArea ? "text-primary font-bold" : ""}>{selectedArea?.name || "Khu vực"}</span>
              </div>

              <div
                className={cn(
                  "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
                  selectedArea ? "bg-white border-slate-200" : "bg-slate-50 border-dashed border-slate-300",
                  !selectedEnterpriseId && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => selectedEnterpriseId && setAreaSelectorOpen(true)}
              >
                {selectedArea ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 font-bold text-slate-900 truncate">{selectedArea.name}</div>
                    <Button variant="ghost" size="sm" className="text-slate-400 group-hover:text-primary">Thay đổi</Button>
                  </div>
                ) : (
                  <div className="py-3 text-center text-sm text-slate-400 group-hover:text-primary transition-colors">
                    {selectedEnterpriseId ? "Nhấn để chọn khu vực canh tác" : "Chọn doanh nghiệp trước"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2 pt-2">
              <Label className="text-sm font-medium">Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập thông tin ghi chú thêm..."
                className="min-h-20 border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Right: Certificates & Manager */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">
              Chứng nhận & Quản lý
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giấy chứng nhận / Tiêu chuẩn
              </Label>
              <CertificateSelector
                selectedIds={selectedCertIds}
                onToggle={(id) => {
                  setSelectedCertIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nhân viên chịu trách nhiệm
              </Label>
              <ManagerSelector
                selectedId={selectedManagerId}
                onSelect={setSelectedManagerId}
              />
            </div>

            {selectedRegion?.cropVarieties &&
              selectedRegion.cropVarieties.length > 0 && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-green-100 p-1.5 rounded-full h-fit">
                    <Sprout className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Cây trồng chủ lực của vùng
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRegion.cropVarieties.map((crop: any) => (
                        <Badge
                          key={crop.id}
                          variant="outline"
                          className="bg-white text-green-700 border-green-200"
                        >
                          {crop.name} - {crop.variety}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Map & Coordinates ──
  const renderMapPlotting = () => {
    if (!selectedRegion) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
          <MapPin className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Vui lòng chọn khu vực canh tác ở bước 1
          </p>
        </div>
      );
    }

    const warning =
      activeDragWarning ||
      (activePointIndex !== null ? pointWarnings[activePointIndex] : null);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Map Column */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border shadow-inner bg-slate-100">
            <MapContainer
              center={mapCenter}
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController center={mapCenter} />

              {/* Parent Region Boundary (Hidden Background) */}
              {selectedRegion.coordinates && (
                <Polygon
                  positions={selectedRegion.coordinates.map((c: any) => [
                    c.lat,
                    c.lng,
                  ])}
                  pathOptions={{
                    color: "#64748b",
                    weight: 2,
                    dashArray: "5, 10",
                    fillColor: "#f1f5f9",
                    fillOpacity: 0.05,
                  }}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 rounded-lg px-2 py-1"
                  >
                    Vùng: {selectedRegion.name}
                  </Tooltip>
                </Polygon>
              )}

              {/* Brother Areas (Read only background) */}
              {(selectedRegion.subAreas || [])
                .filter((a) => a.id !== selectedArea?.id) // Don't show if it's the one we're editing
                .map((area) => (
                  <Polygon
                    key={area.id}
                    positions={(area.coordinates || []).map((c: any) => [
                      c.lat,
                      c.lng,
                    ])}
                    pathOptions={{
                      color: "#cbd5e1",
                      weight: 1,
                      fillColor: "#f8fafc",
                      fillOpacity: 0.1,
                    }}
                  >
                    <Tooltip
                      permanent
                      direction="center"
                      className="bg-transparent border-none shadow-none text-[9px] font-bold text-slate-400"
                    >
                      {area.name}
                    </Tooltip>
                  </Polygon>
                ))}

              {/* New Area Boundary */}
              {areaPoints.length > 0 && (
                <Polygon
                  positions={areaPoints.map((p) => [p.lat, p.lng])}
                  pathOptions={{
                    color: "#22c55e",
                    weight: 3,
                    fillColor: "#22c55e",
                    fillOpacity: 0.3,
                  }}
                />
              )}

              {/* Draggable Markers */}
              {areaPoints.map((p, idx) => (
                <Marker
                  key={idx}
                  position={p}
                  draggable
                  icon={
                    activePointIndex === idx
                      ? pointWarnings[idx]
                        ? invalidIcon
                        : activeIcon
                      : customIcon
                  }
                  eventHandlers={{
                    drag: (e) =>
                      handlePointDrag(idx, e.target.getLatLng(), false),
                    dragend: (e) =>
                      handlePointDrag(idx, e.target.getLatLng(), true),
                    click: () => setActivePointIndex(idx),
                  }}
                >
                  <Tooltip>Điểm {idx + 1}</Tooltip>
                </Marker>
              ))}

              {/* Suggested Point Preview */}
              {warning?.suggested && (
                <>
                  <Polyline
                    positions={[
                      [warning.suggested.lat, warning.suggested.lng],
                      [
                        areaPoints[activePointIndex!].lat,
                        areaPoints[activePointIndex!].lng,
                      ],
                    ]}
                    pathOptions={{
                      color: "#ef4444",
                      weight: 1,
                      dashArray: "4, 4",
                    }}
                  />
                  <Marker
                    position={warning.suggested}
                    icon={activeIcon}
                    opacity={0.6}
                  >
                    <Tooltip>Vị trí đề xuất (hợp lệ)</Tooltip>
                  </Marker>
                </>
              )}
            </MapContainer>

            {/* Float Info */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-none text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Đang thiết lập
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {name || "Khu vực mới"}
              </div>
            </div>
          </div>

          {/* Points List Column */}
          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Tọa độ ranh giới
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg"
                onClick={() => {
                  const center = getBoundsFromPoints(areaPoints).getCenter();
                  setAreaPoints((prev) => [
                    ...prev,
                    L.latLng(center.lat + 0.001, center.lng + 0.001),
                  ]);
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm điểm
              </Button>
            </div>

            <div className="space-y-2">
              {areaPoints.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePointIndex(idx)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all cursor-pointer bg-white group",
                    activePointIndex === idx
                      ? "border-primary shadow-md"
                      : "border-slate-100 hover:border-slate-200",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Điểm {idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-slate-300 hover:text-red-500 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (areaPoints.length <= 3) return;
                        setAreaPoints((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                        setActivePointIndex(null);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-400">
                        Vĩ độ (Lat)
                      </Label>
                      <Input
                        value={p.lat.toFixed(6)}
                        readOnly
                        className="h-8 text-xs bg-slate-50 border-none pointer-events-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-400">
                        Kinh độ (Lng)
                      </Label>
                      <Input
                        value={p.lng.toFixed(6)}
                        readOnly
                        className="h-8 text-xs bg-slate-50 border-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {warning && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Vị trí không hợp lệ</div>
                    <p className="text-xs opacity-80">
                      {warning.type === "outside"
                        ? "Điểm nằm ngoài ranh giới vùng trồng."
                        : "Điểm chồng lấn với khu vực khác."}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-3 h-8 bg-red-600 hover:bg-red-700 text-xs"
                  onClick={() => {
                    handlePointDrag(warning.index ?? activePointIndex!, warning.suggested, true);
                  }}
                >
                  Khắc phục tự động
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Step 3: Configuration ──
  const renderConfiguration = () => {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Farming & Irrigation Card */}
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Phương pháp canh tác</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Loại hình canh tác <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.farmingMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [CONFIG_KEY]: {
                            ...prev[CONFIG_KEY],
                            farmingMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Chọn phương pháp..." />
                      </SelectTrigger>
                      <SelectContent>
                        {farmingMethods.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="font-medium">{m.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Quyết định danh sách cây trồng phù hợp
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Hệ thống tưới tiêu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.irrigationMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [CONFIG_KEY]: {
                            ...prev[CONFIG_KEY],
                            irrigationMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Chọn phương pháp tưới..." />
                      </SelectTrigger>
                      <SelectContent>
                        {irrigationSystems.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-blue-500" />
                              <span>{m.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

          {/* Crop Selection Card */}
          <Card className="border-none shadow-md bg-white flex flex-col h-[420px]">
            <CardHeader className="pb-3 border-b bg-linear-to-r from-emerald-50/50 to-white">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Giống cây trồng</span>
                {effectiveConfig.farmingMethodId && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {availableCrops.length} loại
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
                  {!effectiveConfig.farmingMethodId ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      Chọn loại hình canh tác để xem danh sách cây trồng
                    </div>
                  ) : (
                    <>
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      value={cropSearchTerm}
                      onChange={(e) => setCropSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm giống cây trồng..."
                      className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                    />
                  </div>
                      <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="space-y-2 pr-2">
                          {availableCrops.map((crop) => {
                            const isSelected = effectiveConfig.selectedCrops?.includes(crop.id);
                            const selectedSeeds = effectiveConfig.seedSelections?.[crop.id] || [];
                            return (
                              <div
                                key={crop.id}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group",
                                  isSelected
                                    ? "bg-green-50 border-green-300 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-green-200 hover:shadow-sm",
                                )}
                                onClick={() => {
                                  const current = effectiveConfig.selectedCrops || [];
                                  if (current.includes(crop.id)) {
                                    const newCrops = current.filter((i) => i !== crop.id);
                                    const newSeeds = { ...(effectiveConfig.seedSelections || {}) };
                                    delete newSeeds[crop.id];
                                    
                                    setConfigs((prev) => ({
                                      ...prev,
                                      [CONFIG_KEY]: {
                                        ...effectiveConfig,
                                        selectedCrops: newCrops,
                                        seedSelections: newSeeds,
                                      },
                                    }));
                                  } else {
                                    setActiveSeedVariety(crop);
                                    setSeedDialogOpen(true);
                                  }
                                }}
                              >
                                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                  {crop.illustration ? (
                                    <img
                                      src={crop.illustration as string}
                                      alt={crop.varietyName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <Leaf className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col flex-1 shrink min-w-0">
                                  <div className={cn(
                                    "text-sm shrink font-semibold truncate",
                                    isSelected ? "text-green-900" : "text-slate-700"
                                  )}>
                                    {crop.varietyName}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5 shrink">
                                    {crop.crop}
                                  </div>
                                  {isSelected && selectedSeeds.length > 0 && (
                                    <div className="mt-1.5 flex flex-wrap gap-1.5 min-w-0">
                                      {selectedSeeds.map((seedId) => {
                                        const seed = seeds.find((s) => s.id === seedId);
                                        if (!seed) return null;
                                        return (
                                          <Badge
                                            key={seedId}
                                            variant="secondary"
                                            className="whitespace-normal wrap-break-word h-auto py-0.5 leading-tight bg-primary/5 text-primary border-primary/20 text-[10px] px-1.5 font-semibold max-w-full"
                                          >
                                            Hạt giống: {seed.varietyName}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                  isSelected ? "bg-green-500 border-green-500" : "border-slate-300"
                                )}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            );
                          })}
                          {availableCrops.length === 0 && (
                            <div className="text-center py-8 text-sm text-slate-400">
                              Không tìm thấy cây trồng phù hợp
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <SeedSelectorDialog
          isOpen={seedDialogOpen}
          variety={activeSeedVariety}
          selectedSeedIds={
            activeSeedVariety
              ? effectiveConfig.seedSelections?.[activeSeedVariety.id] || []
              : []
          }
          onSelect={(seedIds) => {
            if (!activeSeedVariety) return;
            setConfigs((prev) => {
              const current = prev[CONFIG_KEY] || {
                farmingMethodId: "",
                irrigationMethodId: "",
                selectedCrops: [],
              };
              const crops = current.selectedCrops || [];
              const newCrops = crops.includes(activeSeedVariety.id)
                ? crops
                : [...crops, activeSeedVariety.id];

              return {
                ...prev,
                [CONFIG_KEY]: {
                  ...current,
                  selectedCrops: newCrops,
                  seedSelections: {
                    ...(current.seedSelections || {}),
                    [activeSeedVariety.id]: seedIds,
                  },
                },
              };
            });
          }}
          onOpenChange={setSeedDialogOpen}
        />
      </div>
    );
  };

  // ── Step 3: Confirmation ──
  const renderConfirmation = () => {
    const commonConfig = configs[CONFIG_KEY];
    const { farmingMethods: fm } = useFarmingMethodStore.getState();
    const { irrigationSystems: is_ } = useIrrigationSystemStore.getState();
    const { personnel } = usePersonnelStore.getState();
    const { standards } = useEnterpriseCertificateStore.getState();
    const { varieties: vars } = useVarietyStore.getState();
    const selectedManager = personnel.find(
      (m) => m.id.toString() === selectedManagerId,
    );

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-primary/5 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Tên khu vực canh tác
                </p>
                <p className="font-bold text-slate-800">{name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Vùng trồng
                </p>
                <p className="font-bold text-slate-800">
                  {selectedRegion?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Quản lý
                </p>
                <p className="font-bold text-slate-800">
                  {selectedManager?.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Chứng nhận
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedCertIds.length > 0
                    ? selectedCertIds.map((id) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="text-[10px] bg-blue-50 text-blue-700"
                        >
                          {standards.find((c) => c.code === id)?.name || id}
                        </Badge>
                      ))
                    : "—"}
                </div>
              </div>
            </div>
            {note && (
              <div className="bg-yellow-50/50 border border-yellow-200/60 p-3 rounded-lg text-sm text-yellow-800">
                <span className="font-semibold mr-1">Ghi chú:</span> {note}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-600" />
              </div>
              Cấu hình canh tác
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Phương pháp canh tác
                </p>
                <p className="font-bold text-slate-800">
                  {fm.find((m) => m.id === commonConfig?.farmingMethodId)
                    ?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Hệ thống tưới
                </p>
                <p className="font-bold text-slate-800">
                  {is_.find((m) => m.id === commonConfig?.irrigationMethodId)
                    ?.name || "—"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                Cây trồng đã chọn
              </p>
              <div className="space-y-2">
                {commonConfig?.selectedCrops &&
                commonConfig.selectedCrops.length > 0 ? (
                  commonConfig.selectedCrops.map((cid) => {
                    const crop = vars.find((v) => v.id === cid);
                    return (
                      <div
                        key={cid}
                        className="flex items-center gap-3 flex-wrap"
                      >
                        <span className="font-bold text-slate-800">
                          {crop?.varietyName}
                        </span>
                        {commonConfig.seedSelections?.[cid] &&
                          commonConfig.seedSelections[cid].length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center ml-4 sm:ml-0">
                              <span className="text-xs text-muted-foreground italic mr-1">
                                Hạt giống:
                              </span>
                              {commonConfig.seedSelections[cid].map(
                                (sid: string) => (
                                  <Badge
                                    key={sid}
                                    variant="secondary"
                                    className="text-[10px] bg-slate-100"
                                  >
                                    {
                                      seeds.find((s) => s.id === sid)
                                        ?.varietyName
                                    }
                                  </Badge>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-red-500 italic text-sm">
                    Chưa chọn cây trồng
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const steps = [
    { id: "step-1", title: "Thông tin chung", content: renderGeneralInfo() },
    { id: "step-2", title: "Bản đồ ranh giới", content: renderMapPlotting() },
    {
      id: "step-3",
      title: "Cấu hình canh tác",
      content: renderConfiguration(),
    },
    { id: "step-4", title: "Xác nhận & Lưu", content: renderConfirmation() },
  ];

  return (
    <AdminLayout
      title="Thiết lập khu vực canh tác"
      description="Quy trình khởi tạo và cấu hình canh tác cho khu vực cụ thể"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-area")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel="Khởi tạo Khu vực canh tác"
              onComplete={() => {
                if (!selectedRegion) return;
                const commonConfig = configs[CONFIG_KEY];

                // 1. Add to CultivationAreaStore (Logical Config)
                addCultivationArea({
                  name,
                  regionId: selectedRegion.id.toString(),
                  regionName: selectedRegion.name,
                  areaId: selectedArea?.id,
                  areaName: selectedArea?.name,
                  enterpriseId: selectedEnterpriseId,
                  certificateIds: selectedCertIds,
                  managerId: selectedManagerId,
                  note,
                  farmingMethodId: commonConfig?.farmingMethodId || "",
                  irrigationMethodId: commonConfig?.irrigationMethodId || "",
                  selectedCrops: commonConfig?.selectedCrops || [],
                  seedSelections: commonConfig?.seedSelections || {},
                  configs,
                });

                // 2. Add to RegionStore (Geometry)
                const finalAreaId = selectedArea?.id || `sub-${selectedRegion.id}-${Date.now()}`;
                const finalAreaCode = selectedArea?.code || `AREA-${Date.now().toString().slice(-4)}`;

                useRegionStore.getState().upsertSubArea(selectedRegion.id, {
                  id: finalAreaId,
                  name: name,
                  code: finalAreaCode,
                  area: 0, // Should be calculated
                  coordinates: areaPoints.map((p) => ({
                    lat: p.lat,
                    lng: p.lng,
                  })),
                  status: "active",
                });

                setLocation("/cultivation-area");
              }}
              onCancel={() => setLocation("/cultivation-area")}
            />
          </div>
        </CardContent>
      </Card>

      {/* SubArea Selector Dialog */}
      <SubAreaSelectorDialog
        open={areaSelectorOpen}
        onOpenChange={setAreaSelectorOpen}
        onSelect={(region, area) => {
          setSelectedRegion(region);
          setSelectedArea(area);
          if (!name) setName(area.name);
          if (area.coordinates && area.coordinates.length > 0) {
            const pts = area.coordinates.map((c: any) => L.latLng(c.lat, c.lng));
            setAreaPoints(pts);
            setMapCenter(pts[0]);
          } else if (region.coordinates && region.coordinates.length > 0) {
            setMapCenter(L.latLng(region.coordinates[0].lat, region.coordinates[0].lng));
          }
        }}
        enterpriseId={selectedEnterpriseId}
        selectedRegionId={selectedRegion?.id.toString() || ""}
        selectedAreaId={selectedArea?.id || ""}
        onRegionChange={() => {}}
      />
    </AdminLayout>
  );
};

export default CultivationAreaCreatePage;
