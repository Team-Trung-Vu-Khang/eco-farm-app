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

// export const initialPlans: Plan[] = [
//   {
//     id: 1,
//     code: "PLN-2024-001",
//     name: "Kế hoạch làm bông nghịch vụ Sầu riêng Ri6 - ĐBSCL",
//     description:
//       "Áp dụng kỹ thuật xiết nước, đậy bạt và phun Paclobutrazol để kích thích ra hoa nghịch vụ cho sầu riêng Ri6.",
//     seasonId: "S002",
//     seasonName: "Vụ Nghịch ĐBSCL - Sầu riêng Ri6",
//     startDate: "2024-05-15",
//     endDate: "2024-11-30",
//     selectedRegionIds: ["1", "3"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
//     crop: "Sầu riêng",
//     variety: "Monthong",
//     purpose: "cultivation",
//     area: "50.5",
//     expectedYield: "60",
//     growthCycleId: "GC003",
//     selectedStages: [
//       "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//       "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
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
//           "Bón lân gốc khi cơi đọt cuối chuyển lụa. Dọn sạch cỏ gốc và xiết cạn nước mương tạo khô hạn.",
//         labor: "3 người",
//         duration: "14 ngày",
//       },
//       {
//         id: 202,
//         stageId: "GC003:Dằn lân, tạo mầm & Phủ bạt xiết nước",
//         name: "Phun tạo mầm và đậy bạt nilon",
//         description:
//           "Phủ kín bạt nilon quanh gốc cản nước mưa. Phun Paclobutrazol 25SC 1 lần vào dạ dưới cành.",
//         labor: "4 người",
//         duration: "3 ngày",
//       },
//       {
//         id: 203,
//         stageId: "GC003:Dỡ bạt, nhấp nước & Kéo mắt cua",
//         name: "Dỡ bạt và Phun phá miên trạng",
//         description:
//           "Khi mắt cua sáng 70-80%, dỡ bạt. Phun KNO3 để phá miên trạng kích mắt cua đâm đồng loạt.",
//         labor: "2 người",
//         duration: "2 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-05-01",
//     regimenId: "",
//   },
//   {
//     id: 2,
//     code: "PLN-2024-002",
//     name: "Kế hoạch phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (Đông Nam Bộ)",
//     description:
//       "Áp dụng phác đồ PD-SOIL-HCDF-2026: Khơi rãnh thoát nước, xới nhẹ mặt đất, bón phân hữu cơ và vi sinh để phục hồi rễ tơ, điều chỉnh cấu trúc và pH đất.",
//     seasonId: "S003",
//     seasonName: "Chính vụ Đông Nam Bộ",
//     startDate: "2024-08-01",
//     endDate: "2024-09-30",
//     selectedRegionIds: ["1", "3"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
//     crop: "Sầu riêng",
//     variety: "Monthong",
//     purpose: "amendment",
//     growthCycleId: "",
//     regimenId: "4",
//     selectedStages: [
//       "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
//       "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//     ],
//     status: "active",
//     materialAllocations: [
//       {
//         id: 105,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         materialCategory: "Phân bón",
//         materialType: "Phân hữu cơ",
//         materialName: "Phân hữu cơ hoai mục",
//         quantity: "25",
//         unit: "kg/cây",
//       },
//       {
//         id: 106,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         materialCategory: "Chế phẩm vi sinh",
//         materialType: "fertilizer",
//         materialName: "Ozym (Bào tử vi sinh)",
//         quantity: "100",
//         unit: "g/gốc",
//       },
//       {
//         id: 107,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         materialCategory: "Chế phẩm vi sinh",
//         materialType: "fertilizer",
//         materialName: "Bzym+ (10^15 CFU/mL)",
//         quantity: "500",
//         unit: "ml/gốc",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 204,
//         stageId: "4:Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
//         name: "Khơi rãnh thoát nước và xới nhẹ mặt đất",
//         description:
//           "Thoát nước khẩn cấp, xới nhẹ lớp mặt tăng thông thoáng, thu gom tàn dư thối, quả rụng đem tiêu hủy để dọn nguồn bệnh.",
//         labor: "5 người",
//         duration: "7 ngày",
//         geographicalSelections: [
//           {
//             id: "geo-reg02-a",
//             type: "region",
//             regionId: "REG-02",
//           },
//         ],
//       },
//       {
//         id: 205,
//         stageId: "4:Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
//         name: "Bón phân hữu cơ và tưới vi sinh",
//         description:
//           "Bón vôi/Dolomite khử chua. Rải Ozym kết hợp phân hữu cơ hoai mục để phân hủy rễ thối. Tưới Bzym+ để thiết lập quần thể vi sinh bảo vệ rễ.",
//         labor: "3 người",
//         duration: "30 ngày",
//         geographicalSelections: [
//           {
//             id: "geo-reg02-b",
//             type: "region",
//             regionId: "REG-02",
//           },
//         ],
//       },
//     ],
//     area: "50.5",
//     expectedYield: "0",
//     createdAt: "2024-07-20",
//   },
//   {
//     id: 3,
//     code: "PLN-TREAT-001",
//     name: "Kế hoạch điều trị bệnh thán thư bông sầu riêng",
//     description:
//       "Phác đồ PT001: Hết triệu chứng thán thư sau 14 ngày, bảo vệ hoa và lá lụa. Diệt nấm và phục hồi.",
//     seasonId: "S001",
//     seasonName: "Chính vụ Đồng bằng sông Cửu Long",
//     startDate: "2025-01-15",
//     endDate: "2025-01-29",
//     selectedRegionIds: ["REG-01"],
//     selectedZoneIds: ["ZONE-01"],
//     selectedPlotIds: ["PLOT-01"],
//     crop: "Sầu riêng",
//     variety: "Monthon",
//     purpose: "treatment",
//     growthCycleId: "",
//     regimenId: "1",
//     selectedStages: ["1:Phun thuốc phòng ngừa", "1:Điều trị chính"],
//     status: "active",
//     materialAllocations: [
//       {
//         id: 107,
//         stageId: "1:Phun thuốc phòng ngừa",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Mancozeb 80% WP",
//         quantity: "2",
//         unit: "g/l",
//       },
//       {
//         id: 108,
//         stageId: "1:Điều trị chính",
//         materialCategory: "Thuốc BVTV (Hóa học)",
//         materialType: "pesticide",
//         materialName: "Carbendazim 50% WP",
//         quantity: "1.5",
//         unit: "g/l",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 206,
//         stageId: "1:Phun thuốc phòng ngừa",
//         name: "Phun thuốc phòng ngừa",
//         description:
//           "Phun xịt hóa học toàn bộ tán lá, tập trung vào mặt dưới lá. Tránh phun khi nắng gắt.",
//         labor: "2 người",
//         duration: "1 ngày",
//         geographicalSelections: [
//           {
//             id: "geo-reg01-a",
//             type: "region",
//             regionId: "REG-01",
//           },
//         ],
//       },
//       {
//         id: 207,
//         stageId: "1:Điều trị chính",
//         name: "Điều trị chính",
//         description:
//           "Tập trung vào vùng bị bệnh nặng. Phun 2 lần cách nhau 3 ngày.",
//         labor: "2 người",
//         duration: "4 ngày",
//         geographicalSelections: [
//           {
//             id: "geo-reg01-b",
//             type: "region",
//             regionId: "REG-01",
//           },
//         ],
//       },
//     ],
//     area: "0.0",
//     createdAt: "2025-01-05",
//   },
//   {
//     id: 4,
//     code: "PLN-2024-004",
//     name: "Kế hoạch nuôi trái sầu riêng Monthong ĐNB (Chống sượng, vô cơm)",
//     description:
//       "Cung cấp dinh dưỡng phân kỳ theo tuổi trái, tỉa trái non sinh lý và bón Kali Sulphate để lên cơm vàng.",
//     seasonId: "S003",
//     seasonName: "Chính vụ Đông Nam Bộ",
//     startDate: "2024-03-01",
//     endDate: "2024-06-30",
//     selectedRegionIds: ["5", "10", "3", "1"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
//     crop: "Sầu riêng",
//     variety: "Monthong",
//     purpose: "cultivation",
//     area: "50.5",
//     expectedYield: "80",
//     growthCycleId: "GC004",
//     selectedStages: ["GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)"],
//     materialAllocations: [
//       {
//         id: 109,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//         materialCategory: "Phân bón",
//         materialType: "Phân vô cơ",
//         materialName: "NPK 15-15-15",
//         quantity: "1",
//         unit: "kg/cây/lần",
//       },
//       {
//         id: 110,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//         materialCategory: "Phân bón",
//         materialType: "Phân vô cơ",
//         materialName: "Kali Sulphate (K2SO4 - Kali trắng)",
//         quantity: "0.5",
//         unit: "kg/cây/lần",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 207,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//         name: "Tỉa trái non (3 đợt)",
//         description:
//           "Đợt 1 (sau 10 ngày), Đợt 2 (sau 20 ngày), Đợt 3 (sau 30 ngày) giữ lại số lượng chuẩn.",
//         labor: "4 người",
//         duration: "20 ngày",
//       },
//       {
//         id: 208,
//         stageId: "GC004:Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
//         name: "Bón NPK cân bằng và Kali trắng vô cơm",
//         description:
//           "Bón NPK 15-15-15 định kỳ 8-10 ngày/lần. Khi trái đạt 60 ngày tuổi, chuyển sang bón Kali Sulphate.",
//         labor: "2 người",
//         duration: "10 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-02-20",
//     regimenId: "",
//   },
//   {
//     id: 5,
//     code: "PLN-2024-005",
//     name: "Kế hoạch cắt nước và thu hoạch sầu riêng Thái (Monthong) ĐBSCL",
//     description:
//       "Thực hiện siết nước cuối vụ để ráo cơm, lên màu đẹp và tiến hành cắt trái, xử lý Ethephon chuẩn xuất khẩu.",
//     seasonId: "S001",
//     seasonName: "Chính vụ Đồng bằng sông Cửu Long",
//     startDate: "2024-04-15",
//     endDate: "2024-05-15",
//     selectedRegionIds: ["1"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
//     crop: "Sầu riêng",
//     variety: "Monthong",
//     purpose: "harvest",
//     area: "50.5",
//     expectedYield: "80",
//     growthCycleId: "",
//     regimenId: "",
//     selectedStages: ["Thu hoạch"],
//     materialAllocations: [
//       {
//         id: 112,
//         stageId: "Thu hoạch",
//         materialCategory: "Dụng cụ nông nghiệp",
//         materialType: "Vật tư thu hoạch",
//         materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//         quantity: "50",
//         unit: "cái",
//       },
//       {
//         id: 113,
//         stageId: "Thu hoạch",
//         materialCategory: "Chất điều hòa sinh trưởng",
//         materialType: "Hóa chất",
//         materialName: "Ethephon",
//         quantity: "2",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 209,
//         stageId: "Thu hoạch",
//         name: "Cắt nước trước thu hoạch",
//         description:
//           "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm.",
//         labor: "1 người",
//         duration: "15 ngày",
//       },
//       {
//         id: 210,
//         stageId: "Thu hoạch",
//         name: "Cắt trái, phân loại và xử lý Ethephon",
//         description:
//           "Cắt trái theo độ chín sinh lý. Xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt xuất khẩu.",
//         labor: "8 người",
//         duration: "7 ngày",
//       },
//     ],
//     status: "active",
//     createdAt: "2024-04-01",
//   },
//   {
//     id: 6,
//     code: "PLN-HARVEST-001",
//     name: "Kế hoạch thu hoạch sầu riêng Monthong chính vụ ĐBSCL",
//     description:
//       "Thực hiện cắt nước cuối vụ để ráo cơm, tiến hành cắt trái và xử lý nhúng Ethephon chuẩn xuất khẩu.",
//     seasonId: "S001",
//     seasonName: "Chính vụ Đồng bằng sông Cửu Long",
//     startDate: "2024-04-15",
//     endDate: "2024-05-15",
//     selectedRegionIds: ["3", "5", "1"],
//     selectedZoneIds: ["sub-1-1", "sub-1-2"],
//     selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
//     crop: "Sầu riêng",
//     variety: "Monthong",
//     purpose: "harvest",
//     growthCycleId: "",
//     regimenId: "",
//     selectedStages: ["Thu hoạch"],
//     status: "active",
//     materialAllocations: [
//       {
//         id: 1779988350720,
//         stageId: "Thu hoạch",
//         materialCategory: "Dụng cụ nông nghiệp",
//         materialType: "Vật tư thu hoạch",
//         materialName: "Kéo cắt cuống chuyên dụng và sọt nhựa",
//         quantity: "50",
//         unit: "cái",
//       },
//       {
//         id: 1779988350721,
//         stageId: "Thu hoạch",
//         materialCategory: "Chất điều hòa sinh trưởng",
//         materialType: "Hóa chất",
//         materialName: "Ethephon",
//         quantity: "5",
//         unit: "lít",
//       },
//     ],
//     taskAllocations: [
//       {
//         id: 1779988365799,
//         stageId: "Thu hoạch",
//         name: "Cắt nước trước thu hoạch",
//         description:
//           "Ngưng tưới nước hoàn toàn trước ngày thu hoạch dự kiến 15-20 ngày để sầu riêng ráo cơm, lên màu đẹp, hạn chế sượng nước.",
//         labor: "1 người",
//         duration: "15 ngày",
//         geographicalSelections: [
//           {
//             id: "gk9s3nr6f",
//             type: "region",
//             regionId: "3",
//           },
//           {
//             id: "6fv2o7w89",
//             type: "region",
//             regionId: "5",
//           },
//           {
//             id: "gq2qdqq7k",
//             type: "region",
//             regionId: "1",
//           },
//         ],
//       },
//       {
//         id: 1779988365800,
//         stageId: "Thu hoạch",
//         name: "Cắt trái, phân loại và xử lý Ethephon",
//         description:
//           "Đánh giá độ chín sinh lý để cắt trái. Sau đó xử lý nhúng Ethephon nồng độ an toàn để lô hàng chín đồng loạt phục vụ xuất khẩu.",
//         labor: "8 người",
//         duration: "7 ngày",
//         geographicalSelections: [
//           {
//             id: "gk9s3nr6f",
//             type: "region",
//             regionId: "3",
//           },
//           {
//             id: "6fv2o7w89",
//             type: "region",
//             regionId: "5",
//           },
//           {
//             id: "gq2qdqq7k",
//             type: "region",
//             regionId: "1",
//           },
//         ],
//       },
//     ],
//     area: "50.5",
//     createdAt: "2026-05-28",
//   },
// ];

