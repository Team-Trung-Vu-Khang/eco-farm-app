import { MarkerType, type Edge } from "reactflow";
import type { Plan } from "./useAnimalGrowthPlanStore";
import type { Workflow } from "./useAnimalGrowthWorkflowStore";
import type { DraftNode } from "../pages/plan-animal-growth/hooks/useAnimalGrowthWorkflowDraftStore";

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
    id: "ah-wf-001",
    name: "Quy trình chăn nuôi Heo thịt Yorkshire - Bình Phước",
    description:
      "Sơ đồ quy trình úm, nuôi tăng trọng, phòng bệnh và xuất bán cho đàn heo thịt Yorkshire.",
    regionId: 1,
    createdAt: "2024-05-01",
    plans: [
      {
        name: "Kế hoạch nhập đàn heo giống Yorkshire",
        description:
          "Chuẩn bị ô chuồng, sát trùng, tiếp nhận con giống và theo dõi thích nghi trong tuần đầu.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-001",
        seasonName: "Lứa nuôi heo thịt Yorkshire 2024",
        startDate: "2024-05-15",
        endDate: "2024-06-05",
        crop: "Heo thịt",
        variety: "Yorkshire",
      },
      {
        name: "Kế hoạch nuôi tăng trọng giai đoạn 1",
        description:
          "Phân bổ khẩu phần cám, nước uống, vitamin và theo dõi tăng trọng theo tuần.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-001",
        seasonName: "Lứa nuôi heo thịt Yorkshire 2024",
        startDate: "2024-06-06",
        endDate: "2024-08-15",
        crop: "Heo thịt",
        variety: "Yorkshire",
      },
      {
        name: "Kế hoạch vệ sinh và cải tạo chuồng",
        description:
          "Rửa chuồng, thay đệm lót, kiểm tra máng ăn uống và xử lý khu vực ẩm ướt.",
        purpose: "amendment",
        status: "draft",
        seasonId: "AH-LOT-001",
        seasonName: "Lứa nuôi heo thịt Yorkshire 2024",
        startDate: "2024-08-16",
        endDate: "2024-08-30",
        crop: "Heo thịt",
        variety: "Yorkshire",
      },
      {
        name: "Kế hoạch phòng bệnh hô hấp",
        description:
          "Theo dõi biểu hiện ho, sốt, tách đàn nghi nhiễm và dùng thuốc thú y theo phác đồ.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AH-LOT-001",
        seasonName: "Lứa nuôi heo thịt Yorkshire 2024",
        startDate: "2024-07-01",
        endDate: "2024-07-20",
        crop: "Heo thịt",
        variety: "Yorkshire",
      },
      {
        name: "Kế hoạch xuất bán đợt 1",
        description:
          "Cân trọng lượng, phân loại đàn đạt chuẩn, lập lịch vận chuyển và bàn giao cho đối tác.",
        purpose: "harvest",
        status: "active",
        seasonId: "AH-LOT-001",
        seasonName: "Lứa nuôi heo thịt Yorkshire 2024",
        startDate: "2024-09-01",
        endDate: "2024-09-15",
        crop: "Heo thịt",
        variety: "Yorkshire",
      },
    ],
  },
  {
    id: "ah-wf-002",
    name: "Quy trình chăn nuôi Gà đẻ Lương Phượng - Đồng Nai",
    description:
      "Quy trình quản lý đàn gà đẻ từ hậu bị, vào đẻ, kiểm soát sản lượng trứng đến vệ sinh chuồng.",
    regionId: 2,
    createdAt: "2024-06-01",
    plans: [
      {
        name: "Kế hoạch nuôi hậu bị",
        description:
          "Theo dõi đồng đều đàn, khẩu phần protein và lịch chiếu sáng trước giai đoạn vào đẻ.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-002",
        seasonName: "Lứa gà đẻ Lương Phượng 2024",
        startDate: "2024-03-01",
        endDate: "2024-05-15",
        crop: "Gà đẻ",
        variety: "Lương Phượng",
      },
      {
        name: "Kế hoạch tối ưu sản lượng trứng",
        description:
          "Cân đối thức ăn, khoáng, canxi và lịch thu gom trứng theo từng ca.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-002",
        seasonName: "Lứa gà đẻ Lương Phượng 2024",
        startDate: "2024-05-16",
        endDate: "2024-09-30",
        crop: "Gà đẻ",
        variety: "Lương Phượng",
      },
      {
        name: "Kế hoạch cải tạo hệ thống ổ đẻ",
        description:
          "Bổ sung ổ đẻ, thay chất lót và vệ sinh băng chuyền thu trứng.",
        purpose: "facility-upgrade",
        status: "draft",
        seasonId: "AH-LOT-002",
        seasonName: "Lứa gà đẻ Lương Phượng 2024",
        startDate: "2024-06-01",
        endDate: "2024-06-20",
        crop: "Gà đẻ",
        variety: "Lương Phượng",
      },
      {
        name: "Kế hoạch phòng bệnh cầu trùng",
        description:
          "Kiểm tra nền chuồng, phân đàn, dùng thuốc thú y và men tiêu hóa theo phác đồ.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AH-LOT-002",
        seasonName: "Lứa gà đẻ Lương Phượng 2024",
        startDate: "2024-07-01",
        endDate: "2024-07-14",
        crop: "Gà đẻ",
        variety: "Lương Phượng",
      },
      {
        name: "Kế hoạch loại thải và tái đàn",
        description:
          "Đánh giá năng suất, loại thải cá thể kém và chuẩn bị lứa hậu bị tiếp theo.",
        purpose: "harvest",
        status: "draft",
        seasonId: "AH-LOT-002",
        seasonName: "Lứa gà đẻ Lương Phượng 2024",
        startDate: "2024-10-01",
        endDate: "2024-10-25",
        crop: "Gà đẻ",
        variety: "Lương Phượng",
      },
    ],
  },
  {
    id: "ah-wf-003",
    name: "Quy trình chăn nuôi Bò thịt Brahman - Tây Nguyên",
    description:
      "Sơ đồ quản lý bê nhập đàn, nuôi vỗ béo, chăm sóc thú y và xuất bán bò thịt.",
    regionId: 3,
    createdAt: "2024-04-01",
    plans: [
      {
        name: "Kế hoạch tiếp nhận bê giống",
        description:
          "Kiểm tra hồ sơ thú y, cân đầu kỳ và cách ly theo dõi trước khi nhập đàn chính.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-003",
        seasonName: "Lứa bò thịt Brahman 2024",
        startDate: "2024-02-01",
        endDate: "2024-02-20",
        crop: "Bò thịt",
        variety: "Brahman",
      },
      {
        name: "Kế hoạch nuôi vỗ béo",
        description:
          "Phối trộn thức ăn thô xanh, tinh bột, khoáng và theo dõi tăng trọng hằng tháng.",
        purpose: "cultivation",
        status: "active",
        seasonId: "AH-LOT-003",
        seasonName: "Lứa bò thịt Brahman 2024",
        startDate: "2024-02-21",
        endDate: "2024-09-30",
        crop: "Bò thịt",
        variety: "Brahman",
      },
      {
        name: "Kế hoạch cải tạo khu vận động",
        description:
          "Gia cố hàng rào, nền chuồng và máng uống cho khu vận động bò thịt.",
        purpose: "facility-upgrade",
        status: "cancelled",
        seasonId: "AH-LOT-003",
        seasonName: "Lứa bò thịt Brahman 2024",
        startDate: "2024-04-01",
        endDate: "2024-04-30",
        crop: "Bò thịt",
        variety: "Brahman",
      },
      {
        name: "Kế hoạch phòng bệnh tụ huyết trùng",
        description:
          "Lập lịch tiêm phòng, theo dõi phản ứng và cập nhật nhật ký thú y.",
        purpose: "treatment",
        status: "completed",
        seasonId: "AH-LOT-003",
        seasonName: "Lứa bò thịt Brahman 2024",
        startDate: "2024-05-01",
        endDate: "2024-05-10",
        crop: "Bò thịt",
        variety: "Brahman",
      },
      {
        name: "Kế hoạch xuất bán bò đạt trọng lượng",
        description:
          "Cân cuối kỳ, phân nhóm trọng lượng và chuẩn bị vận chuyển đến điểm thu mua.",
        purpose: "harvest",
        status: "draft",
        seasonId: "AH-LOT-003",
        seasonName: "Lứa bò thịt Brahman 2024",
        startDate: "2024-10-01",
        endDate: "2024-10-20",
        crop: "Bò thịt",
        variety: "Brahman",
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

export const initialAnimalGrowthPlans = seedData.plans;
export const initialAnimalGrowthWorkflows = seedData.workflows;
