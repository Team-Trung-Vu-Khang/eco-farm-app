import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BusinessLineFormInput } from "../data/business-line.schema";

interface BusinessLineFormProps {
  isEdit: boolean;
  register: UseFormRegister<BusinessLineFormInput>;
  errors: FieldErrors<BusinessLineFormInput>;
}

export const BusinessLineForm = ({
  register,
  isEdit,
  errors,
}: BusinessLineFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Mã</Label>
          <Input
            id="code"
            disabled={isEdit}
            clearable={!isEdit}
            placeholder="VD: SX, CB, TM..."
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
            placeholder="VD: Sản xuất, Chế biến..."
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
