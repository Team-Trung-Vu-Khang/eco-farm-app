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

interface FertilizerGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const FertilizerGroupPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<FertilizerGroup[]>([
    {
      id: 1,
      code: "ORGANIC",
      name: "Phân hữu cơ",
      description: "Phân chuồng, phân xanh, phân rác...",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "INORGANIC",
      name: "Phân vô cơ",
      description: "Phân đạm, lân, kali, NPK...",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "MICROBIAL",
      name: "Phân sinh học",
      description: "Chế phẩm sinh học, nấm đối kháng...",
      status: "active",
      createdAt: "2024-01-12",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<FertilizerGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<FertilizerGroup | null>(null);

  const [formData, setFormData] = useState<
    Omit<FertilizerGroup, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<FertilizerGroup>[] = [
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

  const handleEdit = (item: FertilizerGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: FertilizerGroup) => {
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
        description: "Đã cập nhật danh mục phân bón",
      });
    } else {
      const newItem: FertilizerGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục phân bón mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục phân bón",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục phân bón"
      description="Quản lý danh sách các nhóm phân bón (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-fertilizer-group">
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
        searchPlaceholder="Tìm kiếm nhóm phân bón..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm phân bón" : "Thêm nhóm phân bón mới"}
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
                placeholder="VD: ORGANIC, NPK..."
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
                placeholder="VD: Phân hữu cơ..."
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
              placeholder="Mô tả chi tiết về nhóm phân bón..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm phân bón này?"
      />
    </AdminLayout>
  );
};

export default FertilizerGroupPage;
