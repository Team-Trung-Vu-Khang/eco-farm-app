import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  type Column,
  Badge,
  useToast,
  DeleteDialog,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";
import useTeamStore, { type TeamMember } from "../../stores/useTeamStore";

export default function TeamDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Zustand store
  const getTeamById = useTeamStore((state) => state.getTeamById);
  const getMembersByTeamId = useTeamStore((state) => state.getMembersByTeamId);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);

  const id = params?.id ? Number(params.id) : 0;
  const team = getTeamById(id);
  const members = getMembersByTeamId(id);

  const columns: Column<TeamMember>[] = [
    {
      key: "fullName",
      label: "Thành viên",
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={item.avatar}
              alt={value}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{value}</span>
            <span className="text-xs text-muted-foreground">{item.email}</span>
          </div>
        </div>
      ),
    },
    { key: "position", label: "Chức vụ" },
    { key: "phone", label: "Điện thoại" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Nghỉ việc"}
        </Badge>
      ),
    },
  ];

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

  if (!team) {
    return (
      <AdminLayout title="Chi tiết đội nhóm">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin đội nhóm.
          </p>
          <Button onClick={() => setLocation("/team")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết đội nhóm"
      description={`Thông tin và danh sách thành viên của ${team.name}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/team")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đội
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Team Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-muted-foreground">Mã đội nhóm</Label>
                <div className="font-medium font-mono">{team.code}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Tên đội nhóm</Label>
                <div className="font-medium">{team.name}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Trưởng nhóm</Label>
                <div className="font-medium text-primary">{team.leader}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Phòng ban</Label>
                <div className="font-medium">{team.department}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Trạng thái</Label>
                <div className="mt-1">
                  <Badge
                    variant={team.status === "active" ? "default" : "outline"}
                  >
                    {team.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-muted-foreground">Mô tả</Label>
                <div className="text-sm">{team.description}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Danh sách thành viên ({members.length})
            </h3>
          </div>

          <DataTable
            columns={columns}
            data={members}
            onView={(item) => setLocation(`/personnel/${item.id}/edit`)} // Navigate to personnel detail
            selectable={false}
          />
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteTeam}
        description="Bạn có chắc chắn muốn xóa đội nhóm này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
