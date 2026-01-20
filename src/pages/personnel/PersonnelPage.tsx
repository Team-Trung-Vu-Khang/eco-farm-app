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

interface Personnel {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  team: string; // Đội nhóm
  province: string;
  district: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  status: "active" | "inactive";
  avatar: string; // URL ảnh đại diện (mock)
}

const initialData: Personnel[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@ecofarm.vn",
    position: "Trưởng phòng",
    department: "Kinh doanh",
    team: "Đội kinh doanh miền Bắc",
    province: "Hà Nội",
    district: "Cầu Giấy",
    address: "Số 123 Đường Xuân Thủy",
    taxCode: "1234567890",
    taxAddress: "Hà Nội",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@ecofarm.vn",
    position: "Kế toán trưởng",
    department: "Kế toán",
    team: "Tổ kế toán tổng hợp",
    province: "TP.HCM",
    district: "Quận 1",
    address: "Số 456 Nguyễn Thị Minh Khai",
    taxCode: "0987654321",
    taxAddress: "TP.HCM",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@ecofarm.vn",
    position: "Kỹ sư nông nghiệp",
    department: "Kỹ thuật",
    team: "Đội kỹ thuật trại 1",
    province: "Đà Nẵng",
    district: "Hải Châu",
    address: "Số 789 Nguyễn Văn Linh",
    taxCode: "5678901234",
    taxAddress: "Đà Nẵng",
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
  },
];

export default function PersonnelPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Personnel[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Personnel | null>(null);

  const columns: Column<Personnel>[] = [
    {
      key: "fullName",
      label: "Họ và tên",
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={item.avatar}
              alt={value}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          </div>
          <span>{value}</span>
        </div>
      ),
    },
    { key: "phone", label: "Điện thoại" },
    { key: "position", label: "Chức vụ" },
    { key: "department", label: "Phòng ban" },
    { key: "team", label: "Đội nhóm" },
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

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Nghỉ việc", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Kinh doanh", value: "Kinh doanh" },
        { label: "Kế toán", value: "Kế toán" },
        { label: "Kỹ thuật", value: "Kỹ thuật" },
      ],
    },
  ];

  const handleDelete = (item: Personnel) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa nhân sự khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý nhân sự"
      description="Danh sách nhân sự của doanh nghiệp / nông hộ"
      actions={
        <Link href="/personnel/create">
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
        onView={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhân sự..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhân sự này? Hoạt động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
