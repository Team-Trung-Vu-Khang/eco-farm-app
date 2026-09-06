import type {
  FarmPlanPurpose,
  FarmPlanResponse,
  FarmPlanStageRequest,
  FarmPlanStageResponse,
  FarmWorkDurationUnit,
  FarmWorkflowResponse,
  FarmWorkflowScopeResponse,
} from "@/features/farm-workflow/types/farm-workflow.type";
import type {
  FarmCultivationZoneResponse,
  FarmCultivationZoneScopeResponse,
} from "@/features/farm/types/farm.type";
import type { Region } from "@/pages/region-chart/constants";
import { initialPlans, initialWorkflows } from "@/stores/planWorkflowSeed";
import type { DiagramInfoRecord } from "../hooks/usePlanWorkflowDraftStore";
import type {
  GeographicalSelection,
  Plan,
  PlanFormData,
  SelectionSummaryGroup,
  Workflow,
} from "../types";
import { groupMaterialAllocations } from "./material-allocations";

const planStatusMap: Record<string, Plan["status"]> = {
  DRAFT: "draft",
  IN_PROGRESS: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

let fallbackPlans: Plan[] = initialPlans as Plan[];
let fallbackWorkflows: Workflow[] = initialWorkflows as Workflow[];

export function mapScopeToSelection(
  scope: FarmWorkflowScopeResponse,
): GeographicalSelection | null {
  if (scope.scopeType === "REGION" && scope.region) {
    return {
      id: `region-${scope.region.id}`,
      type: "region",
      regionId: String(scope.region.id),
      regionName: scope.region.name,
    };
  }

  // An AREA scope's top-level `region` is null — the region only comes
  // through `area.region`. A PLOT scope nests both under `plot.area`.
  if (scope.scopeType === "AREA" && scope.area) {
    const region = scope.region ?? scope.area.region;
    if (!region) return null;
    return {
      id: `area-${scope.area.id}`,
      type: "area",
      regionId: String(region.id),
      regionName: region.name,
      areaId: String(scope.area.id),
      areaName: scope.area.name,
    };
  }

  if (scope.scopeType === "PLOT" && scope.plot) {
    const area = scope.area ?? scope.plot.area;
    const region = scope.region ?? area?.region;
    if (!region || !area) return null;
    return {
      id: `plot-${scope.plot.id}`,
      type: "plot",
      regionId: String(region.id),
      regionName: region.name,
      areaId: String(area.id),
      areaName: area.name,
      plotId: String(scope.plot.id),
      plotName: scope.plot.name,
    };
  }

  return null;
}

export function mapWorkflowResponseToWorkflow(
  workflow: FarmWorkflowResponse,
): Workflow {
  return {
    id: String(workflow.id),
    name: workflow.name,
    description: workflow.description || "",
    selections: [],
    seasonIds: (workflow.seasons || []).map((season) => season.id),
    seasonNames: (workflow.seasons || []).map((season) => season.name || season.code || `#${season.id}`),
    isActive: workflow.status === "active",
    createdAt: workflow.createdAt || new Date().toISOString(),
    planCount: workflow.planCount ?? 0,
    statusBreakdown: workflow.statusBreakdown
      ? {
          draft: workflow.statusBreakdown.draft,
          inProgress: workflow.statusBreakdown.inProgress,
          completed: workflow.statusBreakdown.completed,
          cancelled: workflow.statusBreakdown.cancelled,
        }
      : undefined,
  };
}

export function mapWorkflowScopesToSelections(
  scopes: FarmWorkflowScopeResponse[],
): GeographicalSelection[] {
  return (scopes || [])
    .map(mapScopeToSelection)
    .filter(Boolean) as GeographicalSelection[];
}

// Builds "Vùng A (Khu 1, Khu 2)"-style labels straight from the scopes'
// embedded region/area/plot names — no id lookup against a region tree
// needed, so it works even when that tree doesn't know the API's ids.
export function mapWorkflowScopesToRegionLabels(
  scopes: FarmWorkflowScopeResponse[],
): string[] {
  const groups = new Map<
    string,
    { regionName: string; items: string[]; wholeRegion: boolean }
  >();

  (scopes || []).forEach((scope) => {
    // Same as mapScopeToSelection: an AREA scope's region only lives under
    // `area.region`, and a PLOT scope nests both under `plot.area`.
    const region =
      scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
    if (!region) return;

    const key = String(region.id);
    const group = groups.get(key) ?? {
      regionName: region.name || `Vùng #${region.id}`,
      items: [],
      wholeRegion: false,
    };

    if (scope.scopeType === "REGION") {
      group.wholeRegion = true;
    } else if (scope.scopeType === "AREA" && scope.area) {
      group.items.push(scope.area.name || `Khu vực #${scope.area.id}`);
    } else if (scope.scopeType === "PLOT" && scope.plot) {
      group.items.push(scope.plot.name || `Lô #${scope.plot.id}`);
    }

    groups.set(key, group);
  });

  return Array.from(groups.values()).map((group) =>
    group.wholeRegion || group.items.length === 0
      ? group.regionName
      : `${group.regionName} (${group.items.join(", ")})`,
  );
}

// Inverse of the years*365 + months*30 + days weighting used to submit
// `durationDays` — keeps the years/months/days inputs consistent on reload.
export function mapDurationDaysToParts(durationDays?: number) {
  let remaining = Math.max(0, Math.floor(Number(durationDays) || 0));
  const years = Math.floor(remaining / 365);
  remaining -= years * 365;
  const months = Math.floor(remaining / 30);
  remaining -= months * 30;

  return {
    plannedDurationYears: years > 0 ? String(years) : "",
    plannedDurationMonths: months > 0 ? String(months) : "",
    plannedDurationDays: remaining > 0 ? String(remaining) : "",
  };
}

export function mapWorkflowResponseToInfoRecord(
  workflow: FarmWorkflowResponse,
  position: { x: number; y: number },
): DiagramInfoRecord {
  return {
    id: String(workflow.id),
    name: workflow.name,
    description: workflow.description || "",
    selections: mapWorkflowScopesToSelections(workflow.scopes),
    regionLabels: mapWorkflowScopesToRegionLabels(workflow.scopes),
    seasonIds: (workflow.seasons || []).map((season) => season.id),
    seasonNames: (workflow.seasons || []).map((season) => season.name || season.code || `#${season.id}`),
    ...mapDurationDaysToParts(workflow.durationDays),
    isActive: workflow.status === "active",
    position,
  };
}

// Groups a scope list by region straight from the API's embedded region/
// area/plot names — mirrors mapWorkflowScopesToRegionLabels but keeps the
// per-item type/parentName shape the plan form's scope summary UI expects,
// so it renders correctly without depending on the (mock) region tree.
export function mapScopesToSelectionSummary(
  scopes: FarmWorkflowScopeResponse[],
): SelectionSummaryGroup[] {
  const groups = new Map<string, SelectionSummaryGroup>();

  (scopes || []).forEach((scope) => {
    const region =
      scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
    if (!region) return;

    const key = String(region.id);
    let group = groups.get(key);
    if (!group) {
      group = {
        regionId: key,
        regionName: region.name || `Vùng #${region.id}`,
        items: [],
      };
      groups.set(key, group);
    }

    if (scope.scopeType === "REGION") {
      group.items.push({ type: "region", id: key, name: "Toàn bộ vùng" });
    } else if (scope.scopeType === "AREA" && scope.area) {
      group.items.push({
        type: "area",
        id: String(scope.area.id),
        name: scope.area.name || `Khu vực #${scope.area.id}`,
      });
    } else if (scope.scopeType === "PLOT" && scope.plot) {
      const area = scope.area ?? scope.plot.area;
      group.items.push({
        type: "plot",
        id: String(scope.plot.id),
        name: scope.plot.name || `Lô #${scope.plot.id}`,
        parentName: area?.name,
      });
    }
  });

  return Array.from(groups.values());
}

const apiPurposeToPlanPurpose: Record<FarmPlanPurpose, Plan["purpose"]> = {
  CULTIVATION: "cultivation",
  FACILITY_UPGRADE: "facility-upgrade",
  TREATMENT: "treatment",
  SOIL_IMPROVEMENT: "amendment",
  HARVEST: "harvest",
};

const durationUnitToLabel: Record<FarmWorkDurationUnit, string> = {
  MINUTE: "phút",
  HOUR: "giờ",
  DAY: "ngày",
  WEEK: "tuần",
};

// Depending on the backend version, the relation is returned either as
// `seasonStage.id` or as the flattened `seasonStageId`. Keep both forms so a
// freshly-created plan can hydrate its selected stages on edit.
function getSeasonStageId(stage: FarmPlanStageResponse) {
  const rawId =
    stage.seasonStage?.id ??
    (
      stage as FarmPlanStageResponse & {
        seasonStageId?: number | string | null;
      }
    ).seasonStageId;
  const id = Number(rawId);
  return Number.isFinite(id) ? id : undefined;
}

function getApiStageKey(stage: FarmPlanStageResponse) {
  const seasonStageId = getSeasonStageId(stage);
  return seasonStageId != null
    ? `api-stage-${seasonStageId}:${stage.name}`
    : stage.name;
}

// A client-generated allocation id (Date.now()-based) is always far larger
// than any real database id — use that gap to tell a not-yet-saved item from
// one that already exists on the backend and must be preserved on update.
const MAX_PLAUSIBLE_BACKEND_ID = 1_000_000_000;
function isBackendId(id: number | undefined | null): id is number {
  return typeof id === "number" && Number.isFinite(id) && id < MAX_PLAUSIBLE_BACKEND_ID;
}

export function mapPlanResponseToPlan(plan: FarmPlanResponse): Plan {
  const selections = plan.scopes
    .map(mapScopeToSelection)
    .filter(Boolean) as GeographicalSelection[];

  const regionIds = Array.from(
    new Set(selections.map((selection) => selection.regionId)),
  );
  const zoneIds = selections
    .filter((selection) => selection.type !== "region" && selection.areaId)
    .map((selection) => String(selection.areaId));
  const plotIds = selections
    .filter((selection) => selection.type === "plot" && selection.plotId)
    .map((selection) => String(selection.plotId));

  const stages = plan.stages || [];
  const selectedStages = stages.map(getApiStageKey);
  const seasonStageIds = stages
    .map(getSeasonStageId)
    .filter((id): id is number => id != null);
  const seasonStageNames = stages
    .filter((stage) => getSeasonStageId(stage) != null)
    .map((stage) => stage.name);
  const seenSupplyLineIds = new Set<number>();
  const materialAllocations = stages.flatMap((stage) =>
    (stage.supplyLines || [])
      .filter((line) => {
        // A plan response can contain the same supply line more than once
        // when a stage is expanded through multiple relations. The API line
        // id is the source of truth, so only suppress an exact id duplicate;
        // different lines with the same material remain visible.
        if (line.id == null) return true;
        if (seenSupplyLineIds.has(line.id)) return false;
        seenSupplyLineIds.add(line.id);
        return true;
      })
      .map((line) => ({
      id: line.id,
      stageId: getApiStageKey(stage),
      supplyType: line.supplyItem?.supplyType || undefined,
      materialCategory: line.supplyItem?.supplyType || "",
      materialType: line.supplyItem?.supplyType || "",
      materialName: line.supplyItem?.name || "",
      quantity: String(line.quantity),
      unit:
        line.unitBase?.name ||
        line.packagingVariant?.unitBase?.name ||
        "",
      supplyItemId: line.supplyItem?.id,
      unitBaseId:
        line.unitBase?.id ?? line.packagingVariant?.unitBase?.id,
      unitOptions: [line.unitBase ?? line.packagingVariant?.unitBase]
        .filter(Boolean)
        .map((unit) => ({ id: unit.id, name: unit.name })),
      })),
  );
  const taskAllocations = stages.flatMap((stage) =>
    (stage.workItems || []).map((item) => ({
      id: item.id,
      stageId: getApiStageKey(stage),
      name: item.name,
      taskCategoryName: item.taskCategory?.name,
      description: item.description || "",
      labor: item.headcount ? `${item.headcount} người` : "",
      duration:
        item.durationValue && item.durationUnit
          ? `${item.durationValue} ${durationUnitToLabel[item.durationUnit]}`
          : "",
      taskCategoryId: item.taskCategory?.id,
      headcount: item.headcount,
      durationValue: item.durationValue,
      durationUnit: item.durationUnit,
    })),
  );

  return {
    id: plan.id,
    domainCode: plan.domainCode,
    code: plan.code,
    name: plan.name,
    description: plan.description || "",
    scopeNote: plan.scopeNote || "",
    workflowId: plan.workflow?.id ? String(plan.workflow.id) : undefined,
    seasonId: "",
    seasonName: "",
    startDate: plan.plannedStartDate || "",
    endDate: plan.plannedEndDate || "",
    durationDays: plan.durationDays,
    selectedRegionIds: regionIds,
    selectedZoneIds: zoneIds,
    selectedPlotIds: plotIds,
    crop: "",
    variety: "",
    purpose: apiPurposeToPlanPurpose[plan.purpose] || "cultivation",
    growthCycleId: "",
    regimenId: undefined,
    selectedStages,
    seasonStageIds,
    seasonStageNames,
    materialAllocations,
    taskAllocations,
    status: planStatusMap[plan.status] ?? "draft",
    createdAt: plan.createdAt || new Date().toISOString(),
    metadataJson: plan.metadataJson,
    scopes: selections,
    selectionSummary: mapScopesToSelectionSummary(plan.scopes),
    personnel: (plan.personnel || []).map((person) => ({
      id: person.id,
      fullName: person.fullName || `#${person.id}`,
      role: person.role,
    })),
  } as Plan;
}

// Builds the FarmPlanRequest.stages payload from the form's selected stages,
// material allocations, and task allocations. `existingStages` — the stages
// on the plan as last loaded from the API — lets an already-persisted stage
// or work item carry its real id back to the backend, so an update can
// recognize and keep it instead of deleting and recreating it (which the
// backend rejects once a work item has real FarmTasks allocated against it).
export function buildFarmPlanStagesRequest(
  formData: PlanFormData,
  existingStages: FarmPlanResponse["stages"] = [],
): FarmPlanStageRequest[] {
  const stageKeys =
    formData.purpose === "harvest" ? ["Thu hoạch"] : formData.selectedStages;

  return stageKeys.map((stageKey) => {
    const separatorIndex = stageKey.indexOf(":");
    const stagePrefix = separatorIndex >= 0
      ? stageKey.slice(0, separatorIndex)
      : "";
    const stageName = separatorIndex >= 0
      ? stageKey.slice(separatorIndex + 1)
      : stageKey;
    const existingStage = existingStages.find(
      (stage) => getApiStageKey(stage) === stageKey,
    );

    const supplyLines = groupMaterialAllocations(formData.materialAllocations)
      .map((material) => {
        const isEquipment =
          [material.materialCategory, material.materialType].some(
            (value) =>
              typeof value === "string" &&
              /equipment|dụng cụ\s*-\s*máy móc/i.test(value),
          );
        const unitBaseId = isEquipment ? 6 : material.unitBaseId;

        return material.stageId === stageKey &&
          material.supplyItemId != null &&
          unitBaseId != null
          ? {
              supplyItemId: material.supplyItemId as number,
              unitBaseId,
              quantity: Number(material.quantity) || 0,
            }
          : null;
      })
      .filter(
        (
          item,
        ): item is {
          supplyItemId: number;
          unitBaseId: number;
          quantity: number;
        } => item !== null,
      );

    const workItems = formData.taskAllocations
      .filter((task) => task.stageId === stageKey)
      .map((task) => ({
        // A real backend id tells the API to keep/update this work item
        // instead of recreating it — required once it already has FarmTasks
        // allocated against it (the backend blocks deleting those).
        ...(isBackendId(task.id) ? { id: task.id } : {}),
        taskCategoryId: task.taskCategoryId,
        name: task.name,
        description: task.description || undefined,
        headcount: task.headcount,
        durationValue: task.durationValue,
        durationUnit: task.durationUnit,
      }));

    const selectedCycleStage = formData.growthCycleSelections.find((selection) => {
      if (selection.type !== "stage" || selection.stageId == null) return false;
      if (stagePrefix.startsWith("api-stage-")) {
        return String(selection.stageId) === stagePrefix.slice("api-stage-".length);
      }
      if (stageKey.includes(":")) {
        const [cycleId, ...nameParts] = stageKey.split(":");
        return (
          selection.cycleId === cycleId &&
          nameParts.join(":") === stageName
        );
      }
      return selection.stageName === stageName;
    });

    return {
      ...(isBackendId(existingStage?.id) ? { id: existingStage.id } : {}),
      name: stageName,
      ...(selectedCycleStage?.stageId
        ? { seasonStageId: Number(selectedCycleStage.stageId) }
        : {}),
      supplyLines,
      workItems,
    } satisfies FarmPlanStageRequest;
  });
}

export function getFallbackPlans(): Plan[] {
  return fallbackPlans;
}

export function getFallbackWorkflows(): Workflow[] {
  return fallbackWorkflows;
}

export function upsertFallbackPlan(plan: Plan) {
  const existingIndex = fallbackPlans.findIndex((item) => item.id === plan.id);
  if (existingIndex === -1) {
    fallbackPlans = [...fallbackPlans, plan];
    return;
  }

  fallbackPlans = fallbackPlans.map((item) => (item.id === plan.id ? plan : item));
}

export function deleteFallbackPlan(id: number) {
  fallbackPlans = fallbackPlans.filter((plan) => plan.id !== id);
}

export function duplicateFallbackPlan(sourceId: number) {
  const source = fallbackPlans.find((plan) => plan.id === sourceId);
  if (!source) return undefined;

  const nextId =
    fallbackPlans.length > 0
      ? Math.max(...fallbackPlans.map((plan) => plan.id)) + 1
      : 1;
  const duplicate: Plan = {
    ...source,
    id: nextId,
    name: `${source.name} (Bản sao)`,
    code: `${source.code}-COPY`,
    status: "draft",
    createdAt: new Date().toISOString().split("T")[0],
  };
  fallbackPlans = [...fallbackPlans, duplicate];
  return duplicate;
}

export function upsertFallbackWorkflow(workflow: Workflow) {
  const existingIndex = fallbackWorkflows.findIndex(
    (item) => item.id === workflow.id,
  );
  if (existingIndex === -1) {
    fallbackWorkflows = [...fallbackWorkflows, workflow];
    return;
  }

  fallbackWorkflows = fallbackWorkflows.map((item) =>
    item.id === workflow.id ? workflow : item,
  );
}

export function deleteFallbackWorkflow(id: string) {
  fallbackWorkflows = fallbackWorkflows.filter((workflow) => workflow.id !== id);
}

export function duplicateFallbackWorkflow(sourceId: string) {
  const source = fallbackWorkflows.find((workflow) => workflow.id === sourceId);
  if (!source) return undefined;

  const duplicate: Workflow = {
    ...source,
    id: `workflow-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${source.name} (Bản sao)`,
    createdAt: new Date().toISOString(),
  };
  fallbackWorkflows = [...fallbackWorkflows, duplicate];
  return duplicate;
}

// Reconstructs a region → area → plot tree from cultivation zones' scopes so
// GeographicalSelector/location.ts (which expect that hierarchy shape) can
// work directly off /api/farm/production-zones data instead of the local
// mock region store.
interface ZoneTreePlot {
  id: string;
  name: string;
}

interface ZoneTreeArea {
  id: string;
  name: string;
  regionId: number;
  plots: ZoneTreePlot[];
}

interface ZoneTreeRegion {
  id: number;
  name: string;
  enterpriseId: string;
  subAreas: ZoneTreeArea[];
}

export function mapCultivationZonesToRegionTree(
  zones: FarmCultivationZoneResponse[],
): Region[] {
  const regionsById = new Map<number, ZoneTreeRegion>();

  function ensureRegion(id: number, name: string): ZoneTreeRegion {
    let region = regionsById.get(id);
    if (!region) {
      region = { id, name, enterpriseId: "", subAreas: [] };
      regionsById.set(id, region);
    }
    return region;
  }

  function ensureArea(
    region: ZoneTreeRegion,
    id: number,
    name: string,
  ): ZoneTreeArea {
    let area = region.subAreas.find((item) => item.id === String(id));
    if (!area) {
      area = { id: String(id), name, regionId: region.id, plots: [] };
      region.subAreas.push(area);
    }
    return area;
  }

  function handleScope(scope: FarmCultivationZoneScopeResponse) {
    if (scope.scopeType === "REGION" && scope.region) {
      ensureRegion(scope.region.id, scope.region.name || `Vùng #${scope.region.id}`);
      return;
    }

    if (scope.scopeType === "AREA" && scope.area?.region) {
      const region = ensureRegion(
        scope.area.region.id,
        scope.area.region.name || `Vùng #${scope.area.region.id}`,
      );
      ensureArea(
        region,
        scope.area.id,
        scope.area.name || `Khu vực #${scope.area.id}`,
      );
      return;
    }

    if (scope.scopeType === "PLOT" && scope.plot?.area?.region) {
      const region = ensureRegion(
        scope.plot.area.region.id,
        scope.plot.area.region.name || `Vùng #${scope.plot.area.region.id}`,
      );
      const area = ensureArea(
        region,
        scope.plot.area.id,
        scope.plot.area.name || `Khu vực #${scope.plot.area.id}`,
      );
      const plotId = String(scope.plot.id);
      if (!area.plots.some((item) => item.id === plotId)) {
        area.plots.push({
          id: plotId,
          name: scope.plot.name || `Lô #${scope.plot.id}`,
        });
      }
    }
  }

  zones.forEach((zone) => {
    (zone.scopes || []).forEach(handleScope);
  });

  return Array.from(regionsById.values()) as unknown as Region[];
}
