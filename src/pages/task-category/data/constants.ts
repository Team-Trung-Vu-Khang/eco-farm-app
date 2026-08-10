import type { TaskCategory, TaskCategoryFormData } from "../types/types";

export const emptyTaskCategoryFormData: TaskCategoryFormData = {
  name: "",
  description: "",
};

export const mockTaskCategories: TaskCategory[] = [
  {
    id: 1,
    code: "CV001",
    name: "Làm đất",
    description: "Cày xới, san phẳng đất trước khi gieo trồng",
    status: "active",
    createdAt: "2026-01-05",
  },
  {
    id: 2,
    code: "CV002",
    name: "Gieo trồng",
    description: "Gieo hạt hoặc trồng cây con xuống đất",
    status: "active",
    createdAt: "2026-01-08",
  },
  {
    id: 3,
    code: "CV003",
    name: "Tưới nước",
    description: "Cung cấp nước tưới định kỳ cho cây trồng",
    status: "active",
    createdAt: "2026-01-12",
  },
  {
    id: 4,
    code: "CV004",
    name: "Bón phân",
    description: "Bổ sung dinh dưỡng cho đất và cây trồng",
    status: "inactive",
    createdAt: "2026-01-15",
  },
  {
    id: 5,
    code: "CV005",
    name: "Thu hoạch",
    description: "Thu hoạch nông sản khi đến kỳ",
    status: "active",
    createdAt: "2026-01-20",
  },
];
