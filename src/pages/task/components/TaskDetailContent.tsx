import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  AlertTriangle,
  Apple,
  Bug,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  ClipboardList,
  Info,
  Layers,
  MapPin,
  Package,
  Play,
  RefreshCw,
  Shield,
  Sprout,
  User,
  Users,
} from "lucide-react";
import { type Task } from "../../../stores/useTaskStore";
import useRegionStore from "../../../stores/useRegionStore";
import { getFrequencyText, getRepeatDatesText } from "../../plan/utils/task";

const MATERIAL_TYPE_LABELS: Record<string, string> = {
  fertilizer: "Phân bón",
  pesticide: "Thuốc BVTV",
  tool: "Dụng cụ",
  other: "Khác",
};

const MATERIAL_TYPE_COLORS: Record<string, string> = {
  fertilizer: "text-emerald-600 bg-emerald-50",
  pesticide: "text-rose-600 bg-rose-50",
  tool: "text-blue-600 bg-blue-50",
  other: "text-slate-600 bg-slate-50",
};

const priorityConfig = {
  high: {
    label: "Cao",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    icon: AlertTriangle,
  },
  medium: {
    label: "Thường",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: AlertCircle,
  },
  low: {
    label: "Thấp",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: Info,
  },
};

const statusConfig = {
  pending: {
    label: "Chờ thực hiện",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Circle,
  },
  "in-progress": {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Play,
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Quá hạn",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    icon: AlertCircle,
  },
};

const objectiveConfig: Record<
  string,
  { label: string; icon: typeof Sprout; className: string }
