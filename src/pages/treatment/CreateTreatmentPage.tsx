import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  StepperForm,
  cn,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Plus,
  Trash,
  Upload,
  X,
  Boxes,
  Info,
  Clock,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { initialEditorValue } from "../docs/mocks";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface TreatmentStep {
  id: string;
  day: string;
  title: string;
  type: string;
  description: string;
}

interface TreatmentMaterial {
  id: string;
  name: string;
  dosage: string;
}

interface CreateTreatmentForm {
  id: string;
  name: string;
  crop: string;
  growthStage: string;
  diseaseType: string;
  description: string;
  tags: string[];
  illustration: File | null;
  steps: TreatmentStep[];
  materials: TreatmentMaterial[];
  phi: string;
  safetyNotes: string;
  estimatedCost: string;
}

const cropOptions = [
  { label: "Lúa", value: "LÚA" },
  { label: "Bắp (Ngô)", value: "BẮP (NGÔ)" },
  { label: "Sầu riêng", value: "SẦU RIÊNG" },
];

const diseaseTypeOptions = [
  { label: "Nấm", value: "nấm" },
  { label: "Sâu hại", value: "sâu hại" },
  { label: "Côn trùng", value: "côn trùng" },
];

const tagOptions = [
  { label: "Mùa mưa", value: "Mùa mưa" },
  { label: "Kháng thuốc", value: "Kháng thuốc" },
  { label: "Hữu cơ", value: "Hữu cơ" },
  { label: "Giai đoạn đầu", value: "Giai đoạn đầu" },
];

