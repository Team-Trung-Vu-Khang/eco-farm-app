import {
  Card,
  CardContent,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Info, Sprout } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CreateSeedFormValues } from "../schemas/createSeedSchema";

export function SeedIdentityStep() {
  const { control } = useFormContext<CreateSeedFormValues>();

  const varietyCode = useWatch({ control, name: "varietyCode" });
  const varietyName = useWatch({ control, name: "varietyName" });
  const cropName = useWatch({ control, name: "cropName" });

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="mb-2 flex items-center gap-2 border-b border-slate-200/60 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Hash className="h-4 w-4" />
              </div>
              <Label className="text-base font-bold text-slate-700">
                Thông tin định danh hạt giống
              </Label>
            </div>

            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mã giống (Tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      clearable={false}
                      placeholder="Mã giống tự động tạo nếu bỏ trống"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tên hạt giống <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên giống riêng" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="mb-2 flex items-center gap-2 border-b border-slate-200/60 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Sprout className="h-4 w-4" />
              </div>
              <Label className="text-base font-bold text-slate-700">
                Thông tin giống gốc
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tên giống
                </Label>
                <div className="text-lg font-bold text-slate-800">
                  {varietyName}
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Loại cây
                </Label>
                <div className="text-lg font-bold text-slate-800">
                  {cropName}
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Mã giống gốc
                </Label>
                <div className="text-base font-mono font-medium text-slate-800">
                  {varietyCode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-700">
            Thông tin giống gốc được bảo vệ
          </p>
          <p className="text-xs text-blue-600/80">
            Các thông tin cơ bản về giống cây trồng gốc kế thừa từ cơ sở dữ liệu
            danh mục của hệ thống và không thể chỉnh sửa trực tiếp từ đây.
          </p>
        </div>
      </div>
    </div>
  );
}
