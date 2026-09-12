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
import type { DomainCode } from "@/features/farm-supply/types";
import { useFarmTaskById, useFarmTasks } from "@/features/farm-task/hooks";
import { useFarmPlans, useFarmWorkflows } from "@/features/farm-workflow/hooks";
import type { FarmWorkflowScopeResponse } from "@/features/farm-workflow/types/farm-workflow.type";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RemoteAutoCompleteSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Layers,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GeographicalSelectionCard } from "./GeographicalSelectionCard";
import { CultivationZoneSelector } from "./CultivationZoneSelector";

import {
  WORK_TYPE_OPTIONS,
  getHarvestLabel,
  getHarvestUnitOptions,
  getWorkflowLabel,
  getWorkflowSubtitle,
} from "../../constants/history-form.constants";
import { historyFormSchema } from "../../schemas/historyFormSchema";
import type {
  HarvestDetail,
  HistoryFormContentProps,
  HistoryFormData,
  MaterialAllocation,
} from "../../types/history-form.types";
import {
  createHarvestDetail,
  extractCropSubjectVariants,
  mapWorkTypeToPurpose,
  mapWorkflowScopeToHarvestOption,
  toCultivationZoneOptions,
  uploadPhotosInParallel,
} from "../../utils/history-form.utils";
import { useCropSupplyCatalog } from "@/pages/plan-growth/hooks/useCropSupplyCatalog";
import { getSupplyTypeOptions } from "@/shared/hooks/useRemoteSupplySearch";
import { HarvestTreeSelectorDialog } from "../dialogs/HarvestTreeSelectorDialog";
import { PlannedTaskDetailCard } from "./PlannedTaskDetailCard";
import { WorkAllocationCard, type WorkTaskDetail } from "./WorkAllocationCard";
import { WorkflowScopeMapModal } from "../dialogs/WorkflowScopeMapModal";
import { useLocation } from "wouter";

