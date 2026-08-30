import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FlaskConical, Loader2, Save } from "lucide-react";
import React, { useEffect } from "react";
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
} from "react-hook-form";
import { z } from "zod";
import type { SoilData } from "../types/types";

const soilFormSchema = z.object({
  ph: z.coerce
    .number({ error: "Phải là số" })
    .min(0, "Từ 0")
    .max(14, "Tối đa 14"),
  moisture: z.coerce
    .number({ error: "Phải là số" })
    .min(0, "Từ 0")
    .max(100, "Tối đa 100"),
  nitrogen: z.coerce.number({ error: "Phải là số" }).min(0, "Không được âm"),
  phosphorus: z.coerce.number({ error: "Phải là số" }).min(0, "Không được âm"),
  potassium: z.coerce.number({ error: "Phải là số" }).min(0, "Không được âm"),
  organicMatter: z.coerce
    .number({ error: "Phải là số" })
    .min(0, "Từ 0")
    .max(100, "Tối đa 100"),
  temperature: z.coerce.number({ error: "Phải là số" }),
  compaction: z.coerce.number({ error: "Phải là số" }).min(0, "Không được âm"),
});

type SoilFormInput = z.input<typeof soilFormSchema>;
type SoilFormOutput = z.output<typeof soilFormSchema>;

const DEFAULT_VALUES: SoilFormInput = {
  ph: 0,
  moisture: 0,
  nitrogen: 0,
  phosphorus: 0,
  potassium: 0,
  organicMatter: 0,
  temperature: 0,
  compaction: 0,
};

interface SoilEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempSoil: SoilData | null;
  onSave: (data: SoilData) => void;
  isSaving?: boolean;
}

interface SoilNumberFieldProps {
  control: Control<SoilFormInput, unknown, SoilFormOutput>;
  name: FieldPath<SoilFormInput>;
  label: string;
  placeholder?: string;
  center?: boolean;
}

const SoilNumberField: React.FC<SoilNumberFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  center = false,
}) => (
  <div className="space-y-1.5">
    {label && (
      <Label className="text-xs font-bold uppercase text-slate-500">
        {label}
      </Label>
    )}
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <Input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={placeholder}
            className={center ? "h-9 text-center" : "bg-slate-50/50"}
            value={(field.value as string | number | undefined) ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
          />
          {fieldState.error?.message && fieldState.error.message !== "0" && (
            <p className="text-xs text-red-500">{fieldState.error.message}</p>
          )}
        </>
      )}
    />
  </div>
);

export const SoilEditDialog: React.FC<SoilEditDialogProps> = ({
  isOpen,
  onOpenChange,
  tempSoil,
  onSave,
  isSaving = false,
}) => {
  const form = useForm<SoilFormInput, unknown, SoilFormOutput>({
    resolver: zodResolver(soilFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        tempSoil ? { ...DEFAULT_VALUES, ...tempSoil } : DEFAULT_VALUES,
      );
    }
  }, [isOpen, tempSoil, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSave({
      ...values,
      lastTested: new Date().toISOString().split("T")[0],
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[1200] sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Cập nhật chỉ số thổ nhưỡng
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <SoilNumberField
              control={form.control}
              name="ph"
              label="Độ pH"
              placeholder="Ví dụ: 6.5"
            />
            <SoilNumberField
              control={form.control}
              name="moisture"
              label="Độ ẩm (%)"
              placeholder="Ví dụ: 70"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Chỉ số NPK (mg/kg)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-red-500 px-1 border border-red-100 rounded bg-red-50/50">
                  N
                </div>
                <SoilNumberField
                  control={form.control}
                  name="nitrogen"
                  label=""
                  center
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-blue-500 px-1 border border-blue-100 rounded bg-blue-50/50">
                  P
                </div>
                <SoilNumberField
                  control={form.control}
                  name="phosphorus"
                  label=""
                  center
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-orange-500 px-1 border border-orange-100 rounded bg-orange-50/50">
                  K
                </div>
                <SoilNumberField
                  control={form.control}
                  name="potassium"
                  label=""
                  center
                />
              </div>
            </div>
          </div>

          <div>
            <SoilNumberField
              control={form.control}
              name="organicMatter"
              label="Hữu cơ (%)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SoilNumberField
              control={form.control}
              name="temperature"
              label="Nhiệt độ (°C)"
            />
            <SoilNumberField
              control={form.control}
              name="compaction"
              label="Độ nén (psi)"
            />
          </div>
        </form>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="flex-1 sm:flex-none"
          >
            Hủy bỏ
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Lưu thông tin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
