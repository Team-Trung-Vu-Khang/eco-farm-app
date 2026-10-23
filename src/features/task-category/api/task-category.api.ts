import { apiClient } from "@/shared/lib/axios";
import type { PageResponse } from "@/features/foundation/types/foundation.type";
import type {
  TaskCategoryPageResponse,
  TaskCategoryRecord,
  CreateTaskCategoryRequest,
  UpdateTaskCategoryRequest,
  TaskCategoryLookupQueryParams,
  TaskCategoryLookupResponse,
} from "../types/task-category.type";

import { ADMIN_MASTER_DATA_PATHS, MASTER_DATA_PATHS } from "@/shared/constants";

export const taskCategoryApi = {
  search(params?: TaskCategoryLookupQueryParams) {
    return apiClient
      .get<PageResponse<TaskCategoryLookupResponse>>(MASTER_DATA_PATHS.taskCategories, {
        params,
      })
      .then((response) => response.data);
  },

  /** GET /api/admin/master-data/task-categories */
  listAdmin(params?: TaskCategoryLookupQueryParams) {
    return apiClient
      .get<TaskCategoryPageResponse>(ADMIN_MASTER_DATA_PATHS.taskCategories, { params })
      .then((response) => response.data);
  },

  /** GET /api/admin/master-data/task-categories/{id} */
  getAdminById(id: number | string) {
    return apiClient
      .get<TaskCategoryRecord>(`${ADMIN_MASTER_DATA_PATHS.taskCategories}/${id}`)
      .then((response) => response.data);
  },

  /** POST /api/admin/master-data/task-categories */
  createAdmin(payload: CreateTaskCategoryRequest) {
    return apiClient
      .post<TaskCategoryRecord>(ADMIN_MASTER_DATA_PATHS.taskCategories, payload)
      .then((response) => response.data);
  },

  /** PUT /api/admin/master-data/task-categories/{id} */
  updateAdmin(id: number | string, payload: UpdateTaskCategoryRequest) {
    return apiClient
      .put<TaskCategoryRecord>(
        `${ADMIN_MASTER_DATA_PATHS.taskCategories}/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  /** DELETE /api/admin/master-data/task-categories/{id} (204 No Content) */
  deleteAdmin(id: number | string): Promise<void> {
    return apiClient
      .delete(`${ADMIN_MASTER_DATA_PATHS.taskCategories}/${id}`)
      .then(() => undefined);
  },
};
