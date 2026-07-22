import {
  AdminLayout,
  Badge,
  Button,
  Combobox,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  cn,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Award,
  Building2,
  ChevronRight,
  Fish,
  Filter,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  AQUACULTURE_IDENTIFICATION_GEO_UNITS,
  AQUACULTURE_IDENTIFICATION_PLANTS,
  AQUACULTURE_IDENTIFICATION_REGIONS,
} from "./data/dummy";

type LatLngTuple = [number, number];

type SearchStatus = "healthy" | "monitoring" | "warning";

type SearchRecord = (typeof AQUACULTURE_IDENTIFICATION_PLANTS)[number] & {
  species: string;
  certifications: string[];
  healthStatus: SearchStatus;
};

type AdvancedFilters = {
  species?: string[];
  status?: SearchStatus[];
  age?: number;
  regionIds?: string[];
  certifications?: string[];
};

type SearchView = "regions" | "records";

const speciesOptions = [
  { value: "Tôm", label: "Tôm" },
  { value: "Cá", label: "Cá" },
];

const statusOptions = [
  { value: "healthy", label: "Ổn định" },
  { value: "monitoring", label: "Theo dõi" },
  { value: "warning", label: "Cảnh báo" },
];

const certificationOptions = ["VietGAP", "GlobalGAP", "ASC", "Organic"];

const makeClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
  if (!coordinates || coordinates.length < 3) return [];
  const path = coordinates.map(
    (coord) => [coord.lat, coord.lng] as LatLngTuple,
  );
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];
  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }
  return path;
};