> = {
  "theo-ke-hoach": {
    label: "Canh tác",
    icon: Sprout,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "thu-hoach": {
    label: "Thu hoạch",
    icon: Apple,
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  "cai-tao-dat": {
    label: "Cải tạo",
    icon: Sprout,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  "tri-benh": {
    label: "Điều trị",
    icon: Bug,
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  "phat-sinh": {
    label: "Phát sinh",
    icon: Info,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
};

function getObjectiveType(task: Task) {
  if (!task.plan || task.plan === "N/A" || task.plan === "Công việc phát sinh")
    return "phat-sinh";
  const p = task.plan.toLowerCase();
  if (p.includes("thu hoạch")) return "thu-hoach";
  if (p.includes("cải tạo")) return "cai-tao-dat";
  if (p.includes("trị bệnh") || p.includes("điều trị")) return "tri-benh";
  return "theo-ke-hoach";
}

function formatDate(value?: string) {
  if (!value) return "---";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        {label}
      </label>
      <div className="font-medium mt-1 text-slate-800">{children}</div>
    </div>
  );
}

function PersonnelGroup({
  label,
  names,
  icon: Icon,
  className,
}: {
  label: string;
  names: string[];
  icon: typeof Users;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
        <span className="text-slate-400 font-normal">({names.length})</span>
      </label>
      {names.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {names.map((name, idx) => (
            <Badge
              key={`${name}-${idx}`}
              variant="outline"
              className={cn("font-medium", className)}
            >
              {name}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-slate-400">Chưa phân công</p>
      )}
    </div>
  );
}

/** Summary block: identity, classification, schedule and personnel. */
export function TaskDetailHeader({ task }: { task: Task }) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const status = statusConfig[task.status] ?? statusConfig.pending;
  const objective = objectiveConfig[getObjectiveType(task)];
  const ObjectiveIcon = objective.icon;

  const repeatWeeks = task.tasks?.some((t: any) => t.isRepeating)
    ? Math.max(...task.tasks.map((t: any) => t.repeatWeeks || 0))
    : 0;

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-2xl">{task.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" /> Mã: {task.code}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Ngày tạo:{" "}
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "font-bold uppercase flex items-center gap-1.5",
                  status.className,
                )}
              >
                <status.icon className="w-3.5 h-3.5" />
                {status.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "font-bold uppercase flex items-center gap-1.5",
                  priority.className,
                )}
              >
                <priority.icon className="w-3.5 h-3.5" />
                Ưu tiên: {priority.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        {task.description && (
          <CardContent>
            <p className="text-muted-foreground bg-slate-50 p-4 rounded-lg italic border border-slate-100">
              "{task.description}"
            </p>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b bg-slate-50/80">
            <CardTitle className="text-base flex items-center gap-2 text-blue-700">
              <Info className="w-5 h-5" />
              Thông tin chung
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto font-bold uppercase flex items-center gap-1.5",
                  objective.className,
                )}
              >
                <ObjectiveIcon className="w-3.5 h-3.5" />
                {objective.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Căn cứ / Kế hoạch">
                {task.plan || "Phát sinh"}
              </Field>
              <Field label="Giai đoạn">{task.stage || "Toàn chu kỳ"}</Field>
              <Field label="Hình thức phân công">
                {task.assignedType === "team" ? "Đội nhóm" : "Cá nhân"}
              </Field>
              <Field label="Số hạng mục">
                {task.tasks?.length || 1} hạng mục
              </Field>
              <Field label="Số tuần lặp lại">
                {repeatWeeks > 0 ? `${repeatWeeks} tuần` : "Không lặp lại"}
              </Field>
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
                    {formatDate(task.startDate)} -{" "}
                    {task.endDate ? formatDate(task.endDate) : "Duy trì"}
                  </p>
                  <p className="text-xs text-blue-600">
                    Thời gian dự kiến theo kế hoạch
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b bg-slate-50/80">
            <CardTitle className="text-base flex items-center gap-2 text-green-700">
              <Users className="w-5 h-5" />
              Nhân sự phụ trách
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <PersonnelGroup
              label="Quản lý"
              names={task.supervisors || []}
              icon={Shield}
              className="bg-blue-50 text-blue-700 border-blue-200"
            />
            <Separator />
            <PersonnelGroup
              label="Giám sát chất lượng"
              names={task.qualityInspectors || []}
              icon={ClipboardCheck}
              className="bg-amber-50 text-amber-700 border-amber-200"
            />
            <Separator />
            <PersonnelGroup
              label={
                task.assignedType === "team" ? "Đội nhóm" : "Người thực hiện"
              }
              names={task.assignedTo || []}
              icon={task.assignedType === "team" ? Users : User}
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** Per-item breakdown: scope, schedule, labour and materials. */
export function TaskDetailBody({ task }: { task: Task }) {
  const { regions } = useRegionStore();

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
      // The selection may already embed display names straight from the API
      // scope (see mapScopeToSelections) — prefer those so a region missing
      // from the local store doesn't silently drop the whole selection.
      const region = regions.find((r) => String(r.id) === String(sel.regionId));
      const regionName = sel.regionName || region?.name;
      if (!regionName) return;

      let group = summary.find((s) => s.regionId === sel.regionId);
      if (!group) {
        group = { regionId: sel.regionId, regionName, items: [] };
        summary.push(group);
      }

      if (sel.type === "region") {
        group.items.push({
          type: "region",
          id: sel.id,
          name: "Toàn bộ vùng " + regionName,
        });
      } else if (sel.type === "area") {
        const area = region?.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        group.items.push({
          type: "area",
          id: sel.id,
          name: "Khu vực " + (sel.areaName || area?.name || sel.areaId),
        });
      } else if (sel.type === "plot") {
        const area = region?.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p: any) => String(p.id) === String(sel.plotId),
        );
        group.items.push({
          type: "plot",
          id: sel.id,
          name: "Lô " + (sel.plotName || plot?.name || sel.plotId),
          parentName: sel.areaName || area?.name,
        });
      }
    });

    return summary;
  };

  const items =
    task.tasks && task.tasks.length > 0
      ? task.tasks
      : [
          {
            // Materials carry the parent task's own id as their `taskId` —
            // match it here so the "Vật tư phân bổ" filter below finds them.
            id: task.id,
            name: task.name,
            startDate: task.startDate,
            endDate: task.endDate,
            geographicalSelections: task.geographicalSelections,
            labor: (task.assignedTo || []).join(", "),
            isRepeating: task.isRepeating,
            repeatDates: task.repeatDates,
          },
        ];

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-emerald-100/50 shadow-sm">
          <Layers className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Hạng mục công việc
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
            Phạm vi, tiến độ và nguồn lực của từng hạng mục
          </p>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto bg-primary/10 text-primary border-transparent font-bold h-7 px-3"
        >
          {items.length} hạng mục
        </Badge>
      </div>

      {items.map((t: any, idx: number) => {
        const itemMaterials =
          task.materials?.filter(
            (m) => String((m as any).taskId) === String(t.id),
          ) || [];
        const itemLabor = t.labor
          ? String(t.labor).split(", ").filter(Boolean)
          : [];
        const geoSummary = getSelectionSummary(t.geographicalSelections || []);

        return (
          <Card key={t.id || idx} className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/80">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                {t.name}
                {(t.stageId || task.stage) && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-emerald-50 text-emerald-700 border-none font-semibold"
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    {t.stageId || task.stage}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                    Phạm vi thực hiện
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {geoSummary.length > 0 ? (
                      geoSummary.flatMap((group) =>
                        group.items.map((item, iIdx) => (
                          <Badge
                            key={`${group.regionId}-${iIdx}`}
                            variant="outline"
                            className={cn(
                              "font-medium",
                              item.type === "region"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.type === "area"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-white text-slate-600 border-slate-200",
                            )}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.name}
                            {item.parentName && (
                              <span className="ml-1 opacity-60 font-normal italic">
                                ({item.parentName})
                              </span>
                            )}
                          </Badge>
                        )),
                      )
                    ) : (
                      <p className="text-sm italic text-slate-400">
                        Chưa xác định
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                    {t.isRepeating ? "Tần suất" : "Thời gian"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {t.isRepeating ? (
                      <>
                        <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-sm font-semibold text-slate-800">
                          {t.repeatDates?.length
                            ? getRepeatDatesText(t.repeatDates)
                            : getFrequencyText(
                                t.repeatDays || [],
                                t.repeatWeeks || 0,
                              )}
                        </p>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDate(t.startDate || task.startDate)} -{" "}
                          {formatDate(t.endDate || task.endDate)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                  Nhân sự thực hiện{" "}
                  <span className="text-slate-400 font-normal normal-case">
                    ({itemLabor.length})
                  </span>
                </label>
                {itemLabor.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {itemLabor.map((name: string, pIdx: number) => (
                      <Badge
                        key={`${name}-${pIdx}`}
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                      >
                        <User className="w-3 h-3 mr-1" />
                        {name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400">Chưa phân công</p>
                )}
              </div>

              <Separator />

              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                  Vật tư phân bổ{" "}
                  <span className="text-slate-400 font-normal normal-case">
                    ({itemMaterials.length})
                  </span>
                </label>
                {itemMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {itemMaterials.map((m) => {
                      const matName =
                        (m as any).materialName ?? (m as any).name ?? "—";
                      const matType =
                        (m as any).materialType ??
                        (m as any).materialCategory ??
                        "other";
                      return (
                        <div
                          key={m.id}
                          className="p-3 rounded-lg border border-slate-100 bg-white shadow-xs space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                MATERIAL_TYPE_COLORS[matType] ??
                                  MATERIAL_TYPE_COLORS.other,
                              )}
                            >
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {MATERIAL_TYPE_LABELS[matType] || matType}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-50">
                            <p className="font-semibold text-slate-800 text-sm mb-1 truncate">
                              {matName}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Số lượng
                              </span>
                              <span className="font-bold text-emerald-600 text-sm">
                                {m.quantity} {m.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 border-2 border-dashed border-slate-100 rounded-lg text-center">
                    <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 italic">
                      Không phân bổ vật tư cho hạng mục này
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
