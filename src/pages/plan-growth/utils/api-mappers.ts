import type {
  FarmPlanResponse,
  FarmWorkflowResponse,
} from "@/features/farm-workflow/types/farm-workflow.type";
import type {
  FarmCultivationZoneResponse,
  FarmCultivationZoneScopeResponse,
} from "@/features/farm/types/farm.type";
import type { Region } from "@/pages/region-chart/constants";
import { initialPlans, initialWorkflows } from "@/stores/planWorkflowSeed";
import type {
  GeographicalSelection,
  Plan,
  Workflow,
} from "../types";

const planStatusMap: Record<string, Plan["status"]> = {
  DRAFT: "draft",
  IN_PROGRESS: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

let fallbackPlans: Plan[] = initialPlans as Plan[];
let fallbackWorkflows: Workflow[] = initialWorkflows as Workflow[];

function mapScopeToSelection(
  scope: FarmPlanResponse["scopes"][number],
): GeographicalSelection | null {
  if (scope.scopeType === "REGION" && scope.region) {
    return {
      id: `region-${scope.region.id}`,
      type: "region",
      regionId: String(scope.region.id),
    };
  }

  if (scope.scopeType === "AREA" && scope.region && scope.area) {
    return {
      id: `area-${scope.area.id}`,
      type: "area",
      regionId: String(scope.region.id),
      areaId: String(scope.area.id),
    };
  }

  if (scope.scopeType === "PLOT" && scope.region && scope.area && scope.plot) {
    return {
      id: `plot-${scope.plot.id}`,
      type: "plot",
      regionId: String(scope.region.id),
      areaId: String(scope.area.id),
      plotId: String(scope.plot.id),
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

  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    description: plan.description || "",
    workflowId: plan.workflow?.id ? String(plan.workflow.id) : undefined,
    seasonId: "",
    seasonName: "",
    startDate: plan.plannedStartDate || "",
    endDate: plan.plannedEndDate || "",
    selectedRegionIds: regionIds,
    selectedZoneIds: zoneIds,
    selectedPlotIds: plotIds,
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: undefined,
    selectedStages: [],
    materialAllocations: [],
    taskAllocations: [],
    status: planStatusMap[plan.status] ?? "draft",
    createdAt: plan.createdAt || new Date().toISOString(),
    scopes: selections,
  } as Plan;
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
