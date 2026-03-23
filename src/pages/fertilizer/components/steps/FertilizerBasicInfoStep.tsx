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
import { commonHashtags, fertilizerTypes } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerBasicInfoStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

export const FertilizerBasicInfoStep = ({
  formData,
  updateField,
}: FertilizerBasicInfoStepProps) => {
  const [paramHashtag, setParamHashtag] = useState("");

  const handleAddHashtag = () => {
    if (paramHashtag && !formData.hashtags.includes(paramHashtag)) {
      updateField("hashtags", [...formData.hashtags, paramHashtag]);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã phân bón <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: PB001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên phân bón <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nhập tên phân bón..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại phân bón</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => updateField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phân" />
                </SelectTrigger>
                <SelectContent>
                  {fertilizerTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hàm lượng dinh dưỡng</Label>
              <Input
                value={formData.nutrientContent}
                onChange={(e) => updateField("nutrientContent", e.target.value)}
                placeholder="VD: N-P-K (20-20-15)..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả công dụng, đặc điểm..."
              rows={4}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Phân loại & Hashtags
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
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-medium text-slate-900">Tải lên ảnh sản phẩm</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
