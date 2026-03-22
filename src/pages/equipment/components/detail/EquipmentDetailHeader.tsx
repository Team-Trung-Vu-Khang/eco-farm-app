import { Badge, Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarDays, TimerReset, Wrench } from "lucide-react";
import type { Equipment } from "../../data/constants";

interface EquipmentDetailHeaderProps {
  item: Equipment;
}

export const EquipmentDetailHeader = ({ item }: EquipmentDetailHeaderProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md bg-white">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 bg-white rounded-xl shadow-sm border p-2 flex items-center justify-center shrink-0">
          <Wrench className="w-12 h-12 text-slate-300" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                <span className="bg-white px-2 py-0.5 rounded border font-mono text-xs font-semibold">
                  {item.code}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Ngày nhập: {item.createdAt}
                </span>
              </div>
            </div>
            <Badge
              variant={
                item.status === "active"
                  ? "default"
                  : item.status === "maintenance"
                    ? "destructive"
                    : "secondary"
              }
              className="capitalize"
            >
              {item.status === "active"
                ? "Hoạt động tốt"
                : item.status === "maintenance"
                  ? "Đang bảo trì"
                  : "Ngừng sử dụng"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-white/50 border-blue-200 text-blue-800"
            >
              {item.type}
            </Badge>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-200">
              <TimerReset className="w-3 h-3" />
              Bảo dưỡng: {item.maintainanceInterval}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
