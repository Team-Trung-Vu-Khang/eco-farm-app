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
} from "reactflow";
import { useLocation } from "wouter";
import usePlanStore, { type Plan } from "../../stores/usePlanStore";
import {
  WorkflowCardNode,
  type WorkflowActionItem,
  type WorkflowCardNodeData,
  type WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import {
  getDirectChildren,
  getParentId,
  usePlanWorkflowDraftStore,
  type DraftNode,
} from "./hooks/usePlanWorkflowDraftStore";
import { summarizePlanSelections } from "./utils/location";

type PlanDisplayStatus =
  | "missing_info"
  | "pending"
  | "in_progress"
  | "completed";

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

function createEmptyPlanDraft(): Omit<Plan, "id" | "createdAt"> {
  return {
    code: buildAutoPlanCode(),
    name: "",
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

export default function PlanGrowthCreateWorkflowPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions } = useRegionStore();
  const plans = usePlanStore((state) => state.plans);
  const addPlan = usePlanStore((state) => state.addPlan);
  const updatePlan = usePlanStore((state) => state.updatePlan);
  const deletePlan = usePlanStore((state) => state.deletePlan);

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

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCreatePlan = (sourceNodeId?: string) => {
    addPlan(createEmptyPlanDraft());
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

  const hasSeededRef = useRef(false);
  useEffect(() => {
    if (hasSeededRef.current) return;
    hasSeededRef.current = true;

    if (nodes.length === 0) {
      handleCreatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmDeletePlan = () => {
    if (!deleteTarget) return;
    const node = nodes.find((item) => item.id === deleteTarget);
    if (node && node.data.setupKind === "plan") {
      deletePlan(node.data.planId);
    }
    removeNodeCascade(deleteTarget);
    setDeleteTarget(null);
  };

  const handlers: NodeHandlers = {
    onCreatePlan: (sourceNodeId) => handleCreatePlan(sourceNodeId),
    onEditPlan: (planId) =>
      setLocation(`/plan-growth/create/workflow/plan/${planId}/edit`),
    onAllocateWork: (planId) => setLocation(`/task?planId=${planId}`),
    onRequestDeletePlan: (nodeId) => setDeleteTarget(nodeId),
  };

  const displayNodes = nodes.map((node) =>
    toDisplayNode(node, nodes, handlers, regions, plans),
  );

  const displayEdges = edges.map((edge) => {
    const targetDepth = getPlanOutlineCode(edge.target, nodes).split(".").length;
    const isDeepBranch = targetDepth >= 3;

    return {
      ...edge,
      style: {
        ...edge.style,
        strokeDasharray: isDeepBranch ? "6 6" : undefined,
      },
    };
  });

  const handleConnect = (connection: Connection) => {
    setEdges((current) => addEdge(connection, current));
  };

  const handleSavePlan = () => {
    const planNode = nodes.find((node) => node.data.setupKind === "plan");
    if (!planNode) {
      toast({
        title: "Thiếu thông tin",
        description: "Bạn cần tạo một node kế hoạch trước khi lưu.",
      });
      return;
    }
    const planNodeData = planNode.data;
    if (planNodeData.setupKind !== "plan") {
      toast({
        title: "Thiếu thông tin",
        description: "Bạn cần tạo một node kế hoạch trước khi lưu.",
      });
      return;
    }

    const plan = plans.find((item) => item.id === planNodeData.planId);
    if (!plan || !isPlanInfoComplete(plan)) {
      toast({
        title: "Thiếu thông tin",
        description: "Hãy điều chỉnh thông tin kế hoạch trước khi lưu.",
      });
      return;
    }

    updatePlan(plan.id, { status: "active" });

    toast({
      title: "Thành công",
      description: `Đã hoàn tất kế hoạch ${plan.name}`,
    });
    setLocation(`/plan-growth/${plan.id}/workflow`);
  };

  const deleteTargetNode = deleteTarget
    ? nodes.find((node) => node.id === deleteTarget)
    : undefined;
  const deleteTargetNodeData = deleteTargetNode?.data;
  const deleteTargetPlan =
    deleteTargetNodeData && deleteTargetNodeData.setupKind === "plan"
      ? plans.find((item) => item.id === deleteTargetNodeData.planId)
      : undefined;

  return (
    <PageWrapper
      title="Tạo sơ đồ quy trình canh tác"
      description="Quy trình triển khai các kế hoạch được liên kết với nhau trên sơ đồ."
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

          <Button className="h-9 px-3" onClick={handleSavePlan}>
            <Workflow className="mr-2 h-4 w-4" />
            Tạo kế hoạch
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="relative h-[calc(100vh-310px)] min-h-[720px]">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
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
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa kế hoạch?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa kế hoạch
              {deleteTargetPlan?.name
                ? ` "${deleteTargetPlan.name}"`
                : " này"}{" "}
              cùng toàn bộ giai đoạn và chi tiết bên trong. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa kế hoạch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
