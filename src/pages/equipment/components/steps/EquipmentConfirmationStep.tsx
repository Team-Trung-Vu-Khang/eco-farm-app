import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2 } from "lucide-react";
import {
  suppliers,
  technologyLevelOptions,
  valueChainOptions,
  financialManagementOptions,
} from "../../data/constants";
import type { EquipmentFormData } from "../../types";

interface EquipmentConfirmationStepProps {
  formData: EquipmentFormData;
}

export const EquipmentConfirmationStep = ({
  formData,
}: EquipmentConfirmationStepProps) => {
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
              Thông tin thiết bị
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
                <span className="text-muted-foreground">
                  Năng lực vận hành:
                </span>{" "}
                <span className="font-medium">
                  {technologyLevelOptions.find(
                    (o) => o.id === formData.technologyLevelId,
                  )?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Chuỗi giá trị:</span>{" "}
                <span className="font-medium">
                  {valueChainOptions.find((o) => o.id === formData.valueChainId)
                    ?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Q.lý tài chính:</span>{" "}
                <span className="font-medium">
                  {financialManagementOptions.find(
                    (o) => o.id === formData.financialManagementId,
                  )?.label || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Bảo dưỡng:</span>{" "}
                <span className="font-medium">
                  {formData.maintainanceInterval}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Mô tả:</span>
                <span className="font-medium bg-slate-50 p-2 block rounded border border-slate-100">
                  {formData.description || "Không có mô tả"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Nhà cung cấp ({formData.supplierDetails.length})
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
                      {item.quantity} {item.unit} (BH: {item.warranty})
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
