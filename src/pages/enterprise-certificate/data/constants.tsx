import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";

export const getCertificateColumns = (): Column<EnterpriseCertificate>[] => [
  { key: "code", label: "Mã chứng nhận" },
  { key: "name", label: "Tên chứng nhận" },
  { key: "standardType", label: "Loại tiêu chuẩn" },
  {
    key: "entityName",
    label: "Đối tượng",
    render: (value, row) => (
      <div className="flex flex-col">
        <span className="font-medium">{value as string}</span>
        <span className="text-xs text-muted-foreground">
          {row.entityType === "enterprise" ? "Doanh nghiệp" : "Vùng trồng"}
        </span>
      </div>
    ),
  },
  { key: "organization", label: "Tổ chức cấp" },
  { key: "issuedDate", label: "Ngày cấp" },
  { key: "expiryDate", label: "Ngày hết hạn" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const statusConfig = {
        valid: {
          variant: "default",
          label: "Đang hiệu lực",
          icon: CheckCircle2,
        },
        expiring_soon: {
          variant: "secondary",
          label: "Sắp hết hạn",
          icon: Clock,
        },
        expired: {
          variant: "destructive",
          label: "Hết hạn",
          icon: AlertCircle,
        },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      const Icon = config.icon;
      return (
        <Badge variant={config.variant as any} className="gap-1">
          <Icon className="w-3 h-3" />
          {config.label}
        </Badge>
      );
    },
  },
];

export const getFilterConfig = (standards: Standard[]) => [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Đang hiệu lực", value: "valid" },
      { label: "Sắp hết hạn", value: "expiring_soon" },
      { label: "Hết hạn", value: "expired" },
    ],
  },
  {
    key: "standardType",
    label: "Loại tiêu chuẩn",
    options: [
      ...standards.map((standard) => ({
        label: standard.name,
        value: standard.code,
      })),
    ],
  },
  {
    key: "entityType",
    label: "Loại đối tượng",
    options: [
      { label: "Doanh nghiệp", value: "enterprise" },
      { label: "Vùng trồng", value: "area" },
    ],
  },
];
