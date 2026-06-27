import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { EnterpriseFormInput } from "../data/enterprise-form.schema";

interface EnterpriseTypeFormProps {
  register: UseFormRegister<EnterpriseFormInput>;
  errors: FieldErrors<EnterpriseFormInput>;
}

export const EnterpriseTypeForm = ({
  register,
  errors,
}: EnterpriseTypeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code" required>
            Mã
          </Label>
          <Input
            id="code"
            placeholder="VD: HTX, SX, CB..."
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
            placeholder="VD: Hợp tác xã, Sản xuất..."
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
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
