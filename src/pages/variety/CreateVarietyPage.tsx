import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Editor,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  StepperForm,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import {
  Archive,
  Barcode,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  CloudUpload,
  FileText,
  FlaskConical,
  Leaf,
  MapPin,
  Scale,
  Sprout,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import type { CreateVarietyForm } from "./types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const CROP_OPTIONS = [
  {
    id: "Sầu riêng",
    name: "Sầu riêng",
    image:
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/sauriengri6/sauriengri62.jpg.webp",
    group: "Cây ăn trái",
  },
  {
    id: "Xoài",
    name: "Xoài",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200",
    group: "Cây ăn trái",
  },
  {
    id: "Cà phê",
    name: "Cà phê",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=200",
    group: "Cây công nghiệp",
  },
  {
    id: "Thanh long",
    name: "Thanh long",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj3D221UbqA5WhiVpyqe8pZWwNpCfrTDSS5kJDrKERG4k3qIAf95vosUl8R_rWKD2bMyWRmTz7psbp4n8J4mFcFefz4v7dVhFRh7hhm9SagIA6PYUf&s=10&ec=121507562",
    group: "Cây ăn trái",
  },
  {
    id: "Lúa",
    name: "Lúa",
    image: "https://giongcamau.vn/uploads/shops/2017_03/om5451-copy.jpg",
    group: "Cây lương thực",
  },
];

