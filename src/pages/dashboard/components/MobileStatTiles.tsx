import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LucideIcon } from "lucide-react";

export interface MobileStatTile {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
}

/** Lưới 3 ô thống kê gọn cho điện thoại (thay cho StatsCard xếp chồng) */
export function MobileStatTiles({ tiles }: { tiles: MobileStatTile[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map(({ label, value, icon: Icon, iconColor }) => (
        <div
          key={label}
          className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              iconColor,
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-slate-900">
              {value}
            </p>
            <p className="text-[11px] leading-tight text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
