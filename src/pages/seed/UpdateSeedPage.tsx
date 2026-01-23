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
} from "@tankhang1/eco-shared-ui";
import {
  Briefcase,
  CloudUpload,
  FileText,
  Hash,
  Phone,
  Search,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { initialData, mockSuppliers } from "./mocks";
import type { CreateVarietyForm } from "./types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UpdateSeedPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const seed = initialData.find((s) => s.id === id);

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
    toast({
      title: "Thành công",
      description: `Đã cập nhật hạt giống "${formData.varietyName}"`,
    });
    setLocation(`/seed/${id}`, { replace: true });
  };

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin chung",
      description: "Nhập mã, tên giống, loại cây và chọn nhà cung cấp",
      content: (
        <div className="space-y-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Mã giống cây
                </Label>
                <Input
                  value={formData.varietyCode}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Tên giống <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="VD: Giống Ri6"
                  value={formData.varietyName}
                  onChange={(e) =>
                    setFormData({ ...formData, varietyName: e.target.value })
                  }
                  className="focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Cây trồng <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.crop}
                  onValueChange={(val) =>
                    setFormData({ ...formData, crop: val })
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:ring-green-500">
                    <SelectValue placeholder="Chọn loại cây" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                    <SelectItem value="Xoài">Xoài</SelectItem>
                    <SelectItem value="Lúa">Lúa</SelectItem>
                    <SelectItem value="Bắp">Bắp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700">
                Chọn nhà cung cấp
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm nhà cung cấp..."
                  className="pl-10 h-10 border-slate-200 focus:ring-green-500 text-sm"
                  value={supplierSearchQuery}
                  onChange={(e) => setSupplierSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-1 px-1 custom-scrollbar scroll-smooth">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSupplierId(s.id);
                        setFormData({ ...formData, supplier: s.name });
                      }}
                      className={cn(
                        "relative flex-none w-[280px] p-4 rounded-xl border-2 transition-all cursor-pointer group",
                        selectedSupplierId === s.id
                          ? "border-blue-500 bg-blue-50/30"
                          : "border-slate-100 bg-white hover:border-slate-200 shadow-sm",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-2">
                              {s.name}
                            </h4>
                            <span
                              className={cn(
                                "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0",
                                s.type === "NÔNG HỘ"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-blue-50 text-blue-600",
                              )}
                            >
                              {s.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <Hash className="w-2.5 h-2.5 opacity-60" />
                              <span className="truncate">{s.code}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <User className="w-2.5 h-2.5 opacity-60" />
                              <span className="truncate">
                                {s.representative}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <Phone className="w-2.5 h-2.5 opacity-60" />
                              <span>{s.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <Search className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-medium text-slate-400">
                      Không tìm thấy nhà cung cấp phù hợp
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.varietyName.trim() !== "" &&
        formData.crop !== "" &&
        selectedSupplierId !== "",
    },
    {
      id: "specs",
      title: "Thông số & Media",
      description: "Thiết lập các chỉ số kỹ thuật và hình ảnh minh họa",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Xuất xứ
              </Label>
              <Select
                value={formData.origin}
                onValueChange={(val) =>
                  setFormData({ ...formData, origin: val })
                }
              >
                <SelectTrigger className="border-slate-200 focus:ring-green-500">
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vietnam">Việt Nam</SelectItem>
                  <SelectItem value="Thailand">Thái Lan</SelectItem>
                  <SelectItem value="USA">Mỹ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Tỷ lệ nảy mầm (%)
                </Label>
                <Input
                  type="number"
                  value={formData.germinationRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      germinationRate: parseInt(e.target.value) || 0,
                    })
                  }
                  className="focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Độ đồng đều (%)
                </Label>
                <Input
                  type="number"
                  value={formData.uniformity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      uniformity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Năng suất
              </Label>
              <Input
                placeholder="25 tấn/ha"
                value={formData.yield}
                onChange={(e) =>
                  setFormData({ ...formData, yield: e.target.value })
                }
                className="focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Mô tả
              </Label>
              <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm">
                <Editor
                  maxLength={5000}
                  initialHtml={formData.description}
                  contentEditableClassname="h-[150px] p-4 bg-white focus:outline-none"
                  onSerializedChange={(v) =>
                    setFormData({ ...formData, description: v as any })
                  }
                />
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-slate-700">
              Hình ảnh hạt giống
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed aspect-video transition-all duration-300 cursor-pointer overflow-hidden bg-slate-50",
                illustrationPreview
                  ? "border-green-500/20"
                  : "border-slate-200 hover:border-green-500/50 hover:bg-green-50/10",
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
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <CloudUpload className="h-12 w-12 text-slate-300 group-hover:text-green-500 transition-colors" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-600">
                      Kéo thả ảnh tại đây
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      JPG, PNG, WebP (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={illustrationPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((p) => ({ ...p, illustration: null }));
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cung cấp tài liệu hướng dẫn trồng và chăm sóc",
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
              className="flex gap-10"
            >
              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <RadioGroupItem
                  value="pdf"
                  id="pdf-opt-step"
                  className="text-green-600"
                />
                <Label
                  htmlFor="pdf-opt-step"
                  className="cursor-pointer font-bold text-sm text-slate-600"
                >
                  Tải file PDF
                </Label>
              </div>
              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <RadioGroupItem
                  value="editor"
                  id="editor-opt-step"
                  className="text-green-600"
                />
                <Label
                  htmlFor="editor-opt-step"
                  className="cursor-pointer font-bold text-sm text-slate-600"
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
                "group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 transition-all cursor-pointer bg-slate-50/50 min-h-[300px]",
                formData.pdfFile
                  ? "border-green-500/30 bg-green-50/5"
                  : "border-slate-200 hover:border-green-500/50 hover:bg-green-50/10",
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
                <div className="flex items-center gap-6 w-full max-w-md bg-white p-5 rounded-2xl shadow-xl shadow-green-900/5 ring-1 ring-slate-100">
                  <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-800 truncate">
                      {formData.pdfFile.name}
                    </p>
                    <p className="text-sm text-slate-400 font-medium">
                      {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, pdfFile: null });
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-slate-50">
                    <CloudUpload className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-700">
                      Chọn tài liệu hướng dẫn PDF
                    </p>
                    <p className="text-sm font-medium text-slate-400">
                      Chấp nhận file PDF dung lượng tối đa 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Label className="text-sm font-bold text-slate-500 mb-3 block ml-1">
                Nội dung chi tiết tài liệu
              </Label>
              <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-2xl shadow-slate-100">
                <Editor
                  maxLength={10000}
                  initialText={formData.editorContent}
                  contentEditableClassname="h-[400px] p-6 bg-white focus:outline-none"
                  onSerializedChange={(v) =>
                    setFormData({ ...formData, editorContent: v as any })
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
