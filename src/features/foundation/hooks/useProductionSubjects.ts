import { useQuery } from "@tanstack/react-query";
import { productionSubjectApi, productionSubjectVariantApi } from "../api/foundation.api";
import type {
  ProductionSubjectQueryParams,
  ProductionSubjectResponse,
  ProductionSubjectVariantQueryParams,
  ProductionSubjectVariantResponse,
  PageResponse,
} from "../types/foundation.type";

export const productionSubjectKeys = {
  all: () => ["foundation", "production-subjects"] as const,
  list: (params?: ProductionSubjectQueryParams) =>
    ["foundation", "production-subjects", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "production-subjects", "detail", id] as const,
};

export const productionSubjectVariantKeys = {
  all: () => ["foundation", "production-subject-variants"] as const,
  list: (params?: ProductionSubjectVariantQueryParams) =>
    ["foundation", "production-subject-variants", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "production-subject-variants", "detail", id] as const,
};

export function useProductionSubjects({
  params,
  enabled = true,
}: {
  params?: ProductionSubjectQueryParams;
  enabled?: boolean;
} = {}) {
  const queryResult = useQuery<PageResponse<ProductionSubjectResponse>, Error>({
    queryKey: productionSubjectKeys.list(params),
    queryFn: () => productionSubjectApi.list(params),
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

export function useProductionSubjectById(
  id: number,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<ProductionSubjectResponse, Error>({
    queryKey: productionSubjectKeys.detail(id),
    queryFn: () => productionSubjectApi.getById(id),
    enabled: enabled && !!id,
  });
}

export function useProductionSubjectVariants({
  params,
  enabled = true,
}: {
  params?: ProductionSubjectVariantQueryParams;
  enabled?: boolean;
} = {}) {
  const queryResult = useQuery<
    PageResponse<ProductionSubjectVariantResponse>,
    Error
  >({
    queryKey: productionSubjectVariantKeys.list(params),
    queryFn: () => productionSubjectVariantApi.list(params),
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

export function useProductionSubjectVariantById(
  id: number,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<ProductionSubjectVariantResponse, Error>({
    queryKey: productionSubjectVariantKeys.detail(id),
    queryFn: () => productionSubjectVariantApi.getById(id),
    enabled: enabled && !!id,
  });
}
