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

