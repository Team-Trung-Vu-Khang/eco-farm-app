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
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { GeographicalSelection } from "../types";

const GeographicalSelector = ({
  regions,
  onConfirm,
  enterpriseId,
  existingSelections,
  disabled = false,
}: {
  regions: any[];
  onConfirm: (selections: GeographicalSelection[]) => void;
  enterpriseId: string;
  existingSelections: GeographicalSelection[];
  disabled?: boolean;
}) => {
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
    return regions.filter(
      (r) =>
        (!enterpriseId ||
          r.enterpriseId === `ent-${enterpriseId}` ||
          r.enterpriseId === enterpriseId) &&
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [regions, enterpriseId, searchTerm]);

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
    type: "region" | "area" | "plot",
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    // Exact match
    const exactMatch = tempSelections.some(
      (s) =>
        s.type === type &&
        s.regionId === regionId &&
        s.areaId === areaId &&
        s.plotId === plotId,
    );
    if (exactMatch) return true;

    // Parent check: if Region is selected, Area and Plot are considered selected
    if (type === "area" || type === "plot") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      if (regionSelected) return true;
    }

    // Parent check: if Area is selected, Plot is considered selected
    if (type === "plot") {
      const areaSelected = tempSelections.some(
        (s) =>
          s.type === "area" && s.regionId === regionId && s.areaId === areaId,
      );
      if (areaSelected) return true;
    }

    return false;
  };

  const handleSelect = (
    type: "region" | "area" | "plot",
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    // If a parent is already selected, don't allow selecting children
    if (type === "area") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      if (regionSelected) return;
    }
    if (type === "plot") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      const areaSelected = tempSelections.some(
        (s) =>
          s.type === "area" && s.regionId === regionId && s.areaId === areaId,
      );
      if (regionSelected || areaSelected) return;
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
    } else {
      setTempSelections((prev) => {
        // Clear children if parent is selected
        let next = [...prev];
        if (type === "region") {
          next = next.filter((s) => s.regionId !== regionId);
        } else if (type === "area") {
          next = next.filter(
            (s) => !(s.regionId === regionId && s.areaId === areaId),
          );
        }

        return [
          ...next,
          {
            id: Math.random().toString(36).substr(2, 9),
            type,
            regionId,
            areaId,
            plotId,
          },
        ];
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        <Plus className="w-5 h-5" />
        Chọn vùng canh tác
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn phạm vi canh tác
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn có thể chọn Vùng trồng, Khu vực hoặc từng Lô đất cụ thể
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
              {filteredRegions.map((r) => (
                <div key={r.id} className="space-y-2">
                  {/* Region Level */}
                  <div className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleRegion(r.id.toString())}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {expandedRegions.includes(r.id.toString()) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() => handleSelect("region", r.id.toString())}
                      className={cn(
                        "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                        isSelected("region", r.id.toString())
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
                            {r.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Vùng trồng
                          </div>
                        </div>
                      </div>
                      {isSelected("region", r.id.toString()) ? (
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

                  {/* Areas Level */}
                  {expandedRegions.includes(r.id.toString()) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {r.subAreas?.map((area: any) => (
                        <div key={area.id} className="space-y-2">
                          <div className="flex items-center gap-2 group">
                            <button
                              onClick={() => toggleArea(area.id.toString())}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              {expandedAreas.includes(area.id.toString()) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <div
                              onClick={() =>
                                handleSelect(
                                  "area",
                                  r.id.toString(),
                                  area.id.toString(),
                                )
                              }
                              className={cn(
                                "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                isSelected(
                                  "area",
                                  r.id.toString(),
                                  area.id.toString(),
                                )
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
                              {isSelected(
                                "area",
                                r.id.toString(),
                                area.id.toString(),
                              ) ? (
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
                          {expandedAreas.includes(area.id.toString()) && (
                            <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                              {area.plots?.map((plot: any) => (
                                <div
                                  key={plot.id}
                                  onClick={() =>
                                    handleSelect(
                                      "plot",
                                      r.id.toString(),
                                      area.id.toString(),
                                      plot.id,
                                    )
                                  }
                                  className={cn(
                                    "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                    isSelected(
                                      "plot",
                                      r.id.toString(),
                                      area.id.toString(),
                                      plot.id,
                                    )
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
                                  {isSelected(
                                    "plot",
                                    r.id.toString(),
                                    area.id.toString(),
                                    plot.id,
                                  ) ? (
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                      <span className="text-[9px] text-primary font-bold">
                                        LÔ #{plot.id.split("-").pop()}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-sm border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                      <Plus className="w-2.5 h-2.5 text-slate-300 group-hover:text-primary" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
