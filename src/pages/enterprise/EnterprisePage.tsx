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

interface Enterprise {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "enterprise" | "farm" | "cooperative";
  classification: "production" | "processing" | "trading" | "service";
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Enterprise[] = [
  {
    id: 1,
    code: "DN001",
    name: "Công ty TNHH Nông nghiệp Xanh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_8OFT04S0wG7vHTRJMrpWD-pki8RPR_wSw&s",
    type: "enterprise",
    classification: "production",
    taxCode: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@nongnghiepxanh.vn",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "NH001",
    name: "Nông hộ Nguyễn Văn A",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "farm",
    classification: "production",
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    code: "DN002",
    name: "HTX Nông sản Sạch Bình Dương",
    image:
      "https://ocop.langson.gov.vn/api/user-blob/82a71ab1-9a6f-6a22-c832-65949c334e71/2024/11/21/logo-trangdinh.jpg",
    type: "cooperative",
    classification: "trading",
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "NH002",
    name: "Trang trại Trần Thị B",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    type: "farm",
    classification: "processing",
    taxCode: "",
    address: "Ấp 3, Xã Long An, Huyện Long Thành",
    phone: "0934567890",
    email: "tranthib@gmail.com",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    code: "DN003",
    name: "Công ty CP Xuất khẩu Trái cây Việt",
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80",
    type: "enterprise",
    classification: "trading",
    taxCode: "1122334455",
    address: "789 Đường DEF, Quận Bình Thạnh, TP.HCM",
    phone: "0945678901",
    email: "export@traicayviet.com",
    status: "inactive",
    createdAt: "2024-01-20",
  },
];

export default function EnterprisePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Enterprise[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Enterprise | null>(null);

  const columns: Column<Enterprise>[] = [
    { key: "code", label: "Mã" },
    {
      key: "image",
      label: "Hình ảnh",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="enterprise"
            className="w-10 h-10 object-cover rounded-md border"
          />
        ) : null,
    },
    { key: "name", label: "Tên đơn vị" },
    {
      key: "type",
      label: "Loại hình",
      render: (value) => (
        <Badge
          variant={
            value === "enterprise"
              ? "default"
              : value === "cooperative"
                ? "secondary"
                : "outline"
          }
        >
          {value === "enterprise"
            ? "Doanh nghiệp"
            : value === "cooperative"
              ? "Hợp tác xã"
              : "Nông hộ"}
        </Badge>
      ),
    },
    {
      key: "classification",
      label: "Phân loại",
      render: (value) => {
        const labels: Record<string, string> = {
          production: "Sản xuất",
          processing: "Chế biến",
          trading: "Thương mại",
          service: "Dịch vụ",
        };
        return labels[value] || value;
      },
    },
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
      key: "type",
      label: "Loại hình",
      options: [
        { label: "Doanh nghiệp", value: "enterprise" },
        { label: "Hợp tác xã", value: "cooperative" },
        { label: "Nông hộ", value: "farm" },
      ],
    },
    {
      key: "classification",
      label: "Phân loại",
      options: [
        { label: "Sản xuất", value: "production" },
        { label: "Chế biến", value: "processing" },
        { label: "Thương mại", value: "trading" },
        { label: "Dịch vụ", value: "service" },
      ],
    },
  ];

  const handleDelete = (item: Enterprise) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa đơn vị khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý doanh nghiệp / Nông hộ"
      description="Quản lý thông tin các doanh nghiệp, hợp tác xã và nông hộ trong hệ thống"
      actions={
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/enterprise/${item.id}`)}
        onEdit={(item) => setLocation(`/enterprise/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp/nông hộ..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa đơn vị này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
