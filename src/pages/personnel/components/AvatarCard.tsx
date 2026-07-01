import {
  Card,
  CardContent,
  FormField,
  FormItem,
  FormControl,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { User } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";

export function AvatarCard() {
  const { control, setValue } = useFormContext<PersonnelFormValues>();

  return (
    <Card>
      <CardContent className="pt-6 pb-6 flex flex-col items-center">
        <FormField
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden group cursor-pointer mb-4 hover:border-primary transition-colors">
                  {field.value ? (
                    <img 
                      src={field.value} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                    <span className="text-xs text-white">Thay đổi</span>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setValue("avatarUrl", url, { shouldValidate: true, shouldDirty: true });
                        setValue("avatarFile", file, { shouldDirty: true });
                      }
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground text-center">
          Hỗ trợ định dạng JPG, PNG. Tối đa 2MB.
        </p>
      </CardContent>
    </Card>
  );
}
