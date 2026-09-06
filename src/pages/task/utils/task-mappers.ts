import type { FarmTaskResponse, FarmTaskRequest } from "@/features/farm-task";
import type { Task } from "../../../stores/useTaskStore";

const mapPriority = (priority: FarmTaskResponse["priority"]): Task["priority"] => {
  switch (priority) {
    case "HIGH":
      return "high";
    case "LOW":
      return "low";
    case "MEDIUM":
    default:
      return "medium";
  }
};

const mapStatus = (status: FarmTaskResponse["status"]): Task["status"] => {
  switch (status) {
    case "DOING":
      return "in-progress";
    case "DONE":
      return "completed";
    case "CANCELLED":
      return "overdue";
    case "TODO":
    default:
      return "pending";
  }
};

const mapScopeToSelections = (task: FarmTaskResponse): Task["geographicalSelections"] => {
  if (!task.scopeType) return [];

  const base = {
    id: `task-${task.id}-${task.scopeType.toLowerCase()}-${task.region?.id ?? task.area?.id ?? task.plot?.id ?? task.id}`,
    regionId: String(task.region?.id ?? task.area?.region?.id ?? task.plot?.area?.region?.id ?? ""),
    regionName: task.region?.name ?? task.area?.region?.name ?? task.plot?.area?.region?.name,
  };

  if (task.scopeType === "REGION" && task.region) {
    return [{ ...base, type: "region" as const }];
  }

  if (task.scopeType === "AREA" && task.area) {
    return [
      {
        ...base,
        type: "area" as const,
        areaId: String(task.area.id),
        areaName: task.area.name,
      },
    ];
  }

  if (task.scopeType === "PLOT" && task.plot) {
    return [
      {
        ...base,
        type: "plot" as const,
        areaId: String(task.plot.area?.id ?? ""),
        areaName: task.plot.area?.name,
        plotId: String(task.plot.id),
        plotName: task.plot.name,
      },
    ];
  }

  return [];
};

const mapStageLabel = (task: FarmTaskResponse) => {
  if (task.stage?.name) {
    return task.stage.name;
  }

  if (task.sourceWorkItem?.name) {
    return task.sourceWorkItem.name;
  }

  switch (task.scopeType) {
    case "REGION":
      return task.region?.name ? `Vùng trồng: ${task.region.name}` : "Vùng trồng";
    case "AREA":
      return task.area?.name ? `Khu vực: ${task.area.name}` : "Khu vực";
    case "PLOT":
      return task.plot?.name ? `Lô đất: ${task.plot.name}` : "Lô đất";
    default:
      return "N/A";
  }
};

const mapPersonnelNames = (
  task: FarmTaskResponse,
  role: "MANAGER" | "QUALITY_INSPECTOR" | "EXECUTOR",
) => task.personnel.filter((item) => item.role === role).map((item) => item.fullName || "");

export function farmTaskToLegacyTask(task: FarmTaskResponse): Task {
  const executorNames = mapPersonnelNames(task, "EXECUTOR");
  const managerNames = mapPersonnelNames(task, "MANAGER");
  const qualityInspectorNames = mapPersonnelNames(task, "QUALITY_INSPECTOR");
  const planName = task.plan?.name || "Công việc phát sinh";

  return {
    id: task.id,
    code: task.code,
    name: task.name,
    plan: planName,
    planId: task.plan?.id ? String(task.plan.id) : undefined,
    stage: mapStageLabel(task),
    assignedTo: executorNames,
    assignedToIds: [],
    assignedType: executorNames.length > 1 ? "team" : "individual",
    personnel: task.personnel,
    supervisors: managerNames,
    qualityInspectors: qualityInspectorNames,
    startDate: task.startDate,
    endDate: task.endDate,
    priority: mapPriority(task.priority),
    status: mapStatus(task.status),
    description: task.note || "",
    createdAt: task.createdAt || task.startDate,
    materials: task.supplyLines.map((line) => ({
      id: line.id,
      name: line.supplyItem.name || line.supplyItem.code || `Vật tư #${line.id}`,
      quantity: String(line.quantity),
      unit: line.unitBase.name || line.unitBase.code,
      type: "other",
      stageId: mapStageLabel(task),
      taskId: task.id,
      materialCategory: line.supplyItem.supplyType || "other",
      materialType: line.supplyItem.supplyType || "other",
      materialName: line.supplyItem.name || line.supplyItem.code || `Vật tư #${line.id}`,
      supplyItemId: line.supplyItem.id,
      unitBaseId: line.unitBase.id,
      unitOptions: [{ id: line.unitBase.id, name: line.unitBase.name }],
    })),
    tasks: [],
    geographicalSelections: mapScopeToSelections(task),
    sourceWorkItemName: task.sourceWorkItem?.name,
    stageName: task.stage?.name,
    isRepeating:
      task.recurrence?.repeatMode === "SPECIFIC_DATES" &&
      (task.recurrence.repeatDates?.filter(Boolean).length ?? 0) > 0,
    repeatDates: task.recurrence?.repeatDates?.filter(Boolean) || [],
  };
}

