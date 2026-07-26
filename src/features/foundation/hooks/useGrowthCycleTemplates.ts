import { useQuery } from "@tanstack/react-query";
import { growthCycleTemplateApi } from "../api/foundation.api";
import { farmGrowthCycleSeasonApi, systemGrowthCycleSeasonApi } from "../../farm/api/growth-cycle-season.api";
import type {
  GrowthCycleTemplateQueryParams,
  FoundationGrowthCycleTemplateResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Legacy/Admin Foundation Growth Cycle Templates ────────────────────────────

export const growthCycleTemplateKeys = {
  all: () => ["foundation", "growth-cycle-templates"] as const,
  list: (params?: GrowthCycleTemplateQueryParams) =>
    ["foundation", "growth-cycle-templates", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "growth-cycle-templates", "detail", id] as const,
};

export function useGrowthCycleTemplates({
  params,
  enabled = true,
}: UseGrowthCycleTemplatesOptions = {}) {
  const queryResult = useQuery<
    PageResponse<FoundationGrowthCycleTemplateResponse>,
    Error
  >({
    queryKey: growthCycleTemplateKeys.list(params),
    queryFn: () => growthCycleTemplateApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

interface UseGrowthCycleTemplatesOptions {
  params?: GrowthCycleTemplateQueryParams;
  enabled?: boolean;
}

export function useGrowthCycleTemplateById(
  id: number,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<FoundationGrowthCycleTemplateResponse, Error>({
    queryKey: growthCycleTemplateKeys.detail(id),
    queryFn: () => growthCycleTemplateApi.getById(id),
    enabled: enabled && !!id,
  });
}

// ─── New User & System Seasons (Growth Cycles) ──────────────────────────────────

export const userGrowthCycleTemplateKeys = {
  all: () => ["user-growth-cycles"] as const,
  list: (params?: any) => ["user-growth-cycles", "list", params ?? {}] as const,
  detail: (id: number) => ["user-growth-cycles", "detail", id] as const,
};

export const systemGrowthCycleTemplateKeys = {
  all: () => ["system-growth-cycles"] as const,
  list: (params?: any) => ["system-growth-cycles", "list", params ?? {}] as const,
  detail: (id: number) => ["system-growth-cycles", "detail", id] as const,
};

export function useUserGrowthCycleTemplates({ params, enabled = true }: { params?: any; enabled?: boolean } = {}) {
  const queryResult = useQuery<PageResponse<any>, Error>({
    queryKey: userGrowthCycleTemplateKeys.list(params),
    queryFn: () => farmGrowthCycleSeasonApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

export function useSystemGrowthCycleTemplates({ params, enabled = true }: { params?: any; enabled?: boolean } = {}) {
  const queryResult = useQuery<PageResponse<any>, Error>({
    queryKey: systemGrowthCycleTemplateKeys.list(params),
    queryFn: () => systemGrowthCycleSeasonApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

export function useUserGrowthCycleTemplateById(id: number, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<any, Error>({
    queryKey: userGrowthCycleTemplateKeys.detail(id),
    queryFn: () => farmGrowthCycleSeasonApi.getById(id),
    enabled: enabled && !!id,
  });
}

export function useSystemGrowthCycleTemplateById(id: number, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<any, Error>({
    queryKey: systemGrowthCycleTemplateKeys.detail(id),
    queryFn: () => systemGrowthCycleSeasonApi.getById(id),
    enabled: enabled && !!id,
  });
}
