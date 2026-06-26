import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmingMethodCropApi } from "../api/foundation.api";
import { farmingMethodCropKeys } from "./useFarmingMethodCrops";
import type {
  FarmingMethodCropRequest,
  FarmingMethodCropResponse,
} from "../types/foundation.type";

/**
 * Mutation hooks cho Foundation Farming Method Crops.
 * Sau mỗi mutation thành công → tự động invalidate list farming-method-crops.
 *
 * @example
 * const { createFarmingMethodCrop, updateFarmingMethodCrop, deleteFarmingMethodCrop } = useFarmingMethodCropMutations();
 *
 * createFarmingMethodCrop.mutate({ farmingMethodId: 1, crops: [{ cropId: 2, varietyIds: [5, 6] }] });
 * updateFarmingMethodCrop.mutate({ id: 3, data: { status: "inactive" } });
 * deleteFarmingMethodCrop.mutate(3);
 */
export function useFarmingMethodCropMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: farmingMethodCropKeys.all() });

  const createFarmingMethodCrop = useMutation<
    FarmingMethodCropResponse,
    Error,
    FarmingMethodCropRequest
  >({
    mutationFn: (data) => farmingMethodCropApi.create(data),
    onSuccess: invalidateList,
  });

  const updateFarmingMethodCrop = useMutation<
    FarmingMethodCropResponse,
    Error,
    { id: number; data: FarmingMethodCropRequest }
  >({
    mutationFn: ({ id, data }) => farmingMethodCropApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmingMethodCropKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmingMethodCropKeys.detail(id),
      });
    },
  });

  const deleteFarmingMethodCrop = useMutation<void, Error, number>({
    mutationFn: (id) =>
      farmingMethodCropApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return {
    createFarmingMethodCrop,
    updateFarmingMethodCrop,
    deleteFarmingMethodCrop,
  };
}
