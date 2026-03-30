/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Layers,
  Leaf,
  Package,
  ShoppingBag,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import type { Plan } from "../../../../../stores/usePlanStore";
import type { Task } from "../../../../../stores/useTaskStore";
import type {
  CropDetailPlanSelection,
  RegionOption,
} from "./types";

type CropDetailPlansTabProps = {
  baseRelevantPlans: Plan[];
  relevantPlans: Plan[];
  planFilter: Plan["purpose"];
  setPlanFilter: (value: Plan["purpose"]) => void;
  incurredTasks: Task[];
  regions: RegionOption[];
  growthCycles: Array<{ id: string; name: string }>;
  onNavigateToPlans: () => void;
  onOpenTask: (task: Task) => void;
};

const PLAN_PURPOSE_CONFIG: Record<
  Plan["purpose"],
  {
    label: string;
    activeClassName: string;
    cardClassName: string;
    icon: typeof Layers;
    description: string;
  }
> = {
  cultivation: {
    label: "Canh tác",
    activeClassName: "data-[state=active]:bg-blue-600",
    cardClassName: "border-blue-500 bg-blue-50/50 ring-blue-500/5",
    icon: Layers,
    description: "Áp dụng quy trình sản xuất chuẩn",
  },
  treatment: {
    label: "Điều trị",
    activeClassName: "data-[state=active]:bg-red-600",
    cardClassName: "border-red-500 bg-red-50/50 ring-red-500/5",
    icon: Bug,
    description: "Triển khai phác đồ xử lý sâu bệnh",
  },
  amendment: {
    label: "Cải tạo",
    activeClassName: "data-[state=active]:bg-emerald-600",
    cardClassName: "border-emerald-500 bg-emerald-50/50 ring-emerald-500/5",
    icon: Sprout,
    description: "Quy trình xử lý phục hồi đất đai",
  },
  harvest: {
    label: "Thu hoạch",
    activeClassName: "data-[state=active]:bg-indigo-600",
    cardClassName: "border-indigo-500 bg-indigo-50/50 ring-indigo-500/5",
    icon: ShoppingBag,
    description: "Triển khai thu hoạch và bảo quản",
  },
  incurred: {
    label: "Phát sinh",
    activeClassName: "data-[state=active]:bg-amber-600",
    cardClassName: "border-amber-500 bg-amber-50/50 ring-amber-500/5",
    icon: AlertTriangle,
    description: "Công việc phát sinh ngoài kế hoạch",
  },
};

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

const planStatusBadge = (status: Plan["status"]) => {
  const config: Record<Plan["status"], { label: string; className: string }> = {
    draft: { label: "Bản nháp", className: "bg-slate-200 text-slate-700" },
    active: { label: "Đang thực hiện", className: "bg-primary text-white" },
    completed: { label: "Hoàn thành", className: "bg-green-600 text-white" },
    cancelled: { label: "Đã hủy", className: "bg-red-500 text-white" },
  };
  const item = config[status] || config.draft;
  return <Badge className={cn("border-none", item.className)}>{item.label}</Badge>;
};

const getSelectionSummary = (
  selections: CropDetailPlanSelection[],
  regions: RegionOption[],
) => {
  if (!selections?.length) return [];

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

  selections.forEach((selection) => {
    const region = regions.find(
      (item) => String(item.id) === String(selection.regionId),
    );
    if (!region) return;

    let group = summary.find(
      (item) => String(item.regionId) === String(selection.regionId),
    );
    if (!group) {
      group = {
        regionId: String(selection.regionId),
        regionName: region.name,
        items: [],
      };
      summary.push(group);
    }

    if (selection.type === "region") {
      group.items.push({
        type: "region",
        id: selection.id,
        name: `Toàn bộ vùng ${region.name}`,
      });
      return;
    }

    if (selection.type === "area") {
      const area = region.subAreas?.find(
        (item) => String(item.id) === String(selection.areaId),
      );
      group.items.push({
        type: "area",
        id: selection.id,
        name: `Khu vực ${area?.name || selection.areaId}`,
      });
      return;
    }

    const area = region.subAreas?.find(
      (item) => String(item.id) === String(selection.areaId),
    );
    const plot = area?.plots?.find(
      (item) => String(item.id) === String(selection.plotId),
    );
    group.items.push({
      type: "plot",
      id: selection.id,
      name: `Lô ${plot?.name || selection.plotId}`,
      parentName: area?.name,
    });
  });

  return summary;
};

