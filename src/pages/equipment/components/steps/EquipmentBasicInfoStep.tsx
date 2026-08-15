import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImageIcon, Upload, Wrench, Tags, Plus, X } from "lucide-react";
import type { EquipmentFormData } from "../../types";

interface EquipmentBasicInfoStepProps {
  formData: EquipmentFormData;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
}

const commonHashtags = [
  "CoGioiHoa",
  "TietKiemNangLuong",
  "CongNgheMoi",
  "BenBi",
  "HieuSuatCao",
  "AnToanVanHanh",
];

export const EquipmentBasicInfoStep = ({
  formData,
  updateField,
}: EquipmentBasicInfoStepProps) => {
  const isEdit = window.location.pathname.includes("/edit");
  const [paramHashtag, setParamHashtag] = useState("");

  const onAddHashtag = () => {
    const trimmed = paramHashtag.trim().replace(/^#/, "");
    const current = formData.hashtags || [];
    if (trimmed && !current.includes(trimmed)) {
      updateField("hashtags", [...current, trimmed]);
    }
    setParamHashtag("");
  };

  const onRemoveHashtag = (tag: string) => {
    const current = formData.hashtags || [];
    updateField(
      "hashtags",
      current.filter((t) => t !== tag),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Identification & Classification */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Thông tin định danh & Phân loại
          </h3>

          {/* SKU & Machine Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Mã sản phẩm / Mã SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.sku}
                disabled={isEdit}
                clearable={!isEdit}
                onChange={(e) => {
                  updateField("sku", e.target.value);
                  updateField("code", e.target.value); // Sync with legacy code field
                }}
                placeholder="VD: SKU-KUBOTA-L5018"
              />
              <p className="text-xs text-muted-foreground">
                Rất quan trọng để truy xuất nguồn gốc
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Tên máy móc / thiết bị <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.machineName}
                onChange={(e) => {
                  updateField("machineName", e.target.value);
                  updateField("name", e.target.value); // Sync with legacy name field
                }}
                placeholder="VD: Máy cày Kubota L5018"
              />
            </div>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label>Model / Kiểu máy</Label>
            <Input
              value={formData.model}
              onChange={(e) => updateField("model", e.target.value)}
              placeholder="VD: L5018VN, Agras T40..."
            />
          </div>

          {/* Manufacturer & Country of Origin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hãng sản xuất</Label>
              <Input
                value={formData.manufacturer}
                onChange={(e) => updateField("manufacturer", e.target.value)}
                placeholder="VD: Kubota, DJI, Netafim..."
              />
            </div>
            <div className="space-y-2">
              <Label>Nước sản xuất</Label>
              <Input
                value={formData.countryOfOrigin}
                onChange={(e) => updateField("countryOfOrigin", e.target.value)}
                placeholder="VD: Nhật Bản, Trung Quốc, Israel..."
              />
            </div>
          </div>

          {/* Manufacture Year */}
          <div className="space-y-2">
            <Label>Năm sản xuất</Label>
            <Input
              type="number"
              value={formData.manufactureYear}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                updateField("manufactureYear", val);
              }}
              placeholder="VD: 2022, 2023..."
              min={1900}
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        {/* Card: Ghi chú & Hashtags */}
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
            <div className="flex flex-wrap gap-1.5 pt-2">
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

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Ghi chú về thiết bị hoặc lưu ý vận hành..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Sidebar: Image Upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh sản phẩm
          </h3>
          {formData.productImage ? (
            <div className="relative group w-full max-w-[240px] mx-auto">
              <img
                src={formData.productImage}
                alt="equipment"
                className="w-full rounded-xl border object-cover aspect-square"
              />
              <button
                type="button"
                onClick={() => {
                  updateField("productImage", "");
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
              <p className="font-medium text-slate-900">Tải lên ảnh thiết bị</p>
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
                  updateField("productImage", url);
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
