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
  crop: string; // e.g., "Heo thịt"
  durationDays: number;
  stages: string[];
  description: string;
}

export const SEASONS: Season[] = [
  {
    id: "S2025-SPRING",
    name: "Vụ Xuân 2025",
    startDate: "2025-01-01",
    endDate: "2025-04-30",
    status: "active",
  },
  {
    id: "S2025-SUMMER",
    name: "Vụ Hè 2025",
    startDate: "2025-05-01",
    endDate: "2025-08-31",
    status: "upcoming",
  },
  {
    id: "S2025-AUTUMN",
    name: "Vụ Thu 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "upcoming",
  },
];

export const GROWTH_CYCLES: GrowthCycle[] = [
  {
    id: "GC-DURIAN-STD",
    name: "Quy trình Heo thịt chuẩn (VietGAP)",
    crop: "Heo thịt",
    durationDays: 120,
    stages: [
      "Phục hồi sau xuất bán",
      "Kích thích ra đọt",
      "Làm bông (Ra hoa)",
      "Xổ nhụy (Đậu trái)",
      "Nuôi trái (Giai đoạn 1)",
      "Nuôi trái (Giai đoạn 2)",
      "Xuất bán",
    ],
    description: "Quy trình chuẩn cho cây sầu riêng kinh doanh",
  },
  {
    id: "GC-MANGO-STD",
    name: "Quy trình Gà đẻ Lương Phượng",
    crop: "Gà đẻ",
    durationDays: 90,
    stages: [
      "Tỉa cành tạo tán",
      "Kích thích ra hoa",
      "Đậu trái non",
      "Bao trái",
      "Xuất bán",
    ],
    description: "Tập trung vào chất lượng trái thương phẩm",
  },
  {
    id: "GC-POMELO-STD",
    name: "Quy trình Bò thịt Brahman",
    crop: "Bò thịt",
    durationDays: 150,
    stages: [
      "Chăm sóc sau xuất bán",
      "Xiết nước làm bông",
      "Ra hoa đậu quả",
      "Nuôi quả non",
      "Nuôi quả giai đoạn đường hóa",
      "Xuất bán",
    ],
    description: "Quy trình thâm canh năng suất cao",
  },
];

// Helper to get cycle by crop
export const getCyclesByCrop = (crop: string) =>
  GROWTH_CYCLES.filter((c) => c.crop === crop);
