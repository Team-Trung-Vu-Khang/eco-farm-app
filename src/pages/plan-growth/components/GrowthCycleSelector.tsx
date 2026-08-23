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
  Plus,
  Search,
  Sprout,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { GrowthCycle } from "../../growth-cycle/types/types";
import type { GrowthCycleSelection } from "../types";

const GrowthCycleSelector = ({
  growthCycles,
  onConfirm,
  existingSelections,
  disabled = false,
  // When set, the picker is locked to this one growth cycle — the cycle-
  // level row is hidden and only its stages can be picked (multi-select).
  // Used when a plan inherits its growth cycle from the parent workflow and
  // only needs to narrow down which stage(s) apply.
  lockedCycleId,
}: {
  growthCycles: GrowthCycle[];
  onConfirm: (selections: GrowthCycleSelection[]) => void;
  existingSelections: GrowthCycleSelection[];
  disabled?: boolean;
  lockedCycleId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCycles, setExpandedCycles] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<GrowthCycleSelection[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelections(existingSelections);
      if (lockedCycleId) setExpandedCycles([lockedCycleId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, existingSelections]);

  const visibleCycles = useMemo(
    () =>
      lockedCycleId
        ? growthCycles.filter((cycle) => cycle.id === lockedCycleId)
        : growthCycles,
    [growthCycles, lockedCycleId],
  );

  const filteredCycles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return visibleCycles.filter(
      (cycle) =>
        cycle.name.toLowerCase().includes(term) ||
        cycle.cropName?.toLowerCase().includes(term),
    );
  }, [visibleCycles, searchTerm]);

  const toggleCycle = (id: string) => {
    setExpandedCycles((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const isSelected = (
    type: "cycle" | "stage",
    cycleId: string,
    stageId?: string,
  ) =>
    tempSelections.some(
      (s) => s.type === type && s.cycleId === cycleId && s.stageId === stageId,
    );

  // Only one growth cycle may be selected as a whole — picking one always
  // replaces the prior selection. Stages, however, can be multi-selected as
  // long as they all belong to the same cycle — picking a stage from a
  // different cycle (or while a whole cycle is selected) resets the list to
  // just that stage.
  const handleSelect = (
    type: "cycle" | "stage",
    cycleId: string,
    stageId?: string,
  ) => {
    if (type === "cycle") {
      const isCurrentlySelected = tempSelections.some(
        (s) => s.type === "cycle" && s.cycleId === cycleId,
      );
      setTempSelections(
        isCurrentlySelected
          ? []
          : [
              {
                id: Math.random().toString(36).slice(2, 11),
                type: "cycle",
                cycleId,
              },
            ],
      );
      return;
    }

    const isCurrentlySelected = tempSelections.some(
      (s) => s.type === "stage" && s.cycleId === cycleId && s.stageId === stageId,
    );

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (s) => !(s.type === "stage" && s.cycleId === cycleId && s.stageId === stageId),
        ),
      );
      return;
    }

    setTempSelections((prev) => [
      ...prev.filter((s) => s.type === "stage" && s.cycleId === cycleId),
      {
        id: Math.random().toString(36).slice(2, 11),
        type: "stage",
        cycleId,
        stageId,
      },
    ]);
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  const selectedLabel = useMemo(() => {
    const first = existingSelections[0];
    if (!first) return null;
    const cycle = growthCycles.find((c) => c.id === first.cycleId);
    if (!cycle) return null;
    if (first.type === "cycle") return lockedCycleId ? "Toàn bộ chu kỳ" : cycle.name;

    const stageNames = existingSelections
      .map((s) => cycle.stages.find((st) => st.id === s.stageId)?.name)
      .filter((name): name is string => Boolean(name));
    if (stageNames.length === 0) return lockedCycleId ? null : cycle.name;
    if (lockedCycleId) {
      return stageNames.length === 1
        ? stageNames[0]
        : `Đã chọn ${stageNames.length} giai đoạn`;
    }
    if (stageNames.length === 1) return `${cycle.name} › ${stageNames[0]}`;
    return `${cycle.name} › ${stageNames.length} giai đoạn`;
  }, [existingSelections, growthCycles, lockedCycleId]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        {selectedLabel ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            {selectedLabel}
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            {lockedCycleId ? "Chọn giai đoạn sinh trưởng" : "Chọn chu kỳ sinh trưởng"}
          </>
        )}
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
              <Sprout className="w-5 h-5 text-primary" />
              {lockedCycleId
                ? "Chọn giai đoạn sinh trưởng"
                : "Chọn chu kỳ sinh trưởng"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {lockedCycleId
                ? "Chọn 1 hoặc nhiều giai đoạn áp dụng cho kế hoạch này"
                : "Chọn 1 Chu kỳ sinh trưởng, hoặc nhiều Giai đoạn trong cùng 1 chu kỳ"}
            </p>
          </DialogHeader>

          {!lockedCycleId && (
            <div className="px-6 pb-5 border-b shrink-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Tìm kiếm chu kỳ sinh trưởng..."
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredCycles.map((cycle) => (
                <div key={cycle.id} className="space-y-2">
                  {/* Cycle level */}
                  {lockedCycleId ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          {cycle.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {cycle.cropName ? `${cycle.cropName} · ` : ""}
                          {cycle.numStages} giai đoạn
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <button
                        onClick={() => toggleCycle(cycle.id)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        {expandedCycles.includes(cycle.id) ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div
                        onClick={() => handleSelect("cycle", cycle.id)}
                        className={cn(
                          "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                          isSelected("cycle", cycle.id)
                            ? "bg-primary/10 border-primary/40"
                            : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Sprout className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">
                              {cycle.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {cycle.cropName ? `${cycle.cropName} · ` : ""}
                              {cycle.numStages} giai đoạn
                            </div>
                          </div>
                        </div>
                        {isSelected("cycle", cycle.id) ? (
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
                  )}

                  {/* Stages level */}
                  {(lockedCycleId || expandedCycles.includes(cycle.id)) && (
                    <div
                      className={
                        lockedCycleId
                          ? "space-y-2"
                          : "ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1"
                      }
                    >
                      {cycle.stages?.map((stage) => (
                        <div
                          key={stage.id}
                          onClick={() =>
                            handleSelect("stage", cycle.id, stage.id)
                          }
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer group",
                            isSelected("stage", cycle.id, stage.id)
                              ? "bg-primary/10 border-primary/40"
                              : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-700 text-xs">
                                {stage.name}
                              </div>
                              {stage.duration && (
                                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">
                                  {stage.duration} ngày
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected("stage", cycle.id, stage.id) ? (
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
                      ))}

                      {(!cycle.stages || cycle.stages.length === 0) && (
                        <p className="text-xs text-muted-foreground py-1">
                          Chu kỳ này chưa có giai đoạn nào
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {filteredCycles.length === 0 && (
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

export default GrowthCycleSelector;
