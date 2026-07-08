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
import { useEffect, useMemo } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";

import {
  contactGroupFormSchema,
  type ContactGroupFormValues,
} from "../data/contact-group-form.schema";
import type { ContactGroup } from "../types/types";

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: ContactGroup | null;
  onSubmit: (values: ContactGroupFormValues) => Promise<void> | void;
  loading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

export function GroupFormDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  loading = false,
}: GroupFormDialogProps) {
  const defaultValues = useMemo<ContactGroupFormValues>(
    () => ({
      code: editItem?.code ?? "",
      name: editItem?.name ?? "",
      description: editItem?.description ?? "",
      status: (editItem?.status || "active") as any,
      metadataJson: editItem?.metadataJson ?? null,
    }),
    [editItem],
  );

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ContactGroupFormValues>({
    defaultValues,
    resolver: zodResolver(
      contactGroupFormSchema,
    ) as Resolver<ContactGroupFormValues>,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  const submitForm: SubmitHandler<ContactGroupFormValues> = async (values) => {
    await onSubmit({
      ...values,
      status: editItem ? values.status : "active",
      metadataJson: values.metadataJson ?? null,
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa nhóm danh bạ" : "Thêm nhóm danh bạ mới"}
      onSubmit={handleRHFSubmit(submitForm)}
      loading={loading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã nhóm
            </Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <>
                  <Input
                    id="code"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    placeholder="VD: KH, NCC, DT..."
                    aria-invalid={!!errors.code}
                  />
                  {errors.code ? (
                    <p className="text-xs text-red-600">
                      {errors.code.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên nhóm
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <>
                  <Input
                    id="name"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    placeholder="VD: Khách hàng, Nhà cung cấp..."
                    aria-invalid={!!errors.name}
                  />
                  {errors.name ? (
                    <p className="text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
        </div>

        {editItem ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" required>
                Trạng thái
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" aria-invalid={!!errors.status}>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status ? (
                      <p className="text-xs text-red-600">
                        {errors.status.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
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
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Mô tả chi tiết về nhóm danh bạ..."
                rows={3}
              />
            )}
          />
        </div>
      </div>
    </FormDialog>
  );
}
