export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
}

export interface AquacultureCycle {
  id: string;
  name: string;
  species: string;
  durationDays: number;
  stages: string[];
  description: string;
}

export const SEASONS: Season[] = [
  {
    id: "AQ-2025-Q1",
    name: "Vụ nuôi Q1/2025",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "completed",
  },
  {
    id: "AQ-2025-Q2",
    name: "Vụ nuôi Q2/2025",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: "active",
  },
  {
    id: "AQ-2025-Q3",
    name: "Vụ nuôi Q3/2025",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    status: "upcoming",
  },
];

export const AQUACULTURE_GROWTH_CYCLES: AquacultureCycle[] = [
  {
    id: "AQ-TOM-THU-STD",
    name: "Quy trình nuôi tôm thẻ chân trắng",
    species: "Tôm thẻ",
    durationDays: 90,
    stages: [
      "Cải tạo ao",
      "Gây màu nước",
      "Thả giống",
      "Chăm sóc tăng trưởng",
      "Phòng bệnh",
      "Thu hoạch",
    ],
    description: "Chu kỳ nuôi tôm thẻ thâm canh trong ao lót bạt",
  },
  {
    id: "AQ-CA-TRA-STD",
    name: "Quy trình nuôi cá tra thương phẩm",
    species: "Cá tra",
    durationDays: 120,
    stages: [
      "Xử lý ao",
      "Thả giống",
      "Cho ăn tăng trưởng",
      "Quản lý chất lượng nước",
      "Kích cỡ thương phẩm",
      "Thu hoạch",
    ],
    description: "Quy trình tiêu chuẩn cho ao nuôi cá tra thâm canh",
  },
  {
    id: "AQ-RO-PHI-STD",
    name: "Quy trình nuôi cá rô phi",
    species: "Cá rô phi",
    durationDays: 100,
    stages: [
      "Chuẩn bị ao",
      "Thả giống",
      "Cho ăn",
      "Theo dõi oxy",
      "Phòng bệnh",
      "Thu hoạch",
    ],
    description: "Chu kỳ nuôi cá rô phi theo hướng an toàn sinh học",
  },
];

export const getCyclesByAquacultureSpecies = (species: string) =>
  AQUACULTURE_GROWTH_CYCLES.filter((cycle) => cycle.species === species);
