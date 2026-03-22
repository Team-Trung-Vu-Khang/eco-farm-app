import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, FlaskConical, Ruler, Thermometer } from "lucide-react";

import type { CreateCropForm } from "../../types/types";

interface TechnicalSpecsStepProps {
  formData: CreateCropForm;
  handleUpdateTechnicalSpecs: (updates: Partial<CreateCropForm["technicalSpecs"]>) => void;
}

export function TechnicalSpecsStep({
  formData,
  handleUpdateTechnicalSpecs,
}: TechnicalSpecsStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-cyan-200 bg-linear-to-r from-cyan-50 via-white to-cyan-50 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Thông số nông học</h3>
            <p className="text-sm text-slate-500">
              Thiết lập các tiêu chuẩn kỹ thuật và điều kiện canh tác lý tưởng
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tên khoa học</Label>
            <Input
              value={formData.technicalSpecs.scientificName}
              onChange={(e) => handleUpdateTechnicalSpecs({ scientificName: e.target.value })}
              placeholder="VD: Solanum lycopersicum"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Họ thực vật</Label>
            <Input
              value={formData.technicalSpecs.family}
              onChange={(e) => handleUpdateTechnicalSpecs({ family: e.target.value })}
              placeholder="VD: Solanaceae"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nguồn gốc</Label>
            <Input
              value={formData.technicalSpecs.origin}
              onChange={(e) => handleUpdateTechnicalSpecs({ origin: e.target.value })}
              placeholder="VD: Nam Mỹ"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Nhiệt độ (°C)
              </Label>
              <Input
                value={formData.technicalSpecs.tempRange}
                onChange={(e) => handleUpdateTechnicalSpecs({ tempRange: e.target.value })}
                placeholder="VD: 20 - 30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                Độ ẩm (%)
              </Label>
              <Input
                value={formData.technicalSpecs.humidityRange}
                onChange={(e) => handleUpdateTechnicalSpecs({ humidityRange: e.target.value })}
                placeholder="VD: 60 - 80"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-500" />
              Độ pH đất
            </Label>
            <Input
              value={formData.technicalSpecs.phRange}
              onChange={(e) => handleUpdateTechnicalSpecs({ phRange: e.target.value })}
              placeholder="VD: 5.5 - 6.5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-500" />
              Mật độ trồng
            </Label>
            <Input
              value={formData.technicalSpecs.plantingDensity}
              onChange={(e) => handleUpdateTechnicalSpecs({ plantingDensity: e.target.value })}
              placeholder="VD: 30cm x 50cm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
