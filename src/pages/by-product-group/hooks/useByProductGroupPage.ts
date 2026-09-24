import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  MasterDataStatus,
  ByProductGroupRecord,
} from "@/features/master-data/types/master-data.type";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import type { ByProductGroupFormValues } from "../data/by-product-group-form.schema";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type StatusFilter = MasterDataStatus | typeof ALL_STATUS;

export function useByProductGroupPage(classification?: string) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<ByProductGroupRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<ByProductGroupRecord | null>(null);

  const searchDebounce = useDebounce(search, 400);

  const query = useMasterData("by-product-groups", {
    params: {
      classification,
      keyword: searchDebounce.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("by-product-groups");

  const buildPayload = (values: ByProductGroupFormValues) => {
    return {
      code: values.code?.trim().toUpperCase() || "",
      name: values.name.trim(),
      classification: values.classification || classification || "",
      description: (values.description || "").trim(),
      displayOrder: 1,
      status: values.status,
      metadataJson: {
        source: "manual",
      },
    };
  };

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

  const handleEdit = (item: ByProductGroupRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: ByProductGroupRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: ByProductGroupFormValues) => {
    const payload = buildPayload(values);

    if (!payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên nhóm phụ phẩm.",
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
          ? "Đã cập nhật nhóm phụ phẩm."
          : "Đã thêm nhóm phụ phẩm mới.",
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
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteMasterData.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm phụ phẩm.",
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
    submitting: createMasterData.isPending || updateMasterData.isPending,
    error: query.error,
    response: query.response,
    search,
    status,
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
