import { useQuery } from "@tanstack/react-query";
import { farmPositionApi } from "../api/farm-master-data.api";
import type {
  FarmBaseQueryParams,
  FarmPositionResponse,
  PositionOptionResponse,
  FarmPageResponse,
} from "../types/farm-master-data.type";

export const farmPositionKeys = {
  all: () => ["farm-positions"] as const,
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    [...farmPositionKeys.all(), "list", params ?? {}, workspaceId] as const,
  detail: (id: number, workspaceId?: number) =>
    [...farmPositionKeys.all(), "detail", id, workspaceId] as const,
  options: (params?: { page?: number; size?: number }, workspaceId?: number) =>
    [...farmPositionKeys.all(), "options", params ?? {}, workspaceId] as const,
};

interface UseFarmPositionsOptions {
  params?: FarmBaseQueryParams;
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmPositions({
  params,
  workspaceId,
  enabled = true,
}: UseFarmPositionsOptions = {}) {
  const queryResult = useQuery<FarmPageResponse<FarmPositionResponse>, Error>({
    queryKey: farmPositionKeys.list(params, workspaceId),
    queryFn: () => farmPositionApi.list(params, workspaceId),
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

interface UseFarmPositionByIdOptions {
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmPositionById(
  id: number,
  { workspaceId, enabled = true }: UseFarmPositionByIdOptions = {},
) {
  return useQuery<FarmPositionResponse, Error>({
    queryKey: farmPositionKeys.detail(id, workspaceId),
    queryFn: () => farmPositionApi.getById(id, workspaceId),
    enabled: enabled && !!id && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFarmPositionOptions({
  params,
  workspaceId,
  enabled = true,
}: {
  params?: { page?: number; size?: number };
  workspaceId?: number;
  enabled?: boolean;
} = {}) {
  const queryResult = useQuery<FarmPageResponse<PositionOptionResponse>, Error>(
    {
      queryKey: farmPositionKeys.options(params, workspaceId),
      queryFn: () => farmPositionApi.options(params, workspaceId),
      enabled: enabled && workspaceId !== undefined,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
