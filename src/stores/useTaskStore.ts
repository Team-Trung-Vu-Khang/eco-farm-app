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
  planId?: number; // liên kết với Plan.id trong usePlanStore
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

// const initialData: Task[] = [
//    // 1. CÔNG VIỆC CẢI TẠO ĐẤT (AMENDMENT) - Dựa theo Phác đồ đất ID: 4
//   {
//     id: 101,
//     code: "CV-2024-AMEND-01",
//     name: "Thực hiện - 4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//     plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
//     stage: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//     assignedTo: ["Đội Nông Hóa"],
//     assignedType: "team",
//     supervisors: ["Lê Thanh Hà"],
//     qualityInspectors: ["Chuyên gia Thổ nhưỡng"],
//     startDate: "2024-08-15",
//     endDate: "2024-09-15",
//     priority: "high",
//     status: "completed",
//     description: "Tiến hành bón vôi/Dolomite để khử chua. Rải Ozym kết hợp phân hữu cơ hoai mục để phân hủy tàn dư rễ thối. Tưới Bzym+ (10^15 CFU/mL) nồng độ cao vào đất để thiết lập quần thể vi sinh ưu thế bảo vệ rễ.",
//     createdAt: "2024-08-01",
//     materials: [
//       {
//         id: 501,
//         taskId: 201,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Ozym (Bào tử vi sinh)",
//         quantity: "100",
//         unit: "g/gốc",
//         type: "fertilizer",
//         materialCategory: "Chế phẩm vi sinh",
//         materialType: "fertilizer",
//         materialName: "Ozym (Bào tử vi sinh)"
//       },
//       {
//         id: 502,
//         taskId: 201,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Bzym+ (10^15 CFU/mL)",
//         quantity: "500",
//         unit: "ml/gốc",
//         type: "fertilizer",
//         materialCategory: "Chế phẩm vi sinh",
//         materialType: "fertilizer",
//         materialName: "Bzym+ (10^15 CFU/mL)"
//       }
//     ],
//     tasks: [
//       {
//         id: 201,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Bón phân hữu cơ và tưới vi sinh",
//         description: "Bón vôi/Dolomite khử chua. Rải Ozym, tưới Bzym+.",
//         labor: "3 người",
//         duration: "30 ngày",
//         startDate: "2024-08-15",
//         endDate: "2024-09-15",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "geo-reg02-b", type: "region", regionId: "REG-02" }
//         ]
//       }
//     ],
//     geographicalSelections: [
//       { id: "geo-reg02-b", type: "region", regionId: "REG-02" }
//     ]
//   },

//   // 2. CÔNG VIỆC ĐIỀU TRỊ BỆNH (TREATMENT) - Dựa theo Phác đồ bệnh ID: 1
//   {
//     id: 102,
//     code: "CV-2025-TREAT-02",
//     name: "Thực hiện - 1:Điều trị chính",
//     plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
//     stage: "1:Điều trị chính",
//     assignedTo: ["Trần Văn An"],
//     assignedType: "individual",
//     supervisors: ["Phạm Quốc Bảo"],
//     qualityInspectors: ["Trần Thị Lan"],
//     startDate: "2025-01-20",
//     endDate: "2025-01-25",
//     priority: "high",
//     status: "pending",
//     description: "Tập trung phun thuốc đặc trị Carbendazim vào vùng bị thán thư nặng trên lá và bông. Phun lặp lại để phong tỏa nấm hoàn toàn.",
//     createdAt: "2025-01-10",
//     materials: [
//       {
//         id: 503,
//         taskId: 202,
//         stageId: "1:Điều trị chính",
//         name: "Carbendazim 50% WP",
//         quantity: "1.5",
//         unit: "g/l",
//         type: "pesticide",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Carbendazim 50% WP"
//       }
//     ],
//     tasks: [
//       {
//         id: 202,
//         stageId: "1:Điều trị chính",
//         name: "Phun thuốc điều trị thán thư",
//         description: "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
//         labor: "2 người",
//         duration: "4 ngày",
//         startDate: "2025-01-20",
//         endDate: "2025-01-24",
//         isRepeating: true,
//         repeatDays: [1, 2], // Phun lặp lại cách nhau 3 ngày
//         repeatWeeks: 1,
//         geographicalSelections: [
//           { id: "geo-plot-01", type: "plot", regionId: "PLOT-01" }
//         ]
//       }
//     ],
//     geographicalSelections: [
//       { id: "geo-plot-01", type: "plot", regionId: "PLOT-01" }
//     ]
//   },

//   // 3. CÔNG VIỆC CANH TÁC / LÀM BÔNG (CULTIVATION) - Dựa theo Chu kỳ GC003
//   {
//     id: 103,
//     code: "CV-2024-CULT-03",
//     name: "Thực hiện - GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//     plan: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
//     stage: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//     assignedTo: ["Đội Kỹ thuật Nông nghiệp 1"],
//     assignedType: "team",
//     supervisors: ["Nguyễn Văn Hùng"],
//     qualityInspectors: ["Lê Thị Hoa"],
//     startDate: "2024-05-20",
//     endDate: "2024-06-10",
//     priority: "high",
//     status: "in-progress",
//     description: "Bón lân gốc. Phủ bạt nilon cách ly nước mưa, tạo khô hạn. Phun Paclobutrazol 25SC 1 lần vào dạ cành và phun lặp lại MKP 0-52-34 để kích mầm hoa.",
//     createdAt: "2024-05-10",
//     materials: [
//       {
//         id: 504,
//         taskId: 203,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "MKP (0-52-34) hoặc NPK 10-60-10",
//         quantity: "5",
//         unit: "kg",
//         type: "fertilizer",
//         materialCategory: "Phân bón lá",
//         materialType: "Phân vô cơ",
//         materialName: "MKP (0-52-34) hoặc NPK 10-60-10"
//       },
//       {
//         id: 505,
//         taskId: 203,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Paclobutrazol 25SC",
//         quantity: "5",
//         unit: "lít",
//         type: "pesticide",
//         materialCategory: "Thuốc điều hòa sinh trưởng",
//         materialType: "Paclobutrazol",
//         materialName: "Paclobutrazol 25SC"
//       }
//     ],
//     tasks: [
//       {
//         id: 203,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Phun tạo mầm và đậy bạt nilon",
//         description: "Phun MKP 0-52-34. Phủ bạt quanh gốc. Phun Paclo 1 lần duy nhất.",
//         labor: "4 người",
//         duration: "3 ngày",
//         startDate: "2024-05-20",
//         endDate: "2024-06-10",
//         isRepeating: true,
//         repeatDays: [1, 2], // Lặp lại xịt tạo mầm
//         repeatWeeks: 3,
//         geographicalSelections: [
//           { id: "geo-zone-01-a", type: "zone", regionId: "ZONE-01-A" }
//         ]
//       }
//     ],
//     geographicalSelections: [
//       { id: "geo-zone-01-a", type: "zone", regionId: "ZONE-01-A" }
//     ]
//   },

