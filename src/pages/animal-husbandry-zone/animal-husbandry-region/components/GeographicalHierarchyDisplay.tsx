import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin, Target } from "lucide-react";
import type { RegionNode } from "./GeographicalTree";

interface GeographicalHierarchyDisplayProps {
  selectedHierarchy: RegionNode[];
  onEdit?: () => void;
}

export const GeographicalHierarchyDisplay = ({
  selectedHierarchy,
  onEdit,
}: GeographicalHierarchyDisplayProps) => {
  if (selectedHierarchy.length === 0) {
    return (
      <div
        onClick={onEdit}
        className="p-8 text-center text-xs text-amber-600 bg-amber-50/30 border-2 border-dashed border-amber-200/50 rounded-2xl cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <MapPin className="w-5 h-5 text-amber-500" />
        </div>
        Vui lòng nhấn vào đây để chọn vị trí địa lý
      </div>
    );
  }

  return (
    <div
      onClick={onEdit}
      className={cn(
        "p-4 rounded-xl border border-slate-100 bg-white/50 space-y-4 transition-all",
        onEdit &&
          "cursor-pointer hover:bg-slate-50 hover:border-slate-200 group/hier",
      )}
    >
      <div className="space-y-0 relative ml-2">
        {selectedHierarchy.map((region) => (
          <div key={region.id} className="relative">
            <div className="flex items-start gap-3 relative pb-4">
              {region.areas.length > 0 && (
                <div className="absolute left-[15px] top-[34px] bottom-0 w-px bg-slate-100" />
              )}
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 relative z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="pt-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                  Vùng chăn nuôi
                </div>
                <div className="text-base font-bold text-slate-800">
                  {region.name}
                </div>
              </div>
            </div>

            <div className="ml-[15px] space-y-0">
              {region.areas.map((area) => (
                <div key={area.id} className="relative pl-6 pb-4">
                  <div className="absolute left-0 top-4 w-5 h-px bg-slate-100" />
                  {area.plots.length > 0 && (
                    <div className="absolute left-[19px] top-[34px] bottom-0 w-px bg-slate-100/50" />
                  )}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 relative z-10">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                        Khu vực
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {area.name}
                      </div>
                    </div>
                  </div>

                  <div className="ml-[19px] space-y-0">
                    {area.plots.map((plot) => (
                      <div
                        key={plot.id}
                        className="relative pl-6 pt-4 first:pt-4"
                      >
                        <div className="absolute left-0 top-8 w-5 h-px bg-slate-100/50" />
                        <div className="flex items-start gap-3 relative">
                          <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0 relative z-10">
                            <Target className="w-4 h-4" />
                          </div>
                          <div className="pt-0.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                              Chuồng/Lô
                            </div>
                            <div className="text-sm font-bold text-slate-800">
                              {plot.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
