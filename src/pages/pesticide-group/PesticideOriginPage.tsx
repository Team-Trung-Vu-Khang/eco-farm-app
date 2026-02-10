import { useState } from "react";
import { Plus } from "lucide-react";
import {
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

interface PesticideOrigin {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const PesticideOriginPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<PesticideOrigin[]>([
    {
      id: 1,
      code: "CHEMICAL",
      name: "Thuốc hóa học",
      description:
        "Hóa học tổng hợp: Clo hữu cơ, phospho hữu cơ, carbamat, pyrethroid, neonicotinoid",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "BIOLOGICAL",
      name: "Thuốc sinh học",
      description:
        "Từ vi sinh vật, nấm, vi khuẩn (Bacillus thuringiensis), tinh dầu thực vật, pheromone",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "NATURAL",
      name: "Thuốc thảo mộc / Tự nhiên",
      description: "Chiết xuất neem, tỏi ớt, các nguồn thực vật tự nhiên",
      status: "active",
      createdAt: "2024-01-12",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideOrigin | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideOrigin | null>(null);

  const [formData, setFormData] = useState<
    Omit<PesticideOrigin, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<PesticideOrigin>[] = [
    { key: "code", label: "Mã nguồn gốc" },
    { key: "name", label: "Tên nguồn gốc" },
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

  const handleEdit = (item: PesticideOrigin) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideOrigin) => {
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
        description: "Đã cập nhật phân loại nguồn gốc",
      });
    } else {
      const newItem: PesticideOrigin = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm phân loại nguồn gốc mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa phân loại nguồn gốc",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo nguồn gốc</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý nguồn gốc và thành phần của thuốc BVTV
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-origin">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nguồn gốc
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo nguồn gốc..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem
            ? "Chỉnh sửa phân loại nguồn gốc"
            : "Thêm phân loại nguồn gốc mới"
        }
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã nguồn gốc</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CHEMICAL, BIOLOGICAL..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên nguồn gốc</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Thuốc hóa học..."
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
              placeholder="Mô tả chi tiết về nguồn gốc và thành phần..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại nguồn gốc này?"
      />
    </div>
  );
};

export default PesticideOriginPage;
