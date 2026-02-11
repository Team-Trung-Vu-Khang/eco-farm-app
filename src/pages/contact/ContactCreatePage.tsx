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
} from "@tankhang1/eco-shared-ui";
import { Save, X } from "lucide-react";
import useContactStore from "../../stores/useContactStore";

export default function ContactCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Zustand store
  const contacts = useContactStore((state) => state.contacts);
  const groups = useContactStore((state) => state.groups);
  const addContact = useContactStore((state) => state.addContact);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    entityName: "",
    groupId: "",
    note: "",
    status: "active" as "active" | "inactive",
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

    // Generate new ID
    const newId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

    // Add to store
    addContact({
      id: newId,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      position: formData.position,
      department: formData.department,
      entityName: formData.entityName,
      groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
      note: formData.note,
      status: formData.status,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Thành công",
      description: `Đã thêm liên hệ "${formData.fullName}"`,
    });
    setLocation("/contact");
  };

  return (
    <AdminLayout
      title="Thêm mới liên hệ"
      description="Thêm thông tin liên hệ mới vào hệ thống"
      actions={
        <div className="flex gap-2">
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
            {/* Thông tin cá nhân */}
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

            {/* Thông tin công việc */}
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
                <Label htmlFor="groupId">Nhóm danh bạ</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, groupId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm danh bạ" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(val: "active" | "inactive") =>
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
    </AdminLayout>
  );
}
