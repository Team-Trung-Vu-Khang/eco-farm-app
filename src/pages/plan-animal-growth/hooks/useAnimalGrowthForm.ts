import {
  farmGrowthCycleSeasonApi,
  systemGrowthCycleSeasonApi,
} from "@/features/farm";
import {
  useFarmPlanById,
  useFarmPlanMutations,
  useFarmWorkflowById,
} from "@/features/farm-workflow/hooks";
import type { FarmPlanPersonnelRequest } from "@/features/farm-workflow/types/farm-workflow.type";
import type { FarmPersonnelResponse } from "@/features/master-data";
import { useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { TreatmentProcedure } from "@/pages/treatment/types/treatment.types";
import useAnimalGrowthPlanStore from "@/stores/useAnimalGrowthPlanStore";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import { useQueries } from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAmendmentRegimenStore } from "../../../stores/useAmendmentRegimenStore";
import { useTreatmentStore } from "../../../stores/useTreatmentStore";
import type { PersonnelOption } from "../components/PersonnelMultiSelectCard";
import type {
  GeographicalSelection,
  MaterialAllocation,
  Plan,
  PlanFormData,
  TaskAllocation,
} from "../types";
import {
  buildFarmPlanStagesRequest,
  mapPlanResponseToPlan,
  upsertFallbackPlan,
} from "../utils/api-mappers";
import { mapSeasonsToGrowthCycles } from "../utils/season-mappers";
import {
  calculateSelectedArea,
  deriveSelectionState,
  reconstructSelectionsFromPlan,
  summarizeSelections,
  summarizeTaskSelections,
} from "../utils/location";
import { mapPurpose } from "./useAnimalGrowthPage";
import { useAnimalGrowthWorkflowDraftStore } from "./useAnimalGrowthWorkflowDraftStore";

function mapFarmPersonnelToOption(
  item: FarmPersonnelResponse,
): PersonnelOption {
  return {
    id: item.id,
    fullName: item.fullName,
    position: item.positionName || item.position?.name || "",
    department: item.departmentName || item.department?.name || "",
    team: (item.teams || []).map((team) => team.name).join(", "),
    avatar: item.avatarUrl || item.metadataJson?.avatarUrl || undefined,
  };
}

const WORKFLOW_BASE_PATH = "/plan-animal-growth/create/workflow";

type DurationParts = {
  years: string;
  months: string;
  days: string;
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDurationPartsToDate(startDate: string, parts: DurationParts) {
  const years = Number(parts.years || 0);
  const months = Number(parts.months || 0);
  const days = Number(parts.days || 0);

  if (
    !startDate ||
    [years, months, days].every(
      (value) => !Number.isFinite(value) || value <= 0,
    )
  ) {
    return "";
  }

  const next = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(next.getTime())) return "";

  if (Number.isFinite(years) && years > 0)
    next.setFullYear(next.getFullYear() + years);
  if (Number.isFinite(months) && months > 0)
    next.setMonth(next.getMonth() + months);
  if (Number.isFinite(days) && days > 0) next.setDate(next.getDate() + days);

  return formatDateInput(next);
}

function parseDaysToParts(totalDays?: number): DurationParts {
  const value = Number(totalDays || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return { years: "", months: "", days: "" };
  }

  let remaining = Math.floor(value);
  const years = Math.floor(remaining / 365);
  remaining -= years * 365;
  const months = Math.floor(remaining / 30);
  remaining -= months * 30;

  return {
    years: years > 0 ? String(years) : "",
    months: months > 0 ? String(months) : "",
    days: remaining > 0 ? String(remaining) : "",
  };
}

