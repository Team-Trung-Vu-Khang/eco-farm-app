import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Sprout } from "lucide-react";
import { cropGroups, crops, varietiesByCrop } from "../utils/utils";
import type { CreateVarietyForm } from "../types/types";

interface SeedSelectionStepProps {
  formData: CreateVarietyForm;
  selectedCrop: string;
  selectedCropGroup: string;
  selectedVariety: string;
  setFormData: React.Dispatch<React.SetStateAction<CreateVarietyForm>>;
  setIllustrationPreview: (value: string) => void;
  setSelectedCrop: (value: string) => void;
  setSelectedCropGroup: (value: string) => void;
  setSelectedVariety: (value: string) => void;
}

export function SeedSelectionStep({
  selectedCrop,
  selectedCropGroup,
  selectedVariety,
  setFormData,
  setIllustrationPreview,
  setSelectedCrop,
  setSelectedCropGroup,
  setSelectedVariety,
}: SeedSelectionStepProps) {
  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
            1
          </span>
          <Label className="text-base font-semibold text-slate-800">
            Lựa chọn cây trồng
          </Label>
        </div>

        <div className="grid grid-cols-1 gap-8 pl-8 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-600">
              Nhóm cây trồng <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedCropGroup}
              onValueChange={(value) => {
                setSelectedCropGroup(value);
                setSelectedCrop("");
                setSelectedVariety("");
                setFormData((currentForm) => ({
                  ...currentForm,
                  cropGroup: value,
                  crop: "",
                  varietyName: "",
                  varietyCode: "",
                }));
              }}
            >
              <SelectTrigger className="h-11 bg-white border-slate-200 focus:ring-green-500">
                <SelectValue placeholder="-- Chọn nhóm cây --" />
              </SelectTrigger>
              <SelectContent>
                {cropGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-600">
              Cây trồng <span className="text-red-500">*</span>
            </Label>
            {!selectedCropGroup ? (
              <div className="flex h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                <p className="text-sm font-medium">
                  Vui lòng chọn nhóm cây trước
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {crops[selectedCropGroup]?.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => {
                      setSelectedCrop(crop.id);
                      setSelectedVariety("");
                      setFormData((currentForm) => ({
                        ...currentForm,
                        crop: crop.name,
                        varietyName: "",
                        varietyCode: "",
                      }));
                    }}
                    className={cn(
                      "group relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 bg-white p-2 transition-all hover:shadow-md",
                      selectedCrop === crop.id
                        ? "border-green-500 ring-2 ring-green-500/20"
                        : "border-slate-100 hover:border-green-200",
                    )}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {selectedCrop === crop.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-[1px]">
                          <div className="rounded-full bg-white p-1 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 fill-green-100 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-center text-sm font-bold text-slate-800">
                      {crop.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-6 border-t border-slate-100" />

      <div className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
            2
          </span>
          <Label className="text-base font-semibold text-slate-800">
            Chọn giống cây
          </Label>
        </div>

        <div className="pl-8">
          {!selectedCrop ? (
            <div className="flex h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 text-slate-400">
              <Sprout className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">
                Vui lòng chọn loại cây ở bước trên
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {varietiesByCrop[selectedCrop]?.map((variety) => (
                <div
                  key={variety.id}
                  onClick={() => {
                    setSelectedVariety(variety.id);
                    setFormData((currentForm) => ({
                      ...currentForm,
                      varietyName: variety.name,
                      varietyCode:
                        variety.code || `SEED-${variety.id.toUpperCase()}`,
                      illustration: null,
                    }));
                    if (variety.image) {
                      setIllustrationPreview(variety.image);
                    }
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col gap-3 rounded-xl border-2 bg-white p-4 transition-all hover:shadow-md",
                    selectedVariety === variety.id
                      ? "border-green-500 bg-green-50/10"
                      : "border-slate-100 hover:border-green-200",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                      {variety.image ? (
                        <img
                          src={variety.image}
                          alt={variety.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sprout className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    {selectedVariety === variety.id && (
                      <CheckCircle2 className="h-6 w-6 fill-green-100 text-green-600" />
                    )}
                  </div>

                  <div>
                    <p className="line-clamp-1 font-bold text-slate-900">
                      {variety.name}
                    </p>
                    <p className="mt-1 w-fit rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                      {variety.code || "---"}
                    </p>
                  </div>
                </div>
              ))}
              {(!varietiesByCrop[selectedCrop] ||
                varietiesByCrop[selectedCrop].length === 0) && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <p className="text-sm italic text-slate-500">
                    Chưa có dữ liệu giống cho cây này.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
