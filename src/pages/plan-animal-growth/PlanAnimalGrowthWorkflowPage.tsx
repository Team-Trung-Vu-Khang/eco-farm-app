import PageWrapper from "@/components/PageWrapper";
import useRegionStore from "@/stores/useRegionStore";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  ClipboardList,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import useAnimalGrowthPlanStore, { type Plan } from "../../stores/useAnimalGrowthPlanStore";
import { useAnimalGrowthWorkflowDraftStore } from "./hooks/useAnimalGrowthWorkflowDraftStore";
import type { Region } from "../region-chart/constants";
import type {
  WorkflowCardNodeData,
  WorkflowNodeStatus,
} from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "./../growth-cycle/components/workflow/WorkflowCardNode";
import { summarizePlanSelections } from "./utils/location";
import { getPlanStatusBadge } from "./utils/status";

type WorkflowViewMode = "workflow" | "milestone";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

type WorkflowSlot = {
  label: string;
  plan: Plan;
  position: { x: number; y: number };
  isPrimary?: boolean;
};

interface PlanAnimalGrowthWorkflowPageProps {
  basePath?: string;
}

function getStatusNode(status: Plan["status"]): WorkflowNodeStatus {
  if (status === "active") return "in_progress";
  if (status === "completed") return "ended";
  if (status === "cancelled") return "ended";
  return "not_started";
}

function getStatusLabel(status: Plan["status"]) {
  if (status === "active") return "Đang triển khai";
  if (status === "completed") return "Đã kết thúc";
  if (status === "cancelled") return "Đã kết thúc";
  return "Thiếu thông tin";
}

function getDurationLabel(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return "Chưa xác định";

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "Chưa xác định";

  const totalDays = Math.max(0, Math.round((end - start) / 86400000));
  if (totalDays < 30) return `${totalDays} ngày`;

  const months = totalDays / 30;
  const roundedMonths = Math.round(months * 10) / 10;
  return `${
    Number.isInteger(roundedMonths)
      ? roundedMonths
      : roundedMonths.toLocaleString("vi-VN", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
  } tháng`;
}

/** Fixed per module: this page only ever renders this plan type. */
const WORKFLOW_TITLE = "Sơ đồ quy trình chăn nuôi";

const WORKFLOW_DESCRIPTION =
  "Quy trình triển khai các kế hoạch được liên kết với nhau trên sơ đồ.";

