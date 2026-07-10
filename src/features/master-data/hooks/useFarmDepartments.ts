import { useQuery } from "@tanstack/react-query";
import { farmDepartmentApi } from "../api/farm-master-data.api";
import type {
  DepartmentOptionResponse,
  FarmBaseQueryParams,
  FarmDepartmentResponse,
  MasterDepartmentResponse,
  FarmPageResponse,
} from "../types/farm-master-data.type";

export const farmDepartmentKeys = {
  all: () => ["farm-departments"] as const,
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    [...farmDepartmentKeys.all(), "list", params ?? {}, workspaceId] as const,
  detail: (id: number, workspaceId?: number) =>
    [...farmDepartmentKeys.all(), "detail", id, workspaceId] as const,
  options: (params?: { page?: number; size?: number }, workspaceId?: number) =>
    [
      ...farmDepartmentKeys.all(),
      "options",
      params ?? {},
      workspaceId,
    ] as const,
  masterData: (params?: { used?: boolean; page?: number; size?: number }, workspaceId?: number) =>
    [
      ...farmDepartmentKeys.all(),
      "masterData",
      params ?? {},
      workspaceId,
    ] as const,
};

interface UseFarmDepartmentsOptions {
  params?: FarmBaseQueryParams;
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmDepartments({
  params,
  workspaceId,
  enabled = true,
}: UseFarmDepartmentsOptions = {}) {
  const queryResult = useQuery<FarmPageResponse<FarmDepartmentResponse>, Error>(
    {
      queryKey: farmDepartmentKeys.list(params, workspaceId),
      queryFn: () => farmDepartmentApi.list(params, workspaceId),
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

interface UseFarmDepartmentByIdOptions {
  workspaceId?: number;
  enabled?: boolean;
}

export function useFarmDepartmentById(
  id: number,
  { workspaceId, enabled = true }: UseFarmDepartmentByIdOptions = {},
) {
  return useQuery<FarmDepartmentResponse, Error>({
    queryKey: farmDepartmentKeys.detail(id, workspaceId),
    queryFn: () => farmDepartmentApi.getById(id, workspaceId),
    enabled: enabled && !!id && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFarmDepartmentOptions({
  params,
  workspaceId,
  enabled = true,
}: {
  params?: { page?: number; size?: number };
  workspaceId?: number;
  enabled?: boolean;
} = {}) {
  const queryResult = useQuery<
    FarmPageResponse<DepartmentOptionResponse>,
    Error
  >({
    queryKey: farmDepartmentKeys.options(params, workspaceId),
    queryFn: () => farmDepartmentApi.options(params, workspaceId),
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

export function useFarmDepartmentsMasterData({
  params,
  workspaceId,
  enabled = true,
}: {
  params?: { used?: boolean; page?: number; size?: number };
  workspaceId?: number;
  enabled?: boolean;
} = {}) {
  const queryResult = useQuery<
    FarmPageResponse<MasterDepartmentResponse>,
    Error
  >({
    queryKey: farmDepartmentKeys.masterData(params, workspaceId),
    queryFn: () => farmDepartmentApi.masterData(params, workspaceId),
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
