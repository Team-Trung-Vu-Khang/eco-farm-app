import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Settings2, X } from "lucide-react";
import {
  type FilterState,
  type HRFilterState,
  departmentOptions,
  findPlotRegion,
  positionOptions,
  taskStatusOptions,
} from "../constants";

interface FilterTriggerProps {
  activeTab: string;
  farmingFilter: FilterState;
  hrFilter: HRFilterState;
  onOpenFarmingFilter: () => void;
  onOpenHRFilter: () => void;
  onRemovePlot: (plotId: string) => void;
  onClearFarmingFilter: () => void;
  onClearHRFilter: () => void;
}

function formatDateRange(dateFrom: string, dateTo: string): string | null {
  if (!dateFrom && !dateTo) return null;
  const from = dateFrom
    ? new Date(dateFrom).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    : "...";
  const to = dateTo
    ? new Date(dateTo).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    : "...";
  return `${from} - ${to}`;
}

export function FilterTrigger({
  activeTab,
  farmingFilter,
  hrFilter,
  onOpenFarmingFilter,
  onOpenHRFilter,
  onRemovePlot,
  onClearFarmingFilter,
  onClearHRFilter,
}: FilterTriggerProps) {
  const isFarmingTab = activeTab === "overview" || activeTab === "farming";
  const onOpen = isFarmingTab ? onOpenFarmingFilter : onOpenHRFilter;
  const filterLabel = isFarmingTab ? "Lọc vùng trồng" : "Lọc nhân sự";

  const hasFarmingFilters =
    farmingFilter.selectedPlots.length > 0 ||
    farmingFilter.dateFrom ||
    farmingFilter.dateTo;

  const hasHRFilters =
    hrFilter.location ||
    hrFilter.departments.length > 0 ||
    hrFilter.positions.length > 0 ||
    hrFilter.taskStatus.length > 0;

  const hasFilters = isFarmingTab ? hasFarmingFilters : hasHRFilters;

  const dateRangeText = formatDateRange(
    farmingFilter.dateFrom,
    farmingFilter.dateTo
  );

  const regionChips = (() => {
    const regionMap = new Map<
      string,
      { name: string; count: number; plots: string[] }
    >();
    for (const plotId of farmingFilter.selectedPlots) {
      const region = findPlotRegion(plotId);
      if (region) {
        const existing = regionMap.get(region.id);
        if (existing) {
          existing.count++;
          existing.plots.push(plotId);
        } else {
          regionMap.set(region.id, {
            name: region.name.split(" - ")[0],
            count: 1,
            plots: [plotId],
          });
        }
      }
    }
    return Array.from(regionMap.values());
  })();

  const hrChips = (() => {
    const chips: string[] = [];
    if (hrFilter.location) chips.push("Vùng làm việc");
    hrFilter.departments.forEach((id) => {
      const dept = departmentOptions.find((d) => d.id === id);
      if (dept) chips.push(dept.name.replace("Phòng ", ""));
    });
    hrFilter.positions.forEach((id) => {
      const pos = positionOptions.find((p) => p.id === id);
      if (pos) chips.push(pos.name);
    });
    hrFilter.taskStatus.forEach((id) => {
      const status = taskStatusOptions.find((s) => s.id === id);
      if (status) chips.push(status.name);
    });
    return chips;
  })();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={onOpen} className="gap-2">
        <Settings2 className="h-4 w-4" />
        {filterLabel}
      </Button>

      {hasFilters && (
        <>
          <div className="h-5 w-px bg-border" />

          {isFarmingTab ? (
            <>
              {regionChips.map((chip) => (
                <Badge
                  key={chip.name}
                  variant="secondary"
                  className="gap-1 pr-1.5"
                >
                  {chip.name}
                  {chip.count > 1 && (
                    <span className="text-xs opacity-70">({chip.count})</span>
                  )}
                  <button
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    onClick={() => {
                      chip.plots.forEach((p) => onRemovePlot(p));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {farmingFilter.selectedPlots.length > regionChips.length && (
                <Badge variant="secondary">
                  +{farmingFilter.selectedPlots.length - regionChips.reduce((s, c) => s + c.count, 0)} lô khác
                </Badge>
              )}

              {dateRangeText && (
                <Badge variant="secondary" className="gap-1 pr-1.5">
                  {dateRangeText}
                  <button
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    onClick={onClearFarmingFilter}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </>
          ) : (
            hrChips.map((chip) => (
              <Badge key={chip} variant="secondary">
                {chip}
              </Badge>
            ))
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={isFarmingTab ? onClearFarmingFilter : onClearHRFilter}
            className="text-muted-foreground h-7"
          >
            Xoá bộ lọc
          </Button>
        </>
      )}
    </div>
  );
}
