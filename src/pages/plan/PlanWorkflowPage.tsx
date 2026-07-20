import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Eye, PencilLine, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";
import { useLocation, useParams } from "wouter";
import usePlanStore, { type Plan } from "../../stores/usePlanStore";
import type {
  WorkflowActionItem,
  WorkflowCardNodeData,
  WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { getPlanStatusBadge } from "./utils/status";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

type TaskGroup = {
  label: string;
  tasks: Plan["taskAllocations"];
  color: string;
};

function formatDate(value?: string) {
  if (!value) return "Chưa có";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function normalizeText(value?: string) {
  return value?.trim().toLowerCase() || "";
}

function getStatusNode(status: Plan["status"]): WorkflowNodeStatus {
  if (status === "active") return "in_progress";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "ended";
  return "not_started";
}

function getPurposeLabel(plan: Plan) {
  if (plan.purpose === "cultivation") return "Canh tác";
  if (plan.purpose === "treatment") return "Điều trị";
  if (plan.purpose === "amendment") return "Cải tạo";
  if (plan.purpose === "harvest") return "Thu hoạch";
  return "Phát sinh";
}

function countWorkers(tasks: Plan["taskAllocations"]) {
  const total = tasks.reduce((sum, task) => {
    const match = String(task.labor).match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);

  return total > 0 ? `${total} người` : "Chưa phân bổ";
}

function countMaterials(materials: Plan["materialAllocations"]) {
  if (materials.length === 0) return "Chưa phân bổ";

  const categories = materials.reduce<Record<string, number>>((acc, item) => {
    const label = item.materialCategory?.trim() || "Vật tư";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const preferred = ["Máy móc", "Thuốc BTVT", "Phân bón"];
  const entries = [
    ...preferred
      .filter((label) => categories[label])
      .map((label) => `${categories[label]} ${label.toLowerCase()}`),
    ...Object.entries(categories)
      .filter(([label]) => !preferred.includes(label))
      .map(([label, amount]) => `${amount} ${label.toLowerCase()}`),
  ];

  return entries.slice(0, 3).join(", ");
}

function getTaskCountLabel(tasks: Plan["taskAllocations"]) {
  if (tasks.length === 0) return "0 công việc";
  if (tasks.length === 1) return "1 công việc";
  return `${tasks.length} công việc`;
}

function buildTaskGroups(plan: Plan): TaskGroup[] {
  const selectedStages = plan.selectedStages.length
    ? plan.selectedStages
    : ["Công việc"];

  const groups = selectedStages.map((stage) => ({
    label: stage,
    tasks: plan.taskAllocations.filter(
      (task) => normalizeText(task.stageId) === normalizeText(stage),
    ),
    color: "#3b82f6",
  }));

  const groupedTaskIds = new Set(
    groups.flatMap((group) => group.tasks.map((task) => task.id)),
  );

  const unassignedTasks = plan.taskAllocations.filter(
    (task) => !groupedTaskIds.has(task.id),
  );

  if (unassignedTasks.length > 0) {
    groups.push({
      label: "Chưa gán giai đoạn",
      tasks: unassignedTasks,
      color: "#f59e0b",
    });
  }

  return groups;
}

function buildPlanNode(
  plan: Plan,
  onEdit: () => void,
  onView: () => void,
  onCreate: () => void,
): Node<WorkflowCardNodeData> {
  return {
    id: `plan-${plan.id}`,
    type: "workflowCard",
    position: { x: 0, y: 0 },
    data: {
      kind: "plan",
      eyebrow: "Kế hoạch cha",
      title: plan.name,
      subtitle: `${plan.seasonName} · ${plan.crop}${plan.variety ? ` - ${plan.variety}` : ""}`,
      status: getStatusNode(plan.status),
      wide: true,
      sourceBottomHandleId: `plan-${plan.id}-source-bottom`,
      summaries: [
        { label: "Bắt đầu", value: formatDate(plan.startDate) },
        { label: "Kết thúc", value: formatDate(plan.endDate) },
        { label: "Giai đoạn", value: plan.selectedStages.length.toString() },
        { label: "Nhân lực", value: countWorkers(plan.taskAllocations) },
        { label: "Vật tư", value: countMaterials(plan.materialAllocations) },
        { label: "Mục đích", value: getPurposeLabel(plan) },
      ],
      description: plan.description || "Chưa có mô tả cho kế hoạch này.",
      actions: [
        {
          label: "Xem chi tiết",
          icon: Eye,
          onClick: onView,
        },
        {
          label: "Chỉnh sửa",
          icon: PencilLine,
          onClick: onEdit,
        },
      ],
      footerAction: {
        label: "Thêm mới",
        icon: Plus,
        onClick: onCreate,
      },
    },
  };
}

function getTaskActions(
  planId: number,
  navigate: (path: string) => void,
): WorkflowActionItem[] {
  return [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => navigate(`/plan/${planId}`),
    },
    {
      label: "Chỉnh sửa",
      icon: PencilLine,
      onClick: () => navigate(`/plan/${planId}/edit`),
    },
  ];
}

export default function PlanWorkflowPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const plan = usePlanStore((state) => state.getPlanById(Number(params.id)));

  const flowDefinition = useMemo(() => {
    if (!plan) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const taskGroups = buildTaskGroups(plan);
    const nodes: Node<WorkflowCardNodeData>[] = [];
    const edges: Edge[] = [];

    const rootNode = buildPlanNode(
      plan,
      () => setLocation(`/plan/${plan.id}/edit`),
      () => setLocation(`/plan/${plan.id}`),
      () => setLocation(`/plan/${plan.id}/create`),
    );
    nodes.push(rootNode);

    const stageGap = taskGroups.length > 1 ? 320 : 0;
    const stageStartX = -((Math.max(taskGroups.length, 1) - 1) * stageGap) / 2;

    taskGroups.forEach((group, stageIndex) => {
      const stageNodeId = `stage-${stageIndex}`;
      const stageNode: Node<WorkflowCardNodeData> = {
        id: stageNodeId,
        type: "workflowCard",
        position: { x: stageStartX + stageIndex * stageGap, y: 280 },
        data: {
          kind: "stage",
          eyebrow: "Giai đoạn",
          title: group.label,
          subtitle: `${group.tasks.length} công việc`,
          status: group.tasks.length ? "in_progress" : "not_started",
          targetBottomHandleId: `${stageNodeId}-target-bottom`,
          summaries: [
            { label: "Công việc", value: getTaskCountLabel(group.tasks) },
            { label: "Sở hữu", value: plan.seasonName || "Chưa rõ" },
            {
              label: "Vật tư",
              value: group.tasks.length ? "Đã có danh sách" : "Chưa có",
            },
          ],
          description: `Công việc thuộc giai đoạn "${group.label}" của kế hoạch ${plan.code}.`,
          // actions: [
          //   {
          //     label: "Thêm mới",
          //     icon: PencilLine,
          //     onClick: () => setLocation(`/plan/${plan.id}/edit`),
          //   },
          // ],
          footerAction: {
            label: "Thêm mới",
            icon: Plus,
            onClick: () => setLocation(`/task/create`),
          },
        },
      };
      nodes.push(stageNode);

      edges.push({
        id: `edge-plan-stage-${stageIndex}`,
        source: `plan-${plan.id}`,
        target: stageNodeId,
        sourceHandle: `plan-${plan.id}-source-bottom`,
        targetHandle: `${stageNodeId}-target-bottom`,
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
        },
        style: {
          strokeWidth: 2,
          stroke: group.color,
        },
      });

      const taskGap = group.tasks.length > 1 ? 280 : 0;
      const taskStartX =
        stageNode.position.x -
        ((Math.max(group.tasks.length, 1) - 1) * taskGap) / 2;

      group.tasks.forEach((task, taskIndex) => {
        const taskNodeId = `task-${task.id}`;
        const taskNode: Node<WorkflowCardNodeData> = {
          id: taskNodeId,
          type: "workflowCard",
          position: {
            x: taskStartX + taskIndex * taskGap,
            y: 560,
          },
          data: {
            kind: "task",
            eyebrow: "Công việc",
            title: task.name,
            subtitle: `${group.label} · ${task.duration || "Chưa xác định"}`,
            status: "not_started",
            targetTopHandleId: `${taskNodeId}-target-top`,
            sourceBottomHandleId: `${taskNodeId}-source-bottom`,
            summaries: [
              { label: "Nhân lực", value: task.labor || "Chưa có" },
              { label: "Thời lượng", value: task.duration || "Chưa xác định" },
            ],
            description: task.description || "Chưa có mô tả công việc.",
            actions: getTaskActions(plan.id, setLocation),
          },
        };
        nodes.push(taskNode);

        const sourceId =
          taskIndex === 0
            ? stageNodeId
            : `task-${group.tasks[taskIndex - 1].id}`;
        edges.push({
          id: `edge-${sourceId}-${taskNodeId}`,
          source: sourceId,
          target: taskNodeId,
          sourceHandle:
            sourceId === stageNodeId
              ? `${stageNodeId}-target-bottom`
              : `task-${group.tasks[taskIndex - 1].id}-source-bottom`,
          targetHandle: `${taskNodeId}-target-top`,
          type: "step",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
          },
          style: {
            strokeWidth: 1.75,
            stroke: group.color,
            strokeDasharray: taskIndex === 0 ? undefined : "5 5",
          },
        });
      });
    });

    return { nodes, edges };
  }, [plan, setLocation]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowDefinition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowDefinition.edges);

  useEffect(() => {
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  }, [flowDefinition, setEdges, setNodes]);

  if (!plan) {
    return (
      <AdminLayout
        isDev
        title="Workflow kế hoạch"
        description="Không tìm thấy kế hoạch"
      >
        <div className="flex h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border bg-background p-6 text-center shadow-sm">
            <p className="text-lg font-semibold">Không tìm thấy kế hoạch</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Kế hoạch này có thể đã bị xoá hoặc đường dẫn không hợp lệ.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setLocation("/plan")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về danh sách
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev
      title="Workflow kế hoạch"
      description={`Trực quan hóa kế hoạch ${plan.code} và danh sách công việc`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation("/plan")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(`/plan/${plan.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            className="h-9 px-3"
            onClick={() => setLocation(`/plan/${plan.id}/edit`)}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{plan.code}</Badge>
        <Badge variant="outline">{plan.seasonName}</Badge>
        <Badge variant="outline">
          {plan.crop}
          {plan.variety ? ` - ${plan.variety}` : ""}
        </Badge>
        <Badge variant="outline">{plan.selectedStages.length} giai đoạn</Badge>
        <Badge variant="outline">{plan.taskAllocations.length} công việc</Badge>
        <Badge variant="outline">
          {plan.materialAllocations.length} nhóm vật tư
        </Badge>
        {getPlanStatusBadge(plan.status)}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="h-[920px] overflow-hidden bg-[#f8fafc]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.35}
              maxZoom={1.25}
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag
              zoomOnScroll
              snapToGrid
              snapGrid={[24, 24]}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="#dbe4ee"
              />
              <Controls
                showInteractive={false}
                className="!border !border-slate-200 !bg-white/95 !shadow-lg"
              />
              <MiniMap
                nodeColor={(node) => {
                  const kind = node.data?.kind as string | undefined;
                  if (kind === "plan") return "#0f172a";
                  if (kind === "stage") return "#10b981";
                  return "#f59e0b";
                }}
                maskColor="rgba(248,250,252,0.75)"
                className="!rounded-xl !border !border-slate-200 !bg-white/95 !shadow-lg"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
