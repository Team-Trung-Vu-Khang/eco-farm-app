import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { useState } from "react";
import { Link } from "wouter";

import { Plus } from "lucide-react";
interface Crop {
  id: number;
  code: string;
  name: string;
  scientificName: string;
  category: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Crop[] = [
  {
    id: 1,
    code: "CT001",
    name: "Sầu riêng",
    scientificName: "Durio zibethinus",
    category: "Cây ăn quả",
    description: "Cây ăn quả nhiệt đới, trái có mùi đặc trưng",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "CT002",
    name: "Xoài",
    scientificName: "Mangifera indica",
    category: "Cây ăn quả",
    description: "Cây ăn quả phổ biến tại Việt Nam",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "CT003",
    name: "Bưởi",
    scientificName: "Citrus maxima",
    category: "Cây có múi",
    description: "Cây có múi, trái lớn",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "CT004",
    name: "Thanh long",
    scientificName: "Hylocereus undatus",
    category: "Cây ăn quả",
    description: "Cây thuộc họ xương rồng",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "CT005",
    name: "Cà phê",
    scientificName: "Coffea",
    category: "Cây công nghiệp",
    description: "Cây công nghiệp lâu năm",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "CT006",
    name: "Tiêu",
    scientificName: "Piper nigrum",
    category: "Cây gia vị",
    description: "Cây gia vị leo giàn",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "CT007",
    name: "Điều",
    scientificName: "Anacardium occidentale",
    category: "Cây công nghiệp",
    description: "Cây công nghiệp, hạt có giá trị cao",
    status: "inactive",
    createdAt: "2024-01-16",
  },
];

export default function GroupCropPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Crop[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Crop | null>(null);
  const [deleteItem, setDeleteItem] = useState<Crop | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    scientificName: "",
    category: "",
    description: "",
  });

  const columns: Column<Crop>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên cây trồng" },
    { key: "scientificName", label: "Tên khoa học" },
    {
      key: "category",
      label: "Phân loại",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    { key: "createdAt", label: "Ngày tạo" },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      scientificName: "",
      category: "",
      description: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Crop) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      scientificName: item.scientificName,
      category: item.category,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Crop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin cây trồng",
      });
    } else {
      const newItem: Crop = {
        id: Date.now(),
        ...formData,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm cây trồng mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý cây trồng"
      description="Danh mục các loại cây trồng có trên thị trường"
      actions={
        <Link href="/crop/create">
          <Button data-testid="add-crop">
            <Plus className="w-4 h-4 mr-2" />
            Thêm cây giống cây trồng
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm cây trồng..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem ? "Chỉnh sửa giống cây trồng" : "Thêm cây giống trồng mới"
        }
        size="lg"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã giống cây trồng</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CT001"
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Phân loại</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="VD: Cây ăn quả"
                data-testid="input-category"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên cây trồng</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Sầu riêng"
              data-testid="input-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scientificName">Tên khoa học</Label>
            <Input
              id="scientificName"
              value={formData.scientificName}
              onChange={(e) =>
                setFormData({ ...formData, scientificName: e.target.value })
              }
              placeholder="VD: Durio zibethinus"
              data-testid="input-scientificName"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về cây trồng"
              rows={3}
              data-testid="input-description"
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