//   // 4. CÔNG VIỆC THU HOẠCH THUẦN TÚY (HARVEST) - Không bám theo Growth Cycle
//   {
//     id: 104,
//     code: "CV-2024-HARV-04",
//     name: "Thực hiện - Thu hoạch",
//     plan: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
//     stage: "Thu hoạch",
//     assignedTo: ["Đội Thu hoạch ĐBSCL"],
//     assignedType: "team",
//     supervisors: ["Trần Thị Lan"],
//     qualityInspectors: ["Chuyên gia QC Đầu ra"],
//     startDate: "2024-05-01",
//     endDate: "2024-05-07",
//     priority: "high",
//     status: "pending",
//     description: "Đánh giá độ chín sinh lý (gõ sầu riêng) để cắt trái bằng kéo chuyên dụng. Xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt xuất khẩu.",
//     createdAt: "2024-04-20",
//     materials: [
//       {
//         id: 506,
//         taskId: 204,
//         stageId: "Thu hoạch",
//         name: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//         quantity: "50",
//         unit: "cái",
//         type: "tool",
//         materialCategory: "Dụng cụ nông nghiệp",
//         materialType: "Vật tư thu hoạch",
//         materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa"
//       },
//       {
//         id: 507,
//         taskId: 204,
//         stageId: "Thu hoạch",
//         name: "Ethephon",
//         quantity: "5",
//         unit: "lít",
//         type: "other", // Chất điều hòa sinh trưởng
//         materialCategory: "Chất điều hòa sinh trưởng",
//         materialType: "Hóa chất",
//         materialName: "Ethephon"
//       }
//     ],
//     tasks: [
//       {
//         id: 204,
//         stageId: "Thu hoạch",
//         name: "Cắt trái, phân loại và xử lý Ethephon",
//         description: "Đánh giá độ chín sinh lý để cắt trái. Sau đó xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt phục vụ xuất khẩu.",
//         labor: "8 người",
//         duration: "7 ngày",
//         startDate: "2024-05-01",
//         endDate: "2024-05-07",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "geo-plot-11", type: "plot", regionId: "PLOT-011" }
//         ]
//       }
//     ],
//     geographicalSelections: [
//       { id: "geo-plot-11", type: "plot", regionId: "PLOT-011" }
//     ]
//   },

//   // 1. CÔNG VIỆC: LÀM BÔNG NGHỊCH VỤ (Có lặp lại việc phun tạo mầm)
//   // Liên kết Plan 1, Chu kỳ GC003
//   {
//     id: 105,
//     code: "CV-2024-001",
//     name: "Thực hiện - GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//     plan: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
//     stage: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//     assignedTo: ["Đội Kỹ thuật Nông nghiệp 1"],
//     assignedType: "team",
//     supervisors: ["Nguyễn Văn Hùng"],
//     qualityInspectors: ["Lê Thị Hoa"],
//     startDate: "2024-05-20",
//     endDate: "2024-06-10",
//     priority: "high",
//     status: "in-progress",
//     description:
//       "Thực hiện phun tạo mầm hoa bằng Lân, Kali cao nhiều đợt và phun Paclobutrazol để kích ra hoa nghịch vụ.",
//     createdAt: "2024-05-10",
//     materials: [
//       {
//         id: 501,
//         taskId: 202,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "MKP (0-52-34) hoặc NPK 10-60-10",
//         quantity: "5",
//         unit: "kg",
//         type: "fertilizer",
//         materialCategory: "Phân bón lá",
//         materialType: "Phân vô cơ",
//         materialName: "MKP (0-52-34) hoặc NPK 10-60-10",
//       },
//       {
//         id: 502,
//         taskId: 202,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Paclobutrazol 25SC",
//         quantity: "5",
//         unit: "lít",
//         type: "pesticide",
//         materialCategory: "Thuốc điều hòa sinh trưởng",
//         materialType: "Paclobutrazol",
//         materialName: "Paclobutrazol 25SC",
//       },
//     ],
//     tasks: [
//       {
//         id: 202,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Phun tạo mầm và đậy bạt nilon",
//         description:
//           "Phun MKP 0-52-34. Phủ kín bạt nilon quanh gốc. Phun Paclobutrazol 25SC.",
//         labor: "4 người",
//         duration: "3 ngày",
//         startDate: "2024-05-20",
//         endDate: "2024-06-10",
//         isRepeating: true,
//         repeatDays: [1, 2],
//         repeatWeeks: 3,
//         geographicalSelections: [
//           { id: "geo-plot1", type: "plot", regionId: "PLOT-001" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-plot1", type: "plot", regionId: "PLOT-001" },
//     ],
//   },

//   // 2. CÔNG VIỆC: ĐIỀU TRỊ BỆNH THÁN THƯ BÔNG
//   {
//     id: 106,
//     code: "CV-2025-002",
//     name: "Thực hiện - 1:Điều trị chính",
//     plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
//     stage: "1:Điều trị chính",
//     assignedTo: ["Trần Văn An"],
//     assignedType: "individual",
//     supervisors: ["Phạm Quốc Bảo"],
//     qualityInspectors: ["Trần Thị Lan"],
//     startDate: "2025-01-20",
//     endDate: "2025-01-25",
//     priority: "high",
//     status: "pending",
//     description:
//       "Phun thuốc đặc trị Carbendazim vào vùng bị thán thư nặng, phun lặp lại để phong tỏa nấm.",
//     createdAt: "2025-01-10",
//     materials: [
//       {
//         id: 503,
//         taskId: 207,
//         stageId: "1:Điều trị chính",
//         name: "Carbendazim 50% WP",
//         quantity: "1.5",
//         unit: "g/l",
//         type: "pesticide",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Carbendazim 50% WP",
//       },
//     ],
//     tasks: [
//       {
//         id: 207,
//         stageId: "1:Điều trị chính",
//         name: "Điều trị chính",
//         description:
//           "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
//         labor: "2 người",
//         duration: "4 ngày",
//         startDate: "2025-01-20",
//         endDate: "2025-01-24",
//         isRepeating: true,
//         repeatDays: [1, 2],
//         repeatWeeks: 1,
//         geographicalSelections: [
//           { id: "geo-reg01-b", type: "region", regionId: "REG-01" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-reg01-b", type: "region", regionId: "REG-01" },
//     ],
//   },

