import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useFarmTeamById,
  useFarmTeamMutations,
  useFarmPersonnel,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";

export function useTeamDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id");
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const id = params?.id ? Number(params.id) : 0;

  const { data: team, isLoading: isTeamLoading } = useFarmTeamById(id, {
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });

  const { items: members, loading: isMembersLoading } = useFarmPersonnel({
    params: { teamId: id } as any, // Passing teamId for filtering if supported
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const teamMembers = useMemo(
    () => members.filter((member) => Number(member.teamId) === id),
    [members, id],
  );

  const { deleteTeam } = useFarmTeamMutations(
    typeof workspaceId === "number" ? workspaceId : undefined,
  );

  const handleDeleteTeam = async () => {
    if (id) {
      try {
        await deleteTeam.mutateAsync(id);
        toast({
          title: "Thành công",
          description: "Đã xóa đội nhóm",
        });
        setLocation("/team");
      } catch (error) {
        toast({
          title: "Không thể xóa",
          description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
          variant: "destructive",
        });
      }
    }
    setDeleteOpen(false);
  };

  const goToUpdate = () => {
    setLocation(`/team/${id}/edit`);
  };

  return {
    team,
    isTeamLoading,
    members: teamMembers,
    isMembersLoading,
    deleteOpen,
    setDeleteOpen,
    handleDeleteTeam,
    goToUpdate,
    goBack: () => setLocation("/team"),
    goToMember: (memberId: number) =>
      setLocation(`/personnel/${memberId}/edit`),
    isDeleting: deleteTeam.isPending,
  };
}
