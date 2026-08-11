import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImageIcon, Upload, Wrench } from "lucide-react";
import type { EquipmentFormData } from "../../types";

interface EquipmentBasicInfoStepProps {
  formData: EquipmentFormData;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
}

export const EquipmentBasicInfoStep = ({
  formData,
  updateField,
}: EquipmentBasicInfoStepProps) => {
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
                onChange={(e) => {
                  updateField("sku", e.target.value);
                  updateField("code", e.target.value); // Sync with legacy code field
                }}
                placeholder="VD: SKU-KUBOTA-L5018"
              />
              <p className="text-xs text-muted-foreground">Rất quan trọng để truy xuất nguồn gốc</p>
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
      </div>

      {/* Sidebar: Image Upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh sản phẩm
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-medium text-slate-900">Tải lên ảnh thiết bị</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hình ảnh thực tế của máy móc/thiết bị
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
