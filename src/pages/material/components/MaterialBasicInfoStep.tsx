import type { KeyboardEvent } from "react";
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
  Hammer,
  Image as ImageIcon,
  Plus,
  Tags,
  Upload,
  X,
  Cpu,
} from "lucide-react";
import {
  commonHashtags,
  materialTypes,
  materialGroups,
} from "../data/constants";
import type { MaterialFormData } from "../types/types";

interface MaterialBasicInfoStepProps {
  formData: MaterialFormData;
  paramHashtag: string;
  onParamHashtagChange: (value: string) => void;
  onFormFieldChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => void;
  onAddHashtag: () => void;
  onRemoveHashtag: (tag: string) => void;
}

export default function MaterialBasicInfoStep({
  formData,
  paramHashtag,
  onParamHashtagChange,
  onFormFieldChange,
  onAddHashtag,
  onRemoveHashtag,
}: MaterialBasicInfoStepProps) {
  const handleHashtagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAddHashtag();
    }
  };

  const toggleCommonHashtag = (tag: string) => {
    if ((formData.hashtags || []).includes(tag)) {
      onRemoveHashtag(tag);
      return;
    }

    onFormFieldChange("hashtags", [...(formData.hashtags || []), tag]);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6 lg:col-span-2">
        {/* Card: Common Info */}
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Hammer className="h-5 w-5 text-primary" />
            Thông tin chung
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Mã vật tư <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => onFormFieldChange("code", e.target.value)}
                placeholder="VD: VL001"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Tên vật tư <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                placeholder="Nhập tên vật tư..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Phân loại danh mục</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => onFormFieldChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại vật tư" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => onFormFieldChange("description", e.target.value)}
              placeholder="Mô tả đặc điểm, thông số kỹ thuật..."
              rows={3}
            />
          </div>
        </div>

        {/* Card: Classification Group */}
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Cpu className="h-5 w-5 text-primary" />
            Định danh nhóm / Phân loại vật tư khác
          </h3>

          <div className="space-y-2">
            <Label>Nhóm vật tư khác <span className="text-red-500">*</span></Label>
            <Select
              value={formData.materialGroupId || ""}
              onValueChange={(value) => onFormFieldChange("materialGroupId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm phân loại vật tư..." />
              </SelectTrigger>
              <SelectContent>
                {materialGroups.map((group) => (
                  <div key={group.category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border-y select-none">
                      {group.category}
                    </div>
                    {group.options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Phân loại vật tư khác theo mức độ công nghệ, khâu chuỗi giá trị, hoặc khía cạnh quản lý tài chính.
            </p>
          </div>
        </div>

        {/* Card: Hashtags */}
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Tags className="h-5 w-5 text-primary" />
            Hashtags
          </h3>

          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => onParamHashtagChange(e.target.value)}
                placeholder="Nhập hashtag..."
                onKeyDown={handleHashtagKeyDown}
              />
              <Button type="button" onClick={onAddHashtag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {commonHashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    (formData.hashtags || []).includes(tag)
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() => toggleCommonHashtag(tag)}
                >
                  #{tag}
                </Badge>
              ))}

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
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onRemoveHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ImageIcon className="h-5 w-5 text-primary" />
            Hình ảnh
          </h3>
          <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:bg-slate-50">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <p className="font-medium text-slate-900">Tải lên ảnh vật tư</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
