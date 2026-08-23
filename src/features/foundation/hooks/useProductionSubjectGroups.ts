import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productionSubjectGroupApi } from "../api/foundation.api";
import type {
  ProductionSubjectGroupQueryParams,
  ProductionSubjectGroupResponse,
  ProductionSubjectGroupRequest,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const subjectGroupKeys = {
  all: () => ["foundation", "subject-groups"] as const,
  list: (params?: ProductionSubjectGroupQueryParams) =>
    ["foundation", "subject-groups", "list", params ?? {}] as const,
  detail: (id: number) => ["foundation", "subject-groups", "detail", id] as const,
};

// ─── useProductionSubjectGroups ────────────────────────────────────────────────

interface UseProductionSubjectGroupsOptions {
  params: ProductionSubjectGroupQueryParams;
  enabled?: boolean;
}

type UseProductionSubjectGroupsResult = ReturnType<
  typeof useQuery<PageResponse<ProductionSubjectGroupResponse>, Error>
>;

export function useProductionSubjectGroups({
  params,
  enabled = true,
}: UseProductionSubjectGroupsOptions) {
  const queryResult: UseProductionSubjectGroupsResult = useQuery<
    PageResponse<ProductionSubjectGroupResponse>,
    Error
  >({
    queryKey: subjectGroupKeys.list(params),
    queryFn: () => productionSubjectGroupApi.list(params),
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

// ─── useProductionSubjectGroupMutations ────────────────────────────────────────

export function useProductionSubjectGroupMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: subjectGroupKeys.all() });

  const createSubjectGroup = useMutation<
    ProductionSubjectGroupResponse,
    Error,
    ProductionSubjectGroupRequest
  >({
    mutationFn: (data) => productionSubjectGroupApi.create(data),
    onSuccess: invalidateList,
  });

  const updateSubjectGroup = useMutation<
    ProductionSubjectGroupResponse,
    Error,
    { id: number; data: ProductionSubjectGroupRequest }
  >({
    mutationFn: ({ id, data }) => productionSubjectGroupApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: subjectGroupKeys.all() });
      queryClient.invalidateQueries({ queryKey: subjectGroupKeys.detail(id) });
    },
  });

  const deleteSubjectGroup = useMutation<void, Error, number>({
    mutationFn: (id) => productionSubjectGroupApi.delete(id),
    onSuccess: invalidateList,
  });

  return { createSubjectGroup, updateSubjectGroup, deleteSubjectGroup };
}
