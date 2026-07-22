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

// export const initialPlans: Plan[] = [
//   // 1. KẾ HOẠCH CANH TÁC (CULTIVATION): Làm bông nghịch vụ sầu riêng Ri6
//   {
//     id: 1,
//     code: "PLN-2024-001",
//     name: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
//     description:
//       "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ cho sầu riêng Ri6 nhằm đón giá cao dịp cuối năm.",
//     seasonId: "S002",
//     seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
//     startDate: "2024-05-15", // Tháng 4-5 âm lịch [3]
//     endDate: "2024-11-30",
//     selectedRegionIds: ["REG-01"],
//     selectedZoneIds: ["ZONE-01-A"],
//     selectedPlotIds: ["PLOT-001", "PLOT-002"],
//     crop: "Sầu riêng",
//     variety: "Sầu riêng Ri6",
//     purpose: "cultivation",
//     area: "3.5",
//     expectedYield: "60",
//     growthCycleId: "GC003", // Quy trình Ri6 nghịch vụ
//     selectedStages: [
//       "Dằn lân, tạo mầm & Phủ bạt xiết nước",
//       "Dỡ bạt, nhấp nước & Kéo mắt cua",
//     ],
//     materialAllocations: [
//       {
//         id: 101,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         materialCategory: "Phân bón",
//         materialType: "Phân vô cơ",
//         materialName: "Phân Lân (DAP hoặc Super Lân)",
//         quantity: "4",
//         unit: "kg/cây",
//       },
//       {
//         id: 102,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         materialCategory: "Thuốc điều hòa sinh trưởng",
//         materialType: "Paclobutrazol",
//         materialName: "Paclobutrazol 25SC",
//         quantity: "5",
//         unit: "lít",
//       },
//       {
//         id: 103,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         materialCategory: "Phân bón lá",
//         materialType: "Phân vô cơ",
//         materialName: "MKP (0-52-34) hoặc NPK 10-60-10",
//         quantity: "5",
//         unit: "kg",
//       },
//       {
//         id: 104,
//         stageId: "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
//         materialCategory: "Hóa chất",
//         materialType: "Phá miên trạng",
//         materialName: "KNO3 (Nitrat Kali)",
//         quantity: "2",
//         unit: "kg",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 201,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Bón lân tạo mầm và Xiết nước",
//         description:
//           "Bón lân gốc khi cơi đọt cuối chuyển lụa. Dọn sạch cỏ gốc và xiết cạn nước mương tạo khô hạn 10-14 ngày.",
//         labor: "3 người",
//         duration: "14 ngày",
//       },
//       {
//         id: 202,
//         stageId: "Dỡ bạt nilon và phun Paclobutrazol",
//         name: "Đậy bạt nilon và phun Paclobutrazol",
//         description:
//           "Phủ kín bạt nilon quanh gốc cản nước mưa. Phun Paclobutrazol 25SC 1 lần duy nhất vào dạ dưới cành.",
//         labor: "4 người",
//         duration: "2 ngày",
//       },
//       {
//         id: 203,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Phun tạo mầm lá",
//         description:
//           "Phun MKP 0-52-34 hoặc 10-60-10 qua 3 cử cách nhau 7-10 ngày để đẩy nhanh quá trình phân chia tế bào mầm hoa.",
//         labor: "2 người",
//         duration: "3 ngày",
//       },
//       {
//         id: 204,
//         stageId: "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
//         name: "Phun phá miên trạng kích mắt cua",
//         description:
//           "Phun KNO3 (5-10g/lít) để phá miên trạng, kích mầm hoa bung đồng loạt sau khi dỡ bạt.",
//         labor: "2 người",
//         duration: "1 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-05-01",
//   },

//   // 2. KẾ HOẠCH CẢI TẠO (AMENDMENT): Phục hồi vườn sầu riêng sau thu hoạch
//   {
//     id: 2,
//     code: "PLN-2024-002",
//     name: "Kế hoạch phục hồi vườn Sầu riêng Monthong sau thu hoạch",
//     description:
//       "Cắt tỉa cành, rửa vườn và bón phân hữu cơ kết hợp nấm đối kháng để phục hồi bộ rễ, chuẩn bị cho cơi đọt mới.",
//     seasonId: "S003",
//     seasonName: "Chính vụ Đông Nam Bộ",
//     startDate: "2024-08-01",
//     endDate: "2024-09-30",
//     selectedRegionIds: ["REG-02"],
//     selectedZoneIds: ["ZONE-02-B"],
//     selectedPlotIds: ["PLOT-005"],
//     crop: "Sầu riêng",
//     variety: "Sầu riêng Monthong (Dona)",
//     purpose: "amendment",
//     area: "5.0",
//     expectedYield: "0", // Giai đoạn phục hồi không có sản lượng
//     growthCycleId: "GC001",
//     selectedStages: ["Phục hồi sau thu hoạch & Làm cơi đọt"],
//     materialAllocations: [
//       {
//         id: 103,
//         stageId: "GC001:Phục hồi sau thu hoạch & Làm cơi đọt",
//         materialCategory: "Phân bón",
//         materialType: "Phân hữu cơ vi sinh",
//         materialName: "Phân chuồng hoai mục ủ Trichoderma",
//         quantity: "25",
//         unit: "kg/cây",
//       },
//       {
//         id: 104,
//         stageId: "GC001:Phục hồi sau thu hoạch & Làm cơi đọt",
//         materialCategory: "Chế phẩm sinh học",
//         materialType: "Kích rễ",
//         materialName: "Acid Plus (Humic + Fulvic + Axit Amin)",
//         quantity: "15",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 203,
//         stageId: "GC001:Phục hồi sau thu hoạch & Làm cơi đọt",
//         name: "Cắt tỉa cành và xịt rửa vườn",
//         description:
//           "Cắt bỏ cành bơi, cành sâu bệnh, quét vôi hoặc xịt Booc-đô/thuốc gốc Đồng sát khuẩn diệt mầm bệnh.",
//         labor: "5 người",
//         duration: "5 ngày",
//       },
//       {
//         id: 204,
//         stageId: "GC001:Phục hồi sau thu hoạch & Làm cơi đọt",
//         name: "Bón phân hữu cơ và tưới kích rễ",
//         description:
//           "Xới nhẹ tầng đất mặt, bón phân chuồng ủ nấm đối kháng Trichoderma và tưới Acid Plus để phục hồi rễ tơ.",
//         labor: "3 người",
//         duration: "3 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-07-20",
//   },

