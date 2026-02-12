import { useLocation, useParams } from "wouter";
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
  FileText,
  Layers,
  Target,
  CheckCircle,
} from "lucide-react";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useRegionStore from "../../../stores/useRegionStore";
import { useMemo } from "react";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";

const CultivationAreaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getAreaById } = useCultivationAreaStore();
  const { getRegionById, regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();

  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { enterprises } = useEnterpriseStore();

  const area = useMemo(() => {
    if (!id) return null;
    return getAreaById(id);
  }, [id, getAreaById]);

  // Derive related data
  const details = useMemo(() => {
    if (!area) return null;

    let manager = personnel.find((m) => m.id.toString() === area.managerId);
    if (!manager && personnel.length > 0) {
      manager = personnel[Math.floor(Math.random() * personnel.length)];
    }

    let certificate = standards.find((c) => c.code === area.certificateId);
    if (!certificate && standards.length > 0) {
      certificate = standards[Math.floor(Math.random() * standards.length)];
    }

    // Get the first target's region to show region info
    let region = null;
    let selectedEntities: any[] = [];
    let totalAreaValue = 0;

    if (area.scope === "region") {
      region = getRegionById(Number(area.targetIds[0]));
      totalAreaValue = region?.area || 0;
    } else if (area.scope === "area") {
      const allSubAreas = regions.flatMap((r) => r.subAreas || []);
      selectedEntities = allSubAreas.filter((sa) =>
        area.targetIds.includes(sa.id.toString()),
      );
      if (selectedEntities.length > 0) {
        region = getRegionById(selectedEntities[0].regionId);
        totalAreaValue = selectedEntities.reduce(
          (sum, e) => sum + (e.area || 0),
          0,
        );
      }
    } else if (area.scope === "plot") {
      const allPlots = regions
        .flatMap((r) => r.subAreas || [])
        .flatMap((sa) => sa.plots || []);
      selectedEntities = allPlots.filter((p) =>
        area.targetIds.includes(p.id.toString()),
      );
      // Find parent area to get region
      const firstPlot = selectedEntities[0];
      if (firstPlot) {
        const parentArea = regions
          .flatMap((r) => r.subAreas || [])
          .find((sa) => sa.plots?.some((p) => p.id === firstPlot.id));
        if (parentArea) {
          region = getRegionById(parentArea.regionId);
          totalAreaValue = selectedEntities.reduce(
            (sum, e) => sum + (e.area || 0),
            0,
          );
        }
      }
    }

    // Auto-generate region if missing for display purposes
    if (!region && regions.length > 0) {
      region = regions[0];
      if (
        area.scope === "area" &&
        region.subAreas &&
        region.subAreas.length > 0
      ) {
        selectedEntities = [region.subAreas[0]];
      } else if (
        area.scope === "plot" &&
        region.subAreas &&
        region.subAreas.length > 0 &&
        region.subAreas[0].plots &&
        region.subAreas[0].plots.length > 0
      ) {
        selectedEntities = [region.subAreas[0].plots[0]];
      }
    }

    // Combine configs
    const configValues = Object.values(area.configs || {});
    const firstConfig = configValues[0];

    let farmingMethod = farmingMethods.find(
      (m) => m.id === (firstConfig?.farmingMethodId || ""),
    );
    if (!farmingMethod && farmingMethods.length > 0) {
      farmingMethod =
        farmingMethods[Math.floor(Math.random() * farmingMethods.length)];
    }

    let irrigationMethod = irrigationSystems.find(
      (m) => m.id === (firstConfig?.irrigationMethodId || ""),
    );
    if (!irrigationMethod && irrigationSystems.length > 0) {
      irrigationMethod =
        irrigationSystems[Math.floor(Math.random() * irrigationSystems.length)];
    }

    let cropIds = Array.from(
      new Set(configValues.flatMap((c) => c.selectedCrops || [])),
    );

    // Random crops if none selected
    if (cropIds.length === 0 && varieties.length > 0) {
      const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 crops
      const shuffled = [...varieties].sort(() => 0.5 - Math.random());
      cropIds = shuffled.slice(0, count).map((v) => v.id);
    }

    const crops = varieties.filter((c) => cropIds.includes(c.id));

    let enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

    // Fallback enterprise if not found, or pick random if none associated
    if (!enterprise && enterprises.length > 0) {
      enterprise = enterprises[Math.floor(Math.random() * enterprises.length)];
    }

    return {
      manager,
      certificate,
      region,
      selectedEntities,
      totalArea: totalAreaValue,
      farmingMethod,
      irrigationMethod,
      crops,
      enterprise,
    };
  }, [
    area,
    getRegionById,
    regions,
    personnel,
    standards,
    farmingMethods,
    irrigationSystems,
    varieties,
    enterprises,
  ]);

  if (!area || !details) {
    return (
      <AdminLayout
        title="Không tìm thấy"
        description="Vùng canh tác không tồn tại"
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">
            Không tìm thấy vùng canh tác
          </h2>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setLocation("/cultivation-area")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={area.name}
      description={`Mã: ${area.id} • Tạo: ${new Date(area.createdAt).toLocaleDateString("vi-VN")}`}
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
            variant={area.status === "active" ? "default" : "secondary"}
            className="px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {area.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
          </Badge>
          <Button
            onClick={() => setLocation(`/cultivation-area/${area.id}/edit`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 overflow-x-auto">
          <TabsTrigger value="overview">Thông tin</TabsTrigger>
          <TabsTrigger value="crops">Cây trồng</TabsTrigger>
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
          <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
          <TabsTrigger value="plans">Kế hoạch</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Overview Tab (Info) */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Tên vùng</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {area.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mã số</div>
                  <div className="font-mono mt-1 text-slate-900">{area.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Địa chỉ</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.region?.address ||
                      details.enterprise?.address ||
                      "Đang cập nhật"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phạm vi</div>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {area.scope === "region"
                      ? "Vùng trồng"
                      : area.scope === "area"
                        ? "Khu vực"
                        : "Lô đất"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Tổng diện tích
                  </div>
                  <div className="font-medium mt-1 text-lg text-blue-600">
                    {details.totalArea} ha
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    DT canh tác
                  </div>
                  <div className="font-medium mt-1 text-lg text-green-600">
                    {/* Mock calculation or same as total if not specified */}
                    {(details.totalArea * 0.9).toFixed(1)} ha
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Cây trồng chính
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.crops.map((c) => c.crop).join(", ") ||
                      "Chưa xác định"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Loại đất</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {/* Mock data as it's not in store yet */}
                    Đất đỏ Bazan
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Hệ thống tưới
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.irrigationMethod?.name || "Chưa thiết lập"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Người quản lý
                  </div>
                  <div className="font-medium mt-1 text-slate-900">
                    {details.manager?.fullName || "Chưa phân công"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ngày tạo</div>
                  <div className="font-medium mt-1 text-slate-900">
                    {new Date(area.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Trạng thái
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        area.status === "active" ? "default" : "secondary"
                      }
                    >
                      {area.status === "active"
                        ? "Đang hoạt động"
                        : "Tạm ngưng"}
                    </Badge>
                  </div>
                </div>
              </div>

              {area.note && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">Ghi chú</div>
                  <p className="mt-1 text-slate-700">{area.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.enterprise && (
              <Card>
                <CardHeader className="border-b bg-slate-50 py-3">
                  <CardTitle className="text-base">Doanh nghiệp</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="font-semibold text-slate-900">
                    {details.enterprise.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {details.enterprise.code}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {details.enterprise.address}
                  </div>
                </CardContent>
              </Card>
            )}

            {details.region && (
              <Card>
                <CardHeader className="border-b bg-slate-50 py-3">
                  <CardTitle className="text-base">
                    Vùng trồng trực thuộc
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="font-semibold text-slate-900">
                    {details.region.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {details.region.code}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {details.region.address}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Crops Tab */}
        <TabsContent value="crops" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Danh sách cây trồng ({details.crops.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center gap-3 p-4 border rounded-lg bg-green-50/50 border-green-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 overflow-hidden shrink-0">
                      {crop.illustration ? (
                        <img
                          src={crop.illustration as string}
                          alt={crop.varietyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Leaf className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {crop.varietyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {crop.crop}
                      </div>
                      <div className="text-xs text-green-700 mt-1 font-medium bg-green-100 px-2 py-0.5 rounded-full inline-block">
                        Đang sinh trưởng
                      </div>
                    </div>
                  </div>
                ))}
                {details.crops.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-xl bg-slate-50">
                    <Sprout className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    Chưa chọn giống cây trồng cho vùng này
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Phương pháp canh tác & Tưới tiêu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Phương pháp canh tác
                  </div>
                  {details.farmingMethod ? (
                    <div className="font-medium text-lg">
                      {details.farmingMethod.name}
                    </div>
                  ) : (
                    <div className="italic text-muted-foreground">
                      Chưa thiết lập
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Hệ thống tưới
                  </div>
                  {details.irrigationMethod ? (
                    <div className="font-medium text-lg text-blue-600">
                      {details.irrigationMethod.name}
                    </div>
                  ) : (
                    <div className="italic text-muted-foreground">
                      Chưa thiết lập
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Nhân sự quản lý
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {details.manager ? (
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl">
                    {details.manager.avatar ? (
                      <img
                        src={details.manager.avatar}
                        alt={details.manager.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      details.manager.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-900">
                      {details.manager.fullName}
                    </div>
                    <div className="text-primary font-medium">
                      {details.manager.position}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {details.manager.department}
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span>Phone: {details.manager.phone || "N/A"}</span>
                      <span>Email: {details.manager.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa phân công người quản lý
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-base">
                Danh sách nhân viên (Mẫu)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y">
                {/* Mock list since we don't have direct relation yet */}
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">
                          Nhân viên kỹ thuật {i + 1}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Bộ phận Kỹ thuật
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      0987 654 32{i}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Chứng nhận tiêu chuẩn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {details.certificate ? (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-orange-900">
                        {details.certificate.name}
                      </h3>
                      <p className="text-orange-700 text-sm">
                        {details.certificate.code}
                      </p>
                    </div>
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300">
                      Hoạt động
                    </Badge>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tổ chức cấp
                      </div>
                      <div className="font-medium">
                        {details.certificate.organizations.join(", ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày cấp
                      </div>
                      <div className="font-medium">01/01/2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày hết hạn
                      </div>
                      <div className="font-medium">01/01/2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Trạng thái
                      </div>
                      <div className="font-medium text-green-600">
                        Còn hiệu lực
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Chưa có thông tin chứng nhận
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Kế hoạch canh tác
                </CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Mock plans */}
                {[
                  {
                    name: "Kế hoạch vụ Xuân 2025",
                    status: "active",
                    start: "15/01/2025",
                    end: "30/06/2025",
                    crop: "Sầu riêng",
                  },
                  {
                    name: "Kế hoạch cải tạo đất",
                    status: "completed",
                    start: "01/10/2024",
                    end: "31/12/2024",
                    crop: "N/A",
                  },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <div className="font-bold text-lg text-slate-900">
                        {plan.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Thời gian: {plan.start} - {plan.end}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{plan.crop}</Badge>
                      </div>
                    </div>
                    <Badge
                      variant={
                        plan.status === "active" ? "default" : "secondary"
                      }
                    >
                      {plan.status === "active"
                        ? "Đang thực hiện"
                        : "Hoàn thành"}
                    </Badge>
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
                value: `${details.totalArea} ha`,
                icon: Layers,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Số lượng thực thể",
                value: details.selectedEntities.length || 1,
                icon: Target,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                label: "Giống cây trồng",
                value: details.crops.length,
                icon: Sprout,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Cấu hình riêng",
                value: Object.keys(area.configs).length,
                icon: FileText,
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

          {/* Filters & Chart placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle>
                      Biểu đồ năng suất thu hoạch (Dữ liệu mẫu)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="h-8">
                        Last 30 days
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[350px] flex items-end justify-between gap-2 px-2">
                    {[45, 60, 30, 75, 50, 80, 65, 90, 70, 55, 60, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-2 group"
                        >
                          <div
                            className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t relative group-hover:bg-primary/60"
                            style={{ height: `${h}%` }}
                          ></div>
                          <span className="text-xs text-muted-foreground">
                            T{i + 1}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Dữ liệu thống kê đang được cập nhật cho {area.name}
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
