import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import { farmDailyDiaryKeys } from "./useFarmDailyDiaryEntries";
import type {
  CreateFarmDailyDiaryEntryRequest,
  FarmDailyDiaryEntryResponse,
  PageResponseFarmDailyDiaryEntryResponse,
} from "../types/farm-daily-diary.type";

function prependOrUpdateDailyDiaryListCache(
  queryClient: QueryClient,
  data: FarmDailyDiaryEntryResponse,
  workspaceId?: number | string | null,
) {
  const updateCacheFn = (
    oldData?: PageResponseFarmDailyDiaryEntryResponse,
  ): PageResponseFarmDailyDiaryEntryResponse => {
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

  queryClient.setQueriesData<PageResponseFarmDailyDiaryEntryResponse>(
    { queryKey: farmDailyDiaryKeys.all() },
    updateCacheFn,
  );

  const targetWsId = workspaceId ?? data.workspaceId;
  if (targetWsId !== undefined && targetWsId !== null && targetWsId !== "") {
    queryClient.setQueryData<PageResponseFarmDailyDiaryEntryResponse>(
      farmDailyDiaryKeys.list(targetWsId, { page: 0, size: 20 }),
      updateCacheFn,
    );
    queryClient.setQueryData<PageResponseFarmDailyDiaryEntryResponse>(
      farmDailyDiaryKeys.list(targetWsId, {}),
      updateCacheFn,
    );
    queryClient.setQueryData<PageResponseFarmDailyDiaryEntryResponse>(
      farmDailyDiaryKeys.list(targetWsId),
      updateCacheFn,
    );
  }
}

export function useCreateFarmDailyDiaryEntry() {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const { toast } = useToast();

  return useMutation<
    FarmDailyDiaryEntryResponse,
    Error,
    CreateFarmDailyDiaryEntryRequest
  >({
    mutationFn: (payload) => farmDailyDiaryApi.create(payload),
    onSuccess: (data) => {
      prependOrUpdateDailyDiaryListCache(queryClient, data, workspaceId);
      toast({
        title: "Tạo nhật ký thành công",
        description: `Mã nhật ký: ${data.code}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi ghi nhận nhật ký",
        description: error.message || "Không thể tạo nhật ký thường nhật",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFarmDailyDiaryEntry() {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const { toast } = useToast();

  return useMutation<
    FarmDailyDiaryEntryResponse,
    Error,
    { id: string; payload: CreateFarmDailyDiaryEntryRequest }
  >({
    mutationFn: ({ id, payload }) => farmDailyDiaryApi.update(id, payload),
    onSuccess: (data) => {
      prependOrUpdateDailyDiaryListCache(queryClient, data, workspaceId);
      queryClient.setQueryData(
        farmDailyDiaryKeys.detail(workspaceId, data.id),
        data,
      );
      toast({
        title: "Cập nhật nhật ký thành công",
        description: `Mã nhật ký: ${data.code}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi cập nhật nhật ký",
        description: error.message || "Không thể cập nhật nhật ký thường nhật",
        variant: "destructive",
      });
    },
  });
}
