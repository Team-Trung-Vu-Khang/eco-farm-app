import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";
import type {
  PesticideCategoryFormData,
  PesticideCategoryItem,
} from "../types";
import type { PesticidePurposeFormValues } from "../data/pesticide-purpose-form.schema";
import { emptyPesticideCategoryFormData } from "../data/constants";

export function usePesticideCategoryPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MasterDataStatus | "all">("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideCategoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideCategoryItem | null>(
    null,
  );
  const [formData, setFormData] = useState<PesticideCategoryFormData>(
    emptyPesticideCategoryFormData,
  );

  const {
    items,
    loading,
    error,
    response,
  } = useMasterData("pesticide-groups", {
    params: {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("pesticide-groups");

  const data = useMemo(
    () => items as PesticideCategoryItem[],
    [items],
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyPesticideCategoryFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PesticideCategoryItem) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideCategoryItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const buildPayload = (values: PesticidePurposeFormValues) => ({
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

  const handleSubmit = async (values: PesticidePurposeFormValues) => {
    const payload = buildPayload(values);

    if (!payload.code || !payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên phân loại.",
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
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  };
}
