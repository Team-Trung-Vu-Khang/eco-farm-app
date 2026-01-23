export interface Unit {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const initialUnits: Unit[] = [
  {
    id: 1,
    code: "DVT001",
    name: "Kilogam (kg)",
    description: "Đơn vị đo khối lượng cơ bản",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    code: "DVT002",
    name: "Lít (l)",
    description: "Đơn vị đo thể tích chất lỏng",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    code: "DVT003",
    name: "Mét (m)",
    description: "Đơn vị đo độ dài",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: 4,
    code: "DVT004",
    name: "Bao",
    description: "Đơn vị đóng gói (thường 25kg hoặc 50kg)",
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    code: "DVT005",
    name: "Chai",
    description: "Đơn vị đóng gói chất lỏng",
    status: "active",
    createdAt: "2024-01-05",
  },
];
