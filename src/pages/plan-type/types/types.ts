export type PlanTypeCategory =
  | "cultivation"
  | "processing"
  | "distribution"
  | "financial"
  | "other";

export interface PlanType {
  id: number;
  code: string;
  name: string;
  category: PlanTypeCategory;
  description: string;
  color: string;
  createdAt: string;
}

export interface PlanTypeFormData {
  code: string;
  name: string;
  category: PlanTypeCategory;
  description: string;
  color: string;
}
