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
  DEPARTMENT_FORM_STATUSES,
  departmentFormSchema,
  type DepartmentFormValues,
} from "../data/department-form.schema";
import { emptyDepartmentFormValues, type DepartmentItem } from "../types/types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: DepartmentItem | null;
  onSubmit: (data: DepartmentFormValues) => Promise<void> | void;
}

function buildDefaultValues(
  editItem: DepartmentItem | null,
): DepartmentFormValues {
  if (!editItem) {
    return {
      ...emptyDepartmentFormValues,
      status: "active",
    };
  }

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    description: editItem.description ?? "",
    status: normalizeDepartmentStatus(editItem.status),
  };
}

function normalizeDepartmentStatus(
  status: DepartmentItem["status"] | null | undefined,
): DepartmentFormValues["status"] {
  if (
    DEPARTMENT_FORM_STATUSES.includes(
      status as (typeof DEPARTMENT_FORM_STATUSES)[number],
    )
  ) {
    return status as DepartmentFormValues["status"];
  }

  return "active";
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
}: DepartmentFormDialogProps) {
  const defaultValues = useMemo(() => buildDefaultValues(editItem), [editItem]);

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    defaultValues,
    resolver: zodResolver(departmentFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<DepartmentFormValues> = async (values) => {
    await onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
      onSubmit={handleRHFSubmit(submitForm)}
      loading={isSubmitting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" required>
            Mã phòng ban
          </Label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="code"
                placeholder="VD: PB-KD"
                aria-invalid={!!errors.code}
                value={field.value}
                onChange={(e) => {
                  clearErrors("code");
                  field.onChange(e.target.value.toUpperCase());
                }}
                clearable={!editItem}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                disabled={!!editItem}
              />
            )}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên phòng ban
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="name"
                placeholder="VD: Phòng Kinh Doanh"
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
          <Label htmlFor="description">Mô tả</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Mô tả chức năng của phòng ban..."
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
                      normalizeDepartmentStatus(
                        value as DepartmentItem["status"],
                      ),
                    );
                  }}
                >
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
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