//   // 3. CÔNG VIỆC: NUÔI TRÁI VÀ CHỐNG SƯỢNG
//   {
//     id: 107,
//     code: "CV-2024-003",
//     name: "Thực hiện - GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//     plan: "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
//     stage: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//     assignedTo: ["Đội Canh tác & Chăm sóc"],
//     assignedType: "team",
//     supervisors: ["Nguyễn Tấn Phong"],
//     qualityInspectors: [],
//     startDate: "2024-03-10",
//     endDate: "2024-04-15",
//     priority: "medium",
//     status: "in-progress",
//     description: "Tỉa trái non sinh lý nhiều đợt để loại bỏ trái méo, dị dạng.",
//     createdAt: "2024-02-25",
//     materials: [],
//     tasks: [
//       {
//         id: 208,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//         name: "Tỉa trái non (3 đợt)",
//         description:
//           "Đợt 1 (sau 10 ngày), Đợt 2 (sau 20 ngày), Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
//         labor: "4 người",
//         duration: "20 ngày",
//         startDate: "2024-03-15",
//         endDate: "2024-04-15",
//         isRepeating: true,
//         repeatDays: [6],
//         repeatWeeks: 4,
//         geographicalSelections: [
//           { id: "geo-plot5", type: "plot", regionId: "PLOT-005" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-plot5", type: "plot", regionId: "PLOT-005" },
//     ],
//   },

//   // 4. CÔNG VIỆC: THU HOẠCH
//   {
//     id: 108,
//     code: "CV-2024-004",
//     name: "Thực hiện - Thu hoạch",
//     plan: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
//     stage: "Công việc thu hoạch",
//     assignedTo: ["Đội Thu hoạch ĐBSCL"],
//     assignedType: "team",
//     supervisors: ["Trần Thị Lan"],
//     qualityInspectors: ["Chuyên gia kiểm định QC"],
//     startDate: "2024-05-01",
//     endDate: "2024-05-07",
//     priority: "high",
//     status: "pending",
//     description: "Đánh giá độ chín sinh lý để cắt trái.",
//     createdAt: "2024-04-20",
//     materials: [
//       {
//         id: 506,
//         taskId: 1779988365800,
//         stageId: "Công việc thu hoạch",
//         name: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//         quantity: "50",
//         unit: "cái",
//         type: "tool",
//         materialCategory: "Dụng cụ nông nghiệp",
//         materialType: "Vật tư thu hoạch",
//         materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//       },
//       {
//         id: 507,
//         taskId: 1779988365800,
//         stageId: "Công việc thu hoạch",
//         name: "Ethephon",
//         quantity: "5",
//         unit: "lít",
//         type: "other",
//         materialCategory: "Chất điều hòa sinh trưởng",
//         materialType: "Hóa chất",
//         materialName: "Ethephon",
//       },
//     ],
//     tasks: [
//       {
//         id: 1779988365800,
//         stageId: "Công việc thu hoạch",
//         name: "Cắt trái, phân loại và xử lý Ethephon",
//         description:
//           "Đánh giá độ chín sinh lý để cắt trái. Xử lý nhúng Ethephon nồng độ an toàn.",
//         labor: "8 người",
//         duration: "7 ngày",
//         startDate: "2024-05-01",
//         endDate: "2024-05-07",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "gk9s3nr6f", type: "region", regionId: "3" },
//           { id: "6fv2o7w89", type: "region", regionId: "5" },
//           { id: "gq2qdqq7k", type: "region", regionId: "1" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "gk9s3nr6f", type: "region", regionId: "3" },
//       { id: "6fv2o7w89", type: "region", regionId: "5" },
//       { id: "gq2qdqq7k", type: "region", regionId: "1" },
//     ],
//   },

//   // 5. CÔNG VIỆC CẢI TẠO ĐẤT
//   {
//     id: 109,
//     code: "CV-2025-005",
//     name: "Bón phân hữu cơ và tưới vi sinh",
//     plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
//     stage: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//     assignedTo: ["Lê Văn Cường", "Phạm Văn Định"],
//     assignedType: "individual",
//     supervisors: ["Lê Thanh Hà"],
//     qualityInspectors: ["Trần Thị Thu"],
//     startDate: "2025-03-01",
//     endDate: "2025-03-15",
//     priority: "high",
//     status: "in-progress",
//     description:
//       "Rải phân hữu cơ hoai mục và tưới chế phẩm vi sinh Bacillus để phục hồi hệ vi sinh vật đất.",
//     createdAt: "2025-02-20",
//     materials: [
//       {
//         id: 508,
//         taskId: 211,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Phân hữu cơ hoai",
//         quantity: "100",
//         unit: "bao",
//         type: "fertilizer",
//         materialCategory: "Phân bón",
//         materialType: "Hữu cơ",
//         materialName: "Phân bò hoai mục",
//       },
//       {
//         id: 509,
//         taskId: 211,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Bzym+",
//         quantity: "10",
//         unit: "lít",
//         type: "fertilizer",
//         materialCategory: "Vi sinh",
//         materialType: "Chế phẩm sinh học",
//         materialName: "Bzym+ (10^15 CFU)",
//       },
//     ],
//     tasks: [
//       {
//         id: 211,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Bón phân hữu cơ và tưới vi sinh",
//         description: "Thực hiện bón phân và tưới vi sinh theo phác đồ.",
//         labor: "2 người",
//         duration: "15 ngày",
//         startDate: "2025-03-01",
//         endDate: "2025-03-15",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//     ],
//   },

//   // 6. CÔNG VIỆC PHÁT SINH
//   {
//     id: 110,
//     code: "CV-PS-2025-006",
//     name: "Kiểm tra và xử lý rệp sáp cục bộ",
//     plan: "N/A",
//     stage: "N/A",
//     assignedTo: ["Nguyễn Văn An"],
//     assignedType: "individual",
//     supervisors: ["Phạm Quốc Bảo"],
//     startDate: "2025-03-10",
//     endDate: "2025-03-11",
//     priority: "medium",
//     status: "pending",
//     description:
//       "Phát hiện rệp sáp tại lô PLOT-003, cần xử lý xịt thuốc cục bộ để tránh lây lan.",
//     createdAt: "2025-03-10",
//     geographicalSelections: [
//       {
//         id: "geo-plot-3",
//         type: "plot",
//         regionId: "REG-01",
//         areaId: "ZONE-01",
//         plotId: "PLOT-003",
//       },
//     ],
//   },

