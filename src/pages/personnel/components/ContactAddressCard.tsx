import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";

export function ContactAddressCard() {
  const { control, watch, setValue } = useFormContext<PersonnelFormValues>();
  const province = watch("province");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh / Thành phố</FormLabel>
                <FormControl>
                  <AddressRemoteCombobox
                    type="province"
                    value={field.value ?? ""}
                    onChange={(value) => {
                      field.onChange(value);
                      // Đổi tỉnh thì phường/xã cũ không còn hợp lệ
                      setValue("ward", "");
                    }}
                    placeholder="Chọn Tỉnh/Thành"
                    searchPlaceholder="Tìm Tỉnh/Thành..."
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
                  <AddressRemoteCombobox
                    type="ward"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    provinceCode={province}
                    disabled={!province}
                    placeholder={
                      province ? "Chọn Phường/Xã" : "Chọn Tỉnh/Thành trước"
                    }
                    searchPlaceholder="Tìm Phường/Xã..."
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
