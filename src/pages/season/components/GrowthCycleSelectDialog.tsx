import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Sprout, Calendar, FilterX } from "lucide-react";
import useGrowthCycleStore from "../../../stores/useGrowthCycleStore";
import { CROP_OPTIONS } from "../../../constants/crops";
import { animalCycleOptions } from "../../growth-cycle/data/cycleSelectionData";
import type { GrowthCycle } from "../../growth-cycle/types/types";

interface GrowthCycleSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;
  selectedId: string;
  selectedStages?: Record<string, Record<string, string | number>>;
  onConfirm: (
    id: string,
    stages: Record<string, Record<string, string | number>>,
  ) => void;
}

type EditableStages = Record<string, Record<string, string>>;

const EMPTY_STAGES: EditableStages = {};

function parseDuration(durationStr: string): { years: string; months: string; days: string } {
  const str = String(durationStr || "");
  const yearMatch = str.match(/(\d+)\s*năm/);
  const monthMatch = str.match(/(\d+)\s*tháng/);
  const dayMatch = str.match(/(\d+)\s*ngày/);
  return {
    years: yearMatch ? yearMatch[1] : "",
    months: monthMatch ? monthMatch[1] : "",
    days: dayMatch ? dayMatch[1] : (!yearMatch && !monthMatch && !isNaN(Number(str)) && Number(str) > 0 ? str : ""),
  };
}

function formatDurationDisplay(durationStr: string): string {
  const { years, months, days } = parseDuration(String(durationStr || ""));
  const parts = [];
  if (years && parseInt(years) > 0) parts.push(`${years} năm`);
  if (months && parseInt(months) > 0) parts.push(`${months} tháng`);
  if (days && parseInt(days) > 0) parts.push(`${days} ngày`);
  return parts.length > 0 ? parts.join(" ") : "-";
}

function computeCycleDuration(stages: GrowthCycle["stages"]): string {
  let hasDays = false;
  let hasMonths = false;
  let hasYears = false;
  let sumYears = 0;
  let sumMonths = 0;
  let sumDays = 0;

  stages.forEach((stage) => {
    const { years, months, days } = parseDuration(String(stage.duration || ""));
    const str = String(stage.duration || "");
    if (str.includes("năm")) hasYears = true;
    if (str.includes("tháng")) hasMonths = true;
    if (str.includes("ngày") || (!str.includes("năm") && !str.includes("tháng") && !isNaN(Number(str)) && Number(str) > 0)) hasDays = true;
    if (years) sumYears += parseInt(years);
    if (months) sumMonths += parseInt(months);
    if (days) sumDays += parseInt(days);
  });

  if (hasDays) {
    return `${sumYears * 365 + sumMonths * 30 + sumDays} ngày`;
  } else if (hasMonths) {
    return `${sumYears * 12 + sumMonths} tháng`;
  } else if (hasYears) {
    return `${sumYears} năm`;
  }
  return "-";
}

