import {
  Badge,
  Card,
  CardContent,
  Separator,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarRange,
  Clock,
  ClipboardList,
  Layers,
  MapPin,
} from "lucide-react";
import type { Plan } from "../../../stores/usePlanStore";

const PURPOSE_META: Record<
  Plan["purpose"],
  { label: string; className: string }
> = {
  cultivation: {
    label: "Kế hoạch sản xuất",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "facility-upgrade": {
    label: "Cải tạo cơ sở vật chất",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  treatment: {
    label: "Kế hoạch điều trị",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  amendment: {
    label: "Kế hoạch cải tạo",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  harvest: {
    label: "Kế hoạch thu hoạch",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  incurred: {
    label: "Kế hoạch phát sinh",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

const STATUS_META: Record<
  Plan["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Chờ kích hoạt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Đang thực hiện",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function formatDate(value?: string) {
  if (!value) return "---";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="bg-slate-100 p-1.5 rounded-lg shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

interface TaskPlanContextCardProps {
  plan: Plan;
  taskCount: number;
}

export function TaskPlanContextCard({
  plan,
  taskCount,
}: TaskPlanContextCardProps) {
  const purpose = PURPOSE_META[plan.purpose] ?? PURPOSE_META.incurred;
  const status = STATUS_META[plan.status] ?? STATUS_META.draft;
  const scopeItems = (plan.selectionSummary || []).flatMap(
    (group) => group.items,
  );
  const plotCount = scopeItems.filter((item) => item.type === "plot").length;
  const areaCount = scopeItems.filter((item) => item.type === "area").length;
  const regionCount = scopeItems.filter(
    (item) => item.type === "region",
  ).length;
  const scopeValue = scopeItems.length
    ? [
        regionCount ? `${regionCount} vùng` : "",
        areaCount ? `${areaCount} khu` : "",
        plotCount ? `${plotCount} lô` : "",
      ]
        .filter(Boolean)
        .join(" • ")
    : `${plan.selectedPlotIds?.length || 0} lô${
        plan.area ? ` • ${plan.area} ha` : ""
      }`;

  return (
    <Card className="border-l-4 border-l-primary shadow-sm mb-4">
      <CardContent className="pt-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
              <Badge
                variant="outline"
                className={cn("font-bold uppercase text-[10px]", purpose.className)}
              >
                {purpose.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn("font-bold uppercase text-[10px]", status.className)}
              >
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mã kế hoạch: <span className="font-semibold">{plan.code}</span>
            </p>
          </div>

          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-transparent font-bold h-7 px-3"
          >
            {taskCount} công việc
          </Badge>
        </div>

        {plan.description && (
          <p className="text-sm text-muted-foreground italic">
            {plan.description}
          </p>
        )}

        <Separator />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem
            icon={CalendarRange}
            label="Thời gian dự kiến"
            value={`${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`}
          />
          <InfoItem
            icon={MapPin}
            label="Phạm vi canh tác & sản xuất"
            value={scopeValue}
          />
          <InfoItem
            icon={Layers}
            label="Số giai đoạn/hạng mục"
            value={`${plan.selectedStages?.length || 0} giai đoạn${
              plan.materialAllocations.length + plan.taskAllocations.length
                ? ` • ${plan.materialAllocations.length + plan.taskAllocations.length} hạng mục`
                : ""
            }`}
          />
          <InfoItem
            icon={Clock}
            label="Thời gian khởi tạo"
            value={formatDate(plan.createdAt)}
          />
        </div>

        {plan.selectedStages?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {plan.selectedStages.slice(0, 6).map((stage) => (
              <Badge
                key={stage}
                variant="secondary"
                className="bg-slate-100 text-slate-600 border-transparent text-[10px] font-medium h-6"
              >
                {stage.includes(":") ? stage.split(":")[1] : stage}
              </Badge>
            ))}
            {plan.selectedStages.length > 6 && (
              <span className="text-[10px] text-muted-foreground font-medium">
                +{plan.selectedStages.length - 6} giai đoạn khác
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
