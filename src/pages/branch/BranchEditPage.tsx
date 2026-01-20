import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@tankhang1/eco-shared-ui";
import { Save, X, Trash2 } from "lucide-react";

export default function BranchEditPage() {
  const [, params] = useRoute("/branch/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    enterpriseId: "",
    code: "",
    name: "",
    taxCode: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    description: "",
  });

  useEffect(() => {
    // Mock fetch data
    if (params?.id) {
      setTimeout(() => {
        setFormData({
          enterpriseId: "1",
          code: "CN001",
          name: "Chi nhánh Miền Nam",
          taxCode: "0101234567-001",
          phone: "02839999888",
          email: "hcm@ecofarm.vn",
          address: "Số 456 Nguyễn Thị Minh Khai",
          province: "hcm",
          district: "q1",
          ward: "p1",
          description:
            "Văn phòng đại diện phía Nam, chịu trách nhiệm phân phối sản phẩm khu vực TP.HCM và các tỉnh lân cận.",
        });
      }, 500);
    }
  }, [params?.id]);

  const handleSubmit = () => {
    if (!formData.name || !formData.enterpriseId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin chi nhánh "${formData.name}"`,
    });
    setLocation("/branch");
  };

  const handleDelete = () => {
    toast({
      title: "Đã xóa",
      description: "Đã xóa chi nhánh khỏi hệ thống",
    });
    setLocation("/branch");
  };

  return (
    <AdminLayout
      title="Chỉnh sửa chi nhánh"
      description={`Cập nhật thông tin chi nhánh #${params?.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/branch")}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Cập nhật
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Thông tin cơ bản của chi nhánh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enterprise">Đơn vị chủ quản *</Label>
                <Select
                  value={formData.enterpriseId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, enterpriseId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn doanh nghiệp / HTX / Nông hộ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      Công ty CP Nông nghiệp Xanh EcoFarm
                    </SelectItem>
                    <SelectItem value="2">HTX Rau sạch Thanh Hà</SelectItem>
                    <SelectItem value="3">Nông hộ Nguyễn Văn A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã chi nhánh</Label>
                  <Input
                    id="code"
                    placeholder="Tự động tạo nếu để trống"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế chi nhánh</Label>
                  <Input
                    id="taxCode"
                    placeholder="MST chi nhánh (nếu có)"
                    value={formData.taxCode}
                    onChange={(e) =>
                      setFormData({ ...formData, taxCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên chi nhánh *</Label>
                <Input
                  id="name"
                  placeholder="VD: Chi nhánh Miền Nam"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả / Ghi chú</Label>
                <Textarea
                  id="description"
                  placeholder="Thông tin thêm về chi nhánh..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ & Vị trí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tỉnh / Thành phố</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(val) =>
                      setFormData({ ...formData, province: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Tỉnh/Thành" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hn">Hà Nội</SelectItem>
                      <SelectItem value="dn">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quận / Huyện</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(val) =>
                      setFormData({ ...formData, district: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Quận/Huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1">Quận 1</SelectItem>
                      <SelectItem value="q3">Quận 3</SelectItem>
                      <SelectItem value="badinh">Ba Đình</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phường / Xã</Label>
                  <Select
                    value={formData.ward}
                    onValueChange={(val) =>
                      setFormData({ ...formData, ward: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Phường/Xã" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Phường 1</SelectItem>
                      <SelectItem value="p2">Phường 2</SelectItem>
                      <SelectItem value="kimma">Kim Mã</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ chi tiết</Label>
                <Input
                  id="address"
                  placeholder="Số nhà, đường..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive font-medium text-base">
                Vùng nguy hiểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Xóa chi nhánh này sẽ không thể khôi phục lại dữ liệu.
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa chi nhánh
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn xóa?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh
                        viễn chi nhánh và loại bỏ dữ liệu khỏi máy chủ của chúng
                        tôi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Tiếp tục xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="028..."
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="branch@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
