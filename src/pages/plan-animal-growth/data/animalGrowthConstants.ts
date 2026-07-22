export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
}

export interface LivestockCycle {
  id: string;
  name: string;
  livestockType: string; // e.g., "Heo thịt"
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

export const LIVESTOCK_CYCLES: LivestockCycle[] = [
  {
    id: "LC-PIG-FATTENING",
    name: "Quy trình nuôi heo thịt chuẩn an toàn sinh học",
    livestockType: "Heo thịt",
    durationDays: 150,
    stages: [
      "Nhập đàn và cách ly",
      "Làm quen chuồng nuôi",
      "Tăng trưởng giai đoạn 1",
      "Tăng trưởng giai đoạn 2",
      "Vỗ béo",
      "Xuất chuồng",
    ],
    description: "Chu kỳ chuẩn cho trại heo thịt theo hướng an toàn sinh học",
  },
  {
    id: "LC-LAYER-STD",
    name: "Quy trình nuôi gà đẻ trứng",
    livestockType: "Gà đẻ",
    durationDays: 120,
    stages: [
      "Úm gà con",
      "Chuyển giai đoạn hậu bị",
      "Bắt đầu đẻ",
      "Tăng sản lượng trứng",
      "Ổn định đàn",
    ],
    description: "Tập trung vào sức khỏe đàn và năng suất trứng",
  },
  {
    id: "LC-BEEF-STD",
    name: "Quy trình nuôi bò thịt",
    livestockType: "Bò thịt",
    durationDays: 180,
    stages: [
      "Nhập bê giống",
      "Tăng cường dinh dưỡng",
      "Tăng trọng",
      "Theo dõi sức khỏe",
      "Xuất bán",
    ],
    description: "Chu kỳ nuôi bò thịt hướng tăng trọng và kiểm soát dịch bệnh",
  },
];

// Helper to get cycle by livestock type
export const getCyclesByLivestockType = (livestockType: string) =>
  LIVESTOCK_CYCLES.filter((c) => c.livestockType === livestockType);
