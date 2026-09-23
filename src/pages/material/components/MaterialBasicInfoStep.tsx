import type { KeyboardEvent } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  MultiSelect,
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
import { commonHashtags } from "../data/constants";
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
  const isEdit = window.location.pathname.includes("/edit");
  const [techSearch, setTechSearch] = useState("");
  const [chainSearch, setChainSearch] = useState("");
  const debouncedTechSearch = useDebounce(techSearch, 300);
  const debouncedChainSearch = useDebounce(chainSearch, 300);

  const { items: loadedTechLevels, loading: isLoadingTech } = useMasterData(
    "material-groups",
    {
      params: {
        classification: "technology_level",
        keyword: debouncedTechSearch.trim() || undefined,
        size: 50,
      },
    },
  );
  const { items: loadedValueChains, loading: isLoadingChain } = useMasterData(
    "material-groups",
    {
      params: {
        classification: "value_chain",
        keyword: debouncedChainSearch.trim() || undefined,
        size: 50,
      },
    },
  );

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

  const techOptions = loadedTechLevels.map((opt: any) => ({
    label: opt.name || opt.label,
    value: (opt.code || opt.id || opt.name || "").toLowerCase(),
  }));

  const valueChainOptions = loadedValueChains.map((opt: any) => ({
    label: opt.name || opt.label,
    value: (opt.code || opt.id || opt.name || "").toLowerCase(),
  }));

  const selectedTechLevels =
    formData.technologyLevelIds && formData.technologyLevelIds.length > 0
      ? formData.technologyLevelIds
      : formData.technologyLevelId
        ? [formData.technologyLevelId]
        : [];

  const selectedValueChains =
    formData.valueChainIds && formData.valueChainIds.length > 0
      ? formData.valueChainIds
      : formData.valueChainId
        ? [formData.valueChainId]
        : [];

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
              <Label>Mã vật tư</Label>
              <Input
                value={formData.code}
                disabled={isEdit}
                clearable={!isEdit}
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

          <div className="space-y-2">
            <Label>Mô tả</Label>
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
            Phân loại kỹ thuật vật tư khác
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Mức độ công nghệ <span className="text-red-500">*</span>
              </Label>
              <RemoteMultiSelect
                options={techOptions}
                value={selectedTechLevels}
                onChange={(values) => {
                  onFormFieldChange("technologyLevelIds", values);
                  onFormFieldChange("technologyLevelId", values[0] || "");
                  onFormFieldChange("materialGroupId", values[0] || "");
                }}
                onSearch={setTechSearch}
                placeholder="Chọn mức độ công nghệ (chọn nhiều)..."
                searchPlaceholder="Tìm mức độ công nghệ..."
                emptyText="Không tìm thấy mức độ công nghệ"
                loading={isLoadingTech}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Chuỗi giá trị <span className="text-red-500">*</span>
              </Label>
              <RemoteMultiSelect
                options={valueChainOptions}
                value={selectedValueChains}
                onChange={(values) => {
                  onFormFieldChange("valueChainIds", values);
                  onFormFieldChange("valueChainId", values[0] || "");
                }}
                onSearch={setChainSearch}
                placeholder="Chọn chuỗi giá trị (chọn nhiều)..."
                searchPlaceholder="Tìm chuỗi giá trị..."
                emptyText="Không tìm thấy chuỗi giá trị"
                loading={isLoadingChain}
              />
            </div>
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
          {formData.imageUrl ? (
            <div className="relative group w-full max-w-[240px] mx-auto">
              <img
                src={formData.imageUrl}
                alt="material"
                className="w-full rounded-xl border object-cover aspect-square"
              />
              <button
                type="button"
                onClick={() => {
                  onFormFieldChange("imageUrl", "");
                  onFormFieldChange("imageFile", null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:bg-slate-50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <p className="font-medium text-slate-900">Tải lên ảnh vật tư</p>
              <p className="mt-1 text-sm text-muted-foreground">
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
                  onFormFieldChange("imageUrl", url);
                  onFormFieldChange("imageFile", file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
