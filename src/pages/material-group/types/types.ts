export interface MaterialGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface MaterialGroupFormData {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}
