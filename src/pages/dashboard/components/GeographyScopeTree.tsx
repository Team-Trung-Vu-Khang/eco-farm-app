import { MapPin, Layers, Target } from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FarmerZone } from "../constants";

interface GeographyScopeTreeProps {
  zone: FarmerZone;
  selectedUnit: { type: "region" | "area" | "plot"; data: any } | null;
  onSelectUnit: (type: "region" | "area" | "plot", data: any) => void;
}

export const GeographyScopeTree = ({
  zone,
  selectedUnit,
  onSelectUnit,
}: GeographyScopeTreeProps) => {
  // Compute total sick & treating trees for zone
  const totalZoneSick = zone.areas.reduce((acc, a) => acc + a.sickTrees, 0);
  const totalZoneTreating = zone.areas.reduce((acc, a) => acc + a.treatingTrees, 0);

  return (
    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl p-4">
      <div className="mt-1 ml-1 relative">
        {/* Vertical lineage spine */}
        <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

        <div className="space-y-4">
          {/* Level 1: Vùng trồng (Zone) */}
          {(() => {
            const isZoneActive =
              selectedUnit?.type === "region" &&
              String(selectedUnit.data?.id) === String(zone.id);

            return (
              <div className="relative">
                <button
                  type="button"
                  className={cn(
                    "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 -mx-2 hover:bg-white transition-all border",
                    isZoneActive
                      ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-white/90 border-slate-200/80"
                  )}
                  onClick={() => onSelectUnit("region", zone)}
                >
                  <div className="absolute left-0 w-4 h-px bg-slate-200 top-5" />

                  {/* Line 1: Icon & Name */}
                  <div className="flex items-center gap-3 pl-4 w-full">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                        isZoneActive
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 leading-none mb-1">
                        Vùng trồng
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {zone.name}
                      </div>
                    </div>
                  </div>

                  {/* Line 2: Minimalist Meta Row */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
                      DT: {zone.totalAreaHa} ha
                    </span>
                    {totalZoneSick > 0 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {totalZoneSick} bệnh
                      </span>
                    )}
                    {totalZoneTreating > 0 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {totalZoneTreating} đang điều trị
                      </span>
                    )}
                  </div>
                </button>

                {/* Level 2: Khu vực (Area) */}
                {zone.areas.length > 0 && (
                  <div className="ml-5 border-l-2 border-slate-200 pl-6 space-y-4 mt-3">
                    {zone.areas.map((area) => {
                      const isAreaActive =
                        selectedUnit?.type === "area" &&
                        String(selectedUnit.data?.id) === String(area.id);

                      return (
                        <div key={area.id} className="relative">
                          {/* Horizontal connecting branch */}
                          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                          <button
                            type="button"
                            className={cn(
                              "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 -mx-2 hover:bg-white transition-all border",
                              isAreaActive
                                ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                                : "bg-white/80 border-slate-200/70"
                            )}
                            onClick={() => onSelectUnit("area", area)}
                          >
                            {/* Line 1: Icon & Name */}
                            <div className="flex items-center gap-3 w-full">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                                  isAreaActive
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : "bg-white border-slate-200 text-slate-500"
                                )}
                              >
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                                  Khu vực
                                </div>
                                <div className="text-xs font-bold text-slate-800 truncate">
                                  {area.name}
                                </div>
                              </div>
                            </div>

                            {/* Line 2: Minimalist Meta Row */}
                            <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
                              <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
                                DT: {area.areaHa} ha
                              </span>
                              {area.sickTrees > 0 && (
                                <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  {area.sickTrees} bệnh
                                </span>
                              )}
                              {area.treatingTrees > 0 && (
                                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  {area.treatingTrees} đang điều trị
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Level 3: Lô (Plot) */}
                          {area.plots.length > 0 && (
                            <div className="ml-4.5 border-l-2 border-slate-200 pl-6 space-y-3 mt-3">
                              {area.plots.map((plot) => {
                                const isPlotActive =
                                  selectedUnit?.type === "plot" &&
                                  String(selectedUnit.data?.id) === String(plot.id);

                                return (
                                  <div key={plot.id} className="relative">
                                    {/* Horizontal connecting branch */}
                                    <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                                    <button
                                      type="button"
                                      className={cn(
                                        "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 -mx-2 hover:bg-white transition-all border",
                                        isPlotActive
                                          ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                                          : "bg-white/60 border-slate-100 text-slate-700"
                                      )}
                                      onClick={() => onSelectUnit("plot", plot)}
                                    >
                                      {/* Line 1: Icon & Name */}
                                      <div className="flex items-center gap-3 w-full">
                                        <div
                                          className={cn(
                                            "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                                            isPlotActive
                                              ? "bg-orange-500 text-white border-orange-600"
                                              : "bg-white border-slate-200 text-slate-400"
                                          )}
                                        >
                                          <Target className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                                            Lô
                                          </div>
                                          <div className="text-xs font-bold text-slate-800 truncate">
                                            {plot.name}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Line 2: Minimalist Meta Row */}
                                      <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
                                        <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
                                          DT: {plot.areaHa} ha
                                        </span>
                                        {plot.sickTrees > 0 && (
                                          <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                            {plot.sickTrees} bệnh
                                          </span>
                                        )}
                                        {plot.treatingTrees > 0 && (
                                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                            {plot.treatingTrees} đang điều trị
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
