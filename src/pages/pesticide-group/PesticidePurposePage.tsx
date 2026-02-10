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

interface PesticidePurpose {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const PesticidePurposePage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<PesticidePurpose[]>([
    {
      id: 1,
      code: "INSECTICIDE",
      name: "Thuốc trừ sâu",
      description: "Phòng trừ sâu, nhện, rầy, sâu cuốn lá, sâu đục thân",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "FUNGICIDE",
      name: "Thuốc trừ bệnh",
      description: "Phòng trừ nấm, vi khuẩn, virus gây bệnh",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "HERBICIDE",
      name: "Thuốc trừ cỏ",
      description: "Diệt cỏ dại",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "RODENTICIDE",
      name: "Thuốc trừ chuột",
      description: "Diệt chuột",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "MOLLUSCICIDE",
      name: "Thuốc trừ ốc",
      description: "Diệt ốc sên, ốc bươu vàng",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 6,
      code: "PGR",
      name: "Thuốc điều hòa sinh trưởng",
      description:
        "Kích thích hoặc ức chế sinh trưởng cây trồng (làm trái to, ra hoa trái vụ)",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 7,
      code: "ATTRACTANT",
      name: "Chất dẫn dụ côn trùng",
      description: "Thu hút côn trùng để bẫy",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      code: "ADJUVANT",
      name: "Chất hỗ trợ",
      description: "Tăng hiệu quả bám dính, lan tỏa của thuốc (chất trải)",
      status: "active",
      createdAt: "2024-01-17",
    },
    {
      id: 9,
      code: "OTHER",
      name: "Các nhóm khác",
      description:
        "Thuốc trừ mối, thuốc bảo quản lâm sản, thuốc khử trùng kho, thuốc xử lý hạt giống, thuốc bảo quản nông sản sau thu hoạch",
      status: "active",
      createdAt: "2024-01-18",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticidePurpose | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticidePurpose | null>(null);

  const [formData, setFormData] = useState<
    Omit<PesticidePurpose, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<PesticidePurpose>[] = [
    { key: "code", label: "Mã công dụng" },
    { key: "name", label: "Tên công dụng" },
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

  const handleEdit = (item: PesticidePurpose) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticidePurpose) => {
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
        description: "Đã cập nhật phân loại công dụng",
      });
    } else {
      const newItem: PesticidePurpose = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm phân loại công dụng mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa phân loại công dụng",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo công dụng</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các loại công dụng của thuốc BVTV
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-purpose">
          <Plus className="w-4 h-4 mr-2" />
          Thêm công dụng
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo công dụng..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem
            ? "Chỉnh sửa phân loại công dụng"
            : "Thêm phân loại công dụng mới"
        }
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã công dụng</Label>
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
              <Label htmlFor="name">Tên công dụng</Label>
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
              placeholder="Mô tả chi tiết về công dụng..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại công dụng này?"
      />
    </div>
  );
};

export default PesticidePurposePage;
