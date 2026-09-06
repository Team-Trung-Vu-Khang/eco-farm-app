import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { GeographicalSelection } from "../pages/plan/types";

export interface MaterialAllocation {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  type: "fertilizer" | "pesticide" | "other" | "tool";
  stageId: string;
  taskId: number;
  materialCategory: string;
  materialType: string;
  materialName: string;
}

export interface Task {
  id: number;
  code: string;
  name: string;
  plan: string;
  /** Id of the plan this task belongs to. Optional for incurred tasks. */
  planId?: string;
  mainTaskId?: string;
  mainTaskIds?: string[];
  selectedPlotIds?: string[];
  stage: string;
  assignedTo: string[];
  assignedToIds?: string[];
  assignedType: "individual" | "team";
  personnel?: Array<{
    id: number;
    fullName?: string;
    role: "MANAGER" | "QUALITY_INSPECTOR" | "EXECUTOR";
  }>;
  supervisors?: string[];
  qualityInspectors?: string[];
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "overdue";
  description: string;
  createdAt: string;
  materials?: MaterialAllocation[];
  tasks?: any[];
  geographicalSelections?: GeographicalSelection[];
  // Explicit-dates recurrence, as returned by the API (recurrence.repeatDates)
  // — distinct from the weekly repeatDays/repeatWeeks model used by seeded
  // mock subtasks.
  isRepeating?: boolean;
  repeatDates?: string[];
}

interface TaskStore {
  tasks: Task[];
  getTaskById: (id: number) => Task | undefined;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getStatistics: () => {
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    total: number;
  };
}

type SeedTaskInput = {
  id: number;
  planId?: number;
  plan: string;
  stage: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: Task["priority"];
  status: Task["status"];
  assignedTo: string[];
  assignedType?: Task["assignedType"];
  supervisors?: string[];
  qualityInspectors?: string[];
  regionId: string;
  subTasks: {
    name: string;
    description: string;
    labor: string;
    duration: string;
    isRepeating?: boolean;
    repeatDays?: number[];
    repeatWeeks?: number;
  }[];
  materials?: Array<
    Omit<
      MaterialAllocation,
      "id" | "taskId" | "stageId" | "name" | "materialName"
    > & {
      name: string;
    }
  >;
};

const regionScope = (taskId: number, regionId: string): GeographicalSelection[] => [
  {
    id: `task-${taskId}-region-${regionId}`,
    type: "region",
    regionId,
  },
];

const buildTask = ({
  id,
  planId,
  plan,
  stage,
  name,
  description,
  startDate,
  endDate,
  priority,
  status,
  assignedTo,
  assignedType = "team",
  supervisors = [],
  qualityInspectors = [],
  regionId,
  subTasks,
  materials = [],
}: SeedTaskInput): Task => {
  const scope = regionScope(id, regionId);
  const taskIds = subTasks.map((_, index) => id * 100 + index + 1);

  return {
    id,
    code: `CV-2026-${String(id).padStart(3, "0")}`,
    name,
    plan,
    planId: planId ? String(planId) : undefined,
    mainTaskId: taskIds[0] ? String(taskIds[0]) : undefined,
    mainTaskIds: taskIds.map(String),
    selectedPlotIds: [],
    stage,
    assignedTo,
    assignedType,
    supervisors,
    qualityInspectors,
    startDate,
    endDate,
    priority,
    status,
    description,
    createdAt: startDate,
    materials: materials.map((material, index) => ({
      id: id * 1000 + index + 1,
      taskId: taskIds[0] || id,
      stageId: stage,
      name: material.name,
      materialName: material.name,
      materialCategory: material.materialCategory,
      materialType: material.materialType,
      quantity: material.quantity,
      unit: material.unit,
      type: material.type,
    })),
    tasks: subTasks.map((task, index) => ({
      id: taskIds[index],
      stageId: stage,
      name: task.name,
      description: task.description,
      labor: task.labor,
      duration: task.duration,
      startDate,
      endDate,
      isRepeating: task.isRepeating || false,
      repeatDays: task.repeatDays,
      repeatWeeks: task.repeatWeeks,
      geographicalSelections: scope,
    })),
    geographicalSelections: scope,
  };
};

