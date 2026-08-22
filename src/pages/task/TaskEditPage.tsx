import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Switch,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Bug,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileCheck,
  Info,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sprout,
  StickyNote,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";

import { AppLoadingState } from "@/components/AppLoadingState";
import type { DomainCode } from "@/features/farm-supply/types";
import { useFarmTaskById, useUpdateFarmTask } from "@/features/farm-task";
import type { FarmTaskRequest } from "@/features/farm-task";
import {
  useFarmPersonnel,
  type FarmPersonnelResponse,
} from "@/features/master-data";
import { useTaskCategorySearch } from "@/features/task-category/hooks/useTaskCategory";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  useFarmPlanById,
  useFarmPlans,
  useFarmWorkflows,
} from "@/features/farm-workflow/hooks";
import { useCropSupplyCatalog } from "../plan-growth/hooks/useCropSupplyCatalog";
import useAmendmentPlanStore from "../../stores/useAmendmentPlanStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import usePlanStore, { type Plan } from "../../stores/usePlanStore";
import useRegionStore from "../../stores/useRegionStore";
import useTaskStore from "../../stores/useTaskStore";
import GeographicalSelector from "../plan/components/GeographicalSelector";
import { TaskStageAllocation } from "../plan/components/TaskStageAllocation";
import SimpleTaskForm from "./components/SimpleTaskForm";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../plan/types";
import { mapPlanResponseToPlan, mapWorkflowScopesToSelections } from "../plan-growth/utils/api-mappers";
import { getRepeatDatesText } from "../plan/utils/task";
import { farmTaskToLegacyTask } from "./utils/task-mappers";
import type { TaskCreateFormData } from "./TaskCreatePage";

type TaskObjectiveType =
  | "phat-sinh"
  | "theo-ke-hoach"
  | "thu-hoach"
  | "cai-tao-dat"
  | "tri-benh";

// Inverse of the purpose filter in `activePlans`. Partial on purpose: an
// "incurred" plan has no objective type and falls back to "phat-sinh".
const PURPOSE_TO_OBJECTIVE_TYPE: Partial<
  Record<Plan["purpose"], TaskObjectiveType>
> = {
  cultivation: "theo-ke-hoach",
  "facility-upgrade": "theo-ke-hoach",
  harvest: "thu-hoach",
  treatment: "tri-benh",
  amendment: "cai-tao-dat",
};

const createEmptyTaskFormData = (): TaskCreateFormData => ({
  code: "CV-" + Math.floor(1000 + Math.random() * 9000),
  name: "",
  mode: "phat-sinh",
  objectiveType: "phat-sinh",
  planId: "",
  planName: "",
  mainTaskId: "",
  mainTaskIds: [],
  selectedStages: [],
  selectedPlotIds: [],
  regimenId: "",
  assignedType: "individual",
  assignedTo: [],
  supervisors: [],
  qualityInspectors: [],
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  priority: "medium",
  description: "",
  materials: [],
  tasks: [],
});

const mapPriorityToApi = (
  priority: TaskCreateFormData["priority"],
): FarmTaskRequest["priority"] => {
  switch (priority) {
    case "low":
      return "LOW";
    case "high":
      return "HIGH";
    case "medium":
    default:
      return "MEDIUM";
  }
};

function toFiniteNumber(value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") return null;
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : null;
}

function pickText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function pickArray<T>(...values: Array<T[] | null | undefined>) {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) return value;
  }
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function buildTaskDraftFromTask(task: ReturnType<typeof farmTaskToLegacyTask>) {
  const stageId = task.stage || "Công việc phát sinh";
  return {
    id: task.id,
    stageId,
    name: task.name,
    description: task.description,
    labor:
      task.assignedTo.length > 0
        ? `Nhân sự: ${task.assignedTo.join(", ")}`
        : "",
    duration:
      task.startDate && task.endDate
        ? `${task.startDate} → ${task.endDate}`
        : "",
    startDate: task.startDate,
    endDate: task.endDate,
    geographicalSelections: task.geographicalSelections || [],
    isRepeating: false,
    repeatDates: [],
  };
}

function mapSelectionsToScope(
  selections: GeographicalSelection[],
): Pick<FarmTaskRequest, "scopeType" | "scopeId"> {
  const regionSelection = selections.find((item) => item.type === "region");
  if (regionSelection) {
    return {
      scopeType: "REGION",
      scopeId: toFiniteNumber(regionSelection.regionId),
    };
  }

  const areaSelection = selections.find((item) => item.type === "area");
  if (areaSelection) {
    return {
      scopeType: "AREA",
      scopeId: toFiniteNumber(areaSelection.areaId),
    };
  }

  const plotSelection = selections.find((item) => item.type === "plot");
  if (plotSelection) {
    return {
      scopeType: "PLOT",
      scopeId: toFiniteNumber(plotSelection.plotId),
    };
  }

  return {
    scopeType: null,
    scopeId: null,
  };
}

