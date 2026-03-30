import { Badge, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, Building2, Check, MapPin } from "lucide-react";
import type { Region } from "../../../../region-chart/constants";

type EnterpriseOption = {
  id: string | number;
  name: string;
};

type CultivationZoneRegionCardProps = {
  region: Region;
  enterprise?: EnterpriseOption;
  selected: boolean;
  onToggle: () => void;
};

export function CultivationZoneRegionCard({
  region,
  enterprise,
  selected,
  onToggle,
}: CultivationZoneRegionCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-3xl border-2 bg-white p-5 transition-all",
        selected
          ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10 ring-1 ring-primary/20"
          : "border-transparent shadow-sm hover:border-slate-200 hover:shadow-lg",
      )}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-colors",
              selected
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
            )}
          >
            <Building2 size={24} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary/60">
                {region.code}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {region.area} ha
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-primary">
              {region.name}
            </h4>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={12} className="text-slate-300" />
              {region.address}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "scale-110 border-primary bg-primary text-white"
              : "border-slate-200 bg-white",
          )}
        >
          {selected && <Check size={14} className="stroke-3" />}
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">
            {enterprise?.name || "N/A"}
          </span>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "border-none text-[10px] font-bold",
            region.status === "active"
              ? "bg-emerald-50 text-emerald-500"
              : "bg-slate-50 text-slate-400",
          )}
        >
          {region.status === "active" ? "Đang hoạt động" : "Tạm dừng"}
        </Badge>
      </div>

      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-24 w-24 rounded-full transition-all duration-500",
          selected ? "scale-125 bg-primary/5" : "scale-100 bg-slate-50",
        )}
      />
    </div>
  );
}
