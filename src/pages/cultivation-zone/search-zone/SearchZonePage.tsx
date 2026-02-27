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
} from "lucide-react";
import { MOCK_CULTIVATION_ZONES, type CultivationZone } from "../constants";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";

interface AdvancedFilters {
  status?: string;
  province?: string;
  minArea?: number;
  maxArea?: number;
  mainCrop?: string;
  hasCertification?: boolean;
  hasActivePlan?: boolean;
  enterpriseId?: string;
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

  // Get unique values for filters
  const uniqueProvinces = Array.from(
    new Set(MOCK_CULTIVATION_ZONES.map((z) => z.province)),
  );
  const uniqueCrops = Array.from(
    new Set(MOCK_CULTIVATION_ZONES.map((z) => z.mainCrop)),
  );

  const filteredZones = MOCK_CULTIVATION_ZONES.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = advancedFilters.status
      ? zone.status === advancedFilters.status
      : true;
    const matchesProvince = advancedFilters.province
      ? zone.province === advancedFilters.province
      : true;
    const matchesMinArea = advancedFilters.minArea
      ? zone.totalArea >= advancedFilters.minArea
      : true;
    const matchesMaxArea = advancedFilters.maxArea
      ? zone.totalArea <= advancedFilters.maxArea
      : true;
    const matchesCrop = advancedFilters.mainCrop
      ? zone.mainCrop === advancedFilters.mainCrop
      : true;
    const matchesCert = advancedFilters.hasCertification
      ? zone.certifications.length > 0
      : true;
    const matchesPlan = advancedFilters.hasActivePlan
      ? zone.cultivationPlans.some((p) => p.status === "in-progress")
      : true;
    const matchesEnterprise = advancedFilters.enterpriseId
      ? zone.enterpriseId?.toString() === advancedFilters.enterpriseId
      : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesProvince &&
      matchesMinArea &&
      matchesMaxArea &&
      matchesCrop &&
      matchesCert &&
      matchesPlan &&
      matchesEnterprise
    );
  });

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery("");
  };

  const activeFilterCount = Object.keys(advancedFilters).filter(
    (key) => advancedFilters[key as keyof AdvancedFilters] !== undefined,
  ).length;

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
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tìm kiếm vùng trồng</h1>
          <p className="text-muted-foreground mt-2">
            Tra cứu thông tin chi tiết về vùng canh tác
          </p>
        </div>

        {/* Search Bar with Advanced Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên vùng, mã số, tỉnh thành..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Tìm kiếm nâng cao
                {activeFilterCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              {(activeFilterCount > 0 || searchQuery) && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Advanced Search Panel */}
            {isAdvancedSearchOpen && (
              <div className="mt-6 pt-6 border-t space-y-4">
                <h3 className="font-semibold text-lg mb-4">Bộ lọc nâng cao</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Doanh nghiệp</Label>
                    <Select
                      value={advancedFilters.enterpriseId}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          enterpriseId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {enterprises.map((enterprise) => (
                          <SelectItem
                            key={enterprise.id}
                            value={enterprise.id.toString()}
                          >
                            {enterprise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select
                      value={advancedFilters.status}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          status: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">
                          Ngưng hoạt động
                        </SelectItem>
                        <SelectItem value="under-construction">
                          Đang xây dựng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Province Filter */}
                  <div className="space-y-2">
                    <Label>Tỉnh / Thành Phố</Label>
                    <Select
                      value={advancedFilters.province}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          province: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueProvinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Main Crop Filter */}
                  <div className="space-y-2">
                    <Label>Cây trồng chính</Label>
                    <Select
                      value={advancedFilters.mainCrop}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          mainCrop: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueCrops.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Area Filter */}
                  <div className="space-y-2">
                    <Label>DT tối thiểu (ha)</Label>
                    <Input
                      type="number"
                      placeholder="0"
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

                  {/* Max Area Filter */}
                  <div className="space-y-2">
                    <Label>DT tối đa (ha)</Label>
                    <Input
                      type="number"
                      placeholder="1000"
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

                  {/* Certification Filter */}
                  <div className="space-y-2">
                    <Label>Có chứng nhận</Label>
                    <Select
                      value={
                        advancedFilters.hasCertification === undefined
                          ? undefined
                          : advancedFilters.hasCertification.toString()
                      }
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          hasCertification: value === "true",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Plan Filter */}
                  <div className="space-y-2">
                    <Label>Có KH đang thực hiện</Label>
                    <Select
                      value={
                        advancedFilters.hasActivePlan === undefined
                          ? undefined
                          : advancedFilters.hasActivePlan.toString()
                      }
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          hasActivePlan: value === "true",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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

export default SearchZonePage;
