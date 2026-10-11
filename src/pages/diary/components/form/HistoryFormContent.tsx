import { useMobileUiMode } from "@/shared/hooks/useMobileUiMode";
import PageWrapper from "@/components/PageWrapper";
import {
  createDailyDiaryEntrySchema,
  useCreateFarmDailyDiaryEntry,
  useFarmDailyDiaryEntryDetail,
  useUpdateFarmDailyDiaryEntry,
  type DailyDiaryLineRequest,
  type HarvestItemRequest,
  type PhotoRequest,
  type SupplyUsageRequest,
} from "@/features/farm-daily-diary";
import {
  createPlanTaskDiaryEntrySchema,
  useCreateFarmPlanTaskDiaryEntry,
  type PlanTaskDiaryLineRequest,
} from "@/features/farm-plan-task-diary";
import type { DomainCode, SupplyType } from "@/features/farm-supply/types";
import { useFarmTaskById, useFarmTasks } from "@/features/farm-task/hooks";
import { useFarmPlans, useFarmWorkflows } from "@/features/farm-workflow/hooks";
import type { FarmWorkflowScopeResponse } from "@/features/farm-workflow/types/farm-workflow.type";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Button,
  StepperForm,
  type Step,
  useIsMobile,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { WORK_TYPE_OPTIONS } from "@/pages/diary/constants/history-form.constants";
import { historyFormSchema } from "@/pages/diary/schemas/historyFormSchema";
import type {
  HarvestDetail,
  HistoryFormContentProps,
  HistoryFormData,
  MaterialAllocation,
} from "@/pages/diary/types/history-form.types";
import {
  createHarvestDetail,
  extractCropSubjectVariants,
  formatDateTimeForApi,
  getTodayDateString,
  isEndDateBeforeStartDate,
  mapWorkTypeToPurpose,
  mapWorkflowScopeToHarvestOption,
  resolveWorkType,
  toCultivationZoneOptions,
  uploadPhotosInParallel,
} from "@/pages/diary/utils/history-form.utils";
import { useCropSupplyCatalog } from "@/pages/plan-growth/hooks/useCropSupplyCatalog";
import { getSupplyTypeOptions } from "@/shared/hooks/useRemoteSupplySearch";
import type { WorkTaskDetail } from "@/pages/diary/components/form/WorkAllocationCard";
import { DiarySuccessDialog } from "@/pages/diary/components/dialogs/DiarySuccessDialog";
import { Step1ContextAndWorkType } from "@/pages/diary/components/form/steps/Step1ContextAndWorkType";
import { Step2ExecutionAndMaterials } from "@/pages/diary/components/form/steps/Step2ExecutionAndMaterials";
import { Step3OverviewAndConfirm } from "@/pages/diary/components/form/steps/Step3OverviewAndConfirm";
import { useLocation } from "wouter";
import { getApiErrorMessage } from "@/shared/lib/api-error";

