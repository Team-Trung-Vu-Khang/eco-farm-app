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
  Image as ImageIcon,
  Plus,
  Tags,
  Upload,
  X,
} from "lucide-react";
import {
  actionTypes,
  commonHashtags,
  origins,
  pesticideForms,
  pesticideGroups,
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
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã thuốc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => onFormFieldChange("code", e.target.value)}
                placeholder="VD: BVTV001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên thuốc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                placeholder="Nhập tên thuốc..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nhóm thuốc</Label>
              <Select
                value={formData.group}
                onValueChange={(value) => onFormFieldChange("group", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {pesticideGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dạng thuốc</Label>
              <Select
                value={formData.form}
                onValueChange={(value) => onFormFieldChange("form", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dạng" />
                </SelectTrigger>
                <SelectContent>
                  {pesticideForms.map((form) => (
                    <SelectItem key={form} value={form}>
                      {form}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cơ chế tác động</Label>
              <Select
                value={formData.actionType}
                onValueChange={(value) =>
                  onFormFieldChange("actionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cơ chế" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((actionType) => (
                    <SelectItem key={actionType} value={actionType}>
                      {actionType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nguồn gốc</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => onFormFieldChange("origin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nguồn gốc" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((origin) => (
                    <SelectItem key={origin} value={origin}>
                      {origin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Công thức hoạt chất</Label>
            <Textarea
              value={formData.activeIngredient}
              onChange={(e) =>
                onFormFieldChange("activeIngredient", e.target.value)
              }
              placeholder="Nhập thành phần hoạt chất..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Công dụng & Hướng dẫn sử dụng</Label>
            <Textarea
              value={formData.usage}
              onChange={(e) => onFormFieldChange("usage", e.target.value)}
              placeholder="Mô tả công dụng và hướng dẫn sử dụng..."
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
                      : onFormFieldChange("hashtags", [...formData.hashtags, tag])
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
}
