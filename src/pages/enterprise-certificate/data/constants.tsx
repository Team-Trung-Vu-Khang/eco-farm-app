import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";

const ENTITY_TYPE_LABELS = {
  workspace: "Cấp phép theo đơn vị - tổ chức",
  region: "Cấp phép theo vùng canh tác cụ thể",
} as const;

export const getCertificateColumns = (): Column<EnterpriseCertificate>[] => [
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
    render: (value, row) => {
      return (
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
        >
          {row.agricultureCertificate?.name || (value as string)}
        </Badge>
      );
    },
  },
  {
    key: "entityName",
    label: "Đối tượng",
    render: (value, row) => {
      if (row.entityType === "workspace") {
        return (
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-800"
          >
            Đơn vị - Tổ chức
          </Badge>
        );
      }

      const targetNames =
        row.targetNames?.filter(Boolean) ??
        String(value ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      if (targetNames.length === 0) {
        return (
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-800"
          >
            Chưa xác định
          </Badge>
        );
      }

      const visibleNames = targetNames.slice(0, 2);
      const hiddenCount = targetNames.length - visibleNames.length;

      return (
        <div className="flex flex-wrap gap-1.5">
          {visibleNames.map((name, index) => (
            <Badge
              key={`${name}-${index}`}
              variant="secondary"
              className="max-w-[220px] rounded-full bg-slate-100 px-2.5 py-1 text-slate-800"
            >
              <span className="truncate">{name}</span>
            </Badge>
          ))}
          {hiddenCount > 0 ? (
            <Badge
              variant="outline"
              className="rounded-full px-2.5 py-1 text-[10px] text-slate-600"
            >
              +{hiddenCount}
            </Badge>
          ) : null}
        </div>
      );
    },
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

export const getFilterConfig = (standards: Standard[]) => {
  const standardOptions = standards.map((standard) => ({
    label: standard.name,
    value: standard.code,
  }));

  return [
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
      options: standardOptions,
    },
    {
      key: "entityType",
      label: "Loại đối tượng",
      options: [
        { label: ENTITY_TYPE_LABELS.workspace, value: "workspace" },
        { label: ENTITY_TYPE_LABELS.region, value: "region" },
      ],
    },
  ];
};
