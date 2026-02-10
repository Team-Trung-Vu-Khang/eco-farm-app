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
import { initialUnits, type Unit, UNIT_STANDARDS } from "./constants";
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

  // Local state for the selected "Display Standard" (e.g. "ton", "kg", "g")
  // This helps user calculate the factor comfortable.
  // When saving, we convert everything to the System Base (kg, l, m...)
  const [selectedStandard, setSelectedStandard] = useState<string>("");

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
          baseUnitId: item.baseUnitId, // This might point to 'kg' (id 1)
        });

        // Try to reverse-engineer which standard was used?
        // For now, default to the base standard (factor 1)
        const standards = UNIT_STANDARDS[item.type] || [];
        const baseStd = standards.find((s) => s.factor === 1);
        if (baseStd) setSelectedStandard(baseStd.value);
      }
    } else {
      // Initialize standard for new item
      const standards = UNIT_STANDARDS[formData.type] || [];
      const baseStd = standards.find((s) => s.factor === 1);
      if (baseStd) setSelectedStandard(baseStd.value);
    }
  }, [isEdit, params?.id]);

  // When type changes, reset standard
  useEffect(() => {
    if (!isEdit) {
      const standards = UNIT_STANDARDS[formData.type] || [];
      const baseStd = standards.find((s) => s.factor === 1);
      if (baseStd) setSelectedStandard(baseStd.value);
    }
  }, [formData.type, isEdit]);

  const updateField = (field: keyof UnitFormState, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset conversion fields if type changes
      if (field === "type") {
        newData.baseUnitId = undefined;
        newData.isBaseUnit = false;
        newData.conversionFactor = 1;
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Find the System Base Unit for this type (e.g. Unit for 'kg')
    // In a real app, we look up by type + isBaseUnit.
    // Here we use initialUnits.
    const systemBaseUnit = initialUnits.find(
      (u) => u.type === formData.type && u.isBaseUnit,
    );

    if (!systemBaseUnit && !formData.isBaseUnit) {
      // Fallback or Error?
      // If no system base exists, maybe this IS the system base?
      // For now, show error
      toast({
        title: "Lỗi cấu hình",
        description: `Không tìm thấy đơn vị chuẩn hệ thống cho loại ${formData.type}`,
        variant: "destructive",
      });
      return;
    }

    // 2. Calculate the True Factor relative to System Base
    // Formula: 1 Unit = [Input] * [StandardFactor] (SystemBase)
    const standards = UNIT_STANDARDS[formData.type] || [];
    const standard = standards.find((s) => s.value === selectedStandard);

    if (!standard && !formData.isBaseUnit) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn đơn vị quy đổi",
        variant: "destructive",
      });
      return;
    }

    let finalFactor = Number(formData.conversionFactor);

    // If we have a standard selected, multiply by its factor
    if (standard) {
      finalFactor = finalFactor * standard.factor;
    }

    const finalData = {
      ...formData,
      isBaseUnit: false, // Always false for user created units in this new flow?
      baseUnitId: systemBaseUnit?.id,
      conversionFactor: finalFactor,
    };

    // Edge case: If user is editing the Base Unit itself?
    // We didn't expose UI for that, assuming user creates derived units.

    console.log("Submit:", finalData);
    toast({
      title: "Thành công",
      description: isEdit
        ? "Đã cập nhật đơn vị tính"
        : "Đã thêm mới đơn vị tính",
    });
    setLocation("/unit");
  };

  const getStandardLabel = () => {
    const standards = UNIT_STANDARDS[formData.type] || [];
    const std = standards.find((s) => s.value === selectedStandard);
    return std ? std.label : "...";
  };

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật đơn vị tính" : "Thêm mới đơn vị tính"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Định nghĩa đơn vị tính và quy tắc quy đổi"
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
                      placeholder="VD: Bao 25kg, Thùng 20L..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>
                      Đơn vị quy đổi (Quy về){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedStandard}
                      onValueChange={(v) => setSelectedStandard(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị..." />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_TYPES.find((t) => t.value === formData.type)
                          ?.label &&
                          (UNIT_STANDARDS[formData.type] || []).map((u) => (
                            <SelectItem key={u.value} value={u.value}>
                              {u.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                        step="0.000001"
                        value={formData.conversionFactor}
                        onChange={(e) =>
                          updateField("conversionFactor", e.target.value)
                        }
                        required
                      />
                      <span className="text-sm font-medium whitespace-nowrap text-muted-foreground w-20">
                        {getStandardLabel()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  Ví dụ: Nếu 1 Thùng = 100 Bao 5kg (Tổng 500kg). <br />
                  Bạn chọn đơn vị quy đổi là <b>Kilogam (kg)</b> và nhập hệ số
                  là <b>500</b>. <br />
                  Hoặc chọn đơn vị quy đổi là <b>Tấn (Ton)</b> và nhập hệ số là{" "}
                  <b>0.5</b>.
                </div>
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
