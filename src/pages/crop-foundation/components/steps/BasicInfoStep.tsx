import { useCatalog } from "../../../../features/foundation";
import {
  Combobox,
  Input,
  Label,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image as ImageIcon, Leaf } from "lucide-react";
import type { RefObject } from "react";

import type { CreateCropFoundationForm } from "../../types/types";

interface BasicInfoStepProps {
  formData: CreateCropFoundationForm;
  handleUpdateField: (
    field: keyof CreateCropFoundationForm,
    value: any,
  ) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  illustrationPreview: string | null;
}

export function BasicInfoStep({
  formData,
  handleUpdateField,
  fileInputRef,
  illustrationPreview,
}: BasicInfoStepProps) {
  const { items: groupCrops } = useCatalog("crop-groups");

  const groupCropOptions = groupCrops.map((g) => ({
    value: String(g.id),
    label: g.name,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Thông tin cơ bản
            </h3>
            <p className="text-sm text-slate-500">
              Thiết lập các thông tin định danh và phân loại cho giống cây trồng
              mới
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mã *</Label>
              <Input
                value={formData.code}
                onChange={(e) => handleUpdateField("code", e.target.value)}
                placeholder="VD: TREE-7867"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tên cây *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleUpdateField("name", e.target.value)}
                placeholder="Nhập tên cây trồng"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Nhóm cây trồng *</Label>
              <Combobox
                options={groupCropOptions}
                placeholder="Chọn nhóm..."
                value={formData.cropGroupId ?? ""}
                onChange={(v) => handleUpdateField("cropGroupId", v)}
              />
            </div>

            {/* <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Phương pháp thu hoạch *
              </Label>
              <Select
                value={formData.harvestMethod}
                onValueChange={(v) => handleUpdateField("harvestMethod", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương pháp" />
                </SelectTrigger>
                <SelectContent>
                  {harvestMethodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Mô tả</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleUpdateField("description", e.target.value)}
              placeholder="Nhập mô tả về cây trồng"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Ảnh cây trồng</Label>
            <div
              className={cn(
                "relative group w-full aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-green-500/50 hover:bg-muted/50 overflow-hidden",
                illustrationPreview && "border-none",
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {illustrationPreview ? (
                <img
                  src={illustrationPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Kéo thả ảnh tại đây
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  handleUpdateField("illustration", e.target.files?.[0])
                }
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
