export interface FilterState {
  selectedPlots: string[];
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTER: FilterState = {
  selectedPlots: [],
  dateFrom: "",
  dateTo: "",
};

export interface PlotNode {
  id: string;
  name: string;
}

export interface AreaNode {
  id: string;
  name: string;
  plots: PlotNode[];
}

export interface RegionNode {
  id: string;
  name: string;
  areas: AreaNode[];
}

export const filterData: RegionNode[] = [
  {
    id: "r1",
    name: "Sầu riêng Monthon - Đồng bằng",
    areas: [
      {
        id: "a1",
        name: "Khu vực A1",
        plots: [
          { id: "p1", name: "Lô A1-01 (12 ha)" },
          { id: "p2", name: "Lô A1-02 (8 ha)" },
          { id: "p3", name: "Lô A1-03 (15 ha)" },
          { id: "p4", name: "Lô A1-04 (10 ha)" },
        ],
      },
      {
        id: "a2",
        name: "Khu vực A2",
        plots: [
          { id: "p5", name: "Lô A2-01 (9 ha)" },
          { id: "p6", name: "Lô A2-02 (11 ha)" },
          { id: "p7", name: "Lô A2-03 (7 ha)" },
        ],
      },
      {
        id: "a3",
        name: "Khu vực A3",
        plots: [
          { id: "p8", name: "Lô A3-01 (13 ha)" },
          { id: "p9", name: "Lô A3-02 (6 ha)" },
          { id: "p10", name: "Lô A3-03 (14 ha)" },
          { id: "p11", name: "Lô A3-04 (8 ha)" },
          { id: "p12", name: "Lô A3-05 (10 ha)" },
        ],
      },
    ],
  },
  {
    id: "r2",
    name: "Sầu riêng Ri6 - Trung du",
    areas: [
      {
        id: "a4",
        name: "Khu vực B1",
        plots: [
          { id: "p13", name: "Lô B1-01 (20 ha)" },
          { id: "p14", name: "Lô B1-02 (18 ha)" },
          { id: "p15", name: "Lô B1-03 (15 ha)" },
        ],
      },
      {
        id: "a5",
        name: "Khu vực B2",
        plots: [
          { id: "p16", name: "Lô B2-01 (12 ha)" },
          { id: "p17", name: "Lô B2-02 (14 ha)" },
          { id: "p18", name: "Lô B2-03 (16 ha)" },
          { id: "p19", name: "Lô B2-04 (9 ha)" },
        ],
      },
    ],
  },
  {
    id: "r3",
    name: "Sầu riêng Dona - Miền núi",
    areas: [
      {
        id: "a6",
        name: "Khu vực C1",
        plots: [
          { id: "p20", name: "Lô C1-01 (25 ha)" },
          { id: "p21", name: "Lô C1-02 (22 ha)" },
          { id: "p22", name: "Lô C1-03 (18 ha)" },
          { id: "p23", name: "Lô C1-04 (20 ha)" },
        ],
      },
      {
        id: "a7",
        name: "Khu vực C2",
        plots: [
          { id: "p24", name: "Lô C2-01 (15 ha)" },
          { id: "p25", name: "Lô C2-02 (12 ha)" },
          { id: "p26", name: "Lô C2-03 (10 ha)" },
        ],
      },
      {
        id: "a8",
        name: "Khu vực C3",
        plots: [
          { id: "p27", name: "Lô C3-01 (8 ha)" },
          { id: "p28", name: "Lô C3-02 (11 ha)" },
          { id: "p29", name: "Lô C3-03 (13 ha)" },
          { id: "p30", name: "Lô C3-04 (9 ha)" },
          { id: "p31", name: "Lô C3-05 (7 ha)" },
        ],
      },
    ],
  },
  {
    id: "r4",
    name: "Mít Thái - Đồng bằng Sông Cửu Long",
    areas: [
      {
        id: "a9",
        name: "Khu vực D1",
        plots: [
          { id: "p32", name: "Lô D1-01 (30 ha)" },
          { id: "p33", name: "Lô D1-02 (28 ha)" },
        ],
      },
      {
        id: "a10",
        name: "Khu vực D2",
        plots: [
          { id: "p34", name: "Lô D2-01 (18 ha)" },
          { id: "p35", name: "Lô D2-02 (22 ha)" },
          { id: "p36", name: "Lô D2-03 (15 ha)" },
        ],
      },
    ],
  },
];

export const overviewStats = {
  totalArea: 125000,
  areaUnit: "m2",
  totalRegions: 85,
  previousArea: 118000,
  previousRegions: 78,
};

export const cropHealthData = [
  { name: "Phát hiện sâu bệnh hại", value: 24, color: "hsl(0, 72%, 51%)" },
  { name: "Đang xử lý", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Tốt", value: 842, color: "hsl(142, 70%, 45%)" },
];

export const soilHealth = {
  amending: 12,
  healthy: 73,
  previousAmending: 18,
  previousHealthy: 68,
};

export const harvestComparison = [
  {
    label: "Đợt 1",
    actual: 3800,
    plan: 4200,
    previous: 3500,
  },
  {
    label: "Đợt 2",
    actual: 4200,
    plan: 4000,
    previous: 3800,
  },
  {
    label: "Đợt 3",
    actual: 3500,
    plan: 3800,
    previous: 3200,
  },
  {
    label: "Đợt 4",
    actual: 4500,
    plan: 4300,
    previous: 4000,
  },
];

export const harvestSummary = {
  totalYield: 45200,
  latestYield: 3800,
  unit: "kg",
  previousTotalYield: 42100,
  previousLatestYield: 3500,
};

export const realtimeStatus = {
  lastUpdated: "2026-08-17T14:30:00",
  lastCompletedTask: "Phun thuốc vùng B3 - Hoàn thành",
  lastCreatedTask: "Bón phân đợt 3 - Vùng A1",
  daysSinceUpdate: 1,
};

export const weeklyTaskTrend = [
  { week: "Tuần 1", completed: 28, created: 32 },
  { week: "Tuần 2", completed: 35, created: 30 },
  { week: "Tuần 3", completed: 42, created: 38 },
  { week: "Tuần 4", completed: 38, created: 25 },
  { week: "Tuần 5", completed: 50, created: 20 },
];

export const farmingProgress = {
  workflows: { total: 12, completed: 8, label: "Quy trình canh tác/mùa vụ" },
  plans: {
    completed: 45,
    pending: 12,
    inProgress: 8,
    label: "Kế hoạch canh tác",
  },
  tasks: {
    completed: 320,
    pending: 28,
    inProgress: 42,
    label: "Công việc canh tác",
  },
};

export const hrByDepartment = [
  {
    id: "dept-1",
    name: "Phòng Kỹ thuật nông nghiệp",
    totalStaff: 24,
    pendingTasks: 8,
    inProgressTasks: 12,
  },
  {
    id: "dept-2",
    name: "Phòng Vận hành",
    totalStaff: 18,
    pendingTasks: 5,
    inProgressTasks: 9,
  },
  {
    id: "dept-3",
    name: "Phòng Kinh doanh",
    totalStaff: 12,
    pendingTasks: 3,
    inProgressTasks: 6,
  },
  {
    id: "dept-4",
    name: "Phòng Hành chính - Nhân sự",
    totalStaff: 8,
    pendingTasks: 2,
    inProgressTasks: 4,
  },
  {
    id: "dept-5",
    name: "Phòng Tài chính - Kế toán",
    totalStaff: 6,
    pendingTasks: 1,
    inProgressTasks: 3,
  },
];

export const hrByPosition = [
  {
    id: "pos-1",
    name: "Kỹ sư nông nghiệp",
    totalStaff: 15,
    pendingTasks: 6,
    inProgressTasks: 10,
  },
  {
    id: "pos-2",
    name: "Quản lý vùng trồng",
    totalStaff: 10,
    pendingTasks: 4,
    inProgressTasks: 8,
  },
  {
    id: "pos-3",
    name: "Công nhân canh tác",
    totalStaff: 28,
    pendingTasks: 8,
    inProgressTasks: 14,
  },
  {
    id: "pos-4",
    name: "Lập trình viên IoT",
    totalStaff: 5,
    pendingTasks: 2,
    inProgressTasks: 3,
  },
  {
    id: "pos-5",
    name: "Nhân viên văn phòng",
    totalStaff: 10,
    pendingTasks: 2,
    inProgressTasks: 5,
  },
];

export function formatPlotName(plotId: string): string {
  for (const region of filterData) {
    for (const area of region.areas) {
      const plot = area.plots.find((p) => p.id === plotId);
      if (plot) return plot.name;
    }
  }
  return plotId;
}

export function findPlotRegion(plotId: string): RegionNode | undefined {
  return filterData.find((r) =>
    r.areas.some((a) => a.plots.some((p) => p.id === plotId)),
  );
}

export interface HRFilterState {
  location: string;
  departments: string[];
  positions: string[];
  taskStatus: string[];
}

export const EMPTY_HR_FILTER: HRFilterState = {
  location: "",
  departments: [],
  positions: [],
  taskStatus: [],
};

export const locationOptions = [
  { id: "loc-1", name: "Đồng bằng - Khu vực A" },
  { id: "loc-2", name: "Trung du - Khu vực B" },
  { id: "loc-3", name: "Miền núi - Khu vực C" },
  { id: "loc-4", name: "ĐBSCL - Khu vực D" },
];

export const departmentOptions = [
  { id: "dept-1", name: "Phòng Kỹ thuật nông nghiệp" },
  { id: "dept-2", name: "Phòng Vận hành" },
  { id: "dept-3", name: "Phòng Kinh doanh" },
  { id: "dept-4", name: "Phòng Hành chính - Nhân sự" },
  { id: "dept-5", name: "Phòng Tài chính - Kế toán" },
];

export const positionOptions = [
  { id: "pos-1", name: "Kỹ sư nông nghiệp" },
  { id: "pos-2", name: "Quản lý vùng trồng" },
  { id: "pos-3", name: "Công nhân canh tác" },
  { id: "pos-4", name: "Lập trình viên IoT" },
  { id: "pos-5", name: "Nhân viên văn phòng" },
];

export const taskStatusOptions = [
  { id: "pending", name: "Chờ triển khai" },
  { id: "inProgress", name: "Đang triển khai" },
];

export const yieldData = [
  { month: "T10/25", monthon: 45, ri6: 38, dona: 32 },
  { month: "T11/25", monthon: 52, ri6: 42, dona: 35 },
  { month: "T12/25", monthon: 48, ri6: 45, dona: 38 },
  { month: "T01/26", monthon: 61, ri6: 50, dona: 42 },
  { month: "T02/26", monthon: 55, ri6: 48, dona: 45 },
  { month: "T03/26", monthon: 67, ri6: 55, dona: 48 },
  { month: "T04/26", monthon: 72, ri6: 60, dona: 52 },
  { month: "T05/26", monthon: 68, ri6: 58, dona: 50 },
  { month: "T06/26", monthon: 75, ri6: 65, dona: 55 },
  { month: "T07/26", monthon: 82, ri6: 70, dona: 60 },
  { month: "T08/26", monthon: 78, ri6: 68, dona: 58 },
  { month: "T09/26", monthon: 85, ri6: 75, dona: 65 },
];

export const cropAreaDistribution = [
  { name: "Sầu riêng Monthon", value: 45, area: 562.5 },
  { name: "Sầu riêng Ri6", value: 35, area: 437.5 },
  { name: "Sầu riêng Dona", value: 20, area: 250 },
];

export const COLORS = [
  "hsl(142, 70%, 45%)", // Monthon - Xanh lá đậm
  "hsl(142, 60%, 25%)", // Ri6 - Xanh lá vừa
  "hsl(142, 50%, 95%)", // Dona - Xanh lá nhạt
];

export const recentActivities = [
  {
    id: 1,
    action: "Thêm mới nông hộ",
    user: "Nguyễn Văn A",
    time: "5 phút trước",
    type: "create",
  },
  {
    id: 2,
    action: "Cập nhật kế hoạch canh tác",
    user: "Trần Thị B",
    time: "15 phút trước",
    type: "update",
  },
  {
    id: 3,
    action: "Xóa vùng trồng",
    user: "Lê Văn C",
    time: "1 giờ trước",
    type: "delete",
  },
  {
    id: 4,
    action: "Hoàn thành công việc phun thuốc",
    user: "Phạm Thị D",
    time: "2 giờ trước",
    type: "complete",
  },
  {
    id: 5,
    action: "Thêm chứng chỉ VietGAP",
    user: "Hoàng Văn E",
    time: "3 giờ trước",
    type: "create",
  },
];

export const upcomingTasks = [
  {
    id: 1,
    title: "Bón phân đợt 2 - Vùng sầu riêng Monthon A1",
    dueDate: "Hôm nay",
    priority: "high",
    link: "/cultivation-plan",
  },
  {
    id: 2,
    title: "Kiểm tra sâu bệnh - Vùng Ri6 B3",
    dueDate: "Ngày mai",
    priority: "medium",
    link: "/cultivation-plan",
  },
  {
    id: 3,
    title: "Thu hoạch sầu riêng Dona - Vùng C2",
    dueDate: "15/02/2026",
    priority: "high",
    link: "/cultivation-plan",
  },
  {
    id: 4,
    title: "Tưới nước định kỳ - Tất cả vùng sầu riêng",
    dueDate: "16/02/2026",
    priority: "low",
    link: "/cultivation-plan",
  },
];

// Top 20 Farmers harvest yield share (for Admin view donut chart) + Others group
export interface FarmerHarvestItem {
  id: string;
  name: string;
  value: number; // Percentage %
  yieldTons: number; // Volume in tons
}

export const top20FarmersHarvestShare: FarmerHarvestItem[] = [
  {
    id: "f1",
    name: "HTX Sầu riêng Monthon Phong Điền",
    value: 16.5,
    yieldTons: 185,
  },
  {
    id: "f2",
    name: "Nông hộ Nguyễn Văn A (Bến Tre)",
    value: 12.0,
    yieldTons: 135,
  },
  { id: "f3", name: "HTX Mít Thái Bình Minh", value: 9.5, yieldTons: 106 },
  {
    id: "f4",
    name: "Nông hộ Trần Thị B (Vĩnh Long)",
    value: 8.2,
    yieldTons: 92,
  },
  {
    id: "f5",
    name: "Nông hộ Lê Văn C (Tiền Giang)",
    value: 6.8,
    yieldTons: 76,
  },
  {
    id: "f6",
    name: "Nông hộ Phạm Văn D (Đồng Tháp)",
    value: 5.4,
    yieldTons: 60,
  },
  { id: "f7", name: "HTX Sầu riêng Krông Pắc", value: 4.8, yieldTons: 54 },
  { id: "f8", name: "Nông hộ Võ Văn E (Đắc Lắk)", value: 4.2, yieldTons: 47 },
  { id: "f9", name: "Nông hộ Đỗ Thị F (Lâm Đồng)", value: 3.6, yieldTons: 40 },
  { id: "f10", name: "Nông hộ Bùi Văn G (Gia Lai)", value: 3.1, yieldTons: 35 },
  {
    id: "f11",
    name: "Nông hộ Ngô Thị H (Đắc Nông)",
    value: 2.8,
    yieldTons: 31,
  },
  { id: "f12", name: "HTX Cây ăn quả Châu Thành", value: 2.5, yieldTons: 28 },
  {
    id: "f13",
    name: "Nông hộ Đặng Văn I (Cần Thơ)",
    value: 2.2,
    yieldTons: 25,
  },
  {
    id: "f14",
    name: "Nông hộ Trịnh Thị K (Hậu Giang)",
    value: 1.9,
    yieldTons: 21,
  },
  { id: "f15", name: "Nông hộ Vũ Văn L (Tây Ninh)", value: 1.7, yieldTons: 19 },
  {
    id: "f16",
    name: "Nông hộ Dương Thị M (Bình Dương)",
    value: 1.5,
    yieldTons: 17,
  },
  { id: "f17", name: "Nông hộ Lý Văn N (Đồng Nai)", value: 1.3, yieldTons: 15 },
  {
    id: "f18",
    name: "Nông hộ Hồ Thị P (Bình Phước)",
    value: 1.1,
    yieldTons: 12,
  },
  { id: "f19", name: "Nông hộ Mai Văn Q (Long An)", value: 1.0, yieldTons: 11 },
  {
    id: "f20",
    name: "Nông hộ Đào Thị R (An Giang)",
    value: 0.9,
    yieldTons: 10,
  },
  {
    id: "f_others",
    name: "Khác (các nông hộ nhỏ lẻ)",
    value: 11.6,
    yieldTons: 131,
  },
];

export const HARVEST_COLORS = [
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
  "#14b8a6",
  "#0d9488",
  "#0f766e",
  "#0284c7",
  "#0369a1",
  "#1d4ed8",
  "#1e40af",
  "#4f46e5",
  "#4338ca",
  "#7c3aed",
  "#6d28d9",
  "#8b5cf6",
  "#a855f7",
  "#9333ea",
  "#c026d3",
  "#d946ef",
  "#94a3b8", // Color for "Khác"
];

// Crop Variety breakdown data (for Admin view pie chart & top farmers detail chart)
export interface CropVarietyHarvestItem {
  id: string;
  name: string;
  code: string;
  sharePercent: number; // % share of total harvest
  totalYieldTons: number; // Volume in tons
  totalAreaHa: number;
  totalFarmersCount: number;
  color: string;
}

export interface TopFarmerHarvestItem {
  id: string;
  rank: number;
  farmerName: string;
  location: string;
  yieldTons: number;
  sharePercent: number;
  areaHa: number;
}

export const cropVarietyHarvestShare: CropVarietyHarvestItem[] = [
  {
    id: "st25",
    name: "Lúa ST25 (Lúa thơm đặc sản)",
    code: "CROP-ST25",
    sharePercent: 35.0,
    totalYieldTons: 1250,
    totalAreaHa: 450,
    totalFarmersCount: 142,
    color: "#10b981", // Emerald
  },
  {
    id: "ri6",
    name: "Sầu riêng Ri6 (Hạt lép)",
    code: "CROP-RI6",
    sharePercent: 25.0,
    totalYieldTons: 890,
    totalAreaHa: 280,
    totalFarmersCount: 88,
    color: "#0284c7", // Sky blue
  },
  {
    id: "monthon",
    name: "Sầu riêng Monthon (Thái Lan)",
    code: "CROP-MONTHON",
    sharePercent: 18.0,
    totalYieldTons: 640,
    totalAreaHa: 210,
    totalFarmersCount: 64,
    color: "#f59e0b", // Amber
  },
  {
    id: "robusta",
    name: "Cà phê Robusta cao sản",
    code: "CROP-ROBUSTA",
    sharePercent: 12.0,
    totalYieldTons: 420,
    totalAreaHa: 160,
    totalFarmersCount: 45,
    color: "#8b5cf6", // Purple
  },
  {
    id: "mit_thai",
    name: "Mít Thái siêu sớm",
    code: "CROP-MITTHAI",
    sharePercent: 7.0,
    totalYieldTons: 250,
    totalAreaHa: 95,
    totalFarmersCount: 32,
    color: "#ec4899", // Pink
  },
  {
    id: "others",
    name: "Các giống cây trồng khác",
    code: "CROP-OTHERS",
    sharePercent: 3.0,
    totalYieldTons: 110,
    totalAreaHa: 45,
    totalFarmersCount: 19,
    color: "#94a3b8", // Slate
  },
];

export const topFarmersByVarietyData: Record<string, TopFarmerHarvestItem[]> = {
  st25: [
    {
      id: "tf-st25-1",
      rank: 1,
      farmerName: "HTX Lúa Thơm Thoại Sơn",
      location: "An Giang",
      yieldTons: 145,
      sharePercent: 11.6,
      areaHa: 52,
    },
    {
      id: "tf-st25-2",
      rank: 2,
      farmerName: "Nông hộ Nguyễn Văn Sang",
      location: "Sóc Trăng",
      yieldTons: 112,
      sharePercent: 8.96,
      areaHa: 40,
    },
    {
      id: "tf-st25-3",
      rank: 3,
      farmerName: "HTX Nông Nghiệp Thạnh Trị",
      location: "Sóc Trăng",
      yieldTons: 98,
      sharePercent: 7.84,
      areaHa: 35,
    },
    {
      id: "tf-st25-4",
      rank: 4,
      farmerName: "Nông hộ Trần Quốc Tuấn",
      location: "Đồng Tháp",
      yieldTons: 85,
      sharePercent: 6.8,
      areaHa: 30,
    },
    {
      id: "tf-st25-5",
      rank: 5,
      farmerName: "Nông hộ Lê Hoàng Nam",
      location: "Kiên Giang",
      yieldTons: 76,
      sharePercent: 6.08,
      areaHa: 27,
    },
    {
      id: "tf-st25-6",
      rank: 6,
      farmerName: "Nông hộ Phạm Đức Minh",
      location: "Long An",
      yieldTons: 68,
      sharePercent: 5.44,
      areaHa: 24,
    },
    {
      id: "tf-st25-7",
      rank: 7,
      farmerName: "HTX Lúa Vàng Hòn Đất",
      location: "Kiên Giang",
      yieldTons: 62,
      sharePercent: 4.96,
      areaHa: 22,
    },
    {
      id: "tf-st25-8",
      rank: 8,
      farmerName: "Nông hộ Võ Thanh Bình",
      location: "Cần Thơ",
      yieldTons: 58,
      sharePercent: 4.64,
      areaHa: 20,
    },
    {
      id: "tf-st25-9",
      rank: 9,
      farmerName: "Nông hộ Đỗ Văn Hùng",
      location: "Bạc Liêu",
      yieldTons: 52,
      sharePercent: 4.16,
      areaHa: 18,
    },
    {
      id: "tf-st25-10",
      rank: 10,
      farmerName: "Nông hộ Bùi Tấn Lộc",
      location: "Tiền Giang",
      yieldTons: 48,
      sharePercent: 3.84,
      areaHa: 17,
    },
    {
      id: "tf-st25-11",
      rank: 11,
      farmerName: "Nông hộ Trịnh Văn Phát",
      location: "An Giang",
      yieldTons: 44,
      sharePercent: 3.52,
      areaHa: 15,
    },
    {
      id: "tf-st25-12",
      rank: 12,
      farmerName: "Nông hộ Ngô Thị Mai",
      location: "Đồng Tháp",
      yieldTons: 40,
      sharePercent: 3.2,
      areaHa: 14,
    },
  ],
  ri6: [
    {
      id: "tf-ri6-1",
      rank: 1,
      farmerName: "HTX Sầu Riêng Bến Tre",
      location: "Bến Tre",
      yieldTons: 135,
      sharePercent: 15.17,
      areaHa: 42,
    },
    {
      id: "tf-ri6-2",
      rank: 2,
      farmerName: "Nông hộ Nguyễn Thanh Tùng",
      location: "Tiền Giang",
      yieldTons: 105,
      sharePercent: 11.8,
      areaHa: 32,
    },
    {
      id: "tf-ri6-3",
      rank: 3,
      farmerName: "Nông hộ Lê Văn Thành",
      location: "Vĩnh Long",
      yieldTons: 88,
      sharePercent: 9.89,
      areaHa: 28,
    },
    {
      id: "tf-ri6-4",
      rank: 4,
      farmerName: "HTX Cây Ăn Quả Cai Lậy",
      location: "Tiền Giang",
      yieldTons: 76,
      sharePercent: 8.54,
      areaHa: 24,
    },
    {
      id: "tf-ri6-5",
      rank: 5,
      farmerName: "Nông hộ Phạm Hồng Sơn",
      location: "Cần Thơ",
      yieldTons: 64,
      sharePercent: 7.19,
      areaHa: 20,
    },
    {
      id: "tf-ri6-6",
      rank: 6,
      farmerName: "Nông hộ Đặng Văn Long",
      location: "Lâm Đồng",
      yieldTons: 58,
      sharePercent: 6.52,
      areaHa: 18,
    },
    {
      id: "tf-ri6-7",
      rank: 7,
      farmerName: "Nông hộ Võ Thị Huệ",
      location: "Bình Phước",
      yieldTons: 52,
      sharePercent: 5.84,
      areaHa: 16,
    },
    {
      id: "tf-ri6-8",
      rank: 8,
      farmerName: "Nông hộ Bùi Văn Hải",
      location: "Đắk Lắk",
      yieldTons: 46,
      sharePercent: 5.17,
      areaHa: 14,
    },
    {
      id: "tf-ri6-9",
      rank: 9,
      farmerName: "Nông hộ Trịnh Tấn Dũng",
      location: "Đồng Nai",
      yieldTons: 40,
      sharePercent: 4.49,
      areaHa: 13,
    },
    {
      id: "tf-ri6-10",
      rank: 10,
      farmerName: "Nông hộ Nguyễn Văn Hòa",
      location: "Tây Ninh",
      yieldTons: 36,
      sharePercent: 4.04,
      areaHa: 11,
    },
  ],
  monthon: [
    {
      id: "tf-monthon-1",
      rank: 1,
      farmerName: "HTX Sầu Riêng Phong Điền",
      location: "Cần Thơ",
      yieldTons: 120,
      sharePercent: 18.75,
      areaHa: 38,
    },
    {
      id: "tf-monthon-2",
      rank: 2,
      farmerName: "HTX Sầu Riêng Krông Pắc",
      location: "Đắk Lắk",
      yieldTons: 95,
      sharePercent: 14.84,
      areaHa: 30,
    },
    {
      id: "tf-monthon-3",
      rank: 3,
      farmerName: "Nông hộ Nguyễn Văn Hùng",
      location: "Lâm Đồng",
      yieldTons: 78,
      sharePercent: 12.19,
      areaHa: 25,
    },
    {
      id: "tf-monthon-4",
      rank: 4,
      farmerName: "Nông hộ Trần Văn Cường",
      location: "Bình Phước",
      yieldTons: 64,
      sharePercent: 10.0,
      areaHa: 21,
    },
    {
      id: "tf-monthon-5",
      rank: 5,
      farmerName: "Nông hộ Lê Thị Hồng",
      location: "Gia Lai",
      yieldTons: 52,
      sharePercent: 8.13,
      areaHa: 17,
    },
    {
      id: "tf-monthon-6",
      rank: 6,
      farmerName: "Nông hộ Phạm Văn An",
      location: "Đắk Nông",
      yieldTons: 44,
      sharePercent: 6.88,
      areaHa: 15,
    },
    {
      id: "tf-monthon-7",
      rank: 7,
      farmerName: "Nông hộ Võ Văn Lâm",
      location: "Tiền Giang",
      yieldTons: 38,
      sharePercent: 5.94,
      areaHa: 13,
    },
    {
      id: "tf-monthon-8",
      rank: 8,
      farmerName: "Nông hộ Đỗ Thị Phượng",
      location: "Bến Tre",
      yieldTons: 32,
      sharePercent: 5.0,
      areaHa: 11,
    },
    {
      id: "tf-monthon-9",
      rank: 9,
      farmerName: "Nông hộ Bùi Minh Tuấn",
      location: "Đồng Nai",
      yieldTons: 28,
      sharePercent: 4.38,
      areaHa: 9,
    },
    {
      id: "tf-monthon-10",
      rank: 10,
      farmerName: "Nông hộ Ngô Văn Phúc",
      location: "Vĩnh Long",
      yieldTons: 24,
      sharePercent: 3.75,
      areaHa: 8,
    },
  ],
  robusta: [
    {
      id: "tf-robusta-1",
      rank: 1,
      farmerName: "HTX Cà Phê Cư M'gar",
      location: "Đắk Lắk",
      yieldTons: 85,
      sharePercent: 20.24,
      areaHa: 32,
    },
    {
      id: "tf-robusta-2",
      rank: 2,
      farmerName: "Nông hộ Y Krăm Niê",
      location: "Đắk Lắk",
      yieldTons: 62,
      sharePercent: 14.76,
      areaHa: 23,
    },
    {
      id: "tf-robusta-3",
      rank: 3,
      farmerName: "Nông hộ Trần Văn Định",
      location: "Gia Lai",
      yieldTons: 52,
      sharePercent: 12.38,
      areaHa: 20,
    },
    {
      id: "tf-robusta-4",
      rank: 4,
      farmerName: "Nông hộ Nguyễn Thị Dung",
      location: "Lâm Đồng",
      yieldTons: 44,
      sharePercent: 10.48,
      areaHa: 17,
    },
    {
      id: "tf-robusta-5",
      rank: 5,
      farmerName: "HTX Nông Nghiệp Đắk Mil",
      location: "Đắk Nông",
      yieldTons: 38,
      sharePercent: 9.05,
      areaHa: 15,
    },
    {
      id: "tf-robusta-6",
      rank: 6,
      farmerName: "Nông hộ Lê Văn Trường",
      location: "Kon Tum",
      yieldTons: 32,
      sharePercent: 7.62,
      areaHa: 12,
    },
    {
      id: "tf-robusta-7",
      rank: 7,
      farmerName: "Nông hộ Phạm Văn Hùng",
      location: "Lâm Đồng",
      yieldTons: 28,
      sharePercent: 6.67,
      areaHa: 10,
    },
    {
      id: "tf-robusta-8",
      rank: 8,
      farmerName: "Nông hộ Bùi Thị Lan",
      location: "Đắk Lắk",
      yieldTons: 24,
      sharePercent: 5.71,
      areaHa: 9,
    },
    {
      id: "tf-robusta-9",
      rank: 9,
      farmerName: "Nông hộ Hoàng Văn Thái",
      location: "Gia Lai",
      yieldTons: 20,
      sharePercent: 4.76,
      areaHa: 8,
    },
    {
      id: "tf-robusta-10",
      rank: 10,
      farmerName: "Nông hộ Vũ Đức Thành",
      location: "Đắk Nông",
      yieldTons: 16,
      sharePercent: 3.81,
      areaHa: 6,
    },
  ],
  mit_thai: [
    {
      id: "tf-mit-1",
      rank: 1,
      farmerName: "HTX Mít Thái Bình Minh",
      location: "Vĩnh Long",
      yieldTons: 65,
      sharePercent: 26.0,
      areaHa: 24,
    },
    {
      id: "tf-mit-2",
      rank: 2,
      farmerName: "Nông hộ Lê Văn Thuận",
      location: "Tiền Giang",
      yieldTons: 48,
      sharePercent: 19.2,
      areaHa: 18,
    },
    {
      id: "tf-mit-3",
      rank: 3,
      farmerName: "Nông hộ Nguyễn Thị Liên",
      location: "Hậu Giang",
      yieldTons: 35,
      sharePercent: 14.0,
      areaHa: 13,
    },
    {
      id: "tf-mit-4",
      rank: 4,
      farmerName: "Nông hộ Phạm Văn Khánh",
      location: "Đồng Tháp",
      yieldTons: 28,
      sharePercent: 11.2,
      areaHa: 11,
    },
    {
      id: "tf-mit-5",
      rank: 5,
      farmerName: "Nông hộ Võ Tấn Tài",
      location: "Cần Thơ",
      yieldTons: 22,
      sharePercent: 8.8,
      areaHa: 8,
    },
    {
      id: "tf-mit-6",
      rank: 6,
      farmerName: "Nông hộ Trần Văn Giàu",
      location: "Long An",
      yieldTons: 18,
      sharePercent: 7.2,
      areaHa: 7,
    },
    {
      id: "tf-mit-7",
      rank: 7,
      farmerName: "Nông hộ Đỗ Văn Nghĩa",
      location: "Sóc Trăng",
      yieldTons: 14,
      sharePercent: 5.6,
      areaHa: 5,
    },
    {
      id: "tf-mit-8",
      rank: 8,
      farmerName: "Nông hộ Bùi Văn Thành",
      location: "An Giang",
      yieldTons: 10,
      sharePercent: 4.0,
      areaHa: 4,
    },
  ],
  others: [
    {
      id: "tf-oth-1",
      rank: 1,
      farmerName: "HTX Rau Sạch Củ Chi",
      location: "TP. Hồ Chí Minh",
      yieldTons: 35,
      sharePercent: 31.82,
      areaHa: 14,
    },
    {
      id: "tf-oth-2",
      rank: 2,
      farmerName: "Nông hộ Nguyễn Văn Thìn",
      location: "Đồng Nai",
      yieldTons: 25,
      sharePercent: 22.73,
      areaHa: 10,
    },
    {
      id: "tf-oth-3",
      rank: 3,
      farmerName: "Nông hộ Lê Thị Nhài",
      location: "Long An",
      yieldTons: 20,
      sharePercent: 18.18,
      areaHa: 8,
    },
    {
      id: "tf-oth-4",
      rank: 4,
      farmerName: "Nông hộ Trần Văn Sáu",
      location: "Tây Ninh",
      yieldTons: 15,
      sharePercent: 13.64,
      areaHa: 6,
    },
    {
      id: "tf-oth-5",
      rank: 5,
      farmerName: "Nông hộ Phạm Văn Bảy",
      location: "Bình Dương",
      yieldTons: 15,
      sharePercent: 13.64,
      areaHa: 5,
    },
  ],
};

// Farmer Zone hierarchy tree data (for Farmer View: Vùng -> Khu vực -> Lô)
export interface FarmerPlot {
  id: string;
  name: string;
  areaHa: number;
  sickTrees: number;
  treatingTrees: number;
  status: "Active" | "Pending" | "Maintaining";
}

export interface FarmerArea {
  id: string;
  name: string;
  areaHa: number;
  plots: FarmerPlot[];
  sickTrees: number;
  treatingTrees: number;
}

export interface FarmerZone {
  id: string;
  name: string;
  description: string;
  totalAreaHa: number;
  areas: FarmerArea[];
  status: string;
  coordinates: { lat: number; lng: number };
}

export const farmerZoneTreeData: FarmerZone[] = [
  {
    id: "zone-1",
    name: "Vùng canh tác sầu riêng công nghệ cao 3",
    description: "Phạm vi địa lý: Vùng Bình Phước Alpha",
    totalAreaHa: 125,
    status: "Hoạt động",
    coordinates: { lat: 11.7516, lng: 106.9038 },
    areas: [
      {
        id: "area-a",
        name: "Khu A - Sầu riêng Monthon",
        areaHa: 45,
        sickTrees: 18,
        treatingTrees: 8,
        plots: [
          {
            id: "plot-a1",
            name: "Lô A1 - Monthon (25 ha)",
            areaHa: 25,
            sickTrees: 10,
            treatingTrees: 4,
            status: "Active",
          },
          {
            id: "plot-a2",
            name: "Lô A2 - Ri6 (20 ha)",
            areaHa: 20,
            sickTrees: 8,
            treatingTrees: 4,
            status: "Active",
          },
        ],
      },
      {
        id: "area-b",
        name: "Khu B - Sầu riêng Ri6",
        areaHa: 50,
        sickTrees: 22,
        treatingTrees: 12,
        plots: [
          {
            id: "plot-b1",
            name: "Lô B1 - Ri6 (30 ha)",
            areaHa: 30,
            sickTrees: 14,
            treatingTrees: 8,
            status: "Active",
          },
          {
            id: "plot-b2",
            name: "Lô B2 - Dona (20 ha)",
            areaHa: 20,
            sickTrees: 8,
            treatingTrees: 4,
            status: "Active",
          },
        ],
      },
      {
        id: "area-c",
        name: "Khu Phức hợp Nông nghiệp C",
        areaHa: 30,
        sickTrees: 15,
        treatingTrees: 5,
        plots: [
          {
            id: "plot-c1",
            name: "Lô C1 - Thử nghiệm (15 ha)",
            areaHa: 15,
            sickTrees: 9,
            treatingTrees: 3,
            status: "Active",
          },
          {
            id: "plot-c2",
            name: "Lô C2 - Giống mới (15 ha)",
            areaHa: 15,
            sickTrees: 6,
            treatingTrees: 2,
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    id: "zone-2",
    name: "Vùng trồng Sầu riêng Ri6 Krông Pắc",
    description: "Phạm vi địa lý: Đắk Lắk Beta",
    totalAreaHa: 85,
    status: "Hoạt động",
    coordinates: { lat: 12.6667, lng: 108.2333 },
    areas: [
      {
        id: "area-d",
        name: "Khu D1 - Sầu riêng Ri6 Xuất khẩu",
        areaHa: 45,
        sickTrees: 8,
        treatingTrees: 3,
        plots: [
          {
            id: "plot-d1",
            name: "Lô D1-01 (25 ha)",
            areaHa: 25,
            sickTrees: 5,
            treatingTrees: 2,
            status: "Active",
          },
          {
            id: "plot-d2",
            name: "Lô D1-02 (20 ha)",
            areaHa: 20,
            sickTrees: 3,
            treatingTrees: 1,
            status: "Active",
          },
        ],
      },
      {
        id: "area-e",
        name: "Khu D2 - Sầu riêng Dona Tây Nguyên",
        areaHa: 40,
        sickTrees: 12,
        treatingTrees: 5,
        plots: [
          {
            id: "plot-e1",
            name: "Lô D2-01 (20 ha)",
            areaHa: 20,
            sickTrees: 7,
            treatingTrees: 3,
            status: "Active",
          },
          {
            id: "plot-e2",
            name: "Lô D2-02 (20 ha)",
            areaHa: 20,
            sickTrees: 5,
            treatingTrees: 2,
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    id: "zone-3",
    name: "Vùng canh tác Mít Thái Bình Minh",
    description: "Phạm vi địa lý: Vĩnh Long Gamma",
    totalAreaHa: 60,
    status: "Hoạt động",
    coordinates: { lat: 10.0381, lng: 105.8118 },
    areas: [
      {
        id: "area-f",
        name: "Khu F1 - Mít Thái Siêu Mớm",
        areaHa: 60,
        sickTrees: 5,
        treatingTrees: 2,
        plots: [
          {
            id: "plot-f1",
            name: "Lô F1-01 (30 ha)",
            areaHa: 30,
            sickTrees: 3,
            treatingTrees: 1,
            status: "Active",
          },
          {
            id: "plot-f2",
            name: "Lô F1-02 (30 ha)",
            areaHa: 30,
            sickTrees: 2,
            treatingTrees: 1,
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    id: "zone-4",
    name: "Vùng trồng Xoài Hòa Lộc Cao Lãnh",
    description: "Phạm vi địa lý: Đồng Tháp Delta",
    totalAreaHa: 90,
    status: "Hoạt động",
    coordinates: { lat: 10.4602, lng: 105.6339 },
    areas: [
      {
        id: "area-g",
        name: "Khu G1 - Xoài Cát Hòa Lộc VietGAP",
        areaHa: 90,
        sickTrees: 14,
        treatingTrees: 6,
        plots: [
          {
            id: "plot-g1",
            name: "Lô G1-01 (45 ha)",
            areaHa: 45,
            sickTrees: 8,
            treatingTrees: 3,
            status: "Active",
          },
          {
            id: "plot-g2",
            name: "Lô G1-02 (45 ha)",
            areaHa: 45,
            sickTrees: 6,
            treatingTrees: 3,
            status: "Active",
          },
        ],
      },
    ],
  },
];

export interface Top20ActiveFarmerItem {
  id: string;
  rank: number;
  farmId: string;
  farmerName: string;
  location: string;
  lastActiveDate: string;
  activityType: string;
  validDiaryUpdatesCount: number;
  activeDaysCount: number;
  frequency: string;
}

export interface InactiveFarmerItem {
  id: string;
  farmId: string;
  farmerName: string;
  location: string;
  phone: string;
  lastActiveDate: string;
  reason: string;
}

export const top20ActiveFarmersData: Top20ActiveFarmerItem[] = [
  {
    id: "af-1",
    rank: 1,
    farmId: "FARM-1029",
    farmerName: "HTX Lúa Thơm Thoại Sơn",
    location: "An Giang",
    lastActiveDate: "17/09/2026",
    activityType: "Bón phân hữu cơ & Phun BVTV",
    validDiaryUpdatesCount: 24,
    activeDaysCount: 18,
    frequency: "5.6 lần/tuần",
  },
  {
    id: "af-2",
    rank: 2,
    farmId: "FARM-2084",
    farmerName: "HTX Sầu Riêng Bến Tre",
    location: "Bến Tre",
    lastActiveDate: "17/09/2026",
    activityType: "Tỉa cành & Phun nấm sinh học",
    validDiaryUpdatesCount: 21,
    activeDaysCount: 16,
    frequency: "4.9 lần/tuần",
  },
  {
    id: "af-3",
    rank: 3,
    farmId: "FARM-1105",
    farmerName: "Nông hộ Nguyễn Văn Sang",
    location: "Sóc Trăng",
    lastActiveDate: "16/09/2026",
    activityType: "Tưới tiêu & Khảo sát sâu bệnh",
    validDiaryUpdatesCount: 19,
    activeDaysCount: 15,
    frequency: "4.4 lần/tuần",
  },
  {
    id: "af-4",
    rank: 4,
    farmId: "FARM-3042",
    farmerName: "HTX Sầu Riêng Phong Điền",
    location: "Cần Thơ",
    lastActiveDate: "16/09/2026",
    activityType: "Bón phân NPK & Thu hoạch",
    validDiaryUpdatesCount: 18,
    activeDaysCount: 14,
    frequency: "4.2 lần/tuần",
  },
  {
    id: "af-5",
    rank: 5,
    farmId: "FARM-4019",
    farmerName: "HTX Cà Phê Cư M'gar",
    location: "Đắk Lắk",
    lastActiveDate: "15/09/2026",
    activityType: "Cắt tỉa chồi & Làm cỏ gốc",
    validDiaryUpdatesCount: 17,
    activeDaysCount: 13,
    frequency: "4.0 lần/tuần",
  },
  {
    id: "af-6",
    rank: 6,
    farmId: "FARM-1077",
    farmerName: "HTX Nông Nghiệp Thạnh Trị",
    location: "Sóc Trăng",
    lastActiveDate: "15/09/2026",
    activityType: "Bón phân đợt 2 & Kiểm tra nước",
    validDiaryUpdatesCount: 16,
    activeDaysCount: 12,
    frequency: "3.7 lần/tuần",
  },
  {
    id: "af-7",
    rank: 7,
    farmId: "FARM-2031",
    farmerName: "Nông hộ Nguyễn Thanh Tùng",
    location: "Tiền Giang",
    lastActiveDate: "14/09/2026",
    activityType: "Phun thuốc sinh học Bio-Shield",
    validDiaryUpdatesCount: 15,
    activeDaysCount: 11,
    frequency: "3.5 lần/tuần",
  },
  {
    id: "af-8",
    rank: 8,
    farmId: "FARM-5088",
    farmerName: "HTX Mít Thái Bình Minh",
    location: "Vĩnh Long",
    lastActiveDate: "14/09/2026",
    activityType: "Bao trái & Phun trừ rệp sáp",
    validDiaryUpdatesCount: 14,
    activeDaysCount: 11,
    frequency: "3.3 lần/tuần",
  },
  {
    id: "af-9",
    rank: 9,
    farmId: "FARM-1045",
    farmerName: "Nông hộ Trần Quốc Tuấn",
    location: "Đồng Tháp",
    lastActiveDate: "13/09/2026",
    activityType: "Rãi phân Kali & Xử lý đất",
    validDiaryUpdatesCount: 13,
    activeDaysCount: 10,
    frequency: "3.0 lần/tuần",
  },
  {
    id: "af-10",
    rank: 10,
    farmId: "FARM-3092",
    farmerName: "HTX Sầu Riêng Krông Pắc",
    location: "Đắk Lắk",
    lastActiveDate: "13/09/2026",
    activityType: "Bón phân vi sinh & Tưới nhỏ giọt",
    validDiaryUpdatesCount: 13,
    activeDaysCount: 9,
    frequency: "3.0 lần/tuần",
  },
  {
    id: "af-11",
    rank: 11,
    farmId: "FARM-1066",
    farmerName: "Nông hộ Lê Hoàng Nam",
    location: "Kiên Giang",
    lastActiveDate: "12/09/2026",
    activityType: "Cày xới rãnh & Dẫn nước",
    validDiaryUpdatesCount: 12,
    activeDaysCount: 9,
    frequency: "2.8 lần/tuần",
  },
  {
    id: "af-12",
    rank: 12,
    farmId: "FARM-2054",
    farmerName: "Nông hộ Lê Văn Thành",
    location: "Vĩnh Long",
    lastActiveDate: "12/09/2026",
    activityType: "Thu hoạch đợt 1 & Cân trái",
    validDiaryUpdatesCount: 11,
    activeDaysCount: 8,
    frequency: "2.6 lần/tuần",
  },
  {
    id: "af-13",
    rank: 13,
    farmId: "FARM-4081",
    farmerName: "Nông hộ Y Krăm Niê",
    location: "Đắk Lắk",
    lastActiveDate: "11/09/2026",
    activityType: "Tưới cà phê & Rãi phân lót",
    validDiaryUpdatesCount: 11,
    activeDaysCount: 8,
    frequency: "2.6 lần/tuần",
  },
  {
    id: "af-14",
    rank: 14,
    farmId: "FARM-1022",
    farmerName: "HTX Lúa Vàng Hòn Đất",
    location: "Kiên Giang",
    lastActiveDate: "10/09/2026",
    activityType: "Phun xịt xô vi lượng đợt 3",
    validDiaryUpdatesCount: 10,
    activeDaysCount: 7,
    frequency: "2.3 lần/tuần",
  },
  {
    id: "af-15",
    rank: 15,
    farmId: "FARM-5012",
    farmerName: "HTX Rau Sạch Củ Chi",
    location: "TP. Hồ Chí Minh",
    lastActiveDate: "10/09/2026",
    activityType: "Bắt sâu thủ công & Thu hoạch",
    validDiaryUpdatesCount: 10,
    activeDaysCount: 7,
    frequency: "2.3 lần/tuần",
  },
  {
    id: "af-16",
    rank: 16,
    farmId: "FARM-2019",
    farmerName: "HTX Cây Ăn Quả Cai Lậy",
    location: "Tiền Giang",
    lastActiveDate: "09/09/2026",
    activityType: "Tưới bổ sung dưỡng chất gốc",
    validDiaryUpdatesCount: 9,
    activeDaysCount: 6,
    frequency: "2.1 lần/tuần",
  },
  {
    id: "af-17",
    rank: 17,
    farmId: "FARM-3071",
    farmerName: "Nông hộ Nguyễn Văn Hùng",
    location: "Lâm Đồng",
    lastActiveDate: "08/09/2026",
    activityType: "Tỉa trái chuyền & Phun vi lượng",
    validDiaryUpdatesCount: 9,
    activeDaysCount: 6,
    frequency: "2.1 lần/tuần",
  },
  {
    id: "af-18",
    rank: 18,
    farmId: "FARM-4033",
    farmerName: "Nông hộ Trần Văn Định",
    location: "Gia Lai",
    lastActiveDate: "07/09/2026",
    activityType: "Rãi vôi cải tạo pH đất",
    validDiaryUpdatesCount: 8,
    activeDaysCount: 5,
    frequency: "1.9 lần/tuần",
  },
  {
    id: "af-19",
    rank: 19,
    farmId: "FARM-5044",
    farmerName: "Nông hộ Lê Văn Thuận",
    location: "Tiền Giang",
    lastActiveDate: "06/09/2026",
    activityType: "Cắt cành già & Bón lót",
    validDiaryUpdatesCount: 8,
    activeDaysCount: 5,
    frequency: "1.9 lần/tuần",
  },
  {
    id: "af-20",
    rank: 20,
    farmId: "FARM-1090",
    farmerName: "Nông hộ Phạm Đức Minh",
    location: "Long An",
    lastActiveDate: "05/09/2026",
    activityType: "Xử lý đất & Gieo sạ bổ sung",
    validDiaryUpdatesCount: 7,
    activeDaysCount: 4,
    frequency: "1.6 lần/tuần",
  },
];

export const inactiveFarmersData: InactiveFarmerItem[] = [
  {
    id: "inaf-1",
    farmId: "FARM-9012",
    farmerName: "Nông hộ Lê Văn Cường",
    location: "Tiền Giang",
    phone: "0908 123 456",
    lastActiveDate: "20/07/2026",
    reason: "Chưa cập nhật nhật ký trong tháng 9 (0 ngày / 0 lần vật tư)",
  },
  {
    id: "inaf-2",
    farmId: "FARM-9015",
    farmerName: "Nông hộ Nguyễn Thị Hoa",
    location: "Bến Tre",
    phone: "0912 345 678",
    lastActiveDate: "02/08/2026",
    reason: "Chỉ cập nhật 1 ngày trong tháng (Chưa đạt ≥2 ngày khác nhau)",
  },
  {
    id: "inaf-3",
    farmId: "FARM-9022",
    farmerName: "HTX Nông Nghiệp Đắk Mil",
    location: "Đắk Nông",
    phone: "0934 567 890",
    lastActiveDate: "15/08/2026",
    reason: "Nhập nhật ký chung chung (Không có số liệu vật tư thực tế)",
  },
  {
    id: "inaf-4",
    farmId: "FARM-9038",
    farmerName: "Nông hộ Phạm Văn An",
    location: "Đắk Nông",
    phone: "0978 901 234",
    lastActiveDate: "28/07/2026",
    reason: "Chưa nhập nhật ký kể từ tháng 7",
  },
  {
    id: "inaf-5",
    farmId: "FARM-9041",
    farmerName: "Nông hộ Đỗ Thị Phượng",
    location: "Bến Tre",
    phone: "0989 012 345",
    lastActiveDate: "10/08/2026",
    reason: "Không ghi nhận hoạt động vật tư trong tháng 9",
  },
  {
    id: "inaf-6",
    farmId: "FARM-9055",
    farmerName: "Nông hộ Võ Văn Lâm",
    location: "Tiền Giang",
    phone: "0945 678 901",
    lastActiveDate: "05/08/2026",
    reason: "Thiếu dữ liệu minh chứng vật tư thực tế",
  },
  {
    id: "inaf-7",
    farmId: "FARM-9060",
    farmerName: "Nông hộ Bùi Minh Tuấn",
    location: "Đồng Nai",
    phone: "0967 890 123",
    lastActiveDate: "18/07/2026",
    reason: "Chưa cập nhật hoạt động canh tác đợt mới",
  },
];
