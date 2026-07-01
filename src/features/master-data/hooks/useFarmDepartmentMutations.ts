import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmDepartmentApi } from "../api/farm-master-data.api";
import { farmDepartmentKeys } from "./useFarmDepartments";
import type {
  FarmDepartmentRequest,
  FarmDepartmentResponse,
} from "../types/farm-master-data.type";

export function useFarmDepartmentMutations(workspaceId?: number) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: farmDepartmentKeys.all() });

  const createDepartment = useMutation<
    FarmDepartmentResponse,
    Error,
    FarmDepartmentRequest
  >({
    mutationFn: (data) => farmDepartmentApi.create(data, workspaceId),
    onSuccess: invalidateList,
  });

  const updateDepartment = useMutation<
    FarmDepartmentResponse,
    Error,
    { id: number; data: FarmDepartmentRequest }
  >({
    mutationFn: ({ id, data }) => farmDepartmentApi.update(id, data, workspaceId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmDepartmentKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmDepartmentKeys.detail(id, workspaceId),
      });
    },
  });

  const deleteDepartment = useMutation<void, Error, number>({
    mutationFn: (id) => farmDepartmentApi.delete(id, workspaceId).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createDepartment, updateDepartment, deleteDepartment };
}
