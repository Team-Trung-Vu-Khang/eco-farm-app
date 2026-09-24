import { farmSupplyApi } from "@/features/farm-supply";
import {
  Card,
  Editor,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  type SerializedEditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, HeartPulse, Shield } from "lucide-react";
import type { ByProductFormData } from "../../types/types";

interface ByProductSafetyLegalStepProps {
  formData: ByProductFormData;
  updateField: (field: keyof ByProductFormData, value: any) => void;
}

export const ByProductSafetyLegalStep = ({
  formData,
  updateField,
}: ByProductSafetyLegalStepProps) => {
  const { data: apiStandards } = useQuery({
    queryKey: ["certificate-standards"],
    queryFn: () => farmSupplyApi.listCertificateStandards(),
    staleTime: 5 * 60 * 1000,
  });

  const standardsMultiOptions = (apiStandards ?? []).map((c: any) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Toxicity & Protection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          An toàn lao động & Độc tính
        </h3>

        <div className="space-y-2">
          <Label>Độc tính với người, động vật và nguồn nước</Label>
          <Textarea
            value={formData.toxicityInfo}
            onChange={(e) => updateField("toxicityInfo", e.target.value)}
            placeholder="Mô tả mức độ kích ứng da, niêm mạc, độc tính sinh ra trong quá trình ủ hoặc bảo quản..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">Biện pháp phòng hộ</Label>
          <Textarea
            value={formData.protectiveMeasures}
            onChange={(e) => updateField("protectiveMeasures", e.target.value)}
            placeholder={
              "• Hô hấp: Khẩu trang chống bụi mịn / bào tử nấm\n• Tay: Găng tay bảo hộ khi tiếp xúc bã/vỏ bón\n• Vệ sinh: Rửa tay bằng xà phòng sau khi thi công..."
            }
            rows={4}
          />
        </div>
      </div>

      {/* Card: First Aid (Rich Text Editor) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-500" />
          Xử lý sự cố & Hướng dẫn sơ cứu
        </h3>
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-red-100 to-orange-100 rounded-[20px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <Card className="relative overflow-hidden border-2 border-slate-100 shadow-sm focus-within:border-red-500/50 focus-within:ring-4 focus-within:ring-red-500/10 transition-all rounded-2xl bg-white">
            <Editor
              maxLength={200000}
              contentEditableClassname="h-[250px] p-6 focus:outline-none bg-white text-base leading-loose text-slate-700"
              initialHtml={
                typeof formData.firstAid === "string" && formData.firstAid
                  ? formData.firstAid
                  : undefined
              }
              editorSerializedState={
                typeof formData.firstAid !== "string" && formData.firstAid
                  ? (formData.firstAid as unknown as SerializedEditorState)
                  : undefined
              }
              onSerializedChange={(content) =>
                updateField("firstAid", content as unknown as string)
              }
            />
          </Card>
        </div>
      </div>

      {/* Card: Legal & Standards */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Tình trạng Pháp lý & Tiêu chuẩn áp dụng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tình trạng pháp lý lưu hành</Label>
            <Select
              value={formData.legalStatus || "allowed"}
              onValueChange={(val) => updateField("legalStatus", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tình trạng..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allowed">Được phép lưu hành / Sử dụng</SelectItem>
                <SelectItem value="restricted">Hạn chế sử dụng</SelectItem>
                <SelectItem value="banned">Cấm lưu hành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tiêu chuẩn chứng nhận áp dụng</Label>
            <MultiSelect
              options={standardsMultiOptions}
              value={formData.standardsCompliance || []}
              onChange={(value) => updateField("standardsCompliance", value)}
              placeholder="Chọn các tiêu chuẩn (VietGAP, Organic...)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ghi chú chi tiết về pháp lý & kiểm định</Label>
          <Textarea
            value={formData.legalDescription}
            onChange={(e) => updateField("legalDescription", e.target.value)}
            placeholder="Căn cứ pháp lý, kết quả phân tích mẫu kiểm định độc tính, quy chuẩn kỹ thuật quốc gia..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
