import { useQuery } from "@tanstack/react-query";
import { productionMethodApi } from "../api/foundation.api";
import type {
  ProductionMethodQueryParams,
  ProductionMethodResponse,
  PageResponse,
} from "../types/foundation.type";

export const productionMethodKeys = {
  all: ["foundation", "production-methods"] as const,
  list: (params?: ProductionMethodQueryParams) =>
    ["foundation", "production-methods", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "production-methods", "detail", id] as const,
};

export function useProductionMethods(
  params?: ProductionMethodQueryParams,
  enabled: boolean = true,
) {
  const queryResult = useQuery<PageResponse<ProductionMethodResponse>, Error>({
    queryKey: productionMethodKeys.list(params),
    queryFn: () => productionMethodApi.list(params),
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

export function useProductionMethodById(id: number, enabled: boolean = true) {
  return useQuery<ProductionMethodResponse, Error>({
    queryKey: productionMethodKeys.detail(id),
    queryFn: () => productionMethodApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
