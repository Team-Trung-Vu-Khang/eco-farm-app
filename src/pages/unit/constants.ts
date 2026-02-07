export interface Unit {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  // New fields for standardization
  type: "mass" | "volume" | "length" | "quantity" | "time" | "area" | "other";
  isBaseUnit: boolean;
  baseUnitId?: number; // ID of the base unit if this is a derived unit
  conversionFactor: number; // 1 [This Unit] = conversionFactor [Base Unit]
}

export const initialUnits: Unit[] = [
  // Mass
  {
    id: 1,
    code: "U001",
    name: "Kilogam (kg)",
    description: "Đơn vị đo khối lượng chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "mass",
    isBaseUnit: true,
    conversionFactor: 1,
  },
  {
    id: 2,
    code: "U002",
    name: "Gam (g)",
    description: "Đơn vị đo khối lượng nhỏ",
    status: "active",
    createdAt: "2024-01-01",
    type: "mass",
    isBaseUnit: false,
    baseUnitId: 1,
    conversionFactor: 0.001,
  },
  {
    id: 3,
    code: "U003",
    name: "Tấn",
    description: "Đơn vị đo khối lượng lớn",
    status: "active",
    createdAt: "2024-01-01",
    type: "mass",
    isBaseUnit: false,
    baseUnitId: 1,
    conversionFactor: 1000,
  },
  // Volume
  {
    id: 10,
    code: "U010",
    name: "Lít (l)",
    description: "Đơn vị đo thể tích chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "volume",
    isBaseUnit: true,
    conversionFactor: 1,
  },
  {
    id: 11,
    code: "U011",
    name: "Mililit (ml)",
    description: "Đơn vị đo thể tích nhỏ",
    status: "active",
    createdAt: "2024-01-01",
    type: "volume",
    isBaseUnit: false,
    baseUnitId: 10,
    conversionFactor: 0.001,
  },
  // Packaging (Derived)
  {
    id: 20,
    code: "U020",
    name: "Bao 25kg",
    description: "Bao phân bón tiêu chuẩn 25kg",
    status: "active",
    createdAt: "2024-01-05",
    type: "mass",
    isBaseUnit: false,
    baseUnitId: 1, // kg
    conversionFactor: 25,
  },
  {
    id: 21,
    code: "U021",
    name: "Bao 50kg",
    description: "Bao phân bón tiêu chuẩn 50kg",
    status: "active",
    createdAt: "2024-01-05",
    type: "mass",
    isBaseUnit: false,
    baseUnitId: 1, // kg
    conversionFactor: 50,
  },
  {
    id: 22,
    code: "U022",
    name: "Chai 500ml",
    description: "Chai thuốc BVTV 500ml",
    status: "active",
    createdAt: "2024-01-05",
    type: "volume",
    isBaseUnit: false,
    baseUnitId: 10, // Lit
    conversionFactor: 0.5,
  },
  {
    id: 23,
    code: "U023",
    name: "Thùng 20L",
    description: "Thùng chứa chất lỏng 20 lít",
    status: "active",
    createdAt: "2024-01-05",
    type: "volume",
    isBaseUnit: false,
    baseUnitId: 10, // Lit
    conversionFactor: 20,
  },
  // Length
  {
    id: 30,
    code: "U030",
    name: "Mét (m)",
    description: "Đơn vị đo độ dài chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "length",
    isBaseUnit: true,
    conversionFactor: 1,
  },
];
