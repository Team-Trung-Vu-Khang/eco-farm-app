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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useForm } from "react-hook-form";
import type { VsicIndustry } from "../types";
import {
  VSIC_INDUSTRY_STATUSES,
  vsicIndustryFormSchema,
  type VsicIndustryFormInput,
  type VsicIndustryFormValues,
} from "../data/vsic-industry-form.schema";

interface EnterpriseTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: VsicIndustry | null;
  onSubmit: (data: VsicIndustryFormValues) => Promise<void> | void;
}

function buildDefaultValues(
  editItem: VsicIndustry | null,
): VsicIndustryFormInput {
  if (!editItem) {
    return {
      code: "",
      name: "",
      level: 1,
      parentCode: "",
      status: "active",
    };
  }

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    level: editItem.level ?? 1,
    parentCode: editItem.parentCode ?? "",
    status: VSIC_INDUSTRY_STATUSES.includes(
      editItem.status as (typeof VSIC_INDUSTRY_STATUSES)[number],
    )
      ? (editItem.status as VsicIndustryFormValues["status"])
      : "active",
  };
}

export function EnterpriseTypeForm({
  open,
  onOpenChange,
  editItem,
  onSubmit,
}: EnterpriseTypeFormProps) {
  const defaultValues = useMemo(
    () => buildDefaultValues(editItem),
    [editItem],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VsicIndustryFormInput, unknown, VsicIndustryFormValues>({
    defaultValues,
    resolver: zodResolver(vsicIndustryFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  const handleFormSubmit = handleSubmit((values) => onSubmit(values));

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa ngành nghề" : "Thêm ngành nghề mới"}
      onSubmit={handleFormSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã ngành
            </Label>
            <Input
              id="code"
              placeholder="VD: 01110"
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code ? (
              <p className="text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên ngành
            </Label>
            <Input
              id="name"
              placeholder="VD: Trồng lúa"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="level" required>
              Cấp ngành
            </Label>
            <Input
              id="level"
              type="number"
              min={1}
              max={5}
              aria-invalid={!!errors.level}
              {...register("level", {
                setValueAs: (value) => Number(value),
              })}
            />
            {errors.level ? (
              <p className="text-xs text-red-600">{errors.level.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentCode">Mã ngành cha</Label>
            <Input
              id="parentCode"
              placeholder="VD: 0111"
              aria-invalid={!!errors.parentCode}
              {...register("parentCode")}
            />
            {errors.parentCode ? (
              <p className="text-xs text-red-600">
                {errors.parentCode.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as VsicIndustryFormValues["status"], {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="status" aria-invalid={!!errors.status}>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
