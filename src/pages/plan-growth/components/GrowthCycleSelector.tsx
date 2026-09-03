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
  // When set, the picker is locked to these growth cycles — the cycle-
  // level row is hidden and only their stages can be picked (multi-select,
  // across as many of the locked cycles as needed). Used when a plan
  // inherits its growth cycle(s) from the parent workflow and only needs to
  // narrow down which stage(s) apply.
  lockedCycleIds,
  onSearchChange,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: {
  growthCycles: GrowthCycle[];
  onConfirm: (selections: GrowthCycleSelection[]) => void;
  existingSelections: GrowthCycleSelection[];
  disabled?: boolean;
  lockedCycleIds?: string[];
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  const isLocked = Boolean(lockedCycleIds?.length);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Which cycles have their (read-only, in non-locked mode) stage list
  // expanded for viewing — purely a display toggle, unrelated to selection.
  const [expandedCycles, setExpandedCycles] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<GrowthCycleSelection[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelections(existingSelections);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, existingSelections]);

  const visibleCycles = useMemo(
    () =>
      lockedCycleIds
        ? growthCycles.filter((cycle) => lockedCycleIds.includes(cycle.id))
        : growthCycles,
    [growthCycles, lockedCycleIds],
  );

  // The API owns search and pagination; do not filter the returned page locally.
  const filteredCycles = visibleCycles;

  const toggleExpanded = (id: string) => {
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

  // Both whole cycles and individual stages can be multi-selected freely —
  // picking one toggles it on/off without clearing anything else. Picking a
  // whole cycle drops any stage-level picks already made for that same
  // cycle (redundant once the whole cycle is selected); picking a stage
  // drops a whole-cycle pick for that cycle (it's no longer "all stages",
  // just this one).
  const handleSelect = (
    type: "cycle" | "stage",
    cycleId: string,
    stageId?: string,
  ) => {
    if (type === "cycle") {
      const isCurrentlySelected = tempSelections.some(
        (s) => s.type === "cycle" && s.cycleId === cycleId,
      );
      setTempSelections((prev) => {
        const withoutThisCycle = prev.filter(
          (s) => !(s.cycleId === cycleId && (s.type === "cycle" || s.type === "stage")),
        );
        return isCurrentlySelected
          ? withoutThisCycle
          : [
              ...withoutThisCycle,
              {
                id: Math.random().toString(36).slice(2, 11),
                type: "cycle",
                cycleId,
              },
            ];
      });
      return;
    }

    const isCurrentlySelected = tempSelections.some(
      (s) => s.type === "stage" && s.cycleId === cycleId && s.stageId === stageId,
    );
    const cycle = growthCycles.find((item) => item.id === cycleId);
    const stage = cycle?.stages.find((item) => item.id === stageId);

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (s) => !(s.type === "stage" && s.cycleId === cycleId && s.stageId === stageId),
        ),
      );
      return;
    }

    setTempSelections((prev) => [
      ...prev.filter((s) => !(s.type === "cycle" && s.cycleId === cycleId)),
      {
        id: Math.random().toString(36).slice(2, 11),
        type: "stage",
        cycleId,
        stageId,
        stageName: stage?.name,
      },
    ]);
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  const selectedLabel = useMemo(() => {
    if (existingSelections.length === 0) return null;

    // In locked mode the user is selecting stages, not cycles. The owning
    // cycle names are shown in the selected-stage summary below the field;
    // the field itself must count stages.
    if (isLocked) {
      const stageCount = existingSelections.filter(
        (selection) => selection.type === "stage" && selection.stageId,
      ).length;
      return stageCount > 0 ? `Đã chọn ${stageCount} giai đoạn` : null;
    }

    const cycleIds = Array.from(new Set(existingSelections.map((s) => s.cycleId)));
    if (cycleIds.length > 1) return `Đã chọn ${cycleIds.length} chu kỳ`;

    const cycle = growthCycles.find((c) => c.id === cycleIds[0]);
    if (!cycle) return null;
    const first = existingSelections[0];
    if (first.type === "cycle") return cycle.name;

    const stageNames = existingSelections
      .map((s) => cycle.stages.find((st) => st.id === s.stageId)?.name)
      .filter((name): name is string => Boolean(name));
    if (stageNames.length === 0) return cycle.name;
    if (stageNames.length === 1) return `${cycle.name} › ${stageNames[0]}`;
    return `${cycle.name} › ${stageNames.length} giai đoạn`;
  }, [existingSelections, growthCycles, isLocked]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        variant="outline"
        className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
      >
        {selectedLabel ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            {selectedLabel}
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            {isLocked ? "Chọn giai đoạn sinh trưởng" : "Chọn chu kỳ sinh trưởng"}
          </>
        )}
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchTerm("");
            onSearchChange?.("");
          }
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              {isLocked ? "Chọn giai đoạn sinh trưởng" : "Chọn chu kỳ sinh trưởng"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {isLocked
                ? "Chọn 1 hoặc nhiều giai đoạn, từ 1 hoặc nhiều chu kỳ, áp dụng cho kế hoạch này"
                : "Chọn 1 hoặc nhiều Giai đoạn sinh trưởng"}
            </p>
          </DialogHeader>

          {!isLocked && (
            <div className="px-6 pb-5 border-b shrink-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Tìm kiếm chu kỳ sinh trưởng..."
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onSearchChange?.(e.target.value);
                  }}
                />
              </div>
            </div>
          )}

          <ScrollArea
            className="flex-1 overflow-y-auto"
            onScroll={(event) => {
              const target = event.currentTarget;
              if (
                onLoadMore &&
                hasMore &&
                target.scrollTop + target.clientHeight >= target.scrollHeight - 80
              ) {
                onLoadMore();
              }
            }}
          >
            <div className="p-6 space-y-4">
              {isLoading && filteredCycles.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Đang tải...</div>
              ) : filteredCycles.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {isLocked
                    ? "Không tìm thấy giai đoạn sinh trưởng"
                    : "Không tìm thấy chu kỳ sinh trưởng"}
                </div>
              ) : filteredCycles.map((cycle) => (
                <div key={cycle.id} className="space-y-2">
                  {/* Cycle level */}
                  {isLocked ? (
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
                        type="button"
                        onClick={() => toggleExpanded(cycle.id)}
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

                  {/* Stages level — read-only preview in non-locked mode, no
                      selection there; the locked (stage-only) mode below is
                      the one that lets stages be picked. */}
                  {!isLocked && expandedCycles.includes(cycle.id) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {cycle.stages?.map((stage) => (
                        <div
                          key={stage.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/60"
                        >
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
                      ))}

                      {(!cycle.stages || cycle.stages.length === 0) && (
                        <p className="text-xs text-muted-foreground py-1">
                          Chu kỳ này chưa có giai đoạn nào
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stages level — only shown in locked (stage-only) mode */}
                  {isLocked && (
                    <div className="ml-4 space-y-2 border-l-2 border-slate-100 pl-4">
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
              {isLoading && filteredCycles.length > 0 && (
                <div className="py-3 text-center text-xs text-muted-foreground">Đang tải thêm...</div>
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
