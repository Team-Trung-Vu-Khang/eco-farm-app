import { useEffect, useState } from "react";
import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  FileText,
  AlarmClock,
  Building2,
  Package,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import {
  suppliers,
  nutritionalContentOptions,
  originOptions,
  applicationStageOptions,
  physicalFormOptions,
} from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerConfirmationStepProps {
  formData: FertilizerFormData;
}

function formatLegalStatus(status: string | null | undefined): string {
  if (!status) return "Được phép sử dụng";
  const normalized = status.toLowerCase().trim();
  if (normalized === "allowed") return "Được phép sử dụng";
  if (normalized === "restricted") return "Hạn chế sử dụng";
  if (normalized === "banned") return "Cấm sử dụng";
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

export const FertilizerConfirmationStep = ({
  formData,
}: FertilizerConfirmationStepProps) => {
  const [firstAidHtml, setFirstAidHtml] = useState("");

  useEffect(() => {
    const convert = async () => {
      const html = await safeConvertLexicalToHtml(formData.firstAid);
      setFirstAidHtml(html);
    };
    void convert();
  }, [formData.firstAid]);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin
        </h3>
        <p className="text-green-700 mt-2">
          Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất
        </p>
      </div>

      <div className="space-y-6">
        {/* Bước 1 – Thông tin phân bón */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              Bước 1 – Định danh & Phân loại
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Row label="Mã SKU" value={formData.code} />
              <Row label="Tên thương mại" value={formData.name} />
              <Row label="Số đăng ký" value={formData.registrationNumber} />
              <Row
                label="Tên khoa học"
                value={formData.scientificTechnicalName}
              />
              <Row
                label="Nhóm nguồn gốc"
                value={formData.fertilizerOriginGroup}
              />
              <Row
                label="Thành phần dinh dưỡng"
                value={formData.nutritionalComponents}
              />
              <Row label="Dạng phân" value={formData.fertilizerType} />
              <Row label="Hình thái vật lý" value={formData.physicalForm} />
              <Row label="Nhóm tác động MoA" value={formData.moaGroup} />
              <Row label="Tỷ lệ N-P-K" value={formData.npkRatio} />

              {formData.mainIngredients && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm block mb-1">
                    Thành phần chi tiết:
                  </span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs whitespace-pre-line text-slate-700">
                    {formData.mainIngredients}
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

              {formData.hashtags.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Tags:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.hashtags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bước 2 – Hướng dẫn sử dụng */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
              <AlarmClock className="w-4 h-4 text-slate-500" />
              Bước 2 – Thông tin & Hướng dẫn sử dụng
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {formData.indications && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">
                    Công dụng chính:
                  </span>{" "}
                  <span className="font-medium">{formData.indications}</span>
                </div>
              )}
              <Row
                label="Giai đoạn tác động"
                value={formData.applicationStage}
              />
              <Row
                label="Hạn sử dụng"
                value={formData.shelfLife}
              />
              {formData.targetCrops && formData.targetCrops.length > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">
                    Cây trồng áp dụng:
                  </span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.targetCrops.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm block mb-1">
                  Liều lượng khuyến cáo:
                </span>
                <p className="bg-slate-50 p-2 border rounded-md whitespace-pre-line text-xs">
                  {formData.recommendedDosage}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm block mb-1">
                  Cách bón:
                </span>
                <p className="bg-slate-50 p-2 border rounded-md whitespace-pre-line text-xs">
                  {formData.applicationMethod}
                </p>
              </div>
              {formData.usageNotes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm block mb-1">
                    Lưu ý khi sử dụng:
                  </span>
                  <p className="bg-amber-50/50 p-2 border border-amber-100 rounded-md text-amber-800 text-xs">
                    {formData.usageNotes}
                  </p>
                </div>
              )}

              {/* PDF Documents */}
              {formData.documents && formData.documents.length > 0 && (
                <div className="col-span-2 mt-2">
                  <span className="text-muted-foreground block mb-2">
                    Tài liệu đính kèm ({formData.documents.length}):
                  </span>
                  <div className="space-y-1.5">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50"
                      >
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <div>
                          <div className="font-medium text-slate-900 text-xs line-clamp-1">
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {(doc.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <div className="grid grid-cols-1 gap-y-3 text-sm">
              {formData.toxicityInfo && (
                <div>
                  <span className="text-muted-foreground">Độc tính:</span>{" "}
                  <span className="font-medium">{formData.toxicityInfo}</span>
                </div>
              )}
              {formData.protectiveMeasures && (
                <div>
                  <span className="text-muted-foreground block mb-1">
                    Biện pháp bảo hộ:
                  </span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border text-xs whitespace-pre-line text-slate-700">
                    {formData.protectiveMeasures}
                  </p>
                </div>
              )}
              {firstAidHtml && (
                <div>
                  <span className="text-muted-foreground block mb-1">
                    Hướng dẫn sơ cứu:
                  </span>
                  <div
                    className="bg-slate-50 p-2.5 rounded-lg border text-xs leading-relaxed text-slate-700 editor-preview-content"
                    dangerouslySetInnerHTML={{ __html: firstAidHtml }}
                  />
                </div>
              )}
              {formData.legalStatus && (
                <div>
                  <span className="text-muted-foreground">
                    Tình trạng pháp lý:
                  </span>{" "}
                  <Badge variant="outline" className="ml-1 bg-white">
                    {formatLegalStatus(formData.legalStatus)}
                  </Badge>
                </div>
              )}
              {formData.standardsCompliance &&
                formData.standardsCompliance.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Tiêu chuẩn nông nghiệp:
                    </span>
                    <div className="inline-flex gap-1 flex-wrap mt-1">
                      {formData.standardsCompliance.map((std) => (
                        <Badge
                          key={std}
                          variant="secondary"
                          className="text-xs"
                        >
                          {std}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                label="Nhà sản xuất / Xuất xứ"
                value={formData.manufacturerOrigin?.name}
              />
              <Row
                label="Nhà nhập khẩu / Đăng ký"
                value={formData.importerRegistrant?.name}
              />
              <Row label="Nhà phân phối chính" value={formData.distributor?.name} />
              <Row label="Giá tham khảo" value={formData.referencePrice} />

              {formData.packagingSpecs &&
                formData.packagingSpecs.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block mb-1.5">
                      Bao bì quy cách:
                    </span>
                    <div className="inline-flex gap-1.5 flex-wrap">
                      {formData.packagingSpecs.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="text-xs bg-slate-50"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Lô kho */}
              {(formData.supplierDetails?.length ?? 0) > 0 && (
                <div className="col-span-2 mt-2">
                  <span className="text-muted-foreground block mb-2">
                    Đăng ký tồn kho ban đầu:
                  </span>
                  <div className="space-y-1">
                    {formData.supplierDetails?.map((item, idx) => {
                      const sup = suppliers.find(
                        (s) => s.id === item.supplierId,
                      );
                      return (
                        <div
                          key={idx}
                          className="flex justify-between p-2 rounded bg-slate-50 text-xs border border-slate-100"
                        >
                          <span className="font-medium text-slate-700">
                            {sup?.name || item.supplierId}
                          </span>
                          <span className="text-slate-600">
                            {item.quantity} {item.unit} ({item.packaging})
                          </span>
                        </div>
                      );
                    })}
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