function inferDurationFromDates(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    return {
      plannedDurationYears: "",
      plannedDurationMonths: "",
      plannedDurationDays: "",
    };
  }

  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T00:00:00`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return {
      plannedDurationYears: "",
      plannedDurationMonths: "",
      plannedDurationDays: "",
    };
  }

  const diffDays = Math.max(0, Math.round((end - start) / 86400000));
  const parts = parseDaysToParts(diffDays);
  return {
    plannedDurationYears: parts.years,
    plannedDurationMonths: parts.months,
    plannedDurationDays: parts.days,
  };
}

function buildPersonnelRequest(
  formData: PlanFormData,
): FarmPlanPersonnelRequest[] {
  const managers = formData.managementPersonnelIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))
    .map((personnelId) => ({ personnelId, role: "MANAGER" as const }));

  const inspectors = formData.qualityInspectorPersonnelIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))
    .map((personnelId) => ({
      personnelId,
      role: "QUALITY_INSPECTOR" as const,
    }));

  return [...managers, ...inspectors];
}

// Keeps every local view of a plan in sync with what the API just returned:
// the seed/fallback list (used before any API data has loaded) and the
// workflow canvas's own plan store (PlanAnimalGrowthCreateWorkflowPage reads
// from useAnimalGrowthPlanStore, not this hook's `plans`/`getFallbackPlans`,
// so without this the canvas kept showing stale data after an edit).
function syncPlanToLocalStores(plan: Plan) {
  upsertFallbackPlan(plan);
  useAnimalGrowthPlanStore.setState((state) => ({
    plans: [...state.plans.filter((item) => item.id !== plan.id), plan],
  }));
}

function derivePersonnelIds(plan: Plan, role: "MANAGER" | "QUALITY_INSPECTOR") {
  return (plan.personnel || [])
    .filter((person) => person.role === role)
    .map((person) => String(person.id));
}

function buildAutoPlanCode(seasonId: string, seasonName: string) {
  const seasonToken =
    (seasonId || seasonName || "PLAN")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 12) || "PLAN";

  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `KH-${seasonToken}-${timestamp}`;
}

function createEmptyFormData(): PlanFormData {
  return {
    code: "",
    name: "",
    description: "",
    scopeNote: "",
    seasonId: "",
    seasonName: "",
    startDate: formatDateInput(new Date()),
    endDate: "",
    plannedDurationYears: "",
    plannedDurationMonths: "",
    plannedDurationDays: "",
    managementPersonnelIds: [],
    qualityInspectorPersonnelIds: [],
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    growthCycleSelections: [],
    regimenId: "",
    selectedStages: [],
    status: "draft",
    materialAllocations: [],
    taskAllocations: [],
  };
}

type UseAnimalGrowthFormOptions = {
  onSaved?: (planId: number) => void;
  onCancel?: () => void;
};

export function useAnimalGrowthForm(
  mode: "create" | "edit",
  basePath = "/plan-animal-growth",
  options?: UseAnimalGrowthFormOptions,
) {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [dateWarning, setDateWarning] = useState<string | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");

  const isWorkflowContext = basePath.startsWith(WORKFLOW_BASE_PATH);
  const infoNodes = useAnimalGrowthWorkflowDraftStore(
    (state) => state.infoNodes,
  );
  const draftWorkflowInfo = isWorkflowContext
    ? (infoNodes.find((node) => node.isActive) ?? infoNodes[0])
    : undefined;
  const hydratedPlanIdRef = useRef<number | null>(null);
  const hydratedWorkflowInfoIdRef = useRef<string | null>(null);

  const planId = params.id || "";
  const planDetailQuery = useFarmPlanById(planId, {
    enabled: mode === "edit" && !!planId,
  });
  const workflowDetailQuery = useFarmWorkflowById(draftWorkflowInfo?.id || "", {
    enabled:
      isWorkflowContext &&
      !!draftWorkflowInfo?.id &&
      /^\d+$/.test(draftWorkflowInfo.id),
  });
  const workflowInfo = useMemo(() => {
    if (!draftWorkflowInfo) return undefined;
    const workflow = workflowDetailQuery.data;
    if (!workflow) return draftWorkflowInfo;

    const apiSeasonIds = (workflow.seasons || []).map((season) => season.id);
    const apiSeasonNames = (workflow.seasons || []).map(
      (season) => season.name || season.code || `#${season.id}`,
    );

    return {
      ...draftWorkflowInfo,
      selections:
        draftWorkflowInfo.selections.length > 0
          ? draftWorkflowInfo.selections
          : [],
      seasonIds:
        apiSeasonIds.length > 0
          ? apiSeasonIds
          : draftWorkflowInfo.seasonIds || [],
      seasonNames:
        apiSeasonNames.length > 0
          ? apiSeasonNames
          : draftWorkflowInfo.seasonNames || [],
    };
  }, [draftWorkflowInfo, workflowDetailQuery.data]);
  const { createPlan, updatePlan } = useFarmPlanMutations();
  const seasons = useSeasonStore((state) => state.seasons);
  const workspaceId = useSelectedWorkspaceId();
  const { items: personnelItems } = useFarmPersonnel({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const personnel = useMemo(
    () => personnelItems.map(mapFarmPersonnelToOption),
    [personnelItems],
  );
  const { regions } = useRegionStore();
  const { growthCycles: localGrowthCycles } = useGrowthCycleStore();
  const workflowSeasonIds = useMemo(
    () =>
      Array.from(
        new Set(
          (workflowInfo?.seasonIds || [])
            .map(Number)
            .filter((id) => Number.isFinite(id)),
        ),
      ),
    [workflowInfo],
  );
  const workflowSeasonQueries = useQueries({
    queries: isWorkflowContext
      ? workflowSeasonIds.map((seasonId) => ({
          queryKey: ["animal-workflow-season-detail", seasonId],
          queryFn: async () => {
            try {
              return await farmGrowthCycleSeasonApi.getById(seasonId);
            } catch {
              return await systemGrowthCycleSeasonApi.getById(seasonId);
            }
          },
        }))
      : [],
  });
  const growthCycles = useMemo(() => {
    if (!isWorkflowContext) return localGrowthCycles;
    return mapSeasonsToGrowthCycles(
      workflowSeasonQueries
        .map((query) => query.data)
        .filter((season): season is any => Boolean(season)),
    );
  }, [isWorkflowContext, localGrowthCycles, workflowSeasonQueries]);
  const treatments = useTreatmentStore((state) => state.treatments);
  const amendmentRegimensRaw = useAmendmentRegimenStore(
    (state) => state.regimens,
  );

  const regimens = useMemo(() => {
    const mappedTreatments = treatments.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.disease || t.name,
      type: "tri-benh" as const,
      provider: t.author || "Chưa rõ",
      category: t.disease || "Điều trị",
      crop: t.crop || "Tất cả",
      steps:
        t.procedures?.map((p: TreatmentProcedure) => ({
          id: String(p.id),
          day: p.startDay ? `Ngày ${p.startDay}` : `Ngày ${p.stepNumber}`,
          title: p.name,
          description: p.description,
        })) || [],
    }));

    const mappedAmendments = amendmentRegimensRaw.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.soilIssue || t.name,
      type: "cai-tao-dat" as const,
      provider: t.authors?.[0]?.name || "Chưa rõ",
      category: t.soilIssue || "Cải tạo",
      crop: t.cropType || "Tất cả",
      steps:
        t.procedures?.map((p: TreatmentProcedure) => ({
          id: String(p.id),
          day: p.timing || `Ngày ${p.stepNumber}`,
          title: p.name,
          description: p.description,
        })) || [],
    }));

    return [...mappedTreatments, ...mappedAmendments];
  }, [treatments, amendmentRegimensRaw]);

  const getSeasonDurationParts = useCallback(
    (season: { duration?: number } | null | undefined) => {
      if (!season || typeof season.duration !== "number") {
        return { years: "", months: "", days: "" };
      }

      return parseDaysToParts(season.duration);
    },
    [],
  );

  const detailPlan =
    mode === "edit" && planDetailQuery.data
      ? mapPlanResponseToPlan(planDetailQuery.data)
      : undefined;
  const plan = mode === "edit" ? detailPlan : undefined;
  const initialSelectionState = useMemo(
    () =>
      mode === "edit" && plan
        ? reconstructSelectionsFromPlan(plan, regions)
        : null,
    [mode, plan, regions],
  );

  // A plan already carries its own scope straight from the plan API
  // response (`plan.scopes`/`plan.selectionSummary`) once it's been saved —
  // that takes priority over the diagram draft store's info-node selection,
  // which only matters for a plan that hasn't picked a scope of its own yet.
  const planHasOwnScope = mode === "edit" && !!plan?.scopes?.length;

  const [selections, setSelections] = useState<GeographicalSelection[]>(
    initialSelectionState?.selections || [],
  );
  const [formData, setFormData] = useState<PlanFormData>(() =>
    plan
      ? {
          code: plan.code || "",
          name: plan.name || "",
          description: plan.description || "",
          scopeNote: plan.scopeNote || "",
          seasonId: plan.seasonId || "",
          seasonName: plan.seasonName || "",
          startDate: plan.startDate || formatDateInput(new Date()),
          endDate: plan.endDate || "",
          ...inferDurationFromDates(plan.startDate, plan.endDate),
          managementPersonnelIds: derivePersonnelIds(plan, "MANAGER"),
          qualityInspectorPersonnelIds: derivePersonnelIds(
            plan,
            "QUALITY_INSPECTOR",
          ),
          selectedRegionIds: plan.selectedRegionIds || [],
          selectedZoneIds: plan.selectedZoneIds || [],
          selectedPlotIds: plan.selectedPlotIds || [],
          crop: plan.crop || "",
          variety: plan.variety || "",
          purpose: plan.purpose || "cultivation",
          growthCycleId: plan.growthCycleId || "",
          growthCycleSelections: plan.growthCycleSelections || [],
          regimenId: plan.regimenId || "",
          selectedStages: plan.selectedStages || [],
          seasonStageIds: plan.seasonStageIds || [],
          materialAllocations:
            (plan.materialAllocations as MaterialAllocation[]) || [],
          taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
          status: plan.status,
        }
      : createEmptyFormData(),
  );

  useEffect(() => {
    if (mode !== "edit" || !plan || regions.length === 0) return;
    if (hydratedPlanIdRef.current === plan.id) return;
    hydratedPlanIdRef.current = plan.id;

    setFormData({
      code: plan.code || "",
      name: plan.name || "",
      description: plan.description || "",
      scopeNote: plan.scopeNote || "",
      seasonId: plan.seasonId || "",
      seasonName: plan.seasonName || "",
      startDate: plan.startDate || formatDateInput(new Date()),
      endDate: plan.endDate || "",
      ...inferDurationFromDates(plan.startDate, plan.endDate),
      managementPersonnelIds: derivePersonnelIds(plan, "MANAGER"),
      qualityInspectorPersonnelIds: derivePersonnelIds(
        plan,
        "QUALITY_INSPECTOR",
      ),
      selectedRegionIds: plan.selectedRegionIds || [],
      selectedZoneIds: plan.selectedZoneIds || [],
      selectedPlotIds: plan.selectedPlotIds || [],
      crop: plan.crop || "",
      variety: plan.variety || "",
      purpose: plan.purpose || "cultivation",
      growthCycleId: plan.growthCycleId || "",
      growthCycleSelections: plan.growthCycleSelections || [],
      regimenId: plan.regimenId || "",
      selectedStages: plan.selectedStages || [],
      seasonStageIds: plan.seasonStageIds || [],
      materialAllocations:
        (plan.materialAllocations as MaterialAllocation[]) || [],
      taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
      status: plan.status,
    });
    setSelections(initialSelectionState?.selections || []);
    setSelectedEnterpriseId(initialSelectionState?.enterpriseId || "");
  }, [initialSelectionState, mode, plan, regions.length]);

  // Plans created inside a workflow diagram don't pick their own cultivation
  // scope — they inherit whatever region/zone/plot the diagram's info node
  // was set up with, so the field can't drift out of sync with the diagram.
  // Once a plan has been saved with its own scope, though, that takes
  // priority (see `planHasOwnScope`) and this sync is skipped.
  useEffect(() => {
    if (planHasOwnScope) return;
    if (!isWorkflowContext || !workflowInfo || regions.length === 0) return;
    if (hydratedWorkflowInfoIdRef.current === workflowInfo.id) return;
    hydratedWorkflowInfoIdRef.current = workflowInfo.id;

    const nextSelectionState = deriveSelectionState(
      workflowInfo.selections,
      regions,
      formData.crop,
      formData.variety,
    );

    setSelections(workflowInfo.selections);
    setFormData((prev) => ({ ...prev, ...nextSelectionState }));

    const firstRegionId = nextSelectionState.selectedRegionIds[0];
    const firstRegion = regions.find(
      (region) => String(region.id) === String(firstRegionId),
    );
    setSelectedEnterpriseId(firstRegion?.enterpriseId || "");
  }, [
    planHasOwnScope,
    isWorkflowContext,
    workflowInfo,
    regions,
    formData.crop,
    formData.variety,
  ]);

  // `plan.selectionSummary` is built straight from the API's embedded
  // region/area/plot names, so it displays correctly even when the (mock)
  // region tree doesn't have matching entries for the plan's own scope ids.
  const selectionSummary = useMemo(() => {
    if (planHasOwnScope && plan?.selectionSummary?.length) {
      return plan.selectionSummary;
    }
    return summarizeSelections(selections, regions);
  }, [planHasOwnScope, plan, regions, selections]);

  const calculateArea = useCallback(
    () => calculateSelectedArea(formData, regions),
    [formData, regions],
  );

  const handleGeographicalConfirm = (
    newSelections: GeographicalSelection[],
  ) => {
    setSelections(newSelections);

    const nextSelectionState = deriveSelectionState(
      newSelections,
      regions,
      formData.crop,
      formData.variety,
    );

    setFormData((prev) => ({
      ...prev,
      ...nextSelectionState,
    }));

    const firstRegionId = nextSelectionState.selectedRegionIds[0];
    const firstRegion = regions.find(
      (region) => String(region.id) === String(firstRegionId),
    );
    setSelectedEnterpriseId(firstRegion?.enterpriseId || "");
  };

  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((item) => item.id === seasonId);
    if (!season) return;
    const durationParts = getSeasonDurationParts(season);

    setFormData((prev) => ({
      ...prev,
      seasonId: season.id,
      seasonName: season.name,
      code:
        mode === "create"
          ? buildAutoPlanCode(season.id, season.name)
          : prev.code,
      endDate:
        addDurationPartsToDate(prev.startDate, {
          years: prev.plannedDurationYears || durationParts.years,
          months: prev.plannedDurationMonths || durationParts.months,
          days: prev.plannedDurationDays || durationParts.days,
        }) || prev.endDate,
      plannedDurationYears: prev.plannedDurationYears || durationParts.years,
      plannedDurationMonths: prev.plannedDurationMonths || durationParts.months,
      plannedDurationDays: prev.plannedDurationDays || durationParts.days,
    }));
    setDateWarning(null);
  };

  const handleDurationPartChange = (
    part: "years" | "months" | "days",
    value: string,
  ) => {
    setFormData((prev) => {
      const nextParts = {
        years: part === "years" ? value : prev.plannedDurationYears,
        months: part === "months" ? value : prev.plannedDurationMonths,
        days: part === "days" ? value : prev.plannedDurationDays,
      };

      return {
        ...prev,
        plannedDurationYears: nextParts.years,
        plannedDurationMonths: nextParts.months,
        plannedDurationDays: nextParts.days,
        endDate:
          addDurationPartsToDate(prev.startDate, nextParts) || prev.endDate,
      };
    });
  };

  const handleStartDateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      endDate:
        addDurationPartsToDate(value, {
          years: prev.plannedDurationYears,
          months: prev.plannedDurationMonths,
          days: prev.plannedDurationDays,
        }) || prev.endDate,
    }));
  };

  const handleAddMaterial = useCallback(
    (item: Omit<MaterialAllocation, "id">) => {
      setFormData((prev) => ({
        ...prev,
        materialAllocations: [
          ...prev.materialAllocations,
          { id: Date.now(), ...item },
        ],
      }));
    },
    [],
  );

  const handleRemoveMaterial = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter(
        (item) => item.id !== id,
      ),
    }));
  }, []);

  const handleAddTask = useCallback((item: Omit<TaskAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: [...prev.taskAllocations, { id: Date.now(), ...item }],
    }));
  }, []);

  const handleRemoveTask = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: prev.taskAllocations.filter((item) => item.id !== id),
    }));
  }, []);

  const persistDraft = () => {
    if (mode !== "edit" || !params.id) return;
    const nextPlan = {
      ...(plan || {}),
      ...formData,
      id: Number(params.id),
      area: calculateArea(),
      selectedRegionIds: formData.selectedRegionIds,
      selectedZoneIds: formData.selectedZoneIds,
      selectedPlotIds: formData.selectedPlotIds,
      materialAllocations: formData.materialAllocations,
      taskAllocations: formData.taskAllocations,
    };
    upsertFallbackPlan(nextPlan as Plan);
  };

  const handleComplete = async () => {
    const durationDays = Math.max(
      1,
      Math.round(
        (new Date(`${formData.endDate}T00:00:00`).getTime() -
          new Date(`${formData.startDate}T00:00:00`).getTime()) /
          86400000,
      ) || 1,
    );
    const stages = buildFarmPlanStagesRequest(formData);

    if (mode === "edit" && params.id) {
      let updated;
      try {
        updated = await updatePlan.mutateAsync({
          id: Number(params.id),
          payload: {
            code: formData.code || null,
            name: formData.name,
            description: formData.description || undefined,
            scopeNote: formData.scopeNote || undefined,
            purpose: mapPurpose(formData.purpose),
            durationDays,
            personnel: buildPersonnelRequest(formData),
            stages,
            metadataJson: plan?.metadataJson,
            status: "IN_PROGRESS",
          },
        });
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description:
            error?.response?.data?.message ||
            `Không thể cập nhật kế hoạch ${formData.name}`,
          variant: "destructive",
        });
        return;
      }

      // Trust the API's own response rather than re-deriving the plan from
      // local form state — it carries the resolved personnel names, scopes,
      // and status the backend actually saved.
      const nextPlan = mapPlanResponseToPlan(updated);
      syncPlanToLocalStores(nextPlan);

      toast({
        title: "Thành công",
        description: `Đã cập nhật kế hoạch ${formData.name}`,
      });
      if (options?.onSaved) {
        options.onSaved(nextPlan.id);
        return;
      }
      setLocation(`${basePath}/${nextPlan.id}`);
      return;
    }

    let created;
    try {
      created = await createPlan.mutateAsync({
        workflowId: workflowInfo?.id || "0",
        payload: {
          code: formData.code || null,
          name: formData.name,
          description: formData.description || undefined,
          scopeNote: formData.scopeNote || undefined,
          purpose: mapPurpose(formData.purpose),
          durationDays,
          personnel: buildPersonnelRequest(formData),
          stages,
          status: "DRAFT",
        },
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          `Không thể tạo kế hoạch ${formData.name}`,
        variant: "destructive",
      });
      return;
    }

    // Same as above — build the local plan from the backend's own response,
    // not a fabricated Date.now() id, so it stays in sync with what the API
    // actually persisted.
    const nextPlan = mapPlanResponseToPlan(created);
    syncPlanToLocalStores(nextPlan);

    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch ${formData.name}`,
    });
    if (options?.onSaved) {
      options.onSaved(nextPlan.id);
      return;
    }
    setLocation(basePath);
  };

  return {
    mode,
    plan,
    params,
    formData,
    setFormData,
    selections,
    setSelections,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    seasons,
    regions,
    regimens,
    growthCycles,
    isWorkflowContext,
    workflowInfo,
    selectionSummary,
    dateWarning,
    calculateArea,
    summarizeTaskSelections: (
      taskSelections: GeographicalSelection[] | undefined,
    ) => summarizeTaskSelections(taskSelections, regions),
    personnel,
    handleSeasonChange,
    handleDurationPartChange,
    handleStartDateChange,
    handleGeographicalConfirm,
    handleAddMaterial,
    handleRemoveMaterial,
    handleAddTask,
    handleRemoveTask,
    handleComplete,
    // "Quay lại" always returns to wherever the user came from, regardless
    // of context — draft edits are persisted first so nothing is lost.
    goBack: () => {
      persistDraft();
      window.history.back();
    },
    pageTitle: mode === "edit" ? "Chỉnh sửa Kế hoạch" : "Lập kế hoạch",
    pageDescription:
      mode === "edit" && plan
        ? `Cập nhật thông tin chi tiết cho kế hoạch ${plan.code}`
        : "Xây dựng lộ trình chăn nuôi, phân bổ nguồn lực và giám sát",
    completeLabel: mode === "edit" ? "Lưu thay đổi" : "Kích hoạt Kế hoạch",
  };
}
