import { useState } from "react";
import { Link } from "wouter";
import { Plus, Upload, FileText, Image } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface Enterprise {
  id: number;
  code: string;
  name: string;
  type: "enterprise" | "farm";
  classification: "production" | "processing" | "trading" | "service";
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Enterprise[] = [
  {
    id: 1,
    code: "DN001",
    name: "Công ty TNHH Nông nghiệp Xanh",
    type: "enterprise",
    classification: "production",
    taxCode: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@nongnghiepxanh.vn",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "NH001",
    name: "Nông hộ Nguyễn Văn A",
    type: "farm",
    classification: "production",
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    code: "DN002",
    name: "HTX Nông sản Sạch Bình Dương",
    type: "enterprise",
    classification: "trading",
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "NH002",
    name: "Trang trại Trần Thị B",
    type: "farm",
    classification: "processing",
    taxCode: "",
    address: "Ấp 3, Xã Long An, Huyện Long Thành",
    phone: "0934567890",
    email: "tranthib@gmail.com",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    code: "DN003",
    name: "Công ty CP Xuất khẩu Trái cây Việt",
    type: "enterprise",
    classification: "trading",
    taxCode: "1122334455",
    address: "789 Đường DEF, Quận Bình Thạnh, TP.HCM",
    phone: "0945678901",
    email: "export@traicayviet.com",
    status: "inactive",
    createdAt: "2024-01-20",
  },
];

export default function EnterprisePage() {
  const { toast } = useToast();
  const [data, setData] = useState<Enterprise[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Enterprise | null>(null);
  const [deleteItem, setDeleteItem] = useState<Enterprise | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "enterprise" as "enterprise" | "farm",
    classification: "production" as
      | "production"
      | "processing"
      | "trading"
      | "service",
    taxCode: "",
    address: "",
    phone: "",
    email: "",
  });

  const columns: Column<Enterprise>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên doanh nghiệp / Nông hộ" },
    {
      key: "type",
      label: "Loại hình",
      render: (value) => (
        <Badge variant={value === "enterprise" ? "default" : "secondary"}>
          {value === "enterprise" ? "Doanh nghiệp" : "Nông hộ"}
        </Badge>
      ),
    },
    {
      key: "classification",
      label: "Phân loại",
      render: (value) => {
        const labels: Record<string, string> = {
          production: "Sản xuất",
          processing: "Chế biến",
          trading: "Thương mại",
          service: "Dịch vụ",
        };
        return labels[value] || value;
      },
    },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "type",
      label: "Loại hình",
      options: [
        { label: "Doanh nghiệp", value: "enterprise" },
        { label: "Nông hộ", value: "farm" },
      ],
    },
    {
      key: "classification",
      label: "Phân loại",
      options: [
        { label: "Sản xuất", value: "production" },
        { label: "Chế biến", value: "processing" },
        { label: "Thương mại", value: "trading" },
        { label: "Dịch vụ", value: "service" },
      ],
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      type: "enterprise",
      classification: "production",
      taxCode: "",
      address: "",
      phone: "",
      email: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Enterprise) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      type: item.type,
      classification: item.classification,
      taxCode: item.taxCode,
      address: item.address,
      phone: item.phone,
      email: item.email,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Enterprise) => {
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
      toast({ title: "Thành công", description: "Đã cập nhật thông tin" });
    } else {
      const newItem: Enterprise = {
        id: Date.now(),
        ...formData,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm doanh nghiệp/nông hộ mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa doanh nghiệp/nông hộ",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý doanh nghiệp / Nông hộ"
      description="Quản lý thông tin các doanh nghiệp và nông hộ trong hệ thống"
      actions={
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp/nông hộ..."
        filters={filters}
        selectable
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa thông tin" : "Thêm doanh nghiệp / Nông hộ"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu đính kèm</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: DN001"
                  data-testid="input-code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại hình</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "enterprise" | "farm") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                    <SelectItem value="farm">Nông hộ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classification">Phân loại</Label>
              <Select
                value={formData.classification}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, classification: value })
                }
              >
                <SelectTrigger data-testid="select-classification">
                  <SelectValue placeholder="Chọn phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Sản xuất</SelectItem>
                  <SelectItem value="processing">Chế biến</SelectItem>
                  <SelectItem value="trading">Thương mại</SelectItem>
                  <SelectItem value="service">Dịch vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên doanh nghiệp / Nông hộ</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên đầy đủ"
                data-testid="input-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) =>
                    setFormData({ ...formData, taxCode: e.target.value })
                  }
                  placeholder="Nhập mã số thuế (nếu có)"
                  data-testid="input-taxCode"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  data-testid="input-phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nhập địa chỉ email"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Nhập địa chỉ đầy đủ"
                rows={2}
                data-testid="input-address"
              />
            </div>
          </TabsContent>
          <TabsContent value="documents" className="mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">
                Kéo thả file hoặc click để tải lên
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Hỗ trợ PDF, Word, hình ảnh (tối đa 10MB)
              </p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Chọn file
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    giay_phep_kinh_doanh.pdf
                  </p>
                  <p className="text-xs text-muted-foreground">2.4 MB</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Xóa
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Image className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">chung_chi_vietgap.jpg</p>
                  <p className="text-xs text-muted-foreground">1.8 MB</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Xóa
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa doanh nghiệp/nông hộ này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
