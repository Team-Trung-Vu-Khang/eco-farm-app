import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<string, { label: string; variant: any }> = {
    draft: { label: "Bản nháp", variant: "secondary" },
    pending: { label: "Chờ ký", variant: "outline" },
    active: { label: "Đang hiệu lực", variant: "default" },
    expired: { label: "Hết hạn", variant: "destructive" },
    terminated: { label: "Đã chấm dứt", variant: "destructive" },
  };

  const statusInfo = statusMap[status] || statusMap.draft;

  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};
