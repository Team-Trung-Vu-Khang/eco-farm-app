import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  Combobox,
  Input,
  Label,
  cn,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Filter,
  Leaf,
  MapPin,
  Maximize2,
  Minimize2,
  Search,
  ChevronRight,
  Building2,
  Award,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";
import useCropDetailStore from "../../../stores/useCropDetailStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useRegionStore from "../../../stores/useRegionStore";
import { PROVINCES, type Region } from "../../region-chart/constants";
import { type CropDetail } from "../constants";
import { CultivationZoneDialog } from "./components/CultivationZoneDialog";
import { CropDetailDialog } from "./components/CropDetailDialog";
import useGroupCropStore from "@/stores/useGroupCropStore";

const MapContent = ({
  currentRegion,
  cropsInThisRegion,
  activeCropInDialog,
  setActiveCropInDialog,
}: {
  currentRegion: Region | undefined;
  cropsInThisRegion: CropDetail[];
  activeCropInDialog: CropDetail | null;
  setActiveCropInDialog: (c: CropDetail) => void;
}) => {
  const toClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
    if (!coordinates || coordinates.length < 3) return [];

    const path = coordinates.map((coord) => ({ lat: coord.lat, lng: coord.lng }));
    const first = path[0];
    const last = path[path.length - 1];
    if (first.lat !== last.lat || first.lng !== last.lng) {
      path.push({ ...first });
    }

    return path;
  };

  const regionPath = toClosedPath(currentRegion?.coordinates);

  return (
    <>
      {/* Region Outline (Blue) */}
      {regionPath.length > 0 && (
        <MFPolygon
          paths={[regionPath]}
          strokeColor="#3b82f6"
          strokeWidth={3}
          fillColor="#3b82f6"
          fillOpacity={0.1}
        />
      )}

      {/* Area Outlines (Green) */}
      {currentRegion?.subAreas?.map((area: any) => {
        const areaPath = toClosedPath(area.coordinates);
        if (!areaPath.length) return null;

        return (
          <MFPolygon
            key={area.id}
            paths={[areaPath]}
            strokeColor="#22c55e"
            strokeWidth={2}
            fillColor="#22c55e"
            fillOpacity={0.15}
          />
        );
      })}

      {/* Plot Outlines (Orange) */}
      {currentRegion?.subAreas?.flatMap((area: any) =>
        area.plots.map((plot: any) => {
          const plotPath = toClosedPath(plot.coordinates);
          if (!plotPath.length) return null;

          return (
            <MFPolygon
              key={plot.id}
              paths={[plotPath]}
              strokeColor="#f97316"
              strokeWidth={1.5}
              fillColor="#f97316"
              fillOpacity={0.2}
            />
          );
        }),
      )}

      {cropsInThisRegion.map((c) => (
        <MFMarker
          key={c.id}
          position={{ lat: c.coordinate.lat, lng: c.coordinate.lng }}
          title={c.name}
          label={activeCropInDialog?.id === c.id ? "●" : ""}
          clickable
          onClick={() => setActiveCropInDialog(c)}
        />
      ))}
    </>
  );
};

interface AdvancedFilters {
  // Group 1: Crop Info
  cropNames?: string[];
  varieties?: string[];
  seedTypes?: string[];
  age?: number;
  status?: string[];

  // Group 2: Cultivation Zone
  regionIds?: number[];

  // Group 3: Certifications
  certifications?: string[];
}

// Hierarchical View State
type SearchView = "regions" | "crops" | "plants";

const getRegionStatusBadge = (status: string) => {
  const config = {
    active: {
      label: "Hoạt động",
      variant: "default" as const,
      className: "bg-emerald-500 text-white",
    },
    inactive: {
      label: "Ngưng",
      variant: "destructive" as const,
      className: "",
    },
    "under-construction": {
      label: "Đang xây dựng",
      variant: "secondary" as const,
      className: "bg-amber-100 text-amber-700",
    },
  };
  const regionStatus =
    status === "active"
      ? "active"
      : status === "under-construction"
        ? "under-construction"
        : "inactive";
  const item = config[regionStatus as keyof typeof config];
  return (
    <Badge
      variant={item.variant}
      className={cn(
        "text-[10px] uppercase font-bold px-1.5 py-0",
        item.className,
      )}
    >
      {item.label}
    </Badge>
  );
};