//   // 7. CÔNG VIỆC QUÁ HẠN
//   {
//     id: 111,
//     code: "CV-2025-007",
//     name: "Phun thuốc phòng ngừa thán thư đợt 1",
//     plan: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
//     stage: "1:Phun thuốc phòng ngừa",
//     assignedTo: ["Đội Kỹ thuật 2"],
//     assignedType: "team",
//     supervisors: ["Nguyễn Văn Hùng"],
//     startDate: "2025-02-10",
//     endDate: "2025-02-12",
//     priority: "high",
//     status: "overdue",
//     description:
//       "Phun thuốc phòng ngừa thán thư giai đoạn bông đang phát triển.",
//     createdAt: "2025-02-01",
//     materials: [],
//     tasks: [
//       {
//         id: 212,
//         stageId: "1:Phun thuốc phòng ngừa",
//         name: "Phun thuốc phòng ngừa thán thư đợt 1",
//         description: "Phun thuốc phòng ngừa thán thư giai đoạn bông đang phát triển.",
//         labor: "3 người",
//         duration: "3 ngày",
//         startDate: "2025-02-10",
//         endDate: "2025-02-12",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//     ],
//   },

//   // 8. CÔNG VIỆC HOÀN THÀNH
//   {
//     id: 112,
//     code: "CV-2025-008",
//     name: "Khơi rãnh thoát nước",
//     plan: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
//     stage: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
//     assignedTo: ["Đội Cơ giới 1"],
//     assignedType: "team",
//     supervisors: ["Lê Thanh Hà"],
//     startDate: "2025-02-15",
//     endDate: "2025-02-20",
//     priority: "high",
//     status: "completed",
//     description:
//       "Thực hiện đào rãnh thoát nước xương cá để chống úng cho vườn sầu riêng.",
//     createdAt: "2025-02-10",
//     materials: [],
//     tasks: [
//       {
//         id: 213,
//         stageId: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
//         name: "Đào rãnh thoát nước xương cá",
//         description: "Sử dụng máy đào mini khơi rãnh thoát nước xương cá dọc theo hàng cây.",
//         labor: "4 người",
//         duration: "6 ngày",
//         startDate: "2025-02-15",
//         endDate: "2025-02-20",
//         isRepeating: false,
//         geographicalSelections: [
//           { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//         ],
//       },
//     ],
//     geographicalSelections: [
//       { id: "geo-reg-01", type: "region", regionId: "REG-01" },
//     ],
//   },
// ];

