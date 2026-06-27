import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { masterDataApi } from "@/features/master-data";
import { masterDataKeys, useMasterData } from "@/features/master-data/hooks/useMasterData";
import type { VsicIndustry } from "../types";
import type { VsicIndustryFormValues } from "../data/vsic-industry-form.schema";

export function useEnterpriseGroupForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | VsicIndustry["status"]>("all");
  const [level, setLevel] = useState<"all" | number>("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const { items, loading, response, error } = useMasterData("vsic-industries", {
    params: {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      level: level === "all" ? undefined : level,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<VsicIndustry | null>(null);
  const [deleteItem, setDeleteItem] = useState<VsicIndustry | null>(null);

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: masterDataKeys.all("vsic-industries"),
    });
  };

  const buildPayload = (data: VsicIndustryFormValues) => ({
    ...data,
    displayOrder: 1,
    metadataJson: {
      source: "manual",
    },
    parentCode: data.parentCode?.trim() || undefined,
  });

  const createMutation = useMutation({
    mutationFn: (data: VsicIndustryFormValues) =>
      masterDataApi.createVsicIndustry(buildPayload(data)),
    onSuccess: async () => {
      await refresh();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: VsicIndustryFormValues;
    }) =>
      masterDataApi.updateVsicIndustryByCode(code, buildPayload(data)),
    onSuccess: async () => {
      await refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => masterDataApi.deleteVsicIndustryByCode(code),
    onSuccess: async () => {
      await refresh();
    },
  });

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === "all" ? "all" : (value as VsicIndustry["status"]));
      setCurrentIndex(1);
    }

    if (key === "level") {
      setLevel(value === "all" ? "all" : Number(value));
      setCurrentIndex(1);
    }
  };

  const handleEdit = (item: VsicIndustry) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: VsicIndustry) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (formData: VsicIndustryFormValues) => {
    const isEditing = !!editItem;

    if (isEditing && editItem) {
      await updateMutation.mutateAsync({
        code: editItem.code,
        data: formData,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin ngành nghề",
      });
    } else {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Thành công",
        description: "Đã thêm thông tin ngành nghề mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      await deleteMutation.mutateAsync(deleteItem.code);
      toast({
        title: "Thành công",
        description: "Đã xóa thông tin ngành nghề",
      });
    }
    setDeleteOpen(false);
  };

  return {
    data: items,
    loading,
    error,
    response,
    search,
    status,
    level,
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
