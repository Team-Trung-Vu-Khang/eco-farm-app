import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  Editor,
  Input,
  Label,
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
  Search,
  CloudUpload,
  FileText,
  Sprout,
  CheckCircle2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import type { CreateVarietyForm } from "./types";
import useSeedStore from "../../stores/useSeedStore";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

import { mockSuppliers } from "./mocks";

// Mock data for hierarchy
const cropGroups = [
  { id: "food", name: "Cây lương thực" },
  { id: "fruit", name: "Cây ăn quả" },
  { id: "industrial", name: "Cây công nghiệp" },
];

const crops: Record<string, { id: string; name: string; image: string }[]> = {
  food: [
    {
      id: "rice",
      name: "Lúa",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3jT_HEXMWHft0Z_YK9nDApKXFJsh1qXdcA&s",
    },
    {
      id: "corn",
      name: "Bắp",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjE-P9TcZSVsvzEDOqbCqIwpfSBakq8901Cg&s",
    },
  ],
  fruit: [
    {
      id: "durian",
      name: "Sầu riêng",
      image:
        "https://bizweb.dktcdn.net/thumb/grande/100/422/567/products/cay-giong-can-tho-sau-rieng-musanking-1-2.jpg?v=1638949736430",
    },
    {
      id: "mango",
      name: "Xoài",
      image:
        "https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2019/08/15/8-loi-ich-it-biet-cua-xoai1565855128.jpg",
    },
  ],
  industrial: [
    {
      id: "coffee",
      name: "Cà phê",
      image:
        "https://thoibaotaichinhvietnam.vn/stores/news_dataimages/2026/012026/25/06/in_article/ngay-251-gia-ca-phe-tang-manh-ho-tieu-neo-cao-o-nguong-150000-dongkg-20260125062559.jpg?rt=20260125062600",
    },
    {
      id: "pepper",
      name: "Hồ tiêu",
      image:
        "https://bcp.cdnchinhphu.vn/334894974524682240/2025/2/25/444132dd1a93f3cdaa82-17404595689801945801880.jpg",
    },
  ],
};

const varieties: Record<
  string,
  { id: string; name: string; code?: string; image?: string }[]
> = {
  durian: [
    {
      id: "VARI01",
      name: "Sầu riêng Ri6",
      code: "VARI01",
      image:
        "https://bizweb.dktcdn.net/thumb/grande/100/396/015/products/logovietfruit-7fc573e9-36f8-44a5-80ba-e2ce2bd998ca.jpg?v=1671522040127",
    },
    {
      id: "VARI02",
      name: "Sầu riêng Dona",
      code: "VARI02",
      image:
        "https://traicaytonyteo.com/uploads/source/sau-rieng-dona-thai-2.jpg",
    },
    {
      id: "VARI03",
      name: "Sầu riêng Musang King",
      code: "VARI03",
      image:
        "https://sauriengoi.vn/wp-content/uploads/2023/08/SAU-RIENG-MUSANG-KING-1-1.jpg",
    },
    {
      id: "VARI04",
      name: "Sầu riêng Black Thorn",
      code: "VARI04",
      image:
        "https://vinadurian.com/wp-content/uploads/2023/11/sau-rieng-black-thorn-05-i.jpg",
    },
  ],
  rice: [
    {
      id: "VARI06",
      name: "Lúa OM5451",
      code: "VARI06",
      image:
        "https://lh4.googleusercontent.com/proxy/MLacA6_LHyfmPvTfcrouV2QTLptGspn7YeqqJ9pAjtfQIl262TRrvqXI5nMWlZuSLoOKCs3pwfShUOALa0aEKTu8ATDBIrKX07oDdVXW6fdSHTlsi6vflJMhwO5QILIl3Dz5GLaveQ",
    },
  ],
  soybeans: [
    {
      id: "VARI07",
      name: "Đậu nành DT84",
      code: "VARI07",
      image:
        "https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e875525f3bbe20f9343607ad07a01c92f147aae408267e18cb342aaa0dd834e734827afe323f4eee8886d1806df7f097c/dautuong.jpg.webp",
    },
    {
      id: "VARI08",
      name: "Đậu nành DX11",
      code: "VARI08",
      image:
        "https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/f1/Image/2009/7/5/05072009145217.jpg",
    },
  ],
  // Add other mappings as needed or use default empty array
};

