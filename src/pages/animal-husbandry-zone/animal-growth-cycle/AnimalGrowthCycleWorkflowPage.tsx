import {
  AdminLayout,
  Badge,
  Button,
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
  Check,
  Eye,
  PencilLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  type NodeDragHandler,
} from "reactflow";
import { Link, useLocation, useParams } from "wouter";
import {
  useSystemGrowthCycleTemplateById,
  useUserGrowthCycleTemplateById,
} from "../../../features/foundation";
import usePlanStore from "../../../stores/usePlanStore";
import type { Plan } from "../../../stores/usePlanStore";
import useRegionStore from "../../../stores/useRegionStore";
import { summarizePlanSelections } from "../../plan/utils/location";
import type {
  WorkflowActionItem,
  WorkflowCardNodeData,
  WorkflowNodeKind,
  WorkflowNodeStatus,
  WorkflowSummaryItem,
} from "./components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "./components/workflow/WorkflowCardNode";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

type SavedPositions = Record<string, { x: number; y: number }>;

type NodeDialogMode = "chooser" | "stage" | "plan";

type NodeDialogContext = {
  sourceNodeId: string;
  sourceKind: WorkflowNodeKind;
  replaceNodeId?: string;
};

type StageDraft = {
  name: string;
  duration: string;
  description: string;
};

const WORKFLOW_LAYOUT_VERSION = "v2";

function getWorkflowStorageKey(cycleId: string | number) {
  return `animal-growth-cycle-workflow-layout:${WORKFLOW_LAYOUT_VERSION}:${cycleId}`;
}

