import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useFarmTeams,
  useFarmTeamMutations,
  type FarmTeamResponse,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";

const DEFAULT_PAGE_SIZE = 10;

export function useTeamPage() {
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

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
  ];

  const teamQuery = useFarmTeams({
    params: {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });

  const { deleteTeam } = useFarmTeamMutations(
    typeof workspaceId === "number" ? workspaceId : undefined,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FarmTeamResponse | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleDelete = (item: FarmTeamResponse) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteTeam.mutateAsync(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa đội nhóm",
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

  const handleImportData = (newData: any[]) => {
    toast({
      title: "Chưa hỗ trợ",
      description: "Tính năng nhập từ Excel đang được phát triển",
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  return {
    teams: teamQuery.items,
    loading: teamQuery.loading,
    response: teamQuery.response,
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
    goToCreate: () => setLocation("/team/create"),
    goToDetail: (id: number) => setLocation(`/team/${id}`),
    goToEdit: (id: number) => setLocation(`/team/${id}/edit`),
    isDeleting: deleteTeam.isPending,
    filters,
    handleFilterChange,
  };
}
