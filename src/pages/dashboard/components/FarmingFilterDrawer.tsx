import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search } from "lucide-react";
import {
  type AreaNode,
  type FilterState,
  type PlotNode,
  type RegionNode,
  filterData,
  findPlotRegion,
} from "../constants";

interface FarmingFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: FilterState;
  onApply: (filter: FilterState) => void;
}

function removeDiacritics(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function filterTree(regions: RegionNode[], query: string): RegionNode[] {
  if (!query.trim()) return regions;
  const q = removeDiacritics(query);
  return regions
    .map((region) => {
      const regionMatch = removeDiacritics(region.name).includes(q);
      const areas = region.areas
        .map((area) => {
          const areaMatch = removeDiacritics(area.name).includes(q);
          const plots = area.plots.filter((plot) =>
            removeDiacritics(plot.name).includes(q),
          );
          if (areaMatch || plots.length > 0) {
            return { ...area, plots: areaMatch ? area.plots : plots };
          }
          return null;
        })
        .filter(Boolean) as AreaNode[];
      if (regionMatch || areas.length > 0) {
        return { ...region, areas: regionMatch ? region.areas : areas };
      }
      return null;
    })
    .filter(Boolean) as RegionNode[];
}

function getPlotIds(areas: AreaNode[]): string[] {
  return areas.flatMap((a) => a.plots.map((p) => p.id));
}

function getRegionPlotCount(
  region: RegionNode,
  selected: Set<string>,
): { total: number; selected: number } {
  const all = getPlotIds(region.areas);
  const sel = all.filter((id) => selected.has(id));
  return { total: all.length, selected: sel.length };
}

function getAreaPlotCount(
  area: AreaNode,
  selected: Set<string>,
): { total: number; selected: number } {
  const all = area.plots.map((p) => p.id);
  const sel = all.filter((id) => selected.has(id));
  return { total: all.length, selected: sel.length };
}

export function FarmingFilterDrawer({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: FarmingFilterDrawerProps) {
  const [selectedPlots, setSelectedPlots] = useState<Set<string>>(
    new Set(initialFilter.selectedPlots),
  );
  const [dateFrom, setDateFrom] = useState(initialFilter.dateFrom);
  const [dateTo, setDateTo] = useState(initialFilter.dateTo);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    () => {
      if (initialFilter.selectedPlots.length > 0) {
        const region = findPlotRegion(initialFilter.selectedPlots[0]);
        return region?.id ?? null;
      }
      return filterData[0]?.id ?? null;
    },
  );

  const filteredRegions = useMemo(
    () => filterTree(filterData, searchQuery),
    [searchQuery],
  );

  const selectedRegion = filteredRegions.find((r) => r.id === selectedRegionId);

  const togglePlot = (plotId: string) => {
    setSelectedPlots((prev) => {
      const next = new Set(prev);
      if (next.has(plotId)) {
        next.delete(plotId);
      } else {
        next.add(plotId);
      }
      return next;
    });
  };

  const toggleArea = (area: AreaNode) => {
    const plotIds = area.plots.map((p) => p.id);
    const allSelected = plotIds.every((id) => selectedPlots.has(id));

    setSelectedPlots((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        plotIds.forEach((id) => next.delete(id));
      } else {
        plotIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleRegion = (region: RegionNode) => {
    const allPlotIds = getPlotIds(region.areas);
    const allSelected = allPlotIds.every((id) => selectedPlots.has(id));

    setSelectedPlots((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allPlotIds.forEach((id) => next.delete(id));
      } else {
        allPlotIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedPlots(new Set());
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const handleApply = () => {
    onApply({
      selectedPlots: Array.from(selectedPlots),
      dateFrom,
      dateTo,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-none sm:w-[740px] sm:max-w-[740px] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Lọc vùng trồng</SheetTitle>
        </SheetHeader>

        <div className="px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhanh tên Vùng, Khu vực, Lô..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              clearable
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 px-6">
          <div className="flex h-[calc(100vh-340px)] min-h-[300px] border rounded-lg overflow-hidden">
            <div className="w-[45%] border-r bg-muted/30">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                Vùng trồng
              </div>
              <ScrollArea>
                <div className="p-1">
                  {filteredRegions.map((region) => {
                    const { total, selected } = getRegionPlotCount(
                      region,
                      selectedPlots,
                    );
                    const allChecked = total > 0 && selected === total;
                    const someChecked = selected > 0 && selected < total;
                    const isActive = region.id === selectedRegionId;

                    return (
                      <div
                        key={region.id}
                        className={`flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedRegionId(region.id)}
                      >
                        <Checkbox
                          checked={
                            allChecked
                              ? true
                              : someChecked
                                ? "indeterminate"
                                : false
                          }
                          onCheckedChange={() => toggleRegion(region)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {region.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selected}/{total} lô
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRegions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Không tìm thấy kết quả
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="w-[55%]">
              {selectedRegion ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                    Khu vực & Lô
                  </div>
                  <ScrollArea>
                    <div className="p-2 space-y-3">
                      {selectedRegion.areas.map((area) => {
                        const { total, selected } = getAreaPlotCount(
                          area,
                          selectedPlots,
                        );
                        const allChecked = total > 0 && selected === total;
                        const someChecked = selected > 0 && selected < total;

                        return (
                          <div key={area.id} className="space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1.5">
                              <Checkbox
                                checked={
                                  allChecked
                                    ? true
                                    : someChecked
                                      ? "indeterminate"
                                      : false
                                }
                                onCheckedChange={() => toggleArea(area)}
                              />
                              <span className="text-sm font-semibold text-foreground">
                                {area.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({selected}/{total})
                              </span>
                            </div>
                            <div className="ml-7 space-y-0.5">
                              {area.plots.map((plot: PlotNode) => (
                                <div
                                  key={plot.id}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                                  onClick={() => togglePlot(plot.id)}
                                >
                                  <Checkbox
                                    checked={selectedPlots.has(plot.id)}
                                    onCheckedChange={() => togglePlot(plot.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="text-sm">{plot.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Chọn một vùng trồng để xem khu vực & lô
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Thời gian:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">đến</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        <SheetFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" onClick={handleClearAll}>
              Bỏ chọn tất cả
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleApply}>
                Áp dụng
                {selectedPlots.size > 0 && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({selectedPlots.size})
                  </span>
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
