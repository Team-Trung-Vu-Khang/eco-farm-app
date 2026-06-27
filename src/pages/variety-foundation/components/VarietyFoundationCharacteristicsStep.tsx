import { useEffect, useRef } from "react";
import { BookOpen, Calendar, CloudUpload, Scale, Trash } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Textarea,
  cn,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCrops } from "../../../features/foundation";
import { useFormContext } from "react-hook-form";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";

interface VarietyFoundationCharacteristicsStepProps {
  illustrationPreview: string;
  setIllustrationPreview: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickIllustration: (file?: File | null) => void;
}

export function VarietyFoundationCharacteristicsStep({
  illustrationPreview,
  setIllustrationPreview,
  fileInputRef,
  onPickIllustration,
}: VarietyFoundationCharacteristicsStepProps) {
  const { control, watch, setValue } =
    useFormContext<VarietyFoundationFormValues>();
  const watchedCrop = watch("crop");
  const watchedGrowthDuration = watch("growthDuration");
  const watchedDescription = watch("description");
  const watchedAverageYield = watch("averageYield");
  const processedCropRef = useRef<string>("");
  const { items: crops } = useCrops();

  useEffect(() => {
    if (watchedCrop && watchedCrop !== processedCropRef.current) {
      processedCropRef.current = watchedCrop;

      const selectedCrop = crops.find((c) => String(c.id) === watchedCrop);
      if (selectedCrop) {
        if (selectedCrop.technicalSpecs) {
          const specs = selectedCrop.technicalSpecs;
          const desc = [
            specs.scientificName ? `Tên khoa học: ${specs.scientificName}` : "",
            specs.family ? `Họ: ${specs.family}` : "",
            specs.origin ? `Nguồn gốc: ${specs.origin}` : "",
            specs.temperatureFrom || specs.temperatureTo
              ? `Nhiệt độ: ${specs.temperatureFrom ?? "?"} - ${specs.temperatureTo ?? "?"}°C`
              : "",
            specs.humidityFrom || specs.humidityTo
              ? `Độ ẩm: ${specs.humidityFrom ?? "?"} - ${specs.humidityTo ?? "?"}%`
              : "",
            specs.phFrom || specs.phTo
              ? `Độ pH: ${specs.phFrom ?? "?"} - ${specs.phTo ?? "?"}`
              : "",
            specs.plantingDensity
              ? `Mật độ trồng: ${specs.plantingDensity}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");
          setValue("description", desc, { shouldValidate: true });
        }

        if (!illustrationPreview && selectedCrop.imageUrl) {
          setIllustrationPreview(selectedCrop.imageUrl);
        }
      }
    }
  }, [
    watchedCrop,
    crops,
    watchedDescription,
    watchedAverageYield,
    watchedGrowthDuration,
    illustrationPreview,
    setIllustrationPreview,
    setValue,
  ]);

  const getGrowthDurationParts = () => {
    const duration = watchedGrowthDuration || "";
    const yearMatch = duration.match(/(\d+)\s*năm/);
    const monthMatch = duration.match(/(\d+)\s*tháng/);
    const dayMatch = duration.match(/(\d+)\s*ngày/);

    return {
      years: yearMatch ? yearMatch[1] : "",
      months: monthMatch ? monthMatch[1] : "",
      days: dayMatch ? dayMatch[1] : "",
    };
  };

  const { years, months, days } = getGrowthDurationParts();

  const handleGrowthDurationChange = (
    type: "years" | "months" | "days",
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    const newParts = { years, months, days, [type]: cleanValue };
    const parts = [];
    if (newParts.years && parseInt(newParts.years) > 0)
      parts.push(`${newParts.years} năm`);
    if (newParts.months && parseInt(newParts.months) > 0)
      parts.push(`${newParts.months} tháng`);
    if (newParts.days && parseInt(newParts.days) > 0)
      parts.push(`${newParts.days} ngày`);

    setValue("growthDuration", parts.join(" "), { shouldValidate: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-amber-50 p-6 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">
              Đặc điểm nông học
            </h3>
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
                      setValue("illustration", null, { shouldValidate: true });
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
            <FormField
              control={control}
              name="growthDuration"
              render={() => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Thời gian sinh trưởng
                  </FormLabel>
                  <div className="relative flex items-center h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20 group">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-amber-600 transition-colors shrink-0" />
                    <div className="flex items-center gap-1 flex-1 justify-around">
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={years}
                          onChange={(e) =>
                            handleGrowthDurationChange("years", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          năm
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={months}
                          onChange={(e) =>
                            handleGrowthDurationChange("months", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          tháng
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={days}
                          onChange={(e) =>
                            handleGrowthDurationChange("days", e.target.value)
                          }
                          className="w-10 outline-none text-center bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-500 text-xs shrink-0">
                          ngày
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Thời gian từ khi trồng đến khi thu hoạch lần đầu
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="averageYield"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Năng suất bình quân
                  </FormLabel>
                  <div className="relative group">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: 15 - 20"
                        className="pl-10 pr-16"
                      />
                    </FormControl>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      tấn/ha
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Năng suất trung bình trong điều kiện chuẩn
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Mô tả đặc tính
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mô tả chi tiết về hình thái lá, hoa, quả, khả năng chống chịu sâu bệnh và điều kiện thích nghi..."
                    rows={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
