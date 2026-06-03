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

export const initialPlans: Plan[] = [
  {
    id: 7,
    code: "PLN-COCO-CAY-001",
    name: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    description:
      "Áp dụng quy trình canh tác Dừa Xiêm xanh uống nước theo GC_VAR_001: Giai đoạn kiến thiết, ra hoa đậu trái và thu hoạch ổn định. Mục tiêu năng suất 130 trái/cây/năm.",
    seasonId: "S_COCO_002",
    seasonName: "Vụ Dừa Xiêm xanh - Mùa nắng ĐBSCL",
    startDate: "2026-06-01",
    endDate: "2029-06-01",
    selectedRegionIds: ["1", "3"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2"],
    crop: "Dừa",
    variety: "Dừa Xiêm xanh",
    purpose: "cultivation",
    area: "2.8",
    expectedYield: "130",
    growthCycleId: "GC_VAR_001",
    regimenId: "",
    selectedStages: [
      "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
      "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
      "GC_VAR_001:Giai đoạn thu hoạch ổn định",
    ],
    materialAllocations: [
      {
        id: 301,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân chuồng hoai mục bón lót",
        quantity: "10",
        unit: "kg/hố",
      },
      {
        id: 302,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "NPK 15-15-15",
        quantity: "0.5",
        unit: "kg/cây/lần (2 tháng/lần)",
      },
      {
        id: 303,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Kali Clorua (KCl)",
        quantity: "0.5",
        unit: "kg/cây/năm",
      },
      {
        id: 304,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        materialCategory: "Phân bón vi lượng",
        materialType: "Phân vô cơ",
        materialName: "Boron (Bo - vi lượng)",
        quantity: "10",
        unit: "g/cây/năm",
      },
      {
        id: 305,
        stageId: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Thuốc trừ nhện đỏ, bọ cánh cứng",
        quantity: "1",
        unit: "lít/ha/đợt phun",
      },
    ],
    taskAllocations: [
      {
        id: 301,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Đào hố, bón lót và trồng cây giống",
        description:
          "Đào hố 60x60x60cm, bón lót 10kg phân hữu cơ hoai. Khoảng cách trồng 6x7m. Tưới 2-3 lần/tuần mùa khô.",
        labor: "4 người",
        duration: "5 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-1-r1-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
          {
            id: "geo-coco-1-r1-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 302,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Bón thúc NPK định kỳ",
        description:
          "Bón NPK 15-15-15 định kỳ 2 tháng/lần. Tưới nước đủ ẩm sau khi bón. Theo dõi sâu đục thân, bọ dừa.",
        labor: "2 người",
        duration: "2 ngày",
        isRepeating: true,
        repeatWeeks: 8,
        geographicalSelections: [
          {
            id: "geo-coco-1-r1-03",
            type: "area",
            regionId: "1",
            areaId: "sub-1-1",
          },
        ],
      },
      {
        id: 303,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "Quản lý dinh dưỡng và bảo vệ buồng hoa",
        description:
          "Bón bổ sung Kali và Boron khi cây ra buồng hoa. Phun phòng sâu đục buồng định kỳ. Tỉa bỏ trái dị dạng.",
        labor: "2 người",
        duration: "3 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-1-r1-04",
            type: "area",
            regionId: "1",
            areaId: "sub-1-2",
          },
        ],
      },
      {
        id: 304,
        stageId: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
        name: "Thu hoạch định kỳ và kiểm tra cây",
        description:
          "Chu kỳ thu hoạch 45-60 ngày/lần. Chọn trái 7-8 tháng tuổi. Kiểm tra sức khỏe cây sau mỗi đợt thu.",
        labor: "3 người",
        duration: "2 ngày",
        isRepeating: true,
        repeatWeeks: 7,
        geographicalSelections: [
          {
            id: "geo-coco-1-bt-05",
            type: "region",
            regionId: "REG-BEN-TRE",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2026-05-15",
  },
  {
    id: 8,
    code: "PLN-COCO-SOIL-001",
    name: "Kế hoạch cải tạo đất phèn mặn - Vườn dừa Bến Tre",
    description:
      "Áp dụng phác đồ PD-COCO-SOIL-PHENMAN-001: Rửa mặn, hạ phèn, tái tạo rễ cám cho vườn dừa kinh doanh bị ảnh hưởng bởi xâm nhập mặn mùa khô.",
    seasonId: "S_COCO_001",
    seasonName: "Vụ Dừa kinh doanh chính - ĐBSCL",
    startDate: "2026-05-15",
    endDate: "2026-07-15",
    selectedRegionIds: ["1", "5"],
    selectedZoneIds: ["sub-1-1"],
    selectedPlotIds: ["plot-1-3"],
    crop: "Dừa",
    variety: "Tất cả các giống",
    purpose: "amendment",
    area: "2.5",
    expectedYield: "0",
    growthCycleId: "",
    regimenId: "10",
    selectedStages: [
      "10:Rửa mặn, thau chua mương vườn",
      "10:Bón vôi Dolomite giải độc và bù Canxi",
      "10:Tái tạo rễ cám bằng Lân và Humic",
      "10:Bồi bùn mương và Bón phân hữu cơ vi sinh",
    ],
    materialAllocations: [
      {
        id: 401,
        stageId: "10:Rửa mặn, thau chua mương vườn",
        materialCategory: "Thiết bị",
        materialType: "equipment",
        materialName: "Máy bơm nước + nhiên liệu",
        quantity: "1",
        unit: "bộ",
      },
      {
        id: 402,
        stageId: "10:Bón vôi Dolomite giải độc và bù Canxi",
        materialCategory: "Phân bón",
        materialType: "Phân khoáng",
        materialName: "Vôi Dolomite nông nghiệp",
        quantity: "300",
        unit: "kg/ha",
      },
      {
        id: 403,
        stageId: "10:Tái tạo rễ cám bằng Lân và Humic",
        materialCategory: "Phân bón",
        materialType: "Phân khoáng",
        materialName: "Lân nung chảy Văn Điển",
        quantity: "1.5",
        unit: "kg/cây",
      },
      {
        id: 404,
        stageId: "10:Tái tạo rễ cám bằng Lân và Humic",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Super Humic (Axit Humic 85%)",
        quantity: "50",
        unit: "g/cây",
      },
      {
        id: 405,
        stageId: "10:Bồi bùn mương và Bón phân hữu cơ vi sinh",
        materialCategory: "Chế phẩm vi sinh",
        materialType: "fertilizer",
        materialName: "Phân chuồng ủ Trichoderma",
        quantity: "25",
        unit: "kg/cây",
      },
    ],
    taskAllocations: [
      {
        id: 401,
        stageId: "10:Rửa mặn, thau chua mương vườn",
        name: "Bơm nước ngọt rửa mặn và xổ phèn mương",
        description:
          "Bơm nước ngọt (độ mặn < 3‰) vào mương, tưới đẫm mặt liếp, mở cống đáy xổ nước mương 2-3 lần.",
        labor: "2 người",
        duration: "5 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-2-r1-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
      {
        id: 402,
        stageId: "10:Bón vôi Dolomite giải độc và bù Canxi",
        name: "Rải vôi Dolomite đều mặt liếp",
        description:
          "Rải 300-500 kg Dolomite/ha sau rửa mặn 3-5 ngày. Không bón cùng phân vô cơ.",
        labor: "3 người",
        duration: "2 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-2-r1-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
      {
        id: 403,
        stageId: "10:Tái tạo rễ cám bằng Lân và Humic",
        name: "Bón Lân nung chảy và Super Humic kích rễ",
        description:
          "Bón 1.5 kg Lân nung chảy + 50g Super Humic quanh hình chiếu tán. Không dùng phân gốc Sunfat.",
        labor: "2 người",
        duration: "3 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-2-r1-03",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
      {
        id: 404,
        stageId: "10:Bồi bùn mương và Bón phân hữu cơ vi sinh",
        name: "Bồi bùn mương và bón phân hữu cơ vi sinh",
        description:
          "Hất lớp bùn đáy mương (2-4 cm) lên mặt liếp. Bón kèm 25kg phân hữu cơ ủ Trichoderma/cây.",
        labor: "5 người",
        duration: "7 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-2-r1-04",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2026-05-01",
  },
  {
    id: 9,
    code: "PLN-COCO-TREAT-001",
    name: "Kế hoạch điều trị Sâu đầu đen hại dừa (Mức nặng - Bình Định)",
    description:
      "Áp dụng phác đồ PT-COCO-SDD-001: Cắt tỉa cơ học, phun thuốc đặc trị Flubendiamide, phóng thích ong ký sinh để dập dịch Opisina arenosella.",
    seasonId: "S_COCO_003",
    seasonName: "Vụ Dừa Ta canh tác Bình Định",
    startDate: "2026-06-03",
    endDate: "2026-07-03",
    selectedRegionIds: ["3", "5"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Dừa",
    variety: "Dừa Ta",
    purpose: "treatment",
    area: "5.0",
    expectedYield: "0",
    growthCycleId: "",
    regimenId: "101",
    selectedStages: [
      "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
      "101:Phun thuốc hóa học dập dịch cục bộ",
      "101:Phóng thích thiên địch (Ong ký sinh)",
    ],
    materialAllocations: [
      {
        id: 501,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư",
        materialName: "Kéo cắt cành lớn, câu liêm",
        quantity: "5",
        unit: "cái",
      },
      {
        id: 502,
        stageId: "101:Phun thuốc hóa học dập dịch cục bộ",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Takumi 20WG (Flubendiamide)",
        quantity: "8",
        unit: "g/16L/3-4 cây",
      },
      {
        id: 503,
        stageId: "101:Phun thuốc hóa học dập dịch cục bộ",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Dầu khoáng SK Enspray 99EC",
        quantity: "10",
        unit: "ml/16L",
      },
      {
        id: 504,
        stageId: "101:Phóng thích thiên địch (Ong ký sinh)",
        materialCategory: "Chế phẩm sinh học",
        materialType: "bio",
        materialName: "Ong ký sinh Goniozus nephantidis",
        quantity: "4000",
        unit: "con/ha",
      },
    ],
    taskAllocations: [
      {
        id: 501,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        name: "Cắt tỉa tàu lá bị sâu và tiêu hủy",
        description:
          "Cắt toàn bộ tàu lá già bị sâu ăn cháy, thu gom đốt hoặc ngâm ngập nước mương. Thực hiện đồng loạt trên diện rộng.",
        labor: "6 người",
        duration: "2 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-3-r3-01",
            type: "plot",
            regionId: "3",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
          {
            id: "geo-coco-3-r5-01",
            type: "plot",
            regionId: "5",
            areaId: "sub-1-2",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 502,
        stageId: "101:Phun thuốc hóa học dập dịch cục bộ",
        name: "Phun thuốc đặc trị Takumi + dầu khoáng",
        description:
          "Phun Takumi 20WG pha dầu khoáng, xịt mạnh hai mặt lá. Phun 2 lần cách 7-10 ngày. Sáng sớm hoặc chiều mát.",
        labor: "4 người",
        duration: "8 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-3-r3-02",
            type: "plot",
            regionId: "3",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
          {
            id: "geo-coco-3-r5-02",
            type: "plot",
            regionId: "5",
            areaId: "sub-1-2",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 503,
        stageId: "101:Phóng thích thiên địch (Ong ký sinh)",
        name: "Thả ong ký sinh Goniozus nephantidis",
        description:
          "Thả 20 con ong/cây (4.000 con/ha) vào lúc 8-10h hoặc 3-5h chiều. Ngừng hoàn toàn thuốc trừ sâu hóa học.",
        labor: "3 người",
        duration: "2 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-3-r3-03",
            type: "area",
            regionId: "3",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2026-06-01",
  },
  {
    id: 10,
    code: "PLN-COCO-CAY-002",
    name: "Kế hoạch canh tác Dừa sáp Cầu Kè chuyên canh (Trà Vinh)",
    description:
      "Áp dụng quy trình chuyên canh GC_VAR_003: Vườn ươm cây mô, kiến thiết cơ bản, thụ phấn nhân tạo và thu hoạch phân loại trái sáp. Mục tiêu tỷ lệ sáp ≥ 55%.",
    seasonId: "S_COCO_003",
    seasonName: "Vụ Dừa Ta canh tác Bình Định",
    startDate: "2026-07-01",
    endDate: "2031-07-01",
    selectedRegionIds: ["1", "5"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2"],
    crop: "Dừa",
    variety: "Dừa sáp (Dừa kem)",
    purpose: "cultivation",
    area: "1.5",
    expectedYield: "60",
    growthCycleId: "GC_VAR_003",
    regimenId: "",
    selectedStages: [
      "GC_VAR_003:Giai đoạn vườn ươm cây mô (0-6 tháng)",
      "GC_VAR_003:Giai đoạn kiến thiết (6-54 tháng)",
      "GC_VAR_003:Giai đoạn ra hoa, đậu trái (tháng 48-60)",
      "GC_VAR_003:Thu hoạch và phân loại",
    ],
    materialAllocations: [
      {
        id: 601,
        stageId: "GC_VAR_003:Giai đoạn vườn ươm cây mô (0-6 tháng)",
        materialCategory: "Giống cây trồng",
        materialType: "Cây giống",
        materialName: "Cây giống Dừa sáp cấy mô (ViGen)",
        quantity: "156",
        unit: "cây (8x8m - 1.5ha)",
      },
      {
        id: 602,
        stageId: "GC_VAR_003:Giai đoạn vườn ươm cây mô (0-6 tháng)",
        materialCategory: "Phân bón lá",
        materialType: "Phân vô cơ",
        materialName: "Phân bón lá NPK + vi lượng",
        quantity: "2",
        unit: "lít/đợt phun (2 tuần/lần)",
      },
      {
        id: 603,
        stageId: "GC_VAR_003:Giai đoạn kiến thiết (6-54 tháng)",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân chuồng hoai mục bón lót",
        quantity: "20",
        unit: "kg/hố",
      },
      {
        id: 604,
        stageId: "GC_VAR_003:Giai đoạn kiến thiết (6-54 tháng)",
        materialCategory: "Phân bón",
        materialType: "Phân khoáng",
        materialName: "Super lân (lân đơn) bón lót",
        quantity: "500",
        unit: "g/hố",
      },
      {
        id: 605,
        stageId: "GC_VAR_003:Giai đoạn ra hoa, đậu trái (tháng 48-60)",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thụ phấn",
        materialName: "Túi lưới bao buồng hoa",
        quantity: "500",
        unit: "cái/vụ",
      },
    ],
    taskAllocations: [
      {
        id: 601,
        stageId: "GC_VAR_003:Giai đoạn vườn ươm cây mô (0-6 tháng)",
        name: "Nhận và chăm sóc cây giống cấy mô",
        description:
          "Nhận cây giống từ ViGen, ươm trong bầu 30x50cm, che 50% nắng. Phun phân bón lá NPK mỗi 2 tuần.",
        labor: "2 người",
        duration: "180 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-4-r1-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
        ],
      },
      {
        id: 602,
        stageId: "GC_VAR_003:Giai đoạn kiến thiết (6-54 tháng)",
        name: "Đào hố, bón lót và trồng cây giống dừa sáp",
        description:
          "Đào hố 80x80x80cm, khoảng cách 8x8m. Bón lót 20kg phân hữu cơ + 500g super lân + vôi. Trồng xen cây thụ phấn tỷ lệ 1:5.",
        labor: "6 người",
        duration: "10 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-4-r1-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
        ],
      },
      {
        id: 603,
        stageId: "GC_VAR_003:Giai đoạn ra hoa, đậu trái (tháng 48-60)",
        name: "Thụ phấn nhân tạo và bao buồng hoa",
        description:
          "Thu phấn hoa đực sáng sớm 6-9h, bảo quản lạnh. Thụ phấn bổ sung khi hoa cái trổ. Bao buồng non bằng lưới.",
        labor: "3 người",
        duration: "30 ngày",
        isRepeating: true,
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-coco-4-r1-03",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 604,
        stageId: "GC_VAR_003:Thu hoạch và phân loại",
        name: "Thu hoạch và phân loại trái sáp",
        description:
          "Dùng siêu âm xác định trái sáp. Thu trái 11-12 tháng tuổi. Phân loại sáp thật (110-220k VNĐ) và trái thường (15-20k VNĐ).",
        labor: "4 người",
        duration: "3 ngày",
        isRepeating: true,
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-coco-4-r1-04",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-2",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2026-06-15",
  },
  {
    id: 11,
    code: "PLN-COCO-SOIL-002",
    name: "Kế hoạch cải tạo đất cát và chống rửa trôi - Vườn dừa Bình Định",
    description:
      "Áp dụng phác đồ PD-COCO-SOIL-DATCAT-002: Tủ gốc sinh học, bổ sung mùn hữu cơ & mụn dừa, bón phân nhả chậm và thiết lập tưới nhỏ giọt cho vườn dừa ta trên nền đất cát miền Trung.",
    seasonId: "S_COCO_004",
    seasonName: "Vụ dừa mùa treo - Phòng rụng trái non",
    startDate: "2026-09-01",
    endDate: "2027-02-28",
    selectedRegionIds: ["1", "3", "5"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Dừa",
    variety: "Dừa Ta / Dừa Dâu",
    purpose: "amendment",
    area: "5.0",
    expectedYield: "0",
    growthCycleId: "",
    regimenId: "11",
    selectedStages: [
      "11:Quản lý thảm phủ và tủ gốc giữ ẩm",
      "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
      "11:Áp dụng phân bón vô cơ nhả chậm và Tưới nhỏ giọt",
    ],
    materialAllocations: [
      {
        id: 701,
        stageId: "11:Quản lý thảm phủ và tủ gốc giữ ẩm",
        materialCategory: "Vật tư nông nghiệp",
        materialType: "Vật tư",
        materialName: "Tàu dừa khô / Rơm rạ tủ gốc",
        quantity: "50",
        unit: "kg/cây",
      },
      {
        id: 702,
        stageId: "11:Quản lý thảm phủ và tủ gốc giữ ẩm",
        materialCategory: "Giống cây trồng",
        materialType: "Cây che phủ",
        materialName: "Hạt giống cỏ Kudzu / Cỏ lạc dại",
        quantity: "5",
        unit: "kg/ha",
      },
      {
        id: 703,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân bò / gà hoai mục",
        quantity: "35",
        unit: "kg/cây/năm",
      },
      {
        id: 704,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        materialCategory: "Vật tư nông nghiệp",
        materialType: "Cải tạo đất",
        materialName: "Mụn dừa đã xử lý EC",
        quantity: "7",
        unit: "kg/cây",
      },
      {
        id: 705,
        stageId: "11:Áp dụng phân bón vô cơ nhả chậm và Tưới nhỏ giọt",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "NPK 20-10-0 + 10.5Ca + 7S nhả chậm",
        quantity: "1",
        unit: "kg/cây/lần (2 tháng/lần)",
      },
      {
        id: 706,
        stageId: "11:Áp dụng phân bón vô cơ nhả chậm và Tưới nhỏ giọt",
        materialCategory: "Thiết bị",
        materialType: "equipment",
        materialName: "Hệ thống tưới nhỏ giọt tận gốc",
        quantity: "1",
        unit: "bộ/ha",
      },
    ],
    taskAllocations: [
      {
        id: 701,
        stageId: "11:Quản lý thảm phủ và tủ gốc giữ ẩm",
        name: "Tủ gốc rơm/tàu dừa và trồng cỏ che phủ",
        description:
          "Phủ tàu dừa khô hoặc rơm rạ bán kính 1.5-2m quanh gốc. Gieo hạt cỏ họ đậu giữa các hàng dừa.",
        labor: "4 người",
        duration: "3 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-5-r1-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
        ],
      },
      {
        id: 702,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        name: "Bón phân hữu cơ và mụn dừa cải tạo đất cát",
        description:
          "Trộn 35kg phân hữu cơ + 7kg mụn dừa xử lý EC vào lớp đất 15-20cm. Bón lót thêm 200-400 kg Dolomite/ha.",
        labor: "5 người",
        duration: "10 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-5-r1-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
      {
        id: 703,
        stageId: "11:Áp dụng phân bón vô cơ nhả chậm và Tưới nhỏ giọt",
        name: "Lắp đặt tưới nhỏ giọt và bón phân nhả chậm",
        description:
          "Lắp hệ thống tưới nhỏ giọt tận gốc. Bón NPK nhả chậm chia 6 lần/năm. Không bón Urê hạt trên nền cát.",
        labor: "3 người",
        duration: "5 ngày",
        geographicalSelections: [
          {
            id: "geo-coco-5-r3-01",
            type: "area",
            regionId: "3",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    status: "draft",
    createdAt: "2026-06-20",
  },
  {
    id: 4,
    code: "PLN-COCO-HARV-002",
    name: "Kế hoạch thu hoạch Dừa Ta / Dừa Dâu (Thu dừa khô)",
    description:
      "Thu hoạch buồng quả đạt 11-12 tháng tuổi phục vụ ngành ép dầu và nạo sấy. Sử dụng sào tre gắn liềm để giật quả từ dưới đất.",
    seasonId: "S_COCO_003",
    seasonName: "Vụ Dừa Ta đặc sản - Hoài Nhơn",
    startDate: "2026-07-05",
    endDate: "2026-07-10",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1", "sub-1-2"],
    selectedPlotIds: ["plot-1-1", "plot-1-2", "plot-1-3"],
    crop: "Sầu riêng",
    variety: "Monthong",
    purpose: "harvest",
    area: "50.5",
    expectedYield: "12000",
    growthCycleId: "",
    regimenId: "",
    selectedStages: ["Thu hoạch"],
    materialAllocations: [
      {
        id: 401,
        stageId: "Thu hoạch",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Sào tre nối dài gắn liềm (sào hái dừa)",
        quantity: "5",
        unit: "cây",
      },
    ],
    taskAllocations: [
      {
        id: 501,
        stageId: "Thu hoạch",
        name: "Dùng sào giật dừa khô",
        description:
          "Xác định các buồng dừa đạt 11-12 tháng tuổi (vỏ quả chuyển màu nâu, có nốt khô). Đứng dưới đất dùng sào tre có gắn liềm móc vào cuống buồng và giật mạnh để buồng dừa rơi tự do xuống liếp đất.",
        labor: "4 người",
        duration: "5 ngày",
      },
      {
        id: 502,
        stageId: "Thu hoạch",
        name: "Thu gom và tập kết dừa khô",
        description:
          "Thu gom các quả dừa rụng dưới đất, cho vào ghe hoặc xe rùa tập kết ra bãi thu mua của thương lái hoặc hợp tác xã.",
        labor: "3 người",
        duration: "5 ngày",
      },
    ],
    status: "active",
    createdAt: "2026-06-20T00:00:00Z",
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
