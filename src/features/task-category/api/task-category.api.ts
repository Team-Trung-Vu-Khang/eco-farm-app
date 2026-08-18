import { apiClient } from "@/shared/lib/axios";
import type {
  TaskCategoryLookupQueryParams,
  TaskCategoryLookupResponse,
  TaskCategoryStageQueryParams,
  TaskCategoryStageResponse,
} from "../types/task-category.type";

const TASK_CATEGORY_PATH = "/api/master-data/task-categories" as const;

export const taskCategoryApi = {
  listStages(params?: TaskCategoryStageQueryParams) {
    return apiClient
      .get<TaskCategoryStageResponse[]>(`${TASK_CATEGORY_PATH}/stages`, {
        params,
      })
      .then((response) => response.data);
  },

  search(params?: TaskCategoryLookupQueryParams) {
    return apiClient
      .get<TaskCategoryLookupResponse[]>(TASK_CATEGORY_PATH, { params })
      .then((response) => response.data);
  },
};
