import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PlanStatus } from "../types";

export function getPlanStatusBadge(status: PlanStatus | string) {
  const statusConfig = {
    active: { label: "Đang thực hiện", variant: "default" as const },
    completed: { label: "Hoàn thành", variant: "secondary" as const },
    draft: { label: "Bản nháp", variant: "outline" as const },
    pending: { label: "Chờ thực hiện", variant: "outline" as const },
    cancelled: { label: "Đã hủy", variant: "destructive" as const },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
