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
import { CROP_OPTIONS } from "../../../constants/crops";

interface GrowthCycleSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  selectedStages?: Record<string, string[]>;
  onConfirm: (ids: string[], stages: Record<string, string[]>) => void;
}

const EMPTY_STAGES: Record<string, string[]> = {};

export function GrowthCycleSelectDialog({
  open,
  onOpenChange,
  selectedIds,
  selectedStages = EMPTY_STAGES,
  onConfirm,
}: GrowthCycleSelectDialogProps) {
  const { growthCycles } = useGrowthCycleStore();
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);
  const [tempStages, setTempStages] =
    useState<Record<string, string[]>>(selectedStages);

  // Sync temp selection when dialog opens
  React.useEffect(() => {
    if (open) {
      setTempSelected(selectedIds);
      setTempStages(selectedStages);
    }
  }, [open, selectedIds, selectedStages]);

  const filteredCycles = useMemo(() => {
    return growthCycles.filter((cycle) => {
      const searchLower = search.toLowerCase();
      return (
        cycle.name.toLowerCase().includes(searchLower) ||
        cycle.cropName.toLowerCase().includes(searchLower) ||
        (cycle.variety && cycle.variety.toLowerCase().includes(searchLower))
      );
    });
  }, [growthCycles, search]);

  const toggleSelect = (cycle: any) => {
    setTempSelected((prev) => {
      const isSelected = prev.includes(cycle.id);
      if (isSelected) {
        const newStages = { ...tempStages };
        delete newStages[cycle.id];
        setTempStages(newStages);
        return prev.filter((i) => i !== cycle.id);
      } else {
        setTempStages((prevStages) => ({
          ...prevStages,
          [cycle.id]: cycle.stages.map((s: any) => s.id),
        }));
        return [...prev, cycle.id];
      }
    });
  };

  const toggleStage = (cycleId: string, stageId: string) => {
    setTempStages((prev) => {
      const current = prev[cycleId] || [];
      const isSelected = current.includes(stageId);
      const newStages = isSelected
        ? current.filter((id) => id !== stageId)
        : [...current, stageId];
      return { ...prev, [cycleId]: newStages };
    });
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
                        <span>Chọn các giai đoạn áp dụng:</span>
                        <span>
                          {(tempStages[cycle.id] || []).length} /{" "}
                          {cycle.stages.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cycle.stages.map((stage: any) => {
                          const isStageSelected = (
                            tempStages[cycle.id] || []
                          ).includes(stage.id);
                          return (
                            <label
                              key={stage.id}
                              className={`
                              flex items-center gap-3 p-2.5 rounded-lg border group-hover:border-green-200 cursor-pointer transition-colors
                              ${isStageSelected ? "bg-white border-green-200 shadow-sm text-green-900" : "bg-white/50 border-muted text-muted-foreground"}
                            `}
                            >
                              <Checkbox
                                checked={isStageSelected}
                                onCheckedChange={() =>
                                  toggleStage(cycle.id, stage.id)
                                }
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate shrink-0">
                                  {stage.name}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider mt-0.5">
                                  {stage.duration} ngày
                                </p>
                              </div>
                            </label>
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
