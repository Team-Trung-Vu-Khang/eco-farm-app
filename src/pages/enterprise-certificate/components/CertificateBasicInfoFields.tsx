import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { Standard } from "../../../stores/useEnterpriseCertificateStore";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";

interface BasicInfoProps {
  standards: Standard[];
}

const getStandardInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ST";

export function CertificateBasicInfoFields({ standards }: BasicInfoProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<EnterpriseCertificateFormValues>();

  const watchedStandardType = useWatch({
    control,
    name: "standardType",
  });

  const selectedStandard = standards.find(
    (standard) => standard.code === watchedStandardType,
  );
  const organizations = selectedStandard?.organizations ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code" required>
            Mã chứng nhận
          </Label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="code"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: CN-2024-001"
                className="bg-white"
                aria-invalid={!!errors.code}
              />
            )}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên chứng nhận
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="name"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: Chứng nhận VietGAP..."
                className="bg-white"
                aria-invalid={!!errors.name}
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
          <Label htmlFor="standardType" required>
            Loại tiêu chuẩn
          </Label>
          <Controller
            control={control}
            name="standardType"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  const nextStandard = standards.find(
                    (standard) => standard.code === value,
                  );
                  const nextOrganizations = nextStandard?.organizations ?? [];

                  setValue(
                    "organization",
                    nextOrganizations.length === 1 ? nextOrganizations[0] : "",
                    { shouldDirty: true, shouldValidate: true },
                  );
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn loại tiêu chuẩn" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {standards.map((standard) => (
                    <SelectItem
                      key={standard.code}
                      value={standard.code}
                      className="py-2"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-7 w-7 shrink-0 rounded-md border border-slate-200">
                          {standard.stampUrl ? (
                            <AvatarImage
                              src={standard.stampUrl}
                              alt={standard.name}
                            />
                          ) : null}
                          <AvatarFallback className="rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {getStandardInitials(standard.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{standard.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.standardType ? (
            <p className="text-xs text-red-600">
              {errors.standardType.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization" required>
            Tổ chức cấp
          </Label>
          <Controller
            control={control}
            name="organization"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={organizations.length === 0}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue
                    placeholder={
                      organizations.length === 0
                        ? "Chọn tiêu chuẩn trước"
                        : "Chọn tổ chức cấp..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.organization ? (
            <p className="text-xs text-red-600">
              {errors.organization.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
