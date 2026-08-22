export interface CropHarvestInfo {
  totalYield: number; // kg
  trendYield: number; // %
  isYieldUp: boolean;
  recentHarvest: number; // kg
  trendRecent: number; // %
  isRecentUp: boolean;
  remaining: number; // ha
  remainingQty: number; // cây
  ratio: number; // % remaining compared to total
}

export interface CropStatus {
  total: number;
  good: number;
  treating: number;
  disease: number;
  harvesting: number;
}

export interface CropItem {
  id: string;
  name: string;
  area: number; // ha
  quantity: number; // cây
  status: CropStatus;
  harvest: CropHarvestInfo;
}

export interface ConsumptionGroup {
  name: string;
  amount: number;
}

export interface ConsumptionDetail {
  pesticide: {
    total: number;
    trend: number;
    isIncrease: boolean;
    groups: ConsumptionGroup[];
  };
  fertilizer: {
    total: number;
    trend: number;
    isIncrease: boolean;
    groups: ConsumptionGroup[];
  };
  equipment: {
    total: number; // ngày sử dụng
    trend: number;
    isIncrease: boolean;
    groups: ConsumptionGroup[];
  };
  other: {
    total: number;
    trend: number;
    isIncrease: boolean;
    groups: ConsumptionGroup[];
  };
}

export interface TreeNode {
  id: string;
  name: string;
  type: "region" | "area" | "plot";
  consumption: ConsumptionDetail;
  children?: TreeNode[];
  standard?: "VietGAP" | "GlobalGAP" | "Organic";
  status?: "Active" | "Inactive";
  size?: number; // size in hectares
  company?: "ecofarm" | "hoabinh" | "mekong";
}

export const mockGeneralStats = {
  regionsCount: 4,
  areasCount: 12,
  plotsCount: 36,
};

export const mockCrops: CropItem[] = [
  {
    id: "crop-1",
    name: "Sầu riêng Ri6",
    area: 12.5,
    quantity: 3750,
    status: { total: 10, good: 7, treating: 2, disease: 1, harvesting: 3 },
    harvest: {
      totalYield: 24500,
      trendYield: 15,
      isYieldUp: true,
      recentHarvest: 5200,
      trendRecent: 8,
      isRecentUp: true,
      remaining: 4.5,
      remainingQty: 1350,
      ratio: 36,
    },
  },
  {
    id: "crop-2",
    name: "Xoài cát Hòa Lộc",
    area: 8.2,
    quantity: 2460,
    status: { total: 8, good: 6, treating: 1, disease: 1, harvesting: 2 },
    harvest: {
      totalYield: 18500,
      trendYield: -5,
      isYieldUp: false,
      recentHarvest: 3100,
      trendRecent: 12,
      isRecentUp: true,
      remaining: 2.1,
      remainingQty: 630,
      ratio: 25,
    },
  },
  {
    id: "crop-3",
    name: "Mít Thái",
    area: 15.0,
    quantity: 4500,
    status: { total: 12, good: 10, treating: 1, disease: 1, harvesting: 4 },
    harvest: {
      totalYield: 32000,
      trendYield: 10,
      isYieldUp: true,
      recentHarvest: 6400,
      trendRecent: -3,
      isRecentUp: false,
      remaining: 5.0,
      remainingQty: 1500,
      ratio: 33,
    },
  },
  {
    id: "crop-4",
    name: "Bưởi da xanh",
    area: 9.6,
    quantity: 2880,
    status: { total: 9, good: 8, treating: 0, disease: 1, harvesting: 2 },
    harvest: {
      totalYield: 21000,
      trendYield: 12,
      isYieldUp: true,
      recentHarvest: 4100,
      trendRecent: 5,
      isRecentUp: true,
      remaining: 3.2,
      remainingQty: 960,
      ratio: 33,
    },
  },
  {
    id: "crop-5",
    name: "Thanh long ruột đỏ",
    area: 7.8,
    quantity: 2340,
    status: { total: 8, good: 5, treating: 2, disease: 1, harvesting: 0 },
    harvest: {
      totalYield: 14200,
      trendYield: -2,
      isYieldUp: false,
      recentHarvest: 2800,
      trendRecent: -5,
      isRecentUp: false,
      remaining: 2.5,
      remainingQty: 750,
      ratio: 32,
    },
  },
];

