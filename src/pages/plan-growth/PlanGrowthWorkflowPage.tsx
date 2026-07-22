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
  WorkflowCardNodeData,
  WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { getPlanStatusBadge } from "./utils/status";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

type WorkflowSlot = {
  label: string;
  plan: Plan;
  position: { x: number; y: number };
  isPrimary?: boolean;
};

interface PlanGrowthWorkflowPageProps {
  basePath?: string;
}

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

function clonePlan(base: Plan, overrides: Partial<Plan>): Plan {
  return {
    ...base,
    ...overrides,
    selectedRegionIds: overrides.selectedRegionIds ?? base.selectedRegionIds,
    selectedZoneIds: overrides.selectedZoneIds ?? base.selectedZoneIds,
    selectedPlotIds: overrides.selectedPlotIds ?? base.selectedPlotIds,
    materialAllocations:
      overrides.materialAllocations ?? base.materialAllocations,
    taskAllocations: overrides.taskAllocations ?? base.taskAllocations,
    selectedStages: overrides.selectedStages ?? base.selectedStages,
  };
}

function createDemoWorkflowPlans(base: Plan) {
  const plan2 = clonePlan(base, {
    id: 2001,
    code: "KH-DEMO-002",
    name: "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
    description:
      "Cung cấp dinh dưỡng phân kỳ theo tuổi trái, tỉa trái non sinh lý và bón Kali Sulphate để lên cơm vàng.",
    seasonName: "Chính vụ Đông Nam Bộ",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "active",
    selectedStages: ["Nuôi trái", "Siết nước"],
    taskAllocations: [
      {
        id: 20011,
        stageId: "Nuôi trái",
        name: "Bón phân hữu cơ",
        description: "Bón phân theo đợt để nuôi trái đều",
        labor: "3 người",
        duration: "7 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20012,
        stageId: "Nuôi trái",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân hữu cơ hoai mục",
        quantity: "2",
        unit: "bao",
      },
    ],
  });

  const plan3 = clonePlan(base, {
    id: 2002,
    code: "KH-DEMO-003",
    name: "Kế hoạch phòng ngừa sâu bệnh giai đoạn sau mưa",
    description:
      "Theo dõi dịch hại, phun phòng ngừa và duy trì ẩm độ ổn định để tránh bùng phát bệnh.",
    seasonName: "Chính vụ Đông Nam Bộ",
    startDate: "2024-07-01",
    endDate: "2024-08-15",
    status: "draft",
    selectedStages: ["Theo dõi", "Phòng ngừa"],
    taskAllocations: [
      {
        id: 20021,
        stageId: "Phòng ngừa",
        name: "Phun phòng bệnh",
        description: "Phun định kỳ theo lịch",
        labor: "2 người",
        duration: "3 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20022,
        stageId: "Phòng ngừa",
        materialCategory: "Thuốc BTVT",
        materialType: "Thuốc phòng bệnh",
        materialName: "Thuốc phòng nấm sinh học",
        quantity: "1",
        unit: "lít",
      },
    ],
  });

  const plan11 = clonePlan(base, {
    id: 2003,
    code: "KH-DEMO-011",
    name: "Kế hoạch 1.1 - Tăng trưởng cơi lá",
    description:
      "Nhánh phụ cho giai đoạn tăng trưởng cơi lá, có thể tách riêng để xử lý dinh dưỡng.",
    seasonName: "Chính vụ Đông Nam Bộ",
    startDate: "2024-03-15",
    endDate: "2024-05-10",
    status: "active",
    selectedStages: ["Cơi lá", "Dưỡng cây"],
    taskAllocations: [
      {
        id: 20031,
        stageId: "Cơi lá",
        name: "Bón thúc cơi lá",
        description: "Bón thúc định kỳ cho cơi lá mới",
        labor: "4 người",
        duration: "5 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20032,
        stageId: "Cơi lá",
        materialCategory: "Phân bón lá",
        materialType: "Dinh dưỡng",
        materialName: "Amino acid",
        quantity: "2",
        unit: "lít",
      },
    ],
  });

  const plan12 = clonePlan(base, {
    id: 2004,
    code: "KH-DEMO-012",
    name: "Kế hoạch 1.2 - Ổn định sau tỉa trái",
    description:
      "Nhánh tiếp nối sau 1.1, tập trung ổn định cây và chuyển sang nuôi trái.",
    seasonName: "Chính vụ Đông Nam Bộ",
    startDate: "2024-05-15",
    endDate: "2024-07-20",
    status: "completed",
    selectedStages: ["Ổn định", "Nuôi trái"],
    taskAllocations: [
      {
        id: 20041,
        stageId: "Ổn định",
        name: "Tưới giữ ẩm",
        description: "Giữ ẩm ổn định cho cây",
        labor: "2 người",
        duration: "4 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20042,
        stageId: "Ổn định",
        materialCategory: "Phân bón",
        materialType: "Dinh dưỡng",
        materialName: "Kali Sulphate",
        quantity: "1",
        unit: "bao",
      },
    ],
  });

  return [
    {
      label: "Kế hoạch 1",
      plan: base,
      position: { x: 0, y: 0 },
      isPrimary: true,
    },
    {
      label: "Kế hoạch 2",
      plan: plan2,
      position: { x: 1160, y: 0 },
    },
    {
      label: "Kế hoạch 3",
      plan: plan3,
      position: { x: 2320, y: 0 },
    },
    {
      label: "Kế hoạch 1.1",
      plan: plan11,
      position: { x: 580, y: 760 },
    },
    {
      label: "Kế hoạch 1.2",
      plan: plan12,
      position: { x: 1740, y: 760 },
    },
  ] satisfies WorkflowSlot[];
}

