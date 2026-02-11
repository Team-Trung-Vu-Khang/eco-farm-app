import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  ClipboardList,
  Calendar,
  FileCheck,
  AlertTriangle,
  Target,
  Banknote,
  Ruler,
  Sprout,
  FlaskConical,
} from "lucide-react";
import {
  AdminLayout,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  useToast,
  type Step,
  Badge,
} from "@tankhang1/eco-shared-ui";

export default function AmendmentPlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/amendment-plan/:id/edit");
  const isEdit = !!params?.id;

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    technician: "",
    description: "",
    priority: "medium",
    // Scope
    zone: "",
    cropType: "",
    soilType: "",
    currentPH: "",
    targetPH: "",
    target_issue: "",
    area: "",
    // Resource & Time
    budget: "",
    methodCategory: "",
    startDate: "",
    endDate: "",
    status: "planning" as
      | "planning"
      | "in_progress"
      | "completed"
      | "cancelled",
  });

  // Mock Data
  const technicians = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
  const zones = ["Vùng A - Cà Mau", "Vùng B - Long An", "Vùng C - Đồng Nai"];
  const soilTypes = [
    "Đất phèn",
    "Đất mặn",
    "Đất bạc màu",
    "Đất cát",
    "Đất thịt",
    "Đất sét",
  ];
  const methodCategories = [
    "Hóa học (Vôi, Phân bón...)",
    "Hữu cơ (Phân chuồng, Sinh học...)",
    "Vật lý (Cày xới, Thủy lợi...)",
    "Kết hợp",
  ];

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: isEdit
        ? `Đã cập nhật kế hoạch "${formData.name}"`
        : `Đã tạo kế hoạch "${formData.name}"`,
    });
    setLocation("/amendment-plan");
  };

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Tên, mã và mức độ ưu tiên",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              {isEdit ? "Cập nhật kế hoạch" : "Thiết lập kế hoạch cải tạo"}
            </h3>
            <p className="text-muted-foreground">
              Nhập các thông tin cơ bản để định danh kế hoạch và mức độ ưu tiên
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã kế hoạch <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: CT001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) =>
                    setFormData({ ...formData, priority: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Tên kế hoạch <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Cải tạo đất nhiễm mặn Vùng A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Phụ trách kỹ thuật</Label>
              <Select
                value={formData.technician}
                onValueChange={(v) =>
                  setFormData({ ...formData, technician: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả / Ghi chú</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về mục đích và phạm vi..."
                rows={3}
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.code.length > 0 && formData.name.length > 0,
    },
    {
      id: "scope",
      title: "Hiện trạng & Mục tiêu",
      description: "Đất đai và chỉ số cải tạo",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label>
                Khu vực canh tác <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.zone}
                onValueChange={(v) => setFormData({ ...formData, zone: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại đất hiện tại</Label>
              <Select
                value={formData.soilType}
                onValueChange={(v) => setFormData({ ...formData, soilType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại cây trồng (dự kiến)</Label>
              <div className="relative">
                <Sprout className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={formData.cropType}
                  onChange={(e) =>
                    setFormData({ ...formData, cropType: e.target.value })
                  }
                  placeholder="VD: Lúa, Cà phê..."
                />
              </div>
            </div>

            <div className="col-span-2 space-y-4 border-t pt-4 mt-2">
              <h4 className="font-medium text-sm text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" />
                Chỉ số cải tạo
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vấn đề chính</Label>
                  <Input
                    value={formData.target_issue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_issue: e.target.value,
                      })
                    }
                    placeholder="VD: Nhiễm mặn..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích (ha)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="0.0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>pH Hiện tại</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.currentPH}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPH: e.target.value })
                    }
                    placeholder="VD: 4.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>pH Mục tiêu</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.targetPH}
                    onChange={(e) =>
                      setFormData({ ...formData, targetPH: e.target.value })
                    }
                    placeholder="VD: 6.0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: formData.zone.length > 0,
    },
    {
      id: "resources",
      title: "Nguồn lực & Tiến độ",
      description: "Ngân sách và thời gian",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Phương pháp chủ đạo</Label>
              <Select
                value={formData.methodCategory}
                onValueChange={(v) =>
                  setFormData({ ...formData, methodCategory: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương pháp" />
                </SelectTrigger>
                <SelectContent>
                  {methodCategories.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngân sách dự kiến (Triệu VNĐ)</Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Thời gian thực hiện</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày kết thúc (Dự kiến)</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            {formData.startDate &&
              formData.endDate &&
              formData.startDate > formData.endDate && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <span>Ngày kết thúc không thể trước ngày bắt đầu!</span>
                </div>
              )}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Trạng thái kế hoạch</Label>
            <Select
              value={formData.status}
              onValueChange={(v: any) =>
                setFormData({ ...formData, status: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Đang lập kế hoạch</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Hủy bỏ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
      isValid:
        !formData.startDate ||
        !formData.endDate ||
        formData.startDate <= formData.endDate,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Xác nhận thông tin kế hoạch
            </h3>
            <p className="text-muted-foreground">
              Vui lòng kiểm tra kỹ trước khi {isEdit ? "cập nhật" : "tạo mới"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border">
            <div className="space-y-4">
              <h4 className="font-semibold border-b pb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" /> Thông tin
                chung
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã kế hoạch:</span>
                  <span className="font-medium font-mono">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên kế hoạch:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mức độ ưu tiên:</span>
                  <Badge
                    variant={
                      formData.priority === "urgent"
                        ? "destructive"
                        : formData.priority === "high"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {formData.priority === "low"
                      ? "Thấp"
                      : formData.priority === "medium"
                        ? "Trung bình"
                        : formData.priority === "high"
                          ? "Cao"
                          : "Khẩn cấp"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phụ trách:</span>
                  <span className="font-medium">
                    {formData.technician || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold border-b pb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Phạm vi & Mục tiêu
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khu vực:</span>
                  <span className="font-medium">{formData.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại đất:</span>
                  <span className="font-medium">
                    {formData.soilType || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cải tạo pH:</span>
                  <span className="font-medium">
                    {formData.currentPH || "?"} → {formData.targetPH || "?"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diện tích:</span>
                  <span className="font-medium">{formData.area} ha</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h4 className="font-semibold border-b pb-2 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" /> Nguồn lực & Tiến
                độ
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương pháp:</span>
                  <span className="font-medium">
                    {formData.methodCategory || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân sách:</span>
                  <span className="font-medium">{formData.budget} Tr.đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span className="font-medium">
                    {formData.startDate || "?"} - {formData.endDate || "?"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant="outline" className="capitalize">
                    {formData.status}
                  </Badge>
                </div>
              </div>
            </div>
            {formData.description && (
              <div className="md:col-span-2 pt-2 border-t text-sm text-muted-foreground italic">
                " {formData.description} "
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật kế hoạch cải tạo" : "Lập kế hoạch cải tạo mới"}
      description="Điền thông tin chi tiết cho kế hoạch cải tạo đất"
    >
      <div className="max-w-4xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/amendment-plan")}
          completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
        />
      </div>
    </AdminLayout>
  );
}
