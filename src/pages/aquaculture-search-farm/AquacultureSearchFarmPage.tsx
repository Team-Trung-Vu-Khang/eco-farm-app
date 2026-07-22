import {
  AdminLayout,
  Badge,
  Button,
  cn,
  DataTable,
  Dialog,
  DialogContent,
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
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import {
  Award,
  Building2,
  ChevronRight,
  Filter,
  Fish,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
} from "lucide-react";
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
  AQUACULTURE_IDENTIFICATION_REGIONS,
} from "../aquaculture-identification/data/dummy";

type LatLngTuple = [number, number];

type SearchStatus = "healthy" | "monitoring" | "warning";

type FarmRecord = (typeof AQUACULTURE_IDENTIFICATION_REGIONS)[number] & {
  totalScopes: number;
  totalAreas: number;
  totalPlots: number;
  primarySpecies: string;
  status: SearchStatus;
  areaHa: number;
  center: { lat: number; lng: number };
};

type AdvancedFilters = {
  species?: string[];
  status?: SearchStatus[];
  farmingMethods?: string[];
  personnel?: string[];
};

const statusMeta: Record<
  SearchStatus,
  { label: string; className: string; variant: "default" | "secondary" }
> = {
  healthy: {
    label: "Ổn định",
    className: "bg-emerald-500 text-white",
    variant: "default",
  },
  monitoring: {
    label: "Theo dõi",
    className: "bg-amber-100 text-amber-700",
    variant: "secondary",
  },
  warning: {
    label: "Cảnh báo",
    className: "",
    variant: "default",
  },
};

const speciesOptions = [
  { value: "Tôm", label: "Tôm" },
  { value: "Cá", label: "Cá" },
];

const statusOptions = [
  { value: "healthy", label: "Ổn định" },
  { value: "monitoring", label: "Theo dõi" },
  { value: "warning", label: "Cảnh báo" },
];

const getInitial = (name?: string) =>
  name ? name.charAt(0).toUpperCase() : "A";

const buildClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
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

