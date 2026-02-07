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

interface EquipmentGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const EquipmentGroupPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<EquipmentGroup[]>([
    {
      id: 1,
      code: "TRACTOR",
      name: "Máy cày - Máy kéo",
      description: "Các loại máy cày, máy kéo dùng trong làm đất",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "HARVESTER",
      name: "Máy gặt đập",
      description: "Máy gặt đập liên hợp, máy thu hoạch",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "IRRIGATION",
      name: "Thiết bị tưới",
      description: "Máy bơm, hệ thống tưới nhỏ giọt, phun mưa",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "SPRAYER",
      name: "Máy phun thuốc",
      description: "Bình phun điện, máy phun thuốc trừ sâu",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "TOOL",
      name: "Dụng cụ cầm tay",
      description: "Cuốc, xẻng, liềm, kéo cắt cành...",
      status: "active",
      createdAt: "2024-01-14",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EquipmentGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<EquipmentGroup | null>(null);

  const [formData, setFormData] = useState<
    Omit<EquipmentGroup, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<EquipmentGroup>[] = [
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

  const handleEdit = (item: EquipmentGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EquipmentGroup) => {
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
        description: "Đã cập nhật danh mục máy móc",
      });
    } else {
      const newItem: EquipmentGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục máy móc mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục máy móc",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục máy móc"
      description="Quản lý danh sách các nhóm máy móc, dụng cụ (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-equipment-group">
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
        searchPlaceholder="Tìm kiếm nhóm máy móc..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm máy móc" : "Thêm nhóm máy móc mới"}
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
                placeholder="VD: TRACTOR, TOOL..."
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
                placeholder="VD: Máy cày..."
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
              placeholder="Mô tả chi tiết về nhóm máy móc..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm máy móc này?"
      />
    </AdminLayout>
  );
};

export default EquipmentGroupPage;