export const initialData: Task[] = [
  {
    id: 101,
    code: "CV-LUA-INIT-001",
    name: "Xây dựng trạm bơm và lắp đường ống tưới/xả phèn",
    plan: "Kế hoạch Thiết lập hạ tầng Đồng ruộng ĐBSCL",
    planId: 2,
    stage: "1:Cày lật, đánh rãnh & Rửa phèn",
    assignedTo: ["Đội Thi công Thủy lợi"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Kỹ"],
    qualityInspectors: ["Ban Quản lý HTX"],
    startDate: "2024-10-01",
    endDate: "2024-10-10",
    priority: "high",
    status: "completed",
    description:
      "Lắp đặt 2 máy bơm công suất 9 ngựa (HP). Bố trí 4 ống xổ phèn nhựa cứng (đường kính 25cm, dày 1.2cm, dài 10 thước/ống) để dẫn nước ngọt và xả phèn mặn ra kênh chính.",
    createdAt: "2024-09-20",
    materials: [
      {
        id: 501,
        taskId: 201,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Ống xổ phèn phi 250",
        quantity: "4",
        unit: "ống",
        type: "tool",
        materialCategory: "Vật tư Thủy lợi",
        materialType: "Ống nhựa",
        materialName: "Ống nhựa phi 250 dày 1.2cm",
      },
      {
        id: 502,
        taskId: 201,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Máy bơm 9HP",
        quantity: "2",
        unit: "cái",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "Máy bơm",
        materialName: "Máy bơm dầu 9HP",
      },
      {
        id: 516,
        taskId: 201,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Ống dẫn nước HDPE phi 90",
        quantity: "200",
        unit: "m",
        type: "tool",
        materialCategory: "Vật tư Thủy lợi",
        materialType: "Ống nhựa",
        materialName: "Ống HDPE phi 90 áp lực 6bar",
      },
    ],
    tasks: [
      {
        id: 201,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Lắp đặt máy bơm và ống xả phèn",
        description:
          "Đào rãnh sâu 40cm, đặt ống xổ phèn phi 250 và đấu nối với 2 máy bơm 9 ngựa. Kiểm tra áp lực và thử vận hành toàn bộ hệ thống.",
        labor: "4 người",
        duration: "10 ngày",
        startDate: "2024-10-01",
        endDate: "2024-10-10",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-101-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "2298a4a4f",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 102,
    code: "CV-LUA-INIT-002",
    name: "Nhập giống lúa xác nhận từ Trung tâm Giống",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
    assignedTo: ["Trần Văn Thu Mua"],
    assignedType: "individual",
    supervisors: ["Ban Giám Đốc HTX"],
    qualityInspectors: ["Nguyễn Thị Kiểm Định"],
    startDate: "2024-10-15",
    endDate: "2024-10-17",
    priority: "high",
    status: "completed",
    description:
      "Nhập lúa giống ST25 và Đài Thơm 8 cấp xác nhận từ Viện Lúa để chuẩn bị ngâm ủ. Kiểm tra chứng nhận nguồn gốc, tỉ lệ nảy mầm ≥ 85%, độ thuần ≥ 99%.",
    createdAt: "2024-09-25",
    materials: [
      {
        id: 503,
        taskId: 202,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Giống lúa ST25",
        quantity: "600",
        unit: "kg",
        type: "other",
        materialCategory: "Giống",
        materialType: "Lúa thuần",
        materialName: "Hạt giống ST25 cấp xác nhận",
      },
      {
        id: 515,
        taskId: 202,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Giống lúa Đài Thơm 8",
        quantity: "400",
        unit: "kg",
        type: "other",
        materialCategory: "Giống",
        materialType: "Lúa thuần",
        materialName: "Hạt giống Đài Thơm 8 cấp xác nhận",
      },
      {
        id: 517,
        taskId: 202,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Thuốc ngâm giống Cruiser Plus",
        quantity: "1",
        unit: "lít",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc xử lý hạt giống",
        materialName: "Cruiser Plus 312.5FS (chống rầy hại mạ)",
      },
    ],
    tasks: [
      {
        id: 202,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Ngâm ủ giống và kiểm tra tỉ lệ nảy mầm",
        description:
          "Ngâm giống trong nước sạch 24h, ủ trong bao tải ẩm 24-36h đến khi nứt nanh. Kiểm tra tỉ lệ nảy mầm ≥ 85% trước khi đưa vào gieo sạ.",
        labor: "2 người",
        duration: "2 ngày",
        startDate: "2024-10-15",
        endDate: "2024-10-17",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-102-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-102-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 103,
    code: "CV-LUA-INIT-003",
    name: "Gia cố bờ bao và san phẳng mặt ruộng bằng Laser",
    plan: "Kế hoạch Thiết lập hạ tầng Đồng ruộng ĐBSCL",
    planId: 2,
    stage: "1:Cày lật, đánh rãnh & Rửa phèn",
    assignedTo: ["Đội Cơ giới"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Kỹ"],
    qualityInspectors: ["Chuyên gia Nông học"],
    startDate: "2024-10-11",
    endDate: "2024-10-20",
    priority: "medium",
    status: "completed",
    description:
      "Gia cố bờ bao giữ nước và dùng máy cày gắn gàu san Laser để đảm bảo mặt ruộng chênh lệch không quá 5cm, giúp tưới tiêu đồng đều và tiết kiệm nước.",
    createdAt: "2024-09-20",
    materials: [
      {
        id: 518,
        taskId: 203,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Máy cày san phẳng Laser",
        quantity: "1",
        unit: "ca máy",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "Máy cày san laser",
        materialName: "Máy cày John Deere gắn bộ san laser GPS",
      },
      {
        id: 519,
        taskId: 203,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Bạt chống thấm gia cố bờ",
        quantity: "500",
        unit: "m2",
        type: "other",
        materialCategory: "Vật tư Thủy lợi",
        materialType: "Màng chống thấm",
        materialName: "Bạt HDPE 0.5mm chống thấm bờ bao",
      },
    ],
    tasks: [
      {
        id: 203,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "San phẳng mặt ruộng bằng tia Laser",
        description:
          "Vận hành máy cày gắn bộ san laser GPS. Sai số mặt ruộng phải ≤ 5cm. Gia cố bờ bao bằng bạt chống thấm, đắp đất cao hơn mực nước lũ 20cm.",
        labor: "3 người",
        duration: "10 ngày",
        startDate: "2024-10-11",
        endDate: "2024-10-20",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-103-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-103-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 104,
    code: "CV-LUA-OP-001",
    name: "Đo độ pH và Độ mặn định kỳ",
    plan: "Kế hoạch cải tạo đất nhiễm mặn phèn vụ Hè Thu",
    planId: 2,
    stage: "1:Bón lót Vôi và Lân nung chảy",
    assignedTo: ["Kỹ thuật viên Thổ nhưỡng"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: [],
    startDate: "2024-11-01",
    endDate: "2025-10-31",
    priority: "high",
    status: "in-progress",
    description:
      "Khoét lỗ sâu 20cm đo nước rịn. Đo pH đất và độ mặn định kỳ 1 lần/tháng vào mùa khô và đầu vụ. Ghi nhận vào sổ theo dõi và báo cáo kết quả cho ban quản lý.",
    createdAt: "2024-10-05",
    materials: [
      {
        id: 504,
        taskId: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        name: "Máy đo pH và Khúc xạ kế đo mặn",
        quantity: "1",
        unit: "bộ",
        type: "tool",
        materialCategory: "Thiết bị đo",
        materialType: "Máy đo",
        materialName: "Máy đo pH và Khúc xạ kế",
      },
      {
        id: 520,
        taskId: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        name: "Sổ nhật ký đồng ruộng",
        quantity: "12",
        unit: "quyển",
        type: "other",
        materialCategory: "Văn phòng phẩm",
        materialType: "Sổ ghi chép",
        materialName: "Sổ nhật ký đồng ruộng",
      },
      {
        id: 1780340193630,
        taskId: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        materialCategory: "Phân bón",
        materialType: "Phân bón",
        materialName: "Vôi bột nông nghiệp (Ca(OH)2)",
        name: "Vôi bột nông nghiệp (Ca(OH)2)",
        quantity: "10",
        unit: "kg/ha",
        // @ts-ignore
        type: "Phân bón",
      },
      {
        id: 1780340194709,
        taskId: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        materialCategory: "Phân bón",
        materialType: "Phân bón",
        materialName: "Lân nung chảy (Văn Điển/Đầu Trâu)",
        name: "Lân nung chảy (Văn Điển/Đầu Trâu)",
        quantity: "20",
        unit: "kg/ha",
        // @ts-ignore
        type: "Phân bón",
      },
    ],
    tasks: [
      {
        id: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        name: "Đo chỉ số đất và ghi sổ theo dõi",
        description:
          "Đo pH và độ mặn tại 5 điểm chéo góc trên ruộng. Ghi kết quả vào sổ nhật ký. Nếu pH < 4.5 hoặc EC > 4 mS/cm phải báo cáo ngay để điều chỉnh.",
        labor: "1 người: Nguyễn Văn An",
        duration: "1 ngày",
        startDate: "2024-11-01",
        endDate: "2025-10-31",
        isRepeating: true,
        repeatDays: [7, 3, 5, 4],
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-104-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-104-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 105,
    code: "CV-LUA-OP-002",
    name: "Xử lý tuyến trùng và ngộ độc rơm rạ bằng Trichoderma",
    plan: "Kế hoạch thu hoạch và quản lý rơm rạ không đốt đồng",
    planId: 5,
    stage: "Thời kỳ Lúa chín và Thu hoạch",
    assignedTo: ["Đội Nông Hóa"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: [],
    startDate: "2024-11-05",
    endDate: "2024-11-07",
    priority: "high",
    status: "completed",
    description:
      "Phun nấm Trichoderma để phân hủy gốc rạ, ngừa ngộ độc hữu cơ (thúi rễ lúa) và diệt tuyến trùng rễ (Hirschmanniella spp.). Ủ rơm rạ tại chỗ thay vì đốt đồng.",
    createdAt: "2024-10-15",
    materials: [
      {
        id: 505,
        taskId: 205,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Nấm Trichoderma",
        quantity: "10",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Chế phẩm sinh học",
        materialType: "Vi sinh",
        materialName: "Trichoderma phân hủy rơm rạ",
      },
      {
        id: 521,
        taskId: 205,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Vôi bột nông nghiệp",
        quantity: "500",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Cải tạo đất",
        materialName: "Vôi bột nông nghiệp Ca(OH)2",
      },
    ],
    tasks: [
      {
        id: 205,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Phun Trichoderma lên gốc rạ",
        description:
          "Rải đều nấm Trichoderma (10kg/ha) kết hợp vôi bột (500kg/ha) lên gốc rạ sau khi máy gặt xong. Cày vùi hoặc để phân hủy tự nhiên trong 20-30 ngày.",
        labor: "3 người",
        duration: "3 ngày",
        startDate: "2024-11-05",
        endDate: "2024-11-07",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-105-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-105-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 106,
    code: "CV-LUA-OP-003",
    name: "Bón lót Phân hữu cơ Pellet-Chic và Lân",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
    assignedTo: ["Đội Canh tác"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: [],
    startDate: "2024-11-10",
    endDate: "2024-11-12",
    priority: "high",
    status: "completed",
    description:
      "Bón lót bằng phân hữu cơ Pellet-Chic (40 túi x 25kg = 1.000kg/ha) kết hợp Super Lân để cải tạo nền đất, giữ ẩm và hạ phèn trước khi gieo sạ.",
    createdAt: "2024-10-15",
    materials: [
      {
        id: 506,
        taskId: 206,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Phân hữu cơ Pellet-Chic",
        quantity: "40",
        unit: "túi (25kg)",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Hữu cơ",
        materialName: "Phân hữu cơ Pellet-Chic",
      },
      {
        id: 522,
        taskId: 206,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Lân Super Long Thành",
        quantity: "300",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Super Lân Long Thành (16% P2O5)",
      },
    ],
    tasks: [
      {
        id: 206,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Rải phân hữu cơ và lân trước khi bừa",
        description:
          "Rải đều 40 túi Pellet-Chic và 300kg Lân Super trên toàn bộ mặt ruộng trước khi bừa trục cuối cùng. Đảm bảo phân được vùi đều vào lớp đất mặt.",
        labor: "3 người",
        duration: "2 ngày",
        startDate: "2024-11-10",
        endDate: "2024-11-12",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-106-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-106-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 107,
    code: "CV-LUA-OP-004",
    name: "Phát cỏ bờ và xịt thuốc cỏ ruộng lúa",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
    assignedTo: ["Nhân công thời vụ"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: [],
    startDate: "2024-11-14",
    endDate: "2024-11-16",
    priority: "medium",
    status: "completed",
    description:
      "Phát cỏ trên bờ ruộng bằng máy cắt cỏ (nhân công làm từ 6h-13h). Đồng thời phun thuốc trừ cỏ tiền nảy mầm (Sofit 300EC) ngay 1-3 ngày sau sạ.",
    createdAt: "2024-10-25",
    materials: [
      {
        id: 507,
        taskId: 207,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Thuốc cỏ Sofit 300EC",
        quantity: "1.2",
        unit: "lít/ha",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ cỏ",
        materialName: "Sofit 300EC (tiền nảy mầm)",
      },
      {
        id: 523,
        taskId: 207,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Máy cắt cỏ đeo vai",
        quantity: "2",
        unit: "cái",
        type: "tool",
        materialCategory: "Nông cụ",
        materialType: "Máy cắt cỏ",
        materialName: "Máy cắt cỏ Honda GX35",
      },
    ],
    tasks: [
      {
        id: 207,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Phát cỏ bờ và phun thuốc cỏ tiền nảy mầm",
        description:
          "Phát cỏ bờ bằng máy cắt cỏ đeo vai. Phun Sofit 300EC lên mặt ruộng ngay 1-3 ngày sau sạ (khi cỏ chưa nảy mầm) để kiểm soát cỏ dại hiệu quả.",
        labor: "4 người",
        duration: "3 ngày",
        startDate: "2024-11-14",
        endDate: "2024-11-16",
        isRepeating: true,
        repeatDays: [7],
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-107-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-107-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 108,
    code: "CV-LUA-OP-005",
    name: "Gieo sạ lúa bằng Drone Nông nghiệp",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
    assignedTo: ["Đội Phi công UAV"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2024-11-15",
    endDate: "2024-11-15",
    priority: "high",
    status: "completed",
    description:
      "Sử dụng máy bay không người lái (DJI Agras T40) để gieo sạ giống ST25 (đã ngâm ủ nứt nanh) với mật độ 80kg/ha. Đảm bảo sạ đều, tỉ lệ phủ kín ≥ 95%.",
    createdAt: "2024-11-01",
    materials: [
      {
        id: 524,
        taskId: 208,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Hạt giống lúa ST25 đã ngâm ủ",
        quantity: "80",
        unit: "kg/ha",
        type: "other",
        materialCategory: "Giống",
        materialType: "Lúa thuần",
        materialName: "Hạt giống ST25 (đã ngâm ủ nứt nanh)",
      },
      {
        id: 525,
        taskId: 208,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Drone DJI Agras T40",
        quantity: "1",
        unit: "ca bay",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "UAV nông nghiệp",
        materialName: "DJI Agras T40 (40kg/lần nạp)",
      },
    ],
    tasks: [
      {
        id: 208,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Sạ lúa bằng Drone DJI Agras",
        description:
          "Nạp lúa giống (đã ngâm ủ nứt nanh) vào thùng chứa Drone. Bay ở độ cao 1.5-2m với tốc độ 4-5m/s. Rút cạn nước trên mặt ruộng trước khi sạ để giống tiếp đất đều.",
        labor: "2 người",
        duration: "1 ngày",
        startDate: "2024-11-15",
        endDate: "2024-11-15",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-108-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-108-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 109,
    code: "CV-LUA-OP-006",
    name: "Bón phân thúc đợt 1 (Đẻ nhánh)",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
    assignedTo: ["Đội Canh tác"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: [],
    startDate: "2024-11-25",
    endDate: "2024-11-26",
    priority: "high",
    status: "completed",
    description:
      "Đưa nước vào lấp xấp (1-3cm). Bón thúc 40% Đạm Urea và 20% Kali (khoảng 7-10 ngày sau sạ) để kích lúa đẻ nhánh mạnh.",
    createdAt: "2024-11-10",
    materials: [
      {
        id: 508,
        taskId: 209,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Đạm Urea Phú Mỹ",
        quantity: "50",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Đạm Urea Phú Mỹ (46% N)",
      },
      {
        id: 526,
        taskId: 209,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Kali Clorua (Kali đỏ)",
        quantity: "30",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Kali Clorua 60% K2O (Israel)",
      },
    ],
    tasks: [
      {
        id: 209,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Bón phân Urea + Kali giai đoạn đẻ nhánh",
        description:
          "Bón 50kg Urea + 30kg Kali Clorua/ha vào giai đoạn 7-10 ngày sau sạ. Giữ mực nước lấp xấp 1-3cm sau khi bón.",
        labor: "4 người",
        duration: "2 ngày",
        startDate: "2024-11-25",
        endDate: "2024-11-26",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-109-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-109-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 110,
    code: "CV-LUA-OP-007",
    name: "Điều tiết nước Tưới Ướt Khô Xen Kẽ (AWD)",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
    assignedTo: ["Đội Quản lý Thủy nông"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Kỹ"],
    qualityInspectors: [],
    startDate: "2024-12-05",
    endDate: "2024-12-25",
    priority: "high",
    status: "completed",
    description:
      "Vận hành máy bơm 9 ngựa rút cạn nước để mặt ruộng khô nứt nẻ chân chim (mực nước thấp hơn mặt đất 15cm) trong 10-15 ngày. Biện pháp AWD giúp rễ lúa ăn sâu, chống đổ ngã và giảm phát thải metan.",
    createdAt: "2024-11-20",
    materials: [
      {
        id: 527,
        taskId: 210,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Thước đo mực nước AWD",
        quantity: "5",
        unit: "cái",
        type: "tool",
        materialCategory: "Thiết bị đo",
        materialType: "Thước đo nước",
        materialName: "Ống PVC cắm ruộng đo mực nước AWD (dài 30cm)",
      },
    ],
    tasks: [
      {
        id: 210,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Xiết nước và kiểm soát mực nước AWD",
        description:
          "Bơm tháo nước ra kênh, cắm thước PVC đo mực nước. Khi mực nước thấp hơn mặt đất 15cm thì bơm nước trở lại. Lặp lại 3-4 lần trong vụ.",
        labor: "2 người",
        duration: "20 ngày",
        startDate: "2024-12-05",
        endDate: "2024-12-25",
        isRepeating: true,
        repeatDays: [1, 4],
        repeatWeeks: 3,
        geographicalSelections: [
          {
            id: "geo-110-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-110-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 111,
    code: "CV-LUA-OP-008",
    name: "Phun thuốc trị Đạo ôn và Cháy bìa lá",
    plan: "Kế hoạch né rầy và phòng trừ đạo ôn lúa Đài Thơm 8",
    planId: 4,
    stage: "101:Phun thuốc đặc trị Đạo ôn",
    assignedTo: ["Đội Phun thuốc"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Kỹ thuật viên BVTV"],
    startDate: "2024-12-30",
    endDate: "2024-12-31",
    priority: "high",
    status: "in-progress",
    description:
      "Sử dụng Aliette 800WG (trị nấm) và Ridomil Gold 68WG (trị vi khuẩn/vàng lá), chia làm 3 đợt phun/tháng vào giai đoạn lúa làm đòng và chuẩn bị trổ để bảo vệ bộ lá đòng.",
    createdAt: "2024-12-15",
    materials: [
      {
        id: 509,
        taskId: 211,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        name: "Aliette 800WG",
        quantity: "1",
        unit: "kg/ha",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ nấm",
        materialName: "Aliette 800WG (Fosetyl-Al - trị đạo ôn)",
      },
      {
        id: 510,
        taskId: 211,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        name: "Ridomil Gold 68WG",
        quantity: "1",
        unit: "kg/ha",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ bệnh",
        materialName: "Ridomil Gold 68WG (Metalaxyl - trị cháy bìa lá)",
      },
      {
        id: 528,
        taskId: 211,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        name: "Bình xịt điện chạy pin 16L",
        quantity: "4",
        unit: "cái",
        type: "tool",
        materialCategory: "Nông cụ",
        materialType: "Bình phun",
        materialName: "Bình xịt điện đeo vai 16L",
      },
    ],
    tasks: [
      {
        id: 211,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        name: "Phun xịt thuốc đặc trị bằng bình đeo lưng",
        description:
          "Pha Aliette 800WG (1kg/ha) + Ridomil Gold 68WG (1kg/ha) vào 400-500 lít nước/ha. Phun sương mịn ướt đều bộ lá lúa, đặc biệt tập trung vào cổ bông. Xịt lặp lại 3 lần/tháng.",
        labor: "4 người",
        duration: "2 ngày",
        startDate: "2024-12-30",
        endDate: "2024-12-31",
        isRepeating: true,
        repeatDays: [7, 16, 17],
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-111-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-111-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 112,
    code: "CV-LUA-OP-009",
    name: "Phun xịt rầy nâu và sâu đục thân",
    plan: "Kế hoạch né rầy và phòng trừ đạo ôn lúa Đài Thơm 8",
    planId: 4,
    stage: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
    assignedTo: ["Đội Phun thuốc UAV"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: [],
    startDate: "2025-01-10",
    endDate: "2025-01-11",
    priority: "high",
    status: "pending",
    description:
      "Phối trộn Padan 95SP (10 gói x 95,000đ) kết hợp Reasgant 3.6EC (2 chai/lần) phun thẳng xuống gốc lúa để trừ rầy nâu và sâu đục thân 2 chấm.",
    createdAt: "2024-12-20",
    materials: [
      {
        id: 511,
        taskId: 212,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        name: "Padan 95SP",
        quantity: "10",
        unit: "gói",
        type: "pesticide",
        materialCategory: "Thuốc BVTV",
        materialType: "Thuốc trừ sâu rầy",
        materialName: "Padan 95SP (Cartap - trừ sâu đục thân)",
      },
      {
        id: 512,
        taskId: 212,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        name: "Reasgant 3.6EC",
        quantity: "2",
        unit: "chai",
        type: "pesticide",
        materialCategory: "Thuốc sinh học",
        materialType: "Thuốc trừ sâu",
        materialName: "Reasgant 3.6EC (Abamectin - trừ rầy nâu)",
      },
      {
        id: 529,
        taskId: 212,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        name: "Drone phun thuốc DJI Agras T10",
        quantity: "1",
        unit: "ca bay",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "UAV phun thuốc",
        materialName: "DJI Agras T10 (bình 10L/lần nạp)",
      },
    ],
    tasks: [
      {
        id: 212,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        name: "Phun UAV trừ rầy nâu và sâu đục thân",
        description:
          "Pha Padan 95SP + Reasgant 3.6EC vào thùng Drone. Bay ở độ cao 1m, tốc độ 3m/s, phun tập trung gốc lúa. Phun khi mật độ rầy > 3 con/dảnh hoặc phát hiện sâu đục thân.",
        labor: "2 người",
        duration: "2 ngày",
        startDate: "2025-01-10",
        endDate: "2025-01-11",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-112-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-112-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 113,
    code: "CV-LUA-OP-010",
    name: "Bón phân đợt 3 (Đón đòng)",
    plan: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân",
    planId: 1,
    stage: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
    assignedTo: ["Đội Canh tác"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: [],
    startDate: "2025-01-15",
    endDate: "2025-01-16",
    priority: "high",
    status: "pending",
    description:
      "Khi lúa có tim đèn (khoảng 40-45 ngày sau sạ), bón NPK 15-5-12 và tăng cường Kali để giúp bông lúa to, hạt sáng mẩy, chống đổ ngã.",
    createdAt: "2025-01-01",
    materials: [
      {
        id: 513,
        taskId: 213,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "NPK 15-5-12+TE",
        quantity: "150",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân hỗn hợp",
        materialName: "NPK 15-5-12+TE (Việt Nhật/Bình Điền)",
      },
      {
        id: 530,
        taskId: 213,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Kali Sunfat K2SO4",
        quantity: "50",
        unit: "kg/ha",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Kali Sunfat 50% K2O (tăng chất lượng hạt)",
      },
    ],
    tasks: [
      {
        id: 213,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Bón phân NPK + Kali Sunfat giai đoạn đón đòng",
        description:
          "Quan sát khi lúa xuất hiện tim đèn (cổ bông nhú cao 1-2cm). Bón 150kg NPK 15-5-12 + 50kg K2SO4/ha. Giữ mực nước 3-5cm sau khi bón để phân tan đều.",
        labor: "4 người",
        duration: "2 ngày",
        startDate: "2025-01-15",
        endDate: "2025-01-16",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-113-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-113-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 114,
    code: "CV-LUA-OP-011",
    name: "Rút cạn nước mặt ruộng cuối vụ",
    plan: "Kế hoạch thu hoạch và quản lý rơm rạ không đốt đồng",
    planId: 5,
    stage: "Thời kỳ Lúa chín và Thu hoạch",
    assignedTo: ["Đội Quản lý Thủy nông"],
    assignedType: "individual",
    supervisors: ["Nguyễn Văn Kỹ"],
    qualityInspectors: [],
    startDate: "2025-02-15",
    endDate: "2025-02-25",
    priority: "medium",
    status: "pending",
    description:
      "Ngưng cấp nước hoàn toàn và tháo khô ruộng trước ngày thu hoạch dự kiến từ 7-10 ngày để lúa chín đồng đều và làm cứng mặt ruộng, chịu tải được máy gặt đập liên hợp.",
    createdAt: "2025-01-20",
    materials: [
      {
        id: 531,
        taskId: 214,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Máy bơm điện 5HP thuê",
        quantity: "1",
        unit: "ca máy",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "Máy bơm",
        materialName: "Máy bơm điện 5HP (rút nước cạn ruộng)",
      },
    ],
    tasks: [
      {
        id: 214,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Rút cạn nước và kiểm tra độ chín của lúa",
        description:
          "Tháo nước cạn ruộng 7-10 ngày trước thu hoạch. Kiểm tra độ chín: lúa vàng 85-90%, hạt cứng khi cắn. Mặt ruộng phải đủ khô để máy gặt vào không bị lún.",
        labor: "2 người",
        duration: "10 ngày",
        startDate: "2025-02-15",
        endDate: "2025-02-25",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-114-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-114-main",
        type: "region",
        regionId: "1",
      },
    ],
  },
  {
    id: 115,
    code: "CV-LUA-OP-012",
    name: "Thu hoạch cơ giới và xử lý rơm rạ",
    plan: "Kế hoạch thu hoạch và quản lý rơm rạ không đốt đồng",
    planId: 5,
    stage: "Thời kỳ Lúa chín và Thu hoạch",
    assignedTo: ["Đội Thu hoạch"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Kiểm định viên chất lượng"],
    startDate: "2025-02-26",
    endDate: "2025-02-28",
    priority: "high",
    status: "pending",
    description:
      "Sử dụng máy gặt đập liên hợp thu hoạch khi lúa chín 85-90%. Thu gom thóc đưa đi sấy. Rơm rạ dùng máy cuộn đem ra khỏi ruộng bán hoặc ủ nấm, không đốt đồng phát thải.",
    createdAt: "2025-01-20",
    materials: [
      {
        id: 514,
        taskId: 215,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Bao đựng lúa 50kg",
        quantity: "200",
        unit: "cái",
        type: "tool",
        materialCategory: "Vật tư thu hoạch",
        materialType: "Bao bì",
        materialName: "Bao tải 50kg (PP dệt)",
      },
      {
        id: 532,
        taskId: 215,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Máy gặt đập liên hợp Kubota",
        quantity: "1",
        unit: "ca máy",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "Máy gặt lúa",
        materialName: "Máy gặt đập Kubota DC-70G (70HP)",
      },
      {
        id: 533,
        taskId: 215,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Máy cuộn rơm tự động",
        quantity: "1",
        unit: "ca máy",
        type: "tool",
        materialCategory: "Máy móc",
        materialType: "Máy cuộn rơm",
        materialName: "Máy cuộn rơm tự động (100 cuộn/giờ)",
      },
    ],
    tasks: [
      {
        id: 215,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        name: "Thu hoạch bằng máy gặt đập liên hợp",
        description:
          "Vận hành máy gặt Kubota thu hoạch khi lúa chín 85-90%. Theo sau là máy cuộn rơm. Thóc đưa ngay về sân phơi/lò sấy. Độ ẩm sau thu hoạch thường 22-25%, cần sấy về 14% để bảo quản.",
        labor: "5 người",
        duration: "3 ngày",
        startDate: "2025-02-26",
        endDate: "2025-02-28",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-115-t1",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-115-main",
        type: "region",
        regionId: "1",
      },
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
