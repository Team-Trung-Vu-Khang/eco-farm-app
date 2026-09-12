import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";

export interface CultivationZoneOption {
  id: number | string;
  code?: string;
  name: string;
  enterpriseId?: string;
  subAreas?: Array<{
    id: number | string;
    name: string;
    plots?: Array<{ id: number | string; name: string }>;
  }>;
}

export interface CultivationZoneSelectorProps {
  regions: CultivationZoneOption[];
  existingSelections?: GeographicalSelection[];
  onConfirm: (selections: GeographicalSelection[]) => void;
  customTrigger?: React.ReactNode;
  regionOnly?: boolean;
  disabled?: boolean;
}

export function CultivationZoneSelector({
  regions,
  existingSelections = [],
  onConfirm,
  customTrigger,
  regionOnly = false,
  disabled = false,
}: CultivationZoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<GeographicalSelection[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelections(existingSelections);
    }
  }, [isOpen, existingSelections]);

  const filteredRegions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return regions;

    return regions
      .map((region) => {
        const regionMatch =
          region.name.toLowerCase().includes(query) ||
          region.code?.toLowerCase().includes(query);

        const matchedSubAreas = (region.subAreas || [])
          .map((area) => {
            const areaMatch = area.name.toLowerCase().includes(query);
            const matchedPlots = (area.plots || []).filter((plot) =>
              plot.name.toLowerCase().includes(query),
            );

            if (areaMatch || matchedPlots.length > 0) {
              return {
                ...area,
                plots: areaMatch ? area.plots : matchedPlots,
              };
            }
            return null;
          })
          .filter(Boolean) as CultivationZoneOption["subAreas"];

        if (regionMatch || (matchedSubAreas && matchedSubAreas.length > 0)) {
          return {
            ...region,
            subAreas: regionMatch ? region.subAreas : matchedSubAreas,
          };
        }
        return null;
      })
      .filter(Boolean) as CultivationZoneOption[];
  }, [regions, searchTerm]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id],
    );
  };

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id],
    );
  };

  const isSelected = (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    const exactMatch = tempSelections.some(
      (sel) =>
        sel.type === type &&
        sel.regionId === regionId &&
        sel.areaId === areaId &&
        sel.plotId === plotId,
    );
    if (exactMatch) return true;

    if (type === "area" || type === "plot") {
      const regionSelected = tempSelections.some(
        (sel) => sel.type === "region" && sel.regionId === regionId,
      );
      if (regionSelected) return true;
    }

    if (type === "plot") {
      const areaSelected = tempSelections.some(
        (sel) =>
          sel.type === "area" &&
          sel.regionId === regionId &&
          sel.areaId === areaId,
      );
      if (areaSelected) return true;
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

    if (type === "area") {
      const regionSelected = tempSelections.some(
        (sel) => sel.type === "region" && sel.regionId === regionId,
      );
      if (regionSelected) return;
    }

    if (type === "plot") {
      const regionSelected = tempSelections.some(
        (sel) => sel.type === "region" && sel.regionId === regionId,
      );
      const areaSelected = tempSelections.some(
        (sel) =>
          sel.type === "area" &&
          sel.regionId === regionId &&
          sel.areaId === areaId,
      );
      if (regionSelected || areaSelected) return;
    }

    const isCurrentlySelected = tempSelections.some(
      (sel) =>
        sel.type === type &&
        sel.regionId === regionId &&
        sel.areaId === areaId &&
        sel.plotId === plotId,
    );

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (sel) =>
            !(
              sel.type === type &&
              sel.regionId === regionId &&
              sel.areaId === areaId &&
              sel.plotId === plotId
            ),
        ),
      );
      return;
    }

    setTempSelections((prev) => {
      let next = [...prev];
      if (type === "region") {
        next = next.filter((sel) => sel.regionId !== regionId);
      } else if (type === "area") {
        next = next.filter(
          (sel) => !(sel.regionId === regionId && sel.areaId === areaId),
        );
      }

      return [
        ...next,
        {
          id: Math.random().toString(36).substring(2, 11),
          type,
          regionId,
          areaId,
          plotId,
          name,
          regionName,
          areaName,
        },
      ];
    });
  };

  const handleOpenModal = () => {
    setTempSelections(existingSelections);
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  return (
    <>
      {customTrigger ? (
        <div
          onClick={handleOpenModal}
          className={cn("w-full", disabled && "pointer-events-none")}
        >
          {customTrigger}
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleOpenModal}
          disabled={disabled}
          className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
          variant="outline"
        >
          <Plus className="w-5 h-5" />
          {existingSelections.length > 0
            ? `Đã chọn ${existingSelections.length} vùng canh tác`
            : "Chọn vùng canh tác"}
        </Button>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchTerm("");
          }
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn phạm vi canh tác
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {regionOnly
                ? "Chỉ chọn Vùng trồng"
                : "Chọn 1 Vùng trồng, Khu vực hoặc Lô đất cụ thể"}
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng, khu vực, lô..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.map((region) => {
                const regIdStr = String(region.id);
                const isRegExpanded = expandedRegions.includes(regIdStr);
                const isRegSelected = isSelected("region", regIdStr);
                const hasSubAreas =
                  Boolean(region.subAreas) &&
                  (region.subAreas?.length ?? 0) > 0;

                return (
                  <div key={regIdStr} className="space-y-2">
                    {/* Region Level */}
                    <div className="flex items-center gap-2 group">
                      {!regionOnly && hasSubAreas ? (
                        <button
                          type="button"
                          onClick={() => toggleRegion(regIdStr)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          {isRegExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      ) : (
                        <div className="w-6" />
                      )}

                      <div
                        onClick={() =>
                          handleSelect(
                            "region",
                            regIdStr,
                            undefined,
                            undefined,
                            region.name,
                          )
                        }
                        className={cn(
                          "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                          isRegSelected
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
                              Vùng trồng {region.code ? `• ${region.code}` : ""}
                            </div>
                          </div>
                        </div>
                        {isRegSelected ? (
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

                    {/* SubAreas Level */}
                    {!regionOnly && isRegExpanded && hasSubAreas && (
                      <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                        {(region.subAreas || []).map((area) => {
                          const areaIdStr = String(area.id);
                          const isAreaExpanded =
                            expandedAreas.includes(areaIdStr);
                          const isAreaSel = isSelected(
                            "area",
                            regIdStr,
                            areaIdStr,
                          );
                          const hasPlots =
                            Boolean(area.plots) &&
                            (area.plots?.length ?? 0) > 0;

                          return (
                            <div key={areaIdStr} className="space-y-2">
                              <div className="flex items-center gap-2 group">
                                {hasPlots ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleArea(areaIdStr)}
                                    className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  >
                                    {isAreaExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-slate-400" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-6" />
                                )}

                                <div
                                  onClick={() =>
                                    handleSelect(
                                      "area",
                                      regIdStr,
                                      areaIdStr,
                                      undefined,
                                      area.name,
                                      region.name,
                                    )
                                  }
                                  className={cn(
                                    "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                    isAreaSel
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
                                  {isAreaSel ? (
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

                              {/* Plots Level */}
                              {isAreaExpanded && hasPlots && (
                                <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                                  {(area.plots || []).map((plot) => {
                                    const plotIdStr = String(plot.id);
                                    const isPlotSel = isSelected(
                                      "plot",
                                      regIdStr,
                                      areaIdStr,
                                      plotIdStr,
                                    );

                                    return (
                                      <div
                                        key={plotIdStr}
                                        onClick={() =>
                                          handleSelect(
                                            "plot",
                                            regIdStr,
                                            areaIdStr,
                                            plotIdStr,
                                            plot.name,
                                            region.name,
                                            area.name,
                                          )
                                        }
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                          isPlotSel
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
                                        {isPlotSel ? (
                                          <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                            <Badge
                                              variant="secondary"
                                              className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0 font-bold"
                                            >
                                              Đã chọn
                                            </Badge>
                                          </div>
                                        ) : (
                                          <div className="w-3.5 h-3.5 rounded-sm border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                            <Plus className="w-2.5 h-2.5 text-slate-300 group-hover:text-primary" />
                                          </div>
                                        )}
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
              })}

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
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleConfirm}>
              {tempSelections.length > existingSelections.length
                ? `Xác nhận (+${tempSelections.length - existingSelections.length})`
                : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
