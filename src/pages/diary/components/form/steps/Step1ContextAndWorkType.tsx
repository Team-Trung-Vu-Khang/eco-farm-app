import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  RemoteAutoCompleteSelect,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList } from "lucide-react";
import {
  WORK_TYPE_OPTIONS,
  getWorkflowLabel,
  getWorkflowSubtitle,
} from "@/pages/diary/constants/history-form.constants";
import type {
  HistoryFormData,
  MaterialAllocation,
} from "@/pages/diary/types/history-form.types";
import {
  getTodayDateString,
  resolveWorkType,
} from "@/pages/diary/utils/history-form.utils";
import { WorkflowScopeMapModal } from "@/pages/diary/components/dialogs/WorkflowScopeMapModal";
import { PlannedTaskDetailCard } from "@/pages/diary/components/form/PlannedTaskDetailCard";
import type { WorkTaskDetail } from "@/pages/diary/components/form/WorkAllocationCard";
import type {
  FarmWorkflowResponse,
  FarmPlanResponse,
} from "@/features/farm-workflow/types/farm-workflow.type";
import type { FarmTaskResponse } from "@/features/farm-task/types/farm-task.type";

export interface Step1ContextAndWorkTypeProps {
  formData: HistoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<HistoryFormData>>;
  workflowDomainCode: string;
  workflowOptions: Array<{ label: string; value: string }>;
  workflowSearchQuery: string;
  setWorkflowSearchQuery: (query: string) => void;
  workflowsLoading: boolean;
  selectedWorkflow?: FarmWorkflowResponse;
  isPlannedMode: boolean;
  allowModeToggle: boolean;
  planOptions: Array<{ label: string; value: string }>;
  setPlanSearchQuery: (query: string) => void;
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  selectedPlan?: FarmPlanResponse;
  stageOptions: Array<{ label: string; value: string }>;
  selectedStageId: string;
  setSelectedStageId: (id: string) => void;
  availableTasks: FarmTaskResponse[];
  selectedTask?: FarmTaskResponse;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setPlannedStages: React.Dispatch<React.SetStateAction<string[]>>;
  setWorkTaskDetails: React.Dispatch<
    React.SetStateAction<Record<string, WorkTaskDetail>>
  >;
  setInitialTaskDetails: React.Dispatch<
    React.SetStateAction<Record<string, WorkTaskDetail>>
  >;
  personnelOptions?: Array<{ label: string; value: string }>;
  defaultPersonnelId?: number;
}

