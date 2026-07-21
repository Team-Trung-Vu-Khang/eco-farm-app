import { useFormContext, Controller } from "react-hook-form";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, Fish, Layers3, Waves } from "lucide-react";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import {
  AQUACULTURE_FARMING_METHODS,
  AQUACULTURE_IRRIGATION_SYSTEMS,
  AQUACULTURE_SPECIES,
} from "../data/create-dummy";

export const ZoneConfigurationStep = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CultivationZoneFormValues>();

  const selectedSpeciesIds = watch("seedIds") ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-cyan-50/60 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Waves className="w-4 h-4 text-cyan-600" />
              </div>
              <span>Cấu hình nuôi trồng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <Controller
              control={control}
              name="farmingMethodId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Loại hình nuôi <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={field.value > 0 ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn loại hình nuôi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AQUACULTURE_FARMING_METHODS.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <span className="font-medium">{method.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.farmingMethodId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.farmingMethodId.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="irrigationSystemId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hệ thống cấp thoát nước <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={field.value > 0 ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn hệ thống..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AQUACULTURE_IRRIGATION_SYSTEMS.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-cyan-500" />
                            <span>{system.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.irrigationSystemId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.irrigationSystemId.message}
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-cyan-50/60 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Fish className="w-4 h-4 text-cyan-600" />
              </div>
              <span>Loài nuôi / con giống</span>
              {selectedSpeciesIds.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {selectedSpeciesIds.length} đã chọn
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col gap-3">
            <div className="grid gap-2">
              {AQUACULTURE_SPECIES.map((species) => {
                const isSelected = selectedSpeciesIds.includes(species.id);
                return (
                  <button
                    key={species.id}
                    type="button"
                    onClick={() =>
                      setValue(
                        "seedIds",
                        isSelected
                          ? selectedSpeciesIds.filter((id) => id !== species.id)
                          : [...selectedSpeciesIds, species.id],
                        { shouldValidate: true },
                      )
                    }
                    className={[
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={isSelected} />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800">
                          {species.varietyName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Dữ liệu con giống mẫu
                        </div>
                      </div>
                    </div>
                    <Layers3 className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
