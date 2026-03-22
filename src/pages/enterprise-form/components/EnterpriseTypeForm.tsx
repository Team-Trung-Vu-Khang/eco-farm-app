import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseTypeFormData } from "../types";

interface EnterpriseTypeFormProps {
  formData: EnterpriseTypeFormData;
  onChange: (data: Partial<EnterpriseTypeFormData>) => void;
}

export const EnterpriseTypeForm = ({
  formData,
  onChange,
}: EnterpriseTypeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="VD: HTX, SX, CB..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="VD: Hợp tác xã, Sản xuất..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Mô tả chi tiết..."
          rows={3}
        />
      </div>
    </div>
  );
};