export function HistoryFormContent({
  isPlannedModeDefault = false,
  allowModeToggle = true,
  initialTaskId = "",
  initialPlanId = "",
  initialWorkflowId = "",
  pageTitle = "Ghi nhận nhật ký nông hộ",
  backUrl = "/diary/daily-history",
  onReset,
}: HistoryFormContentProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const createDailyDiaryMutation = useCreateFarmDailyDiaryEntry();
  const updateDailyDiaryMutation = useUpdateFarmDailyDiaryEntry();
  const createPlanTaskDiaryMutation = useCreateFarmPlanTaskDiaryEntry();
  const queryClient = useQueryClient();
  const [stepperKey, setStepperKey] = useState(0);

  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get("editId") || "";
  const urlWorkflowId = searchParams.get("workflowId") || "";

  const { data: dailyDiaryDetail } = useFarmDailyDiaryEntryDetail(
    editId,
    Boolean(editId),
  );

  const [formData, setFormData] = useState<HistoryFormData>({
    regimenId: initialWorkflowId || urlWorkflowId,
    workType: "",
    warning: false,
    harvestScope: "region",
    harvestTargets: [],
    harvestDetails: [],
    harvestFiles: [],
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    completionPercentage: 60,
    description: "",
    images: [],
    selectedStages: [],
    materialAllocations: [],
    submittedByPersonnelId: null,
  });
  const [existingPhotos, setExistingPhotos] = useState<PhotoRequest[]>([]);

  const isPlannedMode = isPlannedModeDefault;
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [workTaskDetails, setWorkTaskDetails] = useState<
    Record<string, WorkTaskDetail>
  >({});
  const [initialTaskDetails, setInitialTaskDetails] = useState<
    Record<string, WorkTaskDetail>
  >({});
  const initialTaskDetailsRef = useRef<Record<string, WorkTaskDetail>>({});
  const initialAllocationsRef = useRef<MaterialAllocation[]>([]);

  const [workflowSearchQuery, setWorkflowSearchQuery] = useState("");
  const debouncedWorkflowSearch = useDebounce(workflowSearchQuery, 300);

  // Load workflows from API with search keyword
  const workflowsQuery = useFarmWorkflows({
    params: {
      page: 0,
      size: 100,
      keyword: debouncedWorkflowSearch.trim() || undefined,
    },
  });
  const workflows = workflowsQuery.items || [];

  const workspacePersonnelQuery = useFarmPersonnel({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const workspacePersonnel = workspacePersonnelQuery.items || [];

  const selectedWorkflow = useMemo(
    () =>
      workflows.find(
        (workflow) =>
          String(workflow.id) ===
          (dailyDiaryDetail?.workflowId
            ? String(dailyDiaryDetail.workflowId)
            : formData.regimenId),
      ),
    [formData.regimenId, workflows, dailyDiaryDetail?.workflowId],
  );

  const workflowDomainCode = (selectedWorkflow?.domainCode ??
    "CROP") as DomainCode;

  const supplyCatalog = useCropSupplyCatalog(workflowDomainCode);

  const supplyMap = useMemo(() => {
    const map = new Map<
      number,
      { name: string; type: SupplyType; typeLabel: string; unit: string }
    >();
    const typeOptions = getSupplyTypeOptions(workflowDomainCode);

    (Object.keys(supplyCatalog.optionsByType) as SupplyType[]).forEach(
      (type) => {
        const typeOpt = typeOptions.find((t) => t.value === type);
        const options = supplyCatalog.optionsByType[type] || [];
        options.forEach((opt) => {
          if (opt.item?.id) {
            map.set(opt.item.id, {
              name: opt.item.name,
              type,
              typeLabel: typeOpt?.label || "Vật tư khác",
              unit: opt.unit || "kg",
            });
          }
        });
      },
    );
    return map;
  }, [supplyCatalog.optionsByType, workflowDomainCode]);

  const initializedEditIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!editId || !dailyDiaryDetail) return;
    if (initializedEditIdRef.current === editId) return;
    initializedEditIdRef.current = editId;

    const detail = dailyDiaryDetail;

    const workType = resolveWorkType(detail.purpose);

    const newTaskDetails: Record<string, WorkTaskDetail> = {};
    const newAllocations: MaterialAllocation[] = [];

    (detail.lines || []).forEach((line, idx) => {
      newTaskDetails[line.name] = {
        id: line.name,
        stageName: line.name,
        progress: 100,
        priority: (line.priority as WorkTaskDetail["priority"]) || "MEDIUM",
        startDate: line.startDate,
        endDate: line.endDate,
        description: line.description || "",
        isDirty: false,
      };

      (line.supplies || []).forEach((s, sIdx) => {
        const catalogItem = supplyMap.get(s.supplyItemId);
        newAllocations.push({
          id: Date.now() + idx * 100 + sIdx,
          stageId: line.name,
          materialType: catalogItem?.typeLabel || "Vật tư khác",
          materialName:
            s.supplyItemName ||
            catalogItem?.name ||
            s.supplyItem?.name ||
            s.name ||
            `Vật tư #${s.supplyItemId}`,
          quantity: String(s.quantityActual ?? 0),
          actualQuantity: String(s.quantityActual ?? 0),
          unit: catalogItem?.unit || s.unit || "kg",
          supplyItemId: s.supplyItemId,
          unitBaseId: s.unitBaseId,
          isPlanned: false,
        });
      });
    });

    const hasCropHarvest = (detail.harvestItems || []).some(
      (h) =>
        h.targetType === "ZONE_SUBJECT_VARIANT" ||
        Boolean(h.targetType?.includes("VARIANT")) ||
        Boolean(h.targetType?.includes("SUBJECT")),
    );
    const harvestScope: "region" | "crop" = hasCropHarvest ? "crop" : "region";

    const newHarvestDetails: HarvestDetail[] = (detail.harvestItems || []).map(
      (h) => {
        const isCrop =
          h.targetType === "ZONE_SUBJECT_VARIANT" ||
          Boolean(h.targetType?.includes("VARIANT")) ||
          Boolean(h.targetType?.includes("SUBJECT"));
        return {
          id: `h-${isCrop ? "variant" : "zone"}-${h.targetId}`,
          targetId: String(h.targetId),
          targetLabel:
            h.targetName || h.productionSubjectName || `Vị trí #${h.targetId}`,
          codeName:
            h.targetCode || h.productionSubjectCode || `Vị trí #${h.targetId}`,
          quantity: String(h.quantity ?? ""),
          unitBase: "kg",
        };
      },
    );

    setWorkTaskDetails(newTaskDetails);

    if (detail.photos && Array.isArray(detail.photos)) {
      const loadedPhotos: PhotoRequest[] = detail.photos.map((p) => ({
        objectKey: p.objectKey,
        fileUrl: p.fileUrl,
        fileName: p.fileName || "Ảnh đã tải lên",
        mimeType: p.mimeType,
        sizeBytes: p.sizeBytes,
        thumbnail: p.thumbnail,
      }));
      setExistingPhotos(loadedPhotos);
    }

    setFormData((prev) => ({
      ...prev,
      regimenId: String(detail.workflowId ?? prev.regimenId),
      workType,
      warning: Boolean(detail.warning),
      harvestScope,
      harvestTargets: newHarvestDetails.map((d) => String(d.targetId)),
      description: detail.description || "",
      startDate: detail.lines?.[0]?.startDate || prev.startDate,
      endDate: detail.lines?.[0]?.endDate || prev.endDate,
      selectedStages: Object.keys(newTaskDetails),
      materialAllocations: newAllocations,
      harvestDetails: newHarvestDetails,
    }));
  }, [editId, dailyDiaryDetail, supplyMap]);

  useEffect(() => {
    if (supplyMap.size === 0) return;
    setFormData((prev) => {
      let changed = false;
      const updatedAllocations = prev.materialAllocations.map((alloc) => {
        if (alloc.supplyItemId && supplyMap.has(alloc.supplyItemId)) {
          const item = supplyMap.get(alloc.supplyItemId)!;
          if (
            alloc.materialName.startsWith("Vật tư #") ||
            alloc.materialType === "Thực tế"
          ) {
            changed = true;
            return {
              ...alloc,
              materialName: item.name,
              materialType: item.typeLabel,
              unit: alloc.unit || item.unit,
            };
          }
        }
        return alloc;
      });
      if (!changed) return prev;
      return { ...prev, materialAllocations: updatedAllocations };
    });
  }, [supplyMap]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadCacheRef = useRef<Map<string, PhotoRequest>>(new Map());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const isTouch =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isSmallOrTablet = window.innerWidth <= 1024;
    return Boolean(isTouch || isSmallOrTablet);
  });

  useEffect(() => {
    const handleResize = () => {
      const isTouch =
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const isSmallOrTablet = window.innerWidth <= 1024;
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobileOrTablet(
        Boolean(isMobile || isSmallOrTablet || isTouch || isMobileUA),
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleUpdateWorkTaskDetail = (
    stageName: string,
    updates: Partial<WorkTaskDetail>,
  ) => {
    setWorkTaskDetails((prev) => {
      const defaultStart = formData.startDate || getTodayDateString();
      const defaultEnd = formData.endDate || getTodayDateString();
      const existing = prev[stageName] || {
        id: stageName,
        stageName,
        progress: 100,
        priority: "MEDIUM",
        startDate: defaultStart,
        endDate: defaultEnd,
        description: "",
      };
      return {
        ...prev,
        [stageName]: {
          ...existing,
          ...updates,
          startDate: updates.startDate ?? existing.startDate ?? defaultStart,
          endDate: updates.endDate ?? existing.endDate ?? defaultEnd,
          isDirty: true,
        },
      };
    });

    setErrors((prev) => {
      const stageStartKey = `stage_${stageName}_startDate`;
      const stageEndKey = `stage_${stageName}_endDate`;
      if (!prev[stageStartKey] && !prev[stageEndKey]) return prev;
      const next = { ...prev };
      if (updates.startDate && updates.startDate.trim() !== "") {
        delete next[stageStartKey];
      }
      if (updates.endDate && updates.endDate.trim() !== "") {
        delete next[stageEndKey];
      }
      return next;
    });
  };
  const [isDragging, setIsDragging] = useState(false);
  const { items: apiCultivationZones } = useCultivationZones({
    params: { size: 100, includeDetails: true },
  });
  const regionOptions = useMemo(() => {
    return toCultivationZoneOptions(apiCultivationZones);
  }, [apiCultivationZones]);

  const cropSubjectVariants = useMemo(() => {
    return extractCropSubjectVariants(apiCultivationZones);
  }, [apiCultivationZones]);

  function getGeographicalTargetId(sel: GeographicalSelection): string {
    if (sel.type === "plot" && sel.plotId) return String(sel.plotId);
    if (sel.type === "area" && sel.areaId) return String(sel.areaId);
    if (sel.type === "region" && sel.regionId) return String(sel.regionId);
    if (sel.plotId) return String(sel.plotId);
    if (sel.areaId) return String(sel.areaId);
    if (sel.regionId) return String(sel.regionId);
    return String(sel.id);
  }

  const existingGeoSelections = useMemo<GeographicalSelection[]>(() => {
    if (formData.harvestScope !== "region") return [];
    return formData.harvestDetails.map((detail) => {
      const parts = detail.codeName ? detail.codeName.split(" › ") : [];
      const type: "region" | "area" | "plot" =
        parts.length >= 3 ? "plot" : parts.length === 2 ? "area" : "region";
      const targetIdStr = String(detail.targetId);

      return {
        id: targetIdStr,
        type,
        regionId: targetIdStr,
        areaId: type === "area" || type === "plot" ? targetIdStr : undefined,
        plotId: type === "plot" ? targetIdStr : undefined,
        name: detail.targetLabel,
        regionName: parts[0] ?? detail.targetLabel,
        areaName: parts[1],
      };
    });
  }, [formData.harvestDetails, formData.harvestScope]);

  const handleConfirmGeoSelections = (
    newSelections: GeographicalSelection[],
  ) => {
    const currentMap = new Map(
      formData.harvestDetails.map((d) => [d.targetId, d]),
    );

    const nextTargets: string[] = [];
    const nextDetails = newSelections.map((sel) => {
      const targetId = getGeographicalTargetId(sel);
      nextTargets.push(targetId);

      const existing = currentMap.get(targetId) || currentMap.get(sel.id);
      const label =
        sel.name || sel.areaName || sel.regionName || "Vị trí địa lý";
      const codeName =
        [sel.regionName, sel.areaName, sel.name].filter(Boolean).join(" › ") ||
        label;

      if (existing) {
        return {
          ...existing,
          targetId,
          targetLabel: label,
          codeName,
        };
      }
      return {
        id: `h-geo-${targetId}`,
        targetId,
        targetLabel: label,
        codeName,
        quantity: "",
        unitBase: "kg",
      };
    });

    setFormData((prev) => ({
      ...prev,
      harvestTargets: nextTargets,
      harvestDetails: nextDetails,
    }));
  };

  const [, setPlanSearchQuery] = useState("");
  const [plannedStages, setPlannedStages] = useState<string[]>([]);

  // Load plans for selected workflow
  const plansQuery = useFarmPlans({
    params: {
      page: 0,
      size: 100,
      workflowId: formData.regimenId ? Number(formData.regimenId) : undefined,
    },
    enabled: Boolean(formData.regimenId),
  });
  const availablePlans = plansQuery.items || [];

  // Load tasks for selected plan
  const tasksQuery = useFarmTasks({
    params: {
      page: 0,
      size: 100,
      planId: selectedPlanId ? selectedPlanId : undefined,
    },
    enabled: Boolean(selectedPlanId),
  });
  const availableTasks = tasksQuery.items || [];

  // Fetch initial task detail if initialTaskId is passed
  const { item: initialTaskData } = useFarmTaskById(initialTaskId || "", {
    enabled: Boolean(initialTaskId),
  });

  // Handle initialization when initialTaskData is loaded from API
  useEffect(() => {
    if (!initialTaskData) return;
    const taskItem = initialTaskData;

    setSelectedTaskId(String(taskItem.id));
    if (taskItem.stage?.id) {
      setSelectedStageId(String(taskItem.stage.id));
    }
    if (taskItem.plan?.id) {
      setSelectedPlanId(String(taskItem.plan.id));
    }
    if (taskItem.workflow?.id) {
      setFormData((prev) => ({
        ...prev,
        regimenId: String(taskItem.workflow.id),
      }));
    }

    const plannedAllocations: MaterialAllocation[] = (
      taskItem.supplyLines || []
    ).map((s, idx) => {
      const qtyVal = s.quantityActualTotal ?? s.quantity ?? 0;
      return {
        id: Date.now() + idx,
        stageId: taskItem.name,
        materialType: "Kế hoạch",
        materialName:
          s.supplyItemName || s.supplyItem?.name || s.name || `Vật tư #${s.id}`,
        quantity: String(qtyVal),
        actualQuantity: String(qtyVal),
        unit: s.unitBase?.name || s.unit || s.unitName || "",
        supplyItemId: s.supplyItem?.id || s.supplyItemId,
        unitBaseId: s.unitBase?.id || s.unitBaseId,
        isPlanned: true,
      };
    });

    const resolvedWorkType = resolveWorkType(
      taskItem.plan?.purpose,
      taskItem.name,
      taskItem.taskCategory?.code,
    );

    const initialProgress =
      typeof taskItem.progressPercent === "number"
        ? taskItem.progressPercent
        : taskItem.status === "DONE"
          ? 100
          : 0;

    const defaultTaskDetails: Record<string, WorkTaskDetail> = {
      [taskItem.name]: {
        id: taskItem.name,
        stageName: taskItem.name,
        progress: initialProgress,
        priority: (taskItem.priority as WorkTaskDetail["priority"]) || "MEDIUM",
        startDate: taskItem.startDate,
        endDate: taskItem.endDate,
        description: taskItem.note || "",
        isDirty: false,
        taskId: taskItem.id,
      },
    };
    setWorkTaskDetails(defaultTaskDetails);
    setInitialTaskDetails(defaultTaskDetails);
    initialTaskDetailsRef.current = JSON.parse(
      JSON.stringify(defaultTaskDetails),
    );
    initialAllocationsRef.current = JSON.parse(
      JSON.stringify(plannedAllocations),
    );

    const taskExecutors =
      taskItem.personnel?.filter((p) => p.role === "EXECUTOR") || [];
    const initialPersonnelId =
      taskExecutors[0]?.id || taskItem.personnel?.[0]?.id;

    setPlannedStages([taskItem.name]);
    setFormData((prev) => ({
      ...prev,
      workType: resolvedWorkType,
      startDate: taskItem.startDate,
      endDate: taskItem.endDate || getTodayDateString(),
      completionPercentage: initialProgress,
      selectedStages: [taskItem.name],
      materialAllocations: plannedAllocations,
      submittedByPersonnelId:
        prev.submittedByPersonnelId ?? initialPersonnelId ?? null,
    }));
  }, [initialTaskData]);

  const workflowOptions = useMemo(
    () =>
      workflows.map((w) => ({
        label: w.code ? `${w.code} - ${w.name}` : w.name,
        value: String(w.id),
        keywords: [w.code, w.name].filter(Boolean) as string[],
      })),
    [workflows],
  );

  const planOptions = useMemo(
    () =>
      availablePlans.map((p) => ({
        label: p.code ? `${p.code} - ${p.name}` : p.name,
        value: String(p.id),
        keywords: [p.code, p.name].filter(Boolean) as string[],
      })),
    [availablePlans],
  );

  const selectedPlan = useMemo(
    () => availablePlans.find((p) => String(p.id) === String(selectedPlanId)),
    [availablePlans, selectedPlanId],
  );

  const stageOptions = useMemo(
    () =>
      (selectedPlan?.stages || []).map((s) => ({
        label: s.code ? `${s.code} - ${s.name}` : s.name,
        value: String(s.id),
        keywords: [s.code, s.name].filter(Boolean) as string[],
      })),
    [selectedPlan],
  );

  const selectedTask = useMemo(
    () => availableTasks.find((t) => String(t.id) === String(selectedTaskId)),
    [availableTasks, selectedTaskId],
  );

  const availablePersonnelOptions = useMemo(() => {
    const map = new Map<
      number,
      { id: number; fullName: string; role?: string }
    >();

    // 1. Current selected/initial task personnel
    const currentTask = selectedTask || initialTaskData;
    if (currentTask?.personnel) {
      currentTask.personnel.forEach((p) => {
        if (p.id) {
          map.set(p.id, {
            id: p.id,
            fullName: p.fullName || `Nhân sự #${p.id}`,
            role: p.role,
          });
        }
      });
    }

    // 2. All available tasks in current plan
    availableTasks.forEach((t) => {
      (t.personnel || []).forEach((p) => {
        if (p.id && !map.has(p.id)) {
          map.set(p.id, {
            id: p.id,
            fullName: p.fullName || `Nhân sự #${p.id}`,
            role: p.role,
          });
        }
      });
    });

    // 3. Plan personnel
    if (selectedPlan?.personnel) {
      selectedPlan.personnel.forEach((p) => {
        if (p.id && !map.has(p.id)) {
          map.set(p.id, {
            id: p.id,
            fullName: p.fullName || `Nhân sự #${p.id}`,
            role: p.role,
          });
        }
      });
    }

    // 4. Workspace personnel
    workspacePersonnel.forEach((p) => {
      if (p.id && !map.has(p.id)) {
        map.set(p.id, {
          id: p.id,
          fullName: p.fullName || `Nhân sự #${p.id}`,
        });
      }
    });

    return Array.from(map.values()).map((p) => {
      const roleLabel =
        p.role === "EXECUTOR"
          ? "Người thực hiện"
          : p.role === "MANAGER"
            ? "Quản lý"
            : p.role === "QUALITY_INSPECTOR"
              ? "Kiểm định"
              : undefined;
      return {
        value: String(p.id),
        label: roleLabel ? `${p.fullName} (${roleLabel})` : p.fullName,
      };
    });
  }, [
    selectedTask,
    initialTaskData,
    availableTasks,
    selectedPlan,
    workspacePersonnel,
  ]);

  // Default personnel resolution: priority EXECUTOR -> any task personnel -> plan personnel -> workspace personnel
  const defaultPersonnelId = useMemo(() => {
    const currentTask = selectedTask || initialTaskData;
    // 1. Task EXECUTOR
    const taskExecutor = currentTask?.personnel?.find(
      (p) => p.role === "EXECUTOR",
    );
    if (taskExecutor?.id) return taskExecutor.id;

    // 2. Any task executor in availableTasks
    const anyExecutor = availableTasks
      .flatMap((t) => t.personnel || [])
      .find((p) => p.role === "EXECUTOR");
    if (anyExecutor?.id) return anyExecutor.id;

    // 3. Any task personnel
    if (currentTask?.personnel?.[0]?.id) return currentTask.personnel[0].id;

    // 4. Any task personnel in availableTasks
    const anyTaskPersonnel = availableTasks.flatMap(
      (t) => t.personnel || [],
    )[0];
    if (anyTaskPersonnel?.id) return anyTaskPersonnel.id;

    // 5. Plan personnel
    if (selectedPlan?.personnel?.[0]?.id) return selectedPlan.personnel[0].id;

    // 6. Workspace personnel
    if (workspacePersonnel[0]?.id) return workspacePersonnel[0].id;

    return undefined;
  }, [
    selectedTask,
    initialTaskData,
    availableTasks,
    selectedPlan,
    workspacePersonnel,
  ]);

  const submittedByPersonnelName = useMemo(() => {
    const currentPersonnelId =
      formData.submittedByPersonnelId || defaultPersonnelId;
    if (!currentPersonnelId) return undefined;
    const opt = availablePersonnelOptions.find(
      (o) => o.value === String(currentPersonnelId),
    );
    return opt?.label;
  }, [
    formData.submittedByPersonnelId,
    defaultPersonnelId,
    availablePersonnelOptions,
  ]);

  const previousPercentage = useMemo(() => {
    const stages = formData.selectedStages;
    if (stages.length === 0) return 0;
    const sum = stages.reduce((acc, stage) => {
      const initDetail = initialTaskDetails[stage];
      const initP =
        typeof initDetail?.progress === "number" ? initDetail.progress : 0;
      return acc + initP;
    }, 0);
    return Math.round(sum / stages.length);
  }, [formData.selectedStages, initialTaskDetails]);

  const currentPercentage = useMemo(() => {
    const stages = formData.selectedStages;
    if (stages.length === 0) return 0;
    const sum = stages.reduce((acc, stage) => {
      const detail = workTaskDetails[stage];
      const p = typeof detail?.progress === "number" ? detail.progress : 0;
      return acc + p;
    }, 0);
    return Math.round(sum / stages.length);
  }, [formData.selectedStages, workTaskDetails]);

  const sliderTrackBackground = useMemo(() => {
    const prev = Math.min(100, Math.max(0, previousPercentage));
    const curr = Math.min(100, Math.max(0, currentPercentage));

    if (curr === prev) {
      return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${prev}%, #e2e8f0 ${prev}%, #e2e8f0 100%)`;
    }

    if (curr < prev) {
      return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${curr}%, #ef4444 ${curr}%, #ef4444 ${prev}%, #e2e8f0 ${prev}%, #e2e8f0 100%)`;
    }

    return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${prev}%, #22c55e ${prev}%, #22c55e ${curr}%, #e2e8f0 ${curr}%, #e2e8f0 100%)`;
  }, [previousPercentage, currentPercentage]);

  const harvestTargetOptions = useMemo(() => {
    const scopes = (selectedWorkflow?.scopes ||
      []) as FarmWorkflowScopeResponse[];
    return scopes.map(mapWorkflowScopeToHarvestOption).filter(Boolean) as {
      label: string;
      value: string;
      keywords?: string[];
    }[];
  }, [selectedWorkflow]);

  const syncHarvestDetails = (nextTargets: string[]) => {
    const optionByValue = new Map(
      harvestTargetOptions.map((option) => [option.value, option]),
    );

    setFormData((prev) => {
      const current = new Map(
        prev.harvestDetails.map((item) => [item.targetId, item]),
      );
      const nextDetails = nextTargets.map((targetId) => {
        const existing = current.get(targetId);
        const option = optionByValue.get(targetId);
        if (existing) {
          return {
            ...existing,
            targetLabel: option?.label || existing.targetLabel,
            codeName:
              existing.codeName || option?.label || existing.targetLabel,
          };
        }
        return createHarvestDetail(targetId, option?.label || targetId);
      });

      return {
        ...prev,
        harvestTargets: nextTargets,
        harvestDetails: nextDetails,
      };
    });
  };

  const addStage = (stageName?: string, categoryId?: number) => {
    const nameToAdd = (stageName || "").trim();
    if (!nameToAdd) return;
    if (formData.selectedStages.includes(nameToAdd)) {
      toast({
        title: "Trùng lặp",
        description: "Hạng mục này đã có trong danh sách.",
        variant: "destructive",
      });
      return;
    }
    const defaultStart = formData.startDate || getTodayDateString();
    const defaultEnd = formData.endDate || getTodayDateString();

    setFormData((prev) => ({
      ...prev,
      selectedStages: [...prev.selectedStages, nameToAdd],
    }));

    setWorkTaskDetails((prev) => ({
      ...prev,
      [nameToAdd]: {
        id: nameToAdd,
        stageName: nameToAdd,
        progress: 100,
        priority: "MEDIUM",
        startDate: defaultStart,
        endDate: defaultEnd,
        description: "",
        isNewStage: true,
        isDirty: true,
        taskId: categoryId,
        taskCategoryId: categoryId,
      },
    }));
  };

  const removeStage = (stage: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.filter((s) => s !== stage),
      materialAllocations: prev.materialAllocations.filter(
        (m) => m.stageId !== stage,
      ),
    }));
    setWorkTaskDetails((prev) => {
      const next = { ...prev };
      delete next[stage];
      return next;
    });
  };

  const handleAddMaterial = (item: Omit<MaterialAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: [
        ...prev.materialAllocations,
        {
          ...item,
          id: Date.now() + Math.floor(Math.random() * 1000),
          actualQuantity: item.quantity,
        },
      ],
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateActualQuantity = (id: number, val: string) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.map((m) =>
        m.id === id ? { ...m, actualQuantity: val } : m,
      ),
    }));
    setErrors((prev) => {
      if (!prev[`alloc_${id}`]) return prev;
      const next = { ...prev };
      delete next[`alloc_${id}`];
      return next;
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinueLogging = () => {
    setShowSuccessDialog(false);
    setSelectedTaskId(initialTaskId || "");
    if (!isPlannedMode) {
      setSelectedPlanId("");
    } else {
      setSelectedPlanId(initialPlanId || "");
    }
    setSelectedStageId("");
    setPlannedStages([]);
    setWorkTaskDetails({});
    setInitialTaskDetails({});
    initialTaskDetailsRef.current = {};
    initialAllocationsRef.current = [];
    setExistingPhotos([]);
    uploadCacheRef.current.clear();
    setErrors({});
    setFormData({
      regimenId: initialWorkflowId || urlWorkflowId || "",
      workType: "",
      warning: false,
      harvestScope: "region",
      harvestTargets: [],
      harvestDetails: [],
      harvestFiles: [],
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
      completionPercentage: 60,
      description: "",
      images: [],
      selectedStages: [],
      materialAllocations: [],
      submittedByPersonnelId: null,
    });

    // Invalidate và refetch các API để cập nhật dữ liệu mới nhất
    void queryClient.invalidateQueries({ queryKey: ["farm-tasks"] });
    void queryClient.invalidateQueries({ queryKey: ["farm-plans"] });
    void queryClient.invalidateQueries({ queryKey: ["farm-workflows"] });
    void queryClient.invalidateQueries({ queryKey: ["cultivation-zones"] });
    void queryClient.invalidateQueries({ queryKey: ["farm-personnel"] });
    void queryClient.invalidateQueries({ queryKey: ["farm-plan-task-diary"] });
    void queryClient.invalidateQueries({ queryKey: ["farm-daily-diary"] });

    void workflowsQuery.refetch?.();
    void plansQuery.refetch?.();
    void tasksQuery.refetch?.();
    void workspacePersonnelQuery.refetch?.();

    // Chuyển stepper về step đầu tiên
    setStepperKey((prev) => prev + 1);

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast({
      title: "Sẵn sàng ghi tiếp",
      description:
        "Đã làm mới dữ liệu và đưa biểu mẫu về bước đầu tiên để tiếp tục ghi nhật ký.",
    });
  };

  const handleViewList = () => {
    setShowSuccessDialog(false);
    if (isPlannedMode) {
      setLocation(backUrl);
    } else {
      setLocation("/diary/daily-history");
    }
  };

  const handleSubmitForm = async () => {
    setErrors({});

    const formValidationResult = historyFormSchema.safeParse({
      regimenId: formData.regimenId,
      workType: isPlannedMode
        ? formData.workType || "cultivation"
        : formData.workType,
      startDate: formData.startDate,
      isPlannedMode,
      planId: selectedPlanId,
      taskId: selectedTaskId,
    });

    const formattedErrors: Record<string, string> = {};

    if (!formValidationResult.success) {
      formValidationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[String(issue.path[0])] = issue.message;
        }
      });
    }

    // Validate selectedStages and date fields inside workTaskDetails
    formData.selectedStages.forEach((stage) => {
      const isPlannedStage = isPlannedMode && plannedStages.includes(stage);
      const detail = workTaskDetails[stage] || {
        startDate: isPlannedStage ? formData.startDate : "",
        endDate: formData.endDate,
      };

      const startDateVal =
        detail.startDate || (isPlannedStage ? formData.startDate : "");
      const endDateVal = detail.endDate || "";

      if (!isPlannedStage && !startDateVal) {
        formattedErrors[`stage_${stage}_startDate`] =
          "Vui lòng chọn ngày bắt đầu.";
      }
      if (!endDateVal) {
        formattedErrors[`stage_${stage}_endDate`] =
          "Vui lòng chọn thời gian kết thúc.";
      }
      if (
        startDateVal &&
        endDateVal &&
        isEndDateBeforeStartDate(startDateVal, endDateVal)
      ) {
        formattedErrors[`stage_${stage}_endDate`] =
          "Thời gian kết thúc không thể trước ngày bắt đầu.";
      }
    });

    // Validate material allocations ONLY if materials were chosen/added
    if (formData.materialAllocations.length > 0) {
      formData.materialAllocations.forEach((alloc) => {
        const actualQtyStr = String(
          alloc.actualQuantity ?? alloc.quantity ?? "",
        ).trim();
        const actualQty = Number(actualQtyStr);
        if (actualQtyStr === "" || isNaN(actualQty) || actualQty < 0) {
          formattedErrors[`alloc_${alloc.id}`] =
            "Vui lòng nhập số lượng thực tế hợp lệ (≥ 0).";
        }
      });
    }

    if (Object.keys(formattedErrors).length > 0) {
      setErrors(formattedErrors);

      const firstErrorMsg =
        Object.values(formattedErrors)[0] ||
        "Vui lòng điền đầy đủ các thông tin bắt buộc.";
      toast({
        title: "Thông tin chưa đầy đủ",
        description: firstErrorMsg,
        variant: "destructive",
      });
      return;
    }

    if (isPlannedMode) {
      if (!selectedPlanId || !selectedStageId) {
        toast({
          title: "Thông tin chưa hợp lệ",
          description: "Vui lòng chọn Kế hoạch và Hạng mục dự kiến.",
          variant: "destructive",
        });
        return;
      }

      const planId = Number(selectedPlanId) || 1;
      const stageId = Number(selectedStageId) || 1;

      // Convert harvestDetails into HarvestItemRequest[]
      const harvestItems: HarvestItemRequest[] = formData.harvestDetails
        .map((detail) => {
          const isSubject =
            detail.id.includes("subject") ||
            detail.id.includes("variant") ||
            formData.harvestScope === "crop";
          const rawId = String(detail.targetId).replace(/^[^\d]+/, "");
          const parsedId = parseInt(rawId, 10);
          const targetId = !isNaN(parsedId) && parsedId > 0 ? parsedId : 0;

          return {
            targetType: isSubject
              ? ("ZONE_SUBJECT_VARIANT" as const)
              : ("ZONE" as const),
            targetId,
            quantity: Number(detail.quantity) || 0,
            unitBaseId: 1,
          };
        })
        .filter((h) => h.quantity > 0 && h.targetId > 0);

      const hasHarvestItems = harvestItems.length > 0;

      // Build lines for tasks/items that have been modified or added by user
      const candidateStages =
        formData.selectedStages.length > 0
          ? formData.selectedStages
          : [selectedTask?.name || "Công việc"];

      const activeStages = candidateStages.filter((stName) => {
        const detail = workTaskDetails[stName];
        if (candidateStages.length === 1) return true;
        const isNewStage = !plannedStages.includes(stName);
        const hasMaterialChange = formData.materialAllocations.some(
          (alloc) => alloc.stageId === stName && Boolean(alloc.supplyItemId),
        );
        return Boolean(detail?.isDirty || isNewStage || hasMaterialChange);
      });

      if (
        !hasHarvestItems &&
        candidateStages.length > 1 &&
        activeStages.length === 0
      ) {
        toast({
          title: "Chưa có thay đổi",
          description:
            "Vui lòng cập nhật tiến độ hoặc thông tin cho ít nhất 1 công việc.",
          variant: "destructive",
        });
        return;
      }

      const stagesToMap =
        activeStages.length > 0 ? activeStages : candidateStages;

      const lines: PlanTaskDiaryLineRequest[] = stagesToMap.map((stName) => {
        const detail = workTaskDetails[stName];
        const matchedTask = availableTasks.find(
          (t) => t.name === stName || String(t.id) === detail?.id,
        );
        const rawTaskId =
          matchedTask?.id ??
          (detail?.taskId ? Number(detail.taskId) : undefined) ??
          (Number(detail?.id) || undefined) ??
          (detail?.taskCategoryId
            ? Number(detail.taskCategoryId)
            : undefined) ??
          (selectedTaskId ? Number(selectedTaskId) : undefined);
        const taskId = rawTaskId ? Number(rawTaskId) : undefined;

        const taskExecutors =
          matchedTask?.personnel?.filter((p) => p.role === "EXECUTOR") || [];
        const hasExecutors = taskExecutors.length > 0;

        const taskSupplies: SupplyUsageRequest[] = formData.materialAllocations
          .filter(
            (alloc) => alloc.stageId === stName && Boolean(alloc.supplyItemId),
          )
          .map((alloc) => ({
            supplyItemId: Number(alloc.supplyItemId),
            unitBaseId: Number(alloc.unitBaseId || 1),
            quantityActual: Number(alloc.actualQuantity || alloc.quantity || 0),
          }));

        return {
          taskId,
          description:
            detail?.description ||
            matchedTask?.name ||
            stName ||
            "Cập nhật tiến độ kế hoạch",
          endDate: detail?.endDate || formData.endDate || getTodayDateString(),
          progressPercent: hasExecutors ? undefined : (detail?.progress ?? 100),
          executorProgress: hasExecutors
            ? taskExecutors.map((exec) => ({
                personnelId: exec.id,
                progressPercent: detail?.progress ?? 100,
              }))
            : undefined,
          supplies: taskSupplies.length > 0 ? taskSupplies : undefined,
        };
      });

      // Resolve submittedByPersonnelId per api.json specs:
      // "Chỉ được bỏ trống khi tất cả công việc chưa có EXECUTOR; nếu truyền thì nhân sự phải thuộc workspace hiện tại"
      const resolvedSubmittedByPersonnelId = formData.submittedByPersonnelId
        ? Number(formData.submittedByPersonnelId)
        : (defaultPersonnelId ?? undefined);

      const validationPayload = {
        planId,
        stageId,
        submittedByPersonnelId: resolvedSubmittedByPersonnelId,
        warning: formData.warning,
        description: formData.description,
        photos: [],
        lines,
        harvestItems: harvestItems.length > 0 ? harvestItems : undefined,
      };

      const validationResult =
        createPlanTaskDiaryEntrySchema.safeParse(validationPayload);

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            formattedErrors[String(issue.path[0])] = issue.message;
          }
        });
        setErrors(formattedErrors);

        const firstErrorMsg =
          validationResult.error.issues[0]?.message ||
          "Vui lòng kiểm tra các trường bắt buộc đối với nhật ký kế hoạch.";
        toast({
          title: "Thông tin chưa hợp lệ",
          description: firstErrorMsg,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        // Upload images in parallel with caching to prevent duplicate uploads
        const uploadedPhotos = await uploadPhotosInParallel(
          formData.images || [],
          Number(workspaceId),
          uploadCacheRef.current,
        );
        const combinedPhotos = [...existingPhotos, ...uploadedPhotos];

        const finalPayload = {
          planId,
          stageId,
          submittedByPersonnelId: resolvedSubmittedByPersonnelId,
          warning: formData.warning,
          description: formData.description || null,
          photos: combinedPhotos.length > 0 ? combinedPhotos : undefined,
          lines,
          harvestItems: harvestItems.length > 0 ? harvestItems : undefined,
        };

        await createPlanTaskDiaryMutation.mutateAsync(finalPayload);
        setShowSuccessDialog(true);
      } catch (err: unknown) {
        console.error("Lỗi khi tạo nhật ký kế hoạch:", err);
        const errObj = err as { response?: { data?: { message?: string } } };
        toast({
          title: "Lỗi tạo nhật ký kế hoạch",
          description:
            getApiErrorMessage(errObj) ||
            "Không thể tạo nhật ký theo kế hoạch. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // ─── AD-HOC MODE: CREATE DAILY DIARY ENTRY via API ───────────────────────
    const purpose = mapWorkTypeToPurpose(formData.workType);
    const selectedWorkflow = workflows.find(
      (w) => String(w.id) === String(formData.regimenId),
    );
    const workflowId =
      Number(formData.regimenId) ||
      (selectedWorkflow?.id ? Number(selectedWorkflow.id) : 1);
    const seasonId =
      selectedWorkflow?.seasons && selectedWorkflow.seasons.length > 0
        ? Number(selectedWorkflow.seasons[0].id)
        : workflowId;

    // Convert harvestDetails into HarvestItemRequest[]
    const harvestItems: HarvestItemRequest[] = formData.harvestDetails
      .map((detail) => {
        const isSubject =
          detail.id.includes("subject") ||
          detail.id.includes("variant") ||
          formData.harvestScope === "crop";
        const rawId = String(detail.targetId).replace(/^[^\d]+/, "");
        const parsedId = parseInt(rawId, 10);
        const targetId = !isNaN(parsedId) && parsedId > 0 ? parsedId : 0;

        return {
          targetType: isSubject
            ? ("ZONE_SUBJECT_VARIANT" as const)
            : ("ZONE" as const),
          targetId,
          quantity: Number(detail.quantity) || 0,
          unitBaseId: 1,
        };
      })
      .filter((h) => h.quantity > 0 && h.targetId > 0);

    const hasHarvestItems = harvestItems.length > 0;

    // Convert workTaskDetails into DailyDiaryLineRequest[] based on selectedStages
    const lines: DailyDiaryLineRequest[] = formData.selectedStages
      .map((stName) => workTaskDetails[stName])
      .filter(Boolean)
      .map((task) => {
        const supplies: SupplyUsageRequest[] = formData.materialAllocations
          .filter(
            (alloc) =>
              alloc.stageId === task.stageName && Boolean(alloc.supplyItemId),
          )
          .map((alloc) => ({
            supplyItemId: Number(alloc.supplyItemId),
            unitBaseId: Number(alloc.unitBaseId || 1),
            quantityActual: Number(alloc.actualQuantity || alloc.quantity || 0),
          }));

        // Gắn taskId: Khi là công việc phát sinh chưa có taskId, gắn id của loại công việc
        const rawTaskId =
          task.taskId ??
          task.taskCategoryId ??
          (selectedTaskId ? Number(selectedTaskId) : undefined);
        const resolvedTaskId = rawTaskId ? Number(rawTaskId) : null;

        return {
          taskId: resolvedTaskId,
          taskCategoryId: task.taskCategoryId ?? resolvedTaskId,
          name: task.stageName || "Công việc phát sinh",
          priority: task.priority || "MEDIUM",
          startDate: formatDateTimeForApi(task.startDate || formData.startDate),
          endDate: formatDateTimeForApi(task.endDate || formData.endDate),
          description: task.description || null,
          supplies: supplies.length > 0 ? supplies : undefined,
        };
      });

    // If no workTaskDetails were added, create a default line if workType (except harvest) or dates are present and no harvest items
    if (
      lines.length === 0 &&
      !hasHarvestItems &&
      formData.workType !== "harvest" &&
      (formData.workType || formData.startDate)
    ) {
      const label =
        WORK_TYPE_OPTIONS.find((w) => w.value === formData.workType)?.label ||
        formData.workType ||
        "phát sinh";
      const supplies: SupplyUsageRequest[] = formData.materialAllocations
        .filter((alloc) => Boolean(alloc.supplyItemId))
        .map((alloc) => ({
          supplyItemId: Number(alloc.supplyItemId),
          unitBaseId: Number(alloc.unitBaseId || 1),
          quantityActual: Number(alloc.actualQuantity || alloc.quantity || 0),
        }));

      const fallbackTaskId = selectedTaskId ? Number(selectedTaskId) : null;

      lines.push({
        taskId: fallbackTaskId,
        name: `Công việc ${label}`,
        priority: "MEDIUM",
        startDate: formatDateTimeForApi(formData.startDate),
        endDate: formatDateTimeForApi(formData.endDate),
        description: formData.description || null,
        supplies: supplies.length > 0 ? supplies : undefined,
      });
    }

    const validationPayload = {
      workflowId,
      seasonId,
      purpose,
      warning: formData.warning,
      description: formData.description,
      photos: [],
      lines,
      harvestItems,
    };

    const validationResult =
      createDailyDiaryEntrySchema.safeParse(validationPayload);

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(formattedErrors);

      const firstErrorMsg =
        validationResult.error.issues[0]?.message ||
        "Vui lòng kiểm tra các trường bắt buộc và đảm bảo có ít nhất 1 nội dung nhật ký.";
      toast({
        title: "Thông tin chưa hợp lệ",
        description: firstErrorMsg,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images in parallel with caching to prevent duplicate uploads
      const uploadedPhotos = await uploadPhotosInParallel(
        formData.images || [],
        Number(workspaceId),
        uploadCacheRef.current,
      );
      const combinedPhotos = [...existingPhotos, ...uploadedPhotos];

      // Build payload and submit
      const finalPayload = {
        workflowId,
        seasonId,
        purpose,
        warning: formData.warning,
        description: formData.description || null,
        photos: combinedPhotos.length > 0 ? combinedPhotos : undefined,
        lines: lines.length > 0 ? lines : undefined,
        harvestItems: harvestItems.length > 0 ? harvestItems : undefined,
      };

      if (editId) {
        await updateDailyDiaryMutation.mutateAsync({
          id: editId,
          payload: finalPayload,
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật nhật ký thường nhật!",
        });
        setLocation("/diary/daily-history");
      } else {
        await createDailyDiaryMutation.mutateAsync(finalPayload);
        setShowSuccessDialog(true);
      }
    } catch (err: unknown) {
      console.error("Lỗi khi tạo nhật ký thường nhật:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mobileUiMode = useMobileUiMode();
  const isMobileApp = isMobile && mobileUiMode === "app";

  // Điều kiện kiểm tra tính hợp lệ của từng bước (isValid của Step)
  const isStep1Valid = useMemo(() => {
    if (!formData.regimenId) return false;
    if (isPlannedMode && (!selectedPlanId || !selectedStageId)) return false;
    if (!formData.workType) return false;
    return true;
  }, [
    formData.regimenId,
    formData.workType,
    isPlannedMode,
    selectedPlanId,
    selectedStageId,
  ]);

  const isStep2Valid = useMemo(() => {
    const hasValidHarvest =
      formData.harvestDetails.length > 0 &&
      formData.harvestDetails.every(
        (d) => d.quantity && Number(d.quantity) > 0,
      );
    const hasTasks = formData.selectedStages.length > 0;

    if (formData.workType === "harvest") {
      // Khi chọn loại việc Thu hoạch: Bắt buộc có thu hoạch, danh sách công việc là TÙY CHỌN
      if (!hasValidHarvest) return false;
    } else {
      // Khi là loại việc khác: Có thể có thu hoạch hoặc có ít nhất 1 công việc
      if (!hasTasks && !hasValidHarvest) return false;
    }

    if (formData.materialAllocations.length > 0) {
      const allValidMaterials = formData.materialAllocations.every((m) => {
        const qty = Number(m.actualQuantity || m.quantity);
        return !isNaN(qty) && qty > 0;
      });
      if (!allValidMaterials) return false;
    }

    return true;
  }, [
    formData.workType,
    formData.harvestDetails,
    formData.selectedStages,
    formData.materialAllocations,
  ]);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "context",
        title: "Vụ mùa & Loại việc",
        description: "Chọn vụ mùa, kế hoạch và loại công việc",
        content: (
          <Step1ContextAndWorkType
            formData={formData}
            setFormData={setFormData}
            workflowDomainCode={workflowDomainCode}
            workflowOptions={workflowOptions}
            workflowSearchQuery={workflowSearchQuery}
            setWorkflowSearchQuery={setWorkflowSearchQuery}
            workflowsLoading={workflowsQuery.loading}
            selectedWorkflow={selectedWorkflow}
            isPlannedMode={isPlannedMode}
            allowModeToggle={allowModeToggle}
            planOptions={planOptions}
            setPlanSearchQuery={setPlanSearchQuery}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            selectedPlan={selectedPlan}
            stageOptions={stageOptions}
            selectedStageId={selectedStageId}
            setSelectedStageId={setSelectedStageId}
            availableTasks={availableTasks}
            selectedTask={selectedTask}
            errors={errors}
            setErrors={setErrors}
            setPlannedStages={setPlannedStages}
            setWorkTaskDetails={setWorkTaskDetails}
            setInitialTaskDetails={setInitialTaskDetails}
            personnelOptions={availablePersonnelOptions}
            defaultPersonnelId={defaultPersonnelId}
          />
        ),
        isValid: isStep1Valid,
      },
      {
        id: "execution",
        title: "Thực hiện & Vật tư",
        description: "Chi tiết công việc, vật tư, ảnh và cảnh báo",
        content: (
          <Step2ExecutionAndMaterials
            formData={formData}
            setFormData={setFormData}
            workflowDomainCode={workflowDomainCode}
            isPlannedMode={isPlannedMode}
            plannedStages={plannedStages}
            workTaskDetails={workTaskDetails}
            currentPercentage={currentPercentage}
            previousPercentage={previousPercentage}
            sliderTrackBackground={sliderTrackBackground}
            selectedStageId={selectedStageId}
            selectedTask={selectedTask}
            errors={errors}
            addStage={addStage}
            removeStage={removeStage}
            handleUpdateWorkTaskDetail={handleUpdateWorkTaskDetail}
            handleAddMaterial={handleAddMaterial}
            handleRemoveMaterial={handleRemoveMaterial}
            handleUpdateActualQuantity={handleUpdateActualQuantity}
            regionOptions={regionOptions}
            cropSubjectVariants={cropSubjectVariants}
            existingGeoSelections={existingGeoSelections}
            handleConfirmGeoSelections={handleConfirmGeoSelections}
            syncHarvestDetails={syncHarvestDetails}
            existingPhotos={existingPhotos}
            removeExistingPhoto={removeExistingPhoto}
            removeImage={removeImage}
            handleFileInputChange={handleFileInputChange}
            handleDrop={handleDrop}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            cameraInputRef={cameraInputRef}
            fileInputRef={fileInputRef}
            isMobileOrTablet={isMobileOrTablet}
            isPhotoSheetOpen={isPhotoSheetOpen}
            setIsPhotoSheetOpen={setIsPhotoSheetOpen}
          />
        ),
        isValid: isStep2Valid,
      },
      {
        id: "overview",
        title: "Tổng quan & Xác nhận",
        description: "Kiểm tra lại toàn bộ dữ liệu trước khi lưu",
        content: (
          <Step3OverviewAndConfirm
            formData={formData}
            selectedWorkflow={selectedWorkflow}
            selectedPlan={selectedPlan}
            selectedStageId={selectedStageId}
            selectedTask={selectedTask}
            isPlannedMode={isPlannedMode}
            workTaskDetails={workTaskDetails}
            existingPhotos={existingPhotos}
            workflowDomainCode={workflowDomainCode}
            submittedByPersonnelName={submittedByPersonnelName}
          />
        ),
        isValid: true,
      },
    ],
    [
      formData,
      workflowDomainCode,
      workflowOptions,
      workflowSearchQuery,
      workflowsQuery.loading,
      selectedWorkflow,
      isPlannedMode,
      allowModeToggle,
      planOptions,
      selectedPlanId,
      selectedPlan,
      stageOptions,
      selectedStageId,
      availableTasks,
      selectedTask,
      availablePersonnelOptions,
      submittedByPersonnelName,
      currentPercentage,
      previousPercentage,
      sliderTrackBackground,
      errors,
      isStep1Valid,
      isStep2Valid,
      plannedStages,
      workTaskDetails,
      regionOptions,
      cropSubjectVariants,
      existingGeoSelections,
      existingPhotos,
      isDragging,
      isMobileOrTablet,
      isPhotoSheetOpen,
      addStage,
      removeStage,
      handleUpdateWorkTaskDetail,
      handleAddMaterial,
      handleRemoveMaterial,
      handleUpdateActualQuantity,
      handleConfirmGeoSelections,
      syncHarvestDetails,
      removeExistingPhoto,
      removeImage,
      handleFileInputChange,
      handleDrop,
      setFormData,
      setWorkflowSearchQuery,
      setPlanSearchQuery,
      setSelectedPlanId,
      setSelectedStageId,
      setErrors,
      setPlannedStages,
      setWorkTaskDetails,
      setInitialTaskDetails,
      setIsDragging,
      setIsPhotoSheetOpen,
    ],
  );

  return (
    <PageWrapper
      title={pageTitle}
      description="Ghi nhận hoạt động sản xuất, cập nhật tiến độ công việc và cấp phát vật tư"
      actions={
        isMobile ? undefined : (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-lg px-4 text-sm gap-2"
              onClick={() => setLocation(backUrl)}
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại danh sách
            </Button>
          </div>
        )
      }
    >
      <div
        className={`mx-auto w-full max-w-5xl ${isMobileApp ? "pb-8" : "pb-12"}`}
      >
        <StepperForm
          key={stepperKey}
          steps={steps}
          onComplete={handleSubmitForm}
          onCancel={() =>
            isMobileApp && onReset ? onReset() : setLocation(backUrl)
          }
          loading={
            isSubmitting ||
            createDailyDiaryMutation.isPending ||
            updateDailyDiaryMutation.isPending ||
            createPlanTaskDiaryMutation.isPending
          }
          completeLabel="Lưu nhật ký"
        />
      </div>

      <DiarySuccessDialog
        open={showSuccessDialog}
        onViewList={handleViewList}
        onContinue={handleContinueLogging}
      />
    </PageWrapper>
  );
}
