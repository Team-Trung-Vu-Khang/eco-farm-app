import { MarkerType, type Edge } from "reactflow";
import type { Plan } from "./usePlanStore";
import type { Workflow } from "./useWorkflowStore";
import type { DraftNode } from "../pages/plan-growth/hooks/usePlanWorkflowDraftStore";

// Seed data for the "5 sơ đồ quy trình x 5-6 kế hoạch" demo dataset. Kept as
// small declarative specs + a builder instead of ~30 hand-written Plan
// objects so the shape stays easy to scan and extend.

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
    id: "wf-001",
    name: "Quy trình canh tác Sầu riêng Ri6 - Bình Phước",
    description:
      "Sơ đồ quy trình canh tác thuận vụ và nghịch vụ cho vùng Sầu riêng Ri6 tại Bình Phước.",
    regionId: 1,
    createdAt: "2024-05-01",
    plans: [
      {
        name: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6",
        description:
          "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-05-15",
        endDate: "2024-11-30",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
      {
        name: "Kế hoạch chăm sóc giai đoạn nuôi trái",
        description: "Bón phân, tưới nước và phòng trừ sâu bệnh giai đoạn nuôi trái.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-08-01",
        endDate: "2024-10-15",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
      {
        name: "Kế hoạch phục hồi sau thu hoạch",
        description:
          "Khơi rãnh thoát nước, xới nhẹ mặt đất, bón phân hữu cơ và vi sinh để phục hồi rễ tơ.",
        purpose: "amendment",
        status: "draft",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-12-01",
        endDate: "2025-01-15",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
      {
        name: "Kế hoạch điều trị nấm hồng",
        description: "Phác đồ xử lý bệnh nấm hồng phát hiện trên cành cấp 1.",
        purpose: "treatment",
        status: "completed",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-07-01",
        endDate: "2024-07-20",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
      {
        name: "Kế hoạch thu hoạch đợt 1",
        description: "Thu hoạch, phân loại và đóng gói sầu riêng đợt 1.",
        purpose: "harvest",
        status: "active",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-11-01",
        endDate: "2024-11-20",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
      {
        name: "Kế hoạch nâng cấp hệ thống tưới nhỏ giọt",
        description: "Lắp đặt bổ sung hệ thống tưới nhỏ giọt cho khu A mở rộng.",
        purpose: "facility-upgrade",
        status: "cancelled",
        seasonId: "S002",
        seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
        startDate: "2024-06-01",
        endDate: "2024-06-30",
        crop: "Sầu riêng",
        variety: "Ri6",
      },
    ],
  },
  {
    id: "wf-002",
    name: "Quy trình canh tác Sầu riêng hữu cơ - Đồng Nai",
    description:
      "Sơ đồ quy trình canh tác hữu cơ, không dùng thuốc BVTV hóa học cho vườn Sầu riêng Đồng Nai.",
    regionId: 2,
    createdAt: "2024-06-01",
    plans: [
      {
        name: "Kế hoạch canh tác hữu cơ chính vụ",
        description: "Áp dụng quy trình canh tác hữu cơ chuẩn cho chính vụ Đông Nam Bộ.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-03-01",
        endDate: "2024-09-30",
        crop: "Sầu riêng",
        variety: "Monthong",
      },
      {
        name: "Kế hoạch bón phân vi sinh định kỳ",
        description: "Bón phân hữu cơ vi sinh theo chu kỳ 30 ngày/lần.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-04-01",
        endDate: "2024-08-31",
        crop: "Sầu riêng",
        variety: "Monthong",
      },
      {
        name: "Kế hoạch cải tạo đất bạc màu",
        description: "Cải tạo cấu trúc và pH đất khu vực trồng thủy canh mở rộng.",
        purpose: "amendment",
        status: "draft",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-10-01",
        endDate: "2024-11-15",
        crop: "Sầu riêng",
        variety: "Monthong",
      },
      {
        name: "Kế hoạch điều trị rệp sáp",
        description: "Phác đồ sinh học xử lý rệp sáp trên thân và cành.",
        purpose: "treatment",
        status: "completed",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-05-01",
        endDate: "2024-05-20",
        crop: "Sầu riêng",
        variety: "Monthong",
      },
      {
        name: "Kế hoạch thu hoạch & sơ chế",
        description: "Thu hoạch, sơ chế và vận chuyển về kho tập kết.",
        purpose: "harvest",
        status: "draft",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-09-01",
        endDate: "2024-09-25",
        crop: "Sầu riêng",
        variety: "Monthong",
      },
    ],
  },
  {
    id: "wf-003",
    name: "Quy trình canh tác Cà phê Robusta - Buôn Ma Thuột",
    description: "Sơ đồ quy trình canh tác cà phê Robusta xuất khẩu vùng đồi Buôn Ma Thuột.",
    regionId: 3,
    createdAt: "2024-04-01",
    plans: [
      {
        name: "Kế hoạch canh tác chính vụ Tây Nguyên",
        description: "Quy trình canh tác chuẩn theo mùa vụ chính Tây Nguyên.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S004",
        seasonName: "Chính vụ Tây Nguyên",
        startDate: "2024-02-01",
        endDate: "2024-10-31",
        crop: "Cà phê",
        variety: "Robusta",
      },
      {
        name: "Kế hoạch tưới nước mùa khô",
        description: "Lên lịch tưới nước tiết kiệm cho mùa khô Tây Nguyên.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S004",
        seasonName: "Chính vụ Tây Nguyên",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        crop: "Cà phê",
        variety: "Robusta",
      },
      {
        name: "Kế hoạch cải tạo đất dốc",
        description: "Làm bậc thang chống xói mòn và bón vôi cải tạo đất chua.",
        purpose: "amendment",
        status: "cancelled",
        seasonId: "S004",
        seasonName: "Chính vụ Tây Nguyên",
        startDate: "2024-11-01",
        endDate: "2024-12-15",
        crop: "Cà phê",
        variety: "Robusta",
      },
      {
        name: "Kế hoạch điều trị bệnh gỉ sắt",
        description: "Phác đồ xử lý bệnh gỉ sắt trên lá cà phê.",
        purpose: "treatment",
        status: "completed",
        seasonId: "S004",
        seasonName: "Chính vụ Tây Nguyên",
        startDate: "2024-06-01",
        endDate: "2024-06-25",
        crop: "Cà phê",
        variety: "Robusta",
      },
      {
        name: "Kế hoạch thu hoạch chính vụ",
        description: "Thu hái, phơi sấy và phân loại cà phê nhân.",
        purpose: "harvest",
        status: "draft",
        seasonId: "S004",
        seasonName: "Chính vụ Tây Nguyên",
        startDate: "2024-10-15",
        endDate: "2024-11-30",
        crop: "Cà phê",
        variety: "Robusta",
      },
    ],
  },
  {
    id: "wf-004",
    name: "Quy trình vườn cây ăn trái VAC - Tư Sang",
    description: "Sơ đồ quy trình mô hình vườn - ao - chuồng kết hợp du lịch sinh thái.",
    regionId: 4,
    createdAt: "2024-01-20",
    plans: [
      {
        name: "Kế hoạch canh tác đa cây trồng",
        description: "Luân canh và xen canh nhiều loại cây ăn trái trong mô hình VAC.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-02-01",
        endDate: "2024-09-30",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
      {
        name: "Kế hoạch nâng cấp hệ thống tưới nhỏ giọt",
        description: "Lắp đặt hệ thống tưới nhỏ giọt tự động cho toàn khu vườn.",
        purpose: "facility-upgrade",
        status: "active",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-03-01",
        endDate: "2024-04-15",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
      {
        name: "Kế hoạch cải tạo bờ ao, hệ thống thoát nước",
        description: "Cải tạo bờ ao và hệ thống thoát nước phục vụ mùa mưa.",
        purpose: "amendment",
        status: "draft",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-10-01",
        endDate: "2024-10-31",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
      {
        name: "Kế hoạch điều trị sâu đục thân",
        description: "Phác đồ xử lý sâu đục thân trên cây có múi.",
        purpose: "treatment",
        status: "completed",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-05-01",
        endDate: "2024-05-15",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
      {
        name: "Kế hoạch thu hoạch phục vụ khách du lịch",
        description: "Thu hoạch trải nghiệm gắn với hoạt động du lịch sinh thái.",
        purpose: "harvest",
        status: "active",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
      {
        name: "Kế hoạch nâng cấp chuồng trại chăn nuôi",
        description: "Cải tạo, mở rộng khu chuồng trại phục vụ mô hình VAC.",
        purpose: "facility-upgrade",
        status: "cancelled",
        seasonId: "S001",
        seasonName: "Chính vụ Đồng bằng sông Cửu Long",
        startDate: "2024-11-01",
        endDate: "2024-12-01",
        crop: "Cây ăn trái",
        variety: "Đa dạng",
      },
    ],
  },
  {
    id: "wf-005",
    name: "Quy trình Khu Công nghệ cao - Long Thành",
    description:
      "Sơ đồ quy trình canh tác công nghệ cao, sản xuất giống cây trồng tại KCN Long Thành.",
    regionId: 5,
    createdAt: "2024-01-01",
    plans: [
      {
        name: "Kế hoạch sản xuất giống Sầu riêng cấy mô",
        description: "Sản xuất cây giống sầu riêng cấy mô trong nhà màng.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        crop: "Sầu riêng",
        variety: "Musang King",
      },
      {
        name: "Kế hoạch canh tác nhà kính công nghệ cao",
        description: "Canh tác rau, cây giống trong hệ thống nhà kính điều khiển tự động.",
        purpose: "cultivation",
        status: "active",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-02-01",
        endDate: "2024-11-30",
        crop: "Rau giống",
        variety: "Thủy canh",
      },
      {
        name: "Kế hoạch nâng cấp hệ thống điều khiển khí hậu nhà kính",
        description: "Nâng cấp cảm biến và hệ thống điều khiển nhiệt độ, độ ẩm nhà kính.",
        purpose: "facility-upgrade",
        status: "draft",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-03-01",
        endDate: "2024-04-30",
        crop: "Rau giống",
        variety: "Thủy canh",
      },
      {
        name: "Kế hoạch điều trị nấm mốc trong nhà màng",
        description: "Phác đồ xử lý nấm mốc phát sinh do độ ẩm cao trong nhà màng.",
        purpose: "treatment",
        status: "completed",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-05-01",
        endDate: "2024-05-10",
        crop: "Rau giống",
        variety: "Thủy canh",
      },
      {
        name: "Kế hoạch cải tạo giá thể trồng",
        description: "Thay mới và cải tạo giá thể trồng cho khu nhà kính.",
        purpose: "amendment",
        status: "active",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-06-01",
        endDate: "2024-06-20",
        crop: "Rau giống",
        variety: "Thủy canh",
      },
      {
        name: "Kế hoạch thu hoạch & xuất cây giống",
        description: "Thu hoạch, đóng gói và xuất cây giống cho khách hàng đối tác.",
        purpose: "harvest",
        status: "draft",
        seasonId: "S003",
        seasonName: "Chính vụ Đông Nam Bộ",
        startDate: "2024-07-01",
        endDate: "2024-07-31",
        crop: "Sầu riêng",
        variety: "Musang King",
      },
    ],
  },
];

const LEVEL_HEIGHT = 320;
const SIBLING_GAP = 480;

// Outline shape for the tree — index = position in workflowSeed.plans,
// value = index of its parent (null = root). Produces 1, 1.1, 1.2, 1.1.1,
// 1.1.2, 1.2.1 style outline codes instead of flat siblings 1, 2, 3, 4...
const PARENT_INDEX_BY_COUNT: Record<number, Array<number | null>> = {
  5: [null, 0, 1, 0, 3],
  6: [null, 0, 1, 1, 0, 4],
};

// Centers each parent above the midpoint of its children (classic tree
// layout) so the seeded canvas doesn't need manual position tweaking.
function layoutTree(parentIndices: Array<number | null>) {
  const childrenByParent: number[][] = parentIndices.map(() => []);
  let rootIndex = 0;
  parentIndices.forEach((parent, index) => {
    if (parent === null) rootIndex = index;
    else childrenByParent[parent].push(index);
  });

  const positions: { x: number; y: number }[] = parentIndices.map(() => ({
    x: 0,
    y: 0,
  }));

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
    positions[index] = { x: (firstChildX + lastChildX) / 2, y: depth * LEVEL_HEIGHT };
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
    if (!parentIndices) {
      throw new Error(
        `planWorkflowSeed: no tree layout defined for ${workflowSeed.plans.length} plans (workflow ${workflowSeed.id})`,
      );
    }

    const positions = layoutTree(parentIndices);
    const nodeIds = workflowSeed.plans.map(
      (_, planIndex) => `${workflowSeed.id}-plan-${planId + planIndex}`,
    );

    const nodes: DraftNode[] = [];
    const edges: Edge[] = [];

    workflowSeed.plans.forEach((planSeed, planIndex) => {
      const id = planId;
      planId += 1;

      plans.push({
        id,
        code: `PLN-${workflowSeed.id.toUpperCase()}-${String(planIndex + 1).padStart(2, "0")}`,
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

      const parentIndex = parentIndices[planIndex];
      const nodeId = nodeIds[planIndex];

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

export const initialPlans: Plan[] = seedData.plans;
export const initialWorkflows: Workflow[] = seedData.workflows;
