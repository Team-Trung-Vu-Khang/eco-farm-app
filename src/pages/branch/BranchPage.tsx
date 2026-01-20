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

interface Branch {
  id: number;
  code: string;
  name: string;
  enterpriseName: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Branch[] = [
  {
    id: 1,
    code: "CN001",
    name: "Chi nhánh Miền Nam",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02839999888",
    email: "hcm@ecofarm.vn",
    address: "Quận 1, TP.HCM",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "CN002",
    name: "Chi nhánh Miền Trung",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02363888777",
    email: "dn@ecofarm.vn",
    address: "Hải Châu, Đà Nẵng",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "CN003",
    name: "Văn phòng Hà Nội",
    enterpriseName: "HTX Rau sạch Thanh Hà",
    phone: "02437776666",
    email: "thanhha_hn@gmail.com",
    address: "Hoàng Mai, Hà Nội",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    code: "CN004",
    name: "Kho vận Cần Thơ",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02923666555",
    email: "kho_cantho@ecofarm.vn",
    address: "Ninh Kiều, Cần Thơ",
    status: "inactive",
    createdAt: "2024-02-05",
  },
];

export default function BranchPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Branch[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Branch | null>(null);

  const columns: Column<Branch>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên chi nhánh" },
    { key: "enterpriseName", label: "Đơn vị chủ quản" },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
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
        { label: "Không hoạt động", value: "inactive" },
      ],
    },
  ];

  const handleDelete = (item: Branch) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chi nhánh"
      description="Quản lý danh sách chi nhánh của các đơn vị"
      actions={
        <Link href="/branch/create">
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
        onView={(item) => setLocation(`/branch/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/branch/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chi nhánh..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chi nhánh này? Dữ liệu liên quan có thể bị ảnh hưởng."
      />
    </AdminLayout>
  );
}
