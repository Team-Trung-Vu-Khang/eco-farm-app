import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmPositionApi } from "../api/farm-master-data.api";
import { farmPositionKeys } from "./useFarmPositions";
import type {
  FarmPositionRequest,
  FarmPositionResponse,
} from "../types/farm-master-data.type";

export function useFarmPositionMutations(workspaceId?: number) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: farmPositionKeys.all() });

  const createPosition = useMutation<
    FarmPositionResponse,
    Error,
    FarmPositionRequest
  >({
    mutationFn: (data) => farmPositionApi.create(data, workspaceId),
    onSuccess: invalidateList,
  });

  const updatePosition = useMutation<
    FarmPositionResponse,
    Error,
    { id: number; data: FarmPositionRequest }
  >({
    mutationFn: ({ id, data }) => farmPositionApi.update(id, data, workspaceId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmPositionKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmPositionKeys.detail(id, workspaceId),
      });
    },
  });

  const deletePosition = useMutation<void, Error, number>({
    mutationFn: (id) => farmPositionApi.delete(id, workspaceId).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createPosition, updatePosition, deletePosition };
}
