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
import { useLocation, useSearch } from "wouter";

import type { FarmTaskRequest } from "@/features/farm-task";
import { useCreateFarmTask } from "@/features/farm-task";
import {
  useFarmPlanById,
  useFarmPlans,
  useFarmWorkflows,
} from "../../features/farm-workflow/hooks";
import type {
  FarmPlanResponse,
  FarmWorkflowResponse,
} from "../../features/farm-workflow/types/farm-workflow.type";
import {
  useFarmPersonnel,
  type FarmPersonnelResponse,
} from "../../features/master-data";
import { useTaskCategorySearch } from "../../features/task-category/hooks/useTaskCategory";
import { useSelectedWorkspaceId } from "../../features/workspace";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useRegionStore from "../../stores/useRegionStore";
import { useCropSupplyCatalog } from "../plan-growth/hooks/useCropSupplyCatalog";
import {
  mapPlanResponseToPlan,
  mapWorkflowScopesToSelections,
} from "../plan-growth/utils/api-mappers";
import GeographicalSelector from "../plan/components/GeographicalSelector";
import { TaskStageAllocation } from "../plan/components/TaskStageAllocation";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../plan/types";
import { getRepeatDatesText, isRepeatDateAllowed } from "../plan/utils/task";
import SimpleTaskForm from "./components/SimpleTaskForm";

type TaskObjectiveType =
  | "phat-sinh"
  | "theo-ke-hoach"
  | "thu-hoach"
  | "cai-tao-dat"
  | "tri-benh";

type TaskCreateMode = "plan" | "phat-sinh";

const MAX_API_PAGE_SIZE = 100;

type GeographicalTreeRegion = {
  id: string;
  name: string;
  enterpriseId?: string;
  subAreas: Array<{
    id: string;
    name: string;
    plots: Array<{
      id: string;
      name: string;
    }>;
  }>;
};

type PersonnelOption = {
  id: number;
  fullName: string;
  code?: string;
  avatar?: string;
  taxCode?: string;
  departmentName?: string;
  positionName?: string;
};

// Raw API purpose (FarmPlanResponse.purpose) — used when hydrating from a
// preset plan fetched straight from the API.
function mapPurposeToObjectiveType(
  purpose?: FarmPlanResponse["purpose"],
): TaskObjectiveType {
  switch (purpose) {
    case "CULTIVATION":
    case "FACILITY_UPGRADE":
      return "theo-ke-hoach";
    case "HARVEST":
      return "thu-hoach";
    case "TREATMENT":
      return "tri-benh";
    case "SOIL_IMPROVEMENT":
      return "cai-tao-dat";
    default:
      return "phat-sinh";
  }
}

// Mapped plan purpose (Plan.purpose, from mapPlanResponseToPlan) — used for
// plans picked out of planOptions, which already went through that mapping.
const PLAN_PURPOSE_TO_OBJECTIVE_TYPE: Partial<
  Record<
    NonNullable<ReturnType<typeof mapPlanResponseToPlan>["purpose"]>,
    TaskObjectiveType
  >
> = {
  cultivation: "theo-ke-hoach",
  "facility-upgrade": "theo-ke-hoach",
  harvest: "thu-hoach",
  treatment: "tri-benh",
  amendment: "cai-tao-dat",
};

export type TaskCreateFormData = {
  code: string;
  name: string;
  mode: TaskCreateMode;
  objectiveType: TaskObjectiveType;
  planId: string;
  planName: string;
  mainTaskId: string;
  mainTaskIds: string[];
  selectedStages: string[];
  selectedPlotIds: string[];
  regimenId: string;
  assignedType: "individual" | "team";
  assignedTo: string[];
  supervisors: string[];
  qualityInspectors: string[];
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  description: string;
  materials: MaterialAllocation[];
  tasks: TaskAllocation[];
};

function toFiniteNumber(value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") return null;
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : null;
}

function mapPriorityToApi(
  priority: TaskCreateFormData["priority"],
): FarmTaskRequest["priority"] {
  switch (priority) {
    case "low":
      return "LOW";
    case "high":
      return "HIGH";
    case "medium":
    default:
      return "MEDIUM";
  }
}

