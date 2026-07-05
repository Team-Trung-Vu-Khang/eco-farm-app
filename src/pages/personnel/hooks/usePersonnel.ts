import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useFarmPersonnel,
  useFarmPersonnelMutations,
  type FarmPersonnelResponse,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";

const DEFAULT_PAGE_SIZE = 10;

export function usePersonnel() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const filters = useMemo(() => {
    return [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Nghỉ việc", value: "inactive" },
          { label: "Đã lưu trữ", value: "archived" },
        ],
      },
    ];
  }, []);

  const personnelQuery = useFarmPersonnel({
    params: {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });

  const { createPersonnel, deletePersonnel } = useFarmPersonnelMutations(
    typeof workspaceId === "number" ? workspaceId : undefined,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FarmPersonnelResponse | null>(
    null,
  );
  const [importOpen, setImportOpen] = useState(false);

  const handleDelete = (item: FarmPersonnelResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deletePersonnel.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa nhân sự",
        });
      } catch (error) {
        toast({
          title: "Không thể xóa",
          description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
          variant: "destructive",
        });
      }
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleImportData = async (newData: any[]) => {
    toast({
      title: "Đang xử lý...",
      description: `Hệ thống đang tiến hành nhập ${newData.length} nhân sự.`,
    });

    let successCount = 0;
    let errorCount = 0;

    for (const item of newData) {
      if (!item.payload) continue;
      try {
        await createPersonnel.mutateAsync(item.payload);
        successCount++;
      } catch (error) {
        console.error("Lỗi khi import dòng", item, error);
        errorCount++;
      }
    }

    toast({
      title: "Nhập dữ liệu hoàn tất",
      description: `Thành công: ${successCount}, Thất bại: ${errorCount}`,
    });

    personnelQuery.refetch();
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  return {
    personnel: personnelQuery.items,
    loading: personnelQuery.loading,
    response: personnelQuery.response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    setLocation,
    isDeleting: deletePersonnel.isPending,
    filters,
    handleFilterChange,
  };
}