export default function CreateTreatmentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateTreatmentForm>({
    id: "PD-AUTO-001",
    name: "",
    crop: "",
    growthStage: "",
    diseaseType: "",
    description: "",
    tags: [],
    illustration: null,
    steps: [{ id: "1", day: "", title: "", type: "", description: "" }],
    materials: [{ id: "1", name: "", dosage: "" }],
    phi: "7 ngày",
    safetyNotes: "",
    estimatedCost: "",
  });

  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng chọn file ảnh.",
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Ảnh quá lớn", description: "Tối đa 5MB." });
      return;
    }
    setFormData((prev) => ({ ...prev, illustration: file }));
  };

  const onDropIllustration = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onPickIllustration(file);
  };

  useEffect(() => {
    if (!formData.illustration) {
      setIllustrationPreview("");
      return;
    }
    const url = URL.createObjectURL(formData.illustration);
    setIllustrationPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.illustration]);

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo phác đồ "${formData.name}"`,
    });
    setLocation("/treatment");
  };

  const onAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: (prev.steps.length + 1).toString(),
          day: "",
          title: "",
          type: "",
          description: "",
        },
      ],
    }));
  };

  const onRemoveStep = (id: string) => {
    if (formData.steps.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
    }));
  };

  const onAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: (prev.materials.length + 1).toString(),
          name: "",
          dosage: "",
        },
      ],
    }));
  };

  const onRemoveMaterial = (id: string) => {
    if (formData.materials.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin",
      description: "Cây trồng & Bệnh",
      content: (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Mã phác đồ <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Tên phác đồ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: Quy trình quản lý Đạo ôn lá"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Đối tượng cây trồng
                </Label>
                <Select
                  value={formData.crop}
                  onValueChange={(v) => setFormData({ ...formData, crop: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cây" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Giai đoạn sinh trưởng
                </Label>
                <Select
                  value={formData.growthStage}
                  onValueChange={(v) =>
                    setFormData({ ...formData, growthStage: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giai đoạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="con">Cây con</SelectItem>
                    <SelectItem value="truong-thanh">Trưởng thành</SelectItem>
                    <SelectItem value="ra-hoa">Ra hoa</SelectItem>
                    <SelectItem value="ket-trai">Kết quả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Đối tượng gây hại (Bệnh/Sâu)
              </Label>
              <Select
                value={formData.diseaseType}
                onValueChange={(v) =>
                  setFormData({ ...formData, diseaseType: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại bệnh" />
                </SelectTrigger>
                <SelectContent>
                  {diseaseTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-4 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-sm font-bold">
                    Mô tả / Triệu chứng
                  </Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Dấu hiệu nhận biết & tình trạng
                  </p>
                </div>
              </div>
              <Card className="overflow-hidden shadow-sm border-2 focus-within:border-primary/50 transition-all">
                <Editor
                  maxLength={5000}
                  contentEditableClassname="h-[180px] p-4 focus:outline-none"
                  editorSerializedState={initialEditorValue}
                  // In a real app, we'd handle serialized state change
                />
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Hình ảnh minh họa</Label>
              <div
                onDrop={onDropIllustration}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all h-[300px] cursor-pointer group overflow-hidden",
                  illustrationPreview
                    ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                    : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => onPickIllustration(e.target.files?.[0])}
                />
                {!illustrationPreview ? (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary transition-transform group-hover:scale-110">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Kéo & thả hoặc nhấn để tải lên
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        JPG, PNG (Tối đa 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={illustrationPreview}
                      className="w-full h-full object-cover rounded-xl shadow-sm"
                      alt="Preview"
                    />
                    <div className="absolute top-6 right-6 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-md"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full shadow-md"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setFormData({ ...formData, illustration: null });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Gắn thẻ (Tags)</Label>
              <MultiSelect
                options={tagOptions}
                value={formData.tags}
                onChange={(v) => setFormData({ ...formData, tags: v })}
                placeholder="Chọn thẻ..."
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.name.trim() !== "" && formData.id.trim() !== "",
    },
    {
      id: "process",
      title: "Lộ trình",
      description: "Các bước xử lý",
      content: (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Quy trình thực hiện</h3>
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={onAddStep}
              >
                <Plus className="w-4 h-4" />
                Thêm bước
              </Button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, idx) => (
                <Card
                  key={step.id}
                  className="relative border-2 focus-within:border-primary/50 transition-all"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <h4 className="font-bold">Bước {idx + 1}</h4>
                      </div>
                      {formData.steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-destructive"
                          onClick={() => onRemoveStep(step.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Tên hành động (VD: Phun lần 1)"
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[idx].title = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                      />
                      <Select
                        value={step.type}
                        onValueChange={(v) => {
                          const newSteps = [...formData.steps];
                          newSteps[idx].type = v;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phun">Phun thuốc</SelectItem>
                          <SelectItem value="bon">Bón phân</SelectItem>
                          <SelectItem value="tuoi">Tưới nước</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Thời điểm (VD: Ngày 1)"
                        value={step.day}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[idx].day = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                      />
                      <Input
                        placeholder="Mô tả kỹ thuật..."
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[idx].description = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <Card className="bg-sky-50/50 border-sky-100">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-bold text-sky-900">Hướng dẫn xây dựng</h4>
                <div className="space-y-4 text-sm text-sky-800/80 leading-relaxed">
                  <div className="flex gap-3">
                    <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-bold text-sky-900">
                        Phác đồ chuẩn
                      </span>{" "}
                      nên bắt đầu bằng các biện pháp canh tác (rút nước, tỉa
                      cành) trước khi dùng thuốc.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <p>
                      Ghi rõ{" "}
                      <span className="font-bold text-sky-900">thời điểm</span>{" "}
                      (Ngày 1, Ngày 3...) để hệ thống tự động nhắc nhở nông dân.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-sky-200/50">
                    <p className="text-xs italic">
                      Ví dụ: <br /> Bước 1: Cắt nước (Ngày 1) <br /> Bước 2:
                      Phun thuốc lần 1 (Ngày 1) <br /> Bước 3: Kiểm tra vết bệnh
                      (Ngày 5)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      isValid: formData.steps.every(
        (s) => s.title.trim() !== "" && s.day.trim() !== "",
      ),
    },
    {
      id: "materials",
      title: "Vật tư",
      description: "Thuốc & An toàn",
      content: (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Danh mục thuốc / Vật tư</h3>
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={onAddMaterial}
              >
                <Plus className="w-4 h-4" />
                Thêm vật tư
              </Button>
            </div>

            <div className="space-y-4">
              {formData.materials.map((m, idx) => (
                <Card key={m.id} className="relative border-none bg-slate-50">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Boxes className="w-3 h-3" />
                        Vật tư #{idx + 1}
                      </div>
                      {formData.materials.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400"
                          onClick={() => onRemoveMaterial(m.id)}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        value={m.name}
                        onValueChange={(v) => {
                          const newMaterials = [...formData.materials];
                          newMaterials[idx].name = v;
                          setFormData({ ...formData, materials: newMaterials });
                        }}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Chọn thuốc/vật tư" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tricyclazole">
                            Tricyclazole 75WP
                          </SelectItem>
                          <SelectItem value="isoprothiolane">
                            Isoprothiolane 40EC
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Liều lượng (VD: 20ml/25L)"
                        className="bg-white"
                        value={m.dosage}
                        onChange={(e) => {
                          const newMaterials = [...formData.materials];
                          newMaterials[idx].dosage = e.target.value;
                          setFormData({ ...formData, materials: newMaterials });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                <h4 className="font-bold">Cấu hình an toàn</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Thời gian cách ly (PHI)
                    </Label>
                    <Select
                      value={formData.phi}
                      onValueChange={(v) =>
                        setFormData({ ...formData, phi: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 ngày">3 ngày</SelectItem>
                        <SelectItem value="7 ngày">7 ngày</SelectItem>
                        <SelectItem value="14 ngày">14 ngày</SelectItem>
                        <SelectItem value="21 ngày">21 ngày</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-4 py-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-bold">
                          Lưu ý an toàn / Cảnh báo
                        </Label>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                          Hướng dẫn bảo hộ & PHI
                        </p>
                      </div>
                    </div>
                    <Card className="overflow-hidden shadow-sm border-2 focus-within:border-amber-500/50 transition-all">
                      <Editor
                        maxLength={5000}
                        contentEditableClassname="h-[120px] p-4 focus:outline-none"
                        editorSerializedState={initialEditorValue}
                      />
                    </Card>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Chi phí ước tính / Ha
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="0"
                        className="pr-12 font-bold"
                        value={formData.estimatedCost}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedCost: e.target.value,
                          })
                        }
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      isValid:
        formData.materials.every((m) => m.name !== "" && m.dosage !== "") &&
        formData.estimatedCost !== "",
    },
  ];

  return (
    <AdminLayout
      title="Tạo phác đồ điều trị mới"
      description="Thiết lập các tham số kỹ thuật cho phác đồ mới"
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500"
          onClick={() => setLocation("/treatment")}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardContent className="p-10">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/treatment")}
            completeLabel="Xác nhận"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
