import { useState } from "react";
import {
  Check,
  Barcode,
  FlaskConical,
  Leaf,
  MapPin,
  Sprout,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Input,
  Label,
  cn,
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCrops } from "../../../features/foundation";
import { useFormContext } from "react-hook-form";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";

interface VarietyFoundationClassificationStepProps {
  isEdit?: boolean;
}

export function VarietyFoundationClassificationStep({
  isEdit,
}: VarietyFoundationClassificationStepProps) {
  const { control, watch, setValue } =
    useFormContext<VarietyFoundationFormValues>();
  const watchedCrop = watch("crop");
  const { items: apiCrops } = useCrops();
  const [startIndex, setStartIndex] = useState(0);

  const cropOptions = apiCrops.map((c) => ({
    id: String(c.id),
    name: c.name,
    image: c.imageUrl || "",
    group: c.cropGroupName || "N/A",
  }));

  // Group into columns of 2 items
  const columns = [];
  for (let i = 0; i < cropOptions.length; i += 2) {
    columns.push(cropOptions.slice(i, i + 2));
  }

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(columns.length - 5, prev + 1));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-6 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">
              Phân loại giống
            </h3>
            <p className="text-sm text-green-700/80">
              Chọn loài cây trồng để phân loại chính xác giống
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          Cây trồng <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="overflow-hidden py-2">
            <div
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(calc(-${startIndex} * (20% + 3.2px)))`,
              }}
            >
              {columns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className="flex-none w-[calc(20%-12.8px)] flex flex-col gap-4"
                >
                  {col.map((crop) => (
                    <div
                      key={crop.id}
                      onClick={() =>
                        setValue("crop", crop.id, { shouldValidate: true })
                      }
                      className={cn(
                        "group relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-md p-[5px]",
                        watchedCrop === crop.id
                          ? "border-green-600 ring-2 ring-green-600/20 bg-green-50/10"
                          : "border-transparent bg-slate-50 hover:bg-white hover:border-green-200",
                      )}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        {watchedCrop === crop.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-in zoom-in">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 p-2.5 text-white">
                          <p className="text-xs font-medium opacity-90 mb-0.5">
                            {crop.group}
                          </p>
                          <h4 className="font-bold text-sm leading-tight">
                            {crop.name}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 -left-7 -translate-y-1/2 z-10">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-full shadow-md bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              onClick={handlePrev}
              disabled={startIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute top-1/2 -right-7 -translate-y-1/2 z-10">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-full shadow-md bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              onClick={handleNext}
              disabled={startIndex >= columns.length - 5}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            <FormField
              control={control}
              name="varietyFoundationCode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Mã giống cây
                  </FormLabel>
                  <div className="relative group">
                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isEdit}
                        clearable={!isEdit}
                        placeholder={isEdit ? field.value : "Tự động sinh nếu để trống"}
                        className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="varietyFoundationName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Tên giống <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative group">
                    <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: Sầu riêng Ri6"
                        className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="scientificName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Tên khoa học
                  </FormLabel>
                  <div className="relative group">
                    <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: Durio zibethinus"
                        className="pl-10 italic font-serif border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="origin"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Nguồn gốc
                  </FormLabel>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: Việt Nam, Thái Lan..."
                        className="pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
