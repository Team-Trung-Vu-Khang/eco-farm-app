import { farmSupplyApi } from "@/features/farm-supply";
import {
  Input,
  Label,
  MultiSelect,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useQuery } from "@tanstack/react-query";
import { Droplets } from "lucide-react";
import type { ByProductFormData } from "../../types/types";

interface ByProductUsageStepProps {
  formData: ByProductFormData;
  updateField: (field: keyof ByProductFormData, value: any) => void;
}

export const ByProductUsageStep = ({
  formData,
  updateField,
}: ByProductUsageStepProps) => {
  const { data: apiSubjects } = useQuery({
    queryKey: ["target-subjects", "CROP"],
    queryFn: () => farmSupplyApi.getTargetSubjects("CROP"),
    staleTime: 5 * 60 * 1000,
  });

  const cropMultiOptions = (apiSubjects ?? []).map((s: any) => ({
    label: s.name,
    value: s.name,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Usage Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          Hướng dẫn & Đối tượng sử dụng phụ phẩm
        </h3>

        <div className="space-y-2">
          <Label>Công dụng / Chỉ định</Label>
          <Textarea
            value={formData.indications}
            onChange={(e) => updateField("indications", e.target.value)}
            placeholder="Mô tả tác dụng cải tạo đất, cung cấp chất hữu cơ, giữ ẩm hay phối trộn phân bón..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Giai đoạn tác động</Label>
            <Input
              value={formData.effectStage || formData.applicationStage}
              onChange={(e) => {
                updateField("effectStage", e.target.value);
                updateField("applicationStage", e.target.value);
              }}
              placeholder="VD: Cải tạo đất trước mùa gieo trồng, bón lót, phủ gốc giữ ẩm..."
            />
          </div>
          <div className="space-y-2">
            <Label>Hạn sử dụng</Label>
            <Input
              value={formData.shelfLife}
              onChange={(e) => updateField("shelfLife", e.target.value)}
              placeholder="VD: 12 tháng, 2 năm kể từ ngày sản xuất/ủ..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Đối tượng sử dụng (cây trồng áp dụng)</Label>
          <MultiSelect
            options={cropMultiOptions}
            value={formData.targetCrops || []}
            onChange={(value) => updateField("targetCrops", value)}
            placeholder="Chọn các loại cây trồng..."
          />
        </div>

        <div className="space-y-2">
          <Label>Liều lượng khuyến cáo</Label>
          <Textarea
            value={formData.recommendedDosage}
            onChange={(e) => updateField("recommendedDosage", e.target.value)}
            placeholder="VD: Cây công nghiệp: 2-3 kg/gốc. Rau màu: 500-800 kg/1000m2/vụ."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Cách dùng (Phương thức sử dụng)</Label>
          <Textarea
            value={formData.applicationMethod}
            onChange={(e) => updateField("applicationMethod", e.target.value)}
            placeholder="VD: Bón lót trước khi gieo trồng, rải xung quanh tán cây rồi xới nhẹ, phối trộn cùng phân bón vi sinh..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Lưu ý khi sử dụng</Label>
          <Textarea
            value={formData.usageNotes}
            onChange={(e) => updateField("usageNotes", e.target.value)}
            placeholder="VD: Không nên bón bã tươi trực tiếp cho cây con khi chưa ủ hoai; bảo quản nơi khô ráo..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
