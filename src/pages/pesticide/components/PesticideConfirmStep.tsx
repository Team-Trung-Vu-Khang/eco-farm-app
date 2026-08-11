import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlarmClock, Building2, CheckCircle2, Package, ShieldAlert } from "lucide-react";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { toxicityLevels } from "../data/constants";
import type { PesticideDomain, PesticideFormData } from "../types";

interface PesticideConfirmStepProps {
  formData: PesticideFormData;
  domain?: PesticideDomain;
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="col-span-1">
      <span className="text-muted-foreground text-sm">{label}:</span>{" "}
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

export default function PesticideConfirmStep({ formData, domain }: PesticideConfirmStepProps) {
  const [firstAidHtml, setFirstAidHtml] = useState("");

  useEffect(() => {
    const convert = async () => {
      const html = await safeConvertLexicalToHtml(formData.firstAid);
      setFirstAidHtml(html);
    };
    void convert();
  }, [formData.firstAid]);

  const toxLabel = toxicityLevels.find((t) => t.value === formData.toxicityLevel);
  const toxColorMap: Record<string, string> = {
    Ia: "bg-red-100 text-red-700",
    Ib: "bg-orange-100 text-orange-700",
    II: "bg-yellow-100 text-yellow-700",
    III: "bg-blue-100 text-blue-700",
    U: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">Xác nhận thông tin</h3>
        <p className="text-green-700 mt-2">Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất</p>
      </div>

      <div className="space-y-4">
        {/* Bước 1 – Định danh */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              Bước 1 – Thông tin định danh & phân loại
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Row label="Mã SKU" value={formData.code} />
              <Row label="Tên thương mại" value={formData.name} />
              <Row label="Số đăng ký" value={formData.registrationNumber} />
              <Row label="Hàm lượng" value={formData.concentration} />
              <Row label="Nhóm phân loại" value={formData.group} />
              <Row label="Dạng bào chế" value={formData.form} />
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm">Hoạt chất:</span>{" "}
                <span className="font-medium text-sm">{formData.activeIngredient}</span>
              </div>
              <Row label="Cách xâm nhập" value={formData.actionType} />
              <Row label="Nhóm MoA" value={formData.moaGroup} />
              {formData.toxicityLevel && (
                <div className="col-span-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span className="text-muted-foreground text-sm">Nhóm độc:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${toxColorMap[formData.toxicityLevel] ?? ""}`}>
                    {toxLabel?.label ?? formData.toxicityLevel}
                  </span>
                </div>
              )}
              {formData.hashtags.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Tags:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bước 2 – Sử dụng */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <AlarmClock className="w-4 h-4" />
              Bước 2 – Thông tin sử dụng
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {formData.indications && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Công dụng:</span>{" "}
                  <span className="font-medium text-sm">{formData.indications}</span>
                </div>
              )}
              {formData.targetEntities.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Đối tượng:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.targetEntities.map((e) => (
                      <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Row label="Liều lượng" value={formData.recommendedDosage} />
              <Row label="Cách dùng" value={formData.applicationMethod} />
              {formData.phi && <Row label="Thời gian cách ly (PHI)" value={`${formData.phi} ngày`} />}
              {formData.maxUsage && (
                <Row
                  label="Số lần tối đa"
                  value={`${formData.maxUsage} ${
                    domain === "animal" || domain === "aquaculture"
                      ? "lần/chu kỳ nuôi"
                      : "lần/vụ"
                  }`}
                />
              )}
              <Row label="Hạn sử dụng" value={formData.shelfLife} />
            </div>
          </CardContent>
        </Card>

        {/* Bước 3 – An toàn */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Bước 3 – An toàn & Pháp lý
            </h4>
            <div className="grid grid-cols-1 gap-y-3">
              {formData.toxicityInfo && (
                <div>
                  <span className="text-muted-foreground text-sm">Độc tính:</span>{" "}
                  <span className="font-medium text-sm">{formData.toxicityInfo}</span>
                </div>
              )}
              {formData.legalStatus && (
                <div>
                  <span className="text-muted-foreground text-sm">Pháp lý:</span>{" "}
                  <span className="font-medium text-sm">{formData.legalStatus}</span>
                </div>
              )}
              {firstAidHtml && (
                <div>
                  <span className="text-muted-foreground text-sm">Sơ cứu khi ngộ độc:</span>
                  <div
                    className="mt-1 text-sm bg-slate-50 border p-3 rounded-lg leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: firstAidHtml }}
                  />
                </div>
              )}
              {formData.standardsCompliance && formData.standardsCompliance.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm">Tiêu chuẩn:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.standardsCompliance.map((std) => (
                      <Badge key={std} variant="secondary" className="text-xs">{std}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bước 4 – Cung ứng */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bước 4 – Xuất xứ & Cung ứng
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Row label="Nhà sản xuất" value={formData.manufacturerOrigin} />
              <Row label="Nhà nhập khẩu" value={formData.importerRegistrant} />
              <Row label="Nhà phân phối" value={formData.distributor} />
              <Row label="Giá tham khảo" value={formData.referencePrice} />
              {formData.packagingSpecs.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Quy cách:
                  </span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.packagingSpecs.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
