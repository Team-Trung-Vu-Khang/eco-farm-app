import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plantIdentificationApi } from "../api/farm.api";
import { plantKeys } from "./usePlantIdentifications";
import type { FarmPlantIdentificationRequest, FarmPlantIdentificationResponse } from "../types/farm.type";

/**
 * Mutation hooks cho Farm Plant Identifications.
 */
export function usePlantIdentificationMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: plantKeys.all() });

  const createPlant = useMutation<
    FarmPlantIdentificationResponse,
    Error,
    FarmPlantIdentificationRequest
  >({
    mutationFn: (data) => plantIdentificationApi.create(data),
    onSuccess: invalidateList,
  });

  const updatePlant = useMutation<
    FarmPlantIdentificationResponse,
    Error,
    { id: number; data: FarmPlantIdentificationRequest }
  >({
    mutationFn: ({ id, data }) => plantIdentificationApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all() });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(id) });
    },
  });

  const deletePlant = useMutation<void, Error, number>({
    mutationFn: (id) => plantIdentificationApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createPlant, updatePlant, deletePlant };
}
