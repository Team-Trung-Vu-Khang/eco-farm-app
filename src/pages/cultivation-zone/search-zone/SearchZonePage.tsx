import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Award,
  ClipboardList,
  Sprout,
  ChevronRight,
  Filter,
  X,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";
import { MOCK_CULTIVATION_ZONES, type CultivationZone } from "../constants";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";

interface AdvancedFilters {
  // Nhóm 1: Thông tin cây trồng
  crops?: string[];
  varieties?: string[];
  seedTypes?: string[];

  // Nhóm 2: Doanh nghiệp & Địa điểm
  enterpriseIds?: number[];
  provinces?: string[];
  districts?: string[];
  wards?: string[];
  certifications?: string[];

  // Nhóm 3: Thông số & Trạng thái
  status?: string[];
  minArea?: number;
  maxArea?: number;
  hasActivePlan?: boolean;
}

const SearchZonePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<CultivationZone | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});

  const { enterprises } = useEnterpriseStore();

  // Get unique values for filters from MOCK DATA
  const uniqueProvinces = Array.from(
    new Set(MOCK_CULTIVATION_ZONES.map((z) => z.province)),
  );
  const uniqueDistricts = Array.from(
    new Set(MOCK_CULTIVATION_ZONES.map((z) => z.district)),
  );
  const uniqueWards = Array.from(
    new Set(
      MOCK_CULTIVATION_ZONES.map((z) => z.ward).filter((w): w is string => !!w),
    ),
  );
  const allCropVarieties = MOCK_CULTIVATION_ZONES.flatMap(
    (z) => z.cropVarieties,
  );
  const uniqueCropNames = Array.from(
    new Set(allCropVarieties.map((v) => v.name)),
  );
  const uniqueVarieties = Array.from(
    new Set(allCropVarieties.map((v) => v.variety)),
  );
  const uniqueSeedTypes = Array.from(
    new Set(
      allCropVarieties.map((v) => v.seedType).filter((s): s is string => !!s),
    ),
  );
  const uniqueCertNames = Array.from(
    new Set(
      MOCK_CULTIVATION_ZONES.flatMap((z) =>
        z.certifications.map((c) => c.name),
      ),
    ),
  );

  const filteredZones = MOCK_CULTIVATION_ZONES.filter((zone) => {
    // Basic search
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.district.toLowerCase().includes(searchQuery.toLowerCase());

    // Grouped filters
    const matchesCrops =
      advancedFilters.crops && advancedFilters.crops.length > 0
        ? zone.cropVarieties.some((v) =>
            advancedFilters.crops?.includes(v.name),
          )
        : true;

    const matchesVarieties =
      advancedFilters.varieties && advancedFilters.varieties.length > 0
        ? zone.cropVarieties.some((v) =>
            advancedFilters.varieties?.includes(v.variety),
          )
        : true;

    const matchesSeeds =
      advancedFilters.seedTypes && advancedFilters.seedTypes.length > 0
        ? zone.cropVarieties.some(
            (v) =>
              v.seedType && advancedFilters.seedTypes?.includes(v.seedType),
          )
        : true;

    const matchesEnterprise =
      advancedFilters.enterpriseIds && advancedFilters.enterpriseIds.length > 0
        ? zone.enterpriseId &&
          advancedFilters.enterpriseIds.includes(zone.enterpriseId)
        : true;

    const matchesProvince =
      advancedFilters.provinces && advancedFilters.provinces.length > 0
        ? advancedFilters.provinces.includes(zone.province)
        : true;

    const matchesDistrict =
      advancedFilters.districts && advancedFilters.districts.length > 0
        ? advancedFilters.districts.includes(zone.district)
        : true;

    const matchesWard =
      advancedFilters.wards && advancedFilters.wards.length > 0
        ? zone.ward && advancedFilters.wards.includes(zone.ward)
        : true;

    const matchesCert =
      advancedFilters.certifications &&
      advancedFilters.certifications.length > 0
        ? zone.certifications.some((c) =>
            advancedFilters.certifications?.includes(c.name),
          )
        : true;

    const matchesStatus =
      advancedFilters.status && advancedFilters.status.length > 0
        ? advancedFilters.status.includes(zone.status)
        : true;

    const matchesMinArea = advancedFilters.minArea
      ? zone.totalArea >= advancedFilters.minArea
      : true;
    const matchesMaxArea = advancedFilters.maxArea
      ? zone.totalArea <= advancedFilters.maxArea
      : true;

    const matchesPlan =
      advancedFilters.hasActivePlan === true
        ? zone.cultivationPlans.some((p) => p.status === "in-progress")
        : true;

    return (
      matchesSearch &&
      matchesCrops &&
      matchesVarieties &&
      matchesSeeds &&
      matchesEnterprise &&
      matchesProvince &&
      matchesDistrict &&
      matchesWard &&
      matchesCert &&
      matchesStatus &&
      matchesMinArea &&
      matchesMaxArea &&
      matchesPlan
    );
  });

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery("");
  };

  const activeFilterCount = Object.keys(advancedFilters).reduce(
    (count, key) => {
      const val = advancedFilters[key as keyof AdvancedFilters];
      if (Array.isArray(val)) return count + (val.length > 0 ? 1 : 0);
      return count + (val !== undefined ? 1 : 0);
    },
    0,
  );

  const toggleFilter = (key: keyof AdvancedFilters, value: any) => {
    setAdvancedFilters((prev) => {
      const currentVal = prev[key] as any[] | undefined;
      if (!currentVal) return { ...prev, [key]: [value] };
      if (currentVal.includes(value)) {
        const nextVal = currentVal.filter((v) => v !== value);
        return { ...prev, [key]: nextVal.length > 0 ? nextVal : undefined };
      }
      return { ...prev, [key]: [...currentVal, value] };
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Hoạt động", variant: "default" as const },
      inactive: { label: "Ngưng hoạt động", variant: "destructive" as const },
      "under-construction": {
        label: "Đang xây dựng",
        variant: "secondary" as const,
      },
    };
    return (
      <Badge variant={config[status as keyof typeof config].variant}>
        {config[status as keyof typeof config].label}
      </Badge>
    );
  };

  const getPlanStatusBadge = (status: string) => {
    const config = {
      planned: { label: "Kế hoạch", variant: "outline" as const },
      "in-progress": { label: "Đang thực hiện", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "secondary" as const },
      cancelled: { label: "Hủy bỏ", variant: "destructive" as const },
    };
    return (
      <Badge variant={config[status as keyof typeof config].variant}>
        {config[status as keyof typeof config].label}
      </Badge>
    );
  };

  return (
    <AdminLayout title="Tìm kiếm vùng trồng">
      <div className="p-6 space-y-6">
        {/* Search & Filter Header (Same style as SearchCropPage) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vùng trồng theo tên, mã vùng, địa chỉ..."
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
            <Button className="rounded-xl px-6">Tìm kiếm</Button>
          </div>
        </div>

        {/* Advanced Search Panel (Refactored to Groups) */}
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
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Group 1: Crops, Varieties, Seeds */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sprout className="h-5 w-5" />
                    <h4 className="font-semibold">1. Cây trồng & Giống</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <MultiSelectField
                      label="Cây trồng"
                      options={uniqueCropNames.map((c) => ({ id: c, name: c }))}
                      selectedValues={advancedFilters.crops}
                      onToggle={(v) => toggleFilter("crops", v)}
                    />
                    <MultiSelectField
                      label="Giống cây"
                      options={uniqueVarieties.map((v) => ({ id: v, name: v }))}
                      selectedValues={advancedFilters.varieties}
                      onToggle={(v) => toggleFilter("varieties", v)}
                    />
                    <MultiSelectField
                      label="Hạt giống / Cây giống"
                      options={uniqueSeedTypes.map((s) => ({ id: s, name: s }))}
                      selectedValues={advancedFilters.seedTypes}
                      onToggle={(v) => toggleFilter("seedTypes", v)}
                    />
                  </div>
                </div>

                {/* Group 2: Enterprise, Location, Certification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    <h4 className="font-semibold">
                      2. Doanh nghiệp & Địa điểm
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <MultiSelectField
                      label="Doanh nghiệp sở hữu"
                      options={enterprises.map((e) => ({
                        id: e.id,
                        name: e.brandName || e.name,
                      }))}
                      selectedValues={advancedFilters.enterpriseIds}
                      onToggle={(v) =>
                        toggleFilter("enterpriseIds", parseInt(v))
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <MultiSelectField
                        label="Tỉnh thành"
                        options={uniqueProvinces.map((p) => ({
                          id: p,
                          name: p,
                        }))}
                        selectedValues={advancedFilters.provinces}
                        onToggle={(v) => toggleFilter("provinces", v)}
                      />
                      <MultiSelectField
                        label="Quận / Huyện"
                        options={uniqueDistricts.map((d) => ({
                          id: d,
                          name: d,
                        }))}
                        selectedValues={advancedFilters.districts}
                        onToggle={(v) => toggleFilter("districts", v)}
                      />
                      <MultiSelectField
                        label="Phường / Xã"
                        options={uniqueWards.map((w) => ({ id: w, name: w }))}
                        selectedValues={advancedFilters.wards}
                        onToggle={(v) => toggleFilter("wards", v)}
                      />
                    </div>
                    <MultiSelectField
                      label="Chứng nhận đạt được"
                      options={uniqueCertNames.map((c) => ({ id: c, name: c }))}
                      selectedValues={advancedFilters.certifications}
                      onToggle={(v) => toggleFilter("certifications", v)}
                    />
                  </div>
                </div>

                {/* Group 3: Specs & Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Activity className="h-5 w-5" />
                    <h4 className="font-semibold">3. Quy mô & Trạng thái</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">
                          Diện tích từ (ha)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="rounded-xl"
                          value={advancedFilters.minArea || ""}
                          onChange={(e) =>
                            setAdvancedFilters({
                              ...advancedFilters,
                              minArea: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">
                          Đến (ha)
                        </Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          className="rounded-xl"
                          value={advancedFilters.maxArea || ""}
                          onChange={(e) =>
                            setAdvancedFilters({
                              ...advancedFilters,
                              maxArea: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                    <MultiSelectField
                      label="Trạng thái hoạt động"
                      options={[
                        { id: "active", name: "Hoạt động" },
                        { id: "inactive", name: "Ngừng hoạt động" },
                        { id: "under-construction", name: "Đang xây dựng" },
                      ]}
                      selectedValues={advancedFilters.status}
                      onToggle={(v) => toggleFilter("status", v)}
                    />
                    <div className="flex items-center gap-3 pt-2">
                      <Checkbox
                        id="hasActivePlan"
                        checked={advancedFilters.hasActivePlan}
                        onCheckedChange={(checked) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            hasActivePlan: !!checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="hasActivePlan"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Đang có kế hoạch canh tác triển khai
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng vùng trồng
                  </p>
                  <p className="text-2xl font-bold">{filteredZones.length}</p>
                </div>
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng diện tích
                  </p>
                  <p className="text-2xl font-bold">
                    {filteredZones
                      .reduce((sum, z) => sum + z.totalArea, 0)
                      .toFixed(1)}{" "}
                    ha
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng nhân viên
                  </p>
                  <p className="text-2xl font-bold">
                    {filteredZones.reduce((sum, z) => sum + z.staff.length, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chứng nhận</p>
                  <p className="text-2xl font-bold">
                    {filteredZones.reduce(
                      (sum, z) => sum + z.certifications.length,
                      0,
                    )}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => (
            <Card
              key={zone.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedZone(zone);
                setIsDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {zone.code}
                    </p>
                  </div>
                  {getStatusBadge(zone.status)}
                </div>
                {zone.enterpriseId && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="text-blue-600 bg-blue-50 border-blue-200"
                    >
                      {
                        enterprises.find((e) => e.id === zone.enterpriseId)
                          ?.name
                      }
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="text-muted-foreground">
                    {zone.province} - {zone.district}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Cây chính:</span>
                  <span className="font-medium truncate">{zone.mainCrop}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-muted-foreground">Nhân viên:</span>
                  <span className="font-medium">{zone.staff.length} người</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClipboardList className="h-4 w-4 text-purple-600" />
                  <span className="text-muted-foreground">Giống cây:</span>
                  <span className="font-medium">
                    {zone.cropVarieties.length} loại
                  </span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      DT: {zone.totalArea} ha
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Canh tác: {zone.cultivatedArea} ha
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {zone.certifications.length > 0 && (
                      <Award className="h-4 w-4 text-yellow-600" />
                    )}
                    {zone.cultivationPlans.some(
                      (p) => p.status === "in-progress",
                    ) && <ClipboardList className="h-4 w-4 text-blue-600" />}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredZones.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy vùng trồng nào phù hợp với tiêu chí tìm kiếm
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            {selectedZone && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedZone.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedZone.code}</Badge>
                    {getStatusBadge(selectedZone.status)}
                    <Badge variant="secondary">
                      {selectedZone.staff.length} nhân viên
                    </Badge>
                    <Badge variant="secondary">
                      {selectedZone.cropVarieties.length} giống cây
                    </Badge>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="info" className="mt-6">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="info">Thông tin</TabsTrigger>
                    <TabsTrigger value="crops">Cây trồng</TabsTrigger>
                    <TabsTrigger value="staff">Nhân viên</TabsTrigger>
                    <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
                    <TabsTrigger value="plans">Kế hoạch</TabsTrigger>
                    <TabsTrigger value="stats">Thống kê</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Info & Map */}
                  <TabsContent value="info" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Thông tin vùng trồng</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Tên vùng
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.name}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Mã số
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.code}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Địa chỉ
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.location}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Tỉnh / Thành Phố - Phường / Xã
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.province} - {selectedZone.district}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Tổng diện tích
                            </Label>
                            <p className="font-medium mt-1 text-lg text-blue-600">
                              {selectedZone.totalArea} ha
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              DT canh tác
                            </Label>
                            <p className="font-medium mt-1 text-lg text-green-600">
                              {selectedZone.cultivatedArea} ha
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Cây trồng chính
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.mainCrop}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Loại đất
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.soilType}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Hệ thống tưới
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.irrigationSystem}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Người quản lý
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedZone.manager}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Ngày thành lập
                            </Label>
                            <p className="font-medium mt-1">
                              {new Date(
                                selectedZone.establishedDate,
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Trạng thái
                            </Label>
                            <div className="mt-1">
                              {getStatusBadge(selectedZone.status)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Ghi chú
                          </Label>
                          <p className="mt-1">{selectedZone.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Bản đồ vùng trồng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-96 rounded-lg overflow-hidden">
                          <MapContainer
                            center={[
                              selectedZone.mapCenter.lat,
                              selectedZone.mapCenter.lng,
                            ]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Polygon
                              positions={selectedZone.coordinates.map((c) => [
                                c.lat,
                                c.lng,
                              ])}
                              pathOptions={{
                                color: "blue",
                                fillColor: "lightblue",
                                fillOpacity: 0.4,
                              }}
                            />
                          </MapContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 2: Crops */}
                  <TabsContent value="crops" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Giống cây trồng</CardTitle>
                          <Badge variant="outline">
                            {selectedZone.cropVarieties.length} giống
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedZone.cropVarieties.map((crop) => (
                            <div
                              key={crop.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {crop.name} - {crop.variety}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Ngày trồng:{" "}
                                    {new Date(
                                      crop.plantedDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                <Badge>
                                  {crop.status === "growing"
                                    ? "Sinh trưởng"
                                    : crop.status === "flowering"
                                      ? "Ra hoa"
                                      : crop.status === "harvesting"
                                        ? "Thu hoạch"
                                        : "Hoàn thành"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <Label className="text-muted-foreground">
                                    Số cây
                                  </Label>
                                  <p className="font-semibold text-lg">
                                    {crop.totalPlants.toLocaleString()} cây
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Diện tích
                                  </Label>
                                  <p className="font-semibold text-lg">
                                    {crop.area} ha
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Năng suất DK
                                  </Label>
                                  <p className="font-semibold text-lg text-green-600">
                                    {crop.expectedYield} tấn/ha
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                  Tổng năng suất dự kiến:{" "}
                                  <span className="font-semibold text-green-600">
                                    {(crop.area * crop.expectedYield).toFixed(
                                      1,
                                    )}{" "}
                                    tấn
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 3: Staff */}
                  <TabsContent value="staff" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Danh sách nhân viên</CardTitle>
                          <Badge variant="outline">
                            {selectedZone.staff.length} người
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedZone.staff.map((member) => (
                            <div
                              key={member.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">
                                      {member.name}
                                    </h4>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {member.role}
                                    </Badge>
                                  </div>
                                  {member.specialization && (
                                    <p className="text-sm text-blue-600 mt-1">
                                      Chuyên môn: {member.specialization}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm">
                                  <p className="font-medium">{member.phone}</p>
                                  {member.email && (
                                    <p className="text-muted-foreground">
                                      {member.email}
                                    </p>
                                  )}
                                  <p className="text-muted-foreground mt-1">
                                    Từ{" "}
                                    {new Date(
                                      member.assignedDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 4: Certificates */}
                  <TabsContent value="certificates" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Giấy chứng nhận</CardTitle>
                          <Badge variant="outline">
                            {selectedZone.certifications.length} chứng nhận
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedZone.certifications.map((cert) => (
                            <div
                              key={cert.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {cert.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {cert.certificateNumber}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    cert.status === "valid"
                                      ? "default"
                                      : cert.status === "expired"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {cert.status === "valid"
                                    ? "Còn hiệu lực"
                                    : cert.status === "expired"
                                      ? "Hết hạn"
                                      : "Đang chờ"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <Label className="text-muted-foreground">
                                    Đơn vị cấp
                                  </Label>
                                  <p className="mt-1">{cert.issuer}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Ngày cấp
                                  </Label>
                                  <p className="mt-1">
                                    {new Date(
                                      cert.issueDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Ngày hết hạn
                                  </Label>
                                  <p className="mt-1">
                                    {new Date(
                                      cert.expiryDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 5: Plans */}
                  <TabsContent value="plans" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Kế hoạch canh tác</CardTitle>
                          <Badge variant="outline">
                            {selectedZone.cultivationPlans.length} kế hoạch
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedZone.cultivationPlans.map((plan) => (
                            <div
                              key={plan.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {plan.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      plan.startDate,
                                    ).toLocaleDateString("vi-VN")}{" "}
                                    -{" "}
                                    {new Date(plan.endDate).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </p>
                                </div>
                                {getPlanStatusBadge(plan.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label className="text-muted-foreground text-xs">
                                    Ngân sách
                                  </Label>
                                  <p className="font-semibold text-lg">
                                    {plan.budget.toLocaleString("vi-VN")} đ
                                  </p>
                                </div>
                                {plan.actualCost && (
                                  <div>
                                    <Label className="text-muted-foreground text-xs">
                                      Chi phí thực tế
                                    </Label>
                                    <p className="font-semibold text-lg">
                                      {plan.actualCost.toLocaleString("vi-VN")}{" "}
                                      đ
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Tiết kiệm:{" "}
                                      {(
                                        ((plan.budget - plan.actualCost) /
                                          plan.budget) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Label className="text-muted-foreground">
                                    Hoạt động
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {
                                      plan.activities.filter(
                                        (a) => a.status === "completed",
                                      ).length
                                    }
                                    /{plan.activities.length} hoàn thành
                                  </span>
                                </div>
                                {plan.activities.map((act) => (
                                  <div
                                    key={act.id}
                                    className="flex items-center justify-between bg-muted p-2 rounded"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">
                                        {act.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Phụ trách: {act.assignedTo} •{" "}
                                        {new Date(
                                          act.scheduledDate,
                                        ).toLocaleDateString("vi-VN")}
                                      </p>
                                      {act.completedDate && (
                                        <p className="text-xs text-green-600">
                                          Hoàn thành:{" "}
                                          {new Date(
                                            act.completedDate,
                                          ).toLocaleDateString("vi-VN")}
                                        </p>
                                      )}
                                    </div>
                                    <Badge
                                      variant={
                                        act.status === "completed"
                                          ? "default"
                                          : act.status === "in-progress"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {act.status === "completed"
                                        ? "Hoàn thành"
                                        : act.status === "in-progress"
                                          ? "Đang làm"
                                          : "Chưa làm"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 6: Statistics */}
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Tổng quan diện tích</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tổng diện tích
                            </span>
                            <span className="font-semibold text-lg">
                              {selectedZone.totalArea} ha
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Diện tích canh tác
                            </span>
                            <span className="font-semibold text-lg text-green-600">
                              {selectedZone.cultivatedArea} ha
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tỷ lệ sử dụng
                            </span>
                            <span className="font-semibold text-lg text-blue-600">
                              {(
                                (selectedZone.cultivatedArea /
                                  selectedZone.totalArea) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Tổng quan cây trồng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Số giống cây
                            </span>
                            <span className="font-semibold text-lg">
                              {selectedZone.cropVarieties.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tổng số cây
                            </span>
                            <span className="font-semibold text-lg text-green-600">
                              {selectedZone.cropVarieties
                                .reduce((sum, c) => sum + c.totalPlants, 0)
                                .toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Năng suất DK
                            </span>
                            <span className="font-semibold text-lg text-blue-600">
                              {selectedZone.cropVarieties
                                .reduce(
                                  (sum, c) => sum + c.area * c.expectedYield,
                                  0,
                                )
                                .toFixed(1)}{" "}
                              tấn
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Nhân sự</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tổng nhân viên
                            </span>
                            <span className="font-semibold text-lg">
                              {selectedZone.staff.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Quản lý
                            </span>
                            <span className="font-semibold">
                              {
                                selectedZone.staff.filter((s) =>
                                  s.role.includes("Quản lý"),
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Kỹ thuật viên
                            </span>
                            <span className="font-semibold">
                              {
                                selectedZone.staff.filter((s) =>
                                  s.role.includes("Kỹ thuật"),
                                ).length
                              }
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Kế hoạch & Ngân sách</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Số kế hoạch
                            </span>
                            <span className="font-semibold text-lg">
                              {selectedZone.cultivationPlans.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tổng ngân sách
                            </span>
                            <span className="font-semibold text-lg">
                              {selectedZone.cultivationPlans
                                .reduce((sum, p) => sum + p.budget, 0)
                                .toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Chi phí thực tế
                            </span>
                            <span className="font-semibold text-lg text-green-600">
                              {selectedZone.cultivationPlans
                                .reduce(
                                  (sum, p) => sum + (p.actualCost || 0),
                                  0,
                                )
                                .toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

const MultiSelectField = ({
  label,
  options,
  selectedValues,
  onToggle,
  placeholder = "Tất cả",
}: {
  label: string;
  options: { id: any; name: string }[];
  selectedValues?: any[];
  onToggle: (val: any) => void;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
      {label}
    </Label>
    <Select
      value={selectedValues?.[0]?.toString() || ""}
      onValueChange={(v) => {
        onToggle(v);
      }}
    >
      <SelectTrigger className="rounded-xl bg-white border-slate-200">
        <SelectValue
          placeholder={
            selectedValues && selectedValues.length > 0
              ? `Đã chọn ${selectedValues.length}`
              : placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.id}
            value={opt.id.toString()}
            className={cn(
              selectedValues?.includes(opt.id) && "bg-primary/10 font-bold",
            )}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedValues?.includes(opt.id)}
                onCheckedChange={() => onToggle(opt.id)}
                className="mr-2"
              />
              {opt.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {selectedValues && selectedValues.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {selectedValues.map((val) => {
          const opt = options.find((o) => o.id.toString() === val.toString());
          return (
            <Badge
              key={val}
              variant="secondary"
              className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20 gap-1 pr-1"
            >
              {opt?.name || val}
              <X
                size={10}
                className="cursor-pointer hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(val);
                }}
              />
            </Badge>
          );
        })}
      </div>
    )}
  </div>
);

export default SearchZonePage;
