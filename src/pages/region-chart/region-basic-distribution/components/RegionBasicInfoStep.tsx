import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import type { RegionBasicFormValues } from "../data/region-basic-form.schema";

export const RegionBasicInfoStep = () => {
  const { control, setValue, watch } = useFormContext<RegionBasicFormValues>();
  const provinceId = watch("provinceId");
  const { provinces, wards, isLoadingProvinces, isLoadingWards } =
    useAddressOptions(provinceId);
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  useEffect(() => {
    if (!provinceId) {
      setValue("wardId", "");
    }
  }, [provinceId, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã vùng</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: REG-0001" />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diện tích (ha)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    clearable={false}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="Nhập diện tích"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="provinceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh / Thành phố</FormLabel>
                <FormControl>
                  <Combobox
                    options={provinces.map((province) => ({
                      value: province.code,
                      label: province.name,
                    }))}
                    value={field.value ?? ""}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("wardId", "");
                    }}
                    disabled={isLoadingProvinces}
                    placeholder="Chọn tỉnh / thành phố"
                    searchPlaceholder="Tìm kiếm..."
                    className="w-full"
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
              <FormItem>
                <FormLabel>Phường / Xã</FormLabel>
                <FormControl>
                  <Combobox
                    options={wards.map((ward) => ({
                      value: ward.code,
                      label: ward.name,
                    }))}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={!provinceId || isLoadingWards}
                    placeholder="Chọn phường / xã"
                    searchPlaceholder="Tìm kiếm..."
                    className="w-full"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Textarea {...field} rows={3} placeholder="Nhập ghi chú" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
