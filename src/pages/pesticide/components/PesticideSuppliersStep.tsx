import {
  Button,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  CheckCircle2,
  Package,
  User,
} from "lucide-react";
import { suppliers, units } from "../data/constants";
import type { PesticideFormData } from "../types";

interface PesticideSuppliersStepProps {
  formData: PesticideFormData;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

export default function PesticideSuppliersStep({
  formData,
  onFormFieldChange,
}: PesticideSuppliersStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Chọn nhà cung cấp
          </h3>
          <p className="text-sm text-muted-foreground">
            Lựa chọn đối tác cung cấp sản phẩm này
          </p>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() =>
                    onFormFieldChange("selectedSupplierId", supplier.id)
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    formData.selectedSupplierId === supplier.id
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-white border-slate-200 hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      supplier.type === "enterprise"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {supplier.type === "enterprise" ? (
                      <Building2 className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{supplier.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 uppercase">
                      {supplier.type === "enterprise" ? "Doanh nghiệp" : "Nông hộ"}
                    </div>
                  </div>
                  {formData.selectedSupplierId === supplier.id ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : null}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Quy cách đóng gói
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Số lượng / Dung tích <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="VD: 500"
                  value={formData.quantity}
                  onChange={(e) => onFormFieldChange("quantity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Đơn vị tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => onFormFieldChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả quy cách</Label>
              <Input
                placeholder="VD: Chai nhựa 500ml, thùng 24 chai"
                value={formData.packaging}
                onChange={(e) => onFormFieldChange("packaging", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
