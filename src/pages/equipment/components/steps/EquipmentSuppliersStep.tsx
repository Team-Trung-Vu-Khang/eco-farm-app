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
import {
  Building2,
  Package,
  Plus,
  X,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import {
  suppliers as presetSuppliers,
  units,
  packagingSpecsPresets,
} from "../../data/constants";
import type { EquipmentFormData, SupplierDetail } from "../../types";

interface EquipmentSuppliersStepProps {
  formData: EquipmentFormData;
  tempSupplier: SupplierDetail;
  setTempSupplier: (supplier: SupplierDetail) => void;
  addSupplierItem: () => void;
  removeSupplierItem: (index: number) => void;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
}

export const EquipmentSuppliersStep = ({
  formData,
  tempSupplier,
  setTempSupplier,
  addSupplierItem,
  removeSupplierItem,
  updateField,
}: EquipmentSuppliersStepProps) => {
  const [mfgInput, setMfgInput] = useState("");
  const [impInput, setImpInput] = useState("");
  const [distInput, setDistInput] = useState("");
  const [pkgInput, setPkgInput] = useState("");

  const manufacturerOriginArr = formData.manufacturerOrigin || [];
  const importerRegistrantArr = formData.importerRegistrant || [];
  const distributorArr = formData.distributor || [];
  const packagingSpecsArr = formData.packagingSpecs || [];
  const supplierDetailsArr = formData.supplierDetails || [];

  const addMfg = () => {
    const val = mfgInput.trim();
    if (val && !manufacturerOriginArr.includes(val)) {
      updateField("manufacturerOrigin", [...manufacturerOriginArr, val]);
      setMfgInput("");
    }
  };

  const addImp = () => {
    const val = impInput.trim();
    if (val && !importerRegistrantArr.includes(val)) {
      updateField("importerRegistrant", [...importerRegistrantArr, val]);
      setImpInput("");
    }
  };

  const addDist = () => {
    const val = distInput.trim();
    if (val && !distributorArr.includes(val)) {
      updateField("distributor", [...distributorArr, val]);
      setDistInput("");
    }
  };

  const addPkg = () => {
    const val = pkgInput.trim();
    if (val && !packagingSpecsArr.includes(val)) {
      updateField("packagingSpecs", [...packagingSpecsArr, val]);
      setPkgInput("");
    }
  };

  const removeTag = (field: keyof EquipmentFormData, value: string) => {
    const current = (formData[field] as string[]) || [];
    updateField(
      field,
      current.filter((v) => v !== value),
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
              placeholder="VD: Kubota Corp - Nhật Bản, DJI - Trung Quốc..."
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
              placeholder="VD: Công ty TNHH Kubota Việt Nam..."
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

      {/* Pricing & Packaging */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Quy cách & Giá bán tham khảo
        </h3>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Giá tham khảo
          </Label>
          <Input
            value={formData.referencePrice || ""}
            onChange={(e) => updateField("referencePrice", e.target.value)}
            placeholder="VD: 350.000.000 đ, 85.000.000 đ..."
          />
        </div>

        {/* Packaging Specs */}
        <div className="space-y-3">
          <Label>Quy cách đóng gói máy</Label>
          <div className="flex gap-2">
            <Input
              value={pkgInput}
              onChange={(e) => setPkgInput(e.target.value)}
              placeholder="VD: Đóng thùng gỗ nguyên đai, Pallet thép..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addPkg())
              }
            />
            <Button type="button" onClick={addPkg} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {/* Presets */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">
              Gợi ý quy cách phổ biến:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {packagingSpecsPresets.map((preset) => {
                const isSelected = packagingSpecsArr.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        updateField("packagingSpecs", [
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
          {packagingSpecsArr.filter((t) => !packagingSpecsPresets.includes(t))
            .length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {packagingSpecsArr
                .filter((t) => !packagingSpecsPresets.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-600"
                      onClick={() => removeTag("packagingSpecs", tag)}
                    />
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
