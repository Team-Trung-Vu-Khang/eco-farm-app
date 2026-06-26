import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cropVarietyApi } from "../api/foundation.api";
import { cropVarietyKeys } from "./useCropVarieties";
import type {
  FoundationCropVarietyRequest,
  FoundationCropVarietyResponse,
} from "../types/foundation.type";

/**
 * Mutation hooks cho Foundation Crop Varieties.
 * Sau mỗi mutation thành công → tự động invalidate list crop varieties.
 *
 * @example
 * const { createCropVariety, updateCropVariety, deleteCropVariety } = useCropVarietyMutations();
 *
 * createCropVariety.mutate({ name: "Lúa ST25", cropId: 1 });
 * updateCropVariety.mutate({ id: 5, data: { name: "Lúa ST25 cải tiến" } });
 * deleteCropVariety.mutate(5);
 */
export function useCropVarietyMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: cropVarietyKeys.all() });

  const createCropVariety = useMutation<
    FoundationCropVarietyResponse,
    Error,
    FoundationCropVarietyRequest
  >({
    mutationFn: (data) => cropVarietyApi.create(data),
    onSuccess: invalidateList,
  });

  const updateCropVariety = useMutation<
    FoundationCropVarietyResponse,
    Error,
    { id: number; data: FoundationCropVarietyRequest }
  >({
    mutationFn: ({ id, data }) => cropVarietyApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cropVarietyKeys.all() });
      queryClient.invalidateQueries({ queryKey: cropVarietyKeys.detail(id) });
    },
  });

  const deleteCropVariety = useMutation<void, Error, number>({
    mutationFn: (id) => cropVarietyApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createCropVariety, updateCropVariety, deleteCropVariety };
}
