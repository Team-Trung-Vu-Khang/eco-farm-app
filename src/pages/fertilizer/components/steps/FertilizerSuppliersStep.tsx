import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, Package, Plus, X, DollarSign } from "lucide-react";
import { useState } from "react";
import { packagingUnitOptions } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerSuppliersStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

const packagingUnits = [
  "ml",
  "L",
  "g",
  "kg",
  "viên",
  "gói",
  "hộp",
  "bao",
  "can",
  "thùng",
];

export const FertilizerSuppliersStep = ({
  formData,
  updateField,
}: FertilizerSuppliersStepProps) => {
  // local state for packaging input
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const addPackagingSpec = () => {
    const trimmed = quantity.trim();
    if (!trimmed || !unit) return;
    const spec = `${trimmed} ${unit}`;
    const currentSpecs = formData.packagingSpecs || [];
    if (!currentSpecs.includes(spec)) {
      updateField("packagingSpecs", [...currentSpecs, spec]);
    }
    setQuantity("");
    setUnit("");
  };

  const removePackagingSpec = (spec: string) => {
    const currentSpecs = formData.packagingSpecs || [];
    updateField(
      "packagingSpecs",
      currentSpecs.filter((s) => s !== spec),
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Xuất xứ & Nhà cung cấp chính */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Xuất xứ & Đơn vị cung ứng
        </h3>

        <div className="space-y-2">
          <Label>Nhà sản xuất / Xuất xứ</Label>
          <Input
            value={formData.manufacturerOrigin}
            onChange={(e) => updateField("manufacturerOrigin", e.target.value)}
            placeholder="VD: Yara International ASA - Na Uy, Công ty Bình Điền - Việt Nam"
          />
        </div>

        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký</Label>
          <Input
            value={formData.importerRegistrant}
            onChange={(e) => updateField("importerRegistrant", e.target.value)}
            placeholder="VD: Công ty TNHH Yara Việt Nam..."
          />
        </div>

        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <Input
            value={formData.distributor}
            onChange={(e) => updateField("distributor", e.target.value)}
            placeholder="VD: Công ty CP Vật tư Nông nghiệp Hà Lan, các đại lý cấp 1..."
          />
        </div>
      </div>

      {/* Card: Quy cách & Giá tham khảo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Quy cách & Giá tham khảo
        </h3>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Giá tham khảo
          </Label>
          <Input
            value={formData.referencePrice}
            onChange={(e) => updateField("referencePrice", e.target.value)}
            placeholder="VD: 850.000 đ / bao 50kg, 120.000 đ / chai 1 lít"
          />
        </div>

        {/* Bao bì quy cách – nhập số + chọn đơn vị */}
        <div className="space-y-3">
          <Label>Bao bì quy cách</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Nhập số lượng rồi chọn đơn vị. Có thể thêm nhiều quy cách.
          </p>

          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Số lượng</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="VD: 50, 1, 500"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPackagingSpec();
                  }
                }}
              />
            </div>
            <div className="w-36 space-y-1">
              <Label className="text-xs text-muted-foreground">Đơn vị</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn..." />
                </SelectTrigger>
                <SelectContent>
                  {packagingUnits.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={addPackagingSpec}
              disabled={!quantity.trim() || !unit}
              className="mb-0 shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>

          {/* Quick presets */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gợi ý phổ biến:</p>
            <div className="flex flex-wrap gap-1.5">
              {packagingUnitOptions.slice(0, 8).map((preset) => {
                const currentSpecs = formData.packagingSpecs || [];
                const isSelected = currentSpecs.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        updateField("packagingSpecs", [
                          ...currentSpecs,
                          preset,
                        ]);
                      }
                    }}
                    disabled={isSelected}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary opacity-60 cursor-not-allowed"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags list */}
          {formData.packagingSpecs && formData.packagingSpecs.length > 0 && (
            <div className="bg-slate-50 rounded-xl border p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Đã thêm ({formData.packagingSpecs.length} quy cách):
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.packagingSpecs.map((spec) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="text-sm px-3 py-1 flex items-center gap-1.5"
                  >
                    <Package className="w-3 h-3" />
                    {spec}
                    <button
                      type="button"
                      onClick={() => removePackagingSpec(spec)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
