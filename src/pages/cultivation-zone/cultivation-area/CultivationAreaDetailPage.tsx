import { useLocation } from "wouter";
import {
  AdminLayout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  MapPin,
  Award,
  User,
  Sprout,
  Droplets,
  Leaf,
  Calendar,
  FileText,
  Layers,
  Target,
  CheckCircle,
} from "lucide-react";

// Mock data - in real app, fetch from API based on ID
const mockCultivationArea = {
  id: "CA-001",
  name: "Vùng trồng Sầu riêng chất lượng cao",
  scope: "area" as "region" | "area" | "plot",
  status: "active",
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
  region: {
    id: "1",
    name: "Vùng Đồng Tháp Mười",
    code: "DTM-001",
    address: "Xã Tân Thành, Huyện Tân Phước, Tỉnh Tiền Giang",
    enterpriseId: "Hợp tác xã Nông nghiệp Tân Thành",
  },
  areas: [
    { id: "1", name: "Khu vực A1", code: "A1-001" },
    { id: "2", name: "Khu vực A2", code: "A2-001" },
  ],
  certificate: {
    id: "cert-1",
    name: "VietGAP",
    code: "VG-2024-001",
    organization: "Bộ Nông nghiệp và Phát triển nông thôn",
    validUntil: "2025-12-31",
  },
  manager: {
    id: "mgr-1",
    name: "Nguyễn Văn An",
    role: "Trưởng phòng Kỹ thuật",
    department: "Phòng Kỹ thuật Canh tác",
    phone: "0901234567",
    email: "nva@example.com",
  },
  farmingMethod: {
    id: "organic",
    name: "Canh tác hữu cơ",
    description: "Sử dụng phân bón hữu cơ, không sử dụng hóa chất",
  },
  irrigationMethod: {
    id: "drip",
    name: "Tưới nhỏ giọt",
    description: "Hệ thống tưới tiết kiệm nước",
  },
  crops: [
    { id: "durian-1", name: "Sầu riêng Monthong", type: "Cây ăn trái" },
    { id: "durian-2", name: "Sầu riêng Ri6", type: "Cây ăn trái" },
  ],
  note: "Khu vực thí điểm áp dụng công nghệ cao trong canh tác sầu riêng",
  statistics: {
    totalArea: "25.5 ha",
    plantCount: 1250,
    harvestCycles: 2,
    avgYield: "18 tấn/ha",
  },
};

const CultivationAreaDetailPage = () => {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockCultivationArea.name}
      description={`Mã: ${mockCultivationArea.id} • Tạo: ${new Date(mockCultivationArea.createdAt).toLocaleDateString("vi-VN")}`}
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-area")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex gap-2">
          <Badge
            variant={
              mockCultivationArea.status === "active" ? "default" : "secondary"
            }
            className="px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {mockCultivationArea.status === "active"
              ? "Đang hoạt động"
              : "Tạm ngưng"}
          </Badge>
          <Button
            onClick={() =>
              setLocation(`/cultivation-area/${mockCultivationArea.id}/edit`)
            }
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="technical">Kỹ thuật canh tác</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Info */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  Thông tin vị trí
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Phạm vi
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {mockCultivationArea.scope === "region"
                        ? "Vùng trồng"
                        : mockCultivationArea.scope === "area"
                          ? "Khu vực"
                          : "Lô đất"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Diện tích
                    </div>
                    <div className="font-semibold text-slate-900">
                      {mockCultivationArea.statistics.totalArea}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Vùng trồng</div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="font-semibold text-slate-900">
                      {mockCultivationArea.region.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {mockCultivationArea.region.code}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                      {mockCultivationArea.region.address}
                    </div>
                    <div className="text-sm font-medium text-primary mt-1">
                      {mockCultivationArea.region.enterpriseId}
                    </div>
                  </div>
                </div>

                {mockCultivationArea.areas.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">
                      Khu vực ({mockCultivationArea.areas.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockCultivationArea.areas.map((area) => (
                        <Badge
                          key={area.id}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {area.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificate & Manager */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b bg-slate-50">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="w-4 h-4 text-orange-600" />
                    Chứng nhận
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {mockCultivationArea.certificate.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mockCultivationArea.certificate.code}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {mockCultivationArea.certificate.organization}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Hiệu lực đến:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          mockCultivationArea.certificate.validUntil,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b bg-slate-50">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="w-4 h-4 text-primary" />
                    Người quản lý
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {mockCultivationArea.manager.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {mockCultivationArea.manager.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mockCultivationArea.manager.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm space-y-1 pt-2 border-t">
                      <div className="text-muted-foreground">
                        {mockCultivationArea.manager.department}
                      </div>
                      <div>{mockCultivationArea.manager.phone}</div>
                      <div className="text-primary">
                        {mockCultivationArea.manager.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notes */}
          {mockCultivationArea.note && (
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700">{mockCultivationArea.note}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Phương pháp canh tác
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {mockCultivationArea.farmingMethod.name}
                  </div>
                  <p className="text-slate-600">
                    {mockCultivationArea.farmingMethod.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  Hệ thống tưới tiêu
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {mockCultivationArea.irrigationMethod.name}
                  </div>
                  <p className="text-slate-600">
                    {mockCultivationArea.irrigationMethod.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Giống cây trồng ({mockCultivationArea.crops.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCultivationArea.crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center gap-3 p-4 border rounded-lg bg-green-50/50 border-green-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {crop.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {crop.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Tổng diện tích",
                value: mockCultivationArea.statistics.totalArea,
                icon: Layers,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Số lượng cây",
                value:
                  mockCultivationArea.statistics.plantCount.toLocaleString(),
                icon: Sprout,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Chu kỳ thu hoạch/năm",
                value: mockCultivationArea.statistics.harvestCycles,
                icon: Target,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                label: "Năng suất TB",
                value: mockCultivationArea.statistics.avgYield,
                icon: Award,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle>Biểu đồ năng suất thu hoạch</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        Last 7 days
                      </Button>
                      <Button variant="secondary" size="sm" className="h-8">
                        Last 30 days
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        This Year
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[350px] flex items-end justify-between gap-2 px-2">
                    {/* Mock Chart Bars */}
                    {[45, 60, 30, 75, 50, 80, 65, 90, 70, 55, 60, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-2 group"
                        >
                          <div
                            className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t relative group-hover:bg-primary/60"
                            style={{ height: `${h}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {h} tấn
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            T{i + 1}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Năng suất theo tháng (Năm 2024)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default CultivationAreaDetailPage;
