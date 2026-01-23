import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
  Button,
  useToast,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import { initialUnits } from "./constants";
import { ChevronLeft, Save, Scale } from "lucide-react";

interface UnitFormData {
  code: string;
  name: string;
  description: string;
  status: string;
}

const UnitCreatePage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/unit/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const [formData, setFormData] = useState<UnitFormData>({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && params?.id) {
      const item = initialUnits.find((p) => p.id === Number(params.id));
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          description: item.description,
          status: item.status,
        });
      }
    }
  }, [isEdit, params?.id]);

  const updateField = (field: keyof UnitFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", formData);
    toast({
      title: "Thành công",
      description: isEdit
        ? "Đã cập nhật đơn vị tính"
        : "Đã thêm mới đơn vị tính",
    });
    setLocation("/unit");
  };

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật đơn vị tính" : "Thêm mới đơn vị tính"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo các đơn vị đo lường, đóng gói"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/unit")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Thông tin đơn vị</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Mã đơn vị <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="VD: DVT001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Tên đơn vị <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="VD: Kilogam, Lít..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Mô tả chi tiết về đơn vị tính..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateField("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/unit")}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? "Lưu thay đổi" : "Lưu lại"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UnitCreatePage;
