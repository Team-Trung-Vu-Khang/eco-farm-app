import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { farmPlanTaskDiaryApi } from "../api/farm-plan-task-diary.api";
import { farmPlanTaskDiaryKeys } from "./useFarmPlanTaskDiaryEntries";
import type {
  CreatePlanTaskDiaryEntryRequest,
  UpdatePlanTaskDiaryEntryRequest,
  PlanTaskDiaryEntryPageResponse,
  PlanTaskDiaryEntryResponse,
} from "../types/farm-plan-task-diary.type";

function prependOrUpdatePlanTaskDiaryListCache(
  queryClient: QueryClient,
  data: PlanTaskDiaryEntryResponse,
) {
  const updateCacheFn = (
    oldData?: PlanTaskDiaryEntryPageResponse,
  ): PlanTaskDiaryEntryPageResponse => {
    const existingContent = Array.isArray(oldData?.content)
      ? oldData.content
      : [];
    const existingIndex = existingContent.findIndex(
      (item) => String(item.id) === String(data.id),
    );
    const filteredContent = existingContent.filter(
      (item) => String(item.id) !== String(data.id),
    );

    if (!oldData) {
      return {
        content: [data],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      };
    }

    return {
      ...oldData,
      content: [data, ...filteredContent],
      totalElements:
        existingIndex === -1
          ? (oldData.totalElements ?? existingContent.length) + 1
          : oldData.totalElements,
    };
  };

  queryClient.setQueriesData<PlanTaskDiaryEntryPageResponse>(
    { queryKey: farmPlanTaskDiaryKeys.all },
    updateCacheFn,
  );

  queryClient.setQueryData<PlanTaskDiaryEntryPageResponse>(
    farmPlanTaskDiaryKeys.list({ page: 0, size: 20 }),
    updateCacheFn,
  );

  queryClient.setQueryData<PlanTaskDiaryEntryPageResponse>(
    farmPlanTaskDiaryKeys.list({}),
    updateCacheFn,
  );

  queryClient.setQueryData<PlanTaskDiaryEntryPageResponse>(
    farmPlanTaskDiaryKeys.list(),
    updateCacheFn,
  );
}

export function useCreateFarmPlanTaskDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlanTaskDiaryEntryRequest) =>
      farmPlanTaskDiaryApi.create(payload),
    onSuccess: (data) => {
      prependOrUpdatePlanTaskDiaryListCache(queryClient, data);
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
    onSuccess: (data, variables) => {
      prependOrUpdatePlanTaskDiaryListCache(queryClient, data);
      queryClient.setQueryData(
        farmPlanTaskDiaryKeys.detail(variables.id),
        data,
      );
    },
  });
}
