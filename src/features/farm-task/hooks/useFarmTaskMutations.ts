import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmTaskApi } from "../api/farm-task.api";
import { farmTaskKeys } from "./useFarmTasks";
import type {
  FarmTaskBulkCreateRequest,
  FarmTaskRequest,
  FarmTaskResponse,
} from "../types/farm-task.type";

interface UseCreateFarmTaskOptions {
  onSuccess?: (data: FarmTaskResponse, variables: FarmTaskRequest) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateFarmTask({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateFarmTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<FarmTaskResponse, Error, FarmTaskRequest>({
    mutationFn: (payload) => farmTaskApi.create(payload),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: farmTaskKeys.all() });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createFarmTask: mutation.mutateAsync,
  };
}

interface UseBulkCreateFarmTasksOptions {
  onSuccess?: (data: FarmTaskResponse[], variables: FarmTaskBulkCreateRequest) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useBulkCreateFarmTasks({
  onSuccess,
  onError,
  invalidateList = true,
}: UseBulkCreateFarmTasksOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    FarmTaskResponse[],
    Error,
    FarmTaskBulkCreateRequest
  >({
    mutationFn: (payload) => farmTaskApi.bulkCreate(payload),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: farmTaskKeys.all() });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    bulkCreateFarmTasks: mutation.mutateAsync,
  };
}

interface UseUpdateFarmTaskOptions {
  onSuccess?: (
    data: FarmTaskResponse,
    variables: { id: number | string; payload: FarmTaskRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateFarmTask({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateFarmTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    FarmTaskResponse,
    Error,
    { id: number | string; payload: FarmTaskRequest }
  >({
    mutationFn: ({ id, payload }) => farmTaskApi.update(id, payload),
    onSuccess: async (data, variables) => {
      if (invalidateList || invalidateDetail) {
        await queryClient.invalidateQueries({ queryKey: farmTaskKeys.all() });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateFarmTask: mutation.mutateAsync,
  };
}

interface UseDeleteFarmTaskOptions {
  onSuccess?: (data: void, variables: number | string) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useDeleteFarmTask({
  onSuccess,
  onError,
  invalidateList = true,
}: UseDeleteFarmTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number | string>({
    mutationFn: (id) => farmTaskApi.delete(id).then(() => undefined),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: farmTaskKeys.all() });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteFarmTask: mutation.mutateAsync,
  };
}
