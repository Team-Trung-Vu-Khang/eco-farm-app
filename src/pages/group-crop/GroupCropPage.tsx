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
import { Hash, Leaf, Plus } from "lucide-react";
import { useState } from "react";

import useGroupCropStore from "../../stores/useGroupCropStore";
import type { GroupCrop } from "./types";

export default function GroupCropPage() {
  const { toast } = useToast();
  const { groupCrops, addGroupCrop, updateGroupCrop, deleteGroupCrop } =
    useGroupCropStore();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<GroupCrop | null>(null);
  const [deleteItem, setDeleteItem] = useState<GroupCrop | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    biological: "",
    description: "",
  });

  const columns: Column<GroupCrop>[] = [
    {
      key: "code",
      label: "Mã nhóm cây",
      render: (value: string) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
          <Hash className="w-3 h-3 opacity-60" />
          {value}
        </div>
      ),
    },
    {
      key: "name",
      label: "Tên nhóm cây",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-600" />
          <span className="font-bold text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: "biological",
      label: "Đặc tính sinh học",
      render: (value: string) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-50">
          {value}
        </p>
      ),
    },
    {
      key: "description",
      label: "Ghi chú",
      render: (value: string) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
          {value}
        </p>
      ),
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      biological: "",
      description: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: GroupCrop) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      biological: item.biological,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: GroupCrop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateGroupCrop(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin cây trồng",
      });
    } else {
      addGroupCrop(formData);
      toast({ title: "Thành công", description: "Đã thêm cây trồng mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteGroupCrop(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý nhóm cây trồng"
      description="Danh mục các nhóm cây trồng có trên thị trường"
      actions={
        <Button
          className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <DataTable
        data={groupCrops}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mã, tên loại cây..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={
          editItem ? "Chỉnh sửa nhóm cây trồng" : "Thêm mới nhóm cây trồng"
        }
        size="xl"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6 pt-2 pb-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="font-semibold">
                Mã nhóm cây *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CC001"
                className="focus-visible:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biological" className="font-semibold">
                Đặc tính sinh học
              </Label>
              <Input
                id="biological"
                value={formData.biological}
                onChange={(e) =>
                  setFormData({ ...formData, biological: e.target.value })
                }
                placeholder="VD: Cây lâu năm"
                className="focus-visible:ring-green-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">
              Tên nhóm cây *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Cây có múi"
              className="focus-visible:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Ghi chú
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập ghi chú chi tiết về nhóm cây..."
              rows={4}
              className="resize-none focus-visible:ring-green-500"
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
