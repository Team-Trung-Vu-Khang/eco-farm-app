export interface EnterpriseGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type EnterpriseGroupFormData = Omit<EnterpriseGroup, "id" | "createdAt">;
