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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tankhang1/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Layers,
  Plus,
  Save,
  Sprout,
  Info,
  Trash2,
} from "lucide-react";
import type { CreateSeasonForm } from "./types";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useSeasonStore from "../../stores/useSeasonStore";
import { GrowthCycleSelectDialog } from "./components/GrowthCycleSelectDialog";
import { FileUploader } from "./components/FileUploader";
import { CROP_OPTIONS } from "../../constants/crops";

export default function CreateSeasonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { growthCycles } = useGrowthCycleStore();
  const { addSeason } = useSeasonStore();

  const [formData, setFormData] = useState<CreateSeasonForm>({
    code: "",
    name: "",
    description: "",
    duration: 0,
    status: "planning",
    growthCycleIds: [],
    selectedStages: {},
    documents: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedCycles = growthCycles.filter((c) =>
    formData.growthCycleIds.includes(c.id),
  );

  const handleSave = () => {
    // Validation
    if (!formData.code || !formData.name || formData.duration <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    addSeason({
      code: formData.code,
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      status: formData.status,
      growthCycleIds: formData.growthCycleIds,
      selectedStages: formData.selectedStages,
      documents: formData.documents.map((doc) => ({
        name: doc.name,
        type: "technical",
        id: Date.now().toString(),
        url: URL.createObjectURL(doc),
        uploadedAt: new Date().toISOString(),
      })),
    });

    toast({
      title: "Thành công",
      description: "Đã tạo mùa vụ mới",
    });
    setLocation("/season");
  };

  const removeCycle = (id: string) => {
    setFormData((prev) => {
      const newStages = { ...prev.selectedStages };
      delete newStages[id];
      return {
        ...prev,
        growthCycleIds: prev.growthCycleIds.filter((c) => c !== id),
        selectedStages: newStages,
      };
    });
  };

  const getCropImage = (cropName: string) => {
    return CROP_OPTIONS.find((c) => c.name === cropName)?.image;
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
                    Thời gian (ngày) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="VD: 120"
                      className="pl-10"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: Number(e.target.value),
                        })
                      }
                    />
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
                      <SelectItem value="planning">
                        Đang lập kế hoạch
                      </SelectItem>
                      <SelectItem value="active">Đang triển khai</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="ml-auto">
                    Đã chọn: {formData.growthCycleIds.length}
                  </Badge>
                  <Button
                    size="sm"
                    className="h-8 font-bold"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {selectedCycles.length > 0 ? (
                  selectedCycles.map((cycle) => {
                    const selectedStageIds =
                      formData.selectedStages[cycle.id] || [];
                    const selectedStageData =
                      cycle.stages?.filter((s) =>
                        selectedStageIds.includes(s.id),
                      ) || [];

                    return (
                      <div
                        key={cycle.id}
                        className="flex flex-col p-4 rounded-xl border bg-white shadow-sm hover:border-green-200 transition-all group gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 border shadow-sm">
                              <AvatarImage src={getCropImage(cycle.cropName)} />
                              <AvatarFallback>
                                {cycle.cropName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-sm leading-tight text-slate-800">
                                {cycle.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                                <span>{cycle.cropName}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{cycle.totalDays} ngày</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-green-600 font-medium">
                                  {selectedStageIds.length}/
                                  {cycle.stages?.length || 0} giai đoạn
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                            onClick={() => removeCycle(cycle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {selectedStageData.length > 0 && (
                          <div className="pl-14">
                            <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                              <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Giai đoạn áp dụng
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedStageData.map((stage) => (
                                  <Badge
                                    key={stage.id}
                                    variant="secondary"
                                    className="bg-white border-slate-200 text-slate-700 font-normal shadow-sm"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                                    {stage.name} ({stage.duration} ngày)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-2xl bg-muted/20">
                    <Layers className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Chưa có chu kỳ nào được chọn.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 text-green-700 font-bold"
                      onClick={() => setDialogOpen(true)}
                    >
                      + Chọn chu kỳ từ thư viện
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
            <CardContent>
              <FileUploader
                files={formData.documents}
                onChange={(files) =>
                  setFormData({ ...formData, documents: files as Array<File> })
                }
              />
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

      <GrowthCycleSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedIds={formData.growthCycleIds}
        selectedStages={formData.selectedStages}
        onConfirm={(ids, stages) =>
          setFormData({
            ...formData,
            growthCycleIds: ids,
            selectedStages: stages,
          })
        }
      />
    </AdminLayout>
  );
}