//   {
//     id: 3,
//     code: "PLN-TREAT-003",
//     name: "Kế hoạch điều trị bệnh thán thư sầu riêng",
//     description:
//       "Áp dụng phác đồ PT001: Hết triệu chứng thán thư sau 14 ngày, cây ra đọt non khỏe. Diệt nấm và phục hồi lá.",
//     seasonId: "S-2025",
//     seasonName: "Vụ mùa 2025",
//     startDate: "2025-01-15",
//     endDate: "2025-01-29", // Tổng thời gian 14 ngày
//     selectedRegionIds: ["REG-01"],
//     selectedZoneIds: ["ZONE-01"],
//     selectedPlotIds: ["PLOT-01"],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "treatment",
//     growthCycleId: "GC001",
//     regimenId: "1", // Lấy chính xác từ id: 1 của initialTreatments trong source [1]
//     selectedStages: ["Ra hoa & Đậu quả"],
//     materialAllocations: [
//       {
//         id: 1001,
//         stageId: "Ra hoa & Đậu quả",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Mancozeb 80% WP",
//         quantity: "2",
//         unit: "g/l",
//       },
//       {
//         id: 1002,
//         stageId: "Ra hoa & Đậu quả",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Carbendazim 50% WP",
//         quantity: "1.5",
//         unit: "g/l",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 2001,
//         stageId: "Ra hoa & Đậu quả",
//         name: "Phun thuốc phòng ngừa",
//         description:
//           "Phun xịt hóa học toàn bộ tán lá, tập trung vào mặt dưới lá. Tránh phun khi nắng gắt.",
//         labor: "2 người",
//         duration: "1 ngày",
//       },
//       {
//         id: 2002,
//         stageId: "Ra hoa & Đậu quả",
//         name: "Điều trị chính",
//         description:
//           "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
//         labor: "2 người",
//         duration: "4 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2025-01-15",
//   },
//   {
//     id: 4,
//     code: "PLN-TREAT-004",
//     name: "Kế hoạch cấp cứu Xì mủ Sầu riêng diện rộng",
//     description:
//       "Áp dụng phác đồ ICU-PHYT-2026: Cấp cứu vườn bị xì mủ do Phytophthora (mức độ M4 - Khủng hoảng nguy cơ chết cây).",
//     seasonId: "S-2026",
//     seasonName: "Vụ mùa 2026",
//     startDate: "2026-01-01",
//     endDate: "2026-03-31", // Tổng thời gian 3 tháng
//     selectedRegionIds: ["REG-02"],
//     selectedZoneIds: ["ZONE-02"],
//     selectedPlotIds: ["PLOT-02"],
//     crop: "Sầu riêng",
//     variety: "Nâng cao",
//     purpose: "treatment",
//     growthCycleId: "GC001",
//     regimenId: "3", // Lấy chính xác từ id: 3 của initialTreatments trong source [1]
//     selectedStages: ["Điều trị xì mủ"],
//     materialAllocations: [
//       {
//         id: 3001,
//         stageId: "Điều trị xì mủ",
//         materialCategory: "Chế phẩm vi sinh",
//         materialType: "fertilizer",
//         materialName: "Bzym+ (10^15 CFU/mL)",
//         quantity: "1",
//         unit: "l/100l",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 4001,
//         stageId: "Điều trị xì mủ",
//         name: "Đổ ải vi sinh (Root Drench)",
//         description:
//           "Tưới gốc đặc trị. Pha Bzym+ mật độ cao tưới đẫm vùng rễ để tiêu diệt nấm Phytophthora và tạo biển lợi khuẩn quanh gốc.",
//         labor: "3 người",
//         duration: "30 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2026-01-01",
//   },

//   // 3. KẾ HOẠCH ĐIỀU TRỊ (TREATMENT): Quản lý nứt thân xì mủ và rầy xanh
//   {
//     id: 5,
//     code: "PLN-2024-005",
//     name: "Kế hoạch phòng trị bệnh nứt thân xì mủ mùa mưa",
//     description:
//       "Xử lý triệt để nấm Phytophthora palmivora gây bệnh nứt thân xì mủ và quản lý rầy xanh bảo vệ cơi đọt non.",
//     seasonId: "S004",
//     seasonName: "Chính vụ Tây Nguyên",
//     startDate: "2024-09-10",
//     endDate: "2024-10-10",
//     selectedRegionIds: ["REG-03"],
//     selectedZoneIds: ["ZONE-03-C"],
//     selectedPlotIds: ["PLOT-010", "PLOT-011"],
//     crop: "Sầu riêng",
//     variety: "Sầu riêng Musang King",
//     purpose: "treatment",
//     area: "2.0",
//     growthCycleId: "GC005",
//     selectedStages: ["Quản lý sâu bệnh và đọt non"],
//     materialAllocations: [
//       {
//         id: 105,
//         stageId: "Quản lý sâu bệnh và đọt non",
//         materialCategory: "Thuốc BVTV",
//         materialType: "Thuốc trừ nấm bệnh",
//         materialName: "Thuốc gốc Đồng / Metalaxyl",
//         quantity: "10",
//         unit: "lít",
//       },
//       {
//         id: 106,
//         stageId: "Quản lý sâu bệnh và đọt non",
//         materialCategory: "Thuốc BVTV",
//         materialType: "Thuốc trừ sâu rầy",
//         materialName: "Thuốc đặc trị rầy xanh, nhện đỏ",
//         quantity: "5",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 205,
//         stageId: "Quản lý sâu bệnh và đọt non",
//         name: "Điều trị nứt thân xì mủ",
//         description:
//           "Cạo sạch vết bệnh xì mủ trên thân, quét thuốc đặc trị gốc đồng hoặc Metalaxyl để diệt nấm Phytophthora.",
//         labor: "2 người",
//         duration: "7 ngày",
//         isRepeating: true,
//         repeatDays: [13, 14], // Lặp lại sau 3 ngày và 7 ngày
//       },
//       {
//         id: 206,
//         stageId: "Quản lý sâu bệnh và đọt non",
//         name: "Phun bảo vệ cơi đọt mũi giáo",
//         description:
//           "Phun thuốc đặc trị rầy xanh ngay khi đọt non nhú mũi giáo để bảo vệ dàn lá.",
//         labor: "2 người",
//         duration: "2 ngày",
//       },
//     ],
//     status: "draft",
//     createdAt: "2024-09-05",
//   },

//   // 4. KẾ HOẠCH THU HOẠCH (HARVEST): Cắt nước và thu hoạch sầu riêng
//   {
//     id: 6,
//     code: "PLN-2024-006",
//     name: "Kế hoạch cắt nước và thu hoạch sầu riêng Thái (Monthong)",
//     description:
//       "Thực hiện siết nước cuối vụ để ráo cơm, lên màu đẹp và tiến hành cắt trái chuẩn xuất khẩu.",
//     seasonId: "S001",
//     seasonName: "Chính vụ Đồng bằng sông Cửu Long",
//     startDate: "2024-04-15",
//     endDate: "2024-05-15",
//     selectedRegionIds: ["REG-01"],
//     selectedZoneIds: ["ZONE-01-B"],
//     selectedPlotIds: ["PLOT-008"],
//     crop: "Sầu riêng",
//     variety: "Sầu riêng Monthong (Dona)",
//     purpose: "harvest",
//     area: "4.0",
//     expectedYield: "80", // 80 tấn
//     growthCycleId: "GC004",
//     selectedStages: ["Nuôi trái vô cơm & Thu hoạch"],
//     materialAllocations: [
//       {
//         id: 107,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch",
//         materialCategory: "Dụng cụ nông nghiệp",
//         materialType: "Vật tư thu hoạch",
//         materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//         quantity: "50",
//         unit: "cái",
//       },
//       {
//         id: 108,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch",
//         materialCategory: "Chất điều hòa sinh trưởng",
//         materialType: "Hóa chất",
//         materialName: "Ethephon",
//         quantity: "2",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 207,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch",
//         name: "Cắt nước trước thu hoạch",
//         description:
//           "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến từ 15 - 20 ngày để sầu riêng ráo cơm, độ béo cao, không bị sượng nước.",
//         labor: "1 người",
//         duration: "15 ngày",
//       },
//       {
//         id: 208,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch",
//         name: "Cắt trái và phân loại",
//         description:
//           "Đánh giá độ chín sinh lý (tuổi trái). Cắt trái nhẹ nhàng, phân loại hàng xuất khẩu (Loại A, B) và hàng xô cấp đông.",
//         labor: "8 người",
//         duration: "7 ngày",
//       },
//       {
//         id: 209,
//         stageId: "Xử lý chín đồng loạt bằng Ethephon",
//         name: "Xử lý chín đồng loạt bằng Ethephon",
//         description:
//           "Xử lý trái sau khi cắt bằng Ethephon nồng độ 45 - 270 ppm để kích thích sản sinh ethylene, giúp toàn bộ lô hàng chín đồng loạt sau 3-5 ngày phục vụ xuất khẩu.",
//         labor: "3 người",
//         duration: "2 ngày",
//       },
//     ],
//     status: "completed",
//     createdAt: "2024-04-01",
//   },
//   {
//     id: 7,
//     code: "PLN-2024-007",
//     name: "Kế hoạch nuôi trái sầu riêng Monthong (Chống sượng, vô cơm)",
//     description:
//       "Cung cấp dinh dưỡng phân kỳ theo tuổi trái, tỉa trái non sinh lý và bón Kali Sulphate để lên cơm vàng, tránh sượng múi.",
//     seasonId: "S001",
//     seasonName: "Chính vụ Đông Nam Bộ",
//     startDate: "2024-02-01",
//     endDate: "2024-06-15", // Thời gian nuôi trái Monthong kéo dài khoảng 120-135 ngày
//     selectedRegionIds: ["REG-02"],
//     selectedZoneIds: ["ZONE-02-A"],
//     selectedPlotIds: ["PLOT-005"],
//     crop: "Sầu riêng",
//     variety: "Sầu riêng Monthong (Dona)",
//     purpose: "cultivation",
//     area: "4.0",
//     expectedYield: "80",
//     growthCycleId: "GC004",
//     selectedStages: ["Đậu quả, nuôi quả và thu hoạch"],
//     materialAllocations: [
//       {
//         id: 108,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         materialCategory: "Phân bón",
//         materialType: "Phân vô cơ",
//         materialName: "NPK 15-15-15",
//         quantity: "1",
//         unit: "kg/cây/lần",
//       },
//       {
//         id: 109,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         materialCategory: "Phân bón",
//         materialType: "Phân vô cơ",
//         materialName: "Kali Sulphate (K2SO4 - Kali trắng)",
//         quantity: "0.5",
//         unit: "kg/cây/lần",
//       },
//       {
//         id: 110,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         materialCategory: "Phân bón lá",
//         materialType: "Vi lượng",
//         materialName: "Canxi-Bo",
//         quantity: "1",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 209,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         name: "Tỉa trái non (3 đợt)",
//         description:
//           "Đợt 1 (sau 10 ngày) loại quả dị dạng. Đợt 2 (sau 20 ngày) tỉa quả méo. Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
//         labor: "4 người",
//         duration: "20 ngày",
//         isRepeating: true,
//         repeatDays: [7 - 9],
//       },
//       {
//         id: 210,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         name: "Bón NPK cân bằng (Giai đoạn đầu)",
//         description:
//           "Bón NPK 15-15-15 định kỳ 8-10 ngày/lần để thúc trái lớn nhanh trong 60 ngày đầu.",
//         labor: "2 người",
//         duration: "2 ngày",
//         isRepeating: true,
//         repeatDays: [7 - 12],
//       },
//       {
//         id: 211,
//         stageId: "Đậu quả, nuôi quả và thu hoạch",
//         name: "Bón Kali trắng vô cơm (Giai đoạn cuối)",
//         description:
//           "Khi trái đạt 60 ngày tuổi, chuyển sang bón Kali Sulphate để trái ráo cơm, lên màu, tuyệt đối không dùng Kali đỏ (Clorua).",
//         labor: "2 người",
//         duration: "2 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-01-20",
//   },
// ];

