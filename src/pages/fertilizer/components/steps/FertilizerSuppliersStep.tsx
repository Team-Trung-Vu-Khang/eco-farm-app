import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, Plus, X } from "lucide-react";
import { useState } from "react";
import { suppliers, units } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerSuppliersStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

export const FertilizerSuppliersStep = ({
  formData,
  updateField,
}: FertilizerSuppliersStepProps) => {
  const { toast } = useToast();
  const [tempSupplier, setTempSupplier] = useState({
    supplierId: "",
    quantity: "",
    unit: "",
    packaging: "",
  });

  const addSupplierItem = () => {
    if (
      !tempSupplier.supplierId ||
      !tempSupplier.quantity ||
      !tempSupplier.unit
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn nhà cung cấp, số lượng và đơn vị",
        variant: "destructive",
      });
      return;
    }
    updateField("supplierDetails", [...formData.supplierDetails, tempSupplier]);
    setTempSupplier({ supplierId: "", quantity: "", unit: "", packaging: "" });
  };

  const removeSupplierItem = (index: number) => {
    const newDetails = [...formData.supplierDetails];
    newDetails.splice(index, 1);
    updateField("supplierDetails", newDetails);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Danh sách nhà cung cấp
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Thêm các nhà cung cấp phân bón này kèm thông tin quy cách
          </p>
        </div>

        {/* Add Form */}
        <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chọn nhà cung cấp</Label>
              <Select
                value={tempSupplier.supplierId}
                onValueChange={(v) =>
                  setTempSupplier({ ...tempSupplier, supplierId: v })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn đối tác..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.type === "enterprise" ? "DN" : "NH"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quy cách đóng gói</Label>
              <Input
                placeholder="VD: Bao 50kg"
                value={tempSupplier.packaging}
                onChange={(e) =>
                  setTempSupplier({
                    ...tempSupplier,
                    packaging: e.target.value,
                  })
                }
                className="bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lượng (tồn kho)</Label>
              <Input
                type="number"
                placeholder="0"
                value={tempSupplier.quantity}
                onChange={(e) =>
                  setTempSupplier({ ...tempSupplier, quantity: e.target.value })
                }
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn vị tính</Label>
              <Select
                value={tempSupplier.unit}
                onValueChange={(v) =>
                  setTempSupplier({ ...tempSupplier, unit: v })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Đơn vị..." />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={addSupplierItem}
            className="w-full md:w-auto"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm vào danh sách
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2">
          <Label>Danh sách đã chọn ({formData.supplierDetails.length})</Label>
          {formData.supplierDetails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
              Chưa có nhà cung cấp nào được chọn
            </div>
          ) : (
            <div className="space-y-2">
              {formData.supplierDetails.map((item, idx) => {
                const supInfo = suppliers.find((s) => s.id === item.supplierId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {supInfo?.name || item.supplierId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} • {item.packaging}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSupplierItem(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
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
};
