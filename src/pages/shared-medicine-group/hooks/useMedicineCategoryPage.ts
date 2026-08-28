import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";
import type { MedicineCategoryFormValues } from "../data/schema";
import { useDebounce } from "@/shared/hooks/useDebounce";

export type MedicineCategoryItem = {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: MasterDataStatus;
};

export function useMedicineCategoryPage(
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE",
  classification: string,
) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MasterDataStatus | "all">("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<MedicineCategoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MedicineCategoryItem | null>(
    null,
  );

  const searchDebounce = useDebounce(search, 400);

  const { items, loading, error, response } = useMasterData("medicine-groups", {
    params: {
      domainCode,
      classification,
      keyword: searchDebounce.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("medicine-groups");

  const data = useMemo(() => items as MedicineCategoryItem[], [items]);

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: MedicineCategoryItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: MedicineCategoryItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const buildPayload = (values: MedicineCategoryFormValues) => ({
    domainCode,
    classification,
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    displayOrder: 1,
    status: editItem ? values.status : "active",
    metadataJson: {
      source: "manual",
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === "all" ? "all" : (value as MasterDataStatus));
      setCurrentIndex(1);
    }
  };

  const handleSubmit = async (values: MedicineCategoryFormValues) => {
    const payload = buildPayload(values);

    if (!payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên phân loại.",
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
          ? "Đã cập nhật phân loại."
          : "Đã thêm phân loại mới.",
      });
      setFormOpen(false);
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
    if (deleteItem) {
      try {
        await deleteMasterData.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa phân loại.",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định";

        toast({
          title: "Không thể xóa",
          description: message,
          variant: "destructive",
        });
      }
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    loading,
    submitting: createMasterData.isPending || updateMasterData.isPending,
    error,
    response,
    search,
    setSearch,
    status,
    setStatus,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
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
