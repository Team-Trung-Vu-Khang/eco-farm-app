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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

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
      code: "SOIL_PREP",
      name: "Máy làm đất và chuẩn bị đất",
      description:
        "Máy kéo nông nghiệp (tractor), máy đào mương, đắp bờ, máy đào hố trồng cây, máy xới đất, máy cày mini, máy bừa, máy phay",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "PLANTING",
      name: "Máy trồng trọt và gieo sạ",
      description:
        "Máy gieo hạt, máy trồng cây, máy cấy lúa, máy sạ lúa theo khóm",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "CARE_PROTECT",
      name: "Máy chăm sóc và bảo vệ",
      description:
        "Máy phun thuốc trừ sâu/phun phân bón (máy phun đeo vai, máy phun tự hành), máy cắt cỏ cầm tay, máy tưới tiêu (bơm nước, hệ thống tưới nhỏ giọt)",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "HARVESTING",
      name: "Máy thu hoạch",
      description:
        "Máy gặt lúa kiểu xếp dãy, máy gặt đập liên hợp (combine harvester), máy thu hoạch rau hoa, máy đập tuốt quả đậu, máy thu hoạch cỏ, máy đóng kiện rơm",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "POST_HARVEST",
      name: "Máy chế biến và xử lý sau thu hoạch",
      description:
        "Máy xát trắng gạo, máy đánh bóng gạo, máy sàng tạp chất gạo, máy tách màu nông sản, máy xay xát cà phê, máy phân loại cà phê, máy làm héo vò chè, máy vùi phân hữu cơ, máy đảo trộn phân bón",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 6,
      code: "LIVESTOCK",
      name: "Máy chăn nuôi",
      description:
        "Máy nghiền/trộn thức ăn chăn nuôi, máy ép viên thức ăn, máy cung cấp thức ăn tự động, máy đếm trứng gia cầm, máy thái rau củ cho gia súc",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 7,
      code: "AQUACULTURE",
      name: "Máy thủy sản",
      description: "Máy quạt nước cho ao nuôi, máy sục khí, máy cho ăn tự động",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      code: "OTHER",
      name: "Máy khác",
      description: "Máy đóng gói nông sản, máy sấy thực phẩm, máy cuốn rơm",
      status: "active",
      createdAt: "2024-01-17",
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
