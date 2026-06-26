import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import {
  Checkbox,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Bank } from "../types/types";
import { bankFormSchema, type BankFormValues } from "../data/bank-form.schema";
interface BankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: Bank | null;
  formData: Bank;
  logoPreview: string;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onSubmit: (data: Bank) => void;
}

export default function BankFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  logoPreview,
  onLogoUpload,
  onRemoveLogo,
  onSubmit,
}: BankFormDialogProps) {
  const defaultValues = useMemo<BankFormValues>(
    () => ({
      id: formData.id ?? "",
      name: formData.name ?? formData.shortName ?? "",
      shortName: formData.shortName ?? formData.name ?? "",
      fullName: formData.fullName ?? "",
      logo: formData.logo ?? "",
      bin: formData.bin ?? "",
      swiftCode: formData.swiftCode ?? "",
      status: formData.status ?? "active",
      transferSupported: formData.transferSupported ?? true,
      lookupSupported: formData.lookupSupported ?? true,
      displayOrder: formData.displayOrder ?? 0,
    }),
    [formData],
  );

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BankFormValues>({
    defaultValues,
    resolver: zodResolver(bankFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, open, reset]);

  useEffect(() => {
    if (open) {
      setValue("logo", logoPreview, { shouldDirty: true });
    }
  }, [logoPreview, open, setValue]);

  const submitForm: SubmitHandler<BankFormValues> = (values) => {
    const normalizedValues = {
      ...values,
      id: values.id,
      name: values.shortName,
      shortName: values.shortName,
      fullName: values.fullName,
      logo: logoPreview || values.logo,
      bin: values.bin,
      swiftCode: values.swiftCode,
      displayOrder: values.displayOrder,
    };

    const submittedBank: Bank = {
      id: normalizedValues.id,
      name: normalizedValues.shortName,
      shortName: normalizedValues.shortName,
      fullName: normalizedValues.fullName,
      logo: normalizedValues.logo,
      bin: normalizedValues.bin,
      swiftCode: normalizedValues.swiftCode,
      status: normalizedValues.status,
      transferSupported: normalizedValues.transferSupported,
      lookupSupported: normalizedValues.lookupSupported,
      displayOrder: normalizedValues.displayOrder,
    };

    onSubmit(submittedBank);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng mới"}
      onSubmit={handleRHFSubmit(submitForm)}
      size="xl"
    >
      <div className="space-y-4 max-h-[70dvh] overflow-y-auto px-1">
        {/* ID */}
        <div className="space-y-2">
          <Label htmlFor="id" required>
            ID / Mã ngân hàng
          </Label>
          <Controller
            control={control}
            name="id"
            render={({ field }) => (
              <Input
                id="id"
                clearable={false}
                placeholder="VD: VCB, BIDV, ACB..."
                disabled={!!editItem}
                aria-invalid={!!errors.id}
                value={field.value}
                onChange={(e) => {
                  clearErrors("id");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.id ? (
            <p className="text-xs text-red-600">{errors.id.message}</p>
          ) : null}
        </div>

        {/* Short name */}
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên ngắn
          </Label>
          <Controller
            control={control}
            name="shortName"
            render={({ field }) => (
              <Input
                id="name"
                placeholder="VD: Vietcombank, BIDV..."
                aria-invalid={!!errors.shortName}
                value={field.value}
                onChange={(e) => {
                  clearErrors("shortName");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.shortName ? (
            <p className="text-xs text-red-600">{errors.shortName.message}</p>
          ) : null}
        </div>

        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" required>
            Tên đầy đủ (Bank's Name)
          </Label>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <Input
                id="fullName"
                placeholder="VD: Ngân hàng Citibank, N.A. - Chi nhánh Hà Nội"
                aria-invalid={!!errors.fullName}
                value={field.value}
                onChange={(e) => {
                  clearErrors("fullName");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.fullName ? (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="swiftCode" required>
            SWIFT Code
          </Label>
          <Controller
            control={control}
            name="swiftCode"
            render={({ field }) => (
              <Input
                id="swiftCode"
                placeholder="VD: BFTVVNVX"
                maxLength={11}
                className="font-mono tracking-widest uppercase"
                aria-invalid={!!errors.swiftCode}
                value={field.value}
                onChange={(e) => {
                  clearErrors("swiftCode");
                  field.onChange(e.target.value.toUpperCase());
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">8 hoặc 11 ký tự</p>
          {errors.swiftCode ? (
            <p className="text-xs text-red-600">{errors.swiftCode.message}</p>
          ) : null}
        </div>

        {/* BIN */}
        <div className="space-y-2">
          <Label htmlFor="bin" required>
            BIN
          </Label>
          <Controller
            control={control}
            name="bin"
            render={({ field }) => (
              <Input
                id="bin"
                placeholder="VD: 970436"
                maxLength={9}
                className="font-mono"
                aria-invalid={!!errors.bin}
                value={field.value}
                onChange={(e) => {
                  clearErrors("bin");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.bin ? (
            <p className="text-xs text-red-600">{errors.bin.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder" required>
              Thứ tự hiển thị
            </Label>
            <Controller
              control={control}
              name="displayOrder"
              render={({ field }) => (
                <Input
                  id="displayOrder"
                  type="number"
                  min={0}
                  placeholder="VD: 10"
                  className="font-mono"
                  aria-invalid={!!errors.displayOrder}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    clearErrors("displayOrder");
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value),
                    );
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
            {errors.displayOrder ? (
              <p className="text-xs text-red-600">
                {errors.displayOrder.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <Controller
              control={control}
              name="transferSupported"
              render={({ field }) => (
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    clearErrors("transferSupported");
                    field.onChange(Boolean(checked));
                  }}
                  id="transferSupported"
                />
              )}
            />
            <div className="space-y-0.5">
              <Label htmlFor="transferSupported" className="cursor-pointer">
                Hỗ trợ chuyển khoản
              </Label>
              <p className="text-xs text-muted-foreground">
                Bật nếu ngân hàng hỗ trợ chuyển khoản
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <Controller
              control={control}
              name="lookupSupported"
              render={({ field }) => (
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    clearErrors("lookupSupported");
                    field.onChange(Boolean(checked));
                  }}
                  id="lookupSupported"
                />
              )}
            />
            <div className="space-y-0.5">
              <Label htmlFor="lookupSupported" className="cursor-pointer">
                Hỗ trợ tra cứu
              </Label>
              <p className="text-xs text-muted-foreground">
                Bật nếu ngân hàng hỗ trợ tra cứu tài khoản
              </p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <Label required>Logo ngân hàng</Label>
          {logoPreview ? (
            <div className="relative">
              <div className="p-4 border-2 border-dashed rounded-lg bg-muted/50 flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x48?text=Logo";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  onRemoveLogo();
                  clearErrors("logo");
                  setValue("logo", "", { shouldDirty: true });
                }}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="logo-upload"
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors ${
                errors.logo ? "border-red-400 bg-red-50/40" : ""
              }`}
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium text-muted-foreground">
                Click để tải logo lên
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG, JPG, SVG (tối đa 2MB)
              </span>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  clearErrors("logo");
                  onLogoUpload(e);
                }}
                className="hidden"
              />
            </label>
          )}
          {errors.logo ? (
            <p className="text-xs text-red-600">{errors.logo.message}</p>
          ) : null}
        </div>
      </div>
    </FormDialog>
  );
}
