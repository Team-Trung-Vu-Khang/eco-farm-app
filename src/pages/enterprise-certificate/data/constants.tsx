import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";

export const getCertificateColumns = (
  standards: Standard[],
): Column<EnterpriseCertificate>[] => [
  {
    key: "code",
    label: "Mã chứng nhận",
    render: (value) => (
      <Badge
        variant="outline"
        className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
      >
        {value as string}
      </Badge>
    ),
  },
  { key: "name", label: "Tên chứng nhận" },
  {
    key: "standardType",
    label: "Loại tiêu chuẩn",
    render: (value) => {
      const selectedStandard = standards.find((item) => item.code === value);

      return (
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
        >
          {selectedStandard?.name || (value as string)}
        </Badge>
      );
    },
  },
  {
    key: "entityName",
    label: "Đối tượng",
    render: (value, row) => (
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="max-w-[220px] rounded-full bg-slate-100 px-2.5 py-1 text-slate-800"
          >
            <span className="truncate">{value as string}</span>
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-1 text-[10px]"
          >
            {row.entityType === "enterprise" ? "Doanh nghiệp" : "Vùng trồng"}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-700"
          >
            {row.entityId}
          </Badge>
        </div>
      </div>
    ),
  },
  {
    key: "organization",
    label: "Tổ chức cấp",
    render: (value) => (
      <Badge
        variant="secondary"
        className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700"
      >
        {value as string}
      </Badge>
    ),
  },
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
        revoked: {
          variant: "secondary",
          label: "Đã thu hồi",
          icon: AlertCircle,
        },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      const Icon = config.icon;
      return (
        <Badge
          variant={config.variant as "default" | "secondary" | "destructive"}
          className="rounded-full gap-1 px-2.5 py-1"
        >
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
