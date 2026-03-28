export type UnitType =
  | "mass"
  | "volume"
  | "length"
  | "quantity"
  | "time"
  | "area"
  | "other";

export type UnitStatus = "active" | "inactive";

export interface Unit {
  id: number;
  code: string;
  name: string;
  description: string;
  status: UnitStatus;
  createdAt: string;
  type: UnitType;
  isBaseUnit: boolean;
  baseUnitId?: number;
  conversionFactor: number;
}

export interface UnitStandard {
  value: string;
  label: string;
  factor: number;
}

export interface UnitFormData {
  code: string;
  name: string;
  description: string;
  status: UnitStatus;
  type: UnitType;
  conversionFactor: string | number;
}
