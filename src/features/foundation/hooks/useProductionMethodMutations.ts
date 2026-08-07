import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productionMethodApi } from "../api/foundation.api";
import { productionMethodKeys } from "./useProductionMethods";
import type {
  ProductionMethodRequest,
  ProductionMethodResponse,
} from "../types/foundation.type";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function useProductionMethodMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation<
    ProductionMethodResponse,
    Error,
    ProductionMethodRequest
  >({
    mutationFn: (data) => productionMethodApi.create(data),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Thêm mới phương pháp sản xuất thành công",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: productionMethodKeys.all });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Đã có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation<
    ProductionMethodResponse,
    Error,
    { id: number; data: ProductionMethodRequest }
  >({
    mutationFn: ({ id, data }) => productionMethodApi.update(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Thành công",
        description: "Cập nhật phương pháp sản xuất thành công",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: productionMethodKeys.all });
      queryClient.invalidateQueries({
        queryKey: productionMethodKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Đã có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => productionMethodApi.delete(id),
    onSuccess: (_, id) => {
      toast({
        title: "Thành công",
        description: "Xóa phương pháp sản xuất thành công",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: productionMethodKeys.all });
      queryClient.removeQueries({
        queryKey: productionMethodKeys.detail(id),
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Đã có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
