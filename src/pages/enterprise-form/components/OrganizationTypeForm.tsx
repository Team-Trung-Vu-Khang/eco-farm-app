import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { OrganizationTypeFormInput } from "../data/organization-type.schema";

interface OrganizationTypeFormProps {
  control: Control<OrganizationTypeFormInput>;
  register: UseFormRegister<OrganizationTypeFormInput>;
  errors: FieldErrors<OrganizationTypeFormInput>;
}

export const OrganizationTypeForm = ({
  control,
  register,
  errors,
}: OrganizationTypeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code" required>
            Mã
          </Label>
          <Input
            id="code"
            placeholder="VD: HTX, DN..."
            {...register("code")}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên
          </Label>
          <Input
            id="name"
            placeholder="VD: Hợp tác xã, Doanh nghiệp..."
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" required>
          Nhóm đơn vị
        </Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Chọn nhóm đơn vị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                <SelectItem value="farm_household">Nông hộ</SelectItem>
                <SelectItem value="cooperative">Hợp tác xã</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          placeholder="Mô tả chi tiết..."
          rows={3}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        ) : null}
      </div>
    </div>
  );
};
