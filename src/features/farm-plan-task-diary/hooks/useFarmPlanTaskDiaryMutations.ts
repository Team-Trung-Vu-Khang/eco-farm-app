import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmPlanTaskDiaryApi } from "../api/farm-plan-task-diary.api";
import { farmPlanTaskDiaryKeys } from "./useFarmPlanTaskDiaryEntries";
import type {
  CreatePlanTaskDiaryEntryRequest,
  UpdatePlanTaskDiaryEntryRequest,
} from "../types/farm-plan-task-diary.type";

export function useCreateFarmPlanTaskDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlanTaskDiaryEntryRequest) =>
      farmPlanTaskDiaryApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: farmPlanTaskDiaryKeys.all });
    },
  });
}

export function useUpdateFarmPlanTaskDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: UpdatePlanTaskDiaryEntryRequest;
    }) => farmPlanTaskDiaryApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: farmPlanTaskDiaryKeys.all });
      queryClient.invalidateQueries({
        queryKey: farmPlanTaskDiaryKeys.detail(variables.id),
      });
    },
  });
}
