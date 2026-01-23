import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Edit,
  MapPin,
  Package,
  Trash2,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "@tankhang1/eco-shared-ui";

// Interface cho vật tư chi tiết
interface MaterialAllocation {
  id: number;
  cycle: string;
  stage: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  packaging: string;
}

// Mock data - trong thực tế sẽ fetch từ API
const mockPlanData = {
  id: "1",
  code: "KH001",
  name: "Kế hoạch sầu riêng vụ Xuân 2025",
  season: "Vụ Xuân 2025",
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  zone: "Vùng A1 - Bình Phước",
  cultivationArea: "Khu A",
  plot: "Lô 1",
  crop: "Sầu riêng",
  variety: "Monthon",
  area: "10",
  expectedYield: "50",
  description: "Kế hoạch canh tác sầu riêng Monthon vụ Xuân 2025 tại vùng A1",
  status: "active",
  createdAt: "2025-01-15",
  stages: [
    "Chuẩn bị đất",
    "Gieo trồng",
    "Chăm sóc giai đoạn 1",
    "Bón phân lần 1",
    "Phun thuốc BVTV",
  ],
  materialAllocations: [
    {
      id: 1,
      cycle: "Chu kỳ 1",
      stage: "Chuẩn bị đất",
      materialCategory: "fertilizer",
      materialType: "Phân hữu cơ",
      materialName: "Phân chuồng",
      quantity: "500",
      unit: "kg",
      packaging: "Bao 50kg",
    },
    {
      id: 2,
      cycle: "Chu kỳ 1",
      stage: "Bón phân lần 1",
      materialCategory: "fertilizer",
      materialType: "Phân NPK",
      materialName: "NPK 20-20-15",
      quantity: "100",
      unit: "kg",
      packaging: "Bao 25kg",
    },
    {
      id: 3,
      cycle: "Chu kỳ 1",
      stage: "Phun thuốc BVTV",
      materialCategory: "pesticide",
      materialType: "Thuốc trừ sâu",
      materialName: "Abamectin",
      quantity: "2",
      unit: "lít",
      packaging: "Chai 1 lít",
    },
  ] as MaterialAllocation[],
};

export default function PlanDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [plan] = useState(mockPlanData);

  const cycles = ["Chu kỳ 1", "Chu kỳ 2", "Chu kỳ 3", "Chu kỳ 4"];

  const handleEdit = () => {
    setLocation(`/plan/${params.id}/edit`);
  };

  const handleDelete = () => {
    toast({
      title: "Xác nhận xóa",
      description: "Bạn có chắc chắn muốn xóa kế hoạch này?",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang thực hiện", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "secondary" as const },
      pending: { label: "Chờ thực hiện", variant: "outline" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout
      title="Chi tiết kế hoạch canh tác"
      description={`Xem thông tin chi tiết kế hoạch ${plan.code}`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation("/plan")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Plan Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground mt-1">Mã: {plan.code}</p>
              </div>
              {getStatusBadge(plan.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin kế hoạch */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Thông tin kế hoạch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Mùa vụ</p>
                  <Badge variant="outline">{plan.season}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Ngày tạo</p>
                  <p className="font-medium">{plan.createdAt}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  Thời gian thực hiện
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {plan.startDate} → {plan.endDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin canh tác */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Thông tin canh tác
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground mb-1">Vùng</p>
                  <p className="font-medium">{plan.zone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Khu vực</p>
                  <p className="font-medium">{plan.cultivationArea}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Lô</p>
                  <p className="font-medium">{plan.plot}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Cây trồng</p>
                  <p className="font-medium">
                    {plan.crop} - {plan.variety}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Diện tích</p>
                  <p className="font-medium">{plan.area} ha</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">
                    Sản lượng dự kiến
                  </p>
                  <p className="font-medium">{plan.expectedYield} tấn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Giai đoạn canh tác */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Giai đoạn canh tác ({plan.stages.length} giai đoạn)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plan.stages.map((stage, index) => (
                <Badge key={stage} variant="secondary" className="text-sm">
                  {index + 1}. {stage}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vật tư phân bổ */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4" />
              Vật tư phân bổ ({plan.materialAllocations.length} loại)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plan.materialAllocations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có vật tư nào được phân bổ
              </p>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">
                    Tất cả ({plan.materialAllocations.length})
                  </TabsTrigger>
                  {cycles.map((cycle) => {
                    const count = plan.materialAllocations.filter(
                      (m) => m.cycle === cycle,
                    ).length;
                    return count > 0 ? (
                      <TabsTrigger key={cycle} value={cycle}>
                        {cycle} ({count})
                      </TabsTrigger>
                    ) : null;
                  })}
                </TabsList>

                <TabsContent value="all" className="space-y-3 mt-4">
                  {cycles.map((cycle) => {
                    const cycleMaterials = plan.materialAllocations.filter(
                      (m) => m.cycle === cycle,
                    );
                    if (cycleMaterials.length === 0) return null;

                    return (
                      <div key={cycle} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{cycle}</h5>
                          <Badge variant="outline">
                            {cycleMaterials.length} vật tư
                          </Badge>
                        </div>
                        <div className="ml-4 space-y-2">
                          {Array.from(
                            new Set(cycleMaterials.map((m) => m.stage)),
                          ).map((stage) => {
                            const stageMaterials = cycleMaterials.filter(
                              (m) => m.stage === stage,
                            );
                            return (
                              <div
                                key={stage}
                                className="border-l-2 border-primary/20 pl-3"
                              >
                                <p className="text-sm font-medium mb-1">
                                  {stage}
                                </p>
                                <div className="space-y-1">
                                  {stageMaterials.map((material) => (
                                    <div
                                      key={material.id}
                                      className="text-xs bg-muted/50 p-2 rounded flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {material.materialCategory ===
                                          "fertilizer"
                                            ? "Phân"
                                            : material.materialCategory ===
                                                "pesticide"
                                              ? "Thuốc"
                                              : "Khác"}
                                        </Badge>
                                        <span className="font-medium">
                                          {material.materialName}
                                        </span>
                                        <span className="text-muted-foreground">
                                          ({material.materialType})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                          {material.quantity} {material.unit}
                                        </span>
                                        <span className="text-muted-foreground">
                                          - {material.packaging}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {cycles.map((cycle) => {
                  const cycleMaterials = plan.materialAllocations.filter(
                    (m) => m.cycle === cycle,
                  );
                  return cycleMaterials.length > 0 ? (
                    <TabsContent
                      key={cycle}
                      value={cycle}
                      className="space-y-2 mt-4"
                    >
                      {Array.from(
                        new Set(cycleMaterials.map((m) => m.stage)),
                      ).map((stage) => {
                        const stageMaterials = cycleMaterials.filter(
                          (m) => m.stage === stage,
                        );
                        return (
                          <div
                            key={stage}
                            className="border-l-2 border-primary/20 pl-3"
                          >
                            <p className="text-sm font-medium mb-1">{stage}</p>
                            <div className="space-y-1">
                              {stageMaterials.map((material) => (
                                <div
                                  key={material.id}
                                  className="text-xs bg-muted/50 p-2 rounded flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {material.materialCategory ===
                                      "fertilizer"
                                        ? "Phân"
                                        : material.materialCategory ===
                                            "pesticide"
                                          ? "Thuốc"
                                          : "Khác"}
                                    </Badge>
                                    <span className="font-medium">
                                      {material.materialName}
                                    </span>
                                    <span className="text-muted-foreground">
                                      ({material.materialType})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {material.quantity} {material.unit}
                                    </span>
                                    <span className="text-muted-foreground">
                                      - {material.packaging}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                  ) : null;
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
