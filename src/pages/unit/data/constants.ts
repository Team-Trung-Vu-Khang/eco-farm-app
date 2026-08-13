import type { Unit, UnitFormData, UnitStandard, UnitType } from "../types/types";

export const TYPE_LABELS: Record<UnitType, string> = {
  mass: "Khối lượng",
  volume: "Thể tích",
  length: "Độ dài",
  area: "Diện tích",
  quantity: "Số lượng",
  time: "Thời gian",
  other: "Khác",
};

export const UNIT_TYPE_OPTIONS = [
  { value: "mass", label: "Khối lượng (Weight)" },
  { value: "volume", label: "Thể tích (Volume)" },
  { value: "length", label: "Độ dài (Length)" },
  { value: "area", label: "Diện tích (Area)" },
  { value: "quantity", label: "Số lượng (Quantity)" },
  { value: "time", label: "Thời gian (Time)" },
  { value: "other", label: "Khác (Other)" },
] as const satisfies ReadonlyArray<{ value: UnitType; label: string }>;

export const UNIT_STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
] as const;

export const emptyUnitFormData: UnitFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
  type: "mass",
  conversionFactor: 1,
};

export const initialUnits: Unit[] = [
  {
    id: 1,
    createdAt: "2024-01-01",
    sourceMaterialId: 1,
    targetMaterialId: 2,
    conversionFactor: 10,
  },
  {
    id: 2,
    createdAt: "2024-01-02",
    sourceMaterialId: 3,
    targetMaterialId: 2,
    conversionFactor: 5,
  },
];

export const UNIT_STANDARDS: Record<UnitType, UnitStandard[]> = {
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
