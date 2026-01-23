import { useState } from "react";
import { useLocation, useParams } from "wouter";

import {
  ClipboardList,
  Check,
  Calendar,
  MapPin,
  Package,
  Plus,
  Trash2,
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
} from "@tankhang1/eco-shared-ui";

// Interface cho vật tư chi tiết
interface MaterialAllocation {
  id: number;
  cycle: string;
  stage: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  packaging: string;
}

// Mock data - trong thực tế sẽ fetch từ API
const mockPlanData = {
  id: "1",
  code: "KH001",
  name: "Kế hoạch sầu riêng vụ Xuân 2025",
  season: "Vụ Xuân 2025",
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  zone: "Vùng A1 - Bình Phước",
  cultivationArea: "Khu A",
  plot: "Lô 1",
  crop: "Sầu riêng",
  variety: "Monthon",
  area: "10",
  expectedYield: "50",
  description: "Kế hoạch canh tác sầu riêng Monthon vụ Xuân 2025 tại vùng A1",
  stages: [
    "Chuẩn bị đất",
    "Gieo trồng",
    "Chăm sóc giai đoạn 1",
    "Bón phân lần 1",
    "Phun thuốc BVTV",
  ],
  materialAllocations: [
    {
      id: 1,
      cycle: "Chu kỳ 1",
      stage: "Chuẩn bị đất",
      materialCategory: "fertilizer",
      materialType: "Phân hữu cơ",
      materialName: "Phân chuồng",
      quantity: "500",
      unit: "kg",
      packaging: "Bao 50kg",
    },
    {
      id: 2,
      cycle: "Chu kỳ 1",
      stage: "Bón phân lần 1",
      materialCategory: "fertilizer",
      materialType: "Phân NPK",
      materialName: "NPK 20-20-15",
      quantity: "100",
      unit: "kg",
      packaging: "Bao 25kg",
    },
    {
      id: 3,
      cycle: "Chu kỳ 1",
      stage: "Phun thuốc BVTV",
      materialCategory: "pesticide",
      materialType: "Thuốc trừ sâu",
      materialName: "Abamectin",
      quantity: "2",
      unit: "lít",
      packaging: "Chai 1 lít",
    },
  ] as MaterialAllocation[],
};

