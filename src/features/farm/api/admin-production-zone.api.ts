import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants/farm.constants";
import type {
  FarmAdminProductionZoneFilter,
  FarmAdminProductionZoneGroupsResponse,
  PageResponseFarmAdminProductionZoneItem,
} from "../types/admin-production-zone.type";

const cleanFilterParams = (
  filter?: FarmAdminProductionZoneFilter & {
    page?: number;
    size?: number;
    workspaceId?: number;
  },
) => {
  if (!filter) return {};
  const cleaned: Record<string, any> = {};

  Object.entries(filter).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;
    if (Array.isArray(val)) {
      if (val.length > 0) {
        cleaned[key] = val.join(",");
      }
    } else {
      cleaned[key] = val;
    }
  });

  return cleaned;
};

export const adminProductionZoneApi = {
  getGroups: async (
    filter?: FarmAdminProductionZoneFilter,
    page = 0,
    size = 100,
  ): Promise<FarmAdminProductionZoneGroupsResponse> => {
    const params = cleanFilterParams({
      domainCode: "CROP",
      ...filter,
      page,
      size,
    });

    const response = await apiClient.get<FarmAdminProductionZoneGroupsResponse>(
      FARM_ENDPOINTS.adminProductionZoneGroups,
      {
        params,
        headers: {
          skipWorkspaceHeader: "true",
        },
      },
    );
    return response.data;
  },

  getWorkspaceZones: async (
    workspaceId: number,
    filter?: FarmAdminProductionZoneFilter,
    page = 0,
    size = 20,
  ): Promise<PageResponseFarmAdminProductionZoneItem> => {
    const params = cleanFilterParams({
      domainCode: "CROP",
      ...filter,
      workspaceId,
      page,
      size,
    });

    const response =
      await apiClient.get<PageResponseFarmAdminProductionZoneItem>(
        FARM_ENDPOINTS.adminProductionZones,
        {
          params,
          headers: {
            skipWorkspaceHeader: "true",
          },
        },
      );
    return response.data;
  },
};
