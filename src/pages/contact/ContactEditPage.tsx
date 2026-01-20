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
  DeleteDialog,
} from "@tankhang1/eco-shared-ui";
import { Save, Trash2, X } from "lucide-react";

export default function ContactEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/contact/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Mock data fetching
  useEffect(() => {
    // Simulate API call using ID
    console.log("Fetching contact", params?.id);
    setTimeout(() => {
      setFormData({
        fullName: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@example.com",
        position: "Trưởng phòng",
        department: "Kinh doanh",
        entityName: "Công ty CP Nông nghiệp Xanh",
        note: "Liên hệ chính",
        status: "active",
      });
    }, 500);
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    entityName: "",
    note: "",
    status: "active",
  });

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.entityName) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật liên hệ "${formData.fullName}"`,
    });
    setLocation("/contact");
  };

  const handleDelete = () => {
    toast({
      title: "Thành công",
      description: "Đã xóa liên hệ",
    });
    setLocation("/contact");
  };

  return (
    <AdminLayout
      title="Cập nhật liên hệ"
      description="Chỉnh sửa thông tin liên hệ"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
          <Button variant="outline" onClick={() => setLocation("/contact")}>
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
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
            <CardDescription>
              Chi tiết thông tin cá nhân và công việc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entityName">Doanh nghiệp / Nông hộ *</Label>
                <Select
                  value={formData.entityName}
                  onValueChange={(val) =>
                    setFormData({ ...formData, entityName: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Công ty CP Nông nghiệp Xanh">
                      Công ty CP Nông nghiệp Xanh
                    </SelectItem>
                    <SelectItem value="HTX Rau sạch Thanh Hà">
                      HTX Rau sạch Thanh Hà
                    </SelectItem>
                    <SelectItem value="Nông hộ Nguyễn Văn A">
                      Nông hộ Nguyễn Văn A
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  placeholder="0901234567"
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
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) =>
                    setFormData({ ...formData, department: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                    <SelectItem value="Kế toán">Kế toán</SelectItem>
                    <SelectItem value="Hành chính">Hành chính</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Chức vụ</Label>
                <Input
                  id="position"
                  placeholder="VD: Trưởng phòng"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Ghi chú thêm..."
                rows={3}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa liên hệ ${formData.fullName}?`}
      />
    </AdminLayout>
  );
}
