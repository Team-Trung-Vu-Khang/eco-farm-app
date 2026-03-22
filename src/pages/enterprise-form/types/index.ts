export interface EnterpriseType {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type CategoryType = "organization" | "business";

export type EnterpriseTypeFormData = Omit<EnterpriseType, "id" | "createdAt">;