export function Step1ContextAndWorkType({
  formData,
  setFormData,
  workflowDomainCode,
  workflowOptions,
  setWorkflowSearchQuery,
  workflowsLoading,
  selectedWorkflow,
  isPlannedMode,
  allowModeToggle,
  planOptions,
  setPlanSearchQuery,
  selectedPlanId,
  setSelectedPlanId,
  selectedPlan,
  stageOptions,
  selectedStageId,
  setSelectedStageId,
  availableTasks,
  selectedTask,
  errors,
  setErrors,
  setPlannedStages,
  setWorkTaskDetails,
  setInitialTaskDetails,
  personnelOptions = [],
  defaultPersonnelId,
}: Step1ContextAndWorkTypeProps) {
  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            Thông tin vụ mùa & loại công việc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {/* 1. Chọn Vụ mùa / Quy trình */}
          <div className="space-y-2">
            <Label required>{getWorkflowLabel(workflowDomainCode)}</Label>
            <RemoteAutoCompleteSelect
              options={workflowOptions}
              value={formData.regimenId}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, regimenId: val }));
                setSelectedPlanId("");
                setSelectedStageId("");
                if (errors.regimenId) {
                  setErrors((prev) => ({ ...prev, regimenId: "" }));
                }
              }}
              onSearch={(query) => {
                setWorkflowSearchQuery(query);
              }}
              placeholder={`Chọn ${getWorkflowLabel(workflowDomainCode).toLowerCase()}...`}
              searchPlaceholder={`Tìm ${getWorkflowLabel(workflowDomainCode).toLowerCase()}...`}
              emptyText="Không tìm thấy mục phù hợp."
              loading={workflowsLoading}
              disabled={!allowModeToggle}
            />
            {errors.regimenId && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.regimenId}
              </p>
            )}
            <p className="text-xs text-slate-500">
              {getWorkflowSubtitle(workflowDomainCode)} đang được áp dụng cho
              nhật ký này.
            </p>

            {/* Bản đồ phạm vi Mùa vụ */}
            {selectedWorkflow && (
              <div className="pt-1">
                <WorkflowScopeMapModal workflow={selectedWorkflow} />
              </div>
            )}
          </div>

          {/* 2. Chế độ Theo kế hoạch -> Combobox chọn Kế hoạch & Hạng mục dự kiến (Stage) */}
          {isPlannedMode && (
            <div className="space-y-4 pt-1 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Combobox 1: Kế hoạch */}
                <div className="space-y-2">
                  <Label required>Kế hoạch</Label>
                  <RemoteAutoCompleteSelect
                    options={planOptions}
                    value={selectedPlanId}
                    onChange={(val) => {
                      setSelectedPlanId(val);
                      setSelectedStageId("");
                      setPlannedStages([]);
                      setWorkTaskDetails({});
                      setFormData((prev) => ({
                        ...prev,
                        selectedStages: [],
                        materialAllocations: [],
                      }));
                      if (errors.planId) {
                        setErrors((prev) => ({ ...prev, planId: "" }));
                      }
                    }}
                    onSearch={(query) => {
                      setPlanSearchQuery(query);
                    }}
                    placeholder="Chọn kế hoạch..."
                    searchPlaceholder="Tìm kế hoạch..."
                    emptyText="Không tìm thấy kế hoạch."
                    disabled={!allowModeToggle || !formData.regimenId}
                  />
                  {errors.planId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.planId}
                    </p>
                  )}
                </div>

                {/* Combobox 2: Hạng mục dự kiến (Giai đoạn/Stage thuộc Kế hoạch) */}
                <div className="space-y-2">
                  <Label required>Hạng mục dự kiến</Label>
                  <RemoteAutoCompleteSelect
                    onSearch={() => {}}
                    options={stageOptions}
                    value={selectedStageId}
                    onChange={(val) => {
                      setSelectedStageId(val);
                      if (errors.stageId) {
                        setErrors((prev) => ({ ...prev, stageId: "" }));
                      }

                      const targetStage = selectedPlan?.stages?.find(
                        (s) => String(s.id) === String(val),
                      );
                      const stageTasks = availableTasks.filter(
                        (t) => t.stage && String(t.stage.id) === String(val),
                      );

                      const newTaskNames: string[] = [];
                      const newTaskDetails: Record<string, WorkTaskDetail> = {};
                      const newAllocations: MaterialAllocation[] = [];

                      if (stageTasks.length > 0) {
                        stageTasks.forEach((taskItem, tIdx) => {
                          const taskName = taskItem.name;
                          newTaskNames.push(taskName);
                          const taskProgress =
                            typeof taskItem.progressPercent === "number"
                              ? taskItem.progressPercent
                              : taskItem.status === "DONE"
                                ? 100
                                : 0;
                          newTaskDetails[taskName] = {
                            id: String(taskItem.id),
                            stageName: taskName,
                            progress: taskProgress,
                            priority:
                              (taskItem.priority as WorkTaskDetail["priority"]) ||
                              "MEDIUM",
                            startDate: taskItem.startDate,
                            endDate: taskItem.endDate || getTodayDateString(),
                            description: taskItem.note || "",
                            isDirty: false,
                          };

                          (taskItem.supplyLines || []).forEach((s, sIdx) => {
                            const qtyVal =
                              s.quantityActualTotal ?? s.quantity ?? 0;
                            newAllocations.push({
                              id: Date.now() + tIdx * 100 + sIdx,
                              stageId: taskName,
                              materialType: "Kế hoạch",
                              materialName:
                                s.supplyItemName ||
                                s.supplyItem?.name ||
                                s.name ||
                                `Vật tư #${s.id}`,
                              quantity: String(qtyVal),
                              actualQuantity: String(qtyVal),
                              unit:
                                s.unitBase?.name || s.unit || s.unitName || "",
                              supplyItemId: s.supplyItem?.id || s.supplyItemId,
                              unitBaseId: s.unitBase?.id || s.unitBaseId,
                              isPlanned: true,
                            });
                          });
                        });
                      } else if (
                        targetStage?.workItems &&
                        targetStage.workItems.length > 0
                      ) {
                        targetStage.workItems.forEach((wi) => {
                          const wiName = wi.name;
                          newTaskNames.push(wiName);
                          newTaskDetails[wiName] = {
                            id: String(wi.id),
                            stageName: wiName,
                            progress: 100,
                            priority: "MEDIUM",
                            startDate: getTodayDateString(),
                            endDate: getTodayDateString(),
                            description: wi.description || "",
                            isDirty: false,
                          };
                        });
                      } else if (targetStage) {
                        const stageName = targetStage.name;
                        newTaskNames.push(stageName);
                        newTaskDetails[stageName] = {
                          id: String(targetStage.id),
                          stageName: stageName,
                          progress: 100,
                          priority: "MEDIUM",
                          startDate: getTodayDateString(),
                          endDate: getTodayDateString(),
                          description: targetStage.description || "",
                          isDirty: false,
                        };
                      }

                      setWorkTaskDetails(newTaskDetails);
                      setInitialTaskDetails(newTaskDetails);
                      setPlannedStages(newTaskNames);
                      setFormData((prev) => ({
                        ...prev,
                        workType: resolveWorkType(
                          selectedPlan?.purpose,
                          targetStage?.name ?? newTaskNames[0] ?? "",
                        ),
                        selectedStages: newTaskNames,
                        materialAllocations: newAllocations,
                      }));
                    }}
                    placeholder="Chọn hạng mục dự kiến..."
                    searchPlaceholder="Tìm hạng mục dự kiến..."
                    emptyText="Không tìm thấy hạng mục dự kiến."
                    disabled={
                      !allowModeToggle ||
                      !formData.regimenId ||
                      !selectedPlanId ||
                      stageOptions.length === 0
                    }
                  />
                  {errors.stageId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.stageId}
                    </p>
                  )}
                </div>
              </div>

              {/* Card chi tiết thông tin công việc dự kiến đã chọn */}
              {selectedTask && <PlannedTaskDetailCard task={selectedTask} />}

              {/* Người ghi nhận nhật ký (submittedByPersonnelId) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <Label required>Người ghi nhận nhật ký</Label>
                  <span className="text-[11px] text-slate-500">
                    (Bắt buộc khi công việc có người thực hiện)
                  </span>
                </div>
                <RemoteAutoCompleteSelect
                  onSearch={() => {}}
                  options={personnelOptions}
                  value={
                    formData.submittedByPersonnelId
                      ? String(formData.submittedByPersonnelId)
                      : defaultPersonnelId
                        ? String(defaultPersonnelId)
                        : ""
                  }
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      submittedByPersonnelId: val ? Number(val) : null,
                    }));
                    if (errors.submittedByPersonnelId) {
                      setErrors((prev) => ({
                        ...prev,
                        submittedByPersonnelId: "",
                      }));
                    }
                  }}
                  placeholder="Chọn người ghi nhận nhật ký..."
                  searchPlaceholder="Tìm người ghi nhận..."
                  emptyText="Không tìm thấy nhân sự phù hợp."
                />
                {errors.submittedByPersonnelId && (
                  <p className="text-xs font-medium text-red-500 mt-1">
                    {errors.submittedByPersonnelId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. Chọn Loại công việc */}
          <div className="space-y-3 pt-2">
            <Label required>Loại công việc</Label>
            <div className="grid gap-2.5 max-sm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {WORK_TYPE_OPTIONS.map((option) => {
                const isActive = formData.workType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isPlannedMode}
                    onClick={() => {
                      if (isPlannedMode) return;
                      setFormData((prev) => ({
                        ...prev,
                        workType: option.value,
                      }));
                      if (errors.workType) {
                        setErrors((prev) => ({ ...prev, workType: "" }));
                      }
                    }}
                    className={`rounded-xl border-2 px-2 py-3 transition-all flex flex-col items-center text-center gap-1.5 group ${
                      isPlannedMode ? "cursor-not-allowed" : "cursor-pointer"
                    } ${
                      isActive
                        ? option.activeClass
                        : isPlannedMode
                          ? "border-slate-100 bg-slate-50/50 opacity-50 text-slate-400"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-600"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isActive
                          ? option.iconClass
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.workType && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.workType}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