export default function PlanEditPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Load existing data
  const [formData, setFormData] = useState(mockPlanData);

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

  const cycles = ["Chu kỳ 1", "Chu kỳ 2", "Chu kỳ 3", "Chu kỳ 4"];

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

  const toggleStage = (stage: string) => {
    setFormData({
      ...formData,
      stages: formData.stages.includes(stage)
        ? formData.stages.filter((s) => s !== stage)
        : [...formData.stages, stage],
    });
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
      setNewMaterial({
        cycle: "",
        stage: "",
        materialCategory: "fertilizer",
        materialType: "",
        materialName: "",
        quantity: "",
        unit: "kg",
        packaging: "",
      });
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
      description: `Đã cập nhật kế hoạch "${formData.name}"`,
    });
    setLocation(`/plan/${params.id}`);
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
              Chỉnh sửa thông tin cơ bản về kế hoạch canh tác
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
                setFormData({
                  ...formData,
                  zone: value,
                  cultivationArea: "",
                  plot: "",
                })
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
              <Label>Khu vực canh tác *</Label>
              <Select
                value={formData.cultivationArea}
                onValueChange={(value) =>
                  setFormData({ ...formData, cultivationArea: value, plot: "" })
                }
                disabled={!formData.zone}
              >
                <SelectTrigger data-testid="select-cultivation-area">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khu A">Khu A (5 ha)</SelectItem>
                  <SelectItem value="Khu B">Khu B (8 ha)</SelectItem>
                  <SelectItem value="Khu C">Khu C (12 ha)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lô *</Label>
              <Select
                value={formData.plot}
                onValueChange={(value) =>
                  setFormData({ ...formData, plot: value })
                }
                disabled={!formData.cultivationArea}
              >
                <SelectTrigger data-testid="select-plot">
                  <SelectValue placeholder="Chọn lô" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lô 1">Lô 1 (1.5 ha)</SelectItem>
                  <SelectItem value="Lô 2">Lô 2 (2 ha)</SelectItem>
                  <SelectItem value="Lô 3">Lô 3 (1.5 ha)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
      isValid:
        formData.zone.length > 0 &&
        formData.cultivationArea.length > 0 &&
        formData.plot.length > 0 &&
        formData.crop.length > 0,
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
      description: "Phân bổ vật tư",
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
              <CardTitle className="text-base">Thêm vật tư mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chu kỳ *</Label>
                  <Select
                    value={newMaterial.cycle}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, cycle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cycles.map((cycle) => (
                        <SelectItem key={cycle} value={cycle}>
                          {cycle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giai đoạn *</Label>
                  <Select
                    value={newMaterial.stage}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giai đoạn" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Loại vật tư *</Label>
                  <Select
                    value={newMaterial.materialCategory}
                    onValueChange={(value) =>
                      setNewMaterial({
                        ...newMaterial,
                        materialCategory: value,
                        materialType: "",
                        materialName: "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fertilizer">Phân bón</SelectItem>
                      <SelectItem value="pesticide">Thuốc BVTV</SelectItem>
                      <SelectItem value="other">Vật tư khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phân loại *</Label>
                  <Select
                    value={newMaterial.materialType}
                    onValueChange={(value) =>
                      setNewMaterial({
                        ...newMaterial,
                        materialType: value,
                        materialName: "",
                      })
                    }
                    disabled={!newMaterial.materialCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phân loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes[newMaterial.materialCategory]?.map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tên vật tư *</Label>
                  <Select
                    value={newMaterial.materialName}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, materialName: value })
                    }
                    disabled={!newMaterial.materialType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vật tư" />
                    </SelectTrigger>
                    <SelectContent>
                      {specificMaterials[newMaterial.materialType]?.map(
                        (name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Số lượng *</Label>
                  <Input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        quantity: e.target.value,
                      })
                    }
                    placeholder="VD: 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị *</Label>
                  <Select
                    value={newMaterial.unit}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lít">lít</SelectItem>
                      <SelectItem value="bao">bao</SelectItem>
                      <SelectItem value="chai">chai</SelectItem>
                      <SelectItem value="gói">gói</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quy cách đóng gói *</Label>
                  <Select
                    value={newMaterial.packaging}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, packaging: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quy cách" />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={addMaterial} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Thêm vật tư
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium">Danh sách vật tư đã phân bổ</h4>
            {formData.materialAllocations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                Chưa có vật tư nào. Thêm vật tư ở form bên trên.
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">
                    Tất cả ({formData.materialAllocations.length})
                  </TabsTrigger>
                  {cycles.map((cycle) => {
                    const count = formData.materialAllocations.filter(
                      (m) => m.cycle === cycle,
                    ).length;
                    return count > 0 ? (
                      <TabsTrigger key={cycle} value={cycle}>
                        {cycle} ({count})
                      </TabsTrigger>
                    ) : null;
                  })}
                </TabsList>

                <TabsContent value="all" className="space-y-2 mt-4">
                  {formData.materialAllocations.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Chu kỳ & Giai đoạn
                              </p>
                              <div className="space-y-1">
                                <Badge variant="outline">
                                  {material.cycle}
                                </Badge>
                                <p className="text-sm font-medium">
                                  {material.stage}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Vật tư
                              </p>
                              <div className="space-y-1">
                                <Badge>
                                  {material.materialCategory === "fertilizer"
                                    ? "Phân bón"
                                    : material.materialCategory === "pesticide"
                                      ? "Thuốc BVTV"
                                      : "Vật tư khác"}
                                </Badge>
                                <p className="text-sm">
                                  {material.materialType}
                                </p>
                                <p className="text-sm font-medium">
                                  {material.materialName}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Số lượng
                              </p>
                              <p className="text-sm font-medium">
                                {material.quantity} {material.unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Quy cách
                              </p>
                              <p className="text-sm">{material.packaging}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeMaterial(material.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {cycles.map((cycle) => {
                  const cycleMaterials = formData.materialAllocations.filter(
                    (m) => m.cycle === cycle,
                  );
                  return cycleMaterials.length > 0 ? (
                    <TabsContent
                      key={cycle}
                      value={cycle}
                      className="space-y-2 mt-4"
                    >
                      {cycleMaterials.map((material) => (
                        <Card key={material.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 grid grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Giai đoạn
                                  </p>
                                  <p className="text-sm font-medium">
                                    {material.stage}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Vật tư
                                  </p>
                                  <div className="space-y-1">
                                    <Badge>
                                      {material.materialCategory ===
                                      "fertilizer"
                                        ? "Phân bón"
                                        : material.materialCategory ===
                                            "pesticide"
                                          ? "Thuốc BVTV"
                                          : "Vật tư khác"}
                                    </Badge>
                                    <p className="text-sm">
                                      {material.materialType}
                                    </p>
                                    <p className="text-sm font-medium">
                                      {material.materialName}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Số lượng
                                  </p>
                                  <p className="text-sm font-medium">
                                    {material.quantity} {material.unit}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Quy cách
                                  </p>
                                  <p className="text-sm">
                                    {material.packaging}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => removeMaterial(material.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ) : null;
                })}
              </Tabs>
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Xác nhận thay đổi
            </h3>
            <p className="text-muted-foreground mt-2">
              Kiểm tra lại thông tin trước khi cập nhật kế hoạch
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Thông tin kế hoạch
                </CardTitle>
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
                  <span className="text-xs">
                    {formData.startDate} - {formData.endDate}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Thông tin canh tác
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vùng:</span>
                  <span className="text-xs">{formData.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khu vực:</span>
                  <span className="font-medium">
                    {formData.cultivationArea}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lô:</span>
                  <span className="font-medium">{formData.plot}</span>
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Giai đoạn canh tác ({formData.stages.length} giai đoạn)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.stages.map((stage, index) => (
                  <Badge key={stage} variant="secondary">
                    {index + 1}. {stage}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4" />
                Vật tư phân bổ ({formData.materialAllocations.length} loại)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.materialAllocations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có vật tư nào được phân bổ
                </p>
              ) : (
                <div className="space-y-4">
                  {cycles.map((cycle) => {
                    const cycleMaterials = formData.materialAllocations.filter(
                      (m) => m.cycle === cycle,
                    );
                    if (cycleMaterials.length === 0) return null;

                    return (
                      <div key={cycle} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{cycle}</h5>
                          <Badge variant="outline">
                            {cycleMaterials.length} vật tư
                          </Badge>
                        </div>
                        <div className="ml-4 space-y-2">
                          {Array.from(
                            new Set(cycleMaterials.map((m) => m.stage)),
                          ).map((stage) => {
                            const stageMaterials = cycleMaterials.filter(
                              (m) => m.stage === stage,
                            );
                            return (
                              <div
                                key={stage}
                                className="border-l-2 border-primary/20 pl-3"
                              >
                                <p className="text-sm font-medium mb-1">
                                  {stage}
                                </p>
                                <div className="space-y-1">
                                  {stageMaterials.map((material) => (
                                    <div
                                      key={material.id}
                                      className="text-xs bg-muted/50 p-2 rounded flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {material.materialCategory ===
                                          "fertilizer"
                                            ? "Phân"
                                            : material.materialCategory ===
                                                "pesticide"
                                              ? "Thuốc"
                                              : "Khác"}
                                        </Badge>
                                        <span className="font-medium">
                                          {material.materialName}
                                        </span>
                                        <span className="text-muted-foreground">
                                          ({material.materialType})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                          {material.quantity} {material.unit}
                                        </span>
                                        <span className="text-muted-foreground">
                                          - {material.packaging}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tổng hợp</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số giai đoạn:</span>
                  <span className="font-medium">
                    {formData.stages.length} giai đoạn
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số vật tư:</span>
                  <span className="font-medium">
                    {formData.materialAllocations.length} loại
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phân bón:</span>
                  <span className="font-medium">
                    {
                      formData.materialAllocations.filter(
                        (m) => m.materialCategory === "fertilizer",
                      ).length
                    }{" "}
                    loại
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thuốc BVTV:</span>
                  <span className="font-medium">
                    {
                      formData.materialAllocations.filter(
                        (m) => m.materialCategory === "pesticide",
                      ).length
                    }{" "}
                    loại
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Chỉnh sửa kế hoạch canh tác"
      description={`Cập nhật thông tin kế hoạch ${formData.code}`}
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation(`/plan/${params.id}`)}
            completeLabel="Cập nhật kế hoạch"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