type LegacyTaskDraft = {
  name: string;
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  description: string;
  executorPersonnelIds: string[];
  managementPersonnelIds: string[];
  qualityInspectorPersonnelIds: string[];
  materials?: Array<{
    supplyItemId?: number;
    unitBaseId?: number;
    quantity: string;
  }>;
  isRepeating?: boolean;
  repeatDates?: string[];
};

const mapPriorityToRequest = (priority: LegacyTaskDraft["priority"]): FarmTaskRequest["priority"] => {
  switch (priority) {
    case "high":
      return "HIGH";
    case "low":
      return "LOW";
    case "medium":
    default:
      return "MEDIUM";
  }
};

const toPersonnelIds = (ids: string[]) =>
  ids.map((id) => Number(id)).filter((id) => Number.isFinite(id));

export function buildFarmTaskRequestFromDraft(
  draft: LegacyTaskDraft,
  options: {
    origin: "PLANNED" | "AD_HOC";
    workflowId?: number | null;
    planId?: number | null;
    stageId?: number | null;
    scopeType?: "REGION" | "AREA" | "PLOT" | null;
    scopeId?: number | null;
    sourceWorkItemId?: number | null;
    taskCategoryId?: number | null;
  },
): FarmTaskRequest {
  const personnel = [
    ...toPersonnelIds(draft.managementPersonnelIds).map((personnelId) => ({
      personnelId,
      role: "MANAGER" as const,
    })),
    ...toPersonnelIds(draft.qualityInspectorPersonnelIds).map((personnelId) => ({
      personnelId,
      role: "QUALITY_INSPECTOR" as const,
    })),
    ...toPersonnelIds(draft.executorPersonnelIds).map((personnelId) => ({
      personnelId,
      role: "EXECUTOR" as const,
    })),
  ];

  const repeatDates = (draft.repeatDates || []).filter(Boolean);
  const isPlanned = options.origin === "PLANNED";
  const recurrenceRepeatMode: "NONE" | "SPECIFIC_DATES" =
    draft.isRepeating && repeatDates.length > 0 ? "SPECIFIC_DATES" : "NONE";

  return {
    origin: options.origin,
    workflowId: isPlanned ? options.workflowId ?? null : options.workflowId ?? null,
    planId: options.planId ?? null,
    stageId: options.sourceWorkItemId == null ? options.stageId ?? null : undefined,
    scopeType: options.scopeType ?? null,
    scopeId: options.scopeId ?? null,
    sourceWorkItemId: options.sourceWorkItemId ?? null,
    taskCategoryId: options.sourceWorkItemId == null ? options.taskCategoryId ?? null : null,
    name: draft.name,
    priority: mapPriorityToRequest(draft.priority),
    note: draft.description || null,
    personnel,
    startDate: draft.startDate,
    endDate: draft.endDate,
    recurrence: {
      repeatMode: recurrenceRepeatMode,
      repeatDates: recurrenceRepeatMode === "SPECIFIC_DATES" ? repeatDates : null,
    },
    supplyLines: (draft.materials || [])
      .map((material) =>
        material.supplyItemId && material.unitBaseId
          ? {
              supplyItemId: material.supplyItemId,
              unitBaseId: material.unitBaseId,
              quantity: Number(material.quantity),
            }
          : null,
      )
      .filter(
        (item): item is { supplyItemId: number; unitBaseId: number; quantity: number } =>
          item !== null,
      ),
    status: null,
  };
}
