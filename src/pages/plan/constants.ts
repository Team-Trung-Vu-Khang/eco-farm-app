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
  crop: string; // e.g., "Sầu riêng"
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
    name: "Quy trình Sầu riêng chuẩn (VietGAP)",
    crop: "Sầu riêng",
    durationDays: 120,
    stages: [
      "Phục hồi sau thu hoạch",
      "Kích thích ra đọt",
      "Làm bông (Ra hoa)",
      "Xổ nhụy (Đậu trái)",
      "Nuôi trái (Giai đoạn 1)",
      "Nuôi trái (Giai đoạn 2)",
      "Thu hoạch",
    ],
    description: "Quy trình chuẩn cho cây sầu riêng kinh doanh",
  },
  {
    id: "GC-MANGO-STD",
    name: "Quy trình Xoài Cát Hòa Lộc",
    crop: "Xoài",
    durationDays: 90,
    stages: [
      "Tỉa cành tạo tán",
      "Kích thích ra hoa",
      "Đậu trái non",
      "Bao trái",
      "Thu hoạch",
    ],
    description: "Tập trung vào chất lượng trái thương phẩm",
  },
  {
    id: "GC-POMELO-STD",
    name: "Quy trình Bưởi Da Xanh",
    crop: "Bưởi",
    durationDays: 150,
    stages: [
      "Chăm sóc sau thu hoạch",
      "Xiết nước làm bông",
      "Ra hoa đậu quả",
      "Nuôi quả non",
      "Nuôi quả giai đoạn đường hóa",
      "Thu hoạch",
    ],
    description: "Quy trình thâm canh năng suất cao",
  },
];

export const TREATMENT_REGIMENS = [
  {
    id: "reg-phen-cap-toc",
    name: "Phác đồ khử phèn cấp tốc",
    description: "Sử dụng vôi nóng và bơm xả liên tục",
  },
  {
    id: "reg-phen-ben-vung",
    name: "Phác đồ khử phèn bền vững",
    description: "Kết hợp vôi, lân và hữu cơ vi sinh",
  },
  {
    id: "reg-man-rua-troi",
    name: "Phác đồ rửa mặn 3 bước",
    description: "Rửa trôi - Bón vôi - Trồng cây chịu mặn",
  },
  {
    id: "reg-phong-ngua-sau-benh",
    name: "Phác đồ phòng ngừa sâu bệnh tổng hợp (IPM)",
    description: "Kết hợp biện pháp sinh học, hóa học và canh tác",
  },
];

// Helper to get cycle by crop
export const getCyclesByCrop = (crop: string) =>
  GROWTH_CYCLES.filter((c) => c.crop === crop);
