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

export default function TeamCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    leader: "",
    department: "",
    description: "",
    status: "active",
  });

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên đội nhóm",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: `Đã tạo đội nhóm "${formData.name}"`,
    });
    setLocation("/team");
  };

  return (
    <AdminLayout
      title="Thêm mới đội nhóm"
      description="Tạo đội nhóm làm việc mới"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/team")}>
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
            <CardTitle>Thông tin đội nhóm</CardTitle>
            <CardDescription>
              Thiết lập thông tin cơ bản cho đội nhóm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã đội *</Label>
                <Input
                  id="code"
                  placeholder="VD: TEAM-KD-01"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên đội nhóm *</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên đội nhóm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Thuộc phòng ban</Label>
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
                <Label htmlFor="leader">Trưởng nhóm</Label>
                {/* In a real app, this would be a combobox searching users */}
                <Select
                  value={formData.leader}
                  onValueChange={(val) =>
                    setFormData({ ...formData, leader: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trưởng nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nguyễn Văn A">Nguyễn Văn A</SelectItem>
                    <SelectItem value="Trần Thị B">Trần Thị B</SelectItem>
                    <SelectItem value="Lê Văn C">Lê Văn C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả nhiệm vụ, chức năng của đội nhóm..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
