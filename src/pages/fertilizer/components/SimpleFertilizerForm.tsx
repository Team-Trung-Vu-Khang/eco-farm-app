import { useState } from "react";
import { useMasterData } from "@/features/master-data";
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
import type { FertilizerFormData } from "../types/types";
import { originOptions, commonHashtags } from "../data/constants";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

const MEASURE_UNIT_OPTIONS = [
  "kg",
  "g",
  "L",
  "ml",
  "tấn",
  "bao",
  "can",
  "thùng",
  "viên",
  "ống",
  "vỉ",
  "cc",
  "IU",
];

const PACKAGING_OPTIONS = [
  "Bao",
  "Bì",
  "Can",
  "Chai",
  "Hộp",
  "Lọ",
  "Gói",
  "Thùng",
  "Túi",
  "Cuộn",
  "Kiện",
  "Khay",
];

interface SimpleFertilizerFormProps {
  formData: FertilizerFormData;
  updateField: (
    field: keyof FertilizerFormData,
    value: FertilizerFormData[keyof FertilizerFormData],
  ) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

export default function SimpleFertilizerForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimpleFertilizerFormProps) {
  const isEdit = window.location.pathname.includes("/edit");
  // Fetch fertilizer groups from master data (same as advanced form)
  const { items: fertilizerGroups } = useMasterData("fertilizer-groups", {
    params: { size: 100 },
  });

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

  const packagingList =
    packagingTypes && packagingTypes.length > 0
      ? packagingTypes.map((p) => p.name)
      : PACKAGING_OPTIONS;

  const unitList =
    baseUnits && baseUnits.length > 0
      ? baseUnits.map((u) => u.name)
      : MEASURE_UNIT_OPTIONS;

  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");
  const hasSimplePackagingRule =
    configMode === "SPEC"
      ? Boolean(formData.packaging && formData.quantity)
      : Boolean(formData.unit && formData.quantity);
  const isValid = Boolean(formData.name) && hasSimplePackagingRule;
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
      {/* Banner info */}
      <div className="flex items-start gap-4 p-4 bg-green-50 text-green-900 rounded-xl border border-green-100">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-green-700 mt-0.5">
            Nhập nhanh những thông tin cần thiết nhất. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ thành phần, hướng dẫn sử dụng, an toàn pháp lý và nhà cung
            cấp.
          </p>
        </div>
      </div>

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

      {/* ── Nhóm phân bón ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-slate-400" />
          Nhóm phân bón
        </Label>
        <Select
          value={formData.fertilizerOriginGroup}
          onValueChange={(val) => {
            updateField("fertilizerOriginGroup", val);
            // Sync legacy originId field if there's a match
            const matchedOption = originOptions.find((o) => o.label === val);
            if (matchedOption) {
              updateField("originId", matchedOption.id);
            }
          }}
        >
          <SelectTrigger className="text-left h-auto py-2">
            <SelectValue placeholder="Chọn nhóm phân bón từ danh mục..." />
          </SelectTrigger>
          <SelectContent>
            {fertilizerGroups.map((g) => (
              <SelectItem key={g.id} value={g.name}>
                <div className="flex flex-col">
                  <span className="font-medium">{g.name}</span>
                  {g.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {g.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          onChange={(e) => updateField("code", e.target.value)}
          placeholder="Để trống để tự động tạo"
        />
      </div>

      {/* ── Tên phân bón ── */}
      <div className="space-y-2">
        <Label required className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Tên phân bón
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="VD: NPK 20-20-15 Đầu Trâu, Phân hữu cơ vi sinh Sông Gianh..."
        />
      </div>

      {/* ── Cấu hình Đơn vị Vật tư ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Package className="w-4 h-4 text-slate-400" />
          Cấu hình Đơn vị Vật tư <span className="text-red-500">*</span>
        </Label>

        {/* Mode switch */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl text-xs font-medium w-fit max-w-full gap-1">
          <button
            type="button"
            onClick={() => setConfigMode("SPEC")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              configMode === "SPEC"
                ? "bg-white text-primary shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quy cách đầy đủ (Chai 500ml, Bao 25kg...)
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
            Không rõ quy cách (Chỉ chọn đơn vị cơ bản kg, l...)
          </button>
        </div>

        <div className="flex gap-2 items-center">
          {configMode === "SPEC" ? (
            <>
              <div className="flex-1 min-w-[130px]">
                <Select
                  value={formData.packaging || formData.physicalForm}
                  onValueChange={(v) => {
                    updateField("packaging", v);
                    updateField("physicalForm", v);
                  }}
                >
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Loại (Chai, Bao...)" />
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

              <div className="w-28">
                <Input
                  type="number"
                  min={1}
                  placeholder="Số lượng"
                  value={formData.quantity}
                  onChange={(e) => {
                    updateField("quantity", e.target.value);
                  }}
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <Select
                  value={formData.unit}
                  onValueChange={(v) => updateField("unit", v)}
                >
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Đơn vị (ml, kg...)" />
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
            </>
          ) : (
            <div className="flex-1">
              <Select
                value={formData.unit}
                onValueChange={(v) => updateField("unit", v)}
              >
                <SelectTrigger className="text-left h-auto py-2">
                  <SelectValue placeholder="Chọn đơn vị cơ sở (kg, lít, ml, viên...)" />
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
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {configMode === "SPEC"
            ? "VD: Chai 500 ml, Bao 25 kg... Nhập loại đóng gói, số lượng và đơn vị."
            : "VD: kg, Lít, ml... Chọn đơn vị cơ bản khi không rõ quy cách đóng gói."}
        </p>
      </div>

      {/* ── Hạn sử dụng ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          Hạn sử dụng
        </Label>
        <Input
          value={formData.shelfLife}
          onChange={(e) => updateField("shelfLife", e.target.value)}
          placeholder="VD: 2 năm, 18 tháng, 12/2026..."
        />
      </div>

      {/* ── Ghi chú ── */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Ghi chú nội bộ, lưu ý khi sử dụng hoặc bảo quản..."
          rows={3}
        />
      </div>

      {/* Card: Hashtags */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Tags className="w-5 h-5 text-primary" />
          Hashtags
        </h3>
        <div className="space-y-3">
          <Label>Thêm Hashtag</Label>
          <div className="flex gap-2">
            <Input
              value={paramHashtag}
              onChange={(e) => setParamHashtag(e.target.value)}
              placeholder="Nhập hashtag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddHashtag();
                }
              }}
            />
            <Button type="button" onClick={onAddHashtag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {commonHashtags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  formData.hashtags.includes(tag)
                    ? "bg-primary/10 border-primary text-primary"
                    : "hover:bg-slate-100"
                }`}
                onClick={() =>
                  formData.hashtags.includes(tag)
                    ? onRemoveHashtag(tag)
                    : updateField("hashtags", [...formData.hashtags, tag])
                }
              >
                #{tag}
              </Badge>
            ))}
            {formData.hashtags
              .filter((tag) => !commonHashtags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  #{tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onRemoveHashtag(tag)}
                  />
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* ── Info card ── */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ cơ bản giúp tạo nhanh phân bón với thông tin tối thiểu. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ thành phần dinh dưỡng, hướng dẫn sử dụng, an toàn pháp lý và
            nhà cung cấp.
          </p>
        </CardContent>
      </Card>

      {/* ── Sticky footer ── */}
      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-t border-slate-100 pt-4 pb-2 -mx-4 px-4">
        <Button type="button" variant="outline" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button
          type="button"
          disabled={!isValid || loading}
          onClick={handleComplete}
          className="font-bold"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
