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
import useTerrainStore, { type Terrain } from "../../stores/useTerrainStore";

export default function TerrainPage() {
  const { toast } = useToast();
  const {
    terrains: data,
    addTerrain,
    updateTerrain,
    deleteTerrain,
  } = useTerrainStore();

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
      updateTerrain(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin địa hình",
      });
    } else {
      addTerrain(formData);
      toast({ title: "Thành công", description: "Đã thêm địa hình mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTerrain(deleteItem.id);
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
