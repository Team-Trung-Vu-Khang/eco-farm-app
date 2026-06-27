import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMasterData, useMasterDataMutations } from "@/features/master-data";
import { emptyPlanTypeFormData } from "../data/constants";
import type { PlanType, PlanTypeFormData, PlanGroupOption } from "../types/types";
import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type PlanTypeStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildPayload(formData: PlanTypeFormData) {
  const planGroupId = Number(formData.planGroupId);

  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim(),
    color: formData.color.trim(),
    displayOrder: 1,
    status: formData.status,
    planGroupId: Number.isNaN(planGroupId) ? undefined : planGroupId,
  };
}

export function usePlanTypePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PlanTypeStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PlanType | null>(null);
  const [deleteItem, setDeleteItem] = useState<PlanType | null>(null);
  const [formData, setFormData] =
    useState<PlanTypeFormData>(emptyPlanTypeFormData);

  const planTypesQuery = useMasterData("plan-types", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const planGroupsQuery = useMasterData("plan-groups", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useMasterDataMutations("plan-types");

  const planTypes = useMemo(
    () => planTypesQuery.items,
    [planTypesQuery.items],
  );

  const planGroupOptions = useMemo<PlanGroupOption[]>(
    () =>
      planGroupsQuery.items.map((group) => ({
        id: group.id,
        code: group.code,
        name: group.name,
      })),
    [planGroupsQuery.items],
  );

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
    setFormData(emptyPlanTypeFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PlanType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      color: item.color,
      displayOrder: item.displayOrder ?? 1,
      status: item.status,
      planGroupId: item.planGroup?.id ? String(item.planGroup.id) : "",
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PlanType) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async () => {
    const payload = buildPayload(formData);

    if (!payload.code || !payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên loại kế hoạch.",
        variant: "destructive",
      });
      return;
    }

    if (!payload.planGroupId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn nhóm kế hoạch.",
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
        toast({
          title: "Thành công",
          description: "Đã cập nhật loại kế hoạch.",
        });
      } else {
        await createMasterData.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: "Đã thêm loại kế hoạch mới.",
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
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteMasterData.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa loại kế hoạch.",
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
    planTypes,
    planGroupOptions,
    loading: planTypesQuery.loading || planGroupsQuery.loading,
    error: planTypesQuery.error || planGroupsQuery.error,
    response: planTypesQuery.response,
    search,
    status,
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
    deleteItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
