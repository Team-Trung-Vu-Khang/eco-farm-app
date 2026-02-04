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

interface EnterpriseType {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const EnterpriseTypePage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<EnterpriseType[]>([
    {
      id: 1,
      code: "HTX",
      name: "Hợp tác xã",
      description: "Tổ chức kinh tế tập thể",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "DNTN",
      name: "Doanh nghiệp tư nhân",
      description: "Doanh nghiệp do một cá nhân làm chủ",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "TNHH",
      name: "Công ty TNHH",
      description: "Công ty trách nhiệm hữu hạn",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "CP",
      name: "Công ty cổ phần",
      description: "Công ty có vốn điều lệ chia thành nhiều phần bằng nhau",
      status: "active",
      createdAt: "2024-01-13",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseType | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseType | null>(null);

  const [formData, setFormData] = useState<
    Omit<EnterpriseType, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<EnterpriseType>[] = [
    { key: "code", label: "Mã loại hình" },
    { key: "name", label: "Tên loại hình" },
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

  const handleEdit = (item: EnterpriseType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseType) => {
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
        description: "Đã cập nhật loại hình doanh nghiệp",
      });
    } else {
      const newItem: EnterpriseType = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm loại hình doanh nghiệp mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa loại hình doanh nghiệp",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Loại hình doanh nghiệp"
      description="Quản lý danh sách các loại hình doanh nghiệp (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-enterprise-type">
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại hình
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại hình..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa loại hình" : "Thêm loại hình mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã loại hình</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: HTX, TNHH..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại hình</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Hợp tác xã..."
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
              placeholder="Mô tả chi tiết về loại hình doanh nghiệp..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa loại hình doanh nghiệp này?"
      />
    </AdminLayout>
  );
};

export default EnterpriseTypePage;
