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

interface EnterpriseGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const EnterpriseTypePage = () => {
  const { toast } = useToast();

  // Dữ liệu Nhóm tổ chức
  const [data, setData] = useState<EnterpriseGroup[]>([
    {
      id: 1,
      code: "DN",
      name: "Nhóm Doanh nghiệp",
      description: "Bao gồm các loại hình doanh nghiệp (TNHH, CP, DNTN...)",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "HTX",
      name: "Nhóm Hợp tác xã",
      description: "Bao gồm các Hợp tác xã và Liên hiệp hợp tác xã",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      code: "THT",
      name: "Nhóm Tổ hợp tác",
      description: "Các tổ hợp tác được chứng thực bởi UBND xã/phường",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 4,
      code: "HKD",
      name: "Nhóm Hộ kinh doanh",
      description: "Hộ kinh doanh cá thể, hộ gia đình sản xuất",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 5,
      code: "CQNN",
      name: "Cơ quan nhà nước",
      description: "Các sở, ban, ngành và đơn vị hành chính sự nghiệp",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 6,
      code: "HIEPHOI",
      name: "Hiệp hội / Tổ chức phi chính phủ",
      description: "Các hiệp hội ngành hàng, tổ chức NGO",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 7,
      code: "KHAC",
      name: "Nhóm khác",
      description: "Các đối tượng tổ chức khác",
      status: "active",
      createdAt: "2024-01-15",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseGroup | null>(null);

  const [formData, setFormData] = useState<
    Omit<EnterpriseGroup, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<EnterpriseGroup>[] = [
    { key: "code", label: "Mã nhóm", sortable: true },
    { key: "name", label: "Tên nhóm tổ chức", sortable: true },
    { key: "description", label: "Mô tả" },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status === "active" ? "Đang sử dụng" : "Ngưng sử dụng"}
        </Badge>
      ),
    },
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

  const handleEdit = (item: EnterpriseGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseGroup) => {
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
        description: "Đã cập nhật nhóm tổ chức",
      });
    } else {
      const newItem: EnterpriseGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm nhóm tổ chức mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm tổ chức",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Nhóm tổ chức"
      description="Quản lý các nhóm đối tượng tổ chức/doanh nghiệp"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Danh sách nhóm tổ chức</h3>
            <p className="text-sm text-muted-foreground">
              Phân nhóm các đơn vị theo tính chất hoạt động
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm nhóm tổ chức..."
        />
      </div>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm tổ chức" : "Thêm nhóm tổ chức mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã nhóm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: DN, HTX..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên nhóm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Nhóm Doanh nghiệp..."
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
              placeholder="Mô tả chi tiết..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "active" | "inactive",
                })
              }
            >
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngưng sử dụng</option>
            </select>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm tổ chức này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default EnterpriseTypePage;
