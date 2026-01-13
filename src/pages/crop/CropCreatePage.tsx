import { useState } from "react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

import { Flower2, Check, Info, Leaf } from "lucide-react";

const categories = [
  "Cây ăn quả",
  "Cây có múi",
  "Cây công nghiệp",
  "Cây gia vị",
  "Cây dược liệu",
  "Cây lương thực",
  "Rau màu",
];

export default function CropCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    scientificName: "",
    category: "",
    origin: "",
    characteristics: "",
    growthTime: "",
    harvestTime: "",
    suitableTerrain: "",
    suitableSoil: "",
    notes: "",
  });

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo cây trồng "${formData.name}"`,
    });
    setLocation("/crop");
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, mã, phân loại",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Flower2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Thông tin cây trồng
            </h3>
            <p className="text-muted-foreground">
              Nhập thông tin cơ bản về cây trồng
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã cây trồng *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CT001"
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Phân loại *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Chọn phân loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên cây trồng *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Sầu riêng"
              data-testid="input-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scientificName">Tên khoa học</Label>
            <Input
              id="scientificName"
              value={formData.scientificName}
              onChange={(e) =>
                setFormData({ ...formData, scientificName: e.target.value })
              }
              placeholder="VD: Durio zibethinus"
              data-testid="input-scientificName"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Nguồn gốc</Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
              placeholder="VD: Đông Nam Á"
              data-testid="input-origin"
            />
          </div>
        </div>
      ),
      isValid: formData.code.length > 0 && formData.name.length > 0,
    },
    {
      id: "characteristics",
      title: "Đặc điểm",
      description: "Mô tả, đặc tính",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Đặc điểm sinh học</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="characteristics">Đặc điểm chung</Label>
            <Textarea
              id="characteristics"
              value={formData.characteristics}
              onChange={(e) =>
                setFormData({ ...formData, characteristics: e.target.value })
              }
              placeholder="Mô tả đặc điểm sinh học, hình thái, đặc tính của cây..."
              rows={4}
              data-testid="input-characteristics"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="growthTime">Thời gian sinh trưởng</Label>
              <Input
                id="growthTime"
                value={formData.growthTime}
                onChange={(e) =>
                  setFormData({ ...formData, growthTime: e.target.value })
                }
                placeholder="VD: 4-5 năm cho trái"
                data-testid="input-growthTime"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvestTime">Mùa thu hoạch</Label>
              <Input
                id="harvestTime"
                value={formData.harvestTime}
                onChange={(e) =>
                  setFormData({ ...formData, harvestTime: e.target.value })
                }
                placeholder="VD: Tháng 5-8 hàng năm"
                data-testid="input-harvestTime"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "conditions",
      title: "Điều kiện canh tác",
      description: "Địa hình, đất phù hợp",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Điều kiện canh tác phù hợp</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="suitableTerrain">Địa hình phù hợp</Label>
            <Select
              value={formData.suitableTerrain}
              onValueChange={(value) =>
                setFormData({ ...formData, suitableTerrain: value })
              }
            >
              <SelectTrigger data-testid="select-terrain">
                <SelectValue placeholder="Chọn địa hình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đồng bằng">Đồng bằng</SelectItem>
                <SelectItem value="Đồi núi thấp">Đồi núi thấp</SelectItem>
                <SelectItem value="Đồi núi cao">Đồi núi cao</SelectItem>
                <SelectItem value="Ven sông">Ven sông</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="suitableSoil">Loại đất phù hợp</Label>
            <Select
              value={formData.suitableSoil}
              onValueChange={(value) =>
                setFormData({ ...formData, suitableSoil: value })
              }
            >
              <SelectTrigger data-testid="select-soil">
                <SelectValue placeholder="Chọn loại đất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đất phù sa">Đất phù sa</SelectItem>
                <SelectItem value="Đất đỏ bazan">Đất đỏ bazan</SelectItem>
                <SelectItem value="Đất cát">Đất cát</SelectItem>
                <SelectItem value="Đất thịt">Đất thịt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú thêm</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Các lưu ý về canh tác, chăm sóc..."
              rows={3}
              data-testid="input-notes"
            />
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Xác nhận thông tin
            </h3>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Flower2 className="w-4 h-4" />
                Thông tin cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã:</span>
                <span className="font-medium">{formData.code || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên:</span>
                <span className="font-medium">{formData.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên khoa học:</span>
                <span className="italic">{formData.scientificName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phân loại:</span>
                <Badge variant="outline">{formData.category || "-"}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa hình phù hợp:</span>
                <span>{formData.suitableTerrain || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại đất:</span>
                <span>{formData.suitableSoil || "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới cây trồng"
      description="Thêm cây trồng vào danh mục hệ thống"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/crop")}
            completeLabel="Tạo cây trồng"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
