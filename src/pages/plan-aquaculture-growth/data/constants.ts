export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
}

export interface GrowthCycle {
  id: string;
  name: string;
  crop: string;
  durationDays: number;
  stages: string[];
  description: string;
}

export const SEASONS: Season[] = [
  {
    id: "AQUA-2025-SHRIMP",
    name: "Vụ tôm thẻ 2025",
    startDate: "2025-01-01",
    endDate: "2025-04-30",
    status: "active",
  },
  {
    id: "AQUA-2025-PANGASIUS",
    name: "Vụ cá tra 2025",
    startDate: "2025-05-01",
    endDate: "2025-08-31",
    status: "upcoming",
  },
  {
    id: "AQUA-2025-TILAPIA",
    name: "Vụ cá rô phi 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "upcoming",
  },
];

export const GROWTH_CYCLES: GrowthCycle[] = [
  {
    id: "GC-SHRIMP-STD",
    name: "Quy trình Tôm thẻ chuẩn (VietGAP thủy sản)",
    crop: "Tôm thẻ",
    durationDays: 120,
    stages: [
      "Chuẩn bị ao",
      "Thả giống",
      "Quản lý môi trường nước",
      "Cho ăn và theo dõi tăng trưởng",
      "Phòng bệnh gan tụy",
      "Thu hoạch",
    ],
    description: "Quy trình chuẩn cho vụ tôm thẻ thương phẩm",
  },
  {
    id: "GC-PANGASIUS-STD",
    name: "Quy trình Cá tra thương phẩm",
    crop: "Cá tra",
    durationDays: 90,
    stages: [
      "Cải tạo ao",
      "Thả cá giống",
      "Quản lý thức ăn",
      "Theo dõi môi trường nước",
      "Phân cỡ và thu hoạch",
    ],
    description: "Tập trung ổn định tăng trưởng và chất lượng cá thương phẩm",
  },
  {
    id: "GC-TILAPIA-STD",
    name: "Quy trình Cá rô phi đỏ",
    crop: "Cá rô phi",
    durationDays: 150,
    stages: [
      "Chuẩn bị ao nuôi",
      "Thả giống",
      "Cho ăn tăng trưởng",
      "Kiểm soát chất lượng nước",
      "Thu hoạch",
    ],
    description: "Quy trình nuôi cá rô phi theo dõi sinh khối và tỷ lệ sống",
  },
];

// Helper to get cycle by crop
export const getCyclesByCrop = (crop: string) =>
  GROWTH_CYCLES.filter((c) => c.crop === crop);
