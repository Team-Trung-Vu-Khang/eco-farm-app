import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type MasterDataCreateRequest,
  type MasterDataRecord,
  type MasterDataStatus,
  type MasterDataUpdateRequest,
  useCreateMasterData,
  useDeleteMasterData,
  useMasterData,
  useUpdateMasterData,
} from "../../../features/master-data";

import type {
  PositionFormData,
  PositionItem,
  PositionMetadata,
} from "../types";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type PositionStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function readPositionMetadata(
  item: MasterDataRecord<"positions"> | PositionItem,
): PositionMetadata {
  return (item.metadataJson ?? {}) as PositionMetadata;
}

function mapPositionRecordToItem(
  item: MasterDataRecord<"positions">,
): PositionItem {
  const metadata = readPositionMetadata(item);

  return {
    ...item,
    group: metadata.group ?? "",
    responsibilities: metadata.responsibilities ?? [],
  };
}

function buildCreatePayload(
  formData: PositionFormData,
): MasterDataCreateRequest<"positions"> {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: "active",
    metadataJson: {
      source: "manual",
      group: formData.group,
      responsibilities: formData.responsibilities,
    },
  };
}

function buildUpdatePayload(
  formData: PositionFormData,
  currentItem: PositionItem,
): MasterDataUpdateRequest<"positions"> {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: formData.status,
    displayOrder: currentItem.displayOrder,
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
      group: formData.group,
      responsibilities: formData.responsibilities,
    },
  };
}

export function usePositionPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PositionStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PositionItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PositionItem | null>(null);

  const positionsQuery = useMasterData("positions", {
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const positionGroupQuery = useMasterData("position-groups", {
    params: {
      status: "active",
      keyword: search.trim() || undefined,
      page: 0,
      size: pageSize,
    },
  });

  const createPosition = useCreateMasterData("positions");
  const updatePosition = useUpdateMasterData("positions");
  const deletePosition = useDeleteMasterData("positions");
  const responsibilityQuery = useMasterData("positions", {
    params: {
      size: pageSize,
    },
  });

  const positions = useMemo(
    () => positionsQuery.items.map(mapPositionRecordToItem),
    [positionsQuery.items],
  );

  const groupOptions = useMemo(
    () =>
      positionGroupQuery.items.map((group) => ({
        label: group.name,
        value: group.name,
      })),
    [positionGroupQuery.items],
  );

  const responsibilityOptions = useMemo(
    () =>
      responsibilityQuery.items.map((item) => ({
        label: item.name,
        value: item.name,
      })),
    [responsibilityQuery.items],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value as PositionStatusFilter);
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: PositionItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: PositionItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (formData: PositionFormData) => {
    try {
      if (editItem) {
        await updatePosition.mutateAsync({
          id: editItem.id,
          data: buildUpdatePayload(formData, editItem),
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật chức vụ",
        });
      } else {
        await createPosition.mutateAsync(buildCreatePayload(formData));
        toast({
          title: "Thành công",
          description: "Đã thêm chức vụ mới",
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
      await deletePosition.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chức vụ",
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
  };

  return {
    positions,
    groupOptions,
    responsibilityOptions,
    loading:
      positionsQuery.loading ||
      positionGroupQuery.loading ||
      responsibilityQuery.loading,
    error:
      positionsQuery.error ||
      positionGroupQuery.error ||
      responsibilityQuery.error,
    response: positionsQuery.response,
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
