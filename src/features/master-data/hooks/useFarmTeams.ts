import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { farmTeamApi } from "../api/farm-master-data.api";
import type {
  FarmBaseQueryParams,
  FarmTeamResponse,
  FarmPageResponse,
} from "../types/farm-master-data.type";

export const farmTeamKeys = {
  all: () => ["farm-teams"] as const,
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    [...farmTeamKeys.all(), "list", params ?? {}, workspaceId] as const,
  detail: (id: number, workspaceId?: number) =>
    [...farmTeamKeys.all(), "detail", id, workspaceId] as const,
};

interface UseFarmTeamsOptions {
  params?: FarmBaseQueryParams;
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmTeams({
  params,
  workspaceId,
  enabled = true,
}: UseFarmTeamsOptions = {}) {
  const queryResult = useQuery<FarmPageResponse<FarmTeamResponse>, Error>({
    queryKey: farmTeamKeys.list(params, workspaceId),
    queryFn: () => farmTeamApi.list(params, workspaceId),
    enabled: enabled && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

interface UseFarmTeamByIdOptions {
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmTeamById(
  id: number,
  { workspaceId, enabled = true }: UseFarmTeamByIdOptions = {}
) {
  return useQuery<FarmTeamResponse, Error>({
    queryKey: farmTeamKeys.detail(id, workspaceId),
    queryFn: () => farmTeamApi.getById(id, workspaceId),
    enabled: enabled && !!id && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
