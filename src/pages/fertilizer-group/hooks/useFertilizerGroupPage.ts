import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  FertilizerGroupRecord,
  MasterDataStatus,
} from "@/features/master-data/types/master-data.type";
import type { FertilizerGroupFormValues } from "../data/fertilizer-group-form.schema";
import { useDebounce } from "@/shared/hooks/useDebounce";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type FertilizerGroupStatusFilter = MasterDataStatus | typeof ALL_STATUS;

export function useFertilizerGroupPage(classification?: string) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FertilizerGroupStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<FertilizerGroupRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<FertilizerGroupRecord | null>(
    null,
  );

  const searchDebounce = useDebounce(search, 400);

  const query = useMasterData("fertilizer-groups", {
    params: {
      classification,
      keyword: searchDebounce.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("fertilizer-groups");

  const buildPayload = (values: FertilizerGroupFormValues) => {
    return {
      code: values.code?.trim().toUpperCase() || "",
      name: values.name.trim(),
      classification: (values as any).classification || classification || "",
      description: values.description.trim(),
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
      setStatus(
        value === ALL_STATUS ? ALL_STATUS : (value as MasterDataStatus),
      );
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: FertilizerGroupRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: FertilizerGroupRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: FertilizerGroupFormValues) => {
    const payload = buildPayload(values);

    if (!payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên nhóm phân bón.",
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
          ? "Đã cập nhật danh mục phân bón."
          : "Đã thêm danh mục phân bón mới.",
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
        description: "Đã xóa danh mục phân bón.",
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
