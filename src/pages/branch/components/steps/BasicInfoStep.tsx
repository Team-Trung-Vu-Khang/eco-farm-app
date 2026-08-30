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

import AddressSearchInput from "@/components/AddressSearchInput";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import type { BranchFormData } from "../../types/types";
import type { BranchFormInput } from "../../data/branch-form.schema";
import { BranchEnterpriseSelector } from "./BranchEnterpriseSelector";
import { BranchLocationMap } from "./BranchLocationMap";

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
  const address = watch("address");
  const city = watch("city");
  const district = watch("district");
  const ward = watch("ward");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const taxCode = watch("taxCode");
  const taxAddress = watch("taxAddress");
  const code = watch("code");
  const imageUrl = watch("imageUrl");
  const status = watch("status");
  const metadataJson = watch("metadataJson");

  const selectedEnterprise =
    enterprises.find((item) => item.id.toString() === organizationId) ||
    (enterprises.length === 1 ? enterprises[0] : undefined);
  const locationFormData = {
    code,
    name: watch("name"),
    enterpriseId: organizationId,
    enterpriseName: selectedEnterprise?.name || "",
    taxCode,
    taxAddress,
    website,
    address,
    city,
    district,
    ward,
    imageUrl,
    latitude,
    longitude,
    status: status === "inactive" ? "inactive" : "active",
    contactInfos: [],
    contacts: [],
    bankAccounts: [],
    metadataJson,
  } as BranchFormData;

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
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          Đơn vị sở hữu
        </div>
        <BranchEnterpriseSelector
          enterprises={enterprises}
          selectedId={organizationId}
          onSelect={(value) => {
            clearErrors("organizationId");
            setValue("organizationId", value, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          searchTerm={enterpriseSearchTerm}
          onSearch={onEnterpriseSearch}
          onLoadMore={onLoadMoreEnterprises}
          hasMore={hasMoreEnterprises}
          loading={enterprisesLoading}
        />
        {errors.organizationId ? (
          <p className="text-xs text-red-600">{errors.organizationId.message}</p>
        ) : null}
      </section>

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

      <div className="border-t pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            Địa chỉ chi tiết
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Tỉnh / Thành phố</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <AddressRemoteCombobox
                    type="province"
                    value={field.value ?? ""}
                    onChange={(value) => {
                      clearErrors("city");
                      field.onChange(value);
                      setValue("district", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setValue("ward", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    placeholder="Chọn Tỉnh / Thành Phố"
                    searchPlaceholder="Tìm tỉnh thành..."
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Phường / Xã</Label>
              <Controller
                control={control}
                name="ward"
                render={({ field }) => (
                  <AddressRemoteCombobox
                    type="ward"
                    value={field.value ?? ""}
                    onChange={(value) => {
                      clearErrors("ward");
                      field.onChange(value);
                      setValue("district", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    provinceCode={city}
                    placeholder={
                      city ? "Chọn Phường / Xã" : "Chọn Tỉnh / Thành Phố trước"
                    }
                    searchPlaceholder="Tìm phường xã..."
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" required>
              Địa chỉ chi tiết
            </Label>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <AddressSearchInput
                  value={field.value ?? ""}
                  onChange={(value) => {
                    clearErrors("address");
                    field.onChange(value);
                  }}
                  onSelectLocation={({ address: nextAddress, latitude, longitude }) => {
                    clearErrors("address");
                    field.onChange(nextAddress);
                    setValue("latitude", latitude, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setValue("longitude", longitude, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  latitude={latitude}
                  longitude={longitude}
                  placeholder="Số nhà, đường, thôn/xóm..."
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <BranchLocationMap
          formData={locationFormData}
          updateFormData={(updates) => {
            if (updates.address !== undefined) {
              setValue("address", updates.address, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
            if (updates.city !== undefined) {
              setValue("city", updates.city, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
            if (updates.district !== undefined) {
              setValue("district", updates.district, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
            if (updates.ward !== undefined) {
              setValue("ward", updates.ward, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
            if (updates.latitude !== undefined) {
              setValue("latitude", updates.latitude, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
            if (updates.longitude !== undefined) {
              setValue("longitude", updates.longitude, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }}
        />
      </div>
    </div>
  );
}
