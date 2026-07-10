import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type FarmDepartmentRequest,
  type FarmMasterDataStatus,
  useFarmDepartments,
  useFarmDepartmentMutations,
} from "../../../features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { DepartmentFormValues } from "../data/department-form.schema";
import { type DepartmentItem } from "../types/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type DepartmentStatusFilter = FarmMasterDataStatus | typeof ALL_STATUS;

function buildCreatePayload(
  formData: DepartmentFormValues,
): FarmDepartmentRequest {
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
): FarmDepartmentRequest {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: formData.status as FarmMasterDataStatus,
    displayOrder: currentItem.displayOrder,
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
    },
  };
}

export function useDepartment() {
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<DepartmentStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<DepartmentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DepartmentItem | null>(null);

  const parsedWorkspaceId = typeof workspaceId === "number" ? workspaceId : undefined;

  const departmentQuery = useFarmDepartments({
    workspaceId: parsedWorkspaceId,
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === ALL_STATUS ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createDepartment, updateDepartment, deleteDepartment } =
    useFarmDepartmentMutations(parsedWorkspaceId);

  const departments = departmentQuery.items as unknown as DepartmentItem[];

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
    importOpen,
    setImportOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    workspaceId: parsedWorkspaceId,
    refetchDepartments: () => departmentQuery.refetch(),
  };
}
