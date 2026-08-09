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
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MoreHorizontal,
  Eye,
  PencilLine,
  Sprout,
  Trash2,
} from "lucide-react";
import type { Plan } from "../../../stores/usePlanStore";
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

function resolveCropLabel(plan: Plan) {
  return [plan.crop, plan.variety].filter(Boolean).join(" - ") || "Chưa xác định";
}

export function createAnimalGrowthColumns({
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
      label: "Kế hoạch chăn nuôi",
      render: (value, item) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">{value as string}</div>
          <div className="text-xs text-slate-500">{item.description || "—"}</div>
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
      key: "seasonName",
      label: "Mùa vụ",
      render: (value) => (
        <span className="text-sm font-medium text-slate-700">{(value as string) || "—"}</span>
      ),
    },
    {
      key: "startDate",
      label: "Thời gian bắt đầu",
      render: (value) => (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-emerald-500" />
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
          <span className="text-sm text-slate-700">{resolveLocationLabel(item)}</span>
        </div>
      ),
    },
    {
      key: "crop",
      label: "Vật nuôi",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Sprout className="h-3.5 w-3.5 text-green-500" />
          <span className="text-sm text-slate-700">{resolveCropLabel(item)}</span>
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
    label: "Mùa vụ",
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

export function AnimalGrowthStatisticsCards({
  totalCount,
  draftCount,
  activeCount,
  completedCount,
}: {
  totalCount: number;
  draftCount: number;
  activeCount: number;
  completedCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Tổng kế hoạch chăn nuôi</p>
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
            <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
