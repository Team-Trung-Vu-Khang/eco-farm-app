import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { supplyConversionRuleApi } from "@/features/farm-supply";
import type {
  SupplyConversionRuleResponse,
  ConversionRuleSupplyType,
} from "../types/types";
import type { DomainCode } from "@/features/farm-supply";
import axios from "axios";

export function useUnitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // ─── Filter/pagination state ──────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [onlyOwner, setOnlyOwner] = useState(false);
  const [supplyType, setSupplyType] = useState<
    ConversionRuleSupplyType | undefined
  >(undefined);
  const [domainCode, setDomainCode] = useState<DomainCode | undefined>(
    undefined,
  );

  // ─── Delete state ─────────────────────────────────────────────────────────

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] =
    useState<SupplyConversionRuleResponse | null>(null);

  // ─── Query ────────────────────────────────────────────────────────────────

  const queryKey = [
    "supply-conversion-rules",
    "list",
    {
      keyword: search,
      domainCode,
      supplyType,
      page: currentIndex - 1,
      size: pageSize,
      onlyOwner,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      supplyConversionRuleApi.farmList({
        keyword: search.trim() || undefined,
        domainCode: domainCode || undefined,
        supplyType: supplyType || undefined,
        page: currentIndex - 1,
        size: pageSize,
        onlyOwner: onlyOwner || undefined,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ─── Delete mutation ──────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: (id: number) => supplyConversionRuleApi.farmDelete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["supply-conversion-rules"],
      });
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAdd = () => setLocation("/supply-conversion-rules/create");

  const handleEdit = (item: SupplyConversionRuleResponse) => {
    if (item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể chỉnh sửa quy tắc quy đổi hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setLocation(`/supply-conversion-rules/${item.id}/edit`);
  };

  const handleDelete = (item: SupplyConversionRuleResponse) => {
    if (item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể xóa quy tắc quy đổi hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteMutation.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa quy tắc quy đổi thành công.",
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

  const handleView = (item: SupplyConversionRuleResponse) => {
    toast({
      title: "Chi tiết quy tắc quy đổi",
      description: `1 ${item.fromSupplyItem.name} = ${item.quantity} ${item.toSupplyItem.name}`,
    });
  };

  const navigateToDetail = (id: number) => {
    const row = query.data?.content?.find((x) => x.id === id);
    if (row) {
      handleEdit(row);
    }
  };

  // ─── Return ───────────────────────────────────────────────────────────────

  return {
    rules: query.data?.content ?? [],
    loading: query.isLoading,
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,

    // Pagination & filters
    search,
    setSearch,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    onlyOwner,
    setOnlyOwner,
    supplyType,
    setSupplyType,
    domainCode,
    setDomainCode,

    // Delete
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleView,
    navigateToDetail,
  };
}
