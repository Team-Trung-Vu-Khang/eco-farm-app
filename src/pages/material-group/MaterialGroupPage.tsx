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
      code: "HAND_TOOL",
      name: "Công cụ cầm tay",
      description: "Cuốc, xẻng, liềm, kéo tỉa cành, dao cắt",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "IRRIGATION",
      name: "Hệ thống tưới",
      description: "Ống tưới, vòi phun, máy bơm nước, hệ thống tưới nhỏ giọt",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "PROTECTIVE",
      name: "Bảo hộ lao động",
      description: "Găng tay, khẩu trang, quần áo bảo hộ, giày ủng",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "PACKAGING",
      name: "Bao bì đóng gói",
      description: "Bao PP, thùng carton, lưới, túi nilon, rổ nhựa",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "GREENHOUSE",
      name: "Vật tư nhà kính",
      description:
        "Màng phủ, lưới che nắng, khung nhà kính, hệ thống thông gió",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 6,
      code: "SUPPORT",
      name: "Vật tư hỗ trợ",
      description: "Dây buộc, cọc tre, giàn leo, lưới chống côn trùng",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 7,
      code: "MEASUREMENT",
      name: "Thiết bị đo lường",
      description: "Máy đo pH, nhiệt kế, ẩm kế, máy đo độ ẩm đất",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      code: "OTHER",
      name: "Vật tư khác",
      description: "Các vật tư nông nghiệp khác chưa được phân loại",
      status: "active",
      createdAt: "2024-01-17",
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