const RegionListItem = ({
  region,
  enterprises,
  filteredCrops,
  isActive,
  onClick,
}: {
  region: Region;
  enterprises: any[];
  filteredCrops: CropDetail[];
  isActive: boolean;
  onClick: () => void;
}) => {
  const matchesSearchInRegion = filteredCrops.filter(
    (c) => c.regionId === region.id,
  );

  const enterprise = enterprises.find(
    (e) => String(e.id) === String(region.enterpriseId),
  );

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
        {getRegionStatusBadge(region.status)}
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
          {PROVINCES.find((p) => p.id === region.provinceId)?.name ||
            region.provinceId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-50">
            <Building2 size={10} className="text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-20">
            {enterprise?.name || "Đơn vị sở hữu"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <div className="p-1 rounded bg-emerald-50">
            <Leaf size={10} className="text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
            {matchesSearchInRegion.length} cây
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-1.5"
          >
            {region.area} ha
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

const SearchCropPage = () => {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const { crops } = useCropDetailStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { groupCrops } = useGroupCropStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCropInDialog, setActiveCropInDialog] =
    useState<CropDetail | null>(null);
  const [isCropDetailOpen, setIsCropDetailOpen] = useState(false);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentView, setCurrentView] = useState<SearchView>("regions");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCropGroup, setSelectedCropGroup] = useState<{
    name: string;
    variety: string;
  } | null>(null);

  const cropGroupOptions = groupCrops.map((gc) => ({
    value: gc.name,
    label: gc.name,
  }));

  const varietyOptions = Array.from(new Set(crops.map((c) => c.variety))).map(
    (v) => ({
      value: v,
      label: v,
    }),
  );

  const statusOptions = [
    { value: "healthy", label: "Khỏe mạnh" },
    { value: "diseased", label: "Bệnh" },
    { value: "harvesting", label: "Thu hoạch" },
  ];

  const filteredCrops = crops.filter((crop) => {
    // Basic search
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase());

    // Advanced filters - Group 1
    const matchesStatus =
      advancedFilters.status && advancedFilters.status.length > 0
        ? advancedFilters.status.includes(crop.status)
        : true;

    const matchesCropName =
      advancedFilters.cropNames && advancedFilters.cropNames.length > 0
        ? advancedFilters.cropNames.includes(crop.groupCropName)
        : true;

    const matchesVariety =
      advancedFilters.varieties && advancedFilters.varieties.length > 0
        ? advancedFilters.varieties.includes(crop.variety)
        : true;

    const matchesSeedType =
      advancedFilters.seedTypes && advancedFilters.seedTypes.length > 0
        ? advancedFilters.seedTypes.includes(crop.seedType)
        : true;

    const matchesAge = advancedFilters.age
      ? Math.abs(crop.actualAge - advancedFilters.age) <= 6 // Within 6 months
      : true;

    // Advanced filters - Group 2 (Cultivation Zone)
    const matchesRegion =
      advancedFilters.regionIds && advancedFilters.regionIds.length > 0
        ? advancedFilters.regionIds.includes(crop.regionId)
        : true;

    // Advanced filters - Group 3 (Certifications)
    const matchesCertification =
      advancedFilters.certifications &&
      advancedFilters.certifications.length > 0
        ? crop.certifications.some((c) =>
            advancedFilters.certifications?.includes(c.name),
          )
        : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCropName &&
      matchesVariety &&
      matchesSeedType &&
      matchesAge &&
      matchesRegion &&
      matchesCertification
    );
  });

  const handleSearch = () => {
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${filteredCrops.length} cây trồng phù hợp với tiêu chí của bạn.`,
    });
  };

  const handleViewRegion = (regionId: number) => {
    setSelectedRegionId(regionId);
    setCurrentView("plants");

    // Auto-select first plant in this region
    const plantsInRegion = filteredCrops.filter((c) => c.regionId === regionId);
    if (plantsInRegion.length > 0) {
      const firstPlant = plantsInRegion[0];
      setActiveCropInDialog(firstPlant);
      setSelectedCropGroup({
        name: firstPlant.name,
        variety: firstPlant.variety,
      });
    }
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery("");
    setCurrentView("regions");
    setSelectedRegionId(null);
    setSelectedCropGroup(null);
  };

  const resetToRegionsView = () => {
    if (currentView !== "regions") {
      setCurrentView("regions");
      setSelectedRegionId(null);
      setSelectedCropGroup(null);
    }
  };

  const activeFilterCount = Object.keys(advancedFilters).filter((key) => {
    const value = advancedFilters[key as keyof AdvancedFilters];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "number") {
      return value > 0;
    }
    return value !== undefined && value !== null;
  }).length;

  const mapView = (() => {
    if (activeCropInDialog) {
      return {
        center: {
          lat: activeCropInDialog.coordinate.lat,
          lng: activeCropInDialog.coordinate.lng,
        },
        zoom: 17,
      };
    }

    if (!selectedRegionId) {
      return {
        center: { lat: 11.53, lng: 106.88 },
        zoom: 15,
      };
    }

    const firstCrop = filteredCrops.find(
      (c) => c.regionId === selectedRegionId,
    );
    if (!firstCrop) {
      return {
        center: { lat: 11.53, lng: 106.88 },
        zoom: 15,
      };
    }

    return {
      center: { lat: firstCrop.coordinate.lat, lng: firstCrop.coordinate.lng },
      zoom: 15,
    };
  })();

  return (
    <AdminLayout title="Tìm kiếm & Truy xuất nguồn gốc">
      <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
        {/* TOP HEADER: Search & Advanced Search */}
        <div className="bg-white border-b rounded-md p-4 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên cây, mã số, hoặc giống cần tìm..."
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

            {/* Premium Search Results Banner */}
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
                      {filteredCrops.length}
                    </span>{" "}
                    cây trồng phù hợp với tiêu chí của bạn.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
            </div>

            {/* Advanced Filter Panel (Collapsible) */}
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
                    {/* Column 1: Crop Information */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <Leaf size={14} />
                        1. Thông tin cây trồng
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Nhóm cây trồng
                            </Label>
                            {advancedFilters.cropNames?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    cropNames: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={cropGroupOptions}
                            value={advancedFilters.cropNames?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                cropNames: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn nhóm cây..."
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Giống cây
                            </Label>
                            {advancedFilters.varieties?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    varieties: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={varietyOptions}
                            value={advancedFilters.varieties?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                varieties: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn giống cây..."
                            className="w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-bold text-slate-600">
                                Hạt giống
                              </Label>
                              {advancedFilters.seedTypes?.length ? (
                                <button
                                  onClick={() =>
                                    setAdvancedFilters({
                                      ...advancedFilters,
                                      seedTypes: [],
                                    })
                                  }
                                  className="text-[10px] text-primary font-bold hover:underline"
                                >
                                  Xóa
                                </button>
                              ) : null}
                            </div>
                            <Combobox
                              options={[
                                { value: "F1", label: "Hạt giống F1" },
                                {
                                  value: "local",
                                  label: "Hạt giống địa phương",
                                },
                              ]}
                              value={advancedFilters.seedTypes?.[0] || ""}
                              onChange={(v) => {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  seedTypes: [v],
                                });
                                resetToRegionsView();
                              }}
                              placeholder="Hạt giống..."
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

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Hiện trạng sức khỏe
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
                                status: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn trạng thái..."
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Cultivation Zone */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <MapPin size={14} />
                        2. Vùng canh tác
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 border-dashed bg-slate-50 space-y-4">
                        <div className="space-y-3">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Vùng đã chọn
                          </div>
                          <div className="min-h-15 p-3 rounded-2xl bg-white border border-slate-100 text-xs text-slate-400 flex items-center justify-center text-center">
                            {advancedFilters.regionIds?.length
                              ? `Đã chọn ${advancedFilters.regionIds.length} vùng`
                              : "Chưa chọn vùng nào"}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2 h-12 rounded-2xl bg-white border-slate-200 text-primary font-black shadow-sm hover:bg-slate-50"
                          onClick={() => setIsZoneDialogOpen(true)}
                        >
                          <MapPin size={16} />
                          Chọn vùng canh tác
                        </Button>
                        <p className="text-[9px] text-slate-400 italic leading-relaxed text-center px-2">
                          * Nhấn nút để mở hộp thoại trực quan và lọc theo Doanh
                          nghiệp, Tỉnh/Thành
                        </p>
                      </div>
                    </div>

                    {/* Column 3: Certifications */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[11px] mb-4">
                        <Award size={14} className="text-emerald-600" />
                        3. Chứng nhận
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 bg-white min-h-35">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "VietGAP",
                            "GlobalGAP",
                            "Organic",
                            "Premium Quality",
                          ].map((cert) => (
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
                                  ? current.filter((c) => c !== cert)
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

        {/* MAIN BODY: Sidebar | Content */}
        <div className="flex-1 flex relative">
          {/* Sidebar Toggle Button (Visible when collapsed) */}
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute left-4 top-4 z-40 w-10 h-10 bg-white shadow-xl border border-slate-100 rounded-xl flex items-center justify-center text-primary hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300"
              title="Mở danh sách vùng trồng"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          {/* LEFT SIDEBAR: Region List */}
          <div
            className={cn(
              "bg-white border-r flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "w-0 opacity-0" : "w-85 lg:w-100",
            )}
          >
            <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between min-w-60">
              <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Vùng trồng (
                {
                  regions.filter((r) =>
                    filteredCrops.some((c) => c.regionId === r.id),
                  ).length
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
              {regions
                .filter((region) =>
                  filteredCrops.some((c) => c.regionId === region.id),
                )
                .map((region) => (
                  <RegionListItem
                    key={region.id}
                    region={region}
                    enterprises={enterprises}
                    filteredCrops={filteredCrops}
                    isActive={selectedRegionId === region.id}
                    onClick={() => handleViewRegion(region.id)}
                  />
                ))}

              {filteredCrops.length === 0 && (
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

          {/* RIGHT CONTENT: Map & Plant List */}
          <div className="flex-1 flex flex-col bg-slate-50 relative p-6 space-y-6">
            {!selectedRegionId ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
                  <MapPin size={64} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                  Chọn vùng trồng để xem chi tiết
                </h3>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {(() => {
                  const currentRegion = regions.find(
                    (r) => r.id === selectedRegionId,
                  );
                  const cropsInThisRegion = filteredCrops.filter(
                    (c) => c.regionId === selectedRegionId,
                  );

                  return (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {(() => {
                          return (
                            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                              {/* Enterprise Header inside Plants View */}
                              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border">
                                    <Building2
                                      size={24}
                                      className="text-slate-300"
                                    />
                                  </div>
                                  <div>
                                    <h2 className="font-black text-lg text-slate-800">
                                      {enterprises.find(
                                        (e) =>
                                          String(e.id) ===
                                          String(currentRegion?.enterpriseId),
                                      )?.name || "Đơn vị sở hữu"}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                      Đang xem: {selectedCropGroup?.name} (
                                      {selectedCropGroup?.variety})
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="font-black py-1 px-3"
                                >
                                  {cropsInThisRegion.length} cây trồng
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-100 shrink-0">
                                <div
                                  className={cn(
                                    "lg:col-span-8 rounded-xl overflow-hidden border-4 border-white bg-white shadow-xl relative transition-opacity duration-300",
                                    isCropDetailOpen && "opacity-0",
                                  )}
                                >
                                  <MFMap
                                    center={mapView.center}
                                    zoom={mapView.zoom}
                                    accessKey={MAP4D_ACCESS_KEY}
                                    options={{
                                      mapType: "raster",
                                      controlOptions: {},
                                    }}
                                    version="2.5"
                                  >
                                    <MapContent
                                      currentRegion={currentRegion}
                                      cropsInThisRegion={cropsInThisRegion}
                                      activeCropInDialog={activeCropInDialog}
                                      setActiveCropInDialog={
                                        setActiveCropInDialog
                                      }
                                    />
                                  </MFMap>
                                  <div
                                    onClick={() => setIsMapExpanded(true)}
                                    className="p-3 rounded-xl cursor-pointer absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-colors"
                                  >
                                    <Maximize2 size={20} />
                                  </div>
                                </div>
                                <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-xl border-4 border-white overflow-y-auto split-scrollbar">
                                  {activeCropInDialog ? (
                                    <div className="space-y-4">
                                      <img
                                        src={activeCropInDialog.image}
                                        className="w-full h-32 object-cover rounded-2xl mb-4"
                                      />
                                      <h4 className="font-black text-lg">
                                        {activeCropInDialog.name}
                                      </h4>
                                      <Badge className="bg-primary/10 text-primary uppercase font-black">
                                        {activeCropInDialog.code}
                                      </Badge>
                                      <div className="text-xs text-slate-500 font-bold">
                                        Giai đoạn:{" "}
                                        <span className="text-slate-800">
                                          {activeCropInDialog.growthStage}
                                        </span>
                                      </div>
                                      <div className="text-xs text-slate-500 font-bold">
                                        Vị trí:{" "}
                                        <span className="text-slate-800">
                                          {activeCropInDialog.plotName}
                                        </span>
                                      </div>
                                      <Button
                                        className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20 mt-4 gap-2"
                                        onClick={() =>
                                          setIsCropDetailOpen(true)
                                        }
                                      >
                                        <Maximize2 size={16} />
                                        Xem chi tiết
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm">
                                      Chọn một cây để xem chi tiết
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
                                <div className="p-4 bg-slate-50/50 border-b font-black text-xs uppercase tracking-widest text-slate-500">
                                  Danh sách cây trồng
                                </div>
                                <div className="flex-1 overflow-hidden p-4">
                                  <DataTable
                                    columns={
                                      [
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
                                          label: "Tên & Giống",
                                          render: (
                                            value: string,
                                            item: CropDetail,
                                          ) => (
                                            <div>
                                              <div className="font-black text-slate-800 text-sm leading-tight">
                                                {value}
                                              </div>
                                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                {item.variety}
                                              </div>
                                            </div>
                                          ),
                                        },
                                        {
                                          key: "plantedDate",
                                          label: "Ngày trồng",
                                          render: (value: string) => (
                                            <span className="text-xs font-bold text-slate-600">
                                              {new Date(
                                                value,
                                              ).toLocaleDateString("vi-VN")}
                                            </span>
                                          ),
                                        },
                                        {
                                          key: "coordinate",
                                          label: "Tọa độ",
                                          render: (
                                            value: CropDetail["coordinate"],
                                          ) => (
                                            <code className="text-[11px] bg-slate-50 px-2 py-1 rounded-md text-slate-500 border border-slate-100">
                                              {value.lat.toFixed(6)},{" "}
                                              {value.lng.toFixed(6)}
                                            </code>
                                          ),
                                        },
                                        {
                                          key: "plotName",
                                          label: "Lô",
                                          render: (value: string) => (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] border-slate-200 text-slate-500 font-bold"
                                            >
                                              {value}
                                            </Badge>
                                          ),
                                        },
                                      ] as Column<CropDetail>[]
                                    }
                                    data={cropsInThisRegion}
                                    onView={setActiveCropInDialog}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Global Dialogs */}
        <CultivationZoneDialog
          open={isZoneDialogOpen}
          onOpenChange={setIsZoneDialogOpen}
          initialSelections={regions.filter((r) =>
            advancedFilters.regionIds?.includes(r.id),
          )}
          onConfirm={(selections) => {
            setAdvancedFilters({
              ...advancedFilters,
              regionIds: selections.map((s) => s.id),
            });
            resetToRegionsView();
          }}
        />

        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden rounded-xl bg-slate-50 border-none shadow-2xl z-1000">
            {selectedRegionId && (
              <div className="flex h-full w-full overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 relative bg-white border-r">
                  <MFMap
                    center={mapView.center}
                    zoom={mapView.zoom}
                    accessKey={MAP4D_ACCESS_KEY}
                    options={{ mapType: "raster", controlOptions: {} }}
                    version="2.5"
                  >
                    <MapContent
                      currentRegion={regions.find(
                        (r) => r.id === selectedRegionId,
                      )}
                      cropsInThisRegion={filteredCrops.filter(
                        (c) => c.regionId === selectedRegionId,
                      )}
                      activeCropInDialog={activeCropInDialog}
                      setActiveCropInDialog={setActiveCropInDialog}
                    />
                  </MFMap>
                  <div
                    className="p-3 rounded-xl cursor-pointer absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-colors"
                    onClick={() => setIsMapExpanded(false)}
                  >
                    <Minimize2 size={20} />
                  </div>
                </div>

                {/* Info Panel Section */}
                <div className="w-96 bg-white overflow-y-auto split-scrollbar p-6 space-y-6">
                  {activeCropInDialog ? (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md">
                        <img
                          src={activeCropInDialog.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Badge className="bg-primary/10 text-primary uppercase font-black mb-2">
                            {activeCropInDialog.code}
                          </Badge>
                          <h2 className="text-2xl font-black text-slate-800 leading-tight">
                            {activeCropInDialog.name}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Giống cây
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeCropInDialog.variety}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Giai đoạn sinh trưởng
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeCropInDialog.growthStage}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-black underline uppercase text-slate-400 mb-1">
                              Vị trí (Lô/Khu)
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {activeCropInDialog.plotName}
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2 mt-4"
                          onClick={() => setIsCropDetailOpen(true)}
                        >
                          <Maximize2 size={18} />
                          XEM CHI TIẾT CÂY TRỒNG
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center p-12">
                      <MapPin size={48} className="mb-4 opacity-20" />
                      Chọn một cây trên bản đồ để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <CropDetailDialog
          open={isCropDetailOpen}
          onOpenChange={setIsCropDetailOpen}
          crop={activeCropInDialog}
        />
      </div>
    </AdminLayout>
  );
};

export default SearchCropPage;
