import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  cn,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList } from "lucide-react";
import { CodeBadge } from "@/components/CodeBadge";
import { farmPlanApi } from "@/features/farm-workflow/api/farm-workflow.api";
import type {
  FarmPlanPurpose,
  FarmPlanResponse,
  FarmPlanStatus,
} from "@/features/farm-workflow/types/farm-workflow.type";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";
import {
  PURPOSE_TO_WORK_TYPE_MAP,
  WORK_TYPE_OPTIONS,
} from "@/pages/diary/constants/history-form.constants";

interface PlansTabProps {
  zoneId: number;
  /** Có khi xem vùng của workspace khác (admin) → ghi đè X-Workspace-Id */
  workspaceId?: number | null;
}

/** Nút lọc mục đích: theo bộ enum đang bật (ENABLE_NEW_PURPOSE_ENUMS) */
const PURPOSE_FILTERS = WORK_TYPE_OPTIONS.map((option) => ({
  value: (Object.keys(PURPOSE_TO_WORK_TYPE_MAP) as FarmPlanPurpose[]).find(
    (purpose) => PURPOSE_TO_WORK_TYPE_MAP[purpose] === option.value,
  )!,
  label: option.label,
  icon: option.icon,
}));

const STATUS_CONFIG: Record<FarmPlanStatus, { label: string; className: string }> = {
  DRAFT: { label: "Bản nháp", className: "bg-slate-200 text-slate-700" },
  IN_PROGRESS: { label: "Đang thực hiện", className: "bg-primary text-white" },
  COMPLETED: { label: "Hoàn thành", className: "bg-green-600 text-white" },
  CANCELLED: { label: "Đã hủy", className: "bg-red-500 text-white" },
};

const formatDate = (value?: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : "---";

const columns: Column<FarmPlanResponse>[] = [
  { key: "code", label: "Mã", render: (value) => <CodeBadge value={value} /> },
  { key: "name", label: "Tên kế hoạch" },
  {
    key: "purpose",
    label: "Mục đích",
    render: (_, row) => FARM_PLAN_PURPOSE_LABELS[row.purpose] ?? row.purpose,
  },
  {
    key: "workflow",
    label: "Vụ mùa",
    render: (_, row) => row.workflow?.name ?? "---",
  },
  {
    key: "plannedStartDate",
    label: "Thời gian",
    render: (_, row) =>
      `${formatDate(row.plannedStartDate)} – ${formatDate(row.plannedEndDate)}`,
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, row) => {
      const config = STATUS_CONFIG[row.status] ?? STATUS_CONFIG.DRAFT;
      return (
        <Badge className={cn("border-none", config.className)}>
          {config.label}
        </Badge>
      );
    },
  },
];

export const PlansTab = ({ zoneId, workspaceId }: PlansTabProps) => {
  const [purpose, setPurpose] = useState<FarmPlanPurpose>();
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  // BE lọc KH có scope Workflow khớp (cùng node hoặc cha–con) với scope vùng
  const { data, isLoading } = useQuery({
    queryKey: ["farm-plans", "by-zone", workspaceId ?? "current", zoneId, purpose, pageSize, currentIndex],
    queryFn: () =>
      farmPlanApi.list(
        {
          cultivationZoneId: zoneId,
          purpose,
          page: currentIndex - 1,
          size: pageSize,
        },
        workspaceId ?? undefined,
      ),
    enabled: !!zoneId,
  });

  const changePurpose = (value?: FarmPlanPurpose) => {
    setPurpose(value);
    setCurrentIndex(1);
  };

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="border-b bg-slate-50/50 py-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <ClipboardList className="h-4 w-4 text-primary" />
          Kế hoạch áp dụng cho vùng
        </CardTitle>
        <CardDescription className="mt-0.5 text-xs">
          Gồm kế hoạch có phạm vi vụ mùa trùng hoặc bao trùm phạm vi của vùng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {[{ value: undefined, label: "Tất cả", icon: null }, ...PURPOSE_FILTERS].map(
            (option) => {
              const isActive = purpose === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value ?? "all"}
                  type="button"
                  onClick={() => changePurpose(option.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {option.label}
                </button>
              );
            },
          )}
        </div>

        <DataTable
          loading={isLoading}
          columns={columns}
          data={data?.content ?? []}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={data?.totalElements}
          totalPages={data?.totalPages}
          onPageSize={(size) => {
            setPageSize(size);
            setCurrentIndex(1);
          }}
          onIndexChange={setCurrentIndex}
        />
      </CardContent>
    </Card>
  );
};
