import {
  Badge,
  Button,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import type { GeographicalSelection, RegionOption } from "./types";

interface SelectionCardProps {
  regionId: string;
  areaId?: string;
  items: GeographicalSelection[];
  regions: RegionOption[];
  onRemove: (ids: string[]) => void;
}

export const SelectionCard = ({
  regionId,
  areaId,
  items,
  regions,
  onRemove,
}: SelectionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const region = regions.find((r) => r.id.toString() === regionId);

  const primaryItem =
    items.find((item) => item.type === "area" || item.type === "region") ||
    items[0];

  const regionName =
    region?.name ||
    primaryItem?.regionName ||
    (primaryItem?.type === "region" ? primaryItem?.name : "");
  const areaName =
    primaryItem?.areaName || (primaryItem?.type === "area" ? primaryItem?.name : "");

  const getTypeLabel = (type: GeographicalSelection["type"]) => {
    switch (type) {
      case "region":
        return "Vùng trồng";
      case "area":
        return "Khu vực";
      case "plot":
        return "Lô đất";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2.5 rounded-xl shrink-0 transition-colors duration-300",
              primaryItem.type === "region"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary/20",
            )}
          >
            {primaryItem.type === "region" ? (
              <MapPin className="w-5 h-5" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
              >
                {getTypeLabel(primaryItem.type)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                onClick={() => onRemove(items.map((item) => item.id))}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              {areaName || regionName}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              ID: {areaId || regionId}
            </div>
          </div>
        </div>

        {(primaryItem.type !== "region" || items.length > 1) && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>Phân cấp quản lý</span>
            </button>

            {isExpanded && (
              <div className="mt-4 ml-3 relative">
                <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3 relative z-10 pl-4">
                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                        Vùng trồng
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {regionName}
                      </div>
                    </div>
                    {items.some((item) => item.type === "region") && (
                      <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
                        Đã chọn vùng
                      </Badge>
                    )}
                  </div>

                  {areaId && (
                    <div className="relative pl-4">
                      <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />

                      <div className="pl-4 relative">
                        {items.some((item) => item.type === "plot") && (
                          <div className="absolute left-3.75 top-4 bottom-4 w-px bg-slate-200" />
                        )}

                        <div className="flex items-center gap-3 relative z-10 py-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                              items.some((item) => item.type === "area")
                                ? "bg-primary/5 border-primary/20"
                                : "bg-slate-50 border-slate-100",
                            )}
                          >
                            <Layers
                              className={cn(
                                "w-3.5 h-3.5",
                                items.some((item) => item.type === "area")
                                  ? "text-primary"
                                  : "text-slate-400",
                              )}
                            />
                          </div>
                          <div>
                            <div
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
                                items.some((item) => item.type === "area")
                                  ? "text-primary/60"
                                  : "text-slate-400",
                              )}
                            >
                              Khu vực
                            </div>
                            <div
                              className={cn(
                                "text-xs font-bold",
                                items.some((item) => item.type === "area")
                                  ? "text-slate-900"
                                  : "text-slate-700",
                              )}
                            >
                              {areaName}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-3">
                          {items
                            .filter((item) => item.type === "plot")
                            .map((plotSelection) => (
                              <div
                                key={plotSelection.id}
                                className="flex items-center gap-3 relative z-10 pl-8 group/plot"
                              >
                                <div className="absolute left-3.75 w-4 h-px bg-slate-200 top-1/2" />
                                <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shadow-xs shrink-0">
                                  <Target className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-[10px] text-primary/60 font-bold uppercase tracking-wider leading-none mb-1">
                                    Lô đất
                                  </div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {plotSelection.name ||
                                      plotSelection.plotName ||
                                      plotSelection.plotId}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemove([plotSelection.id])}
                                  className="h-6 w-6 p-0 opacity-0 group-hover/plot:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
