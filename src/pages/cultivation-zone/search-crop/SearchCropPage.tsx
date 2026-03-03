import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Combobox,
  Input,
  Label,
  cn,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  Award,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  Info,
  Leaf,
  MapPin,
  Maximize2,
  Minimize2,
  Search,
  Sprout,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import useCropDetailStore from "../../../stores/useCropDetailStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useRegionStore from "../../../stores/useRegionStore";
import {
  DISTRICTS,
  PROVINCES,
  type Region,
} from "../../region-chart/constants";
import { type CropDetail } from "../constants";
import { CultivationZoneDialog } from "./components/CultivationZoneDialog";
import useGroupCropStore from "@/stores/useGroupCropStore";

// Fix leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SetMapCenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 17, { duration: 1 });
  }, [lat, lng, map]);
  return null;
};

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
  return (
    <>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      {/* Region Outline (Blue) */}
      {currentRegion?.coordinates && (
        <Polygon
          positions={currentRegion.coordinates.map((coord: any) => [
            coord.lat,
            coord.lng,
          ])}
          pathOptions={{
            color: "#3b82f6",
            weight: 3,
            fillOpacity: 0.1,
          }}
        />
      )}

      {/* Area Outlines (Green) */}
      {currentRegion?.subAreas?.map((area: any) => (
        <Polygon
          key={area.id}
          positions={area.coordinates.map((coord: any) => [
            coord.lat,
            coord.lng,
          ])}
          pathOptions={{
            color: "#22c55e",
            weight: 2,
            fillOpacity: 0.15,
          }}
        />
      ))}

      {/* Plot Outlines (Orange) */}
      {currentRegion?.subAreas?.flatMap((area: any) =>
        area.plots.map((plot: any) => (
          <Polygon
            key={plot.id}
            positions={plot.coordinates.map((coord: any) => [
              coord.lat,
              coord.lng,
            ])}
            pathOptions={{
              color: "#f97316",
              weight: 1.5,
              fillOpacity: 0.2,
            }}
          />
        )),
      )}

      {cropsInThisRegion.map((c) => (
        <Marker
          key={c.id}
          position={[c.coordinate.lat, c.coordinate.lng]}
          icon={activeCropInDialog?.id === c.id ? activeIcon : defaultIcon}
          eventHandlers={{
            click: () => setActiveCropInDialog(c),
          }}
        >
          <Popup className="rounded-2xl" autoPan={false}>
            <div className="p-1 min-w-37.5">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none text-[10px] font-black"
                >
                  {c.code}
                </Badge>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(c.plantedDate).getFullYear()}
                </span>
              </div>
              <h5 className="font-black text-slate-800 leading-tight text-sm mb-1">
                {c.name}
              </h5>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Activity size={10} className="text-primary" />
                <span>{c.growthStage}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {activeCropInDialog && (
        <SetMapCenter
          lat={activeCropInDialog.coordinate.lat}
          lng={activeCropInDialog.coordinate.lng}
        />
      )}
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
    active: { label: "Hoạt động", variant: "default" as const },
    inactive: { label: "Ngưng hoạt động", variant: "destructive" as const },
    "under-construction": {
      label: "Đang xây dựng",
      variant: "secondary" as const,
    },
  };
  // Map Region status to config
  const regionStatus = status === "active" ? "active" : "inactive";
  return (
    <Badge variant={config[regionStatus as keyof typeof config].variant}>
      {config[regionStatus as keyof typeof config].label}
    </Badge>
  );
};

const SearchCropPage = () => {
  const { toast } = useToast();
  const { crops } = useCropDetailStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { groupCrops } = useGroupCropStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCropInDialog, setActiveCropInDialog] =
    useState<CropDetail | null>(null);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const [currentView, setCurrentView] = useState<SearchView>("regions");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCropGroup, setSelectedCropGroup] = useState<{
    name: string;
    variety: string;
  } | null>(null);

  // Get unique varieties
  const uniqueVarieties = Array.from(
    new Set(crops.map((crop) => crop.variety)),
  );

  const cropGroupOptions = groupCrops.map((gc) => ({
    value: gc.name,
    label: gc.name,
  }));

  const varietyOptions = uniqueVarieties.map((v) => ({
    value: v,
    label: v,
  }));

  const seedTypeOptions = [
    { value: "Hạt giống F1", label: "Hạt giống F1" },
    { value: "Cây giống ghép", label: "Cây giống ghép" },
  ];

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
    setCurrentView("crops");
  };

  const handleViewCropGroup = (
    name: string,
    variety: string,
    representative: CropDetail,
  ) => {
    setSelectedCropGroup({ name, variety });
    setActiveCropInDialog(representative);
    setCurrentView("plants");
  };

  const handleGoBack = () => {
    if (currentView === "plants") {
      setCurrentView("crops");
      setSelectedCropGroup(null);
    } else if (currentView === "crops") {
      setCurrentView("regions");
      setSelectedRegionId(null);
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

  const activeFilterCount = Object.keys(advancedFilters).filter(
    (key) => advancedFilters[key as keyof AdvancedFilters] !== undefined,
  ).length;

  return (
    <AdminLayout title="Tìm kiếm cây trồng">
      <div className="p-6 space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cây trồng theo tên, mã số, giống..."
              className="pl-10 rounded-xl border-slate-200 focus:ring-primary h-10"
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
              className="gap-2 rounded-xl"
              onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            >
              <Filter className="h-4 w-4" />
              Tìm kiếm nâng cao
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button className="rounded-xl px-6" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {isAdvancedSearchOpen && (
          <Card className="border-none shadow-md overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Bộ lọc nâng cao
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-primary hover:text-primary/80"
                >
                  Xóa tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Group 1: Crop Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Leaf className="h-5 w-5" />
                    <h4 className="font-semibold">1. Thông tin cây trồng</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Nhóm cây trồng</Label>
                        {advancedFilters.cropNames?.length ? (
                          <span
                            className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                            onClick={() => {
                              const { cropNames, ...rest } = advancedFilters;
                              setAdvancedFilters(rest);
                            }}
                          >
                            Xóa
                          </span>
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
                        placeholder="Chọn nhóm cây trồng..."
                        searchPlaceholder="Tìm nhóm cây trồng..."
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Giống cây</Label>
                        {advancedFilters.varieties?.length ? (
                          <span
                            className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                            onClick={() => {
                              const { varieties, ...rest } = advancedFilters;
                              setAdvancedFilters(rest);
                            }}
                          >
                            Xóa
                          </span>
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
                        placeholder="Chọn giống..."
                        searchPlaceholder="Tìm giống cây..."
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Hạt giống</Label>
                          {advancedFilters.seedTypes?.length ? (
                            <span
                              className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                              onClick={() => {
                                const { seedTypes, ...rest } = advancedFilters;
                                setAdvancedFilters(rest);
                              }}
                            >
                              Xóa
                            </span>
                          ) : null}
                        </div>
                        <Combobox
                          options={seedTypeOptions}
                          value={advancedFilters.seedTypes?.[0] || ""}
                          onChange={(v) => {
                            setAdvancedFilters({
                              ...advancedFilters,
                              seedTypes: [v],
                            });
                            resetToRegionsView();
                          }}
                          placeholder="Chọn loại hạt..."
                          searchPlaceholder="Tìm loại hạt..."
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Độ tuổi (tháng)</Label>
                          {advancedFilters.age !== undefined ? (
                            <span
                              className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                              onClick={() => {
                                const { age, ...rest } = advancedFilters;
                                setAdvancedFilters(rest);
                              }}
                            >
                              Xóa
                            </span>
                          ) : null}
                        </div>
                        <Input
                          type="number"
                          placeholder="Nhập tháng"
                          className="rounded-xl"
                          value={advancedFilters.age || ""}
                          onChange={(e) => {
                            setAdvancedFilters({
                              ...advancedFilters,
                              age: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            });
                            resetToRegionsView();
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Hiện trạng sức khỏe</Label>
                        {advancedFilters.status?.length ? (
                          <span
                            className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                            onClick={() => {
                              const { status, ...rest } = advancedFilters;
                              setAdvancedFilters(rest);
                            }}
                          >
                            Xóa
                          </span>
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
                        placeholder="Tất cả trạng thái..."
                        searchPlaceholder="Tìm trạng thái..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 2: Cultivation Zone */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    <h4 className="font-semibold">2. Vùng canh tác</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100/50">
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex-1 min-w-[200px] space-y-2">
                        <Label className="text-slate-500 font-bold text-xs uppercase ml-1">
                          Vùng đã chọn
                        </Label>
                        <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-white border border-slate-100 rounded-2xl shadow-inner overflow-hidden">
                          {!advancedFilters.regionIds?.length && (
                            <span className="text-muted-foreground text-sm py-1 px-2 italic">
                              Chưa chọn vùng nào
                            </span>
                          )}
                          {advancedFilters.regionIds?.map((rId) => {
                            const region = regions.find((r) => r.id === rId);
                            return (
                              <Badge
                                key={rId}
                                variant="secondary"
                                className="gap-1.5 bg-primary/10 text-primary border-none py-1.5 px-3 font-bold group animate-in slide-in-from-left-2 duration-200"
                              >
                                {region?.name || `Vùng #${rId}`}{" "}
                                <X
                                  size={14}
                                  className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setAdvancedFilters({
                                      ...advancedFilters,
                                      regionIds:
                                        advancedFilters.regionIds?.filter(
                                          (id) => id !== rId,
                                        ),
                                    });
                                  }}
                                />
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2 h-12 px-6 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg shadow-primary/5"
                        onClick={() => setIsZoneDialogOpen(true)}
                      >
                        <MapPin size={18} /> Chọn vùng canh tác
                      </Button>
                    </div>

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
                    <p className="text-[10px] text-slate-400 mt-3 ml-1 italic">
                      * Nhấn nút để mở hộp thoại trực quan và lọc theo Doanh
                      nghiệp, Tỉnh/Thành
                    </p>
                  </div>
                </div>

                {/* Group 3: Certifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Award className="h-5 w-5" />
                    <h4 className="font-semibold">3. Chứng nhận</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-12 p-3 border rounded-xl bg-white shadow-inner">
                    {["VietGAP", "GlobalGAP", "Organic", "Premium Quality"].map(
                      (cert) => (
                        <Badge
                          key={cert}
                          variant={
                            advancedFilters.certifications?.includes(cert)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "cursor-pointer hover:bg-primary/10 transition-colors py-1.5 px-3 rounded-lg",
                            advancedFilters.certifications?.includes(cert)
                              ? "bg-primary border-primary shadow-sm"
                              : "bg-white border-slate-100",
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
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Search Results Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Kết quả tìm kiếm
              </h2>
              <p className="text-sm text-slate-500">
                Tìm thấy{" "}
                <span className="text-primary font-black px-2 py-0.5 bg-primary/10 rounded-lg animate-pulse">
                  {filteredCrops.length}
                </span>{" "}
                cây trồng phù hợp
              </p>
            </div>
          </div>

          {(searchQuery || activeFilterCount > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="rounded-xl border-slate-200 text-slate-500 hover:text-destructive hover:border-destructive transition-all gap-2 h-9"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Breadcrumbs / Back button */}
        {(currentView === "crops" || currentView === "plants") && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-1 duration-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="group gap-1 text-slate-500 hover:text-primary rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Quay lại
            </Button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span
                className={cn(
                  "cursor-pointer hover:text-primary transition-colors",
                  currentView === "crops"
                    ? "text-primary font-bold"
                    : "text-slate-400",
                )}
                onClick={() => {
                  setCurrentView("regions");
                  setSelectedRegionId(null);
                  setSelectedCropGroup(null);
                }}
              >
                Vùng trồng
              </span>
              {selectedRegionId && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <span
                    className={cn(
                      "cursor-pointer hover:text-primary transition-colors",
                      currentView === "plants"
                        ? "text-slate-400"
                        : "text-primary font-bold",
                    )}
                    onClick={() => {
                      if (currentView === "plants") {
                        setCurrentView("crops");
                        setSelectedCropGroup(null);
                      }
                    }}
                  >
                    {regions.find((r) => r.id === selectedRegionId)?.name}
                  </span>
                </>
              )}
              {selectedCropGroup && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <span className="text-primary font-bold">
                    {selectedCropGroup.name} ({selectedCropGroup.variety})
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* View 1: Regions Grid */}
        {currentView === "regions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {regions
              .filter((region) =>
                filteredCrops.some((c) => c.regionId === region.id),
              )
              .map((region) => {
                const matchesSearchInRegion = filteredCrops.filter(
                  (c) => c.regionId === region.id,
                );
                const uniqueCropsCount = new Set(
                  matchesSearchInRegion.map((c) => `${c.name}-${c.variety}`),
                ).size;

                return (
                  <Card
                    key={region.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewRegion(region.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {region.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-50">
                            {region.code}
                          </p>
                        </div>
                        {getRegionStatusBadge(region.status)}
                      </div>
                      {region.enterpriseId && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-blue-600 bg-blue-50 border-blue-200"
                          >
                            {enterprises.find(
                              (e) =>
                                String(e.id) === String(region.enterpriseId),
                            )?.name || "Doanh nghiệp"}
                          </Badge>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-muted-foreground">
                          {PROVINCES.find((p) => p.id === region.provinceId)
                            ?.name || region.provinceId}{" "}
                          -{" "}
                          {DISTRICTS.find((d) => d.id === region.districtId)
                            ?.name || region.districtId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-sm">
                        <Sprout className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground whitespace-nowrap">
                          Cây trồng:
                        </span>
                        <span className="font-medium text-wrap">
                          {Array.from(
                            new Set(
                              filteredCrops
                                .filter((c) => c.regionId === region.id)
                                .map((c) => c.name),
                            ),
                          ).join(", ") || "Chưa có"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-muted-foreground">
                          Nhân viên:
                        </span>
                        <span className="font-medium">
                          {region.subAreas?.length || 0} người
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardList className="h-4 w-4 text-purple-600" />
                        <span className="text-muted-foreground">
                          Giống cây:
                        </span>
                        <span className="font-medium">
                          {uniqueCropsCount} loại
                        </span>
                      </div>

                      <div className="pt-3 border-t flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-muted-foreground">
                            DT: {region.area} ha
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Canh tác: {region.area} ha
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {region.cropVarieties &&
                            region.cropVarieties.length > 0 && (
                              <Award className="h-4 w-4 text-yellow-600" />
                            )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {/* View 2: Grouped Crops within Region */}
        {currentView === "crops" && selectedRegionId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-right-4 duration-400">
            {(() => {
              const cropsInRegion = filteredCrops.filter(
                (c) => c.regionId === selectedRegionId,
              );
              // Group by name and variety
              const groups: Record<string, CropDetail[]> = {};
              cropsInRegion.forEach((c) => {
                const key = `${c.name}|${c.variety}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(c);
              });

              return Object.entries(groups).map(([key, plants]) => {
                const [name, variety] = key.split("|");
                const representative = plants[0];

                return (
                  <Card
                    key={key}
                    className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer bg-white"
                    onClick={() =>
                      handleViewCropGroup(name, variety, representative)
                    }
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={representative.image}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1592150621344-c79230550bd5?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        <Badge className="bg-primary/10 text-primary border-none">
                          {plants.length} cây
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Giống: <span className="text-slate-700">{variety}</span>
                      </p>
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <span>Xem chi tiết danh sách</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        )}

        {/* View 3: Plant Detail (Map + Table) */}
        {currentView === "plants" && selectedRegionId && selectedCropGroup && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bar: Enterprise Info */}
            {(() => {
              const currentRegion = regions.find(
                (r) => r.id === selectedRegionId,
              );
              const owner = enterprises.find((e) => {
                const entId = e.id.toString();
                const regEntId = (currentRegion?.enterpriseId || "").toString();
                return (
                  entId === regEntId ||
                  `ent-${entId}` === regEntId ||
                  (e.id === 5 && regEntId === "farmer-1")
                );
              });
              const cropsInThisRegion = filteredCrops.filter(
                (c) => c.regionId === selectedRegionId,
              );

              return (
                <>
                  <header
                    ref={mapRef}
                    className="px-8 py-6 border rounded-xl flex items-center justify-between bg-white z-10 shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 p-0.5 border shadow-inner flex items-center justify-center overflow-hidden">
                        {owner?.image ? (
                          <img
                            src={owner.image}
                            alt={owner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 size={32} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 transition-colors uppercase font-black text-[10px]">
                            Đơn vị sở hữu
                          </Badge>
                          <Badge className="bg-primary/10 text-primary border-none uppercase font-black text-[10px]">
                            Đang truy xuất: {selectedCropGroup.name}
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">
                          {owner?.brandName || owner?.name || "Đang tải..."}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 italic">
                          <MapPin size={14} />{" "}
                          {currentRegion?.address || "Không xác định"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-right border-r pr-4 hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Vùng canh tác
                        </p>
                        <p className="font-black text-primary">
                          {currentRegion?.name || "..."}
                        </p>
                      </div>
                      <div className="text-right border-r pr-4 hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Loại hạt/giống
                        </p>
                        <p className="font-black text-slate-700">
                          {selectedCropGroup.variety}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGoBack}
                        className="rounded-full hover:bg-slate-100"
                      >
                        <ChevronLeft size={24} />
                      </Button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-100">
                    {/* Map Box */}
                    <div
                      className={cn(
                        "rounded-xl overflow-hidden border bg-slate-100 shadow-inner relative",
                        isMapExpanded && "invisible",
                      )}
                    >
                      {!isMapExpanded && (
                        <>
                          <MapContainer
                            center={
                              activeCropInDialog
                                ? [
                                    activeCropInDialog.coordinate.lat,
                                    activeCropInDialog.coordinate.lng,
                                  ]
                                : cropsInThisRegion.length > 0
                                  ? [
                                      cropsInThisRegion[0].coordinate.lat,
                                      cropsInThisRegion[0].coordinate.lng,
                                    ]
                                  : [11.53, 106.88]
                            }
                            zoom={15}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={true}
                          >
                            <MapContent
                              currentRegion={currentRegion}
                              cropsInThisRegion={cropsInThisRegion}
                              activeCropInDialog={activeCropInDialog}
                              setActiveCropInDialog={setActiveCropInDialog}
                            />
                          </MapContainer>

                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl z-1000 border border-white/20">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Leaf size={14} className="text-primary" />
                              <span>
                                Phân bố {selectedCropGroup.name}:{" "}
                                {cropsInThisRegion.length} điểm
                              </span>
                            </div>
                          </div>

                          <div
                            tabIndex={0}
                            role="button"
                            aria-label="Mở rộng bản đồ"
                            className="absolute w-10 h-10 flex items-center justify-center cursor-pointer top-4 right-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-95 z-1000"
                            onClick={() => setIsMapExpanded(true)}
                          >
                            <Maximize2 size={18} className="text-slate-700" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Active Crop Detail Info */}
                    <div className="flex flex-col gap-4">
                      <Card className="flex-1 bg-linear-to-br from-white to-slate-50 border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-white/50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Info size={16} /> Thông tin chi tiết cây
                            </CardTitle>
                            {activeCropInDialog && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-none font-black"
                              >
                                {activeCropInDialog.code}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {activeCropInDialog ? (
                            <div className="space-y-6">
                              <div className="flex gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0">
                                  <img
                                    src={activeCropInDialog.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl font-black text-slate-800 leading-none mb-2">
                                    {activeCropInDialog.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold">
                                      {activeCropInDialog.variety}
                                    </Badge>
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold">
                                      {activeCropInDialog.seedType}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100/50">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    Ngày trồng
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Calendar
                                      size={14}
                                      className="text-primary"
                                    />
                                    <p className="font-bold text-slate-800">
                                      {new Date(
                                        activeCropInDialog.plantedDate,
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100/50">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    Vị trí Lô/Hàng
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <MapPin
                                      size={14}
                                      className="text-primary"
                                    />
                                    <p className="font-bold text-slate-800">
                                      {activeCropInDialog.plotName} - Hàng{" "}
                                      {activeCropInDialog.rowNumber || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
                              <Leaf size={48} className="mb-4 opacity-20" />
                              <p className="font-bold">
                                Chọn một cây từ danh sách hoặc bản đồ
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Crops List Table */}
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden mt-4">
                    <div className="px-6 py-4 border rounded-lg mb-4 bg-slate-50/50 flex items-center justify-between">
                      <h4 className="font-black text-slate-700 flex items-center gap-2 uppercase text-sm">
                        <Activity size={16} className="text-primary" />
                        Danh sách {selectedCropGroup.name} tại{" "}
                        {currentRegion?.name}
                      </h4>
                      <div className="text-xs font-bold text-slate-500">
                        Đang chọn:{" "}
                        <span className="text-primary font-black">
                          {activeCropInDialog?.code || "..."}
                        </span>
                      </div>
                    </div>

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
                            render: (value: string, item: CropDetail) => (
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
                                {new Date(value).toLocaleDateString("vi-VN")}
                              </span>
                            ),
                          },
                          {
                            key: "coordinate",
                            label: "Tọa độ",
                            render: (value: CropDetail["coordinate"]) => (
                              <code className="text-[11px] bg-slate-50 px-2 py-1 rounded-md text-slate-500 border border-slate-100">
                                {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
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
                      onView={(item) => {
                        setActiveCropInDialog(item);
                        mapRef.current?.scrollIntoView({
                          block: "end",
                          behavior: "smooth",
                        });
                      }}
                      searchPlaceholder="Tìm kiếm cây theo tên, mã..."
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Expanded Map Dialog */}
        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="z-1000 max-w-7xl h-[90vh] p-0 overflow-hidden border-none rounded-xl outline-hidden pointer-events-auto">
            <DialogHeader className="absolute top-4 left-4 z-1000 bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-white/20">
              <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-800">
                <Maximize2 size={24} className="text-primary" />
                Bản đồ chi tiết: {selectedCropGroup?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="w-full h-full relative">
              <div
                tabIndex={0}
                role="button"
                aria-label="Thu nhỏ bản đồ"
                className="absolute w-10 h-10 flex items-center justify-center cursor-pointer top-4 right-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-95 z-1000"
                onClick={() => setIsMapExpanded(false)}
              >
                <Minimize2 size={18} className="text-slate-700" />
              </div>

              {currentView === "plants" && selectedRegionId && (
                <MapContainer
                  center={
                    activeCropInDialog
                      ? [
                          activeCropInDialog.coordinate.lat,
                          activeCropInDialog.coordinate.lng,
                        ]
                      : filteredCrops.filter(
                            (c) => c.regionId === selectedRegionId,
                          ).length > 0
                        ? [
                            filteredCrops.filter(
                              (c) => c.regionId === selectedRegionId,
                            )[0].coordinate.lat,
                            filteredCrops.filter(
                              (c) => c.regionId === selectedRegionId,
                            )[0].coordinate.lng,
                          ]
                        : [11.53, 106.88]
                  }
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
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
                </MapContainer>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {filteredCrops.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-slate-200">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-600">
              Không tìm thấy cây trồng nào
            </h3>
            <p className="text-slate-400">
              Hãy thử thay đổi từ khóa hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SearchCropPage;
