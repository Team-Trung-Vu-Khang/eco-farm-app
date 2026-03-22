import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseGroupFormData } from "../types";

interface EnterpriseGroupFormProps {
  formData: EnterpriseGroupFormData;
  onChange: (updates: Partial<EnterpriseGroupFormData>) => void;
}

export const EnterpriseGroupForm = ({
  formData,
  onChange,
}: EnterpriseGroupFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">
            Mã nhóm <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="VD: DN, HTX..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên nhóm <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="VD: Nhóm Doanh nghiệp..."
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

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <select
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.status}
          onChange={(e) =>
            onChange({ status: e.target.value as "active" | "inactive" })
          }
        >
          <option value="active">Đang sử dụng</option>
          <option value="inactive">Ngưng sử dụng</option>
        </select>
      </div>
    </div>
  );
};
