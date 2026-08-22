import { apiClient } from "@/shared/lib/axios";
import type { PageResponse } from "@/features/foundation/types/foundation.type";
import type {
  TaskCategoryPageResponse,
  TaskCategoryRecord,
  CreateTaskCategoryRequest,
  UpdateTaskCategoryRequest,
  TaskCategoryLookupQueryParams,
  TaskCategoryLookupResponse,
  TaskCategoryStageQueryParams,
  TaskCategoryStageResponse,
} from "../types/task-category.type";

const TASK_CATEGORY_PATH = "/api/master-data/task-categories" as const;
const ADMIN_TASK_CATEGORY_PATH =
  "/api/admin/master-data/task-categories" as const;

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
      .get<PageResponse<TaskCategoryLookupResponse>>(TASK_CATEGORY_PATH, {
        params,
      })
      .then((response) => response.data);
  },

  /** GET /api/admin/master-data/task-categories */
  listAdmin(params?: TaskCategoryLookupQueryParams) {
    return apiClient
      .get<TaskCategoryPageResponse>(ADMIN_TASK_CATEGORY_PATH, { params })
      .then((response) => response.data);
  },

  /**
   * GET /api/admin/master-data/task-categories/stages
   * Returns distinct stage names for the selected domain.
   */
  listAdminStages(params: TaskCategoryStageQueryParams = { domainCode: "CROP" }) {
    return apiClient
      .get<TaskCategoryStageResponse[]>(
        `${ADMIN_TASK_CATEGORY_PATH}/stages`,
        { params },
      )
      .then((response) => response.data);
  },

  /** GET /api/admin/master-data/task-categories/{id} */
  getAdminById(id: number | string) {
    return apiClient
      .get<TaskCategoryRecord>(`${ADMIN_TASK_CATEGORY_PATH}/${id}`)
      .then((response) => response.data);
  },

  /** POST /api/admin/master-data/task-categories */
  createAdmin(payload: CreateTaskCategoryRequest) {
    return apiClient
      .post<TaskCategoryRecord>(ADMIN_TASK_CATEGORY_PATH, payload)
      .then((response) => response.data);
  },

  /** PUT /api/admin/master-data/task-categories/{id} */
  updateAdmin(id: number | string, payload: UpdateTaskCategoryRequest) {
    return apiClient
      .put<TaskCategoryRecord>(
        `${ADMIN_TASK_CATEGORY_PATH}/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  /** DELETE /api/admin/master-data/task-categories/{id} (204 No Content) */
  deleteAdmin(id: number | string): Promise<void> {
    return apiClient
      .delete(`${ADMIN_TASK_CATEGORY_PATH}/${id}`)
      .then(() => undefined);
  },
};
