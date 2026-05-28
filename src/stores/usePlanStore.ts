import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interface cho vật tư chi tiết
export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  cycle?: string;
  packaging?: string;
}

export interface TaskAllocation {
  id: number;
  stageId: string;
  name: string;
  description: string;
  labor: string;
  duration: string;
  geographicalSelections?: import("../pages/plan/types").GeographicalSelection[];
  isRepeating?: boolean;
  repeatDays?: number[];
  repeatWeeks?: number;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;

  // Location & Crop
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose: "cultivation" | "treatment" | "amendment" | "harvest" | "incurred";

  // Additional display fields
  zone?: string;
  cultivationRegion?: string;
  plot?: string;
  area?: string;
  expectedYield?: string;

  // Process
  growthCycleId: string;
  regimenId?: string;
  selectedStages: string[];

  // Resources
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];

  // Status
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
}

// const initialPlans: Plan[] = [
//   {
//     id: 1,
//     code: "KH001",
//     name: "Kế hoạch sầu riêng vụ Xuân 2025",
//     description: "Kế hoạch canh tác sầu riêng Monthon vụ Xuân 2025 tại vùng A1",
//     seasonId: "spring-2025",
//     seasonName: "Vụ Xuân 2025",
//     startDate: "2025-01-15",
//     endDate: "2025-06-30",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-1"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2"],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "cultivation",
//     growthCycleId: "GC001",
//     area: "20.0",
//     expectedYield: "45",
//     selectedStages: [
//       "Chuẩn bị đất",
//       "Gieo trồng",
//       "Chăm sóc giai đoạn 1",
//       "Bón phân lần 1",
//     ],
//     materialAllocations: [
//       {
//         id: 1,
//         stageId: "Chuẩn bị đất",
//         materialCategory: "Phân bón",
//         materialType: "Phân hữu cơ",
//         materialName: "Phân chuồng hoai mục",
//         quantity: "5000",
//         unit: "kg",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 1,
//         stageId: "Chuẩn bị đất",
//         name: "Cày ải và khử trùng đất",
//         description: "Cày sâu 25-30cm, rải vôi bột khử trùng",
//         labor: "5 người",
//         duration: "7 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-12-01",
//   },
//   {
//     id: 2,
//     code: "KH002",
//     name: "Kế hoạch khử phèn Khu B",
//     description: "Cải tạo đất bị nhiễm phèn nặng tại Khu vực B",
//     seasonId: "S2025-HE",
//     seasonName: "Vụ Hè 2025",
//     startDate: "2025-03-01",
//     endDate: "2025-04-15",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-2"],
//     selectedPlotIds: ["plot-1-3"],
//     crop: "Cải tạo đất",
//     variety: "",
//     purpose: "treatment",
//     regimenId: "reg-phen-cap-toc",
//     growthCycleId: "",
//     area: "15.5",
//     expectedYield: "0",
//     selectedStages: ["Xả phèn lần 1", "Bón vôi khử chua", "Kiểm tra pH đất"],
//     materialAllocations: [
//       {
//         id: 3,
//         stageId: "Bón vôi khử chua",
//         materialCategory: "Khác",
//         materialType: "Vôi bột",
//         materialName: "Vôi nông nghiệp",
//         quantity: "1500",
//         unit: "kg",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 2,
//         stageId: "Xả phèn lần 1",
//         name: "Bơm xả nước phèn",
//         description: "Mở cống xả nước cũ, bơm nước mới vào ngâm",
//         labor: "2 người",
//         duration: "3 ngày",
//       },
//     ],
//     status: "draft",
//     createdAt: "2024-12-10",
//   },
//   {
//     id: 3,
//     code: "KH003",
//     name: "Kế hoạch bưởi da xanh Bình Phước",
//     description: "Canh tác bưởi da xanh tiêu chuẩn VietGAP",
//     seasonId: "S001",
//     seasonName: "Vụ Xuân 2024",
//     startDate: "2025-07-01",
//     endDate: "2025-12-31",
//     selectedRegionIds: ["4"],
//     selectedZoneIds: [],
//     selectedPlotIds: [],
//     crop: "Bưởi",
//     variety: "Da xanh",
//     purpose: "cultivation",
//     growthCycleId: "GC002",
//     area: "15.0",
//     expectedYield: "12",
//     selectedStages: ["Chuẩn bị cây giống", "Đào hố trồng"],
//     materialAllocations: [],
//     taskAllocations: [],
//     status: "draft",
//     createdAt: "2024-12-15",
//   },
//   {
//     id: 4,
//     code: "PS001",
//     name: "Xử lý ngập úng bất ngờ",
//     description: "Công việc phát sinh do mưa lớn gây ngập úng cục bộ tại khu vực A1",
//     seasonId: "spring-2025",
//     seasonName: "Vụ Xuân 2025",
//     startDate: "2025-02-10",
//     endDate: "2025-02-12",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-1"],
//     selectedPlotIds: ["plot-1-1"],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "incurred",
//     growthCycleId: "",
//     area: "2.0",
//     expectedYield: "0",
//     selectedStages: ["Phát sinh"],
//     materialAllocations: [
//       {
//         id: 10,
//         stageId: "Phát sinh",
//         materialCategory: "Dụng cụ",
//         materialType: "Máy bơm",
//         materialName: "Máy bơm nước 5HP",
//         quantity: "2",
//         unit: "cái",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 10,
//         stageId: "Phát sinh",
//         name: "Bơm thoát nước khẩn cấp",
//         description: "Vận hành máy bơm liên tục để thoát nước ra kênh chính",
//         labor: "2 người",
//         duration: "24 giờ",
//       },
//       {
//         id: 11,
//         stageId: "Phát sinh",
//         name: "Kiểm tra rễ và xịt thuốc phòng thối rễ",
//         description: "Kiểm tra tình trạng đất sau ngập và phun vôi bột sát khuẩn",
//         labor: "3 người",
//         duration: "1 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2025-02-10",
//   },
//   {
//     id: 5,
//     code: "TH001",
//     name: "Kế hoạch Thu hoạch Sầu riêng 2026",
//     description: "Thu hoạch, phân loại và đóng gói sầu riêng Monthon đạt chuẩn xuất khẩu",
//     seasonId: "spring-2026",
//     seasonName: "Vụ Xuân 2026",
//     startDate: "2026-05-15",
//     endDate: "2026-06-15",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-1"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2"],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "harvest",
//     growthCycleId: "GC001",
//     area: "5.0",
//     expectedYield: "25",
//     selectedStages: ["Chuẩn bị kho", "Thu hái tại vườn", "Phân loại & Đóng gói"],
//     materialAllocations: [
//       {
//         id: 20,
//         stageId: "Chuẩn bị kho",
//         materialCategory: "Bao bì",
//         materialType: "Thùng carton",
//         materialName: "Thùng sầu riêng 15kg",
//         quantity: "1500",
//         unit: "cái",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 20,
//         stageId: "Thu hái tại vườn",
//         name: "Hái trái đạt độ chín",
//         description: "Gõ kiểm tra độ chín và hái trái xuống bằng dây kéo",
//         labor: "10 người",
//         duration: "10 ngày",
//       },
//     ],
//     status: "draft",
//     createdAt: "2025-03-01",
//   },
//   {
//     id: 6,
//     code: "DT001",
//     name: "Điều trị rầy phấn trắng đợt 1",
//     description: "Phun thuốc đặc trị và theo dõi mật độ rầy trên vườn sầu riêng",
//     seasonId: "spring-2026",
//     seasonName: "Vụ Xuân 2026",
//     startDate: "2026-03-10",
//     endDate: "2026-03-20",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: [],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "treatment",
//     growthCycleId: "GC001",
//     area: "8.5",
//     expectedYield: "0",
//     selectedStages: ["Phun thuốc đợt 1", "Kiểm tra sau phun"],
//     materialAllocations: [
//       {
//         id: 30,
//         stageId: "Phun thuốc đợt 1",
//         materialCategory: "Thuốc BVTV",
//         materialType: "Thuốc trừ rầy",
//         materialName: "Chess 50WG",
//         quantity: "20",
//         unit: "gói",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 30,
//         stageId: "Phun thuốc đợt 1",
//         name: "Phun thuốc hệ thống",
//         description: "Sử dụng drone phun thuốc toàn diện mặt dưới lá",
//         labor: "2 người",
//         duration: "2 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2026-03-05",
//   },
//   {
//     id: 7,
//     code: "KH007",
//     name: "Kế hoạch Dưa lưới nhà màng",
//     description: "Canh tác dưa lưới công nghệ cao trong nhà màng A2",
//     seasonId: "spring-2026",
//     seasonName: "Vụ Xuân 2026",
//     startDate: "2026-03-01",
//     endDate: "2026-05-30",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-2"],
//     selectedPlotIds: ["plot-1-3"],
//     crop: "Dưa lưới",
//     variety: "Taki",
//     purpose: "cultivation",
//     growthCycleId: "GC003",
//     area: "1.2",
//     expectedYield: "5",
//     selectedStages: ["Ươm cây con", "Trồng cây", "Chăm sóc & Thụ phấn"],
//     materialAllocations: [],
//     taskAllocations: [],
//     status: "active",
//     createdAt: "2026-02-15",
//   },
// ];

