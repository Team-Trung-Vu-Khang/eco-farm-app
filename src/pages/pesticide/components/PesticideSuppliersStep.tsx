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
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, DollarSign, Package, Plus, X } from "lucide-react";
import { useState } from "react";
import { packagingUnitOptions } from "../data/constants";
import type { PesticideFormData } from "../types";

interface PesticideSuppliersStepProps {
  formData: PesticideFormData;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

// Danh sách đơn vị để chọn
const packagingUnits = [
  "ml",
  "L",
  "g",
  "kg",
  "viên",
  "ống",
  "gói",
  "hộp",
  "chai",
  "lọ",
  "bọc",
  "bao",
  "can",
  "thùng",
];

export default function PesticideSuppliersStep({
  formData,
  onFormFieldChange,
}: PesticideSuppliersStepProps) {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const addPackagingSpec = () => {
    const trimmed = quantity.trim();
    if (!trimmed || !unit) return;
    const spec = `${trimmed} ${unit}`;
    if (!formData.packagingSpecs.includes(spec)) {
      onFormFieldChange("packagingSpecs", [...formData.packagingSpecs, spec]);
    }
    setQuantity("");
    setUnit("");
  };

  const removePackagingSpec = (spec: string) => {
    onFormFieldChange(
      "packagingSpecs",
      formData.packagingSpecs.filter((s) => s !== spec),
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Nhà sản xuất & Nhà nhập khẩu */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Nhà sản xuất & Nhập khẩu
        </h3>

        <div className="space-y-2">
          <Label>Nhà sản xuất / Xuất xứ</Label>
          <Input
            value={formData.manufacturerOrigin}
            onChange={(e) =>
              onFormFieldChange("manufacturerOrigin", e.target.value)
            }
            placeholder="VD: Syngenta AG – Thụy Sĩ, Bayer AG – Đức"
          />
          <p className="text-xs text-muted-foreground">
            Tên công ty + quốc gia (Việt Nam, Ấn Độ, Trung Quốc, Đức, Mỹ,
            Nhật...)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký tại Việt Nam</Label>
          <Input
            value={formData.importerRegistrant}
            onChange={(e) =>
              onFormFieldChange("importerRegistrant", e.target.value)
            }
            placeholder="VD: Syngenta Việt Nam, Bayer Việt Nam"
          />
          <p className="text-xs text-muted-foreground">
            Công ty đứng tên đăng ký lưu hành tại Việt Nam
          </p>
        </div>

        <div className="space-y-2">
          <Label>Nhà phân phối</Label>
          <Textarea
            value={formData.distributor}
            onChange={(e) => onFormFieldChange("distributor", e.target.value)}
            placeholder="VD: Công ty CP BVTV 1, Đại lý VTNN Hòa Phát..."
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Các công ty lớn phân phối trên thị trường
          </p>
        </div>
      </div>

      {/* Card: Giá & Quy cách */}
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
            onChange={(e) =>
              onFormFieldChange("referencePrice", e.target.value)
            }
            placeholder="VD: 85.000 đ / gói 50g (cập nhật theo thời điểm)"
          />
          <p className="text-xs text-muted-foreground">
            Cập nhật theo thời điểm (tùy chọn)
          </p>
        </div>

        {/* Bao bì quy cách – nhập số + chọn đơn vị */}
        <div className="space-y-3">
          <Label>Bao bì quy cách</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Nhập số lượng rồi chọn đơn vị. Có thể thêm nhiều quy cách.
          </p>

          {/* Input row */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Số lượng</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="VD: 500, 1, 25"
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

          {/* Quick-select gợi ý phổ biến */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gợi ý phổ biến:</p>
            <div className="flex flex-wrap gap-1.5">
              {packagingUnitOptions.slice(0, 10).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (!formData.packagingSpecs.includes(preset)) {
                      onFormFieldChange("packagingSpecs", [
                        ...formData.packagingSpecs,
                        preset,
                      ]);
                    }
                  }}
                  disabled={formData.packagingSpecs.includes(preset)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                    formData.packagingSpecs.includes(preset)
                      ? "bg-primary/10 border-primary text-primary opacity-60 cursor-not-allowed"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Tags đã thêm */}
          {formData.packagingSpecs.length > 0 && (
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
}