export const initialPlans: Plan[] = [
  // // 1. KẾ HOẠCH CANH TÁC: LÀM BÔNG NGHỊCH VỤ SẦU RIÊNG RI6
  // // Vùng: ĐBSCL | Mùa vụ: S002 (Nghịch vụ Ri6 ĐBSCL) | Chu kỳ: GC003 (Ri6 Nghịch vụ)
  // {
  //   id: 1,
  //   code: "PLN-2024-001",
  //   name: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
  //   description:
  //     "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ cho sầu riêng Ri6.",
  //   seasonId: "S002",
  //   seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
  //   startDate: "2024-05-15",
  //   endDate: "2024-11-30",
  //   selectedRegionIds: ["REG-01"],
  //   selectedZoneIds: ["ZONE-01-A"],
  //   selectedPlotIds: ["PLOT-001", "PLOT-002"],
  //   crop: "Sầu riêng",
  //   variety: "Sầu riêng Ri6",
  //   purpose: "cultivation",
  //   area: "3.5",
  //   expectedYield: "60",
  //   growthCycleId: "GC003",
  //   selectedStages: [
  //     "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //     "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
  //   ],
  //   materialAllocations: [
  //     {
  //       id: 101,
  //       stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //       materialCategory: "Phân bón",
  //       materialType: "Phân vô cơ",
  //       materialName: "Phân Lân (DAP hoặc Super Lân)",
  //       quantity: "4",
  //       unit: "kg/cây",
  //     },
  //     {
  //       id: 102,
  //       stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //       materialCategory: "Thuốc điều hòa sinh trưởng",
  //       materialType: "Paclobutrazol",
  //       materialName: "Paclobutrazol 25SC",
  //       quantity: "5",
  //       unit: "lít",
  //     },
  //     {
  //       id: 103,
  //       stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //       materialCategory: "Phân bón lá",
  //       materialType: "Phân vô cơ",
  //       materialName: "MKP (0-52-34) hoặc NPK 10-60-10",
  //       quantity: "5",
  //       unit: "kg",
  //     },
  //     {
  //       id: 104,
  //       stageId: "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
  //       materialCategory: "Hóa chất",
  //       materialType: "Phá miên trạng",
  //       materialName: "KNO3 (Nitrat Kali)",
  //       quantity: "2",
  //       unit: "kg",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 201,
  //       stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //       name: "Bón lân tạo mầm và Xiết nước",
  //       description:
  //         "Bón lân gốc khi cơi đọt cuối chuyển lụa. Dọn sạch cỏ gốc và xiết cạn nước mương tạo khô hạn.",
  //       labor: "3 người",
  //       duration: "14 ngày",
  //     },
  //     {
  //       id: 202,
  //       stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
  //       name: "Phun tạo mầm và đậy bạt nilon",
  //       description:
  //         "Phủ kín bạt nilon quanh gốc cản nước mưa. Phun Paclobutrazol 25SC 1 lần vào dạ dưới cành.",
  //       labor: "4 người",
  //       duration: "3 ngày",
  //     },
  //     {
  //       id: 203,
  //       stageId: "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
  //       name: "Dỡ bạt và Phun phá miên trạng",
  //       description:
  //         "Khi mắt cua sáng 70-80%, dỡ bạt. Phun KNO3 để phá miên trạng kích mắt cua đâm đồng loạt.",
  //       labor: "2 người",
  //       duration: "2 ngày",
  //     },
  //   ],
  //   status: "active",
  //   createdAt: "2024-05-01",
  // },

  // // 2. KẾ HOẠCH CẢI TẠO: PHỤC HỒI SAU THU HOẠCH
  // // Vùng: Đông Nam Bộ | Mùa vụ: S003 (Chính vụ ĐNB) | Chu kỳ: GC001 (Thuận vụ chung)
  // {
  //   id: 2,
  //   code: "PLN-2024-002",
  //   name: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
  //   description:
  //     "Áp dụng phác đồ PD-SOIL-HCDF-2026: Khơi rãnh thoát nước, xới nhẹ mặt đất, bón phân hữu cơ và vi sinh để phục hồi rễ tơ, điều chỉnh cấu trúc và pH đất.",
  //   seasonId: "S003",
  //   seasonName: "Chính vụ Đông Nam Bộ",
  //   startDate: "2024-08-01",
  //   endDate: "2024-09-30",
  //   selectedRegionIds: ["REG-02"],
  //   selectedZoneIds: ["ZONE-02-B"],
  //   selectedPlotIds: ["PLOT-005"],
  //   crop: "Sầu riêng",
  //   variety: "Sầu riêng Monthong (Dona)",
  //   purpose: "amendment",
  //   growthCycleId: "",
  //   regimenId: "4",
  //   selectedStages: [
  //     "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
  //     "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
  //   ],
  //   status: "active",
  //   materialAllocations: [
  //     {
  //       id: 105,
  //       stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
  //       materialCategory: "Phân bón",
  //       materialType: "Phân hữu cơ",
  //       materialName: "Phân hữu cơ hoai mục",
  //       quantity: "25",
  //       unit: "kg/cây",
  //     },
  //     {
  //       id: 106,
  //       stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
  //       materialCategory: "Chế phẩm vi sinh",
  //       materialType: "fertilizer",
  //       materialName: "Ozym (Bào tử vi sinh)",
  //       quantity: "100",
  //       unit: "g/gốc",
  //     },
  //     {
  //       id: 107,
  //       stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
  //       materialCategory: "Chế phẩm vi sinh",
  //       materialType: "fertilizer",
  //       materialName: "Bzym+ (10^15 CFU/mL)",
  //       quantity: "500",
  //       unit: "ml/gốc",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 204,
  //       stageId: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
  //       name: "Khơi rãnh thoát nước và xới nhẹ mặt đất",
  //       description:
  //         "Thoát nước khẩn cấp, xới nhẹ lớp mặt tăng thông thoáng, thu gom tàn dư thối, quả rụng đem tiêu hủy để dọn nguồn bệnh.",
  //       labor: "5 người",
  //       duration: "7 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "geo-reg02-a",
  //           type: "region",
  //           regionId: "REG-02",
  //         },
  //       ],
  //     },
  //     {
  //       id: 205,
  //       stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
  //       name: "Bón phân hữu cơ và tưới vi sinh",
  //       description:
  //         "Bón vôi/Dolomite khử chua. Rải Ozym kết hợp phân hữu cơ hoai mục để phân hủy rễ thối. Tưới Bzym+ để thiết lập quần thể vi sinh bảo vệ rễ.",
  //       labor: "3 người",
  //       duration: "30 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "geo-reg02-b",
  //           type: "region",
  //           regionId: "REG-02",
  //         },
  //       ],
  //     },
  //   ],
  //   area: "5.0",
  //   expectedYield: "0",
  //   createdAt: "2024-07-20",
  // },

  // // 3. KẾ HOẠCH ĐIỀU TRỊ: BỆNH THÁN THƯ GIAI ĐOẠN RA HOA
  // // Vùng: ĐBSCL | Mùa vụ: S001 (Chính vụ ĐBSCL) | Chu kỳ: GC001 (Thuận vụ chung)
  // {
  //   id: 3,
  //   code: "PLN-TREAT-001",
  //   name: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
  //   description:
  //     "Phác đồ PT001: Hết triệu chứng thán thư sau 14 ngày, bảo vệ hoa và lá lụa. Diệt nấm và phục hồi.",
  //   seasonId: "S001",
  //   seasonName: "Chính vụ Đồng bằng sông Cửu Long",
  //   startDate: "2025-01-15",
  //   endDate: "2025-01-29",
  //   selectedRegionIds: ["REG-01"],
  //   selectedZoneIds: ["ZONE-01"],
  //   selectedPlotIds: ["PLOT-01"],
  //   crop: "Sầu riêng",
  //   variety: "Monthon",
  //   purpose: "treatment",
  //   growthCycleId: "",
  //   regimenId: "1",
  //   selectedStages: ["1:Phun thuốc phòng ngừa", "1:Điều trị chính"],
  //   status: "active",
  //   materialAllocations: [
  //     {
  //       id: 107,
  //       stageId: "1:Phun thuốc phòng ngừa",
  //       materialCategory: "Thuốc BVTV (Hóa học)",
  //       materialType: "pesticide",
  //       materialName: "Mancozeb 80% WP",
  //       quantity: "2",
  //       unit: "g/l",
  //     },
  //     {
  //       id: 108,
  //       stageId: "1:Điều trị chính",
  //       materialCategory: "Thuốc BVTV (Hóa học)",
  //       materialType: "pesticide",
  //       materialName: "Carbendazim 50% WP",
  //       quantity: "1.5",
  //       unit: "g/l",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 206,
  //       stageId: "1:Phun thuốc phòng ngừa",
  //       name: "Phun thuốc phòng ngừa",
  //       description:
  //         "Phun xịt hóa học toàn bộ tán lá, tập trung vào mặt dưới lá. Tránh phun khi nắng gắt.",
  //       labor: "2 người",
  //       duration: "1 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "geo-reg01-a",
  //           type: "region",
  //           regionId: "REG-01",
  //         },
  //       ],
  //     },
  //     {
  //       id: 207,
  //       stageId: "1:Điều trị chính",
  //       name: "Điều trị chính",
  //       description:
  //         "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
  //       labor: "2 người",
  //       duration: "4 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "geo-reg01-b",
  //           type: "region",
  //           regionId: "REG-01",
  //         },
  //       ],
  //     },
  //   ],
  //   area: "2.5",
  //   createdAt: "2025-01-05",
  // },

  // // 4. KẾ HOẠCH CANH TÁC: NUÔI TRÁI VÀ CHỐNG SƯỢNG ĐÔNG NAM BỘ
  // // Vùng: Đông Nam Bộ | Mùa vụ: S003 (Chính vụ ĐNB) | Chu kỳ: GC004 (Monthong)
  // {
  //   id: 4,
  //   code: "PLN-2024-004",
  //   name: "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
  //   description:
  //     "Cung cấp dinh dưỡng phân kỳ theo tuổi trái, tỉa trái non sinh lý và bón Kali Sulphate để lên cơm vàng.",
  //   seasonId: "S003",
  //   seasonName: "Chính vụ Đông Nam Bộ",
  //   startDate: "2024-03-01",
  //   endDate: "2024-06-30",
  //   selectedRegionIds: ["REG-02"],
  //   selectedZoneIds: ["ZONE-02-A"],
  //   selectedPlotIds: ["PLOT-005"],
  //   crop: "Sầu riêng",
  //   variety: "Sầu riêng Monthong (Dona)",
  //   purpose: "cultivation",
  //   area: "4.0",
  //   expectedYield: "80",
  //   growthCycleId: "GC004",
  //   selectedStages: ["GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)"],
  //   materialAllocations: [
  //     {
  //       id: 109,
  //       stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
  //       materialCategory: "Phân bón",
  //       materialType: "Phân vô cơ",
  //       materialName: "NPK 15-15-15",
  //       quantity: "1",
  //       unit: "kg/cây/lần",
  //     },
  //     {
  //       id: 110,
  //       stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
  //       materialCategory: "Phân bón",
  //       materialType: "Phân vô cơ",
  //       materialName: "Kali Sulphate (K2SO4 - Kali trắng)",
  //       quantity: "0.5",
  //       unit: "kg/cây/lần",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 207,
  //       stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
  //       name: "Tỉa trái non (3 đợt)",
  //       description:
  //         "Đợt 1 (sau 10 ngày), Đợt 2 (sau 20 ngày), Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
  //       labor: "4 người",
  //       duration: "20 ngày",
  //     },
  //     {
  //       id: 208,
  //       stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
  //       name: "Bón NPK cân bằng và Kali trắng vô cơm",
  //       description:
  //         "Bón NPK 15-15-15 định kỳ 8-10 ngày/lần. Khi trái đạt 60 ngày tuổi, chuyển sang bón Kali Sulphate.",
  //       labor: "2 người",
  //       duration: "10 ngày",
  //     },
  //   ],
  //   status: "active",
  //   createdAt: "2024-02-20",
  // },

  // // 5. KẾ HOẠCH THU HOẠCH (ĐBSCL)
  // // Vùng: ĐBSCL | Mùa vụ: S001 (Chính vụ ĐBSCL) | Chu kỳ: GC004 (Monthong)
  // {
  //   id: 5,
  //   code: "PLN-2024-005",
  //   name: "Kế hoạch cắt nước và thu hoạch sầu riêng Thái (Monthong) ĐBSCL",
  //   description:
  //     "Thực hiện siết nước cuối vụ để ráo cơm, lên màu đẹp và tiến hành cắt trái, xử lý Ethephon chuẩn xuất khẩu.",
  //   seasonId: "S001",
  //   seasonName: "Chính vụ Đồng bằng sông Cửu Long",
  //   startDate: "2024-04-15",
  //   endDate: "2024-05-15",
  //   selectedRegionIds: ["REG-01"],
  //   selectedZoneIds: ["ZONE-01-B"],
  //   selectedPlotIds: ["PLOT-008"],
  //   crop: "Sầu riêng",
  //   variety: "Sầu riêng Monthong (Dona)",
  //   purpose: "harvest",
  //   area: "4.0",
  //   expectedYield: "80",
  //   growthCycleId: "", // Đã làm rỗng theo quy tắc kế hoạch thu hoạch
  //   regimenId: "",
  //   selectedStages: ["Thu hoạch"], // Đã chuyển thành mốc Thu hoạch độc lập
  //   materialAllocations: [
  //     {
  //       id: 112,
  //       stageId: "Thu hoạch", // Đã đồng bộ stageId
  //       materialCategory: "Dụng cụ nông nghiệp",
  //       materialType: "Vật tư thu hoạch",
  //       materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
  //       quantity: "50",
  //       unit: "cái",
  //     },
  //     {
  //       id: 113,
  //       stageId: "Thu hoạch", // Đã đồng bộ stageId
  //       materialCategory: "Chất điều hòa sinh trưởng",
  //       materialType: "Hóa chất",
  //       materialName: "Ethephon",
  //       quantity: "2",
  //       unit: "lít",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 209,
  //       stageId: "Thu hoạch", // Đã đồng bộ stageId
  //       name: "Cắt nước trước thu hoạch",
  //       description:
  //         "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm.",
  //       labor: "1 người",
  //       duration: "15 ngày",
  //     },
  //     {
  //       id: 210,
  //       stageId: "Thu hoạch", // Đã đồng bộ stageId
  //       name: "Cắt trái, phân loại và xử lý Ethephon",
  //       description:
  //         "Cắt trái theo độ chín sinh lý. Xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt xuất khẩu.",
  //       labor: "8 người",
  //       duration: "7 ngày",
  //     },
  //   ],
  //   status: "completed",
  //   createdAt: "2024-04-01",
  // },
  // {
  //   id: 6,
  //   code: "PLN-HARVEST-001",
  //   name: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
  //   description:
  //     "Thực hiện cắt nước cuối vụ để ráo cơm, tiến hành cắt trái và xử lý nhúng Ethephon chuẩn xuất khẩu.",
  //   seasonId: "S001",
  //   seasonName: "Chính vụ Đồng bằng sông Cửu Long",
  //   startDate: "2024-04-15",
  //   endDate: "2024-05-15",
  //   selectedRegionIds: ["3", "5", "1"],
  //   selectedZoneIds: ["sub-1-1", "sub-1-2"],
  //   selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
  //   crop: "Sầu riêng",
  //   variety: "Monthong",
  //   purpose: "harvest",
  //   growthCycleId: "",
  //   regimenId: "",
  //   selectedStages: ["Thu hoạch"],
  //   status: "active",
  //   materialAllocations: [
  //     {
  //       id: 1779988350720,
  //       stageId: "Thu hoạch",
  //       materialCategory: "Dụng cụ nông nghiệp",
  //       materialType: "Vật tư thu hoạch",
  //       materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
  //       quantity: "50",
  //       unit: "cái",
  //     },
  //     {
  //       id: 1779988350721,
  //       stageId: "Thu hoạch",
  //       materialCategory: "Chất điều hòa sinh trưởng",
  //       materialType: "Hóa chất",
  //       materialName: "Ethephon",
  //       quantity: "5",
  //       unit: "lít",
  //     },
  //   ],
  //   taskAllocations: [
  //     {
  //       id: 1779988365799,
  //       stageId: "Thu hoạch",
  //       name: "Cắt nước trước thu hoạch",
  //       description:
  //         "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm, lên màu đẹp, hạn chế sượng nước.",
  //       labor: "1 người",
  //       duration: "15 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "gk9s3nr6f",
  //           type: "region",
  //           regionId: "3",
  //         },
  //         {
  //           id: "6fv2o7w89",
  //           type: "region",
  //           regionId: "5",
  //         },
  //         {
  //           id: "gq2qdqq7k",
  //           type: "region",
  //           regionId: "1",
  //         },
  //       ],
  //     },
  //     {
  //       id: 1779988365800,
  //       stageId: "Thu hoạch",
  //       name: "Cắt trái, phân loại và xử lý Ethephon",
  //       description:
  //         "Đánh giá độ chín sinh lý để cắt trái. Sau đó xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt phục vụ xuất khẩu.",
  //       labor: "8 người",
  //       duration: "7 ngày",
  //       geographicalSelections: [
  //         {
  //           id: "gk9s3nr6f",
  //           type: "region",
  //           regionId: "3",
  //         },
  //         {
  //           id: "6fv2o7w89",
  //           type: "region",
  //           regionId: "5",
  //         },
  //         {
  //           id: "gq2qdqq7k",
  //           type: "region",
  //           regionId: "1",
  //         },
  //       ],
  //     },
  //   ],
  //   area: "50.5",
  //   createdAt: "2026-05-28",
  // },
  {
    "id": 1,
    "code": "PLN-2024-001",
    "name": "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
    "description": "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ cho sầu riêng Ri6.",
    "seasonId": "S002",
    "seasonName": "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
    "startDate": "2024-05-15",
    "endDate": "2024-11-30",
    "selectedRegionIds": [
      "1",
      "3"
    ],
    "selectedZoneIds": [
      "sub-1-1",
      "sub-1-2"
    ],
    "selectedPlotIds": [
      "plot-1-1",
      "plot-1-2",
      "plot-1-3"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthong",
    "purpose": "cultivation",
    "area": "50.5",
    "expectedYield": "60",
    "growthCycleId": "GC003",
    "selectedStages": [
      "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
      "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua"
    ],
    "materialAllocations": [
      {
        "id": 101,
        "stageId": "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        "materialCategory": "Phân bón",
        "materialType": "Phân vô cơ",
        "materialName": "Phân Lân (DAP hoặc Super Lân)",
        "quantity": "4",
        "unit": "kg/cây"
      },
      {
        "id": 102,
        "stageId": "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        "materialCategory": "Thuốc điều hòa sinh trưởng",
        "materialType": "Paclobutrazol",
        "materialName": "Paclobutrazol 25SC",
        "quantity": "5",
        "unit": "lít"
      },
      {
        "id": 103,
        "stageId": "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        "materialCategory": "Phân bón lá",
        "materialType": "Phân vô cơ",
        "materialName": "MKP (0-52-34) hoặc NPK 10-60-10",
        "quantity": "5",
        "unit": "kg"
      },
      {
        "id": 104,
        "stageId": "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
        "materialCategory": "Hóa chất",
        "materialType": "Phá miên trạng",
        "materialName": "KNO3 (Nitrat Kali)",
        "quantity": "2",
        "unit": "kg"
      }
    ],
    "taskAllocations": [
      {
        "id": 201,
        "stageId": "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        "name": "Bón lân tạo mầm và Xiết nước",
        "description": "Bón lân gốc khi cơi đọt cuối chuyển lụa. Dọn sạch cỏ gốc và xiết cạn nước mương tạo khô hạn.",
        "labor": "3 người",
        "duration": "14 ngày"
      },
      {
        "id": 202,
        "stageId": "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
        "name": "Phun tạo mầm và đậy bạt nilon",
        "description": "Phủ kín bạt nilon quanh gốc cản nước mưa. Phun Paclobutrazol 25SC 1 lần vào dạ dưới cành.",
        "labor": "4 người",
        "duration": "3 ngày"
      },
      {
        "id": 203,
        "stageId": "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
        "name": "Dỡ bạt và Phun phá miên trạng",
        "description": "Khi mắt cua sáng 70-80%, dỡ bạt. Phun KNO3 để phá miên trạng kích mắt cua đâm đồng loạt.",
        "labor": "2 người",
        "duration": "2 ngày"
      }
    ],
    "status": "active",
    "createdAt": "2024-05-01",
    "regimenId": ""
  },
  {
    "id": 2,
    "code": "PLN-2024-002",
    "name": "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
    "description": "Áp dụng phác đồ PD-SOIL-HCDF-2026: Khơi rãnh thoát nước, xới nhẹ mặt đất, bón phân hữu cơ và vi sinh để phục hồi rễ tơ, điều chỉnh cấu trúc và pH đất.",
    "seasonId": "S003",
    "seasonName": "Chính vụ Đông Nam Bộ",
    "startDate": "2024-08-01",
    "endDate": "2024-09-30",
    "selectedRegionIds": [
      "1",
      "3"
    ],
    "selectedZoneIds": [
      "sub-1-1",
      "sub-1-2"
    ],
    "selectedPlotIds": [
      "plot-1-1",
      "plot-1-2",
      "plot-1-3"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthong",
    "purpose": "amendment",
    "growthCycleId": "",
    "regimenId": "4",
    "selectedStages": [
      "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
      "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”"
    ],
    "status": "active",
    "materialAllocations": [
      {
        "id": 105,
        "stageId": "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        "materialCategory": "Phân bón",
        "materialType": "Phân hữu cơ",
        "materialName": "Phân hữu cơ hoai mục",
        "quantity": "25",
        "unit": "kg/cây"
      },
      {
        "id": 106,
        "stageId": "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        "materialCategory": "Chế phẩm vi sinh",
        "materialType": "fertilizer",
        "materialName": "Ozym (Bào tử vi sinh)",
        "quantity": "100",
        "unit": "g/gốc"
      },
      {
        "id": 107,
        "stageId": "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        "materialCategory": "Chế phẩm vi sinh",
        "materialType": "fertilizer",
        "materialName": "Bzym+ (10^15 CFU/mL)",
        "quantity": "500",
        "unit": "ml/gốc"
      }
    ],
    "taskAllocations": [
      {
        "id": 204,
        "stageId": "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
        "name": "Khơi rãnh thoát nước và xới nhẹ mặt đất",
        "description": "Thoát nước khẩn cấp, xới nhẹ lớp mặt tăng thông thoáng, thu gom tàn dư thối, quả rụng đem tiêu hủy để dọn nguồn bệnh.",
        "labor": "5 người",
        "duration": "7 ngày",
        "geographicalSelections": [
          {
            "id": "geo-reg02-a",
            "type": "region",
            "regionId": "REG-02"
          }
        ]
      },
      {
        "id": 205,
        "stageId": "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        "name": "Bón phân hữu cơ và tưới vi sinh",
        "description": "Bón vôi/Dolomite khử chua. Rải Ozym kết hợp phân hữu cơ hoai mục để phân hủy rễ thối. Tưới Bzym+ để thiết lập quần thể vi sinh bảo vệ rễ.",
        "labor": "3 người",
        "duration": "30 ngày",
        "geographicalSelections": [
          {
            "id": "geo-reg02-b",
            "type": "region",
            "regionId": "REG-02"
          }
        ]
      }
    ],
    "area": "50.5",
    "expectedYield": "0",
    "createdAt": "2024-07-20"
  },
  {
    "id": 3,
    "code": "PLN-TREAT-001",
    "name": "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
    "description": "Phác đồ PT001: Hết triệu chứng thán thư sau 14 ngày, bảo vệ hoa và lá lụa. Diệt nấm và phục hồi.",
    "seasonId": "S001",
    "seasonName": "Chính vụ Đồng bằng sông Cửu Long",
    "startDate": "2025-01-15",
    "endDate": "2025-01-29",
    "selectedRegionIds": [
      "REG-01"
    ],
    "selectedZoneIds": [
      "ZONE-01"
    ],
    "selectedPlotIds": [
      "PLOT-01"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthon",
    "purpose": "treatment",
    "growthCycleId": "",
    "regimenId": "1",
    "selectedStages": [
      "1:Phun thuốc phòng ngừa",
      "1:Điều trị chính"
    ],
    "status": "active",
    "materialAllocations": [
      {
        "id": 107,
        "stageId": "1:Phun thuốc phòng ngừa",
        "materialCategory": "Thuốc BVTV (Hóa học)",
        "materialType": "pesticide",
        "materialName": "Mancozeb 80% WP",
        "quantity": "2",
        "unit": "g/l"
      },
      {
        "id": 108,
        "stageId": "1:Điều trị chính",
        "materialCategory": "Thuốc BVTV (Hóa học)",
        "materialType": "pesticide",
        "materialName": "Carbendazim 50% WP",
        "quantity": "1.5",
        "unit": "g/l"
      }
    ],
    "taskAllocations": [
      {
        "id": 206,
        "stageId": "1:Phun thuốc phòng ngừa",
        "name": "Phun thuốc phòng ngừa",
        "description": "Phun xịt hóa học toàn bộ tán lá, tập trung vào mặt dưới lá. Tránh phun khi nắng gắt.",
        "labor": "2 người",
        "duration": "1 ngày",
        "geographicalSelections": [
          {
            "id": "geo-reg01-a",
            "type": "region",
            "regionId": "REG-01"
          }
        ]
      },
      {
        "id": 207,
        "stageId": "1:Điều trị chính",
        "name": "Điều trị chính",
        "description": "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
        "labor": "2 người",
        "duration": "4 ngày",
        "geographicalSelections": [
          {
            "id": "geo-reg01-b",
            "type": "region",
            "regionId": "REG-01"
          }
        ]
      }
    ],
    "area": "0.0",
    "createdAt": "2025-01-05"
  },
  {
    "id": 4,
    "code": "PLN-2024-004",
    "name": "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
    "description": "Cung cấp dinh dưỡng phân kỳ theo tuổi trái, tỉa trái non sinh lý và bón Kali Sulphate để lên cơm vàng.",
    "seasonId": "S003",
    "seasonName": "Chính vụ Đông Nam Bộ",
    "startDate": "2024-03-01",
    "endDate": "2024-06-30",
    "selectedRegionIds": [
      "5",
      "10",
      "3",
      "1"
    ],
    "selectedZoneIds": [
      "sub-1-1",
      "sub-1-2"
    ],
    "selectedPlotIds": [
      "plot-1-1",
      "plot-1-2",
      "plot-1-3"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthong",
    "purpose": "cultivation",
    "area": "50.5",
    "expectedYield": "80",
    "growthCycleId": "GC004",
    "selectedStages": [
      "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)"
    ],
    "materialAllocations": [
      {
        "id": 109,
        "stageId": "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        "materialCategory": "Phân bón",
        "materialType": "Phân vô cơ",
        "materialName": "NPK 15-15-15",
        "quantity": "1",
        "unit": "kg/cây/lần"
      },
      {
        "id": 110,
        "stageId": "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        "materialCategory": "Phân bón",
        "materialType": "Phân vô cơ",
        "materialName": "Kali Sulphate (K2SO4 - Kali trắng)",
        "quantity": "0.5",
        "unit": "kg/cây/lần"
      }
    ],
    "taskAllocations": [
      {
        "id": 207,
        "stageId": "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        "name": "Tỉa trái non (3 đợt)",
        "description": "Đợt 1 (sau 10 ngày), Đợt 2 (sau 20 ngày), Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
        "labor": "4 người",
        "duration": "20 ngày"
      },
      {
        "id": 208,
        "stageId": "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        "name": "Bón NPK cân bằng và Kali trắng vô cơm",
        "description": "Bón NPK 15-15-15 định kỳ 8-10 ngày/lần. Khi trái đạt 60 ngày tuổi, chuyển sang bón Kali Sulphate.",
        "labor": "2 người",
        "duration": "10 ngày"
      }
    ],
    "status": "active",
    "createdAt": "2024-02-20",
    "regimenId": ""
  },
  {
    "id": 5,
    "code": "PLN-2024-005",
    "name": "Kế hoạch cắt nước và thu hoạch sầu riêng Thái (Monthong) ĐBSCL",
    "description": "Thực hiện siết nước cuối vụ để ráo cơm, lên màu đẹp và tiến hành cắt trái, xử lý Ethephon chuẩn xuất khẩu.",
    "seasonId": "S001",
    "seasonName": "Chính vụ Đồng bằng sông Cửu Long",
    "startDate": "2024-04-15",
    "endDate": "2024-05-15",
    "selectedRegionIds": [
      "1"
    ],
    "selectedZoneIds": [
      "sub-1-1",
      "sub-1-2"
    ],
    "selectedPlotIds": [
      "plot-1-1",
      "plot-1-2",
      "plot-1-3"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthong",
    "purpose": "harvest",
    "area": "50.5",
    "expectedYield": "80",
    "growthCycleId": "",
    "regimenId": "",
    "selectedStages": [
      "Thu hoạch"
    ],
    "materialAllocations": [
      {
        "id": 112,
        "stageId": "Thu hoạch",
        "materialCategory": "Dụng cụ nông nghiệp",
        "materialType": "Vật tư thu hoạch",
        "materialName": "Kéo cắt cuống chuyên dụng và sọt nhựa",
        "quantity": "50",
        "unit": "cái"
      },
      {
        "id": 113,
        "stageId": "Thu hoạch",
        "materialCategory": "Chất điều hòa sinh trưởng",
        "materialType": "Hóa chất",
        "materialName": "Ethephon",
        "quantity": "2",
        "unit": "lít"
      }
    ],
    "taskAllocations": [
      {
        "id": 209,
        "stageId": "Thu hoạch",
        "name": "Cắt nước trước thu hoạch",
        "description": "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm.",
        "labor": "1 người",
        "duration": "15 ngày"
      },
      {
        "id": 210,
        "stageId": "Thu hoạch",
        "name": "Cắt trái, phân loại và xử lý Ethephon",
        "description": "Cắt trái theo độ chín sinh lý. Xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt xuất khẩu.",
        "labor": "8 người",
        "duration": "7 ngày"
      }
    ],
    "status": "active",
    "createdAt": "2024-04-01"
  },
  {
    "id": 6,
    "code": "PLN-HARVEST-001",
    "name": "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
    "description": "Thực hiện cắt nước cuối vụ để ráo cơm, tiến hành cắt trái và xử lý nhúng Ethephon chuẩn xuất khẩu.",
    "seasonId": "S001",
    "seasonName": "Chính vụ Đồng bằng sông Cửu Long",
    "startDate": "2024-04-15",
    "endDate": "2024-05-15",
    "selectedRegionIds": [
      "3",
      "5",
      "1"
    ],
    "selectedZoneIds": [
      "sub-1-1",
      "sub-1-2"
    ],
    "selectedPlotIds": [
      "plot-1-1",
      "plot-1-2",
      "plot-1-3"
    ],
    "crop": "Sầu riêng",
    "variety": "Monthong",
    "purpose": "harvest",
    "growthCycleId": "",
    "regimenId": "",
    "selectedStages": [
      "Thu hoạch"
    ],
    "status": "active",
    "materialAllocations": [
      {
        "id": 1779988350720,
        "stageId": "Thu hoạch",
        "materialCategory": "Dụng cụ nông nghiệp",
        "materialType": "Vật tư thu hoạch",
        "materialName": "Kéo cắt cuống chuyên dụng và sọt nhựa",
        "quantity": "50",
        "unit": "cái"
      },
      {
        "id": 1779988350721,
        "stageId": "Thu hoạch",
        "materialCategory": "Chất điều hòa sinh trưởng",
        "materialType": "Hóa chất",
        "materialName": "Ethephon",
        "quantity": "5",
        "unit": "lít"
      }
    ],
    "taskAllocations": [
      {
        "id": 1779988365799,
        "stageId": "Thu hoạch",
        "name": "Cắt nước trước thu hoạch",
        "description": "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm, lên màu đẹp, hạn chế sượng nước.",
        "labor": "1 người",
        "duration": "15 ngày",
        "geographicalSelections": [
          {
            "id": "gk9s3nr6f",
            "type": "region",
            "regionId": "3"
          },
          {
            "id": "6fv2o7w89",
            "type": "region",
            "regionId": "5"
          },
          {
            "id": "gq2qdqq7k",
            "type": "region",
            "regionId": "1"
          }
        ]
      },
      {
        "id": 1779988365800,
        "stageId": "Thu hoạch",
        "name": "Cắt trái, phân loại và xử lý Ethephon",
        "description": "Đánh giá độ chín sinh lý để cắt trái. Sau đó xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt phục vụ xuất khẩu.",
        "labor": "8 người",
        "duration": "7 ngày",
        "geographicalSelections": [
          {
            "id": "gk9s3nr6f",
            "type": "region",
            "regionId": "3"
          },
          {
            "id": "6fv2o7w89",
            "type": "region",
            "regionId": "5"
          },
          {
            "id": "gq2qdqq7k",
            "type": "region",
            "regionId": "1"
          }
        ]
      }
    ],
    "area": "50.5",
    "createdAt": "2026-05-28"
  }
  ,
  {
    "id": 101,
    "code": "AQ-2025-001",
    "name": "Kế hoạch chuẩn bị ao nuôi tôm thẻ vụ Q2/2025",
    "description": "Cải tạo ao, xử lý nước đầu vụ và bố trí hệ thống quạt nước trước khi thả giống tôm thẻ.",
    "seasonId": "AQ-2025-Q2",
    "seasonName": "Vụ nuôi Q2/2025",
    "startDate": "2025-04-01",
    "endDate": "2025-04-20",
    "selectedRegionIds": ["1"],
    "selectedZoneIds": ["sub-1-1"],
    "selectedPlotIds": ["plot-1-1", "plot-1-2"],
    "crop": "Tôm thẻ chân trắng",
    "variety": "PL12",
    "purpose": "cultivation",
    "area": "2.7",
    "expectedYield": "18",
    "growthCycleId": "AQ-TOM-THU-STD",
    "selectedStages": ["Cải tạo ao", "Gây màu nước", "Thả giống"],
    "materialAllocations": [
      {
        "id": 301,
        "stageId": "Cải tạo ao",
        "materialCategory": "Thuốc thú y thủy sản",
        "materialType": "Vôi CaO",
        "materialName": "Vôi CaO xử lý ao",
        "quantity": "250",
        "unit": "kg"
      },
      {
        "id": 302,
        "stageId": "Gây màu nước",
        "materialCategory": "Chế phẩm sinh học",
        "materialType": "Chế phẩm sinh học",
        "materialName": "Men vi sinh gây màu nước",
        "quantity": "20",
        "unit": "chai"
      },
      {
        "id": 303,
        "stageId": "Thả giống",
        "materialCategory": "Con giống",
        "materialType": "Tôm post 12",
        "materialName": "Post-larvae PL12",
        "quantity": "200000",
        "unit": "con"
      }
    ],
    "taskAllocations": [
      {
        "id": 401,
        "stageId": "Cải tạo ao",
        "name": "Nạo vét và khử trùng đáy ao",
        "description": "Thu gom bùn đáy, phơi ao và khử trùng toàn bộ khu nuôi trước khi cấp nước.",
        "labor": "5 người",
        "duration": "5 ngày"
      },
      {
        "id": 402,
        "stageId": "Gây màu nước",
        "name": "Theo dõi pH và độ kiềm",
        "description": "Đo chỉ số môi trường mỗi ngày để ổn định màu nước trước khi thả giống.",
        "labor": "2 người",
        "duration": "7 ngày"
      },
      {
        "id": 403,
        "stageId": "Thả giống",
        "name": "Thuần nhiệt và thả post",
        "description": "Thuần nhiệt độ, độ mặn và mật độ trước khi thả post-larvae xuống ao.",
        "labor": "4 người",
        "duration": "2 ngày"
      }
    ],
    "status": "active",
    "createdAt": "2025-03-20"
  },
  {
    "id": 102,
    "code": "AQ-2025-002",
    "name": "Kế hoạch nuôi cá tra tăng trưởng vụ Q3/2025",
    "description": "Quản lý cho ăn, kiểm soát oxy hòa tan và theo dõi tăng trưởng đàn cá tra thương phẩm.",
    "seasonId": "AQ-2025-Q3",
    "seasonName": "Vụ nuôi Q3/2025",
    "startDate": "2025-07-01",
    "endDate": "2025-09-15",
    "selectedRegionIds": ["3"],
    "selectedZoneIds": ["sub-2-1"],
    "selectedPlotIds": ["plot-2-1", "plot-2-2"],
    "crop": "Cá tra",
    "variety": "Thương phẩm",
    "purpose": "cultivation",
    "area": "4.2",
    "expectedYield": "75",
    "growthCycleId": "AQ-CA-TRA-STD",
    "selectedStages": ["Thả giống", "Cho ăn tăng trưởng", "Quản lý chất lượng nước"],
    "materialAllocations": [
      {
        "id": 304,
        "stageId": "Thả giống",
        "materialCategory": "Con giống",
        "materialType": "Cá tra giống",
        "materialName": "Cá tra giống cỡ 12-15cm",
        "quantity": "50000",
        "unit": "con"
      },
      {
        "id": 305,
        "stageId": "Cho ăn tăng trưởng",
        "materialCategory": "Thức ăn thủy sản",
        "materialType": "Cám chìm 28%",
        "materialName": "Cám chìm 28%",
        "quantity": "1200",
        "unit": "kg"
      },
      {
        "id": 306,
        "stageId": "Quản lý chất lượng nước",
        "materialCategory": "Chế phẩm sinh học",
        "materialType": "Chế phẩm sinh học",
        "materialName": "Vi sinh xử lý nước",
        "quantity": "15",
        "unit": "chai"
      }
    ],
    "taskAllocations": [
      {
        "id": 404,
        "stageId": "Thả giống",
        "name": "Kiểm tra sức khỏe đàn giống",
        "description": "Kiểm tra ngoại hình, kích cỡ và khả năng thích nghi trước khi thả.",
        "labor": "3 người",
        "duration": "2 ngày"
      },
      {
        "id": 405,
        "stageId": "Cho ăn tăng trưởng",
        "name": "Điều chỉnh khẩu phần theo cỡ cá",
        "description": "Theo dõi lượng ăn hằng ngày và điều chỉnh theo tốc độ tăng trưởng.",
        "labor": "2 người",
        "duration": "60 ngày"
      },
      {
        "id": 406,
        "stageId": "Quản lý chất lượng nước",
        "name": "Đo oxy và NH3",
        "description": "Theo dõi oxy hòa tan, NH3 và pH để hạn chế sốc môi trường.",
        "labor": "2 người",
        "duration": "45 ngày"
      }
    ],
    "status": "draft",
    "createdAt": "2025-06-10"
  },
  {
    "id": 103,
    "code": "AQ-2025-003",
    "name": "Kế hoạch phòng bệnh cá rô phi vụ Q3/2025",
    "description": "Tăng cường sục khí, phòng bệnh và ổn định chất lượng nước cho bè nuôi cá rô phi.",
    "seasonId": "AQ-2025-Q3",
    "seasonName": "Vụ nuôi Q3/2025",
    "startDate": "2025-08-01",
    "endDate": "2025-09-30",
    "selectedRegionIds": ["5"],
    "selectedZoneIds": ["sub-3-1"],
    "selectedPlotIds": ["plot-3-1", "plot-3-2"],
    "crop": "Cá rô phi",
    "variety": "Thâm canh",
    "purpose": "treatment",
    "area": "1.8",
    "expectedYield": "22",
    "growthCycleId": "",
    "regimenId": "AQUA-PREVENT-001",
    "selectedStages": ["Theo dõi oxy", "Phòng bệnh"],
    "materialAllocations": [
      {
        "id": 307,
        "stageId": "Theo dõi oxy",
        "materialCategory": "Dụng cụ",
        "materialType": "Máy đo oxy",
        "materialName": "Máy đo oxy cầm tay",
        "quantity": "2",
        "unit": "cái"
      },
      {
        "id": 308,
        "stageId": "Phòng bệnh",
        "materialCategory": "Thuốc thú y thủy sản",
        "materialType": "Iodine",
        "materialName": "Iodine sát khuẩn ao",
        "quantity": "10",
        "unit": "lít"
      }
    ],
    "taskAllocations": [
      {
        "id": 407,
        "stageId": "Theo dõi oxy",
        "name": "Đo oxy sáng sớm",
        "description": "Đo oxy trước bình minh để xử lý sục khí kịp thời.",
        "labor": "2 người",
        "duration": "30 ngày"
      },
      {
        "id": 408,
        "stageId": "Phòng bệnh",
        "name": "Xử lý nước định kỳ",
        "description": "Khử khuẩn và kiểm tra mật độ tảo để hạn chế bùng phát bệnh.",
        "labor": "3 người",
        "duration": "20 ngày"
      }
    ],
    "status": "active",
    "createdAt": "2025-07-18"
  },
  {
    "id": 104,
    "code": "AQ-2025-004",
    "name": "Kế hoạch thu hoạch tôm thẻ chân trắng vụ Q4/2025",
    "description": "Theo dõi cỡ tôm, siết thức ăn và chuẩn bị thu hoạch đồng loạt cho ao nuôi lót bạt.",
    "seasonId": "AQ-2025-Q4",
    "seasonName": "Vụ nuôi Q4/2025",
    "startDate": "2025-10-01",
    "endDate": "2025-11-10",
    "selectedRegionIds": ["1"],
    "selectedZoneIds": ["sub-1-1"],
    "selectedPlotIds": ["plot-1-1", "plot-1-2"],
    "crop": "Tôm thẻ chân trắng",
    "variety": "Thương phẩm",
    "purpose": "harvest",
    "area": "2.7",
    "expectedYield": "20",
    "growthCycleId": "AQ-TOM-THU-STD",
    "selectedStages": ["Siết thức ăn", "Thu hoạch"],
    "materialAllocations": [
      {
        "id": 309,
        "stageId": "Siết thức ăn",
        "materialCategory": "Thức ăn thủy sản",
        "materialType": "Cám nổi 32%",
        "materialName": "Cám nổi 32%",
        "quantity": "300",
        "unit": "kg"
      },
      {
        "id": 310,
        "stageId": "Thu hoạch",
        "materialCategory": "Dụng cụ",
        "materialType": "Vợt thu hoạch",
        "materialName": "Vợt thu hoạch inox",
        "quantity": "10",
        "unit": "cái"
      }
    ],
    "taskAllocations": [
      {
        "id": 409,
        "stageId": "Siết thức ăn",
        "name": "Giảm khẩu phần 30%",
        "description": "Giảm dần lượng thức ăn để chuẩn bị thu hoạch.",
        "labor": "2 người",
        "duration": "7 ngày"
      },
      {
        "id": 410,
        "stageId": "Thu hoạch",
        "name": "Thu tôm và phân loại",
        "description": "Dùng lưới thu hoạch, phân loại theo cỡ và đóng gói tại ao.",
        "labor": "6 người",
        "duration": "3 ngày"
      }
    ],
    "status": "completed",
    "createdAt": "2025-09-25"
  }

];

interface PlanStore {
  plans: Plan[];
  getPlanById: (id: number) => Plan | undefined;
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  duplicatePlan: (id: number) => void;
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

        duplicatePlan: (id) => {
          const plan = get().plans.find((p) => p.id === id);
          if (plan) {
            const newId =
              get().plans.length > 0
                ? Math.max(...get().plans.map((p) => p.id)) + 1
                : 1;
            const newPlan: Plan = {
              ...plan,
              id: newId,
              name: `${plan.name} (Bản sao)`,
              code: `${plan.code}-COPY`,
              status: "draft",
              createdAt: new Date().toISOString().split("T")[0],
            };
            set((state) => ({
              plans: [...state.plans, newPlan],
            }));
          }
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
