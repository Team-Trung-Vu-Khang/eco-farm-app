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

interface Contact {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  entityName: string;
  note: string;
  status: "active" | "inactive";
}

const initialData: Contact[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    position: "Trưởng phòng",
    department: "Kinh doanh",
    entityName: "Công ty CP Nông nghiệp Xanh",
    note: "Liên hệ chính",
    status: "active",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@example.com",
    position: "Kế toán trưởng",
    department: "Kế toán",
    entityName: "HTX Rau sạch Thanh Hà",
    note: "Phụ trách thanh toán",
    status: "active",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@example.com",
    position: "Kỹ thuật viên",
    department: "Kỹ thuật",
    entityName: "Nông hộ Nguyễn Văn A",
    note: "",
    status: "inactive",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Contact[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Contact | null>(null);

  const columns: Column<Contact>[] = [
    { key: "fullName", label: "Họ và tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "department", label: "Phòng ban" },
    { key: "position", label: "Chức vụ" },
    { key: "entityName", label: "Đơn vị" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang làm việc", value: "active" },
        { label: "Đã nghỉ việc", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Kinh doanh", value: "Kinh doanh" },
        { label: "Kế toán", value: "Kế toán" },
        { label: "Kỹ thuật", value: "Kỹ thuật" },
        { label: "Hành chính", value: "Hành chính" },
      ],
    },
  ];

  const handleDelete = (item: Contact) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa liên hệ khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý thông tin liên hệ"
      description="Danh sách thông tin liên hệ của doanh nghiệp / nông hộ"
      actions={
        <Link href="/contact/create">
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
        onView={(item) => setLocation(`/contact/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/contact/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm liên hệ..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa liên hệ này? Hoạt động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
