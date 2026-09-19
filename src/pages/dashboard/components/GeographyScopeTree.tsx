import { MapPin, Layers, Target, ExternalLink } from "lucide-react";
import { cn, Checkbox } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface GeographyScopeTreeProps {
  zone: any;
  selectedUnit?: { type: "region" | "area" | "plot"; data: any } | null;
  onSelectUnit?: (type: "region" | "area" | "plot", data: any) => void;
  enableCheckboxes?: boolean;
  selectedUnitIds?: string[];
  onToggleUnitId?: (id: string, node: any) => void;
}

export const GeographyScopeTree = ({
  zone,
  selectedUnit = null,
  onSelectUnit = () => {},
  enableCheckboxes = false,
  selectedUnitIds = [],
  onToggleUnitId = () => {},
}: GeographyScopeTreeProps) => {
  if (!zone) return null;

  const handleOpenDetail = (
    type: "region" | "area" | "plot",
    rawId: any,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const numericId = String(rawId).replace(/^(ZONE|REGION|AREA|PLOT)-/i, "");
    let path = "";
    if (type === "region") {
      path = `/region-distribution/detail/${numericId}`;
    } else if (type === "area") {
      path = `/area-distribution/detail/${numericId}`;
    } else if (type === "plot") {
      path = `/plot-distribution/detail/${numericId}`;
    }
    if (path) {
      window.open(path, "_blank");
    }
  };

  const scopesList =
    Array.isArray(zone.scopes) && zone.scopes.length > 0
      ? zone.scopes
      : [
          {
            id: zone.id,
            type: "region",
            name: zone.name,
            totalAreaHa: zone.totalAreaHa,
            centerPoint: zone.centerPoint,
            boundary: zone.boundary,
            areas: zone.areas || [],
          },
        ];

  const renderPlotNode = (plot: any, isRoot: boolean = false) => {
    const isPlotActive =
      selectedUnit?.type === "plot" &&
      String(selectedUnit.data?.id) === String(plot.id);

    return (
      <div key={plot.id} className="relative">
        {!isRoot && (
          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />
        )}
        <button
          type="button"
          className={cn(
            "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 hover:bg-white transition-all border cursor-pointer",
            !isRoot && "-mx-2",
            isPlotActive
              ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
              : "bg-white/60 border-slate-100 text-slate-700",
          )}
          onClick={() => {
            onSelectUnit("plot", plot);
            if (enableCheckboxes) {
              onToggleUnitId(String(plot.id), plot);
            }
          }}
        >
          {/* Line 1: Icon & Name */}
          <div className="flex items-center gap-3 w-full">
            {enableCheckboxes && (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedUnitIds.includes(String(plot.id))}
                  onCheckedChange={() => onToggleUnitId(String(plot.id), plot)}
                  className="shrink-0"
                />
              </div>
            )}
            <div
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                isPlotActive
                  ? "bg-orange-500 text-white border-orange-600"
                  : "bg-white border-slate-200 text-slate-400",
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
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100/80 transition-colors shrink-0"
              title="Mở quản lý chi tiết"
              onClick={(e) => handleOpenDetail("plot", plot.id, e)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Line 2: Minimalist Meta Row (DT only) */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
              DT: {plot.areaHa || 0} ha
            </span>
          </div>
        </button>
      </div>
    );
  };

  const renderAreaNode = (area: any, isRoot: boolean = false) => {
    const isAreaActive =
      selectedUnit?.type === "area" &&
      String(selectedUnit.data?.id) === String(area.id);

    const plots = area.plots || [];

    return (
      <div key={area.id} className="relative">
        {!isRoot && (
          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />
        )}

        <button
          type="button"
          className={cn(
            "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 hover:bg-white transition-all border cursor-pointer",
            !isRoot && "-mx-2",
            isAreaActive
              ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
              : "bg-white/80 border-slate-200/70",
          )}
          onClick={() => {
            onSelectUnit("area", area);
            if (enableCheckboxes) {
              onToggleUnitId(String(area.id), area);
            }
          }}
        >
          {/* Line 1: Icon & Name */}
          <div className="flex items-center gap-3 w-full">
            {enableCheckboxes && (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedUnitIds.includes(String(area.id))}
                  onCheckedChange={() => onToggleUnitId(String(area.id), area)}
                  className="shrink-0"
                />
              </div>
            )}
            <div
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                isAreaActive
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white border-slate-200 text-slate-500",
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
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100/80 transition-colors shrink-0"
              title="Mở quản lý chi tiết"
              onClick={(e) => handleOpenDetail("area", area.id, e)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Line 2: Minimalist Meta Row (DT only) */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
              DT: {area.totalAreaHa || area.areaHa || 0} ha
            </span>
          </div>
        </button>

        {/* Plots under Area */}
        {Array.isArray(plots) && plots.length > 0 && (
          <div className="ml-5 border-l-2 border-slate-200 pl-6 space-y-3 mt-3">
            {plots.map((p: any) => renderPlotNode(p, false))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl p-4">
      <div className="mt-1 relative space-y-4">
        {scopesList.map((scopeNode: any) => {
          // Case 1: Scope is AREA
          if (scopeNode.type === "area") {
            const areaTarget = scopeNode.areas?.[0] || scopeNode;
            return renderAreaNode(areaTarget, true);
          }

          // Case 2: Scope is PLOT
          if (scopeNode.type === "plot") {
            const plotTarget = scopeNode.plots?.[0] || scopeNode;
            return renderPlotNode(plotTarget, true);
          }

          // Case 3: Scope is REGION (Default)
          const isScopeActive =
            selectedUnit?.type === "region" &&
            String(selectedUnit.data?.id) === String(scopeNode.id);

          return (
            <div key={scopeNode.id} className="relative">
              {/* Level 1: Scope (Vùng địa lý) */}
              <button
                type="button"
                className={cn(
                  "flex flex-col relative z-10 w-full text-left rounded-xl p-2.5 hover:bg-white transition-all border cursor-pointer",
                  isScopeActive
                    ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                    : "bg-white/90 border-slate-200/80",
                )}
                onClick={() => {
                  onSelectUnit("region", scopeNode);
                  if (enableCheckboxes) {
                    onToggleUnitId(String(scopeNode.id), scopeNode);
                  }
                }}
              >
                {/* Line 1: Icon & Name */}
                <div className="flex items-center gap-3 w-full">
                  {enableCheckboxes && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedUnitIds.includes(String(scopeNode.id))}
                        onCheckedChange={() =>
                          onToggleUnitId(String(scopeNode.id), scopeNode)
                        }
                        className="shrink-0"
                      />
                    </div>
                  )}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                      isScopeActive
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200",
                    )}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 leading-none mb-1">
                      Vùng địa lý
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {scopeNode.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100/80 transition-colors shrink-0"
                    title="Mở quản lý chi tiết"
                    onClick={(e) => handleOpenDetail("region", scopeNode.id, e)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line 2: Minimalist Meta Row (DT only) */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-11 w-full text-[11px] text-slate-500 font-medium">
                  <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
                    DT: {scopeNode.totalAreaHa || 0} ha
                  </span>
                </div>
              </button>

              {/* Level 2: Khu vực (Area) */}
              {Array.isArray(scopeNode.areas) && scopeNode.areas.length > 0 && (
                <div className="ml-5 border-l-2 border-slate-200 pl-6 space-y-4 mt-3">
                  {scopeNode.areas.map((area: any) =>
                    renderAreaNode(area, false),
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
