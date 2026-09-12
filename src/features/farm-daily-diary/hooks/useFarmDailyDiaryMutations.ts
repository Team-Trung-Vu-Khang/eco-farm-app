import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import { farmDailyDiaryKeys } from "./useFarmDailyDiaryEntries";
import type {
  CreateFarmDailyDiaryEntryRequest,
  FarmDailyDiaryEntryResponse,
} from "../types/farm-daily-diary.type";

export function useCreateFarmDailyDiaryEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    FarmDailyDiaryEntryResponse,
    Error,
    CreateFarmDailyDiaryEntryRequest
  >({
    mutationFn: (payload) => farmDailyDiaryApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: farmDailyDiaryKeys.all(),
      });
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
      queryClient.invalidateQueries({
        queryKey: farmDailyDiaryKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: farmDailyDiaryKeys.detail(workspaceId, data.id),
      });
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
