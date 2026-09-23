import { useAreaPlots } from "@/features/farm/hooks/useAreas";
import { useRegionAreas } from "@/features/farm/hooks/useRegions";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeographicalSelection, RegionOption } from "./types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface GeographicalSelectorProps {
  /** Level-1 region list. The caller is responsible for loading this from
   *  the server (via useRegions hook or any other source). Areas and plots
   *  are loaded lazily inside this component via API when the user expands
   *  a node. */
  regions: RegionOption[];
  onConfirm: (selections: GeographicalSelection[]) => void;
  existingSelections: GeographicalSelection[];

  // --- Selection behaviour ---
  /** false (default) = single-select: picking a new item replaces the
   *  previous selection. true = multi-select: selections accumulate. */
  multiSelect?: boolean;
  /** Restrict selection to Region level only (no area / plot expansion). */
  regionOnly?: boolean;

  // --- Filtering ---
  enterpriseId?: string;
  /** When true, regions are filtered by enterpriseId. */
  showEnterprise?: boolean;

  // --- UI ---
  disabled?: boolean;
  customTrigger?: React.ReactNode;
  triggerLabel?: string;
  dialogTitle?: string;
  dialogSubtitle?: string;

  // --- Async region search (caller-controlled) ---
  onRegionSearchChange?: (keyword: string) => void;
  isRegionSearching?: boolean;

  // --- Infinite scroll for region list (optional) ---
  onReachEnd?: () => void;
  hasMoreRegions?: boolean;
}

// ---------------------------------------------------------------------------
// Internal sub-components (lazy API loaders)
// ---------------------------------------------------------------------------

