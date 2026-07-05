import { useQuery } from "@tanstack/react-query";
import { farmPersonnelApi } from "../api/farm-master-data.api";
import type {
  FarmPersonnelQueryParams,
  FarmPersonnelResponse,
  FarmPageResponse,
} from "../types/farm-master-data.type";

export const farmPersonnelKeys = {
  all: () => ["farm-personnel"] as const,
  list: (params?: FarmPersonnelQueryParams, workspaceId?: number) =>
    [...farmPersonnelKeys.all(), "list", params ?? {}, workspaceId] as const,
  detail: (id: number, workspaceId?: number) =>
    [...farmPersonnelKeys.all(), "detail", id, workspaceId] as const,
};

interface UseFarmPersonnelOptions {
  params?: FarmPersonnelQueryParams;
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmPersonnel({
  params,
  workspaceId,
  enabled = true,
}: UseFarmPersonnelOptions = {}) {
  const queryResult = useQuery<FarmPageResponse<FarmPersonnelResponse>, Error>({
    queryKey: farmPersonnelKeys.list(params, workspaceId),
    queryFn: () => farmPersonnelApi.list(params, workspaceId),
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

interface UseFarmPersonnelByIdOptions {
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmPersonnelById(
  id: number,
  { workspaceId, enabled = true }: UseFarmPersonnelByIdOptions = {},
) {
  return useQuery<FarmPersonnelResponse, Error>({
    queryKey: farmPersonnelKeys.detail(id, workspaceId),
    queryFn: () => farmPersonnelApi.getById(id, workspaceId),
    enabled: enabled && !!id && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
