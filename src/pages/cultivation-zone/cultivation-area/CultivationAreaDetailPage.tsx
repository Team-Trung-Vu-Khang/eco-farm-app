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

    const enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

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
                      {area.scope === "region"
                        ? "Vùng trồng"
                        : area.scope === "area"
                          ? "Khu vực"
                          : "Lô đất"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Diện tích
                    </div>
                    <div className="font-semibold text-slate-900">
                      {details.totalArea} ha
                    </div>
                  </div>
                </div>

                {details.enterprise && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Doanh nghiệp</div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-900">
                        {details.enterprise.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {details.enterprise.code}
                      </div>
                      <div className="text-sm text-slate-600 mt-2">
                        {details.enterprise.address}
                      </div>
                    </div>
                  </div>
                )}

                {details.region && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Vùng trồng</div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-900">
                        {details.region.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {details.region.code}
                      </div>
                      <div className="text-sm text-slate-600 mt-2">
                        {details.region.address}
                      </div>
                      <div className="text-sm font-medium text-primary mt-1">
                        {details.region.enterpriseId}
                      </div>
                    </div>
                  </div>
                )}

                {details.selectedEntities.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">
                      {area.scope === "area" ? "Khu vực" : "Lô đất"} (
                      {details.selectedEntities.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {details.selectedEntities.map((entity) => (
                        <Badge
                          key={entity.id}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {entity.name}
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
                  {details.certificate ? (
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {details.certificate.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {details.certificate.code}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        {details.certificate.organizations.join(", ")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Chưa có chứng nhận
                    </div>
                  )}
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
                  {details.manager ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
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
                        <div>
                          <div className="font-semibold text-slate-900">
                            {details.manager.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {details.manager.position}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm space-y-1 pt-2 border-t">
                        <div className="text-muted-foreground">
                          {details.manager.department}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Chưa phân công quản lý
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notes */}
          {area.note && (
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700">{area.note}</p>
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
                {details.farmingMethod ? (
                  <div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {details.farmingMethod.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    Chưa thiết lập phương pháp
                  </div>
                )}
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
                {details.irrigationMethod ? (
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {details.irrigationMethod.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    Chưa thiết lập hệ thống tưới
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Giống cây trồng ({details.crops.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center gap-3 p-4 border rounded-lg bg-green-50/50 border-green-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 overflow-hidden">
                      {crop.illustration ? (
                        <img
                          src={crop.illustration as string}
                          alt={crop.varietyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Leaf className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {crop.varietyName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {crop.crop}
                      </div>
                    </div>
                  </div>
                ))}
                {details.crops.length === 0 && (
                  <div className="col-span-full py-10 text-center text-muted-foreground italic border-2 border-dashed rounded-xl">
                    Chưa chọn giống cây trồng
                  </div>
                )}
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
