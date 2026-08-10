export interface TaskCategory {
  id: number;
  code?: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface TaskCategoryFormData {
  name: string;
  description: string;
  status?: "active" | "inactive";
}
