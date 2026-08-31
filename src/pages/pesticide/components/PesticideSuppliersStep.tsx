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
import { Building2, DollarSign, Package, Plus, X, Search } from "lucide-react";
import { useState } from "react";
import { packagingUnitOptions } from "../data/constants";
import type { PesticideFormData } from "../types";
import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

interface PesticideSuppliersStepProps {
  formData: PesticideFormData;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

// Danh sách đơn vị để chọn
const MEASURE_UNIT_OPTIONS = [
  "ml",
  "L",
  "g",
  "kg",
  "viên",
  "ống",
  "vỉ",
  "tấn",
  "m",
  "mm",
  "cc",
  "IU",
];

const PACKAGING_OPTIONS = [
  "Chai",
  "Lọ",
  "Gói",
  "Hộp",
  "Bao",
  "Bì",
  "Can",
  "Thùng",
  "Túi",
  "Vỉ",
  "Ống",
  "Chậu",
  "Khay",
];

export default function PesticideSuppliersStep({
  formData,
  onFormFieldChange,
}: PesticideSuppliersStepProps) {
  // Fetch packaging types and units
  const { data: packagingTypes } = useQuery({
    queryKey: ["packaging-types"],
    queryFn: () => farmSupplyApi.listPackagingTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: baseUnits } = useQuery({
    queryKey: ["base-units"],
    queryFn: () => farmSupplyApi.listBaseUnits(),
    staleTime: 5 * 60 * 1000,
  });

  const packagingList =
    packagingTypes && packagingTypes.length > 0
      ? packagingTypes.map((p) => p.name)
      : PACKAGING_OPTIONS;

  const unitList =
    baseUnits && baseUnits.length > 0 ? baseUnits.map((u) => u.name) : MEASURE_UNIT_OPTIONS;

  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");
  const [activeModal, setActiveModal] = useState<
    "manufacturerOrigin" | "importerRegistrant" | "distributor" | null
  >(null);

  const addPackagingSpec = () => {
    const trimmedVal = quantity.trim();
    if (!trimmedVal || !unit || !packaging) return;
    const spec = `${packaging} ${trimmedVal} ${unit}`;
    if (!formData.packagingSpecs.includes(spec)) {
      onFormFieldChange("packagingSpecs", [...formData.packagingSpecs, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
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
                  {formData.manufacturerOrigin.name}
                </Badge>
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

        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký tại Việt Nam</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("importerRegistrant")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.importerRegistrant ? (
                <Badge
                  variant="secondary"
                  className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                >
                  {formData.importerRegistrant.name}
                </Badge>
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

        <div className="space-y-2">
          <Label>Nhà phân phối</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-105 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("distributor")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.distributor ? (
                <Badge
                  variant="secondary"
                  className="bg-primary/5 text-primary border border-primary/20 text-xs font-semibold py-0.5 px-2.5"
                >
                  {formData.distributor.name}
                </Badge>
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
          <Label>
            Bao bì quy cách <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Nhập đủ 3 thông tin rồi bấm Thêm. Cần có ít nhất 1 quy cách để lưu.
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
                  {packagingList.map((p) => (
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
                  {unitList.map((u) => (
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

      <PartnerSelectorDialog
        open={activeModal === "manufacturerOrigin"}
        onOpenChange={(open) =>
          setActiveModal(open ? "manufacturerOrigin" : null)
        }
        title="Chọn nhà sản xuất / Xuất xứ"
        isMulti={false}
        returnById
        selectedItems={
          formData.manufacturerOrigin ? [formData.manufacturerOrigin] : []
        }
        onConfirmItems={(items) =>
          onFormFieldChange("manufacturerOrigin", items[0] || null)
        }
      />

      <PartnerSelectorDialog
        open={activeModal === "importerRegistrant"}
        onOpenChange={(open) =>
          setActiveModal(open ? "importerRegistrant" : null)
        }
        title="Chọn nhà nhập khẩu / Đăng ký"
        isMulti={false}
        returnById
        selectedItems={
          formData.importerRegistrant ? [formData.importerRegistrant] : []
        }
        onConfirmItems={(items) =>
          onFormFieldChange("importerRegistrant", items[0] || null)
        }
      />

      <PartnerSelectorDialog
        open={activeModal === "distributor"}
        onOpenChange={(open) => setActiveModal(open ? "distributor" : null)}
        title="Chọn nhà phân phối"
        isMulti={false}
        returnById
        selectedItems={
          formData.distributor ? [formData.distributor] : []
        }
        onConfirmItems={(items) =>
          onFormFieldChange("distributor", items[0] || null)
        }
      />
    </div>
  );
}
