import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import { CloudUpload, FileText, Trash, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { initialData } from "./mocks";
import type { CreateVarietyForm } from "./types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function VarietyEditPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const existingVariety = initialData.find((v) => v.id === id);

  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: existingVariety?.varietyCode || "",
    varietyName: existingVariety?.varietyName || "",
    scientificName: existingVariety?.scientificName || "",
    crop: existingVariety?.crop || "",
    origin: existingVariety?.origin || "",
    growthDuration: existingVariety?.growthDuration || "",
    averageYield: existingVariety?.averageYield || "",
    description: existingVariety?.description || "",
    illustration: null,
    contentType: "pdf",
    pdfFile: null,
    editorContent: "",
  });

  const [illustrationPreview, setIllustrationPreview] = useState<string>(
    typeof existingVariety?.illustration === "string"
      ? existingVariety.illustration
      : "",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Lỗi", description: "Vui lòng chọn file ảnh." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Lỗi", description: "Ảnh quá lớn (tối đa 5MB)." });
      return;
    }
    setFormData((prev) => ({ ...prev, illustration: file }));
    const url = URL.createObjectURL(file);
    setIllustrationPreview(url);
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã cập nhật giống cây "${formData.varietyName}"`,
    });
    setLocation("/variety");
  };

  if (!existingVariety) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin giống cây này.
          </p>
          <Button onClick={() => setLocation("/variety")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin chung & Hình ảnh",
      description: "Cập nhật các thông tin cơ bản và hình ảnh giống cây",
      content: (
        <div className="max-w-5xl mx-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="varietyCode"
                    className="text-sm font-semibold"
                  >
                    Mã giống cây *
                  </Label>
                  <Input
                    id="varietyCode"
                    value={formData.varietyCode}
                    onChange={(e) =>
                      setFormData({ ...formData, varietyCode: e.target.value })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="varietyName"
                    className="text-sm font-semibold"
                  >
                    Tên giống *
                  </Label>
                  <Input
                    id="varietyName"
                    value={formData.varietyName}
                    onChange={(e) =>
                      setFormData({ ...formData, varietyName: e.target.value })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="scientificName"
                    className="text-sm font-semibold"
                  >
                    Tên khoa học
                  </Label>
                  <Input
                    id="scientificName"
                    value={formData.scientificName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scientificName: e.target.value,
                      })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-sm font-semibold">
                    Nguồn gốc
                  </Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop" className="text-sm font-semibold">
                  Cây trồng *
                </Label>
                <Select
                  value={formData.crop}
                  onValueChange={(val) =>
                    setFormData({ ...formData, crop: val })
                  }
                >
                  <SelectTrigger id="crop" className="focus:ring-green-500">
                    <SelectValue placeholder="Chọn loại cây" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                    <SelectItem value="Xoài">Xoài</SelectItem>
                    <SelectItem value="Cà phê">Cà phê</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="growthDuration"
                    className="text-sm font-semibold"
                  >
                    Thời gian sinh trưởng
                  </Label>
                  <Input
                    id="growthDuration"
                    value={formData.growthDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        growthDuration: e.target.value,
                      })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="averageYield"
                    className="text-sm font-semibold"
                  >
                    Năng suất bình quân
                  </Label>
                  <Input
                    id="averageYield"
                    value={formData.averageYield}
                    onChange={(e) =>
                      setFormData({ ...formData, averageYield: e.target.value })
                    }
                    className="focus-visible:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="resize-none focus-visible:ring-green-500"
                />
              </div>
            </div>
            <div className="md:col-span-5 space-y-4">
              <Label className="text-sm font-semibold">Ảnh giống cây</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed aspect-square transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
                  illustrationPreview
                    ? "border-green-500/20 bg-green-50/10 hover:border-green-500/40"
                    : "border-muted-foreground/20 hover:border-green-500/50 hover:bg-green-50/30",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => onPickIllustration(e.target.files?.[0])}
                />
                {illustrationPreview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={illustrationPreview}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt=""
                    />
                    <div className="absolute top-3 right-3 text-white">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 rounded-full shadow-lg border-2 border-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIllustrationPreview("");
                          setFormData((p) => ({ ...p, illustration: null }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 transition-transform group-hover:scale-110">
                      <CloudUpload className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-base">Cập nhật ảnh</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP (Tối đa 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.varietyCode.trim().length > 0 &&
        formData.varietyName.trim().length > 0 &&
        formData.crop.trim().length > 0,
    },
    {
      id: "content",
      title: "Nội dung kỹ thuật",
      description: "Cập nhật tài liệu kỹ thuật",
      content: (
        <div className="max-w-3xl mx-auto space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Hình thức tài liệu</Label>
            <RadioGroup
              value={formData.contentType}
              onValueChange={(val: "pdf" | "editor") =>
                setFormData({ ...formData, contentType: val })
              }
              className="flex gap-8"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group">
                <RadioGroupItem
                  value="pdf"
                  id="pdf"
                  className="text-green-600 border-green-500"
                />
                <Label
                  htmlFor="pdf"
                  className="cursor-pointer font-medium text-sm"
                >
                  Tải file PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group">
                <RadioGroupItem
                  value="editor"
                  id="editor"
                  className="text-green-600 border-green-500"
                />
                <Label
                  htmlFor="editor"
                  className="cursor-pointer font-medium text-sm"
                >
                  Soạn thảo trực tiếp
                </Label>
              </div>
            </RadioGroup>
          </div>
          {formData.contentType === "pdf" ? (
            <div
              onClick={() => pdfInputRef.current?.click()}
              className={cn(
                "group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer backdrop-blur-sm",
                formData.pdfFile
                  ? "bg-green-50/20 border-green-500/30"
                  : "hover:bg-green-50/50 hover:border-green-500/50 border-muted-foreground/20",
              )}
            >
              <input
                type="file"
                accept=".pdf"
                ref={pdfInputRef}
                className="hidden"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pdfFile: e.target.files?.[0] || null,
                  })
                }
              />
              {formData.pdfFile ? (
                <div className="flex items-center gap-5 w-full px-4">
                  <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {formData.pdfFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, pdfFile: null });
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold">
                    Nhấn để tải lên tài liệu mới
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <Label className="text-sm font-semibold">Nội dung chi tiết</Label>
              <Card className="overflow-hidden border-2 shadow-sm focus-within:border-green-500/50 transition-all rounded-2xl">
                <Editor
                  maxLength={10000}
                  contentEditableClassname={
                    "h-[350px] p-5 focus:outline-none bg-white"
                  }
                  editorSerializedState={formData.editorContent as any}
                  onSerializedChange={(content) =>
                    setFormData({ ...formData, editorContent: content as any })
                  }
                />
              </Card>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Chỉnh sửa giống cây"
      description={`Chỉnh sửa thông tin giống cây: ${existingVariety.varietyName}`}
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation(`/variety/${existingVariety.id}`)}
            completeLabel="Cập nhật giống cây"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
