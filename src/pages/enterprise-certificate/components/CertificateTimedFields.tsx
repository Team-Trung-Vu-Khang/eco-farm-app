import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useFormContext } from "react-hook-form";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";

export function CertificateTimedFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EnterpriseCertificateFormValues>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="issuedDate" required>
            Ngày cấp
          </Label>
          <Controller
            control={control}
            name="issuedDate"
            render={({ field }) => (
              <Input
                id="issuedDate"
                type="date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                className="bg-white"
                aria-invalid={!!errors.issuedDate}
              />
            )}
          />
          {errors.issuedDate ? (
            <p className="text-xs text-red-600">{errors.issuedDate.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate" required>
            Ngày hết hạn
          </Label>
          <Controller
            control={control}
            name="expiryDate"
            render={({ field }) => (
              <Input
                id="expiryDate"
                type="date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                className="bg-white"
                aria-invalid={!!errors.expiryDate}
              />
            )}
          />
          {errors.expiryDate ? (
            <p className="text-xs text-red-600">{errors.expiryDate.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
