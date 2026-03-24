import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2 } from "lucide-react";
import { suppliers } from "../data/constants";
import type { MaterialFormData } from "../types/types";

interface MaterialConfirmStepProps {
  formData: MaterialFormData;
}

export default function MaterialConfirmStep({
  formData,
}: MaterialConfirmStepProps) {
  return (
    <div className="mx-auto max-w-3xl animate-in fade-in zoom-in duration-300">
      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin
        </h3>
        <p className="mt-2 text-green-700">
          Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4 border-b pb-2 font-semibold text-slate-800">
              Thông tin vật tư
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
                <span className="text-muted-foreground">Loại:</span>{" "}
                <span className="font-medium">{formData.type}</span>
              </div>
              <div className="col-span-2">
                <span className="mb-1 block text-muted-foreground">Mô tả:</span>
                <span className="block rounded border border-slate-100 bg-slate-50 p-2 font-medium">
                  {formData.description || "Không có mô tả"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Tags:</span>{" "}
                <div className="mt-1 inline-flex flex-wrap gap-1">
                  {formData.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4 border-b pb-2 font-semibold text-slate-800">
              Thông tin cung ứng ({formData.supplierDetails.length})
            </h4>
            <div className="space-y-2">
              {formData.supplierDetails.map((item, index) => {
                const supplierInfo = suppliers.find(
                  (supplier) => supplier.id === item.supplierId,
                );

                return (
                  <div
                    key={`${item.supplierId}-${index}`}
                    className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm sm:flex-row sm:items-center"
                  >
                    <span className="font-medium text-slate-900">
                      {index + 1}. {supplierInfo?.name}
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
}
