/* eslint-disable react-refresh/only-export-components */
import {
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  MoreHorizontal,
  PencilLine,
  Sprout,
  Trash2,
  Workflow,
} from "lucide-react";
import type { Plan } from "../types";
import { getPlanStatusBadge } from "../utils/status";
import { formatAcreageLabel } from "../utils/workflow-zone-details.util";
import { TERMS } from "@/config/terminology";

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("vi-VN");
}

function getDurationDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "—";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const diff = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
  return `${diff} ngày`;
}

function resolveLocationLabel(plan: Plan) {
  const regionCount = plan.selectedRegionIds?.length || 0;
  return (
    plan.cultivationRegion ||
    plan.zone ||
    plan.plot ||
    (regionCount > 0 ? `${regionCount} vùng trồng` : "") ||
    "Chưa xác định"
  );
}

export function createPlanGrowthColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: Plan) => void;
  onEdit: (item: Plan) => void;
  onDelete: (item: Plan) => void;
}): Column<Plan>[] {
  return [
    {
      key: "code",
      label: "Mã",
      mobilePriority: "secondary",
      render: (value) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {value as string}
        </span>
      ),
    },
    {
      key: "name",
      label: "Kế hoạch",
      mobilePriority: "primary",
      render: (value, item) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">{value as string}</div>
          <div className="text-xs text-slate-500">
            {item.description || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Thời gian khởi tạo",
      mobilePriority: "secondary",
      render: (value) => (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDate(value as string | undefined)}</span>
        </div>
      ),
    },
    {
      key: "endDate",
      label: "Thời gian triển khai dự kiến",
      mobilePriority: "secondary",
      render: (_, item) => (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-[10px] font-bold uppercase tracking-wide text-blue-700"
        >
          {getDurationDays(item.startDate, item.endDate)}
        </Badge>
      ),
    },
    {
      key: "zone",
      label: TERMS.zone,
      mobilePriority: "secondary",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-sm text-slate-700">
            {resolveLocationLabel(item)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      mobilePriority: "badge",
      render: (_, row) => getPlanStatusBadge(row.status),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (_, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-primary"
            >
              <span className="sr-only">Mở menu thao tác</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <PencilLine className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export const UNASSIGNED_WORKFLOW_ID = "__unassigned__";

export interface WorkflowRow {
  id: string;
  name: string;
  description: string;
  totalCount: number;
  activeCount: number;
  draftCount: number;
  completedCount: number;
  cancelledCount: number;
  /** Danh sách tên vùng canh tác áp dụng */
  zoneNames: string[];
  /** Danh sách Cây canh tác & Giống */
  cropNames: string[];
  /** Tổng diện tích các vùng/lô (ha) */
  totalAcreage: number | null;
}

export function createWorkflowColumns({
  onView,
  onOpenWorkflow,
  onClone,
  onDelete,
}: {
  onView: (row: WorkflowRow) => void;
  onOpenWorkflow: (row: WorkflowRow) => void;
  onClone: (row: WorkflowRow) => void;
  onDelete: (row: WorkflowRow) => void;
}): Column<WorkflowRow>[] {
  return [
    {
      key: "name",
      label: "Sơ đồ quy trình",
      mobilePriority: "primary",
      render: (value, item) => (
        <div className="space-y-1 min-w-[180px]">
          <div className="font-semibold text-slate-900">{value as string}</div>
          <div className="text-xs text-slate-500 line-clamp-2">
            {item.description || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "zoneNames",
      label: `${TERMS.zone} áp dụng`,
      mobilePriority: "secondary",
      render: (_, item) => {
        const count = item.zoneNames.length;
        if (count === 0) {
          return <span className="text-xs text-slate-400">—</span>;
        }
        const first = item.zoneNames[0];
        const remaining = count - 1;
        return (
          <div
            className="flex items-center gap-1.5 min-w-[140px]"
            title={item.zoneNames.join(", ")}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="text-sm font-medium text-slate-800 truncate max-w-[150px]">
              {first}
            </span>
            {remaining > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-slate-600 px-1 py-0 shrink-0"
              >
                +{remaining}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "cropNames",
      label: TERMS.crop,
      mobilePriority: "secondary",
      render: (_, item) => {
        const count = item.cropNames.length;
        if (count === 0) {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return (
          <div className="flex flex-wrap items-center gap-1 min-w-[130px]">
            {/* <Sprout className="h-3.5 w-3.5 shrink-0 text-green-600" /> */}
            <div className="flex flex-wrap justify-end gap-1 max-w-[180px]">
              {item.cropNames.map((crop, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-800"
                >
                  {crop}
                </Badge>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      key: "totalAcreage",
      label: "Diện tích",
      mobilePriority: "secondary",
      render: (value) => {
        const formatted = formatAcreageLabel(value as number | null);
        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">
              {formatted}
            </span>
          </div>
        );
      },
    },
    {
      key: "totalCount",
      label: "Kế hoạch",
      mobilePriority: "badge",
      render: (_, item) => {
        if (item.totalCount === 0) {
          return (
            <span className="text-xs text-slate-400">Chưa có kế hoạch</span>
          );
        }
        return (
          <div className="space-y-1 whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-semibold text-slate-900">
                {item.totalCount} kế hoạch
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.activeCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700 px-1.5 py-0"
                >
                  {item.activeCount} đang chạy
                </Badge>
              )}
              {item.draftCount > 0 && item.activeCount === 0 && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700 px-1.5 py-0"
                >
                  {item.draftCount} nháp
                </Badge>
              )}
              {item.completedCount > 0 &&
                item.activeCount === 0 &&
                item.draftCount === 0 && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700 px-1.5 py-0"
                  >
                    {item.completedCount} hoàn thành
                  </Badge>
                )}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (_, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-primary"
            >
              <span className="sr-only">Mở menu thao tác</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={item.id === UNASSIGNED_WORKFLOW_ID}
              onClick={() => onOpenWorkflow(item)}
            >
              <Workflow className="mr-2 h-4 w-4" />
              Workflow
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={item.id === UNASSIGNED_WORKFLOW_ID}
              onClick={() => onClone(item)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Nhân bản
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={item.id === UNASSIGNED_WORKFLOW_ID}
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export const planGrowthFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Đang triển khai", value: "active" },
      { label: "Bản nháp", value: "draft" },
      { label: "Đã hoàn thành", value: "completed" },
      { label: "Đã hủy", value: "cancelled" },
    ],
  },
];

export function PlanGrowthStatisticsCards({
  totalCount,
  draftCount,
  activeCount,
  completedCount,
  cancelledCount,
}: {
  totalCount: number;
  draftCount: number;
  activeCount: number;
  completedCount: number;
  cancelledCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Tổng kế hoạch</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{draftCount}</p>
            <p className="text-sm text-muted-foreground">Bản nháp</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Đang triển khai</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {completedCount}
            </p>
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-red-100 p-3 text-red-600">
            <Ban className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {cancelledCount}
            </p>
            <p className="text-sm text-muted-foreground">Đã hủy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
