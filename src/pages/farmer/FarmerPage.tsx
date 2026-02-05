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

interface Farner {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "enterprise" | "farm" | "cooperative";
  classification: ("production" | "processing" | "trading" | "service")[];
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Farner[] = [
  {
    id: 1,
    code: "NH001",
    name: "Nông hộ Nguyễn Văn A",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "farm",
    classification: ["production", "trading"],
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 2,
    code: "NH002",
    name: "Nông hộ Trần Thị B",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    type: "farm",
    classification: ["processing", "trading"],
    taxCode: "",
    address: "Ấp 3, Xã Long An, Huyện Long Thành",
    phone: "0934567890",
    email: "tranthib@gmail.com",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 3,
    code: "NH003",
    name: "Nông hộ Trần Thị C",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    type: "farm",
    classification: ["processing", "trading"],
    taxCode: "",
    address: "Ấp 3, Xã Long An, Huyện Long Thành",
    phone: "0934567890",
    email: "tranthic@gmail.com",
    status: "inactive",
    createdAt: "2024-01-18",
  },
];

export default function FarmerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Farner[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Farner | null>(null);

  const columns: Column<Farner>[] = [
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

  const handleDelete = (item: Farner) => {
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
      title="Quản lý nông hộ"
      description="Quản lý thông tin các nông hộ trong hệ thống"
      actions={
        <Link href="/farmer/create">
          <Button data-testid="add-farmer">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/farmer/${item.id}`)}
        onEdit={(item) => setLocation(`/farmer/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nông hộ..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nông hộ này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
