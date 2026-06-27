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
import type { DepartmentFormValues } from "../data/department-form.schema";
import { type DepartmentItem } from "../types/types";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type DepartmentStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildCreatePayload(
  formData: DepartmentFormValues,
): MasterDataCreateRequest<"departments"> {
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
  formData: DepartmentFormValues,
  currentItem: DepartmentItem,
): MasterDataUpdateRequest<"departments"> {
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

export function useDepartment() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DepartmentStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<DepartmentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DepartmentItem | null>(null);

  const departmentQuery = useMasterData("departments", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const createDepartment = useCreateMasterData("departments");
  const updateDepartment = useUpdateMasterData("departments");
  const deleteDepartment = useDeleteMasterData("departments");

  const departments = departmentQuery.items;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value as DepartmentStatusFilter);
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: DepartmentItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: DepartmentItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (formData: DepartmentFormValues) => {
    try {
      if (editItem) {
        await updateDepartment.mutateAsync({
          id: editItem.id,
          data: buildUpdatePayload(formData, editItem),
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật phòng ban",
        });
      } else {
        await createDepartment.mutateAsync(buildCreatePayload(formData));
        toast({
          title: "Thành công",
          description: "Đã thêm phòng ban mới",
        });
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
    if (deleteItem) {
      try {
        await deleteDepartment.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa phòng ban",
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
    }
    setDeleteOpen(false);
  };

  return {
    departments,
    loading: departmentQuery.loading,
    error: departmentQuery.error,
    response: departmentQuery.response,
    handleSearch,
    status,
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
