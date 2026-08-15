import {
  Badge,
  Card,
  Editor,
  Label,
  MultiSelect,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SerializedEditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Shield,
} from "lucide-react";

import { standardsOptions } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

interface FertilizerSafetyLegalStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

const STANDARDS_META: Record<
  string,
  { emoji: string; color: string; desc: string }
> = {
  "VietGAP": {
    emoji: "🇻🇳",
    color: "bg-red-50 border-red-200 text-red-800",
    desc: "Thực hành nông nghiệp tốt Việt Nam",
  },
  "GlobalG.A.P": {
    emoji: "🌍",
    color: "bg-green-50 border-green-200 text-green-800",
    desc: "Tiêu chuẩn toàn cầu về an toàn thực phẩm",
  },
  "Organic (hữu cơ)": {
    emoji: "🌿",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    desc: "Không dùng hóa chất tổng hợp",
  },
  "EU MRL (Tiêu chuẩn dư lượng EU)": {
    emoji: "🇪🇺",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    desc: "Giới hạn dư lượng thuốc/phân thị trường EU",
  },
  "FDA (Mỹ)": {
    emoji: "🇺🇸",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    desc: "Tiêu chuẩn an toàn thực phẩm Hoa Kỳ",
  },
  "HACCP": {
    emoji: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    desc: "Phân tích mối nguy & kiểm soát điểm tới hạn",
  },
  "ISO 22000": {
    emoji: "📋",
    color: "bg-slate-50 border-slate-200 text-slate-800",
    desc: "Hệ thống quản lý an toàn thực phẩm ISO",
  },
};

export default function FertilizerSafetyLegalStep({
  formData,
  updateField,
}: FertilizerSafetyLegalStepProps) {
  const { data: apiStandards } = useQuery({
    queryKey: ["certificate-standards"],
    queryFn: () => farmSupplyApi.listCertificateStandards(),
    staleTime: 5 * 60 * 1000,
  });

  const standardsMultiOptions =
    apiStandards && apiStandards.length > 0
      ? apiStandards.map((c: any) => ({ label: c.name, value: c.name }))
      : standardsOptions.map((std) => ({
          label: std,
          value: std,
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
            placeholder="Mô tả mức độ kích ứng da, niêm mạc, độc tính khi nuốt phải hoặc ảnh hưởng sinh vật thủy sinh..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Biện pháp phòng hộ
          </Label>
          <Textarea
            value={formData.protectiveMeasures}
            onChange={(e) => updateField("protectiveMeasures", e.target.value)}
            placeholder={"• Hô hấp: Khẩu trang chống bụi mịn\n• Tay: Găng tay cao su khi rải phân bón\n• Chân: Ủng bảo hộ nông nghiệp\n• Vệ sinh: Rửa sạch tay chân sau khi bón phân..."}
            rows={4}
          />
        </div>
      </div>

      {/* Card: First Aid (Rich Text Editor) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-500" />
          Xử lý khi ngộ độc (Hướng dẫn sơ cứu)
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
          <BookOpen className="w-5 h-5 text-primary" />
          Pháp lý & Tiêu chuẩn đáp ứng
        </h3>

        {/* Legal Status */}
        <div className="space-y-2">
          <Label>Tình trạng pháp lý tại Việt Nam</Label>
          <Select
            value={formData.legalStatus}
            onValueChange={(value) => updateField("legalStatus", value as any)}
          >
            <SelectTrigger className="w-full text-left">
              <SelectValue placeholder="Chọn tình trạng pháp lý..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allowed">Được phép lưu hành</SelectItem>
              <SelectItem value="restricted">Hạn chế sử dụng</SelectItem>
              <SelectItem value="banned">Cấm sử dụng</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={formData.legalDescription || ""}
            onChange={(e) => updateField("legalDescription", e.target.value)}
            placeholder="Mô tả tình trạng pháp lý hoặc số quyết định lưu hành..."
            rows={2}
          />
        </div>

        {/* Standards Compliance MultiSelect */}
        <div className="space-y-3">
          <Label>Tiêu chuẩn đáp ứng</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Chọn các chứng nhận/tiêu chuẩn quy trình sản xuất phân bón đạt được
          </p>
          <MultiSelect
            options={standardsMultiOptions}
            value={formData.standardsCompliance || []}
            onChange={(value) => updateField("standardsCompliance", value)}
            placeholder="Chọn tiêu chuẩn đáp ứng..."
          />

          {/* Render standards cards */}
          {formData.standardsCompliance && formData.standardsCompliance.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {formData.standardsCompliance.map((std) => {
                const meta = STANDARDS_META[std];
                return (
                  <div
                    key={std}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium ${
                      meta?.color ?? "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="text-xl shrink-0">{meta?.emoji ?? "📄"}</span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{std}</p>
                      {meta?.desc && (
                        <p className="text-xs opacity-70 truncate">{meta.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
