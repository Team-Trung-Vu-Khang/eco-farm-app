import { useRegions } from "@/features/farm/hooks/useRegions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, ChevronDown, Layers, Sprout } from "lucide-react";
import { useMemo, useState } from "react";

export interface MobileZoneFilterSheetsProps {
  selectedRegionId?: number;
  onSelectRegion: (regionId?: number) => void;
  selectedPlotId?: number;
  onSelectPlot: (plotId?: number) => void;
}

export function MobileZoneFilterSheets({
  selectedRegionId,
  onSelectRegion,
  selectedPlotId,
  onSelectPlot,
}: MobileZoneFilterSheetsProps) {
  const [openRegionSheet, setOpenRegionSheet] = useState(false);
  const [openPlotSheet, setOpenPlotSheet] = useState(false);

  // Lấy danh sách vùng trồng / vườn
  const { items: regions } = useRegions({
    params: { domainCode: "CROP", page: 0, size: 100 },
  });

  // Tìm tên vườn đã chọn
  const activeRegion = useMemo(
    () => regions.find((r) => r.id === selectedRegionId),
    [regions, selectedRegionId],
  );

  // Lấy danh sách Lô (từ vườn đã chọn hoặc gộp tất cả vườn)
  const availablePlots = useMemo(() => {
    if (selectedRegionId && activeRegion) {
      const plotsList: { id: number; name: string }[] = [];
      const areas = activeRegion.productionAreas || activeRegion.areas || [];
      areas.forEach((area) => {
        if (area.plots && area.plots.length > 0) {
          area.plots.forEach((p) => {
            if (p.id) {
              plotsList.push({ id: p.id, name: p.name || `Lô ${p.id}` });
            }
          });
        } else if (area.id) {
          // Fallback nếu không có plots thì lấy area làm Lô/Khu
          plotsList.push({ id: area.id, name: area.name || `Khu ${area.id}` });
        }
      });
      return plotsList;
    }

    // Nếu chọn Tất cả vườn: gộp toàn bộ plots từ tất cả vườn
    const allPlots: { id: number; name: string; regionName?: string }[] = [];
    regions.forEach((r) => {
      const areas = r.productionAreas || r.areas || [];
      areas.forEach((area) => {
        if (area.plots && area.plots.length > 0) {
          area.plots.forEach((p) => {
            if (p.id) {
              allPlots.push({
                id: p.id,
                name: `${p.name || `Lô ${p.id}`} (${r.name})`,
              });
            }
          });
        } else if (area.id) {
          allPlots.push({
            id: area.id,
            name: `${area.name || `Khu ${area.id}`} (${r.name})`,
          });
        }
      });
    });
    return allPlots;
  }, [selectedRegionId, activeRegion, regions]);

  // Tìm tên lô đã chọn
  const activePlot = useMemo(
    () => availablePlots.find((p) => p.id === selectedPlotId),
    [availablePlots, selectedPlotId],
  );

  const regionLabel = activeRegion?.name || "Tất cả vườn";
  const plotLabel = activePlot?.name || "Tất cả lô";

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Nút 1: Tất cả vườn */}
        <button
          type="button"
          onClick={() => setOpenRegionSheet(true)}
          className={cn(
            "flex h-11 items-center justify-between gap-2 rounded-2xl border px-3 text-left transition-all active:scale-98 shadow-2xs",
            selectedRegionId
              ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold"
              : "border-slate-200/90 bg-white text-slate-800 font-medium hover:border-slate-300",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sprout
              className={cn(
                "h-4 w-4 shrink-0",
                selectedRegionId ? "text-emerald-600" : "text-emerald-500",
              )}
            />
            <span className="truncate text-xs">{regionLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>

        {/* Nút 2: Tất cả lô */}
        <button
          type="button"
          onClick={() => setOpenPlotSheet(true)}
          className={cn(
            "flex h-11 items-center justify-between gap-2 rounded-2xl border px-3 text-left transition-all active:scale-98 shadow-2xs",
            selectedPlotId
              ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold"
              : "border-slate-200/90 bg-white text-slate-800 font-medium hover:border-slate-300",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Layers
              className={cn(
                "h-4 w-4 shrink-0",
                selectedPlotId ? "text-emerald-600" : "text-slate-600",
              )}
            />
            <span className="truncate text-xs">{plotLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
      </div>

      {/* Bottom Sheet 1: Chọn Vườn */}
      <Sheet open={openRegionSheet} onOpenChange={setOpenRegionSheet}>
        <SheetContent
          side="bottom"
          className="max-h-[75dvh] overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left pb-2 border-b border-slate-100">
            <SheetTitle className="text-base font-bold text-slate-900">
              Chọn Vườn (Vùng trồng)
            </SheetTitle>
          </SheetHeader>

          <ul className="mt-3 space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  onSelectRegion(undefined);
                  onSelectPlot(undefined);
                  setOpenRegionSheet(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl p-3 text-left transition-colors active:bg-slate-50",
                  !selectedRegionId
                    ? "bg-emerald-50 text-emerald-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Tất cả vườn</span>
                </div>
                {!selectedRegionId && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </button>
            </li>

            {regions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              return (
                <li key={region.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRegion(region.id);
                      onSelectPlot(undefined);
                      setOpenRegionSheet(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl p-3 text-left transition-colors active:bg-slate-50",
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Sprout className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate text-sm">
                        {region.name || `Vườn #${region.id}`}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>

      {/* Bottom Sheet 2: Chọn Lô */}
      <Sheet open={openPlotSheet} onOpenChange={setOpenPlotSheet}>
        <SheetContent
          side="bottom"
          className="max-h-[75dvh] overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left pb-2 border-b border-slate-100">
            <SheetTitle className="text-base font-bold text-slate-900">
              Chọn Lô canh tác
            </SheetTitle>
          </SheetHeader>

          <ul className="mt-3 space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  onSelectPlot(undefined);
                  setOpenPlotSheet(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl p-3 text-left transition-colors active:bg-slate-50",
                  !selectedPlotId
                    ? "bg-emerald-50 text-emerald-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Tất cả lô</span>
                </div>
                {!selectedPlotId && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </button>
            </li>

            {availablePlots.map((plot) => {
              const isSelected = selectedPlotId === plot.id;
              return (
                <li key={plot.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPlot(plot.id);
                      setOpenPlotSheet(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl p-3 text-left transition-colors active:bg-slate-50",
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate text-sm">{plot.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
