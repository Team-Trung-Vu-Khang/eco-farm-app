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
  Wrench,
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
import usePlanStore, {
  type MaterialAllocation,
  type Plan,
  type TaskAllocation,
} from "../../stores/usePlanStore";
import {
  WorkflowCardNode,
  type WorkflowActionItem,
  type WorkflowCardNodeData,
  type WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import {
  getDetailPayload,
  getDirectChildren,
  getStagePayload,
  usePlanWorkflowDraftStore,
  type DetailPayload,
  type DraftNode,
  type StagePayload,
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

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "Chưa xác định";

  const totalDays = Math.max(0, Math.round((end - start) / 86400000));
  if (totalDays < 30) return `${totalDays} ngày`;

  const months = totalDays / 30;
  const rounded = Math.round(months * 10) / 10;
  return `${
    Number.isInteger(rounded)
      ? rounded
      : rounded.toLocaleString("vi-VN", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
  } tháng`;
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

function getInitialStagePayload(index = 1): StagePayload {
  return {
    stageName: `Giai đoạn ${index}`,
    stageDescription: "",
    duration: "",
  };
}

function getInitialDetailPayload(): DetailPayload {
  return {
    taskName: "",
    taskDescription: "",
    labor: "",
    materialCategory: "",
    materialType: "",
    materialName: "",
    quantity: "",
    unit: "",
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

function getPlanDisplayStatus(
  plan: Plan,
  hasWork: boolean,
): PlanDisplayStatus {
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

function getMaterialBreakdown(materialNames: string[], materialCategories: string[]) {
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
  onAllocateStage: (planNodeId: string) => void;
  onRequestDeletePlan: (nodeId: string) => void;
  onEditStage: (nodeId: string) => void;
  onAddDetail: (stageNodeId: string) => void;
  onDeleteStage: (nodeId: string) => void;
  onEditDetail: (nodeId: string) => void;
  onDeleteDetail: (nodeId: string) => void;
};

function toDisplayNode(
  node: DraftNode,
  allNodes: DraftNode[],
  handlers: NodeHandlers,
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
  plans: Plan[],
): Node<WorkflowCardNodeData> {
  const { id, data } = node;

  if (data.setupKind === "plan") {
    const plan = plans.find((item) => item.id === data.planId);
    if (!plan) {
      return {
        ...node,
        data: {
          kind: "plan",
          eyebrow: "Kế hoạch",
          title: "Kế hoạch không tồn tại",
          status: "not_started",
          statusLabel: "Đã bị xoá",
          wide: true,
          targetTopHandleId: `${id}-target-top`,
          description: "Kế hoạch này đã bị xoá khỏi hệ thống.",
        },
      };
    }

    const stageNodes = getDirectChildren(allNodes, id).filter(
      (child) => child.data.setupKind === "stage",
    );
    const detailNodes = stageNodes.flatMap((stage) =>
      getDirectChildren(allNodes, stage.id).filter(
        (child) => child.data.setupKind === "detail",
      ),
    );
    const details = detailNodes.map((detail) => getDetailPayload(detail));

    const stageNames = stageNodes.map((node) => getStagePayload(node).stageName);
    const laborCount = details.filter((detail) => detail.labor.trim()).length;
    const materialNames = details.map((detail) => detail.materialName);
    const materialCategories = details.map((detail) => detail.materialCategory);
    const materialBreakdown = getMaterialBreakdown(materialNames, materialCategories);

    const status = getPlanDisplayStatus(plan, stageNodes.length > 0);
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
        onClick: () => handlers.onAllocateStage(id),
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
        eyebrow: "Kế hoạch",
        title: plan.name
          ? `${plan.name} (${duration})`
          : `Kế hoạch mới (${duration})`,
        subtitle: plan.seasonName || "Chưa chọn mùa vụ",
        status: statusMeta.nodeStatus,
        statusLabel: statusMeta.label,
        wide: true,
        targetTopHandleId: `${id}-target-top`,
        sourceBottomHandleId: `${id}-source-bottom`,
        tags: getStageTags(stageNames),
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

  if (data.setupKind === "stage") {
    const payload = getStagePayload(node);
    const detailNodes = getDirectChildren(allNodes, id).filter(
      (child) => child.data.setupKind === "detail",
    );
    const detailTags = detailNodes
      .map((detailNode) => getDetailPayload(detailNode).taskName?.trim())
      .filter((name): name is string => Boolean(name));

    const actions: WorkflowActionItem[] = [
      {
        label: "Sửa",
        icon: PencilLine,
        onClick: () => handlers.onEditStage(id),
      },
      {
        label: "Xoá",
        icon: Trash2,
        tone: "destructive",
        onClick: () => handlers.onDeleteStage(id),
      },
    ];

    return {
      ...node,
      data: {
        kind: "stage",
        variant: "poster",
        posterTheme: "light",
        icon: Layers,
        eyebrow: "Giai đoạn",
        title: payload.stageName || "Giai đoạn",
        subtitle: payload.duration || "Chưa có thời lượng",
        status: detailNodes.length ? "in_progress" : "not_started",
        wide: true,
        targetTopHandleId: `${id}-target-top`,
        sourceBottomHandleId: `${id}-source-bottom`,
        tags: detailTags.length ? detailTags : ["Chưa có chi tiết"],
        summaries: [
          { label: "Chi tiết", value: `${detailNodes.length} mục` },
          { label: "Thời lượng", value: payload.duration || "Chưa xác định" },
        ],
        description:
          payload.stageDescription ||
          "Tạo một bước thực thi cụ thể trong kế hoạch.",
        actions,
        footerAction: {
          label: "Thêm chi tiết",
          icon: Plus,
          onClick: () => handlers.onAddDetail(id),
        },
      },
    };
  }

  const payload = getDetailPayload(node);
  const actions: WorkflowActionItem[] = [
    {
      label: "Sửa",
      icon: PencilLine,
      onClick: () => handlers.onEditDetail(id),
    },
    {
      label: "Xoá",
      icon: Trash2,
      tone: "destructive",
      onClick: () => handlers.onDeleteDetail(id),
    },
  ];

  return {
    ...node,
    data: {
      kind: "task",
      variant: "poster",
      posterTheme: "light",
      icon: Wrench,
      eyebrow: "Chi tiết giai đoạn",
      title: payload.taskName || payload.materialName || "Chi tiết giai đoạn",
      subtitle: payload.labor || "Chưa phân bổ nhân lực",
      status: "not_started",
      wide: true,
      targetTopHandleId: `${id}-target-top`,
      summaries: [
        { label: "Vật tư", value: payload.materialName || "Chưa có" },
        {
          label: "Số lượng",
          value: payload.quantity
            ? `${payload.quantity} ${payload.unit}`.trim()
            : "Chưa có",
        },
      ],
      description: payload.taskDescription || "Chưa có mô tả công việc.",
      actions,
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

  const handleCreateStage = (planNodeId: string) => {
    const stageIndex =
      getDirectChildren(nodes, planNodeId).filter(
        (node) => node.data.setupKind === "stage",
      ).length + 1;
    const id = createNodeId("stage");
    addNodeWithEdge(
      {
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: {
          setupKind: "stage",
          payload: getInitialStagePayload(stageIndex),
          parentId: planNodeId,
        },
      },
      buildChildEdge(planNodeId, id),
    );
  };

  const handleCreateDetail = (stageNodeId: string) => {
    const id = createNodeId("detail");
    addNodeWithEdge(
      {
        id,
        type: "workflowCard",
        position: PLACEHOLDER_POSITION,
        data: {
          setupKind: "detail",
          payload: getInitialDetailPayload(),
          parentId: stageNodeId,
        },
      },
      buildChildEdge(stageNodeId, id),
    );
  };

  useEffect(() => {
    const draftNodes = usePlanWorkflowDraftStore.getState().nodes;
    const planNodes = draftNodes.filter((node) => node.data.setupKind === "plan");

    planNodes.forEach((planNode) => {
      const planNodeData = planNode.data;
      if (planNodeData.setupKind !== "plan") return;
      const plan = plans.find((item) => item.id === planNodeData.planId);
      if (!plan) return;

      const stageNames = new Set<string>();
      plan.selectedStages.forEach((name) => name.trim() && stageNames.add(name.trim()));
      plan.taskAllocations.forEach(
        (task) => task.stageId.trim() && stageNames.add(task.stageId.trim()),
      );
      plan.materialAllocations.forEach(
        (material) => material.stageId.trim() && stageNames.add(material.stageId.trim()),
      );

      stageNames.forEach((stageName) => {
        const currentNodes = usePlanWorkflowDraftStore.getState().nodes;
        const alreadySynced = getDirectChildren(currentNodes, planNode.id).some(
          (child) =>
            child.data.setupKind === "stage" &&
            getStagePayload(child).stageName === stageName,
        );
        if (alreadySynced) return;

        const stageTasks = plan.taskAllocations.filter((task) => task.stageId === stageName);
        const stageMaterials = plan.materialAllocations.filter(
          (material) => material.stageId === stageName,
        );

        const stageNodeId = createNodeId("stage");
        addNodeWithEdge(
          {
            id: stageNodeId,
            type: "workflowCard",
            position: PLACEHOLDER_POSITION,
            data: {
              setupKind: "stage",
              payload: {
                stageName,
                stageDescription: stageTasks[0]?.description || "",
                duration: stageTasks[0]?.duration || "",
              },
              parentId: planNode.id,
            },
          },
          buildChildEdge(planNode.id, stageNodeId),
        );

        stageTasks.forEach((task) => {
          const detailNodeId = createNodeId("detail");
          addNodeWithEdge(
            {
              id: detailNodeId,
              type: "workflowCard",
              position: PLACEHOLDER_POSITION,
              data: {
                setupKind: "detail",
                payload: {
                  taskName: task.name,
                  taskDescription: task.description,
                  labor: task.labor,
                  materialCategory: "",
                  materialType: "",
                  materialName: "",
                  quantity: "",
                  unit: "",
                },
                parentId: stageNodeId,
              },
            },
            buildChildEdge(stageNodeId, detailNodeId),
          );
        });

        stageMaterials.forEach((material) => {
          const detailNodeId = createNodeId("detail");
          addNodeWithEdge(
            {
              id: detailNodeId,
              type: "workflowCard",
              position: PLACEHOLDER_POSITION,
              data: {
                setupKind: "detail",
                payload: {
                  taskName: "",
                  taskDescription: "",
                  labor: "",
                  materialCategory: material.materialCategory,
                  materialType: material.materialType,
                  materialName: material.materialName,
                  quantity: material.quantity,
                  unit: material.unit,
                },
                parentId: stageNodeId,
              },
            },
            buildChildEdge(stageNodeId, detailNodeId),
          );
        });
      });
    });
  }, [plans, addNodeWithEdge]);

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
    onAllocateStage: (planNodeId) => handleCreateStage(planNodeId),
    onRequestDeletePlan: (nodeId) => setDeleteTarget(nodeId),
    onEditStage: (nodeId) =>
      setLocation(`/plan-growth/create/workflow/stage/${nodeId}/edit`),
    onAddDetail: (stageNodeId) => handleCreateDetail(stageNodeId),
    onDeleteStage: (nodeId) => removeNodeCascade(nodeId),
    onEditDetail: (nodeId) =>
      setLocation(`/plan-growth/create/workflow/detail/${nodeId}/edit`),
    onDeleteDetail: (nodeId) => removeNodeCascade(nodeId),
  };

  const displayNodes = nodes.map((node) =>
    toDisplayNode(node, nodes, handlers, regions, plans),
  );

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

    const stageNodes = getDirectChildren(nodes, planNode.id).filter(
      (node) => node.data.setupKind === "stage",
    );

    const selectedStages = stageNodes
      .map((node) => getStagePayload(node).stageName?.trim() || "")
      .filter(Boolean);

    const taskAllocations: TaskAllocation[] = [];
    const materialAllocations: MaterialAllocation[] = [];

    stageNodes.forEach((stageNode) => {
      const stagePayload = getStagePayload(stageNode);
      const detailNodes = getDirectChildren(nodes, stageNode.id).filter(
        (node) => node.data.setupKind === "detail",
      );

      if (!detailNodes.length) {
        taskAllocations.push({
          id:
            Number(stageNode.id.replace(/\D/g, "").slice(0, 12)) || Date.now(),
          stageId: stagePayload.stageName || "Giai đoạn",
          name: stagePayload.stageName || "Công việc",
          description: stagePayload.stageDescription || "",
          labor: "Chưa phân bổ",
          duration: stagePayload.duration || "Chưa xác định",
        });
        return;
      }

      detailNodes.forEach((detailNode) => {
        const detail = getDetailPayload(detailNode);
        taskAllocations.push({
          id:
            Number(detailNode.id.replace(/\D/g, "").slice(0, 12)) || Date.now(),
          stageId: stagePayload.stageName || "Giai đoạn",
          name: detail.taskName || stagePayload.stageName || "Công việc",
          description:
            detail.taskDescription || stagePayload.stageDescription || "",
          labor: detail.labor || "Chưa phân bổ",
          duration: stagePayload.duration || "Chưa xác định",
        });

        if (detail.materialName.trim()) {
          materialAllocations.push({
            id:
              Number(detailNode.id.replace(/\D/g, "").slice(0, 12)) ||
              Date.now(),
            stageId: stagePayload.stageName || "Giai đoạn",
            materialCategory: detail.materialCategory || "Vật tư",
            materialType:
              detail.materialType || detail.materialCategory || "Vật tư",
            materialName: detail.materialName,
            quantity: detail.quantity || "1",
            unit: detail.unit || "đơn vị",
          });
        }
      });
    });

    updatePlan(plan.id, {
      selectedStages,
      taskAllocations,
      materialAllocations,
      status: "active",
    });

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
      title="Tạo kế hoạch"
      description="Thiết lập kế hoạch theo từng node"
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
            variant="outline"
            className="h-9 px-3"
            onClick={() => handleCreatePlan()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm kế hoạch
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
              edges={edges}
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
