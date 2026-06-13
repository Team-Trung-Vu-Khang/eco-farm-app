import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, FlaskConical, Ruler, Thermometer } from "lucide-react";

import type { CreateCropFoundationForm } from "../../types/types";

interface TechnicalSpecsStepProps {
  formData: CreateCropFoundationForm;
  handleUpdateTechnicalSpecs: (
    updates: Partial<CreateCropFoundationForm["technicalSpecs"]>,
  ) => void;
}

const RangeInput = ({
  value = "",
  onChange,
  placeholder1 = "Từ",
  placeholder2 = "Đến",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder1?: string;
  placeholder2?: string;
}) => {
  const parts = value.split(" - ");
  const from = parts[0] || "";
  const to = parts.length > 1 ? parts[1] : "";

  return (
    <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-visible:ring-ring focus-visible:ring-1">
      <input
        type="number"
        className="flex-1 bg-transparent outline-none focus:outline-none min-w-0 p-0 placeholder:text-muted-foreground border-0 focus:ring-0 focus:border-transparent"
        placeholder={placeholder1}
        value={from}
        onChange={(e) => {
          const newFrom = e.target.value;
          onChange(newFrom || to ? `${newFrom} - ${to}` : "");
        }}
      />
      <span className="text-muted-foreground mx-2">-</span>
      <input
        type="number"
        className="flex-1 bg-transparent outline-none focus:outline-none min-w-0 p-0 placeholder:text-muted-foreground text-right border-0 focus:ring-0 focus:border-transparent"
        placeholder={placeholder2}
        value={to}
        onChange={(e) => {
          const newTo = e.target.value;
          onChange(from || newTo ? `${from} - ${newTo}` : "");
        }}
      />
    </div>
  );
};

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
            <h3 className="text-lg font-bold text-slate-900">
              Thông số nông học
            </h3>
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
              onChange={(e) =>
                handleUpdateTechnicalSpecs({ scientificName: e.target.value })
              }
              placeholder="VD: Solanum lycopersicum"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Họ thực vật</Label>
            <Input
              value={formData.technicalSpecs.family}
              onChange={(e) =>
                handleUpdateTechnicalSpecs({ family: e.target.value })
              }
              placeholder="VD: Solanaceae"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nguồn gốc</Label>
            <Input
              value={formData.technicalSpecs.origin}
              onChange={(e) =>
                handleUpdateTechnicalSpecs({ origin: e.target.value })
              }
              placeholder="VD: Nam Mỹ"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Nhiệt độ (°C)
              </Label>
              <RangeInput
                value={formData.technicalSpecs.tempRange}
                onChange={(val) =>
                  handleUpdateTechnicalSpecs({ tempRange: val })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                Độ ẩm (%)
              </Label>
              <RangeInput
                value={formData.technicalSpecs.humidityRange}
                onChange={(val) =>
                  handleUpdateTechnicalSpecs({ humidityRange: val })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-purple-500" />
              Độ pH đất
            </Label>
            <RangeInput
              value={formData.technicalSpecs.phRange}
              onChange={(val) => handleUpdateTechnicalSpecs({ phRange: val })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
              <Ruler className="w-4 h-4 text-amber-500" />
              Mật độ trồng
            </Label>
            <Input
              value={formData.technicalSpecs.plantingDensity}
              onChange={(e) =>
                handleUpdateTechnicalSpecs({ plantingDensity: e.target.value })
              }
              placeholder="VD: 30cm x 50cm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
