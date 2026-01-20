import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface Team {
  id: number;
  code: string;
  name: string;
  leader: string;
  department: string;
  memberCount: number;
  description: string;
  status: "active" | "inactive";
}

const initialData: Team[] = [
  {
    id: 1,
    code: "TEAM-KD-MB",
    name: "Đội kinh doanh miền Bắc",
    leader: "Nguyễn Văn A",
    department: "Kinh doanh",
    memberCount: 15,
    description: "Phụ trách thị trường từ Đà Nẵng trở ra.",
    status: "active",
  },
  {
    id: 2,
    code: "TEAM-KT-T1",
    name: "Tổ kỹ thuật trại 1",
    leader: "Lê Văn C",
    department: "Kỹ thuật",
    memberCount: 8,
    description: "Chăm sóc và vận hành kỹ thuật tại Farm 1.",
    status: "active",
  },
  {
    id: 3,
    code: "TEAM-KT-TH",
    name: "Tổ kế toán tổng hợp",
    leader: "Trần Thị B",
    department: "Kế toán",
    memberCount: 5,
    description: "Xử lý số liệu kế toán toàn công ty.",
    status: "active",
  },
];

export default function TeamPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Team[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Team | null>(null);

  const columns: Column<Team>[] = [
    { key: "code", label: "Mã đội" },
    { key: "name", label: "Tên đội nhóm" },
    { key: "leader", label: "Trưởng nhóm" },
    { key: "department", label: "Phòng ban" },
    { key: "memberCount", label: "Số lượng thành viên" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleDelete = (item: Team) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa đội nhóm khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý đội nhóm"
      description="Danh sách các đội / nhóm làm việc"
      actions={
        <Link href="/team/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/team/${item.id}`)}
        onEdit={(item) => setLocation(`/team/${item.id}`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đội nhóm..."
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa đội nhóm này? Các nhân sự thuộc đội nhóm sẽ cần được phân bổ lại."
      />
    </AdminLayout>
  );
}
