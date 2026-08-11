import { MarkerType, type Edge } from "reactflow";
import type { Plan } from "./useAquacultureGrowthPlanStore";
import type { Workflow } from "./useAquacultureGrowthWorkflowStore";
import type { DraftNode } from "../pages/plan-aquaculture-growth/hooks/useAquacultureGrowthWorkflowDraftStore";

interface PlanSeed {
  name: string;
  description: string;
  purpose: Plan["purpose"];
  status: Plan["status"];
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  crop: string;
  variety: string;
}

interface WorkflowSeed {
  id: string;
  name: string;
  description: string;
  regionId: number;
  createdAt: string;
  plans: PlanSeed[];
}

const WORKFLOW_SEEDS: WorkflowSeed[] = [
  {
    id: "aq-wf-001",
    name: "Quy trình nuôi trồng thủy sản Tôm thẻ Vannamei - Bạc Liêu",
    description:
      "Sơ đồ quy trình úm, nuôi tăng trọng, phòng bệnh và thu hoạch cho vụ tôm thẻ Vannamei.",
    regionId: 1,
    createdAt: "2024-05-01",
    plans: [
      {
        name: "Kế hoạch thả giống Vannamei",
        description:
          "Chuẩn bị ao nuôi, sát trùng, tiếp nhận giống thủy sản và theo dõi thích nghi trong tuần đầu.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-001",
        seasonName: "Vụ nuôi tôm thẻ Vannamei 2024",
        startDate: "2024-05-15",
        endDate: "2024-06-05",
        crop: "Tôm thẻ",
        variety: "Vannamei",
      },
      {
        name: "Kế hoạch nuôi tăng trọng giai đoạn 1",
        description:
          "Quản lý khẩu phần thức ăn, oxy hòa tan, vitamin và theo dõi tăng trưởng theo tuần.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-001",
        seasonName: "Vụ nuôi tôm thẻ Vannamei 2024",
        startDate: "2024-06-06",
        endDate: "2024-08-15",
        crop: "Tôm thẻ",
        variety: "Vannamei",
      },
      {
        name: "Kế hoạch cải tạo ao nuôi",
        description:
          "Cải tạo đáy ao, xử lý bùn, gây màu nước và kiểm tra hệ thống quạt nước.",
        purpose: "amendment",
        status: "draft",
        seasonId: "AQ-CROP-001",
        seasonName: "Vụ nuôi tôm thẻ Vannamei 2024",
        startDate: "2024-08-16",
        endDate: "2024-08-30",
        crop: "Tôm thẻ",
        variety: "Vannamei",
      },
      {
        name: "Kế hoạch phòng bệnh gan tụy",
        description:
          "Theo dõi màu nước, dấu hiệu bất thường, tỷ lệ sống và xử lý chế phẩm theo phác đồ kỹ thuật.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AQ-CROP-001",
        seasonName: "Vụ nuôi tôm thẻ Vannamei 2024",
        startDate: "2024-07-01",
        endDate: "2024-07-20",
        crop: "Tôm thẻ",
        variety: "Vannamei",
      },
      {
        name: "Kế hoạch thu hoạch đợt 1",
        description:
          "Kiểm tra kích cỡ, phân loại sản lượng đạt chuẩn, lập lịch thu hoạch và vận chuyển.",
        purpose: "harvest",
        status: "active",
        seasonId: "AQ-CROP-001",
        seasonName: "Vụ nuôi tôm thẻ Vannamei 2024",
        startDate: "2024-09-01",
        endDate: "2024-09-15",
        crop: "Tôm thẻ",
        variety: "Vannamei",
      },
    ],
  },
  {
    id: "aq-wf-002",
    name: "Quy trình nuôi trồng thủy sản Cá tra thương phẩm - An Giang",
    description:
      "Quy trình quản lý vụ cá tra từ giai đoạn cá giống, tăng trưởng, kiểm soát sinh khối đến vệ sinh ao.",
    regionId: 2,
    createdAt: "2024-06-01",
    plans: [
      {
        name: "Kế hoạch nuôi giai đoạn cá giống",
        description:
          "Theo dõi độ đồng đều cỡ cá, khẩu phần protein và chất lượng nước trước giai đoạn tăng trưởng.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-002",
        seasonName: "Vụ cá tra thương phẩm 2024",
        startDate: "2024-03-01",
        endDate: "2024-05-15",
        crop: "Cá tra",
        variety: "Cá tra giống",
      },
      {
        name: "Kế hoạch tối ưu sinh khối",
        description:
          "Cân đối thức ăn, khoáng, canxi và lịch kiểm tra sàng ăn theo từng ca.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-002",
        seasonName: "Vụ cá tra thương phẩm 2024",
        startDate: "2024-05-16",
        endDate: "2024-09-30",
        crop: "Cá tra",
        variety: "Cá tra giống",
      },
      {
        name: "Kế hoạch cải tạo hệ thống ao ương",
        description:
          "Bổ sung ao ương, xử lý đáy ao và vệ sinh hệ thống cấp thoát nước.",
        purpose: "facility-upgrade",
        status: "draft",
        seasonId: "AQ-CROP-002",
        seasonName: "Vụ cá tra thương phẩm 2024",
        startDate: "2024-06-01",
        endDate: "2024-06-20",
        crop: "Cá tra",
        variety: "Cá tra giống",
      },
      {
        name: "Kế hoạch phòng bệnh đường ruột",
        description:
          "Kiểm tra đáy ao, phân cỡ cá, dùng chế phẩm thủy sản và men tiêu hóa theo phác đồ.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AQ-CROP-002",
        seasonName: "Vụ cá tra thương phẩm 2024",
        startDate: "2024-07-01",
        endDate: "2024-07-14",
        crop: "Cá tra",
        variety: "Cá tra giống",
      },
      {
        name: "Kế hoạch thu hoạch và tái vụ",
        description:
          "Đánh giá năng suất, thu hoạch cá đạt cỡ và chuẩn bị vụ nuôi tiếp theo.",
        purpose: "harvest",
        status: "draft",
        seasonId: "AQ-CROP-002",
        seasonName: "Vụ cá tra thương phẩm 2024",
        startDate: "2024-10-01",
        endDate: "2024-10-25",
        crop: "Cá tra",
        variety: "Cá tra giống",
      },
    ],
  },
  {
    id: "aq-wf-003",
    name: "Quy trình nuôi trồng thủy sản Cá rô phi Rô phi đỏ - Đồng Tháp",
    description:
      "Sơ đồ quản lý thả giống, nuôi tăng trưởng, quản lý môi trường nước và thu hoạch cá rô phi.",
    regionId: 3,
    createdAt: "2024-04-01",
    plans: [
      {
        name: "Kế hoạch thả giống cá rô phi",
        description:
          "Kiểm tra hồ sơ kiểm dịch giống, cỡ giống và thuần nước trước khi thả vào ao chính.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-003",
        seasonName: "Vụ cá rô phi Rô phi đỏ 2024",
        startDate: "2024-02-01",
        endDate: "2024-02-20",
        crop: "Cá rô phi",
        variety: "Rô phi đỏ",
      },
      {
        name: "Kế hoạch nuôi tăng trưởng",
        description:
          "Quản lý thức ăn viên, khoáng tạt, vitamin và theo dõi sinh khối hằng tuần.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AQ-CROP-003",
        seasonName: "Vụ cá rô phi Rô phi đỏ 2024",
        startDate: "2024-02-21",
        endDate: "2024-09-30",
        crop: "Cá rô phi",
        variety: "Rô phi đỏ",
      },
      {
        name: "Kế hoạch cải tạo hệ thống ao nuôi",
        description:
          "Gia cố bờ ao, lưới chắn và quạt nước cho hệ thống ao nuôi cá rô phi.",
        purpose: "facility-upgrade",
        status: "cancelled",
        seasonId: "AQ-CROP-003",
        seasonName: "Vụ cá rô phi Rô phi đỏ 2024",
        startDate: "2024-04-01",
        endDate: "2024-04-30",
        crop: "Cá rô phi",
        variety: "Rô phi đỏ",
      },
      {
        name: "Kế hoạch phòng bệnh do môi trường nước",
        description:
          "Theo dõi môi trường nước, tạt chế phẩm và cập nhật nhật ký kỹ thuật.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AQ-CROP-003",
        seasonName: "Vụ cá rô phi Rô phi đỏ 2024",
        startDate: "2024-05-01",
        endDate: "2024-05-10",
        crop: "Cá rô phi",
        variety: "Rô phi đỏ",
      },
      {
        name: "Kế hoạch thu hoạch cá đạt sinh khối",
        description:
          "Kiểm tra sinh khối cuối kỳ, phân nhóm kích cỡ và chuẩn bị vận chuyển đến điểm thu mua.",
        purpose: "harvest",
        status: "draft",
        seasonId: "AQ-CROP-003",
        seasonName: "Vụ cá rô phi Rô phi đỏ 2024",
        startDate: "2024-10-01",
        endDate: "2024-10-20",
        crop: "Cá rô phi",
        variety: "Rô phi đỏ",
      },
    ],
  },
];