function countWorkers(tasks: Plan["taskAllocations"]) {
  const total = tasks.reduce((sum, task) => {
    const match = String(task.labor).match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);

  return total > 0 ? `${total} người` : "Chưa phân bổ";
}

function countMaterialsByCategory(materials: Plan["materialAllocations"]) {
  return materials.reduce(
    (acc, item) => {
      const category = `${item.materialCategory || ""} ${item.materialType || ""} ${item.materialName || ""}`.toLowerCase();
      if (
        category.includes("thuốc") ||
        category.includes("vaccine") ||
        category.includes("thú y")
      ) {
        acc.pesticide += 1;
        return acc;
      }
      if (
        category.includes("thức ăn") ||
        category.includes("cám") ||
        category.includes("premix") ||
        category.includes("khoáng")
      ) {
        acc.fertilizer += 1;
        return acc;
      }
      acc.other += 1;
      return acc;
    },
    { pesticide: 0, fertilizer: 0, other: 0 },
  );
}

function getRegionLabels(plan: Plan, regions: Region[]) {
  const summary = summarizePlanSelections(plan, regions);

  if (!summary.length) {
    return ["Chưa xác định"];
  }

  return summary.map((group) => {
    const areaNames = group.items
      .filter((item) => item.type === "area")
      .map((item) => item.name);
    const plotNames = group.items
      .filter((item) => item.type === "plot")
      .map((item) =>
        item.parentName ? `${item.parentName} (${item.name})` : item.name,
      );

    if (plotNames.length) {
      return `${group.regionName} (${plotNames.join(", ")})`;
    }

    if (areaNames.length) {
      return `${group.regionName} (${areaNames.join(", ")})`;
    }

    return group.regionName;
  });
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
    name: "Kế hoạch nuôi tăng trọng heo thịt Duroc",
    description:
      "Tối ưu khẩu phần cám, theo dõi tăng trọng và kiểm soát sức khỏe đàn trước xuất bán.",
    seasonName: "Lứa heo thịt Đông Nam Bộ",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "active",
    selectedStages: ["Nuôi tăng trọng", "Phòng bệnh"],
    taskAllocations: [
      {
        id: 20011,
        stageId: "Nuôi tăng trọng",
        name: "Điều chỉnh khẩu phần cám",
        description: "Tăng khẩu phần theo trọng lượng đàn và kiểm tra máng ăn",
        labor: "3 người",
        duration: "7 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20012,
        stageId: "Nuôi tăng trọng",
        materialCategory: "Thức ăn",
        materialType: "Thức ăn hỗn hợp",
        materialName: "Cám heo thịt giai đoạn tăng trọng",
        quantity: "2",
        unit: "bao",
      },
    ],
  });

  const plan3 = clonePlan(base, {
    id: 2002,
    code: "KH-DEMO-003",
    name: "Kế hoạch phòng bệnh hô hấp sau mưa",
    description:
      "Theo dõi biểu hiện hô hấp, sát trùng chuồng và bổ sung điện giải sau biến động thời tiết.",
    seasonName: "Lứa heo thịt Đông Nam Bộ",
    startDate: "2024-07-01",
    endDate: "2024-08-15",
    status: "draft",
    selectedStages: ["Theo dõi", "Phòng ngừa"],
    taskAllocations: [
      {
        id: 20021,
        stageId: "Phòng ngừa",
        name: "Sát trùng chuồng nuôi",
        description: "Phun sát trùng định kỳ theo lịch thú y",
        labor: "2 người",
        duration: "3 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20022,
        stageId: "Phòng ngừa",
        materialCategory: "Thuốc thú y",
        materialType: "Thuốc phòng bệnh",
        materialName: "Thuốc sát trùng chuồng trại",
        quantity: "1",
        unit: "lít",
      },
    ],
  });

  const plan11 = clonePlan(base, {
    id: 2003,
    code: "KH-DEMO-011",
    name: "Kế hoạch 1.1 - Ổn định đàn sau nhập",
    description:
      "Nhánh phụ cho giai đoạn thích nghi, tập trung giảm stress và ổn định sức khỏe đàn.",
    seasonName: "Lứa heo thịt Đông Nam Bộ",
    startDate: "2024-03-15",
    endDate: "2024-05-10",
    status: "active",
    selectedStages: ["Ổn định đàn", "Bổ sung điện giải"],
    taskAllocations: [
      {
        id: 20031,
        stageId: "Ổn định đàn",
        name: "Theo dõi sức khỏe sau nhập",
        description: "Kiểm tra ăn uống, thân nhiệt và biểu hiện bất thường",
        labor: "4 người",
        duration: "5 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20032,
        stageId: "Bổ sung điện giải",
        materialCategory: "Thuốc thú y",
        materialType: "Điện giải",
        materialName: "Điện giải - vitamin tổng hợp",
        quantity: "2",
        unit: "gói",
      },
    ],
  });

  const plan12 = clonePlan(base, {
    id: 2004,
    code: "KH-DEMO-012",
    name: "Kế hoạch 1.2 - Chăm sóc đàn trước xuất bán",
    description:
      "Nhánh tiếp nối sau 1.1, tập trung vỗ béo, kiểm tra trọng lượng và chuẩn bị xuất bán.",
    seasonName: "Lứa heo thịt Đông Nam Bộ",
    startDate: "2024-05-15",
    endDate: "2024-07-20",
    status: "completed",
    selectedStages: ["Vỗ béo", "Kiểm tra trọng lượng"],
    taskAllocations: [
      {
        id: 20041,
        stageId: "Kiểm tra trọng lượng",
        name: "Cân kiểm tra cuối kỳ",
        description: "Cân mẫu đàn để xác nhận điều kiện xuất bán",
        labor: "2 người",
        duration: "4 ngày",
      },
    ],
    materialAllocations: [
      {
        id: 20042,
        stageId: "Vỗ béo",
        materialCategory: "Thức ăn",
        materialType: "Thức ăn hỗn hợp",
        materialName: "Cám hoàn thiện trước xuất bán",
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
  onAssign: () => void,
  onDelete: () => void,
  onCreate: () => void,
  regionLabels: string[],
  options?: { interactive?: boolean; showFooterAction?: boolean },
): Node<WorkflowCardNodeData> {
  const interactive = options?.interactive ?? true;
  const showFooterAction = options?.showFooterAction ?? true;
  const materialGroups = countMaterialsByCategory(plan.materialAllocations);
  const canManage =
    interactive && plan.status !== "completed" && plan.status !== "cancelled";
  return {
    id: `plan-${plan.id}`,
    type: "workflowCard",
    position: { x: 0, y: 0 },
    data: {
      kind: "plan",
      eyebrow: label,
      title: `${plan.name} (${getDurationLabel(plan.startDate, plan.endDate)})`,
      subtitle: `${plan.seasonName} · ${plan.crop}${plan.variety ? ` - ${plan.variety}` : ""}`,
      status: getStatusNode(plan.status),
      statusLabel: getStatusLabel(plan.status),
      variant: "poster",
      posterTheme: "light",
      wide: true,
      targetTopHandleId: `plan-${plan.id}-target-top`,
      sourceBottomHandleId: `plan-${plan.id}-source-bottom`,
      tags: (plan.selectedStages || []).slice(0, 3),
      summaries: [
        { label: "Nhân lực", value: countWorkers(plan.taskAllocations) },
        { label: "Thuốc thú y", value: `${materialGroups.pesticide}` },
        { label: "Thức ăn", value: `${materialGroups.fertilizer}` },
        { label: "Vật tư khác", value: `${materialGroups.other}` },
      ],
      description: plan.description || "Chưa có mô tả cho kế hoạch này.",
      regionLabels,
      actions: canManage
        ? [
            {
              label: "Điều chỉnh thông tin",
              icon: PencilLine,
              onClick: onEdit,
            },
            {
              label: "Phân bổ công việc",
              icon: ClipboardList,
              onClick: onAssign,
            },
            {
              label: "Xóa kế hoạch",
              icon: Trash2,
              tone: "destructive",
              onClick: onDelete,
            },
          ]
        : undefined,
      footerAction: canManage && showFooterAction
        ? {
            label: "Khởi tạo kế hoạch mới",
            icon: Plus,
            onClick: onCreate,
          }
        : undefined,
    },
  };
}

export default function PlanAnimalGrowthWorkflowPage({
  basePath = "/plan-animal-growth",
}: PlanAnimalGrowthWorkflowPageProps) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions } = useRegionStore();
  const updatePlan = useAnimalGrowthPlanStore((state) => state.updatePlan);
  const resetWorkflowDraft = useAnimalGrowthWorkflowDraftStore(
    (state) => state.resetDraft,
  );
  const goToCreateWorkflow = useCallback(() => {
    // Start a clean canvas — otherwise a workflow opened earlier via
    // "Mở workflow" would still be sitting in the draft store.
    resetWorkflowDraft();
    setLocation(`${basePath}/create/workflow`);
  }, [basePath, resetWorkflowDraft, setLocation]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<WorkflowViewMode>("workflow");
  const [editDraft, setEditDraft] = useState<{
    name: string;
    description: string;
    regionIds: string[];
  }>({
    name: "",
    description: "",
    regionIds: [],
  });
  const plan = useAnimalGrowthPlanStore((state) => state.getPlanById(Number(params.id)));
  const deletePlan = useAnimalGrowthPlanStore((state) => state.deletePlan);
  const primaryRegionLabels = useMemo(
    () => (plan ? getRegionLabels(plan, regions || []) : []),
    [plan, regions],
  );

  const openEditDialog = useCallback(() => {
    if (!plan) return;

    setEditDraft({
      name: plan.name || "",
      description: plan.description || "",
      regionIds: [...(plan.selectedRegionIds || [])],
    });
    setEditOpen(true);
  }, [plan]);

  const handleConfirmDelete = () => {
    if (!plan) return;
    deletePlan(plan.id);
    toast({
      title: "Thành công",
      description: "Đã xóa kế hoạch",
    });
    setDeleteOpen(false);
    setLocation(basePath);
  };

  const handleConfirmEdit = () => {
    if (!plan) return;

    const selectedRegions = (regions || []).filter((region) =>
      editDraft.regionIds.includes(String(region.id)),
    );
    const regionLabel = selectedRegions.map((region) => region.name).join(", ");

    updatePlan(plan.id, {
      name: editDraft.name.trim() || plan.name,
      description: editDraft.description.trim(),
      selectedRegionIds: editDraft.regionIds,
      selectedZoneIds: [],
      selectedPlotIds: [],
      cultivationRegion: regionLabel || plan.cultivationRegion,
      zone: undefined,
      plot: undefined,
    });

    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin sơ bộ của kế hoạch",
    });
    setEditOpen(false);
  };

  const flowDefinition = useMemo(() => {
    if (!plan) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const slots = createDemoWorkflowPlans(plan);
    const rootSlot = slots[0];
    const childSlots = slots.slice(1);

    const planNodePositionMap: Record<string, { x: number; y: number }> =
      viewMode === "milestone"
        ? {
            "Kế hoạch 1": { x: 620, y: 0 },
            "Kế hoạch 2": { x: 1820, y: 0 },
            "Kế hoạch 3": { x: 3020, y: 0 },
            "Kế hoạch 1.1": { x: 1820, y: 420 },
            "Kế hoạch 1.2": { x: 3020, y: 420 },
          }
        : {
            "Kế hoạch 1": { x: 620, y: 0 },
            "Kế hoạch 2": { x: 1820, y: 0 },
            "Kế hoạch 3": { x: 3020, y: 0 },
            "Kế hoạch 1.1": { x: 1220, y: 760 },
            "Kế hoạch 1.2": { x: 2420, y: 760 },
          };

    const rootNode = {
      ...buildPlanNode(
        rootSlot.plan,
        rootSlot.label,
        () => openEditDialog(),
        () => setLocation(`/task?planId=${rootSlot.plan.id}`),
        () => {
          if (rootSlot.isPrimary) {
            setDeleteOpen(true);
          }
        },
        goToCreateWorkflow,
        getRegionLabels(rootSlot.plan, regions || []),
        { interactive: true, showFooterAction: false },
      ),
      position: planNodePositionMap[rootSlot.label] ?? rootSlot.position,
    };

    const nodes = [
      rootNode,
      ...childSlots.map((slot) => {
        const position = planNodePositionMap[slot.label] ?? slot.position;
        return {
          ...buildPlanNode(
            slot.plan,
            slot.label,
            () => openEditDialog(),
            () => setLocation(`/task?planId=${slot.plan.id}`),
            () => {
              if (slot.isPrimary) {
                setDeleteOpen(true);
              }
            },
            goToCreateWorkflow,
            slot.isPrimary
              ? primaryRegionLabels
              : getRegionLabels(slot.plan, regions || []),
            { interactive: slot.isPrimary },
          ),
          position,
        };
      }),
    ];

    const slotByLabel = new Map(childSlots.map((slot) => [slot.label, slot]));
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

    edges.push({
      id: `edge-root-${plan.id}-plan-2`,
      source: rootNode.id,
      target: `plan-${slots[1].plan.id}`,
      sourceHandle: `${rootNode.id}-source-bottom`,
      targetHandle: `plan-${slots[1].plan.id}-target-top`,
      type: "step",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
      },
      style: {
        strokeWidth: 2,
        stroke: "#1f2937",
      },
    });

    edges.push({
      id: `edge-root-${plan.id}-plan-1.1`,
      source: rootNode.id,
      target: `plan-${slots[3].plan.id}`,
      sourceHandle: `${rootNode.id}-source-bottom`,
      targetHandle: `plan-${slots[3].plan.id}-target-top`,
      type: "step",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
      },
      style: {
        strokeWidth: 1.75,
        stroke: "#2563eb",
        strokeDasharray: "6 6",
      },
    });

    connect("Kế hoạch 2", "Kế hoạch 3", "#1f2937");
    connect("Kế hoạch 1.1", "Kế hoạch 1.2", "#2563eb", true);

    return { nodes, edges };
  }, [
    plan,
    primaryRegionLabels,
    regions,
    setLocation,
    viewMode,
    openEditDialog,
    goToCreateWorkflow,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowDefinition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowDefinition.edges);

  useEffect(() => {
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  }, [flowDefinition, setEdges, setNodes]);

  if (!plan) {
    return (
      <PageWrapper title={WORKFLOW_TITLE} description="Không tìm thấy kế hoạch">
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={WORKFLOW_TITLE}
      description={WORKFLOW_DESCRIPTION}
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
          <div className="overflow-x-auto bg-[#f8fafc]">
            <div
              className="h-[920px]"
              style={{
                width: viewMode === "milestone" ? "3600px" : "100%",
                minWidth: viewMode === "milestone" ? "3600px" : "100%",
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView={viewMode !== "milestone"}
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
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-2xl border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin sơ bộ</DialogTitle>
            <DialogDescription>
              Cập nhật nhanh tên kế hoạch, mô tả và vùng áp dụng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Tên kế hoạch</Label>
              <Input
                id="plan-name"
                value={editDraft.name}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Nhập tên kế hoạch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-desc">Mô tả</Label>
              <Textarea
                id="plan-desc"
                value={editDraft.description}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Mô tả ngắn"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Vùng chăn nuôi / vùng nuôi trồng</Label>
                <span className="text-xs text-muted-foreground">
                  Chọn nhiều vùng ở cấp vùng
                </span>
              </div>
              <ScrollArea className="max-h-56 rounded-2xl border border-slate-200 p-3">
                <div className="space-y-2">
                  {(regions || []).map((region) => {
                    const checked = editDraft.regionIds.includes(
                      String(region.id),
                    );

                    return (
                      <label
                        key={region.id}
                        className={[
                          "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                          checked
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            setEditDraft((current) => ({
                              ...current,
                              regionIds: value
                                ? [...current.regionIds, String(region.id)]
                                : current.regionIds.filter(
                                    (item) => item !== String(region.id),
                                  ),
                            }));
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">
                            {region.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Cấp vùng
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
