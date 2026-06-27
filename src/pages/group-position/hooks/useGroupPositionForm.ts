import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type MasterDataCreateRequest,
  type MasterDataStatus,
  type MasterDataUpdateRequest,
  useCreateMasterData,
  useDeleteMasterData,
  useMasterData,
  useUpdateMasterData,
} from "../../../features/master-data";
import type { PositionGroup, PositionGroupFormData } from "../types";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type PositionGroupStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildCreatePayload(
  formData: PositionGroupFormData,
): MasterDataCreateRequest<"position-groups"> {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: "active",
    metadataJson: {
      source: "manual",
    },
  };
}

function buildUpdatePayload(
  formData: PositionGroupFormData,
  currentItem: PositionGroup,
): MasterDataUpdateRequest<"position-groups"> {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: formData.status,
    displayOrder: currentItem.displayOrder,
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
    },
  };
}

export function useGroupPositionForm() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PositionGroupStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PositionGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<PositionGroup | null>(null);

  const groupQuery = useMasterData("position-groups", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const createPositionGroup = useCreateMasterData("position-groups");
  const updatePositionGroup = useUpdateMasterData("position-groups");
  const deletePositionGroup = useDeleteMasterData("position-groups");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value as PositionGroupStatusFilter);
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: PositionGroup) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: PositionGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (formData: PositionGroupFormData) => {
    try {
      if (editItem) {
        await updatePositionGroup.mutateAsync({
          id: editItem.id,
          data: buildUpdatePayload(formData, editItem),
        });
        toast({ title: "Thành công", description: "Đã cập nhật nhóm chức vụ" });
      } else {
        await createPositionGroup.mutateAsync(buildCreatePayload(formData));
        toast({ title: "Thành công", description: "Đã thêm nhóm chức vụ mới" });
      }
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
      await deletePositionGroup.mutateAsync(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa nhóm chức vụ" });
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
  };

  return {
    data: groupQuery.items,
    loading: groupQuery.loading,
    error: groupQuery.error,
    response: groupQuery.response,
    handleSearch,
    handleFilterChange,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
