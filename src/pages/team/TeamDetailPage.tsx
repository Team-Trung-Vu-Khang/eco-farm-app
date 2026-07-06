import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Edit, Loader2, Trash2, Users } from "lucide-react";
import { TeamInfoCard } from "./components/TeamInfoCard";
import { teamMemberColumns } from "./data/columns";
import { useTeamDetailPage } from "./hooks/useTeamDetailPage";

export default function TeamDetailPage() {
  const {
    team,
    isTeamLoading,
    members,
    isMembersLoading,
    deleteOpen,
    setDeleteOpen,
    handleDeleteTeam,
    goBack,
    goToMember,
    isDeleting,
    goToUpdate,
  } = useTeamDetailPage();

  if (isTeamLoading) {
    return (
      <AdminLayout isDev={true} title="Chi tiết đội nhóm">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Đang tải thông tin đội nhóm...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout isDev={true} title="Chi tiết đội nhóm">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin đội nhóm.
          </p>
          <Button onClick={goBack}>Quay lại danh sách</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chi tiết đội nhóm"
      description={`Thông tin và danh sách thành viên của ${team.name}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đội
          </Button>
          <Button variant="outline" onClick={goToUpdate}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <TeamInfoCard team={team as any} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Danh sách thành viên ({members.length})
            </h3>
          </div>

          <DataTable
            columns={teamMemberColumns as any}
            data={members}
            onView={(item) => goToMember(item.id)}
            selectable={false}
            loading={isMembersLoading}
          />
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteTeam}
        description="Bạn có chắc chắn muốn xóa đội nhóm này? Hành động này không thể hoàn tác."
        loading={isDeleting}
      />
    </AdminLayout>
  );
}