const MapSync = ({
  center,
  zoom,
}: {
  center: LatLngTuple;
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
};

const AQUACULTURE_SEARCH_RECORDS: SearchRecord[] = [
  {
    ...AQUACULTURE_IDENTIFICATION_PLANTS[0],
    species: "Tôm",
    certifications: ["VietGAP", "ASC"],
    healthStatus: "healthy",
  },
  {
    ...AQUACULTURE_IDENTIFICATION_PLANTS[1],
    species: "Cá",
    certifications: ["GlobalGAP"],
    healthStatus: "monitoring",
  },
  {
    id: "aq-plant-3",
    code: "AQP-003",
    name: "Bể nuôi an toàn Cần Giờ 03",
    type: "Aquaculture",
    status: "healthy",
    species: "Tôm",
    certifications: ["VietGAP", "Organic"],
    healthStatus: "healthy",
    height: "2.1",
    ageValue: "2",
    ageUnit: "years",
    age: "2 năm",
    plantedDate: "2025-01-20",
    coordinate: { lat: 10.4055, lng: 106.8065 },
    plotId: "aq-p-1",
    cultivationRegionId: "aq-region-1",
    regionName: "Khu nuôi tôm Cần Giờ",
    areaName: "Ao ươm số 1",
    note: "Mẫu thủy sản dùng để mô phỏng kết quả tìm kiếm.",
  },
  {
    id: "aq-plant-4",
    code: "AQP-004",
    name: "Lô nuôi Long Sơn 04",
    type: "Aquaculture",
    status: "warning",
    species: "Cá",
    certifications: ["ASC"],
    healthStatus: "warning",
    height: "1.7",
    ageValue: "14",
    ageUnit: "months",
    age: "14 tháng",
    plantedDate: "2025-04-09",
    coordinate: { lat: 10.4595, lng: 106.852 },
    plotId: "aq-a-2",
    cultivationRegionId: "aq-region-2",
    regionName: "Khu nuôi thủy sản Long Sơn",
    areaName: "Ao nuôi số 2",
    note: "Dữ liệu mẫu phục vụ trang tìm kiếm thủy sản.",
  },
];

const SearchCropRegionItem = ({
  region,
  count,
  isActive,
  onClick,
}: {
  region: (typeof AQUACULTURE_IDENTIFICATION_REGIONS)[number];
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "p-4 border-b hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
        isActive
          ? "bg-primary/5 border-l-primary shadow-inner"
          : "border-l-transparent bg-white",
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <Badge
          variant="outline"
          className="text-[9px] font-black text-slate-400 border-slate-200 uppercase px-1"
        >
          {region.code}
        </Badge>
        <Badge
          variant={region.id === "aq-region-1" ? "default" : "secondary"}
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0",
            region.id === "aq-region-1"
              ? "bg-emerald-500 text-white"
              : "bg-amber-100 text-amber-700",
          )}
        >
          {region.id === "aq-region-1" ? "Ổn định" : "Theo dõi"}
        </Badge>
      </div>

      <h4
        className={cn(
          "font-bold text-sm mb-1 line-clamp-1",
          isActive ? "text-primary" : "text-slate-800",
        )}
      >
        {region.name}
      </h4>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
        <MapPin size={12} className="text-red-500 shrink-0" />
        <span className="truncate">
          {region.scopes[0]?.region?.name || region.name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-50">
            <Building2 size={10} className="text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-20">
            {region.personnel[0]?.fullName || "Đơn vị quản lý"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <div className="p-1 rounded bg-emerald-50">
            <Fish size={10} className="text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
            {count} đối tượng
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-1.5"
          >
            {region.id === "aq-region-1" ? "Nuôi tôm" : "Nuôi thủy sản"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary group-hover:translate-x-1 transition-transform">
          <span>Chi tiết</span>
          <ChevronRight size={10} />
        </div>
      </div>
    </div>
  );
};

const RegionSelectorDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [tempIds, setTempIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) setTempIds(selectedIds);
  }, [open, selectedIds]);

  const filtered = AQUACULTURE_IDENTIFICATION_REGIONS.filter(
    (region) =>
      !search ||
      region.name.toLowerCase().includes(search.toLowerCase()) ||
      region.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Chọn vùng nuôi trồng
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn một hoặc nhiều vùng nuôi trồng để lọc kết quả tìm kiếm.
          </p>
        </DialogHeader>

        <div className="px-6 pb-5 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm vùng nuôi trồng..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {filtered.map((region) => {
              const selected = tempIds.includes(region.id);
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() =>
                    setTempIds((prev) =>
                      prev.includes(region.id)
                        ? prev.filter((id) => id !== region.id)
                        : [...prev, region.id],
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                    selected
                      ? "bg-primary/10 border-primary/40"
                      : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-sm">
                        {region.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {region.code}
                      </div>
                    </div>
                  </div>
                  {selected ? (
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-slate-200" />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              onConfirm(tempIds);
              onOpenChange(false);
            }}
          >
            Xác nhận ({tempIds.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RecordDetailDialog = ({
  open,
  onOpenChange,
  record,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: SearchRecord | null;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-primary" />
            Chi tiết đối tượng nuôi
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {!record ? (
            <div className="text-center text-slate-400 py-10">
              Chưa chọn đối tượng nuôi
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Mã định danh
                  </div>
                  <div className="font-mono font-bold text-primary">
                    {record.code}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Loại đối tượng
                  </div>
                  <div className="font-bold text-slate-700">{record.species}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Vùng nuôi trồng
                  </div>
                  <div className="font-bold text-slate-700">{record.regionName}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Khu vực
                  </div>
                  <div className="font-bold text-slate-700">{record.areaName}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Độ tuổi
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.ageValue}{" "}
                    {record.ageUnit === "years"
                      ? "năm"
                      : record.ageUnit === "months"
                        ? "tháng"
                        : "ngày"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Ngày ghi nhận
                  </div>
                  <div className="font-bold text-slate-700">
                    {new Date(record.plantedDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Chứng nhận áp dụng
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.certifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Ghi chú
                </div>
                <div className="text-sm text-slate-600">
                  {record.note || "—"}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchCropPage = () => {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<SearchView>("regions");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<SearchRecord | null>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);

  const records = useMemo<SearchRecord[]>(
    () => AQUACULTURE_SEARCH_RECORDS,
    [],
  );

  const regionCountMap = useMemo(() => {
    return AQUACULTURE_IDENTIFICATION_REGIONS.reduce<Record<string, number>>(
      (acc, region) => {
        acc[region.id] = records.filter(
          (record) => record.cultivationRegionId === region.id,
        ).length;
        return acc;
      },
      {},
    );
  }, [records]);

  const speciesOptionsMemo = useMemo(
    () => speciesOptions,
    [],
  );

  const certificationEnabledCount = Object.keys(
    advancedFilters,
  ).filter((key) => {
    const value = advancedFilters[key as keyof AdvancedFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  }).length;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.regionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.species.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies =
        advancedFilters.species?.length > 0
          ? advancedFilters.species.includes(record.species)
          : true;
      const matchesStatus =
        advancedFilters.status?.length > 0
          ? advancedFilters.status.includes(record.healthStatus)
          : true;
      const matchesAge = advancedFilters.age
        ? Math.abs(Number(record.ageValue || 0) - advancedFilters.age) <= 6
        : true;
      const matchesRegion =
        selectedRegionIds.length > 0
          ? selectedRegionIds.includes(record.cultivationRegionId)
          : true;
      const matchesCertification =
        advancedFilters.certifications?.length > 0
          ? record.certifications.some((cert) =>
              advancedFilters.certifications?.includes(cert),
            )
          : true;

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesStatus &&
        matchesAge &&
        matchesRegion &&
        matchesCertification
      );
    });
  }, [advancedFilters, records, searchQuery, selectedRegionIds]);

  const filteredRegions = useMemo(() => {
    return AQUACULTURE_IDENTIFICATION_REGIONS.filter(
      (region) =>
        regionCountMap[region.id] > 0 &&
        filteredRecords.some(
          (record) => record.cultivationRegionId === region.id,
        ),
    );
  }, [filteredRecords, regionCountMap]);

  const selectedRegion = useMemo(
    () =>
      AQUACULTURE_IDENTIFICATION_REGIONS.find(
        (region) => region.id === selectedRegionId,
      ) || null,
    [selectedRegionId],
  );

  const recordsInRegion = useMemo(
    () =>
      filteredRecords.filter(
        (record) => record.cultivationRegionId === selectedRegionId,
      ),
    [filteredRecords, selectedRegionId],
  );

  useEffect(() => {
    if (!selectedRegionId && filteredRegions.length > 0) {
      setSelectedRegionId(filteredRegions[0].id);
      setActiveRecord(
        filteredRecords.find(
          (record) =>
            record.cultivationRegionId === filteredRegions[0].id,
        ) || null,
      );
    }
  }, [filteredRegions, filteredRecords, selectedRegionId]);

  useEffect(() => {
    if (selectedRegionId) {
      const first = filteredRecords.find(
        (record) => record.cultivationRegionId === selectedRegionId,
      );
      if (!activeRecord || activeRecord.cultivationRegionId !== selectedRegionId) {
        setActiveRecord(first || null);
      }
    }
  }, [activeRecord, filteredRecords, selectedRegionId]);

  const handleSearch = () => {
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${filteredRecords.length} đối tượng nuôi phù hợp với tiêu chí của bạn.`,
    });
  };

  const handleViewRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setCurrentView("records");
    const firstRecord = filteredRecords.find(
      (record) => record.cultivationRegionId === regionId,
    );
    setActiveRecord(firstRecord || null);
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSelectedRegionIds([]);
    setSearchQuery("");
    setCurrentView("regions");
    setSelectedRegionId(null);
    setActiveRecord(null);
  };

  const resetToRegionsView = () => {
    if (currentView !== "regions") {
      setCurrentView("regions");
      setSelectedRegionId(null);
      setActiveRecord(null);
    }
  };

  const mapView = (() => {
    if (activeRecord) {
      return {
        center: [activeRecord.coordinate.lat, activeRecord.coordinate.lng] as LatLngTuple,
        zoom: 17,
      };
    }

    if (!selectedRegion) {
      return {
        center: [10.43, 106.83] as LatLngTuple,
        zoom: 15,
      };
    }

    const firstRecord = recordsInRegion[0];
    if (firstRecord) {
      return {
        center: [firstRecord.coordinate.lat, firstRecord.coordinate.lng] as LatLngTuple,
        zoom: 15,
      };
    }

    const geoUnit = AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
      (unit) =>
        unit.id ===
        (selectedRegion.id === "aq-region-1" ? "aq-r-1" : "aq-r-2"),
    );
    const fallback = geoUnit?.coordinates?.[0] || { lat: 10.43, lng: 106.83 };
    return {
      center: [fallback.lat, fallback.lng] as LatLngTuple,
      zoom: 15,
    };
  })();

  const selectedRegionGeoUnitId =
    selectedRegion?.id === "aq-region-1" ? "aq-r-1" : "aq-r-2";

  const regionPath = makeClosedPath(
    AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
      (unit) => unit.id === selectedRegionGeoUnitId,
    )?.coordinates,
  );

  const areaPath = makeClosedPath(
    AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
      (unit) => unit.id === (selectedRegion?.id === "aq-region-1" ? "aq-a-1" : "aq-a-2"),
    )?.coordinates,
  );

  const plotPath = makeClosedPath(
    AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
      (unit) =>
        unit.id ===
        (selectedRegion?.id === "aq-region-1" ? "aq-p-1" : "aq-a-2"),
    )?.coordinates,
  );

  const mapMarkers = recordsInRegion.length > 0 ? recordsInRegion : filteredRecords;

  const columns = useMemo<Column<SearchRecord>[]>(
    () => [
      {
        key: "code",
        label: "Mã hiệu",
        render: (value: string) => (
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs">
            {value}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên & Loại",
        render: (value: string, item: SearchRecord) => (
          <div>
            <div className="font-black text-slate-800 text-sm leading-tight">
              {value}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              {item.species}
            </div>
          </div>
        ),
      },
      {
        key: "plantedDate",
        label: "Ngày ghi nhận",
        render: (value: string) => (
          <span className="text-xs font-bold text-slate-600">
            {new Date(value).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        key: "coordinate",
        label: "Tọa độ",
        render: (value: SearchRecord["coordinate"]) => (
          <code className="text-[11px] bg-slate-50 px-2 py-1 rounded-md text-slate-500 border border-slate-100">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </code>
        ),
      },
      {
        key: "areaName",
        label: "Khu vực",
        render: (value: string) => (
          <Badge
            variant="outline"
            className="text-[10px] border-slate-200 text-slate-500 font-bold"
          >
            {value}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <AdminLayout
      isDev={true}
      title="Tìm kiếm định danh thủy sản"
      description="Tra cứu vùng nuôi trồng, khu vực và đối tượng nuôi bằng dữ liệu mẫu."
    >
      <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
        <div className="bg-white border-b rounded-md p-4 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên, mã số hoặc vùng nuôi trồng..."
                  className="pl-10 border-slate-200 focus:ring-primary shadow-sm bg-slate-50/50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    resetToRegionsView();
                  }}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant={isAdvancedSearchOpen ? "default" : "outline"}
                  onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Bộ lọc nâng cao</span>
                  {certificationEnabledCount > 0 && (
                    <span className="text-primary bg-white rounded text-xs w-5 h-5 flex items-center justify-center">
                      {certificationEnabledCount}
                    </span>
                  )}
                </Button>
                <Button className="font-bold" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm mt-4">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-green-900 uppercase tracking-wide">
                    Kết quả tìm kiếm
                  </h3>
                  <p className="text-sm text-green-700/80 font-medium">
                    Đã tìm thấy{" "}
                    <span className="text-green-600 font-black px-1.5 py-0.5 bg-white rounded-md border border-green-100 shadow-xs">
                      {filteredRecords.length}
                    </span>{" "}
                    đối tượng nuôi phù hợp với tiêu chí của bạn.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
            </div>

            {isAdvancedSearchOpen && (
              <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-white rounded-xl border border-slate-100 shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                      <Filter size={18} />
                      Bộ lọc nâng cao
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary hover:text-primary/80 text-xs font-bold"
                    >
                      Xóa tất cả
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-slate-100">
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <Fish size={14} />
                        1. Thông tin thủy sản
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Loại đối tượng
                            </Label>
                            {advancedFilters.species?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    species: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={speciesOptionsMemo}
                            value={advancedFilters.species?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                species: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn loại đối tượng..."
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Trạng thái
                            </Label>
                            {advancedFilters.status?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    status: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={statusOptions}
                            value={advancedFilters.status?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                status: [v as SearchStatus],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn trạng thái..."
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">
                            Độ tuổi (tháng)
                          </Label>
                          <Input
                            type="number"
                            placeholder="Nhập tháng"
                            value={advancedFilters.age || ""}
                            onChange={(e) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                age: parseInt(e.target.value) || undefined,
                              });
                              resetToRegionsView();
                            }}
                            className="w-full h-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <MapPin size={14} />
                        2. Vùng nuôi trồng
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 border-dashed bg-slate-50 space-y-4">
                        <div className="space-y-3">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Vùng đã chọn
                          </div>
                          <div className="min-h-15 p-3 rounded-2xl bg-white border border-slate-100 text-xs text-slate-400 flex items-center justify-center text-center">
                            {selectedRegionIds.length
                              ? `Đã chọn ${selectedRegionIds.length} vùng`
                              : "Chưa chọn vùng nào"}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2 h-12 rounded-2xl bg-white border-slate-200 text-primary font-black shadow-sm hover:bg-slate-50"
                          onClick={() => setIsZoneDialogOpen(true)}
                        >
                          <MapPin size={16} />
                          Chọn vùng nuôi trồng
                        </Button>
                        <p className="text-[9px] text-slate-400 italic leading-relaxed text-center px-2">
                          * Nhấn nút để mở hộp thoại chọn dữ liệu mẫu theo vùng nuôi
                          trồng
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <Award size={14} className="text-emerald-600" />
                        3. Chứng nhận
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 bg-white min-h-35">
                        <div className="flex flex-wrap gap-2">
                          {certificationOptions.map((cert) => (
                            <Badge
                              key={cert}
                              variant={
                                advancedFilters.certifications?.includes(cert)
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "cursor-pointer py-2 px-4 rounded-xl text-xs font-bold transition-all",
                                advancedFilters.certifications?.includes(cert)
                                  ? "bg-primary border-primary shadow-md shadow-primary/20"
                                  : "bg-white text-slate-600 border-slate-100",
                              )}
                              onClick={() => {
                                const current =
                                  advancedFilters.certifications || [];
                                const updated = current.includes(cert)
                                  ? current.filter((item) => item !== cert)
                                  : [...current, cert];
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  certifications: updated,
                                });
                                resetToRegionsView();
                              }}
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex relative">
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute left-4 top-4 z-40 w-10 h-10 bg-white shadow-xl border border-slate-100 rounded-xl flex items-center justify-center text-primary hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300"
              title="Mở danh sách vùng nuôi trồng"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          <div
            className={cn(
              "bg-white border-r flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "w-0 opacity-0" : "w-85 lg:w-100",
            )}
          >
            <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between min-w-60">
              <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Vùng nuôi trồng (
                {
                  filteredRegions.length
                }
                )
              </h3>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                title="Thu gọn"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto split-scrollbar min-w-60">
              {filteredRegions.map((region) => (
                <SearchCropRegionItem
                  key={region.id}
                  region={region}
                  count={regionCountMap[region.id] || 0}
                  isActive={selectedRegionId === region.id}
                  onClick={() => handleViewRegion(region.id)}
                />
              ))}

              {filteredRecords.length === 0 && (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">
                    Không tìm thấy vùng phù hợp
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-slate-50 relative p-6 space-y-6">
            {!selectedRegion ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
                  <MapPin size={64} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                  Chọn vùng nuôi trồng để xem chi tiết
                </h3>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border">
                          <Building2 size={24} className="text-slate-300" />
                        </div>
                        <div>
                          <h2 className="font-black text-lg text-slate-800">
                            {selectedRegion.name}
                          </h2>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Đang xem: {activeRecord?.name || "Chưa chọn đối tượng"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-black py-1 px-3">
                        {recordsInRegion.length} đối tượng nuôi
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-100 shrink-0">
                      <div
                        className={cn(
                          "lg:col-span-8 rounded-xl overflow-hidden border-4 border-white bg-white shadow-xl relative transition-opacity duration-300",
                          isRecordDialogOpen && "opacity-0",
                        )}
                      >
                        <MapContainer
                          center={mapView.center}
                          zoom={mapView.zoom}
                          className="h-full w-full"
                          zoomControl={false}
                          scrollWheelZoom
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <MapSync center={mapView.center} zoom={mapView.zoom} />
                          {regionPath.length > 0 ? (
                            <Polygon
                              positions={regionPath}
                              pathOptions={{
                                color: "#3b82f6",
                                weight: 3,
                                fillColor: "#3b82f6",
                                fillOpacity: 0.1,
                              }}
                            />
                          ) : null}
                          {areaPath.length > 0 ? (
                            <Polygon
                              positions={areaPath}
                              pathOptions={{
                                color: "#22c55e",
                                weight: 2,
                                fillColor: "#22c55e",
                                fillOpacity: 0.15,
                              }}
                            />
                          ) : null}
                          {plotPath.length > 0 ? (
                            <Polygon
                              positions={plotPath}
                              pathOptions={{
                                color: "#f97316",
                                weight: 1.5,
                                fillColor: "#f97316",
                                fillOpacity: 0.2,
                              }}
                            />
                          ) : null}

                          {mapMarkers.map((record) => (
                            <CircleMarker
                              key={record.id}
                              center={[record.coordinate.lat, record.coordinate.lng]}
                              radius={8}
                              pathOptions={{
                                color:
                                  record.healthStatus === "healthy"
                                    ? "#16a34a"
                                    : record.healthStatus === "monitoring"
                                      ? "#d97706"
                                      : "#dc2626",
                                fillColor:
                                  record.healthStatus === "healthy"
                                    ? "#16a34a"
                                    : record.healthStatus === "monitoring"
                                      ? "#d97706"
                                      : "#dc2626",
                                fillOpacity: 0.8,
                                weight: 2,
                              }}
                              eventHandlers={{
                                click: () => {
                                  setActiveRecord(record);
                                  setIsRecordDialogOpen(true);
                                },
                              }}
                            />
                          ))}
                        </MapContainer>

                        <div
                          onClick={() => setIsMapExpanded(true)}
                          className="p-3 rounded-xl cursor-pointer absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-colors"
                        >
                          <Maximize2 size={20} />
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-xl border-4 border-white overflow-y-auto split-scrollbar">
                        {activeRecord ? (
                          <div className="space-y-4">
                            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-slate-100 flex items-center justify-center">
                              <Fish className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h4 className="font-black text-lg">{activeRecord.name}</h4>
                            <Badge className="bg-primary/10 text-primary uppercase font-black">
                              {activeRecord.code}
                            </Badge>
                            <div className="text-xs text-slate-500 font-bold">
                              Loại:{" "}
                              <span className="text-slate-800">
                                {activeRecord.species}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-bold">
                              Vị trí:{" "}
                              <span className="text-slate-800">
                                {activeRecord.areaName}
                              </span>
                            </div>
                            <Button
                              className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20 mt-4 gap-2"
                              onClick={() => setIsRecordDialogOpen(true)}
                            >
                              <Maximize2 size={16} />
                              Xem chi tiết
                            </Button>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm">
                            Chọn một đối tượng nuôi để xem chi tiết
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
                      <div className="p-4 bg-slate-50/50 border-b font-black text-xs uppercase tracking-widest text-slate-500">
                        Danh sách đối tượng nuôi
                      </div>
                      <div className="flex-1 overflow-hidden p-4">
                        <DataTable
                          columns={columns}
                          data={recordsInRegion.length > 0 ? recordsInRegion : filteredRecords}
                          onView={(record) => {
                            setActiveRecord(record);
                            setIsRecordDialogOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <RegionSelectorDialog
          open={isZoneDialogOpen}
          onOpenChange={setIsZoneDialogOpen}
          selectedIds={selectedRegionIds}
          onConfirm={(ids) => {
            setSelectedRegionIds(ids);
            resetToRegionsView();
          }}
        />

        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden rounded-xl bg-slate-50 border-none shadow-2xl z-1000">
            {selectedRegion && (
              <div className="flex h-full w-full overflow-hidden">
                <div className="flex-1 relative bg-white border-r">
                  <MapContainer
                    center={mapView.center}
                    zoom={mapView.zoom}
                    className="h-full w-full"
                    zoomControl={false}
                    scrollWheelZoom
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapSync center={mapView.center} zoom={mapView.zoom} />
                    {regionPath.length > 0 ? (
                      <Polygon
                        positions={regionPath}
                        pathOptions={{
                          color: "#3b82f6",
                          weight: 3,
                          fillColor: "#3b82f6",
                          fillOpacity: 0.1,
                        }}
                      />
                    ) : null}
                    {areaPath.length > 0 ? (
                      <Polygon
                        positions={areaPath}
                        pathOptions={{
                          color: "#22c55e",
                          weight: 2,
                          fillColor: "#22c55e",
                          fillOpacity: 0.15,
                        }}
                      />
                    ) : null}
                    {mapMarkers.map((record) => (
                      <CircleMarker
                        key={record.id}
                        center={[record.coordinate.lat, record.coordinate.lng]}
                        radius={8}
                        pathOptions={{
                          color:
                            record.healthStatus === "healthy"
                              ? "#16a34a"
                              : record.healthStatus === "monitoring"
                                ? "#d97706"
                                : "#dc2626",
                          fillColor:
                            record.healthStatus === "healthy"
                              ? "#16a34a"
                              : record.healthStatus === "monitoring"
                                ? "#d97706"
                                : "#dc2626",
                          fillOpacity: 0.8,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => {
                            setActiveRecord(record);
                            setIsRecordDialogOpen(true);
                          },
                        }}
                      />
                    ))}
                  </MapContainer>
                  <div
                    className="p-3 rounded-xl cursor-pointer absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-colors"
                    onClick={() => setIsMapExpanded(false)}
                  >
                    <Minimize2 size={20} />
                  </div>
                </div>

                <div className="w-96 bg-white overflow-y-auto split-scrollbar p-6 space-y-6">
                  {activeRecord ? (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center">
                        <Fish className="w-16 h-16 text-emerald-500" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Badge className="bg-primary/10 text-primary uppercase font-black mb-2">
                            {activeRecord.code}
                          </Badge>
                          <h2 className="text-2xl font-black text-slate-800 leading-tight">
                            {activeRecord.name}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Loại đối tượng
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeRecord.species}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Độ tuổi
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeRecord.ageValue}{" "}
                              {activeRecord.ageUnit === "years"
                                ? "năm"
                                : activeRecord.ageUnit === "months"
                                  ? "tháng"
                                  : "ngày"}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Khu vực
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeRecord.areaName}
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2 mt-4"
                          onClick={() => setIsRecordDialogOpen(true)}
                        >
                          <Maximize2 size={18} />
                          XEM CHI TIẾT ĐỐI TƯỢNG NUÔI
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center p-12">
                      <MapPin size={48} className="mb-4 opacity-20" />
                      Chọn một đối tượng trên bản đồ để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <RecordDetailDialog
          open={isRecordDialogOpen}
          onOpenChange={setIsRecordDialogOpen}
          record={activeRecord}
        />

        <style>{`
          .leaflet-container {
            height: 100%;
            width: 100%;
            font-family: inherit;
            background: #e2e8f0;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default SearchCropPage;
