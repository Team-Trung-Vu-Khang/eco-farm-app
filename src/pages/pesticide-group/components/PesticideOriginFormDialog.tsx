import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  PESTICIDE_ORIGIN_FORM_STATUSES,
  pesticideOriginFormSchema,
  type PesticideOriginFormInput,
  type PesticideOriginFormValues,
} from "../data/pesticide-origin-form.schema";
import { emptyPesticideOriginFormData } from "../data/constants";
import type { PesticideOriginRecord } from "@/features/master-data/types/master-data.type";

interface PesticideOriginFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: PesticideOriginRecord | null;
  onSubmit: (data: PesticideOriginFormValues) => Promise<void> | void;
}

function normalizeStatus(
  status: PesticideOriginRecord["status"] | null | undefined,
): PesticideOriginFormValues["status"] {
  if (PESTICIDE_ORIGIN_FORM_STATUSES.includes(status as never)) {
    return status as PesticideOriginFormValues["status"];
  }

  return "active";
}

export function PesticideOriginFormDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
}: PesticideOriginFormDialogProps) {
  const defaultValues = useMemo<PesticideOriginFormInput>(
    () =>
      editItem
        ? {
            code: editItem.code ?? "",
            name: editItem.name ?? "",
            description: editItem.description ?? "",
            status: normalizeStatus(editItem.status),
          }
        : {
            ...emptyPesticideOriginFormData,
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
  } = useForm<PesticideOriginFormInput, unknown, PesticideOriginFormValues>({
    defaultValues,
    resolver: zodResolver(pesticideOriginFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<PesticideOriginFormValues> = (values) => {
    onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa nguồn gốc" : "Thêm nguồn gốc mới"}
      onSubmit={handleRHFSubmit(submitForm)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã nguồn gốc
            </Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Input
                  id="code"
                  placeholder="VD: CHEMICAL, BIOLOGICAL..."
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
              Tên nguồn gốc
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="VD: Thuốc hóa học..."
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

        {editItem ? (
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <select
                  id="status"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("status");
                    field.onChange(
                      e.target.value as (typeof PESTICIDE_ORIGIN_FORM_STATUSES)[number],
                    );
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về nguồn gốc..."
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
