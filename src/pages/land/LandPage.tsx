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
import useLandStore, { type Land } from "../../stores/useLandStore";

export default function LandPage() {
  const { toast } = useToast();
  const { lands: data, addLand, updateLand, deleteLand } = useLandStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Land | null>(null);
  const [deleteItem, setDeleteItem] = useState<Land | null>(null);
  const [formData, setFormData] = useState<Partial<Land>>({
    code: "",
    name: "",
    image: "",
    description: "",
  });

  const columns: Column<Land>[] = [
    { key: "code", label: "Mã" },
    {
      key: "image",
      label: "Hình ảnh",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="item"
            className="w-10 h-10 object-cover rounded-md border"
          />
        ) : null,
    },
    { key: "name", label: "Tên loại đất" },
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
    setFormData({ code: "", name: "", image: "", description: "" });
    setFormOpen(true);
  };

  const handleEdit = (item: Land) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      image: item.image || "",
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Land) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateLand(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin loại đất",
      });
    } else {
      addLand({
        code: formData.code || "",
        name: formData.name || "",
        image: formData.image,
        description: formData.description || "",
      });
      toast({ title: "Thành công", description: "Đã thêm loại đất mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteLand(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa loại đất" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý đất"
      description="Phân loại và quản lý các loại đất canh tác"
      actions={
        <Button onClick={handleAdd} data-testid="add-land">
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại đất
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại đất..."
      />

      <FormDialog
        size="lg"
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa loại đất" : "Thêm loại đất mới"}
        onSubmit={handleSubmit}
      >
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã loại đất</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: DAT001"
              data-testid="input-code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên loại đất</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Đất phù sa"
              data-testid="input-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Hình ảnh</Label>
            <div className="flex flex-col gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, image: url });
                  }
                }}
                data-testid="input-image"
              />
              <div className="text-sm text-gray-500">
                Hoặc nhập URL hình ảnh:
              </div>
              <Input
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            {formData.image && (
              <div className="mt-2 relative w-full h-40">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x200?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về loại đất"
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
        description="Bạn có chắc chắn muốn xóa loại đất này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