const renderSelectionBadges = (
  selections: CropDetailPlanSelection[],
  regions: RegionOption[],
  emptyLabel: string,
) => {
  const geoSummary = getSelectionSummary(selections, regions);
  if (geoSummary.length === 0) {
    return <span className="text-[10px] italic text-slate-400">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {geoSummary.map((group) =>
        group.items.map((item, index) => (
          <Badge
            key={`${group.regionId}-${index}`}
            variant="outline"
            className={cn(
              "h-4 border-slate-100 py-0 text-[9px] font-bold",
              item.type === "region"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600",
            )}
          >
            {item.name}
          </Badge>
        )),
      )}
    </div>
  );
};

const IncurredTasksOverview = ({
  incurredTasks,
  regions,
  onOpenTask,
}: {
  incurredTasks: Task[];
  regions: RegionOption[];
  onOpenTask: (task: Task) => void;
}) => {
  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 shadow-sm shadow-amber-200/50">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight text-slate-800">
                Tổng hợp công việc phát sinh
              </CardTitle>
              <CardDescription className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Dữ liệu nhiệm vụ thực tế từ hệ thống quản lý công việc
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="rounded-xl border-amber-200 bg-amber-50 px-4 py-1.5 font-black text-amber-700 shadow-sm"
          >
            {incurredTasks.length} NHIỆM VỤ
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {incurredTasks.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-slate-50 shadow-inner">
              <CheckCircle2 className="h-10 w-10 text-slate-200" />
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-800">
              Chưa có dữ liệu công việc
            </h4>
            <p className="mx-auto max-w-[300px] text-sm font-medium text-slate-400">
              Không tìm thấy nhiệm vụ nào được ghi nhận cho các kế hoạch phát sinh
              trong vùng canh tác này.
            </p>
          </div>
        ) : (
          <div className="bg-white">
            <DataTable
              columns={[
                { key: "code", label: "Mã" },
                { key: "name", label: "Tên công việc" },
                {
                  key: "geographicalSelections",
                  label: "Phạm vi",
                  render: (value: CropDetailPlanSelection[]) =>
                    renderSelectionBadges(value || [], regions, "Chưa xác định"),
                },
                { key: "plan", label: "Kế hoạch" },
                { key: "stage", label: "Giai đoạn" },
                {
                  key: "assignedTo",
                  label: "Phân công",
                  render: (value: string | string[], row: Task) => (
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "shrink-0 rounded-lg p-1.5",
                          row.assignedType === "team"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600",
                        )}
                      >
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <span className="max-w-[150px] truncate text-[11px] font-bold text-slate-600">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "priority",
                  label: "Ưu tiên",
                  render: (value: string) => (
                    <Badge
                      variant={
                        value === "high"
                          ? "destructive"
                          : value === "medium"
                            ? "default"
                            : "outline"
                      }
                      className="border-none px-2.5 py-0.5 text-[10px] font-black tracking-wider shadow-sm"
                    >
                      {value === "high"
                        ? "CAO"
                        : value === "medium"
                          ? "TRUNG BÌNH"
                          : "THẤP"}
                    </Badge>
                  ),
                },
                {
                  key: "status",
                  label: "Trạng thái",
                  render: (value: string) => {
                    const statusConfig: Record<
                      string,
                      { label: string; variant: "secondary" | "default" | "destructive" | "outline" }
                    > = {
                      completed: { label: "HOÀN THÀNH", variant: "secondary" },
                      "in-progress": { label: "ĐANG CHẠY", variant: "default" },
                      overdue: { label: "QUÁ HẠN", variant: "destructive" },
                      pending: { label: "CHỜ DUYỆT", variant: "outline" },
                    };
                    const config = statusConfig[value] || statusConfig.pending;
                    return (
                      <Badge
                        variant={config.variant}
                        className="border-none px-2.5 py-0.5 text-[10px] font-black tracking-wider shadow-sm"
                      >
                        {config.label}
                      </Badge>
                    );
                  },
                },
                { key: "startDate", label: "Bắt đầu" },
                { key: "endDate", label: "Kết thúc" },
              ]}
              data={incurredTasks}
              onView={onOpenTask}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StageDetails = ({
  plan,
  regions,
  growthCycles,
}: {
  plan: Plan;
  regions: RegionOption[];
  growthCycles: Array<{ id: string; name: string }>;
}) => {
  const stageOrder =
    plan.selectedStages && plan.selectedStages.length > 0
      ? plan.selectedStages
      : Array.from(
          new Set([
            ...(plan.taskAllocations || []).map((task: any) => task.stageId || "Khác"),
            ...(plan.materialAllocations || []).map(
              (material: any) => material.stageId || "Khác",
            ),
          ]),
        );

  return (
    <>
      {stageOrder.map((stageKey, index) => {
        const [cycleId, stageName] = stageKey.includes(":")
          ? stageKey.split(":")
          : [null, stageKey];
        const cycle = cycleId
          ? growthCycles.find((item) => item.id === cycleId)
          : null;
        const stageMaterials = (plan.materialAllocations || []).filter(
          (material: any) => material.stageId === stageKey,
        );
        const stageTasks =
          plan.taskAllocations?.filter((task: any) => task.stageId === stageKey) || [];
        const isAmendment = plan.purpose === "amendment";

        return (
          <Card
            key={stageKey}
            className="overflow-hidden rounded-2xl border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-sm font-black text-slate-700 shadow-xs">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-base font-bold text-slate-900">
                      {stageName}
                    </h4>
                    {cycle && (
                      <Badge
                        variant="outline"
                        className="h-4 shrink-0 border-emerald-100 bg-emerald-50 px-2 py-0 text-[10px] font-normal text-emerald-700"
                      >
                        {cycle.name}
                      </Badge>
                    )}
                  </div>
                  {plan.purpose !== "cultivation" && plan.purpose !== "harvest" && (
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isAmendment ? "text-emerald-600" : "text-red-600",
                      )}
                    >
                      {isAmendment ? "Hoạt động cải tạo đất" : "Hoạt động điều trị bệnh"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Badge
                  variant="outline"
                  className="bg-white px-2 py-0.5 transition-colors hover:bg-green-50"
                >
                  <Leaf className="mr-1 h-3 w-3 text-green-600" />
                  {stageMaterials.length}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white px-2 py-0.5 transition-colors hover:bg-blue-50"
                >
                  <Users className="mr-1 h-3 w-3 text-blue-600" />
                  {stageTasks.length}
                </Badge>
              </div>
            </div>

            <CardContent className="p-0">
              {stageMaterials.length === 0 && stageTasks.length === 0 ? (
                <div className="p-8 text-center text-sm italic text-muted-foreground">
                  Chưa có chi tiết nào được lên kế hoạch.
                </div>
              ) : (
                <Tabs defaultValue="tasks" className="w-full">
                  <TabsList className="mb-4 flex h-auto items-center justify-start gap-4 rounded-none border-b bg-transparent p-0 no-scrollbar">
                    <TabsTrigger
                      value="tasks"
                      className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:border-blue-600 data-[state=active]:text-blue-700"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Công việc ({stageTasks.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="materials"
                      className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700"
                    >
                      <Package className="h-3.5 w-3.5" />
                      Vật tư ({stageMaterials.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tasks" className="m-0 bg-white anim-fade-in">
                    {stageTasks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed bg-slate-50/50 py-10 text-center">
                        <Wrench className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-sm font-medium text-slate-500">
                          Chưa có công việc phân bổ
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                        <table className="min-w-[600px] w-full border-collapse text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                              <th className="whitespace-nowrap px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Nội dung
                              </th>
                              <th className="whitespace-nowrap px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Phạm vi
                              </th>
                              <th className="whitespace-nowrap px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Nhân sự
                              </th>
                              <th className="whitespace-nowrap px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Thời gian
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {stageTasks.map((task: any) => (
                              <tr
                                key={task.id}
                                className="group transition-colors hover:bg-blue-50/30"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-colors group-hover:bg-white">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="lines-1 text-xs font-bold text-slate-800">
                                        {task.name}
                                      </p>
                                      <p className="max-w-[200px] truncate text-[10px] italic text-slate-400">
                                        {task.description || "Máy móc & Thiết bị..."}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {renderSelectionBadges(
                                    task.geographicalSelections || [],
                                    regions,
                                    "Toàn vùng",
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">
                                      {task.labor || "Đội ngũ"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Badge
                                    variant="outline"
                                    className="border-slate-200 bg-white px-2 py-0 text-[10px] font-bold text-slate-500"
                                  >
                                    {task.duration}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="materials" className="m-0 bg-white anim-fade-in">
                    {stageMaterials.length === 0 ? (
                      <div className="rounded-2xl border border-dashed bg-slate-50/50 py-10 text-center">
                        <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-sm font-medium text-slate-500">
                          Chưa có vật tư phân bổ
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2">
                        {stageMaterials.map((material: any) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:bg-emerald-50/30 hover:shadow-md"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="shrink-0 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 shadow-sm">
                                <Package className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="truncate text-xs font-extrabold text-slate-800">
                                  {material.materialName}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600/70">
                                  {material.materialType}
                                </p>
                              </div>
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
    </>
  );
};

const IncurredPlanDetails = ({
  plan,
  regions,
}: {
  plan: Plan;
  regions: RegionOption[];
}) => {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="mb-4 flex h-auto items-center justify-start gap-4 rounded-none border-b bg-transparent p-0 no-scrollbar">
        <TabsTrigger
          value="tasks"
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:border-amber-600 data-[state=active]:text-amber-700"
        >
          <Users className="h-3.5 w-3.5" />
          Nhiệm vụ ({plan.taskAllocations?.length || 0})
        </TabsTrigger>
        <TabsTrigger
          value="materials"
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700"
        >
          <Package className="h-3.5 w-3.5" />
          Vật tư ({plan.materialAllocations?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="m-0 bg-white anim-fade-in">
        {!plan.taskAllocations?.length ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/30 py-12 text-center">
            <p className="text-xs italic text-slate-400">Chưa có nhiệm vụ cụ thể</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <DataTable
              columns={[
                { key: "code", label: "Mã" },
                { key: "name", label: "Tên công việc" },
                {
                  key: "geographicalSelections",
                  label: "Phạm vi",
                  render: (value: CropDetailPlanSelection[]) =>
                    renderSelectionBadges(value || [], regions, "Toàn bộ kế hoạch"),
                },
                {
                  key: "assignedTo",
                  label: "Phân công",
                  render: (value: string | string[], row: any) => (
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "shrink-0 rounded-lg p-1.5",
                          row.assignedType === "team"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600",
                        )}
                      >
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <span className="max-w-[120px] truncate text-[11px] font-bold text-slate-600">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "priority",
                  label: "Ưu tiên",
                  render: () => (
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-white px-2 py-0 text-[10px] font-bold text-slate-500"
                    >
                      Trung bình
                    </Badge>
                  ),
                },
                {
                  key: "status",
                  label: "Trạng thái",
                  render: () => (
                    <Badge
                      variant="default"
                      className="border-none bg-blue-600 px-2 py-0 text-[10px] font-bold text-white"
                    >
                      Đang thực hiện
                    </Badge>
                  ),
                },
                { key: "startDate", label: "Bắt đầu" },
                { key: "endDate", label: "Kết thúc" },
              ]}
              data={
                plan.taskAllocations?.map((task: any) => ({
                  ...task,
                  code: `${plan.code}-${task.id}`,
                  startDate: formatDate(plan.startDate),
                  endDate: formatDate(plan.endDate),
                })) || []
              }
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="materials" className="m-0 bg-white anim-fade-in">
        {!plan.materialAllocations?.length ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/30 py-12 text-center">
            <p className="text-xs italic text-slate-400">Không sử dụng vật tư</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2">
            {plan.materialAllocations.map((material: any) => (
              <div
                key={material.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:bg-emerald-50/30 hover:shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="shrink-0 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5">
                    <Package className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-extrabold text-slate-800">
                      {material.materialName}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600/70">
                      {material.materialType}
                    </p>
                  </div>
                </div>
                <div className="pl-2 text-right">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-black text-slate-900">
                      {material.quantity}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-400">
                      {material.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

const PlanCard = ({
  plan,
  regions,
  growthCycles,
}: {
  plan: Plan;
  regions: RegionOption[];
  growthCycles: Array<{ id: string; name: string }>;
}) => {
  const config = PLAN_PURPOSE_CONFIG[plan.purpose];
  const PurposeIcon = config.icon;
  const isIncurred = plan.purpose === "incurred";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.2fr]">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                  {plan.name}
                </h3>
                {planStatusBadge(plan.status)}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <FileText className="h-3 w-3 text-slate-500" />
                  </span>
                  <span className="font-mono">{plan.code}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <Calendar className="h-3 w-3 text-slate-500" />
                  </span>
                  <span>{plan.seasonName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <Clock className="h-3 w-3 text-slate-500" />
                  </span>
                  <span>
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto self-start rounded-xl px-0 text-slate-500 hover:text-primary"
              onClick={() => window.open(`/plan/${plan.id}`, "_blank")}
            >
              Xem chi tiết <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Mục đích kế hoạch
            </h4>
            <div className="grid grid-cols-1">
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-3 ring-2",
                  config.cardClassName,
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-md",
                    plan.purpose === "cultivation" && "bg-blue-600 shadow-blue-500/20",
                    plan.purpose === "treatment" && "bg-red-600 shadow-red-500/20",
                    plan.purpose === "amendment" && "bg-emerald-600 shadow-emerald-500/20",
                    plan.purpose === "harvest" && "bg-indigo-600 shadow-indigo-500/20",
                    plan.purpose === "incurred" && "bg-amber-600 shadow-amber-500/20",
                  )}
                >
                  <PurposeIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      plan.purpose === "cultivation" && "text-blue-700",
                      plan.purpose === "treatment" && "text-red-700",
                      plan.purpose === "amendment" && "text-emerald-700",
                      plan.purpose === "harvest" && "text-indigo-700",
                      plan.purpose === "incurred" && "text-amber-700",
                    )}
                  >
                    {config.label.toUpperCase()}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                    {config.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "mr-2 h-2 w-2 rounded-full",
                    plan.purpose === "cultivation" && "bg-blue-500",
                    plan.purpose === "treatment" && "bg-red-500",
                    plan.purpose === "amendment" && "bg-emerald-500",
                    plan.purpose === "harvest" && "bg-indigo-500",
                    plan.purpose === "incurred" && "bg-amber-500",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="mb-6 flex items-center gap-3">
            <div
              className={cn(
                "rounded-2xl p-2.5 shadow-sm",
                plan.purpose === "treatment" && "bg-red-100/50",
                plan.purpose === "amendment" && "bg-emerald-100/50",
                plan.purpose === "cultivation" && "bg-blue-100/50",
                plan.purpose === "harvest" && "bg-indigo-100/50",
                plan.purpose === "incurred" && "bg-amber-100/50",
              )}
            >
              {isIncurred ? (
                <ClipboardList className="h-7 w-7 text-amber-600" />
              ) : (
                <Layers
                  className={cn(
                    "h-7 w-7",
                    plan.purpose === "treatment" && "text-red-600",
                    plan.purpose === "amendment" && "text-emerald-600",
                    plan.purpose === "cultivation" && "text-blue-600",
                    plan.purpose === "harvest" && "text-indigo-600",
                  )}
                />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-slate-900">
                {plan.purpose === "treatment"
                  ? "Lộ trình xử lý & Phác đồ"
                  : plan.purpose === "amendment"
                    ? "Lộ trình cải tạo & Quy trình"
                    : plan.purpose === "harvest"
                      ? "Lộ trình thu hoạch & Đóng gói"
                      : plan.purpose === "incurred"
                        ? "Danh sách công việc phát sinh"
                        : "Lộ trình triển khai & Giai đoạn"}
              </h3>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {plan.purpose === "harvest"
                  ? "Chi tiết các giai đoạn thu hoạch sản phẩm"
                  : plan.purpose === "incurred"
                    ? "Chi tiết các nhiệm vụ và vật tư phát sinh"
                    : "Chi tiết các hạng mục và kế hoạch hành động"}
              </p>
            </div>
          </div>

          <div className="custom-scrollbar max-h-125 space-y-4 overflow-y-auto pr-2">
            {isIncurred ? (
              <IncurredPlanDetails plan={plan} regions={regions} />
            ) : (
              <StageDetails
                plan={plan}
                regions={regions}
                growthCycles={growthCycles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CropDetailPlansTab = ({
  baseRelevantPlans,
  relevantPlans,
  planFilter,
  setPlanFilter,
  incurredTasks,
  regions,
  growthCycles,
  onNavigateToPlans,
  onOpenTask,
}: CropDetailPlansTabProps) => {
  const planCounts = {
    cultivation: baseRelevantPlans.filter((plan) => plan.purpose === "cultivation")
      .length,
    treatment: baseRelevantPlans.filter((plan) => plan.purpose === "treatment").length,
    amendment: baseRelevantPlans.filter((plan) => plan.purpose === "amendment").length,
    harvest: baseRelevantPlans.filter((plan) => plan.purpose === "harvest").length,
    incurred: baseRelevantPlans.filter((plan) => plan.purpose === "incurred").length,
  };

  return (
    <TabsContent value="plans" className="space-y-6 overflow-hidden">
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-blue-600" />
              Kế hoạch canh tác
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg"
              onClick={onNavigateToPlans}
            >
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="no-scrollbar mb-6 overflow-x-auto pb-2">
            <Tabs
              value={planFilter}
              onValueChange={(value) => setPlanFilter(value as Plan["purpose"])}
              className="w-full"
            >
              <TabsList className="flex h-auto min-w-full w-max gap-1 rounded-2xl bg-slate-100/50 p-1">
                {(Object.keys(PLAN_PURPOSE_CONFIG) as Plan["purpose"][]).map((purpose) => {
                  const config = PLAN_PURPOSE_CONFIG[purpose];
                  const Icon = config.icon;
                  return (
                    <TabsTrigger
                      key={purpose}
                      value={purpose}
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all data-[state=active]:text-white data-[state=active]:shadow-sm",
                        config.activeClassName,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {config.label} ({planCounts[purpose]})
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          <div className="w-full">
            {planFilter === "incurred" ? (
              <IncurredTasksOverview
                incurredTasks={incurredTasks}
                regions={regions}
                onOpenTask={onOpenTask}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {relevantPlans.length === 0 ? (
                  <div className="py-8 text-center text-sm italic text-muted-foreground">
                    Chưa có kế hoạch nào phù hợp với phạm vi vùng canh tác này.
                  </div>
                ) : (
                  relevantPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      regions={regions}
                      growthCycles={growthCycles}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
