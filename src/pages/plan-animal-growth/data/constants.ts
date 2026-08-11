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
    id: "ANIMAL-2025-PIG",
    name: "Lứa heo thịt 2025",
    startDate: "2025-01-01",
    endDate: "2025-04-30",
    status: "active",
  },
  {
    id: "ANIMAL-2025-HEN",
    name: "Lứa gà đẻ 2025",
    startDate: "2025-05-01",
    endDate: "2025-08-31",
    status: "upcoming",
  },
  {
    id: "ANIMAL-2025-CATTLE",
    name: "Lứa bò thịt 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "upcoming",
  },
];

export const GROWTH_CYCLES: GrowthCycle[] = [
  {
    id: "GC-PIG-STD",
    name: "Quy trình Heo thịt chuẩn (VietGAHP)",
    crop: "Heo thịt",
    durationDays: 120,
    stages: [
      "Chuẩn bị chuồng",
      "Nhập đàn",
      "Úm và thích nghi",
      "Nuôi tăng trọng",
      "Phòng bệnh định kỳ",
      "Xuất bán",
    ],
    description: "Quy trình chuẩn cho đàn heo thịt thương phẩm",
  },
  {
    id: "GC-HEN-STD",
    name: "Quy trình Gà đẻ Lương Phượng",
    crop: "Gà đẻ",
    durationDays: 90,
    stages: [
      "Nuôi hậu bị",
      "Vào đẻ",
      "Tối ưu sản lượng trứng",
      "Vệ sinh ổ đẻ",
      "Loại thải và tái đàn",
    ],
    description: "Tập trung ổn định sản lượng và chất lượng trứng",
  },
  {
    id: "GC-CATTLE-STD",
    name: "Quy trình Bò thịt Brahman",
    crop: "Bò thịt",
    durationDays: 150,
    stages: [
      "Tiếp nhận bê giống",
      "Nuôi nền",
      "Vỗ béo",
      "Chăm sóc thú y",
      "Xuất bán",
    ],
    description: "Quy trình vỗ béo bò thịt theo dõi tăng trọng",
  },
];

// Helper to get cycle by crop
export const getCyclesByCrop = (crop: string) =>
  GROWTH_CYCLES.filter((c) => c.crop === crop);
