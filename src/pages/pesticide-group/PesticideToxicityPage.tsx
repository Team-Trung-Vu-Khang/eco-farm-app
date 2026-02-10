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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";

interface PesticideToxicity {
  id: number;
  code: string;
  name: string;
  whoClass: "Ia" | "Ib" | "II" | "III" | "IV";
  colorBand: string;
  ld50Range: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const PesticideToxicityPage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<PesticideToxicity[]>([
    {
      id: 1,
      code: "WHO_IA",
      name: "Rất độc",
      whoClass: "Ia",
      colorBand: "#EF4444",
      ld50Range: "LD50 < 5 mg/kg (rắn) hoặc < 20 mg/kg (lỏng)",
      description: "Nhóm Ia - Băng màu đỏ - Cực kỳ nguy hiểm",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "WHO_IB",
      name: "Độc",
      whoClass: "Ib",
      colorBand: "#DC2626",
      ld50Range: "LD50 5-50 mg/kg (rắn) hoặc 20-200 mg/kg (lỏng)",
      description: "Nhóm Ib - Băng màu đỏ - Rất nguy hiểm",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "WHO_II",
      name: "Nguy hiểm",
      whoClass: "II",
      colorBand: "#FBBF24",
      ld50Range: "LD50 50-500 mg/kg (rắn) hoặc 200-2000 mg/kg (lỏng)",
      description: "Nhóm II - Băng màu vàng - Cần thận trọng",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "WHO_III",
      name: "Cẩn thận",
      whoClass: "III",
      colorBand: "#3B82F6",
      ld50Range: "LD50 > 500 mg/kg",
      description: "Nhóm III - Băng màu xanh da trời - Độc tính trung bình",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "WHO_IV",
      name: "Ít độc / An toàn tương đối",
      whoClass: "IV",
      colorBand: "#10B981",
      ld50Range: "LD50 rất cao",
      description: "Nhóm IV - Băng màu xanh lá - Tương đối an toàn",
      status: "active",
      createdAt: "2024-01-14",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideToxicity | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideToxicity | null>(null);

  const [formData, setFormData] = useState<
    Omit<PesticideToxicity, "id" | "createdAt">
  >({
    code: "",
    name: "",
    whoClass: "III",
    colorBand: "#3B82F6",
    ld50Range: "",
    description: "",
    status: "active",
  });

  const columns: Column<PesticideToxicity>[] = [
    { key: "whoClass", label: "Nhóm WHO" },
    { key: "name", label: "Tên phân loại" },
    { key: "ld50Range", label: "Ngưỡng LD50" },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      whoClass: "III",
      colorBand: "#3B82F6",
      ld50Range: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: PesticideToxicity) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      whoClass: item.whoClass,
      colorBand: item.colorBand,
      ld50Range: item.ld50Range,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideToxicity) => {
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
        description: "Đã cập nhật phân loại độ độc tính",
      });
    } else {
      const newItem: PesticideToxicity = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm phân loại độ độc tính mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa phân loại độ độc tính",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo độ độc tính</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý mức độ độc tính của thuốc BVTV theo tiêu chuẩn WHO
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-toxicity">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mức độ độc tính
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo độ độc tính..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem
            ? "Chỉnh sửa phân loại độ độc tính"
            : "Thêm phân loại độ độc tính mới"
        }
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã phân loại</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: WHO_IA, WHO_IB..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên phân loại</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Rất độc, Độc..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whoClass">Nhóm WHO</Label>
              <Select
                value={formData.whoClass}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    whoClass: value as "Ia" | "Ib" | "II" | "III" | "IV",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm WHO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ia">Ia - Rất độc</SelectItem>
                  <SelectItem value="Ib">Ib - Độc</SelectItem>
                  <SelectItem value="II">II - Nguy hiểm</SelectItem>
                  <SelectItem value="III">III - Cẩn thận</SelectItem>
                  <SelectItem value="IV">IV - Ít độc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="colorBand">Màu băng</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="colorBand"
                  value={formData.colorBand}
                  onChange={(e) =>
                    setFormData({ ...formData, colorBand: e.target.value })
                  }
                  className="w-20 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={formData.colorBand}
                  onChange={(e) =>
                    setFormData({ ...formData, colorBand: e.target.value })
                  }
                  placeholder="#EF4444"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ld50Range">Ngưỡng LD50</Label>
            <Input
              id="ld50Range"
              value={formData.ld50Range}
              onChange={(e) =>
                setFormData({ ...formData, ld50Range: e.target.value })
              }
              placeholder="VD: LD50 < 5 mg/kg (rắn) hoặc < 20 mg/kg (lỏng)"
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
              placeholder="Mô tả chi tiết về mức độ độc tính..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại độ độc tính này?"
      />
    </div>
  );
};

export default PesticideToxicityPage;