interface AreaPlotsListProps {
  areaId: number;
  areaName: string;
  regionId: string;
  regionName: string;
  isSelected: (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => boolean;
  onSelect: (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
    name?: string,
    regionName?: string,
    areaName?: string,
  ) => void;
}

const AreaPlotsList = ({
  areaId,
  areaName,
  regionId,
  regionName,
  isSelected,
  onSelect,
}: AreaPlotsListProps) => {
  const { items: plots, loading } = useAreaPlots(areaId, {
    params: { size: 100 },
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2 pl-2 text-[10px] text-slate-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Đang tải lô...
      </div>
    );
  }

  if (!plots || plots.length === 0) {
    return (
      <p className="py-2 pl-2 text-[10px] italic text-slate-400">Chưa có lô</p>
    );
  }

  return (
    <>
      {plots.map((plot) => {
        const plotIdStr = String(plot.id);
        const areaIdStr = String(areaId);
        const plotSelected = isSelected("plot", regionId, areaIdStr, plotIdStr);

        return (
          <div
            key={plot.id}
            onClick={() =>
              onSelect(
                "plot",
                regionId,
                areaIdStr,
                plotIdStr,
                plot.name || undefined,
                regionName,
                areaName,
              )
            }
            className={cn(
              "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
              plotSelected
                ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
              <span className="font-medium text-slate-600 text-xs text-primary/80">
                {plot.name}
              </span>
            </div>
            {plotSelected ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] text-primary font-bold">
                  LÔ #{plotIdStr}
                </span>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-sm border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                <Plus className="w-2.5 h-2.5 text-slate-300 group-hover:text-primary" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

interface RegionAreasListProps {
  regionId: string;
  regionName: string;
  expandedAreas: string[];
  toggleArea: (id: string) => void;
  isSelected: (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => boolean;
  onSelect: (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
    name?: string,
    regionName?: string,
    areaName?: string,
  ) => void;
}

const RegionAreasList = ({
  regionId,
  regionName,
  expandedAreas,
  toggleArea,
  isSelected,
  onSelect,
}: RegionAreasListProps) => {
  const { items: areas, loading } = useRegionAreas(parseInt(regionId, 10), {
    params: { size: 100 },
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 pl-2 text-xs text-slate-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Đang tải khu vực...
      </div>
    );
  }

  if (!areas || areas.length === 0) {
    return (
      <p className="py-2 pl-2 text-xs italic text-slate-400">Chưa có khu vực</p>
    );
  }

  return (
    <>
      {areas.map((area) => {
        const areaIdStr = String(area.id);
        const areaSelected = isSelected("area", regionId, areaIdStr);

        return (
          <div key={area.id} className="space-y-2">
            <div className="flex items-center gap-2 group">
              <button
                type="button"
                onClick={() => toggleArea(areaIdStr)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                {expandedAreas.includes(areaIdStr) ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div
                onClick={() =>
                  onSelect(
                    "area",
                    regionId,
                    areaIdStr,
                    undefined,
                    area.name || undefined,
                    regionName,
                  )
                }
                className={cn(
                  "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                  areaSelected
                    ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                    : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-xs">
                    {area.name}
                  </span>
                </div>
                {areaSelected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <Badge
                      variant="secondary"
                      className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0"
                    >
                      Đã chọn
                    </Badge>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                    <Plus className="w-3 h-3 text-slate-300 group-hover:text-primary" />
                  </div>
                )}
              </div>
            </div>

            {expandedAreas.includes(areaIdStr) && (
              <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                <AreaPlotsList
                  areaId={area.id}
                  areaName={area.name ?? ""}
                  regionId={regionId}
                  regionName={regionName}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const GeographicalSelector = ({
  regions,
  onConfirm,
  existingSelections,
  multiSelect = false,
  regionOnly = false,
  enterpriseId,
  showEnterprise = false,
  disabled = false,
  customTrigger,
  triggerLabel = "Chọn vùng canh tác",
  dialogTitle = "Chọn phạm vi canh tác",
  dialogSubtitle,
  onRegionSearchChange,
  isRegionSearching = false,
  onReachEnd,
  hasMoreRegions = false,
}: GeographicalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<GeographicalSelection[]>([]);

  // Infinite scroll observer for region list
  const observerRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !observerRef.current ||
      !scrollViewportRef.current ||
      !hasMoreRegions ||
      isRegionSearching ||
      !onReachEnd
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onReachEnd();
      },
      { root: scrollViewportRef.current, rootMargin: "96px", threshold: 0 },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMoreRegions, isRegionSearching, onReachEnd]);

  const filteredRegions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return regions.filter(
      (region) =>
        (!showEnterprise ||
          !enterpriseId ||
          region.enterpriseId === `ent-${enterpriseId}` ||
          region.enterpriseId === enterpriseId) &&
        (!query ||
          region.name.toLowerCase().includes(query) ||
          region.code?.toLowerCase().includes(query)),
    );
  }, [enterpriseId, regions, searchTerm, showEnterprise]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id],
    );
  };

  const isSelected = (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
  ): boolean => {
    const exactMatch = tempSelections.some(
      (s) =>
        s.type === type &&
        s.regionId === regionId &&
        s.areaId === areaId &&
        s.plotId === plotId,
    );
    if (exactMatch) return true;

    if (type === "area" || type === "plot") {
      if (
        tempSelections.some(
          (s) => s.type === "region" && s.regionId === regionId,
        )
      )
        return true;
    }

    if (type === "plot") {
      if (
        tempSelections.some(
          (s) =>
            s.type === "area" &&
            s.regionId === regionId &&
            s.areaId === areaId,
        )
      )
        return true;
    }

    return false;
  };

  const handleSelect = (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
    name?: string,
    regionName?: string,
    areaName?: string,
  ) => {
    if (regionOnly && type !== "region") return;

    const newItem: GeographicalSelection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      regionId,
      areaId,
      plotId,
      name,
      regionName,
      areaName,
    };

    if (!multiSelect) {
      // Single-select: replace entirely
      const isCurrentlySelected = tempSelections.some(
        (s) =>
          s.type === type &&
          s.regionId === regionId &&
          s.areaId === areaId &&
          s.plotId === plotId,
      );
      setTempSelections(isCurrentlySelected ? [] : [newItem]);
      return;
    }

    // Multi-select: guard parent-already-selected cases
    if (type === "area") {
      if (
        tempSelections.some(
          (s) => s.type === "region" && s.regionId === regionId,
        )
      )
        return;
    }

    if (type === "plot") {
      const parentCovered = tempSelections.some(
        (s) =>
          (s.type === "region" && s.regionId === regionId) ||
          (s.type === "area" &&
            s.regionId === regionId &&
            s.areaId === areaId),
      );
      if (parentCovered) return;
    }

    const isCurrentlySelected = tempSelections.some(
      (s) =>
        s.type === type &&
        s.regionId === regionId &&
        s.areaId === areaId &&
        s.plotId === plotId,
    );

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (s) =>
            !(
              s.type === type &&
              s.regionId === regionId &&
              s.areaId === areaId &&
              s.plotId === plotId
            ),
        ),
      );
      return;
    }

    setTempSelections((prev) => {
      let next = [...prev];
      // When selecting a region, remove all sub-selections under it
      if (type === "region") {
        next = next.filter((s) => s.regionId !== regionId);
      } else if (type === "area") {
        next = next.filter(
          (s) => !(s.regionId === regionId && s.areaId === areaId),
        );
      }
      return [...next, newItem];
    });
  };

  const openDialog = () => {
    setTempSelections(existingSelections);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSearchTerm("");
    onRegionSearchChange?.("");
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  const defaultSubtitle = regionOnly
    ? "Chỉ chọn Vùng trồng"
    : "Bạn có thể chọn Vùng trồng, Khu vực hoặc từng Lô đất cụ thể";

  const isDisabled = disabled || (showEnterprise && !enterpriseId);

  return (
    <>
      {customTrigger ? (
        <div
          onClick={isDisabled ? undefined : openDialog}
          className={cn(
            "w-full",
            isDisabled && "pointer-events-none opacity-60",
          )}
        >
          {customTrigger}
        </div>
      ) : (
        <Button
          type="button"
          onClick={openDialog}
          disabled={isDisabled}
          className="w-full h-12 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
          variant="outline"
        >
          <Plus className="w-5 h-5" />
          {triggerLabel}
        </Button>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setTempSelections(existingSelections);
            setIsOpen(true);
          } else {
            closeDialog();
          }
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {dialogTitle}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {dialogSubtitle ?? defaultSubtitle}
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng trồng..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => {
                  const keyword = e.target.value;
                  setSearchTerm(keyword);
                  onRegionSearchChange?.(keyword);
                }}
              />
            </div>
          </div>

          <div ref={scrollViewportRef} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {isRegionSearching ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              ) : (
                <>
                  {filteredRegions.map((region) => (
                    <div key={region.id} className="space-y-2">
                      <div className="flex items-center gap-2 group">
                        {!regionOnly && (
                          <button
                            type="button"
                            onClick={() => toggleRegion(region.id.toString())}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                          >
                            {expandedRegions.includes(region.id.toString()) ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        )}
                        <div
                          onClick={() =>
                            handleSelect(
                              "region",
                              region.id.toString(),
                              undefined,
                              undefined,
                              region.name,
                            )
                          }
                          className={cn(
                            "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                            isSelected("region", region.id.toString())
                              ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                              : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {region.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Vùng trồng
                              </div>
                            </div>
                          </div>
                          {isSelected("region", region.id.toString()) ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-primary/10 text-primary border-none"
                              >
                                Đã chọn
                              </Badge>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                              <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      {!regionOnly &&
                        expandedRegions.includes(region.id.toString()) && (
                          <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                            <RegionAreasList
                              regionId={region.id.toString()}
                              regionName={region.name}
                              expandedAreas={expandedAreas}
                              toggleArea={toggleArea}
                              isSelected={isSelected}
                              onSelect={handleSelect}
                            />
                          </div>
                        )}
                    </div>
                  ))}

                  {filteredRegions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <div className="text-slate-500 font-medium text-sm">
                        Không tìm thấy dữ liệu phù hợp
                      </div>
                    </div>
                  )}

                  {/* Infinite scroll anchor */}
                  {hasMoreRegions && <div ref={observerRef} className="h-2 w-full" />}
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={closeDialog}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>
              {tempSelections.length > existingSelections.length
                ? `Xác nhận (+${tempSelections.length - existingSelections.length})`
                : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeographicalSelector;
export type { GeographicalSelection, RegionOption } from "./types";
