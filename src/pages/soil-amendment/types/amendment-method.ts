export type MethodType = "chemical" | "biological" | "mechanical" | "cultural";
export type DifficultyLevel = "dễ" | "trung bình" | "khó";
export type CostLevel = "thấp" | "trung bình" | "cao";
export type MethodStatus = "active" | "inactive";

export interface AmendmentMethod {
  id: string;
  code: string;
  name: string;
  type: MethodType;
  target: string;
  description: string;
  implementation: string;
  difficulty: DifficultyLevel;
  cost: CostLevel;
  status: MethodStatus;
}

export type AmendmentMethodFormData = Partial<AmendmentMethod>;
