import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ByProductFormData } from "../../types/types";

interface ByProductSafetyStepProps {
  formData: ByProductFormData;
  updateField: (
    field: keyof ByProductFormData,
    value: ByProductFormData[keyof ByProductFormData],
  ) => void;
}

export function ByProductSafetyStep({
  formData,
  updateField,
}: ByProductSafetyStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-slate-800 border-b pb-2">
          Thông tin An toàn &amp; Pháp lý
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tình trạng pháp lý</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.legalStatus}
              onChange={(e) => updateField("legalStatus", e.target.value as any)}
            >
              <option value="allowed">Được phép lưu hành</option>
              <option value="restricted">Hạn chế sử dụng</option>
              <option value="banned">Cấm sử dụng</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Mô tả tình trạng pháp lý</Label>
            <Input
              value={formData.legalDescription}
              onChange={(e) => updateField("legalDescription", e.target.value)}
              placeholder="VD: Được phép lưu hành và sử dụng trong nông nghiệp..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Thông tin độc tính &amp; An toàn môi trường</Label>
          <Textarea
            value={formData.toxicityInfo}
            onChange={(e) => updateField("toxicityInfo", e.target.value)}
            placeholder="Nhập thông tin độc tính, cảnh báo môi trường..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Biện pháp bảo hộ lao động</Label>
          <Textarea
            value={formData.protectiveMeasures}
            onChange={(e) => updateField("protectiveMeasures", e.target.value)}
            placeholder="VD: Đeo khẩu trang, găng tay khi thao tác phối trộn..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