export const initialPlans: Plan[] = [
  // 1. KẾ HOẠCH CANH TÁC (CULTIVATION): Làm bông nghịch vụ sầu riêng Ri6
  {
    id: 1,
    code: "PLN-2024-001",
    name: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
    description:
      "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ cho sầu riêng Ri6 nhằm đón giá cao dịp cuối năm [1, 2].",
    seasonId: "S002",
    seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
    startDate: "2024-05-15", // Tháng 4-5 âm lịch [3]
    endDate: "2024-11-30",
    selectedRegionIds: ["REG-01"],
    selectedZoneIds: ["ZONE-01-A"],
    selectedPlotIds: ["PLOT-001", "PLOT-002"],
    crop: "Sầu riêng",
    variety: "Sầu riêng Ri6",
    purpose: "cultivation",
    area: "3.5",
    expectedYield: "60",
    growthCycleId: "GC003", // Quy trình Ri6 nghịch vụ
    selectedStages: [
      "Dằn lân, tạo mầm & Phủ bạt xiết nước",
      "Dỡ bạt, nhấp nước & Kéo mắt cua",
    ],
    materialAllocations: [
      {
        id: 101,
        stageId: "Dằn lân, tạo mầm & Phủ bạt xiết nước",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Phân Lân (DAP hoặc Super Lân)",
        quantity: "4",
        unit: "kg/cây",
      },
      {
        id: 102,
        stageId: "Dằn lân, tạo mầm & Phủ bạt xiết nước",
        materialCategory: "Thuốc điều hòa sinh trưởng",
        materialType: "Paclobutrazol",
        materialName: "Paclobutrazol 25SC",
        quantity: "5",
        unit: "lít",
      },
    ],
    taskAllocations: [
      {
        id: 201,
        stageId: "Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Bón lân tạo mầm và Xiết nước",
        description:
          "Bón lân gốc khi cơi đọt cuối chuyển lụa. Dọn sạch cỏ gốc và xiết cạn nước mương tạo khô hạn 10-14 ngày [1, 4].",
        labor: "3 người",
        duration: "14 ngày",
      },
      {
        id: 202,
        stageId: "Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Đậy bạt nilon và phun Paclobutrazol",
        description:
          "Phủ kín bạt nilon quanh gốc cản nước mưa. Phun Paclobutrazol 25SC 1 lần duy nhất vào dạ dưới cành [5].",
        labor: "4 người",
        duration: "2 ngày",
      },
    ],
    status: "active",
    createdAt: "2024-05-01",
  },

  // 2. KẾ HOẠCH CẢI TẠO (AMENDMENT): Phục hồi vườn sầu riêng sau thu hoạch
  {
    id: 2,
    code: "PLN-2024-002",
    name: "Kế hoạch phục hồi vườn Sầu riêng Monthong sau thu hoạch",
    description:
      "Cắt tỉa cành, rửa vườn và bón phân hữu cơ kết hợp nấm đối kháng để phục hồi bộ rễ, chuẩn bị cho cơi đọt mới [6-8].",
    seasonId: "S003",
    seasonName: "Chính vụ Đông Nam Bộ",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    selectedRegionIds: ["REG-02"],
    selectedZoneIds: ["ZONE-02-B"],
    selectedPlotIds: ["PLOT-005"],
    crop: "Sầu riêng",
    variety: "Sầu riêng Monthong (Dona)",
    purpose: "amendment",
    area: "5.0",
    expectedYield: "0", // Giai đoạn phục hồi không có sản lượng
    growthCycleId: "GC001",
    selectedStages: ["Phục hồi sau thu hoạch & Làm cơi đọt"],
    materialAllocations: [
      {
        id: 103,
        stageId: "Phục hồi sau thu hoạch & Làm cơi đọt",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ vi sinh",
        materialName: "Phân chuồng hoai mục ủ Trichoderma",
        quantity: "25",
        unit: "kg/cây",
      },
      {
        id: 104,
        stageId: "Phục hồi sau thu hoạch & Làm cơi đọt",
        materialCategory: "Chế phẩm sinh học",
        materialType: "Kích rễ",
        materialName: "Acid Plus (Humic + Fulvic + Axit Amin)",
        quantity: "15",
        unit: "lít",
      },
    ],
    taskAllocations: [
      {
        id: 203,
        stageId: "Phục hồi sau thu hoạch & Làm cơi đọt",
        name: "Cắt tỉa cành và xịt rửa vườn",
        description:
          "Cắt bỏ cành bơi, cành sâu bệnh, quét vôi hoặc xịt Booc-đô/thuốc gốc Đồng sát khuẩn diệt mầm bệnh [8].",
        labor: "5 người",
        duration: "5 ngày",
      },
      {
        id: 204,
        stageId: "Phục hồi sau thu hoạch & Làm cơi đọt",
        name: "Bón phân hữu cơ và tưới kích rễ",
        description:
          "Xới nhẹ tầng đất mặt, bón phân chuồng ủ nấm đối kháng Trichoderma và tưới Acid Plus để phục hồi rễ tơ [8, 9].",
        labor: "3 người",
        duration: "3 ngày",
      },
    ],
    status: "active",
    createdAt: "2024-07-20",
  },

  // 3. KẾ HOẠCH ĐIỀU TRỊ (TREATMENT): Quản lý nứt thân xì mủ và rầy xanh
  {
    id: 3,
    code: "PLN-2024-003",
    name: "Kế hoạch phòng trị bệnh nứt thân xì mủ mùa mưa",
    description:
      "Xử lý triệt để nấm Phytophthora palmivora gây bệnh nứt thân xì mủ và quản lý rầy xanh bảo vệ cơi đọt non [7, 10].",
    seasonId: "S004",
    seasonName: "Chính vụ Tây Nguyên",
    startDate: "2024-09-10",
    endDate: "2024-10-10",
    selectedRegionIds: ["REG-03"],
    selectedZoneIds: ["ZONE-03-C"],
    selectedPlotIds: ["PLOT-010", "PLOT-011"],
    crop: "Sầu riêng",
    variety: "Sầu riêng Musang King",
    purpose: "treatment",
    area: "2.0",
    growthCycleId: "GC005",
    selectedStages: ["Quản lý sâu bệnh và đọt non"],
    materialAllocations: [
      {
        id: 105,
        stageId: "Quản lý sâu bệnh và đọt non",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ nấm bệnh",
        materialName: "Thuốc gốc Đồng / Metalaxyl",
        quantity: "10",
        unit: "lít",
      },
      {
        id: 106,
        stageId: "Quản lý sâu bệnh và đọt non",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ sâu rầy",
        materialName: "Thuốc đặc trị rầy xanh, nhện đỏ",
        quantity: "5",
        unit: "lít",
      },
    ],
    taskAllocations: [
      {
        id: 205,
        stageId: "Quản lý sâu bệnh và đọt non",
        name: "Điều trị nứt thân xì mủ",
        description:
          "Cạo sạch vết bệnh xì mủ trên thân, quét thuốc đặc trị gốc đồng hoặc Metalaxyl để diệt nấm Phytophthora [11, 12].",
        labor: "2 người",
        duration: "7 ngày",
        isRepeating: true,
        repeatDays: [13, 14], // Lặp lại sau 3 ngày và 7 ngày
      },
      {
        id: 206,
        stageId: "Quản lý sâu bệnh và đọt non",
        name: "Phun bảo vệ cơi đọt mũi giáo",
        description:
          "Phun thuốc đặc trị rầy xanh ngay khi đọt non nhú mũi giáo để bảo vệ dàn lá [15, 16].",
        labor: "2 người",
        duration: "2 ngày",
      },
    ],
    status: "draft",
    createdAt: "2024-09-05",
  },

  // 4. KẾ HOẠCH THU HOẠCH (HARVEST): Cắt nước và thu hoạch sầu riêng
  {
    id: 4,
    code: "PLN-2024-004",
    name: "Kế hoạch cắt nước và thu hoạch sầu riêng Thái (Monthong)",
    description:
      "Thực hiện siết nước cuối vụ để ráo cơm, lên màu đẹp và tiến hành cắt trái chuẩn xuất khẩu [17, 18].",
    seasonId: "S001",
    seasonName: "Chính vụ Đồng bằng sông Cửu Long",
    startDate: "2024-04-15",
    endDate: "2024-05-15",
    selectedRegionIds: ["REG-01"],
    selectedZoneIds: ["ZONE-01-B"],
    selectedPlotIds: ["PLOT-008"],
    crop: "Sầu riêng",
    variety: "Sầu riêng Monthong (Dona)",
    purpose: "harvest",
    area: "4.0",
    expectedYield: "80", // 80 tấn
    growthCycleId: "GC004",
    selectedStages: ["Nuôi trái vô cơm & Thu hoạch"],
    materialAllocations: [
      {
        id: 107,
        stageId: "Nuôi trái vô cơm & Thu hoạch",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
        quantity: "50",
        unit: "cái",
      },
    ],
    taskAllocations: [
      {
        id: 207,
        stageId: "Nuôi trái vô cơm & Thu hoạch",
        name: "Cắt nước trước thu hoạch",
        description:
          "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến từ 15 - 20 ngày để sầu riêng ráo cơm, độ béo cao, không bị sượng nước [18, 19].",
        labor: "1 người",
        duration: "15 ngày",
      },
      {
        id: 208,
        stageId: "Nuôi trái vô cơm & Thu hoạch",
        name: "Cắt trái và phân loại",
        description:
          "Đánh giá độ chín sinh lý (tuổi trái). Cắt trái nhẹ nhàng, phân loại hàng xuất khẩu (Loại A, B) và hàng xô cấp đông [19, 20].",
        labor: "8 người",
        duration: "7 ngày",
      },
    ],
    status: "completed",
    createdAt: "2024-04-01",
  },
];

