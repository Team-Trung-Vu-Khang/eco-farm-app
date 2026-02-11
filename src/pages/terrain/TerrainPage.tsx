import { useState } from "react";
import { Plus } from "lucide-react";
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

interface Terrain {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Terrain[] = [
  {
    id: 1,
    code: "DH001",
    name: "Đồng bằng",
    description:
      "Địa hình bằng phẳng, độ dốc thấp, phù hợp canh tác lúa và hoa màu",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "DH002",
    name: "Trung du",
    description: "Vùng chuyển tiếp giữa miền núi và đồng bằng, độ dốc vừa phải",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "DH003",
    name: "Đồi",
    description: "Địa hình dốc nhẹ, bát úp, phù hợp cây công nghiệp và ăn quả",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 4,
    code: "DH004",
    name: "Núi",
    description: "Địa hình chia cắt mạnh, độ dốc cao, phù hợp lâm nghiệp",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 5,
    code: "DH005",
    name: "Cao nguyên",
    description: "Vùng đất tương đối bằng phẳng ở độ cao lớn, khí hậu ôn hòa",
    status: "active",
    createdAt: "2024-01-17",
  },
  {
    id: 6,
    code: "DH006",
    name: "Ven biển",
    description:
      "Khu vực giáp biển, đất cát hoặc nhiễm mặn, chịu ảnh hưởng thủy triều",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 7,
    code: "DH007",
    name: "Bán ngập / trũng",
    description:
      "Khu vực thường xuyên ngập nước hoặc trũng thấp, phù hợp thủy sản",
    status: "active",
    createdAt: "2024-01-18",
  },
];

export default function TerrainPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Terrain[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Terrain | null>(null);
  const [deleteItem, setDeleteItem] = useState<Terrain | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  const columns: Column<Terrain>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên địa hình" },
    { key: "description", label: "Mô tả" },
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
    setFormData({ code: "", name: "", description: "" });
    setFormOpen(true);
  };

  const handleEdit = (item: Terrain) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Terrain) => {
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
        description: "Đã cập nhật thông tin địa hình",
      });
    } else {
      const newItem: Terrain = {
        id: Date.now(),
        ...formData,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm địa hình mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa địa hình" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý địa hình"
      description="Phân loại và quản lý các loại địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-terrain">
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa hình
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm địa hình..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa địa hình" : "Thêm địa hình mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã địa hình</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: DH001"
              data-testid="input-code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên địa hình</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Đồng bằng"
              data-testid="input-name"
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
              placeholder="Mô tả chi tiết về loại địa hình"
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
        description="Bạn có chắc chắn muốn xóa địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
