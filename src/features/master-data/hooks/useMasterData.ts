import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "../api/master-data.api";
import type {
  MasterDataCatalog,
  MasterDataPageResponse,
  MasterDataQueryParams,
  MasterDataRecord,
} from "../types/master-data.type";

export const masterDataKeys = {
  all: (catalog: MasterDataCatalog) => ["master-data", catalog] as const,
  list: (catalog: MasterDataCatalog, params?: MasterDataQueryParams) =>
    ["master-data", catalog, "list", params ?? {}] as const,
  detail: (catalog: MasterDataCatalog, id: number | string) =>
    ["master-data", catalog, "detail", id] as const,
};

interface UseMasterDataOptions {
  params?: MasterDataQueryParams;
  enabled?: boolean;
}

export function useMasterData<C extends MasterDataCatalog>(
  catalog: C,
  { params, enabled = true }: UseMasterDataOptions = {},
) {
  const queryResult = useQuery<
    MasterDataPageResponse<MasterDataRecord<C>>,
    Error
  >({
    queryKey: masterDataKeys.list(catalog, params),
    queryFn: () => masterDataApi.list(catalog, params),
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

interface UseMasterDataByIdOptions {
  enabled?: boolean;
}

export function useMasterDataById<C extends MasterDataCatalog>(
  catalog: C,
  id: number | string,
  { enabled = true }: UseMasterDataByIdOptions = {},
) {
  return useQuery<MasterDataRecord<C>, Error>({
    queryKey: masterDataKeys.detail(catalog, id),
    queryFn: () => masterDataApi.getById(catalog, id),
    enabled: enabled && id !== null && id !== undefined && id !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
