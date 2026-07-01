import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmPersonnelApi } from "../api/farm-master-data.api";
import { farmPersonnelKeys } from "./useFarmPersonnel";
import type {
  FarmPersonnelRequest,
  FarmPersonnelResponse,
} from "../types/farm-master-data.type";

export function useFarmPersonnelMutations(workspaceId?: number) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: farmPersonnelKeys.all() });

  const createPersonnel = useMutation<
    FarmPersonnelResponse,
    Error,
    FarmPersonnelRequest
  >({
    mutationFn: (data) => farmPersonnelApi.create(data, workspaceId),
    onSuccess: invalidateList,
  });

  const updatePersonnel = useMutation<
    FarmPersonnelResponse,
    Error,
    { id: number; data: FarmPersonnelRequest }
  >({
    mutationFn: ({ id, data }) => farmPersonnelApi.update(id, data, workspaceId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmPersonnelKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmPersonnelKeys.detail(id, workspaceId),
      });
    },
  });

  const deletePersonnel = useMutation<void, Error, number>({
    mutationFn: (id) => farmPersonnelApi.delete(id, workspaceId).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createPersonnel, updatePersonnel, deletePersonnel };
}
