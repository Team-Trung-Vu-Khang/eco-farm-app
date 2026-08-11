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
import {
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Plus,
  ShieldAlert,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { initialPesticidePurposes } from "../../pesticide-group/data/constants";
import {
  commonHashtags,
  pesticideForms,
  toxicityLevels,
} from "../data/constants";
import type { PesticideFormData } from "../types";

interface PesticideBasicInfoStepProps {
  formData: PesticideFormData;
  paramHashtag: string;
  onParamHashtagChange: (value: string) => void;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
  onAddHashtag: () => void;
  onRemoveHashtag: (tag: string) => void;
}

const toxicityColorMap: Record<string, string> = {
  Ia: "bg-red-100 text-red-700 border-red-300",
  Ib: "bg-orange-100 text-orange-700 border-orange-300",
  II: "bg-yellow-100 text-yellow-700 border-yellow-300",
  III: "bg-blue-100 text-blue-700 border-blue-300",
  U: "bg-green-100 text-green-700 border-green-300",
};

export default function PesticideBasicInfoStep({
  formData,
  paramHashtag,
  onParamHashtagChange,
  onFormFieldChange,
  onAddHashtag,
  onRemoveHashtag,
}: PesticideBasicInfoStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Thông tin chung */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Thông tin định danh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã sản phẩm / Mã SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => onFormFieldChange("code", e.target.value)}
                placeholder="VD: BVTV001"
              />
              <p className="text-xs text-muted-foreground">
                Rất quan trọng để truy xuất nguồn gốc
              </p>
            </div>
            <div className="space-y-2">
              <Label>
                Tên thương mại <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                placeholder="VD: Regent 800WG, Baytril 10%"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số đăng ký lưu hành</Label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) =>
                  onFormFieldChange("registrationNumber", e.target.value)
                }
                placeholder="VD: BVTV-2024-001"
              />
              <p className="text-xs text-muted-foreground">
                Số đăng ký theo danh mục Bộ NN&PTNT
              </p>
            </div>
            <div className="space-y-2">
              <Label>Hàm lượng / Nồng độ</Label>
              <Input
                value={formData.concentration}
                onChange={(e) =>
                  onFormFieldChange("concentration", e.target.value)
                }
                placeholder="VD: 25%, 500mg/ml, 10g/L"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Nhóm phân loại chính (Đối tượng phòng trừ){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.group}
              onValueChange={(value) => onFormFieldChange("group", value)}
            >
              <SelectTrigger className="text-left h-auto py-2">
                <SelectValue placeholder="Chọn loại thuốc từ danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {initialPesticidePurposes.map((purpose) => (
                  <SelectItem key={purpose.code} value={purpose.name}>
                    <div className="flex flex-col">
                      <span className="font-medium">{purpose.name}</span>
                      {purpose.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {purpose.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <p className="text-xs text-muted-foreground">
              Danh mục được quản lý tại{" "}
              <span className="text-primary font-medium">Danh mục → Thuốc BVTV</span>
            </p> */}
          </div>

          <div className="space-y-2">
            <Label>Tên hoạt chất</Label>
            <Textarea
              value={formData.activeIngredient}
              onChange={(e) =>
                onFormFieldChange("activeIngredient", e.target.value)
              }
              placeholder="VD: Fipronil 800g/kg, Enrofloxacin 10%"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Tên gốc khoa học của hoạt chất
            </p>
          </div>
        </div>

        {/* Card: Phân loại kỹ thuật */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Phân loại kỹ thuật
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dạng bào chế</Label>
              <Select
                value={formData.form}
                onValueChange={(v) => onFormFieldChange("form", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dạng bào chế..." />
                </SelectTrigger>
                <SelectContent>
                  {pesticideForms.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                EC, SC, WP, WG, SL, viên nén...
              </p>
            </div>

            <div className="space-y-2">
              <Label>Cách xâm nhập</Label>
              <Input
                value={formData.actionType}
                onChange={(e) =>
                  onFormFieldChange("actionType", e.target.value)
                }
                placeholder="VD: Vị độc, tiếp xúc, xông hơi, nội hấp"
              />
            </div>
          </div>

          {/* Nhóm độc WHO */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Nhóm độc / Mức độ độc hại (WHO)
            </Label>
            <div className="flex flex-wrap gap-2">
              {toxicityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    onFormFieldChange("toxicityLevel", level.value)
                  }
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    formData.toxicityLevel === level.value
                      ? toxicityColorMap[level.value] +
                        " ring-2 ring-offset-1 ring-current"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {level.label}
                </button>
              ))}
              {formData.toxicityLevel && (
                <button
                  type="button"
                  onClick={() => onFormFieldChange("toxicityLevel", "")}
                  className="px-2 py-1.5 text-xs text-muted-foreground hover:text-slate-900"
                >
                  Xóa
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Áp dụng với thuốc BVTV hoặc hóa chất độc hại
            </p>
          </div>

          <div className="space-y-2">
            <Label>Nhóm cơ chế tác động (MoA)</Label>
            <Input
              value={formData.moaGroup}
              onChange={(e) => onFormFieldChange("moaGroup", e.target.value)}
              placeholder="VD: IRAC Nhóm 4A, FRAC Nhóm 3, WHO..."
            />
            <p className="text-xs text-muted-foreground">
              Theo IRAC / FRAC / WHO (nếu có)
            </p>
          </div>
        </div>

        {/* Card: Hashtags */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Hashtags & Ghi chú
          </h3>
          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => onParamHashtagChange(e.target.value)}
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
                      : onFormFieldChange("hashtags", [
                          ...formData.hashtags,
                          tag,
                        ])
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
          <div className="space-y-2">
            <Label>Ghi chú thêm</Label>
            <Textarea
              value={formData.note}
              onChange={(e) => onFormFieldChange("note", e.target.value)}
              placeholder="Ghi chú nội bộ..."
            />
          </div>
        </div>
      </div>

      {/* Right column: Image upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh bao bì
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