// Helper to generate consumption details
const createConsumption = (
  pestTotal: number, pestTrend: number, pestInc: boolean,
  fertTotal: number, fertTrend: number, fertInc: boolean,
  equipTotal: number, equipTrend: number, equipInc: boolean,
  otherTotal: number, otherTrend: number, otherInc: boolean
): ConsumptionDetail => ({
  pesticide: {
    total: pestTotal,
    trend: pestTrend,
    isIncrease: pestInc,
    groups: [
      { name: "Thuốc trừ sâu sinh học", amount: Math.round(pestTotal * 0.4) },
      { name: "Thuốc diệt nấm bệnh", amount: Math.round(pestTotal * 0.35) },
      { name: "Thuốc trừ cỏ sinh học", amount: Math.round(pestTotal * 0.25) },
    ],
  },
  fertilizer: {
    total: fertTotal,
    trend: fertTrend,
    isIncrease: fertInc,
    groups: [
      { name: "Phân bón hữu cơ vi sinh", amount: Math.round(fertTotal * 0.5) },
      { name: "Phân NPK cao cấp", amount: Math.round(fertTotal * 0.3) },
      { name: "Phân Lân & Kali", amount: Math.round(fertTotal * 0.2) },
    ],
  },
  equipment: {
    total: equipTotal,
    trend: equipTrend,
    isIncrease: equipInc,
    groups: [
      { name: "Máy cày & Máy phay đất", amount: Math.round(equipTotal * 0.4) },
      { name: "Hệ thống tưới tự động", amount: Math.round(equipTotal * 0.45) },
      { name: "Máy phun thuốc tự hành", amount: Math.round(equipTotal * 0.15) },
    ],
  },
  other: {
    total: otherTotal,
    trend: otherTrend,
    isIncrease: otherInc,
    groups: [
      { name: "Màng phủ nông nghiệp", amount: Math.round(otherTotal * 0.3) },
      { name: "Lưới chắn côn trùng", amount: Math.round(otherTotal * 0.5) },
      { name: "Dây cột giàn leo", amount: Math.round(otherTotal * 0.2) },
    ],
  },
});

export const mockTreeViewData: TreeNode[] = [
  {
    id: "r-1",
    name: "Vùng Bình Phước Alpha",
    type: "region",
    consumption: createConsumption(240, 12, true, 3500, -8, false, 84, 5, true, 120, 2, false),
    children: [
      {
        id: "a-1",
        name: "Khu vực B1 (Cây ăn trái)",
        type: "area",
        consumption: createConsumption(140, 15, true, 2100, -5, false, 48, 8, true, 70, 4, false),
        children: [
          {
            id: "p-1",
            name: "Lô B1-01 (Sầu riêng)",
            type: "plot",
            consumption: createConsumption(80, 8, true, 1200, -2, false, 28, 4, true, 40, 1, false),
            standard: "VietGAP",
            status: "Active",
            size: 4.5,
            company: "ecofarm",
          },
          {
            id: "p-2",
            name: "Lô B1-02 (Xoài cát)",
            type: "plot",
            consumption: createConsumption(60, 20, true, 900, -8, false, 20, 12, true, 30, 8, false),
            standard: "GlobalGAP",
            status: "Active",
            size: 3.2,
            company: "hoabinh",
          },
        ],
      },
      {
        id: "a-2",
        name: "Khu vực B2 (Rau củ hữu cơ)",
        type: "area",
        consumption: createConsumption(100, 8, false, 1400, -12, false, 36, 2, false, 50, 0, false),
        children: [
          {
            id: "p-3",
            name: "Lô B2-01 (Cà chua)",
            type: "plot",
            consumption: createConsumption(55, 5, false, 750, -10, false, 20, 0, false, 28, 0, false),
            standard: "Organic",
            status: "Active",
            size: 0.8,
            company: "ecofarm",
          },
          {
            id: "p-4",
            name: "Lô B2-02 (Ớt chuông)",
            type: "plot",
            consumption: createConsumption(45, 12, false, 650, -15, false, 16, 5, false, 22, 0, false),
            standard: "Organic",
            status: "Inactive",
            size: 0.5,
            company: "hoabinh",
          },
        ],
      },
    ],
  },
  {
    id: "r-2",
    name: "Vùng Đồng Nai Beta",
    type: "region",
    consumption: createConsumption(190, -5, false, 2800, 4, true, 68, -2, false, 95, 10, true),
    children: [
      {
        id: "a-3",
        name: "Khu vực D1 (Mít Thái)",
        type: "area",
        consumption: createConsumption(110, -8, false, 1600, 6, true, 40, -4, false, 55, 12, true),
        children: [
          {
            id: "p-5",
            name: "Lô D1-01 (Mít đợt 1)",
            type: "plot",
            consumption: createConsumption(60, -10, false, 900, 8, true, 22, -5, false, 30, 15, true),
            standard: "VietGAP",
            status: "Active",
            size: 5.5,
            company: "ecofarm",
          },
          {
            id: "p-6",
            name: "Lô D1-02 (Mít đợt 2)",
            type: "plot",
            consumption: createConsumption(50, -6, false, 700, 4, true, 18, -2, false, 25, 8, true),
            standard: "VietGAP",
            status: "Inactive",
            size: 2.8,
            company: "hoabinh",
          },
        ],
      },
      {
        id: "a-4",
        name: "Khu vực D2 (Bưởi da xanh)",
        type: "area",
        consumption: createConsumption(80, 2, true, 1200, 2, true, 28, 0, false, 40, 5, true),
        children: [
          {
            id: "p-7",
            name: "Lô D2-01 (Bưởi tơ)",
            type: "plot",
            consumption: createConsumption(45, 5, true, 650, 3, true, 16, 0, false, 22, 5, true),
            standard: "GlobalGAP",
            status: "Active",
            size: 1.5,
            company: "ecofarm",
          },
          {
            id: "p-8",
            name: "Lô D2-02 (Bưởi già)",
            type: "plot",
            consumption: createConsumption(35, -2, false, 550, 0, false, 12, 0, false, 18, 5, true),
            standard: "GlobalGAP",
            status: "Active",
            size: 6.2,
            company: "hoabinh",
          },
        ],
      },
    ],
  },
];

