import { useState } from "react";
import { useLocation } from "wouter";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@tankhang1/eco-shared-ui";
import { Building2, Save, X } from "lucide-react";

export default function BranchCreatePage() {
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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.enterpriseId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo chi nhánh "${formData.name}"`,
    });
    setLocation("/branch");
  };

  return (
    <AdminLayout
      title="Thêm mới chi nhánh"
      description="Tạo chi nhánh mới cho doanh nghiệp/hợp tác xã"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/branch")}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận tạo chi nhánh</DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra lại thông tin trước khi tạo mới.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-muted-foreground">Đơn vị:</span>
              <span className="col-span-2">
                {formData.enterpriseId === "1"
                  ? "Công ty CP Nông nghiệp Xanh EcoFarm"
                  : formData.enterpriseId === "2"
                    ? "HTX Rau sạch Thanh Hà"
                    : "Nông hộ Nguyễn Văn A"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-muted-foreground">
                Tên chi nhánh:
              </span>
              <span className="col-span-2">{formData.name}</span>
            </div>
            {formData.code && (
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">Mã:</span>
                <span className="col-span-2">{formData.code}</span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-muted-foreground">
                Địa chỉ:
              </span>
              <span className="col-span-2">
                {[
                  formData.address,
                  formData.ward === "p1"
                    ? "Phường 1"
                    : formData.ward === "p2"
                      ? "Phường 2"
                      : formData.ward === "kimma"
                        ? "Kim Mã"
                        : "",
                  formData.district === "q1"
                    ? "Quận 1"
                    : formData.district === "q3"
                      ? "Quận 3"
                      : formData.district === "badinh"
                        ? "Ba Đình"
                        : "",
                  formData.province === "hcm"
                    ? "TP. Hồ Chí Minh"
                    : formData.province === "hn"
                      ? "Hà Nội"
                      : formData.province === "dn"
                        ? "Đà Nẵng"
                        : "",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmSubmit}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm border border-blue-200">
            <Building2 className="w-5 h-5 shrink-0" />
            <p>
              Chi nhánh sẽ kế thừa các thông tin pháp lý từ đơn vị chủ quản nếu
              không điền mã số thuế riêng.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
