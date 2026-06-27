import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { PesticideToxicityClassRecord } from "@/features/master-data/types/master-data.type";
import {
  PESTICIDE_TOXICITY_FORM_STATUSES,
  PESTICIDE_WHO_GROUP_OPTIONS,
  pesticideToxicityFormSchema,
  type PesticideToxicityFormInput,
  type PesticideToxicityFormValues,
} from "../data/pesticide-toxicity-form.schema";
import { emptyPesticideToxicityClassFormData } from "../data/constants";

interface PesticideToxicityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: PesticideToxicityClassRecord | null;
  onSubmit: (data: PesticideToxicityFormValues) => Promise<void> | void;
}

function normalizeStatus(
  status: PesticideToxicityClassRecord["status"] | null | undefined,
): PesticideToxicityFormValues["status"] {
  if (PESTICIDE_TOXICITY_FORM_STATUSES.includes(status as never)) {
    return status as PesticideToxicityFormValues["status"];
  }

  return "active";
}

function normalizeWhoGroup(
  whoGroup: PesticideToxicityClassRecord["whoGroup"] | null | undefined,
): PesticideToxicityFormValues["whoGroup"] {
  if (PESTICIDE_WHO_GROUP_OPTIONS.includes(whoGroup as never)) {
    return whoGroup as PesticideToxicityFormValues["whoGroup"];
  }

  return "III";
}

export function PesticideToxicityFormDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
}: PesticideToxicityFormDialogProps) {
  const defaultValues = useMemo<PesticideToxicityFormInput>(
    () =>
      editItem
        ? {
            code: editItem.code ?? "",
            name: editItem.name ?? "",
            description: editItem.description ?? "",
            status: normalizeStatus(editItem.status),
            whoGroup: normalizeWhoGroup(editItem.whoGroup),
            bandColor: editItem.bandColor ?? "#3B82F6",
            ld50Threshold: editItem.ld50Threshold ?? "",
          }
        : {
            ...emptyPesticideToxicityClassFormData,
            status: "active",
          },
    [editItem],
  );

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<PesticideToxicityFormInput, unknown, PesticideToxicityFormValues>(
    {
      defaultValues,
      resolver: zodResolver(pesticideToxicityFormSchema),
    },
  );

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<PesticideToxicityFormValues> = (values) => {
    onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        editItem
          ? "Chỉnh sửa phân loại độ độc tính"
          : "Thêm phân loại độ độc tính mới"
      }
      onSubmit={handleRHFSubmit(submitForm)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã phân loại
            </Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Input
                  id="code"
                  placeholder="VD: WHO_IA, WHO_IB..."
                  aria-invalid={!!errors.code}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("code");
                    field.onChange(e.target.value.toUpperCase());
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
            {errors.code ? (
              <p className="text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên phân loại
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="VD: Nguy hiểm"
                  aria-invalid={!!errors.name}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("name");
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whoGroup" required>
              Nhóm WHO
            </Label>
            <Controller
              control={control}
              name="whoGroup"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    clearErrors("whoGroup");
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger id="whoGroup">
                    <SelectValue placeholder="Chọn nhóm WHO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ia">Ia - Rất độc</SelectItem>
                    <SelectItem value="Ib">Ib - Độc</SelectItem>
                    <SelectItem value="II">II - Nguy hiểm</SelectItem>
                    <SelectItem value="III">III - Cẩn thận</SelectItem>
                    <SelectItem value="IV">IV - Ít độc</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.whoGroup ? (
              <p className="text-xs text-red-600">{errors.whoGroup.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bandColor" required>
              Màu băng
            </Label>
            <Controller
              control={control}
              name="bandColor"
              render={({ field }) => (
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="bandColorPicker"
                    value={field.value}
                    onChange={(e) => {
                      clearErrors("bandColor");
                      field.onChange(e.target.value);
                    }}
                    className="h-10 w-20 cursor-pointer rounded border border-input"
                  />
                  <Input
                    id="bandColor"
                    value={field.value}
                    onChange={(e) => {
                      clearErrors("bandColor");
                      field.onChange(e.target.value);
                    }}
                    placeholder="#3B82F6"
                    className="flex-1"
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                  />
                </div>
              )}
            />
            {errors.bandColor ? (
              <p className="text-xs text-red-600">{errors.bandColor.message}</p>
            ) : null}
          </div>
        </div>

        {editItem ? (
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    clearErrors("status");
                    field.onChange(
                      value as (typeof PESTICIDE_TOXICITY_FORM_STATUSES)[number],
                    );
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="ld50Threshold" required>
            Ngưỡng LD50
          </Label>
          <Controller
            control={control}
            name="ld50Threshold"
            render={({ field }) => (
              <Input
                id="ld50Threshold"
                placeholder="VD: LD50 50-500 mg/kg (rắn) hoặc 200-2000 mg/kg (lỏng)"
                aria-invalid={!!errors.ld50Threshold}
                value={field.value}
                onChange={(e) => {
                  clearErrors("ld50Threshold");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.ld50Threshold ? (
            <p className="text-xs text-red-600">
              {errors.ld50Threshold.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về mức độ độc tính..."
                rows={3}
                aria-invalid={!!errors.description}
                value={field.value}
                onChange={(e) => {
                  clearErrors("description");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.description ? (
            <p className="text-xs text-red-600">
              {errors.description.message}
            </p>
          ) : null}
        </div>
      </div>
    </FormDialog>
  );
}
