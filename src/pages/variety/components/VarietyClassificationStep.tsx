import { Check, Barcode, FlaskConical, Leaf, MapPin, Sprout } from "lucide-react";
import { Input, Label, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CROP_OPTIONS } from "../../../constants/crops";
import type { CreateVarietyForm } from "../types/types";

interface VarietyClassificationStepProps {
  formData: CreateVarietyForm;
  updateField: <K extends keyof CreateVarietyForm>(
    key: K,
    value: CreateVarietyForm[K],
  ) => void;
}

export function VarietyClassificationStep({
  formData,
  updateField,
}: VarietyClassificationStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-6 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">Phân loại giống</h3>
            <p className="text-sm text-green-700/80">
              Chọn loài cây trồng để phân loại chính xác giống
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          Loại cây trồng <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CROP_OPTIONS.map((crop) => (
            <div
              key={crop.id}
              onClick={() => updateField("crop", crop.name)}
              className={cn(
                "group relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-md",
                formData.crop === crop.name
                  ? "border-green-600 ring-2 ring-green-600/20 bg-green-50/10"
                  : "border-transparent bg-slate-50 hover:bg-white hover:border-green-200",
              )}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                {formData.crop === crop.name && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-in zoom-in">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <p className="text-xs font-medium opacity-90 mb-0.5">
                    {crop.group}
                  </p>
                  <h4 className="font-bold text-sm">{crop.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">
            Mã giống <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <Input
              value={formData.varietyCode}
              onChange={(event) => updateField("varietyCode", event.target.value)}
              placeholder="VD: VAR-SR6"
              className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">
            Tên giống <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <Input
              value={formData.varietyName}
              onChange={(event) => updateField("varietyName", event.target.value)}
              placeholder="VD: Sầu riêng Ri6"
              className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">
            Tên khoa học
          </Label>
          <div className="relative group">
            <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <Input
              value={formData.scientificName}
              onChange={(event) =>
                updateField("scientificName", event.target.value)
              }
              placeholder="VD: Durio zibethinus"
              className="pl-10 italic font-serif border-slate-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">
            Nguồn gốc/Xuất xứ
          </Label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <Input
              value={formData.origin}
              onChange={(event) => updateField("origin", event.target.value)}
              placeholder="VD: Viện Cây ăn quả Miền Nam"
              className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
