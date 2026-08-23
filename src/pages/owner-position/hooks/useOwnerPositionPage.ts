import { useSelectedWorkspaceId } from "@/features/workspace";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  type FarmMasterDataStatus,
  type FarmPositionRequest,
  type PositionResponsibilityDocumentType,
  useFarmPositionMutations,
  useFarmPositions,
  useMasterData,
} from "../../../features/master-data";

import { AxiosError } from "axios";
import type { PositionFormData, PositionItem, PositionRecord } from "../types";

const DEFAULT_PAGE_SIZE = 10;
const ALL_STATUS = "all" as const;

export type PositionStatusFilter = FarmMasterDataStatus | typeof ALL_STATUS;

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
    documentType: document.type.trim().toUpperCase(),
    type: document.type.trim() as PositionResponsibilityDocumentType,
    name: document.name.trim(),
    content: document.content?.trim() || undefined,
    fileUrl: document.fileUrl?.trim() || undefined,
    fileName: document.fileName?.trim() || undefined,
  }));
}

function buildCreatePayload(formData: PositionFormData): FarmPositionRequest {
  const positionGroupIdValue = formData.positionGroupId.trim();
  const positionGroupId = positionGroupIdValue
    ? Number(positionGroupIdValue)
    : undefined;

  return {
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: "active",
    displayOrder: formData.displayOrder,
    positionGroupId: Number.isNaN(positionGroupId)
      ? undefined
      : positionGroupId,
    responsibilityDescription:
      formData.responsibilityDescription.trim() || undefined,
    documents: mapFormDocuments(formData.documents) as any,
    metadataJson: {
      source: "manual",
    },
  };
}

function buildUpdatePayload(
  formData: PositionFormData,
  currentItem: PositionItem,
): FarmPositionRequest {
  const positionGroupIdValue = formData.positionGroupId.trim();
  const positionGroupId = positionGroupIdValue
    ? Number(positionGroupIdValue)
    : undefined;

  return {
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    status: formData.status as FarmMasterDataStatus,
    displayOrder: formData.displayOrder,
    positionGroupId: Number.isNaN(positionGroupId)
      ? (currentItem.positionGroupId ?? undefined)
      : positionGroupId,
    responsibilityDescription:
      formData.responsibilityDescription.trim() || undefined,
    documents: mapFormDocuments(formData.documents) as any,
    metadataJson: {
      ...(currentItem.metadataJson ?? {}),
      source: "manual",
    },
  };
}

export function useOwnerPositionPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PositionStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PositionItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PositionItem | null>(null);

  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const positionsQuery = useFarmPositions({
    workspaceId: parsedWorkspaceId,
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : (status as any),
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

  const { createPosition, updatePosition, deletePosition } =
    useFarmPositionMutations(parsedWorkspaceId);

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
    setLocation(`/owner-position/${item.id}/detail`);
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
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Đã xảy ra lỗi không xác định";

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
    importOpen,
    setImportOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    workspaceId: parsedWorkspaceId,
    refetchPositions: () => positionsQuery.refetch(),
  };
}
