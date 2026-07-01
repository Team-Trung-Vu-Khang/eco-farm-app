import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";

export function StatusCard() {
  const { control } = useFormContext<PersonnelFormValues>();

  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái làm việc</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
