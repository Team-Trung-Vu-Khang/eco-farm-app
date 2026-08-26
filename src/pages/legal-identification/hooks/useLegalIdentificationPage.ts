import {
  useDeleteLegalIdentification,
  useLegalIdentifications,
  type LegalIdentificationStatus,
} from "@/features/legal-identification";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { LegalIdentificationRecord } from "../data/constants";
import { mapLegalIdentificationResponseToRecord } from "../utils/legal-identification.mapper";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

const LEGAL_STATUS_OPTIONS = [
  { value: "draft", label: "Nháp" },
  { value: "pending", label: "Đang duyệt" },
  { value: "approved", label: "Đã duyệt" },
];

export function useLegalIdentificationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    LegalIdentificationStatus | typeof ALL_STATUS
  >(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const query = useLegalIdentifications({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: statusFilter === ALL_STATUS ? undefined : statusFilter,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const deleteLegalIdentification = useDeleteLegalIdentification({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa hồ sơ pháp lý",
      });
    },
    onError: (error) => {
      toast({
        title: "Không thể xóa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const records = useMemo<LegalIdentificationRecord[]>(
    () => query.items.map(mapLegalIdentificationResponseToRecord),
    [query.items],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(
        value === ALL_STATUS
          ? ALL_STATUS
          : (value as LegalIdentificationStatus),
      );
      setCurrentIndex(1);
    }
  };

  const handleAdd = () => {
    setLocation("/legal-identification/create");
  };

  const handleView = (id: number) => {
    setLocation(`/legal-identification/${id}`);
  };

  const handleEdit = (id: number) => {
    setLocation(`/legal-identification/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteLegalIdentification.deleteLegalIdentification({
        id: selectedId,
      });
    } finally {
      setDeleteOpen(false);
      setSelectedId(null);
    }
  };

  return {
    records,
    loading: query.loading,
    error: query.error,
    response: query.response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    handleFilterChange,
    filters: [
      {
        key: "status",
        label: "Trạng thái",
        options: LEGAL_STATUS_OPTIONS,
      },
    ],
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    handleConfirmDelete,
    isDeleting: deleteLegalIdentification.isPending,
  };
}