const LEVEL_HEIGHT = 320;
const SIBLING_GAP = 480;
const PARENT_INDEX_BY_COUNT: Record<number, Array<number | null>> = {
  5: [null, 0, 1, 0, 3],
};

function layoutTree(parentIndices: Array<number | null>) {
  const childrenByParent: number[][] = parentIndices.map(() => []);
  let rootIndex = 0;
  parentIndices.forEach((parent, index) => {
    if (parent === null) rootIndex = index;
    else childrenByParent[parent].push(index);
  });

  const positions = parentIndices.map(() => ({ x: 0, y: 0 }));

  function place(index: number, x: number, depth: number): number {
    const children = childrenByParent[index];
    if (!children.length) {
      positions[index] = { x, y: depth * LEVEL_HEIGHT };
      return x + SIBLING_GAP;
    }

    let cursor = x;
    children.forEach((childIndex) => {
      cursor = place(childIndex, cursor, depth + 1);
    });

    const firstChildX = positions[children[0]].x;
    const lastChildX = positions[children[children.length - 1]].x;
    positions[index] = {
      x: (firstChildX + lastChildX) / 2,
      y: depth * LEVEL_HEIGHT,
    };
    return cursor;
  }

  place(rootIndex, 0, 0);
  return positions;
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

function buildSeedData() {
  const plans: Plan[] = [];
  const workflows: Workflow[] = [];
  let planId = 1;

  WORKFLOW_SEEDS.forEach((workflowSeed, workflowIndex) => {
    const parentIndices = PARENT_INDEX_BY_COUNT[workflowSeed.plans.length];
    const positions = layoutTree(parentIndices);
    const nodeIds = workflowSeed.plans.map(
      (_, planIndex) => `${workflowSeed.id}-plan-${planId + planIndex}`,
    );
    const nodes: DraftNode[] = [];
    const edges: Edge[] = [];

    workflowSeed.plans.forEach((planSeed, planIndex) => {
      const id = planId;
      planId += 1;
      const nodeId = nodeIds[planIndex];
      const parentIndex = parentIndices[planIndex];

      plans.push({
        id,
        code: `AH-${workflowSeed.id.toUpperCase()}-${String(planIndex + 1).padStart(2, "0")}`,
        name: planSeed.name,
        description: planSeed.description,
        workflowId: workflowSeed.id,
        seasonId: planSeed.seasonId,
        seasonName: planSeed.seasonName,
        startDate: planSeed.startDate,
        endDate: planSeed.endDate,
        selectedRegionIds: [String(workflowSeed.regionId)],
        selectedZoneIds: [],
        selectedPlotIds: [],
        crop: planSeed.crop,
        variety: planSeed.variety,
        purpose: planSeed.purpose,
        growthCycleId: "",
        regimenId: "",
        selectedStages: [],
        materialAllocations: [],
        taskAllocations: [],
        status: planSeed.status,
        createdAt: planSeed.startDate,
      });

      nodes.push({
        id: nodeId,
        type: "workflowCard",
        position: positions[planIndex],
        data:
          parentIndex === null
            ? { setupKind: "plan", planId: id }
            : { setupKind: "plan", planId: id, parentId: nodeIds[parentIndex] },
      });

      if (parentIndex !== null) {
        edges.push(buildChildEdge(nodeIds[parentIndex], nodeId));
      }
    });

    workflows.push({
      id: workflowSeed.id,
      name: workflowSeed.name,
      description: workflowSeed.description,
      selections: [
        {
          id: `${workflowSeed.id}-sel-1`,
          type: "region",
          regionId: String(workflowSeed.regionId),
        },
      ],
      isActive: workflowIndex === 0,
      createdAt: workflowSeed.createdAt,
      nodes,
      edges,
    });
  });

  return { plans, workflows };
}

const seedData = buildSeedData();

export const initialAquacultureGrowthPlans = seedData.plans;
export const initialAquacultureGrowthWorkflows = seedData.workflows;
