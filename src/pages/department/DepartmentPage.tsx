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
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import useDepartmentStore, {
  type Department,
} from "../../stores/useDepartmentStore";

const DepartmentPage = () => {
  const { toast } = useToast();

  // Zustand store
  const departments = useDepartmentStore((state) => state.departments);
  const addDepartment = useDepartmentStore((state) => state.addDepartment);
  const updateDepartment = useDepartmentStore(
    (state) => state.updateDepartment,
  );
  const deleteDepartment = useDepartmentStore(
    (state) => state.deleteDepartment,
  );

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [deleteItem, setDeleteItem] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const columns: Column<Department>[] = [
    { key: "code", label: "Mã phòng ban" },
    { key: "name", label: "Tên phòng ban" },
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
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Department) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Department) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateDepartment(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật phòng ban",
      });
    } else {
      addDepartment(formData);
      toast({
        title: "Thành công",
        description: "Đã thêm phòng ban mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteDepartment(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa phòng ban",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý phòng ban"
      description="Quản lý phòng ban theo doanh nghiệp/nông hộ"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng ban
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm phòng ban..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã phòng ban *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: PB-KD"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên phòng ban *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Phòng Kinh Doanh"
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
              placeholder="Mô tả chức năng của phòng ban..."
              rows={4}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phòng ban này?"
      />
    </AdminLayout>
  );
};

export default DepartmentPage;
