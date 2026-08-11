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
  Ban,
  CheckCircle2,
  ClipboardList,
  Layers,
  PencilLine,
  Plus,
  Save,
  Trash2,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  DiagramInfoFormDialog,
  type DiagramInfoFormData,
} from "./components/DiagramInfoFormDialog";
import {
  getDirectChildren,
  getParentId,
  usePlanWorkflowDraftStore,
  type DiagramInfoRecord,
  type DraftNode,
} from "./hooks/usePlanWorkflowDraftStore";
import { summarizePlanSelections, summarizeSelections } from "./utils/location";

type PlanDisplayStatus =
  | "missing_info"
  | "pending"
  | "in_progress"
  | "completed";

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
  missing_info: { nodeStatus: "not_started", label: "Thiếu thông tin" },
  pending: { nodeStatus: "ended", label: "Chờ triển khai" },
  in_progress: { nodeStatus: "in_progress", label: "Đang triển khai" },
  completed: { nodeStatus: "completed", label: "Đã kết thúc" },
};

const INFO_NODE_X = -560;
const INFO_NODE_GAP_Y = 300;
const DEFAULT_DIAGRAM_INFO_EYEBROW = "Quy trình canh tác";
const DEFAULT_DRAFT_PLAN_NAME = "Kế hoạch Draft";

type FlowViewInstance = {
  fitView: (options?: {
    padding?: number;
    includeHiddenNodes?: boolean;
  }) => void;
};

