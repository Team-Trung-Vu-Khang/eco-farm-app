import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmSupplyApi } from "../api/farm-supply.api";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  SupplyType,
  DomainCode,
  MasterDataStatus,
  SupplyItemResponse,
} from "../types";

export function getSupplyBasePath(
  type: SupplyType,
  domainCode: DomainCode,
): string {
  const domainPrefix =
    domainCode === "CROP"
      ? "/cultivation-material"
      : domainCode === "LIVESTOCK"
        ? "/animal-husbandry-material"
        : "/aquaculture-material";

  const typeSuffix =
    type === "medicine"
      ? "/pesticide"
      : type === "fertilizer"
        ? "/fertilizer"
        : type === "material"
          ? "/material"
          : "/equipment";

  return `${domainPrefix}${typeSuffix}`;
}

export function useFarmSupplyListHook(
  type: SupplyType,
  domainCode: DomainCode,
) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MasterDataStatus>("active");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [onlyOwner, setOnlyOwner] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<SupplyItemResponse | null>(null);

  const basePath = getSupplyBasePath(type, domainCode);

  const query = useQuery({
    queryKey: [
      "farm-supplies",
      "list",
      type,
      {
        domainCode,
        keyword: search,
        status,
        page: currentIndex - 1,
        size: pageSize,
        onlyOwner,
      },
    ],
    queryFn: () =>
      farmSupplyApi.list(type, {
        domainCode,
        keyword: search.trim() || undefined,
        status: status || undefined,
        page: currentIndex - 1,
        size: pageSize,
        onlyOwner,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => farmSupplyApi.delete(type, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["farm-supplies", "list"],
      });
    },
  });

  const handleAdd = () => {
    setLocation(`${basePath}/create`);
  };

  const handleEdit = (item: SupplyItemResponse) => {
    if (item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể chỉnh sửa vật tư hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setLocation(`${basePath}/${item.id}/edit`);
  };

  const handleDelete = (item: SupplyItemResponse) => {
    if (item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể xóa vật tư hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: SupplyItemResponse) => {
    setLocation(`${basePath}/${item.id}?source=${item.source}`);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteMutation.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa thành công vật tư.",
        });
      } catch (e: any) {
        toast({
          title: "Lỗi",
          description: e.message || "Xóa không thành công",
          variant: "destructive",
        });
      }
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    items: query.data?.content ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,

    search,
    setSearch,
    status,
    setStatus,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    onlyOwner,
    setOnlyOwner,

    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
    handleConfirmDelete,
    navigateToDetail: (id: number) => {
      // Find row in cache to determine source
      const row = query.data?.content?.find((x) => x.id === id);
      const src = row?.source ?? "OWNER";
      setLocation(`${basePath}/${id}?source=${src}`);
    },
  };
}
