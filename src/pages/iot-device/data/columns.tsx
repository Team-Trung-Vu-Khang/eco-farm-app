import { Badge, cn, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { IoTDevice } from "../types";
import { perceptionLayerOptions, networkLayerOptions } from "./constants";
import {
  Wifi,
  WifiOff,
  BatteryLow,
  AlertTriangle,
} from "lucide-react";

interface ColumnOptions {
  onNameClick: (device: IoTDevice) => void;
}

export const getDeviceColumns = ({
  onNameClick,
}: ColumnOptions): Column<IoTDevice>[] => [
  {
    key: "name",
    label: "Tên thiết bị",
    render: (value, item) => (
      <div
        className="font-medium text-primary hover:underline cursor-pointer flex flex-col"
        onClick={() => onNameClick(item)}
      >
        <span>{value as string}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          {item.imei}
        </span>
      </div>
    ),
  },
  {
    key: "perceptionLayerId",
    label: "Phân loại",
    render: (_: any, item: IoTDevice) => {
      const p = perceptionLayerOptions.find(o => o.id === item.perceptionLayerId)?.label || "N/A";
      const n = networkLayerOptions.find(o => o.id === item.networkLayerId)?.label || "N/A";
      return (
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-muted-foreground truncate max-w-[200px]" title={p}>• {p}</span>
          <span className="text-muted-foreground truncate max-w-[200px]" title={n}>• {n}</span>
        </div>
      );
    }
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const status = value as IoTDevice["status"];
      switch (status) {
        case "online":
          return (
            <Badge
              variant="default"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 px-2 py-0.5"
            >
              <Wifi className="w-3 h-3" />
              Trực tuyến
            </Badge>
          );
        case "offline":
          return (
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-500 border-slate-200 gap-1.5 px-2 py-0.5"
            >
              <WifiOff className="w-3 h-3" />
              Ngoại tuyến
            </Badge>
          );
        case "low_battery":
          return (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-600 border-orange-200 gap-1.5 px-2 py-0.5"
            >
              <BatteryLow className="w-3 h-3" />
              Pin yếu
            </Badge>
          );
        case "error":
          return (
            <Badge
              variant="destructive"
              className="bg-rose-50 text-rose-600 border-rose-200 gap-1.5 px-2 py-0.5"
            >
              <AlertTriangle className="w-3 h-3" />
              Lỗi
            </Badge>
          );
        default:
          return value as string;
      }
    },
  },
  {
    key: "batteryLevel",
    label: "Pin",
    render: (value) => {
      const level = value as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                level > 50
                  ? "bg-emerald-500"
                  : level > 20
                    ? "bg-orange-500"
                    : "bg-rose-500",
              )}
              style={{ width: `${level}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500">{level}%</span>
        </div>
      );
    },
  },
  {
    key: "rssi",
    label: "Tín hiệu",
    render: (value) => {
      const rssi = value as number;
      return (
        <span
          className={cn(
            "text-xs font-mono",
            rssi > -70
              ? "text-emerald-600"
              : rssi > -85
                ? "text-orange-600"
                : "text-rose-600",
          )}
        >
          {rssi} dBm
        </span>
      );
    },
  },
  {
    key: "lastHeartbeat",
    label: "Cập nhật cuối",
    render: (value) => {
      const date = new Date(value as string);
      return (
        <span className="text-xs text-slate-500">
          {date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          - {date.toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
];
