import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image as ImageIcon, Leaf, Plus, Tags, Upload, X } from "lucide-react";
import { useState } from "react";
import { useMasterData } from "@/features/master-data";
import { commonHashtags, originOptions } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerBasicInfoStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

export const FertilizerBasicInfoStep = ({
  formData,
  updateField,
}: FertilizerBasicInfoStepProps) => {
  const isEdit = window.location.pathname.includes("/edit");
  const [paramHashtag, setParamHashtag] = useState("");

  // Fetch groups dynamically from master data (managed in FertilizerGroupPage.tsx)
  const { items: fertilizerGroups } = useMasterData("fertilizer-groups");

  const handleAddHashtag = () => {
    const nextHashtag = paramHashtag.trim();
    if (nextHashtag && !formData.hashtags.includes(nextHashtag)) {
      updateField("hashtags", [...formData.hashtags, nextHashtag]);
      setParamHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Identification & Classification */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Định danh & Phân loại Phân bón
          </h3>

          {/* SKU & Commercial Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Mã sản phẩm / SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: PB-NPK-202015"
                disabled={isEdit}
                clearable={!isEdit}
              />
              <p className="text-xs text-muted-foreground">
                Rất quan trọng để truy xuất nguồn gốc
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Tên thương mại <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="VD: NPK 20-20-15 Đầu Trâu"
              />
              <p className="text-xs text-muted-foreground">
                Tên thương mại nhãn hiệu phân bón
              </p>
            </div>
          </div>

          {/* Registration Number & Scientific/Technical Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số đăng ký quyết định lưu hành</Label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) =>
                  updateField("registrationNumber", e.target.value)
                }
                placeholder="VD: LH-5821/GP-PB"
              />
              <p className="text-xs text-muted-foreground">
                Số quyết định công nhận phân bón lưu hành tại VN
              </p>
            </div>
            <div className="space-y-2">
              <Label>Tên khoa học / Tên kỹ thuật</Label>
              <Input
                value={formData.scientificTechnicalName}
                onChange={(e) =>
                  updateField("scientificTechnicalName", e.target.value)
                }
                placeholder="VD: Inorganic Compound NPK"
              />
            </div>
          </div>

          {/* Single Fertilizer Group Selector (managed in Category page) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Nhóm phân bón <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.fertilizerOriginGroup}
              onValueChange={(val) => {
                updateField("fertilizerOriginGroup", val);
                // Also set legacy field originId if there is a match or just sync
                const matchedOption = originOptions.find(
                  (o) => o.label === val,
                );
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
            {/* <p className="text-xs text-muted-foreground">
              Danh mục được quản lý tại{" "}
              <span className="text-primary font-medium">
                Danh mục → Phân bón
              </span>
            </p> */}
          </div>

          {/* MoA & NPK Ratio */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
          <div className="space-y-2">
            <Label>Cơ chế tác động (MoA) / Dưỡng chất đặc biệt</Label>
            <Input
              value={formData.moaGroup}
              onChange={(e) => updateField("moaGroup", e.target.value)}
              placeholder="VD: Tan nhanh, nhả chậm, vi lượng Chelate..."
            />
          </div>
          <div className="space-y-2">
            <Label>Tỷ lệ N-P-K (nếu có)</Label>
            <Input
              value={formData.npkRatio}
              onChange={(e) => updateField("npkRatio", e.target.value)}
              placeholder="VD: 20-20-15, 16-16-8"
            />
            <p className="text-xs text-muted-foreground">
              Tỷ lệ hàm lượng Nitơ - Phốt pho - Kali
            </p>
          </div>
          {/* </div> */}

          {/* Main Ingredients */}
          <div className="space-y-2">
            <Label>Thành phần chính chi tiết</Label>
            <Textarea
              value={formData.mainIngredients}
              onChange={(e) => updateField("mainIngredients", e.target.value)}
              placeholder="Nhập chi tiết thành phần (VD: Đạm N: 20%, Lân P2O5: 20%, Kali K2O: 15%...)"
              rows={4}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Mô tả tóm tắt sản phẩm</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả công dụng chung, ưu điểm vượt trội..."
              rows={3}
            />
          </div>
        </div>

        {/* Card: Hashtags */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Hashtags Phân loại nhanh
          </h3>
          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => setParamHashtag(e.target.value)}
                placeholder="Nhập hashtag..."
                onKeyDown={(e) => e.key === "Enter" && handleAddHashtag()}
              />
              <Button
                type="button"
                onClick={handleAddHashtag}
                variant="outline"
              >
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
                      ? removeHashtag(tag)
                      : updateField("hashtags", [...formData.hashtags, tag])
                  }
                >
                  #{tag}
                </Badge>
              ))}
              {formData.hashtags
                .filter((t) => !commonHashtags.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Image upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh sản phẩm
          </h3>
          {formData.imageUrl ? (
            <div className="relative group w-full max-w-[240px] mx-auto">
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
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-900">Tải lên ảnh sản phẩm</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kéo thả hoặc click để chọn file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG tối đa 5MB
              </p>
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
      </div>
    </div>
  );
};
