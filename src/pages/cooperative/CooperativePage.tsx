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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface Cooperative {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "cooperative";
  classification: ("production" | "processing" | "trading" | "service")[];
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Cooperative[] = [
  {
    id: 2,
    code: "HTX001",
    name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "cooperative",
    classification: ["production", "trading"],
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    code: "HTX002",
    name: "Hợp tác xã Nông sản Sạch Bình Dương",
    image:
      "https://ocop.langson.gov.vn/api/user-blob/82a71ab1-9a6f-6a22-c832-65949c334e71/2024/11/21/logo-trangdinh.jpg",
    type: "cooperative",
    classification: ["trading", "service"],
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "HTX003",
    name: "Hợp tác xã Nông sản Sạch Bình Dương 3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_8OFT04S0wG7vHTRJMrpWD-pki8RPR_wSw&s",
    type: "cooperative",
    classification: ["processing", "service"],
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
];

export default function CooperativePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Cooperative[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Cooperative | null>(null);

  const columns: Column<Cooperative>[] = [
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
      key: "classification",
      label: "Phân loại",
      render: (value) => {
        const labels: Record<string, string> = {
          production: "Sản xuất",
          processing: "Chế biến",
          trading: "Thương mại",
          service: "Dịch vụ",
        };
        return value.map((item: string) => {
          return (
            <Badge key={item} variant="secondary" className="mr-1">
              {labels[item]}
            </Badge>
          );
        });
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

  const handleDelete = (item: Cooperative) => {
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
      title="Quản lý hợp tác xã"
      description="Quản lý thông tin các hợp tác xã trong hệ thống"
      actions={
        <Link href="/cooperative/create">
          <Button data-testid="add-cooperative">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/cooperative/${item.id}`)}
        onEdit={(item) => setLocation(`/cooperative/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm hợp tác xã..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa hợp tác xã này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
