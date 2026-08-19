import PageWrapper from "@/components/PageWrapper";
import useRegionStore from "@/stores/useRegionStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  ClipboardList,
  Layers,
  PencilLine,
  Plus,
  Save,
  Trash2,
  Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
} from "reactflow";
import { useLocation, useParams } from "wouter";
import {
  useFarmPlanMutations,
  useFarmWorkflowById,
  useFarmWorkflowPlans,
} from "@/features/farm-workflow/hooks";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import usePlanStore, { type Plan } from "../../stores/usePlanStore";
import useWorkflowStore from "../../stores/useWorkflowStore";
import {
  WorkflowCardNode,
  type WorkflowActionItem,
  type WorkflowCardNodeData,
  type WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import {
  createEmptyPlanDraft,
  createNodeId,
  DEFAULT_DRAFT_PLAN_NAME,
  getDescendantNodes,
  getDirectChildren,
  getParentId,
  INFO_NODE_X,
  placeNewNode,
  PLACEHOLDER_POSITION,
  usePlanWorkflowDraftStore,
  type DiagramInfoRecord,
  type DraftNode,
} from "./hooks/usePlanWorkflowDraftStore";
import type { GeographicalSelection } from "./types";
import {
  mapPlanResponseToPlan,
  mapWorkflowResponseToInfoRecord,
} from "./utils/api-mappers";
import { summarizePlanSelections, summarizeSelections } from "./utils/location";

// Local draft-only nodes carry a `workflow-<timestamp>-<rand>` id; only
// numeric ids are real backend workflow ids worth fetching from the API.
function isPersistedWorkflowId(id: string) {
  return /^\d+$/.test(id);
}

type PlanDisplayStatus = "pending" | "in_progress" | "completed" | "cancelled";

interface ConfirmActionState {
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "default" | "destructive";
  onConfirm: () => void;
}

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

const PLAN_STATUS_META: Record<
  PlanDisplayStatus,
  { nodeStatus: WorkflowNodeStatus; label: string }
> = {
  pending: { nodeStatus: "not_started", label: "Chờ triển khai" },
  in_progress: { nodeStatus: "in_progress", label: "Đang triển khai" },
  completed: { nodeStatus: "completed", label: "Đã kết thúc" },
  cancelled: { nodeStatus: "paused", label: "Đã hủy" },
};

const DEFAULT_DIAGRAM_INFO_EYEBROW = "Quy trình canh tác";
const WORKFLOW_BASE_PATH = "/plan-growth/create/workflow";

type FlowViewInstance = {
  fitView: (options?: {
    padding?: number;
    includeHiddenNodes?: boolean;
  }) => void;
};

// Trusts the API's FarmPlanResponse.durationDays directly rather than
// deriving a duration from plannedStartDate/plannedEndDate — those are often
// unset (e.g. a freshly created draft plan) even though durationDays isn't.
// Same years*365 + months*30 + days weighting as mapDurationDaysToParts, so
// the label stays consistent with the duration inputs elsewhere in the app.
function getDurationLabel(durationDays?: number) {
  let remaining = Math.max(0, Math.floor(Number(durationDays) || 0));
  const years = Math.floor(remaining / 365);
  remaining -= years * 365;
  const months = Math.floor(remaining / 30);
  remaining -= months * 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (remaining > 0 || !parts.length) parts.push(`${remaining} ngày`);

  return parts.join(" ");
}

// Outline numbering (1, 1.1, 1.2, 1.1.1, ...) derived from each node's
// position in the tree so chained/nested plans stay easy to tell apart.
function getPlanOutlineCode(nodeId: string, allNodes: DraftNode[]): string {
  const node = allNodes.find((item) => item.id === nodeId);
  if (!node) return "";

  const parentId = getParentId(node);
  const siblings = parentId
    ? getDirectChildren(allNodes, parentId)
    : allNodes.filter((item) => !getParentId(item));
  const index = siblings.findIndex((item) => item.id === nodeId) + 1;

  if (!parentId) return String(index);
  return `${getPlanOutlineCode(parentId, allNodes)}.${index}`;
}

function buildChildEdge(sourceNodeId: string, targetNodeId: string): Edge {
  return {
    id: `edge-${sourceNodeId}-${targetNodeId}`,
    source: sourceNodeId,
    target: targetNodeId,
    sourceHandle: `${sourceNodeId}-source-bottom`,
    targetHandle: `${targetNodeId}-target-top`,
    type: "step",
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    style: { strokeWidth: 2, stroke: "#1f2937" },
  };
}

// Rebuilds the plan-node tree (positions + parent/child edges) from the
// backend's `metadataJson.parentId` on each plan — the canvas graph itself
// is local-draft-only and doesn't survive a reload, so this is the only
// place that link is reconstructed after fetching a workflow's plans.
function buildPlanNodesFromApi(planNodePlans: Plan[]): {
  nodes: DraftNode[];
  edges: Edge[];
} {
  const nodeIdByPlanId = new Map<number, string>();
  const pending = planNodePlans.map((plan) => {
    const id = createNodeId("plan");
    nodeIdByPlanId.set(plan.id, id);
    return { plan, id };
  });

  const nodes: DraftNode[] = [];
  const edges: Edge[] = [];
  const placedNodeIds = new Set<string>();

  const place = (plan: Plan, id: string, parentNodeId: string | undefined) => {
    nodes.push({
      id,
      type: "workflowCard",
      position: placeNewNode(nodes, parentNodeId),
      data: parentNodeId
        ? { setupKind: "plan", planId: plan.id, parentId: parentNodeId }
        : { setupKind: "plan", planId: plan.id },
    });
    placedNodeIds.add(id);
    if (parentNodeId) edges.push(buildChildEdge(parentNodeId, id));
  };

  // Multiple passes so parents get placed before children regardless of the
  // array order the API returned them in.
  let remaining = pending;
  let progressed = true;
  while (remaining.length > 0 && progressed) {
    progressed = false;
    const stillPending: typeof remaining = [];
    for (const entry of remaining) {
      const parentPlanId = entry.plan.metadataJson?.parentId;
      const parentNodeId =
        parentPlanId != null ? nodeIdByPlanId.get(Number(parentPlanId)) : undefined;
      if (parentPlanId != null && parentNodeId && !placedNodeIds.has(parentNodeId)) {
        stillPending.push(entry);
        continue;
      }
      place(entry.plan, entry.id, parentNodeId);
      progressed = true;
    }
    remaining = stillPending;
  }
  // Dangling parentId (parent plan not found in this workflow) — place as root.
  remaining.forEach(({ plan, id }) => place(plan, id, undefined));

  return { nodes, edges };
}

// Trusts the API's own plan.status rather than inferring progress from
// whether the plan "looks" filled in or has work allocated.
function getPlanDisplayStatus(plan: Plan): PlanDisplayStatus {
  switch (plan.status) {
    case "active":
      return "in_progress";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

function getPlanActionDisabled(status: PlanDisplayStatus) {
  return {
    edit: status === "completed",
    allocate: !(status === "pending" || status === "in_progress"),
    remove: !(status === "pending" || status === "cancelled"),
  };
}

function getMaterialBreakdown(
  materialNames: string[],
  materialCategories: string[],
) {
  const breakdown = { "Thuốc BVTV": 0, "Phân bón": 0, "Vật tư khác": 0 };

  materialNames.forEach((materialName, index) => {
    if (!materialName.trim()) return;
    const category = (materialCategories[index] || "").toLowerCase();
    if (category.includes("thuốc") || category.includes("bvtv")) {
      breakdown["Thuốc BVTV"] += 1;
    } else if (category.includes("phân")) {
      breakdown["Phân bón"] += 1;
    } else {
      breakdown["Vật tư khác"] += 1;
    }
  });

  return breakdown;
}

function getStageTags(stageNames: string[]) {
  const names = stageNames.map((name) => name.trim()).filter(Boolean);

  if (!names.length) return ["Chưa có giai đoạn"];
  if (names.length <= 2) return names;
  return [names[0], names[1]];
}

function getRegionLabelsFromPlan(
  plan: Plan,
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
) {
  const summary = summarizePlanSelections(plan, regions);
  if (!summary.length) return ["Chưa thiết lập vùng canh tác"];

  return summary.map((group) => {
    const itemLabel = group.items.map((item) => item.name).join(", ");
    return itemLabel ? `${group.regionName} (${itemLabel})` : group.regionName;
  });
}

function getRegionLabelsFromSelections(
  selections: GeographicalSelection[],
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
) {
  const summary = summarizeSelections(selections, regions || []);
  if (!summary.length) return ["Chưa thiết lập vùng canh tác"];

  return summary.map((group) => {
    const itemLabel = group.items.map((item) => item.name).join(", ");
    return itemLabel ? `${group.regionName} (${itemLabel})` : group.regionName;
  });
}

type NodeHandlers = {
  onCreatePlan: (sourceNodeId?: string) => void;
  onEditPlan: (planId: number) => void;
  onAllocateWork: (planId: number) => void;
  onRequestDeletePlan: (nodeId: string) => void;
};

function toDisplayNode(
  node: DraftNode,
  allNodes: DraftNode[],
  handlers: NodeHandlers,
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
  plans: Plan[],
): Node<WorkflowCardNodeData> {
  const { id, data } = node;
  const outlineCode = getPlanOutlineCode(id, allNodes);

  if (data.setupKind !== "plan") {
    return {
      ...node,
      data: {
        kind: "plan",
        eyebrow: `Kế hoạch ${outlineCode}`,
        title: "Kế hoạch không hợp lệ",
        status: "not_started",
        wide: true,
        targetTopHandleId: `${id}-target-top`,
        description: "",
      },
    };
  }

  const plan = plans.find((item) => item.id === data.planId);
  if (!plan) {
    return {
      ...node,
      data: {
        kind: "plan",
        eyebrow: `Kế hoạch ${outlineCode}`,
        title: "Kế hoạch không tồn tại",
        status: "not_started",
        statusLabel: "Đã bị xoá",
        wide: true,
        targetTopHandleId: `${id}-target-top`,
        description: "Kế hoạch này đã bị xoá khỏi hệ thống.",
      },
    };
  }

  const laborCount = plan.taskAllocations.filter((task) =>
    task.labor.trim(),
  ).length;
  const materialNames = plan.materialAllocations.map(
    (material) => material.materialName,
  );
  const materialCategories = plan.materialAllocations.map(
    (material) => material.materialCategory,
  );
  const materialBreakdown = getMaterialBreakdown(
    materialNames,
    materialCategories,
  );

  const status = getPlanDisplayStatus(plan);
  const statusMeta = PLAN_STATUS_META[status];
  const actionDisabled = getPlanActionDisabled(status);
  const duration = getDurationLabel(plan.durationDays);

  const actions: WorkflowActionItem[] = [
    {
      label: "Điều chỉnh thông tin",
      icon: PencilLine,
      disabled: actionDisabled.edit,
      onClick: () => handlers.onEditPlan(plan.id),
    },
    {
      label: "Phân bổ công việc",
      icon: Layers,
      disabled: actionDisabled.allocate,
      onClick: () => handlers.onAllocateWork(plan.id),
    },
    {
      label: "Xóa kế hoạch",
      icon: Trash2,
      tone: "destructive",
      disabled: actionDisabled.remove,
      onClick: () => handlers.onRequestDeletePlan(id),
    },
  ];

  return {
    ...node,
    data: {
      kind: "plan",
      variant: "poster",
      posterTheme: "light",
      icon: ClipboardList,
      eyebrow: `Kế hoạch ${outlineCode}`,
      title: `${plan.name || "Kế hoạch mới"} (${duration})`,
      subtitle: plan.seasonName || "Chưa chọn mùa vụ",
      status: statusMeta.nodeStatus,
      statusLabel: statusMeta.label,
      wide: true,
      targetTopHandleId: `${id}-target-top`,
      sourceBottomHandleId: `${id}-source-bottom`,
      tags: getStageTags(plan.selectedStages),
      regionLabels: getRegionLabelsFromPlan(plan, regions),
      summaries: [
        { label: "Nhân lực", value: String(laborCount) },
        {
          label: "Thuốc BVTV",
          value: String(materialBreakdown["Thuốc BVTV"]),
        },
        { label: "Phân bón", value: String(materialBreakdown["Phân bón"]) },
        {
          label: "Vật tư khác",
          value: String(materialBreakdown["Vật tư khác"]),
        },
      ],
      description: plan.description || "Chưa có mô tả cho kế hoạch này.",
      actions,
      footerAction: {
        label: "Kế hoạch tiếp theo",
        icon: Plus,
        onClick: () => handlers.onCreatePlan(id),
      },
    },
  };
}

type InfoNodeHandlers = {
  onEdit: (id: string) => void;
};

function toInfoDisplayNode(
  record: DiagramInfoRecord,
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
  handlers: InfoNodeHandlers,
): Node<WorkflowCardNodeData> {
  return {
    id: record.id,
    type: "workflowCard",
    position: record.position,
    draggable: true,
    selectable: true,
    data: {
      kind: "cycle",
      variant: "poster",
      posterTheme: "light",
      icon: Workflow,
      eyebrow: DEFAULT_DIAGRAM_INFO_EYEBROW,
      title: record.name,
      wide: true,
      description: record.description || "Chưa có mô tả cho node này.",
      regionLabels:
        record.regionLabels ??
        getRegionLabelsFromSelections(record.selections, regions),
      actions: [
        {
          label: "Chỉnh sửa",
          icon: PencilLine,
          onClick: () => handlers.onEdit(record.id),
        },
      ],
    },
  };
}

export default function PlanGrowthCreateWorkflowPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ workflowId?: string }>();
  const { toast } = useToast();
  const { regions } = useRegionStore();
  const plans = usePlanStore((state) => state.plans);
  const addPlan = usePlanStore((state) => state.addPlan);
  const updatePlan = usePlanStore((state) => state.updatePlan);
  const deletePlanLocal = usePlanStore((state) => state.deletePlan);
  const upsertWorkflow = useWorkflowStore((state) => state.upsertWorkflow);
  const { createPlan, deletePlan } = useFarmPlanMutations();

  const nodes = usePlanWorkflowDraftStore((state) => state.nodes);
  const edges = usePlanWorkflowDraftStore((state) => state.edges);
  const onNodesChange = usePlanWorkflowDraftStore(
    (state) => state.onNodesChange,
  );
  const onEdgesChange = usePlanWorkflowDraftStore(
    (state) => state.onEdgesChange,
  );
  const setEdges = usePlanWorkflowDraftStore((state) => state.setEdges);
  const addNode = usePlanWorkflowDraftStore((state) => state.addNode);
  const addNodeWithEdge = usePlanWorkflowDraftStore(
    (state) => state.addNodeWithEdge,
  );
  const removeNodeCascade = usePlanWorkflowDraftStore(
    (state) => state.removeNodeCascade,
  );
  const infoNodes = usePlanWorkflowDraftStore((state) => state.infoNodes);
  const setInfoNodes = usePlanWorkflowDraftStore((state) => state.setInfoNodes);
  const loadWorkflow = usePlanWorkflowDraftStore((state) => state.loadWorkflow);
  const resetDraft = usePlanWorkflowDraftStore((state) => state.resetDraft);
  const activeWorkflowId = usePlanWorkflowDraftStore(
    (state) => state.activeWorkflowId,
  );

  const routeWorkflowId = params.workflowId ?? null;
  // Numeric ids are real backend workflows — fetch their detail instead of
  // relying on the local-only draft store, which never has them.
  const isRoutePersistedId = routeWorkflowId
    ? isPersistedWorkflowId(routeWorkflowId)
    : false;
  const { data: workflowDetail } = useFarmWorkflowById(routeWorkflowId ?? "", {
    enabled:
      !!routeWorkflowId &&
      routeWorkflowId !== activeWorkflowId &&
      isRoutePersistedId,
  });
  const { items: workflowPlans, loading: isLoadingWorkflowPlans } =
    useFarmWorkflowPlans(routeWorkflowId ?? "", {
      enabled:
        !!routeWorkflowId &&
        routeWorkflowId !== activeWorkflowId &&
        isRoutePersistedId,
    });

  useEffect(() => {
    const workflowId = params.workflowId ?? null;
    // Bare route ("/create/workflow" with no id) always means "continue the
    // current draft" — the "Khởi tạo kế hoạch mới" entry points reset the
    // draft explicitly before navigating here, so this effect must never
    // infer a reset from the URL alone (that would also fire every time a
    // plan/stage/detail sub-route routes back to this same bare path).
    if (!workflowId || workflowId === activeWorkflowId) return;
    if (isPersistedWorkflowId(workflowId)) return;

    const saved = useWorkflowStore.getState().getWorkflowById(workflowId);
    if (!saved) return;

    loadWorkflow({
      nodes: saved.nodes,
      edges: saved.edges,
      infoNodes: [
        {
          id: saved.id,
          name: saved.name,
          description: saved.description,
          selections: saved.selections,
          plannedDurationYears: "",
          plannedDurationMonths: "",
          plannedDurationDays: "",
          isActive: true,
          position: { x: INFO_NODE_X, y: 0 },
        },
      ],
      activeWorkflowId: workflowId,
    });
  }, [params.workflowId, activeWorkflowId, loadWorkflow, resetDraft]);

  // Guards the "seed a first draft plan" API call below against firing
  // twice for the same workflow while the request is still in flight (e.g.
  // an unrelated re-render before the mutation resolves).
  const seedingWorkflowIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!workflowDetail) return;
    // Wait for the plans list to settle too — otherwise an empty in-flight
    // `workflowPlans` would look like "no plans" and seed a spurious draft.
    if (isLoadingWorkflowPlans) return;
    const workflowId = String(workflowDetail.id);
    if (workflowId === activeWorkflowId) return;

    const applyWorkflow = (planNodePlans: Plan[]) => {
      // Upsert by id into the local plan store so the existing plan-node UI
      // (edit / allocate work, both keyed by plan id) keeps working off it.
      usePlanStore.setState((state) => ({
        plans: [
          ...state.plans.filter(
            (item) => !planNodePlans.some((plan) => plan.id === item.id),
          ),
          ...planNodePlans,
        ],
      }));

      // Plan-to-plan links (metadataJson.parentId) are the only relationship
      // the backend persists — positions and stage/detail nodes under each
      // plan still live in the local draft only, so those start empty here.
      const { nodes: planNodes, edges: planEdges } =
        buildPlanNodesFromApi(planNodePlans);

      loadWorkflow({
        nodes: planNodes,
        edges: planEdges,
        infoNodes: [
          mapWorkflowResponseToInfoRecord(workflowDetail, {
            x: INFO_NODE_X,
            y: 0,
          }),
        ],
        activeWorkflowId: workflowId,
      });
    };

    const planNodePlans: Plan[] = workflowPlans.map(mapPlanResponseToPlan);
    if (planNodePlans.length > 0) {
      applyWorkflow(planNodePlans);
      return;
    }

    // No plans on this workflow yet — create a first draft plan through the
    // API (instead of only seeding it locally) so it exists on the backend
    // as soon as the canvas opens.
    if (seedingWorkflowIdRef.current === workflowId) return;
    seedingWorkflowIdRef.current = workflowId;

    createPlan
      .mutateAsync({
        workflowId: workflowDetail.id,
        payload: {
          name: DEFAULT_DRAFT_PLAN_NAME,
          purpose: "CULTIVATION",
          durationDays: 1,
          status: "DRAFT",
        },
      })
      .then((created) => {
        applyWorkflow([mapPlanResponseToPlan(created)]);
      })
      .catch(() => {
        seedingWorkflowIdRef.current = null;
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tạo kế hoạch nháp cho quy trình này",
        });
      });
    // createPlan (a mutation object) intentionally excluded — it's not
    // stable across renders and the seedingWorkflowIdRef guard above already
    // prevents duplicate submissions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowDetail, isLoadingWorkflowPlans, workflowPlans, activeWorkflowId, loadWorkflow, toast]);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(
    null,
  );
  const [flowInstance, setFlowInstance] = useState<FlowViewInstance | null>(
    null,
  );

  useDialogBugWorkaround([confirmAction !== null]);

  const attachPlanNode = (planId: number, sourceNodeId?: string) => {
    const id = createNodeId("plan");

    if (!sourceNodeId) {
      addNode({
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: { setupKind: "plan", planId },
      });
      return;
    }

    addNodeWithEdge(
      {
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: { setupKind: "plan", planId, parentId: sourceNodeId },
      },
      buildChildEdge(sourceNodeId, id),
    );
  };

  const createPlanNode = async (sourceNodeId?: string, planName = "") => {
    // Only a persisted (numeric) workflow id can own plans on the backend —
    // a still-local draft workflow keeps creating plans locally until it's
    // saved, same as before.
    if (activeWorkflowId && isPersistedWorkflowId(activeWorkflowId)) {
      try {
        const sourceNode = sourceNodeId
          ? nodes.find((node) => node.id === sourceNodeId)
          : undefined;
        const parentPlanId =
          sourceNode?.data.setupKind === "plan" ? sourceNode.data.planId : undefined;

        const created = await createPlan.mutateAsync({
          workflowId: activeWorkflowId,
          payload: {
            name: planName || DEFAULT_DRAFT_PLAN_NAME,
            purpose: "CULTIVATION",
            durationDays: 1,
            status: "DRAFT",
            ...(parentPlanId != null
              ? { metadataJson: { parentId: parentPlanId } }
              : {}),
          },
        });
        const plan = mapPlanResponseToPlan(created);
        // Upsert by id, not append — the local plan store is preloaded with
        // seed/mock plans whose ids are small sequential integers too, so a
        // freshly created backend plan can collide with one of them. A plain
        // append would leave both in the array and `.find()` would then
        // resolve to the stale seed entry instead of the real plan.
        usePlanStore.setState((state) => ({
          plans: [...state.plans.filter((item) => item.id !== plan.id), plan],
        }));
        attachPlanNode(plan.id, sourceNodeId);
      } catch {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tạo kế hoạch nháp mới",
        });
      }
      return;
    }

    addPlan(createEmptyPlanDraft(planName));
    const created = usePlanStore.getState().plans.at(-1);
    if (!created) return;
    attachPlanNode(created.id, sourceNodeId);
  };

  const handleRequestCreatePlan = (sourceNodeId?: string) => {
    setConfirmAction({
      title: "Tạo kế hoạch mới?",
      description: "Một kế hoạch mới sẽ được thêm vào sơ đồ quy trình.",
      confirmLabel: "Tạo kế hoạch",
      onConfirm: () => createPlanNode(sourceNodeId),
    });
  };

  const handleRequestDeletePlan = (nodeId: string) => {
    const node = nodes.find((item) => item.id === nodeId);
    const planData = node?.data.setupKind === "plan" ? node.data : undefined;
    const plan = planData
      ? plans.find((item) => item.id === planData.planId)
      : undefined;

    setConfirmAction({
      title: "Xóa kế hoạch?",
      description: `Hành động này sẽ xóa kế hoạch${
        plan?.name ? ` "${plan.name}"` : " này"
      } cùng toàn bộ giai đoạn và chi tiết bên trong. Không thể hoàn tác.`,
      confirmLabel: "Xóa kế hoạch",
      tone: "destructive",
      onConfirm: async () => {
        if (!node || node.data.setupKind !== "plan") {
          removeNodeCascade(nodeId);
          return;
        }

        // Deleting a plan node cascades to its descendant plan nodes too —
        // each one is a real backend plan, so it needs its own delete call.
        const planIds = [
          node.data.planId,
          ...getDescendantNodes(nodes, nodeId)
            .filter((item) => item.data.setupKind === "plan")
            .map((item) => (item.data as { planId: number }).planId),
        ];

        if (activeWorkflowId && isPersistedWorkflowId(activeWorkflowId)) {
          try {
            await Promise.all(
              planIds.map((planId) => deletePlan.mutateAsync(planId)),
            );
            usePlanStore.setState((state) => ({
              plans: state.plans.filter((item) => !planIds.includes(item.id)),
            }));
            removeNodeCascade(nodeId);
            toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
          } catch {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: "Không thể xóa kế hoạch",
            });
          }
          return;
        }

        planIds.forEach((planId) => deletePlanLocal(planId));
        removeNodeCascade(nodeId);
      },
    });
  };

  const handlers: NodeHandlers = {
    onCreatePlan: (sourceNodeId) => handleRequestCreatePlan(sourceNodeId),
    onEditPlan: (planId) =>
      setLocation(`/plan-growth/create/workflow/plan/${planId}/edit`),
    onAllocateWork: (planId) => setLocation(`/task?planId=${planId}`),
    onRequestDeletePlan: (nodeId) => handleRequestDeletePlan(nodeId),
  };

  const handleOpenCreateInfoNode = () => {
    setLocation(`${WORKFLOW_BASE_PATH}/info/create`);
  };

  const handleOpenEditInfoNode = (id: string) => {
    setLocation(`${WORKFLOW_BASE_PATH}/info/${id}/edit`);
  };

  const handleSaveWorkflow = () => {
    if (!infoNodes.length) return;

    // Multiple info cards can exist in one draft, but only one drives the
    // plan tree today (see usePlanForm's workflowInfo lookup) — so every
    // plan in this draft gets linked to that same primary workflow.
    const primaryWorkflow = infoNodes.find((item) => item.isActive) ?? infoNodes[0];

    infoNodes.forEach((info) => {
      upsertWorkflow({
        id: info.id,
        name: info.name,
        description: info.description,
        selections: info.selections,
        isActive: info.isActive,
        // Only the primary workflow owns the canvas — secondary info cards
        // aren't tied to a distinct part of the tree today.
        nodes: info.id === primaryWorkflow.id ? nodes : [],
        edges: info.id === primaryWorkflow.id ? edges : [],
      });
    });

    nodes.forEach((node) => {
      if (node.data.setupKind !== "plan") return;
      updatePlan(node.data.planId, { workflowId: primaryWorkflow.id });
    });

    toast({
      title: "Đã lưu quy trình",
      description: "Sơ đồ quy trình canh tác đã được lưu lại.",
    });
    // Already persisted to useWorkflowStore above — clear the draft so a
    // later bare "/create/workflow" visit doesn't reopen this canvas.
    resetDraft();
    setLocation("/plan-growth");
  };

  const infoNodeHandlers: InfoNodeHandlers = {
    onEdit: handleOpenEditInfoNode,
  };

  const displayNodes = nodes.map((node) =>
    toDisplayNode(node, nodes, handlers, regions, plans),
  );

  infoNodes.forEach((record) => {
    displayNodes.push(toInfoDisplayNode(record, regions, infoNodeHandlers));
  });

  const displayEdges = edges.map((edge) => {
    const targetDepth = getPlanOutlineCode(edge.target, nodes).split(
      ".",
    ).length;
    const isDeepBranch = targetDepth >= 3;

    return {
      ...edge,
      style: {
        ...edge.style,
        strokeDasharray: isDeepBranch ? "6 6" : undefined,
      },
    };
  });

  useEffect(() => {
    if (!flowInstance || displayNodes.length === 0) return;
    flowInstance.fitView({ padding: 0.24, includeHiddenNodes: true });
  }, [flowInstance, displayNodes.length, displayEdges.length]);

  const handleConnect = (connection: Connection) => {
    setEdges((current) => addEdge(connection, current));
  };

  // DiagramInfo cards live in local state, not the plan-workflow draft store,
  // so their drag changes need to be routed there instead of the store
  // (which doesn't know their ids). Only react to actual "position" changes —
  // React Flow also pings dimension/select changes for every unmeasured
  // node, and always calling setInfoNodes for those would create a new array
  // reference each time, re-triggering measurement forever.
  const handleDisplayNodesChange = (changes: NodeChange[]) => {
    const infoIds = new Set(infoNodes.map((item) => item.id));
    const infoPositionChanges = changes.filter(
      (change): change is Extract<NodeChange, { type: "position" }> =>
        change.type === "position" &&
        infoIds.has(change.id) &&
        Boolean(change.position),
    );
    const otherChanges = changes.filter(
      (change) => !("id" in change) || !infoIds.has(change.id),
    );

    if (infoPositionChanges.length) {
      setInfoNodes((prev) =>
        prev.map((item) => {
          const change = infoPositionChanges.find((c) => c.id === item.id);
          return change && change.type === "position" && change.position
            ? { ...item, position: change.position }
            : item;
        }),
      );
    }

    if (otherChanges.length) onNodesChange(otherChanges);
  };

  return (
    <PageWrapper
      title="Sơ đồ quy trình canh tác"
      description="Quy trình triển khai các kế hoạch được liên kết với nhau trên sơ đồ"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation("/plan-growth")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            className="h-9 px-3"
            disabled={infoNodes.length === 0}
            onClick={handleSaveWorkflow}
          >
            <Save className="mr-2 h-4 w-4" />
            Lưu quy trình
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {infoNodes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <Workflow className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Chưa có sơ đồ quy trình
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Tạo thông tin sơ đồ quy trình trước khi bắt đầu xây dựng các kế
              hoạch liên kết với nhau.
            </p>
            <Button className="mt-6" onClick={handleOpenCreateInfoNode}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo sơ đồ quy trình
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="relative h-[calc(100vh-310px)] min-h-[720px]">
              <ReactFlow
                key={displayNodes.length}
                nodes={displayNodes}
                edges={displayEdges}
                nodeTypes={nodeTypes}
                onInit={setFlowInstance}
                onNodesChange={handleDisplayNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                fitView
                fitViewOptions={{ padding: 0.24 }}
                minZoom={0.3}
                maxZoom={1.35}
                nodesDraggable
                nodesConnectable
                elementsSelectable={false}
                panOnDrag
                zoomOnScroll
                snapToGrid
                snapGrid={[24, 24]}
                proOptions={{ hideAttribution: true }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={26}
                  size={1}
                  color="#dbe4ee"
                />
                <Controls
                  showInteractive={false}
                  className="!border !border-slate-200 !bg-white/95 !shadow-lg"
                />
                <MiniMap
                  nodeColor={(node) => {
                    const kind = node.data?.kind as
                      | WorkflowCardNodeData["kind"]
                      | undefined;
                    if (kind === "cycle") return "#7c3aed";
                    if (kind === "plan") return "#0f172a";
                    if (kind === "stage") return "#0ea5e9";
                    return "#8b5cf6";
                  }}
                  maskColor="rgba(248,250,252,0.78)"
                  className="!rounded-xl !border !border-slate-200 !bg-white/95 !shadow-lg"
                />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmAction?.onConfirm();
                setConfirmAction(null);
              }}
              className={
                confirmAction?.tone === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {confirmAction?.confirmLabel ?? "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
