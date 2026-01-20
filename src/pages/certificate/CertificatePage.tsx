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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface Certificate {
  id: number;
  code: string;
  name: string;
  organization: string;
  content: string;
  stampUrl?: string;
  issuedDate: string;
  expiryDate: string;
  description: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
}

const CertificatePage = () => {
  const { toast } = useToast();

  const [data, setData] = useState<Certificate[]>([
    {
      id: 1,
      code: "CH001",
      name: "Global GAP",
      organization: "Tổ chức GlobalGAP",
      content: "Chứng nhận thực hành nông nghiệp tốt toàn cầu",
      stampUrl: "https://lifarm.vn/wp-content/uploads/2025/03/globalgap-1.png",
      issuedDate: "2023-01-10",
      expiryDate: "2024-01-10",
      description: "Tiêu chuẩn về thực hành nông nghiệp tốt",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "CH002",
      name: "VietGAP",
      organization: "Bộ Nông nghiệp",
      content: "Chứng nhận thực hành nông nghiệp tốt Việt Nam",
      stampUrl:
        "https://vietpatservice.com/wp-content/uploads/2019/04/VietGAP.jpg",
      issuedDate: "2023-05-20",
      expiryDate: "2024-05-20",
      description:
        "Tiêu chuẩn về thực hành sản xuất nông nghiệp tốt ở Việt Nam",
      status: "active",
      createdAt: "2024-01-11",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Certificate | null>(null);
  const [deleteItem, setDeleteItem] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState<
    Omit<Certificate, "id" | "createdAt">
  >({
    code: "",
    name: "",
    organization: "",
    content: "",
    stampUrl: "",
    issuedDate: "",
    expiryDate: "",
    description: "",
    status: "active",
  });

  const columns: Column<Certificate>[] = [
    { key: "code", label: "Mã số" },
    { key: "name", label: "Tên chứng nhận" },
    {
      key: "stampUrl",
      label: "Dấu mộc",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="Stamp"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span>-</span>
        ),
    },
    { key: "organization", label: "Tổ chức" },
    { key: "issuedDate", label: "Ngày cấp" },
    { key: "expiryDate", label: "Hiệu lực" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => {
        const variant =
          value === "active"
            ? "default"
            : value === "expired"
              ? "destructive"
              : "secondary";
        const label =
          value === "active"
            ? "Hoạt động"
            : value === "expired"
              ? "Hết hạn"
              : "Không hoạt động";
        return <Badge variant={variant as any}>{label}</Badge>;
      },
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      organization: "",
      content: "",
      stampUrl: "",
      issuedDate: "",
      expiryDate: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Certificate) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      organization: item.organization,
      content: item.content,
      stampUrl: item.stampUrl || "",
      issuedDate: item.issuedDate,
      expiryDate: item.expiryDate,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Certificate) => {
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
      toast({ title: "Thành công", description: "Đã cập nhật chứng chỉ" });
    } else {
      const newItem: Certificate = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm chứng chỉ mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa chứng chỉ" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chứng chỉ"
      description="Quản lý chứng chỉ, dấu mộc, và thông tin xác thực của doanh nghiệp/nông hộ"
      actions={
        <Button onClick={handleAdd} data-testid="add-certificate">
          <Plus className="w-4 h-4 mr-2" />
          Thêm chứng chỉ
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chứng chỉ..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã số chứng nhận</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: CH001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên chứng nhận</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: GlobalGAP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Tên tổ chức</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
              placeholder="VD: Hiệp hội nông nghiệp..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stampUrl">Dấu mộc (URL hình ảnh)</Label>
            <Input
              id="stampUrl"
              value={formData.stampUrl}
              onChange={(e) =>
                setFormData({ ...formData, stampUrl: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuedDate">Thời gian cấp</Label>
            <Input
              id="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={(e) =>
                setFormData({ ...formData, issuedDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Hiệu lực đến</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(val: any) =>
                setFormData({ ...formData, status: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="content">Nội dung giấy chứng nhận</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Nội dung chi tiết..."
            rows={3}
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="description">Định nghĩa / Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả thêm..."
            rows={2}
          />
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chứng chỉ này?"
      />
    </AdminLayout>
  );
};
export default CertificatePage;
