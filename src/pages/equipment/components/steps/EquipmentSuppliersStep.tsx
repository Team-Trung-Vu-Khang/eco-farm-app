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
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  suppliers as presetSuppliers,
  units,
  packagingSpecsPresets,
} from "../../data/constants";
import type { EquipmentFormData, SupplierDetail } from "../../types";
import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";

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
  const [pkgInput, setPkgInput] = useState("");
  const [activeModal, setActiveModal] = useState<"manufacturerOrigin" | "importerRegistrant" | "distributor" | null>(null);

  const manufacturerOriginArr = formData.manufacturerOrigin || [];
  const importerRegistrantArr = formData.importerRegistrant || [];
  const distributorArr = formData.distributor || [];
  const packagingSpecsArr = formData.packagingSpecs || [];
  const supplierDetailsArr = formData.supplierDetails || [];

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
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("manufacturerOrigin")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {manufacturerOriginArr.length > 0 ? (
                manufacturerOriginArr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">Bấm để chọn nhà sản xuất...</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-slate-400 p-0 rounded-full hover:bg-primary/10"
            >
              <Search className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tên công ty + quốc gia (Việt Nam, Ấn Độ, Trung Quốc, Đức, Mỹ,
            Nhật...)
          </p>
        </div>

        {/* Importer Registrant */}
        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("importerRegistrant")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {importerRegistrantArr.length > 0 ? (
                importerRegistrantArr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">Bấm để chọn nhà nhập khẩu...</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-slate-400 p-0 rounded-full hover:bg-primary/10"
            >
              <Search className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Công ty đứng tên đăng ký lưu hành tại Việt Nam
          </p>
        </div>

        {/* Distributor */}
        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("distributor")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {distributorArr.length > 0 ? (
                distributorArr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">Bấm để chọn nhà phân phối...</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-slate-400 p-0 rounded-full hover:bg-primary/10"
            >
              <Search className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Các công ty lớn phân phối trên thị trường
          </p>
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

      <PartnerSelectorDialog
        open={activeModal === "manufacturerOrigin"}
        onOpenChange={(open) => setActiveModal(open ? "manufacturerOrigin" : null)}
        title="Chọn nhà sản xuất / Xuất xứ"
        isMulti={false}
        selectedNames={formData.manufacturerOrigin || []}
        onConfirm={(names) => updateField("manufacturerOrigin", names.slice(0, 1))}
      />

      <PartnerSelectorDialog
        open={activeModal === "importerRegistrant"}
        onOpenChange={(open) => setActiveModal(open ? "importerRegistrant" : null)}
        title="Chọn nhà nhập khẩu / Đăng ký"
        isMulti={true}
        selectedNames={formData.importerRegistrant || []}
        onConfirm={(names) => updateField("importerRegistrant", names)}
      />

      <PartnerSelectorDialog
        open={activeModal === "distributor"}
        onOpenChange={(open) => setActiveModal(open ? "distributor" : null)}
        title="Chọn nhà phân phối"
        isMulti={true}
        selectedNames={formData.distributor || []}
        onConfirm={(names) => updateField("distributor", names)}
      />
    </div>
  );
};
