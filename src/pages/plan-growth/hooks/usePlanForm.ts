/* eslint-disable react-hooks/set-state-in-effect */
import {
  useFarmPlanById,
  useFarmPlanMutations,
  useFarmWorkflowById,
} from "@/features/farm-workflow/hooks";
import {
  farmGrowthCycleSeasonApi,
  systemGrowthCycleSeasonApi,
} from "@/features/farm";
import type { FarmPlanPersonnelRequest } from "@/features/farm-workflow/types/farm-workflow.type";
import type { FarmPersonnelResponse } from "@/features/master-data";
import { useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { TreatmentProcedure } from "@/pages/treatment/types/treatment.types";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
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
  mapWorkflowScopesToSelections,
  upsertFallbackPlan,
} from "../utils/api-mappers";
import { groupMaterialAllocations } from "../utils/material-allocations";
import {
  calculateSelectedArea,
  deriveSelectionState,
  reconstructSelectionsFromPlan,
  summarizeSelections,
  summarizeTaskSelections,
} from "../utils/location";
import { mapPurpose } from "./usePlanPage";
import { usePlanWorkflowDraftStore } from "./usePlanWorkflowDraftStore";
import { mapSeasonsToGrowthCycles } from "../utils/season-mappers";

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

const WORKFLOW_BASE_PATH = "/plan-growth/create/workflow";

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

type UsePlanFormOptions = {
  onSaved?: (planId: number) => void;
  onCancel?: () => void;
};