export function GrowthCycleSelectDialog({
  open,
  onOpenChange,
  scope,
  cropId,
  varietyId,
  selectedId,
  selectedStages = EMPTY_STAGES,
  onConfirm,
}: GrowthCycleSelectDialogProps) {
  const { growthCycles } = useGrowthCycleStore();
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string>(selectedId);
  const [tempStages, setTempStages] = useState<EditableStages>(() => {
    const nextStages: EditableStages = {};
    Object.entries(selectedStages).forEach(([cycleId, stageMap]) => {
      nextStages[cycleId] = Object.fromEntries(
        Object.entries(stageMap).map(([stageId, duration]) => [
          stageId,
          String(duration ?? ""),
        ]),
      );
    });
    return nextStages;
  });

  const filteredCycles = useMemo(() => {
    return growthCycles.filter((cycle) => {
      // Filter by scope first
      if (cycle.scope !== scope) return false;

      // Filter by crop if selected
      if (cropId) {
        if (cycle.cropId !== cropId && cycle.cropName !== cropId) return false;
      }

      // Filter by variety if selected
      if (scope === "variety" && varietyId) {
        if (cycle.variety !== varietyId) return false;
      }

      const searchLower = search.toLowerCase();
      return (
        cycle.name.toLowerCase().includes(searchLower) ||
        cycle.cropName.toLowerCase().includes(searchLower) ||
        cycle.cropId.toLowerCase().includes(searchLower) ||
        (cycle.variety && cycle.variety.toLowerCase().includes(searchLower))
      );
    });
  }, [growthCycles, search, scope, cropId, varietyId]);

  const toggleSelect = (cycle: GrowthCycle) => {
    const isSelected = tempSelected === cycle.id;
    if (isSelected) {
      // Deselect
      setTempSelected("");
      setTempStages({});
    } else {
      // Select this cycle, deselect any previous
      const initialStages: Record<string, string> = {};
      cycle.stages.forEach((s) => {
        initialStages[s.id] = String(s.duration || "");
      });
      setTempSelected(cycle.id);
      setTempStages({ [cycle.id]: initialStages });
    }
  };

  const toggleStage = (
    cycleId: string,
    stage: GrowthCycle["stages"][number],
  ) => {
    setTempStages((prev) => {
      const current = prev[cycleId] || {};
      const isSelected = !!current[stage.id];
      const next = { ...current };
      if (isSelected) {
        delete next[stage.id];
      } else {
        next[stage.id] = String(stage.duration || "");
      }
      return { ...prev, [cycleId]: next };
    });
  };

  const updateStageDuration = (
    cycleId: string,
    stageId: string,
    type: "years" | "months" | "days",
    value: string,
  ) => {
    setTempStages((prev) => {
      const currentStr = String(prev[cycleId]?.[stageId] || "");
      const parts = parseDuration(currentStr);
      const cleanValue = value.replace(/\D/g, "");
      const newParts = { ...parts, [type]: cleanValue };
      const newParts2 = [];
      if (newParts.years && parseInt(newParts.years) > 0) newParts2.push(`${newParts.years} năm`);
      if (newParts.months && parseInt(newParts.months) > 0) newParts2.push(`${newParts.months} tháng`);
      if (newParts.days && parseInt(newParts.days) > 0) newParts2.push(`${newParts.days} ngày`);
      return {
        ...prev,
        [cycleId]: {
          ...(prev[cycleId] || {}),
          [stageId]: newParts2.join(" "),
        },
      };
    });
  };

  const handleConfirm = () => {
    onConfirm(tempSelected, tempStages);
    onOpenChange(false);
  };

  const getCropImage = (cropName: string) => {
    return (
      CROP_OPTIONS.find((c) => c.name === cropName)?.image ||
      animalCycleOptions.find((option) => option.name === cropName)?.image
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelected(selectedId);
          const nextStages: EditableStages = {};
          Object.entries(selectedStages).forEach(([cycleId, stageMap]) => {
            nextStages[cycleId] = Object.fromEntries(
              Object.entries(stageMap).map(([stageId, duration]) => [
                stageId,
                String(duration ?? ""),
              ]),
            );
          });
          setTempStages(nextStages);
          setSearch("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0!">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-green-700">
            <Sprout className="w-5 h-5 text-green-600" />
            Chọn chu kỳ sinh trưởng
          </DialogTitle>
          <div className="relative mt-4 mb-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, loại cây hoặc giống..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground font-medium">
              Đã hiển thị {filteredCycles.length} kết quả
            </span>
            {tempSelected && (
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-100"
              >
                Đã chọn 1
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-3">
          {filteredCycles.length > 0 ? (
            filteredCycles.map((cycle) => {
              const isSelected = tempSelected === cycle.id;
              return (
                <div
                  key={cycle.id}
                  className={`
                    p-4 rounded-xl border-2 transition-all group
                    ${isSelected ? "border-green-600 bg-green-50/10 shadow-sm" : "border-muted hover:border-green-200 hover:bg-muted/30"}
                  `}
                >
                  {/* Header: Select whole cycle */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSelect(cycle)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-green-600 bg-green-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <Avatar className="w-10 h-10 border shadow-sm">
                        <AvatarImage src={getCropImage(cycle.cropName)} />
                        <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                          {cycle.cropName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">
                          {cycle.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100">
                            {cycle.cropName}
                          </span>
                          {cycle.variety && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100">
                                {cycle.variety}
                              </span>
                            </>
                          )}
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {cycle.stages ? computeCycleDuration(cycle.stages) : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stages list (only visible if cycle is selected) */}
                  {isSelected && cycle.stages && cycle.stages.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-100 space-y-2">
                      <div className="text-xs font-semibold text-green-800 mb-2 px-2 flex items-center justify-between">
                        <span>
                          Chọn các giai đoạn áp dụng & Điều chỉnh (ngày):
                        </span>
                        <span>
                          {Object.keys(tempStages[cycle.id] || {}).length} /{" "}
                          {cycle.stages.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {cycle.stages.map((stage) => {
                          const currentCycleStages = tempStages[cycle.id] || {};
                          const stageDuration = currentCycleStages[stage.id];
                          const isStageSelected = stageDuration !== undefined;
                          return (
                            <div
                              key={stage.id}
                              className={`
                              flex items-center gap-3 p-2.5 rounded-lg border group-hover:border-green-200 transition-colors
                              ${isStageSelected ? "bg-white border-green-200 shadow-sm text-green-900" : "bg-white/50 border-muted text-muted-foreground"}
                            `}
                            >
                              <Checkbox
                                checked={isStageSelected}
                                onCheckedChange={() =>
                                  toggleStage(cycle.id, stage)
                                }
                              />
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => toggleStage(cycle.id, stage)}
                              >
                                <p className="text-sm font-medium truncate shrink-0">
                                  {stage.name}
                                </p>
                              </div>
                              {isStageSelected && (() => {
                                const currentStr = String(tempStages[cycle.id]?.[stage.id] || "");
                                const parts = parseDuration(currentStr);
                                return (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder="0"
                                      value={parts.years}
                                      onChange={(e) => updateStageDuration(cycle.id, stage.id, "years", e.target.value)}
                                      className="w-8 h-7 text-xs text-center border rounded outline-none focus:border-green-400"
                                    />
                                    <span className="text-[10px] text-muted-foreground">năm</span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder="0"
                                      value={parts.months}
                                      onChange={(e) => updateStageDuration(cycle.id, stage.id, "months", e.target.value)}
                                      className="w-8 h-7 text-xs text-center border rounded outline-none focus:border-green-400"
                                    />
                                    <span className="text-[10px] text-muted-foreground">tháng</span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder="0"
                                      value={parts.days}
                                      onChange={(e) => updateStageDuration(cycle.id, stage.id, "days", e.target.value)}
                                      className="w-8 h-7 text-xs text-center border rounded outline-none focus:border-green-400"
                                    />
                                    <span className="text-[10px] text-muted-foreground">ngày</span>
                                  </div>
                                );
                              })()}
                              {!isStageSelected && (
                                <p className="text-[10px] uppercase tracking-wider">
                                  {formatDurationDisplay(String(stage.duration || ""))}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
              <FilterX className="w-12 h-12 mb-3 text-muted-foreground/40" />
              <p className="font-medium">Không tìm thấy chu kỳ nào</p>
              <p className="text-xs">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-2 border-t bg-slate-50/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="px-8 font-bold"
            onClick={handleConfirm}
            disabled={tempSelected.length === 0}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
