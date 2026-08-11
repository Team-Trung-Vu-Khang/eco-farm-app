import { Badge, Card, CardContent, CardHeader, CardTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
import { Copy, Eye, PencilLine, Workflow } from "lucide-react";
import { useEffect, useMemo } from "react";
import type { Plan } from "../../../stores/useAquacultureGrowthPlanStore";
import { WorkflowCardNode } from "../../growth-cycle/components/workflow/WorkflowCardNode";
import type {
  WorkflowCardNodeData,
  WorkflowNodeStatus,
} from "../../growth-cycle/components/workflow/WorkflowCardNode";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

const statusOrder: Array<{
  key: Plan["status"];
  label: string;
  laneLabel: string;
  color: string;
  x: number;
}> = [
  {
    key: "draft",
    label: "Bản nháp",
    laneLabel: "Nháp",
    color: "#94a3b8",
    x: -720,
  },
  {
    key: "active",
    label: "Đang thực hiện",
    laneLabel: "Đang chạy",
    color: "#10b981",
    x: -240,
  },
  {
    key: "completed",
    label: "Hoàn thành",
    laneLabel: "Hoàn tất",
    color: "#3b82f6",
    x: 240,
  },
  {
    key: "cancelled",
    label: "Đã hủy",
    laneLabel: "Đã hủy",
    color: "#f43f5e",
    x: 720,
  },
];

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

function getPlanNodeStatus(status: Plan["status"]): WorkflowNodeStatus {
  if (status === "active") return "in_progress";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "ended";
  return "not_started";
}

function getPurposeLabel(plan: Plan) {
  if (plan.purpose === "cultivation") return "Nuôi trồng thủy sản";
  if (plan.purpose === "treatment") return "Điều trị";
  if (plan.purpose === "amendment") return "Cải tạo";
  if (plan.purpose === "harvest") return "Thu hoạch";
  return "Phát sinh";
}

function countPlanWorkers(plan: Plan) {
  const total = plan.taskAllocations.reduce((sum, task) => {
    const match = String(task.labor).match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);

  return total > 0 ? `${total} người` : "Chưa phân bổ";
}

function summarizePlanMaterials(plan: Plan) {
  if (!plan.materialAllocations.length) return "Chưa phân bổ";

  const categories = plan.materialAllocations.reduce<Record<string, number>>(
    (acc, allocation) => {
      const label = allocation.materialCategory?.trim() || "Vật tư";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {},
  );

  const preferred = ["Máy móc", "Chế phẩm thủy sản", "Thức ăn thủy sản"];
  const ordered = [
    ...preferred
      .filter((label) => categories[label])
      .map((label) => `${categories[label]} ${label.toLowerCase()}`),
    ...Object.entries(categories)
      .filter(([label]) => !preferred.includes(label))
      .map(([label, count]) => `${count} ${label.toLowerCase()}`),
  ];

  return ordered.slice(0, 3).join(", ");
}

function getStageSummary(plan: Plan) {
  if (plan.selectedStages.length === 0) return "Chưa chọn giai đoạn";
  if (plan.selectedStages.length <= 2) return plan.selectedStages.join(" · ");
  return `${plan.selectedStages[0]} · +${plan.selectedStages.length - 1}`;
}

function getPlanNodeData(
  plan: Plan,
  actions: WorkflowCardNodeData["actions"],
): WorkflowCardNodeData {
  return {
    kind: "plan",
    eyebrow: "Kế hoạch",
    title: plan.name,
    subtitle: `${plan.seasonName} · ${plan.crop}${plan.variety ? ` - ${plan.variety}` : ""}`,
    status: getPlanNodeStatus(plan.status),
    wide: true,
    summaries: [
      { label: "Bắt đầu", value: formatDate(plan.startDate) },
      { label: "Kết thúc", value: formatDate(plan.endDate) },
      { label: "Giai đoạn", value: getStageSummary(plan) },
      { label: "Nhân lực", value: countPlanWorkers(plan) },
      {
        label: "Vật tư",
        value: summarizePlanMaterials(plan),
      },
      { label: "Mục đích", value: getPurposeLabel(plan) },
    ],
    description: plan.description || "Chưa có mô tả cho kế hoạch này.",
    actions,
    targetTopHandleId: `plan-${plan.id}-target-top`,
    sourceBottomHandleId: `plan-${plan.id}-source-bottom`,
  };
}

function getSummaryCount(plans: Plan[], status: Plan["status"]) {
  return plans.filter((plan) => plan.status === status).length;
}

export function PlanWorkflowCanvas({
  plans,
  onView,
  onEdit,
  onDuplicate,
}: {
  plans: Plan[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDuplicate: (item: { id: number; name: string }) => void;
}) {
  const groupedPlans = useMemo(() => {
    const sorted = [...plans].sort((a, b) => {
      const aDate = new Date(a.startDate).getTime();
      const bDate = new Date(b.startDate).getTime();
      return aDate - bDate;
    });

    return statusOrder.reduce<Record<Plan["status"], Plan[]>>(
      (acc, lane) => {
        acc[lane.key] = sorted.filter((plan) => plan.status === lane.key);
        return acc;
      },
      {
        draft: [],
        active: [],
        completed: [],
        cancelled: [],
      },
    );
  }, [plans]);

  const overviewMetrics = useMemo(() => {
    const totalTasks = plans.reduce(
      (sum, plan) => sum + (plan.taskAllocations?.length || 0),
      0,
    );
    const totalMaterials = plans.reduce(
      (sum, plan) => sum + (plan.materialAllocations?.length || 0),
      0,
    );
    const totalStages = plans.reduce(
      (sum, plan) => sum + (plan.selectedStages?.length || 0),
      0,
    );

    const seasons = new Set(plans.map((plan) => plan.seasonName).filter(Boolean));

    return {
      totalTasks,
      totalMaterials,
      totalStages,
      seasonCount: seasons.size,
    };
  }, [plans]);

  const flowDefinition = useMemo(() => {
    if (plans.length === 0) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const overviewNode: Node<WorkflowCardNodeData> = {
      id: "plan-overview",
      type: "workflowCard",
      position: { x: 0, y: 0 },
      data: {
        kind: "cycle",
        eyebrow: "Tổng quan",
        title: "Workflow kế hoạch",
        subtitle: "Nhìn tổng thể toàn bộ kế hoạch trong hệ thống",
        status: "in_progress",
        wide: true,
        summaries: [
          { label: "Tổng số", value: `${plans.length} kế hoạch` },
          { label: "Vụ nuôi", value: `${overviewMetrics.seasonCount} vụ nuôi` },
          { label: "Giai đoạn", value: `${overviewMetrics.totalStages} giai đoạn` },
          { label: "Nhân lực", value: `${overviewMetrics.totalTasks} nhóm` },
          { label: "Vật tư", value: `${overviewMetrics.totalMaterials} nhóm` },
          { label: "Luồng", value: "Theo trạng thái" },
        ],
        description:
          "Các kế hoạch được sắp theo trạng thái, mỗi node hiển thị thời gian, giai đoạn, nhân lực và vật tư.",
      },
    };

    const nodes: Node<WorkflowCardNodeData>[] = [overviewNode];
    const edges: Edge[] = [];
    const laneGapY = 260;
    const rowGapY = 280;

    statusOrder.forEach((lane, laneIndex) => {
      const lanePlans = groupedPlans[lane.key];

      lanePlans.forEach((plan, rowIndex) => {
        const planId = `plan-${plan.id}`;
        const node: Node<WorkflowCardNodeData> = {
          id: planId,
          type: "workflowCard",
          position: {
            x: lane.x,
            y: laneGapY + rowIndex * rowGapY,
          },
          data: getPlanNodeData(plan, [
            {
              label: "Xem chi tiết",
              icon: Eye,
              onClick: () => onView(plan.id),
            },
            {
              label: "Chỉnh sửa",
              icon: PencilLine,
              onClick: () => onEdit(plan.id),
            },
            {
              label: "Nhân bản",
              icon: Copy,
              onClick: () => onDuplicate({ id: plan.id, name: plan.name }),
            },
          ]),
        };

        nodes.push(node);

        const edge: Edge = {
          id: `edge-plan-overview-${plan.id}`,
          source: "plan-overview",
          target: planId,
          sourceHandle: "cycle-bottom",
          targetHandle: `plan-${plan.id}-target-top`,
          type: "step",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
          },
          style: {
            strokeWidth: 2,
            stroke: lane.color,
          },
        };
        edges.push(edge);

        if (rowIndex > 0) {
          const previousPlan = lanePlans[rowIndex - 1];
          edges.push({
            id: `edge-plan-${previousPlan.id}-${plan.id}`,
            source: `plan-${previousPlan.id}`,
            target: planId,
            sourceHandle: `plan-${previousPlan.id}-source-bottom`,
            targetHandle: `plan-${plan.id}-target-top`,
            type: "step",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
            },
            style: {
              strokeWidth: 1.75,
              stroke: lane.color,
              strokeDasharray: "5 5",
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [groupedPlans, onDuplicate, onEdit, onView, overviewMetrics, plans]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowDefinition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowDefinition.edges);

  useEffect(() => {
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  }, [flowDefinition, setEdges, setNodes]);

  const activeCount = getSummaryCount(plans, "active");
  const draftCount = getSummaryCount(plans, "draft");
  const completedCount = getSummaryCount(plans, "completed");

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Workflow className="h-5 w-5 text-slate-700" />
              Workflow kế hoạch
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Các node được sắp theo trạng thái và được “bơm” nhiều thông tin nhất có thể:
              thời gian, giai đoạn, nhân lực, vật tư và mục đích.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{draftCount} nháp</Badge>
            <Badge variant="outline">{activeCount} đang thực hiện</Badge>
            <Badge variant="outline">{completedCount} hoàn thành</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2 border-b bg-slate-50/80 px-6 py-3">
          {statusOrder.map((lane) => (
            <Badge key={lane.key} variant="outline" className="gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lane.color }}
              />
              {lane.label}
              <span className="text-slate-500">
                ({groupedPlans[lane.key].length})
              </span>
            </Badge>
          ))}
        </div>

        <div className="relative h-[920px] overflow-hidden bg-[#f8fafc]">
          {plans.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="max-w-md rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">
                  Chưa có kế hoạch nào
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Khi có dữ liệu, workflow sẽ tự dựng theo trạng thái và hiển thị chi tiết kế hoạch.
                </p>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              minZoom={0.28}
              maxZoom={1.2}
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
                  if (kind === "cycle") return "#0f172a";
                  const status = node.data?.status as WorkflowNodeStatus | undefined;
                  if (status === "completed") return "#3b82f6";
                  if (status === "in_progress") return "#10b981";
                  if (status === "ended") return "#f43f5e";
                  return "#94a3b8";
                }}
                maskColor="rgba(248,250,252,0.75)"
                className="!rounded-xl !border !border-slate-200 !bg-white/95 !shadow-lg"
              />
            </ReactFlow>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
