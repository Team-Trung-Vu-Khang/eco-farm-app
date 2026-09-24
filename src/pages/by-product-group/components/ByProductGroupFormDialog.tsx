import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { ByProductGroupRecord } from "@/features/master-data/types/master-data.type";
import {
  byProductGroupFormSchema,
  type ByProductGroupFormValues,
} from "../data/by-product-group-form.schema";

interface ByProductGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: ByProductGroupRecord | null;
  classification: string;
  onSubmit: (data: ByProductGroupFormValues) => Promise<void> | void;
  loading?: boolean;
}

export function ByProductGroupFormDialog({
  open,
  onOpenChange,
  editItem,
  classification,
  onSubmit,
  loading,
}: ByProductGroupFormDialogProps) {
  const defaultValues = useMemo<ByProductGroupFormValues>(
    () =>
      editItem
        ? {
            code: editItem.code ?? "",
            name: editItem.name ?? "",
            classification: editItem.classification ?? classification,
            description: editItem.description ?? "",
            status: (editItem.status as any) || "active",
          }
        : {
            code: "",
            name: "",
            classification,
            description: "",
            status: "active",
          },
    [editItem, classification],
  );

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ByProductGroupFormValues>({
    defaultValues,
    resolver: zodResolver(byProductGroupFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<ByProductGroupFormValues> = (values) => {
    onSubmit({
      ...values,
      classification: values.classification || classification,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      loading={loading}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa nhóm phụ phẩm" : "Thêm nhóm phụ phẩm mới"}
      onSubmit={handleRHFSubmit(submitForm) as any}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Mã nhóm</Label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  id="code"
                  placeholder="VD: BYPG-001..."
                  aria-invalid={!!errors.code}
                  value={field.value || ""}
                  onChange={(e) => {
                    clearErrors("code");
                    field.onChange(e.target.value.toUpperCase());
                  }}
                  disabled={!!editItem}
                  clearable={!editItem}
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
              Tên nhóm phụ phẩm
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="VD: Phụ phẩm thực vật..."
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
                    field.onChange(e.target.value as any);
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
                placeholder="Mô tả chi tiết về nhóm phụ phẩm..."
                rows={3}
                aria-invalid={!!errors.description}
                value={field.value || ""}
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
            <p className="text-xs text-red-600">{errors.description.message}</p>
          ) : null}
        </div>
      </div>
    </FormDialog>
  );
}
