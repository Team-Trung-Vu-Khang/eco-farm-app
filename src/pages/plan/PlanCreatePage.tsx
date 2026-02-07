import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import {
  ClipboardList,
  Calendar,
  MapPin,
  Package,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  Leaf,
  Droplet,
  FileCheck,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@tankhang1/eco-shared-ui";
import {
  SEASONS,
  GROWTH_CYCLES,
  getCyclesByCrop,
  type Season,
  type GrowthCycle,
} from "./constants";

// Interface cho vật tư chi tiết
interface MaterialAllocation {
  id: number;
  cycle: string; // Chu kỳ (VD: "Chu kỳ 1", "Chu kỳ 2")
  stage: string; // Giai đoạn
  materialCategory: string; // Loại vật tư (pesticide, fertilizer, other)
  materialType: string; // Loại vật tư cụ thể (VD: "Phân NPK", "Thuốc trừ sâu")
  materialName: string; // Tên vật tư cụ thể
  quantity: string;
  unit: string;
  packaging: string; // Quy cách đóng gói
}

export default function PlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    seasonId: "", // ID of the selected season
    seasonName: "",
    startDate: "",
    endDate: "",
    zone: "",
    cultivationArea: "", // Khu vực canh tác
    plot: "", // Lô
    crop: "",
    variety: "",
    growthCycleId: "", // ID of the selected growth cycle
    area: "",
    expectedYield: "",
    description: "",
    stages: [] as string[],
    materialAllocations: [] as MaterialAllocation[],
  });

  // Derived state for validations
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // State cho form thêm vật tư
  const [newMaterial, setNewMaterial] = useState({
    cycle: "",
    stage: "",
    materialCategory: "fertilizer",
    materialType: "",
    materialName: "",
    quantity: "",
    unit: "kg",
    packaging: "",
  });

  // Default stages if no cycle selected
  const defaultStages = [
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

  // Danh sách chu kỳ (Logic business: Có thể sinh động từ Growth Cycle, tạm hardcode)
  const cycles = ["Chu kỳ 1", "Chu kỳ 2", "Chu kỳ 3", "Chu kỳ 4"];

  // Danh sách giống cây
  const cropVarieties: Record<string, string[]> = {
    "Sầu riêng": ["Ri6", "Monthong (Thái)", "Musang King", "Dona", "Sáu Hữu"],
    Xoài: ["Cát Hòa Lộc", "Cát Chu", "Tượng da xanh", "Úc", "Keo"],
    Bưởi: ["Da Xanh", "Năm Roi", "Tân Triều", "Diễn", "Phúc Trạch"],
    "Thanh long": ["Ruột trắng", "Ruột đỏ", "Vỏ vàng", "Tím hồng"],
  };

  // Danh sách loại vật tư theo category
  const materialTypes: Record<string, string[]> = {
    fertilizer: [
      "Phân NPK",
      "Phân hữu cơ",
      "Phân lân",
      "Phân kali",
      "Phân đạm",
    ],
    pesticide: [
      "Thuốc trừ sâu",
      "Thuốc trừ bệnh",
      "Thuốc diệt cỏ",
      "Thuốc kích thích sinh trưởng",
    ],
    other: ["Giống cây", "Vật tư khác"],
  };

  // Danh sách vật tư cụ thể theo loại
  const specificMaterials: Record<string, string[]> = {
    "Phân NPK": ["NPK 16-16-8", "NPK 20-20-15", "NPK 30-10-10"],
    "Phân hữu cơ": ["Phân chuồng", "Phân compost", "Phân vi sinh"],
    "Phân lân": ["Super lân", "Lân nung chảy"],
    "Phân kali": ["KCl", "K2SO4"],
    "Phân đạm": ["Urê", "Đạm amoni"],
    "Thuốc trừ sâu": ["Abamectin", "Cypermethrin", "Imidacloprid"],
    "Thuốc trừ bệnh": ["Mancozeb", "Carbendazim", "Copper oxychloride"],
    "Thuốc diệt cỏ": ["Glyphosate", "Paraquat"],
    "Thuốc kích thích sinh trưởng": ["GA3", "NAA", "Cytokinin"],
    "Giống cây": ["Giống F1", "Giống lai"],
    "Vật tư khác": ["Khác"],
  };

  const packagingOptions = [
    "Bao 50kg",
    "Bao 25kg",
    "Bao 10kg",
    "Chai 1 lít",
    "Chai 500ml",
    "Gói 100g",
    "Thùng 20 lít",
  ];

  // LOGIC HANDLERS

  // Handle Season Change
  const handleSeasonChange = (seasonId: string) => {
    const season = SEASONS.find((s) => s.id === seasonId);
    if (season) {
      setFormData((prev) => ({
        ...prev,
        seasonId: season.id,
        seasonName: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
      }));
      setDateWarning(null);
    }
  };

  // Validate Dates against Season
  useEffect(() => {
    if (formData.seasonId && formData.startDate && formData.endDate) {
      const season = SEASONS.find((s) => s.id === formData.seasonId);
      if (season) {
        if (
          formData.startDate < season.startDate ||
          formData.endDate > season.endDate
        ) {
          setDateWarning(
            `Cảnh báo: Thời gian kế hoạch nằm ngoài phạm vi mùa vụ (${season.startDate} - ${season.endDate})`,
          );
        } else {
          setDateWarning(null);
        }
      }
    }
  }, [formData.seasonId, formData.startDate, formData.endDate]);

  // Handle Growth Cycle Change
  const handleCompChange = (cycleId: string) => {
    const cycle = GROWTH_CYCLES.find((c) => c.id === cycleId);
    if (cycle) {
      setFormData((prev) => ({
        ...prev,
        growthCycleId: cycle.id,
        stages: cycle.stages, // Auto-populate stages
      }));
      toast({
        title: "Đã áp dụng quy trình",
        description: `Đã cập nhật các giai đoạn theo ${cycle.name}`,
      });
    }
  };

  const addMaterial = () => {
    if (
      newMaterial.cycle &&
      newMaterial.stage &&
      newMaterial.materialType &&
      newMaterial.materialName &&
      newMaterial.quantity &&
      newMaterial.packaging
    ) {
      setFormData({
        ...formData,
        materialAllocations: [
          ...formData.materialAllocations,
          { id: Date.now(), ...newMaterial },
        ],
      });
      // Reset form
      setNewMaterial((prev) => ({
        ...prev,
        materialName: "",
        quantity: "",
      }));
    }
  };

  const removeMaterial = (id: number) => {
    setFormData({
      ...formData,
      materialAllocations: formData.materialAllocations.filter(
        (m) => m.id !== id,
      ),
    });
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã kích hoạt kế hoạch "${formData.name}" thành công!`,
    });
    setLocation("/plan");
  };

  // PREPARE LISTS
  const availableCycles = getCyclesByCrop(formData.crop);
  const currentStages =
    formData.stages.length > 0 ? formData.stages : defaultStages;

  // Calculate totals
  const totalFertilizers = formData.materialAllocations.filter((m) =>
    materialTypes.fertilizer.includes(m.materialType),
  ).length;
  const totalPesticides = formData.materialAllocations.filter((m) =>
    materialTypes.pesticide.includes(m.materialType),
  ).length;

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin mùa vụ",
      description: "Chọn mùa và thời gian",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Thiết lập kế hoạch
            </h3>
            <p className="text-muted-foreground">
              Bắt đầu từ việc chọn Mùa vụ để định hình khung thời gian
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Chọn Mùa vụ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.seasonId}
                onValueChange={handleSeasonChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Chọn mùa vụ --" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} (
                      {s.status === "active" ? "Đang diễn ra" : "Sắp tới"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Thời gian sẽ được tự động điền theo mùa vụ đã chọn.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {dateWarning && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-200">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <span>{dateWarning}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Mã kế hoạch *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: KH-SR-XUAN25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên kế hoạch *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Canh tác Sầu riêng Vụ Xuân 2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.seasonId.length > 0 &&
        formData.code.length > 0 &&
        formData.name.length > 0 &&
        formData.startDate.length > 0,
    },
    {
      id: "cultivation",
      title: "Thông tin canh tác",
      description: "Vùng, cây trồng, quy trình",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vùng canh tác *</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    zone: value,
                    cultivationArea: "",
                    plot: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vùng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vùng A1 - Bình Phước">
                    Vùng A1 - Bình Phước
                  </SelectItem>
                  <SelectItem value="Vùng B3 - Đồng Nai">
                    Vùng B3 - Đồng Nai
                  </SelectItem>
                  <SelectItem value="Vùng C2 - Bến Tre">
                    Vùng C2 - Bến Tre
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* ... Area/Plot Selects omitted for brevity but logic is same as before ... */}
            <div className="space-y-2">
              <Label>Cây trồng *</Label>
              <Select
                value={formData.crop}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    crop: value,
                    growthCycleId: "",
                    variety: "",
                  })
                }
              >
                <SelectTrigger>
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
          </div>

          {formData.crop && (
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3 animation-fade-in">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">
                  Chuẩn hóa quy trình
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                Hệ thống đề xuất các quy trình canh tác chuẩn dựa trên cây trồng{" "}
                <strong>{formData.crop}</strong> của bạn.
              </p>

              <div className="space-y-2">
                <Label>Chọn Quy trình canh tác (Growth Cycle)</Label>
                <Select
                  value={formData.growthCycleId}
                  onValueChange={handleCompChange}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="-- Chọn quy trình chuẩn --" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCycles.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} (Khoảng {c.durationDays} ngày)
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Tùy chỉnh (Thủ công)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.growthCycleId &&
                formData.growthCycleId !== "custom" && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    Đã tự động tải{" "}
                    {
                      GROWTH_CYCLES.find((c) => c.id === formData.growthCycleId)
                        ?.stages.length
                    }{" "}
                    giai đoạn mẫu.
                  </div>
                )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Giống cây</Label>
              <Select
                value={formData.variety}
                onValueChange={(value) =>
                  setFormData({ ...formData, variety: value })
                }
                disabled={!formData.crop}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.crop ? "Chọn giống" : "Chọn cây trồng trước"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(cropVarieties[formData.crop] || []).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Diện tích (ha)</Label>
              <Input
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.zone.length > 0 && formData.crop.length > 0,
    },
    {
      id: "stages",
      title: "Giai đoạn & Nhiệm vụ",
      description: "Chi tiết các mốc thời gian",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Các giai đoạn triển khai</h3>
            </div>
            {formData.growthCycleId && formData.growthCycleId !== "custom" && (
              <Badge variant="secondary">
                Theo quy trình:{" "}
                {
                  GROWTH_CYCLES.find((c) => c.id === formData.growthCycleId)
                    ?.name
                }
              </Badge>
            )}
          </div>

          <div className="grid gap-3">
            {currentStages.map((stage, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 font-medium">{stage}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Chi tiết
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <Info className="w-4 h-4 mt-0.5" />
            <p>
              Các giai đoạn này sẽ được sử dụng để tạo lịch công việc tự động
              cho nhân viên sau khi kế hoạch được kích hoạt.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "materials",
      title: "Vật tư dự kiến",
      description: "Hoạch định vật tư cần thiết",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">
              Phân bổ vật tư theo chu kỳ và giai đoạn
            </h3>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thêm vật tư dự trù</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Cycles */}
                <div className="space-y-2">
                  <Label>Chu kỳ/Lần bón</Label>
                  <Select
                    value={newMaterial.cycle}
                    onValueChange={(v) =>
                      setNewMaterial({ ...newMaterial, cycle: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lần..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cycles.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Stages based on current stages list */}
                <div className="space-y-2">
                  <Label>Giai đoạn áp dụng</Label>
                  <Select
                    value={newMaterial.stage}
                    onValueChange={(v) =>
                      setNewMaterial({ ...newMaterial, stage: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giai đoạn..." />
                    </SelectTrigger>
                    <SelectContent>
                      {currentStages.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Material Selection (Simplified for Demo) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại vật tư</Label>
                  <Select
                    value={newMaterial.materialType}
                    onValueChange={(v) =>
                      setNewMaterial({ ...newMaterial, materialType: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(specificMaterials).map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tên vật tư</Label>
                  <Select
                    value={newMaterial.materialName}
                    onValueChange={(v) =>
                      setNewMaterial({ ...newMaterial, materialName: v })
                    }
                    disabled={!newMaterial.materialType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tên..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(specificMaterials[newMaterial.materialType] || []).map(
                        (n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Số lượng</Label>
                  <Input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị</Label>
                  <Select
                    value={newMaterial.unit}
                    onValueChange={(v) =>
                      setNewMaterial({ ...newMaterial, unit: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lít">lít</SelectItem>
                      <SelectItem value="bao">bao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-8" onClick={addMaterial}>
                  {" "}
                  <Plus className="w-4 h-4 mr-2" /> Thêm{" "}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* List of allocations */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Danh sách đã thêm
            </h4>
            {formData.materialAllocations.length === 0 && (
              <p className="text-sm italic text-muted-foreground">
                Chưa có dữ liệu.
              </p>
            )}
            {formData.materialAllocations.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center p-3 bg-muted/20 rounded border"
              >
                <div>
                  <p className="font-medium">{m.materialName}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.cycle} - {m.stage}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {m.quantity} {m.unit}
                  </Badge>
                  <Trash2
                    className="w-4 h-4 text-destructive cursor-pointer"
                    onClick={() => removeMaterial(m.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Kiểm tra tổng quan",
      content: (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Xác nhận kế hoạch
            </h3>
            <p className="text-muted-foreground">
              Vui lòng kiểm tra kỹ các thông tin trước khi kích hoạt
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Thông tin chung
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Mã kế hoạch:</span>{" "}
                    {formData.code}
                  </li>
                  <li>
                    <span className="font-medium">Tên kế hoạch:</span>{" "}
                    {formData.name}
                  </li>
                  <li>
                    <span className="font-medium">Mùa vụ:</span>{" "}
                    {formData.seasonName}
                  </li>
                  <li>
                    <span className="font-medium">Thời gian:</span>{" "}
                    {formData.startDate} đến {formData.endDate}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Canh tác
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Vùng:</span> {formData.zone}
                  </li>
                  <li>
                    <span className="font-medium">Cây trồng:</span>{" "}
                    {formData.crop} ({formData.variety || "Chưa rõ giống"})
                  </li>
                  <li>
                    <span className="font-medium">Quy trình:</span>{" "}
                    {formData.growthCycleId
                      ? GROWTH_CYCLES.find(
                          (c) => c.id === formData.growthCycleId,
                        )?.name
                      : "Tự chọn"}
                  </li>
                  <li>
                    <span className="font-medium">Quy mô:</span>{" "}
                    {formData.area ? `${formData.area} ha` : "Chưa nhập"}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Calendar className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">
                  {formData.stages.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  Giai đoạn triển khai
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Leaf className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{totalFertilizers}</span>
                <span className="text-xs text-muted-foreground">
                  Hạng mục Phân bón
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Droplet className="w-8 h-8 text-amber-500 mb-2" />
                <span className="text-2xl font-bold">{totalPesticides}</span>
                <span className="text-xs text-muted-foreground">
                  Hạng mục Thuốc BVTV
                </span>
              </CardContent>
            </Card>
          </div>

          {currentStages.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold text-sm mb-3">
                Tóm tắt các giai đoạn chính
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentStages.map((s, i) => (
                  <Badge key={i} variant="outline" className="bg-secondary/20">
                    {i + 1}. {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-4 bg-muted rounded-lg text-sm">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p>
              Sau khi kích hoạt, hệ thống sẽ tự động tạo ra{" "}
              <strong>bảng công việc (Task Board)</strong> cho từng giai đoạn và
              gửi thông báo đến các bộ phận liên quan. Bạn có thể điều chỉnh chi
              tiết công việc sau đó.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo kế hoạch canh tác mới"
      description="Thiết lập kế hoạch theo mùa vụ và quy trình chuẩn"
    >
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/plan")}
      />
    </AdminLayout>
  );
}
