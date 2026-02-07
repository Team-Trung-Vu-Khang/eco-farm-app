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

interface PesticideGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const PesticideGroupPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<PesticideGroup[]>([
    {
      id: 1,
      code: "INSECTICIDE",
      name: "Thuốc trừ sâu",
      description: "Diệt các loại sâu hại cây trồng",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "HERBICIDE",
      name: "Thuốc trừ cỏ",
      description: "Diệt cỏ dại",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "FUNGICIDE",
      name: "Thuốc trừ bệnh",
      description: "Diệt nấm và vi khuẩn gây bệnh",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "RODENTICIDE",
      name: "Thuốc diệt chuột",
      description: "Diệt chuột và động vật gặm nhấm",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "MOLLUSCICIDE",
      name: "Thuốc diệt ốc",
      description: "Diệt ốc bươu vàng và các loại ốc hại",
      status: "active",
      createdAt: "2024-01-14",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideGroup | null>(null);

  const [formData, setFormData] = useState<
    Omit<PesticideGroup, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<PesticideGroup>[] = [
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

  const handleEdit = (item: PesticideGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideGroup) => {
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
        description: "Đã cập nhật danh mục thuốc BVTV",
      });
    } else {
      const newItem: PesticideGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục thuốc BVTV mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục thuốc BVTV",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục thuốc BVTV"
      description="Quản lý danh sách các nhóm thuốc bảo vệ thực vật (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-pesticide-group">
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
        searchPlaceholder="Tìm kiếm nhóm thuốc BVTV..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem ? "Chỉnh sửa nhóm thuốc BVTV" : "Thêm nhóm thuốc BVTV mới"
        }
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
                placeholder="VD: INSECTICIDE, HERBICIDE..."
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
                placeholder="VD: Thuốc trừ sâu..."
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
              placeholder="Mô tả chi tiết về nhóm thuốc BVTV..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm thuốc BVTV này?"
      />
    </AdminLayout>
  );
};

export default PesticideGroupPage;
