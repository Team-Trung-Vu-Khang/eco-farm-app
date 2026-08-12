import { useState } from "react";
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
} from "lucide-react";
import type { MaterialFormData } from "../types/types";
import { commonHashtags, materialGroups } from "../data/constants";

interface SimpleMaterialFormProps {
  formData: MaterialFormData;
  updateField: (field: keyof MaterialFormData, value: any) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
}

export default function SimpleMaterialForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
}: SimpleMaterialFormProps) {
  const isValid = Boolean(formData.name && formData.code);
  const [paramHashtag, setParamHashtag] = useState("");

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
      {/* Banner info */}
      <div className="flex items-start gap-4 p-4 bg-slate-50 text-slate-900 rounded-xl border border-slate-200">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Hammer className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Nhập nhanh những thông tin cần thiết nhất. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ mức độ công nghệ, nhà cung cấp và quy cách đóng gói.
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
            <Label required>Mã vật tư</Label>
            <Input
              value={formData.code}
              onChange={(e) => updateField("code", e.target.value)}
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
            <Label required>Mức độ công nghệ</Label>
            <Select
              value={formData.technologyLevelId || ""}
              onValueChange={(value) => {
                updateField("technologyLevelId", value);
                updateField("materialGroupId", value);
              }}
            >
              <SelectTrigger className="text-left h-auto py-2">
                <SelectValue placeholder="Chọn mức độ công nghệ..." />
              </SelectTrigger>
              <SelectContent>
                {materialGroups[0].options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label required>Giai đoạn áp dụng</Label>
            <Select
              value={formData.valueChainId || ""}
              onValueChange={(value) => updateField("valueChainId", value)}
            >
              <SelectTrigger className="text-left h-auto py-2">
                <SelectValue placeholder="Chọn giai đoạn áp dụng..." />
              </SelectTrigger>
              <SelectContent>
                {materialGroups[1].options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          disabled={!isValid}
          onClick={handleComplete}
          className="font-bold"
        >
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
