import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedApi } from "../api/farm.api";
import { seedKeys } from "./useSeeds";
import type { FarmSeedRequest, FarmSeedResponse } from "../types/farm.type";

/**
 * Mutation hooks cho Farm Seeds.
 * Sau mỗi mutation thành công → tự động invalidate list seeds.
 *
 * @example
 * const { createSeed, updateSeed, deleteSeed } = useSeedMutations();
 *
 * createSeed.mutate({ cropVarietyId: 1, supplierOrganizationId: 1, status: "active" });
 * updateSeed.mutate({ id: 3, data: { status: "inactive" } });
 * deleteSeed.mutate(3);
 */
export function useSeedMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: seedKeys.all() });

  const createSeed = useMutation<FarmSeedResponse, Error, FarmSeedRequest>({
    mutationFn: (data) => seedApi.create(data),
    onSuccess: invalidateList,
  });

  const updateSeed = useMutation<
    FarmSeedResponse,
    Error,
    { id: number; data: FarmSeedRequest }
  >({
    mutationFn: ({ id, data }) => seedApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: seedKeys.all() });
      queryClient.invalidateQueries({ queryKey: seedKeys.detail(id) });
    },
  });

  const deleteSeed = useMutation<void, Error, number>({
    mutationFn: (id) => seedApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createSeed, updateSeed, deleteSeed };
}