export function usePlanForm(
  mode: "create" | "edit",
  basePath = "/plan-growth",
  options?: UsePlanFormOptions,
) {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [dateWarning, setDateWarning] = useState<string | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");

  const isWorkflowContext = basePath.startsWith(WORKFLOW_BASE_PATH);
  const infoNodes = usePlanWorkflowDraftStore((state) => state.infoNodes);
  const draftWorkflowInfo = isWorkflowContext
    ? (infoNodes.find((node) => node.isActive) ?? infoNodes[0])
    : undefined;
  const planId = params.id || "";
  const planDetailQuery = useFarmPlanById(planId, {
    enabled: mode === "edit" && !!planId,
  });
  // Depending on the backend version, the plan detail may expose the
  // workflow relation as `workflow.id`, `workflowId`, or only keep the id in
  // the embedded workflow object. Accept all forms so a direct edit URL can
  // still hydrate the workflow's seasons.
  const workflowIdFromPlan =
    (planDetailQuery.data as any)?.workflow?.id ??
    (planDetailQuery.data as any)?.workflowId;
  const workflowDetailQuery = useFarmWorkflowById(workflowIdFromPlan ?? "", {
    enabled: isWorkflowContext && mode === "edit" && !!workflowIdFromPlan,
  });
  const embeddedWorkflow = (planDetailQuery.data as any)?.workflow;
  const workflowInfo = workflowDetailQuery.data
    ? (() => {
        const workflow = workflowDetailQuery.data as any;
        const seasonRefs = Array.isArray(workflow.seasons)
          ? workflow.seasons
          : Array.isArray(workflow.seasonIds)
            ? workflow.seasonIds.map((id: number) => ({ id }))
            : Array.isArray(embeddedWorkflow?.seasons)
              ? embeddedWorkflow.seasons
              : [];

        return {
          ...(draftWorkflowInfo || {}),
          id: String(workflow.id),
          name: workflow.name,
          description: workflow.description || "",
          selections: mapWorkflowScopesToSelections(workflow.scopes || []),
          seasonIds: seasonRefs
            .map((season: { id?: number | string }) => Number(season.id))
            .filter((id: number) => Number.isFinite(id)),
          seasonNames: seasonRefs.map(
            (season: { id?: number | string; name?: string; code?: string }) =>
              season.name || season.code || `#${season.id}`,
          ),
          isActive: workflow.status === "active",
          position: draftWorkflowInfo?.position || { x: 0, y: 0 },
        };
      })()
    : embeddedWorkflow
      ? {
          ...(draftWorkflowInfo || {}),
          id: String(embeddedWorkflow.id ?? workflowIdFromPlan),
          name: embeddedWorkflow.name || draftWorkflowInfo?.name || "",
          description: embeddedWorkflow.description || "",
          selections: mapWorkflowScopesToSelections(
            embeddedWorkflow.scopes || [],
          ),
          seasonIds: (embeddedWorkflow.seasons || [])
            .map((season: { id?: number | string }) => Number(season.id))
            .filter((id: number) => Number.isFinite(id)),
          isActive: embeddedWorkflow.status === "active",
          position: draftWorkflowInfo?.position || { x: 0, y: 0 },
        }
      : draftWorkflowInfo;
  const hydratedPlanIdRef = useRef<number | null>(null);
  const hydratedWorkflowInfoIdRef = useRef<string | null>(null);
  const hydratedGrowthCyclePlanIdRef = useRef<number | null>(null);

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
          (workflowInfo?.seasonIds ??
            workflowInfo?.growthCycleSelections?.map((selection) => selection.cycleId) ??
            [])
            .map(Number)
            .filter((id) => Number.isFinite(id)),
        ),
      ),
    [workflowInfo],
  );
  const workflowSeasonQueries = useQueries({
    queries: isWorkflowContext
      ? workflowSeasonIds.map((seasonId) => ({
          queryKey: ["workflow-season-detail", seasonId],
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
          materialAllocations: groupMaterialAllocations(
            (plan.materialAllocations as MaterialAllocation[]) || [],
          ),
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
      materialAllocations: groupMaterialAllocations(
        (plan.materialAllocations as MaterialAllocation[]) || [],
      ),
      taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
      status: plan.status,
    });
    setSelections(initialSelectionState?.selections || []);
    setSelectedEnterpriseId(initialSelectionState?.enterpriseId || "");
  }, [initialSelectionState, mode, plan, regions.length]);

  // The plan API returns its selected stages as plan-stage rows. Older rows
  // may not have `seasonStage` populated, so rebuild the UI selections from
  // the stage names once the workflow's Season details have loaded. Without
  // this bridge, the edit form has the plan stages in the payload but the
  // growth-cycle picker still appears empty.
  useEffect(() => {
    if (
      mode !== "edit" ||
      !isWorkflowContext ||
      !growthCycles.length ||
      !plan?.id
    ) {
      return;
    }

    const selectionsFromApiStageIds = (plan?.seasonStageIds || [])
      .map((seasonStageId) => {
        const cycle = growthCycles.find((candidate) =>
          candidate.stages.some((stage) => stage.id === String(seasonStageId)),
        );
        const stage = cycle?.stages.find(
          (item) => item.id === String(seasonStageId),
        );
        if (!cycle || !stage) return null;
        return {
          id: `api-${cycle.id}-${stage.id}`,
          type: "stage" as const,
          cycleId: cycle.id,
          stageId: stage.id,
          stageName: stage.name,
        };
      })
      .filter((selection): selection is NonNullable<typeof selection> =>
        Boolean(selection),
      );

    // Farm and master-data Seasons can use different stage identifiers for
    // the same logical stage. If the farm detail request falls back to the
    // master-data endpoint, resolve any IDs that did not match by the stage
    // name returned on the saved plan.
    const selectedByCycleStage = new Set(
      selectionsFromApiStageIds.map(
        (selection) => `${selection.cycleId}:${selection.stageId}`,
      ),
    );
    const selectionsFromStageNames = (plan?.seasonStageNames || [])
      .map((stageName) => {
        const match = growthCycles
          .flatMap((cycle) =>
            cycle.stages
              .filter(
                (stage) =>
                  stage.name === stageName &&
                  !selectedByCycleStage.has(`${cycle.id}:${stage.id}`),
              )
              .map((stage) => ({ cycle, stage })),
          )
          .find(({ cycle, stage }) =>
            !selectedByCycleStage.has(`${cycle.id}:${stage.id}`),
          );
        if (!match) return null;
        selectedByCycleStage.add(`${match.cycle.id}:${match.stage.id}`);
        return {
          id: `api-${match.cycle.id}-${match.stage.id}`,
          type: "stage" as const,
          cycleId: match.cycle.id,
          stageId: match.stage.id,
          stageName: match.stage.name,
        };
      })
      .filter((selection): selection is NonNullable<typeof selection> =>
        Boolean(selection),
      );
    const resolvedApiSelections = [
      ...selectionsFromApiStageIds,
      ...selectionsFromStageNames,
    ];

    // Season details can arrive one by one, especially when the farm detail
    // request fails and the master-data fallback is used. Do not hydrate
    // from the first returned Season; wait until every API stage ID is
    // resolved so stages from different cycles are all restored.
    const apiStageIds = Array.from(new Set(plan.seasonStageIds || []));
    if (apiStageIds.length > 0 || (plan.seasonStageNames || []).length > 0) {
      const expectedSelectionCount = Math.max(
        apiStageIds.length,
        plan.seasonStageNames?.length || 0,
      );
      if (
        resolvedApiSelections.length < expectedSelectionCount ||
        hydratedGrowthCyclePlanIdRef.current === plan.id
      ) {
        return;
      }

      hydratedGrowthCyclePlanIdRef.current = plan.id;
      setFormData((prev) => ({
        ...prev,
        growthCycleSelections: resolvedApiSelections,
      }));
      return;
    }

    // Prefer the API relationship (`seasonStage.id`) because stage names are
    // commonly reused across different cycles. Name matching is only a
    // compatibility fallback for older plan rows that have seasonStage=null.
    const inferredSelections =
      selectionsFromApiStageIds.length > 0
        ? selectionsFromApiStageIds
        : formData.selectedStages
            .map((stageKey) => {
              const separatorIndex = stageKey.indexOf(":");
              const cycleIdFromKey =
                separatorIndex >= 0
                  ? stageKey.slice(0, separatorIndex)
                  : undefined;
              const stageName =
                separatorIndex >= 0
                  ? stageKey.slice(separatorIndex + 1)
                  : stageKey;
              const cycle = growthCycles.find(
                (candidate) =>
                  (!cycleIdFromKey || candidate.id === cycleIdFromKey) &&
                  candidate.stages.some((stage) => stage.name === stageName),
              );
              const stage = cycle?.stages.find(
                (item) => item.name === stageName,
              );
              if (!cycle || !stage) return null;

              return {
                id: `api-${cycle.id}-${stage.id}`,
                type: "stage" as const,
                cycleId: cycle.id,
                stageId: stage.id,
                stageName: stage.name,
              };
            })
            .filter((selection): selection is NonNullable<typeof selection> =>
              Boolean(selection),
            );

    if (!inferredSelections.length || formData.growthCycleSelections.length > 0) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      growthCycleSelections: inferredSelections,
    }));
  }, [
    formData.growthCycleSelections.length,
    formData.selectedStages,
    growthCycles,
    isWorkflowContext,
    mode,
    plan?.seasonStageIds,
    plan?.id,
  ]);

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
        materialAllocations: groupMaterialAllocations([
          ...prev.materialAllocations,
          { id: Date.now(), ...item },
        ]),
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
    const payload = {
      ...formData,
      area: calculateArea(),
      status: "active" as const,
    };
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
      try {
        await updatePlan.mutateAsync({
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
            // Preserve metadata owned by the API when editing a plan. The
            // edit form does not expose this field, so omitting it would
            // cause a full update to clear the existing JSON metadata.
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

      const refreshedPlan = await planDetailQuery.refetch();
      if (refreshedPlan.data) {
        upsertFallbackPlan(mapPlanResponseToPlan(refreshedPlan.data));
      }

      toast({
        title: "Thành công",
        description: `Đã cập nhật kế hoạch ${formData.name}`,
      });
      if (options?.onSaved) {
        options.onSaved(Number(params.id));
        return;
      }
      persistDraft();
      window.history.back();
      return;
    }

    const createdId = Date.now();
    try {
      await createPlan.mutateAsync({
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

    const nextPlan = {
      ...payload,
      id: createdId,
      code: formData.code,
      createdAt: new Date().toISOString().split("T")[0],
    };
    upsertFallbackPlan(nextPlan as Plan);

    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch ${formData.name}`,
    });
    if (options?.onSaved) {
      options.onSaved(createdId);
      return;
    }
    window.history.back();
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
        : "Xây dựng lộ trình trồng trọt, phân bổ nguồn lực và giám sát",
    completeLabel: mode === "edit" ? "Lưu thay đổi" : "Kích hoạt Kế hoạch",
  };
}
