import { useQuery } from "@tanstack/react-query";
import { farmPlanApi, farmWorkflowApi } from "../api/farm-workflow.api";
import type {
  FarmPlanPageResponse,
  FarmPlanQueryParams,
  FarmPlanResponse,
  FarmWorkflowPageResponse,
  FarmWorkflowQueryParams,
  FarmWorkflowResponse,
  FarmWorkflowStatsQueryParams,
  FarmWorkflowStatsResponse,
} from "../types/farm-workflow.type";

export const farmWorkflowKeys = {
  all: () => ["farm-workflows"] as const,
  list: (params?: FarmWorkflowQueryParams) =>
    [...farmWorkflowKeys.all(), "list", params ?? {}] as const,
  detail: (id: number | string) =>
    [...farmWorkflowKeys.all(), "detail", id] as const,
  stats: (params?: FarmWorkflowStatsQueryParams) =>
    [...farmWorkflowKeys.all(), "stats", params ?? {}] as const,
  plans: (
    workflowId: number | string,
    params?: Omit<FarmPlanQueryParams, "workflowId">,
  ) => [...farmWorkflowKeys.all(), "plans", workflowId, params ?? {}] as const,
};

export const farmPlanKeys = {
  all: () => ["farm-plans"] as const,
  list: (params?: FarmPlanQueryParams) =>
    [...farmPlanKeys.all(), "list", params ?? {}] as const,
  detail: (
    id: number | string,
    params?: Pick<FarmPlanQueryParams, "includeAdHocStages">,
  ) => [...farmPlanKeys.all(), "detail", id, params ?? {}] as const,
};

interface UseFarmWorkflowsOptions {
  params?: FarmWorkflowQueryParams;
  enabled?: boolean;
}

export function useFarmWorkflows({
  params,
  enabled = true,
}: UseFarmWorkflowsOptions = {}) {
  const queryResult = useQuery<FarmWorkflowPageResponse, Error>({
    queryKey: farmWorkflowKeys.list(params),
    queryFn: () => farmWorkflowApi.list(params),
    enabled,
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

interface UseFarmWorkflowByIdOptions {
  enabled?: boolean;
}

export function useFarmWorkflowById(
  id: number | string,
  { enabled = true }: UseFarmWorkflowByIdOptions = {},
) {
  return useQuery<FarmWorkflowResponse, Error>({
    queryKey: farmWorkflowKeys.detail(id),
    queryFn: () => farmWorkflowApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

interface UseFarmWorkflowStatsOptions {
  params?: FarmWorkflowStatsQueryParams;
  enabled?: boolean;
}

export function useFarmWorkflowStats({
  params,
  enabled = true,
}: UseFarmWorkflowStatsOptions = {}) {
  return useQuery<FarmWorkflowStatsResponse, Error>({
    queryKey: farmWorkflowKeys.stats(params),
    queryFn: () => farmWorkflowApi.stats(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

interface UseFarmWorkflowPlansOptions {
  params?: Omit<FarmPlanQueryParams, "workflowId">;
  enabled?: boolean;
}

export function useFarmWorkflowPlans(
  workflowId: number | string,
  { params, enabled = true }: UseFarmWorkflowPlansOptions = {},
) {
  const queryResult = useQuery<FarmPlanPageResponse, Error>({
    queryKey: farmWorkflowKeys.plans(workflowId, params),
    queryFn: () => farmWorkflowApi.listPlans(workflowId, params),
    enabled: enabled && !!workflowId,
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

interface UseFarmPlansOptions {
  params?: FarmPlanQueryParams;
  enabled?: boolean;
}

export function useFarmPlans({
  params,
  enabled = true,
}: UseFarmPlansOptions = {}) {
  const queryResult = useQuery<FarmPlanPageResponse, Error>({
    queryKey: farmPlanKeys.list(params),
    queryFn: () => farmPlanApi.list(params),
    enabled,
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

interface UseFarmPlanByIdOptions {
  enabled?: boolean;
  includeAdHocStages?: boolean;
}

export function useFarmPlanById(
  id: number | string,
  { enabled = true, includeAdHocStages }: UseFarmPlanByIdOptions = {},
) {
  const params = includeAdHocStages ? { includeAdHocStages } : undefined;

  return useQuery<FarmPlanResponse, Error>({
    queryKey: farmPlanKeys.detail(id, params),
    queryFn: () => farmPlanApi.getById(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