export default function CreateSeedPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addSeed } = useSeedStore();

  const [selectedCropGroup, setSelectedCropGroup] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedVariety, setSelectedVariety] = useState<string>("");

  const [formData, setFormData] = useState<CreateVarietyForm>({
    varietyCode: "",
    varietyName: "",
    cropGroup: "",
    crop: "",
    supplier: "",
    origin: "",
    germinationRate: 0,
    uniformity: 0,
    yield: "",
    description: "",
    illustration: null,
    expiryDate: undefined,
    contentType: "pdf",
    pdfFile: null,
    editorContent: "",
  });

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [illustrationPreview, setIllustrationPreview] = useState<string>("");
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
    addSeed(formData);
    toast({
      title: "Thành công",
      description: `Đã tạo hạt giống "${formData.varietyName}"`,
    });
    setLocation("/seed");
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn giống cây",
      description: "Lựa chọn loại cây và giống cây cần nhập kho",
      content: (
        <div className="space-y-8 py-6">
          {/* Group 1: Crop Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                1
              </span>
              <Label className="text-base font-semibold text-slate-800">
                Lựa chọn cây trồng
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">
                  Nhóm cây trồng <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCropGroup}
                  onValueChange={(val) => {
                    setSelectedCropGroup(val);
                    setSelectedCrop("");
                    setSelectedVariety("");
                    setFormData((prev) => ({
                      ...prev,
                      cropGroup: val,
                      crop: "",
                      varietyName: "",
                      varietyCode: "",
                    }));
                  }}
                >
                  <SelectTrigger className="h-11 border-slate-200 focus:ring-green-500 bg-white">
                    <SelectValue placeholder="-- Chọn nhóm cây --" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">
                  Cây trồng <span className="text-red-500">*</span>
                </Label>
                {!selectedCropGroup ? (
                  <div className="h-[120px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm font-medium">
                      Vui lòng chọn nhóm cây trước
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {crops[selectedCropGroup]?.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => {
                          setSelectedCrop(crop.id);
                          setSelectedVariety("");
                          setFormData((prev) => ({
                            ...prev,
                            crop: crop.name,
                            varietyName: "",
                            varietyCode: "",
                          }));
                        }}
                        className={cn(
                          "group relative flex flex-col gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md bg-white",
                          selectedCrop === crop.id
                            ? "border-green-500 ring-2 ring-green-500/20"
                            : "border-slate-100 hover:border-green-200",
                        )}
                      >
                        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 relative">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {selectedCrop === crop.id && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                              <div className="bg-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-100" />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-slate-800 text-center text-sm">
                          {crop.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-6"></div>

          {/* Group 2: Variety Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                2
              </span>
              <Label className="text-base font-semibold text-slate-800">
                Chọn giống cây
              </Label>
            </div>

            <div className="pl-8">
              {!selectedCrop ? (
                <div className="h-[160px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Sprout className="w-10 h-10 opacity-20" />
                  <p className="text-sm font-medium">
                    Vui lòng chọn loại cây ở bước trên
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {varieties[selectedCrop]?.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVariety(v.id);
                        setFormData((prev) => ({
                          ...prev,
                          varietyName: v.name,
                          varietyCode: v.code || `SEED-${v.id.toUpperCase()}`,
                          illustration: null,
                        }));
                        if (v.image) setIllustrationPreview(v.image);
                      }}
                      className={cn(
                        "flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white hover:shadow-md",
                        selectedVariety === v.id
                          ? "border-green-500 bg-green-50/10"
                          : "border-slate-100 hover:border-green-200",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          {v.image ? (
                            <img
                              src={v.image}
                              alt={v.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sprout className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        {selectedVariety === v.id && (
                          <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-100" />
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {v.name}
                        </p>
                        <p className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded w-fit">
                          {v.code || "---"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!varieties[selectedCrop] ||
                    varieties[selectedCrop].length === 0) && (
                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-500 italic">
                        Chưa có dữ liệu giống cho cây này.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      isValid: !!selectedCropGroup && !!selectedCrop && !!selectedVariety,
    },
    {
      id: "details",
      title: "Chi tiết lô giống",
      description: "Thông tin nhà cung cấp và thông số kỹ thuật",
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

                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      {filteredSuppliers.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedSupplierId(s.id);
                            setFormData({ ...formData, supplier: s.name });
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all",
                            selectedSupplierId === s.id
                              ? "border-blue-500 bg-blue-50/50 shadow-sm"
                              : "border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm",
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm",
                              selectedSupplierId === s.id
                                ? "bg-blue-500 text-white"
                                : "bg-white text-slate-500 border border-slate-200",
                            )}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                selectedSupplierId === s.id
                                  ? "text-blue-700"
                                  : "text-slate-700",
                              )}
                            >
                              {s.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {s.phone}
                            </p>
                          </div>
                          {selectedSupplierId === s.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
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
                      <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vietnam">Việt Nam</SelectItem>
                        <SelectItem value="Thailand">Thái Lan</SelectItem>
                        <SelectItem value="USA">Mỹ</SelectItem>
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
                      Hạn sử dụng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={
                        formData.expiryDate
                          ? formData.expiryDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expiryDate: e.target.valueAsDate || undefined,
                        })
                      }
                      className="h-10 border-slate-200 focus:ring-green-500"
                    />
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
                          className="pr-8"
                          value={formData.uniformity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              uniformity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
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
                          className="pr-8"
                          value={formData.germinationRate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              germinationRate: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Hình ảnh bao bì
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed h-40 transition-all cursor-pointer overflow-hidden bg-white hover:bg-slate-50",
                    illustrationPreview
                      ? "border-green-500/30"
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
                    <div className="w-full h-full relative">
                      <img
                        src={illustrationPreview}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[1px]">
                        <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg">
                          <p className="text-slate-800 font-bold text-xs flex items-center gap-2">
                            <CloudUpload className="w-3.5 h-3.5" /> Thay đổi ảnh
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:scale-110 transition-transform group-hover:bg-green-100 group-hover:text-green-600">
                        <CloudUpload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-slate-500 group-hover:text-green-700">
                        Click để tải ảnh lên
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: !!formData.supplier && !!formData.expiryDate,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cung cấp tài liệu hướng dẫn trồng và chăm sóc",
      content: (
        <div className="max-w-4xl mx-auto space-y-6 py-4">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-lg font-bold text-slate-800">
              Phương thức cung cấp tài liệu
            </h3>
            <p className="text-slate-500">
              Chọn cách bạn muốn nhập thông tin hướng dẫn kỹ thuật cho giống này
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Upload PDF */}
            <div
              onClick={() => setFormData({ ...formData, contentType: "pdf" })}
              className={cn(
                "relative group cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md",
                formData.contentType === "pdf"
                  ? "border-green-500 bg-green-50/10 ring-2 ring-green-500/20"
                  : "border-slate-100 bg-white hover:border-green-200",
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    formData.contentType === "pdf"
                      ? "bg-green-100 text-green-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-green-50 group-hover:text-green-500",
                  )}
                >
                  <CloudUpload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Tải file PDF</h4>
                  <p className="text-sm text-slate-500">
                    Dành cho tài liệu có sẵn
                  </p>
                </div>
                {formData.contentType === "pdf" && (
                  <div className="absolute top-6 right-6">
                    <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-100" />
                  </div>
                )}
              </div>
            </div>

            {/* Option 2: Direct Editor */}
            <div
              onClick={() =>
                setFormData({ ...formData, contentType: "editor" })
              }
              className={cn(
                "relative group cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md",
                formData.contentType === "editor"
                  ? "border-green-500 bg-green-50/10 ring-2 ring-green-500/20"
                  : "border-slate-100 bg-white hover:border-green-200",
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    formData.contentType === "editor"
                      ? "bg-green-100 text-green-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-green-50 group-hover:text-green-500",
                  )}
                >
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    Soạn thảo trực tiếp
                  </h4>
                  <p className="text-sm text-slate-500">
                    Nhập nội dung văn bản
                  </p>
                </div>
                {formData.contentType === "editor" && (
                  <div className="absolute top-6 right-6">
                    <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-100" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            {formData.contentType === "pdf" ? (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all cursor-pointer bg-slate-50/50 min-h-[280px]",
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
                  <div className="flex items-center gap-6 w-full max-w-md bg-white p-4 rounded-2xl shadow-xl shadow-green-900/5 ring-1 ring-slate-100 animate-in zoom-in-95 duration-300">
                    <div className="h-14 w-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {formData.pdfFile.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, pdfFile: null });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                      <CloudUpload className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-700 group-hover:text-green-700 transition-colors">
                        Tải liệu hướng dẫn PDF
                      </p>
                      <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                        Kéo thả hoặc click để tải lên file PDF (Tối đa 5MB)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 bg-white border-slate-200 text-slate-600 hover:text-green-700 hover:border-green-200"
                    >
                      Chọn file
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm ring-1 ring-slate-100">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                      <div className="w-3 h-3 rounded-full bg-green-400/20" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 ml-2">
                      Editor
                    </span>
                  </div>
                  <Editor
                    maxLength={10000}
                    contentEditableClassname="h-[400px] p-6 bg-white focus:outline-none prose max-w-none"
                    editorSerializedState={formData.editorContent as any}
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
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin trước khi tạo",
      content: (
        <div className="max-w-2xl mx-auto py-6 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 p-1">
                {illustrationPreview ? (
                  <img
                    src={illustrationPreview}
                    className="w-full h-full object-cover rounded-md"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-md">
                    <Sprout className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {formData.varietyName}
                </h3>
                <p className="text-sm text-slate-500">{formData.varietyCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cây trồng
                </p>
                <p className="font-medium text-slate-700">{formData.crop}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nhà cung cấp
                </p>
                <p className="font-medium text-slate-700">
                  {formData.supplier}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Xuất xứ
                </p>
                <p className="font-medium text-slate-700">
                  {formData.origin || "Chưa chọn"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hạn sử dụng
                </p>
                <p className="font-medium text-slate-700">
                  {formData.expiryDate?.toLocaleDateString("vi-VN") || "---"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tỷ lệ nảy mầm
                </p>
                <p className="font-medium text-slate-700">
                  {formData.germinationRate}%
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Độ sạch
                </p>
                <p className="font-medium text-slate-700">
                  {formData.uniformity}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm">
              Vui lòng kiểm tra kỹ thông tin. Bạn có thể chỉnh sửa lại sau khi
              tạo.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới hạt giống"
      description="Thêm mới hạt giống vào danh mục hệ thống"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Hoàn tất & Tạo giống"
            onCancel={() => setLocation("/seed")}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
