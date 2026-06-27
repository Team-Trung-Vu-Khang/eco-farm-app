import {
  Input,
  Label,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, FlaskConical, Ruler, Thermometer } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CropFoundationFormValues } from "../../schemas/cropFoundationSchema";

const RangeInput = ({
  value,
  onChange,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  placeholder1 = "Từ",
  placeholder2 = "Đến",
}: {
  value?: string;
  onChange?: (v: string) => void;
  fromValue?: number | string | null;
  toValue?: number | string | null;
  onFromChange?: (v: number | string) => void;
  onToChange?: (v: number | string) => void;
  placeholder1?: string;
  placeholder2?: string;
}) => {
  const isStringMode = value !== undefined;

  const parts = isStringMode ? (value || "").split(" - ") : [];
  const displayFrom = isStringMode ? parts[0] || "" : (fromValue ?? "");
  const displayTo = isStringMode
    ? parts.length > 1
      ? parts[1]
      : ""
    : (toValue ?? "");

  const handleFromChange = (newFrom: string) => {
    if (isStringMode && onChange) {
      onChange(newFrom || displayTo ? `${newFrom} - ${displayTo}` : "");
    } else if (onFromChange) {
      onFromChange(newFrom !== "" ? Number(newFrom) : "");
    }
  };

  const handleToChange = (newTo: string) => {
    if (isStringMode && onChange) {
      onChange(displayFrom || newTo ? `${displayFrom} - ${newTo}` : "");
    } else if (onToChange) {
      onToChange(newTo !== "" ? Number(newTo) : "");
    }
  };

  return (
    <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-visible:ring-ring focus-visible:ring-1">
      <input
        type="number"
        className="flex-1 bg-transparent outline-none focus:outline-none min-w-0 p-0 placeholder:text-muted-foreground border-0 focus:ring-0 focus:border-transparent"
        placeholder={placeholder1}
        value={displayFrom}
        onChange={(e) => handleFromChange(e.target.value)}
      />
      <span className="text-muted-foreground mx-2">-</span>
      <input
        type="number"
        className="flex-1 bg-transparent outline-none focus:outline-none min-w-0 p-0 placeholder:text-muted-foreground text-right border-0 focus:ring-0 focus:border-transparent"
        placeholder={placeholder2}
        value={displayTo}
        onChange={(e) => handleToChange(e.target.value)}
      />
    </div>
  );
};

export function TechnicalSpecsStep() {
  const { control } = useFormContext<CropFoundationFormValues>();

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
          <FormField
            control={control}
            name="technicalSpecs.scientificName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Tên khoa học
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: Solanum lycopersicum" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="technicalSpecs.family"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Họ thực vật
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: Solanaceae" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="technicalSpecs.origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Nguồn gốc
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: Nam Mỹ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Nhiệt độ (°C)
              </Label>
              <FormField
                control={control}
                name="technicalSpecs.temperatureFrom"
                render={({ field: fromField }) => (
                  <FormItem>
                    <FormField
                      control={control}
                      name="technicalSpecs.temperatureTo"
                      render={({ field: toField }) => (
                        <FormItem>
                          <RangeInput
                            fromValue={fromField.value}
                            toValue={toField.value}
                            onFromChange={fromField.onChange}
                            onToChange={toField.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                Độ ẩm (%)
              </Label>
              <FormField
                control={control}
                name="technicalSpecs.humidityFrom"
                render={({ field: fromField }) => (
                  <FormItem>
                    <FormField
                      control={control}
                      name="technicalSpecs.humidityTo"
                      render={({ field: toField }) => (
                        <FormItem>
                          <RangeInput
                            fromValue={fromField.value}
                            toValue={toField.value}
                            onFromChange={fromField.onChange}
                            onToChange={toField.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-purple-500" />
              Độ pH đất
            </Label>
            <FormField
              control={control}
              name="technicalSpecs.phFrom"
              render={({ field: fromField }) => (
                <FormItem>
                  <FormField
                    control={control}
                    name="technicalSpecs.phTo"
                    render={({ field: toField }) => (
                      <FormItem>
                        <RangeInput
                          fromValue={fromField.value}
                          toValue={toField.value}
                          onFromChange={fromField.onChange}
                          onToChange={toField.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="technicalSpecs.plantingDensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <Ruler className="w-4 h-4 text-amber-500" />
                  Mật độ trồng
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: 30cm x 50cm" />
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
