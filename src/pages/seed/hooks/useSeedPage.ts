import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { type FoundationStatus, useCatalog } from "@/features/foundation";
import {
  useSeedMutations,
  useSeeds,
  type FarmSeedResponse,
} from "@/features/farm";
import { useOrganizations } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useMemo } from "react";

export function useSeedPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [keyword, setKeyword] = useState<string>("");
  const [supplierOrganizationId, setSupplierOrganizationId] = useState<
    number | undefined
  >();
  const [farmingMethodId, setFarmingMethodId] = useState<number | undefined>();
  const [status, setStatus] = useState<FoundationStatus | undefined>();

  // Fetch real organizations to build supplier filter options
  const { items: orgList } = useOrganizations(
    { page: 0, size: 100 },
    workspaceId ?? "missing",
    { enabled: workspaceId !== null },
  );

  const supplierOptions = useMemo(() => {
    return orgList.map((org) => ({
      label: org.name,
      value: String(org.id),
    }));
  }, [orgList]);

  // Fetch real farming methods for filtering
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: { status: "active", page: 0, size: 100 },
  });

  const farmingMethodOptions = useMemo(() => {
    return farmingMethods.map((m) => ({
      label: m.name,
      value: String(m.id),
    }));
  }, [farmingMethods]);

  const {
    items: seeds,
    loading,
    response,
  } = useSeeds({
    params: {
      size,
      keyword: keyword || undefined,
      supplierOrganizationId,
      farmingMethodId,
      status,
      page: Math.max(page - 1, 0),
    },
  });

  const { deleteSeed } = useSeedMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FarmSeedResponse | null>(null);

  const tableFilters = useMemo(() => {
    return [
      { key: "supplier", label: "Nhà cung cấp", options: supplierOptions },
      {
        key: "farmingMethod",
        label: "Phương pháp canh tác",
        options: farmingMethodOptions,
      },
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
  }, [supplierOptions, farmingMethodOptions]);

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
    console.log("handlePageChange", newPage);

    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "supplier") {
      setSupplierOrganizationId(
        value && value !== "all" ? Number(value) : undefined,
      );
    } else if (key === "farmingMethod") {
      setFarmingMethodId(value && value !== "all" ? Number(value) : undefined);
    } else if (key === "status") {
      setStatus(
        value && value !== "all" ? (value as FoundationStatus) : undefined,
      );
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
