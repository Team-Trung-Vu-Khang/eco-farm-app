import { useState, useEffect } from "react";
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
} from "@tankhang1/eco-shared-ui";
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";

interface TeamMember {
  id: number;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  avatar: string;
}

export default function TeamDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Mock team info
  const [teamInfo, setTeamInfo] = useState({
    code: "TEAM-KD-MB",
    name: "Đội kinh doanh miền Bắc",
    leader: "Nguyễn Văn A",
    department: "Kinh doanh",
    description: "Phụ trách thị trường từ Đà Nẵng trở ra.",
    status: "active",
  });

  // Mock members
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      position: "Trưởng phòng",
      phone: "0901234567",
      email: "nam.nguyen@ecofarm.vn",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      position: "Nhân viên kinh doanh",
      phone: "0909876543",
      email: "b.tran@ecofarm.vn",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      fullName: "Phạm Văn D",
      position: "Nhân viên kinh doanh",
      phone: "0918273645",
      email: "d.pham@ecofarm.vn",
      status: "inactive",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
    },
  ]);

  useEffect(() => {
    // Simulate fetching data based on params.id
    console.log("Fetching team detail for ID:", params?.id);
  }, [params?.id]);

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
    toast({
      title: "Thành công",
      description: "Đã xóa đội nhóm",
    });
    setLocation("/team");
  };

  return (
    <AdminLayout
      title="Chi tiết đội nhóm"
      description={`Thông tin và danh sách thành viên của ${teamInfo.name}`}
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
                <div className="font-medium font-mono">{teamInfo.code}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Tên đội nhóm</Label>
                <div className="font-medium">{teamInfo.name}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Trưởng nhóm</Label>
                <div className="font-medium text-primary">
                  {teamInfo.leader}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Phòng ban</Label>
                <div className="font-medium">{teamInfo.department}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Trạng thái</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      teamInfo.status === "active" ? "default" : "outline"
                    }
                  >
                    {teamInfo.status === "active"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-muted-foreground">Mô tả</Label>
                <div className="text-sm">{teamInfo.description}</div>
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
