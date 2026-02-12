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
import useContactStore from "../../stores/useContactStore";
import useEnterpriseStore from "../../stores/useEnterpriseStore";
import useDepartmentStore from "../../stores/useDepartmentStore";

export default function ContactEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/contact/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Zustand store
  const contactId = params?.id ? parseInt(params.id) : undefined;
  const getContactById = useContactStore((state) => state.getContactById);
  const groups = useContactStore((state) => state.groups);
  const updateContact = useContactStore((state) => state.updateContact);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const contact = contactId ? getContactById(contactId) : undefined;
  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const departments = useDepartmentStore((state) => state.departments);

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

  // Load contact data
  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email,
        position: contact.position,
        department: contact.department,
        entityName: contact.entityName,
        groupId: contact.groupId ? contact.groupId.toString() : "",
        note: contact.note,
        status: contact.status,
      });
    }
  }, [contact]);

  const handleSubmit = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.entityName ||
      !contactId
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    updateContact(contactId, {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      position: formData.position,
      department: formData.department,
      entityName: formData.entityName,
      groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
      note: formData.note,
      status: formData.status,
    });

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật liên hệ "${formData.fullName}"`,
    });
    setLocation("/contact");
  };

  const handleDelete = () => {
    if (contactId) {
      deleteContact(contactId);
      toast({
        title: "Thành công",
        description: "Đã xóa liên hệ",
      });
      setLocation("/contact");
    }
  };

  // Show not found if contact doesn't exist
  if (contactId && !contact) {
    return (
      <AdminLayout title="Không tìm thấy" description="Liên hệ không tồn tại">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy liên hệ</h2>
          <Button onClick={() => setLocation("/contact")}>
            <X className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
                    {enterprises.map((enterprise) => (
                      <SelectItem key={enterprise.id} value={enterprise.name}>
                        {enterprise.name}
                      </SelectItem>
                    ))}
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
                    {departments
                      .filter((dept) => dept.status === "active")
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
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

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa liên hệ ${formData.fullName}?`}
      />
    </AdminLayout>
  );
}
