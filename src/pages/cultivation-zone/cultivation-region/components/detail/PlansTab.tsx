import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DataTable,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  Layers,
  Bug,
  Sprout,
  ShoppingBag,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Users,
  Package,
  Calendar,
  Clock,
  ChevronRight,
  Wrench,
} from "lucide-react";
import usePlanStore, { type Plan } from "@/stores/usePlanStore";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import type { Task } from "@/stores/useTaskStore";
import useTaskStore from "@/stores/useTaskStore";
import TaskDetailDialog from "@/pages/task/components/TaskDetailDialog";

interface PlansTabProps {
  area: any;
  regionIndex: any;
  resolvedId: string;
}

export const PlansTab = ({ area, regionIndex, resolvedId }: PlansTabProps) => {
  const [, setLocation] = useLocation();
  const { plans } = usePlanStore();
  const { growthCycles } = useGrowthCycleStore();
  const { regions } = useRegionStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  // Parse scope target IDs for filtering
  const scopeTargetIds = useMemo(() => {
    const regionIds = new Set<string>();
    const areaIds = new Set<string>();
    const plotIds = new Set<string>();

    const ids = (area.targetIds || []).map(String);
    for (const id of ids) {
      const reg = regionIndex.regionById.get(id);
      if (reg) {
        regionIds.add(String(reg.id));
        for (const a of reg.subAreas || []) {
          areaIds.add(String(a.id));
          for (const p of a.plots || []) {
            plotIds.add(String(p.id));
          }
        }
        continue;
      }

      const areaHit = regionIndex.areaById.get(id);
      if (areaHit) {
        areaIds.add(String(areaHit.area.id));
        regionIds.add(String(areaHit.region.id));
        for (const p of areaHit.area.plots || []) {
          plotIds.add(String(p.id));
        }
        continue;
      }

      const plotHit = regionIndex.plotById.get(id);
      if (plotHit) {
        plotIds.add(String(plotHit.plot.id));
        areaIds.add(String(plotHit.area.id));
        regionIds.add(String(plotHit.region.id));
      }
    }

    return { regionIds, areaIds, plotIds };
  }, [area, regionIndex]);

  const baseRelevantPlans = useMemo(() => {
    const intersects = (a: string[] | undefined, b: Set<string>) =>
      (a || []).some((id) => b.has(String(id)));

    const matches = (p: Plan) =>
      intersects(p.selectedPlotIds, scopeTargetIds.plotIds) ||
      intersects(p.selectedZoneIds, scopeTargetIds.areaIds) ||
      intersects(p.selectedRegionIds, scopeTargetIds.regionIds);

    return plans.filter(matches);
  }, [plans, scopeTargetIds]);

  const [planFilter, setPlanFilter] = useState<Plan["purpose"]>("cultivation");

  const relevantPlans = useMemo(() => {
    const statusRank: Record<Plan["status"], number> = {
      active: 0,
      draft: 1,
      completed: 2,
      cancelled: 3,
    };

    return baseRelevantPlans
      .filter((p) => p.purpose === planFilter)
      .sort((a, b) => {
        const ra = statusRank[a.status] ?? 99;
        const rb = statusRank[b.status] ?? 99;
        if (ra !== rb) return ra - rb;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
  }, [baseRelevantPlans, planFilter]);

  const tasks = useTaskStore((state) => state.tasks);

  const incurredTasks = useMemo(() => {
    const incurredPlanNames = new Set(
      baseRelevantPlans
        .filter((p) => p.purpose === "incurred")
        .map((p) => p.name),
    );

    const isInScope = (t: Task) => {
      if (!t.geographicalSelections || t.geographicalSelections.length === 0)
        return true;
      return t.geographicalSelections.some((sel) => {
        return (
          scopeTargetIds.regionIds.has(String(sel.regionId)) ||
          scopeTargetIds.areaIds.has(String(sel.areaId)) ||
          scopeTargetIds.plotIds.has(String(sel.plotId))
        );
      });
    };

    return tasks.filter((t) => incurredPlanNames.has(t.plan) && isInScope(t));
  }, [baseRelevantPlans, tasks, scopeTargetIds]);

  const prevRegionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!baseRelevantPlans || baseRelevantPlans.length === 0) return;

    if (prevRegionIdRef.current !== resolvedId) {
      prevRegionIdRef.current = resolvedId;
      const purposes: Plan["purpose"][] = [
        "cultivation",
        "treatment",
        "amendment",
        "harvest",
        "incurred",
      ];
      const firstWithData = purposes.find((p) =>
        baseRelevantPlans.some((plan) => plan.purpose === p),
      );
      if (firstWithData) {
        setPlanFilter(firstWithData);
      }
    }
  }, [baseRelevantPlans, resolvedId]);

  const planStatusBadge = (status: Plan["status"]) => {
    const config: Record<Plan["status"], { label: string; className: string }> =
      {
        draft: { label: "Bản nháp", className: "bg-slate-200 text-slate-700" },
        active: { label: "Đang thực hiện", className: "bg-primary text-white" },
        completed: {
          label: "Hoàn thành",
          className: "bg-green-600 text-white",
        },
        cancelled: {
          label: "Đã hủy",
          className: "bg-red-500 text-white",
        },
      };
    const c = config[status] || config.draft;
    return <Badge className={cn("border-none", c.className)}>{c.label}</Badge>;
  };

  const getSelectionSummary = (selections: any[]) => {
    if (!selections || selections.length === 0) return [];

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

    selections.forEach((sel) => {
      const region = regions.find((r) => String(r.id) === String(sel.regionId));
      if (!region) return;

      let group = summary.find((s) => s.regionId === sel.regionId);
      if (!group) {
        group = {
          regionId: sel.regionId,
          regionName: region.name,
          items: [],
        };
        summary.push(group);
      }

      if (sel.type === "region") {
        group.items.push({
          type: "region",
          id: sel.id,
          name: "Toàn bộ vùng " + region.name,
        });
      } else if (sel.type === "area") {
        const subArea = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        group.items.push({
          type: "area",
          id: sel.id,
          name: "Khu vực " + (subArea?.name || sel.areaId),
        });
      } else if (sel.type === "plot") {
        const subArea = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        const plot = subArea?.plots?.find(
          (p: any) => String(p.id) === String(sel.plotId),
        );
        group.items.push({
          type: "plot",
          id: sel.id,
          name: "Lô " + (plot?.name || sel.plotId),
          parentName: subArea?.name,
        });
      }
    });

    return summary;
  };

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="border-b bg-slate-50/50 py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <FileText className="w-5 h-5 text-blue-600" />
            Kế hoạch canh tác
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg"
            onClick={() => setLocation("/plan")}
          >
            Xem tất cả
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 overflow-x-auto no-scrollbar pb-2">
          <Tabs
            value={planFilter}
            onValueChange={(val: any) => setPlanFilter(val)}
            className="w-full"
          >
            <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-auto flex gap-1 w-max min-w-full">
              <TabsTrigger
                value="cultivation"
                className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5" />
                Canh tác (
                {
                  baseRelevantPlans.filter((p) => p.purpose === "cultivation")
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="treatment"
                className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <Bug className="w-3.5 h-3.5" />
                Điều trị (
                {
                  baseRelevantPlans.filter((p) => p.purpose === "treatment")
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="amendment"
                className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <Sprout className="w-3.5 h-3.5" />
                Cải tạo (
                {
                  baseRelevantPlans.filter((p) => p.purpose === "amendment")
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="harvest"
                className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Thu hoạch (
                {
                  baseRelevantPlans.filter((p) => p.purpose === "harvest")
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="incurred"
                className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Phát sinh (
                {
                  baseRelevantPlans.filter((p) => p.purpose === "incurred")
                    .length
                }
                )
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-full">
          {planFilter === "incurred" ? (
            <Card className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/50">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-slate-800 tracking-tight">
                        Tổng hợp công việc phát sinh
                      </CardTitle>
                      <CardDescription className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        Dữ liệu nhiệm vụ thực tế từ hệ thống quản lý công việc
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 font-black px-4 py-1.5 rounded-xl shadow-sm"
                  >
                    {incurredTasks.length} NHIỆM VỤ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {incurredTasks.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                      <CheckCircle2 className="w-10 h-10 text-slate-200" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">
                      Chưa có dữ liệu công việc
                    </h4>
                    <p className="text-sm font-medium text-slate-400 max-w-[300px] mx-auto">
                      Không tìm thấy nhiệm vụ nào được ghi nhận cho các kế hoạch
                      phát sinh trong vùng canh tác này.
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
                          render: (value: any) => {
                            const geoSummary = getSelectionSummary(value || []);
                            if (geoSummary.length === 0) {
                              return (
                                <span className="text-slate-400 italic text-[10px]">
                                  Chưa xác định
                                </span>
                              );
                            }
                            return (
                              <div className="flex flex-wrap gap-1">
                                {geoSummary.map((group) =>
                                  group.items.map((item, idx) => (
                                    <Badge
                                      key={`${group.regionId}-${idx}`}
                                      variant="outline"
                                      className={cn(
                                        "text-[9px] py-0 h-4 font-bold border-slate-100",
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
                          },
                        },
                        { key: "plan", label: "Kế hoạch" },
                        { key: "stage", label: "Giai đoạn" },
                        {
                          key: "assignedTo",
                          label: "Phân công",
                          render: (value: any, row: any) => (
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg shrink-0",
                                  row.assignedType === "team"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-green-50 text-green-600",
                                )}
                              >
                                <Users className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value}
                              </span>
                            </div>
                          ),
                        },
                        {
                          key: "priority",
                          label: "Ưu tiên",
                          render: (value: any) => (
                            <Badge
                              variant={
                                value === "high"
                                  ? "destructive"
                                  : value === "medium"
                                    ? "default"
                                    : "outline"
                              }
                              className="text-[10px] px-2.5 py-0.5 border-none font-black tracking-wider shadow-sm"
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
                          render: (value: any) => {
                            const statusConfig: any = {
                              completed: {
                                label: "HOÀN THÀNH",
                                variant: "secondary",
                              },
                              "in-progress": {
                                label: "ĐANG CHẠY",
                                variant: "default",
                              },
                              overdue: {
                                label: "QUÁ HẠN",
                                variant: "destructive",
                              },
                              pending: {
                                label: "CHỜ DUYỆT",
                                variant: "outline",
                              },
                            };
                            const config =
                              statusConfig[value] || statusConfig.pending;
                            return (
                              <Badge
                                variant={config.variant}
                                className="text-[10px] px-2.5 py-0.5 border-none font-black tracking-wider shadow-sm"
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
                      onView={(task) => {
                        setSelectedTask(task);
                        setIsTaskDetailOpen(true);
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantPlans.length === 0 ? (
                <div className="text-sm text-muted-foreground italic text-center py-8">
                  Chưa có kế hoạch nào phù hợp với phạm vi vùng canh tác này.
                </div>
              ) : (
                relevantPlans.map((plan) => {
                  const stageOrder =
                    plan.selectedStages && plan.selectedStages.length > 0
                      ? plan.selectedStages
                      : Array.from(
                          new Set([
                            ...(plan.taskAllocations || []).map(
                              (t: any) => t.stageId || "Khác",
                            ),
                            ...(plan.materialAllocations || []).map(
                              (m: any) => m.stageId || "Khác",
                            ),
                          ]),
                        );

                  const isCultivation = plan.purpose === "cultivation";
                  const isTreatment = plan.purpose === "treatment";
                  const isAmendment = plan.purpose === "amendment";
                  const isHarvest = plan.purpose === "harvest";
                  const isIncurred = plan.purpose === "incurred";

                  return (
                    <div
                      key={plan.id}
                      className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-100"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-8">
                        {/* Left Column: Info & Purpose */}
                        <div className="space-y-8">
                          <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                  {plan.name}
                                </h3>
                                {planStatusBadge(plan.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                    <FileText className="w-3 h-3 text-slate-500" />
                                  </span>
                                  <span className="font-mono">{plan.code}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                    <Calendar className="w-3 h-3 text-slate-500" />
                                  </span>
                                  <span>{plan.seasonName}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                  </span>
                                  <span>
                                    {new Date(
                                      plan.startDate,
                                    ).toLocaleDateString("vi-VN")}{" "}
                                    -{" "}
                                    {new Date(plan.endDate).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-primary rounded-xl self-start px-0 h-auto"
                              onClick={() => {
                                window.open(`/plan/${plan.id}`, "_blank");
                              }}
                            >
                              Xem chi tiết{" "}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Mục đích kế hoạch
                            </h4>
                            <div className="grid grid-cols-1">
                              {isCultivation && (
                                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/5">
                                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0">
                                    <Layers className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                                      CANH TÁC
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                      Áp dụng quy trình sản xuất chuẩn
                                    </div>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                                </div>
                              )}

                              {isTreatment && (
                                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-500 bg-red-50/50 ring-2 ring-red-500/5">
                                  <div className="w-9 h-9 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/20 flex items-center justify-center shrink-0">
                                    <Bug className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                      ĐIỀU TRỊ
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                      Triển khai phác đồ xử lý sâu bệnh
                                    </div>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                </div>
                              )}

                              {isAmendment && (
                                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/5">
                                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Sprout className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                      CẢI TẠO ĐẤT
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                      Quy trình xử lý phục hồi đất đai
                                    </div>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                </div>
                              )}

                              {isHarvest && (
                                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/5">
                                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0">
                                    <ShoppingBag className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                                      THU HOẠCH
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                      Triển khai thu hoạch và bảo quản
                                    </div>
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Detailed Setup View */}
                        <div className="lg:pl-8 lg:border-l border-slate-100 min-w-0">
                          <div className="flex items-center gap-3 mb-6">
                            <div
                              className={cn(
                                "p-2.5 rounded-2xl shadow-sm",
                                isTreatment && "bg-red-100/50",
                                isAmendment && "bg-emerald-100/50",
                                isCultivation && "bg-blue-100/50",
                                isHarvest && "bg-indigo-100/50",
                              )}
                            >
                              <Layers
                                className={cn(
                                  "w-7 h-7",
                                  isTreatment && "text-red-600",
                                  isAmendment && "text-emerald-600",
                                  isCultivation && "text-blue-600",
                                  isHarvest && "text-indigo-600",
                                )}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-slate-900 truncate">
                                {isTreatment
                                  ? "Lộ trình xử lý & Phác đồ"
                                  : isAmendment
                                    ? "Lộ trình cải tạo & Quy trình"
                                    : isHarvest
                                      ? "Lộ trình thu hoạch & Đóng gói"
                                      : "Lộ trình triển khai & Giai đoạn"}
                              </h3>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                                {isHarvest
                                  ? "Chi tiết các giai đoạn thu hoạch sản phẩm"
                                  : "Chi tiết các hạng mục và kế hoạch hành động"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                            {(plan.selectedStages &&
                            plan.selectedStages.length > 0
                              ? plan.selectedStages
                              : stageOrder
                            ).map((stageKey, index) => {
                              const [cycleId, stageName] = stageKey.includes(
                                ":",
                              )
                                ? stageKey.split(":")
                                : [null, stageKey];
                              const cycle = cycleId
                                ? growthCycles.find((c) => c.id === cycleId)
                                : null;

                              const stageMaterials = (
                                plan.materialAllocations || []
                              ).filter((m) => m.stageId === stageKey);
                              const stageTasks =
                                plan.taskAllocations?.filter(
                                  (t) => t.stageId === stageKey,
                                ) || [];

                              return (
                                <Card
                                  key={stageKey}
                                  className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
                                >
                                  <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center font-black text-sm text-slate-700 shrink-0">
                                        {index + 1}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-bold text-base text-slate-900 truncate">
                                            {stageName}
                                          </h4>
                                          {cycle && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-2 h-4 shrink-0"
                                            >
                                              {cycle.name}
                                            </Badge>
                                          )}
                                        </div>
                                        {plan.purpose !== "cultivation" && (
                                          <p
                                            className={cn(
                                              "text-[10px] font-bold uppercase tracking-wider",
                                              isAmendment
                                                ? "text-emerald-600"
                                                : "text-red-600",
                                            )}
                                          >
                                            {isAmendment
                                              ? "Hoạt động cải tạo đất"
                                              : "Hoạt động điều trị bệnh"}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                      <Badge
                                        variant="outline"
                                        className="bg-white hover:bg-green-50 transition-colors px-2 py-0.5"
                                      >
                                        <Layers className="w-3 h-3 mr-1 text-green-600" />
                                        {stageMaterials.length}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-white hover:bg-blue-50 transition-colors px-2 py-0.5"
                                      >
                                        <Users className="w-3 h-3 mr-1 text-blue-600" />
                                        {stageTasks.length}
                                      </Badge>
                                    </div>
                                  </div>

                                  <CardContent className="p-0">
                                    {stageMaterials.length === 0 &&
                                    stageTasks.length === 0 ? (
                                      <div className="p-8 text-center text-muted-foreground italic text-sm">
                                        Chưa có chi tiết nào được lên kế hoạch.
                                      </div>
                                    ) : (
                                      <Tabs
                                        defaultValue="tasks"
                                        className="w-full"
                                      >
                                        <TabsList className="flex items-center justify-start gap-4 p-0 bg-transparent h-auto border-b rounded-none mb-4 no-scrollbar">
                                          <TabsTrigger
                                            value="tasks"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                          >
                                            <Users className="w-3.5 h-3.5" />
                                            Công việc ({stageTasks.length})
                                          </TabsTrigger>
                                          <TabsTrigger
                                            value="materials"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                          >
                                            <Package className="w-3.5 h-3.5" />
                                            Vật tư ({stageMaterials.length})
                                          </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                          value="tasks"
                                          className="m-0 bg-white anim-fade-in"
                                        >
                                          {stageTasks.length === 0 ? (
                                            <div className="text-center py-10 border border-dashed rounded-2xl bg-slate-50/50">
                                              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                              <p className="text-sm text-slate-500 font-medium">
                                                Chưa có công việc phân bổ
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                                              <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                  <tr className="bg-slate-50/80 border-b border-slate-100">
                                                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                      Nội dung
                                                    </th>
                                                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                      Phạm vi
                                                    </th>
                                                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                      Nhân sự
                                                    </th>
                                                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">
                                                      Thời gian
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                  {stageTasks.map((task) => {
                                                    const geoSummary =
                                                      getSelectionSummary(
                                                        task.geographicalSelections ||
                                                          [],
                                                      );
                                                    return (
                                                      <tr
                                                        key={task.id}
                                                        className="hover:bg-blue-50/30 transition-colors group"
                                                      >
                                                        <td className="px-4 py-3">
                                                          <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-white transition-colors">
                                                              <CheckCircle2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                              <p className="font-bold text-slate-800 text-xs lines-1">
                                                                {task.name}
                                                              </p>
                                                              <p className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                                                                {task.description ||
                                                                  "Máy móc & Thiết bị..."}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                          <div className="flex flex-wrap gap-1">
                                                            {geoSummary.length >
                                                            0 ? (
                                                              geoSummary.map(
                                                                (group) =>
                                                                  group.items.map(
                                                                    (
                                                                      item,
                                                                      idx,
                                                                    ) => (
                                                                      <Badge
                                                                        key={`${group.regionId}-${idx}`}
                                                                        variant="outline"
                                                                        className={cn(
                                                                          "text-[9px] py-0 h-4 font-bold border-slate-100",
                                                                          item.type ===
                                                                            "region"
                                                                            ? "bg-emerald-50 text-emerald-600"
                                                                            : "bg-blue-50 text-blue-600",
                                                                        )}
                                                                      >
                                                                        {
                                                                          item.name
                                                                        }
                                                                      </Badge>
                                                                    ),
                                                                  ),
                                                              )
                                                            ) : (
                                                              <span className="text-slate-400 italic text-[10px]">
                                                                Toàn vùng
                                                              </span>
                                                            )}
                                                          </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                            <Users className="w-3 h-3 text-slate-400" />
                                                            <span className="text-xs font-bold text-slate-600">
                                                              {task.labor ||
                                                                "Đội ngũ"}
                                                            </span>
                                                          </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                          <Badge
                                                            variant="outline"
                                                            className="text-[10px] bg-white border-slate-200 text-slate-500 font-bold px-2 py-0"
                                                          >
                                                            {task.duration}
                                                          </Badge>
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </TabsContent>

                                        <TabsContent
                                          value="materials"
                                          className="m-0 bg-white anim-fade-in"
                                        >
                                          {stageMaterials.length === 0 ? (
                                            <div className="text-center py-10 border border-dashed rounded-2xl bg-slate-50/50">
                                              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                              <p className="text-sm text-slate-500 font-medium">
                                                Chưa có vật tư phân bổ
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                              {stageMaterials.map((mat) => (
                                                <div
                                                  key={mat.id}
                                                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow-md"
                                                >
                                                  <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-emerald-50 p-2.5 rounded-xl shadow-sm border border-emerald-100 shrink-0">
                                                      <Package className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <div className="min-w-0 text-left">
                                                      <p className="font-extrabold text-xs truncate text-slate-800">
                                                        {mat.materialName}
                                                      </p>
                                                      <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-tighter">
                                                        {mat.materialType}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </CardContent>

      <TaskDetailDialog
        task={selectedTask}
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
      />
    </Card>
  );
};
