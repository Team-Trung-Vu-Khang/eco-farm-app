import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, ChevronDown, Upload, FileUser } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { ImportTeamDialog } from "../../components/team/ImportTeamDialog";

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
  const [importOpen, setImportOpen] = useState(false);

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

  const handleImportData = (newData: any[]) => {
    const formattedData: Team[] = newData.map((item, index) => ({
      ...item,
      id: data.length + index + 1,
      memberCount: 0, // Mặc định 0 cho dữ liệu mới nhập
    }));
    setData((prev) => [...prev, ...formattedData]);
  };

  return (
    <AdminLayout
      title="Quản lý đội nhóm"
      description="Danh sách các đội / nhóm làm việc"
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setLocation("/team/create")}>
              <FileUser className="w-4 h-4 mr-2" />
              Thêm thủ công
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Nhập từ Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <ImportTeamDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportData}
      />
    </AdminLayout>
  );
}
