import {
  Badge,
  Card,
  Editor,
  Label,
  MultiSelect,
  Textarea,
  type SerializedEditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Shield,
} from "lucide-react";
import { initialEditorValue } from "../../docs/mocks";
import { standardsOptions } from "../data/constants";
import type { PesticideFormData } from "../types";

interface PesticideSafetyLegalStepProps {
  formData: PesticideFormData;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

/** Metadata hiển thị logo / màu cho từng tiêu chuẩn */
const STANDARDS_META: Record<
  string,
  { emoji: string; color: string; country?: string; desc: string }
> = {
  VietGAP: {
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
    desc: "Giới hạn dư lượng thuốc thị trường EU",
  },
  "FDA (Mỹ)": {
    emoji: "🇺🇸",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    desc: "Tiêu chuẩn an toàn thực phẩm Hoa Kỳ",
  },
  HACCP: {
    emoji: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    desc: "Phân tích mối nguy & kiểm soát điểm tới hạn",
  },
  "ISO 22000": {
    emoji: "📋",
    color: "bg-slate-50 border-slate-200 text-slate-800",
    desc: "Hệ thống quản lý an toàn thực phẩm ISO",
  },
  "ASC (Thủy sản)": {
    emoji: "🐟",
    color: "bg-cyan-50 border-cyan-200 text-cyan-800",
    desc: "Hội đồng Quản lý Nuôi trồng Thủy sản",
  },
  "MSC (Thủy sản tự nhiên)": {
    emoji: "🌊",
    color: "bg-teal-50 border-teal-200 text-teal-800",
    desc: "Hội đồng Biển Quốc tế",
  },
  "4C (Cà phê)": {
    emoji: "☕",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    desc: "Tiêu chuẩn cà phê bền vững 4C",
  },
};

const standardsMultiOptions = standardsOptions.map((std) => ({
  label: std,
  value: std,
}));

export default function PesticideSafetyLegalStep({
  formData,
  onFormFieldChange,
}: PesticideSafetyLegalStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Thông tin độc tính */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Thông tin độc tính
        </h3>

        <div className="space-y-2">
          <Label>Độc tính với người, động vật, môi trường</Label>
          <Textarea
            value={formData.toxicityInfo}
            onChange={(e) => onFormFieldChange("toxicityInfo", e.target.value)}
            placeholder="Cấp tính, mãn tính, ảnh hưởng ong, cá, động vật thủy sinh..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            Biện pháp phòng hộ
          </Label>
          <Textarea
            value={formData.protectiveMeasures}
            onChange={(e) =>
              onFormFieldChange("protectiveMeasures", e.target.value)
            }
            placeholder={
              "• Hô hấp: Khẩu trang / mặt nạ\n• Mắt: Kính bảo hộ\n• Tay: Găng tay\n• Cơ thể: Quần áo bảo hộ, tạp dề\n• Chân: Ủng"
            }
            rows={5}
          />
        </div>
      </div>

      {/* Card: Sơ cứu */}
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
              contentEditableClassname="h-[300px] p-6 focus:outline-none bg-white text-base leading-loose text-slate-700"
              editorSerializedState={
                typeof formData.firstAid === "string" || !formData.firstAid
                  ? (initialEditorValue as unknown as SerializedEditorState)
                  : (formData.firstAid as unknown as SerializedEditorState)
              }
              onSerializedChange={(content) =>
                onFormFieldChange("firstAid", content as unknown as string)
              }
            />
          </Card>
        </div>
      </div>

      {/* Card: Pháp lý & Tiêu chuẩn */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Pháp lý & Tiêu chuẩn đáp ứng
        </h3>

        {/* Tình trạng pháp lý */}
        <div className="space-y-2">
          <Label>Tình trạng pháp lý</Label>
          <div className="flex gap-2 flex-wrap">
            {["Được phép lưu hành", "Hạn chế sử dụng", "Cấm sử dụng"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onFormFieldChange("legalStatus", status)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.legalStatus === status
                      ? status === "Cấm sử dụng"
                        ? "bg-red-100 border-red-400 text-red-700"
                        : status === "Hạn chế sử dụng"
                          ? "bg-orange-100 border-orange-400 text-orange-700"
                          : "bg-green-100 border-green-400 text-green-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {status === "Được phép lưu hành" && (
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                  )}
                  {status}
                </button>
              ),
            )}
          </div>
          <Textarea
            value={formData.legalStatus}
            onChange={(e) => onFormFieldChange("legalStatus", e.target.value)}
            placeholder="Chi tiết tình trạng pháp lý tại Việt Nam..."
            rows={2}
          />
        </div>

        {/* Tiêu chuẩn đáp ứng – MultiSelect + logo cards */}
        <div className="space-y-3">
          <Label>Tiêu chuẩn đáp ứng</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Chọn các tiêu chuẩn sản xuất và thị trường phù hợp
          </p>
          <MultiSelect
            options={standardsMultiOptions}
            value={formData.standardsCompliance}
            onChange={(value) =>
              onFormFieldChange("standardsCompliance", value)
            }
            placeholder="Chọn tiêu chuẩn đáp ứng..."
          />

          {/* Logo cards cho các tiêu chuẩn đã chọn */}
          {formData.standardsCompliance.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {formData.standardsCompliance.map((std) => {
                const meta = STANDARDS_META[std];
                return (
                  <div
                    key={std}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium ${
                      meta?.color ??
                      "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="text-xl shrink-0">
                      {meta?.emoji ?? "📄"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{std}</p>
                      {meta?.desc && (
                        <p className="text-xs opacity-70 truncate">
                          {meta.desc}
                        </p>
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
