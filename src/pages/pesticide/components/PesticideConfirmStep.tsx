import {
  Badge,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2 } from "lucide-react";
import { suppliers } from "../data/constants";
import type { PesticideFormData } from "../types";

interface PesticideConfirmStepProps {
  formData: PesticideFormData;
}

export default function PesticideConfirmStep({
  formData,
}: PesticideConfirmStepProps) {
  const supplier = suppliers.find(
    (item) => item.id === formData.selectedSupplierId,
  );

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
              Thông tin thuốc
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
                <span className="text-muted-foreground">Nhóm:</span>{" "}
                <span className="font-medium">{formData.group}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dạng:</span>{" "}
                <span className="font-medium">{formData.form}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Hoạt chất:</span>{" "}
                <span className="font-medium">{formData.activeIngredient}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Tags:</span>{" "}
                <div className="inline-flex gap-1 flex-wrap mt-1">
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
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Nguồn cung & Quy cách
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="col-span-2">
                <span className="text-muted-foreground">Nhà cung cấp:</span>{" "}
                <span className="font-medium text-primary">{supplier?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quy cách:</span>{" "}
                <span className="font-medium">
                  {formData.quantity} {formData.unit}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Mô tả:</span>{" "}
                <span className="font-medium">{formData.packaging}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
