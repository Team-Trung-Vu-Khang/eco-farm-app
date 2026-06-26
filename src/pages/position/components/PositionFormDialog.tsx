import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Combobox,
  FormDialog,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  POSITION_FORM_STATUSES,
  positionFormSchema,
  type PositionFormValues,
} from "../data/position-form.schema";
import { emptyPositionFormData } from "../data/constants";
import type { PositionItem, PositionMetadata } from "../types";

interface PositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: PositionItem | null;
  groupOptions: { label: string; value: string }[];
  responsibilityOptions: { label: string; value: string }[];
  onSubmit: (data: PositionFormValues) => void;
}

function readMetadata(item: PositionItem | null): PositionMetadata {
  return (item?.metadataJson ?? {}) as PositionMetadata;
}

function normalizeStatus(
  status: PositionItem["status"] | null | undefined,
): PositionFormValues["status"] {
  if (
    POSITION_FORM_STATUSES.includes(
      status as (typeof POSITION_FORM_STATUSES)[number],
    )
  ) {
    return status as PositionFormValues["status"];
  }

  return "active";
}

function buildDefaultValues(editItem: PositionItem | null): PositionFormValues {
  if (!editItem) {
    return {
      ...emptyPositionFormData,
      status: "active",
    };
  }

  const metadata = readMetadata(editItem);

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    group: metadata.group ?? "",
    description: editItem.description ?? "",
    responsibilities: metadata.responsibilities ?? [],
    status: normalizeStatus(editItem.status),
  };
}

export function PositionFormDialog({
  open,
  onOpenChange,
  editItem,
  groupOptions,
  responsibilityOptions,
  onSubmit,
}: PositionFormDialogProps) {
  const defaultValues = useMemo(() => buildDefaultValues(editItem), [editItem]);

  const filteredResponsibilities = useMemo(
    () =>
      responsibilityOptions.filter((option) => option.value !== editItem?.name),
    [editItem?.name, responsibilityOptions],
  );

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    defaultValues,
    resolver: zodResolver(positionFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<PositionFormValues> = (values) => {
    onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
      onSubmit={handleRHFSubmit(submitForm)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã vai trò
            </Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Input
                  id="code"
                  placeholder="VD: POS-GD"
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
              Tên vai trò
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="VD: Giám Đốc"
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

        <div className="space-y-2">
          <Label htmlFor="group" required>
            Bộ phận
          </Label>
          <Controller
            control={control}
            name="group"
            render={({ field }) => (
              <Combobox
                options={groupOptions}
                value={field.value}
                onChange={(value) => {
                  clearErrors("group");
                  field.onChange(value);
                }}
                placeholder="Chọn bộ phận"
                searchPlaceholder="Tìm bộ phận..."
                emptyText="Không tìm thấy bộ phận"
              />
            )}
          />
          {errors.group ? (
            <p className="text-xs text-red-600">{errors.group.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Danh sách trách nhiệm</Label>
          <Controller
            control={control}
            name="responsibilities"
            render={({ field }) => (
              <MultiSelect
                options={filteredResponsibilities}
                value={field.value ?? []}
                placeholder="Chọn các trách nhiệm..."
                emptyText="Không tìm thấy vai trò"
                searchPlaceholder="Tìm vai trò..."
                onChange={(values) => {
                  clearErrors("responsibilities");
                  field.onChange(values);
                }}
              />
            )}
          />
          {errors.responsibilities ? (
            <p className="text-xs text-red-600">
              {errors.responsibilities.message}
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
                placeholder="Mô tả trách nhiệm và quyền hạn của chức vụ..."
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
                      normalizeStatus(value as PositionItem["status"]),
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
