import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import type {
  MasterDataCreateRequest,
  MasterDataRecord,
  MasterDataStatus,
  MasterDataUpdateRequest,
} from "@/features/master-data/types/master-data.type";
import {
  organizationTypeFormSchema,
  type OrganizationTypeFormInput,
  type OrganizationTypeFormValues,
} from "../data/organization-type.schema";

type OrganizationTypeRecord = MasterDataRecord<"organization-types">;

type OrganizationTypeCreateRequest = MasterDataCreateRequest<"organization-types">;

type OrganizationTypeUpdateRequest = MasterDataUpdateRequest<"organization-types">;

const defaultValues: OrganizationTypeFormInput = {
  code: "",
  name: "",
  description: "",
  type: "enterprise",
  status: "active",
  metadataJson: null,
};

export function useOrganizationTypesForm() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MasterDataStatus | "">("");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<OrganizationTypeRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<OrganizationTypeRecord | null>(
    null,
  );

  const params = useMemo(
    () => ({
      keyword: searchQuery.trim() || undefined,
      status: statusFilter || undefined,
      page: currentIndex,
      size: pageSize,
    }),
    [currentIndex, pageSize, searchQuery, statusFilter],
  );

  const query = useMasterData("organization-types", {
    params,
  });

  const {
    createMasterData,
    updateMasterData,
    deleteMasterData,
  } = useMasterDataMutations("organization-types");

  const form = useForm<OrganizationTypeFormInput, unknown, OrganizationTypeFormValues>(
    {
      defaultValues,
      resolver: zodResolver(organizationTypeFormSchema),
    },
  );

  const {
    control,
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

  const handleEdit = (item: OrganizationTypeRecord) => {
    setEditItem(item);
    reset({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      type: item.type ?? "enterprise",
      status:
        item.status === "active" ||
        item.status === "inactive" ||
        item.status === "archived"
          ? item.status
          : "active",
      metadataJson: item.metadataJson ?? null,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: OrganizationTypeRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    if (editItem) {
      const payload = {
        ...values,
        displayOrder: 1,
        type: values.type,
      } satisfies OrganizationTypeUpdateRequest;

      await updateMasterData.mutateAsync({
        id: editItem.id,
        data: payload,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật loại hình tổ chức",
      });
    } else {
      const payload = {
        ...values,
        displayOrder: 1,
        type: values.type,
      } satisfies OrganizationTypeCreateRequest;

      await createMasterData.mutateAsync(payload);
      toast({
        title: "Thành công",
        description: "Đã thêm loại hình tổ chức mới",
      });
    }

    setFormOpen(false);
  });

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    await deleteMasterData.mutateAsync(deleteItem.id);
    toast({
      title: "Thành công",
      description: "Đã xóa loại hình tổ chức",
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
    control,
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
