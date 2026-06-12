import { Badge, cn, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Gauge, Layers3, XCircle } from "lucide-react";
import type { IoTDeviceGroup } from "../types";

interface ColumnOptions {
  getActualDeviceCount: (groupId: number) => number;
}

const statusMap = {
  active: {
    label: "Đang hoạt động",
    className:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 gap-1.5 px-2.5 py-0.5",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Tạm dừng",
    className:
      "bg-slate-100 text-slate-500 border-slate-200 gap-1.5 px-2.5 py-0.5",
    icon: XCircle,
  },
} as const;

export const getIoTDeviceGroupColumns = ({
  getActualDeviceCount,
}: ColumnOptions): Column<IoTDeviceGroup>[] => [
  {
    key: "code",
    label: "Mã nhóm",
    render: (value) => (
      <span className="font-mono text-xs font-bold text-slate-700">
        {value as string}
      </span>
    ),
  },
  {
    key: "name",
    label: "Tên nhóm",
    render: (value, item) => (
      <div className="space-y-1">
        <div className="font-semibold text-slate-900">{value as string}</div>
        <p className="max-w-xl text-xs text-slate-500 line-clamp-2">
          {item.description}
        </p>
      </div>
    ),
  },
  {
    key: "deviceTypes",
    label: "Loại thiết bị",
    render: (value) => {
      const types = value as IoTDeviceGroup["deviceTypes"];
      return (
        <div className="flex flex-wrap gap-1.5">
          {types.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="rounded-full border-slate-200 bg-slate-50 text-slate-600"
            >
              {type}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    key: "plannedDeviceCount",
    label: "Thiết bị",
    render: (value, item) => {
      const actualDeviceCount = getActualDeviceCount(item.id);
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <Gauge className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">
              {actualDeviceCount}/{value as number}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">thực tế/kế hoạch</span>
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const status = value as IoTDeviceGroup["status"];
      const config = statusMap[status];
      const Icon = config.icon;

      return (
        <Badge variant="outline" className={cn("whitespace-nowrap", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "updatedAt",
    label: "Cập nhật cuối",
    render: (value) => (
      <span className="text-xs text-slate-500">
        {new Date(value as string).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
];
