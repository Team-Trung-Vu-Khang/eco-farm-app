import {
  Label,
  Combobox,
  cn,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Sprout } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useCatalog, useCrops, useCropVarieties } from "@/features/foundation";
import type { CreateSeedFormValues } from "../schemas/createSeedSchema";

export function SeedSelectionStep() {
  const { watch, setValue, control } = useFormContext<CreateSeedFormValues>();
  const selectedCrop = watch("cropId");
  const selectedCropGroup = watch("cropGroupId");

  const { items: cropGroups } = useCatalog("crop-groups");
  const { items: allCrops } = useCrops({ enabled: !!selectedCropGroup });
  const filteredCrops = allCrops.filter(
    (c) => c.cropGroupId === Number(selectedCropGroup),
  );

  const { items: varieties } = useCropVarieties({
    params: { cropId: Number(selectedCrop) },
    enabled: !!selectedCrop,
  });

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
          <FormField
            control={control}
            name="cropGroupId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-600">
                  Nhóm cây trồng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={cropGroups.map((group) => ({
                      value: String(group.id),
                      label: group.name,
                    }))}
                    placeholder="-- Chọn nhóm cây --"
                    value={field.value}
                    onChange={(value) => {
                      const safeValue = value ?? "";
                      field.onChange(safeValue);
                      setValue("cropId", "");
                      setValue("cropVarietyId", "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cropId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-600">
                  Cây trồng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  {!selectedCropGroup ? (
                    <div className="flex h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                      <p className="text-sm font-medium">
                        Vui lòng chọn nhóm cây trước
                      </p>
                    </div>
                  ) : filteredCrops.length === 0 ? (
                    <div className="flex h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                      <p className="text-sm font-medium">
                        Không tìm thấy cây trồng nào trong nhóm này
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {filteredCrops.map((crop) => (
                        <div
                          key={crop.id}
                          onClick={() => {
                            field.onChange(String(crop.id));
                            setValue("cropName", crop.name);
                            setValue("cropVarietyId", "");
                            setValue("varietyName", "");
                            setValue("varietyCode", "");
                          }}
                          className={cn(
                            "group relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 bg-white p-2 transition-all hover:shadow-md",
                            field.value === String(crop.id)
                              ? "border-green-500 ring-2 ring-green-500/20"
                              : "border-slate-100 hover:border-green-200",
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                            {crop.imageUrl ? (
                              <img
                                src={crop.imageUrl}
                                alt={crop.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Sprout className="h-10 w-10 text-slate-300" />
                              </div>
                            )}
                            {field.value === String(crop.id) && (
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={control}
            name="cropVarietyId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {!selectedCrop ? (
                    <div className="flex h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 text-slate-400">
                      <Sprout className="h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium">
                        Vui lòng chọn loại cây ở bước trên
                      </p>
                    </div>
                  ) : varieties.length === 0 ? (
                    <div className="flex h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 text-slate-400">
                      <Sprout className="h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium">
                        Không tìm thấy giống nào cho cây trồng này
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {varieties.map((variety) => {
                        const varietyImageUrl =
                          (variety as any).imageUrl ||
                          variety.metadataJson?.illustrationUrl;

                        return (
                          <div
                            key={variety.id}
                            onClick={() => {
                              field.onChange(String(variety.id));
                              setValue("varietyName", variety.name);
                              setValue(
                                "varietyCode",
                                variety.code ||
                                  `SEED-${String(variety.id).toUpperCase()}`,
                              );
                              setValue(
                                "avgYieldFrom",
                                variety.avgYieldFrom ?? null,
                              );
                              setValue(
                                "avgYieldTo",
                                variety.avgYieldTo ?? null,
                              );

                              setValue("illustration", null);
                              if (varietyImageUrl) {
                                setValue(
                                  "baseIllustrationUrl",
                                  varietyImageUrl as string,
                                );
                              } else {
                                setValue("baseIllustrationUrl", "");
                              }
                            }}
                            className={cn(
                              "flex cursor-pointer flex-col gap-3 rounded-xl border-2 bg-white p-4 transition-all hover:shadow-md",
                              field.value === String(variety.id)
                                ? "border-green-500 bg-green-50/10"
                                : "border-slate-100 hover:border-green-200",
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                                {varietyImageUrl ? (
                                  <img
                                    src={varietyImageUrl as string}
                                    alt={variety.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Sprout className="h-6 w-6 text-slate-300" />
                                  </div>
                                )}
                              </div>
                              {field.value === String(variety.id) && (
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
                        );
                      })}
                    </div>
                  )}
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
