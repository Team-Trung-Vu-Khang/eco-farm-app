import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  BusinessLineCreateRequest,
  BusinessLineRecord,
  BusinessLineUpdateRequest,
  MasterDataStatus,
} from "@/features/master-data/types/master-data.type";
import {
  businessLineFormSchema,
  type BusinessLineFormInput,
  type BusinessLineFormValues,
} from "../data/business-line.schema";
import { useDebounce } from "@/shared/hooks/useDebounce";

const defaultValues: BusinessLineFormInput = {
  code: "",
  name: "",
  description: "",
  status: "active",
  metadataJson: null,
};

export function useBusinessLinesForm() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MasterDataStatus | "">("");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<BusinessLineRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<BusinessLineRecord | null>(null);

  const searchDebounce = useDebounce(searchQuery, 400);

  const params = useMemo(
    () => ({
      keyword: searchDebounce.trim() || undefined,
      status: statusFilter || undefined,
      page: currentIndex,
      size: pageSize,
    }),
    [currentIndex, pageSize, searchDebounce, statusFilter],
  );

  const query = useMasterData("business-lines", {
    params,
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("business-lines");

  const form = useForm<BusinessLineFormInput, unknown, BusinessLineFormValues>({
    defaultValues,
    resolver: zodResolver(businessLineFormSchema),
  });

  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = form;

  const handleAdd = () => {
    setEditItem(null);
    reset(defaultValues);
    setFormOpen(true);
  };

  const handleSearch = (value: string) => {
    setCurrentIndex(0);
    setSearchQuery(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setCurrentIndex(0);
      setStatusFilter(value as MasterDataStatus | "");
    }
  };

  const handlePageSize = (nextPageSize: number) => {
    setCurrentIndex(0);
    setPageSize(nextPageSize);
  };

  const handleIndexChange = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
  };

  const handleEdit = (item: BusinessLineRecord) => {
    setEditItem(item);
    reset({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      status: (item.status as any) || "active",
      metadataJson: item.metadataJson as any,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: BusinessLineRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    if (editItem) {
      const payload: BusinessLineUpdateRequest = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        metadataJson: values.metadataJson ?? null,
        displayOrder: 1,
      };

      await updateMasterData.mutateAsync({
        id: editItem.id,
        data: payload,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật lĩnh vực hoạt động",
      });
    } else {
      const payload: BusinessLineCreateRequest = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        metadataJson: values.metadataJson ?? null,
        displayOrder: 1,
      };

      await createMasterData.mutateAsync(payload);
      toast({
        title: "Thành công",
        description: "Đã thêm lĩnh vực hoạt động mới",
      });
    }

    setFormOpen(false);
  });

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    await deleteMasterData.mutateAsync(deleteItem.id);
    toast({
      title: "Thành công",
      description: "Đã xóa lĩnh vực hoạt động",
    });
    setDeleteOpen(false);
  };

  return {
    data: query.items,
    loading: query.loading,
    response: query.response,
    searchQuery,
    setSearchQuery: handleSearch,
    statusFilter,
    setStatusFilter,
    pageSize,
    setPageSize: handlePageSize,
    currentIndex,
    setCurrentIndex: handleIndexChange,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    register,
    errors,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleFilterChange,
    formLoading: createMasterData.isPending || updateMasterData.isPending,
    deleteLoading: deleteMasterData.isPending,
  };
}
