import { apiClient } from "@/shared/lib/axios";
import type {
  CreateFarmDailyDiaryEntryRequest,
  FarmDailyDiaryEntryResponse,
  FarmDailyDiaryQueryParams,
  FarmDailyDiaryStatsResponse,
  PageResponseFarmDailyDiaryEntryResponse,
  PhotoResponse,
} from "../types/farm-daily-diary.type";

const DAILY_DIARY_PATH = "/api/farm/daily-diary-entries" as const;
const DIARY_PHOTOS_PATH = "/api/storage/diary-photos" as const;

export const farmDailyDiaryApi = {
  list(params?: FarmDailyDiaryQueryParams) {
    return apiClient
      .get<PageResponseFarmDailyDiaryEntryResponse>(DAILY_DIARY_PATH, { params })
      .then((response) => response.data);
  },

  getStats(params?: FarmDailyDiaryQueryParams) {
    return apiClient
      .get<FarmDailyDiaryStatsResponse>(`${DAILY_DIARY_PATH}/stats`, { params })
      .then((response) => response.data);
  },


  getById(id: string) {
    return apiClient
      .get<FarmDailyDiaryEntryResponse>(`${DAILY_DIARY_PATH}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateFarmDailyDiaryEntryRequest) {
    return apiClient
      .post<FarmDailyDiaryEntryResponse>(DAILY_DIARY_PATH, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: CreateFarmDailyDiaryEntryRequest) {
    return apiClient
      .put<FarmDailyDiaryEntryResponse>(`${DAILY_DIARY_PATH}/${id}`, payload)
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
      .post<PhotoResponse>(DIARY_PHOTOS_PATH, formData, {
        params: { generateThumbnail },
        headers,
      })
      .then((response) => response.data);
  },
};
