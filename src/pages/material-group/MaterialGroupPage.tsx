import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminLayout,
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

interface MaterialGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const MaterialGroupPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<MaterialGroup[]>([
    {
      id: 1,
      code: "SEED",
      name: "Hạt giống",
      description: "Các loại hạt giống cây trồng",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "FERTILIZER",
      name: "Phân bón",
      description: "Phân hữu cơ, vô cơ, vi sinh...",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "PESTICIDE",
      name: "Thuốc BVTV",
      description: "Thuốc trừ sâu, diệt cỏ, trừ bệnh...",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "EQUIPMENT",
      name: "Dụng cụ - Máy móc",
      description: "Máy cày, cuốc, xẻng, hệ thống tưới...",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "OTHER",
      name: "Vật tư khác",
      description: "Bao bì, lưới, dây buộc...",
      status: "active",
      createdAt: "2024-01-14",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<MaterialGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<MaterialGroup | null>(null);

  const [formData, setFormData] = useState<
    Omit<MaterialGroup, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<MaterialGroup>[] = [
    { key: "code", label: "Mã nhóm" },
    { key: "name", label: "Tên nhóm" },
    { key: "description", label: "Mô tả" },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: MaterialGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: MaterialGroup) => {
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
        description: "Đã cập nhật danh mục vật tư",
      });
    } else {
      const newItem: MaterialGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục vật tư mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục vật tư",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục vật tư"
      description="Quản lý danh sách các nhóm vật tư (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-material-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm vật tư..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm vật tư" : "Thêm nhóm vật tư mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã nhóm</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: SEED, FERTILIZER..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên nhóm</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Hạt giống..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về nhóm vật tư..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm vật tư này?"
      />
    </AdminLayout>
  );
};

export default MaterialGroupPage;
