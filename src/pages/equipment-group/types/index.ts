export interface EquipmentGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type EquipmentGroupFormData = Omit<EquipmentGroup, "id" | "createdAt">;
