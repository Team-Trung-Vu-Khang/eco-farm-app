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
  // Area
  {
    id: 40,
    code: "U040",
    name: "Mét vuông (m²)",
    description: "Đơn vị đo diện tích chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "area",
    isBaseUnit: true,
    conversionFactor: 1,
  },
  // Time
  {
    id: 50,
    code: "U050",
    name: "Giây (s)",
    description: "Đơn vị đo thời gian chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "time",
    isBaseUnit: true,
    conversionFactor: 1,
  },
  // Quantity
  {
    id: 60,
    code: "U060",
    name: "Cái/Chiếc",
    description: "Đơn vị đo số lượng chuẩn",
    status: "active",
    createdAt: "2024-01-01",
    type: "quantity",
    isBaseUnit: true,
    conversionFactor: 1,
  },
  // Other
  {
    id: 70,
    code: "U070",
    name: "Khác",
    description: "Đơn vị khác",
    status: "active",
    createdAt: "2024-01-01",
    type: "other",
    isBaseUnit: true,
    conversionFactor: 1,
  },
];

export interface UnitStandard {
  value: string;
  label: string;
  factor: number; // Factor relative to the Canonical Base (e.g. kg, l, m)
}

export const UNIT_STANDARDS: Record<string, UnitStandard[]> = {
  mass: [
    { value: "ton", label: "Tấn (Ton)", factor: 1000 },
    { value: "kg", label: "Kilogam (kg)", factor: 1 },
    { value: "g", label: "Gam (g)", factor: 0.001 },
    { value: "mg", label: "Miligam (mg)", factor: 0.000001 },
  ],
  volume: [
    { value: "m3", label: "Mét khối (m³)", factor: 1000 },
    { value: "l", label: "Lít (l)", factor: 1 },
    { value: "ml", label: "Mililit (ml)", factor: 0.001 },
  ],
  length: [
    { value: "km", label: "Kilomet (km)", factor: 1000 },
    { value: "m", label: "Mét (m)", factor: 1 },
    { value: "cm", label: "Centimet (cm)", factor: 0.01 },
    { value: "mm", label: "Milimet (mm)", factor: 0.001 },
  ],
  area: [
    { value: "ha", label: "Hecta (ha)", factor: 10000 },
    { value: "m2", label: "Mét vuông (m²)", factor: 1 },
  ],
  time: [
    { value: "day", label: "Ngày", factor: 86400 },
    { value: "hour", label: "Giờ", factor: 3600 },
    { value: "minute", label: "Phút", factor: 60 },
    { value: "second", label: "Giây", factor: 1 },
  ],
  quantity: [{ value: "unit", label: "Cái/Chiếc", factor: 1 }],
  other: [{ value: "other", label: "Khác", factor: 1 }],
};