function buildPlanNode(
  plan: Plan,
  label: string,
  onEdit: () => void,
  onView: () => void,
  onCreate: () => void,
  options?: { interactive?: boolean },
): Node<WorkflowCardNodeData> {
  const interactive = options?.interactive ?? true;
  return {
    id: `plan-${plan.id}`,
    type: "workflowCard",
    position: { x: 0, y: 0 },
    data: {
      kind: "plan",
      eyebrow: label,
      title: plan.name,
      subtitle: `${plan.seasonName} · ${plan.crop}${plan.variety ? ` - ${plan.variety}` : ""}`,
      status: getStatusNode(plan.status),
      variant: "poster",
      wide: true,
      targetTopHandleId: `plan-${plan.id}-target-top`,
      sourceBottomHandleId: `plan-${plan.id}-source-bottom`,
      summaries: [
        { label: "Bắt đầu", value: formatDate(plan.startDate) },
        { label: "Kết thúc", value: formatDate(plan.endDate) },
        { label: "Giai đoạn", value: `${plan.selectedStages.length}` },
        { label: "Nhân lực", value: countWorkers(plan.taskAllocations) },
        { label: "Vật tư", value: countMaterials(plan.materialAllocations) },
        { label: "Mục đích", value: getPurposeLabel(plan) },
      ],
      description: plan.description || "Chưa có mô tả cho kế hoạch này.",
      actions: interactive
        ? [
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
          ]
        : undefined,
      footerAction: interactive
        ? {
            label: "Khởi tạo kế hoạch mới",
            icon: Plus,
            onClick: onCreate,
          }
        : undefined,
    },
  };
}

export default function PlanGrowthWorkflowPage({
  basePath = "/plan-growth",
}: PlanWorkflowPageProps) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const plan = usePlanStore((state) => state.getPlanById(Number(params.id)));

  const flowDefinition = useMemo(() => {
    if (!plan) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const slots = createDemoWorkflowPlans(plan);

    const nodes = slots
      .map((slot) =>
        buildPlanNode(
          slot.plan,
          slot.label,
          () => setLocation(`${basePath}/${slot.plan.id}/edit`),
          () => setLocation(`${basePath}/${slot.plan.id}`),
          () => setLocation(`${basePath}/create`),
          { interactive: slot.isPrimary },
        ),
      )
      .map((node, index) => ({
        ...node,
        position: slots[index]?.position ?? node.position,
      }));

    const slotByLabel = new Map(slots.map((slot) => [slot.label, slot]));
    const edges: Edge[] = [];

    const connect = (
      sourceLabel: string,
      targetLabel: string,
      stroke: string,
      dashed = false,
    ) => {
      const source = slotByLabel.get(sourceLabel);
      const target = slotByLabel.get(targetLabel);
      if (!source || !target) return;

      edges.push({
        id: `edge-${source.plan.id}-${target.plan.id}`,
        source: `plan-${source.plan.id}`,
        target: `plan-${target.plan.id}`,
        sourceHandle: `plan-${source.plan.id}-source-bottom`,
        targetHandle: `plan-${target.plan.id}-target-top`,
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
        },
        style: {
          strokeWidth: dashed ? 1.75 : 2,
          stroke,
          strokeDasharray: dashed ? "6 6" : undefined,
        },
      });
    };

    connect("Kế hoạch 1", "Kế hoạch 2", "#1f2937");
    connect("Kế hoạch 2", "Kế hoạch 3", "#1f2937");
    connect("Kế hoạch 1", "Kế hoạch 1.1", "#2563eb", true);
    connect("Kế hoạch 1.1", "Kế hoạch 1.2", "#2563eb", true);

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
              <Button variant="outline" onClick={() => setLocation(basePath)}>
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
      description="Chỉ hiển thị các node kế hoạch theo kiểu chuỗi và nhánh"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(basePath)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(`${basePath}/${plan.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(`${basePath}/${plan.id}/edit`)}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            className="h-9 px-3"
            onClick={() => setLocation(`${basePath}/create`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Khởi tạo kế hoạch mới
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
              fitViewOptions={{ padding: 0.22 }}
              minZoom={0.22}
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
                  return "#94a3b8";
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
