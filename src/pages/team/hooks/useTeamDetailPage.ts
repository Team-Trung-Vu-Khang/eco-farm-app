import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useTeamStore from "@/stores/useTeamStore";

export function useTeamDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const getTeamById = useTeamStore((state) => state.getTeamById);
  const getMembersByTeamId = useTeamStore((state) => state.getMembersByTeamId);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);

  const id = params?.id ? Number(params.id) : 0;
  const team = getTeamById(id);
  const members = getMembersByTeamId(id);

  const handleDeleteTeam = () => {
    if (id) {
      deleteTeam(id);
      toast({
        title: "Thành công",
        description: "Đã xóa đội nhóm",
      });
      setLocation("/team");
    }
    setDeleteOpen(false);
  };

  return {
    team,
    members,
    deleteOpen,
    setDeleteOpen,
    handleDeleteTeam,
    goBack: () => setLocation("/team"),
    goToMember: (memberId: number) =>
      setLocation(`/personnel/${memberId}/edit`),
  };
}
