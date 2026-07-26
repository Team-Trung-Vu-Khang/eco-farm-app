import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
  /** Id of the plan this task belongs to. Optional: seeded tasks only carry `plan` (the name). */
  planId?: string;
  stage: string;
  assignedTo: string[];
  assignedToIds?: string[];
  assignedType: "individual" | "team";
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
  geographicalSelections?: any[];
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

const initialData: Task[] = [
   // 1. CÔNG VIỆC CẢI TẠO ĐẤT (AMENDMENT) - Dựa theo Phác đồ đất ID: 4
  {
    id: 101,
    code: "CV-2024-AMEND-01",
    name: "Thực hiện - 4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
    plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
    stage: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
    assignedTo: ["Đội Nông Hóa"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Chuyên gia Thổ nhưỡng"],
    startDate: "2024-08-15",
    endDate: "2024-09-15",
    priority: "high",
    status: "completed",
    description: "Tiến hành bón vôi/Dolomite để khử chua. Rải Ozym kết hợp phân hữu cơ hoai mục để phân hủy tàn dư rễ thối. Tưới Bzym+ (10^15 CFU/mL) nồng độ cao vào đất để thiết lập quần thể vi sinh ưu thế bảo vệ rễ.",
    createdAt: "2024-08-01",
    materials: [
      {
        id: 501,
        taskId: 201,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Ozym (Bào tử vi sinh)",
        quantity: "100",
        unit: "g/gốc",
        type: "fertilizer",
        materialCategory: "Chế phẩm vi sinh",
        materialType: "fertilizer",
        materialName: "Ozym (Bào tử vi sinh)"
      },
      {
        id: 502,
        taskId: 201,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Bzym+ (10^15 CFU/mL)",
        quantity: "500",
        unit: "ml/gốc",
        type: "fertilizer",
        materialCategory: "Chế phẩm vi sinh",
        materialType: "fertilizer",
        materialName: "Bzym+ (10^15 CFU/mL)"
      }
    ],
    tasks: [
      {
        id: 201,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Bón phân hữu cơ và tưới vi sinh",
        description: "Bón vôi/Dolomite khử chua. Rải Ozym, tưới Bzym+.",
        labor: "3 người",
        duration: "30 ngày",
        startDate: "2024-08-15",
        endDate: "2024-09-15",
        isRepeating: false,
        geographicalSelections: [
          { id: "geo-reg02-b", type: "region", regionId: "REG-02" }
        ]
      }
    ],
    geographicalSelections: [
      { id: "geo-reg02-b", type: "region", regionId: "REG-02" }
    ]
  },

  // 2. CÔNG VIỆC ĐIỀU TRỊ BỆNH (TREATMENT) - Dựa theo Phác đồ bệnh ID: 1
  {
    id: 102,
    code: "CV-2025-TREAT-02",
    name: "Thực hiện - 1:Điều trị chính",
    plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
    stage: "1:Điều trị chính",
    assignedTo: ["Trần Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2025-01-20",
    endDate: "2025-01-25",
    priority: "high",
    status: "pending",
    description: "Tập trung phun thuốc đặc trị Carbendazim vào vùng bị thán thư nặng trên lá và bông. Phun lặp lại để phong tỏa nấm hoàn toàn.",
    createdAt: "2025-01-10",
    materials: [
      {
        id: 503,
        taskId: 202,
        stageId: "1:Điều trị chính",
        name: "Carbendazim 50% WP",
        quantity: "1.5",
        unit: "g/l",
        type: "pesticide",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Carbendazim 50% WP"
      }
    ],
    tasks: [
      {
        id: 202,
        stageId: "1:Điều trị chính",
        name: "Phun thuốc điều trị thán thư",
        description: "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
        labor: "2 người",
        duration: "4 ngày",
        startDate: "2025-01-20",
        endDate: "2025-01-24",
        isRepeating: true,
        repeatDays: [1, 2], // Phun lặp lại cách nhau 3 ngày
        repeatWeeks: 1,
        geographicalSelections: [
          { id: "geo-plot-01", type: "plot", regionId: "PLOT-01" }
        ]
      }
    ],
    geographicalSelections: [
      { id: "geo-plot-01", type: "plot", regionId: "PLOT-01" }
    ]
  },

  // 3. CÔNG VIỆC CANH TÁC / LÀM BÔNG (CULTIVATION) - Dựa theo Chu kỳ GC003
  {
    id: 103,
    code: "CV-2024-CULT-03",
    name: "Thực hiện - GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
    plan: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
    stage: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
    assignedTo: ["Đội Kỹ thuật Nông nghiệp 1"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Lê Thị Hoa"],
    startDate: "2024-05-20",
    endDate: "2024-06-10",
    priority: "high",
    status: "in-progress",
    description: "Bón lân gốc. Phủ bạt nilon cách ly nước mưa, tạo khô hạn. Phun Paclobutrazol 25SC 1 lần vào dạ cành và phun lặp lại MKP 0-52-34 để kích mầm hoa.",
    createdAt: "2024-05-10",
    materials: [
      {
        id: 504,
        taskId: 203,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "MKP (0-52-34) hoặc NPK 10-60-10",
        quantity: "5",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Phân bón lá",
        materialType: "Phân vô cơ",
        materialName: "MKP (0-52-34) hoặc NPK 10-60-10"
      },
      {
        id: 505,
        taskId: 203,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Paclobutrazol 25SC",
        quantity: "5",
        unit: "lít",
        type: "pesticide",
        materialCategory: "Thuốc điều hòa sinh trưởng",
        materialType: "Paclobutrazol",
        materialName: "Paclobutrazol 25SC"
      }
    ],
    tasks: [
      {
        id: 203,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Phun tạo mầm và đậy bạt nilon",
        description: "Phun MKP 0-52-34. Phủ bạt quanh gốc. Phun Paclo 1 lần duy nhất.",
        labor: "4 người",
        duration: "3 ngày",
        startDate: "2024-05-20",
        endDate: "2024-06-10",
        isRepeating: true,
        repeatDays: [1, 2], // Lặp lại xịt tạo mầm
        repeatWeeks: 3,     
        geographicalSelections: [
          { id: "geo-zone-01-a", type: "zone", regionId: "ZONE-01-A" }
        ]
      }
    ],
    geographicalSelections: [
      { id: "geo-zone-01-a", type: "zone", regionId: "ZONE-01-A" }
    ]
  },

  // 4. CÔNG VIỆC THU HOẠCH THUẦN TÚY (HARVEST) - Không bám theo Growth Cycle
  {
    id: 104,
    code: "CV-2024-HARV-04",
    name: "Thực hiện - Thu hoạch",
    plan: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
    stage: "Thu hoạch",
    assignedTo: ["Đội Thu hoạch ĐBSCL"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia QC Đầu ra"],
    startDate: "2024-05-01",
    endDate: "2024-05-07",
    priority: "high",
    status: "pending",
    description: "Đánh giá độ chín sinh lý (gõ sầu riêng) để cắt trái bằng kéo chuyên dụng. Xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt xuất khẩu.",
    createdAt: "2024-04-20",
    materials: [
      {
        id: 506,
        taskId: 204,
        stageId: "Thu hoạch",
        name: "Kéo cắt cuống chuyên dụng và sọt nhựa",
        quantity: "50",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa"
      },
      {
        id: 507,
        taskId: 204,
        stageId: "Thu hoạch",
        name: "Ethephon",
        quantity: "5",
        unit: "lít",
        type: "other", // Chất điều hòa sinh trưởng
        materialCategory: "Chất điều hòa sinh trưởng",
        materialType: "Hóa chất",
        materialName: "Ethephon"
      }
    ],
    tasks: [
      {
        id: 204,
        stageId: "Thu hoạch",
        name: "Cắt trái, phân loại và xử lý Ethephon",
        description: "Đánh giá độ chín sinh lý để cắt trái. Sau đó xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt phục vụ xuất khẩu.",
        labor: "8 người",
        duration: "7 ngày",
        startDate: "2024-05-01",
        endDate: "2024-05-07",
        isRepeating: false, 
        geographicalSelections: [
          { id: "geo-plot-11", type: "plot", regionId: "PLOT-011" }
        ]
      }
    ],
    geographicalSelections: [
      { id: "geo-plot-11", type: "plot", regionId: "PLOT-011" }
    ]
  },

  // 1. CÔNG VIỆC: LÀM BÔNG NGHỊCH VỤ (Có lặp lại việc phun tạo mầm)
  // Liên kết Plan 1, Chu kỳ GC003
  {
    id: 105,
    code: "CV-2024-001",
    name: "Thực hiện - GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
    plan: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
    stage: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
    assignedTo: ["Đội Kỹ thuật Nông nghiệp 1"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Lê Thị Hoa"],
    startDate: "2024-05-20",
    endDate: "2024-06-10",
    priority: "high",
    status: "in-progress",
    description:
      "Thực hiện phun tạo mầm hoa bằng Lân, Kali cao nhiều đợt và phun Paclobutrazol để kích ra hoa nghịch vụ.",
    createdAt: "2024-05-10",
    materials: [
      {
        id: 501,
        taskId: 202,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "MKP (0-52-34) hoặc NPK 10-60-10",
        quantity: "5",
        unit: "kg",
        type: "fertilizer",
        materialCategory: "Phân bón lá",
        materialType: "Phân vô cơ",
        materialName: "MKP (0-52-34) hoặc NPK 10-60-10",
      },
      {
        id: 502,
        taskId: 202,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Paclobutrazol 25SC",
        quantity: "5",
        unit: "lít",
        type: "pesticide",
        materialCategory: "Thuốc điều hòa sinh trưởng",
        materialType: "Paclobutrazol",
        materialName: "Paclobutrazol 25SC",
      },
    ],
    tasks: [
      {
        id: 202,
        stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        name: "Phun tạo mầm và đậy bạt nilon",
        description:
          "Phun MKP 0-52-34. Phủ kín bạt nilon quanh gốc. Phun Paclobutrazol 25SC.",
        labor: "4 người",
        duration: "3 ngày",
        startDate: "2024-05-20",
        endDate: "2024-06-10",
        isRepeating: true,
        repeatDays: [1, 2],
        repeatWeeks: 3,
        geographicalSelections: [
          { id: "geo-plot1", type: "plot", regionId: "PLOT-001" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-plot1", type: "plot", regionId: "PLOT-001" },
    ],
  },

  // 2. CÔNG VIỆC: ĐIỀU TRỊ BỆNH THÁN THƯ BÔNG
  {
    id: 106,
    code: "CV-2025-002",
    name: "Thực hiện - 1:Điều trị chính",
    plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
    stage: "1:Điều trị chính",
    assignedTo: ["Trần Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2025-01-20",
    endDate: "2025-01-25",
    priority: "high",
    status: "pending",
    description:
      "Phun thuốc đặc trị Carbendazim vào vùng bị thán thư nặng, phun lặp lại để phong tỏa nấm.",
    createdAt: "2025-01-10",
    materials: [
      {
        id: 503,
        taskId: 207,
        stageId: "1:Điều trị chính",
        name: "Carbendazim 50% WP",
        quantity: "1.5",
        unit: "g/l",
        type: "pesticide",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Carbendazim 50% WP",
      },
    ],
    tasks: [
      {
        id: 207,
        stageId: "1:Điều trị chính",
        name: "Điều trị chính",
        description:
          "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
        labor: "2 người",
        duration: "4 ngày",
        startDate: "2025-01-20",
        endDate: "2025-01-24",
        isRepeating: true,
        repeatDays: [1, 2],
        repeatWeeks: 1,
        geographicalSelections: [
          { id: "geo-reg01-b", type: "region", regionId: "REG-01" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-reg01-b", type: "region", regionId: "REG-01" },
    ],
  },

  // 3. CÔNG VIỆC: NUÔI TRÁI VÀ CHỐNG SƯỢNG
  {
    id: 107,
    code: "CV-2024-003",
    name: "Thực hiện - GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
    plan: "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
    stage: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Nguyễn Tấn Phong"],
    qualityInspectors: [],
    startDate: "2024-03-10",
    endDate: "2024-04-15",
    priority: "medium",
    status: "in-progress",
    description: "Tỉa trái non sinh lý nhiều đợt để loại bỏ trái méo, dị dạng.",
    createdAt: "2024-02-25",
    materials: [],
    tasks: [
      {
        id: 208,
        stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        name: "Tỉa trái non (3 đợt)",
        description:
          "Đợt 1 (sau 10 ngày), Đợt 2 (sau 20 ngày), Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
        labor: "4 người",
        duration: "20 ngày",
        startDate: "2024-03-15",
        endDate: "2024-04-15",
        isRepeating: true,
        repeatDays: [6],
        repeatWeeks: 4,
        geographicalSelections: [
          { id: "geo-plot5", type: "plot", regionId: "PLOT-005" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-plot5", type: "plot", regionId: "PLOT-005" },
    ],
  },

  // 4. CÔNG VIỆC: THU HOẠCH
  {
    id: 108,
    code: "CV-2024-004",
    name: "Thực hiện - Thu hoạch",
    plan: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
    stage: "Công việc thu hoạch",
    assignedTo: ["Đội Thu hoạch ĐBSCL"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia kiểm định QC"],
    startDate: "2024-05-01",
    endDate: "2024-05-07",
    priority: "high",
    status: "pending",
    description: "Đánh giá độ chín sinh lý để cắt trái.",
    createdAt: "2024-04-20",
    materials: [
      {
        id: 506,
        taskId: 1779988365800,
        stageId: "Công việc thu hoạch",
        name: "Kéo cắt cuống chuyên dụng và sọt nhựa",
        quantity: "50",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
      },
      {
        id: 507,
        taskId: 1779988365800,
        stageId: "Công việc thu hoạch",
        name: "Ethephon",
        quantity: "5",
        unit: "lít",
        type: "other",
        materialCategory: "Chất điều hòa sinh trưởng",
        materialType: "Hóa chất",
        materialName: "Ethephon",
      },
    ],
    tasks: [
      {
        id: 1779988365800,
        stageId: "Công việc thu hoạch",
        name: "Cắt trái, phân loại và xử lý Ethephon",
        description:
          "Đánh giá độ chín sinh lý để cắt trái. Xử lý nhúng Ethephon nồng độ an toàn.",
        labor: "8 người",
        duration: "7 ngày",
        startDate: "2024-05-01",
        endDate: "2024-05-07",
        isRepeating: false,
        geographicalSelections: [
          { id: "gk9s3nr6f", type: "region", regionId: "3" },
          { id: "6fv2o7w89", type: "region", regionId: "5" },
          { id: "gq2qdqq7k", type: "region", regionId: "1" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "gk9s3nr6f", type: "region", regionId: "3" },
      { id: "6fv2o7w89", type: "region", regionId: "5" },
      { id: "gq2qdqq7k", type: "region", regionId: "1" },
    ],
  },

  // 5. CÔNG VIỆC CẢI TẠO ĐẤT
  {
    id: 109,
    code: "CV-2025-005",
    name: "Bón phân hữu cơ và tưới vi sinh",
    plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
    stage: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
    assignedTo: ["Lê Văn Cường", "Phạm Văn Định"],
    assignedType: "individual",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Trần Thị Thu"],
    startDate: "2025-03-01",
    endDate: "2025-03-15",
    priority: "high",
    status: "in-progress",
    description:
      "Rải phân hữu cơ hoai mục và tưới chế phẩm vi sinh Bacillus để phục hồi hệ vi sinh vật đất.",
    createdAt: "2025-02-20",
    materials: [
      {
        id: 508,
        taskId: 211,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Phân hữu cơ hoai",
        quantity: "100",
        unit: "bao",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Hữu cơ",
        materialName: "Phân bò hoai mục",
      },
      {
        id: 509,
        taskId: 211,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Bzym+",
        quantity: "10",
        unit: "lít",
        type: "fertilizer",
        materialCategory: "Vi sinh",
        materialType: "Chế phẩm sinh học",
        materialName: "Bzym+ (10^15 CFU)",
      },
    ],
    tasks: [
      {
        id: 211,
        stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        name: "Bón phân hữu cơ và tưới vi sinh",
        description: "Thực hiện bón phân và tưới vi sinh theo phác đồ.",
        labor: "2 người",
        duration: "15 ngày",
        startDate: "2025-03-01",
        endDate: "2025-03-15",
        isRepeating: false,
        geographicalSelections: [
          { id: "geo-reg-01", type: "region", regionId: "REG-01" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-reg-01", type: "region", regionId: "REG-01" },
    ],
  },

  // 6. CÔNG VIỆC PHÁT SINH
  {
    id: 110,
    code: "CV-PS-2025-006",
    name: "Kiểm tra và xử lý rệp sáp cục bộ",
    plan: "N/A",
    stage: "N/A",
    assignedTo: ["Nguyễn Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    startDate: "2025-03-10",
    endDate: "2025-03-11",
    priority: "medium",
    status: "pending",
    description:
      "Phát hiện rệp sáp tại lô PLOT-003, cần xử lý xịt thuốc cục bộ để tránh lây lan.",
    createdAt: "2025-03-10",
    geographicalSelections: [
      {
        id: "geo-plot-3",
        type: "plot",
        regionId: "REG-01",
        areaId: "ZONE-01",
        plotId: "PLOT-003",
      },
    ],
  },

  // 7. CÔNG VIỆC QUÁ HẠN
  {
    id: 111,
    code: "CV-2025-007",
    name: "Phun thuốc phòng ngừa thán thư đợt 1",
    plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
    stage: "1:Phun thuốc phòng ngừa",
    assignedTo: ["Đội Kỹ thuật 2"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    priority: "high",
    status: "overdue",
    description:
      "Phun thuốc phòng ngừa thán thư giai đoạn bông đang phát triển.",
    createdAt: "2025-02-01",
    materials: [],
    tasks: [
      {
        id: 212,
        stageId: "1:Phun thuốc phòng ngừa",
        name: "Phun thuốc phòng ngừa thán thư đợt 1",
        description: "Phun thuốc phòng ngừa thán thư giai đoạn bông đang phát triển.",
        labor: "3 người",
        duration: "3 ngày",
        startDate: "2025-02-10",
        endDate: "2025-02-12",
        isRepeating: false,
        geographicalSelections: [
          { id: "geo-reg-01", type: "region", regionId: "REG-01" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-reg-01", type: "region", regionId: "REG-01" },
    ],
  },

  // 8. CÔNG VIỆC HOÀN THÀNH
  {
    id: 112,
    code: "CV-2025-008",
    name: "Khơi rãnh thoát nước",
    plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
    stage: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
    assignedTo: ["Đội Cơ giới 1"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    startDate: "2025-02-15",
    endDate: "2025-02-20",
    priority: "high",
    status: "completed",
    description:
      "Thực hiện đào rãnh thoát nước xương cá để chống úng cho vườn sầu riêng.",
    createdAt: "2025-02-10",
    materials: [],
    tasks: [
      {
        id: 213,
        stageId: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
        name: "Đào rãnh thoát nước xương cá",
        description: "Sử dụng máy đào mini khơi rãnh thoát nước xương cá dọc theo hàng cây.",
        labor: "4 người",
        duration: "6 ngày",
        startDate: "2025-02-15",
        endDate: "2025-02-20",
        isRepeating: false,
        geographicalSelections: [
          { id: "geo-reg-01", type: "region", regionId: "REG-01" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-reg-01", type: "region", regionId: "REG-01" },
    ],
  },
];

const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: initialData,

        getTaskById: (id) => {
          return get().tasks.find((t) => t.id === id);
        },

        addTask: (taskData) => {
          const newId =
            get().tasks.length > 0
              ? Math.max(...get().tasks.map((t) => t.id)) + 1
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
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updates } : t,
            ),
          }));
        },

        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        },

        getStatistics: () => {
          const tasks = get().tasks;
          return {
            pending: tasks.filter((t) => t.status === "pending").length,
            inProgress: tasks.filter((t) => t.status === "in-progress").length,
            completed: tasks.filter((t) => t.status === "completed").length,
            overdue: tasks.filter((t) => t.status === "overdue").length,
            total: tasks.length,
          };
        },
      }),
      {
        name: "task-storage",
      },
    ),
  ),
);

export default useTaskStore;
