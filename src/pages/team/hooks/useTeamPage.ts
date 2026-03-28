import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useTeamStore, { type Team } from "@/stores/useTeamStore";

export function useTeamPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const teams = useTeamStore((state) => state.teams);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const bulkAddTeams = useTeamStore((state) => state.bulkAddTeams);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Team | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleDelete = (item: Team) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTeam(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa đội nhóm khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleImportData = (newData: Team[]) => {
    bulkAddTeams(newData);
    toast({
      title: "Thành công",
      description: `Đã nhập ${newData.length} đội nhóm mới`,
    });
  };

  return {
    teams,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    goToCreate: () => setLocation("/team/create"),
    goToDetail: (id: number) => setLocation(`/team/${id}`),
  };
}
