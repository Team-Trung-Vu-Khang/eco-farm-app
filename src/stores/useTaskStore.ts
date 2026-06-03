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
  // =====================================================================
  // CÔNG VIỆC CANH TÁC CÂY DỪA
  // =====================================================================
  // GĐ1: CHUẨN BỊ ĐẤT & TRỒNG MỚI
  {
    id: 201,
    code: "CV-COCO-KT-001",
    name: "Lên liếp, đào mương và chuẩn bị hố trồng (Dừa Xiêm xanh - ĐBSCL)",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
    assignedTo: ["Đội Cơ giới Vườn 1"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Kỹ thuật viên Nông học"],
    startDate: "2026-06-01",
    endDate: "2026-06-06",
    priority: "high",
    status: "pending",
    description:
      "Lên liếp và đắp mô cao 30-40cm, đường kính mô 60-80cm. Đào hệ thống mương vườn sâu để thoát nước và rửa phèn mặn. Chuẩn bị hố trồng kích thước 60x60x60cm. Xử lý hố bằng Trichoderma spp. trước 15 ngày để diệt tuyến trùng.",
    createdAt: "2026-05-20",
    materials: [
      {
        id: 601,
        taskId: 301,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Phân hữu cơ hoai mục bón lót hố",
        quantity: "10",
        unit: "kg/hố",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân chuồng hoai mục bón lót",
      },
      {
        id: 602,
        taskId: 301,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Nấm Trichoderma xử lý hố",
        quantity: "50",
        unit: "g/hố",
        type: "other",
        materialCategory: "Chế phẩm vi sinh",
        materialType: "bio",
        materialName: "Trichoderma spp. (bột)",
      },
    ],
    tasks: [
      {
        id: 301,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Lên liếp đắp mô và đào mương vườn",
        description:
          "Lên liếp cao 30-40cm, đắp mô đường kính 60-80cm. Đào mương rộng 1-1.5m, sâu 0.8m xung quanh vườn.",
        labor: "6 người",
        duration: "5 ngày",
        startDate: "2026-06-01",
        endDate: "2026-06-05",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-kt-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
          {
            id: "geo-coco-kt-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-2",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-kt-01",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
      },
      {
        id: "geo-coco-kt-02",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-2",
      },
    ],
  },

  {
    id: 202,
    code: "CV-COCO-KT-002",
    name: "Xuống giống cây dừa Xiêm xanh và che mát cây con",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
    assignedTo: ["Đội Trồng trọt 1", "Nguyễn Thị Mai"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Kỹ thuật viên Giống"],
    startDate: "2026-06-06",
    endDate: "2026-06-11",
    priority: "high",
    status: "pending",
    description:
      "Chọn cây giống Dừa Xiêm xanh đạt chuẩn (khỏe, gốc to, nhiều rễ). Trồng với khoảng cách 6x7m. Cắm cọc giữ cây, che mát bằng tàu lá dừa cắm xung quanh gốc trong năm đầu. Tưới nước 2-3 lần/tuần mùa khô.",
    createdAt: "2026-05-25",
    materials: [
      {
        id: 603,
        taskId: 302,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Cây giống Dừa Xiêm xanh đạt chuẩn",
        quantity: "200",
        unit: "cây (6x7m - 2.8ha)",
        type: "other",
        materialCategory: "Giống cây trồng",
        materialType: "Cây giống",
        materialName: "Cây giống Dừa Xiêm xanh xuất vườn",
      },
    ],
    tasks: [
      {
        id: 302,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Trồng cây giống và cắm cọc giữ cây",
        description:
          "Đặt cây giống vào hố, lấp đất nén chặt gốc, cắm 3 cọc tre giữ cây không lay gốc khi gió. Che mát năm đầu.",
        labor: "4 người",
        duration: "5 ngày",
        startDate: "2026-06-06",
        endDate: "2026-06-10",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-kt-03",
            type: "area",
            regionId: "1",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-kt-03", type: "area", regionId: "1", areaId: "sub-1-1" },
    ],
  },

  // GĐ2: CHĂM SÓC CÂY CON (0-3 NĂM)
  {
    id: 203,
    code: "CV-COCO-CC-003",
    name: "Làm cỏ, tủ gốc giữ ẩm và bồi bùn mương (Đợt mùa khô 2026)",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: [],
    startDate: "2026-11-01",
    endDate: "2026-11-10",
    priority: "medium",
    status: "pending",
    description:
      "Làm cỏ xung quanh gốc dừa 3-4 lần/năm đầu. Tủ gốc bằng tàn dư thực vật, vỏ dừa, cỏ khô để giữ ẩm đầu mùa khô. Vét bùn đáy mương đắp lên liếp để cung cấp phù sa — KHÔNG bồi quá dày (trên 5cm) để tránh ngạt rễ cây non.",
    createdAt: "2026-10-15",
    materials: [
      {
        id: 604,
        taskId: 303,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Vỏ dừa / cỏ khô tủ gốc",
        quantity: "10",
        unit: "kg/gốc",
        type: "other",
        materialCategory: "Vật tư nông nghiệp",
        materialType: "Vật tư",
        materialName: "Vỏ dừa / rơm rạ tủ gốc",
      },
    ],
    tasks: [
      {
        id: 303,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Làm cỏ và tủ gốc giữ ẩm",
        description:
          "Làm sạch cỏ dại quanh gốc bán kính 1m. Tủ vỏ dừa / rơm dày 10cm quanh gốc. Vét bùn mương đắp mỏng (<5cm) lên liếp.",
        labor: "4 người",
        duration: "8 ngày",
        startDate: "2026-11-01",
        endDate: "2026-11-08",
        isRepeating: true,
        repeatWeeks: 12,
        geographicalSelections: [
          { id: "geo-coco-cc-01", type: "region", regionId: "1" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-cc-01", type: "region", regionId: "1" },
    ],
  },

  {
    id: 204,
    code: "CV-COCO-CC-004",
    name: "Bón thúc NPK định kỳ cho dừa kiến thiết (2 tháng/lần)",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
    assignedTo: ["Phạm Văn Định"],
    assignedType: "individual",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Kỹ thuật viên Nông học"],
    startDate: "2026-08-01",
    endDate: "2026-08-02",
    priority: "medium",
    status: "pending",
    description:
      "Vét rãnh vành khăn theo hình chiếu tán (sâu 10-15cm, rộng 20cm, cách gốc 1.5-2m). Rải NPK 15-15-15 định kỳ 2 tháng/lần. Tưới nước đủ ẩm sau khi bón. Theo dõi sâu đục thân, bọ dừa.",
    createdAt: "2026-07-15",
    materials: [
      {
        id: 605,
        taskId: 304,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "NPK 15-15-15 bón gốc",
        quantity: "0.5",
        unit: "kg/cây/lần",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "NPK 15-15-15",
      },
    ],
    tasks: [
      {
        id: 304,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Vét rãnh và bón NPK định kỳ",
        description:
          "Vét rãnh vành khăn quanh gốc, rải NPK 15-15-15, lấp đất lại. Tưới đẫm nước sau bón.",
        labor: "2 người",
        duration: "2 ngày",
        startDate: "2026-08-01",
        endDate: "2026-08-02",
        isRepeating: true,
        repeatWeeks: 8,
        geographicalSelections: [
          {
            id: "geo-coco-cc-02",
            type: "area",
            regionId: "1",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-cc-02", type: "area", regionId: "1", areaId: "sub-1-1" },
    ],
  },

  // GĐ3: CHĂM SÓC THỜI KỲ KINH DOANH
  {
    id: 205,
    code: "CV-COCO-KB-005",
    name: "Bón phân NPK + Kali Clorua + Muối NaCl thời kỳ kinh doanh",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Kỹ thuật viên Nông học"],
    startDate: "2029-07-01",
    endDate: "2029-07-03",
    priority: "high",
    status: "pending",
    description:
      "Giai đoạn kinh doanh từ năm thứ 4 trở đi. Vét rãnh vành khăn (sâu 10-15cm, cách gốc 1.5-2m), rải NPK tổng hợp và Kali Clorua chống nứt rụng trái non. Rải thêm Muối ăn (NaCl) quanh gốc vì dừa rất cần vi lượng Clo. Bón vôi Dolomite đầu mùa mưa (cách bón phân hóa học 10 ngày).",
    createdAt: "2029-06-15",
    materials: [
      {
        id: 606,
        taskId: 305,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "NPK tổng hợp thời kỳ kinh doanh",
        quantity: "1.5",
        unit: "kg/cây/lần",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "NPK 13-13-21 (cao Kali)",
      },
      {
        id: 607,
        taskId: 305,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "Kali Clorua (KCl) chống nứt trái",
        quantity: "0.5",
        unit: "kg/cây/năm",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân vô cơ",
        materialName: "Kali Clorua (KCl)",
      },
      {
        id: 608,
        taskId: 305,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "Muối ăn NaCl vi lượng Clo",
        quantity: "0.5",
        unit: "kg/cây/năm",
        type: "fertilizer",
        materialCategory: "Phân bón vi lượng",
        materialType: "Khoáng chất",
        materialName: "Muối ăn (NaCl) rải gốc dừa",
      },
      {
        id: 609,
        taskId: 305,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "Vôi Dolomite bón đầu mùa mưa",
        quantity: "400",
        unit: "kg/ha/năm",
        type: "other",
        materialCategory: "Phân bón",
        materialType: "Phân khoáng",
        materialName: "Vôi Dolomite nông nghiệp",
      },
    ],
    tasks: [
      {
        id: 305,
        stageId: "GC_VAR_001:Giai đoạn ra hoa, đậu trái",
        name: "Bón phân hóa học định kỳ thời kỳ kinh doanh",
        description:
          "Vét rãnh vành khăn, rải NPK + KCl + NaCl, lấp đất. Sau 10 ngày bón thêm vôi Dolomite riêng biệt đầu mùa mưa.",
        labor: "3 người",
        duration: "2 ngày",
        startDate: "2029-07-01",
        endDate: "2029-07-02",
        isRepeating: true,
        repeatWeeks: 16,
        geographicalSelections: [
          { id: "geo-coco-kb-01", type: "region", regionId: "1" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-kb-01", type: "region", regionId: "1" },
    ],
  },

  {
    id: 206,
    code: "CV-COCO-KB-006",
    name: "Bón phân hữu cơ Trichoderma + Vệ sinh tán dừa định kỳ",
    plan: "Kế hoạch cải tạo đất cát và chống rửa trôi - Vườn dừa Bình Định",
    stage: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
    assignedTo: ["Đội Nông Hóa"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: ["Chuyên gia Thổ nhưỡng"],
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    priority: "medium",
    status: "pending",
    description:
      "Bón phân chuồng hoai mục 20-40 kg/cây/năm phối trộn nấm Trichoderma. Vệ sinh tán dừa định kỳ 1-2 lần/năm: chặt bỏ màng bao, bông mo khô, tàu lá già cỗi gãy gập. Làm thông thoáng tán cây, loại bỏ nơi trú ẩn của nấm bệnh, chuột và côn trùng.",
    createdAt: "2026-08-25",
    materials: [
      {
        id: 610,
        taskId: 306,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        name: "Phân chuồng hoai mục + Trichoderma",
        quantity: "30",
        unit: "kg/cây/năm",
        type: "fertilizer",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân bò / gà hoai mục ủ Trichoderma",
      },
    ],
    tasks: [
      {
        id: 306,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        name: "Bón hữu cơ Trichoderma quanh tán dừa",
        description:
          "Rải phân hữu cơ hoai + Trichoderma theo vành khăn quanh hình chiếu tán (cách gốc 1.5-2m). Xới nhẹ 10cm trộn vào đất.",
        labor: "4 người",
        duration: "5 ngày",
        startDate: "2026-09-10",
        endDate: "2026-09-14",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-kb-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
        ],
      },
      {
        id: 307,
        stageId: "11:Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        name: "Vệ sinh tán dừa - Chặt bỏ tàu lá già và bông mo",
        description:
          "Dùng câu liêm chặt tàu lá già (tàu lá số 25 trở xuống), gỡ bông mo khô, thu gom đưa về ủ compost hoặc tủ gốc.",
        labor: "3 người",
        duration: "5 ngày",
        startDate: "2026-09-15",
        endDate: "2026-09-19",
        isRepeating: true,
        repeatWeeks: 26,
        geographicalSelections: [
          {
            id: "geo-coco-kb-03",
            type: "area",
            regionId: "1",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-kb-02",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
      },
    ],
  },

  {
    id: 207,
    code: "CV-COCO-KB-007",
    name: "Quản lý nước thích ứng hạn mặn mùa khô (Đóng cống, Xổ phèn)",
    plan: "Kế hoạch cải tạo đất phèn mặn - Vườn dừa Bến Tre",
    stage: "10:Rửa mặn, thau chua mương vườn",
    assignedTo: ["Đội Tưới tiêu & Thủy lợi"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: [],
    startDate: "2026-05-15",
    endDate: "2026-07-15",
    priority: "high",
    status: "in-progress",
    description:
      "Vào mùa khô mặn, nạo vét mương và đóng cống ngăn nước mặn khi độ mặn ngoài sông >3‰. Duy trì mực nước mương cách mặt liếp 0.5m. Xổ nước rửa mặn và thau chua ngay khi có nguồn nước ngọt (độ mặn <1‰). Bơm nước ngọt tưới phun sương giải nhiệt mùa nắng gắt.",
    createdAt: "2026-05-01",
    materials: [
      {
        id: 611,
        taskId: 308,
        stageId: "10:Rửa mặn, thau chua mương vườn",
        name: "Máy bơm nước + nhiên liệu",
        quantity: "1",
        unit: "bộ",
        type: "tool",
        materialCategory: "Thiết bị",
        materialType: "equipment",
        materialName: "Máy bơm nước + nhiên liệu",
      },
    ],
    tasks: [
      {
        id: 308,
        stageId: "10:Rửa mặn, thau chua mương vườn",
        name: "Đóng cống ngăn mặn và theo dõi độ mặn mương",
        description:
          "Kiểm tra độ mặn hàng ngày bằng máy đo EC. Đóng cống khi mặn >3‰. Nạo vét bùn mương để thông thoáng dòng chảy.",
        labor: "2 người",
        duration: "61 ngày",
        startDate: "2026-05-15",
        endDate: "2026-07-14",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-man-01",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
      {
        id: 309,
        stageId: "10:Rửa mặn, thau chua mương vườn",
        name: "Bơm nước ngọt rửa mặn và xổ phèn mương",
        description:
          "Khi có nguồn nước ngọt (mặn <1‰): bơm vào mương, tưới đẫm liếp, xổ đáy 2-3 lần để cuốn trôi phèn mặn tích lũy.",
        labor: "2 người",
        duration: "5 ngày",
        startDate: "2026-06-01",
        endDate: "2026-06-05",
        isRepeating: true,
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-coco-man-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-2",
            plotId: "plot-1-3",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-man-01",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-2",
        plotId: "plot-1-3",
      },
    ],
  },

  // GĐ4: QUẢN LÝ DỊCH HẠI TỔNG HỢP (IPM)
  {
    id: 208,
    code: "CV-COCO-IPM-008",
    name: "Phòng trừ Sâu đầu đen (Opisina arenosella) - Sinh học + Hóa học",
    plan: "Kế hoạch điều trị Sâu đầu đen hại dừa (Mức nặng - Bình Định)",
    stage: "101:Phun thuốc hóa học dập dịch cục bộ",
    assignedTo: ["Đội Bảo vệ Thực vật"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Cán bộ Chi cục BVTV"],
    startDate: "2026-06-03",
    endDate: "2026-06-11",
    priority: "high",
    status: "in-progress",
    description:
      "Dập dịch Sâu đầu đen (Opisina arenosella) mức nặng theo phác đồ PT-COCO-SDD-001: (1) Cắt tỉa và tiêu hủy cơ học tàu lá già bị sâu ăn cháy. (2) Phun Takumi 20WG (Flubendiamide) pha dầu khoáng, xịt mạnh cả hai mặt lá. Phun 2 lần cách 7-10 ngày, sáng sớm hoặc chiều mát. (3) Thả ong ký sinh Goniozus nephantidis / Habrobracon hebetor (20 con/cây) sau khi ngừng thuốc hóa học.",
    createdAt: "2026-06-01",
    materials: [
      {
        id: 612,
        taskId: 310,
        stageId: "101:Phun thuốc hóa học dập dịch cục bộ",
        name: "Takumi 20WG (Flubendiamide)",
        quantity: "8",
        unit: "g/16L/3-4 cây",
        type: "pesticide",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Takumi 20WG (Flubendiamide)",
      },
      {
        id: 613,
        taskId: 310,
        stageId: "101:Phun thuốc hóa học dập dịch cục bộ",
        name: "Dầu khoáng SK Enspray 99EC",
        quantity: "10",
        unit: "ml/16L",
        type: "pesticide",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Dầu khoáng SK Enspray 99EC",
      },
      {
        id: 614,
        taskId: 311,
        stageId: "101:Phóng thích thiên địch (Ong ký sinh)",
        name: "Ong ký sinh Goniozus nephantidis",
        quantity: "4000",
        unit: "con/ha",
        type: "other",
        materialCategory: "Chế phẩm sinh học",
        materialType: "bio",
        materialName: "Ong ký sinh Goniozus nephantidis",
      },
    ],
    tasks: [
      {
        id: 310,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        name: "Cắt tỉa tàu lá bị sâu và phun Takumi dập dịch",
        description:
          "Cắt toàn bộ tàu lá già bị sâu ăn cháy, thu gom đốt / ngâm mương. Phun Takumi 20WG + dầu khoáng hai mặt lá, 2 lần cách 7-10 ngày.",
        labor: "6 người",
        duration: "8 ngày",
        startDate: "2026-06-03",
        endDate: "2026-06-10",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-ipm-01",
            type: "plot",
            regionId: "3",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
          {
            id: "geo-coco-ipm-02",
            type: "plot",
            regionId: "5",
            areaId: "sub-1-2",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 311,
        stageId: "101:Phóng thích thiên địch (Ong ký sinh)",
        name: "Thả ong ký sinh kiểm soát sinh học",
        description:
          "Thả 20 con ong/cây (4.000 con/ha) lúc 8-10h hoặc 3-5h chiều. Ngừng hoàn toàn thuốc hóa học ít nhất 7 ngày trước khi thả ong.",
        labor: "3 người",
        duration: "1 ngày",
        startDate: "2026-06-11",
        endDate: "2026-06-11",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-ipm-03",
            type: "area",
            regionId: "3",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-ipm-01",
        type: "plot",
        regionId: "3",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
      },
      {
        id: "geo-coco-ipm-02",
        type: "plot",
        regionId: "5",
        areaId: "sub-1-2",
        plotId: "plot-1-2",
      },
    ],
  },

  {
    id: 209,
    code: "CV-COCO-IPM-009",
    name: "Phòng trừ Kiến vương & Đuông dừa bằng nấm Metarhizium",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
    assignedTo: ["Đội Bảo vệ Thực vật"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: [],
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    priority: "medium",
    status: "pending",
    description:
      "Phòng trừ Kiến vương (Oryctes rhinoceros) và Đuông dừa (Rhynchophorus ferrugineus): (1) Vệ sinh vườn sạch sẽ, loại bỏ gốc cây mục nát là nơi sinh sản. (2) Đặt lưới mắc cáo thép quanh gốc cây non để ngăn xâm nhập. (3) Rải nấm xanh Metarhizium anisopliae vào các ổ sinh sản để tiêu diệt ấu trùng.",
    createdAt: "2026-08-20",
    materials: [
      {
        id: 615,
        taskId: 312,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Nấm xanh Metarhizium anisopliae",
        quantity: "200",
        unit: "g/ổ sinh sản",
        type: "other",
        materialCategory: "Chế phẩm sinh học",
        materialType: "bio",
        materialName: "Nấm Metarhizium anisopliae (bột)",
      },
      {
        id: 616,
        taskId: 312,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Lưới mắc cáo thép quanh gốc cây non",
        quantity: "200",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư",
        materialName: "Lưới thép bảo vệ gốc cây non",
      },
    ],
    tasks: [
      {
        id: 312,
        stageId: "GC_VAR_001:Giai đoạn kiến thiết (0-30 tháng)",
        name: "Rải Metarhizium và đặt lưới bảo vệ gốc cây non",
        description:
          "Tìm và xử lý tất cả ổ sinh sản (gốc cây mục, đống phân ủ) bằng Metarhizium. Đặt lưới thép quanh gốc cây non đường kính 40-50cm.",
        labor: "3 người",
        duration: "4 ngày",
        startDate: "2026-09-01",
        endDate: "2026-09-04",
        isRepeating: false,
        geographicalSelections: [
          {
            id: "geo-coco-ipm-04",
            type: "area",
            regionId: "1",
            areaId: "sub-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-ipm-04", type: "area", regionId: "1", areaId: "sub-1-1" },
    ],
  },

  {
    id: 210,
    code: "CV-COCO-IPM-010",
    name: "Điều trị bệnh Thối đọt dừa (Phytophthora palmivora)",
    plan: "Kế hoạch điều trị Sâu đầu đen hại dừa (Mức nặng - Bình Định)",
    stage: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
    assignedTo: ["Lê Văn Cường", "Trần Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Chuyên gia Bệnh cây"],
    startDate: "2026-06-15",
    endDate: "2026-06-20",
    priority: "high",
    status: "pending",
    description:
      "Điều trị bệnh Thối đọt (Phytophthora palmivora): (1) Can thiệp ngoại khoa - cắt bỏ hoàn toàn các mô, bẹ lá non hoại tử, thối nhũn ở đỉnh sinh trưởng bằng dao sắc đã khử trùng. (2) Phun đẫm Metalaxyl + Mancozeb có tính lưu dẫn mạnh vào vết thương và toàn bộ tán lá non. (3) Duy trì phun phòng định kỳ bằng chế phẩm sinh học Trichoderma + Bacillus.",
    createdAt: "2026-06-10",
    materials: [
      {
        id: 617,
        taskId: 313,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        name: "Ridomil Gold 68WG (Metalaxyl+Mancozeb)",
        quantity: "2.5",
        unit: "g/lít nước",
        type: "pesticide",
        materialCategory: "Thuốc BVTV (Hóa học)",
        materialType: "pesticide",
        materialName: "Ridomil Gold 68WG (Metalaxyl + Mancozeb)",
      },
      {
        id: 618,
        taskId: 313,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        name: "Trichoderma asperellum + Bacillus subtilis",
        quantity: "100",
        unit: "g/gốc/lần",
        type: "other",
        materialCategory: "Chế phẩm sinh học",
        materialType: "bio",
        materialName: "Trichoderma asperellum + Bacillus subtilis",
      },
    ],
    tasks: [
      {
        id: 313,
        stageId: "101:Cắt tỉa và tiêu hủy mầm bệnh cơ học",
        name: "Cắt bỏ mô hoại tử và phun thuốc trừ nấm Phytophthora",
        description:
          "Cắt bỏ hoàn toàn mô thối ở đỉnh bằng dao sắc đã khử cồn. Phun Ridomil Gold 68WG đẫm vào vết cắt và ngọn non. Bôi kín vết thương bằng hỗn hợp Metalaxyl + tro bếp.",
        labor: "2 người",
        duration: "5 ngày",
        startDate: "2026-06-15",
        endDate: "2026-06-19",
        isRepeating: true,
        repeatWeeks: 2,
        geographicalSelections: [
          {
            id: "geo-coco-ipm-05",
            type: "plot",
            regionId: "3",
            areaId: "sub-1-1",
            plotId: "plot-1-1",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-ipm-05",
        type: "plot",
        regionId: "3",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
      },
    ],
  },

  // GĐ5: THU HOẠCH
  {
    id: 211,
    code: "CV-COCO-TH-011",
    name: "Thu hoạch dừa uống nước (Dừa Xiêm 7-8 tháng tuổi) - Trèo cây, thả dây nài",
    plan: "Kế hoạch canh tác Dừa Xiêm xanh vụ chính (Bến Tre)",
    stage: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
    assignedTo: ["Đội Thu hoạch ĐBSCL"],
    assignedType: "team",
    supervisors: ["Trần Thị Lan"],
    qualityInspectors: ["Chuyên gia QC Đầu ra"],
    startDate: "2029-09-01",
    endDate: "2029-09-03",
    priority: "high",
    status: "pending",
    description:
      "Thu hoạch dừa uống nước Xiêm xanh khi trái đạt 7-8 tháng tuổi (nước nhiều, ngọt, cơm non). Nhân công bắt buộc trèo lên cây dừa, dùng liềm cắt cuống buồng và sử dụng dây nài thả buồng dừa từ từ xuống đất — TUYỆT ĐỐI không thả rơi tự do để tránh nứt vỡ gáo, dập trái làm mất nước và giảm giá bán. Loại bỏ trái sâu bệnh ngay tại vườn.",
    createdAt: "2029-08-20",
    materials: [
      {
        id: 619,
        taskId: 314,
        stageId: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
        name: "Liềm cắt cuống chuyên dụng",
        quantity: "5",
        unit: "cái",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Liềm cắt cuống dừa chuyên dụng",
      },
      {
        id: 620,
        taskId: 314,
        stageId: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
        name: "Dây nài hạ buồng dừa",
        quantity: "10",
        unit: "cuộn",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Dây thừng nài hạ buồng dừa",
      },
    ],
    tasks: [
      {
        id: 314,
        stageId: "GC_VAR_001:Giai đoạn thu hoạch ổn định",
        name: "Trèo cây, cắt buồng và hạ dừa bằng dây nài",
        description:
          "Chọn buồng dừa 7-8 tháng (màu xanh, gõ âm thanh đặc). Trèo cây, cắt cuống, buộc dây nài thả từ từ xuống đất. Phân loại ngay tại gốc, loại trái dập, sâu bệnh.",
        labor: "5 người",
        duration: "2 ngày",
        startDate: "2029-09-01",
        endDate: "2029-09-02",
        isRepeating: true,
        repeatWeeks: 7,
        geographicalSelections: [
          { id: "geo-coco-th-01", type: "region", regionId: "1" },
        ],
      },
    ],
    geographicalSelections: [
      { id: "geo-coco-th-01", type: "region", regionId: "1" },
    ],
  },

  {
    id: 212,
    code: "CV-COCO-TH-012",
    name: "Thu hoạch dừa khô lấy dầu (11-12 tháng tuổi) - Dùng sào tre giật trái",
    plan: "Kế hoạch canh tác Dừa sáp Cầu Kè chuyên canh (Trà Vinh)",
    stage: "GC_VAR_003:Thu hoạch và phân loại",
    assignedTo: ["Đội Thu hoạch 2"],
    assignedType: "team",
    supervisors: ["Lê Thanh Hà"],
    qualityInspectors: [],
    startDate: "2031-08-01",
    endDate: "2031-08-03",
    priority: "high",
    status: "pending",
    description:
      "Thu hoạch dừa khô/dừa sáp khi buồng quả đạt 11-12 tháng tuổi (gáo chuyển màu nâu cứng). Nhân công đứng dưới đất, dùng sào tre dài có gắn liềm sắc để móc vào cuống buồng và giật mạnh cho buồng quả rơi tự do xuống mặt liếp cỏ (khác với dừa uống nước phải dùng dây nài). Thu gom vận chuyển ra bãi thương lái. Sau thu hoạch: loại bỏ trái sâu bệnh, không để dừa mới hái ở khu không hợp vệ sinh.",
    createdAt: "2031-07-15",
    materials: [
      {
        id: 621,
        taskId: 315,
        stageId: "GC_VAR_003:Thu hoạch và phân loại",
        name: "Sào tre nối dài gắn liềm (sào hái dừa)",
        quantity: "5",
        unit: "cây sào",
        type: "tool",
        materialCategory: "Dụng cụ nông nghiệp",
        materialType: "Vật tư thu hoạch",
        materialName: "Sào tre dài gắn liềm sắc hái dừa",
      },
      {
        id: 622,
        taskId: 315,
        stageId: "GC_VAR_003:Thu hoạch và phân loại",
        name: "Máy siêu âm kiểm tra trái sáp",
        quantity: "1",
        unit: "máy",
        type: "tool",
        materialCategory: "Thiết bị",
        materialType: "equipment",
        materialName: "Máy siêu âm cầm tay kiểm tra trái sáp",
      },
    ],
    tasks: [
      {
        id: 315,
        stageId: "GC_VAR_003:Thu hoạch và phân loại",
        name: "Dùng sào giật dừa khô và phân loại trái sáp",
        description:
          "Xác định buồng dừa đạt 11-12 tháng (màu nâu, gáo cứng, âm thanh khô khi gõ). Dùng sào tre gắn liềm giật cuống buồng rơi tự do. Dùng máy siêu âm phân loại trái sáp (110-220k VNĐ/trái) và trái thường (15-20k VNĐ).",
        labor: "5 người",
        duration: "2 ngày",
        startDate: "2031-08-01",
        endDate: "2031-08-02",
        isRepeating: true,
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-coco-th-02",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-2",
          },
        ],
      },
      {
        id: 316,
        stageId: "GC_VAR_003:Thu hoạch và phân loại",
        name: "Thu gom và vận chuyển dừa sau thu hoạch",
        description:
          "Thu gom dừa rụng dưới đất vào ghe / xe rùa. Loại bỏ ngay trái sâu, mốc, dập. Tập kết ra bãi thu mua của thương lái / HTX. Đảm bảo vệ sinh khu bảo quản (không gần nước thải, chuồng gia súc).",
        labor: "3 người",
        duration: "2 ngày",
        startDate: "2031-08-02",
        endDate: "2031-08-03",
        isRepeating: true,
        repeatWeeks: 4,
        geographicalSelections: [
          {
            id: "geo-coco-th-03",
            type: "plot",
            regionId: "1",
            areaId: "sub-1-1",
            plotId: "plot-1-2",
          },
        ],
      },
    ],
    geographicalSelections: [
      {
        id: "geo-coco-th-02",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-2",
      },
    ],
  },

  // =====================================================================
  // CÔNG VIỆC PHÁT SINH CÂY DỪA
  // =====================================================================

  {
    id: 213,
    code: "CV-PS-COCO-001",
    name: "Phát sinh: Dọn dẹp vườn dừa sau bão lớn (Bến Tre)",
    plan: "N/A",
    stage: "N/A",
    assignedTo: ["Đội Khắc phục sự cố"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    startDate: "2026-08-15",
    endDate: "2026-08-20",
    priority: "high",
    status: "in-progress",
    description:
      "Công việc phát sinh sau cơn bão số 3. Yêu cầu: Dọn dẹp cây đổ gãy, cắt bỏ các tàu lá bị tét, dọn sạch mương vườn bị cây cối che lấp để khơi thông dòng chảy. Bón bổ sung lân và hữu cơ cho cây phục hồi rễ.",
    createdAt: "2026-08-14",
    geographicalSelections: [
      {
        id: "geo-ps-coco-01",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
      },
      {
        id: "geo-ps-coco-02",
        type: "plot",
        regionId: "1",
        areaId: "sub-1-1",
        plotId: "plot-1-2",
      },
    ],
  },

  {
    id: 214,
    code: "CV-PS-COCO-002",
    name: "Phát sinh: Xử lý ổ dịch bọ cánh cứng hại dừa cục bộ (Bình Định)",
    plan: "N/A",
    stage: "N/A",
    assignedTo: ["Nguyễn Văn An"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    priority: "high",
    status: "pending",
    description:
      "Phát hiện một nhóm 5 cây dừa tại Plot 3 (Bình Định) bị bọ cánh cứng tấn công mạnh phần đọt non. Yêu cầu xịt thuốc Actara cục bộ vào nách lá non và treo túi thuốc xua đuổi, ngăn chặn lây lan toàn vườn.",
    createdAt: "2026-07-09",
    geographicalSelections: [
      {
        id: "geo-ps-coco-03",
        type: "plot",
        regionId: "3",
        areaId: "sub-1-1",
        plotId: "plot-1-1",
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
