import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EquipmentGroupFormData } from "../types";

interface EquipmentGroupFormProps {
  formData: EquipmentGroupFormData;
  onChange: (updates: Partial<EquipmentGroupFormData>) => void;
}

export const EquipmentGroupForm = ({
  formData,
  onChange,
}: EquipmentGroupFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã nhóm</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="VD: TRACTOR, TOOL..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên nhóm</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="VD: Máy cày..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Mô tả chi tiết về nhóm máy móc..."
          rows={3}
        />
      </div>
    </div>
  );
};
