import { safeConvertLexicalToHtml } from "@/utils/commons";
import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  CheckCircle2,
  Droplets,
  FileText,
  Package,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ByProductFormData } from "../../types/types";

interface ByProductConfirmationStepProps {
  formData: ByProductFormData;
}

function formatLegalStatus(status: string | null | undefined): string {
  if (!status) return "Được phép sử dụng";
  const normalized = status.toLowerCase().trim();
  if (normalized === "allowed") return "Được phép lưu hành / Sử dụng";
  if (normalized === "restricted") return "Hạn chế sử dụng";
  if (normalized === "banned") return "Cấm lưu hành";
  return status;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="col-span-1">
      <span className="text-muted-foreground text-sm">{label}:</span>{" "}
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

export const ByProductConfirmationStep = ({
  formData,
}: ByProductConfirmationStepProps) => {
  const [firstAidHtml, setFirstAidHtml] = useState("");

  useEffect(() => {
    const convert = async () => {
      const html = await safeConvertLexicalToHtml(formData.firstAid);
      setFirstAidHtml(html);
    };
    void convert();
  }, [formData.firstAid]);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300 space-y-6">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin phụ phẩm
        </h3>
        <p className="text-green-700 mt-2">
          Vui lòng kiểm tra kỹ thông tin phụ phẩm trước khi hoàn tất lưu dữ liệu
        </p>
      </div>

      <div className="space-y-6">
        {/* Bước 1 – Định danh & Phân loại */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              Bước 1 – Định danh & Phân loại
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Row label="Mã SKU" value={formData.code} />
              <Row label="Tên phụ phẩm" value={formData.name} />
              <Row label="Số đăng ký" value={formData.registrationNumber} />
              <Row
                label="Tên khoa học"
                value={formData.scientificTechnicalName}
              />

              <div className="col-span-2 space-y-2">
                <span className="text-muted-foreground text-sm block">
                  Danh mục phân loại:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.byProductOrigins || []).map((item) => (
                    <Badge key={`origin-${item}`} variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                      Nguồn gốc: {item}
                    </Badge>
                  ))}
                  {(formData.byProductPhysicoChemicals || []).map((item) => (
                    <Badge key={`physico-${item}`} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      Đặc tính: {item}
                    </Badge>
                  ))}
                  {(formData.byProductToxicityRegulations || []).map((item) => (
                    <Badge key={`tox-${item}`} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      Quy chuẩn: {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {formData.detailedComposition && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm block mb-1">
                    Thành phần chi tiết & Hàm lượng:
                  </span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs whitespace-pre-line text-slate-700">
                    {formData.detailedComposition}
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <span className="text-muted-foreground text-sm block mb-1">
                  Mô tả tóm tắt:
                </span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700">
                  {formData.description || "Không có mô tả"}
                </div>
              </div>

              {formData.hashtags && formData.hashtags.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Hashtags:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.hashtags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="text-xs"
                      >
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bước 2 – Thông tin sử dụng */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-slate-500" />
              Bước 2 – Thông tin sử dụng
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Row label="Giai đoạn tác động" value={formData.effectStage || formData.applicationStage} />
              <Row label="Hạn sử dụng" value={formData.shelfLife} />
              <div className="col-span-2">
                <Row label="Công dụng / Chỉ định" value={formData.indications} />
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm">Đối tượng sử dụng (Cây trồng):</span>{" "}
                <div className="inline-flex gap-1 flex-wrap mt-1">
                  {(formData.targetCrops || []).map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                  {(!formData.targetCrops || formData.targetCrops.length === 0) && (
                    <span className="text-slate-400 text-sm font-normal">Chưa chọn</span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <Row label="Liều lượng khuyến cáo" value={formData.recommendedDosage} />
              </div>
              <div className="col-span-2">
                <Row label="Phương thức sử dụng / Cách dùng" value={formData.applicationMethod} />
              </div>
              <div className="col-span-2">
                <Row label="Lưu ý khi sử dụng" value={formData.usageNotes} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bước 3 – An toàn & Pháp lý */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              Bước 3 – An toàn & Pháp lý
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm">Tình trạng pháp lý:</span>{" "}
                <Badge variant="outline" className="text-xs ml-1">
                  {formatLegalStatus(formData.legalStatus)}
                </Badge>
              </div>
              <div className="col-span-2">
                <Row label="Độc tính" value={formData.toxicityInfo} />
              </div>
              <div className="col-span-2">
                <Row label="Biện pháp phòng hộ" value={formData.protectiveMeasures} />
              </div>

              {firstAidHtml && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm block mb-1">
                    Hướng dẫn sơ cứu & Sự cố:
                  </span>
                  <div
                    className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-xs text-slate-700 prose prose-xs max-w-none"
                    dangerouslySetInnerHTML={{ __html: firstAidHtml }}
                  />
                </div>
              )}

              {formData.standardsCompliance && formData.standardsCompliance.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Tiêu chuẩn áp dụng:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.standardsCompliance.map((std) => (
                      <Badge key={std} variant="secondary" className="text-xs bg-emerald-50 text-emerald-800">
                        {std}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <Row label="Mô tả chi tiết pháp lý" value={formData.legalDescription} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bước 4 – Xuất xứ & Cung ứng */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Bước 4 – Xuất xứ & Cung ứng
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Row
                label="Nhà sản xuất / Nơi phát sinh"
                value={formData.manufacturerOrigin?.name}
              />
              <Row
                label="Nhà nhập khẩu / Chứng nhận"
                value={formData.importerRegistrant?.name}
              />
              <Row
                label="Nhà phân phối"
                value={formData.distributor?.name}
              />
              <Row label="Giá tham khảo" value={formData.referencePrice} />

              <div className="col-span-2">
                <span className="text-muted-foreground text-sm block mb-1">
                  Quy cách đóng gói & Đơn vị:
                </span>
                {formData.packagingSpecs && formData.packagingSpecs.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.packagingSpecs.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs px-2.5 py-1">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm font-normal">Chưa cấu hình</span>
                )}
              </div>

              {formData.documents && formData.documents.length > 0 && (
                <div className="col-span-2 pt-2">
                  <span className="text-muted-foreground text-sm block mb-1">
                    Tài liệu đính kèm ({formData.documents.length}):
                  </span>
                  <div className="space-y-1">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-slate-700">{doc.name}</span>
                      </div>
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
};
