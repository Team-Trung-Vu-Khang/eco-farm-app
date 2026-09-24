import { useState } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  Info,
  Leaf,
  Package,
  Plus,
  Tags,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import type { ByProductFormData } from "../types/types";
import { commonHashtags } from "../data/constants";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";
import { normalizeSku } from "@/shared/lib/sku";

interface SimpleByProductFormProps {
  formData: ByProductFormData;
  updateField: (
    field: keyof ByProductFormData,
    value: ByProductFormData[keyof ByProductFormData],
  ) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

export default function SimpleByProductForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimpleByProductFormProps) {
  const isEdit = window.location.pathname.includes("/edit");

  const [originSearch, setOriginSearch] = useState("");
  const [physicoSearch, setPhysicoSearch] = useState("");
  const [toxicitySearch, setToxicitySearch] = useState("");

  const debouncedOriginSearch = useDebounce(originSearch, 300);
  const debouncedPhysicoSearch = useDebounce(physicoSearch, 300);
  const debouncedToxicitySearch = useDebounce(toxicitySearch, 300);

  const { items: loadedOrigins, loading: isOriginLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "origin",
        keyword: debouncedOriginSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedPhysicos, loading: isPhysicoLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "physico_chemical",
        keyword: debouncedPhysicoSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedToxicities, loading: isToxicityLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "toxicity_regulation",
        keyword: debouncedToxicitySearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const originOptions = (loadedOrigins || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const physicoOptions = (loadedPhysicos || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const toxicityOptions = (loadedToxicities || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));

  // Dynamic API Fetching
  const { data: packagingTypes } = useQuery({
    queryKey: ["packaging-types"],
    queryFn: () => farmSupplyApi.listPackagingTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: baseUnits } = useQuery({
    queryKey: ["base-units"],
    queryFn: () => farmSupplyApi.listBaseUnits(),
    staleTime: 5 * 60 * 1000,
  });

  const packagingList = (packagingTypes ?? []).map((p) => p.name);
  const unitList = (baseUnits ?? []).map((u) => u.name);

  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");

  const packagingSpecsArr = formData.packagingSpecs || [];

  const addPackagingSpec = () => {
    let spec = "";
    if (configMode === "SPEC") {
      const trimmedQty = quantity.trim();
      if (!packaging || !trimmedQty || !unit) return;
      spec = `${packaging} ${trimmedQty} ${unit}`;
    } else {
      if (!unit) return;
      spec = `${unit}`;
    }
    if (!packagingSpecsArr.includes(spec)) {
      updateField("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
  };

  const removePackagingSpec = (value: string) => {
    updateField(
      "packagingSpecs",
      packagingSpecsArr.filter((v) => v !== value),
    );
  };

  const isValid = Boolean(formData.name);
  const [paramHashtag, setParamHashtag] = useState("");

  const onAddHashtag = () => {
    const tag = paramHashtag.trim();
    if (tag && !formData.hashtags.includes(tag)) {
      updateField("hashtags", [...formData.hashtags, tag]);
      setParamHashtag("");
    }
  };

  const onRemoveHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* ── Hình ảnh ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-slate-400" />
          Hình ảnh sản phẩm
        </Label>
        {formData.imageUrl ? (
          <div className="relative group w-full max-w-[200px]">
            <img
              src={formData.imageUrl}
              alt="product"
              className="w-full rounded-xl border object-cover aspect-square"
            />
            <button
              type="button"
              onClick={() => {
                updateField("imageUrl", "");
                updateField("imageFile", null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[160px] gap-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">
                Tải lên ảnh sản phẩm
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kéo thả hoặc click để chọn — PNG, JPG tối đa 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                updateField("imageUrl", url);
                updateField("imageFile", file);
              }}
            />
          </label>
        )}
      </div>

      {/* ── Mã SKU ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Mã sản phẩm / SKU
        </Label>
        <Input
          value={formData.code}
          disabled={isEdit}
          clearable={!isEdit}
          onChange={(e) => updateField("code", normalizeSku(e.target.value))}
          placeholder="Để trống để tự động tạo (BYP-xxx / FBYP-xxx)"
        />
      </div>

      {/* ── Tên phụ phẩm ── */}
      <div className="space-y-2">
        <Label required className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Tên phụ phẩm
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="VD: Bã mía đã qua xử lý, Vỏ cà phê ủ hoai..."
        />
      </div>

      {/* ── Phân loại phụ phẩm ── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">Nguồn gốc</Label>
            <RemoteMultiSelect
              options={originOptions}
              value={formData.byProductOrigins || []}
              onChange={(vals) => updateField("byProductOrigins", vals)}
              onSearch={setOriginSearch}
              placeholder="Chọn nguồn gốc..."
              searchPlaceholder="Tìm nguồn gốc..."
              emptyText="Không có dữ liệu"
              loading={isOriginLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Sinh học (Lý - Hóa)
            </Label>
            <RemoteMultiSelect
              options={physicoOptions}
              value={formData.byProductPhysicoChemicals || []}
              onChange={(vals) =>
                updateField("byProductPhysicoChemicals", vals)
              }
              onSearch={setPhysicoSearch}
              placeholder="Chọn đặc tính sinh học lý-hóa..."
              searchPlaceholder="Tìm đặc tính lý hóa..."
              emptyText="Không có dữ liệu"
              loading={isPhysicoLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-1.5">
              Mức độ độc hại & Quy chuẩn quản lý
            </Label>
            <RemoteMultiSelect
              options={toxicityOptions}
              value={formData.byProductToxicityRegulations || []}
              onChange={(vals) =>
                updateField("byProductToxicityRegulations", vals)
              }
              onSearch={setToxicitySearch}
              placeholder="Chọn mức độ độc hại / quy chuẩn..."
              searchPlaceholder="Tìm mức độ độc hại / quy chuẩn..."
              emptyText="Không có dữ liệu"
              loading={isToxicityLoading}
            />
          </div>
        </div>
      </div>

      {/* ── Cấu hình Quy cách đóng gói & Đơn vị vật tư ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Package className="w-4 h-4 text-slate-400" />
          Cấu hình Quy cách đóng gói &amp; Đơn vị vật tư
        </Label>

        {/* Mode switch */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl text-xs font-medium gap-1">
            <button
              type="button"
              onClick={() => setConfigMode("SPEC")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                configMode === "SPEC"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quy cách đầy đủ (Bao 50kg, Khối, Tấn...)
            </button>
            <button
              type="button"
              onClick={() => setConfigMode("BASE_UNIT")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                configMode === "BASE_UNIT"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Chỉ chọn Đơn vị cơ bản (kg, tấn, bao...)
            </button>
          </div>
        </div>

        {/* Form chọn đơn vị / quy cách */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-3">
            {configMode === "SPEC" ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4 space-y-1.5">
                  <Label className="text-xs text-slate-600">
                    Đóng gói theo
                  </Label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đóng gói..." />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingList.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-slate-600">
                    Thể tích / Khối lượng
                  </Label>
                  <Input
                    type="number"
                    placeholder="VD: 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-slate-600">Đơn vị đo</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đơn vị..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unitList.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    onClick={addPackagingSpec}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9 space-y-1.5">
                  <Label className="text-xs text-slate-600">
                    Đơn vị cơ bản
                  </Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đơn vị cơ bản..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unitList.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-3">
                  <Button
                    type="button"
                    onClick={addPackagingSpec}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* List các quy cách đã thêm */}
        {packagingSpecsArr.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {packagingSpecsArr.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-2 rounded-lg"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removePackagingSpec(spec)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* ── Thành phần chi tiết ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-400" />
          Thành phần chi tiết
        </Label>
        <Input
          value={formData.detailedComposition}
          onChange={(e) => updateField("detailedComposition", e.target.value)}
          placeholder="VD: Cellulose 45%; Hemicellulose 30%; Lignin 20%..."
        />
      </div>

      {/* ── Tên khoa học / tên kỹ thuật ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-slate-400" />
          Tên khoa học / Tên kỹ thuật
        </Label>
        <Input
          value={formData.scientificTechnicalName}
          onChange={(e) =>
            updateField("scientificTechnicalName", e.target.value)
          }
          placeholder="VD: Saccharum officinarum (bagasse)..."
        />
      </div>

      {/* ── Mô tả chi tiết ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">Mô tả sản phẩm</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Nhập mô tả về phụ phẩm, đặc tính, lưu ý bảo quản..."
          rows={3}
        />
      </div>

      {/* ── Nút Hoàn tất ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex items-center justify-between z-10 max-w-2xl mx-auto shadow-lg rounded-t-xl">
        <Button variant="outline" onClick={goBack} disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Hủy
        </Button>
        <Button onClick={handleComplete} disabled={!isValid || loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
            </>
          ) : (
            completeLabel
          )}
        </Button>
      </div>
    </div>
  );
}
