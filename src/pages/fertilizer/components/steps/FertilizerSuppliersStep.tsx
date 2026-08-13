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
import { Building2, Package, Plus, X, DollarSign, Search } from "lucide-react";
import { useState } from "react";
import { packagingUnitOptions } from "../../data/constants";
import type { FertilizerFormData } from "../../types/types";
import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";

interface FertilizerSuppliersStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

const MEASURE_UNIT_OPTIONS = [
  "kg",
  "g",
  "L",
  "ml",
  "tấn",
  "bao",
  "can",
  "thùng",
  "viên",
  "ống",
  "vỉ",
  "cc",
  "IU",
];

const PACKAGING_OPTIONS = [
  "Bao",
  "Bì",
  "Can",
  "Chai",
  "Hộp",
  "Lọ",
  "Gói",
  "Thùng",
  "Túi",
  "Cuộn",
  "Kiện",
  "Khay",
];

export const FertilizerSuppliersStep = ({
  formData,
  updateField,
}: FertilizerSuppliersStepProps) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");
  const [activeModal, setActiveModal] = useState<"manufacturerOrigin" | "importerRegistrant" | "distributor" | null>(null);

  const addPackagingSpec = () => {
    const trimmed = quantity.trim();
    if (!trimmed || !unit || !packaging) return;
    const spec = `${packaging} ${trimmed} ${unit}`;
    const currentSpecs = formData.packagingSpecs || [];
    if (!currentSpecs.includes(spec)) {
      updateField("packagingSpecs", [...currentSpecs, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
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
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("manufacturerOrigin")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.manufacturerOrigin ? (
                <Badge
                  variant="secondary"
                  className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                >
                  {formData.manufacturerOrigin}
                </Badge>
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
        </div>

        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("importerRegistrant")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.importerRegistrant ? (
                formData.importerRegistrant.split(", ").filter(Boolean).map((name) => (
                  <Badge
                    key={name}
                    variant="secondary"
                    className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                  >
                    {name}
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
        </div>

        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("distributor")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.distributor ? (
                formData.distributor.split(", ").filter(Boolean).map((name) => (
                  <Badge
                    key={name}
                    variant="secondary"
                    className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                  >
                    {name}
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
            <div className="w-32 space-y-1">
              <Label className="text-xs text-muted-foreground">Quy cách chứa</Label>
              <Select value={packaging} onValueChange={setPackaging}>
                <SelectTrigger className="text-left h-auto py-2">
                  <SelectValue placeholder="Chọn..." />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGING_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Giá trị</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="VD: 50, 25"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPackagingSpec();
                  }
                }}
              />
            </div>
            <div className="w-28 space-y-1">
              <Label className="text-xs text-muted-foreground">Đơn vị</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="text-left h-auto py-2">
                  <SelectValue placeholder="Chọn..." />
                </SelectTrigger>
                <SelectContent>
                  {MEASURE_UNIT_OPTIONS.map((u) => (
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
              disabled={!quantity.trim() || !unit || !packaging}
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

      <PartnerSelectorDialog
        open={activeModal === "manufacturerOrigin"}
        onOpenChange={(open) => setActiveModal(open ? "manufacturerOrigin" : null)}
        title="Chọn nhà sản xuất / Xuất xứ"
        isMulti={false}
        selectedNames={formData.manufacturerOrigin ? [formData.manufacturerOrigin] : []}
        onConfirm={(names) => updateField("manufacturerOrigin", names[0] || "")}
      />

      <PartnerSelectorDialog
        open={activeModal === "importerRegistrant"}
        onOpenChange={(open) => setActiveModal(open ? "importerRegistrant" : null)}
        title="Chọn nhà nhập khẩu / Đăng ký"
        isMulti={true}
        selectedNames={formData.importerRegistrant ? formData.importerRegistrant.split(", ").filter(Boolean) : []}
        onConfirm={(names) => updateField("importerRegistrant", names.join(", "))}
      />

      <PartnerSelectorDialog
        open={activeModal === "distributor"}
        onOpenChange={(open) => setActiveModal(open ? "distributor" : null)}
        title="Chọn nhà phân phối"
        isMulti={true}
        selectedNames={formData.distributor ? formData.distributor.split(", ").filter(Boolean) : []}
        onConfirm={(names) => updateField("distributor", names.join(", "))}
      />
    </div>
  );
};
