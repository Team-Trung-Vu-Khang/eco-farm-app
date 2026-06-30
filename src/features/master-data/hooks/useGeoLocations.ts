import { useQuery } from "@tanstack/react-query";

import { masterDataApi } from "../api/master-data.api";
import type {
  MasterDataQueryParams,
  MasterDataPageResponse,
  ProvinceRecord,
  ProvinceWardRecord,
  ProvinceWardQueryParams,
} from "../types/master-data.type";

export const geoLocationKeys = {
  provinces: (params?: MasterDataQueryParams) =>
    ["geo-locations", "provinces", params ?? {}] as const,
  wards: (params: ProvinceWardQueryParams) =>
    ["geo-locations", "wards", params] as const,
};

interface UseGeoProvincesOptions {
  params?: MasterDataQueryParams;
  enabled?: boolean;
}

export function useGeoProvinces({
  params,
  enabled = true,
}: UseGeoProvincesOptions = {}) {
  const query = useQuery<MasterDataPageResponse<ProvinceRecord>, Error>({
    queryKey: geoLocationKeys.provinces(params),
    queryFn: () => masterDataApi.listGeoProvinces(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    items: query.data?.content ?? [],
    response: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  };
}

interface UseGeoWardsOptions {
  params: ProvinceWardQueryParams;
  enabled?: boolean;
}

export function useGeoWards({
  params,
  enabled = true,
}: UseGeoWardsOptions) {
  const query = useQuery<MasterDataPageResponse<ProvinceWardRecord>, Error>({
    queryKey: geoLocationKeys.wards(params),
    queryFn: () => masterDataApi.listGeoWards(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    items: query.data?.content ?? [],
    response: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  };
}
