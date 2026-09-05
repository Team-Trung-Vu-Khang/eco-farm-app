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

export interface WorkTaskDetail {
  id: string;
  stageName: string;
  progress: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  startDate?: string;
  endDate: string;
  description?: string;
  isDirty?: boolean;
}

interface WorkAllocationCardProps {
  selectedStages: string[];
  plannedStages: string[];
  isPlannedMode: boolean;
  workTaskDetails: Record<string, WorkTaskDetail>;
  materialAllocations: MaterialAllocation[];
  domainCode: DomainCode;
  onAddStage: (stageName: string) => void;
  onRemoveStage: (stageName: string) => void;
  onUpdateWorkTaskDetail: (
    stageName: string,
    updates: Partial<WorkTaskDetail>,
  ) => void;
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
  onUpdateActualQuantity: (id: number, val: string) => void;
}

const PRIORITY_MAP = {
  LOW: {
    label: "Thấp",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  MEDIUM: {
    label: "Trung bình",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  HIGH: {
    label: "Cao",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  URGENT: {
    label: "Khẩn cấp",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function WorkAllocationCard({
  selectedStages,
  plannedStages,
  isPlannedMode,
  workTaskDetails,
  materialAllocations,
  domainCode,
  onAddStage,
  onRemoveStage,
  onUpdateWorkTaskDetail,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateActualQuantity,
}: WorkAllocationCardProps) {
  const [newStageInput, setNewStageInput] = useState("");

  const handleAddStage = () => {
    if (!newStageInput.trim()) return;
    onAddStage(newStageInput.trim());
    setNewStageInput("");
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
            {selectedStages.length} công việc
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        {/* Input thêm công việc mới */}
        <div className="flex gap-2">
          <Input
            placeholder="Thêm hạng mục / công việc mới (Làm đất, Gieo hạt...)"
            value={newStageInput}
            onChange={(e) => setNewStageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddStage();
              }
            }}
            className="h-11 bg-white border-slate-200 font-medium text-xs rounded-xl"
          />
          <Button
            type="button"
            onClick={handleAddStage}
            className="h-11 rounded-xl px-5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white shrink-0 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm công việc
          </Button>
        </div>

        {/* Danh sách các Item Công việc */}
        {selectedStages.length > 0 ? (
          <div className="space-y-6">
            {selectedStages.map((stage, index) => {
              const isPlannedStage =
                isPlannedMode && plannedStages.includes(stage);
              const detail: WorkTaskDetail = workTaskDetails[stage] || {
                id: stage,
                stageName: stage,
                progress: 100,
                priority: "MEDIUM",
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
                description: "",
              };

              const prioInfo =
                PRIORITY_MAP[detail.priority || "MEDIUM"] ||
                PRIORITY_MAP.MEDIUM;

              return (
                <div
                  key={stage}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4"
                >
                  {/* Item Header */}
                  <div className="space-y-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] text-green-700 font-bold">
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
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 font-bold text-xs"
                        >
                          Tiến độ: {detail.progress}%
                        </Badge>
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

                    {/* Progress bar visual */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${detail.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Form Chi tiết thực thi Công việc */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        Thông tin thực hiện công việc
                      </span>
                      {/* Read-only Priority Badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold py-0.5 px-2 ${prioInfo.className}`}
                      >
                        Ưu tiên: {prioInfo.label}
                      </Badge>
                    </div>

                    {/* Editable Fields: Tiến độ (%) & Thời gian kết thúc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Field 1: Tiến độ % (Editable) */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span>Tiến độ hoàn thành</span>
                          <span className="text-green-700 font-extrabold">
                            {detail.progress}%
                          </span>
                        </div>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          clearable={false}
                          value={detail.progress}
                          onChange={(e) => {
                            const val = Math.min(
                              100,
                              Math.max(0, Number(e.target.value) || 0),
                            );
                            onUpdateWorkTaskDetail(stage, { progress: val });
                          }}
                          className="h-9 text-xs bg-white border-slate-200 font-bold rounded-lg"
                        />
                      </div>

                      {/* Field 2: Thời gian kết thúc (Editable) */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Thời gian kết thúc
                        </span>
                        <Input
                          type="date"
                          value={detail.endDate}
                          onChange={(e) =>
                            onUpdateWorkTaskDetail(stage, {
                              endDate: e.target.value,
                            })
                          }
                          className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium"
                        />
                      </div>

                      {/* Field 3: Ngày bắt đầu (View-only) */}
                      <div className="space-y-1 sm:col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Ngày bắt đầu
                        </span>
                        <div className="h-9 px-3 flex items-center text-xs bg-slate-100/70 border border-slate-200 rounded-lg text-slate-600 font-medium">
                          {detail.startDate || "Theo kế hoạch"}
                        </div>
                      </div>
                    </div>

                    {/* Field 4: Mô tả công việc (View-only) */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Mô tả công việc
                      </span>
                      <div className="p-2.5 text-xs bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 font-medium leading-relaxed min-h-[38px]">
                        {detail.description || "Không có mô tả chi tiết."}
                      </div>
                    </div>
                  </div>

                  {/* Phân bổ vật tư cho Công việc này */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
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
            Chưa có hạng mục / công việc nào. Hãy chọn từ Hạng mục dự kiến hoặc
            nhập để thêm mới.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
