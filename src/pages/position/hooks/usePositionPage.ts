import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type MasterDataCreateRequest,
  type MasterDataStatus,
  type MasterDataUpdateRequest,
  type PositionResponsibilityDocumentType,
  useCreateMasterData,
  useDeleteMasterData,
  useMasterData,
  useUpdateMasterData,
} from "../../../features/master-data";

import type { PositionFormData, PositionItem, PositionRecord } from "../types";
import { useDebounce } from "@/shared/hooks/useDebounce";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type PositionStatusFilter = MasterDataStatus | typeof ALL_STATUS;

function mapPositionRecordToItem(item: PositionRecord): PositionItem {
  return {
    ...item,
    positionGroupId: item.positionGroupId ?? null,
    positionGroup: item.positionGroup ?? null,
    responsibilityDescription: item.responsibilityDescription ?? "",
    displayOrder: item.displayOrder ?? 1,
    documents: item.documents ?? [],
  };
}

function mapFormDocuments(formDocuments: PositionFormData["documents"]) {
  return formDocuments.map((document) => ({
    ...(document.id != null ? { id: document.id } : {}),
    type: document.type.trim() as PositionResponsibilityDocumentType,
    name: document.name.trim(),
    content: document.content?.trim() || undefined,
    fileUrl: document.fileUrl?.trim() || undefined,
    fileName: document.fileName?.trim() || undefined,
  }));
}

function buildCreatePayload(
  formData: PositionFormData,
): MasterDataCreateRequest<"positions"> {
  const positionGroupIdValue = formData.positionGroupId.trim();
  const positionGroupId = positionGroupIdValue
    ? Number(positionGroupIdValue)
    : undefined;

  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: "active",
    displayOrder: formData.displayOrder,
    positionGroupId: Number.isNaN(positionGroupId)
      ? undefined
      : positionGroupId,
    responsibilityDescription:
      formData.responsibilityDescription.trim() || undefined,
    documents: mapFormDocuments(formData.documents),
    metadataJson: {
      source: "manual",
    },
  };
}

function buildUpdatePayload(
  formData: PositionFormData,
  currentItem: PositionItem,
): MasterDataUpdateRequest<"positions"> {
  const positionGroupIdValue = formData.positionGroupId.trim();
  const positionGroupId = positionGroupIdValue
    ? Number(positionGroupIdValue)
    : undefined;

  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: formData.status,
    displayOrder: formData.displayOrder,
    positionGroupId: Number.isNaN(positionGroupId)
      ? (currentItem.positionGroupId ?? undefined)
      : positionGroupId,
    responsibilityDescription:
      formData.responsibilityDescription.trim() || undefined,
    documents: mapFormDocuments(formData.documents),
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
    },
  };
}

export function usePositionPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PositionStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PositionItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PositionItem | null>(null);

  const searchDebounce = useDebounce(search, 400);

  const positionsQuery = useMasterData("positions", {
    params: {
      keyword: searchDebounce.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const positionGroupQuery = useMasterData("position-groups", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const createPosition = useCreateMasterData("positions");
  const updatePosition = useUpdateMasterData("positions");
  const deletePosition = useDeleteMasterData("positions");

  const positions = useMemo(
    () =>
      positionsQuery.items.map((item) =>
        mapPositionRecordToItem(item as PositionRecord),
      ),
    [positionsQuery.items],
  );

  const groupOptions = useMemo(
    () =>
      positionGroupQuery.items.map((group) => ({
        label: group.name,
        value: String(group.id),
      })),
    [positionGroupQuery.items],
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

  const handleView = (item: PositionItem) => {
    setLocation(`/position/${item.id}/detail`);
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
    loading: positionsQuery.loading || positionGroupQuery.loading,
    error: positionsQuery.error || positionGroupQuery.error,
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
    handleView,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    formLoading: createPosition.isPending || updatePosition.isPending,
  };
}
