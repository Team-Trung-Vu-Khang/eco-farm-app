import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  Apple,
  Bug,
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
import useRegionStore from "@/stores/useRegionStore";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useSeasonStore from "@/stores/useSeasonStore";
import useRegimenStore from "../../stores/useRegimenStore";
import { cn } from "@tankhang1/eco-shared-ui";

export default function PlanDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Zustand stores
  const getPlanById = usePlanStore((state) => state.getPlanById);
  const deletePlan = usePlanStore((state) => state.deletePlan);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const { seasons } = useSeasonStore();
  const regimens = useRegimenStore((state) => state.regimens);

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

  const getTaskSelectionSummary = useCallback(
    (taskSelections: any[] | undefined) => {
      if (!regions || !taskSelections) return [];

      const summary: {
        regionId: string;
        regionName: string;
        items: { type: "region" | "area" | "plot"; name: string }[];
      }[] = [];

      taskSelections.forEach((sel) => {
        const region = regions.find(
          (r) => String(r.id) === String(sel.regionId),
        );
        if (!region) return;

        let regionGroup = summary.find((s) => s.regionId === String(region.id));
        if (!regionGroup) {
          regionGroup = {
            regionId: String(region.id),
            regionName: region.name,
            items: [],
          };
          summary.push(regionGroup);
        }

        if (sel.type === "region") {
          regionGroup.items.push({ type: "region", name: "Toàn bộ vùng" });
        } else if (sel.type === "area") {
          const area = region.subAreas?.find(
            (a) => String(a.id) === String(sel.areaId),
          );
          if (area) regionGroup.items.push({ type: "area", name: area.name });
        } else if (sel.type === "plot") {
          const area = region.subAreas?.find(
            (a) => String(a.id) === String(sel.areaId),
          );
          const plot = area?.plots?.find(
            (p) => String(p.id) === String(sel.plotId),
          );
          if (plot) regionGroup.items.push({ type: "plot", name: plot.name });
        }
      });
      return summary;
    },
    [regions],
  );

  // Enhanced Location Details using selectionSummary logic
  const selectionSummary = useMemo(() => {
    if (!plan || !regions) return [];
    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    // Reconstruct selections from plan data to reuse summary logic
    const selections: {
      regionId: string;
      type: string;
      areaId?: string;
      plotId?: string;
    }[] = [];

    if (!plan.selectedRegionIds) return [];

    plan.selectedRegionIds.forEach((rid) => {
      const region = regions.find((r) => String(r.id) === String(rid));

      // Check if whole region was selected
      const hasZonesSelected = plan.selectedZoneIds?.some((zid) => {
        return region?.subAreas?.some((sa) => sa.id === zid);
      });

      if (!hasZonesSelected) {
        selections.push({ regionId: rid, type: "region" });
      } else {
        // Find selected areas and plots
        // Region is already found above
        region?.subAreas?.forEach((sa) => {
          if (plan.selectedZoneIds?.includes(sa.id)) {
            const hasPlotsSelected = plan.selectedPlotIds?.some((pid) =>
              sa.plots?.some((p) => p.id === pid),
            );

            if (!hasPlotsSelected) {
              selections.push({ regionId: rid, type: "area", areaId: sa.id });
            } else {
              sa.plots?.forEach((p) => {
                if (plan.selectedPlotIds?.includes(p.id)) {
                  selections.push({
                    regionId: rid,
                    type: "plot",
                    areaId: sa.id,
                    plotId: p.id,
                  });
                }
              });
            }
          }
        });
      }
    });

    selections.forEach((sel) => {
      const region = regions.find((r) => String(r.id) === String(sel.regionId));
      if (!region) return;

      let regionGroup = summary.find((s) => s.regionId === String(region.id));
      if (!regionGroup) {
        regionGroup = {
          regionId: String(region.id),
          regionName: region.name,
          items: [],
        };
        summary.push(regionGroup);
      }

      if (sel.type === "region") {
        regionGroup.items.push({
          type: "region",
          id: String(region.id),
          name: "Toàn bộ vùng",
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        if (area)
          regionGroup.items.push({
            type: "area",
            id: String(area.id),
            name: area.name,
          });
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p) => String(p.id) === String(sel.plotId),
        );
        if (plot)
          regionGroup.items.push({
            type: "plot",
            id: String(plot.id),
            name: plot.name,
            parentName: area?.name,
          });
      }
    });

    return summary;
  }, [plan, regions]);

  const totalArea = useMemo(() => {
    if (!plan || !regions || regions.length === 0) return "0.0";

    let total = 0;
    const regionIds = plan.selectedRegionIds || [];
    const zoneIds = plan.selectedZoneIds || [];
    const plotIds = plan.selectedPlotIds || [];

    regionIds.forEach((rid) => {
      const region = regions.find((r) => String(r.id) === String(rid));
      if (!region) return;

      const regionZoneIds = region.subAreas?.map((sa) => sa.id) || [];
      const isWholeRegion =
        regionZoneIds.length > 0 &&
        regionZoneIds.every((zid) => zoneIds.includes(zid));

      if (isWholeRegion) {
        total += region.area || 0;
      } else {
        region.subAreas?.forEach((sa) => {
          if (zoneIds.includes(sa.id)) {
            const zonePlotIds = sa.plots?.map((p) => p.id) || [];
            const isWholeArea =
              zonePlotIds.length > 0 &&
              zonePlotIds.every((pid) => plotIds.includes(pid));

            if (isWholeArea) {
              total += sa.area || 0;
            } else {
              sa.plots?.forEach((p) => {
                if (plotIds.includes(p.id)) {
                  total += p.area || 0;
                }
              });
            }
          }
        });
      }
    });

    return total.toFixed(1);
  }, [plan, regions]);

  return (
    <AdminLayout
      title="Chi tiết kế hoạch"
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
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/80">
              <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                <Sprout className="w-5 h-5" />
                Thông tin chung
                {(plan.purpose === "treatment" ||
                  plan.purpose === "amendment" ||
                  plan.purpose === "harvest") && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-auto font-bold uppercase",
                      plan.purpose === "treatment"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : plan.purpose === "harvest"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-amber-100 text-amber-800 border-amber-200",
                    )}
                  >
                    {plan.purpose === "treatment"
                      ? "KẾ HOẠCH ĐIỀU TRỊ"
                      : plan.purpose === "harvest"
                        ? "KẾ HOẠCH THU HOẠCH"
                        : "KẾ HOẠCH CẢI TẠO"}
                  </Badge>
                )}
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
                {plan.purpose === "cultivation" ? (
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Quy trình
                    </label>
                    <p className="font-medium mt-1 text-slate-800">
                      Đã chọn {(plan.selectedStages || []).length} giai đoạn
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {plan.purpose === "amendment"
                        ? "Phác đồ cải tạo đất"
                        : plan.purpose === "harvest"
                          ? "Mục đích"
                          : "Phác đồ điều trị"}
                    </label>
                    <p
                      className={cn(
                        "font-bold mt-1",
                        plan.purpose === "amendment"
                          ? "text-amber-900"
                          : plan.purpose === "harvest"
                            ? "text-orange-900"
                            : "text-blue-900",
                      )}
                    >
                      {plan.purpose === "harvest"
                        ? "Kế hoạch thu hoạch"
                        : regimens.find((r) => r.id === plan.regimenId)?.name ||
                          "Chưa chọn phác đồ"}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Trạng thái
                  </label>
                  <div className="mt-1">{getStatusBadge(plan.status)}</div>
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
            <CardContent className="pt-4 space-y-5 px-6">
              <div className="space-y-4">
                <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                  Chi tiết phạm vi canh tác
                </label>
                <div className="space-y-3">
                  {selectionSummary.length === 0 && (
                    <p className="text-sm italic text-slate-400">
                      Chưa xác định vùng chọn
                    </p>
                  )}
                  {selectionSummary.map((group) => (
                    <div
                      key={group.regionId}
                      className="space-y-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {group.regionName}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-0">
                        {group.items.map((item, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={cn(
                              "text-[10px] py-0 px-2 h-5 font-medium shadow-xs border-emerald-100 bg-white",
                              item.type === "region" &&
                                "bg-emerald-50 text-emerald-800",
                              item.type === "area" &&
                                "bg-blue-50 text-blue-700 border-blue-100",
                            )}
                          >
                            <span className="opacity-70 mr-1 uppercase text-[8px] font-black">
                              {item.type === "region"
                                ? "Vùng"
                                : item.type === "area"
                                  ? "Khu"
                                  : "Lô"}
                            </span>
                            {item.name}
                            {item.parentName && (
                              <span className="ml-1 opacity-50 font-normal italic">
                                ({item.parentName})
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div>
                  <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                    Tổng diện tích
                  </p>
                  <p className="text-xl font-black text-emerald-800">
                    {totalArea} ha
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                    Sản lượng dự kiến
                  </p>
                  <p className="text-xl font-black text-emerald-800">
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
            {(() => {
              const Icon =
                plan.purpose === "treatment"
                  ? Bug
                  : plan.purpose === "amendment"
                    ? Sprout
                    : plan.purpose === "harvest"
                      ? Apple
                      : Layers;
              return (
                <div
                  className={cn(
                    "p-2.5 rounded-2xl shadow-sm",
                    plan.purpose === "treatment" && "bg-blue-100/50",
                    plan.purpose === "amendment" && "bg-amber-100/50",
                    plan.purpose === "harvest" && "bg-orange-100/50",
                    plan.purpose === "cultivation" && "bg-emerald-100/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-7 h-7",
                      plan.purpose === "treatment" && "text-blue-600",
                      plan.purpose === "amendment" && "text-amber-600",
                      plan.purpose === "harvest" && "text-orange-600",
                      plan.purpose === "cultivation" && "text-emerald-600",
                    )}
                  />
                </div>
              );
            })()}
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {plan.purpose === "treatment"
                  ? "Lộ trình xử lý & Phác đồ"
                  : plan.purpose === "amendment"
                    ? "Lộ trình cải tạo & Quy trình"
                    : plan.purpose === "harvest"
                      ? "Lịch trình thu hoạch"
                      : "Lộ trình triển khai & Giai đoạn"}
              </h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                Chi tiết các hạng mục và kế hoạch hành động
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(plan.selectedStages || []).map((stageKey, index) => {
              const [cycleId, stageName] = stageKey.includes(":")
                ? stageKey.split(":")
                : [null, stageKey];
              const cycle = cycleId
                ? growthCycles.find((c) => c.id === cycleId)
                : null;

              // Filter allocations for this stage
              const stageMaterials = (plan.materialAllocations || []).filter(
                (m) => m.stageId === stageKey,
              );
              const stageTasks =
                plan.taskAllocations?.filter((t) => t.stageId === stageKey) ||
                [];

              return (
                <Card
                  key={stageKey}
                  className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
                >
                  <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center font-black text-sm text-slate-700">
                        {index + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900">
                            {stageName}
                          </h4>
                          {cycle && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-2 h-4"
                            >
                              {cycle.name}
                            </Badge>
                          )}
                        </div>
                        {plan.purpose !== "cultivation" && (
                          <p
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              plan.purpose === "amendment"
                                ? "text-amber-600"
                                : plan.purpose === "harvest"
                                  ? "text-orange-600"
                                  : "text-blue-600",
                            )}
                          >
                            {plan.purpose === "amendment"
                              ? "Hoạt động cải tạo đất"
                              : plan.purpose === "harvest"
                                ? "Hoạt động thu hoạch"
                                : "Hoạt động điều trị bệnh"}
                          </p>
                        )}
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
                                    {/* Geographical summary for the task item */}
                                    {task.geographicalSelections &&
                                      task.geographicalSelections.length >
                                        0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-blue-50/50 mt-2">
                                          {getTaskSelectionSummary(
                                            task.geographicalSelections,
                                          ).map((group) => (
                                            <div
                                              key={group.regionId}
                                              className="flex flex-col gap-1 border-l-2 border-blue-100 pl-2 py-0.5"
                                            >
                                              <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                {group.regionName}
                                              </div>
                                              <div className="flex flex-wrap gap-1">
                                                {group.items.map(
                                                  (item, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="outline"
                                                      className={cn(
                                                        "text-[9px] py-0 px-1.5 h-4 font-medium border-slate-200 shadow-none bg-white",
                                                        item.type ===
                                                          "region" &&
                                                          "text-emerald-700 bg-emerald-50/50",
                                                        item.type === "area" &&
                                                          "text-blue-700 bg-blue-50/50",
                                                      )}
                                                    >
                                                      {item.name}
                                                    </Badge>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
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
                    {(plan.selectedStages || []).length}
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
                    {(plan.materialAllocations || []).length}
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
