import { useQuery } from "@tanstack/react-query";
import { legalIdentificationApi } from "../api/legal-identification.api";
import type {
  LegalIdentificationPageResponse,
  LegalIdentificationQueryParams,
  LegalIdentificationResponse,
} from "../types/legal-identification.type";

export const legalIdentificationKeys = {
  all: ["legal-identifications"] as const,
  list: (params?: LegalIdentificationQueryParams) =>
    ["legal-identifications", "list", params ?? {}] as const,
  detail: (id: number | string) =>
    ["legal-identifications", "detail", id] as const,
};

interface UseLegalIdentificationsOptions {
  params?: LegalIdentificationQueryParams;
  enabled?: boolean;
}

export function useLegalIdentifications({
  params,
  enabled = true,
}: UseLegalIdentificationsOptions = {}) {
  const queryResult = useQuery<
    LegalIdentificationPageResponse,
    Error
  >({
    queryKey: legalIdentificationKeys.list(params),
    queryFn: () => legalIdentificationApi.list(params),
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

interface UseLegalIdentificationByIdOptions {
  enabled?: boolean;
}

export function useLegalIdentificationById(
  id: number | string | null | undefined,
  { enabled = true }: UseLegalIdentificationByIdOptions = {},
) {
  const queryResult = useQuery<LegalIdentificationResponse, Error>({
    queryKey: legalIdentificationKeys.detail(id ?? "missing"),
    queryFn: () => {
      if (id === null || id === undefined || id === "") {
        throw new Error("Missing legal identification id");
      }

      return legalIdentificationApi.getById(id);
    },
    enabled: enabled && id !== null && id !== undefined && id !== "",
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
