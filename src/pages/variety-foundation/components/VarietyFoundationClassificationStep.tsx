import { useState } from "react";
import {
  Barcode,
  FlaskConical,
  Leaf,
  MapPin,
  Sprout,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  Input,
  cn,
  Button,
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";
import {
  CropSelectorDialog,
  type SelectedCropItem,
} from "./CropSelectorDialog";

interface VarietyFoundationClassificationStepProps {
  isEdit?: boolean;
}

export function VarietyFoundationClassificationStep({
  isEdit,
}: VarietyFoundationClassificationStepProps) {
  const { control, watch, setValue } =
    useFormContext<VarietyFoundationFormValues>();
  const watchedCrop = watch("crop");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<SelectedCropItem | null>(
    null,
  );

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

      <div className="space-y-6">
        <FormField
          control={control}
          name="crop"
          render={({ fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-bold text-slate-700 flex items-center justify-between">
                <span>
                  Cây trồng <span className="text-red-500">*</span>
                </span>
                {selectedCrop && (
                  <span className="text-xs font-normal text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn
                  </span>
                )}
              </FormLabel>

              <div
                onClick={() => setIsDialogOpen(true)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md",
                  selectedCrop
                    ? "border-green-500 bg-green-50/20 hover:border-green-600 hover:bg-green-50/40"
                    : "border-dashed border-slate-300 bg-slate-50/50 hover:border-green-400 hover:bg-white",
                  fieldState.error && "border-red-500 bg-red-50/10",
                )}
              >
                {selectedCrop ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                        {selectedCrop.image ? (
                          <img
                            src={selectedCrop.image}
                            alt={selectedCrop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                            <Leaf className="w-7 h-7" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-base truncate">
                            {selectedCrop.name}
                          </h4>
                          {selectedCrop.group && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 border-none font-normal shrink-0 text-xs"
                            >
                              {selectedCrop.group}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Mã cây trồng:{" "}
                          <span className="font-mono text-slate-700">
                            {selectedCrop.code || `ID-${selectedCrop.id}`}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-green-200 text-green-700 hover:bg-green-100/50 hover:text-green-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDialogOpen(true);
                      }}
                    >
                      Thay đổi
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-2 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100/60 text-green-600 flex items-center justify-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Nhấn để chọn cây trồng
                        </p>
                        <p className="text-xs text-slate-500">
                          Tìm kiếm theo tên, nhóm cây trồng...
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white shadow-xs"
                    >
                      Chọn cây trồng
                    </Button>
                  </div>
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <CropSelectorDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedId={watchedCrop ? String(watchedCrop) : undefined}
          onConfirm={(crop) => {
            setValue("crop", crop.id, { shouldValidate: true });
            setSelectedCrop(crop);
          }}
        />

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
                      placeholder={
                        isEdit ? field.value : "Tự động sinh nếu để trống"
                      }
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
  );
}
