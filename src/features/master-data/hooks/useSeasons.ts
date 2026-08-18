import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { masterDataApi } from "../api/master-data.api";
import type {
  MasterDataQueryParams,
  MasterDataSeasonRequest,
  MasterDataSeasonResponse,
} from "../types/master-data.type";

export const seasonKeys = {
  all: () => ["master-data", "seasons"] as const,
  list: (params?: MasterDataQueryParams) =>
    ["master-data", "seasons", "list", params ?? {}] as const,
  detail: (id: number | string) =>
    ["master-data", "seasons", "detail", id] as const,
};

interface UseSeasonsOptions {
  params?: MasterDataQueryParams;
  enabled?: boolean;
}

interface UseSeasonByIdOptions {
  enabled?: boolean;
}

export function useSeasons(
  { params, enabled = true }: UseSeasonsOptions = {},
) {
  return useQuery({
    queryKey: seasonKeys.list(params),
    queryFn: () => masterDataApi.listSeasons(params),
    enabled,
    placeholderData: (prev) => prev,
  });
}

export function useSeasonById(
  id: number | string,
  { enabled = true }: UseSeasonByIdOptions = {},
) {
  return useQuery({
    queryKey: seasonKeys.detail(id),
    queryFn: () => masterDataApi.getSeasonById(id),
    enabled,
  });
}

export function useSeasonMutations() {
  const queryClient = useQueryClient();

  const createSeason = useMutation<
    MasterDataSeasonResponse,
    Error,
    MasterDataSeasonRequest
  >({
    mutationFn: (data) => masterDataApi.createSeason(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: seasonKeys.all(),
      });
    },
  });

  const updateSeason = useMutation<
    MasterDataSeasonResponse,
    Error,
    { id: number | string; data: MasterDataSeasonRequest }
  >({
    mutationFn: ({ id, data }) => masterDataApi.updateSeason(id, data),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: seasonKeys.all(),
      });
      await queryClient.invalidateQueries({
        queryKey: seasonKeys.detail(id),
      });
    },
  });

  const deleteSeason = useMutation<void, Error, number | string>({
    mutationFn: (id) => masterDataApi.deleteSeason(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: seasonKeys.all(),
      });
    },
  });

  return { createSeason, updateSeason, deleteSeason };
}
