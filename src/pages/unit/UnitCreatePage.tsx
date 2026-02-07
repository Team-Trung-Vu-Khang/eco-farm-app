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
  Switch,
} from "@tankhang1/eco-shared-ui";
import { initialUnits, type Unit } from "./constants";
import { ChevronLeft, Save, Scale, ArrowRightLeft } from "lucide-react";

const UNIT_TYPES = [
  { value: "mass", label: "Khối lượng (Weight)" },
  { value: "volume", label: "Thể tích (Volume)" },
  { value: "length", label: "Độ dài (Length)" },
  { value: "area", label: "Diện tích (Area)" },
  { value: "quantity", label: "Số lượng (Quantity)" },
  { value: "time", label: "Thời gian (Time)" },
  { value: "other", label: "Khác (Other)" },
];

interface UnitFormState extends Omit<
  Unit,
  "id" | "createdAt" | "conversionFactor"
> {
  conversionFactor: string | number;
}

const UnitCreatePage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/unit/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const [formData, setFormData] = useState<UnitFormState>({
    code: "",
    name: "",
    description: "",
    status: "active",
    type: "mass",
    isBaseUnit: false,
    conversionFactor: 1,
    baseUnitId: undefined,
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
          type: item.type,
          isBaseUnit: item.isBaseUnit,
          conversionFactor: item.conversionFactor,
          baseUnitId: item.baseUnitId,
        });
      }
    }
  }, [isEdit, params?.id]);

  const updateField = (field: keyof UnitFormState, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset conversion fields if type changes
      if (field === "type") {
        newData.baseUnitId = undefined;
        newData.isBaseUnit = false; // Reset to false to force user choice
      }

      // If set to base unit, force conversion factor to 1 and remove base unit ref
      if (field === "isBaseUnit" && value === true) {
        newData.conversionFactor = 1;
        newData.baseUnitId = undefined;
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.isBaseUnit && !formData.baseUnitId) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng chọn đơn vị chuẩn để quy đổi",
        variant: "destructive",
      });
      return;
    }

    const finalData = {
      ...formData,
      conversionFactor: Number(formData.conversionFactor),
    };

    console.log("Submit:", finalData);
    toast({
      title: "Thành công",
      description: isEdit
        ? "Đã cập nhật đơn vị tính"
        : "Đã thêm mới đơn vị tính",
    });
    setLocation("/unit");
  };

  // Get available base units for the selected type
  const availableBaseUnits = initialUnits.filter(
    (u) => u.type === formData.type && u.isBaseUnit,
  );

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật đơn vị tính" : "Thêm mới đơn vị tính"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo các đơn vị đo lường, đóng gói và quy đổi"
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

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* General Info */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Scale className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Mã đơn vị <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => updateField("code", e.target.value)}
                      placeholder="VD: BAG25, KG, LIT..."
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
                      placeholder="VD: Bao 25kg, Kilogam..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loại đơn vị</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => updateField("type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => updateField("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">
                          Ngừng hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Mô tả chi tiết..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conversion Logic */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <ArrowRightLeft className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Quy đổi đơn vị</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">Đây là đơn vị chuẩn?</Label>
                    <p className="text-sm text-muted-foreground">
                      Đơn vị chuẩn dùng để tính toán tồn kho và tiêu hao (VD:
                      kg, lít)
                    </p>
                  </div>
                  <Switch
                    checked={formData.isBaseUnit}
                    onCheckedChange={(checked) =>
                      updateField("isBaseUnit", checked)
                    }
                  />
                </div>

                {!formData.isBaseUnit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animation-fade-in">
                    <div className="space-y-2">
                      <Label>
                        Quy đổi về đơn vị chuẩn{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.baseUnitId?.toString()}
                        onValueChange={(v) =>
                          updateField("baseUnitId", Number(v))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị chuẩn..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBaseUnits.map((u) => (
                            <SelectItem key={u.id} value={u.id.toString()}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {availableBaseUnits.length === 0 && (
                        <p className="text-xs text-amber-500">
                          Chưa có đơn vị chuẩn nào cho loại này. Hãy tạo đơn vị
                          chuẩn trước.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Hệ số quy đổi <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">
                          1 {formData.name || "..."} =
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          value={formData.conversionFactor}
                          onChange={(e) =>
                            updateField("conversionFactor", e.target.value)
                          }
                          required
                        />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {availableBaseUnits.find(
                            (u) => u.id === formData.baseUnitId,
                          )?.name || "..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
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
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UnitCreatePage;
