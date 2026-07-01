import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Combobox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";
import { useAddressOptions } from "@/features/master-data";
import { useMemo } from "react";

export function ContactAddressCard() {
  const { control, watch } = useFormContext<PersonnelFormValues>();
  const province = watch("province");

  const { provinces, wards, isLoadingProvinces, isLoadingWards } =
    useAddressOptions(province);

  const provinceOptions = useMemo(
    () => provinces.map((p) => ({ value: p.code, label: p.name })),
    [provinces],
  );

  const wardOptions = useMemo(
    () => wards.map((w) => ({ value: w.code, label: w.name })),
    [wards],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh / Thành phố</FormLabel>
                <FormControl>
                  <Combobox
                    options={provinceOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={isLoadingProvinces}
                    placeholder="Chọn Tỉnh/Thành"
                    searchPlaceholder="Tìm Tỉnh/Thành..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="ward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phường / Xã</FormLabel>
                <FormControl>
                  <Combobox
                    options={wardOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={isLoadingWards || !province}
                    placeholder="Chọn Phường/Xã"
                    searchPlaceholder="Tìm Phường/Xã..."
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
                <Input
                  placeholder="Số nhà, tên đường, phường/xã..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
