import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PositionGroupFormData } from "../types";

interface PositionGroupFormProps {
  formData: PositionGroupFormData;
  onChange: (updates: Partial<PositionGroupFormData>) => void;
}

export function PositionGroupForm({
  formData,
  onChange,
}: PositionGroupFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pg-code">
          Mã nhóm <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="pg-code"
          value={formData.code}
          onChange={(e) => onChange({ code: e.target.value })}
          placeholder="VD: GRP-MNG, GRP-TECH..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pg-name">
          Tên nhóm <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="pg-name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="VD: Nhóm quản lý – điều hành"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pg-description">Mô tả</Label>
        <Input
          id="pg-description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Mô tả ngắn về nhóm chức vụ này"
        />
      </div>
    </div>
  );
}
