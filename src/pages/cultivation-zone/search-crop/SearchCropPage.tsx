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
  Leaf,
  FileText,
  Activity,
  Bug,
  ShoppingCart,
  Award,
  Image as ImageIcon,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { MOCK_CROPS, type CropDetail, GROWTH_STAGES } from "../constants";
import { MOCK_REGIONS, MOCK_AREAS } from "../../region-chart/constants";

interface AdvancedFilters {
  status?: string;
  regionId?: string;
  areaId?: string;
  growthStage?: string;
  variety?: string;
  minAge?: number;
  maxAge?: number;
  hasCertification?: boolean;
  hasDisease?: boolean;
}

const SearchCropPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});

  // Get unique varieties
  const uniqueVarieties = Array.from(
    new Set(MOCK_CROPS.map((crop) => crop.variety)),
  );

  const filteredCrops = MOCK_CROPS.filter((crop) => {
    // Basic search
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase());

    // Advanced filters
    const matchesStatus = advancedFilters.status
      ? crop.status === advancedFilters.status
      : true;

    const matchesRegion = advancedFilters.regionId
      ? crop.regionId === parseInt(advancedFilters.regionId)
      : true;

    const matchesArea = advancedFilters.areaId
      ? crop.areaId === parseInt(advancedFilters.areaId)
      : true;

    const matchesGrowthStage = advancedFilters.growthStage
      ? crop.growthStage === advancedFilters.growthStage
      : true;

    const matchesVariety = advancedFilters.variety
      ? crop.variety === advancedFilters.variety
      : true;

    const matchesMinAge = advancedFilters.minAge
      ? crop.actualAge >= advancedFilters.minAge
      : true;

    const matchesMaxAge = advancedFilters.maxAge
      ? crop.actualAge <= advancedFilters.maxAge
      : true;

    const matchesCertification = advancedFilters.hasCertification
      ? crop.certifications.length > 0
      : true;

    const matchesDisease = advancedFilters.hasDisease
      ? crop.diseaseHistory.length > 0
      : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRegion &&
      matchesArea &&
      matchesGrowthStage &&
      matchesVariety &&
      matchesMinAge &&
      matchesMaxAge &&
      matchesCertification &&
      matchesDisease
    );
  });

  const handleViewDetail = (crop: CropDetail) => {
    setSelectedCrop(crop);
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

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: "Nhẹ", variant: "default" as const },
      medium: { label: "Trung bình", variant: "secondary" as const },
      high: { label: "Nghiêm trọng", variant: "destructive" as const },
    };
    const config = severityConfig[severity as keyof typeof severityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getQualityBadge = (quality: string) => {
    const qualityConfig = {
      A: { label: "Loại A", variant: "default" as const },
      B: { label: "Loại B", variant: "secondary" as const },
      C: { label: "Loại C", variant: "outline" as const },
    };
    const config = qualityConfig[quality as keyof typeof qualityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tìm kiếm cây trồng</h1>
          <p className="text-muted-foreground mt-2">
            Tra cứu thông tin chi tiết về cây trồng trong vùng canh tác
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên cây, mã số, giống..."
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
                        <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                        <SelectItem value="diseased">Bệnh</SelectItem>
                        <SelectItem value="harvesting">Thu hoạch</SelectItem>
                        <SelectItem value="removed">Đã loại bỏ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region Filter */}
                  <div className="space-y-2">
                    <Label>Vùng trồng</Label>
                    <Select
                      value={advancedFilters.regionId}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          regionId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_REGIONS.map((region) => (
                          <SelectItem
                            key={region.id}
                            value={region.id.toString()}
                          >
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area Filter */}
                  <div className="space-y-2">
                    <Label>Khu vực</Label>
                    <Select
                      value={advancedFilters.areaId}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          areaId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_AREAS.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Growth Stage Filter */}
                  <div className="space-y-2">
                    <Label>Giai đoạn sinh trưởng</Label>
                    <Select
                      value={advancedFilters.growthStage}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          growthStage: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROWTH_STAGES.map((stage) => (
                          <SelectItem key={stage.id} value={stage.name}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Variety Filter */}
                  <div className="space-y-2">
                    <Label>Giống cây</Label>
                    <Select
                      value={advancedFilters.variety}
                      onValueChange={(value) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          variety: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueVarieties.map((variety) => (
                          <SelectItem key={variety} value={variety}>
                            {variety}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Age Filter */}
                  <div className="space-y-2">
                    <Label>Tuổi tối thiểu (tháng)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={advancedFilters.minAge || ""}
                      onChange={(e) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          minAge: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>

                  {/* Max Age Filter */}
                  <div className="space-y-2">
                    <Label>Tuổi tối đa (tháng)</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={advancedFilters.maxAge || ""}
                      onChange={(e) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          maxAge: e.target.value
                            ? parseInt(e.target.value)
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Tìm thấy{" "}
            <span className="font-semibold">{filteredCrops.length}</span> cây
            trồng
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card
              key={crop.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(crop)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {crop.code}
                    </p>
                  </div>
                  {getStatusBadge(crop.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Giống:</span>
                  <span className="font-medium truncate">{crop.variety}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-muted-foreground">Ngày trồng:</span>
                  <span className="font-medium">
                    {new Date(crop.plantedDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="text-muted-foreground truncate">
                    {crop.regionName} / {crop.areaName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-muted-foreground">Giai đoạn:</span>
                  <span className="font-medium">{crop.growthStage}</span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">
                      Tuổi: {crop.actualAge} tháng
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {crop.certifications.length > 0 && (
                      <Award className="h-4 w-4 text-yellow-600" />
                    )}
                    {crop.diseaseHistory.length > 0 && (
                      <Bug className="h-4 w-4 text-red-600" />
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy cây trồng nào phù hợp với tiêu chí tìm kiếm
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            {selectedCrop && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedCrop.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedCrop.code}</Badge>
                    {getStatusBadge(selectedCrop.status)}
                  </div>
                </DialogHeader>

                <Tabs defaultValue="info" className="mt-6">
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="info">Thông tin</TabsTrigger>
                    <TabsTrigger value="location">Vị trí</TabsTrigger>
                    <TabsTrigger value="cultivation">Canh tác</TabsTrigger>
                    <TabsTrigger value="disease">Sâu bệnh</TabsTrigger>
                    <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
                    <TabsTrigger value="growth">Sinh trưởng</TabsTrigger>
                    <TabsTrigger value="harvest">Thu hoạch</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Thông tin cây trồng */}
                  <TabsContent value="info" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          Thông tin cơ bản
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Tên cây trồng
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.name}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Mã số
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.code}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Giống cây
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.variety}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Loại hạt giống
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.seedType}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Ngày trồng
                            </Label>
                            <p className="font-medium mt-1">
                              {new Date(
                                selectedCrop.plantedDate,
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Tuổi cây
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.actualAge} tháng
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Ghi chú
                          </Label>
                          <p className="mt-1">{selectedCrop.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 2: Vị trí */}
                  <TabsContent value="location" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Thông tin vị trí
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Vùng trồng
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.regionName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Khu vực
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.areaName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Lô</Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.plotName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Số hàng
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.rowNumber || "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Tọa độ GPS
                            </Label>
                            <p className="font-medium mt-1">
                              {selectedCrop.coordinate.lat.toFixed(6)},{" "}
                              {selectedCrop.coordinate.lng.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 3: Lịch sử canh tác */}
                  <TabsContent value="cultivation" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Lịch sử canh tác
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedCrop.cultivationHistory.map((record) => (
                            <div
                              key={record.id}
                              className="border-l-2 border-primary pl-4 pb-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge>{record.activity}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(record.date).toLocaleDateString(
                                        "vi-VN",
                                      )}
                                    </span>
                                  </div>
                                  <p className="mt-2 font-medium">
                                    {record.description}
                                  </p>
                                  <div className="mt-2 space-y-1 text-sm">
                                    <p>
                                      <span className="text-muted-foreground">
                                        Người thực hiện:
                                      </span>{" "}
                                      {record.performedBy}
                                    </p>
                                    {record.materials && (
                                      <p>
                                        <span className="text-muted-foreground">
                                          Vật tư:
                                        </span>{" "}
                                        {record.materials}
                                      </p>
                                    )}
                                    {record.quantity && (
                                      <p>
                                        <span className="text-muted-foreground">
                                          Liều lượng:
                                        </span>{" "}
                                        {record.quantity}
                                      </p>
                                    )}
                                    {record.cost && (
                                      <p>
                                        <span className="text-muted-foreground">
                                          Chi phí:
                                        </span>{" "}
                                        {record.cost.toLocaleString("vi-VN")} đ
                                      </p>
                                    )}
                                    {record.notes && (
                                      <p className="text-muted-foreground italic">
                                        {record.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {selectedCrop.cultivationHistory.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Chưa có lịch sử canh tác
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 4: Lịch sử sâu bệnh */}
                  <TabsContent value="disease" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bug className="h-5 w-5" />
                          Lịch sử sâu bệnh
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedCrop.diseaseHistory.map((record) => (
                            <div
                              key={record.id}
                              className="border rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {record.diseaseName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Phát hiện:{" "}
                                    {new Date(record.date).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </p>
                                </div>
                                {getSeverityBadge(record.severity)}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="text-muted-foreground">
                                    Vùng ảnh hưởng
                                  </Label>
                                  <p className="mt-1">{record.affectedArea}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Trạng thái
                                  </Label>
                                  <p className="mt-1 capitalize">
                                    {record.recoveryStatus === "recovered"
                                      ? "Đã hồi phục"
                                      : record.recoveryStatus === "treating"
                                        ? "Đang điều trị"
                                        : "Nghiêm trọng"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Triệu chứng
                                </Label>
                                <p className="mt-1 text-sm">
                                  {record.symptoms}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Phương pháp điều trị
                                </Label>
                                <p className="mt-1 text-sm">
                                  {record.treatment}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Ngày điều trị:{" "}
                                  {new Date(
                                    record.treatmentDate,
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              {record.notes && (
                                <div className="bg-muted p-3 rounded">
                                  <p className="text-sm italic">
                                    {record.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                          {selectedCrop.diseaseHistory.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Không có lịch sử sâu bệnh
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 5: Giấy chứng nhận */}
                  <TabsContent value="certificates" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Giấy chứng nhận
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedCrop.certifications.map((cert) => (
                            <div
                              key={cert.id}
                              className="border rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
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
                              <div className="grid grid-cols-2 gap-4 text-sm">
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
                              {cert.documentUrl && (
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Xem tài liệu
                                </Button>
                              )}
                            </div>
                          ))}
                          {selectedCrop.certifications.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Chưa có giấy chứng nhận
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 6: Chu kỳ sinh trưởng */}
                  <TabsContent value="growth" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          Chu kỳ sinh trưởng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Giai đoạn hiện tại
                            </Label>
                            <p className="font-medium mt-1 text-lg">
                              {selectedCrop.growthStage}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Tuổi cây
                            </Label>
                            <p className="font-medium mt-1 text-lg">
                              {selectedCrop.actualAge} tháng
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Ngày trồng
                            </Label>
                            <p className="font-medium mt-1">
                              {new Date(
                                selectedCrop.plantedDate,
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Dự kiến thu hoạch
                            </Label>
                            <p className="font-medium mt-1">
                              {new Date(
                                selectedCrop.expectedHarvestDate,
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Label className="text-muted-foreground mb-3 block">
                            Tiến trình sinh trưởng
                          </Label>
                          <div className="space-y-2">
                            {[
                              "Giai đoạn cây con",
                              "Sinh trưởng thân lá",
                              "Ra hoa",
                              "Đậu quả",
                              "Quả chín",
                              "Thu hoạch",
                            ].map((stage, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    stage === selectedCrop.growthStage
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                                <span
                                  className={
                                    stage === selectedCrop.growthStage
                                      ? "font-semibold"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab 7: Lịch sử thu hoạch */}
                  <TabsContent value="harvest" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          Lịch sử thu hoạch
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedCrop.harvestHistory.map((record) => (
                            <div
                              key={record.id}
                              className="border rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {new Date(record.date).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Vụ thu hoạch
                                  </p>
                                </div>
                                {getQualityBadge(record.quality)}
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-muted-foreground text-xs">
                                    Sản lượng
                                  </Label>
                                  <p className="font-semibold text-lg">
                                    {record.quantity} kg
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground text-xs">
                                    Đơn giá
                                  </Label>
                                  <p className="font-semibold text-lg">
                                    {record.price.toLocaleString("vi-VN")} đ/kg
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground text-xs">
                                    Doanh thu
                                  </Label>
                                  <p className="font-semibold text-lg text-green-600">
                                    {record.totalRevenue.toLocaleString(
                                      "vi-VN",
                                    )}{" "}
                                    đ
                                  </p>
                                </div>
                              </div>
                              {record.buyer && (
                                <div>
                                  <Label className="text-muted-foreground text-xs">
                                    Người mua
                                  </Label>
                                  <p className="mt-1">{record.buyer}</p>
                                </div>
                              )}
                              {record.notes && (
                                <div className="bg-muted p-3 rounded">
                                  <p className="text-sm italic">
                                    {record.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                          {selectedCrop.harvestHistory.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Chưa có lịch sử thu hoạch
                            </p>
                          )}
                        </div>
                        {selectedCrop.harvestHistory.length > 0 && (
                          <div className="mt-6 pt-6 border-t">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <Label className="text-muted-foreground text-xs">
                                  Tổng sản lượng
                                </Label>
                                <p className="font-bold text-2xl mt-1">
                                  {selectedCrop.harvestHistory
                                    .reduce((sum, h) => sum + h.quantity, 0)
                                    .toLocaleString("vi-VN")}{" "}
                                  kg
                                </p>
                              </div>
                              <div className="text-center">
                                <Label className="text-muted-foreground text-xs">
                                  Tổng doanh thu
                                </Label>
                                <p className="font-bold text-2xl mt-1 text-green-600">
                                  {selectedCrop.harvestHistory
                                    .reduce((sum, h) => sum + h.totalRevenue, 0)
                                    .toLocaleString("vi-VN")}{" "}
                                  đ
                                </p>
                              </div>
                              <div className="text-center">
                                <Label className="text-muted-foreground text-xs">
                                  Số vụ thu hoạch
                                </Label>
                                <p className="font-bold text-2xl mt-1">
                                  {selectedCrop.harvestHistory.length} vụ
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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

export default SearchCropPage;
