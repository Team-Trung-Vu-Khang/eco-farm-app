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
  cn,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Briefcase,
  CheckCircle2,
  CloudUpload,
  FileText,
  Hash,
  Info,
  Phone,
  Search,
  Sprout,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { mockSuppliers } from "./mocks";
import type { CreateVarietyForm } from "./types";
import useSeedStore from "../../stores/useSeedStore";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UpdateSeedPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getSeedById, updateSeed } = useSeedStore();
  const seed = getSeedById(id || "");

  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: seed?.varietyCode || "SR-1112",
    varietyName: seed?.varietyName || "",
    crop: seed?.crop || "",
    supplier: seed?.supplier || "",
    origin: seed?.origin || "",
    germinationRate: seed?.germinationRate || 0,
    uniformity: seed?.uniformity || 0,
    yield: seed?.yield || "",
    description: seed?.description || "",
    illustration: null,
    contentType: "pdf",
    pdfFile: null,
    editorContent: seed?.editorContent || "",
    cropGroup: "",
    expiryDate: undefined,
  });

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    mockSuppliers.find((s) => s.name === seed?.supplier)?.id || "",
  );
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [illustrationPreview, setIllustrationPreview] = useState<string>(
    seed?.illustration && typeof seed.illustration === "string"
      ? seed.illustration
      : "",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSuppliers = mockSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      s.representative
        .toLowerCase()
        .includes(supplierSearchQuery.toLowerCase()),
  );

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
    if (!id) return;

    // Prepare update data
    const updateData: any = {
      supplier: formData.supplier,
      origin: formData.origin,
      germinationRate: formData.germinationRate,
      uniformity: formData.uniformity,
      yield: formData.yield,
      description: formData.description,
      editorContent: formData.editorContent,
    };

    // Add illustration if changed
    if (formData.illustration) {
      updateData.illustration = formData.illustration;
    }

    // Add documents if PDF uploaded
    if (formData.contentType === "pdf" && formData.pdfFile) {
      updateData.documents = [
        {
          name: formData.pdfFile.name,
          url: URL.createObjectURL(formData.pdfFile),
        },
      ];
    }

    updateSeed(id, updateData);

    toast({
      title: "Thành công",
      description: `Đã cập nhật hạt giống "${formData.varietyName}"`,
    });
    setLocation(`/seed/${id}`, { replace: true });
  };

  const steps: Step[] = [
    {
      id: "identity",
      title: "Thông tin định danh",
      description: "Thông tin cơ bản về giống cây trồng (Không thể thay đổi)",
      content: (
        <div className="space-y-8 py-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Hash className="w-4 h-4" />
                  </div>
                  <Label className="font-bold text-slate-700 text-base">
                    Mã trích xuất
                  </Label>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                    {formData.varietyCode}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Mã định danh duy nhất trên hệ thống
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <Label className="font-bold text-slate-700 text-base">
                    Thông tin giống
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tên giống
                    </Label>
                    <div className="text-lg font-bold text-slate-800">
                      {formData.varietyName}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Loại cây
                    </Label>
                    <div className="text-lg font-bold text-slate-800">
                      {formData.crop}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-700">
                Thông tin định danh được bảo vệ
              </p>
              <p className="text-xs text-blue-600/80">
                Để đảm bảo tính toàn vẹn dữ liệu, các thông tin cơ bản về giống
                cây trồng không thể chỉnh sửa trực tiếp. Vui lòng liên hệ quản
                trị viên nếu cần thay đổi.
              </p>
            </div>
          </div>
        </div>
      ),
      isValid: true,
    },
    {
      id: "details",
      title: "Chi tiết & Thông số",
      description: "Cập nhật nhà cung cấp và thông số kỹ thuật",
      content: (
        <div className="space-y-8 py-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Supplier & Origin */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <Label className="font-bold text-slate-700">
                      Nguồn gốc & Nhà cung cấp
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-600">
                      Nhà cung cấp
                    </Label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                      <Input
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={supplierSearchQuery}
                        onChange={(e) => setSupplierSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-green-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      {filteredSuppliers.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedSupplierId(s.id);
                            setFormData({ ...formData, supplier: s.name });
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            selectedSupplierId === s.id
                              ? "border-blue-500 bg-blue-50/50 shadow-sm"
                              : "border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm",
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm transition-colors",
                              selectedSupplierId === s.id
                                ? "bg-blue-500 text-white"
                                : "bg-white text-slate-500 border border-slate-200",
                            )}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p
                                className={cn(
                                  "text-sm font-bold truncate",
                                  selectedSupplierId === s.id
                                    ? "text-blue-700"
                                    : "text-slate-700",
                                )}
                              >
                                {s.name}
                              </p>
                              {selectedSupplierId === s.id && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                <User className="w-3 h-3 opacity-70" />
                                {s.representative}
                              </span>
                              <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                <Phone className="w-3 h-3 opacity-70" />
                                {s.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-medium text-slate-600">
                      Xuất xứ
                    </Label>
                    <Select
                      value={formData.origin}
                      onValueChange={(val) =>
                        setFormData({ ...formData, origin: val })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-200 bg-white focus:ring-green-500">
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vietnam">Việt Nam</SelectItem>
                        <SelectItem value="Thailand">Thái Lan</SelectItem>
                        <SelectItem value="USA">Mỹ</SelectItem>
                        <SelectItem value="China">Trung Quốc</SelectItem>
                        <SelectItem value="Japan">Nhật Bản</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Technical Specs & Image */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-5">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <Label className="font-bold text-slate-700">
                      Thông số kỹ thuật
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600">
                      Năng suất (dự kiến)
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="VD: 25-30"
                        className="pr-16 border-slate-200 focus:ring-green-500"
                        value={formData.yield}
                        onChange={(e) =>
                          setFormData({ ...formData, yield: e.target.value })
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        tấn/ha
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">
                        Độ sạch (%)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="99"
                          className="pr-8 border-slate-200 focus:ring-green-500"
                          value={formData.uniformity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              uniformity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">
                        Nảy mầm (%)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="85"
                          className="pr-8 border-slate-200 focus:ring-green-500"
                          value={formData.germinationRate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              germinationRate: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Hình ảnh bao bì / Minh họa
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed h-48 transition-all cursor-pointer overflow-hidden bg-white hover:bg-slate-50 shadow-sm",
                    illustrationPreview
                      ? "border-green-500/30 ring-4 ring-green-500/5"
                      : "border-slate-200 hover:border-green-500/50",
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
                    <div className="w-full h-full relative group/img">
                      <img
                        src={illustrationPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="pointer-events-none"
                        >
                          Thay đổi ảnh
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center p-4">
                      <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CloudUpload className="h-6 w-6 text-slate-400 group-hover:text-green-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          Tải ảnh lên
                        </p>
                        <p className="text-xs text-slate-400">
                          PNG, JPG, WebP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: true,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cập nhật tài liệu hướng dẫn kỹ thuật",
      content: (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          <div className="space-y-4 flex flex-col items-center">
            <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-center">
              Hình thức đính kèm
            </Label>
            <RadioGroup
              defaultValue="pdf"
              value={formData.contentType}
              onValueChange={(val: "pdf" | "editor") =>
                setFormData({ ...formData, contentType: val })
              }
              className="flex gap-6"
            >
              <div
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer min-w-[200px]",
                  formData.contentType === "pdf"
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300",
                )}
                onClick={() => setFormData({ ...formData, contentType: "pdf" })}
              >
                <RadioGroupItem
                  value="pdf"
                  id="pdf-opt-step"
                  className="text-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-green-600"
                />
                <Label
                  htmlFor="pdf-opt-step"
                  className="cursor-pointer font-bold text-sm text-slate-700"
                >
                  Tải file PDF
                </Label>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer min-w-[200px]",
                  formData.contentType === "editor"
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300",
                )}
                onClick={() =>
                  setFormData({ ...formData, contentType: "editor" })
                }
              >
                <RadioGroupItem
                  value="editor"
                  id="editor-opt-step"
                  className="text-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-green-600"
                />
                <Label
                  htmlFor="editor-opt-step"
                  className="cursor-pointer font-bold text-sm text-slate-700"
                >
                  Soạn thảo trực tiếp
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-8">
            {formData.contentType === "pdf" ? (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={cn(
                  "group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all cursor-pointer relative overflow-hidden",
                  formData.pdfFile
                    ? "border-green-500/30 bg-green-50/10"
                    : "border-slate-200 bg-slate-50/30 hover:border-green-500/50 hover:bg-green-50/10",
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
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 rounded-2xl bg-white shadow-xl shadow-green-900/5 flex items-center justify-center text-red-500 ring-1 ring-slate-100">
                      <FileText className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-800 break-all max-w-md">
                        {formData.pdfFile.name}
                      </p>
                      <p className="text-sm font-medium text-slate-500">
                        File PDF sẵn sàng để tải lên
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, pdfFile: null });
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Gỡ bỏ file
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-5 text-center py-6">
                    <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                      <CloudUpload className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-700">
                        Chọn tài liệu hướng dẫn PDF
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        Kéo thả hoặc click để chọn file (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-3 px-1">
                  <Label className="text-sm font-bold text-slate-700">
                    Nội dung chi tiết tài liệu
                  </Label>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    Trình soạn thảo văn bản
                  </span>
                </div>
                <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-xl shadow-slate-100/50">
                  <Editor
                    maxLength={10000}
                    initialText={formData.editorContent}
                    contentEditableClassname="min-h-[400px] p-6 bg-white focus:outline-none prose prose-slate max-w-none"
                    onSerializedChange={(v) =>
                      setFormData({ ...formData, editorContent: v as any })
                    }
                  />
                </Card>
              </div>
            )}
          </div>
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <AdminLayout
      title="Cập nhật hạt giống"
      description="Chỉnh sửa thông tin hạt giống trong hệ thống"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Hoàn tất & Lưu"
            onCancel={() => setLocation(`/seed/${id}`)}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
