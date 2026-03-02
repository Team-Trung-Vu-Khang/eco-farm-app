import { useState, useEffect } from "react";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  useToast,
  ScrollArea,
} from "@tankhang1/eco-shared-ui";
import {
  Search,
  MapPin,
  Leaf,
  Activity,
  Award,
  Image as ImageIcon,
  ChevronRight,
  Filter,
  X,
  Building2,
  Calendar,
  Layers,
  Info,
  ExternalLink,
} from "lucide-react";
import { type CropDetail } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import { CultivationZoneDialog } from "./components/CultivationZoneDialog";
import useCropDetailStore from "../../../stores/useCropDetailStore";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const SearchCropPage = () => {
  const { toast } = useToast();
  const { crops } = useCropDetailStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  const [activeRegionId, setActiveRegionId] = useState<number | null>(null);
  const [activeCropInDialog, setActiveCropInDialog] =
    useState<CropDetail | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);

  // Get unique varieties
  const uniqueVarieties = Array.from(
    new Set(crops.map((crop) => crop.variety)),
  );

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
        ? advancedFilters.cropNames.includes(crop.name)
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

  const handleViewDetail = (crop: CropDetail) => {
    setSelectedCrop(crop);
    setActiveRegionId(crop.regionId);
    setActiveCropInDialog(crop);
    setIsDetailOpen(true);
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery("");
  };

  const activeFilterCount = Object.keys(advancedFilters).filter(
    (key) => advancedFilters[key as keyof AdvancedFilters] !== undefined,
  ).length;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      healthy: { label: "Khỏe mạnh", variant: "default" as const },
      diseased: { label: "Bệnh", variant: "destructive" as const },
      harvesting: { label: "Thu hoạch", variant: "secondary" as const },
      removed: { label: "Đã loại bỏ", variant: "outline" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                      <Label>Dòng cây trồng</Label>
                      <Select
                        onValueChange={(v) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            cropNames: [v],
                          })
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Chọn loại cây" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Durian">Sầu riêng</SelectItem>
                          <SelectItem value="Coffee">Cà phê</SelectItem>
                          <SelectItem value="Avocado">Bơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Giống cây</Label>
                      <Select
                        onValueChange={(v) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            varieties: [v],
                          })
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Chọn giống" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueVarieties.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hạt giống</Label>
                        <Select
                          onValueChange={(v) =>
                            setAdvancedFilters({
                              ...advancedFilters,
                              seedTypes: [v],
                            })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Loại hạt" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hạt giống F1">
                              Hạt giống F1
                            </SelectItem>
                            <SelectItem value="Cây giống ghép">
                              Cây giống ghép
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Độ tuổi (tháng)</Label>
                        <Input
                          type="number"
                          placeholder="Nhập tháng"
                          className="rounded-xl"
                          onChange={(e) =>
                            setAdvancedFilters({
                              ...advancedFilters,
                              age: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Hiện trạng sức khỏe</Label>
                      <Select
                        onValueChange={(v) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            status: [v],
                          })
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                          <SelectItem value="diseased">Bệnh</SelectItem>
                          <SelectItem value="harvesting">Thu hoạch</SelectItem>
                        </SelectContent>
                      </Select>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <Card
              key={crop.id}
              className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer"
              onClick={() => handleViewDetail(crop)}
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1592150621344-c79230550bd5?q=80&w=400&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(crop.status)}
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-none backdrop-blur-sm"
                  >
                    {crop.code}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {crop.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  Giống:{" "}
                  <span className="text-slate-700 font-medium">
                    {crop.variety}
                  </span>
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <MapPin className="h-3 w-3" />
                    {crop.regionName}
                  </div>
                  <div className="text-primary font-bold text-xs flex items-center gap-1">
                    Chi tiết <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-slate-200">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-600">
              Không tìm thấy cây trồng nào
            </h3>
            <p className="text-slate-400">
              Hãy thử thay đổi từ khóa hoặc bộ lọc
            </p>
          </div>
        )}

        {/* Crop Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-[95vw] w-[1400px] p-0 overflow-hidden rounded-4xl h-[90vh] border-none shadow-2xl flex flex-col">
            {selectedCrop && (
              <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Regions planting this crop */}
                <aside className="w-[320px] bg-slate-50 border-r flex flex-col pt-6">
                  <div className="px-6 mb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Điểm canh tác
                    </h3>
                    <p className="text-xs text-slate-500 font-medium italic">
                      Các vùng đang trồng {selectedCrop.name}
                    </p>
                  </div>

                  <ScrollArea className="flex-1 px-3">
                    <div className="space-y-2 pb-6">
                      {regions
                        .filter((r) =>
                          crops.some(
                            (c) =>
                              c.regionId === r.id &&
                              c.name === selectedCrop.name,
                          ),
                        )
                        .map((region) => {
                          const isActive = activeRegionId === region.id;
                          const countInRegion = crops.filter(
                            (c) =>
                              c.regionId === region.id &&
                              c.name === selectedCrop.name,
                          ).length;

                          return (
                            <div
                              key={region.id}
                              onClick={() => {
                                setActiveRegionId(region.id);
                                const firstCropInRegion = crops.find(
                                  (c) =>
                                    c.regionId === region.id &&
                                    c.name === selectedCrop.name,
                                );
                                setActiveCropInDialog(
                                  firstCropInRegion || null,
                                );
                              }}
                              className={cn(
                                "p-4 mx-2 rounded-2xl cursor-pointer transition-all duration-300 group",
                                isActive
                                  ? "bg-white shadow-md ring-1 ring-primary/20 scale-[1.02]"
                                  : "hover:bg-white/60 text-slate-600 hover:text-slate-900",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                    isActive
                                      ? "bg-primary text-white"
                                      : "bg-slate-200 group-hover:bg-primary/10 group-hover:text-primary",
                                  )}
                                >
                                  <MapPin size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-bold text-primary mb-0.5">
                                      {region.code}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 h-4 border-slate-200 text-slate-400 font-black"
                                    >
                                      {countInRegion} cây
                                    </Badge>
                                  </div>
                                  <h4 className="font-bold text-sm leading-tight truncate">
                                    {region.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                    <div className="flex items-center gap-1 text-[10px] font-bold">
                                      <Building2 size={10} />
                                      {enterprises.find(
                                        (e) =>
                                          e.id.toString() ===
                                          region.enterpriseId.toString(),
                                      )?.name || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </aside>

                {/* Right Content: Dashboard for selected crop */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
                  {/* Top Bar: Enterprise Info */}
                  {(() => {
                    const currentRegion = regions.find(
                      (r) => r.id === activeRegionId,
                    );
                    const owner = enterprises.find((e) => {
                      const entId = e.id.toString();
                      const regEntId = (
                        currentRegion?.enterpriseId || ""
                      ).toString();
                      return (
                        entId === regEntId ||
                        `ent-${entId}` === regEntId ||
                        (e.id === 5 && regEntId === "farmer-1")
                      );
                    });
                    const cropsInThisRegion = crops.filter(
                      (c) =>
                        c.regionId === activeRegionId &&
                        c.name === selectedCrop.name,
                    );

                    return (
                      <>
                        <header className="px-8 py-6 border-b flex items-center justify-between bg-white z-10 shadow-sm">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 p-0.5 border shadow-inner flex items-center justify-center overflow-hidden">
                              {owner?.image ? (
                                <img
                                  src={owner.image}
                                  alt={owner.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2
                                  size={32}
                                  className="text-slate-300"
                                />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 transition-colors uppercase font-black text-[10px]">
                                  Đơn vị sở hữu
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-none uppercase font-black text-[10px]">
                                  Đang truy xuất: {selectedCrop.name}
                                </Badge>
                              </div>
                              <h2 className="text-2xl font-black text-slate-800">
                                {owner?.brandName ||
                                  owner?.name ||
                                  "Đang tải..."}
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
                                {selectedCrop.variety}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsDetailOpen(false)}
                              className="rounded-full hover:bg-slate-100"
                            >
                              <X size={24} />
                            </Button>
                          </div>
                        </header>

                        <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                            {/* Map Box */}
                            <div className="rounded-4xl overflow-hidden border bg-slate-100 shadow-inner relative group">
                              <MapContainer
                                center={
                                  activeCropInDialog
                                    ? [
                                        activeCropInDialog.coordinate.lat,
                                        activeCropInDialog.coordinate.lng,
                                      ]
                                    : [11.53, 106.88]
                                }
                                zoom={15}
                                style={{ height: "100%", width: "100%" }}
                                scrollWheelZoom={true}
                              >
                                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                                {cropsInThisRegion.map((c) => (
                                  <Marker
                                    key={c.id}
                                    position={[
                                      c.coordinate.lat,
                                      c.coordinate.lng,
                                    ]}
                                    icon={
                                      activeCropInDialog?.id === c.id
                                        ? activeIcon
                                        : defaultIcon
                                    }
                                    eventHandlers={{
                                      click: () => setActiveCropInDialog(c),
                                    }}
                                  >
                                    <Popup
                                      className="rounded-2xl"
                                      autoPan={false}
                                    >
                                      <div className="p-1 min-w-[150px]">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge
                                            variant="secondary"
                                            className="bg-primary/10 text-primary border-none text-[10px] font-black"
                                          >
                                            {c.code}
                                          </Badge>
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(
                                              c.plantedDate,
                                            ).getFullYear()}
                                          </span>
                                        </div>
                                        <h5 className="font-black text-slate-800 leading-tight text-sm mb-1">
                                          {c.name}
                                        </h5>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                          <Activity
                                            size={10}
                                            className="text-primary"
                                          />
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
                              </MapContainer>

                              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl z-1000 border border-white/20">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                  <Leaf size={14} className="text-primary" />
                                  <span>
                                    Phân bố {selectedCrop.name}:{" "}
                                    {cropsInThisRegion.length} điểm
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Active Crop Detail Info */}
                            <div className="flex flex-col gap-4">
                              <Card className="flex-1 bg-linear-to-br from-white to-slate-50 border-none shadow-sm rounded-4xl overflow-hidden">
                                <CardHeader className="pb-2 border-b bg-white/50">
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
                                              {activeCropInDialog.plotName} -
                                              Hàng{" "}
                                              {activeCropInDialog.rowNumber ||
                                                "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
                                              Tuổi cây / Sinh trưởng
                                            </p>
                                            <p className="font-black text-slate-800 text-lg">
                                              {activeCropInDialog.actualAge}{" "}
                                              tháng -{" "}
                                              {activeCropInDialog.growthStage}
                                            </p>
                                          </div>
                                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-black">
                                            75%
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
                                      <Leaf
                                        size={48}
                                        className="mb-4 opacity-20"
                                      />
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
                          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-4xl border overflow-hidden shadow-sm mt-4">
                            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
                              <h4 className="font-black text-slate-700 flex items-center gap-2 uppercase tracking-tighter text-sm">
                                <Activity size={16} className="text-primary" />
                                Danh sách {selectedCrop.name} tại{" "}
                                {currentRegion?.name}
                              </h4>
                              <div className="text-xs font-bold text-slate-500">
                                Đang chọn:{" "}
                                <span className="text-primary font-black">
                                  {activeCropInDialog?.code || "..."}
                                </span>
                              </div>
                            </div>

                            <ScrollArea className="flex-1">
                              <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white z-10">
                                  <tr className="border-b">
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Mã hiệu
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Tên & Giống
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                      Ngày trồng
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                      Tọa độ
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                      Lô
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cropsInThisRegion.map((c) => (
                                    <tr
                                      key={c.id}
                                      onClick={() => setActiveCropInDialog(c)}
                                      className={cn(
                                        "border-b last:border-0 cursor-pointer transition-all hover:bg-primary/5",
                                        activeCropInDialog?.id === c.id
                                          ? "bg-primary/10"
                                          : "",
                                      )}
                                    >
                                      <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                                          {c.code}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="font-black text-slate-800 text-sm leading-tight">
                                          {c.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                          {c.variety}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-bold text-slate-600">
                                          {new Date(
                                            c.plantedDate,
                                          ).toLocaleDateString("vi-VN")}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <code className="text-[11px] bg-slate-50 px-2 py-1 rounded-md text-slate-500 border border-slate-100">
                                          {c.coordinate.lat.toFixed(6)},{" "}
                                          {c.coordinate.lng.toFixed(6)}
                                        </code>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] border-slate-200 text-slate-500 font-bold"
                                        >
                                          {c.plotName}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </ScrollArea>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </main>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SearchCropPage;
