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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import usePositionStore, { type Position } from "../../stores/usePositionStore";

const POSITION_GROUPS = [
  "Nhóm quản lý – điều hành",
  "Nhóm kỹ thuật trồng trọt",
  "Nhóm bảo vệ thực vật",
  "Nhóm đất – phân bón – dinh dưỡng",
  "Nhóm tưới – hệ thống – nhà màng",
  "Nhóm giống – vườn ươm",
  "Nhóm thu hoạch – sơ chế – chất lượng",
  "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
  "Nhóm kho – vật tư – logistics",
  "Nhóm cơ giới – bảo trì",
  "Nhóm lao động trực tiếp",
];

const PositionPage = () => {
  const { toast } = useToast();

  // Zustand store
  const positions = usePositionStore((state) => state.positions);
  const addPosition = usePositionStore((state) => state.addPosition);
  const updatePosition = usePositionStore((state) => state.updatePosition);
  const deletePosition = usePositionStore((state) => state.deletePosition);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Position | null>(null);
  const [deleteItem, setDeleteItem] = useState<Position | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    group: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const columns: Column<Position>[] = [
    { key: "code", label: "Mã chức vụ" },
    { key: "name", label: "Tên chức vụ" },
    { key: "group", label: "Nhóm chức vụ" },
    { key: "description", label: "Mô tả" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
    { key: "createdAt", label: "Ngày tạo" },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      group: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Position) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      group: item.group,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Position) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updatePosition(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật chức vụ",
      });
    } else {
      addPosition(formData);
      toast({
        title: "Thành công",
        description: "Đã thêm chức vụ mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePosition(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chức vụ",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chức vụ"
      description="Quản lý chức vụ theo doanh nghiệp/nông hộ"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chức vụ
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={positions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chức vụ..."
        filters={[
          {
            key: "group",
            label: "Nhóm chức vụ",
            options: POSITION_GROUPS.map((group) => ({
              label: group,
              value: group,
            })),
          },
          {
            key: "status",
            label: "Trạng thái",
            options: [
              { label: "Hoạt động", value: "active" },
              { label: "Ngừng hoạt động", value: "inactive" },
            ],
          },
        ]}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã chức vụ *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: POS-GD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên chức vụ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Giám Đốc"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group">Nhóm chức vụ *</Label>
            <Select
              value={formData.group}
              onValueChange={(value) =>
                setFormData({ ...formData, group: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm chức vụ" />
              </SelectTrigger>
              <SelectContent>
                {POSITION_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả trách nhiệm và quyền hạn của chức vụ..."
              rows={4}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chức vụ này?"
      />
    </AdminLayout>
  );
};

export default PositionPage;
