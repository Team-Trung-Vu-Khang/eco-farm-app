import { apiClient } from "@/shared/lib/axios";
import type {
  CreateFarmDailyDiaryEntryRequest,
  FarmDailyDiaryEntryResponse,
  FarmDailyDiaryQueryParams,
  FarmDiaryQueryParams,
  FarmDailyDiaryStatsResponse,
  PageResponseFarmDailyDiaryEntryResponse,
  PhotoResponse,
} from "../types/farm-daily-diary.type";

import { FARM_ENDPOINTS, STORAGE_API_PATHS } from "@/shared/constants";

export const farmDailyDiaryApi = {
  list(params?: FarmDailyDiaryQueryParams) {
    return apiClient
      .get<PageResponseFarmDailyDiaryEntryResponse>(FARM_ENDPOINTS.dailyDiaryEntries, { params })
      .then((response) => response.data);
  },

  listGeneral(params: FarmDiaryQueryParams, workspaceId?: number | string) {
    return apiClient
      .get<PageResponseFarmDailyDiaryEntryResponse>(FARM_ENDPOINTS.diaryEntries, {
        params,
        headers: workspaceId ? { "X-Workspace-Id": String(workspaceId) } : undefined,
      })
      .then((response) => response.data);
  },

  getStats(params?: FarmDailyDiaryQueryParams) {
    return apiClient
      .get<FarmDailyDiaryStatsResponse>(`${FARM_ENDPOINTS.dailyDiaryEntries}/stats`, { params })
      .then((response) => response.data);
  },


  getById(id: string) {
    return apiClient
      .get<FarmDailyDiaryEntryResponse>(`${FARM_ENDPOINTS.dailyDiaryEntries}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateFarmDailyDiaryEntryRequest) {
    return apiClient
      .post<FarmDailyDiaryEntryResponse>(FARM_ENDPOINTS.dailyDiaryEntries, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: CreateFarmDailyDiaryEntryRequest) {
    return apiClient
      .put<FarmDailyDiaryEntryResponse>(`${FARM_ENDPOINTS.dailyDiaryEntries}/${id}`, payload)
      .then((response) => response.data);
  },

  uploadPhoto(file: File, generateThumbnail = true, workspaceId?: number | string | null) {
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {
      "Content-Type": "multipart/form-data",
    };
    if (workspaceId) {
      headers["X-Workspace-Id"] = String(workspaceId);
    }

    return apiClient
      .post<PhotoResponse>(STORAGE_API_PATHS.diaryPhotos, formData, {
        params: { generateThumbnail },
        headers,
      })
      .then((response) => response.data);
  },
};