export default function CreateVarietyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: "",
    varietyName: "",
    scientificName: "",
    crop: "",
    origin: "",
    growthDuration: "",
    averageYield: "",
    description: "",
    illustration: null,
    contentType: "pdf",
    pdfFile: null,
    editorContent: "",
  });

  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
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

  const updateField = (key: keyof CreateVarietyForm, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo giống cây "${formData.varietyName}"`,
    });
    setLocation("/variety");
  };

  const selectedCrop = CROP_OPTIONS.find((c) => c.name === formData.crop);

  const steps: Step[] = [
    {
      id: "classification",
      title: "Phân loại & Định danh",
      description: "Chọn cây trồng và thiết lập thông tin định danh cho giống",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-r from-green-50 via-white to-green-50 p-6 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Leaf className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">
                  Phân loại giống
                </h3>
                <p className="text-sm text-green-700/80">
                  Chọn loài cây trồng để phân loại chính xác giống mới
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              loài cây trồng <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CROP_OPTIONS.map((crop) => (
                <div
                  key={crop.id}
                  onClick={() => updateField("crop", crop.name)}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-md",
                    formData.crop === crop.name
                      ? "border-green-600 ring-2 ring-green-600/20 bg-green-50/10"
                      : "border-transparent bg-slate-50 hover:bg-white hover:border-green-200",
                  )}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {formData.crop === crop.name && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 p-3 text-white">
                      <p className="text-xs font-medium opacity-90 mb-0.5">
                        {crop.group}
                      </p>
                      <h4 className="font-bold text-sm">{crop.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Mã giống <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  value={formData.varietyCode}
                  onChange={(e) => updateField("varietyCode", e.target.value)}
                  placeholder="VD: VAR-SR6"
                  className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Tên giống <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  value={formData.varietyName}
                  onChange={(e) => updateField("varietyName", e.target.value)}
                  placeholder="VD: Sầu riêng Ri6"
                  className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Tên khoa học
              </Label>
              <div className="relative group">
                <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  value={formData.scientificName}
                  onChange={(e) =>
                    updateField("scientificName", e.target.value)
                  }
                  placeholder="VD: Durio zibethinus"
                  className="pl-10 italic font-serif border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Nguồn gốc/Xuất xứ
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  value={formData.origin}
                  onChange={(e) => updateField("origin", e.target.value)}
                  placeholder="VD: Viện Cây ăn quả Miền Nam"
                  className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                />
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
      id: "characteristics",
      title: "Thông tin nông học",
      description: "Mô tả đặc điểm sinh trưởng và hình ảnh nhận diện",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-6 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">
                  Đặc điểm nông học
                </h3>
                <p className="text-sm text-amber-700/80">
                  Cung cấp các thông tin chi tiết về đặc tính và hình ảnh giống
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            <div className="w-full space-y-4">
              <Label className="text-sm font-semibold text-slate-700">
                Hình ảnh nhận diện
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed aspect-square transition-all duration-300 cursor-pointer overflow-hidden bg-white hover:bg-amber-50/50 h-72 w-full",
                  illustrationPreview
                    ? "border-amber-500/20"
                    : "border-slate-200 hover:border-amber-500/50",
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
                      alt="Preview"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateField("illustration", null);
                          setIllustrationPreview("");
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" /> Xóa ảnh
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-transform group-hover:scale-110 shadow-sm border border-amber-200">
                      <CloudUpload className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-sm text-slate-700">
                        Tải ảnh minh họa
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                        Tối đa 5MB • JPG/PNG
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Thời gian sinh trưởng
                  </Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                    <Input
                      value={formData.growthDuration}
                      onChange={(e) =>
                        updateField("growthDuration", e.target.value)
                      }
                      placeholder="VD: 3 - 4"
                      className="pl-10 pr-16 "
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      năm
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Thời gian từ khi trồng đến khi thu hoạch lần đầu
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Năng suất bình quân
                  </Label>
                  <div className="relative group">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                    <Input
                      value={formData.averageYield}
                      onChange={(e) =>
                        updateField("averageYield", e.target.value)
                      }
                      placeholder="VD: 15 - 20"
                      className="pl-10 pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      tấn/ha
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Năng suất trung bình trong điều kiện chuẩn
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Mô tả đặc tính
                </Label>
                <div className="relative">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Mô tả chi tiết về hình thái lá, hoa, quả, khả năng chống chịu sâu bệnh và điều kiện thích nghi..."
                    rows={8}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Tải lên quy trình canh tác và tiêu chuẩn kỹ thuật",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-6 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900">
                  Tài liệu kỹ thuật
                </h3>
                <p className="text-sm text-purple-700/80">
                  Lưu trữ các hướng dẫn kỹ thuật quan trọng cho giống cây này
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Chọn hình thức tài liệu
              </Label>
              <RadioGroup
                defaultValue="pdf"
                value={formData.contentType}
                onValueChange={(val: "pdf" | "editor") =>
                  updateField("contentType", val)
                }
                className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl w-full max-w-md"
              >
                <div className="relative">
                  <RadioGroupItem
                    value="pdf"
                    id="pdf"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="pdf"
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 px-6 rounded-xl cursor-pointer font-bold text-sm transition-all duration-300",
                      formData.contentType === "pdf"
                        ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                    )}
                  >
                    <Upload className="w-4 h-4" />
                    Tải file PDF
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem
                    value="editor"
                    id="editor"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="editor"
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 px-6 rounded-xl cursor-pointer font-bold text-sm transition-all duration-300",
                      formData.contentType === "editor"
                        ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Soạn thảo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="min-h-[400px]">
              {formData.contentType === "pdf" ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-8">
                    <div
                      onClick={() => pdfInputRef.current?.click()}
                      className={cn(
                        "group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed h-[400px] transition-all cursor-pointer bg-white relative overflow-hidden",
                        formData.pdfFile
                          ? "bg-purple-50/30 border-purple-500/30"
                          : "hover:bg-purple-50/30 hover:border-purple-500/50 border-slate-200",
                      )}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        ref={pdfInputRef}
                        className="hidden"
                        onChange={(e) =>
                          updateField("pdfFile", e.target.files?.[0] || null)
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-50/30 pointer-events-none" />

                      {formData.pdfFile ? (
                        <div className="flex flex-col items-center text-center p-8 z-10 w-full max-w-sm mx-auto animate-in zoom-in duration-300">
                          <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-purple-100 flex items-center justify-center text-red-500 mb-6 ring-4 ring-white">
                            <FileText className="w-10 h-10" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 line-clamp-2 break-all">
                            {formData.pdfFile.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full">
                            {(formData.pdfFile.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-8 rounded-full px-6 shadow-red-200 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateField("pdfFile", null);
                            }}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Xóa file
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-6 text-center z-10 p-8">
                          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all duration-500">
                            <Upload className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xl font-bold text-slate-700 group-hover:text-purple-700 transition-colors">
                              Tải lên tài liệu PDF
                            </p>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                              Kéo thả file vào đây hoặc click để chọn từ máy
                              tính của bạn
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-6">
                    <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 space-y-4">
                      <h4 className="font-bold text-purple-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Lưu ý tài liệu
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Định dạng PDF chuẩn",
                          "Dung lượng tối đa 10MB",
                          "Không chứa mã độc",
                          "Nội dung rõ ràng, dễ đọc",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-sm text-purple-800/80"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                      <p className="text-xs text-slate-500 leading-relaxed text-justify">
                        * Tài liệu kỹ thuật bao gồm: Quy trình canh tác, Hướng
                        dẫn chăm sóc, Tiêu chuẩn thu hoạch và các chứng nhận
                        chất lượng liên quan.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-[20px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <Card className="relative overflow-hidden border-2 border-slate-100 shadow-sm focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all rounded-2xl bg-white">
                      <Editor
                        maxLength={20000}
                        contentEditableClassname={
                          "h-[500px] p-8 focus:outline-none bg-white font-serif text-base leading-loose text-slate-700"
                        }
                        editorSerializedState={formData.editorContent as any}
                        onSerializedChange={(content) =>
                          updateField("editorContent", content)
                        }
                      />
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi tạo",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-center space-y-4 py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg shadow-green-100/50 ring-4 ring-white animate-in zoom-in spin-in-12 duration-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Xác nhận thông tin
              </h3>
              <p className="text-slate-500 max-w-lg mx-auto text-sm mt-2 leading-relaxed">
                Vui lòng kiểm tra kỹ tất cả các thông tin đã nhập bên dưới đây.
                <br />
                Đảm bảo mọi thông tin là chính xác trước khi khởi tạo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 overflow-hidden border-none shadow-md ring-1 ring-slate-200">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                  <Archive className="w-4 h-4 text-green-600" />
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src={selectedCrop?.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shadow-sm bg-white ring-2 ring-white"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">
                      {formData.crop}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium">
                      Nhóm: {selectedCrop?.group}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Mã giống
                    </p>
                    <p className="font-bold text-slate-900 text-lg">
                      {formData.varietyCode || "---"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tên giống
                    </p>
                    <p className="font-bold text-green-700 text-lg">
                      {formData.varietyName || "---"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tên khoa học
                    </p>
                    <p className="font-medium text-slate-700 italic font-serif text-base">
                      {formData.scientificName || "---"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nguồn gốc
                    </p>
                    <p className="font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {formData.origin || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Mô tả đặc tính
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {formData.description || "Chưa có mô tả chi tiết..."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Đặc tính sinh trưởng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {illustrationPreview ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative shadow-md ring-1 ring-black/5 group">
                      <img
                        src={illustrationPreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                        <p className="text-white text-xs font-bold tracking-wider uppercase opacity-90">
                          Ảnh nhận diện
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                      <CloudUpload className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Chưa có ảnh</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="text-xs font-bold text-amber-800/70 uppercase">
                        Sinh trưởng
                      </span>
                      <span className="font-bold text-amber-900">
                        {formData.growthDuration} năm
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="text-xs font-bold text-amber-800/70 uppercase">
                        Năng suất
                      </span>
                      <span className="font-bold text-amber-900">
                        {formData.averageYield} tấn/ha
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Tài liệu đính kèm
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {formData.contentType === "pdf" && formData.pdfFile ? (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-red-500 shadow-sm shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {formData.pdfFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : formData.contentType === "editor" &&
                    formData.editorContent ? (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Nội dung soạn thảo
                        </p>
                        <p className="text-xs text-slate-500">
                          Đã lưu nội dung
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic text-center py-2">
                      Chưa có tài liệu nào
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới giống cây"
      description="Thêm thông tin giống cây trồng mới vào hệ thống quản lý"
    >
      <Card className="overflow-hidden border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/variety")}
            completeLabel="Xác nhận & Khởi tạo"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
