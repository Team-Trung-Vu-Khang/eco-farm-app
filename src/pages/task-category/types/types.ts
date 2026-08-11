export type TaskCategoryDomain = "crop" | "animal" | "aquaculture";

export interface TaskCategory {
  id: number;
  code?: string;
  name: string;
  description: string;
  domain: TaskCategoryDomain;
  status: "active" | "inactive";
  createdAt: string;
}

export interface TaskCategoryFormData {
  name: string;
  description: string;
  domain: TaskCategoryDomain;
  status?: "active" | "inactive";
}
