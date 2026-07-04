import { useMutation, useQueryClient } from "@tanstack/react-query";
import { regionApi } from "../api/farm.api";
import { regionKeys } from "./useRegions";
import type { FarmRegionRequest, FarmRegionResponse } from "../types/farm.type";

export function useRegionMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: regionKeys.all() });

  const createRegion = useMutation<FarmRegionResponse, Error, FarmRegionRequest>({
    mutationFn: (data) => regionApi.create(data),
    onSuccess: invalidateList,
  });

  const updateRegion = useMutation<FarmRegionResponse, Error, { id: number; data: FarmRegionRequest }>({
    mutationFn: ({ id, data }) => regionApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all() });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(id) });
    },
  });

  const deleteRegion = useMutation<void, Error, number>({
    mutationFn: (id) => regionApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createRegion, updateRegion, deleteRegion };
}
