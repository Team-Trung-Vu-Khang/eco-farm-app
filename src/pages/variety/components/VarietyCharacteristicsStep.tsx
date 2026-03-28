import {
  BookOpen,
  Calendar,
  CloudUpload,
  Scale,
  Trash,
} from "lucide-react";
import { Button, Input, Label, Textarea, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CreateVarietyForm } from "../types/types";

interface VarietyCharacteristicsStepProps {
  formData: CreateVarietyForm;
  updateField: <K extends keyof CreateVarietyForm>(
    key: K,
    value: CreateVarietyForm[K],
  ) => void;
  illustrationPreview: string;
  setIllustrationPreview: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickIllustration: (file?: File | null) => void;
}

export function VarietyCharacteristicsStep({
  formData,
  updateField,
  illustrationPreview,
  setIllustrationPreview,
  fileInputRef,
  onPickIllustration,
}: VarietyCharacteristicsStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-amber-50 p-6 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Đặc điểm nông học</h3>
            <p className="text-sm text-amber-700/80">
              Cung cấp các thông tin chi tiết về đặc tính và hình ảnh giống
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <div className="w-full space-y-4">
          <Label className="text-sm font-semibold text-slate-700">
            Hình ảnh nhận diện
          </Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed aspect-square transition-all duration-300 cursor-pointer overflow-hidden bg-white hover:bg-amber-50/50 h-72 w-full",
              illustrationPreview
                ? "border-amber-500/20"
                : "border-slate-200 hover:border-amber-500/50",
            )}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(event) => onPickIllustration(event.target.files?.[0])}
            />
            {illustrationPreview ? (
              <div className="relative h-full w-full">
                <img
                  src={illustrationPreview}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-full shadow-lg"
                    onClick={(event) => {
                      event.stopPropagation();
                      updateField("illustration", null);
                      setIllustrationPreview("");
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" /> Xóa ảnh
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-transform group-hover:scale-110 shadow-sm border border-amber-200">
                  <CloudUpload className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-sm text-slate-700">
                    Tải ảnh minh họa
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    Tối đa 5MB • JPG/PNG
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Thời gian sinh trưởng
              </Label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                <Input
                  value={formData.growthDuration}
                  onChange={(event) =>
                    updateField("growthDuration", event.target.value)
                  }
                  placeholder="VD: 3 - 4"
                  className="pl-10 pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  năm
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Thời gian từ khi trồng đến khi thu hoạch lần đầu
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Năng suất bình quân
              </Label>
              <div className="relative group">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                <Input
                  value={formData.averageYield}
                  onChange={(event) =>
                    updateField("averageYield", event.target.value)
                  }
                  placeholder="VD: 15 - 20"
                  className="pl-10 pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  tấn/ha
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Năng suất trung bình trong điều kiện chuẩn
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Mô tả đặc tính
            </Label>
            <Textarea
              value={formData.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Mô tả chi tiết về hình thái lá, hoa, quả, khả năng chống chịu sâu bệnh và điều kiện thích nghi..."
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
