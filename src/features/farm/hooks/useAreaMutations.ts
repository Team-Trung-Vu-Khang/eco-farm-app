import { useMutation, useQueryClient } from "@tanstack/react-query";
import { areaApi } from "../api/farm.api";
import { areaKeys } from "./useAreas";
import type { FarmAreaRequest, FarmAreaResponse } from "../types/farm.type";

export function useAreaMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: areaKeys.all() });

  const createArea = useMutation<
    FarmAreaResponse,
    Error,
    { regionId: number; data: FarmAreaRequest }
  >({
    mutationFn: ({ regionId, data }) => areaApi.create(regionId, data),
    onSuccess: invalidateList,
  });

  const updateArea = useMutation<FarmAreaResponse, Error, { id: number; data: FarmAreaRequest }>({
    mutationFn: ({ id, data }) => areaApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: areaKeys.all() });
      queryClient.invalidateQueries({ queryKey: areaKeys.detail(id) });
    },
  });

  const deleteArea = useMutation<void, Error, number>({
    mutationFn: (id) => areaApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createArea, updateArea, deleteArea };
}
