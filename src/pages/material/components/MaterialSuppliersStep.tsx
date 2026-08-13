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
import { Building2, Package, Plus, X, Search } from "lucide-react";
import { packagingSpecsPresets } from "../data/constants";
import type { MaterialFormData } from "../types/types";
import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";

interface MaterialSuppliersStepProps {
  formData: MaterialFormData;
  onFormFieldChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => void;
}

const MEASURE_UNIT_OPTIONS = [
  "cái",
  "cuộn",
  "mét",
  "kg",
  "g",
  "bộ",
  "thùng",
  "bao",
  "hộp",
  "lọ",
  "kiện",
  "gói",
  "can",
  "lít",
  "ml",
  "tấn",
  "mm",
];

const PACKAGING_OPTIONS = [
  "Bao",
  "Bì",
  "Hộp",
  "Thùng",
  "Túi",
  "Chai",
  "Lọ",
  "Gói",
  "Can",
  "Cuộn",
  "Kiện",
  "Khay",
];

export default function MaterialSuppliersStep({
  formData,
  onFormFieldChange,
}: MaterialSuppliersStepProps) {
  const [activeModal, setActiveModal] = useState<
    "manufacturerOrigin" | "importerRegistrant" | "distributor" | null
  >(null);

  // Quantity and unit state for packaging specs
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");

  const manufacturerOriginArr = formData.manufacturerOrigin || [];
  const importerRegistrantArr = formData.importerRegistrant || [];
  const distributorArr = formData.distributor || [];
  const packagingSpecsArr = formData.packagingSpecs || [];

  const addPackagingSpec = () => {
    const trimmedQty = quantity.trim();
    if (!trimmedQty || !unit || !packaging) return;
    const spec = `${packaging} ${trimmedQty} ${unit}`;
    if (!packagingSpecsArr.includes(spec)) {
      onFormFieldChange("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
  };

  const removeTag = (
    field:
      | "manufacturerOrigin"
      | "importerRegistrant"
      | "distributor"
      | "packagingSpecs",
    value: string,
  ) => {
    const current = formData[field] || [];
    onFormFieldChange(
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
                <span className="text-sm text-slate-400">
                  Bấm để chọn nhà sản xuất...
                </span>
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
                <span className="text-sm text-slate-400">
                  Bấm để chọn nhà nhập khẩu...
                </span>
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
                <span className="text-sm text-slate-400">
                  Bấm để chọn nhà phân phối...
                </span>
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
            <div className="w-32 space-y-1">
              <Label className="text-xs text-muted-foreground">
                Quy cách chứa
              </Label>
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
                placeholder="VD: 500, 25"
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

      <PartnerSelectorDialog
        open={activeModal === "manufacturerOrigin"}
        onOpenChange={(open) =>
          setActiveModal(open ? "manufacturerOrigin" : null)
        }
        title="Chọn nhà sản xuất / Xuất xứ"
        isMulti={false}
        selectedNames={formData.manufacturerOrigin || []}
        onConfirm={(names) =>
          onFormFieldChange("manufacturerOrigin", names.slice(0, 1))
        }
      />

      <PartnerSelectorDialog
        open={activeModal === "importerRegistrant"}
        onOpenChange={(open) =>
          setActiveModal(open ? "importerRegistrant" : null)
        }
        title="Chọn nhà nhập khẩu / Đăng ký"
        isMulti={true}
        selectedNames={formData.importerRegistrant || []}
        onConfirm={(names) => onFormFieldChange("importerRegistrant", names)}
      />

      <PartnerSelectorDialog
        open={activeModal === "distributor"}
        onOpenChange={(open) => setActiveModal(open ? "distributor" : null)}
        title="Chọn nhà phân phối"
        isMulti={true}
        selectedNames={formData.distributor || []}
        onConfirm={(names) => onFormFieldChange("distributor", names)}
      />
    </div>
  );
}
