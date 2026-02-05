import {
  AdminLayout,
  Button,
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
  Textarea,
  useToast,
  Badge,
} from "@tankhang1/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Leaf,
  Plus,
  Save,
  Sprout,
  Info,
} from "lucide-react";
import type { CreateSeasonForm } from "./types";
import { initialGrowthCycles } from "../growth-cycle/mocks";

export default function CreateSeasonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateSeasonForm>({
    code: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planning",
    growthCycleIds: [],
    documents: [],
  });

  const handleSave = () => {
    // Validation
    if (!formData.code || !formData.name || !formData.startDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    console.log("Saving Season:", formData);
    toast({
      title: "Thành công",
      description: "Đã tạo mùa vụ mới",
    });
    setLocation("/season");
  };

  const toggleGrowthCycle = (id: string) => {
    setFormData((prev) => {
      const current = prev.growthCycleIds;
      const exists = current.includes(id);
      if (exists) {
        return { ...prev, growthCycleIds: current.filter((c) => c !== id) };
      } else {
        return { ...prev, growthCycleIds: [...current, id] };
      }
    });
  };

  return (
    <AdminLayout
      title="Thêm mới mùa vụ"
      description="Thiết lập kế hoạch mùa vụ và quy trình canh tác"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/season")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <CardTitle>Thông tin chung</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Mã mùa vụ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="VD: MV2024-01"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Tên mùa vụ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="VD: Vụ Xuân 2024"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  placeholder="Mô tả chi tiết về kế hoạch mùa vụ..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Ngày bắt đầu <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc (Dự kiến)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Đang lập kế hoạch</SelectItem>
                    <SelectItem value="active">Đang triển khai</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-700">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <CardTitle>Chu kỳ sinh trưởng áp dụng</CardTitle>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Đã chọn: {formData.growthCycleIds.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {initialGrowthCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className={`
                        relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          formData.growthCycleIds.includes(cycle.id)
                            ? "border-green-600 bg-green-50 shadow-md"
                            : "border-muted hover:border-green-200 hover:bg-muted/50"
                        }
                    `}
                    onClick={() => toggleGrowthCycle(cycle.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${formData.growthCycleIds.includes(cycle.id) ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}
                        `}
                      >
                        <Leaf className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {cycle.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Sprout className="w-3 h-3" />
                            {cycle.cropName} - {cycle.variety}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                          <span>{cycle.totalDays} ngày</span>
                        </div>
                      </div>
                    </div>
                    {formData.growthCycleIds.includes(cycle.id) && (
                      <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                        Đã chọn
                      </div>
                    )}
                  </div>
                ))}

                {initialGrowthCycles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Chưa có mẫu chu kỳ sinh trưởng nào.</p>
                    <Button
                      variant="link"
                      onClick={() => setLocation("/growth-cycle/create")}
                    >
                      + Tạo chu kỳ mới
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle>Tài liệu kỹ thuật</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Tải lên tài liệu</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, Word, Excel (Max 10MB)
                </p>
              </div>

              {/* Placeholder for list of uploaded files */}
            </CardContent>
          </Card>

          <div className="sticky top-6">
            <Button
              size="lg"
              className="w-full font-bold shadow-lg shadow-primary/20"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu mùa vụ
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