function loadSavedPositions(cycleId?: string | number | null): SavedPositions {
  if (!cycleId || typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(getWorkflowStorageKey(cycleId));
    if (!raw) return {};

    const parsed = JSON.parse(raw) as SavedPositions;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePositions(cycleId: string | number, nodes: Node[]) {
  if (typeof window === "undefined") return;

  const positions: SavedPositions = nodes.reduce<SavedPositions>(
    (acc, node) => {
      acc[node.id] = { x: node.position.x, y: node.position.y };
      return acc;
    },
    {},
  );

  window.localStorage.setItem(
    getWorkflowStorageKey(cycleId),
    JSON.stringify(positions),
  );
}

function applySavedPositions(nodes: Node[], positions: SavedPositions): Node[] {
  return nodes.map((node) => {
    const saved = positions[node.id];

    if (!saved) return node;

    return {
      ...node,
      position: saved,
    };
  });
}

function getNodeTitle(node: Node) {
  return typeof node.data?.title === "string" && node.data.title.trim()
    ? node.data.title
    : node.id;
}

function toTimestamp(value?: string | number | Date | null) {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function addDays(
  base: string | number | Date | null | undefined,
  days: number,
) {
  const timestamp = toTimestamp(base);
  if (timestamp == null) return null;

  return timestamp + days * 86400000;
}

function getDurationLabel(
  startDate: string | number | Date | null | undefined,
  endDate: string | number | Date | null | undefined,
) {
  const start = toTimestamp(startDate);
  const end = toTimestamp(endDate);

  if (start == null || end == null) return "Chưa xác định";

  const totalDays = Math.max(0, Math.round((end - start) / 86400000));
  if (totalDays < 30) return `${totalDays} ngày`;

  const totalMonths = totalDays / 30;
  const roundedMonths = Math.round(totalMonths * 10) / 10;
  const monthLabel = Number.isInteger(roundedMonths)
    ? `${roundedMonths}`
    : roundedMonths.toLocaleString("vi-VN", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

  return `${monthLabel} tháng`;
}

function getPlanWorkerCount(plan: Plan) {
  return plan.taskAllocations.reduce((sum, task) => {
    const match = String(task.labor).match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);
}

function getPlanMaterialBreakdown(plan: Plan) {
  const categories = plan.materialAllocations.reduce<Record<string, number>>(
    (acc, allocation) => {
      const label = allocation.materialCategory?.trim() || "Vật tư khác";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {},
  );

  return {
    "Thuốc BVTV": categories["Thuốc BVTV"] || 0,
    "Phân bón": categories["Phân bón"] || 0,
    "Vật tư khác": Object.entries(categories).reduce((sum, [label, count]) => {
      if (label === "Thuốc BVTV" || label === "Phân bón") return sum;
      return sum + count;
    }, 0),
  };
}

function getPosterMetricItems(plan: Plan): WorkflowSummaryItem[] {
  const workerCount = getPlanWorkerCount(plan);
  const materialBreakdown = getPlanMaterialBreakdown(plan);

  return [
    { label: "Nhân lực", value: String(workerCount || 0) },
    { label: "Thuốc BVTV", value: String(materialBreakdown["Thuốc BVTV"]) },
    { label: "Phân bón", value: String(materialBreakdown["Phân bón"]) },
    { label: "Vật tư khác", value: String(materialBreakdown["Vật tư khác"]) },
  ];
}

function getPlanStageTags(plan: Plan) {
  if (!plan.selectedStages.length) return ["Chưa chọn giai đoạn"];
  if (plan.selectedStages.length <= 2) return plan.selectedStages;
  return [plan.selectedStages[0], plan.selectedStages[1]];
}

function getPlanRegionLabels(plan: Plan, regions: any[]) {
  const summaries = summarizePlanSelections(plan, regions);

  if (!summaries.length) {
    const fallbackLabel =
      plan.zone || plan.cultivationRegion || plan.plot || "Vùng chăn nuôi";
    return [fallbackLabel];
  }

  return summaries.map((group) => {
    const itemLabel = group.items.map((item) => item.name).join(", ");
    return itemLabel
      ? `${group.regionName} (${itemLabel})`
      : group.regionName;
  });
}

function getGridPosition(
  index: number,
  total: number,
  options: {
    centerX: number;
    startY: number;
    columnGap: number;
    rowGap: number;
    columns: number;
  },
) {
  const row = Math.floor(index / options.columns);
  const column = index % options.columns;
  const itemsInRow = Math.min(options.columns, total - row * options.columns);
  const rowWidth = (itemsInRow - 1) * options.columnGap;

  return {
    x: options.centerX - rowWidth / 2 + column * options.columnGap,
    y: options.startY + row * options.rowGap,
  };
}

function getDirectChildNodes(
  nodes: Node[],
  edges: Edge[],
  sourceNodeId: string,
) {
  const childNodeIds = new Set(
    edges
      .filter((edge) => edge.source === sourceNodeId)
      .map((edge) => edge.target),
  );

  return nodes.filter((node) => childNodeIds.has(node.id));
}

function createNodeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function stripHtml(value?: string) {
  return (
    value
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}

function getCycleNodeStatus(): WorkflowNodeStatus {
  return "in_progress";
}

function getStageNodeStatus(index: number, total: number): WorkflowNodeStatus {
  if (index === 0) return "in_progress";
  if (index === total - 1 && total > 2) return "completed";
  if (index === 1) return "not_started";
  return "paused";
}

function getPlanNodeStatus(index: number): WorkflowNodeStatus {
  if (index === 0) return "in_progress";
  if (index === 1) return "not_started";
  if (index === 2) return "ended";
  if (index === 3) return "completed";
  return "paused";
}

function getPlanStatusNodeStatus(status: Plan["status"]): WorkflowNodeStatus {
  if (status === "active") return "in_progress";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "ended";
  return "not_started";
}

function getPlanStatusLabel(status: Plan["status"]) {
  if (status === "active") return "Đang triển khai";
  if (status === "completed") return "Hoàn tất";
  if (status === "cancelled") return "Đã huỷ";
  return "Nháp";
}

function formatCycleStageLabel(
  stageName?: string,
  cycleName?: string,
  fallback = "Chưa xác định",
) {
  const parts = [stageName, cycleName].filter(Boolean);
  return parts.length ? parts.join(" - ") : fallback;
}

function getPlanStageLabel(plan: Plan) {
  const stageLabel = plan.selectedStages[0] || "Chưa xác định";
  const cycleLabel = plan.seasonName || "Chu kì sinh trưởng";
  return formatCycleStageLabel(stageLabel, cycleLabel, "Chưa xác định");
}

function getPlanWorkerSummary(plan: Plan) {
  const totalWorkers = plan.taskAllocations.reduce((sum, task) => {
    const match = String(task.labor).match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);

  if (totalWorkers > 0) return `${totalWorkers} nhân lực`;
  if (plan.taskAllocations.length > 0) return `${plan.taskAllocations.length} nhóm nhân lực`;
  return "Chưa phân bổ";
}

function getPlanMaterialSummary(plan: Plan) {
  const categoryCounts = plan.materialAllocations.reduce<Record<string, number>>(
    (acc, allocation) => {
      const normalized = allocation.materialCategory?.trim() || "Vật tư khác";
      acc[normalized] = (acc[normalized] || 0) + 1;
      return acc;
    },
    {},
  );

  const preferredOrder = ["Máy móc", "Thuốc BTVT", "Phân bón"];
  const orderedEntries = [
    ...preferredOrder.filter((key) => categoryCounts[key]).map((key) => [key, categoryCounts[key]] as const),
    ...Object.entries(categoryCounts).filter(([key]) => !preferredOrder.includes(key)),
  ];

  if (!orderedEntries.length) return "Chưa phân bổ";

  return orderedEntries
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join(", ");
}

function buildPlanNodeData(
  plan: Plan | undefined,
  fallback: {
    title: string;
    subtitle: string;
    duration: string;
    description: string;
    status: WorkflowNodeStatus;
    workerSummary: string;
    materialSummary: string;
  },
): WorkflowCardNodeData {
  if (!plan) {
    const title = fallback.duration
      ? `${fallback.title} (${fallback.duration})`
      : fallback.title;

    return {
      kind: "plan",
      eyebrow: "Kế hoạch",
      title,
      subtitle: fallback.subtitle,
      status: fallback.status,
      wide: true,
      targetTopHandleId: "",
      sourceBottomHandleId: "",
      summaries: [
        { label: "Thời gian dự kiến", value: fallback.duration },
        { label: "Nhân lực", value: fallback.workerSummary },
        { label: "Vật tư", value: fallback.materialSummary },
        { label: "Giai đoạn", value: fallback.subtitle },
      ],
      description: fallback.description,
      actions: [],
    };
  }

  const duration = getDurationLabel(plan.startDate, plan.endDate);

  return {
    kind: "plan",
    eyebrow: "Kế hoạch",
    title: `${plan.name}${duration ? ` (${duration})` : ""}`,
    subtitle: getPlanStageLabel(plan),
    status: getPlanStatusNodeStatus(plan.status),
    wide: true,
    summaries: [
      {
        label: "Thời gian dự kiến",
        value: duration,
      },
      {
        label: "Giai đoạn",
        value: `${plan.selectedStages.length} giai đoạn`,
      },
      { label: "Nhân lực", value: getPlanWorkerSummary(plan) },
      { label: "Vật tư", value: getPlanMaterialSummary(plan) },
    ],
    description: plan.description || "Chưa có mô tả cho kế hoạch này.",
  };
}

function getNextPosition(nodes: Node[], kind: WorkflowNodeKind) {
  const sameKindNodes = nodes.filter((node) => node.data?.kind === kind);

  if (kind === "stage") {
    return getGridPosition(sameKindNodes.length, sameKindNodes.length + 1, {
      centerX: 0,
      startY: -320,
      columnGap: 270,
      rowGap: 220,
      columns: 3,
    });
  }

  return getGridPosition(sameKindNodes.length, sameKindNodes.length + 1, {
    centerX: 0,
    startY: 320,
    columnGap: 300,
    rowGap: 240,
    columns: 3,
  });
}

function getSpawnPositionFromSource(
  nodes: Node[],
  edges: Edge[],
  sourceNodeId: string,
  kind: WorkflowNodeKind,
) {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);
  if (sourceNode) {
    if (kind === "stage") {
      return {
        x: sourceNode.position.x,
        y: sourceNode.position.y - 240,
      };
    }

    const directChildren = getDirectChildNodes(
      nodes,
      edges,
      sourceNodeId,
    ).filter((node) => node.data?.kind === "plan");

    return getGridPosition(directChildren.length, directChildren.length + 1, {
      centerX: sourceNode.position.x,
      startY: sourceNode.position.y + 250,
      columnGap: 240,
      rowGap: 230,
      columns: 3,
    });
  }

  return getNextPosition(nodes, kind);
}

export default function AnimalGrowthCycleWorkflowPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const id = params?.id;
  const plans = usePlanStore((state) => state.plans);
  const regions = useRegionStore((state) => state.regions);
  const [flowRevision, setFlowRevision] = useState(0);
  const [dragHint, setDragHint] = useState<string | null>(null);
  const [activeDragNodeId, setActiveDragNodeId] = useState<string | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [nodeDialogMode, setNodeDialogMode] =
    useState<NodeDialogMode>("chooser");
  const [nodeDialogContext, setNodeDialogContext] =
    useState<NodeDialogContext | null>(null);
  const [stageDraft, setStageDraft] = useState<StageDraft>({
    name: "",
    duration: "",
    description: "",
  });
  const [planSearch, setPlanSearch] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const isFoundation = String(id).startsWith("foundation-");
  const numericId = Number(String(id).replace(/^(foundation-|user-)/, ""));

  const { data: foundationCycle, isLoading: fLoading } =
    useSystemGrowthCycleTemplateById(numericId, {
      enabled: !!numericId && isFoundation,
    });

  const { data: userCycle, isLoading: uLoading } =
    useUserGrowthCycleTemplateById(numericId, {
      enabled: !!numericId && !isFoundation,
    });

  const cycle = isFoundation ? foundationCycle : userCycle;
  const isLoading = isFoundation ? fLoading : uLoading;

  const stages = cycle?.stages ?? [];
  const fallbackRegionLabel =
    cycle?.productionSubjectVariant?.name ||
    cycle?.productionSubject?.name ||
    "Vùng chăn nuôi";

  const openNodeDialog = (
    mode: NodeDialogMode,
    context: NodeDialogContext,
  ) => {
    setNodeDialogContext(context);
    setNodeDialogMode(mode);
    setNodeDialogOpen(true);
  };

  const buildPlanPosterExtras = (
    plan: Plan | undefined,
    sourceNodeId: string,
  ) => ({
    variant: "poster" as const,
    tags: plan ? getPlanStageTags(plan) : ["Chưa chọn giai đoạn"],
    regionLabels: plan
      ? getPlanRegionLabels(plan, regions)
      : [fallbackRegionLabel],
    summaries: plan
      ? getPosterMetricItems(plan)
      : [
          { label: "Nhân lực", value: "0" },
          { label: "Thuốc BVTV", value: "0" },
          { label: "Phân bón", value: "0" },
          { label: "Vật tư khác", value: "0" },
        ],
    footerAction: {
      label: "Thêm node",
      icon: Plus,
      onClick: () =>
        openNodeDialog("chooser", {
          sourceNodeId,
          sourceKind: "plan",
        }),
    },
  });

  const flowDefinition = useMemo(() => {
    if (!cycle) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const cycleScope = cycle.cropVarietyId ? "variety" : "crop";
    const cyclePlans = plans.filter(
      (plan) => !plan.growthCycleId || plan.growthCycleId === String(cycle.id),
    );
    const workflowPlans = (cyclePlans.length ? cyclePlans : plans).slice(0, 5);
    const [plan1, plan2, plan3, plan11, plan12] = workflowPlans;

    const stagePositions = stages.map((_, index) =>
      getGridPosition(index, stages.length, {
        centerX: 0,
        startY: -320,
        columnGap: 270,
        rowGap: 220,
        columns: 3,
      }),
    );
    const planStartY = 320;

    const openActionToast = (title: string, description: string) => {
      toast({
        title,
        description,
      });
    };

    const buildStageActions = (stageName: string): WorkflowActionItem[] => [
      {
        label: "Thêm mới",
        icon: Plus,
        onClick: () =>
          openActionToast(
            "Thêm giai đoạn mới",
            `Bạn vừa mở thao tác tạo giai đoạn từ "${stageName}".`,
          ),
      },
      {
        label: "Cập nhật",
        icon: PencilLine,
        onClick: () =>
          openActionToast(
            "Cập nhật giai đoạn",
            `Chuẩn bị chỉnh sửa giai đoạn "${stageName}".`,
          ),
      },
      {
        label: "Xoá",
        icon: Trash2,
        tone: "destructive",
        onClick: () =>
          openActionToast(
            "Xoá giai đoạn",
            `Đã bấm xoá "${stageName}" trong workflow.`,
          ),
      },
    ];

    const buildPlanActions = (planName: string): WorkflowActionItem[] => [
      {
        label: "Điều chỉnh thông tin",
        icon: PencilLine,
        onClick: () =>
          openActionToast(
            "Điều chỉnh thông tin",
            `Mở màn hình chỉnh sửa cho "${planName}".`,
          ),
      },
      {
        label: "Xóa kế hoạch",
        icon: Trash2,
        tone: "destructive",
        onClick: () =>
          openActionToast(
            "Xóa kế hoạch",
            `Kế hoạch "${planName}" sẽ được đánh dấu xóa trong workflow.`,
          ),
      },
    ];

    const nodesList: Node[] = [
      {
        id: `cycle-${cycle.id}`,
        type: "workflowCard",
        position: { x: 0, y: 0 },
        data: {
          kind: "cycle",
          eyebrow: "Chu kì",
          title: cycle.name,
          status: getCycleNodeStatus(),
          subtitle:
            cycleScope === "crop"
              ? "Áp dụng theo loại cây"
              : "Áp dụng theo giống cụ thể",
          sourceTopHandleId: `cycle-${cycle.id}-source-top`,
          sourceBottomHandleId: `cycle-${cycle.id}-source-bottom`,
          footerAction: {
            label: "Thêm node",
            icon: Plus,
            onClick: () =>
              openNodeDialog("chooser", {
                sourceNodeId: `cycle-${cycle.id}`,
                sourceKind: "cycle",
              }),
          },
          summaries: [
            {
              label: "Phạm vi",
              value: cycleScope === "crop" ? "Theo loại cây" : "Theo giống",
            },
            {
              label: "Áp dụng",
              value: cycle.cropVarietyName || cycle.cropName || "Chưa xác định",
            },
            { label: "Thời gian", value: `${cycle.expectedDays || 0} ngày` },
          ],
          actions: [
            {
              label: "Xem chi tiết",
              icon: Eye,
              onClick: () =>
                openActionToast(
                  "Mở chi tiết chu kì",
                  "Bạn có thể quay lại màn hình chi tiết để xem đầy đủ thông tin.",
                ),
            },
            {
              label: "Chỉnh sửa",
              icon: PencilLine,
              onClick: () => setLocation(`/animal-growth-cycle/${cycle.id}/edit`),
            },
            {
              label: "Thêm node",
              icon: Plus,
              onClick: () =>
                openNodeDialog("chooser", {
                  sourceNodeId: `cycle-${cycle.id}`,
                  sourceKind: "cycle",
                }),
            },
          ],
        },
      },
      ...stages.map((stage, index) => ({
        id: `stage-${stage.id}`,
        type: "workflowCard",
        position: stagePositions[index] ?? { x: 0, y: -320 },
        data: {
          kind: "stage",
          title: stage.name,
          status: getStageNodeStatus(index, stages.length),
          subtitle: `Giai đoạn ${index + 1}`,
          targetBottomHandleId: `stage-${stage.id}-target-bottom`,
          footerAction: {
            label: "Thêm node",
            icon: Plus,
            onClick: () =>
              openNodeDialog("chooser", {
                sourceNodeId: `stage-${stage.id}`,
                sourceKind: "stage",
              }),
          },
          summaries: [
            {
              label: "Thời gian",
              value: `${stage.durationDays} ngày`,
            },
            {
              label: "Mô tả",
              value: stage.document?.type === "pdf" ? "Đính kèm tài liệu" : "Nội dung mô tả",
            },
          ],
          description:
            stripHtml(stage.description) || "Chưa có mô tả cho giai đoạn này.",
          actions: buildStageActions(stage.name),
        },
      })),
      {
        id: `plan-${cycle.id}-1`,
        type: "workflowCard",
        position: getGridPosition(0, 3, {
          centerX: 0,
          startY: planStartY,
          columnGap: 300,
          rowGap: 240,
          columns: 3,
        }),
        data: {
          ...buildPlanNodeData(plan1, {
            title: "Kế hoạch 1",
            subtitle: formatCycleStageLabel(
              stages[0]?.name,
              cycle.name,
              "Kế hoạch tổng hợp",
            ),
            duration: getDurationLabel(cycle.createdAt, cycle.updatedAt),
            description: `Kế hoạch chuẩn bị cho ${cycle.cropName || "chu kì"} và các giai đoạn đầu tiên trong workflow.`,
            status: getPlanNodeStatus(0),
            workerSummary: "Chưa phân bổ",
            materialSummary: "Chưa phân bổ",
          }),
          ...buildPlanPosterExtras(plan1, `plan-${cycle.id}-1`),
          targetTopHandleId: `plan-${cycle.id}-1-target-top`,
          sourceBottomHandleId: `plan-${cycle.id}-1-source-bottom`,
          actions: buildPlanActions("Kế hoạch 1"),
        },
      },
      {
        id: `plan-${cycle.id}-2`,
        type: "workflowCard",
        position: getGridPosition(1, 3, {
          centerX: 0,
          startY: planStartY,
          columnGap: 300,
          rowGap: 240,
          columns: 3,
        }),
        data: {
          ...buildPlanNodeData(plan2, {
            title: "Kế hoạch 2",
            subtitle: formatCycleStageLabel(
              stages[1]?.name,
              cycle.name,
              "Kế hoạch giữa chu kì",
            ),
            duration: getDurationLabel(
              addDays(cycle.createdAt, 7),
              addDays(cycle.updatedAt, 21),
            ),
            description:
              "Theo dõi sức cây, điều phối tài nguyên và giữ nhịp cho giai đoạn sinh trưởng chính.",
            status: getPlanNodeStatus(1),
            workerSummary: "Chưa phân bổ",
            materialSummary: "Chưa phân bổ",
          }),
          ...buildPlanPosterExtras(plan2, `plan-${cycle.id}-2`),
          targetTopHandleId: `plan-${cycle.id}-2-target-top`,
          sourceBottomHandleId: `plan-${cycle.id}-2-source-bottom`,
          actions: buildPlanActions("Kế hoạch 2"),
        },
      },
      {
        id: `plan-${cycle.id}-3`,
        type: "workflowCard",
        position: getGridPosition(2, 3, {
          centerX: 0,
          startY: planStartY,
          columnGap: 300,
          rowGap: 240,
          columns: 3,
        }),
        data: {
          ...buildPlanNodeData(plan3, {
            title: "Kế hoạch 3",
            subtitle: formatCycleStageLabel(
              stages[stages.length - 1]?.name,
              cycle.name,
              "Kế hoạch cuối vụ",
            ),
            duration: getDurationLabel(
              addDays(cycle.createdAt, 35),
              addDays(cycle.updatedAt, 60),
            ),
            description:
              "Tập trung vào chốt kế hoạch, hoàn tất dữ liệu và chuẩn bị sang chu kì mới.",
            status: getPlanNodeStatus(2),
            workerSummary: "Chưa phân bổ",
            materialSummary: "Chưa phân bổ",
          }),
          ...buildPlanPosterExtras(plan3, `plan-${cycle.id}-3`),
          targetTopHandleId: `plan-${cycle.id}-3-target-top`,
          sourceBottomHandleId: `plan-${cycle.id}-3-source-bottom`,
          actions: buildPlanActions("Kế hoạch 3"),
        },
      },
      {
        id: `plan-${cycle.id}-1-1`,
        type: "workflowCard",
        position: getGridPosition(0, 2, {
          centerX: getGridPosition(0, 3, {
            centerX: 0,
            startY: planStartY,
            columnGap: 300,
            rowGap: 240,
            columns: 3,
          }).x,
          startY: 560,
          columnGap: 250,
          rowGap: 230,
          columns: 2,
        }),
        data: {
          ...buildPlanNodeData(plan11, {
            title: "Kế hoạch 1.1",
            subtitle: formatCycleStageLabel(
              "Chi tiết nhánh",
              cycle.name,
              "Chi tiết nhánh",
            ),
            duration: getDurationLabel(
              addDays(cycle.createdAt, 3),
              addDays(cycle.createdAt, 12),
            ),
            description:
              "Nhánh kế hoạch phụ cho các công việc tiền đề và chuẩn bị vật tư.",
            status: getPlanNodeStatus(3),
            workerSummary: "Chưa phân bổ",
            materialSummary: "Chưa phân bổ",
          }),
          ...buildPlanPosterExtras(plan11, `plan-${cycle.id}-1-1`),
          targetTopHandleId: `plan-${cycle.id}-1-1-target-top`,
          actions: buildPlanActions("Kế hoạch 1.1"),
        },
      },
      {
        id: `plan-${cycle.id}-1-2`,
        type: "workflowCard",
        position: getGridPosition(1, 2, {
          centerX: getGridPosition(0, 3, {
            centerX: 0,
            startY: planStartY,
            columnGap: 300,
            rowGap: 240,
            columns: 3,
          }).x,
          startY: 560,
          columnGap: 250,
          rowGap: 230,
          columns: 2,
        }),
        data: {
          ...buildPlanNodeData(plan12, {
            title: "Kế hoạch 1.2",
            subtitle: formatCycleStageLabel(
              "Chi tiết nhánh",
              cycle.name,
              "Chi tiết nhánh",
            ),
            duration: getDurationLabel(
              addDays(cycle.createdAt, 13),
              addDays(cycle.createdAt, 24),
            ),
            description:
              "Nhánh xử lý tiếp theo sau khi hoàn thành phần nền tảng.",
            status: getPlanNodeStatus(4),
            workerSummary: "Chưa phân bổ",
            materialSummary: "Chưa phân bổ",
          }),
          ...buildPlanPosterExtras(plan12, `plan-${cycle.id}-1-2`),
          targetTopHandleId: `plan-${cycle.id}-1-2-target-top`,
          actions: buildPlanActions("Kế hoạch 1.2"),
        },
      },
    ];

    const edgesList: Edge[] = [
      ...stages.map((stage) => ({
        id: `edge-cycle-stage-${stage.id}`,
        source: `cycle-${cycle.id}`,
        target: `stage-${stage.id}`,
        sourceHandle: `cycle-${cycle.id}-source-top`,
        targetHandle: `stage-${stage.id}-target-bottom`,
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
      })),
      {
        id: `edge-cycle-plan-1`,
        source: `cycle-${cycle.id}`,
        target: `plan-${cycle.id}-1`,
        sourceHandle: `cycle-${cycle.id}-source-bottom`,
        targetHandle: `plan-${cycle.id}-1-target-top`,
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
      },
      {
        id: `edge-cycle-plan-2`,
        source: `cycle-${cycle.id}`,
        target: `plan-${cycle.id}-2`,
        sourceHandle: `cycle-${cycle.id}-source-bottom`,
        targetHandle: `plan-${cycle.id}-2-target-top`,
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
      },
      {
        id: `edge-cycle-plan-3`,
        source: `cycle-${cycle.id}`,
        target: `plan-${cycle.id}-3`,
        sourceHandle: `cycle-${cycle.id}-source-bottom`,
        targetHandle: `plan-${cycle.id}-3-target-top`,
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
      },
      {
        id: `edge-plan-1-1`,
        source: `plan-${cycle.id}-1`,
        target: `plan-${cycle.id}-1-1`,
        sourceHandle: `plan-${cycle.id}-1-source-bottom`,
        targetHandle: `plan-${cycle.id}-1-1-target-top`,
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
      },
      {
        id: `edge-plan-1-2`,
        source: `plan-${cycle.id}-1`,
        target: `plan-${cycle.id}-1-2`,
        sourceHandle: `plan-${cycle.id}-1-source-bottom`,
        targetHandle: `plan-${cycle.id}-1-2-target-top`,
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
      },
    ];

    return { nodes: nodesList, edges: edgesList };
  }, [cycle, plans, regions, setLocation, toast, stages]);

  const storageKey = cycle ? getWorkflowStorageKey(cycle.id) : null;
  const savedPositions = useMemo(
    () => loadSavedPositions(cycle?.id),
    [cycle?.id, flowRevision],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    applySavedPositions(flowDefinition.nodes, savedPositions),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowDefinition.edges);

  const handleNodeDragStart = () => {
    setDragHint("Đang gợi ý canh hàng và cột...");
  };

  const handleNodeDrag: NodeDragHandler = (_, draggedNode) => {
    const SNAP_THRESHOLD = 24;
    let nextHint: string | null = null;

    setActiveDragNodeId(draggedNode.id);
    setNodes((currentNodes) => {
      let snappedX = draggedNode.position.x;
      let snappedY = draggedNode.position.y;

      const otherNodes = currentNodes.filter(
        (node) => node.id !== draggedNode.id,
      );

      const xMatch = otherNodes.find(
        (node) =>
          Math.abs(node.position.x - draggedNode.position.x) <= SNAP_THRESHOLD,
      );
      const yMatch = otherNodes.find(
        (node) =>
          Math.abs(node.position.y - draggedNode.position.y) <= SNAP_THRESHOLD,
      );

      if (xMatch) {
        snappedX = xMatch.position.x;
      }
      if (yMatch) {
        snappedY = yMatch.position.y;
      }

      if (xMatch && yMatch) {
        nextHint = `Canh theo ${getNodeTitle(xMatch)} và ${getNodeTitle(yMatch)}`;
      } else if (xMatch) {
        nextHint = `Canh cột với ${getNodeTitle(xMatch)}`;
      } else if (yMatch) {
        nextHint = `Canh hàng với ${getNodeTitle(yMatch)}`;
      } else {
        nextHint = "Kéo để sắp xếp layout";
      }

      return currentNodes.map((node) =>
        node.id === draggedNode.id
          ? {
              ...node,
              position: {
                x: snappedX,
                y: snappedY,
              },
            }
          : node,
      );
    });

    setDragHint(nextHint);
  };

  const handleNodeDragStop: NodeDragHandler = () => {
    setActiveDragNodeId(null);
    setDragHint(null);
  };

  useEffect(() => {
    setNodes(applySavedPositions(flowDefinition.nodes, savedPositions));
    setEdges(flowDefinition.edges);
  }, [flowDefinition, savedPositions, setEdges, setNodes]);

  useEffect(() => {
    if (!cycle || !storageKey) return;

    savePositions(cycle.id, nodes);
  }, [cycle, nodes, storageKey]);

  const filteredPlans = useMemo(() => {
    const query = planSearch.trim().toLowerCase();

    return plans.filter((plan) => {
      if (!query) return true;

      const searchable = [
        plan.code,
        plan.name,
        plan.description,
        plan.crop,
        plan.variety,
        plan.seasonName,
        plan.purpose,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [planSearch, plans]);

  const closeNodeDialog = () => {
    setNodeDialogOpen(false);
    setNodeDialogMode("chooser");
    setNodeDialogContext(null);
    setStageDraft({
      name: "",
      duration: "",
      description: "",
    });
    setPlanSearch("");
    setSelectedPlanId(null);
  };

  const handleCreateStageNode = () => {
    if (!cycle || !nodeDialogContext) return;

    const nodeId = createNodeId("stage");
    const title =
      stageDraft.name.trim() || `Giai đoạn ${stages.length + 1}`;
    const duration = stageDraft.duration.trim() || "Chưa xác định";
    const description =
      stageDraft.description.trim() || "Chưa có mô tả cho giai đoạn này.";

    const newNode: Node<WorkflowCardNodeData> = {
      id: nodeId,
      type: "workflowCard",
      position: getNextPosition(nodes, "stage"),
      data: {
        kind: "stage",
        eyebrow: "Giai đoạn mới",
        title,
        status: "not_started",
        subtitle: "Vừa tạo từ workflow",
        targetBottomHandleId: `${nodeId}-target-bottom`,
        summaries: [
          { label: "Thời gian", value: duration },
          { label: "Mô tả", value: "Nội dung mô tả" },
        ],
        description,
        actions: [
          {
            label: "Thêm mới",
            icon: Plus,
            onClick: () => {
              setNodeDialogContext({
                sourceNodeId: nodeId,
                sourceKind: "stage",
              });
              setNodeDialogMode("stage");
              setNodeDialogOpen(true);
            },
          },
          {
            label: "Cập nhật",
            icon: PencilLine,
            onClick: () =>
              toast({
                title: "Cập nhật giai đoạn",
                description: `Chuẩn bị chỉnh sửa "${title}".`,
              }),
          },
          {
            label: "Xoá",
            icon: Trash2,
            tone: "destructive",
            onClick: () =>
              toast({
                title: "Xoá giai đoạn",
                description: `Bạn vừa bấm xoá "${title}".`,
              }),
          },
        ],
      },
    };

    const newEdge: Edge = {
      id: `edge-cycle-${cycle.id}-${nodeId}`,
      source: `cycle-${cycle.id}`,
      target: nodeId,
      sourceHandle: `cycle-${cycle.id}-source-top`,
      targetHandle: `${nodeId}-target-bottom`,
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
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setEdges((currentEdges) => [...currentEdges, newEdge]);
    toast({
      title: "Đã thêm giai đoạn",
      description: `Giai đoạn "${title}" đã được đưa vào workflow.`,
    });
    closeNodeDialog();
  };

  const handleCreatePlanNode = () => {
    if (!nodeDialogContext || selectedPlanId == null) return;

    const plan = plans.find((item) => item.id === selectedPlanId);
    if (!plan) return;

    const nodeId = createNodeId(`plan-${plan.id}`);
    const title = plan.name;
    const sourceNodeId = nodeDialogContext.sourceNodeId;
    const sourceKind = nodeDialogContext.sourceKind;
    const replaceNode = nodeDialogContext.replaceNodeId
      ? nodes.find((node) => node.id === nodeDialogContext.replaceNodeId)
      : null;
    const newNode: Node<WorkflowCardNodeData> = {
      id: nodeId,
      type: "workflowCard",
      position:
        replaceNode?.position ??
        (sourceKind === "plan"
          ? getSpawnPositionFromSource(nodes, edges, sourceNodeId, "plan")
          : getSpawnPositionFromSource(nodes, edges, sourceNodeId, "plan")),
      data: {
        ...buildPlanNodeData(plan, {
          title,
          subtitle: getPlanStageLabel(plan),
          duration: getDurationLabel(plan.startDate, plan.endDate),
          description: plan.description || "Kế hoạch được chọn từ danh sách.",
          status:
            nodeDialogContext.sourceKind === "plan" ? "paused" : "not_started",
          workerSummary: getPlanWorkerSummary(plan),
          materialSummary: getPlanMaterialSummary(plan),
        }),
        ...buildPlanPosterExtras(plan, nodeId),
        eyebrow: "Kế hoạch mới",
        targetTopHandleId: `${nodeId}-target-top`,
        sourceBottomHandleId: `${nodeId}-source-bottom`,
        actions: [
          {
            label: "Điều chỉnh thông tin",
            icon: PencilLine,
            onClick: () =>
              toast({
                title: "Điều chỉnh thông tin",
                description: `Mở màn hình chỉnh sửa cho "${title}".`,
              }),
          },
          {
            label: "Xóa kế hoạch",
            icon: Trash2,
            tone: "destructive",
            onClick: () =>
              toast({
                title: "Xóa kế hoạch",
                description: `Bạn vừa bấm xoá "${title}".`,
              }),
          },
        ],
      },
    };

    const newEdge: Edge = {
      id: `edge-${sourceNodeId}-${nodeId}`,
      source: sourceNodeId,
      target: nodeId,
      sourceHandle: `${sourceNodeId}-source-bottom`,
      targetHandle: `${nodeId}-target-top`,
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
    };

    setNodes((currentNodes) => {
      if (nodeDialogContext.replaceNodeId) {
        return [
          ...currentNodes.filter(
            (node) => node.id !== nodeDialogContext.replaceNodeId,
          ),
          newNode,
        ];
      }

      return [...currentNodes, newNode];
    });

    setEdges((currentEdges) => {
      const filteredEdges = nodeDialogContext.replaceNodeId
        ? currentEdges.filter(
            (edge) =>
              edge.source !== nodeDialogContext.replaceNodeId &&
              edge.target !== nodeDialogContext.replaceNodeId,
          )
        : currentEdges;

      return [...filteredEdges, newEdge];
    });

    toast({
      title: "Đã thêm kế hoạch",
      description: `Kế hoạch "${title}" đã được gắn vào workflow.`,
    });
    closeNodeDialog();
  };

  const handleResetLayout = () => {
    if (!cycle) return;

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getWorkflowStorageKey(cycle.id));
    }

    setFlowRevision((value) => value + 1);
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  };

  if (isLoading) {
    return (
      <AdminLayout
        isDev
        title="Workflow chu kì"
        description="Đang tải dữ liệu..."
      >
        <div className="flex h-[60vh] items-center justify-center">
          <div className="rounded-2xl border bg-background px-6 py-5 shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Đang tải workflow...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!cycle) {
    return (
      <AdminLayout
        isDev
        title="Workflow chu kì"
        description="Không tìm thấy dữ liệu"
      >
        <div className="flex h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border bg-background p-6 text-center shadow-sm">
            <p className="text-lg font-semibold">
              Không tìm thấy chu kì sinh trưởng
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Chu kì này có thể đã bị xoá hoặc đường dẫn không hợp lệ.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/animal-growth-cycle">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay về danh sách
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentCycle = cycle as NonNullable<typeof cycle>;
  const metadata = (currentCycle.metadataJson || {}) as Record<string, unknown>;
  const isAnimal = (metadata.cycleType ?? "animal") === "animal";
  const nodeDialogTitle =
    nodeDialogMode === "chooser"
      ? "Thêm node vào workflow"
      : nodeDialogMode === "stage"
        ? "Tạo giai đoạn mới"
        : nodeDialogContext?.sourceKind === "plan"
          ? "Chọn kế hoạch con mới"
          : "Chọn kế hoạch mới";
  const nodeDialogDescription =
    nodeDialogMode === "chooser"
      ? "Chọn loại node muốn thêm từ chu kì hiện tại."
      : nodeDialogMode === "stage"
        ? "Nhập thông tin giai đoạn rồi thêm trực tiếp vào workflow."
        : nodeDialogContext?.sourceKind === "plan"
          ? "Tìm và chọn một kế hoạch để gắn làm node con của kế hoạch cấp 1."
          : "Tìm và chọn một kế hoạch có sẵn để đưa vào workflow.";

  return (
    <AdminLayout
      isDev
      title="Workflow chu kì"
      description="Trực quan hoá chu kì sinh trưởng, giai đoạn và kế hoạch bằng React Flow"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/animal-growth-cycle">
            <Button variant="outline" className="h-9 px-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <Link href={`/animal-growth-cycle/${currentCycle.id}/edit`}>
            <Button className="h-9 px-3">
              <PencilLine className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={handleResetLayout}
          >
            Khôi phục bố cục
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant={isAnimal ? "default" : "secondary"}>
          {isAnimal ? "Động vật" : "Vật nuôi / Thủy sản"}
        </Badge>
        <Badge variant="outline">
          {currentCycle.cropVarietyId ? "Theo giống" : "Theo loại cây"}
        </Badge>
        <Badge variant="outline">{stages.length} giai đoạn</Badge>
        <Badge variant="outline">{currentCycle.expectedDays || 0} ngày</Badge>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="relative h-[calc(100vh-260px)] min-h-[720px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStart={handleNodeDragStart}
            onNodeDrag={handleNodeDrag}
            onNodeDragStop={handleNodeDragStop}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.35}
            maxZoom={1.4}
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
              gap={26}
              size={1}
              color="#dbe4ee"
            />
            <Controls
              showInteractive={false}
              className="!shadow-lg !border !border-slate-200 !bg-white/95"
            />
            <MiniMap
              nodeColor={(node) => {
                const kind = node.data?.kind as string | undefined;
                if (kind === "cycle") return "#10b981";
                if (kind === "stage") return "#0ea5e9";
                return "#f59e0b";
              }}
              maskColor="rgba(248,250,252,0.78)"
              className="!rounded-xl !border !border-slate-200 !bg-white/95 !shadow-lg"
            />
          </ReactFlow>

          {dragHint && (
            <div className="pointer-events-none absolute right-6 top-6 z-20 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-lg backdrop-blur">
              <div className="mb-1 font-semibold text-slate-900">
                Gợi ý bố cục
              </div>
              <div>{dragHint}</div>
              {activeDragNodeId && (
                <div className="mt-1 text-xs text-slate-400">
                  Đang kéo: {activeDragNodeId}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={nodeDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeNodeDialog();
            return;
          }
          setNodeDialogOpen(true);
        }}
      >
        <DialogContent className="flex h-[88vh] max-h-[88vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-2xl">
          <DialogHeader className="border-b bg-slate-50 px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-lg">
              {nodeDialogTitle}
            </DialogTitle>
            <DialogDescription>{nodeDialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {nodeDialogMode === "chooser" && (
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => setNodeDialogMode("stage")}
                >
                  <div className="mb-3 inline-flex rounded-xl bg-sky-100 p-3 text-sky-700">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">Thêm giai đoạn</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tạo nhanh một giai đoạn mới cho chu kì hiện tại.
                  </p>
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => setNodeDialogMode("plan")}
                >
                  <div className="mb-3 inline-flex rounded-xl bg-amber-100 p-3 text-amber-700">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">Thêm kế hoạch</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Mở hộp tìm kiếm để chọn một kế hoạch khác.
                  </p>
                </button>
              </div>
            )}

            {nodeDialogMode === "stage" && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stage-name">Tên giai đoạn</Label>
                    <Input
                      id="stage-name"
                      value={stageDraft.name}
                      onChange={(event) =>
                        setStageDraft((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="VD: Giai đoạn 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage-duration">Thời gian</Label>
                    <Input
                      id="stage-duration"
                      value={stageDraft.duration}
                      onChange={(event) =>
                        setStageDraft((current) => ({
                          ...current,
                          duration: event.target.value,
                        }))
                      }
                      placeholder="VD: 15 ngày"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage-description">Mô tả</Label>
                  <Textarea
                    id="stage-description"
                    value={stageDraft.description}
                    onChange={(event) =>
                      setStageDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Mô tả ngắn cho giai đoạn"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {nodeDialogMode === "plan" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={planSearch}
                    onChange={(event) => setPlanSearch(event.target.value)}
                    placeholder="Tìm theo mã, tên, mùa vụ, vật nuôi..."
                    className="h-11 pl-10"
                  />
                </div>

                <ScrollArea className="h-[calc(88vh-310px)] min-h-[280px] rounded-2xl border border-slate-200">
                  <div className="space-y-2 p-3">
                    {filteredPlans.length === 0 ? (
                      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        Không tìm thấy kế hoạch phù hợp.
                      </div>
                    ) : (
                      filteredPlans.map((plan) => {
                        const isSelected = selectedPlanId === plan.id;
                        const statusLabel = getPlanStatusLabel(plan.status);

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={[
                              "w-full rounded-xl border p-4 text-left transition-all",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50",
                            ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="truncate font-semibold text-slate-900">
                                      {plan.name}
                                    </h3>
                                    {isSelected && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                    {plan.description || "Không có mô tả"}
                                  </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                  <Badge variant="secondary">{plan.code}</Badge>
                                  <Badge variant="outline">{statusLabel}</Badge>
                                </div>
                              </div>

                              <div className="mt-3 text-xs text-slate-600">
                                {getPlanStageLabel(plan)}
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <Badge variant="outline" className="justify-center">
                                  {getDurationLabel(plan.startDate, plan.endDate)}
                                </Badge>
                                <Badge variant="outline" className="justify-center">
                                  {`${plan.selectedStages.length} giai đoạn`}
                                </Badge>
                                <Badge variant="outline" className="justify-center">
                                  {getPlanWorkerSummary(plan)}
                                </Badge>
                                <Badge variant="outline" className="justify-center">
                                  {getPlanMaterialSummary(plan)}
                                </Badge>
                              </div>
                            </button>
                          );
                        })
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t bg-slate-50 px-6 py-4">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {nodeDialogMode === "chooser" &&
                  "Chọn một kiểu node để tiếp tục"}
                {nodeDialogMode === "stage" &&
                  "Nhập xong rồi bấm tạo giai đoạn"}
                {nodeDialogMode === "plan" && "Chọn kế hoạch rồi xác nhận"}
              </div>

              <div className="flex gap-2">
                {nodeDialogMode !== "chooser" && (
                  <Button
                    variant="outline"
                    onClick={() => setNodeDialogMode("chooser")}
                  >
                    Quay lại
                  </Button>
                )}
                <Button variant="outline" onClick={closeNodeDialog}>
                  Hủy
                </Button>
                {nodeDialogMode === "stage" && (
                  <Button
                    onClick={handleCreateStageNode}
                    disabled={!stageDraft.name.trim()}
                  >
                    Tạo giai đoạn
                  </Button>
                )}
                {nodeDialogMode === "plan" && (
                  <Button
                    onClick={handleCreatePlanNode}
                    disabled={selectedPlanId == null}
                  >
                    Chọn kế hoạch
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