function createInfoNodeId() {
  return `info-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getNextInfoNodePosition(existing: DiagramInfoRecord[]) {
  return { x: INFO_NODE_X, y: existing.length * INFO_NODE_GAP_Y };
}

function getDurationLabel(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "Chưa xác định";

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "Chưa xác định";
  if (end < start) return "Chưa xác định";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (days > 0 || !parts.length) parts.push(`${days} ngày`);

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

function buildAutoPlanCode() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `KH-DRAFT-${stamp}`;
}

function createEmptyPlanDraft(name = ""): Omit<Plan, "id" | "createdAt"> {
  return {
    code: buildAutoPlanCode(),
    name,
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],
    materialAllocations: [],
    taskAllocations: [],
    status: "draft",
  };
}

function createNodeId(kind: "plan" | "stage" | "detail") {
  return `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

// Positions are placeholders — usePlanWorkflowDraftStore auto-lays out the
// whole tree after every add/remove, so the exact initial value doesn't matter.
const PLACEHOLDER_POSITION = { x: 0, y: 0 };

function isPlanInfoComplete(plan: Plan) {
  return Boolean(
    plan.name.trim() &&
    plan.seasonId &&
    plan.startDate &&
    plan.endDate &&
    plan.crop.trim() &&
    plan.selectedRegionIds.length,
  );
}

function getPlanDisplayStatus(plan: Plan, hasWork: boolean): PlanDisplayStatus {
  if (plan.status === "completed" || plan.status === "cancelled")
    return "completed";
  if (!isPlanInfoComplete(plan)) return "missing_info";
  return hasWork ? "in_progress" : "pending";
}

function getPlanActionDisabled(status: PlanDisplayStatus) {
  return {
    edit: status === "completed",
    allocate: !(status === "pending" || status === "in_progress"),
    remove: !(status === "pending" || status === "missing_info"),
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
  if (!summary.length) return ["Chưa chọn vùng"];

  return summary.map((group) => {
    const itemLabel = group.items.map((item) => item.name).join(", ");
    return itemLabel ? `${group.regionName} (${itemLabel})` : group.regionName;
  });
}

function getRegionLabelsFromSelections(
  selections: DiagramInfoFormData["selections"],
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
) {
  const summary = summarizeSelections(selections, regions || []);
  if (!summary.length) return ["Chưa chọn vùng"];

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

  const hasWork =
    plan.taskAllocations.length > 0 || plan.materialAllocations.length > 0;
  const status = getPlanDisplayStatus(plan, hasWork);
  const statusMeta = PLAN_STATUS_META[status];
  const actionDisabled = getPlanActionDisabled(status);
  const duration = getDurationLabel(plan.startDate, plan.endDate);

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
      title: plan.name
        ? `${plan.name} (${duration})`
        : `Kế hoạch mới (${duration})`,
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
  onRequestToggleActive: (id: string) => void;
  onRequestDelete: (id: string) => void;
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
      status: record.isActive ? "in_progress" : "ended",
      statusLabel: record.isActive ? "Đang áp dụng" : "Ngừng hoạt động",
      wide: true,
      description: record.description || "Chưa có mô tả cho node này.",
      regionLabels: getRegionLabelsFromSelections(record.selections, regions),
      actions: [
        {
          label: "Chỉnh sửa",
          icon: PencilLine,
          onClick: () => handlers.onEdit(record.id),
        },
        {
          label: record.isActive ? "Ngừng hoạt động" : "Kích hoạt",
          icon: record.isActive ? Ban : CheckCircle2,
          tone: record.isActive ? "destructive" : "default",
          onClick: () => handlers.onRequestToggleActive(record.id),
        },
        {
          label: "Xóa node",
          icon: Trash2,
          tone: "destructive",
          onClick: () => handlers.onRequestDelete(record.id),
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
  const deletePlan = usePlanStore((state) => state.deletePlan);
  const upsertWorkflow = useWorkflowStore((state) => state.upsertWorkflow);

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

  useEffect(() => {
    const workflowId = params.workflowId ?? null;
    // Bare route ("/create/workflow" with no id) always means "continue the
    // current draft" — the "Khởi tạo kế hoạch mới" entry points reset the
    // draft explicitly before navigating here, so this effect must never
    // infer a reset from the URL alone (that would also fire every time a
    // plan/stage/detail sub-route routes back to this same bare path).
    if (!workflowId || workflowId === activeWorkflowId) return;

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
          isActive: true,
          position: { x: INFO_NODE_X, y: 0 },
        },
      ],
      activeWorkflowId: workflowId,
    });
  }, [params.workflowId, activeWorkflowId, loadWorkflow, resetDraft]);

  const [infoFormOpen, setInfoFormOpen] = useState(false);
  const [editingInfoNodeId, setEditingInfoNodeId] = useState<string | null>(
    null,
  );
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(
    null,
  );
  const [flowInstance, setFlowInstance] = useState<FlowViewInstance | null>(
    null,
  );

  useDialogBugWorkaround([infoFormOpen, confirmAction !== null]);

  const editingInfoNode = editingInfoNodeId
    ? (infoNodes.find((item) => item.id === editingInfoNodeId) ?? null)
    : null;

  const createPlanNode = (sourceNodeId?: string, planName = "") => {
    addPlan(createEmptyPlanDraft(planName));
    const created = usePlanStore.getState().plans.at(-1);
    if (!created) return;

    const id = createNodeId("plan");

    if (!sourceNodeId) {
      addNode({
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: { setupKind: "plan", planId: created.id },
      });
      return;
    }

    addNodeWithEdge(
      {
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: { setupKind: "plan", planId: created.id, parentId: sourceNodeId },
      },
      buildChildEdge(sourceNodeId, id),
    );
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
      onConfirm: () => {
        if (node && node.data.setupKind === "plan") {
          deletePlan(node.data.planId);
        }
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
    setEditingInfoNodeId(null);
    setInfoFormOpen(true);
  };

  const handleOpenEditInfoNode = (id: string) => {
    setEditingInfoNodeId(id);
    setInfoFormOpen(true);
  };

  const handleSubmitInfoForm = (values: DiagramInfoFormData) => {
    const isNewNode = !editingInfoNode;
    const isFirstInfoNode = infoNodes.length === 0;

    if (isNewNode) {
      const newRecord: DiagramInfoRecord = {
        id: createInfoNodeId(),
        ...values,
        isActive: true,
        position: getNextInfoNodePosition(infoNodes),
      };
      setInfoNodes((prev) => [...prev, newRecord]);
    } else if (editingInfoNodeId) {
      setInfoNodes((prev) =>
        prev.map((item) =>
          item.id === editingInfoNodeId ? { ...item, ...values } : item,
        ),
      );
    }

    setInfoFormOpen(false);
    setEditingInfoNodeId(null);

    if (isNewNode && isFirstInfoNode && nodes.length === 0) {
      createPlanNode(undefined, DEFAULT_DRAFT_PLAN_NAME);
    }

    toast({
      title: "Thành công",
      description: isNewNode
        ? "Đã thêm node thông tin quy trình"
        : "Đã cập nhật node thông tin quy trình",
    });
  };

  const handleRequestToggleInfoNodeActive = (id: string) => {
    const record = infoNodes.find((item) => item.id === id);
    if (!record) return;
    const willActivate = !record.isActive;

    setConfirmAction({
      title: willActivate ? "Kích hoạt node?" : "Ngừng hoạt động node?",
      description: willActivate
        ? "Node thông tin quy trình sẽ được kích hoạt trở lại."
        : "Node thông tin quy trình sẽ tạm ngừng hoạt động. Bạn có thể kích hoạt lại bất cứ lúc nào.",
      confirmLabel: willActivate ? "Kích hoạt" : "Ngừng hoạt động",
      tone: willActivate ? "default" : "destructive",
      onConfirm: () => {
        setInfoNodes((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: willActivate } : item,
          ),
        );
      },
    });
  };

  const handleRequestDeleteInfoNode = (id: string) => {
    const record = infoNodes.find((item) => item.id === id);

    setConfirmAction({
      title: "Xóa node thông tin quy trình?",
      description: `Hành động này sẽ xóa node${
        record?.name ? ` "${record.name}"` : " này"
      }. Không thể hoàn tác.`,
      confirmLabel: "Xóa node",
      tone: "destructive",
      onConfirm: () => {
        setInfoNodes((prev) => prev.filter((item) => item.id !== id));
      },
    });
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
    onRequestToggleActive: handleRequestToggleInfoNodeActive,
    onRequestDelete: handleRequestDeleteInfoNode,
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

      <DiagramInfoFormDialog
        open={infoFormOpen}
        onOpenChange={(open) => {
          setInfoFormOpen(open);
          if (!open) setEditingInfoNodeId(null);
        }}
        isEdit={!!editingInfoNode}
        initialData={
          editingInfoNode || { name: "", description: "", selections: [] }
        }
        onSubmit={handleSubmitInfoForm}
      />

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
