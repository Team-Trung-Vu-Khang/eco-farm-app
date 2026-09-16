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
    r.areas.some((a) => a.plots.some((p) => p.id === plotId))
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
  { month: "T2/23", monthon: 45, ri6: 38, dona: 32 },
  { month: "T3/23", monthon: 52, ri6: 42, dona: 35 },
  { month: "T4/23", monthon: 48, ri6: 45, dona: 38 },
  { month: "T5/23", monthon: 61, ri6: 50, dona: 42 },
  { month: "T6/23", monthon: 55, ri6: 48, dona: 45 },
  { month: "T7/23", monthon: 67, ri6: 55, dona: 48 },
  { month: "T8/23", monthon: 72, ri6: 60, dona: 52 },
  { month: "T9/23", monthon: 68, ri6: 58, dona: 50 },
  { month: "T10/23", monthon: 75, ri6: 65, dona: 55 },
  { month: "T11/23", monthon: 82, ri6: 70, dona: 60 },
  { month: "T12/23", monthon: 78, ri6: 68, dona: 58 },
  { month: "T1/24", monthon: 85, ri6: 75, dona: 65 },
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
  { id: "f1", name: "HTX Sầu riêng Monthon Phong Điền", value: 16.5, yieldTons: 185 },
  { id: "f2", name: "Nông hộ Nguyễn Văn A (Bến Tre)", value: 12.0, yieldTons: 135 },
  { id: "f3", name: "HTX Mít Thái Bình Minh", value: 9.5, yieldTons: 106 },
  { id: "f4", name: "Nông hộ Trần Thị B (Vĩnh Long)", value: 8.2, yieldTons: 92 },
  { id: "f5", name: "Nông hộ Lê Văn C (Tiền Giang)", value: 6.8, yieldTons: 76 },
  { id: "f6", name: "Nông hộ Phạm Văn D (Đồng Tháp)", value: 5.4, yieldTons: 60 },
  { id: "f7", name: "HTX Sầu riêng Krông Pắc", value: 4.8, yieldTons: 54 },
  { id: "f8", name: "Nông hộ Võ Văn E (Đắk Lắk)", value: 4.2, yieldTons: 47 },
  { id: "f9", name: "Nông hộ Đỗ Thị F (Lâm Đồng)", value: 3.6, yieldTons: 40 },
  { id: "f10", name: "Nông hộ Bùi Văn G (Gia Lai)", value: 3.1, yieldTons: 35 },
  { id: "f11", name: "Nông hộ Ngô Thị H (Đắk Nông)", value: 2.8, yieldTons: 31 },
  { id: "f12", name: "HTX Cây ăn quả Châu Thành", value: 2.5, yieldTons: 28 },
  { id: "f13", name: "Nông hộ Đặng Văn I (Cần Thơ)", value: 2.2, yieldTons: 25 },
  { id: "f14", name: "Nông hộ Trịnh Thị K (Hậu Giang)", value: 1.9, yieldTons: 21 },
  { id: "f15", name: "Nông hộ Vũ Văn L (Tây Ninh)", value: 1.7, yieldTons: 19 },
  { id: "f16", name: "Nông hộ Dương Thị M (Bình Dương)", value: 1.5, yieldTons: 17 },
  { id: "f17", name: "Nông hộ Lý Văn N (Đồng Nai)", value: 1.3, yieldTons: 15 },
  { id: "f18", name: "Nông hộ Hồ Thị P (Bình Phước)", value: 1.1, yieldTons: 12 },
  { id: "f19", name: "Nông hộ Mai Văn Q (Long An)", value: 1.0, yieldTons: 11 },
  { id: "f20", name: "Nông hộ Đào Thị R (An Giang)", value: 0.9, yieldTons: 10 },
  { id: "f_others", name: "Khác (các nông hộ nhỏ lẻ)", value: 11.6, yieldTons: 131 },
];

export const HARVEST_COLORS = [
  "#10b981", "#059669", "#047857", "#065f46", "#14b8a6",
  "#0d9488", "#0f766e", "#0284c7", "#0369a1", "#1d4ed8",
  "#1e40af", "#4f46e5", "#4338ca", "#7c3aed", "#6d28d9",
  "#8b5cf6", "#a855f7", "#9333ea", "#c026d3", "#d946ef",
  "#94a3b8" // Color for "Khác"
];

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



