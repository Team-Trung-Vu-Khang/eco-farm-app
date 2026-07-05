import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Combobox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useMasterData } from "@/features/master-data";
import type { PersonnelFormValues } from "../data/personnel-form.schema";

export function BankInfoCard() {
  const { control } = useFormContext<PersonnelFormValues>();

  const { items: banks } = useMasterData("banks", {
    params: { status: "active", size: 100 },
  });

  const bankOptions = useMemo(() => {
    return banks.map((bank) => ({
      id: bank.id,
      bin: (bank.attributes as any)?.bin || bank.code,
      label: bank.name,
      image: bank.logoUrl,
      value: bank.code,
    }));
  }, [banks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Thông tin tài khoản ngân hàng
        </CardTitle>
        <CardDescription>Thông tin tài khoản nhận lương/thưởng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngân hàng</FormLabel>
                <FormControl>
                  <Combobox
                    options={bankOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Chọn ngân hàng..."
                    searchPlaceholder="Tìm tên ngân hàng..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bankBranch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh ngân hàng</FormLabel>
                <FormControl>
                  <Input placeholder="VD: CN Hoàn Kiếm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số tài khoản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="accountHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chủ tài khoản</FormLabel>
                <FormControl>
                  <Input
                    placeholder="TÊN CHỦ TÀI KHOẢN"
                    className="uppercase"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
