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
import {
  POSITION_GROUP_FORM_STATUSES,
  positionGroupFormSchema,
  type PositionGroupFormValues,
} from "../data/position-group-form.schema";
import { emptyPositionGroupFormData } from "../data/constants";
import type { PositionGroup } from "../types";

interface PositionGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: PositionGroup | null;
  onSubmit: (data: PositionGroupFormValues) => Promise<void> | void;
  loading?: boolean;
}

function normalizeStatus(
  status: PositionGroup["status"] | null | undefined,
): PositionGroupFormValues["status"] {
  if (
    POSITION_GROUP_FORM_STATUSES.includes(
      status as (typeof POSITION_GROUP_FORM_STATUSES)[number],
    )
  ) {
    return status as PositionGroupFormValues["status"];
  }

  return "active";
}

function buildDefaultValues(
  editItem: PositionGroup | null,
): PositionGroupFormValues {
  if (!editItem) {
    return {
      ...emptyPositionGroupFormData,
      status: "active",
    };
  }

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    description: editItem.description ?? "",
    status: normalizeStatus(editItem.status),
  };
}

export function PositionGroupForm({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  loading = false,
}: PositionGroupFormProps) {
  const defaultValues = useMemo(() => buildDefaultValues(editItem), [editItem]);

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PositionGroupFormValues>({
    defaultValues,
    resolver: zodResolver(positionGroupFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<PositionGroupFormValues> = async (values) => {
    await onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa nhóm chức vụ" : "Thêm nhóm chức vụ mới"}
      onSubmit={handleRHFSubmit(submitForm)}
      loading={loading || isSubmitting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pg-code">Mã nhóm</Label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                clearable={!editItem}
                disabled={!!editItem}
                id="pg-code"
                placeholder="VD: GRP-MNG, GRP-TECH..."
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
          <Label htmlFor="pg-name" required>
            Tên nhóm
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="pg-name"
                placeholder="VD: Nhóm quản lý – điều hành"
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

        <div className="space-y-2">
          <Label htmlFor="pg-description">Mô tả</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="pg-description"
                placeholder="Mô tả ngắn về nhóm chức vụ này"
                rows={4}
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
            <p className="text-xs text-red-600">{errors.description.message}</p>
          ) : null}
        </div>

        {editItem ? (
          <div className="space-y-2">
            <Label htmlFor="pg-status" required>
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
                      normalizeStatus(value as PositionGroup["status"]),
                    );
                  }}
                >
                  <SelectTrigger id="pg-status" aria-invalid={!!errors.status}>
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
      </div>
    </FormDialog>
  );
}
