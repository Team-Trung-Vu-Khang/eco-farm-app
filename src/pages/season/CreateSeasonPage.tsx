import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  useToast,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
  Trees,
  Flower,
} from "lucide-react";
import type { CreateSeasonForm } from "./types";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useVarietyStore from "../../stores/useVarietyStore";
import { GrowthCycleSelectDialog } from "./components/GrowthCycleSelectDialog";
import { FileUploader } from "./components/FileUploader";
import { CROP_OPTIONS } from "../../constants/crops";

export default function CreateSeasonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { growthCycles } = useGrowthCycleStore();
  const { addSeason } = useSeasonStore();
  const { varieties } = useVarietyStore();

  const [formData, setFormData] = useState<CreateSeasonForm>({
    code: "",
    name: "",
    description: "",
    duration: 0,
    status: "planning",
    scope: "crop",
    cropId: undefined,
    varietyId: undefined,
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
      status: "planning",
      scope: formData.scope,
      cropId: formData.cropId,
      varietyId: formData.varietyId,
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
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-bold text-slate-800">
                  Phạm vi áp dụng
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4
                      ${formData.scope === "crop" ? "border-green-600 bg-green-50/30" : "border-slate-100 bg-white hover:border-green-200"}
                    `}
                    onClick={() => {
                      if (formData.scope !== "crop") {
                        setFormData({
                          ...formData,
                          scope: "crop",
                          cropId: undefined,
                          varietyId: undefined,
                          growthCycleIds: [],
                          selectedStages: {},
                        });
                      }
                    }}
                  >
                    <div
                      className={`
                      p-3 rounded-full shrink-0
                      ${formData.scope === "crop" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}
                    `}
                    >
                      <Trees className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          Theo loại cây trồng
                        </span>
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${formData.scope === "crop" ? "border-green-600" : "border-slate-300"}
                        `}
                        >
                          {formData.scope === "crop" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Áp dụng cho tất cả các giống thuộc loại cây trồng này.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4
                      ${formData.scope === "variety" ? "border-green-600 bg-green-50/30" : "border-slate-100 bg-white hover:border-green-200"}
                    `}
                    onClick={() => {
                      if (formData.scope !== "variety") {
                        setFormData({
                          ...formData,
                          scope: "variety",
                          cropId: undefined,
                          varietyId: undefined,
                          growthCycleIds: [],
                          selectedStages: {},
                        });
                      }
                    }}
                  >
                    <div
                      className={`
                      p-3 rounded-full shrink-0
                      ${formData.scope === "variety" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}
                    `}
                    >
                      <Flower className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          Theo giống cụ thể
                        </span>
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${formData.scope === "variety" ? "border-green-600" : "border-slate-300"}
                        `}
                        >
                          {formData.scope === "variety" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Chỉ áp dụng cho chính xác giống cây trồng được chọn.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specific Selection based on Scope */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {formData.scope === "crop"
                          ? "Loại cây trồng"
                          : "Bước 1: Loại cây trồng"}
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Select
                        value={formData.cropId}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            cropId: value,
                            varietyId: undefined,
                            growthCycleIds: [],
                            selectedStages: {},
                          })
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="-- Chọn cây trồng --" />
                        </SelectTrigger>
                        <SelectContent>
                          {CROP_OPTIONS.map((opt) => (
                            <SelectItem key={opt.id} value={opt.name}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback>
                                    {opt.name.charAt(0)}
                                  </AvatarFallback>
                                  <AvatarImage src={opt.image} />
                                </Avatar>
                                <span>{opt.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.scope === "variety" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                          Bước 2: Giống cây trồng
                          <span className="text-destructive"> *</span>
                        </Label>
                        <Select
                          value={formData.varietyId}
                          disabled={!formData.cropId}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              varietyId: value,
                              growthCycleIds: [],
                              selectedStages: {},
                            })
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="-- Chọn giống --" />
                          </SelectTrigger>
                          <SelectContent>
                            {varieties
                              .filter((v) => {
                                return v.crop === formData.cropId;
                              })
                              .map((variety) => (
                                <SelectItem key={variety.id} value={variety.id}>
                                  {variety.varietyName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-4">
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
                    const selectedStageMap =
                      formData.selectedStages[cycle.id] || {};
                    const selectedStageData =
                      cycle.stages?.filter((s) => !!selectedStageMap[s.id]) ||
                      [];

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
                                  {Object.keys(selectedStageMap).length}/
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
                                    {stage.name} ({selectedStageMap[stage.id]}{" "}
                                    ngày)
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
        scope={formData.scope}
        cropId={formData.cropId}
        varietyId={formData.varietyId}
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