const MapSync = ({ center, zoom }: { center: LatLngTuple; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
};

const FARM_MARKERS: Record<string, { lat: number; lng: number }> = {
  "aq-region-1": { lat: 10.403, lng: 106.804 },
  "aq-region-2": { lat: 10.457, lng: 106.85 },
};

const FARM_RECORDS: FarmRecord[] = AQUACULTURE_IDENTIFICATION_REGIONS.map(
  (region, index) => {
    const scopes = region.scopes || [];
    const totalAreas = scopes.filter(
      (scope) => scope.scopeType === "AREA",
    ).length;
    const totalPlots = scopes.filter(
      (scope) => scope.scopeType === "PLOT",
    ).length;
    const species = index === 0 ? "Tôm" : "Cá";
    const status: SearchStatus = index === 0 ? "healthy" : "monitoring";
    const areaHa = index === 0 ? 115.6 : 87.2;
    return {
      ...region,
      totalScopes: scopes.length,
      totalAreas,
      totalPlots,
      primarySpecies: species,
      status,
      areaHa,
      center: FARM_MARKERS[region.id] || { lat: 10.43, lng: 106.83 },
    };
  },
);

const SearchZoneRecordItem = ({
  record,
  isActive,
  onClick,
}: {
  record: FarmRecord;
  isActive: boolean;
  onClick: () => void;
}) => {
  const manager = record.personnel?.[0]?.fullName || "Chưa phân công";

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
          {record.code}
        </Badge>
        <Badge
          variant={statusMeta[record.status].variant}
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0",
            statusMeta[record.status].className,
          )}
        >
          {statusMeta[record.status].label}
        </Badge>
      </div>

      <h4
        className={cn(
          "font-bold text-sm mb-1 line-clamp-1",
          isActive ? "text-primary" : "text-slate-800",
        )}
      >
        {record.name}
      </h4>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
        <MapPin size={12} className="text-red-500 shrink-0" />
        <span className="truncate">{record.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-50">
            <Building2 size={10} className="text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-20">
            {manager}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <div className="p-1 rounded bg-emerald-50">
            <Fish size={10} className="text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
            {record.totalScopes} phạm vi
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-1.5"
          >
            {record.primarySpecies}
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

const SearchZoneFilterDialog = ({
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
            Chọn vùng nuôi trồng để lọc trang tìm kiếm.
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

const SearchZoneDetailDialog = ({
  open,
  onOpenChange,
  record,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: FarmRecord | null;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-primary" />
            Chi tiết vùng nuôi trồng
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {!record ? (
            <div className="text-center text-slate-400 py-10">
              Chưa chọn vùng nuôi trồng
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Mã vùng
                  </div>
                  <div className="font-mono font-bold text-primary">
                    {record.code}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Loại thủy sản chính
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.primarySpecies}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Người phụ trách
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.personnel[0]?.fullName || "Chưa phân công"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Kỹ thuật nuôi
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.farmingMethod?.name || "Chưa thiết lập"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Diện tích
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.areaHa} ha
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Số phạm vi
                  </div>
                  <div className="font-bold text-slate-700">
                    {record.totalScopes}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Chứng nhận áp dụng
                </div>
                <div className="flex flex-wrap gap-2">
                  {["VietGAP", "ASC", "Organic"].map((cert) => (
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AquacultureSearchFarmPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [activeFarm, setActiveFarm] = useState<FarmRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const farms = useMemo(() => FARM_RECORDS, []);

  const filteredFarms = useMemo(() => {
    return farms.filter((farm) => {
      const selectedSpecies = advancedFilters.species ?? [];
      const selectedStatus = advancedFilters.status ?? [];
      const selectedMethods = advancedFilters.farmingMethods ?? [];
      const selectedPersonnel = advancedFilters.personnel ?? [];

      const matchesSearch =
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.primarySpecies.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.personnel.some((p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesSpecies =
        selectedSpecies.length > 0
          ? selectedSpecies.includes(farm.primarySpecies)
          : true;
      const matchesStatus =
        selectedStatus.length > 0 ? selectedStatus.includes(farm.status) : true;
      const matchesMethod =
        selectedMethods.length > 0
          ? selectedMethods.includes(farm.farmingMethod.name)
          : true;
      const matchesPersonnel =
        selectedPersonnel.length > 0
          ? farm.personnel.some((p) => selectedPersonnel.includes(p.fullName))
          : true;
      const matchesRegion =
        selectedRegionIds.length > 0
          ? selectedRegionIds.includes(farm.id)
          : true;

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesStatus &&
        matchesMethod &&
        matchesPersonnel &&
        matchesRegion
      );
    });
  }, [advancedFilters, farms, searchQuery, selectedRegionIds]);

  const selectedFarm = useMemo(
    () => filteredFarms.find((farm) => farm.id === selectedFarmId) || null,
    [filteredFarms, selectedFarmId],
  );

  useEffect(() => {
    if (!selectedFarmId && filteredFarms.length > 0) {
      setSelectedFarmId(filteredFarms[0].id);
      setActiveFarm(filteredFarms[0]);
    }
  }, [filteredFarms, selectedFarmId]);

  useEffect(() => {
    if (selectedFarm && activeFarm?.id !== selectedFarm.id) {
      setActiveFarm(selectedFarm);
    }
  }, [activeFarm, selectedFarm]);

  const filteredFarmsToShow = filteredFarms;
  const totalCount = filteredFarmsToShow.length;

  const activeFilterCount = Object.keys(advancedFilters).reduce(
    (count, key) => {
      const value = advancedFilters[key as keyof AdvancedFilters];
      if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
      return count + (value !== undefined ? 1 : 0);
    },
    0,
  );

  const handleSearch = () => {
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${totalCount} vùng nuôi trồng phù hợp.`,
    });
  };

  const handleSelectFarm = (farm: FarmRecord) => {
    setSelectedFarmId(farm.id);
    setActiveFarm(farm);
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSelectedRegionIds([]);
    setSearchQuery("");
    setSelectedFarmId(null);
    setActiveFarm(null);
  };

  const farmCount = filteredFarmsToShow.length;
  const mapCenter: LatLngTuple = activeFarm
    ? [activeFarm.center.lat, activeFarm.center.lng]
    : [10.43, 106.83];

  const mapZoom = activeFarm ? 15 : 12;
  const activeFarmUnit = activeFarm
    ? AQUACULTURE_IDENTIFICATION_GEO_UNITS.find(
        (unit) =>
          unit.id === (activeFarm.id === "aq-region-1" ? "aq-r-1" : "aq-r-2"),
      )
    : null;
  const regionPath = buildClosedPath(activeFarmUnit?.coordinates);

  const columns: Column<FarmRecord>[] = [
    {
      key: "code",
      label: "Mã vùng",
      render: (value) => (
        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg text-xs">
          {value as string}
        </span>
      ),
    },
    {
      key: "name",
      label: "Tên vùng nuôi",
      render: (value, item: FarmRecord) => (
        <div>
          <div className="font-black text-slate-800 text-sm leading-tight">
            {value as string}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
            {item.primarySpecies}
          </div>
        </div>
      ),
    },
    {
      key: "farmingMethod",
      label: "Kỹ thuật nuôi",
      render: (_value, item: FarmRecord) => item.farmingMethod?.name || "—",
    },
    {
      key: "areaHa",
      label: "Diện tích",
      render: (value) => `${value} ha`,
    },
    {
      key: "totalScopes",
      label: "Phạm vi",
      render: (value) => `${value} mục`,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Tìm kiếm vùng nuôi trồng"
      description="Tra cứu nhanh vùng nuôi trồng, khu vực quản lý và thông tin mẫu."
    >
      <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
        <div className="bg-white border-b rounded-md p-4 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm vùng nuôi trồng theo tên, mã, kỹ thuật..."
                  className="pl-10 border-slate-200 focus:ring-primary shadow-sm bg-slate-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant={isAdvancedSearchOpen ? "default" : "outline"}
                  onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Bộ lọc nâng cao</span>
                  {activeFilterCount > 0 && (
                    <span className="text-primary bg-white rounded text-xs w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
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
                      {totalCount}
                    </span>{" "}
                    vùng nuôi trồng phù hợp.
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
                          <Select
                            value={advancedFilters.species?.[0] || ""}
                            onValueChange={(value) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                species: [value],
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn loại đối tượng..." />
                            </SelectTrigger>
                            <SelectContent>
                              {speciesOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Select
                            value={advancedFilters.status?.[0] || ""}
                            onValueChange={(value) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                status: [value as SearchStatus],
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn trạng thái..." />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <Award size={14} className="text-emerald-600" />
                        3. Kỹ thuật
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">
                            Kỹ thuật nuôi
                          </Label>
                          <Select
                            value={advancedFilters.farmingMethods?.[0] || ""}
                            onValueChange={(value) =>
                              setAdvancedFilters({
                                ...advancedFilters,
                                farmingMethods: [value],
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn kỹ thuật..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                new Set(
                                  farms.map((farm) => farm.farmingMethod.name),
                                ),
                              ).map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 bg-white min-h-35">
                          <div className="flex flex-wrap gap-2">
                            {["VietGAP", "ASC", "Organic"].map((cert) => (
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
                Vùng nuôi trồng ({farmCount})
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
              {filteredFarmsToShow.map((farm) => (
                <SearchZoneRecordItem
                  key={farm.id}
                  record={farm}
                  isActive={selectedFarmId === farm.id}
                  onClick={() => handleSelectFarm(farm)}
                />
              ))}

              {filteredFarmsToShow.length === 0 && (
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
            {!selectedFarm ? (
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
                            {selectedFarm.name}
                          </h2>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Đang xem: {selectedFarm.primarySpecies}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-black py-1 px-3"
                      >
                        {selectedFarm.totalScopes} phạm vi
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-100 shrink-0">
                      <div
                        className={cn(
                          "lg:col-span-8 rounded-xl overflow-hidden border-4 border-white bg-white shadow-xl relative transition-opacity duration-300",
                          isDetailOpen && "opacity-0",
                        )}
                      >
                        <MapContainer
                          center={mapCenter}
                          zoom={mapZoom}
                          className="h-full w-full"
                          zoomControl={false}
                          scrollWheelZoom
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <MapSync center={mapCenter} zoom={mapZoom} />
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
                          {filteredFarmsToShow.map((farm) => (
                            <CircleMarker
                              key={farm.id}
                              center={[farm.center.lat, farm.center.lng]}
                              radius={9}
                              pathOptions={{
                                color:
                                  farm.status === "healthy"
                                    ? "#16a34a"
                                    : farm.status === "monitoring"
                                      ? "#d97706"
                                      : "#dc2626",
                                fillColor:
                                  farm.status === "healthy"
                                    ? "#16a34a"
                                    : farm.status === "monitoring"
                                      ? "#d97706"
                                      : "#dc2626",
                                fillOpacity: 0.8,
                                weight: 2,
                              }}
                              eventHandlers={{
                                click: () => {
                                  setActiveFarm(farm);
                                  setIsDetailOpen(true);
                                  setSelectedFarmId(farm.id);
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
                        {activeFarm ? (
                          <div className="space-y-4">
                            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-slate-100 flex items-center justify-center">
                              <Fish className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h4 className="font-black text-lg">
                              {activeFarm.name}
                            </h4>
                            <Badge className="bg-primary/10 text-primary uppercase font-black">
                              {activeFarm.code}
                            </Badge>
                            <div className="text-xs text-slate-500 font-bold">
                              Người phụ trách:{" "}
                              <span className="text-slate-800">
                                {activeFarm.personnel[0]?.fullName ||
                                  "Chưa phân công"}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-bold">
                              Kỹ thuật:{" "}
                              <span className="text-slate-800">
                                {activeFarm.farmingMethod?.name ||
                                  "Chưa thiết lập"}
                              </span>
                            </div>
                            <Button
                              className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20 mt-4 gap-2"
                              onClick={() => setIsDetailOpen(true)}
                            >
                              <Maximize2 size={16} />
                              Xem chi tiết
                            </Button>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm">
                            Chọn một vùng nuôi trồng để xem chi tiết
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
                      <div className="p-4 bg-slate-50/50 border-b font-black text-xs uppercase tracking-widest text-slate-500">
                        Danh sách vùng nuôi trồng
                      </div>
                      <div className="flex-1 overflow-hidden p-4">
                        <DataTable
                          columns={columns}
                          data={filteredFarmsToShow}
                          onView={(row) => {
                            setActiveFarm(row);
                            setSelectedFarmId(row.id);
                            setIsDetailOpen(true);
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

        <SearchZoneFilterDialog
          open={isZoneDialogOpen}
          onOpenChange={setIsZoneDialogOpen}
          selectedIds={selectedRegionIds}
          onConfirm={(ids) => setSelectedRegionIds(ids)}
        />

        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden rounded-xl bg-slate-50 border-none shadow-2xl z-1000">
            {selectedFarm && (
              <div className="flex h-full w-full overflow-hidden">
                <div className="flex-1 relative bg-white border-r">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    className="h-full w-full"
                    zoomControl={false}
                    scrollWheelZoom
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapSync center={mapCenter} zoom={mapZoom} />
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
                    {filteredFarmsToShow.map((farm) => (
                      <CircleMarker
                        key={farm.id}
                        center={[farm.center.lat, farm.center.lng]}
                        radius={9}
                        pathOptions={{
                          color:
                            farm.status === "healthy"
                              ? "#16a34a"
                              : farm.status === "monitoring"
                                ? "#d97706"
                                : "#dc2626",
                          fillColor:
                            farm.status === "healthy"
                              ? "#16a34a"
                              : farm.status === "monitoring"
                                ? "#d97706"
                                : "#dc2626",
                          fillOpacity: 0.8,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => {
                            setActiveFarm(farm);
                            setIsDetailOpen(true);
                            setSelectedFarmId(farm.id);
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
                  {activeFarm ? (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center">
                        <Fish className="w-16 h-16 text-emerald-500" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Badge className="bg-primary/10 text-primary uppercase font-black mb-2">
                            {activeFarm.code}
                          </Badge>
                          <h2 className="text-2xl font-black text-slate-800 leading-tight">
                            {activeFarm.name}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Loại thủy sản chính
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeFarm.primarySpecies}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Kỹ thuật nuôi
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeFarm.farmingMethod?.name ||
                                "Chưa thiết lập"}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Người phụ trách
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeFarm.personnel[0]?.fullName ||
                                "Chưa phân công"}
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2 mt-4"
                          onClick={() => setIsDetailOpen(true)}
                        >
                          <Maximize2 size={18} />
                          XEM CHI TIẾT
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center p-12">
                      <MapPin size={48} className="mb-4 opacity-20" />
                      Chọn một vùng nuôi trồng trên bản đồ để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <SearchZoneDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          record={activeFarm}
        />
      </div>
    </AdminLayout>
  );
};

export default AquacultureSearchFarmPage;
