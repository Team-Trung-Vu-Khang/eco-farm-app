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
  MoreHorizontal,
  PencilLine,
  Trash2,
  Workflow,
} from "lucide-react";
import type { Plan } from "../../../stores/useAnimalGrowthPlanStore";
import { getPlanStatusBadge } from "../utils/status";

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
    (regionCount > 0 ? `${regionCount} khu chăn nuôi` : "") ||
    "Chưa xác định"
  );
}

export function createPlanAnimalGrowthColumns({
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
      render: (value) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {value as string}
        </span>
      ),
    },
    {
      key: "name",
      label: "Kế hoạch",
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
      label: "Khu chăn nuôi",
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
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <PencilLine className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            {item.status === "draft" && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
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
}

export function createWorkflowColumns({
  onView,
  onOpenWorkflow,
  onClone,
}: {
  onView: (row: WorkflowRow) => void;
  onOpenWorkflow: (row: WorkflowRow) => void;
  onClone: (row: WorkflowRow) => void;
}): Column<WorkflowRow>[] {
  return [
    {
      key: "name",
      label: "Sơ đồ quy trình",
      render: (value, item) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">{value as string}</div>
          <div className="text-xs text-slate-500">{item.description || "—"}</div>
        </div>
      ),
    },
    {
      key: "totalCount",
      label: "Số lượng kế hoạch",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-sm font-semibold text-slate-800">
            {value as number}
          </span>
        </div>
      ),
    },
    {
      key: "activeCount",
      label: "Đang triển khai",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-sm font-semibold text-blue-700">
            {value as number}
          </span>
        </div>
      ),
    },
    {
      key: "draftCount",
      label: "Theo trạng thái",
      render: (_, item) => (
        <div className="flex flex-wrap gap-1.5">
          {item.draftCount > 0 && (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700"
            >
              {item.draftCount} nháp
            </Badge>
          )}
          {item.activeCount > 0 && (
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700"
            >
              {item.activeCount} triển khai
            </Badge>
          )}
          {item.completedCount > 0 && (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700"
            >
              {item.completedCount} hoàn thành
            </Badge>
          )}
          {item.cancelledCount > 0 && (
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-[10px] font-bold text-red-700"
            >
              {item.cancelledCount} hủy
            </Badge>
          )}
          {item.totalCount === 0 && (
            <span className="text-xs text-slate-400">Chưa có kế hoạch</span>
          )}
        </div>
      ),
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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export const animalGrowthFilters = [
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
  {
    key: "seasonName",
    label: "Lứa nuôi",
    options: [
      { label: "Vụ Xuân 2025", value: "Vụ Xuân 2025" },
      { label: "Vụ Hè 2025", value: "Vụ Hè 2025" },
      { label: "Vụ Thu 2025", value: "Vụ Thu 2025" },
      { label: "Vụ Đông 2025", value: "Vụ Đông 2025" },
    ],
  },
  {
    key: "crop",
    label: "Vật nuôi",
    options: [
      { label: "Heo thịt", value: "Heo thịt" },
      { label: "Gà đẻ", value: "Gà đẻ" },
      { label: "Bò thịt", value: "Bò thịt" },
    ],
  },
];

export function PlanAnimalGrowthStatisticsCards({
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
