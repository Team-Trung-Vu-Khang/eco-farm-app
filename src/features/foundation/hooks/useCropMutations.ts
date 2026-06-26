import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cropApi } from "../api/foundation.api";
import { cropKeys } from "./useCrops";
import type {
  FoundationCropRequest,
  FoundationCropResponse,
} from "../types/foundation.type";

/**
 * Mutation hooks cho Foundation Crops.
 * Sau mỗi mutation thành công → tự động invalidate list crops.
 *
 * @example
 * const { createCrop, updateCrop, deleteCrop } = useCropMutations();
 *
 * createCrop.mutate({ name: "Lúa", cropGroupId: 1, status: "active" });
 * updateCrop.mutate({ id: 3, data: { name: "Lúa nếp" } });
 * deleteCrop.mutate(3);
 */
export function useCropMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: cropKeys.all() });

  const createCrop = useMutation<
    FoundationCropResponse,
    Error,
    FoundationCropRequest
  >({
    mutationFn: (data) => cropApi.create(data),
    onSuccess: invalidateList,
  });

  const updateCrop = useMutation<
    FoundationCropResponse,
    Error,
    { id: number; data: FoundationCropRequest }
  >({
    mutationFn: ({ id, data }) => cropApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cropKeys.all() });
      queryClient.invalidateQueries({ queryKey: cropKeys.detail(id) });
    },
  });

  const deleteCrop = useMutation<void, Error, number>({
    mutationFn: (id) => cropApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createCrop, updateCrop, deleteCrop };
}
