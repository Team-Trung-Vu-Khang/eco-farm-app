import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmTaskApi } from "../api/farm-task.api";
import type {
  FarmTaskPageResponse,
  FarmTaskQueryParams,
  FarmTaskResponse,
  FarmTaskStatsQueryParams,
  FarmTaskStatsResponse,
} from "../types/farm-task.type";

export const farmTaskKeys = {
  all: () => ["farm-tasks"] as const,
  list: (workspaceId: number | string | null | undefined, params?: FarmTaskQueryParams) =>
    [...farmTaskKeys.all(), "list", workspaceId ?? "missing", params ?? {}] as const,
  detail: (workspaceId: number | string | null | undefined, id: number | string) =>
    [...farmTaskKeys.all(), "detail", workspaceId ?? "missing", id] as const,
  stats: (
    workspaceId: number | string | null | undefined,
    params?: FarmTaskStatsQueryParams,
  ) => [...farmTaskKeys.all(), "stats", workspaceId ?? "missing", params ?? {}] as const,
};

interface UseFarmTasksOptions {
  params?: FarmTaskQueryParams;
  enabled?: boolean;
}

export function useFarmTasks({
  params,
  enabled = true,
}: UseFarmTasksOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<FarmTaskPageResponse, Error>({
    queryKey: farmTaskKeys.list(workspaceId, params),
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for farm tasks");
      }

      return farmTaskApi.list(params);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
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

interface UseFarmTaskByIdOptions {
  enabled?: boolean;
}

export function useFarmTaskById(
  id: number | string | null | undefined,
  { enabled = true }: UseFarmTaskByIdOptions = {},
) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<FarmTaskResponse, Error>({
    queryKey: farmTaskKeys.detail(workspaceId, id ?? "missing"),
    queryFn: () => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === "" ||
        id === null ||
        id === undefined ||
        id === ""
      ) {
        throw new Error("Missing farm task id or workspace id");
      }

      return farmTaskApi.getById(id);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "" &&
      id !== null &&
      id !== undefined &&
      id !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    item: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

interface UseFarmTaskStatsOptions {
  params?: FarmTaskStatsQueryParams;
  enabled?: boolean;
}

export function useFarmTaskStats({
  params,
  enabled = true,
}: UseFarmTaskStatsOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<FarmTaskStatsResponse, Error>({
    queryKey: farmTaskKeys.stats(workspaceId, params),
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for farm task stats");
      }

      return farmTaskApi.stats(params);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    item: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
