import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type { MasterDataStatus, PesticideOriginRecord } from "@/features/master-data/types/master-data.type";
import type { PesticideOriginFormValues } from "../data/pesticide-origin-form.schema";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type PesticideOriginStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildPayload(values: PesticideOriginFormValues) {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    displayOrder: 1,
    status: values.status,
    metadataJson: {
      source: "manual",
    },
  };
}

export function usePesticideOriginPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PesticideOriginStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideOriginRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideOriginRecord | null>(
    null,
  );

  const query = useMasterData("pesticide-origins", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("pesticide-origins");

  const data = useMemo(() => query.items, [query.items]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === ALL_STATUS ? ALL_STATUS : (value as MasterDataStatus));
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditItem(null);
    }
  };

  const handleEdit = (item: PesticideOriginRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideOriginRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: PesticideOriginFormValues) => {
    const payload = buildPayload(values);

    if (!payload.code || !payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên nguồn gốc.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editItem) {
        await updateMasterData.mutateAsync({
          id: editItem.id,
          data: payload,
        });
      } else {
        await createMasterData.mutateAsync(payload);
      }

      toast({
        title: "Thành công",
        description: editItem
          ? "Đã cập nhật nguồn gốc."
          : "Đã thêm nguồn gốc mới.",
      });
      handleFormOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: editItem ? "Không thể cập nhật" : "Không thể thêm",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteMasterData.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa nguồn gốc.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: "Không thể xóa",
        description: message,
        variant: "destructive",
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    loading: query.loading,
    error: query.error,
    response: query.response,
    search,
    status,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen: handleFormOpenChange,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  };
}
