import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import type { FoundationCropResponse } from "../../../features/foundation";
import { useCropMutations, useCrops } from "../../../features/foundation";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useCropFoundationPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
  ];

  const [, setLocation] = useLocation();

  const {
    items: cropFoundations,
    response,
    loading,
    error,
  } = useCrops({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
      domainCode: "CROP",
    },
  });
  const { deleteCrop } = useCropMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FoundationCropResponse | null>(
    null,
  );

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleDelete = (item: FoundationCropResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: FoundationCropResponse) => {
    setLocation(`/crop-foundation/${item.id}`);
  };

  const handleEdit = (item: FoundationCropResponse) => {
    setLocation(`/crop-foundation/${item.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCrop.mutate(deleteItem.id, {
        onSuccess: () => {
          toast({ title: "Thành công", description: "Đã xóa cây trồng" });
          setDeleteOpen(false);
          setDeleteItem(null);
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err.message,
          });
          setDeleteOpen(false);
        },
      });
    }
  };

  return {
    cropFoundations,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    loading,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
    filters,
    handleFilterChange,
    isPending: deleteCrop.isPending,
  };
}