const initialData: Task[] = [
  buildTask({
    id: 101,
    planId: 1,
    plan: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6",
    stage: "Giai đoạn 1: Xiết nước và tạo mầm hoa",
    name: "Xiết nước, phủ bạt và kích mầm hoa Ri6",
    description:
      "Điều tiết nước, phủ bạt gốc và phun dinh dưỡng lân-kali cao để kích thích mầm hoa nghịch vụ.",
    startDate: "2026-01-05",
    endDate: "2026-01-18",
    priority: "high",
    status: "in-progress",
    assignedTo: ["Đội Kỹ thuật Nông nghiệp 1"],
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Lê Thị Hoa"],
    regionId: "1",
    subTasks: [
      {
        name: "Phủ bạt và kiểm soát ẩm độ gốc",
        description: "Phủ bạt quanh tán, kiểm tra rãnh thoát nước và ghi nhận độ ẩm hằng ngày.",
        labor: "4 người",
        duration: "5 ngày",
      },
      {
        name: "Phun MKP tạo mầm",
        description: "Phun MKP 0-52-34 vào chiều mát, tránh mưa trong 6 giờ sau phun.",
        labor: "3 người",
        duration: "2 ngày",
        isRepeating: true,
        repeatDays: [2, 5],
        repeatWeeks: 2,
      },
    ],
    materials: [
      {
        name: "MKP 0-52-34",
        quantity: "25",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Phân bón lá",
        materialType: "Phân vô cơ",
      },
      {
        name: "Bạt phủ gốc PE",
        quantity: "120",
        unit: "m2",
        type: "tool",
        materialCategory: "Vật tư canh tác",
        materialType: "Bạt phủ",
      },
    ],
  }),
  buildTask({
    id: 102,
    planId: 2,
    plan: "Kế hoạch chăm sóc giai đoạn nuôi trái",
    stage: "Giai đoạn 2: Nuôi trái non",
    name: "Tỉa trái non và cân đối dinh dưỡng nuôi trái",
    description:
      "Tỉa bỏ trái méo, trái sâu bệnh, bổ sung kali-canxi-bo để hạn chế sượng và tăng chất lượng cơm.",
    startDate: "2026-02-02",
    endDate: "2026-02-16",
    priority: "medium",
    status: "pending",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    supervisors: ["Nguyễn Tấn Phong"],
    qualityInspectors: ["Trần Thị Lan"],
    regionId: "1",
    subTasks: [
      {
        name: "Tỉa trái đợt 1",
        description: "Giữ lại trái đúng vị trí cành, loại bỏ trái dị dạng và trái bị côn trùng chích hút.",
        labor: "5 người",
        duration: "4 ngày",
      },
      {
        name: "Bón kali và canxi-bo",
        description: "Bón theo tán kết hợp tưới đủ ẩm sau bón.",
        labor: "3 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Kali Sulphate",
        quantity: "80",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Kali",
      },
      {
        name: "Canxi Bo",
        quantity: "18",
        unit: "lít",
        type: "fertilizer",
        materialCategory: "Phân bón lá",
        materialType: "Vi lượng",
      },
    ],
  }),
  buildTask({
    id: 103,
    planId: 3,
    plan: "Kế hoạch phục hồi sau thu hoạch",
    stage: "Giai đoạn 3: Phục hồi rễ và tán",
    name: "Cắt tỉa cành và phục hồi bộ rễ sau thu hoạch",
    description:
      "Vệ sinh vườn, cắt cành sâu bệnh, bón hữu cơ và tưới vi sinh để cây hồi phục trước vụ mới.",
    startDate: "2026-03-01",
    endDate: "2026-03-12",
    priority: "medium",
    status: "completed",
    assignedTo: ["Đội Nông Hóa"],
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Chuyên gia Thổ nhưỡng"],
    regionId: "1",
    subTasks: [
      {
        name: "Cắt tỉa và thu gom tàn dư",
        description: "Cắt cành khô, cành sâu bệnh và gom khỏi vườn để tiêu hủy.",
        labor: "6 người",
        duration: "4 ngày",
      },
      {
        name: "Tưới vi sinh phục hồi rễ",
        description: "Tưới Bacillus quanh vùng rễ hút sau khi bón hữu cơ.",
        labor: "3 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Phân hữu cơ hoai mục",
        quantity: "160",
        unit: "bao",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Hữu cơ",
      },
      {
        name: "Bacillus tổng hợp",
        quantity: "12",
        unit: "lít",
        type: "fertilizer",
        materialCategory: "Chế phẩm sinh học",
        materialType: "Vi sinh",
      },
    ],
  }),
  buildTask({
    id: 104,
    planId: 4,
    plan: "Kế hoạch điều trị nấm hồng",
    stage: "Giai đoạn 4: Điều trị nấm hồng",
    name: "Cạo vết bệnh và phun thuốc điều trị nấm hồng",
    description:
      "Khoanh vùng cành nhiễm, vệ sinh vết bệnh và phun thuốc gốc đồng kết hợp hoạt chất đặc trị.",
    startDate: "2026-03-18",
    endDate: "2026-03-24",
    priority: "high",
    status: "overdue",
    assignedTo: ["Trần Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Trần Thị Lan"],
    regionId: "1",
    subTasks: [
      {
        name: "Cạo vết bệnh và quét thuốc",
        description: "Cạo lớp nấm hồng trên cành cấp 1, quét thuốc vào vùng tổn thương.",
        labor: "2 người",
        duration: "2 ngày",
      },
      {
        name: "Phun phòng lây lan",
        description: "Phun đều tán cây xung quanh điểm bệnh, ưu tiên sáng sớm.",
        labor: "3 người",
        duration: "1 ngày",
      },
    ],
    materials: [
      {
        name: "Copper Hydroxide",
        quantity: "8",
        unit: "kg",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Gốc đồng",
      },
    ],
  }),
  buildTask({
    id: 105,
    planId: 5,
    plan: "Kế hoạch thu hoạch đợt 1",
    stage: "Giai đoạn 5: Thu hoạch và phân loại",
    name: "Thu hoạch, phân loại và đóng thùng đợt 1",
    description:
      "Kiểm tra độ chín, cắt trái đúng kỹ thuật, phân loại theo trọng lượng và mã lô.",
    startDate: "2026-04-02",
    endDate: "2026-04-08",
    priority: "high",
    status: "pending",
    assignedTo: ["Đội Thu hoạch Bình Phước"],
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia kiểm định QC"],
    regionId: "1",
    subTasks: [
      {
        name: "Đánh giá độ chín và cắt trái",
        description: "Gõ trái, kiểm tra gai, cuống và cắt bằng kéo chuyên dụng.",
        labor: "8 người",
        duration: "3 ngày",
      },
      {
        name: "Phân loại và dán tem truy xuất",
        description: "Phân hạng A/B/C, dán tem theo mã lô và cập nhật sản lượng.",
        labor: "6 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Kéo cắt cuống",
        quantity: "20",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ thu hoạch",
        materialType: "Kéo chuyên dụng",
      },
      {
        name: "Tem truy xuất QR",
        quantity: "3000",
        unit: "tem",
        type: "other",
        materialCategory: "Bao bì",
        materialType: "Tem nhãn",
      },
    ],
  }),
  buildTask({
    id: 106,
    planId: 6,
    plan: "Kế hoạch nâng cấp hệ thống tưới nhỏ giọt",
    stage: "Giai đoạn 6: Lắp đặt tuyến tưới bổ sung",
    name: "Lắp tuyến ống nhỏ giọt khu mở rộng",
    description:
      "Khảo sát áp lực, kéo ống nhánh và test đầu nhỏ giọt cho khu canh tác mở rộng.",
    startDate: "2026-04-15",
    endDate: "2026-04-25",
    priority: "medium",
    status: "in-progress",
    assignedTo: ["Đội Cơ điện nông trại"],
    supervisors: ["Hoàng Văn Em"],
    qualityInspectors: ["Nguyễn Văn Hùng"],
    regionId: "1",
    subTasks: [
      {
        name: "Lắp ống PE và đầu nhỏ giọt",
        description: "Kéo ống dọc hàng cây, bấm đầu nhỏ giọt theo khoảng cách thiết kế.",
        labor: "5 người",
        duration: "5 ngày",
      },
      {
        name: "Test áp lực và lưu lượng",
        description: "Mở từng zone, đo áp và xử lý điểm rò rỉ trước bàn giao.",
        labor: "3 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Ống PE 16mm",
        quantity: "900",
        unit: "m",
        type: "tool",
        materialCategory: "Thiết bị tưới",
        materialType: "Ống PE",
      },
      {
        name: "Đầu nhỏ giọt bù áp",
        quantity: "650",
        unit: "cái",
        type: "tool",
        materialCategory: "Thiết bị tưới",
        materialType: "Đầu tưới",
      },
    ],
  }),
  buildTask({
    id: 107,
    planId: 7,
    plan: "Kế hoạch canh tác hữu cơ chính vụ",
    stage: "Giai đoạn 1: Chăm sóc hữu cơ đầu vụ",
    name: "Bón hữu cơ và phủ gốc giữ ẩm vườn Đồng Nai",
    description:
      "Bón phân hữu cơ, phủ cỏ khô quanh gốc và kiểm tra cỏ dại theo tiêu chuẩn canh tác hữu cơ.",
    startDate: "2026-05-02",
    endDate: "2026-05-10",
    priority: "medium",
    status: "pending",
    assignedTo: ["Đội Hữu cơ Đồng Nai"],
    supervisors: ["Lê Văn Cường"],
    qualityInspectors: ["Phạm Thị Dung"],
    regionId: "2",
    subTasks: [
      {
        name: "Bón compost theo tán",
        description: "Rải compost quanh mép tán, xới nhẹ và phủ lại bằng cỏ khô.",
        labor: "5 người",
        duration: "4 ngày",
      },
    ],
    materials: [
      {
        name: "Compost hữu cơ",
        quantity: "180",
        unit: "bao",
        type: "fertilizer",
        materialCategory: "Phân hữu cơ",
        materialType: "Compost",
      },
    ],
  }),
  buildTask({
    id: 108,
    planId: 8,
    plan: "Kế hoạch bón phân vi sinh định kỳ",
    stage: "Giai đoạn 2: Bổ sung vi sinh định kỳ",
    name: "Tưới vi sinh và bổ sung nấm đối kháng",
    description:
      "Tưới Trichoderma và vi sinh phân giải hữu cơ để cân bằng hệ vi sinh đất.",
    startDate: "2026-05-15",
    endDate: "2026-05-18",
    priority: "low",
    status: "completed",
    assignedTo: ["Đội Hữu cơ Đồng Nai"],
    supervisors: ["Lê Văn Cường"],
    qualityInspectors: ["Phạm Thị Dung"],
    regionId: "2",
    subTasks: [
      {
        name: "Pha và tưới vi sinh",
        description: "Pha đúng nồng độ, tưới đều quanh vùng rễ hút.",
        labor: "3 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Trichoderma",
        quantity: "20",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Chế phẩm sinh học",
        materialType: "Nấm đối kháng",
      },
    ],
  }),
  buildTask({
    id: 109,
    planId: 9,
    plan: "Kế hoạch cải tạo đất bạc màu",
    stage: "Giai đoạn 3: Cải tạo hữu cơ đất bạc màu",
    name: "Bổ sung hữu cơ và khoáng cải tạo đất bạc màu",
    description:
      "Bổ sung phân chuồng hoai, humic và vôi Dolomite để cải thiện pH và cấu trúc đất.",
    startDate: "2026-06-01",
    endDate: "2026-06-12",
    priority: "high",
    status: "in-progress",
    assignedTo: ["Đội Nông Hóa"],
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Chuyên gia Thổ nhưỡng"],
    regionId: "2",
    subTasks: [
      {
        name: "Rải Dolomite và humic",
        description: "Rải đều theo mép tán, không trộn trực tiếp với phân vi sinh trong cùng ngày.",
        labor: "4 người",
        duration: "3 ngày",
      },
      {
        name: "Bổ sung phân chuồng hoai",
        description: "Bón phân chuồng hoai và phủ gốc để hạn chế rửa trôi.",
        labor: "6 người",
        duration: "4 ngày",
      },
    ],
    materials: [
      {
        name: "Dolomite",
        quantity: "60",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Khoáng cải tạo",
        materialType: "Vôi Dolomite",
      },
      {
        name: "Humic acid",
        quantity: "15",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Cải tạo đất",
        materialType: "Humic",
      },
    ],
  }),
  buildTask({
    id: 110,
    planId: 10,
    plan: "Kế hoạch điều trị rệp sáp",
    stage: "Giai đoạn 4: Xử lý rệp sáp",
    name: "Vệ sinh ổ rệp và phun dầu khoáng sinh học",
    description:
      "Khoanh vùng ổ rệp sáp, vệ sinh kiến cộng sinh và phun dầu khoáng theo tiêu chuẩn hữu cơ.",
    startDate: "2026-06-16",
    endDate: "2026-06-20",
    priority: "high",
    status: "pending",
    assignedTo: ["Nguyễn Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Phạm Thị Dung"],
    regionId: "2",
    subTasks: [
      {
        name: "Vệ sinh ổ rệp và bẫy kiến",
        description: "Cắt bỏ trái/cành nhiễm nặng, đặt bẫy keo ngăn kiến.",
        labor: "2 người",
        duration: "2 ngày",
      },
      {
        name: "Phun dầu khoáng",
        description: "Phun ướt đều vị trí có rệp, lặp lại sau 5 ngày nếu mật số còn cao.",
        labor: "3 người",
        duration: "1 ngày",
        isRepeating: true,
        repeatDays: [1],
        repeatWeeks: 2,
      },
    ],
    materials: [
      {
        name: "Dầu khoáng SK Enspray",
        quantity: "10",
        unit: "lít",
        type: "pesticide",
        materialCategory: "Thuốc sinh học",
        materialType: "Dầu khoáng",
      },
    ],
  }),
  buildTask({
    id: 111,
    planId: 11,
    plan: "Kế hoạch thu hoạch & sơ chế",
    stage: "Giai đoạn 5: Thu hoạch hữu cơ và sơ chế",
    name: "Thu hoạch hữu cơ, rửa và phân loại tại trạm sơ chế",
    description:
      "Thu hái đúng độ chín, vận chuyển về trạm sơ chế, rửa sạch và đóng gói theo tiêu chuẩn hữu cơ.",
    startDate: "2026-07-03",
    endDate: "2026-07-09",
    priority: "high",
    status: "pending",
    assignedTo: ["Đội Sơ chế Đồng Nai"],
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia kiểm định QC"],
    regionId: "2",
    subTasks: [
      {
        name: "Thu hái và vận chuyển về trạm",
        description: "Sử dụng thùng nhựa sạch, tránh dập cuống trong quá trình vận chuyển.",
        labor: "7 người",
        duration: "3 ngày",
      },
      {
        name: "Rửa, phân loại và đóng gói",
        description: "Rửa bằng nước sạch, hong ráo và đóng gói theo lô truy xuất.",
        labor: "6 người",
        duration: "2 ngày",
      },
    ],
    materials: [
      {
        name: "Thùng nhựa thu hoạch",
        quantity: "80",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ thu hoạch",
        materialType: "Thùng nhựa",
      },
    ],
  }),
  buildTask({
    id: 112,
    planId: 12,
    plan: "Kế hoạch canh tác chính vụ Tây Nguyên",
    stage: "Giai đoạn 1: Chăm sóc cà phê đầu mùa mưa",
    name: "Làm cỏ, bón phân đầu mùa cho cà phê Robusta",
    description:
      "Làm cỏ băng, bón NPK đầu mùa mưa và kiểm tra cây che bóng trong vườn cà phê.",
    startDate: "2026-07-12",
    endDate: "2026-07-22",
    priority: "medium",
    status: "in-progress",
    assignedTo: ["Đội Cà phê Buôn Ma Thuột"],
    supervisors: ["Hoàng Văn Em"],
    qualityInspectors: ["Lê Văn Cường"],
    regionId: "3",
    subTasks: [
      {
        name: "Làm cỏ băng và gom tàn dư",
        description: "Làm cỏ theo băng, giữ thảm phủ tự nhiên giữa hàng.",
        labor: "6 người",
        duration: "4 ngày",
      },
      {
        name: "Bón NPK đầu mùa",
        description: "Bón NPK theo tán, lấp nhẹ và tận dụng mưa sau bón.",
        labor: "5 người",
        duration: "3 ngày",
      },
    ],
    materials: [
      {
        name: "NPK 16-16-8",
        quantity: "220",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "NPK",
      },
    ],
  }),
  buildTask({
    id: 113,
    planId: 13,
    plan: "Kế hoạch tưới nước mùa khô",
    stage: "Giai đoạn 2: Tưới giữ ẩm mùa khô",
    name: "Tưới luân phiên và đo ẩm đất cà phê",
    description:
      "Tưới luân phiên từng khu, đo ẩm đất trước và sau tưới để tối ưu lượng nước.",
    startDate: "2026-08-01",
    endDate: "2026-08-08",
    priority: "high",
    status: "completed",
    assignedTo: ["Đội Tưới Tây Nguyên"],
    supervisors: ["Hoàng Văn Em"],
    qualityInspectors: ["Nguyễn Văn Hùng"],
    regionId: "3",
    subTasks: [
      {
        name: "Tưới khu A/B theo lịch",
        description: "Tưới mỗi block đủ thời lượng, ghi nhận áp lực đường ống.",
        labor: "4 người",
        duration: "4 ngày",
        isRepeating: true,
        repeatDays: [2, 4, 6],
        repeatWeeks: 1,
      },
    ],
    materials: [
      {
        name: "Bộ test độ ẩm đất",
        quantity: "4",
        unit: "bộ",
        type: "tool",
        materialCategory: "Thiết bị đo",
        materialType: "Độ ẩm đất",
      },
    ],
  }),
  buildTask({
    id: 114,
    planId: 14,
    plan: "Kế hoạch cải tạo đất dốc",
    stage: "Giai đoạn 3: Chống xói mòn đất dốc",
    name: "Tạo băng giữ nước và phủ xanh đất dốc",
    description:
      "Tạo băng giữ nước theo đường đồng mức, gieo cỏ phủ đất để giảm xói mòn.",
    startDate: "2026-08-12",
    endDate: "2026-08-26",
    priority: "medium",
    status: "pending",
    assignedTo: ["Đội Cơ giới Tây Nguyên"],
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Hoàng Văn Em"],
    regionId: "3",
    subTasks: [
      {
        name: "Tạo băng giữ nước",
        description: "Đào băng nông theo đường đồng mức, ưu tiên vị trí dốc lớn.",
        labor: "5 người",
        duration: "6 ngày",
      },
      {
        name: "Gieo cỏ phủ đất",
        description: "Gieo cỏ Vetiver ở mép băng và khu vực xói mòn.",
        labor: "4 người",
        duration: "3 ngày",
      },
    ],
    materials: [
      {
        name: "Hạt cỏ Vetiver",
        quantity: "18",
        unit: "kg",
        type: "other",
        materialCategory: "Giống phủ xanh",
        materialType: "Cỏ chống xói mòn",
      },
    ],
  }),
  buildTask({
    id: 115,
    planId: 15,
    plan: "Kế hoạch điều trị bệnh gỉ sắt",
    stage: "Giai đoạn 4: Phòng trị gỉ sắt cà phê",
    name: "Tỉa cành thông thoáng và phun phòng gỉ sắt",
    description:
      "Tỉa cành vô hiệu, thu gom lá bệnh và phun thuốc phòng trị gỉ sắt trong điều kiện ẩm cao.",
    startDate: "2026-09-02",
    endDate: "2026-09-07",
    priority: "high",
    status: "overdue",
    assignedTo: ["Đội Bảo vệ thực vật"],
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Lê Thị Hoa"],
    regionId: "3",
    subTasks: [
      {
        name: "Tỉa cành và gom lá bệnh",
        description: "Tỉa cành trong tán, gom lá bệnh khỏi vườn.",
        labor: "5 người",
        duration: "3 ngày",
      },
      {
        name: "Phun thuốc phòng trị",
        description: "Phun đều hai mặt lá, ưu tiên block có tỷ lệ bệnh cao.",
        labor: "4 người",
        duration: "1 ngày",
      },
    ],
    materials: [
      {
        name: "Hexaconazole",
        quantity: "6",
        unit: "lít",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Triazole",
      },
    ],
  }),
  buildTask({
    id: 116,
    planId: 16,
    plan: "Kế hoạch thu hoạch chính vụ",
    stage: "Giai đoạn 5: Thu hái cà phê chín",
    name: "Thu hái chọn lọc và phơi sơ bộ cà phê Robusta",
    description:
      "Thu hái quả chín đạt tỷ lệ yêu cầu, loại bỏ quả xanh và phơi sơ bộ tại sân.",
    startDate: "2026-09-18",
    endDate: "2026-09-28",
    priority: "high",
    status: "pending",
    assignedTo: ["Đội Thu hoạch Tây Nguyên"],
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia kiểm định QC"],
    regionId: "3",
    subTasks: [
      {
        name: "Thu hái chọn lọc",
        description: "Chỉ hái quả chín, không tuốt cành non.",
        labor: "12 người",
        duration: "7 ngày",
      },
      {
        name: "Phơi sơ bộ và cân lô",
        description: "Phơi lớp mỏng, cân sản lượng từng lô cuối ngày.",
        labor: "5 người",
        duration: "3 ngày",
      },
    ],
    materials: [
      {
        name: "Bạt phơi cà phê",
        quantity: "25",
        unit: "tấm",
        type: "tool",
        materialCategory: "Dụng cụ sau thu hoạch",
        materialType: "Bạt phơi",
      },
    ],
  }),
  buildTask({
    id: 117,
    planId: 17,
    plan: "Kế hoạch canh tác đa cây trồng",
    stage: "Giai đoạn 1: Chăm sóc vườn VAC tổng hợp",
    name: "Cắt tỉa tán và kiểm tra dinh dưỡng vườn VAC",
    description:
      "Cắt tỉa tán cây ăn trái, bổ sung hữu cơ và kiểm tra sinh trưởng từng nhóm cây.",
    startDate: "2026-10-03",
    endDate: "2026-10-11",
    priority: "medium",
    status: "in-progress",
    assignedTo: ["Đội VAC Tư Sang"],
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Lê Văn Cường"],
    regionId: "4",
    subTasks: [
      {
        name: "Cắt tỉa tán cây ăn trái",
        description: "Cắt cành giao tán, cành sâu bệnh và tạo thông thoáng.",
        labor: "5 người",
        duration: "4 ngày",
      },
      {
        name: "Bổ sung phân hữu cơ đa cây",
        description: "Bón hữu cơ theo từng nhóm cây, tránh bón sát gốc.",
        labor: "4 người",
        duration: "3 ngày",
      },
    ],
    materials: [
      {
        name: "Phân hữu cơ viên",
        quantity: "120",
        unit: "bao",
        type: "fertilizer",
        materialCategory: "Phân hữu cơ",
        materialType: "Viên nén",
      },
    ],
  }),
  buildTask({
    id: 118,
    planId: 18,
    plan: "Kế hoạch nâng cấp hệ thống tưới nhỏ giọt",
    stage: "Giai đoạn 2: Bảo trì tưới VAC",
    name: "Thay đầu tưới nghẹt và cân chỉnh áp lực khu VAC",
    description:
      "Súc rửa đường ống, thay đầu tưới nghẹt và cân chỉnh áp lực giữa các khu cây trồng.",
    startDate: "2026-10-16",
    endDate: "2026-10-20",
    priority: "medium",
    status: "completed",
    assignedTo: ["Đội Cơ điện nông trại"],
    supervisors: ["Hoàng Văn Em"],
    qualityInspectors: ["Nguyễn Văn Hùng"],
    regionId: "4",
    subTasks: [
      {
        name: "Súc rửa đường ống",
        description: "Mở cuối tuyến, súc rửa cặn và kiểm tra lọc trung tâm.",
        labor: "3 người",
        duration: "2 ngày",
      },
      {
        name: "Thay đầu tưới nghẹt",
        description: "Thay đầu tưới giảm lưu lượng dưới ngưỡng cho phép.",
        labor: "3 người",
        duration: "1 ngày",
      },
    ],
    materials: [
      {
        name: "Đầu tưới nhỏ giọt 8L/h",
        quantity: "240",
        unit: "cái",
        type: "tool",
        materialCategory: "Thiết bị tưới",
        materialType: "Đầu tưới",
      },
    ],
  }),
  buildTask({
    id: 119,
    planId: 19,
    plan: "Kế hoạch cải tạo bờ ao, hệ thống thoát nước",
    stage: "Giai đoạn 3: Gia cố bờ ao và thoát nước",
    name: "Gia cố bờ ao và khơi thông mương thoát nước",
    description:
      "Đắp bờ ao bị sạt, khơi thông mương và gia cố điểm thoát nước cuối vườn.",
    startDate: "2026-11-01",
    endDate: "2026-11-12",
    priority: "high",
    status: "pending",
    assignedTo: ["Đội Cơ giới VAC"],
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Hoàng Văn Em"],
    regionId: "4",
    subTasks: [
      {
        name: "Đắp và nén bờ ao",
        description: "Bổ sung đất, nén chặt và phủ cỏ giữ bờ.",
        labor: "6 người",
        duration: "5 ngày",
      },
      {
        name: "Khơi thông mương thoát nước",
        description: "Nạo vét mương chính và kiểm tra độ dốc thoát.",
        labor: "5 người",
        duration: "3 ngày",
      },
    ],
    materials: [
      {
        name: "Bao địa kỹ thuật",
        quantity: "120",
        unit: "bao",
        type: "tool",
        materialCategory: "Vật tư công trình",
        materialType: "Gia cố bờ",
      },
    ],
  }),
  buildTask({
    id: 120,
    planId: 20,
    plan: "Kế hoạch điều trị sâu đục thân",
    stage: "Giai đoạn 4: Xử lý sâu đục thân",
    name: "Khoanh vùng, vệ sinh và xử lý sâu đục thân",
    description:
      "Dò lỗ đục, vệ sinh thân cây, đặt thuốc xử lý và theo dõi tái nhiễm sau 7 ngày.",
    startDate: "2026-11-18",
    endDate: "2026-11-24",
    priority: "high",
    status: "in-progress",
    assignedTo: ["Đội Bảo vệ thực vật"],
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Trần Thị Lan"],
    regionId: "4",
    subTasks: [
      {
        name: "Dò lỗ đục và vệ sinh thân",
        description: "Dùng dây thép thông lỗ đục, làm sạch mùn cưa và phân sâu.",
        labor: "3 người",
        duration: "2 ngày",
      },
      {
        name: "Đặt thuốc và bịt lỗ",
        description: "Đặt thuốc đúng liều, bịt lỗ bằng đất sét ẩm và đánh dấu cây theo dõi.",
        labor: "3 người",
        duration: "1 ngày",
      },
    ],
    materials: [
      {
        name: "Thuốc xử lý sâu đục thân sinh học",
        quantity: "5",
        unit: "kg",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Sinh học",
      },
    ],
  }),
];

const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: initialData,

        getTaskById: (id) => {
          return get().tasks.find((task) => task.id === id);
        },

        addTask: (taskData) => {
          const newId =
            get().tasks.length > 0
              ? Math.max(...get().tasks.map((task) => task.id)) + 1
              : 1;
          const newTask: Task = {
            ...taskData,
            id: newId,
            status: "pending",
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            tasks: [...state.tasks, newTask],
          }));
        },

        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task,
            ),
          }));
        },

        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        },

        getStatistics: () => {
          const tasks = get().tasks;
          return {
            pending: tasks.filter((task) => task.status === "pending").length,
            inProgress: tasks.filter((task) => task.status === "in-progress")
              .length,
            completed: tasks.filter((task) => task.status === "completed")
              .length,
            overdue: tasks.filter((task) => task.status === "overdue").length,
            total: tasks.length,
          };
        },
      }),
      {
        name: "task-storage-v2",
      },
    ),
  ),
);

export default useTaskStore;
