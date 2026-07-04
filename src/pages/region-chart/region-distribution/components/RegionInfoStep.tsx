import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { OrganizationSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import { useFormContext } from "react-hook-form";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useCrops } from "@/features/foundation/hooks/useCrops";
import { useEffect, useState, useMemo } from "react";
import type { RegionFormValues } from "../data/region-form.schema";

export const RegionInfoStep = () => {
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");
  const { data: cropsData } = useCrops({ params: { size: 100 } });
  const crops = cropsData?.content || [];

  const cropOptions = useMemo(() => {
    return crops.map((crop) => ({
      value: crop.id.toString(),
      label: crop.name,
      image: crop.imageUrl,
    }));
  }, [crops]);

  const { control, setValue, watch } = useFormContext<RegionFormValues>();
  const provinceId = watch("provinceId");
  const { provinces, wards, isLoadingProvinces, isLoadingWards } =
    useAddressOptions(provinceId);

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
      setPendingWardName(null);
    }
  }, [wards, pendingWardName, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mã vùng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: REG-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên vùng <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tên vùng trồng" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={control}
            name="enterpriseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <OrganizationSelector
                    selectedId={field.value}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cropId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cây trồng chính</FormLabel>
                <FormControl>
                  <Combobox
                    options={cropOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Chọn cây trồng..."
                    searchPlaceholder="Tìm kiếm cây trồng..."
                    className="w-full mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diện tích (ha)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
                    clearable={false}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : parseFloat(val));
                    }}
                    placeholder="Nhập diện tích"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="provinceId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tỉnh / Thành Phố</FormLabel>
                <FormControl>
                  <Combobox
                    options={provinces.map((p) => ({
                      value: p.code,
                      label: p.name,
                    }))}
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("wardId", ""); // Reset ward when province changes
                    }}
                    disabled={isLoadingProvinces}
                    placeholder="Chọn Tỉnh / Thành Phố"
                    searchPlaceholder="Tìm kiếm..."
                    className="w-full mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="wardId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Phường/Xã</FormLabel>
                <FormControl>
                  <Combobox
                    options={wards.map((w) => ({
                      value: w.code,
                      label: w.name,
                    }))}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={!provinceId || isLoadingWards}
                    placeholder="Chọn Phường / Xã"
                    searchPlaceholder="Tìm kiếm..."
                    className="w-full mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ chi tiết</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Số nhà, đường, thôn/xóm..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="landType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại đất</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại đất" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="terrain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa hình</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa hình" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
