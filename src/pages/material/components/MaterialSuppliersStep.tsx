import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, Plus, X } from "lucide-react";
import { suppliers, units } from "../data/constants";
import type { MaterialFormData, MaterialSupplierDetail } from "../types/types";

interface MaterialSuppliersStepProps {
  formData: MaterialFormData;
  tempSupplier: MaterialSupplierDetail;
  onTempSupplierChange: (data: Partial<MaterialSupplierDetail>) => void;
  onAddSupplier: () => void;
  onRemoveSupplier: (index: number) => void;
}

export default function MaterialSuppliersStep({
  formData,
  tempSupplier,
  onTempSupplierChange,
  onAddSupplier,
  onRemoveSupplier,
}: MaterialSuppliersStepProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 text-primary" />
            Danh sách nhà cung cấp
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý nguồn cung ứng vật tư
          </p>
        </div>

        <div className="space-y-4 rounded-xl border bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Chọn nhà cung cấp</Label>
              <Select
                value={tempSupplier.supplierId}
                onValueChange={(value) =>
                  onTempSupplierChange({ supplierId: value })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn đối tác..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} (
                      {supplier.type === "enterprise" ? "DN" : "NH"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quy cách đóng gói</Label>
              <Input
                placeholder="VD: Thùng 20 cái"
                value={tempSupplier.packaging}
                onChange={(e) =>
                  onTempSupplierChange({ packaging: e.target.value })
                }
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lượng</Label>
              <Input
                type="number"
                placeholder="0"
                value={tempSupplier.quantity}
                onChange={(e) =>
                  onTempSupplierChange({ quantity: e.target.value })
                }
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Đơn vị tính</Label>
              <Select
                value={tempSupplier.unit}
                onValueChange={(value) => onTempSupplierChange({ unit: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Đơn vị..." />
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

          <Button
            onClick={onAddSupplier}
            className="w-full md:w-auto"
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm vào danh sách
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Danh sách đã chọn ({formData.supplierDetails.length})</Label>
          {formData.supplierDetails.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-slate-50 py-8 text-center text-muted-foreground">
              Chưa có nhà cung cấp nào được chọn
            </div>
          ) : (
            <div className="space-y-2">
              {formData.supplierDetails.map((item, index) => {
                const supplierInfo = suppliers.find(
                  (supplier) => supplier.id === item.supplierId,
                );

                return (
                  <div
                    key={`${item.supplierId}-${index}`}
                    className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {supplierInfo?.name || item.supplierId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} • {item.packaging}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSupplier(index)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
