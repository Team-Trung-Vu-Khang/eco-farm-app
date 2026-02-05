import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  StepperForm,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  FileText,
  Layers,
  Layout,
  Plus,
  Sprout,
  Trash,
  TreeDeciduous,
  Flower2,
  Upload,
} from "lucide-react";
import type { CreateGrowthCycleForm, GrowthStage } from "./types";
import {
  cropOptions,
  initialEditorValue,
  initialGrowthCycles,
  varietyOptions,
} from "./mocks";

export default function UpdateGrowthCyclePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/growth-cycle/:id/edit");
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateGrowthCycleForm>({
    scope: "crop",
    cropId: "",
    variety: "",
    totalDays: 0,
    stages: [
      {
        id: "1",
        name: "Giai đoạn 1",
        duration: 0,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
  });

  useEffect(() => {
    if (match && params?.id) {
      const cycle = initialGrowthCycles.find((c) => c.id === params.id);
      if (cycle) {
        setFormData({
          scope: cycle.scope || "variety", // Fallback for old data
          cropId: cycle.cropId,
          variety: cycle.variety,
          totalDays: cycle.totalDays,
          stages:
            cycle.stages.length > 0
              ? cycle.stages
              : [
                  {
                    id: "1",
                    name: "Giai đoạn 1",
                    duration: 0,
                    usePdf: false,
                    content: initialEditorValue,
                  },
                ],
        });
      }
    }
  }, [match, params?.id]);

  const handleComplete = () => {
    console.log("Update Data:", formData);
    toast({
      title: "Thành công",
      description: "Đã cập nhật chu kỳ sinh trưởng",
    });
    setLocation("/growth-cycle");
  };

  const onAddStage = () => {
    const nextId = (formData.stages.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: nextId,
          name: `Giai đoạn ${nextId}`,
          duration: 0,
          usePdf: false,
          content: initialEditorValue,
        },
      ],
    }));
  };

  const onRemoveStage = (id: string) => {
    if (formData.stages.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }));
  };

  const updateStage = (id: string, updates: Partial<GrowthStage>) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Bước 1",
      description: "Thông tin chung",
      content: (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
              <RadioGroup
                value={formData.scope}
                onValueChange={(v: "crop" | "variety") =>
                  setFormData({ ...formData, scope: v, variety: "" })
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div
                  className={`relative flex flex-row items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.scope === "crop"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, scope: "crop", variety: "" })
                  }
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                      formData.scope === "crop"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <TreeDeciduous className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crop" id="scope-crop" />
                      <Label
                        htmlFor="scope-crop"
                        className="font-bold cursor-pointer text-base"
                      >
                        Theo loại cây trồng
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Áp dụng cho tất cả các giống thuộc loại cây trồng này.
                    </p>
                  </div>
                </div>

                <div
                  className={`relative flex flex-row items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.scope === "variety"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setFormData({ ...formData, scope: "variety" })}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                      formData.scope === "variety"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Flower2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="variety" id="scope-variety" />
                      <Label
                        htmlFor="scope-variety"
                        className="font-bold cursor-pointer text-base"
                      >
                        Theo giống cụ thể
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Chỉ áp dụng cho chính xác giống cây trồng được chọn.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Loại cây trồng</Label>
                <Select
                  value={formData.cropId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, cropId: v, variety: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại cây" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-green-600" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.scope === "variety" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-sm font-semibold">
                    Giống cây trồng
                  </Label>
                  <Select
                    value={formData.variety}
                    onValueChange={(v) =>
                      setFormData({ ...formData, variety: v })
                    }
                    disabled={!formData.cropId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giống cây" />
                    </SelectTrigger>
                    <SelectContent>
                      {varietyOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <Flower2 className="w-4 h-4 text-rose-500" />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Tổng thời gian chu kỳ (ngày)
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.totalDays || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalDays: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.cropId !== "" &&
        formData.totalDays > 0 &&
        (formData.scope === "crop" || formData.variety !== ""),
    },
    {
      id: "stages",
      title: "Bước 2",
      description: "Danh sách giai đoạn",
      content: (
        <div className="max-w-5xl mx-auto space-y-8 py-4">
          <div className="space-y-6">
            {formData.stages.map((stage, index) => (
              <Card
                key={stage.id}
                className="relative overflow-hidden border-2 focus-within:border-primary/50 transition-all"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-lg">
                        Giai đoạn {index + 1}
                      </h3>
                    </div>
                    {formData.stages.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveStage(stage.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Tên giai đoạn
                      </Label>
                      <Input
                        value={stage.name}
                        onChange={(e) =>
                          updateStage(stage.id, { name: e.target.value })
                        }
                        placeholder="VD: Giai đoạn 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Thời gian (ngày)
                      </Label>
                      <Input
                        type="number"
                        value={stage.duration || ""}
                        onChange={(e) =>
                          updateStage(stage.id, {
                            duration: Number(e.target.value),
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">
                      Tài liệu kỹ thuật
                    </Label>
                    <RadioGroup
                      value={stage.usePdf ? "pdf" : "editor"}
                      onValueChange={(v) =>
                        updateStage(stage.id, { usePdf: v === "pdf" })
                      }
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="pdf" id={`pdf-${stage.id}`} />
                        <Label
                          htmlFor={`pdf-${stage.id}`}
                          className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Tải lên PDF
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="editor"
                          id={`editor-${stage.id}`}
                        />
                        <Label
                          htmlFor={`editor-${stage.id}`}
                          className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Soạn thảo
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {!stage.usePdf ? (
                    <div className="border rounded-lg overflow-hidden bg-muted/5">
                      <Editor
                        maxLength={10000}
                        contentEditableClassname="h-[200px] p-4 focus:outline-none bg-white"
                        editorSerializedState={stage.content}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Kéo thả hoặc nhấn để tải lên tệp PDF
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dung lượng tối đa 10MB
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={onAddStage}
              className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
            >
              <Plus className="h-4 w-4" />
              Thêm giai đoạn
            </Button>
          </div>
        </div>
      ),
      isValid: formData.stages.every(
        (s) => s.name.trim() !== "" && s.duration > 0,
      ),
    },
    {
      id: "confirm",
      title: "Bước 3",
      description: "Xác nhận",
      content: (
        <div className="max-w-4xl mx-auto space-y-6 py-4">
          <div className="flex items-center gap-2 text-primary">
            <Layout className="w-5 h-5" />
            <h3 className="font-bold text-lg">Xác nhận chu kỳ sinh trưởng</h3>
          </div>

          <Card className="border-none shadow-none bg-muted/30">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Phạm vi:</span>
                <Badge
                  variant={formData.scope === "crop" ? "default" : "secondary"}
                >
                  {formData.scope === "crop" ? "Theo loại cây" : "Theo giống"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">
                  Loại cây trồng:
                </span>
                <span className="font-bold">
                  {cropOptions.find((c) => c.value === formData.cropId)
                    ?.label || formData.cropId}
                </span>
              </div>
              {formData.scope === "variety" && (
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-sm text-muted-foreground">
                    Giống cây trồng:
                  </span>
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="font-bold">
                      {varietyOptions.find((v) => v.value === formData.variety)
                        ?.label || formData.variety}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">
                  Tổng thời gian:
                </span>
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
                  {formData.totalDays} NGÀY
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">
                  Số giai đoạn:
                </span>
                <span className="font-bold">
                  {formData.stages.length} giai đoạn
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Chi tiết các giai đoạn
            </span>
            <div className="space-y-2">
              {formData.stages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border shadow-sm group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Giai đoạn {idx + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {stage.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {stage.duration} NGÀY
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <AdminLayout
      title="Cập nhật chu kỳ sinh trưởng"
      description={`Chỉnh sửa thông tin cho ${formData.variety}`}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/growth-cycle")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/growth-cycle")}
            completeLabel="Lưu thay đổi"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
