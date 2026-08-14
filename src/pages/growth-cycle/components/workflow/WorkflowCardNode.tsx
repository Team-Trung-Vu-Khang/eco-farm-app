import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarRange,
  Layers3,
  MapPin,
  Sprout,
  Workflow,
} from "lucide-react";
import { Handle, Position, type NodeProps } from "reactflow";

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
  disabled?: boolean;
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
  badgeBelowTitle?: string;
  icon?: LucideIcon;
  status?: WorkflowNodeStatus;
  statusLabel?: string;
  wide?: boolean;
  summaries?: WorkflowSummaryItem[];
  tags?: string[];
  regionLabels?: string[];
  footerAction?: WorkflowActionItem;
  variant?: "default" | "poster";
  posterTheme?: "light" | "dark";
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

const footerActionButtonClass =
  "h-[42px] w-[42px] rounded-full border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_10px_22px_rgba(15,23,42,0.10)] hover:bg-slate-50";
const footerActionIconClass = "h-6 w-6";

// Sentinel used by callers (see PlanGrowthCreateWorkflowPage) to signal "no
// region picked yet" — rendered as plain centered text instead of a chip.
const EMPTY_REGION_LABEL = "Chưa thiết lập vùng canh tác";

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

export function WorkflowCardNode({ data }: NodeProps<WorkflowCardNodeData>) {
  const config = kindConfig[data.kind];
  const Icon = data.icon ?? config.defaultIcon;
  const showStatus =
    data.kind !== "region" && data.kind !== "area" && data.kind !== "plot";
  const status = showStatus && data.status ? statusConfig[data.status] : null;
  const isPosterPlan = data.variant === "poster";
  const isDarkPoster = isPosterPlan && data.posterTheme === "dark";
  const widthClass = isPosterPlan
    ? data.kind === "plan"
      ? "w-[820px] max-w-[calc(100vw-32px)]"
      : data.kind === "cycle"
        ? "w-[640px] max-w-[calc(100vw-32px)]"
        : "w-[440px] max-w-[calc(100vw-32px)]"
    : data.kind === "cycle" || data.kind === "stage"
      ? "w-[360px]"
      : data.wide
        ? "w-[340px]"
        : "w-[228px]";
  const renderFooterAction = () => {
    if (!data.footerAction) return null;

    return (
      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          variant="outline"
          aria-label={data.footerAction.label}
          className={footerActionButtonClass}
          onClick={(event) => {
            event.stopPropagation();
            data.footerAction?.onClick();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <data.footerAction.icon className={footerActionIconClass} />
        </Button>
      </div>
    );
  };

  if (isPosterPlan) {
    // The "cycle" card (the top-level workflow diagram card) gets an emerald
    // accent in its light theme so it stands out from the plain plan cards
    // it sits above on the canvas.
    const isCyclePoster = data.kind === "cycle" && !isDarkPoster;

    // Solid, high-contrast pills so each status reads at a glance instead of
    // blending into the (often equally pale) card background.
    const posterStatusColorMap: Record<WorkflowNodeStatus, string> = {
      not_started: "border-slate-400 bg-slate-500 text-white",
      in_progress: "border-emerald-500 bg-emerald-500 text-white",
      ended: "border-amber-500 bg-amber-500 text-white",
      completed: "border-blue-500 bg-blue-500 text-white",
      paused: "border-rose-500 bg-rose-500 text-white",
    };
    const posterStatusClass = isDarkPoster
      ? "border-sky-400/50 bg-sky-500/20 text-sky-100"
      : data.status
        ? posterStatusColorMap[data.status]
        : "";
    const posterBadgeClass = isDarkPoster
      ? "border-white/15 bg-white/5 text-slate-100 shadow-none"
      : isCyclePoster
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none"
        : "border-slate-200 bg-white/80 text-slate-700 shadow-none";
    const posterWrapperClass = isDarkPoster
      ? "border-slate-500/60 bg-[#111111] text-slate-100 shadow-[0_16px_44px_rgba(0,0,0,0.45)]"
      : isCyclePoster
        ? "border-emerald-200 bg-white shadow-[0_16px_44px_rgba(16,185,129,0.16)]"
        : "border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]";
    const posterChipClass = isDarkPoster
      ? "border-white/15 bg-black/25 text-slate-100"
      : "border-slate-200 bg-white/80 text-slate-700";
    const posterDescriptionClass = isDarkPoster
      ? "text-slate-300"
      : "text-slate-700";
    const posterSummaryClass = isDarkPoster
      ? "border border-white/15 bg-black/20 px-3 py-2.5 text-center text-slate-100 shadow-none"
      : "rounded-2xl bg-slate-50/80 px-3 py-2.5 text-center";
    const posterSummaryLabelClass = isDarkPoster
      ? "text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400"
      : "text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500";
    const posterSummaryValueClass = isDarkPoster
      ? "mt-1 text-[13px] font-semibold leading-snug text-slate-50 sm:text-[14px]"
      : "mt-1 text-[13px] font-semibold leading-snug text-slate-900 sm:text-[14px]";
    const posterRegionWrapClass = isDarkPoster
      ? "border-white/20 bg-black/20"
      : isCyclePoster
        ? "border-emerald-200/70 bg-emerald-50/60"
        : "border-slate-100";
    const posterRegionTitleClass = isDarkPoster
      ? "bg-[#111111] text-slate-300"
      : isCyclePoster
        ? "bg-white text-emerald-700"
        : "bg-white text-slate-700";
    const posterRegionChipClass = isDarkPoster
      ? "border-white/15 bg-white/5 text-slate-100"
      : isCyclePoster
        ? "border border-emerald-100 bg-white px-3 py-2 text-[12px] font-medium leading-5 text-slate-800"
        : "bg-slate-50/80 px-3 py-2 text-[12px] font-medium leading-5 text-slate-800";
    const posterActionClass = isDarkPoster
      ? "border-white/15 bg-white/5 text-slate-100 hover:border-white/30 hover:bg-white/10"
      : isCyclePoster
        ? "border border-emerald-200 bg-white text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50"
        : "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50";
    const posterActionDestructiveClass = isDarkPoster
      ? "border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:border-rose-400/60 hover:bg-rose-500/20"
      : "border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100";
    const posterFooterButtonClass = isDarkPoster
      ? "border-white/20 bg-black/30 text-white shadow-[0_10px_22px_rgba(0,0,0,0.35)] hover:bg-black/45"
      : footerActionButtonClass;

    // A lone action on the cycle/info card (e.g. "Chỉnh sửa") reads as a
    // corner icon button next to the eyebrow badge instead of a bottom bar —
    // there's nothing else competing for that space once status is gone.
    const cornerAction =
      isCyclePoster && data.actions?.length === 1 ? data.actions[0] : null;

    return (
      <div className={widthClass}>
        {data.targetTopHandleId && (
          <WorkflowHandle
            id={data.targetTopHandleId}
            type="target"
            position={Position.Top}
          />
        )}
        {data.sourceBottomHandleId && (
          <WorkflowHandle
            id={data.sourceBottomHandleId}
            type="source"
            position={Position.Bottom}
          />
        )}

        <div
          className={[
            "overflow-hidden border backdrop-blur-sm",
            // A tighter radius than the plan cards' rounded-[24px] keeps the
            // workflow (cycle) card visually distinct on the canvas.
            isCyclePoster ? "rounded-xl" : "rounded-[24px]",
            posterWrapperClass,
          ].join(" ")}
        >
          <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <Badge
              variant="outline"
              className={[
                "h-8 rounded-xl px-3.5 text-[11px] font-semibold tracking-[0.14em]",
                posterBadgeClass,
              ].join(" ")}
            >
              {data.eyebrow ?? config.badge}
            </Badge>

            <div className="flex items-center gap-2">
              {status && (
                <Badge
                  variant="outline"
                  className={[
                    "h-8 rounded-xl px-3.5 text-[11px] font-semibold tracking-[0.14em]",
                    posterStatusClass,
                  ].join(" ")}
                >
                  {data.statusLabel ?? status.label}
                </Badge>
              )}
              {cornerAction && (
                <Button
                  type="button"
                  size="sm"
                  aria-label={cornerAction.label}
                  className="nodrag h-8 gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 shadow-none hover:bg-emerald-100"
                  disabled={cornerAction.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    cornerAction.onClick();
                  }}
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <cornerAction.icon className="h-4 w-4" />
                  {cornerAction.label}
                </Button>
              )}
            </div>
          </div>

          <h3
            className={[
              "mt-4 text-[20px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[22px]",
              isDarkPoster ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            {data.title}
          </h3>

          {data.badgeBelowTitle ? (
            <div className="mt-3">
              <Badge
                variant="outline"
                className={[
                  "h-8 rounded-xl px-3.5 text-[11px] font-semibold tracking-[0.14em]",
                  posterBadgeClass,
                ].join(" ")}
              >
                {data.badgeBelowTitle}
              </Badge>
            </div>
          ) : null}

          {data.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={[
                    "h-8 rounded-xl px-3.5 text-[11px] font-semibold tracking-[0.14em]",
                    posterBadgeClass,
                  ].join(" ")}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          {data.description && (
            <p
              className={[
                "mt-3 max-w-[720px] text-[13px] leading-6",
                posterDescriptionClass,
              ].join(" ")}
            >
              {data.description}
            </p>
          )}

          {data.summaries?.length ? (
            <div
              className={[
                "mt-5 grid gap-x-5 gap-y-3",
                data.summaries.length >= 4
                  ? "grid-cols-2 lg:grid-cols-4"
                  : data.summaries.length === 3
                    ? "grid-cols-3"
                    : data.summaries.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-1",
              ].join(" ")}
            >
              {data.summaries.map((summary) => (
                <div
                  key={`${data.title}-${summary.label}`}
                  className={posterSummaryClass}
                >
                  <p className={posterSummaryLabelClass}>{summary.label}</p>
                  <p className={posterSummaryValueClass}>{summary.value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {data.regionLabels?.length ? (
            <div
              className={[
                "mt-5 rounded-[18px] border-2 border-dashed px-4 py-3",
                posterRegionWrapClass,
              ].join(" ")}
            >
              <div
                className={[
                  "mx-auto -mt-6 w-fit rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em]",
                  posterRegionTitleClass,
                ].join(" ")}
              >
                Vùng canh tác
              </div>
              {data.regionLabels.length === 1 &&
              data.regionLabels[0] === EMPTY_REGION_LABEL ? (
                <p
                  className={[
                    "mt-3 text-center text-[13px] font-normal",
                    isDarkPoster ? "text-slate-300" : "text-slate-500",
                  ].join(" ")}
                >
                  {EMPTY_REGION_LABEL}
                </p>
              ) : (
                <div className="mt-3 grid gap-2 text-center md:grid-cols-2">
                  {data.regionLabels.map((label) => (
                    <div
                      key={label}
                      className={[
                        "rounded-xl border px-3 py-2 text-center text-[12px] font-medium leading-5",
                        posterRegionChipClass,
                      ].join(" ")}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {data.actions?.length && !cornerAction ? (
            <div
              className={[
                "mt-5 grid gap-2.5",
                data.actions.length >= 3
                  ? "md:grid-cols-3"
                  : data.actions.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-1",
              ].join(" ")}
            >
              {data.actions.map((action) => {
                const ActionIcon = action.icon;

                return (
                  <Button
                    key={`${data.title}-${action.label}`}
                    size="sm"
                    variant="outline"
                    className={[
                      "nodrag h-10 justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold shadow-none",
                      action.tone === "destructive"
                        ? posterActionDestructiveClass
                        : posterActionClass,
                    ].join(" ")}
                    disabled={action.disabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick();
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <ActionIcon className="h-4 w-4" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          ) : null}
          </div>
        </div>
        {isDarkPoster && data.footerAction ? (
          <div className="flex justify-center">
            <div className="mt-[-18px] rounded-full border border-white/15 bg-[#111111] p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <Button
                type="button"
                variant="outline"
                aria-label={data.footerAction?.label ?? "Thêm node"}
                className={[
                  "h-[42px] w-[42px] rounded-full border px-0",
                  posterFooterButtonClass,
                ].join(" ")}
                onClick={(event) => {
                  event.stopPropagation();
                  data.footerAction?.onClick();
                }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                {data.footerAction ? (
                  <data.footerAction.icon className={footerActionIconClass} />
                ) : (
                  <Workflow className={footerActionIconClass} />
                )}
                </Button>
            </div>
          </div>
        ) : (
          renderFooterAction()
        )}
      </div>
    );
  }

  return (
    <>
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
              <Badge
                variant="secondary"
                className="text-[9px] uppercase tracking-[0.18em]"
              >
                {data.eyebrow ?? config.badge}
              </Badge>
              {status && (
                <Badge
                  variant="outline"
                  className={[
                    "text-[9px] uppercase tracking-[0.18em]",
                    status.badgeClass,
                  ].join(" ")}
                >
                  {status.label}
                </Badge>
              )}
            </div>
            <h3
              className="text-[14px] font-semibold leading-5 text-slate-900"
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
              <p className="mt-1 text-sm text-slate-600">{data.subtitle}</p>
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
                <p className="mt-1 text-[12px] font-semibold leading-4 text-slate-900">
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
                  disabled={action.disabled}
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
      {renderFooterAction()}
    </>
  );
}
