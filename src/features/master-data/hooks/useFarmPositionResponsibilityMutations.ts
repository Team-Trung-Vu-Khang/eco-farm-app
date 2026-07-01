import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmPositionResponsibilityApi } from "../api/farm-master-data.api";
import { farmPositionResponsibilityKeys } from "./useFarmPositionResponsibilities";
import type {
  FarmPositionResponsibilityRequest,
  FarmPositionResponsibilityResponse,
} from "../types/farm-master-data.type";

export function useFarmPositionResponsibilityMutations(positionId: number) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({
      queryKey: farmPositionResponsibilityKeys.all(positionId),
    });

  const createResponsibility = useMutation<
    FarmPositionResponsibilityResponse,
    Error,
    FarmPositionResponsibilityRequest
  >({
    mutationFn: (data) => farmPositionResponsibilityApi.create(positionId, data),
    onSuccess: invalidateList,
  });

  const updateResponsibility = useMutation<
    FarmPositionResponsibilityResponse,
    Error,
    { id: number; data: FarmPositionResponsibilityRequest }
  >({
    mutationFn: ({ id, data }) =>
      farmPositionResponsibilityApi.update(positionId, id, data),
    onSuccess: invalidateList,
  });

  const deleteResponsibility = useMutation<void, Error, number>({
    mutationFn: (id) =>
      farmPositionResponsibilityApi.delete(positionId, id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createResponsibility, updateResponsibility, deleteResponsibility };
}