export default function TaskCreatePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const createTaskMutation = useCreateFarmTask();
  const taskCategoriesQuery = useTaskCategorySearch({
    params: { domainCode: "CROP" },
  });
  const supplyCatalog = useCropSupplyCatalog();
  const apiSupplyMaterials = useMemo<MaterialAllocation[]>(
    () =>
      Object.values(supplyCatalog.optionsByType).flatMap((options) =>
        options.map(({ item }) => {
          const firstPackaging = item.packagingVariants?.[0];
          return {
            id: item.id,
            stageId: "Công việc phát sinh",
            materialCategory: item.supplyType,
            materialType: item.supplyType,
            materialName: item.name,
            quantity: String((item as any).quantity ?? 0),
            availableQuantity: Number((item as any).quantity ?? 0),
            unit: firstPackaging?.unitBase?.name || "",
            supplyItemId: item.id,
            unitBaseId: firstPackaging?.unitBase?.id,
            unitOptions: (item.packagingVariants || []).map((variant) => ({
              id: variant.unitBase.id,
              name: variant.unitBase.name,
            })),
          };
        }),
      ),
    [supplyCatalog.optionsByType],
  );
  const localPersonnel = usePersonnelStore((state) => state.personnel);
  const workspaceId = useSelectedWorkspaceId();
  const numericWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;
  const farmPersonnelQuery = useFarmPersonnel({
    workspaceId: numericWorkspaceId,
    params: {
      page: 0,
      size: MAX_API_PAGE_SIZE,
      status: "active",
    },
    enabled: numericWorkspaceId !== undefined,
  });

  const presetPlanId = useMemo(
    () => new URLSearchParams(search).get("planId"),
    [search],
  );

  const presetPlanQuery = useFarmPlanById(presetPlanId || "0", {
    enabled: !!presetPlanId,
  });
  const workflowsQuery = useFarmWorkflows({
    params: { page: 0, size: MAX_API_PAGE_SIZE },
  });

  const [selections, setSelections] = useState<GeographicalSelection[]>([]);

  const [formData, setFormData] = useState<TaskCreateFormData>({
    code: "CV-0000",
    name: "",
    mode: "plan",
    objectiveType: "theo-ke-hoach",
    planId: "",
    planName: "",
    mainTaskId: "",
    mainTaskIds: [],
    selectedStages: [] as string[],
    selectedPlotIds: [] as string[],
    regimenId: "",
    assignedType: "individual" as "individual" | "team",
    assignedTo: [] as string[],
    supervisors: [] as string[],
    qualityInspectors: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    materials: [] as MaterialAllocation[],
    tasks: [] as TaskAllocation[],
  });

  useEffect(() => {
    const presetPlan = presetPlanQuery.data;
    if (!presetPlan || !presetPlanId) return;

    // The form needs to hydrate from the preset plan once the query returns.
    // This is a one-time sync from URL state into local form state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      mode: "plan",
      objectiveType: mapPurposeToObjectiveType(presetPlan.purpose),
      regimenId: String(presetPlan.workflow.id),
      planId: String(presetPlan.id),
      planName: presetPlan.name,
      selectedStages: (presetPlan.stages || [])
        .map((stage) => stage.name)
        .filter(Boolean),
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelections(mapWorkflowScopesToSelections(presetPlan.scopes || []));
  }, [presetPlanId, presetPlanQuery.data]);

  const [isSimpleMode, setIsSimpleMode] = useState(true);

  useEffect(() => {
    const seenSources = new Set<number>();
    const seenNames = new Set<string>();
    const uniqueTasks = formData.tasks.filter((task) => {
      const sourceId = task.sourceWorkItemId;
      const nameKey = `${task.stageId || ""}:${task.name?.trim().toLowerCase() || ""}`;
      if (sourceId != null) {
        if (seenSources.has(sourceId)) return false;
        seenSources.add(sourceId);
      }
      if (task.name?.trim() && seenNames.has(nameKey)) return false;
      if (task.name?.trim()) seenNames.add(nameKey);
      return true;
    });

    if (uniqueTasks.length !== formData.tasks.length) {
      setFormData((prev) => ({ ...prev, tasks: uniqueTasks }));
    }
  }, [formData.tasks]);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [searchSupervisor, setSearchSupervisor] = useState("");
  const [isInspectorDialogOpen, setIsInspectorDialogOpen] = useState(false);
  const [searchInspector, setSearchInspector] = useState("");
  const [regimenSearchTerm, setRegimenSearchTerm] = useState("");
  const [planSearchTerm, setPlanSearchTerm] = useState("");
  const [selectedEnterpriseId] = useState<string>("");

  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

  const workflows = useMemo(
    () => workflowsQuery.items as FarmWorkflowResponse[],
    [workflowsQuery.items],
  );
  const personnel = useMemo<PersonnelOption[]>(() => {
    if (numericWorkspaceId !== undefined) {
      return farmPersonnelQuery.items.map((item: FarmPersonnelResponse) => ({
        id: item.id,
        fullName: item.fullName,
        code: item.code,
        avatar: (item as any).avatarUrl || (item as any).avatar,
        taxCode: item.code,
        departmentName:
          (item as any).department?.name ||
          (item as any).departmentName ||
          (item as any).department?.code ||
          "",
        positionName:
          (item as any).position?.name ||
          (item as any).positionName ||
          (item as any).position?.code ||
          "",
      }));
    }

    return localPersonnel.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      code: item.taxCode,
      avatar: item.avatar,
      taxCode: item.taxCode,
      departmentName: item.department,
      positionName: item.position,
    }));
  }, [farmPersonnelQuery.items, localPersonnel, numericWorkspaceId]);
  const workflowOptions = useMemo(() => {
    const query = regimenSearchTerm.trim().toLowerCase();
    if (!query) return workflows;

    return workflows.filter((workflow) =>
      `${workflow.code || ""} ${workflow.name || ""} ${
        workflow.description || ""
      }`
        .toLowerCase()
        .includes(query),
    );
  }, [regimenSearchTerm, workflows]);

  const workflowPlanQuery = useFarmPlans({
    params: {
      workflowId:
        formData.mode === "plan" ? Number(formData.regimenId) : undefined,
      page: 0,
      size: MAX_API_PAGE_SIZE,
    },
    enabled: formData.mode === "plan" && !!formData.regimenId,
  });

  const allPlanQuery = useFarmPlans({
    params: {
      workflowId: formData.regimenId ? Number(formData.regimenId) : undefined,
      page: 0,
      size: MAX_API_PAGE_SIZE,
    },
    enabled: formData.mode === "phat-sinh" && !!formData.regimenId,
  });

  const planOptions = useMemo(() => {
    const rawPlans =
      formData.mode === "phat-sinh"
        ? allPlanQuery.items
        : workflowPlanQuery.items;
    const mappedPlans = rawPlans.map(mapPlanResponseToPlan);
    const query = planSearchTerm.trim().toLowerCase();
    if (!query) return mappedPlans;

    return mappedPlans.filter((plan) =>
      `${plan.name} ${plan.code}`.toLowerCase().includes(query),
    );
  }, [
    allPlanQuery.items,
    formData.mode,
    planSearchTerm,
    workflowPlanQuery.items,
  ]);

  const selectedPlanSource =
    formData.mode === "phat-sinh"
      ? allPlanQuery.items
      : workflowPlanQuery.items;
  const selectedPlanResponse = selectedPlanSource.find(
    (plan) => String(plan.id) === formData.planId,
  );
  const selectedPlan = selectedPlanSource
    .map(mapPlanResponseToPlan)
    .find((p) => String(p.id) === formData.planId);
  const selectedPlanTaskAllocations = selectedPlan?.taskAllocations || [];
  const selectedPlanMaterialAllocations =
    selectedPlan?.materialAllocations || [];
  // AD_HOC can optionally use a selected plan as its resource template.
  const usePlanResources = formData.mode === "plan" || Boolean(formData.planId);
  const resolvedSelectedStages =
    formData.selectedStages.length > 0
      ? formData.selectedStages
      : selectedPlan?.selectedStages || [];
  const selectedWorkflow = workflows.find(
    (workflow) => String(workflow.id) === formData.regimenId,
  );
  const fallbackSelection = useMemo(() => {
    const scope = selectedPlanResponse?.scopes?.[0];
    if (!scope) return undefined;

    if (scope.scopeType === "REGION" && scope.region) {
      return {
        id: `plan-${scope.region.id}`,
        type: "region" as const,
        regionId: String(scope.region.id),
      };
    }

    if (scope.scopeType === "AREA" && scope.area) {
      return {
        id: `plan-${scope.area.id}`,
        type: "area" as const,
        regionId: String(scope.area.region?.id ?? scope.area.id),
        areaId: String(scope.area.id),
      };
    }

    if (scope.scopeType === "PLOT" && scope.plot) {
      return {
        id: `plan-${scope.plot.id}`,
        type: "plot" as const,
        regionId: String(
          scope.plot.area?.region?.id ?? scope.plot.area?.id ?? scope.plot.id,
        ),
        areaId: String(scope.plot.area?.id ?? ""),
        plotId: String(scope.plot.id),
      };
    }

    return undefined;
  }, [selectedPlanResponse?.scopes]);

  const { regions, getRegionById } = useRegionStore();

  const planScopedRegions = useMemo<GeographicalTreeRegion[]>(() => {
    const scopes = selectedPlanResponse?.scopes || [];
    if (scopes.length === 0) return [];

    const groupedRegions = new Map<string, GeographicalTreeRegion>();

    scopes.forEach((scope) => {
      const region =
        scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
      if (!region) return;

      const regionKey = String(region.id);
      const regionEntry: GeographicalTreeRegion = groupedRegions.get(
        regionKey,
      ) ?? {
        id: regionKey,
        name: region.name || `Vùng #${region.id}`,
        enterpriseId:
          (selectedPlanResponse as any)?.enterpriseId ||
          selectedEnterpriseId ||
          undefined,
        subAreas: [],
      };

      if (scope.scopeType === "REGION") {
        groupedRegions.set(regionKey, {
          ...regionEntry,
          subAreas: regionEntry.subAreas,
        });
        return;
      }

      if (scope.scopeType === "AREA" && scope.area) {
        const areaKey = String(scope.area.id);
        const existingArea = regionEntry.subAreas.find(
          (area) => area.id === areaKey,
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
          (item) => item.id === areaKey,
        );
        const areaEntry = existingArea ?? {
          id: areaKey,
          name: area.name || `Khu vực #${area.id}`,
          plots: [],
        };

        const plotKey = String(scope.plot.id);
        if (!areaEntry.plots.some((plot) => plot.id === plotKey)) {
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
  }, [selectedEnterpriseId, selectedPlanResponse]);

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
    sourceRegions: Array<{
      id: string | number;
      name: string;
      subAreas?: Array<{
        id: string | number;
        name: string;
        plots?: Array<{ id: string | number; name: string }>;
      }>;
    }> = regions,
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
      tasks: (() => {
        const duplicateIndex = prev.tasks.findIndex((task) => {
          const sameStage = task.stageId === item.stageId;
          const sameSource =
            item.sourceWorkItemId != null &&
            task.sourceWorkItemId === item.sourceWorkItemId;
          const sameName =
            Boolean(item.name?.trim()) &&
            task.name?.trim() === item.name.trim();
          return sameStage && (sameSource || sameName);
        });

        if (duplicateIndex < 0) {
          return [
            ...prev.tasks,
            { id: Date.now(), ...item, geographicalSelections: geoMapping },
          ];
        }

        // A planned work item may already be preloaded when the user picks it
        // again from the combobox. Update the existing block instead of
        // creating a second FarmTask request for the same work item.
        return prev.tasks.map((task, index) =>
          index === duplicateIndex
            ? { ...task, ...item, geographicalSelections: geoMapping }
            : task,
        );
      })(),
    }));
  };

  const handleUpdateTask = (
    id: number,
    updatedTask: Partial<TaskAllocation>,
  ) => {
    setFormData((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task,
      );
      const updatedTaskValue = updatedTasks.find((task) => task.id === id);

      return {
        ...prev,
        startDate: updatedTaskValue?.startDate || prev.startDate,
        endDate: updatedTaskValue?.endDate || prev.endDate,
        tasks: updatedTasks,
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

  const handleComplete = () => {
    // The work type is the source of truth for the API origin. The simple /
    // detailed toggle only controls how much allocation detail is shown; it
    // must not turn a selected plan into an AD_HOC task.
    const isPlannedMode = formData.mode === "plan";
    if (!isPlannedMode && !formData.regimenId) {
      toast({
        title: "Thiếu quy trình",
        description: "Vui lòng chọn quy trình cho công việc phát sinh.",
        variant: "destructive",
      });
      return;
    }
    const stageNames =
      isSimpleMode || resolvedSelectedStages.length === 0
        ? [""]
        : resolvedSelectedStages;

    const invalidRepeatDate = formData.tasks
      .filter((task) => task.isRepeating && (task.repeatDates?.length || 0) > 0)
      .flatMap((task) => {
        const dates = task.repeatDates || [];
        const startDate = task.startDate || formData.startDate;
        const endDate = task.endDate || formData.endDate;
        return dates.filter(
          (date, index) =>
            !isRepeatDateAllowed(
              date,
              startDate,
              endDate,
              dates.filter((_, otherIndex) => otherIndex !== index),
            ),
        );
      })[0];

    if (invalidRepeatDate) {
      toast({
        title: "Ngày lặp không hợp lệ",
        description:
          `${invalidRepeatDate} phải nằm sau khoảng thời gian chính và ` +
          "các lần lặp không được chồng lấn theo thời lượng công việc.",
        variant: "destructive",
      });
      return;
    }

    const requests: FarmTaskRequest[] = stageNames.map((stageName, index) => {
      const stageTask =
        formData.tasks.find((task) => task.stageId === stageName) ||
        formData.tasks[0];
      const scopeSelection =
        stageTask?.geographicalSelections?.[0] ||
        selections[0] ||
        fallbackSelection;

      const scopeType =
        scopeSelection?.type === "region"
          ? "REGION"
          : scopeSelection?.type === "area"
            ? "AREA"
            : scopeSelection?.type === "plot"
              ? "PLOT"
              : null;
      const scopeId =
        scopeSelection?.type === "region"
          ? toFiniteNumber(scopeSelection.regionId)
          : scopeSelection?.type === "area"
            ? toFiniteNumber(scopeSelection.areaId)
            : scopeSelection?.type === "plot"
              ? toFiniteNumber(scopeSelection.plotId)
              : null;

      const planTask =
        selectedPlanTaskAllocations.find(
          (task: any) => task.name && task.name === stageTask?.name,
        ) ||
        selectedPlanTaskAllocations.find(
          (task: any) => task.stageId === stageName,
        ) ||
        selectedPlanTaskAllocations[index];
      const sourceWorkItemId = isPlannedMode
        ? toFiniteNumber(
            (stageTask as TaskAllocation & { sourceWorkItemId?: number })
              ?.sourceWorkItemId ?? planTask?.id,
          )
        : null;

      // "Chọn nhân sự" per task block encodes assigned names into
      // `labor` as "N người: A, B" rather than formData.assignedTo — mirror
      // TaskStageAllocation's parsing so those picks actually get submitted.
      const executorNames = stageTask?.labor?.includes(":")
        ? stageTask.labor.split(":")[1].trim().split(", ").filter(Boolean)
        : formData.assignedTo;

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

      const stageMaterials = isSimpleMode
        ? formData.materials
        : formData.materials.filter(
            (material) => material.stageId === stageName,
          );
      const supplyLines = stageMaterials
        .map((material) => {
          const planMaterial = selectedPlanMaterialAllocations.find(
            (candidate: any) =>
              candidate.materialName === material.materialName &&
              candidate.stageId === material.stageId,
          );
          const supplyItemId =
            material.supplyItemId ?? planMaterial?.supplyItemId;
          const unitBaseId = material.unitBaseId ?? planMaterial?.unitBaseId;
          return typeof supplyItemId === "number" &&
            typeof unitBaseId === "number"
            ? {
                supplyItemId,
                unitBaseId,
                quantity: Number(material.quantity) || 0,
              }
            : null;
        })
        .filter(
          (
            line,
          ): line is {
            supplyItemId: number;
            unitBaseId: number;
            quantity: number;
          } => line !== null,
        );

      const repeatSource =
        stageTask?.isRepeating && (stageTask.repeatDates?.length || 0) > 0
          ? (stageTask.repeatDates ?? [])
          : formData.tasks[0]?.isRepeating &&
              (formData.tasks[0].repeatDates?.length || 0) > 0
            ? (formData.tasks[0].repeatDates ?? [])
            : [];

      const origin = isPlannedMode ? "PLANNED" : "AD_HOC";

      return {
        origin,
        // A reference plan can also be attached to an AD_HOC task.
        planId: toFiniteNumber(formData.planId),
        workflowId: isPlannedMode
          ? undefined
          : toFiniteNumber(formData.regimenId),
        scopeType,
        scopeId,
        sourceWorkItemId,
        taskCategoryId:
          origin === "PLANNED"
            ? null
            : (stageTask?.taskCategoryId ?? planTask?.taskCategoryId ?? null),
        name:
          isSimpleMode || !stageName
            ? formData.name
            : `${formData.name} - ${stageName}`,
        priority: mapPriorityToApi(formData.priority),
        note: formData.description || null,
        personnel: personnelRequests,
        startDate: formData.startDate,
        endDate: formData.endDate,
        recurrence: repeatSource.length
          ? {
              repeatMode: "SPECIFIC_DATES" as const,
              repeatDates: repeatSource,
            }
          : {
              repeatMode: "NONE" as const,
              repeatDates: null,
            },
        supplyLines,
        status: null,
      };
    });

    Promise.all(
      requests.map((payload) => createTaskMutation.createFarmTask(payload)),
    )
      .then((createdTasks) => {
        toast({
          title: "Thành công",
          description: `Đã tạo ${createdTasks.length} công việc mới`,
        });
        const returnPlanId = presetPlanId || formData.planId;
        setLocation(
          returnPlanId
            ? `/task?planId=${encodeURIComponent(returnPlanId)}`
            : "/task",
        );
      })
      .catch((error: Error) => {
        toast({
          title: "Không thể tạo công việc",
          description: error.message,
          variant: "destructive",
        });
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

  const handleWorkflowChange = (workflowId: string) => {
    setFormData((prev) => ({
      ...prev,
      regimenId: workflowId,
      objectiveType: "theo-ke-hoach",
      planId: "",
      planName: "",
      mainTaskId: "",
      mainTaskIds: [],
      selectedPlotIds: [],
    }));
    setSelections([]);
    setPlanSearchTerm("");
  };

  const handleAdHocWorkflowChange = (workflowId: string) => {
    setFormData((prev) => ({
      ...prev,
      regimenId: workflowId,
      planId: "",
      planName: "",
      selectedStages: [],
      selectedPlotIds: [],
    }));
    setSelections([]);
    setPlanSearchTerm("");
  };

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
                    Nhóm công việc *
                  </Label>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4">
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
                          Dự kiến
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Từ một kế hoạch có sẵn
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={formData.mode === "phat-sinh"}
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-blue-500"
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          mode: checked ? "phat-sinh" : "plan",
                          // Reset to a neutral placeholder — picking a plan
                          // below immediately derives the real value from
                          // its purpose.
                          objectiveType: checked
                            ? "phat-sinh"
                            : "theo-ke-hoach",
                          regimenId: "",
                          planId: "",
                          planName: "",
                          mainTaskIds: [],
                          selectedStages: [],
                          selectedPlotIds: [],
                          // A planned work item must not leak into an AD_HOC
                          // task. AD_HOC resources are selected independently.
                          tasks: checked ? [] : formData.tasks,
                          materials: checked ? [] : formData.materials,
                        });
                        setSelections([]);
                        setPlanSearchTerm("");
                        setRegimenSearchTerm("");
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

                {formData.mode === "phat-sinh" && (
                  <div className="space-y-2 pt-2 border-slate-100">
                    <Label className="text-sm font-bold text-slate-700">
                      Vụ mùa / Vụ nuôi *
                    </Label>
                    <Select
                      value={formData.regimenId}
                      onValueChange={(value) =>
                        handleAdHocWorkflowChange(value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn vụ mùa / vụ nuôi..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {workflowOptions.map((workflow) => (
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
                    <p className="text-[11px] font-medium text-slate-400">
                      Chọn vụ mùa hoặc vụ nuôi bắt buộc cho công việc phát sinh.
                    </p>
                  </div>
                )}

                {formData.mode === "plan" && (
                  <div className="space-y-6 animation-fade-in pt-2 border-slate-100">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Vụ mùa / Vụ nuôi *
                        </Label>
                        <Select
                          value={formData.regimenId}
                          disabled={!!presetPlanId}
                          onValueChange={handleWorkflowChange}
                        >
                          <SelectTrigger className="h-12 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-80">
                            <SelectValue
                              placeholder="Chọn vụ mùa / vụ nuôi..."
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-hidden p-0">
                            <div
                              className="sticky top-0 z-10 border-b border-slate-100 bg-white p-2"
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                  value={regimenSearchTerm}
                                  onChange={(event) =>
                                    setRegimenSearchTerm(event.target.value)
                                  }
                                  onClick={(event) => event.stopPropagation()}
                                  onPointerDown={(event) =>
                                    event.stopPropagation()
                                  }
                                  placeholder="Tìm vụ mùa / vụ nuôi..."
                                  className="h-9 pl-8 text-sm"
                                />
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto p-1">
                              {workflowOptions.map((workflow) => (
                                <SelectItem
                                  key={workflow.id}
                                  value={String(workflow.id)}
                                >
                                  {workflow.code
                                    ? `${workflow.code} - ${workflow.name}`
                                    : workflow.name}
                                </SelectItem>
                              ))}
                              {workflowOptions.length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                  Không tìm thấy vụ mùa / vụ nuôi phù hợp
                                </div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        <p className="text-[11px] font-medium text-slate-400">
                          Chọn vụ mùa / vụ nuôi trước để lọc danh sách kế hoạch
                          triển khai.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Kế hoạch triển khai
                          <span className="ml-2 text-[10px] font-medium text-slate-400 normal-case">
                            Không bắt buộc
                          </span>
                        </Label>
                        <Select
                          value={formData.planId}
                          disabled={!formData.regimenId || !!presetPlanId}
                          onValueChange={(val) => {
                            const p = planOptions.find(
                              (p) => String(p.id) === val,
                            );
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
                                ? (PLAN_PURPOSE_TO_OBJECTIVE_TYPE[p.purpose] ??
                                  "phat-sinh")
                                : "theo-ke-hoach",
                              selectedStages: p?.selectedStages || [],
                              mainTaskIds: [],
                              selectedPlotIds: [],
                              supervisors: planSupervisors,
                              qualityInspectors: planInspectors,
                            });
                            setSelections(p?.scopes || []);
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
                                  className="h-9 pl-10 text-sm"
                                />
                              </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto p-1">
                              {planOptions.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  {p.name} ({p.code})
                                </SelectItem>
                              ))}
                              {planOptions.length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                  {formData.regimenId
                                    ? "Không tìm thấy kế hoạch phù hợp"
                                    : "Hãy chọn vụ mùa / vụ nuôi trước"}
                                </div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        {!formData.regimenId && (
                          <p className="text-[11px] font-medium text-slate-400">
                            Kế hoạch sẽ được lọc theo vụ mùa / vụ nuôi đã chọn.
                          </p>
                        )}
                        {presetPlanId && (
                          <p className="text-[11px] font-medium text-slate-400">
                            Kế hoạch đã được cố định từ liên kết phân bổ công
                            việc.
                          </p>
                        )}

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
                  <div className="space-y-6 animation-fade-in border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">
                        Kế hoạch triển khai
                      </Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(val) => {
                          const p = planOptions.find(
                            (p) => String(p.id) === val,
                          );
                          const plan = p as any;
                          const planMaterials = (
                            plan?.materialAllocations || []
                          ).map((material: any) => ({
                            ...material,
                            id: Date.now() + Math.random(),
                            stageId: "Công việc phát sinh",
                          }));
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
                            selectedStages: p?.selectedStages || [],
                            selectedPlotIds: [],
                            materials: planMaterials,
                            tasks: planTasks,
                            assignedTo: planPersonnel
                              .filter(
                                (person: any) => person.role === "EXECUTOR",
                              )
                              .map((person: any) => person.fullName)
                              .filter(Boolean),
                            supervisors: planPersonnel
                              .filter(
                                (person: any) => person.role === "MANAGER",
                              )
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
                          setSelections(p?.scopes || []);
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
                                className="h-9 pl-10 text-sm"
                              />
                            </div>
                          </div>
                          <div className="max-h-64 overflow-y-auto p-1">
                            {planOptions.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} ({p.code})
                              </SelectItem>
                            ))}
                            {planOptions.length === 0 && (
                              <div className="p-4 text-center text-xs text-slate-400 italic">
                                Không tìm thấy kế hoạch phù hợp
                              </div>
                            )}
                          </div>
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
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {[item?.departmentName, item?.positionName]
                                  .filter(Boolean)
                                  .join(" · ") ||
                                  item?.taxCode ||
                                  item?.code ||
                                  "Quản lý"}
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
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {[item?.departmentName, item?.positionName]
                                  .filter(Boolean)
                                  .join(" · ") ||
                                  item?.taxCode ||
                                  item?.code ||
                                  "Kiểm định"}
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
                          className="pl-10 h-9 text-sm"
                          value={searchSupervisor}
                          onChange={(e) => setSearchSupervisor(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            `${p.fullName} ${p.code || ""}`
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
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {[p.departmentName, p.positionName]
                                      .filter(Boolean)
                                      .join(" · ") ||
                                      p.code ||
                                      "—"}
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
                          className="pl-10 h-9 text-sm"
                          value={searchInspector}
                          onChange={(e) => setSearchInspector(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            `${p.fullName} ${p.code || ""}`
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
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {[p.departmentName, p.positionName]
                                      .filter(Boolean)
                                      .join(" · ") ||
                                      p.code ||
                                      "—"}
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
              resolvedSelectedStages.length > 0 ? (
                resolvedSelectedStages.map((stageName) => (
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
                    regions={regions}
                    personnel={personnel}
                    masterSelections={selections}
                    enterpriseId={
                      selectedEnterpriseId ||
                      (selectedPlan as any)?.enterpriseId ||
                      ""
                    }
                    availableTasks={selectedPlanTaskAllocations.filter(
                      (t: any) => t.stageId === stageName,
                    )}
                    availableMaterials={
                      usePlanResources
                        ? selectedPlanMaterialAllocations.filter(
                            (material) => material.stageId === stageName,
                          )
                        : apiSupplyMaterials
                    }
                    availableMaterialsOnly={usePlanResources}
                    availableTasksOnly={usePlanResources}
                    availableTaskCategories={
                      usePlanResources ? [] : taskCategoriesQuery.items
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
                  regions={regions}
                  personnel={personnel}
                  masterSelections={selections}
                  enterpriseId={
                    selectedEnterpriseId ||
                    (selectedPlan as any)?.enterpriseId ||
                    ""
                  }
                  availableTasks={selectedPlanTaskAllocations}
                  availableMaterials={
                    usePlanResources
                      ? selectedPlanMaterialAllocations
                      : apiSupplyMaterials
                  }
                  availableMaterialsOnly={usePlanResources}
                  availableTasksOnly={usePlanResources}
                  availableTaskCategories={
                    usePlanResources ? [] : taskCategoriesQuery.items
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
                availableTasks={
                  usePlanResources ? selectedPlanTaskAllocations : undefined
                }
                availableMaterials={
                  usePlanResources
                    ? selectedPlanMaterialAllocations
                    : apiSupplyMaterials
                }
                availableMaterialsOnly={usePlanResources}
                availableTasksOnly={usePlanResources}
                availableTaskCategories={
                  usePlanResources ? [] : taskCategoriesQuery.items
                }
                regions={filteredRegionsForPhatSinh}
                personnel={personnel}
                masterSelections={selections}
                enterpriseId={selectedEnterpriseId}
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
                {formData.mode === "plan" && selectedWorkflow && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                      <ClipboardList className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Quy trình
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {selectedWorkflow.code
                          ? `${selectedWorkflow.code} - ${selectedWorkflow.name}`
                          : selectedWorkflow.name}
                      </p>
                    </div>
                  </div>
                )}
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
                      {resolvedSelectedStages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {resolvedSelectedStages.map((s) => (
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
                    {formData.selectedPlotIds.length > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Phạm vi lô đất
                        </p>
                        <p className="text-xs font-semibold text-slate-700 max-w-[160px] text-right leading-snug">
                          {formData.selectedPlotIds.join("; ")}
                        </p>
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
                      {task.geographicalSelections &&
                        task.geographicalSelections.length > 0 && (
                          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-50">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">
                                Phạm vi thực hiện
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {getSelectionSummary(
                                  task.geographicalSelections,
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
                      value: resolvedSelectedStages.length || "—",
                      sub: "áp dụng",
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
                      <span className="text-slate-400 text-xs">Bắt đầu</span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {formData.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Kết thúc</span>
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
                    Xác nhận & Chốt lịch
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
      title="Phân bổ công việc"
      description="Quy trình 3 bước lập lịch và quản lý nguồn lực"
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Label
              htmlFor="simple-task-mode-toggle"
              className="text-xs font-bold text-slate-700 whitespace-nowrap cursor-pointer"
            >
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
            workflows={workflowOptions}
            plans={planOptions}
            handleComplete={handleComplete}
            goBack={() => setLocation("/task")}
            completeLabel="Hoàn tất & Khởi tạo"
          />
        ) : (
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/task")}
            completeLabel="Hoàn tất & Khởi tạo"
          />
        )}
      </div>
    </PageWrapper>
  );
}
