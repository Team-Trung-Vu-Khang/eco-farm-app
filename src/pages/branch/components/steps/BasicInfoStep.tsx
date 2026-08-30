import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { Enterprise } from "@/pages/enterprise/data/constants";
import type { BranchFormInput } from "../../data/branch-form.schema";
import { BranchEnterpriseSelector } from "./BranchEnterpriseSelector";

interface BasicInfoStepProps {
  enterprises: Enterprise[];
  isEdit: boolean;
  enterpriseSearchTerm?: string;
  onEnterpriseSearch?: (value: string) => void;
  onLoadMoreEnterprises?: () => void;
  hasMoreEnterprises?: boolean;
  enterprisesLoading?: boolean;
}

export function BasicInfoStep({
  enterprises,
  isEdit,
  enterpriseSearchTerm,
  onEnterpriseSearch,
  onLoadMoreEnterprises,
  hasMoreEnterprises,
  enterprisesLoading,
}: BasicInfoStepProps) {
  const {
    control,
    clearErrors,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<BranchFormInput>();

  const organizationId = watch("organizationId");
  const website = watch("website");

  const selectedEnterprise =
    enterprises.find((item) => item.id.toString() === organizationId) ||
    (enterprises.length === 1 ? enterprises[0] : undefined);

  useEffect(() => {
    if (organizationId || enterprises.length !== 1) return;

    const [enterprise] = enterprises;
    if (!enterprise) return;

    setValue("organizationId", enterprise.id.toString(), {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [enterprises, organizationId, setValue]);

  useEffect(() => {
    if (!selectedEnterprise?.website) return;
    if (website) return;

    setValue("website", selectedEnterprise.website, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [selectedEnterprise?.id, selectedEnterprise?.website, setValue, website]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="organizationId" required>
          Đơn vị sở hữu
        </Label>
        {enterprises.length === 1 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {selectedEnterprise?.name}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {selectedEnterprise?.code}
            </div>
          </div>
        ) : (
          <Controller
            control={control}
            name="organizationId"
            render={({ field }) => (
              <div className="space-y-2">
                <BranchEnterpriseSelector
                  enterprises={enterprises}
                  selectedId={field.value}
                  onSelect={(value) => {
                    clearErrors("organizationId");
                    field.onChange(value);
                  }}
                  searchTerm={enterpriseSearchTerm}
                  onSearch={onEnterpriseSearch}
                  onLoadMore={onLoadMoreEnterprises}
                  hasMore={hasMoreEnterprises}
                  loading={enterprisesLoading}
                />
                {errors.organizationId ? (
                  <p className="text-xs text-red-600">
                    {errors.organizationId.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        )}
        {errors.organizationId && enterprises.length === 1 ? (
          <p className="text-xs text-red-600">
            {errors.organizationId.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên chi nhánh
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="name"
                value={field.value}
                onChange={(event) => {
                  clearErrors("name");
                  field.onChange(event.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: Chi nhánh Miền Nam"
                aria-invalid={!!errors.name}
              />
            )}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxCode">Mã số thuế</Label>
          <Controller
            control={control}
            name="taxCode"
            render={({ field }) => (
              <Input
                id="taxCode"
                value={field.value}
                onChange={(event) => {
                  clearErrors("taxCode");
                  field.onChange(event.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: 0123456789-001"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Controller
            control={control}
            name="website"
            render={({ field }) => (
              <Input
                id="website"
                value={field.value}
                onChange={(event) => {
                  clearErrors("website");
                  field.onChange(event.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: https://example.com"
                aria-invalid={!!errors.website}
              />
            )}
          />
          {errors.website ? (
            <p className="text-xs text-red-600">{errors.website.message}</p>
          ) : null}
        </div>

        {isEdit && (
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
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
