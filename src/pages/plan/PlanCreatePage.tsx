import { useState } from "react";
import { useLocation } from "wouter";

import {
  ClipboardList,
  Check,
  Calendar,
  MapPin,
  Package,
  Plus,
  X,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
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
} from "@tankhang1/eco-shared-ui";

interface MaterialItem {
  id: number;
  name: string;
  type: string;
  quantity: string;
  unit: string;
}

export default function PlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    season: "",
    startDate: "",
    endDate: "",
    zone: "",
    crop: "",
    variety: "",
    area: "",
    expectedYield: "",
    description: "",
    stages: [] as string[],
    materials: [] as MaterialItem[],
  });

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    type: "pesticide",
    quantity: "",
    unit: "kg",
  });

  const stages = [
    "Chuẩn bị đất",
    "Gieo trồng",
    "Chăm sóc giai đoạn 1",
    "Bón phân lần 1",
    "Phun thuốc BVTV",
    "Chăm sóc giai đoạn 2",
    "Bón phân lần 2",
    "Ra hoa",
    "Đậu quả",
    "Thu hoạch",
  ];

  const toggleStage = (stage: string) => {
    setFormData({
      ...formData,
      stages: formData.stages.includes(stage)
        ? formData.stages.filter((s) => s !== stage)
        : [...formData.stages, stage],
    });
  };

  const addMaterial = () => {
    if (newMaterial.name && newMaterial.quantity) {
      setFormData({
        ...formData,
        materials: [...formData.materials, { id: Date.now(), ...newMaterial }],
      });
      setNewMaterial({ name: "", type: "pesticide", quantity: "", unit: "kg" });
    }
  };

  const removeMaterial = (id: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((m) => m.id !== id),
    });
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch "${formData.name}"`,
    });
    setLocation("/plan");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin kế hoạch",
      description: "Tên, mùa vụ",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Thông tin kế hoạch
            </h3>
            <p className="text-muted-foreground">
              Nhập thông tin cơ bản về kế hoạch canh tác
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã kế hoạch *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: KH001"
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label>Mùa vụ *</Label>
              <Select
                value={formData.season}
                onValueChange={(value) =>
                  setFormData({ ...formData, season: value })
                }
              >
                <SelectTrigger data-testid="select-season">
                  <SelectValue placeholder="Chọn mùa vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vụ Xuân 2025">Vụ Xuân 2025</SelectItem>
                  <SelectItem value="Vụ Hè 2025">Vụ Hè 2025</SelectItem>
                  <SelectItem value="Vụ Thu 2025">Vụ Thu 2025</SelectItem>
                  <SelectItem value="Vụ Đông 2025">Vụ Đông 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên kế hoạch *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Kế hoạch sầu riêng vụ Xuân 2025"
              data-testid="input-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                data-testid="input-startDate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                data-testid="input-endDate"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả kế hoạch</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về kế hoạch canh tác..."
              rows={3}
              data-testid="input-description"
            />
          </div>
        </div>
      ),
      isValid:
        formData.code.length > 0 &&
        formData.name.length > 0 &&
        formData.season.length > 0,
    },
    {
      id: "cultivation",
      title: "Thông tin canh tác",
      description: "Vùng, cây trồng",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Vùng canh tác và cây trồng</h3>
          </div>
          <div className="space-y-2">
            <Label>Vùng canh tác *</Label>
            <Select
              value={formData.zone}
              onValueChange={(value) =>
                setFormData({ ...formData, zone: value })
              }
            >
              <SelectTrigger data-testid="select-zone">
                <SelectValue placeholder="Chọn vùng canh tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vùng A1 - Bình Phước">
                  Vùng A1 - Bình Phước (25 ha)
                </SelectItem>
                <SelectItem value="Vùng B3 - Đồng Nai">
                  Vùng B3 - Đồng Nai (18 ha)
                </SelectItem>
                <SelectItem value="Vùng C2 - Bến Tre">
                  Vùng C2 - Bến Tre (30 ha)
                </SelectItem>
                <SelectItem value="Vùng D1 - Bình Thuận">
                  Vùng D1 - Bình Thuận (20 ha)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cây trồng *</Label>
              <Select
                value={formData.crop}
                onValueChange={(value) =>
                  setFormData({ ...formData, crop: value })
                }
              >
                <SelectTrigger data-testid="select-crop">
                  <SelectValue placeholder="Chọn cây trồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                  <SelectItem value="Xoài">Xoài</SelectItem>
                  <SelectItem value="Bưởi">Bưởi</SelectItem>
                  <SelectItem value="Thanh long">Thanh long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Giống cây *</Label>
              <Select
                value={formData.variety}
                onValueChange={(value) =>
                  setFormData({ ...formData, variety: value })
                }
              >
                <SelectTrigger data-testid="select-variety">
                  <SelectValue placeholder="Chọn giống" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthon">Sầu riêng Monthon</SelectItem>
                  <SelectItem value="Ri6">Sầu riêng Ri6</SelectItem>
                  <SelectItem value="Cát Hòa Lộc">Xoài Cát Hòa Lộc</SelectItem>
                  <SelectItem value="Da xanh">Bưởi Da xanh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Diện tích (ha)</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                placeholder="VD: 10"
                data-testid="input-area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedYield">Sản lượng dự kiến (tấn)</Label>
              <Input
                id="expectedYield"
                value={formData.expectedYield}
                onChange={(e) =>
                  setFormData({ ...formData, expectedYield: e.target.value })
                }
                placeholder="VD: 50"
                data-testid="input-expectedYield"
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.zone.length > 0 && formData.crop.length > 0,
    },
    {
      id: "stages",
      title: "Giai đoạn",
      description: "Các bước thực hiện",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Chọn các giai đoạn trong kế hoạch</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Chọn các giai đoạn sẽ thực hiện trong kế hoạch canh tác này
          </p>
          <div className="grid grid-cols-2 gap-3">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.stages.includes(stage)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleStage(stage)}
              >
                <Checkbox
                  checked={formData.stages.includes(stage)}
                  onCheckedChange={() => toggleStage(stage)}
                  data-testid={`stage-${index}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{stage}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Giai đoạn {index + 1}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Đã chọn {formData.stages.length} / {stages.length} giai đoạn
          </p>
        </div>
      ),
    },
    {
      id: "materials",
      title: "Vật tư",
      description: "Thuốc, phân bón",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Vật tư sử dụng</h3>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Loại vật tư</Label>
                  <Select
                    value={newMaterial.type}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, type: value })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pesticide">Thuốc BVTV</SelectItem>
                      <SelectItem value="fertilizer">Phân bón</SelectItem>
                      <SelectItem value="other">Vật tư khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tên vật tư</Label>
                  <Input
                    value={newMaterial.name}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, name: e.target.value })
                    }
                    placeholder="VD: NPK 20-20-15"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Số lượng</Label>
                  <div className="flex gap-1">
                    <Input
                      value={newMaterial.quantity}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          quantity: e.target.value,
                        })
                      }
                      placeholder="100"
                      className="h-9"
                    />
                    <Select
                      value={newMaterial.unit}
                      onValueChange={(value) =>
                        setNewMaterial({ ...newMaterial, unit: value })
                      }
                    >
                      <SelectTrigger className="h-9 w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lít">lít</SelectItem>
                        <SelectItem value="bao">bao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addMaterial} size="sm" className="h-9">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {formData.materials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                Chưa có vật tư nào. Thêm vật tư cần sử dụng ở trên.
              </div>
            ) : (
              formData.materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {material.type === "pesticide"
                        ? "Thuốc BVTV"
                        : material.type === "fertilizer"
                        ? "Phân bón"
                        : "Vật tư khác"}
                    </Badge>
                    <span className="font-medium">{material.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {material.quantity} {material.unit}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeMaterial(material.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Xác nhận kế hoạch
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Thông tin kế hoạch</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mùa vụ:</span>
                  <Badge variant="outline">{formData.season}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span>
                    {formData.startDate} - {formData.endDate}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Thông tin canh tác</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vùng:</span>
                  <span>{formData.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cây trồng:</span>
                  <span>
                    {formData.crop} - {formData.variety}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diện tích:</span>
                  <span>{formData.area} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sản lượng:</span>
                  <span>{formData.expectedYield} tấn</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng hợp</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số giai đoạn:</span>
                <span>{formData.stages.length} giai đoạn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số vật tư:</span>
                <span>{formData.materials.length} loại</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới kế hoạch canh tác"
      description="Lập kế hoạch canh tác theo từng bước"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/plan")}
            completeLabel="Tạo kế hoạch"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
