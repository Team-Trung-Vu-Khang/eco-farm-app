import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, FileText } from "lucide-react";
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

export const FertilizerConfirmationStep = ({
  formData,
}: FertilizerConfirmationStepProps) => {
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
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Thông tin phân bón
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mã:</span>{" "}
                <span className="font-medium">{formData.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tên:</span>{" "}
                <span className="font-medium">{formData.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Thành phần:</span>{" "}
                <span className="font-medium">
                  {nutritionalContentOptions.find(
                    (o) => o.id === formData.nutritionalContentId,
                  )?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Nguồn gốc:</span>{" "}
                <span className="font-medium">
                  {originOptions.find((o) => o.id === formData.originId)
                    ?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Giai đoạn:</span>{" "}
                <span className="font-medium">
                  {applicationStageOptions.find(
                    (o) => o.id === formData.applicationStageId,
                  )?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Hình thái:</span>{" "}
                <span className="font-medium">
                  {physicalFormOptions.find(
                    (o) => o.id === formData.physicalFormId,
                  )?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Dinh dưỡng:</span>{" "}
                <span className="font-medium">{formData.nutrientContent}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Mô tả:</span>
                <span className="font-medium bg-slate-50 p-2 block rounded border border-slate-100">
                  {formData.description || "Không có mô tả"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Tags:</span>{" "}
                <div className="inline-flex gap-1 flex-wrap mt-1">
                  {formData.hashtags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Hướng dẫn sử dụng
            </h4>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-2">
                  Nội dung hướng dẫn:
                </span>
                {formData.usage ? (
                  <div
                    className="prose prose-sm max-w-none bg-slate-50 p-4 rounded-lg border border-slate-100 editor-content"
                    dangerouslySetInnerHTML={{ __html: formData.usage }}
                  />
                ) : (
                  <span className="font-medium bg-slate-50 p-2 block rounded border border-slate-100">
                    Không có nội dung
                  </span>
                )}
              </div>

              {formData.documents && formData.documents.length > 0 && (
                <div>
                  <span className="text-muted-foreground block mb-2">
                    Tài liệu đính kèm ({formData.documents.length}):
                  </span>
                  <div className="space-y-2">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                      >
                        <FileText className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <div className="font-medium text-slate-900 line-clamp-1">
                            {doc.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
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

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Thông tin cung ứng ({formData.supplierDetails.length})
            </h4>
            <div className="space-y-2">
              {formData.supplierDetails.map((item, idx) => {
                const supInfo = suppliers.find((s) => s.id === item.supplierId);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 text-sm"
                  >
                    <span className="font-medium text-slate-900">
                      {idx + 1}. {supInfo?.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unit} / {item.packaging}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