export function HistoryFormContent({
  isPlannedModeDefault = false,
  allowModeToggle = true,
  initialTaskId = "",
  initialPlanId = "",
  initialWorkflowId = "",
  pageTitle = "Ghi nhận nhật ký nông hộ",
  backUrl = "/diary/daily-history",
}: HistoryFormContentProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const createDailyDiaryMutation = useCreateFarmDailyDiaryEntry();
  const updateDailyDiaryMutation = useUpdateFarmDailyDiaryEntry();
  const createPlanTaskDiaryMutation = useCreateFarmPlanTaskDiaryEntry();

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
    harvestScope: "region",
    harvestTargets: [],
    harvestDetails: [],
    harvestFiles: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    completionPercentage: 60,
    description: "",
    images: [],
    selectedStages: [],
    materialAllocations: [],
  });

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

    const workTypeMap: Record<string, string> = {
      CULTIVATION: "cultivation",
      FACILITY_UPGRADE: "facility-upgrade",
      TREATMENT: "treatment",
      SOIL_IMPROVEMENT: "amendment",
      HARVEST: "harvest",
    };
    const workType = workTypeMap[detail.purpose] || "cultivation";

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
            catalogItem?.name || s.name || `Vật tư #${s.supplyItemId}`,
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
    setFormData((prev) => ({
      ...prev,
      regimenId: String(detail.workflowId ?? prev.regimenId),
      workType,
      harvestScope,
      harvestTargets: newHarvestDetails.map((d) => d.targetId),
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
  const uploadCacheRef = useRef<Map<string, PhotoRequest>>(new Map());

  const [isPlannedMode, setIsPlannedMode] =
    useState<boolean>(isPlannedModeDefault);
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

  const handleUpdateWorkTaskDetail = (
    stageName: string,
    updates: Partial<WorkTaskDetail>,
  ) => {
    setWorkTaskDetails((prev) => {
      const defaultStart =
        formData.startDate || new Date().toISOString().split("T")[0];
      const defaultEnd =
        formData.endDate || new Date().toISOString().split("T")[0];
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
  const [, setTaskSearchQuery] = useState("");
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
        materialName: s.supplyItem?.name || `Vật tư #${s.id}`,
        quantity: String(qtyVal),
        actualQuantity: String(qtyVal),
        unit:
          s.unitBase?.name ||
          (s as { unit?: string; unitName?: string }).unit ||
          (s as { unit?: string; unitName?: string }).unitName ||
          "",
        supplyItemId:
          s.supplyItem?.id || (s as { supplyItemId?: number }).supplyItemId,
        unitBaseId: s.unitBase?.id || (s as { unitBaseId?: number }).unitBaseId,
        isPlanned: true,
      };
    });

    const isHarvestTask =
      taskItem.taskCategory?.code === "CAT-THU-HOACH" ||
      taskItem.name.toLowerCase().includes("thu hoạch") ||
      taskItem.name.toLowerCase().includes("harvest");

    const resolvedWorkType = isHarvestTask ? "harvest" : "cultivation";

    const taskItemWithProgress = taskItem as { progressPercent?: number };
    const initialProgress =
      typeof taskItemWithProgress.progressPercent === "number"
        ? taskItemWithProgress.progressPercent
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

    setPlannedStages([taskItem.name]);
    setFormData((prev) => ({
      ...prev,
      workType: resolvedWorkType,
      startDate: taskItem.startDate,
      endDate: taskItem.endDate || new Date().toISOString().split("T")[0],
      completionPercentage: initialProgress,
      selectedStages: [taskItem.name],
      materialAllocations: plannedAllocations,
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

  const filteredTasks = useMemo(() => {
    if (!selectedStageId) return availableTasks;
    return availableTasks.filter(
      (t) => t.stage && String(t.stage.id) === String(selectedStageId),
    );
  }, [availableTasks, selectedStageId]);

  const taskOptions = useMemo(
    () =>
      filteredTasks.map((t) => ({
        label: t.code ? `${t.code} - ${t.name}` : t.name,
        value: String(t.id),
        keywords: [t.code, t.name].filter(Boolean) as string[],
      })),
    [filteredTasks],
  );

  const selectedTask = useMemo(
    () => availableTasks.find((t) => String(t.id) === String(selectedTaskId)),
    [availableTasks, selectedTaskId],
  );

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

  const addStage = (stageName?: string) => {
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
    const defaultStart =
      formData.startDate || new Date().toISOString().split("T")[0];
    const defaultEnd =
      formData.endDate || new Date().toISOString().split("T")[0];

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
      if (startDateVal && endDateVal && endDateVal < startDateVal) {
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

      // Build lines for tasks/items that have been modified or added by user
      const candidateStages =
        formData.selectedStages.length > 0
          ? formData.selectedStages
          : ["Công việc"];

      const activeStages = candidateStages.filter((stName) => {
        const detail = workTaskDetails[stName];
        if (candidateStages.length === 1) return true;
        const isNewStage = !plannedStages.includes(stName);
        const hasMaterialChange = formData.materialAllocations.some(
          (alloc) => alloc.stageId === stName && Boolean(alloc.supplyItemId),
        );
        return Boolean(detail?.isDirty || isNewStage || hasMaterialChange);
      });

      if (candidateStages.length > 1 && activeStages.length === 0) {
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
        const isNewStageTask =
          Boolean(detail?.isNewStage) ||
          !plannedStages.includes(stName) ||
          !matchedTask;
        const taskId = isNewStageTask
          ? undefined
          : (matchedTask?.id ?? (Number(detail?.id) || undefined));

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
          endDate:
            detail?.endDate ||
            formData.endDate ||
            new Date().toISOString().split("T")[0],
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

      const validationPayload = {
        planId,
        stageId,
        submittedByPersonnelId: undefined,
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
          workspaceId,
          uploadCacheRef.current,
        );

        const finalPayload = {
          planId,
          stageId,
          submittedByPersonnelId: undefined,
          description: formData.description || null,
          photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
          lines,
          harvestItems: harvestItems.length > 0 ? harvestItems : undefined,
        };

        await createPlanTaskDiaryMutation.mutateAsync(finalPayload);
        toast({
          title: "Thành công",
          description: "Đã lưu nhật ký theo kế hoạch!",
        });
        setLocation(backUrl);
      } catch (err: unknown) {
        console.error("Lỗi khi tạo nhật ký kế hoạch:", err);
        const errObj = err as { response?: { data?: { message?: string } } };
        toast({
          title: "Lỗi tạo nhật ký kế hoạch",
          description:
            errObj.response?.data?.message ||
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

    // Convert workTaskDetails into DailyDiaryLineRequest[]
    const lines: DailyDiaryLineRequest[] = Object.values(workTaskDetails).map(
      (task) => {
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

        return {
          name: task.stageName || "Công việc phát sinh",
          priority: task.priority || "MEDIUM",
          startDate: task.startDate || formData.startDate,
          endDate: task.endDate || formData.endDate,
          description: task.description || null,
          supplies: supplies.length > 0 ? supplies : undefined,
        };
      },
    );

    // If no workTaskDetails were added, create a default line if workType (except harvest) or dates are present
    if (
      lines.length === 0 &&
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

      lines.push({
        name: `Công việc ${label}`,
        priority: "MEDIUM",
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || null,
        supplies: supplies.length > 0 ? supplies : undefined,
      });
    }

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

    const validationPayload = {
      workflowId,
      seasonId,
      purpose,
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
        workspaceId,
        uploadCacheRef.current,
      );

      // Build payload and submit
      const finalPayload = {
        workflowId,
        seasonId,
        purpose,
        description: formData.description || null,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
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
      } else {
        await createDailyDiaryMutation.mutateAsync(finalPayload);
        toast({
          title: "Thành công",
          description: "Đã lưu nhật ký thường nhật!",
        });
      }
      setLocation("/diary/daily-history");
    } catch (err: unknown) {
      console.error("Lỗi khi tạo nhật ký thường nhật:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper
      title={pageTitle}
      description="Ghi nhận hoạt động sản xuất, cập nhật tiến độ công việc và cấp phát vật tư"
      actions={
        <div className="flex items-center gap-3">
          {/* {allowModeToggle && (
            <div className="flex items-center gap-2 bg-slate-100 px-1.5 py-1 rounded-lg border border-slate-200/80 shrink-0">
              <span className="text-xs font-extrabold px-2 py-1 rounded-md transition-all">
                Kế hoạch vụ mùa
              </span>
              <Switch
                checked={isPlannedMode}
                onCheckedChange={(checked) => {
                  setIsPlannedMode(checked);
                  if (!checked) {
                    setSelectedPlanId("");
                    setSelectedTaskId("");
                    setPlannedStages([]);
                    setErrors((prev) => ({ ...prev, planId: "", taskId: "" }));
                    setFormData((prev) => ({
                      ...prev,
                      endDate: new Date().toISOString().split("T")[0],
                    }));
                  }
                }}
              />
            </div>
          )} */}
          <Button
            variant="outline"
            className="h-10 rounded-lg px-4 text-sm gap-2"
            onClick={() => setLocation(backUrl)}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-5xl pb-24 space-y-6">
        {/* Block 1: Thông tin chung & Nhật ký */}
        <div className="space-y-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <ClipboardList className="h-4 w-4 text-emerald-600" />
                Thông tin cập nhật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Chọn Vụ mùa / Quy trình */}
              <div className="space-y-2">
                <Label required>{getWorkflowLabel(workflowDomainCode)}</Label>
                <RemoteAutoCompleteSelect
                  options={workflowOptions}
                  value={formData.regimenId}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, regimenId: val }));
                    setSelectedPlanId("");
                    setSelectedTaskId("");
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
                  loading={workflowsQuery.loading}
                  disabled={!allowModeToggle}
                />
                {errors.regimenId && (
                  <p className="text-xs font-medium text-red-500 mt-1">
                    {errors.regimenId}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  {getWorkflowSubtitle(workflowDomainCode)} đang được áp dụng
                  cho nhật ký này.
                </p>

                {/* Bản đồ phạm vi Mùa vụ */}
                {selectedWorkflow && (
                  <WorkflowScopeMapModal workflow={selectedWorkflow} />
                )}
              </div>

              {/* Chế độ Theo kế hoạch -> Combobox chọn Kế hoạch & Hạng mục dự kiến (Stage) */}
              {isPlannedMode && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Combobox 1: Kế hoạch */}
                    <div className="space-y-2">
                      <Label required>Kế hoạch</Label>
                      <RemoteAutoCompleteSelect
                        options={planOptions}
                        value={selectedPlanId}
                        onChange={(val) => {
                          setSelectedPlanId(val);
                          setSelectedStageId("");
                          setSelectedTaskId("");
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
                            (t) =>
                              t.stage && String(t.stage.id) === String(val),
                          );

                          const newTaskNames: string[] = [];
                          const newTaskDetails: Record<string, WorkTaskDetail> =
                            {};
                          const newAllocations: MaterialAllocation[] = [];

                          if (stageTasks.length > 0) {
                            stageTasks.forEach((taskItem, tIdx) => {
                              const taskName = taskItem.name;
                              newTaskNames.push(taskName);
                              const taskItemWithProgress = taskItem as {
                                progressPercent?: number;
                              };
                              const taskProgress =
                                typeof taskItemWithProgress.progressPercent ===
                                "number"
                                  ? taskItemWithProgress.progressPercent
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
                                endDate:
                                  taskItem.endDate ||
                                  new Date().toISOString().split("T")[0],
                                description: taskItem.note || "",
                                isDirty: false,
                              };

                              (taskItem.supplyLines || []).forEach(
                                (s, sIdx) => {
                                  const qtyVal =
                                    s.quantityActualTotal ?? s.quantity ?? 0;
                                  newAllocations.push({
                                    id: Date.now() + tIdx * 100 + sIdx,
                                    stageId: taskName,
                                    materialType: "Kế hoạch",
                                    materialName:
                                      s.supplyItem?.name || `Vật tư #${s.id}`,
                                    quantity: String(qtyVal),
                                    actualQuantity: String(qtyVal),
                                    unit:
                                      s.unitBase?.name ||
                                      (
                                        s as {
                                          unit?: string;
                                          unitName?: string;
                                        }
                                      ).unit ||
                                      (
                                        s as {
                                          unit?: string;
                                          unitName?: string;
                                        }
                                      ).unitName ||
                                      "",
                                    supplyItemId:
                                      s.supplyItem?.id ||
                                      (s as { supplyItemId?: number })
                                        .supplyItemId,
                                    unitBaseId:
                                      s.unitBase?.id ||
                                      (s as { unitBaseId?: number }).unitBaseId,
                                    isPlanned: true,
                                  });
                                },
                              );
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
                                startDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                                endDate: new Date().toISOString().split("T")[0],
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
                              startDate: new Date().toISOString().split("T")[0],
                              endDate: new Date().toISOString().split("T")[0],
                              description: targetStage.description || "",
                              isDirty: false,
                            };
                          }

                          setWorkTaskDetails(newTaskDetails);
                          setInitialTaskDetails(newTaskDetails);
                          setPlannedStages(newTaskNames);
                          setFormData((prev) => ({
                            ...prev,
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
                  {selectedTask && (
                    <PlannedTaskDetailCard
                      task={selectedTask}
                      planObjective={selectedPlan?.objective}
                    />
                  )}
                </div>
              )}

              {/* Chọn Loại công việc */}
              <div className="space-y-3">
                <Label required>Loại công việc</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                        className={`rounded-2xl border-2 px-3 py-4 transition-all flex flex-col items-center text-center gap-1.5 group ${
                          isPlannedMode
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
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

              {/* Mức độ hoàn thành công việc (Slide bar 2 màu hợp nhất) */}
              {isPlannedMode && (
                <div
                  className={`space-y-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all ${
                    !selectedTaskId ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          currentPercentage < previousPercentage
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          Mức độ hoàn thành công việc
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Tự động tính toán theo tiến độ các công việc thuộc
                          hạng mục
                        </p>
                      </div>
                    </div>

                    {/* Hiển thị badge cảnh báo khi kéo giảm */}
                    {currentPercentage < previousPercentage && (
                      <span className="text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                        Giảm -{previousPercentage - currentPercentage}% so với
                        trước đó
                      </span>
                    )}
                  </div>

                  {/* Dual-Color Range Input (Read-only / Calculated from tasks) */}
                  <div className="space-y-1 pt-1">
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        disabled={true}
                        value={currentPercentage}
                        readOnly
                        style={{
                          background: sliderTrackBackground,
                        }}
                        className="w-full h-3 rounded-lg appearance-none accent-emerald-600 focus:outline-none cursor-not-allowed pointer-events-none"
                      />
                    </div>

                    {/* Tỉ lệ mốc % */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Legend chú thích màu sắc */}
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-600 border-t border-slate-100">
                    {currentPercentage < previousPercentage ? (
                      <>
                        <div className="flex items-center gap-1.5 font-bold text-blue-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span>Mức cập nhật mới ({currentPercentage}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-extrabold text-red-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                          <span>
                            Khoảng giảm (-
                            {previousPercentage - currentPercentage}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-slate-500">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                          <span>
                            Chưa hoàn thành (
                            {Math.max(0, 100 - currentPercentage)}%)
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span>Tiến độ trước đó ({previousPercentage}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span>
                            Cập nhật thêm đợt này (
                            {currentPercentage - previousPercentage}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                          <span>
                            Chưa hoàn thành (
                            {Math.max(0, 100 - currentPercentage)}%)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Mô tả */}
              <div className="space-y-2">
                <Label>Mô tả chi tiết lần cập nhật</Label>
                <Textarea
                  placeholder="Nhập mô tả hoặc ghi chú lần cập nhật..."
                  rows={4}
                  className="bg-white border-slate-200 focus:ring-emerald-500/20"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Upload hình ảnh đợt cập nhật */}
              <div className="space-y-2 pt-1">
                <Label>Hình ảnh / Chứng từ đợt cập nhật (nếu có)</Label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-emerald-600">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Kéo thả hình ảnh hoặc{" "}
                        <span className="text-emerald-600 underline">
                          tải lên từ thiết bị
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Hỗ trợ định dạng PNG, JPG, JPEG (Tối đa 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Danh sách ảnh đã chọn */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2.5 pt-2">
                    {formData.images.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Xóa ảnh này"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Block Thu hoạch (Nếu chọn loại công việc Thu hoạch) */}
          {formData.workType === "harvest" && (
            <Card className="border-none bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Apple className="h-4 w-4 text-emerald-600" />
                  Thu hoạch
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Đối tượng thu hoạch
                      </p>
                      <p className="text-xs text-slate-500">
                        Chọn theo vùng canh tác hoặc cây canh tác, rồi nhập chi
                        tiết cho từng mục.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            harvestScope: "region",
                            harvestTargets: [],
                            harvestDetails: [],
                          }));
                        }}
                        className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                          formData.harvestScope === "region"
                            ? "border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-2xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        Vùng canh tác
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            harvestScope: "crop",
                            harvestTargets: [],
                            harvestDetails: [],
                          }));
                        }}
                        className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                          formData.harvestScope === "crop"
                            ? "border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-2xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        Cây canh tác
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.harvestScope === "region" ? (
                      <CultivationZoneSelector
                        regions={regionOptions}
                        existingSelections={existingGeoSelections}
                        onConfirm={handleConfirmGeoSelections}
                        regionOnly={true}
                        customTrigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
                          >
                            <Plus className="w-5 h-5" />
                            <span>
                              {formData.harvestDetails.length > 0
                                ? `Đã chọn ${formData.harvestDetails.length} vùng canh tác (Bấm để chọn lại)`
                                : "Chọn vùng canh tác..."}
                            </span>
                          </Button>
                        }
                      />
                    ) : (
                      <HarvestTreeSelectorDialog
                        variants={cropSubjectVariants}
                        selectedItems={formData.harvestDetails
                          .filter((d) => d.codeName)
                          .map((d) => ({
                            id: d.targetId.toString(),
                            codeName: d.codeName,
                            label: d.targetLabel,
                            treeCode: d.codeName,
                            regionName: d.codeName,
                          }))}
                        onConfirmSelections={(trees) => {
                          const currentMap = new Map(
                            formData.harvestDetails.map((d) => [
                              String(d.targetId),
                              d,
                            ]),
                          );
                          const nextTargets = trees.map((t) =>
                            String(t.linkId ?? t.id),
                          );
                          const nextDetails = trees.map((t) => {
                            const targetIdStr = String(t.linkId ?? t.id);
                            const existing = currentMap.get(targetIdStr);
                            const label = t.name || `Giống #${t.id}`;
                            const codeName = t.code || label;

                            if (existing) {
                              return {
                                ...existing,
                                targetId: targetIdStr,
                                codeName,
                                targetLabel: label,
                              };
                            }
                            return {
                              id: `h-variant-${targetIdStr}`,
                              targetId: targetIdStr,
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
                        }}
                      />
                    )}

                    {/* Chi tiết từng mục thu hoạch */}
                    {formData.harvestDetails.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              Chi tiết thu hoạch
                            </p>
                            <p className="text-xs text-slate-500">
                              Nhập mã, sản lượng và đơn vị cơ bản cho từng mục
                              đã chọn.
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                          >
                            {formData.harvestDetails.length} mục
                          </Badge>
                        </div>

                        {formData.harvestDetails.map((detail, index) => (
                          <div
                            key={detail.id}
                            className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {detail.targetLabel}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {getHarvestLabel(formData.harvestScope)} #
                                  {index + 1}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  syncHarvestDetails(
                                    formData.harvestTargets.filter(
                                      (id) => id !== detail.targetId,
                                    ),
                                  )
                                }
                                className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa mục này"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {formData.harvestScope === "region" ? (
                              <CultivationZoneSelector
                                regions={regionOptions}
                                existingSelections={existingGeoSelections}
                                onConfirm={handleConfirmGeoSelections}
                                regionOnly={true}
                                customTrigger={
                                  <GeographicalSelectionCard
                                    codeName={detail.codeName}
                                    onChangeLocation={() => {}}
                                    onRemove={() =>
                                      syncHarvestDetails(
                                        formData.harvestTargets.filter(
                                          (id) => id !== detail.targetId,
                                        ),
                                      )
                                    }
                                  />
                                }
                              />
                            ) : null}

                            <div className="grid grid-cols-12 gap-3">
                              <div className="space-y-1.5 md:col-span-8">
                                <Label className="text-xs font-semibold text-slate-500">
                                  Sản lượng
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Nhập sản lượng..."
                                  className="h-10 bg-white border-slate-200 text-sm"
                                  value={detail.quantity}
                                  onChange={(e) => {
                                    const next = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      harvestDetails: prev.harvestDetails.map(
                                        (item) =>
                                          item.id === detail.id
                                            ? { ...item, quantity: next }
                                            : item,
                                      ),
                                    }));
                                  }}
                                />
                              </div>
                              <div className="space-y-1.5 md:col-span-4">
                                <Label className="text-xs font-semibold text-slate-500">
                                  Đơn vị cơ bản
                                </Label>
                                <Select
                                  value={detail.unitBase}
                                  onValueChange={(value) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      harvestDetails: prev.harvestDetails.map(
                                        (item) =>
                                          item.id === detail.id
                                            ? { ...item, unitBase: value }
                                            : item,
                                      ),
                                    }));
                                  }}
                                >
                                  <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                                    <SelectValue placeholder="Chọn đơn vị" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getHarvestUnitOptions().map((unit) => (
                                      <SelectItem
                                        key={unit.value}
                                        value={unit.value}
                                      >
                                        {unit.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 p-6 text-sm text-slate-500 font-medium">
                        Chưa chọn đối tượng thu hoạch.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Block 2: Phân bổ công việc & Cấp phát vật tư (Stacked Full Width) */}
        <div>
          <WorkAllocationCard
            title={!isPlannedModeDefault ? "Công việc thực hiện" : undefined}
            selectedStages={formData.selectedStages}
            plannedStages={plannedStages}
            isPlannedMode={isPlannedMode}
            workTaskDetails={workTaskDetails}
            materialAllocations={formData.materialAllocations}
            domainCode={workflowDomainCode as DomainCode}
            errors={errors}
            onAddStage={addStage}
            onRemoveStage={removeStage}
            onUpdateWorkTaskDetail={handleUpdateWorkTaskDetail}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onUpdateActualQuantity={handleUpdateActualQuantity}
          />
        </div>
      </div>

      {/* Nút hành động (Sticky Footer) */}
      <div className="fixed left-0 right-0 bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
        <Button
          variant="outline"
          type="button"
          className="h-11 px-6 rounded-xl text-sm font-semibold"
          onClick={() => setLocation(backUrl)}
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          disabled={isSubmitting || createDailyDiaryMutation.isPending}
          className="h-11 px-8 rounded-xl text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
          onClick={handleSubmitForm}
        >
          {isSubmitting || createDailyDiaryMutation.isPending
            ? "Đang lưu nhật ký..."
            : "Lưu nhật ký"}
        </Button>
      </div>
    </PageWrapper>
  );
}
