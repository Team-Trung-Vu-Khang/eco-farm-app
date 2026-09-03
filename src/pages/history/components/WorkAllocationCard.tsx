import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, FileText, Layers, Plus, X } from "lucide-react";
import {
  StageMaterialPicker,
  type MaterialAllocation,
} from "./StageMaterialPicker";
import type { DomainCode } from "@/features/farm-supply";

interface WorkAllocationCardProps {
  selectedStages: string[];
  plannedStages: string[];
  isPlannedMode: boolean;
  materialAllocations: MaterialAllocation[];
  domainCode: DomainCode;
  initialProgress?: number;
  onAddStage: (stageName: string) => void;
  onRemoveStage: (stageName: string) => void;
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
  onUpdateActualQuantity: (id: number, val: string) => void;
}

export function WorkAllocationCard({
  selectedStages,
  plannedStages,
  isPlannedMode,
  materialAllocations,
  domainCode,
  initialProgress = 60,
  onAddStage,
  onRemoveStage,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateActualQuantity,
}: WorkAllocationCardProps) {
  const [newStageInput, setNewStageInput] = useState("");
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const handleAdd = () => {
    if (!newStageInput.trim()) return;
    onAddStage(newStageInput.trim());
    setNewStageInput("");
  };

  const getTaskProgress = (stage: string) => {
    if (progressMap[stage] !== undefined) {
      return progressMap[stage];
    }
    return plannedStages.includes(stage) ? initialProgress : 100;
  };

  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-white">
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-900">
            <FileText className="w-4 h-4 text-green-600" />
            Phân bổ công việc
          </span>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 font-bold text-xs"
          >
            {selectedStages.length} mục
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        {/* Input thêm hạng mục công việc mới */}
        <div className="flex gap-2">
          <Input
            placeholder="Thêm hạng mục mới (Làm đất, Gieo hạt...)"
            value={newStageInput}
            onChange={(e) => setNewStageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="h-11 bg-white border-slate-200 font-medium text-xs rounded-xl"
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="h-11 rounded-xl px-5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>

        {/* Danh sách các Task Cards bên dưới */}
        {selectedStages.length > 0 ? (
          <div className="space-y-4">
            {selectedStages.map((stage, index) => {
              const isPlannedStage =
                isPlannedMode && plannedStages.includes(stage);
              const currentProgress = getTaskProgress(stage);

              return (
                <div
                  key={stage}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-4"
                >
                  {/* Task Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] text-slate-600 font-bold">
                        {index + 1}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900 truncate">
                        {stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPlannedStage ? (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                          Kế hoạch
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                          Phát sinh
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveStage(stage)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa công việc này"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Nội dung phân bổ vật tư trực tiếp bên trong Task Card */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Layers className="w-3.5 h-3.5 text-green-600" />
                      <span>Cấp phát & Phân bổ vật tư</span>
                    </div>
                    <StageMaterialPicker
                      stageKey={stage}
                      allocations={materialAllocations}
                      onAddMaterial={onAddMaterial}
                      onRemoveMaterial={onRemoveMaterial}
                      onUpdateActualQuantity={onUpdateActualQuantity}
                      domainCode={domainCode}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            Chưa có hạng mục công việc nào. Hãy chọn từ Hạng mục dự kiến hoặc
            nhập để thêm mới.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
