import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Layers,
  Leaf,
  MapPin,
  Package,
  Sprout,
  Users,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DeleteDialog,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "@tankhang1/eco-shared-ui";
import usePlanStore from "../../stores/usePlanStore";
import { GROWTH_CYCLES, TREATMENT_REGIMENS } from "./constants";

// Mock Data to match Create Page logic for display lookup
const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng canh tác Sầu riêng Ri6 - Bình Phước",
    zones: [
      {
        id: "zone-1-1",
        name: "Khu vực A1",
        plots: [
          {
            id: "plot-1-1-1",
            name: "Lô A1-01",
            area: 1.5,
            soilType: "Đất đỏ Bazan",
          },
          {
            id: "plot-1-1-2",
            name: "Lô A1-02",
            area: 2.0,
            soilType: "Đất thịt nhẹ",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng canh tác Sầu riêng Monthong - Bình Phước",
    zones: [
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Lô A2-01",
            area: 1.2,
            soilType: "Đất đỏ Bazan",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng canh tác Xoài Cát Hòa Lộc - Đồng Nai",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Lô B1-01",
            area: 2.5,
            soilType: "Đất xám",
          },
        ],
      },
    ],
  },
];

export default function PlanDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Zustand store
  const getPlanById = usePlanStore((state) => state.getPlanById);
  const deletePlan = usePlanStore((state) => state.deletePlan);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const plan = getPlanById(Number(params.id));

  useEffect(() => {
    if (!plan) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation("/plan");
    }
  }, [plan, toast, setLocation]);

  if (!plan) {
    return null;
  }

  const handleEdit = () => {
    setLocation(`/plan/${params.id}/edit`);
  };

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePlan(plan.id);
    toast({
      title: "Thành công",
      description: "Đã xóa kế hoạch",
    });
    setLocation("/plan");
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

  // Helper to find location details
  const getLocationDetails = () => {
    // Try to find by ID first if logic exists, otherwise fallback or assume IDs match mock
    if (plan.selectedRegionId) {
      const region = LOCATIONS.find((r) => r.id === plan.selectedRegionId);
      if (region) {
        const zone = region.zones.find((z) =>
          plan.selectedZoneIds?.includes(z.id),
        );
        const plots = zone?.plots.filter((p) =>
          plan.selectedPlotIds?.includes(p.id),
        );
        return {
          regionName: region.name,
          zoneName: zone?.name || "",
          plotNames: plots?.map((p) => p.name).join(", ") || "",
          soilType: plots?.[0]?.soilType || "",
        };
      }
    }
    // Fallback to text fields stored in plan
    return {
      regionName: "Chưa cập nhật", // Plan doesn't store 'region' text field explicitly in detail view usually
      zoneName: plan.zone || "Chưa cập nhật",
      plotNames: plan.plot || "Chưa cập nhật",
      soilType: "Đất đỏ Bazan", // Mock default
    };
  };

  const locDetails = getLocationDetails();

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
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  {plan.name}
                  {getStatusBadge(plan.status)}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" /> Mã: {plan.code}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Ngày tạo: {plan.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {plan.description && (
              <p className="text-muted-foreground bg-slate-50 p-4 rounded-lg italic border border-slate-100">
                "{plan.description}"
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin chung */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/80">
              <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                <Sprout className="w-5 h-5" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Mùa vụ
                  </label>
                  <p className="font-medium mt-1 text-slate-800">
                    {plan.seasonName}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Cây trồng
                  </label>
                  <p className="font-medium mt-1 text-slate-800">
                    {plan.crop} - {plan.variety}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Quy trình
                  </label>
                  <p
                    className="font-medium mt-1 text-slate-800 truncate"
                    title={
                      GROWTH_CYCLES.find((c) => c.id === plan.growthCycleId)
                        ?.name || "Tùy chỉnh"
                    }
                  >
                    {GROWTH_CYCLES.find((c) => c.id === plan.growthCycleId)
                      ?.name || "Tùy chỉnh"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Phác đồ điều trị
                  </label>
                  <p
                    className="font-medium mt-1 text-slate-800 truncate"
                    title={
                      TREATMENT_REGIMENS.find((r) => r.id === plan.regimenId)
                        ?.name || "Không áp dụng"
                    }
                  >
                    {TREATMENT_REGIMENS.find((r) => r.id === plan.regimenId)
                      ?.name || "Không áp dụng"}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                  Thời gian thực hiện
                </label>
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-blue-900">
                      {plan.startDate} - {plan.endDate}
                    </p>
                    <p className="text-xs text-blue-600">
                      Thời gian dự kiến theo kế hoạch
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin canh tác */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/80">
              <CardTitle className="text-base flex items-center gap-2 text-green-700">
                <MapPin className="w-5 h-5" />
                Thông tin canh tác
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Vùng canh tác
                </label>
                <p className="font-medium mt-1 flex items-start gap-2 text-slate-800">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  {locDetails.regionName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Khu vực / Lô
                  </label>
                  <p className="font-medium mt-1 text-slate-800">
                    {locDetails.zoneName} - {locDetails.plotNames}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Loại đất
                  </label>
                  <p className="font-medium mt-1 text-slate-800">
                    {locDetails.soilType}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-green-50/50 p-3 rounded-lg border border-green-100">
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase">
                    Diện tích
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    {plan.area || "0"} ha
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase">
                    Sản lượng dự kiến
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    {plan.expectedYield || "0"} tấn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quy trình canh tác (Stages) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Quy trình canh tác
              </h3>
              <p className="text-sm text-muted-foreground">
                Chi tiết các giai đoạn, vật tư và công việc
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {plan.selectedStages.map((stage, index) => {
              // Filter allocations for this stage
              const stageMaterials = plan.materialAllocations.filter(
                (m) => m.stageId === stage,
              );
              const stageTasks =
                plan.taskAllocations?.filter((t) => t.stageId === stage) || [];

              return (
                <Card
                  key={stage}
                  className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-slate-50 px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border shadow-sm flex items-center justify-center font-bold text-sm text-slate-700">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-800">
                          {stage}
                        </h4>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <Badge
                        variant="outline"
                        className="bg-white hover:bg-green-50 transition-colors"
                      >
                        <Leaf className="w-3 h-3 mr-1 text-green-600" />
                        {stageMaterials.length} vật tư
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-white hover:bg-blue-50 transition-colors"
                      >
                        <Users className="w-3 h-3 mr-1 text-blue-600" />
                        {stageTasks.length} công việc
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-0">
                    {stageMaterials.length === 0 && stageTasks.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground italic">
                        Chưa có hoạt động nào được lên kế hoạch cho giai đoạn
                        này.
                      </div>
                    ) : (
                      <Tabs defaultValue="materials" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                          <TabsTrigger
                            value="materials"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                          >
                            <Leaf className="w-4 h-4 mr-2" />
                            Vật tư ({stageMaterials.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="tasks"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Công việc ({stageTasks.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="materials"
                          className="p-4 m-0 bg-white"
                        >
                          {stageMaterials.length === 0 ? (
                            <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">
                                Chưa có vật tư phân bổ
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {stageMaterials.map((mat) => (
                                <div
                                  key={mat.id}
                                  className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/30 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-white p-2 rounded-md shadow-sm border shrink-0">
                                      <Package className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-sm truncate text-slate-800">
                                        {mat.materialName}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {mat.materialCategory} •{" "}
                                        {mat.materialType}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 pl-2">
                                    <Badge variant="secondary" className="mb-1">
                                      {mat.quantity} {mat.unit}
                                    </Badge>
                                    {mat.packaging && (
                                      <p className="text-[10px] text-muted-foreground">
                                        {mat.packaging}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="tasks" className="p-4 m-0 bg-white">
                          {stageTasks.length === 0 ? (
                            <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">
                                Chưa có công việc phân bổ
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3">
                              {stageTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-start gap-4 p-4 rounded-lg border bg-blue-50/10 hover:bg-blue-50/30 transition-colors"
                                >
                                  <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                      <h5 className="font-bold text-sm text-slate-900">
                                        {task.name}
                                      </h5>
                                      <div className="flex gap-2 shrink-0">
                                        {task.labor && (
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] h-5 bg-white text-slate-600 border-slate-200"
                                          >
                                            <Users className="w-3 h-3 mr-1" />{" "}
                                            {task.labor}
                                          </Badge>
                                        )}
                                        {task.duration && (
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200"
                                          >
                                            <Clock className="w-3 h-3 mr-1" />{" "}
                                            {task.duration}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                      {task.description ||
                                        "Chưa có mô tả chi tiết"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-slate-900 text-slate-50 border-none shadow-lg mt-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Tổng giai đoạn
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-4xl font-bold">
                    {plan.selectedStages.length}
                  </span>
                  <span className="text-slate-500 font-medium">bước</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Tổng vật tư
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-4xl font-bold text-green-400">
                    {plan.materialAllocations.length}
                  </span>
                  <span className="text-slate-500 font-medium">mục</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Tổng công việc
                </p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-4xl font-bold text-blue-400">
                    {plan.taskAllocations?.length || 0}
                  </span>
                  <span className="text-slate-500 font-medium">đầu việc</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Trạng thái
                </p>
                <div className="flex justify-center md:justify-start">
                  {getStatusBadge(plan.status)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
