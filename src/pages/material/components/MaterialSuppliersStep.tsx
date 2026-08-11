import { useState } from "react";
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
import { Building2, Package, Plus, X } from "lucide-react";
import { packagingSpecsPresets } from "../data/constants";
import type { MaterialFormData } from "../types/types";

interface MaterialSuppliersStepProps {
  formData: MaterialFormData;
  onFormFieldChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => void;
}

const packagingUnits = [
  "cái", "cuộn", "mét", "kg", "g",
  "bộ", "thùng", "bao", "hộp", "lọ",
  "kiện", "gói", "can", "lít", "ml"
];

export default function MaterialSuppliersStep({
  formData,
  onFormFieldChange,
}: MaterialSuppliersStepProps) {
  const [mfgInput, setMfgInput] = useState("");
  const [impInput, setImpInput] = useState("");
  const [distInput, setDistInput] = useState("");

  // Quantity and unit state for packaging specs
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const manufacturerOriginArr = formData.manufacturerOrigin || [];
  const importerRegistrantArr = formData.importerRegistrant || [];
  const distributorArr = formData.distributor || [];
  const packagingSpecsArr = formData.packagingSpecs || [];

  const addMfg = () => {
    const val = mfgInput.trim();
    if (val && !manufacturerOriginArr.includes(val)) {
      onFormFieldChange("manufacturerOrigin", [...manufacturerOriginArr, val]);
      setMfgInput("");
    }
  };

  const addImp = () => {
    const val = impInput.trim();
    if (val && !importerRegistrantArr.includes(val)) {
      onFormFieldChange("importerRegistrant", [...importerRegistrantArr, val]);
      setImpInput("");
    }
  };

  const addDist = () => {
    const val = distInput.trim();
    if (val && !distributorArr.includes(val)) {
      onFormFieldChange("distributor", [...distributorArr, val]);
      setDistInput("");
    }
  };

  const addPackagingSpec = () => {
    const trimmedQty = quantity.trim();
    if (!trimmedQty || !unit) return;
    const spec = `${trimmedQty} ${unit}`;
    if (!packagingSpecsArr.includes(spec)) {
      onFormFieldChange("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
  };

  const removeTag = (
    field: "manufacturerOrigin" | "importerRegistrant" | "distributor" | "packagingSpecs",
    value: string
  ) => {
    const current = formData[field] || [];
    onFormFieldChange(
      field,
      current.filter((v) => v !== value)
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Origin & Market Suppliers */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Xuất xứ & Đơn vị phân phối trên thị trường
        </h3>

        {/* Manufacturer Origin */}
        <div className="space-y-2">
          <Label>Nhà sản xuất / Xuất xứ</Label>
          <div className="flex gap-2">
            <Input
              value={mfgInput}
              onChange={(e) => setMfgInput(e.target.value)}
              placeholder="VD: Công ty Nhựa Rạng Đông, Netafim - Israel..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addMfg())
              }
            />
            <Button type="button" onClick={addMfg} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {manufacturerOriginArr.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {manufacturerOriginArr.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-600"
                    onClick={() => removeTag("manufacturerOrigin", tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Importer Registrant */}
        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký</Label>
          <div className="flex gap-2">
            <Input
              value={impInput}
              onChange={(e) => setImpInput(e.target.value)}
              placeholder="VD: Công ty TNHH Nhựa Hòa Phát..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImp())
              }
            />
            <Button type="button" onClick={addImp} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {importerRegistrantArr.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {importerRegistrantArr.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-600"
                    onClick={() => removeTag("importerRegistrant", tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Distributor */}
        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <div className="flex gap-2">
            <Input
              value={distInput}
              onChange={(e) => setDistInput(e.target.value)}
              placeholder="VD: Đại lý Bình Minh, DJI Store Vietnam..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addDist())
              }
            />
            <Button type="button" onClick={addDist} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {distributorArr.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {distributorArr.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-600"
                    onClick={() => removeTag("distributor", tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Packaging Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Bao bì quy cách
        </h3>

        <div className="space-y-3">
          <Label>Nhập quy cách đóng gói</Label>
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

          {/* Presets */}
          <div className="space-y-1 pt-2">
            <p className="text-xs text-muted-foreground">Gợi ý phổ biến:</p>
            <div className="flex flex-wrap gap-1.5">
              {packagingSpecsPresets.map((preset) => {
                const isSelected = packagingSpecsArr.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        onFormFieldChange("packagingSpecs", [
                          ...packagingSpecsArr,
                          preset,
                        ]);
                      } else {
                        removeTag("packagingSpecs", preset);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
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
          {packagingSpecsArr.length > 0 && (
            <div className="bg-slate-50 rounded-xl border p-3 mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Đã thêm ({packagingSpecsArr.length} quy cách):
              </p>
              <div className="flex flex-wrap gap-2">
                {packagingSpecsArr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-sm px-3 py-1 flex items-center gap-1.5"
                  >
                    <Package className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag("packagingSpecs", tag)}
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
