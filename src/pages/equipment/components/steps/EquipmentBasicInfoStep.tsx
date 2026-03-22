import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImageIcon, Upload, Wrench } from "lucide-react";
import { equipmentTypes, maintenanceIntervals } from "../../data/constants";
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã thiết bị <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: TB001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên thiết bị <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nhập tên thiết bị..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại thiết bị</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => updateField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chu kỳ bảo dưỡng</Label>
              <Select
                value={formData.maintainanceInterval}
                onValueChange={(v) => updateField("maintainanceInterval", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chu kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceIntervals.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả kỹ thuật</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Thông số kỹ thuật, công suất, v.v..."
              rows={4}
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
            <p className="font-medium text-slate-900">Tải lên ảnh thiết bị</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