export default function TaskEditPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { item: taskResponse, loading: taskLoading } = useFarmTaskById(
    params.id ?? null,
    { enabled: !!params.id },
  );
  const updateTaskMutation = useUpdateFarmTask({
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Đã lưu thay đổi công việc",
      });
      setLocation("/task");
    },
    onError: (error) => {
      toast({
        title: "Không thể cập nhật",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const taskDomainCode: DomainCode = taskResponse?.domainCode || "CROP";
  const taskCategoriesQuery = useTaskCategorySearch({
    params: { domainCode: taskDomainCode },
  });
  const supplyCatalog = useCropSupplyCatalog(taskDomainCode);
  const apiSupplyMaterials = useMemo<MaterialAllocation[]>(
    () => {
      return Object.values(supplyCatalog.optionsByType).flatMap((options) =>
        options.map(({ item }) => ({
          ...(() => {
            const firstPackaging = item.packagingVariants?.[0];
            return {
              unit: firstPackaging?.unitBase?.name || "",
              unitBaseId: firstPackaging?.unitBase?.id,
            };
          })(),
          id: item.id,
          stageId: "Công việc phát sinh",
          materialCategory: item.supplyType,
          materialType: item.supplyType,
          materialName: item.name,
          quantity: String((item as any).quantity ?? 0),
          availableQuantity: Number((item as any).quantity ?? 0),
          supplyItemId: item.id,
          unitOptions: (item.packagingVariants || []).map((variant) => ({
            id: variant.unitBase.id,
            name: variant.unitBase.name,
          })),
        })),
      );
    },
    [supplyCatalog.optionsByType],
  );
  const plans = usePlanStore((state) => state.plans);
  const amendmentPlans = useAmendmentPlanStore((state) => state.plans);
  const workflowsQuery = useFarmWorkflows({
    params: { page: 0, size: 100 },
  });
  const localPersonnel = usePersonnelStore((state) => state.personnel);
  const workspaceId = useSelectedWorkspaceId();
  const numericWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;
  const farmPersonnelQuery = useFarmPersonnel({
    workspaceId: numericWorkspaceId,
    params: {
      page: 0,
      size: 100,
      status: "active",
    },
    enabled: numericWorkspaceId !== undefined,
  });
  const personnel = useMemo(() => {
    if (numericWorkspaceId !== undefined) {
      return farmPersonnelQuery.items.map((item: FarmPersonnelResponse) => ({
        id: item.id,
        fullName: item.fullName,
        avatar: (item as any).avatarUrl || (item as any).avatar || "",
        position:
          (item as any).position?.name ||
          (item as any).positionName ||
          (item as any).position?.code ||
          "",
        department:
          (item as any).department?.name ||
          (item as any).departmentName ||
          (item as any).department?.code ||
          "",
        team:
          item.teams?.map((team) => team.name).filter(Boolean).join(", ") ||
          "",
        taxCode: (item as any).taxCode || item.code || "",
      }));
    }

    return localPersonnel;
  }, [farmPersonnelQuery.items, localPersonnel, numericWorkspaceId]);
  const localTask = useTaskStore((state) =>
    state.tasks.find((item) => item.id === Number(params.id)),
  );
  const planIdForDetail = taskResponse?.plan?.id ?? localTask?.planId ?? "";
  const planDetailQuery = useFarmPlanById(planIdForDetail || "0", {
    enabled: !!planIdForDetail,
  });
  const task = useMemo(
    () => (taskResponse ? farmTaskToLegacyTask(taskResponse) : localTask),
    [taskResponse, localTask],
  );

  const [formData, setFormData] = useState<TaskCreateFormData>(
    createEmptyTaskFormData(),
  );

  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [searchSupervisor, setSearchSupervisor] = useState("");
  const [isInspectorDialogOpen, setIsInspectorDialogOpen] = useState(false);
  const [searchInspector, setSearchInspector] = useState("");
  const [planSearchTerm, setPlanSearchTerm] = useState("");
  const [selectedEnterpriseId] = useState<string>("");
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);

  const workflowPlansQuery = useFarmPlans({
    params: {
      workflowId: formData.regimenId
        ? Number(formData.regimenId)
        : undefined,
      page: 0,
      size: 100,
    },
    enabled: !!formData.regimenId,
  });

  const planScopes = useMemo(() => {
    const selectedPlanResponse = workflowPlansQuery.items.find(
      (plan) => String(plan.id) === String(formData.planId),
    );
    return planDetailQuery.data?.scopes || selectedPlanResponse?.scopes || [];
  }, [
    formData.planId,
    planDetailQuery.data?.scopes,
    workflowPlansQuery.items,
  ]);

  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

  useEffect(() => {
    if (!taskResponse && !localTask) return;

    const apiTask = taskResponse ? farmTaskToLegacyTask(taskResponse) : undefined;
    const isPlannedTask =
      taskResponse?.origin === "PLANNED" || Boolean(localTask?.planId);
    const repeatDates =
      taskResponse?.recurrence?.repeatMode === "SPECIFIC_DATES"
        ? taskResponse.recurrence.repeatDates?.filter(Boolean) || []
        : [];
    const isRepeating = repeatDates.length > 0;
    const planDetail = planDetailQuery.data;
    const allPlans = [...plans, ...amendmentPlans] as any[];
    const planMatch = planDetail
      ? mapPlanResponseToPlan(planDetail)
      : taskResponse?.plan?.id
        ? allPlans.find((plan) => String(plan.id) === String(taskResponse.plan?.id))
        : allPlans.find(
            (plan) =>
              plan.name?.normalize?.() === task?.plan?.normalize?.(),
          );

    const sourceWorkItemId =
      taskResponse?.sourceWorkItem?.id ??
      (taskResponse as any)?.sourceWorkItemId ??
      (localTask as any)?.mainTaskId ??
      (taskResponse as any)?.mainTaskId;
    const plannedStageName = planMatch?.taskAllocations?.find(
      (item: any) => String(item.id) === String(sourceWorkItemId),
    )?.stageId;

    const stageSource = isPlannedTask
      ? plannedStageName || task?.stage || ""
      : "Công việc phát sinh";
    const selectedStages =
      stageSource && stageSource !== "N/A"
        ? stageSource
            .split("; ")
            .map((stage: any) => stage.normalize())
            .filter(Boolean)
        : [];
    const scopeSelections = planDetail?.scopes?.length
      ? mapWorkflowScopesToSelections(planDetail.scopes)
      : [];
    const taskSelections =
      isPlannedTask && scopeSelections.length > 0
        ? scopeSelections
        : localTask?.geographicalSelections?.length
          ? localTask.geographicalSelections
          : apiTask?.geographicalSelections?.length
            ? apiTask.geographicalSelections
            : [];
    const selectedPlotIds =
      isPlannedTask
        ? []
        : taskSelections.length > 0
        ? taskSelections
            .filter((item) => item.type === "plot")
            .map((item) => String(item.plotId))
        : scopeSelections.length > 0
          ? scopeSelections
              .filter((item) => item.type === "plot")
              .map((item) => String(item.plotId))
          : [];
    const mainTaskIds = Array.isArray((localTask as any)?.mainTaskIds)
      ? (localTask as any).mainTaskIds.map(String)
      : Array.isArray((taskResponse as any)?.mainTaskIds)
        ? (taskResponse as any).mainTaskIds.map(String)
        : taskResponse?.sourceWorkItem?.id
          ? [String(taskResponse.sourceWorkItem.id)]
        : (localTask as any)?.mainTaskId || (taskResponse as any)?.mainTaskId
          ? [
              String(
                (localTask as any)?.mainTaskId ||
                  (taskResponse as any)?.mainTaskId,
              ),
            ]
        : [];

    const plannedWorkItem = isPlannedTask
      ? planMatch?.taskAllocations?.find(
          (item: any) => String(item.id) === String(mainTaskIds[0]),
        ) ||
        planMatch?.taskAllocations?.find(
          (item: any) => item.stageId === selectedStages[0],
        )
      : undefined;

    const hydratedMaterials = pickArray(localTask?.materials, apiTask?.materials).map(
      (material) => ({
        ...material,
        stageId: isPlannedTask
          ? plannedStageName || material.stageId?.normalize?.() || material.stageId
          : "Công việc phát sinh",
      }),
    ) as MaterialAllocation[];
    const hydratedTasks = pickArray(localTask?.tasks, apiTask?.tasks).map((item) => ({
      ...item,
      name: item.name || plannedWorkItem?.name || apiTask?.name || "",
      sourceWorkItemId:
        item.sourceWorkItemId ??
        (plannedWorkItem ? Number(plannedWorkItem.id) : undefined),
      taskCategoryId:
        item.taskCategoryId ?? plannedWorkItem?.taskCategoryId,
      taskCategoryName:
        item.taskCategoryName ?? plannedWorkItem?.taskCategoryName,
      stageId:
        isPlannedTask
          ? item.stageId?.normalize?.() ||
            plannedWorkItem?.stageId ||
            apiTask?.stage ||
            item.stageId ||
            ""
          : "Công việc phát sinh",
      startDate: item.startDate || apiTask?.startDate,
      endDate: item.endDate || apiTask?.endDate,
      isRepeating: item.isRepeating ?? isRepeating,
      repeatDates:
        item.repeatDates && item.repeatDates.length > 0
          ? item.repeatDates
          : repeatDates,
      geographicalSelections:
        isPlannedTask && scopeSelections.length > 0
          ? scopeSelections
          : item.geographicalSelections,
    })) as TaskAllocation[];
    const seededTask =
      hydratedTasks.length > 0 && taskResponse
        ? hydratedTasks
        : taskResponse
          ? [
              {
                ...buildTaskDraftFromTask(
                  apiTask ?? farmTaskToLegacyTask(taskResponse),
                ),
                // AD_HOC tasks do not have a workflow stage. The resources
                // screen renders them under this dedicated stage instead of
                // the scope label returned by the API.
                stageId: isPlannedTask
                  ? plannedWorkItem?.stageId ||
                    buildTaskDraftFromTask(
                      apiTask ?? farmTaskToLegacyTask(taskResponse),
                    ).stageId
                  : "Công việc phát sinh",
                sourceWorkItemId: plannedWorkItem
                  ? Number(plannedWorkItem.id)
                  : undefined,
                name: plannedWorkItem?.name || apiTask?.name || localTask?.name || "",
                taskCategoryId:
                  plannedWorkItem?.taskCategoryId ??
                  taskResponse.taskCategory?.id,
                taskCategoryName:
                  plannedWorkItem?.taskCategoryName ??
                  taskResponse.taskCategory?.name,
                geographicalSelections: taskSelections,
                isRepeating,
                repeatDates,
              },
            ]
          : [];

    setSelections(taskSelections.length > 0 ? taskSelections : scopeSelections);
    setFormData({
      code:
        pickText(taskResponse?.code, (localTask as any)?.code) ||
        createEmptyTaskFormData().code,
      name: pickText(taskResponse?.name, localTask?.name),
      mode:
        taskResponse?.origin === "PLANNED" || localTask?.planId
          ? "plan"
          : "phat-sinh",
      objectiveType: (planMatch
        ? PURPOSE_TO_OBJECTIVE_TYPE[planMatch.purpose as Plan["purpose"]] ??
          "phat-sinh"
        : "phat-sinh") as TaskObjectiveType,
      planId:
        taskResponse?.plan?.id
          ? String(taskResponse.plan.id)
          : (localTask as any)?.planId || "",
      planName: pickText(taskResponse?.plan?.name, localTask?.plan),
      mainTaskId: (localTask as any)?.mainTaskId || mainTaskIds[0] || "",
      mainTaskIds,
      selectedStages,
      selectedPlotIds,
      regimenId: String((taskResponse as any)?.workflow?.id || ""),
      assignedType:
        localTask?.assignedType || apiTask?.assignedType || "individual",
      assignedTo: pickArray(localTask?.assignedTo, apiTask?.assignedTo),
      supervisors: pickArray(localTask?.supervisors, apiTask?.supervisors),
      qualityInspectors:
        pickArray(localTask?.qualityInspectors, apiTask?.qualityInspectors),
      startDate:
        pickText(taskResponse?.startDate, localTask?.startDate) ||
        new Date().toISOString().split("T")[0],
      endDate:
        pickText(taskResponse?.endDate, localTask?.endDate) ||
        new Date().toISOString().split("T")[0],
      priority: localTask?.priority || apiTask?.priority || "medium",
      description: pickText(taskResponse?.note, localTask?.description),
      materials: hydratedMaterials,
      tasks: seededTask,
    });
  }, [
    taskResponse,
    localTask,
    planDetailQuery.data,
    plans,
    amendmentPlans,
  ]);

  const activePlans = useMemo(() => {
    const basePlans = plans.filter((p) => {
      if (formData.objectiveType === "theo-ke-hoach")
        return p.purpose === "cultivation";
      if (formData.objectiveType === "thu-hoach")
        return p.purpose === "harvest";
      if (formData.objectiveType === "tri-benh")
        return p.purpose === "treatment";
      if (formData.objectiveType === "cai-tao-dat")
        return p.purpose === "amendment";
      return false;
    });

    if (formData.objectiveType === "cai-tao-dat") {
      return [...basePlans, ...amendmentPlans];
    }
    return basePlans;
  }, [formData.objectiveType, plans, amendmentPlans]);

  const filteredPlans = useMemo(() => {
    const query = planSearchTerm.trim().toLowerCase();
    if (!query) return plans;

    return plans.filter((plan) =>
      `${plan.name} ${plan.code}`.toLowerCase().includes(query),
    );
  }, [plans, planSearchTerm]);

  const apiPlans = useMemo(
    () => workflowPlansQuery.items.map(mapPlanResponseToPlan),
    [workflowPlansQuery.items],
  );
  const planOptionsFromApi = useMemo(() => {
    const query = planSearchTerm.trim().toLowerCase();
    if (!query) return apiPlans;
    return apiPlans.filter((plan) =>
      `${plan.name} ${plan.code}`.toLowerCase().includes(query),
    );
  }, [apiPlans, planSearchTerm]);

  // Phát sinh tasks aren't scoped to a purpose, so they can reference any
  // plan directly instead of the purpose-filtered `activePlans` list.
  const selectedPlan =
    (planDetailQuery.data
      ? mapPlanResponseToPlan(planDetailQuery.data)
      : undefined) ||
    apiPlans.find((plan) => String(plan.id) === formData.planId) ||
    (
      formData.mode === "phat-sinh" ? plans : (activePlans as any[])
    ).find((p: any) => String(p.id) === formData.planId);
  const mergedPlanOptions = [
    ...planOptionsFromApi,
    ...filteredPlans.filter(
      (plan) =>
        !planOptionsFromApi.some(
          (apiPlan) => String(apiPlan.id) === String(plan.id),
        ),
    ),
  ];
  const planOptionsForSelect =
    selectedPlan &&
    !mergedPlanOptions.some(
      (plan) => String(plan.id) === String(selectedPlan.id),
    )
      ? [selectedPlan, ...mergedPlanOptions]
      : mergedPlanOptions;

  const { regions, getRegionById } = useRegionStore();

  const planScopedRegions = useMemo(() => {
    const apiScopes = planScopes;
    if (apiScopes.length > 0) {
      const groupedRegions = new Map<string, any>();

      apiScopes.forEach((scope) => {
        const region =
          scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
        if (!region) return;

        const regionKey = String(region.id);
        const regionEntry =
          groupedRegions.get(regionKey) ??
          ({
            id: regionKey,
            name: region.name || `Vùng #${region.id}`,
            enterpriseId:
              (planDetailQuery.data as any)?.enterpriseId ||
              selectedEnterpriseId ||
              undefined,
            subAreas: [],
          } as any);

        if (scope.scopeType === "REGION") {
          groupedRegions.set(regionKey, regionEntry);
          return;
        }

        if (scope.scopeType === "AREA" && scope.area) {
          const areaKey = String(scope.area.id);
          const existingArea = regionEntry.subAreas.find(
            (area: any) => area.id === areaKey,
          );
          if (!existingArea) {
            regionEntry.subAreas.push({
              id: areaKey,
              name: scope.area.name || `Khu vực #${scope.area.id}`,
              plots: [],
            });
          }
          groupedRegions.set(regionKey, regionEntry);
          return;
        }

        if (scope.scopeType === "PLOT" && scope.plot) {
          const area = scope.area ?? scope.plot.area;
          if (!area) return;
          const areaKey = String(area.id);
          const existingArea = regionEntry.subAreas.find(
            (item: any) => item.id === areaKey,
          );
          const areaEntry =
            existingArea ??
            {
              id: areaKey,
              name: area.name || `Khu vực #${area.id}`,
              plots: [],
            };

          const plotKey = String(scope.plot.id);
          if (!areaEntry.plots.some((plot: any) => plot.id === plotKey)) {
            areaEntry.plots.push({
              id: plotKey,
              name: scope.plot.name || `Lô #${scope.plot.id}`,
            });
          }

          if (!existingArea) {
            regionEntry.subAreas.push(areaEntry);
          }

          groupedRegions.set(regionKey, regionEntry);
        }
      });

      return Array.from(groupedRegions.values());
    }

    if (!selectedPlan) return [];

    const regionIds = ((selectedPlan as any).selectedRegionIds || []).map(
      String,
    );
    const zoneIds = ((selectedPlan as any).selectedZoneIds || []).map(String);
    const plotIds = ((selectedPlan as any).selectedPlotIds || []).map(String);
    if (!regionIds.length && !zoneIds.length && !plotIds.length) return [];

    return regions
      .map((region: any) => {
        const regionId = String(region.id);
        const isWholeRegionSelected = regionIds.includes(regionId);

        if (isWholeRegionSelected) return region;

        const subAreas = (region.subAreas || [])
          .map((area: any) => {
            const areaId = String(area.id);
            const isWholeAreaSelected = zoneIds.includes(areaId);

            if (isWholeAreaSelected) return area;

            const plots = (area.plots || []).filter((plot: any) =>
              plotIds.includes(String(plot.id)),
            );

            return plots.length > 0 ? { ...area, plots } : null;
          })
          .filter(Boolean);

        return subAreas.length > 0 ? { ...region, subAreas } : null;
      })
      .filter(Boolean) as any[];
  }, [planScopes, regions, selectedPlan, selectedEnterpriseId]);

  const filteredRegionsForPhatSinh = useMemo(() => {
    if (formData.objectiveType !== "phat-sinh" || selections.length === 0) {
      return regions;
    }

    return regions
      .map((region) => {
        // If the region itself is selected, keep it entire
        const isRegionSelected = selections.some(
          (s) =>
            s.type === "region" && String(s.regionId) === String(region.id),
        );
        if (isRegionSelected) return region;

        // If not, filter its sub-areas
        const filteredSubAreas = (region.subAreas || [])
          .map((area) => {
            // If the area itself is selected, keep it entire
            const isAreaSelected = selections.some(
              (s) => s.type === "area" && String(s.areaId) === String(area.id),
            );
            if (isAreaSelected) return area;

            // If not, filter its plots
            const filteredPlots = (area.plots || []).filter((plot) =>
              selections.some(
                (s) =>
                  s.type === "plot" && String(s.plotId) === String(plot.id),
              ),
            );

            if (filteredPlots.length > 0) {
              return { ...area, plots: filteredPlots };
            }
            return null;
          })
          .filter(Boolean) as any[];

        if (filteredSubAreas.length > 0) {
          return { ...region, subAreas: filteredSubAreas };
        }
        return null;
      })
      .filter(Boolean) as any[];
  }, [regions, selections, formData.objectiveType]);

  const getSelectionSummary = (
    targetSelections: GeographicalSelection[],
    sourceRegions = regions,
  ) => {
    if (!targetSelections || targetSelections.length === 0) return [];
    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    targetSelections.forEach((sel) => {
      const regionFromSource = sourceRegions.find(
        (item) => String(item.id) === String(sel.regionId),
      );
      const region = regionFromSource || getRegionById(Number(sel.regionId));
      if (!region) return;
      let regionGroup = summary.find((s) => s.regionId === String(region.id));
      if (!regionGroup) {
        regionGroup = {
          regionId: String(region.id),
          regionName: region.name,
          items: [],
        };
        summary.push(regionGroup);
      }
      if (sel.type === "region") {
        regionGroup.items.push({
          type: "region",
          id: String(region.id),
          name: `Toàn bộ ${region.name}`,
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        if (area)
          regionGroup.items.push({
            type: "area",
            id: String(area.id),
            name: area.name,
          });
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p) => String(p.id) === String(sel.plotId),
        );
        if (plot)
          regionGroup.items.push({
            type: "plot",
            id: String(plot.id),
            name: plot.name,
            parentName: area?.name,
          });
      }
    });
    return summary;
  };

  if (taskLoading && !task) {
    return <AppLoadingState />;
  }

  if (!task) {
    return (
      <PageWrapper
        title="Chỉnh sửa công việc"
        description="Không tìm thấy công việc cần chỉnh sửa"
        actions={
          <Button variant="ghost" onClick={() => setLocation("/task")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        }
      >
        <Card className="max-w-xl mx-auto border-dashed">
          <CardContent className="py-12 text-center text-sm text-slate-500">
            Không tìm thấy công việc #{params.id}.
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const handleAddMaterial = (item?: Omit<MaterialAllocation, "id">) => {
    if (item) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, { id: Date.now(), ...item }],
      }));
      return;
    }
    if (!newMaterial.name || !newMaterial.quantity) return;
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: Date.now(),
          stageId: "",
          materialCategory: newMaterial.type,
          materialType: newMaterial.type,
          materialName: newMaterial.name,
          name: newMaterial.name,
          quantity: newMaterial.quantity,
          unit: newMaterial.unit,
          type: newMaterial.type,
        },
      ],
    }));
    setNewMaterial({
      type: newMaterial.type,
      name: "",
      quantity: "",
      unit: "kg",
    });
  };

  const handleAddTask = (item: Omit<TaskAllocation, "id">) => {
    // Use the Step 1 scope as the default unless the selected task has its own.
    const geoMapping =
      item.geographicalSelections && item.geographicalSelections.length > 0
        ? item.geographicalSelections
        : selections;

    setFormData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: Date.now(), ...item, geographicalSelections: geoMapping },
      ],
    }));
  };

  const handleUpdateTask = (
    id: number,
    updatedTask: Partial<TaskAllocation>,
  ) => {
    setFormData((prev) => {
      const tasks = prev.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task,
      );
      const updatedTaskRow = tasks.find((task) => task.id === id);
      const hasStartDate = Object.prototype.hasOwnProperty.call(
        updatedTask,
        "startDate",
      );
      const hasEndDate = Object.prototype.hasOwnProperty.call(
        updatedTask,
        "endDate",
      );

      return {
        ...prev,
        tasks,
        ...(hasStartDate && updatedTaskRow
          ? { startDate: updatedTaskRow.startDate || prev.startDate }
          : {}),
        ...(hasEndDate && updatedTaskRow
          ? { endDate: updatedTaskRow.endDate || prev.endDate }
          : {}),
      };
    });
  };

  const handleRemoveTask = (taskId: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateMaterial = (
    id: number,
    updatedMaterial: Partial<MaterialAllocation>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.map((m) =>
        m.id === id ? { ...m, ...updatedMaterial } : m,
      ),
    }));
  };

  const handleComplete = async () => {
    if (!task || !taskResponse) return;

    const taskExecutorNames = formData.tasks.flatMap((item) => {
      const labor = item.labor || "";
      return labor.includes(":")
        ? labor
            .split(":")[1]
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean)
        : [];
    });
    const executorNames = Array.from(
      new Set([...formData.assignedTo, ...taskExecutorNames]),
    );

    const personnelRequests = [
      ...formData.supervisors
        .map((name) => personnel.find((item) => item.fullName === name)?.id)
        .filter((id): id is number => typeof id === "number")
        .map((personnelId) => ({
          personnelId,
          role: "MANAGER" as const,
        })),
      ...formData.qualityInspectors
        .map((name) => personnel.find((item) => item.fullName === name)?.id)
        .filter((id): id is number => typeof id === "number")
        .map((personnelId) => ({
          personnelId,
          role: "QUALITY_INSPECTOR" as const,
        })),
      ...executorNames
        .map((name) => personnel.find((item) => item.fullName === name)?.id)
        .filter((id): id is number => typeof id === "number")
        .map((personnelId) => ({
          personnelId,
          role: "EXECUTOR" as const,
        })),
    ];

    const repeatDates = (formData.tasks[0]?.repeatDates || []).filter(Boolean);
    const recurrence =
      formData.tasks[0]?.isRepeating && repeatDates.length > 0
        ? {
            repeatMode: "SPECIFIC_DATES" as const,
            repeatDates,
          }
        : {
            repeatMode: "NONE" as const,
            repeatDates: null,
          };

    const existingScope =
      taskResponse.scopeType === "REGION"
        ? {
            scopeType: "REGION" as const,
            scopeId: taskResponse.region?.id ?? null,
          }
        : taskResponse.scopeType === "AREA"
          ? {
              scopeType: "AREA" as const,
              scopeId: taskResponse.area?.id ?? null,
            }
          : taskResponse.scopeType === "PLOT"
            ? {
                scopeType: "PLOT" as const,
                scopeId: taskResponse.plot?.id ?? null,
              }
            : {
                scopeType: null,
                scopeId: null,
              };

    const selectedScope =
      selections.length > 0
        ? mapSelectionsToScope(selections)
        : existingScope;
    const isPlanned = formData.mode === "plan";

    const payload: FarmTaskRequest = {
      origin: isPlanned ? "PLANNED" : "AD_HOC",
      ...(isPlanned
        ? {
            sourceWorkItemId: toFiniteNumber(
              formData.mainTaskId || formData.mainTaskIds[0],
            ),
          }
        : {
            workflowId: toFiniteNumber(formData.regimenId),
            taskCategoryId:
              (formData.tasks[0] as TaskAllocation)?.taskCategoryId ??
              taskResponse.taskCategory?.id ??
              (selectedPlan?.taskAllocations[0] as any)?.taskCategoryId ??
              null,
          }),
      // `planId` is also used for an AD_HOC task's reference plan.
      planId: toFiniteNumber(formData.planId),
      scopeType: selectedScope.scopeType,
      scopeId: selectedScope.scopeId,
      name: formData.name,
      priority: mapPriorityToApi(formData.priority),
      note: formData.description || null,
      personnel: personnelRequests,
      startDate: formData.startDate,
      endDate: formData.endDate,
      recurrence,
      supplyLines: formData.materials
        .map((material) => {
          const planMaterials = selectedPlan?.materialAllocations || [];
          const planMaterial =
            planMaterials.find(
              (candidate: any) =>
                candidate.materialName === material.materialName &&
                candidate.stageId === material.stageId,
            ) ||
            planMaterials.find(
              (candidate: any) =>
                candidate.materialName === material.materialName,
            );
          const catalogMaterial = apiSupplyMaterials.find(
            (candidate) =>
              candidate.materialName === material.materialName ||
              candidate.supplyItemId === material.supplyItemId,
          );
          const supplyItemId = toFiniteNumber(
            material.supplyItemId ??
              planMaterial?.supplyItemId ??
              catalogMaterial?.supplyItemId,
          );
          const unitBaseId = toFiniteNumber(
            material.unitBaseId ??
              planMaterial?.unitBaseId ??
              catalogMaterial?.unitBaseId,
          );
          return supplyItemId !== null && unitBaseId !== null
            ? {
                supplyItemId,
                unitBaseId,
                quantity: Number(material.quantity) || 0,
              }
            : null;
        })
        .filter(
          (line): line is {
            supplyItemId: number;
            unitBaseId: number;
            quantity: number;
          } => line !== null,
        ),
      status: taskResponse.status,
    };

    await updateTaskMutation.updateFarmTask({
      id: task.id,
      payload,
    });
  };

  // Plan personnel are stored as ids; the task form works with display names.
  const resolvePersonnelNames = (ids?: string[]) =>
    (ids || [])
      .map(
        (id) =>
          personnel.find((p) => String(p.id) === String(id))?.fullName || "",
      )
      .filter(Boolean);

  const steps: Step[] = [
    {
      id: "objective",
      title: "Công việc triển khai",
      description: "Thông tin mô tả công việc",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">
                    Loại công việc *
                  </Label>
                  <div
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4",
                      formData.planId && "cursor-not-allowed opacity-70",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                          formData.mode === "plan"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-50 text-slate-400",
                        )}
                      >
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-xs font-black uppercase tracking-tight",
                            formData.mode === "plan"
                              ? "text-blue-700"
                              : "text-slate-400",
                          )}
                        >
                          Hạng mục dự kiến
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Từ một kế hoạch có sẵn
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={formData.mode === "phat-sinh"}
                      disabled={!!formData.planId}
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-blue-500"
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          mode: checked ? "phat-sinh" : "plan",
                          // Reset to a neutral placeholder — picking a plan
                          // below immediately derives the real value from
                          // its purpose.
                          objectiveType: "phat-sinh",
                          planId: "",
                          planName: "",
                          mainTaskIds: [],
                          selectedPlotIds: [],
                        });
                        setSelections([]);
                        setPlanSearchTerm("");
                      }}
                    />

                    <div className="flex items-center gap-3">
                      <div>
                        <p
                          className={cn(
                            "text-xs font-black uppercase tracking-tight text-right",
                            formData.mode === "phat-sinh"
                              ? "text-amber-700"
                              : "text-slate-400",
                          )}
                        >
                          Phát sinh
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium text-right">
                          Ngoài kế hoạch
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                          formData.mode === "phat-sinh"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-50 text-slate-400",
                        )}
                      >
                        <Info className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">
                    {formData.mode === "phat-sinh"
                      ? "Công việc phát sinh *"
                      : "Hạng mục công việc triển khai *"}
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Bón phân thúc đợt 1"
                  />
                </div>

                {formData.mode === "plan" && (
                  <div className="space-y-6 animation-fade-in border-t pt-6 mt-6 border-slate-100">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Thông tin kế hoạch triển khai *
                        </Label>
                        <Select
                          value={formData.planId}
                          disabled={!!formData.planId}
                          onValueChange={(val) => {
                            const p = plans.find((p) => String(p.id) === val);
                            // Carry the plan's personnel across as a starting
                            // point; they stay removable below.
                            const planSupervisors = resolvePersonnelNames(
                              (p as any)?.managementPersonnelIds,
                            );
                            const planInspectors = resolvePersonnelNames(
                              (p as any)?.qualityInspectorPersonnelIds,
                            );
                            setFormData({
                              ...formData,
                              planId: val,
                              planName: p?.name || "",
                              objectiveType: p
                                ? (PURPOSE_TO_OBJECTIVE_TYPE[p.purpose] ??
                                  "phat-sinh")
                                : "phat-sinh",
                              mainTaskIds: [],
                              selectedPlotIds: [],
                              supervisors: planSupervisors,
                              qualityInspectors: planInspectors,
                            });
                            setSelections([]);
                            setPlanSearchTerm("");
                          }}
                        >
                          <SelectTrigger className="h-12 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-80">
                            <SelectValue placeholder="Chọn kế hoạch áp dụng..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-hidden p-0">
                            <div
                              className="sticky top-0 z-10 border-b border-slate-100 bg-white p-2"
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                  value={planSearchTerm}
                                  onChange={(event) =>
                                    setPlanSearchTerm(event.target.value)
                                  }
                                  onClick={(event) => event.stopPropagation()}
                                  onPointerDown={(event) =>
                                    event.stopPropagation()
                                  }
                                  placeholder="Tìm theo tên hoặc mã kế hoạch..."
                                  className="h-9 pl-8 text-sm"
                                />
                              </div>
                            </div>
                            <>
                              {filteredPlans.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  {p.name} ({p.code})
                                </SelectItem>
                              ))}
                              {filteredPlans.length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                  Không tìm thấy kế hoạch phù hợp
                                </div>
                              )}
                            </>
                          </SelectContent>
                        </Select>
                        {formData.planId && (
                          <p className="text-[11px] font-medium text-slate-400">
                            Kế hoạch đã được cố định cho công việc đang chỉnh
                            sửa.
                          </p>
                        )}

                        {formData.planId && selectedPlan && (
                          <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <Label className="text-sm font-bold text-slate-700">
                                  Phạm vi thực hiện từ kế hoạch
                                  <span className="text-red-500"> *</span>
                                </Label>
                                <p className="mt-1 text-[11px] font-medium text-slate-400">
                                  Phạm vi được lấy trực tiếp từ kế hoạch triển
                                  khai đã chọn.
                                </p>
                              </div>
                            </div>

                            {planScopedRegions.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-xs italic text-slate-400">
                                Kế hoạch này chưa có phạm vi canh tác để chọn.
                              </div>
                            ) : selections.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-emerald-200 bg-white/70 px-4 py-3 text-xs italic text-slate-400">
                                Chưa chọn vùng canh tác cụ thể.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {getSelectionSummary(
                                  selections,
                                  planScopedRegions,
                                ).map(
                                  (group) => (
                                    <div
                                      key={group.regionId}
                                      className="rounded-xl border border-emerald-100 bg-white/80 p-3"
                                    >
                                      <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {group.regionName}
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                          <Badge
                                            key={`${item.type}-${item.id}`}
                                            variant="outline"
                                            className="h-auto border-emerald-100 bg-emerald-50/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                                          >
                                            {item.name}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Thông tin kế hoạch chi tiết */}
                        {formData.planId && selectedPlan && (
                          <div className="p-6 rounded-md bg-white border border-slate-200/60 space-y-5 animation-slide-up shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm bg-blue-50 text-blue-600">
                                  <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1.5">
                                    Chi tiết kế hoạch
                                  </h4>
                                  <p className="text-base font-bold text-slate-900 leading-none">
                                    {selectedPlan.name}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px] px-2.5 py-0.5 border-slate-200 text-slate-500 bg-slate-50/50"
                              >
                                {selectedPlan.code}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm relative z-10">
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Thời hạn thực hiện
                                </span>
                                <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100/50">
                                  <CalendarIcon className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="font-bold">
                                    {selectedPlan.startDate} →{" "}
                                    {selectedPlan.endDate}
                                  </span>
                                </div>
                              </div>

                              {selectedPlan.crop && (
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Cây trồng & Giống
                                  </span>
                                  <div className="flex items-center gap-2.5 text-slate-700 bg-blue-50/30 p-2 rounded-xl border border-blue-100/50">
                                    <Sprout className="w-4 h-4 text-green-500 shrink-0" />
                                    <span className="font-bold">
                                      {selectedPlan.crop} -{" "}
                                      {selectedPlan.variety || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.mode === "phat-sinh" && (
                  <div className="space-y-6 animation-fade-in border-t pt-6 mt-6 border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">
                        Quy trình *
                      </Label>
                      <Select
                        value={formData.regimenId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            regimenId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn quy trình..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {workflowsQuery.items.map((workflow) => (
                            <SelectItem
                              key={workflow.id}
                              value={String(workflow.id)}
                            >
                              {workflow.code
                                ? `${workflow.code} - ${workflow.name}`
                                : workflow.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">
                        Kế hoạch triển khai tham chiếu
                        <span className="ml-2 text-[10px] font-medium text-slate-400 normal-case">
                          Không bắt buộc — dùng để giới hạn vùng canh tác bên
                          dưới
                        </span>
                      </Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(val) => {
                          const p = planOptionsForSelect.find(
                            (p) => String(p.id) === val,
                          );
                          const plan = p as any;
                          const planMaterials = (plan?.materialAllocations || []).map(
                            (material: any) => ({
                              ...material,
                              id: Date.now() + Math.random(),
                              stageId: "Công việc phát sinh",
                            }),
                          );
                          const planTasks = (plan?.taskAllocations || []).map(
                            (task: any) => ({
                              ...task,
                              id: Date.now() + Math.random(),
                              stageId: "Công việc phát sinh",
                            }),
                          );
                          const planPersonnel = plan?.personnel || [];
                          setFormData((prev) => ({
                            ...prev,
                            planId: val,
                            planName: p?.name || "",
                            selectedPlotIds: [],
                            materials:
                              planMaterials.length > 0
                                ? planMaterials
                                : prev.materials,
                            tasks: planTasks.length > 0 ? planTasks : prev.tasks,
                            assignedTo: planPersonnel
                              .filter((person: any) => person.role === "EXECUTOR")
                              .map((person: any) => person.fullName)
                              .filter(Boolean),
                            supervisors: planPersonnel
                              .filter((person: any) => person.role === "MANAGER")
                              .map((person: any) => person.fullName)
                              .filter(Boolean),
                            qualityInspectors: planPersonnel
                              .filter(
                                (person: any) =>
                                  person.role === "QUALITY_INSPECTOR",
                              )
                              .map((person: any) => person.fullName)
                              .filter(Boolean),
                            startDate: plan.startDate || prev.startDate,
                            endDate: plan.endDate || prev.endDate,
                          }));
                          setSelections([]);
                          setPlanSearchTerm("");
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn kế hoạch áp dụng..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-hidden p-0">
                          <div
                            className="sticky top-0 z-10 border-b border-slate-100 bg-white p-2"
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                              <Input
                                value={planSearchTerm}
                                onChange={(event) =>
                                  setPlanSearchTerm(event.target.value)
                                }
                                onClick={(event) => event.stopPropagation()}
                                onPointerDown={(event) =>
                                  event.stopPropagation()
                                }
                                placeholder="Tìm theo tên hoặc mã kế hoạch..."
                                className="h-9 pl-8 text-sm"
                              />
                            </div>
                          </div>
                          <>
                            {planOptionsForSelect.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} ({p.code})
                              </SelectItem>
                            ))}
                            {planOptionsForSelect.length === 0 && (
                              <div className="p-4 text-center text-xs text-slate-400 italic">
                                Không tìm thấy kế hoạch phù hợp
                              </div>
                            )}
                          </>
                        </SelectContent>
                      </Select>

                      {formData.planId && selectedPlan && (
                        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <Label className="text-sm font-bold text-slate-700">
                                Vùng canh tác từ kế hoạch
                                <span className="text-red-500"> *</span>
                              </Label>
                              <p className="mt-1 text-[11px] font-medium text-slate-400">
                                Chỉ chọn được vùng/khu/lô thuộc kế hoạch triển
                                khai đã chọn.
                              </p>
                            </div>
                            <GeographicalSelector
                              regions={planScopedRegions}
                              enterpriseId={
                                selectedEnterpriseId ||
                                (selectedPlan as any)?.enterpriseId ||
                                ""
                              }
                              existingSelections={selections}
                              onConfirm={(nextSelections) => {
                                setSelections(nextSelections);
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedPlotIds: nextSelections
                                    .filter((item) => item.type === "plot")
                                    .map((item) => String(item.plotId)),
                                }));
                              }}
                              disabled={planScopedRegions.length === 0}
                            />
                          </div>

                          {planScopedRegions.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-xs italic text-slate-400">
                              Kế hoạch này chưa có phạm vi canh tác để chọn.
                            </div>
                          ) : selections.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-emerald-200 bg-white/70 px-4 py-3 text-xs italic text-slate-400">
                              Chưa chọn vùng canh tác cụ thể.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              {getSelectionSummary(
                                selections,
                                planScopedRegions,
                              ).map((group) => (
                                <div
                                  key={group.regionId}
                                  className="rounded-xl border border-emerald-100 bg-white/80 p-3"
                                >
                                  <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {group.regionName}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {group.items.map((item) => (
                                      <Badge
                                        key={`${item.type}-${item.id}`}
                                        variant="outline"
                                        className="h-auto border-emerald-100 bg-emerald-50/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                                      >
                                        {item.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1. Nhân sự quản lý */}
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      {/* <Shield className="w-4 h-4 text-blue-500" /> */}
                      Nhân sự quản lý
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsSupervisorDialogOpen(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.supervisors.map((name) => {
                      const item = personnel.find((p) => p.fullName === name);
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 rounded-2xl border bg-blue-50/30 border-blue-100 group hover:border-blue-200 transition-all animate-in fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm flex items-center justify-center shrink-0">
                              {item?.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Shield className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-none">
                                {name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item?.taxCode || "Quản lý"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                supervisors: prev.supervisors.filter(
                                  (n) => n !== name,
                                ),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                    {formData.supervisors.length === 0 && (
                      <div className="py-5 border-2 border-dashed border-blue-100 rounded-2xl flex flex-col items-center justify-center bg-blue-50/20">
                        <Shield className="w-6 h-6 text-blue-200 mb-1" />
                        <p className="text-xs text-slate-400 italic">
                          Chưa có nhân sự quản lý
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Nhân sự kiểm định chất lượng */}
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      {/* <ClipboardCheck className="w-4 h-4 text-violet-500" /> */}
                      Kiểm định chất lượng
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={() => setIsInspectorDialogOpen(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.qualityInspectors.map((name) => {
                      const item = personnel.find((p) => p.fullName === name);
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 rounded-2xl border bg-violet-50/30 border-violet-100 group hover:border-violet-200 transition-all animate-in fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm flex items-center justify-center shrink-0">
                              {item?.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ClipboardCheck className="w-4 h-4 text-violet-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-none">
                                {name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item?.taxCode || "Kiểm định"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                qualityInspectors:
                                  prev.qualityInspectors.filter(
                                    (n) => n !== name,
                                  ),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                    {formData.qualityInspectors.length === 0 && (
                      <div className="py-5 border-2 border-dashed border-violet-100 rounded-2xl flex flex-col items-center justify-center bg-violet-50/20">
                        <ClipboardCheck className="w-6 h-6 text-violet-200 mb-1" />
                        <p className="text-xs text-slate-400 italic">
                          Chưa có nhân sự kiểm định
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supervisor Selection Dialog */}
                <Dialog
                  open={isSupervisorDialogOpen}
                  onOpenChange={setIsSupervisorDialogOpen}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-3 border-b">
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" /> Chọn nhân
                        sự quản lý
                      </DialogTitle>
                    </DialogHeader>
                    <div className="px-5 pb-3 pt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                          placeholder="Tìm theo tên hoặc mã..."
                          className="pl-9 h-9 text-sm"
                          value={searchSupervisor}
                          onChange={(e) => setSearchSupervisor(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            p.fullName
                              .toLowerCase()
                              .includes(searchSupervisor.toLowerCase()),
                          )
                          .map((p) => {
                            const isSelected = formData.supervisors.includes(
                              p.fullName,
                            );
                            return (
                              <button
                                key={p.id}
                                type="button"
                                className={cn(
                                  "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                  isSelected
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-white border-transparent hover:border-slate-200",
                                )}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    supervisors: isSelected
                                      ? prev.supervisors.filter(
                                          (n) => n !== p.fullName,
                                        )
                                      : [...prev.supervisors, p.fullName],
                                  }))
                                }
                              >
                                <div className="h-9 w-9 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                                  {p.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-4 h-4 text-blue-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {p.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {p.taxCode || "—"}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 bg-slate-50 border-t">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsSupervisorDialogOpen(false)}
                      >
                        Xác nhận ({formData.supervisors.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Quality Inspector Selection Dialog */}
                <Dialog
                  open={isInspectorDialogOpen}
                  onOpenChange={setIsInspectorDialogOpen}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-3 border-b">
                      <DialogTitle className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-violet-500" />{" "}
                        Chọn nhân sự kiểm định chất lượng
                      </DialogTitle>
                    </DialogHeader>
                    <div className="px-5 pb-3 pt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                          placeholder="Tìm theo tên hoặc mã..."
                          className="pl-9 h-9 text-sm"
                          value={searchInspector}
                          onChange={(e) => setSearchInspector(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            p.fullName
                              .toLowerCase()
                              .includes(searchInspector.toLowerCase()),
                          )
                          .map((p) => {
                            const isSelected =
                              formData.qualityInspectors.includes(p.fullName);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                className={cn(
                                  "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                  isSelected
                                    ? "bg-violet-50 border-violet-200"
                                    : "bg-white border-transparent hover:border-slate-200",
                                )}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    qualityInspectors: isSelected
                                      ? prev.qualityInspectors.filter(
                                          (n) => n !== p.fullName,
                                        )
                                      : [...prev.qualityInspectors, p.fullName],
                                  }))
                                }
                              >
                                <div className="h-9 w-9 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                                  {p.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-4 h-4 text-violet-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {p.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {p.taxCode || "—"}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 bg-slate-50 border-t">
                      <Button
                        className="w-full bg-violet-600 hover:bg-violet-700"
                        onClick={() => setIsInspectorDialogOpen(false)}
                      >
                        Xác nhận ({formData.qualityInspectors.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-primary" />
                  Ưu tiên & Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Độ ưu tiên *
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "low",
                        label: "Thấp",
                        color: "emerald",
                        activeClass:
                          "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200",
                        inactiveClass:
                          "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
                      },
                      {
                        id: "medium",
                        label: "Thường",
                        color: "amber",
                        activeClass:
                          "bg-amber-500 text-white border-amber-500 shadow-amber-200",
                        inactiveClass:
                          "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
                      },
                      {
                        id: "high",
                        label: "Cao",
                        color: "rose",
                        activeClass:
                          "bg-rose-500 text-white border-rose-500 shadow-rose-200",
                        inactiveClass:
                          "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100",
                      },
                    ].map((p) => (
                      <div
                        key={p.id}
                        onClick={() =>
                          setFormData({ ...formData, priority: p.id as any })
                        }
                        className={cn(
                          "cursor-pointer px-2 py-3 rounded-xl border-2 text-center text-[10px] font-black uppercase transition-all shadow-sm",
                          formData.priority === p.id
                            ? `${p.activeClass} scale-105`
                            : p.inactiveClass,
                        )}
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Ghi chú
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả chi tiết công việc..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "resources",
      title:
        formData.objectiveType === "theo-ke-hoach" ||
        formData.objectiveType === "cai-tao-dat"
          ? "Phân bổ & Công việc"
          : formData.objectiveType === "thu-hoach"
            ? "Phân bổ công việc"
            : formData.objectiveType === "phat-sinh"
              ? "Vật tư & Nhân sự"
              : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {formData.objectiveType === "theo-ke-hoach" ||
              formData.objectiveType === "cai-tao-dat"
                ? "Định mức Vật tư & Giai đoạn"
                : formData.objectiveType === "thu-hoach"
                  ? "Liệt kê Công việc Thu hoạch"
                  : formData.objectiveType === "phat-sinh"
                    ? "Vật tư & Công việc Phát sinh"
                    : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {formData.objectiveType === "theo-ke-hoach" ||
              formData.objectiveType === "cai-tao-dat"
                ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của mùa vụ."
                : formData.objectiveType === "thu-hoach"
                  ? "Phân công nguồn lực nội đô để phục vụ và hỗ trợ việc thu hoạch này."
                  : formData.objectiveType === "phat-sinh"
                    ? "Phân bổ vật tư và nhân sự cần thiết cho công việc phát sinh ngoài kế hoạch."
                    : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.objectiveType === "theo-ke-hoach" ||
            formData.objectiveType === "thu-hoach" ||
            formData.objectiveType === "cai-tao-dat" ||
            formData.objectiveType === "tri-benh" ? (
              formData.selectedStages.length > 0 ? (
                formData.selectedStages.map((stageName) => (
                  <TaskStageAllocation
                    key={stageName}
                    stageName={stageName}
                    cycleName={
                      formData.objectiveType === "cai-tao-dat"
                        ? "Cải tạo đất"
                        : formData.objectiveType === "tri-benh"
                          ? "Điều trị bệnh"
                          : undefined
                    }
                    allocations={formData.materials.filter(
                      (m: any) => m.stageId === stageName,
                    )}
                    tasks={formData.tasks.filter(
                      (t: any) => t.stageId === stageName,
                    )}
                    onAddMaterial={(item: any) => handleAddMaterial(item)}
                    onRemoveMaterial={handleRemoveMaterial}
                    onUpdateMaterial={handleUpdateMaterial}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                    onUpdateTask={handleUpdateTask}
                    showTaskPicker
                    regions={regions}
                    personnel={personnel}
                    masterSelections={selections}
                    enterpriseId={
                      selectedEnterpriseId ||
                      (selectedPlan as any)?.enterpriseId ||
                      ""
                    }
                    availableTasks={selectedPlan?.taskAllocations?.filter(
                      (t: any) => t.stageId === stageName,
                    )}
                    availableMaterials={
                      formData.mode === "plan"
                        ? formData.materials.filter(
                            (material) => material.stageId === stageName,
                          )
                        : apiSupplyMaterials
                    }
                    availableMaterialsOnly={formData.mode === "plan"}
                    availableTasksOnly={formData.mode === "plan"}
                    availableTaskCategories={
                      formData.mode === "plan" ? [] : taskCategoriesQuery.items
                    }
                  />
                ))
              ) : formData.objectiveType === "thu-hoach" ? (
                <TaskStageAllocation
                  key="thu-hoach"
                  stageName="Công việc thu hoạch"
                  allocations={formData.materials.filter(
                    (m: any) => m.stageId === "Công việc thu hoạch",
                  )}
                  tasks={formData.tasks.filter(
                    (t: any) => t.stageId === "Công việc thu hoạch",
                  )}
                  onAddMaterial={(item: any) => handleAddMaterial(item)}
                  onRemoveMaterial={handleRemoveMaterial}
                  onUpdateMaterial={handleUpdateMaterial}
                  onAddTask={handleAddTask}
                  onRemoveTask={handleRemoveTask}
                  onUpdateTask={handleUpdateTask}
                  showTaskPicker
                  regions={regions}
                  personnel={personnel}
                  masterSelections={selections}
                  enterpriseId={
                    selectedEnterpriseId ||
                    (selectedPlan as any)?.enterpriseId ||
                    ""
                  }
                  availableTasks={selectedPlan?.taskAllocations}
                  availableMaterials={
                    formData.mode === "plan"
                      ? formData.materials
                      : apiSupplyMaterials
                  }
                  availableMaterialsOnly={formData.mode === "plan"}
                  availableTasksOnly={formData.mode === "plan"}
                  availableTaskCategories={
                    formData.mode === "plan" ? [] : taskCategoriesQuery.items
                  }
                />
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                  <p className="text-slate-400 font-medium italic">
                    Vui lòng chọn giai đoạn thực hiện ở bước trước.
                  </p>
                </div>
              )
            ) : formData.objectiveType === "phat-sinh" ? (
              <TaskStageAllocation
                key="phat-sinh"
                stageName="Công việc phát sinh"
                cycleName="Phát sinh"
                allocations={formData.materials.filter(
                  (m: any) => m.stageId === "Công việc phát sinh",
                )}
                tasks={formData.tasks.filter(
                  (t: any) => t.stageId === "Công việc phát sinh",
                )}
                onAddMaterial={(item) => handleAddMaterial(item)}
                onRemoveMaterial={handleRemoveMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onAddTask={handleAddTask}
                onRemoveTask={handleRemoveTask}
                onUpdateTask={handleUpdateTask}
                showTaskPicker
                regions={filteredRegionsForPhatSinh}
                personnel={personnel}
                masterSelections={selections}
                enterpriseId={selectedEnterpriseId}
                availableTasks={
                  formData.mode === "phat-sinh"
                    ? undefined
                    : selectedPlan?.taskAllocations
                }
                availableMaterials={
                  formData.mode === "plan"
                    ? formData.materials
                    : apiSupplyMaterials
                }
                availableMaterialsOnly={formData.mode === "plan"}
                availableTasksOnly={formData.mode === "plan"}
                availableTaskCategories={
                  formData.mode === "plan" ? [] : taskCategoriesQuery.items
                }
              />
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận & Hoàn tất",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Identity banner */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-teal-50/40 p-6 shadow-sm">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow border border-emerald-100 flex items-center justify-center shrink-0">
                    {formData.objectiveType === "tri-benh" ? (
                      <Bug className="w-7 h-7 text-rose-500" />
                    ) : formData.objectiveType === "cai-tao-dat" ? (
                      <Sprout className="w-7 h-7 text-emerald-500" />
                    ) : formData.objectiveType === "phat-sinh" ? (
                      <Info className="w-7 h-7 text-amber-500" />
                    ) : (
                      <ClipboardList className="w-7 h-7 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 mb-0.5">
                      {formData.objectiveType === "theo-ke-hoach"
                        ? "Theo kế hoạch"
                        : formData.objectiveType === "cai-tao-dat"
                          ? "Cải tạo đất"
                          : formData.objectiveType === "tri-benh"
                            ? "Điều trị bệnh"
                            : "Công việc phát sinh"}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {formData.name || (
                        <span className="text-slate-400 italic font-normal">
                          Chưa đặt tên
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge
                        variant="outline"
                        className="bg-white/80 border-slate-200 text-slate-600 text-[11px] px-2 py-0.5 font-medium rounded-md"
                      >
                        <CalendarIcon className="w-3 h-3 mr-1 opacity-50" />
                        {`${formData.startDate} → ${formData.endDate}`}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-[11px] px-2 py-0.5 font-bold rounded-md border-transparent",
                          formData.priority === "high"
                            ? "bg-rose-500 text-white"
                            : formData.priority === "medium"
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-500 text-white",
                        )}
                      >
                        {formData.priority === "high"
                          ? "Ưu tiên cao"
                          : formData.priority === "medium"
                            ? "Ưu tiên thường"
                            : "Ưu tiên thấp"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Mã CV
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-700 bg-white border border-slate-100 px-2.5 py-1 rounded-lg shadow-sm">
                    {formData.code}
                  </p>
                </div>
              </div>
            </div>

            {/* Info rows card */}
            <Card className="border-slate-100">
              <CardContent className="p-0 divide-y divide-slate-50">
                {/* Plan & Stages row */}
                {formData.objectiveType !== "phat-sinh" && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Kế hoạch áp dụng
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {formData.planName || (
                          <span className="text-slate-400 italic font-normal">
                            Chưa chọn
                          </span>
                        )}
                      </p>
                      {formData.selectedStages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {formData.selectedStages.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0 h-5 font-medium"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {selections.length > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Phạm vi thực hiện
                        </p>
                        <div className="flex max-w-[220px] flex-wrap justify-end gap-1">
                          {getSelectionSummary(selections, planScopedRegions).flatMap(
                            (group) =>
                              group.items.map((item) => (
                                <Badge
                                  key={`${group.regionId}-${item.id}`}
                                  variant="secondary"
                                  className="text-[10px] bg-emerald-50 text-emerald-700 border-none px-2 py-0 h-5 font-medium"
                                >
                                  {item.name}
                                </Badge>
                              )),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Description row */}
                {formData.description && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                      <StickyNote className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Ghi chú
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {formData.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks and Materials List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-500" />
                  Danh sách công việc chi tiết
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 font-bold px-2 py-0"
                >
                  {formData.tasks.length} công việc
                </Badge>
              </div>

              {formData.tasks.length === 0 ? (
                <Card className="border-dashed border-slate-200 bg-slate-50/30">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-slate-400 italic">
                      Chưa có công việc nào được cấu hình
                    </p>
                  </CardContent>
                </Card>
              ) : (
                formData.tasks.map((task, taskIdx) => (
                  <Card
                    key={taskIdx}
                    className="border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Task Header */}
                    <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {taskIdx + 1}
                        </div>
                        <span className="font-bold text-slate-800 truncate">
                          {task.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-white border-slate-200 text-slate-500 py-0.5 px-2"
                      >
                        {task.isRepeating ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 opacity-60" />
                            {getRepeatDatesText(task.repeatDates || [])}
                          </>
                        ) : (
                          <>
                            <CalendarIcon className="w-3 h-3 mr-1 opacity-60" />
                            {task.startDate} → {task.endDate}
                          </>
                        )}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Labor & Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              Nhân sự
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.labor ? (
                                task.labor.includes(":") ? (
                                  task.labor
                                    .split(":")[1]
                                    .trim()
                                    .split("; ")
                                    .filter(Boolean)
                                    .map((name, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0 h-5 font-medium"
                                      >
                                        {name}
                                      </Badge>
                                    ))
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0 h-5 font-medium"
                                  >
                                    {task.labor}
                                  </Badge>
                                )
                              ) : (
                                <span className="text-xs text-slate-400 italic">
                                  Chưa phân công
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              {task.isRepeating ? "Lặp lại" : "Thời gian"}
                            </p>
                            <p className="text-xs font-semibold text-slate-700">
                              {task.isRepeating
                                ? getRepeatDatesText(task.repeatDates || [])
                                : task.duration || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Scope MapPin */}
                      {((formData.mode === "plan"
                        ? selections
                        : task.geographicalSelections
                      )?.length ?? 0) > 0 && (
                          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-50">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">
                                Phạm vi thực hiện
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {getSelectionSummary(
                                  formData.mode === "plan"
                                    ? selections
                                    : task.geographicalSelections || [],
                                  formData.mode === "plan"
                                    ? planScopedRegions
                                    : regions,
                                ).map((group) => (
                                  <div
                                    key={group.regionId}
                                    className="flex flex-wrap gap-1"
                                  >
                                    {group.items.map((item, i) => (
                                      <Badge
                                        key={`${item.id}-${i}`}
                                        className={cn(
                                          "text-[10px] px-2 py-0 border-none font-medium h-5",
                                          item.type === "region"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : item.type === "area"
                                              ? "bg-blue-50 text-blue-700"
                                              : "bg-amber-50 text-amber-700",
                                        )}
                                      >
                                        {item.name}
                                        {item.parentName && (
                                          <span className="opacity-50 ml-1 font-normal">
                                            ({item.parentName})
                                          </span>
                                        )}
                                      </Badge>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Materials for this task */}
                      {formData.materials.filter((m) => m.taskId === task.id)
                        .length > 0 && (
                        <div className="pt-3 border-t border-slate-50">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
                            Vật tư sử dụng
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {formData.materials
                              .filter((m) => m.taskId === task.id)
                              .map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-lg px-2.5 py-1.5"
                                >
                                  <span className="text-xs text-slate-600 font-medium truncate mr-2">
                                    {m.materialName}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="bg-white text-slate-900 border-slate-200 text-[10px] font-bold shrink-0"
                                  >
                                    {m.quantity} {m.unit}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: CTA + notice ── */}
          <div className="space-y-4">
            <Card className="bg-slate-900 border-none text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-950 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <CardHeader className="border-b border-white/10 pb-4 relative">
                <CardTitle className="text-white text-sm flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  Tóm tắt lệnh
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5 space-y-3 relative">
                {/* quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Nhân sự",
                      value: (() => {
                        const allPersonnel = new Set([
                          ...formData.supervisors,
                          ...formData.qualityInspectors,
                          ...formData.tasks.flatMap((t: any) => {
                            const labor = t.labor || "";
                            if (labor.includes(":")) {
                              return labor
                                .split(":")[1]
                                .trim()
                                .split("; ")
                                .filter(Boolean);
                            }
                            return [];
                          }),
                        ]);
                        return allPersonnel.size > 0 ? allPersonnel.size : "—";
                      })(),
                      sub: "người",
                    },
                    {
                      label: "Vật tư",
                      value: formData.materials.length || "—",
                      sub: "danh mục",
                    },
                    {
                      label: "Giai đoạn",
                      value: formData.selectedStages.length || "—",
                      sub: "áp dụng",
                    },
                    {
                      label: "Phạm vi",
                      value: selections.length || "—",
                      sub: "khu vực",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        {stat.label}
                      </p>
                      <p className="text-lg font-black text-white leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* divider */}
                <div className="border-t border-white/10 pt-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">
                        Bắt đầu
                      </span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {formData.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">
                        Kết thúc
                      </span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {formData.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Ưu tiên</span>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          formData.priority === "high"
                            ? "text-rose-400"
                            : formData.priority === "medium"
                              ? "text-amber-400"
                              : "text-emerald-400",
                        )}
                      >
                        {formData.priority === "high"
                          ? "Cao"
                          : formData.priority === "medium"
                            ? "Thường"
                            : "Thấp"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white border-none h-12 text-base font-black shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Xác nhận & Cập nhật
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Sau khi xác nhận, thông báo sẽ được gửi đến người thực hiện. Bạn
                vẫn có thể chỉnh sửa trong danh sách công việc.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Chỉnh sửa công việc"
      description="Quy trình 3 bước cập nhật lịch và quản lý nguồn lực"
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Label htmlFor="simple-task-mode-toggle" className="text-xs font-bold text-slate-700 whitespace-nowrap cursor-pointer">
              Thông tin chuyên sâu
            </Label>
            <Switch
              id="simple-task-mode-toggle"
              checked={!isSimpleMode}
              onCheckedChange={(checked) => setIsSimpleMode(!checked)}
            />
          </div>
          <Button variant="ghost" onClick={() => setLocation("/task")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">
        {isSimpleMode ? (
          <SimpleTaskForm
            formData={formData}
            setFormData={setFormData}
            workflows={workflowsQuery.items}
            plans={planOptionsForSelect}
            handleComplete={handleComplete}
            goBack={() => setLocation("/task")}
            completeLabel="Hoàn tất & Cập nhật"
          />
        ) : (
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/task")}
            completeLabel="Hoàn tất & Cập nhật"
          />
        )}
      </div>
    </PageWrapper>
  );
}