interface PlanStore {
  plans: Plan[];
  getPlanById: (id: number) => Plan | undefined;
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  resetPlans: () => void;
  getStatistics: () => {
    active: number;
    draft: number;
    completed: number;
    total: number;
  };
}

const usePlanStore = create<PlanStore>()(
  devtools(
    persist(
      (set, get) => ({
        plans: initialPlans,

        getPlanById: (id) => {
          return get().plans.find((p) => p.id === id);
        },

        addPlan: (planData) => {
          const newId =
            get().plans.length > 0
              ? Math.max(...get().plans.map((p) => p.id)) + 1
              : 1;
          const newPlan: Plan = {
            ...planData,
            id: newId,
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            plans: [...state.plans, newPlan],
          }));
        },

        updatePlan: (id, updates) => {
          set((state) => ({
            plans: state.plans.map((p) =>
              p.id === id ? { ...p, ...updates } : p,
            ),
          }));
        },

        deletePlan: (id) => {
          set((state) => ({
            plans: state.plans.filter((p) => p.id !== id),
          }));
        },

        resetPlans: () => {
          set({ plans: initialPlans });
        },

        getStatistics: () => {
          const plans = get().plans;
          return {
            active: plans.filter((p) => p.status === "active").length,
            draft: plans.filter((p) => p.status === "draft").length,
            completed: plans.filter((p) => p.status === "completed").length,
            total: plans.length,
          };
        },
      }),
      {
        name: "plan-reset-storage-v1",
      },
    ),
    { name: "PlanStore" },
  ),
);

export default usePlanStore;
