import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useIrrigationSystemMutations,
  useIrrigationSystems,
} from "@/features/master-data";
import type {
  IrrigationSystemRecord,
  MasterDataStatus,
} from "@/features/master-data/types/master-data.type";
import type { IrrigationSystemFormValues } from "../data/irrigation-system-form.schema";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

type IrrigationSystemStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function buildPayload(
  values: IrrigationSystemFormValues,
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE",
) {
  return {
    domainCode,
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    displayOrder: 1,
    status: values.status,
    metadataJson: {
      source: "manual",
    },
  };
}

export function useIrrigationSystemPage(
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE",
) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<IrrigationSystemStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<IrrigationSystemRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<IrrigationSystemRecord | null>(
    null,
  );

  const query = useIrrigationSystems({
    params: {
      domainCode,
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { createMasterData, updateMasterData, deleteMasterData } =
    useIrrigationSystemMutations();

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

  const handleEdit = (item: IrrigationSystemRecord) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: IrrigationSystemRecord) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (values: IrrigationSystemFormValues) => {
    const payload = buildPayload(values, domainCode);

    if (!payload.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên hệ thống tưới.",
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
          ? "Đã cập phương pháp tưới tiêu tưới."
          : "Đã thêm phương pháp tưới tiêu mới.",
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
        description: "Đã xóa phương pháp tưới tiêu.",
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
    data: query.items,
    loading: query.loading,
    submitting: createMasterData.isPending || updateMasterData.isPending,
    error: query.error,
    response: query.response,
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