export const mockFarmingHistory = {
  plans: {
    pending: 4,
    inProgress: 8,
    completed: 15,
  },
  tasks: {
    pending: 12,
    inProgress: 24,
    completed: 45,
  },
  recentPlans: [
    { id: "rp-1", name: "Kế hoạch bón phân thúc đợt 3 mùa khô", type: "Bón phân", date: "2026-08-20", status: "Hoàn thành" },
    { id: "rp-2", name: "Phun phòng rầy phấn trắng sầu riêng A1", type: "Phun bảo vệ thực vật", date: "2026-08-16", status: "Hoàn thành" },
    { id: "rp-3", name: "Kế hoạch thu hoạch dứt điểm mít Thái lô D1", type: "Thu hoạch", date: "2026-08-12", status: "Hoàn thành" },
    { id: "rp-4", name: "Cải tạo đất mặt chuẩn bị xuống giống bưởi tơ", type: "Làm đất", date: "2026-08-08", status: "Hoàn thành" },
    { id: "rp-5", name: "Kế hoạch cắt cành tạo tán sầu riêng sau thu hoạch", type: "Cắt tỉa", date: "2026-08-05", status: "Hoàn thành" },
    { id: "rp-6", name: "Rải vôi khử trùng khử chua vùng A1-02", type: "Làm đất", date: "2026-08-01", status: "Hoàn thành" },
    { id: "rp-7", name: "Kế hoạch lắp đặt hệ thống tưới tự động khu B2", type: "Hạ tầng", date: "2026-07-28", status: "Hoàn thành" },
  ],
  recentTasks: [
    { id: "rt-1", name: "Làm sạch gốc và nhổ cỏ quanh lô B1-02", assignee: "Nguyễn Văn Hùng", date: "2026-08-22" },
    { id: "rt-2", name: "Kiểm tra vòi tưới nhỏ giọt phân khu D1", assignee: "Trần Thị Lan", date: "2026-08-21" },
    { id: "rt-3", name: "Hòa phân loãng tưới gốc cho bưởi tơ", assignee: "Lê Hoàng Nam", date: "2026-08-20" },
    { id: "rt-4", name: "Bao trái xoài cát chuẩn bị thu hoạch", assignee: "Phạm Minh Tuấn", date: "2026-08-19" },
    { id: "rt-5", name: "Phát hoang bụi rậm hành lang bảo vệ", assignee: "Bùi Tiến Dũng", date: "2026-08-18" },
    { id: "rt-6", name: "Cắm cọc gia cố thân cây giống khu D2", assignee: "Phạm Văn Long", date: "2026-08-17" },
    { id: "rt-7", name: "Thu gom túi bao trái cũ phân khu D1", assignee: "Nguyễn Thị Mai", date: "2026-08-16" },
    { id: "rt-8", name: "Kiểm định độ pH đất vùng B1-01", assignee: "Lê Văn Tùng", date: "2026-08-15" },
  ],
};

export const mockHRStats = {
  departments: [
    { name: "Kỹ thuật nông nghiệp", value: 24 },
    { name: "Vận hành sản xuất", value: 18 },
    { name: "Kinh doanh phát triển", value: 12 },
    { name: "Hành chính - Nhân sự", value: 8 },
    { name: "Tài chính - Kế toán", value: 6 },
  ],
  positions: [
    { name: "Công nhân canh tác", value: 28 },
    { name: "Kỹ sư nông nghiệp", value: 15 },
    { name: "Quản lý vùng trồng", value: 10 },
    { name: "Nhân viên văn phòng", value: 14 },
  ],
};
