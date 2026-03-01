import React, { useState, useMemo } from "react";
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
} from "@tankhang1/eco-shared-ui";
import { Search, Sprout, Calendar, FilterX } from "lucide-react";
import useGrowthCycleStore from "../../../stores/useGrowthCycleStore";
import useCropStore from "../../../stores/useCropStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import { CROP_OPTIONS } from "../../../constants/crops";

interface GrowthCycleSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;
  selectedIds: string[];
  selectedStages?: Record<string, Record<string, number>>;
  onConfirm: (
    ids: string[],
    stages: Record<string, Record<string, number>>,
  ) => void;
}

const EMPTY_STAGES: Record<string, Record<string, number>> = {};

export function GrowthCycleSelectDialog({
  open,
  onOpenChange,
  scope,
  cropId,
  varietyId,
  selectedIds,
  selectedStages = EMPTY_STAGES,
  onConfirm,
}: GrowthCycleSelectDialogProps) {
  const { growthCycles } = useGrowthCycleStore();
  const { crops } = useCropStore();
  const { varieties } = useVarietyStore();
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);
  const [tempStages, setTempStages] =
    useState<Record<string, Record<string, number>>>(selectedStages);

  // Sync temp selection when dialog opens
  React.useEffect(() => {
    if (open) {
      setTempSelected(selectedIds);
      setTempStages(selectedStages);
    }
  }, [open, selectedIds, selectedStages]);

  const filteredCycles = useMemo(() => {
    return growthCycles.filter((cycle) => {
      // Filter by scope first
      if (cycle.scope !== scope) return false;

      // Filter by crop if selected
      if (cropId) {
        const selectedCrop = crops.find((c) => c.id.toString() === cropId);
        if (selectedCrop && cycle.cropName !== selectedCrop.cropType)
          return false;
      }

      // Filter by variety if selected
      if (scope === "variety" && varietyId) {
        const selectedVariety = varieties.find((v) => v.id === varietyId);
        if (selectedVariety && cycle.variety !== selectedVariety.varietyName)
          return false;
      }

      const searchLower = search.toLowerCase();
      return (
        cycle.name.toLowerCase().includes(searchLower) ||
        cycle.cropName.toLowerCase().includes(searchLower) ||
        (cycle.variety && cycle.variety.toLowerCase().includes(searchLower))
      );
    });
  }, [growthCycles, search, scope, cropId, varietyId, crops, varieties]);

  const toggleSelect = (cycle: any) => {
    setTempSelected((prev) => {
      const isSelected = prev.includes(cycle.id);
      if (isSelected) {
        const newStages = { ...tempStages };
        delete newStages[cycle.id];
        setTempStages(newStages);
        return prev.filter((i) => i !== cycle.id);
      } else {
        const initialStages: Record<string, number> = {};
        cycle.stages.forEach((s: any) => {
          initialStages[s.id] = s.duration;
        });
        setTempStages((prevStages) => ({
          ...prevStages,
          [cycle.id]: initialStages,
        }));
        return [...prev, cycle.id];
      }
    });
  };

  const toggleStage = (cycleId: string, stage: any) => {
    setTempStages((prev) => {
      const current = prev[cycleId] || {};
      const isSelected = !!current[stage.id];
      const next = { ...current };
      if (isSelected) {
        delete next[stage.id];
      } else {
        next[stage.id] = stage.duration;
      }
      return { ...prev, [cycleId]: next };
    });
  };

  const updateStageDuration = (
    cycleId: string,
    stageId: string,
    duration: number,
  ) => {
    setTempStages((prev) => ({
      ...prev,
      [cycleId]: {
        ...(prev[cycleId] || {}),
        [stageId]: duration,
      },
    }));
  };

  const handleConfirm = () => {
    onConfirm(tempSelected, tempStages);
    onOpenChange(false);
  };

  const getCropImage = (cropName: string) => {
    return CROP_OPTIONS.find((c) => c.name === cropName)?.image;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {tempSelected.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-100"
              >
                Đã chọn {tempSelected.length}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-3">
          {filteredCycles.length > 0 ? (
            filteredCycles.map((cycle) => {
              const isSelected = tempSelected.includes(cycle.id);
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
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(cycle)}
                      />

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
                            {cycle.totalDays} ngày
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
                        {cycle.stages.map((stage: any) => {
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
                              {isStageSelected && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    className="w-20 h-8 text-xs text-center"
                                    value={stageDuration}
                                    onChange={(e) =>
                                      updateStageDuration(
                                        cycle.id,
                                        stage.id,
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                  <span className="text-[10px] text-muted-foreground uppercase">
                                    ngày
                                  </span>
                                </div>
                              )}
                              {!isStageSelected && (
                                <p className="text-[10px] uppercase tracking-wider">
                                  {stage.duration} ngày
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