export const initialPlans: Plan[] = [
  {
    id: 1,
    code: "PLN-LUA-2025-001",
    name: "Kế hoạch canh tác lúa ST25 giảm phát thải vụ Đông Xuân (ĐBSCL)",
    description:
      "Áp dụng quy trình '1 Phải 5 Giảm', sạ cụm bằng máy và kỹ thuật tưới ngập khô xen kẽ (AWD) để tăng năng suất và giảm phát thải khí nhà kính.",
    seasonId: "S001",
    seasonName: "Vụ Đông Xuân (Đồng bằng sông Cửu Long)",
    startDate: "2024-11-15",
    endDate: "2025-03-10",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1"],
    selectedPlotIds: ["plot-1-1", "plot-1-2"],
    crop: "Lúa",
    variety: "ST25",
    purpose: "cultivation",
    area: "20.0",
    expectedYield: "750",
    growthCycleId: "GC-LUA-01",
    selectedStages: [
      "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
      "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
    ],
    materialAllocations: [
      {
        id: 101,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        materialCategory: "Giống",
        materialType: "Giống xác nhận",
        materialName: "Hạt giống lúa ST25 cấp xác nhận",
        quantity: "60",
        unit: "kg/ha",
      },
      {
        id: 102,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "NPK 20-20-15+TE",
        quantity: "150",
        unit: "kg/ha/lần",
      },
    ],
    taskAllocations: [
      {
        id: 201,
        stageId: "GC-LUA-01:Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        name: "Gieo sạ cụm kết hợp vùi phân",
        description:
          "Sử dụng máy bay không người lái hoặc máy sạ cụm định vị để gieo sạ chính xác, khoảng cách hàng 20-30cm, kết hợp vùi phân sâu 3-4cm để tránh thất thoát đạm.",
        labor: "3 người",
        duration: "5 ngày",
      },
      {
        id: 202,
        stageId: "GC-LUA-01:Sinh trưởng dinh dưỡng - Đẻ nhánh",
        name: "Áp dụng tưới Ướt khô xen kẽ (AWD)",
        description:
          "Giữ mực nước 1-3cm. Khi lúa được 25-40 ngày, tiến hành rút nước để mặt ruộng khô nứt nẻ chân chim (thấp hơn mặt đất 15cm) giúp rễ ăn sâu, chống đổ ngã và giảm khí Metan.",
        labor: "2 người",
        duration: "15 ngày",
      },
    ],
    status: "active",
    createdAt: "2024-10-20",
    regimenId: "",
  },
  {
    id: 2,
    code: "PLN-LUA-SOIL-002",
    name: "Kế hoạch cải tạo đất nhiễm mặn phèn vụ Hè Thu",
    description:
      "Cày ải phơi đất, đánh rãnh rửa mặn và bón lót lân nung chảy để hạ phèn trước khi gieo sạ giống chịu mặn OM18.",
    seasonId: "S002",
    seasonName: "Vụ Hè Thu (Đồng bằng sông Cửu Long)",
    startDate: "2025-04-01",
    endDate: "2025-04-20",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Lúa",
    variety: "ST25",
    purpose: "amendment",
    area: "50.5",
    expectedYield: "0",
    growthCycleId: "",
    regimenId: "1",
    selectedStages: [
      "1:Cày lật, đánh rãnh & Rửa phèn",
      "1:Bón lót Vôi và Lân nung chảy",
    ],
    materialAllocations: [
      {
        id: 103,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        materialCategory: "Phân bón",
        materialType: "Cải tạo đất",
        materialName: "Vôi bột nông nghiệp (Ca(OH)2)",
        quantity: "1000 - 2000",
        unit: "kg/ha",
      },
      {
        id: 104,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Lân nung chảy (Văn Điển/Đầu Trâu)",
        quantity: "400 - 500",
        unit: "kg/ha",
      },
    ],
    taskAllocations: [
      {
        id: 203,
        stageId: "1:Cày lật, đánh rãnh & Rửa phèn",
        name: "Cày lật, đánh rãnh thoát nước và rửa phèn mặn",
        description:
          "Cày lật mặt ruộng sâu 15-20cm để lộ tầng đất sinh phèn. San phẳng mặt ruộng bằng tia laser, đánh rãnh rộng 20-30cm, sâu 15-20cm, cách nhau 6-9m để xả phèn mặn hiệu quả trước khi gieo sạ [1]. Bơm nước ngọt ngập 5-10cm, ngâm 3-5 ngày rồi xả kiệt. Lặp lại 3-5 lần.",
        labor: "3 người",
        duration: "15 ngày",
      },
      {
        id: 204,
        stageId: "1:Bón lót Vôi và Lân nung chảy",
        name: "Bón lót Vôi và Lân nung chảy trung hòa độc chất",
        description:
          "Bón rải 1 - 2 tấn vôi bột/ha để nâng pH. Sau đó bón lót chuyên biệt 400 - 500 kg Lân nung chảy trước khi bừa trục cuối. Lân sẽ kết hợp với Sắt (Fe), Nhôm (Al) thành dạng khó di động, giúp rễ mạ non tránh ngộ độc. Chú ý: Tuyệt đối không bón vôi cùng lúc với phân đạm.",
        labor: "5 người",
        duration: "5 ngày",
      },
    ],
    status: "active",
    createdAt: "2025-03-10",
  },
  {
    id: 3,
    code: "PLN-LUA-2025-003",
    name: "Kế hoạch gieo mạ và chống rét lúa vụ Chiêm Xuân (ĐBSH)",
    description:
      "Sử dụng giống chịu rét J02, làm mạ nền cứng che phủ nilon và điều tiết nước làm áo giữ ấm cho gốc lúa.",
    seasonId: "S004",
    seasonName: "Vụ Chiêm Xuân (Đồng bằng sông Hồng)",
    startDate: "2024-12-25",
    endDate: "2025-02-15",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Lúa",
    variety: "ST25",
    purpose: "cultivation",
    area: "50.5",
    expectedYield: "130",
    growthCycleId: "GC-LUA-02",
    selectedStages: [
      "GC-LUA-02:Ngâm ủ và Gieo mạ chống rét",
      "GC-LUA-02:Bén rễ hồi xanh và Đẻ nhánh",
    ],
    materialAllocations: [
      {
        id: 104,
        stageId: "GC-LUA-02:Ngâm ủ và Gieo mạ chống rét",
        materialCategory: "Vật tư",
        materialType: "Màng phủ",
        materialName: "Nilon trắng trong suốt và khung vòm tre",
        quantity: "150",
        unit: "cuộn",
      },
      {
        id: 105,
        stageId: "GC-LUA-02:Ngâm ủ và Gieo mạ chống rét",
        materialCategory: "Phân bón",
        materialType: "Phân lân và tro",
        materialName: "Supe lân và Tro bếp",
        quantity: "10",
        unit: "kg/sào",
      },
    ],
    taskAllocations: [
      {
        id: 204,
        stageId: "GC-LUA-02:Ngâm ủ và Gieo mạ chống rét",
        name: "Làm vòm nilon che mạ",
        description:
          "Làm vòm che nilon cho luống mạ rộng 1.2m, cao 0.5m. Rắc tro bếp để tăng nhiệt độ. Tuyệt đối không bón đạm Urê khi nhiệt độ < 15 độ C [8, 9].",
        labor: "5 người",
        duration: "7 ngày",
      },
      {
        id: 205,
        stageId: "GC-LUA-02:Bén rễ hồi xanh và Đẻ nhánh",
        name: "Điều tiết nước giữ ấm",
        description:
          "Duy trì lớp nước mặt từ 3-5 cm với phương châm 'lấy nước làm áo' để chống rét cho lúa sau cấy [9].",
        labor: "2 người",
        duration: "20 ngày",
      },
    ],
    status: "active",
    createdAt: "2024-11-20",
    regimenId: "",
  },
  {
    id: 4,
    code: "PLN-LUA-TREAT-002",
    name: "Kế hoạch né rầy và phòng trừ đạo ôn lúa Đài Thơm 8",
    description:
      "Thực hiện xuống giống đồng loạt né rầy dựa vào bẫy đèn. Quản lý bệnh đạo ôn cổ bông ở giai đoạn làm đòng, trổ bông bằng cách kết hợp điều tiết nước, ngắt nguồn đạm và phun thuốc đặc trị nội hấp.",
    seasonId: "S002",
    seasonName: "Vụ Hè Thu (Đồng bằng sông Cửu Long)",
    startDate: "2025-06-10",
    endDate: "2025-06-25",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Lúa",
    variety: "ST25",
    purpose: "treatment",
    area: "50.5",
    expectedYield: "0",
    growthCycleId: "",
    regimenId: "101",
    selectedStages: [
      "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
      "101:Phun thuốc đặc trị Đạo ôn",
    ],
    materialAllocations: [
      {
        id: 106,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        materialCategory: "Thuốc BVTV",
        materialType: "Fungicide",
        materialName: "Thuốc đặc trị đạo ôn (Fuji-one 40EC / Zilla 100SC)",
        quantity: "1.0 - 1.2",
        unit: "lít/ha",
      },
      {
        id: 1780332724777,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        materialCategory: "Nông cụ",
        materialType: "Nông cụ",
        materialName: "Cuốc",
        quantity: "2",
        unit: "cái",
      },
      {
        id: 1780332733460,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        materialCategory: "Nông cụ",
        materialType: "Nông cụ",
        materialName: "Ủng bảo hộ",
        quantity: "10",
        unit: "đôi",
      },
    ],
    taskAllocations: [
      {
        id: 206,
        stageId: "101:Cắt đứt nguồn dinh dưỡng & Giữ nước",
        name: "Cắt đứt nguồn dinh dưỡng & Giữ nước",
        description:
          "Ngay khi phát hiện dấu hiệu bệnh, lập tức ngừng bón phân đạm, NPK và phân bón lá. Bắt buộc giữ mực nước ruộng ổn định từ 3-5cm để lúa hút nước, giảm sốc sinh lý, tuyệt đối không để ruộng khô cạn.",
        labor: "1 người",
        duration: "14 ngày",
      },
      {
        id: 207,
        stageId: "101:Phun thuốc đặc trị Đạo ôn",
        name: "Phun phòng/trị đạo ôn cổ bông",
        description:
          "Áp dụng máy bay không người lái để phun sương mịn ướt đều toàn bộ thân lá. Bắt buộc phun phòng 2 lần: lần 1 trước khi lúa trổ 5-7 ngày và lần 2 sau khi lúa trổ đều hoàn toàn 7-10 ngày. Chú ý: Tuyệt đối không pha chung kali trắng (K2SO4) khi lúa đang bị bệnh.",
        labor: "2 người (điều khiển Drone)",
        duration: "2 ngày",
      },
    ],
    status: "active",
    createdAt: "2025-05-15",
  },
  {
    id: 5,
    code: "PLN-LUA-HARVEST-002",
    name: "Kế hoạch thu hoạch và quản lý rơm rạ không đốt đồng",
    description:
      "Cắt nước cuối vụ, thu hoạch cơ giới và sử dụng nấm Trichoderma để phân hủy rơm rạ trực tiếp trên đồng, hướng tới Nông nghiệp tuần hoàn.",
    seasonId: "S001",
    seasonName: "Vụ Đông Xuân (Đồng bằng sông Cửu Long)",
    startDate: "2025-03-01",
    endDate: "2025-03-15",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Lúa",
    variety: "ST25",
    purpose: "harvest",
    area: "50.5",
    expectedYield: "750",
    growthCycleId: "",
    regimenId: "",
    selectedStages: ["Thời kỳ Lúa chín và Thu hoạch"],
    materialAllocations: [
      {
        id: 107,
        stageId: "Thời kỳ Lúa chín và Thu hoạch",
        materialCategory: "Chế phẩm sinh học",
        materialType: "Vi sinh",
        materialName: "Nấm đối kháng Trichoderma",
        quantity: "5",
        unit: "kg/ha",
      },
      {
        id: 1780329683502,
        stageId: "Thu hoạch",
        materialCategory: "Nông cụ",
        materialType: "Nông cụ",
        materialName: "Cưa cầm tay",
        quantity: "10",
        unit: "cái",
      },
      {
        id: 1780329690848,
        stageId: "Thu hoạch",
        materialCategory: "Nông cụ",
        materialType: "Nông cụ",
        materialName: "Ủng bảo hộ",
        quantity: "20",
        unit: "đôi",
      },
    ],
    taskAllocations: [
      {
        id: 1780329761088,
        stageId: "Thu hoạch",
        name: "Rút cạn nước trước thu hoạch",
        description:
          "Rút nước trước khi thu hoạch 7-10 ngày để mặt ruộng khô cứng, giúp máy gặt đập liên hợp di chuyển dễ dàng và hạt lúa chín đồng đều.",
        labor: "1 người",
        duration: "10 ngày",
        geographicalSelections: [
          {
            id: "4xxqyv0ei",
            type: "region",
            regionId: "1",
          },
        ],
      },
      {
        id: 1780329791647,
        stageId: "Thu hoạch",
        name: "Cuốn rơm và xử lý gốc rạ",
        description:
          "Tuyệt đối không đốt đồng. Dùng máy cuốn rơm đưa rơm ra khỏi ruộng để trồng nấm/cho bò ăn. Gốc rạ còn lại rải Trichoderma rồi cày vùi lấp để phân hủy thành phân hữu cơ.",
        labor: "4 người",
        duration: "5 ngày",
        geographicalSelections: [
          {
            id: "4xxqyv0ei",
            type: "region",
            regionId: "1",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2025-02-10",
  },
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
