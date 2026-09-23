import { useState } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
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
  Image as ImageIcon,
  Info,
  Plus,
  Tags,
  Upload,
  X,
  Cpu,
  Hammer,
  Loader2,
} from "lucide-react";
import type { MaterialFormData } from "../types/types";
import { commonHashtags } from "../data/constants";
import { useSupplyCatalog } from "@/features/farm-supply/hooks/useSupplyCatalog";

import { normalizeSku } from "@/shared/lib/sku";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SimpleMaterialFormProps {
  formData: MaterialFormData;
  updateField: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

export default function SimpleMaterialForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimpleMaterialFormProps) {
  const isEdit = window.location.pathname.includes("/edit");
  const isValid =
    Boolean(formData.name) && Boolean(formData.packagingSpecs?.length);
  const [paramHashtag, setParamHashtag] = useState("");
  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");

  const { packagingTypes, baseUnits, groups } = useSupplyCatalog({
    type: "material",
  });

  const [techSearch, setTechSearch] = useState("");
  const [chainSearch, setChainSearch] = useState("");

  const debouncedTechSearch = useDebounce(techSearch, 300);
  const debouncedChainSearch = useDebounce(chainSearch, 300);

  const techLevelOptions = (groups || [])
    .filter((g) => g.classification === "technology_level")
    .filter((g) =>
      debouncedTechSearch.trim()
        ? g.name.toLowerCase().includes(debouncedTechSearch.toLowerCase())
        : true,
    )
    .map((g) => ({ label: g.name, value: g.code }));
  const valueChainOptions = (groups || [])
    .filter((g) => g.classification === "value_chain")
    .filter((g) =>
      debouncedChainSearch.trim()
        ? g.name.toLowerCase().includes(debouncedChainSearch.toLowerCase())
        : true,
    )
    .map((g) => ({ label: g.name, value: g.code }));

  const packagingTypeOptions = (packagingTypes || []).map((p) => p.name);
  const baseUnitOptions = (baseUnits || []).map((u) => u.name);

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

  const onAddHashtag = () => {
    const tag = paramHashtag.trim();
    const current = formData.hashtags || [];
    if (tag && !current.includes(tag)) {
      updateField("hashtags", [...current, tag]);
      setParamHashtag("");
    }
  };

  const onRemoveHashtag = (tag: string) => {
    const current = formData.hashtags || [];
    updateField(
      "hashtags",
      current.filter((t) => t !== tag),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
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
              onClick={() => updateField("imageUrl", "")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[160px] gap-3">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-500">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">
                Tải lên ảnh vật tư
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
              }}
            />
          </label>
        )}
      </div>
      {/* ── Thông tin chung ── */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Hammer className="h-5 w-5 text-primary" />
          Thông tin chung
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Mã vật tư</Label>
            <Input
              value={formData.code}
              disabled={isEdit}
              clearable={!isEdit}
              onChange={(e) =>
                updateField("code", normalizeSku(e.target.value))
              }
              placeholder="VD: VL001"
            />
          </div>

          <div className="space-y-2">
            <Label required>Tên vật tư</Label>
            <Input
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nhập tên vật tư..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mô tả</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Mô tả đặc điểm, thông số kỹ thuật..."
            rows={3}
          />
        </div>
      </div>
      {/* ── Phân loại kỹ thuật ── */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Cpu className="h-5 w-5 text-primary" />
          Phân loại kỹ thuật
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Mức độ Công nghệ</Label>
            <RemoteMultiSelect
              options={techLevelOptions}
              value={
                formData.technologyLevelIds &&
                formData.technologyLevelIds.length > 0
                  ? formData.technologyLevelIds
                  : formData.technologyLevelId
                    ? [formData.technologyLevelId]
                    : []
              }
              onChange={(vals) => {
                updateField("technologyLevelIds", vals);
                updateField("technologyLevelId", vals[0] || "");
                updateField("materialGroupId", vals[0] || "");
              }}
              onSearch={setTechSearch}
              placeholder="Chọn mức độ công nghệ (chọn nhiều)..."
              searchPlaceholder="Tìm mức độ công nghệ..."
              emptyText="Không tìm thấy mức độ công nghệ"
            />
          </div>

          <div className="space-y-2">
            <Label>Chuỗi giá trị</Label>
            <RemoteMultiSelect
              options={valueChainOptions}
              value={
                formData.valueChainIds && formData.valueChainIds.length > 0
                  ? formData.valueChainIds
                  : formData.valueChainId
                    ? [formData.valueChainId]
                    : []
              }
              onChange={(vals) => {
                updateField("valueChainIds", vals);
                updateField("valueChainId", vals[0] || "");
              }}
              onSearch={setChainSearch}
              placeholder="Chọn chuỗi giá trị (chọn nhiều)..."
              searchPlaceholder="Tìm chuỗi giá trị..."
              emptyText="Không tìm thấy chuỗi giá trị"
            />
          </div>
        </div>
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
            {commonHashtags.map((tag) => {
              const current = formData.hashtags || [];
              const isSelected = current.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() =>
                    isSelected
                      ? onRemoveHashtag(tag)
                      : updateField("hashtags", [...current, tag])
                  }
                >
                  #{tag}
                </Badge>
              );
            })}
            {(formData.hashtags || [])
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
      {/* ── Cấu hình Đơn vị Vật tư ── */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Tags className="h-5 w-5 text-primary" />
          Cấu hình Đơn vị Vật tư *
        </h3>

        {/* Mode switch on separate line */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Chế độ cấu hình:
            </span>
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
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
          </div>

          <div className="flex gap-2 items-end">
            {configMode === "SPEC" ? (
              <>
                <div className="flex-1 space-y-1 min-w-[130px]">
                  <Label className="text-xs text-muted-foreground">
                    Loại đóng gói
                  </Label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Loại (Chai, Bao...)" />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingTypeOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-28 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Số lượng
                  </Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="VD: 500, 25"
                    min={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPackagingSpec();
                      }
                    }}
                  />
                </div>

                <div className="flex-1 space-y-1 min-w-[120px]">
                  <Label className="text-xs text-muted-foreground">
                    Đơn vị cơ sở
                  </Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Đơn vị (ml, kg...)" />
                    </SelectTrigger>
                    <SelectContent>
                      {baseUnitOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Đơn vị cơ sở
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Chọn đơn vị cơ sở (kg, lít, ml, viên...)" />
                  </SelectTrigger>
                  <SelectContent>
                    {baseUnitOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="button"
              onClick={addPackagingSpec}
              disabled={
                configMode === "SPEC"
                  ? !packaging || !quantity.trim() || !unit
                  : !unit
              }
              className="mb-0 shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>

          {packagingSpecsArr.length > 0 && (
            <div className="bg-slate-50 rounded-xl border p-3 mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Đã thêm ({packagingSpecsArr.length} quy cách):
              </p>
              <div className="flex flex-wrap gap-2">
                {packagingSpecsArr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-sm px-3 py-1 flex items-center gap-1.5"
                  >
                    {tag}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-destructive"
                      onClick={() => removePackagingSpec(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ── Info card ── */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ cơ bản giúp tạo nhanh vật tư với thông tin tối thiểu. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ thông số kỹ thuật, xuất xứ và nhà cung cấp.
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
