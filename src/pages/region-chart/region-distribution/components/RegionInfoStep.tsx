import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import AddressSearchInput from "@/components/AddressSearchInput";
import { OrganizationSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import { useFormContext, Controller } from "react-hook-form";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useEffect, useState } from "react";
import type { RegionFormValues } from "../data/region-form.schema";
import { CenterPointMapPicker } from "./CenterPointMapPicker";

interface RegionInfoStepProps {
  showEnterprise?: boolean;
  showCenterPoint?: boolean;
}

export const RegionInfoStep = ({
  showEnterprise = false,
  showCenterPoint = false,
}: RegionInfoStepProps = {}) => {
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  const { control, setValue, watch } = useFormContext<RegionFormValues>();
  const provinceId = watch("provinceId");
  const centerPoint = watch("centerPoint");
  const addressLocation = watch("addressLocation");
  // Vẫn cần danh sách đầy đủ để dò theo tên khi tự điền địa chỉ từ doanh nghiệp
  const { provinces, wards } = useAddressOptions(provinceId);

  const [pendingWardName, setPendingWardName] = useState<string | null>(null);

  useEffect(() => {
    if (pendingWardName && wards.length > 0) {
      const normalize = (input: string) =>
        input
          .toLowerCase()
          .replace(/^(tỉnh|thành phố|tp\.)\s+/i, "")
          .trim();

      const matchedWard = wards.find(
        (w) => normalize(w.name) === normalize(pendingWardName),
      );

      if (matchedWard) {
        setValue("wardId", matchedWard.code);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingWardName(null);
    }
  }, [wards, pendingWardName, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>
                  Tên vùng <span className="text-red-500">*</span>
                </Label>
                <Input {...field} placeholder="Tên vùng trồng" />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="area"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>Diện tích (ha)</Label>
                <Input
                  type="number"
                  className="border-slate-300 focus:border-primary focus:ring-primary/20"
                  clearable={false}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? undefined : parseFloat(val));
                  }}
                  placeholder="Nhập diện tích"
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {showEnterprise && (
          <Controller
            control={control}
            name="enterpriseId"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </Label>
                <OrganizationSelector
                  selectedId={field?.value ?? ""}
                  onSelect={(value, selectedEnterprise) => {
                    if (selectedEnterprise) {
                      const normalize = (input: string) =>
                        input
                          .toLowerCase()
                          .replace(/^(tỉnh|thành phố|tp\.)\s+/i, "")
                          .trim();

                      const matchedProvince = provinces.find(
                        (item) =>
                          normalize(item.name) ===
                          normalize(selectedEnterprise.province || ""),
                      );

                      setValue("enterpriseId", value);
                      if (selectedEnterprise.address) {
                        setValue("address", selectedEnterprise.address);
                      }

                      if (matchedProvince) {
                        setValue("provinceId", matchedProvince.code);
                        // Schedule ward match after wards load
                        if (selectedEnterprise.district) {
                          setPendingWardName(selectedEnterprise.district);
                        }
                      }
                    } else {
                      setValue("enterpriseId", value);
                    }
                  }}
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="provinceId"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </Label>
                <AddressRemoteCombobox
                  type="province"
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("wardId", ""); // Reset ward when province changes
                  }}
                  placeholder="Chọn Tỉnh / Thành phố"
                  searchPlaceholder="Tìm Tỉnh / Thành phố..."
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="wardId"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>
                  Phường / Xã <span className="text-red-500">*</span>
                </Label>
                <AddressRemoteCombobox
                  type="ward"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  provinceCode={provinceId}
                  disabled={!provinceId}
                  placeholder={
                    provinceId
                      ? "Chọn Phường / Xã"
                      : "Chọn Tỉnh / Thành phố trước"
                  }
                  searchPlaceholder="Tìm Phường / Xã..."
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <Controller
          control={control}
          name="address"
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label>Địa chỉ chi tiết</Label>
              <AddressSearchInput
                value={field.value ?? ""}
                onChange={field.onChange}
                onSelectLocation={({ address, latitude, longitude }) => {
                  setValue("address", address, { shouldDirty: true });
                  setValue(
                    "addressLocation",
                    { lat: latitude, lng: longitude },
                    { shouldDirty: true },
                  );
                  if (!centerPoint?.lat || !centerPoint?.lng) {
                    setValue(
                      "centerPoint",
                      { lat: latitude, lng: longitude },
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }
                }}
                latitude={addressLocation?.lat}
                longitude={addressLocation?.lng}
                onLatitudeChange={(lat) => {
                  setValue(
                    "addressLocation",
                    {
                      lat,
                      lng: addressLocation?.lng ?? 0,
                    },
                    {
                      shouldDirty: true,
                    },
                  );
                }}
                onLongitudeChange={(lng) => {
                  setValue(
                    "addressLocation",
                    {
                      lat: addressLocation?.lat ?? 0,
                      lng,
                    },
                    {
                      shouldDirty: true,
                    },
                  );
                }}
                placeholder="Số nhà, đường, thôn/xóm..."
              />
              {error && (
                <p className="text-sm font-medium text-destructive">
                  {error.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="landType"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>Loại đất</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((land) => (
                      <SelectItem
                        key={land.id || land.code}
                        value={(land.id || land.code || "").toString()}
                      >
                        {land.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="terrain"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrains.map((terrain) => (
                      <SelectItem
                        key={terrain.id || terrain.code}
                        value={(terrain.id || terrain.code || "").toString()}
                      >
                        {terrain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {showCenterPoint && <CenterPointMapPicker />}

        <Controller
          control={control}
          name="note"
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea {...field} rows={3} />
              {error && (
                <p className="text-sm font-medium text-destructive">
                  {error.message}
                </p>
              )}
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};
