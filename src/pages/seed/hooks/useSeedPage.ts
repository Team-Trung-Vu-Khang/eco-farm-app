import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { supplierOptions } from "../data/mocks";
import type { FoundationStatus } from "@/features/foundation";
import {
  useSeedMutations,
  useSeeds,
  type FarmSeedResponse,
} from "@/features/farm";

export function useSeedPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [keyword, setKeyword] = useState<string>("");
  const [supplierOrganizationId, setSupplierOrganizationId] = useState<
    number | undefined
  >();
  const [status, setStatus] = useState<FoundationStatus | undefined>();

  const {
    items: seeds,
    loading,
    response,
  } = useSeeds({
    params: {
      page,
      size,
      keyword: keyword || undefined,
      supplierOrganizationId,
      status,
    },
  });

  const { deleteSeed } = useSeedMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FarmSeedResponse | null>(null);

  const tableFilters = [
    { key: "supplier", label: "Nhà cung cấp", options: supplierOptions },
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

  const handleAdd = () => setLocation("/seed/create");
  const handleEdit = (item: FarmSeedResponse) =>
    setLocation(`/seed/${item.id}/edit`);
  const handleView = (item: FarmSeedResponse) =>
    setLocation(`/seed/${item.id}`);

  const handleDelete = (item: FarmSeedResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteSeed.mutateAsync(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Xóa thất bại",
          variant: "destructive",
        });
      }
    }
    setDeleteOpen(false);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "supplier") {
      setSupplierOrganizationId(value ? Number(value) : undefined);
    } else if (key === "status") {
      setStatus(value as FoundationStatus);
    }
    setPage(0);
  };

  return {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleView,
    seeds,
    setDeleteOpen,
    tableFilters,
    loading,
    pageCount: response?.totalPages ?? 0,
    totalElements: response?.totalElements ?? 0,
    page,
    size,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
  };
}
