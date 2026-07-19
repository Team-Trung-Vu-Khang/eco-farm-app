import {
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Handle,
  Position,
  type NodeProps,
} from "reactflow";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Eye,
  Layers3,
  MapPin,
  Plus,
  PencilLine,
  Sprout,
  Trash2,
  Workflow,
} from "lucide-react";

export type WorkflowNodeKind =
  | "cycle"
  | "stage"
  | "plan"
  | "task"
  | "region"
  | "area"
  | "plot";

export type WorkflowNodeStatus =
  | "not_started"
  | "in_progress"
  | "ended"
  | "completed"
  | "paused";

export type WorkflowActionTone = "default" | "secondary" | "destructive";

export interface WorkflowActionItem {
  label: string;
  icon: LucideIcon;
  tone?: WorkflowActionTone;
  onClick: () => void;
}

export interface WorkflowSummaryItem {
  label: string;
  value: string;
}

export interface WorkflowCardNodeData {
  kind: WorkflowNodeKind;
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  status?: WorkflowNodeStatus;
  wide?: boolean;
  summaries?: WorkflowSummaryItem[];
  actions?: WorkflowActionItem[];
  sourceTopHandleId?: string;
  sourceBottomHandleId?: string;
  targetTopHandleId?: string;
  targetBottomHandleId?: string;
}

const kindConfig: Record<
  WorkflowNodeKind,
  {
    badge: string;
    wrapperClass: string;
    iconClass: string;
    defaultIcon: LucideIcon;
  }
> = {
  cycle: {
    badge: "Chu kì",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: Workflow,
  },
  stage: {
    badge: "Giai đoạn",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: Layers3,
  },
  plan: {
    badge: "Kế hoạch",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: CalendarRange,
  },
  task: {
    badge: "Công việc",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: Activity,
  },
  region: {
    badge: "Vùng",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: MapPin,
  },
  area: {
    badge: "Khu vực",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: Layers3,
  },
  plot: {
    badge: "Lô",
    wrapperClass:
      "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 shadow-slate-100/60",
    iconClass: "text-slate-600",
    defaultIcon: Sprout,
  },
};

const statusConfig: Record<
  WorkflowNodeStatus,
  { label: string; badgeClass: string }
> = {
  not_started: {
    label: "Chưa bắt đầu",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-600",
  },
  in_progress: {
    label: "Đang triển khai",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
  },
  ended: {
    label: "Đã kết thúc",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  completed: {
    label: "Đã hoàn tất",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  paused: {
    label: "Đang tạm ngưng",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

const toneVariant: Record<WorkflowActionTone, "outline" | "destructive"> = {
  default: "outline",
  secondary: "outline",
  destructive: "destructive",
};

function WorkflowHandle({
  id,
  type,
  position,
}: {
  id: string;
  type: "source" | "target";
  position: Position;
}) {
  return (
    <Handle
      id={id}
      type={type}
      position={position}
      style={{
        width: 12,
        height: 12,
        borderWidth: 2,
        borderColor: "#111827",
        background: "#ffffff",
        opacity: 0.001,
      }}
    />
  );
}

export function WorkflowCardNode({
  data,
}: NodeProps<WorkflowCardNodeData>) {
  const config = kindConfig[data.kind];
  const Icon = data.icon ?? config.defaultIcon;
  const showStatus =
    data.kind !== "region" && data.kind !== "area" && data.kind !== "plot";
  const status = showStatus && data.status ? statusConfig[data.status] : null;
  const widthClass = data.wide ? "w-[320px]" : "w-[228px]";

  return (
    <div
      className={[
        widthClass,
        "rounded-[22px] border p-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-sm",
        config.wrapperClass,
      ].join(" ")}
    >
      {data.kind === "cycle" && (
        <>
          <WorkflowHandle
            id={data.sourceTopHandleId ?? "cycle-top"}
            type="source"
            position={Position.Top}
          />
          <WorkflowHandle
            id={data.sourceBottomHandleId ?? "cycle-bottom"}
            type="source"
            position={Position.Bottom}
          />
        </>
      )}

      {data.kind === "stage" && (
        <WorkflowHandle
          id={data.targetBottomHandleId ?? `target-${data.title}`}
          type="target"
          position={Position.Bottom}
        />
      )}

      {(data.kind === "plan" ||
        data.kind === "task" ||
        data.kind === "region" ||
        data.kind === "area" ||
        data.kind === "plot") && (
        <>
          <WorkflowHandle
            id={data.targetTopHandleId ?? `target-${data.title}`}
            type="target"
            position={Position.Top}
          />
          <WorkflowHandle
            id={data.sourceBottomHandleId ?? `source-${data.title}`}
            type="source"
            position={Position.Bottom}
          />
        </>
      )}

      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5">
          <Icon className={["h-4 w-4", config.iconClass].join(" ")} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] uppercase tracking-[0.18em]">
              {data.eyebrow ?? config.badge}
            </Badge>
            {status && (
              <Badge
                variant="outline"
                className={["text-[9px] uppercase tracking-[0.18em]", status.badgeClass].join(" ")}
              >
                {status.label}
              </Badge>
            )}
          </div>
          <h3
            className="text-[15px] font-semibold leading-5 text-slate-900"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="mt-1 text-sm text-slate-600">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {data.summaries?.length ? (
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          {data.summaries.map((summary) => (
            <div
              key={`${data.title}-${summary.label}`}
              className="rounded-xl border border-white/70 bg-white/70 px-2.5 py-2 shadow-sm"
            >
              <p className="text-[9px] uppercase tracking-wide text-slate-500">
                {summary.label}
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-4 text-slate-900">
                {summary.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {data.description && (
        <div className="mt-3 rounded-xl border border-white/70 bg-white/80 px-2.5 py-2 text-[13px] leading-5 text-slate-700 shadow-sm">
          <p
            className="overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {data.description}
          </p>
        </div>
      )}

      {data.actions?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {data.actions.map((action) => {
            const ActionIcon = action.icon;

            return (
              <Button
                key={`${data.title}-${action.label}`}
                size="sm"
                variant={toneVariant[action.tone ?? "default"]}
                className="nodrag h-7 gap-1.5 px-2.5 text-[10.5px] shadow-none"
                onClick={(event) => {
                  event.stopPropagation();
                  action.onClick();
                }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <ActionIcon className="h-3 w-3" />
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export const workflowActionIcons = {
  view: Eye,
  edit: PencilLine,
  delete: Trash2,
  add: Plus,
  refresh: Activity,
  calendar: CalendarDays,
  done: CheckCircle2,
};
