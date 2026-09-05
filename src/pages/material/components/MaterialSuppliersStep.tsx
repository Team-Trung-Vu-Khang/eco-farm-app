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
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

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
  // Fetch packaging types and units from API
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
    baseUnits && baseUnits.length > 0
      ? baseUnits.map((u) => u.name)
      : MEASURE_UNIT_OPTIONS;

  const [activeModal, setActiveModal] = useState<
    "manufacturerOrigin" | "importerRegistrant" | "distributor" | null
  >(null);

  // Mode state: SPEC (Quy cách đóng gói) vs BASE_UNIT (Đơn vị cơ bản)
  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");

  // Quantity and unit state for packaging specs
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");

  const packagingSpecsArr = formData.packagingSpecs || [];

  const addPackagingSpec = () => {
    let spec = "";
    if (configMode === "SPEC") {
      const trimmedQty = quantity.trim();
      if (!packaging || !trimmedQty || !unit) return;
      spec = `${packaging} ${trimmedQty} ${unit}`;
    } else {
      if (!unit) return;
      spec = `${unit}`;
    }
    if (!packagingSpecsArr.includes(spec)) {
      onFormFieldChange("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
  };

  const removeTag = (
    field: "packagingSpecs",
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

        {/* Importer Registrant */}
        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đăng ký</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("importerRegistrant")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.importerRegistrant ? (
                <Badge
                  key={formData.importerRegistrant.id}
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

        {/* Distributor */}
        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
            onClick={() => setActiveModal("distributor")}
          >
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 items-center">
              {formData.distributor ? (
                <Badge
                  key={formData.distributor.id}
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

      {/* Packaging Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Cấu hình Đơn vị Vật tư *
        </h3>

        {/* Mode switch on separate line */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Chế độ cấu hình:</span>
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setConfigMode("SPEC")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  configMode === "SPEC"
                    ? "bg-white text-primary shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Quy cách đầy đủ (Chai 500ml, Bao 25kg...)
              </button>
              <button
                type="button"
                onClick={() => setConfigMode("BASE_UNIT")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  configMode === "BASE_UNIT"
                    ? "bg-white text-primary shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Không rõ quy cách (Chỉ chọn đơn vị cơ bản kg, l...)
              </button>
            </div>
          </div>

          {/* Input row */}
          <div className="flex gap-2 items-end">
            {configMode === "SPEC" ? (
              <>
                <div className="flex-1 space-y-1 min-w-[130px]">
                  <Label className="text-xs text-muted-foreground">
                    Loại đóng gói
                  </Label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Loại (Chai, Bao...)" />
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
                <div className="w-28 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Số lượng
                  </Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="VD: 500, 25"
                    min={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPackagingSpec();
                      }
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1 min-w-[120px]">
                  <Label className="text-xs text-muted-foreground">
                    Đơn vị cơ sở
                  </Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Đơn vị (ml, kg...)" />
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
              </>
            ) : (
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Đơn vị cơ sở
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Chọn đơn vị cơ sở (kg, lít, ml, viên...)" />
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
            )}
            <Button
              type="button"
              onClick={addPackagingSpec}
              disabled={
                configMode === "SPEC"
                  ? !packaging || !quantity.trim() || !unit
                  : !unit
              }
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
        returnById
        selectedItems={formData.manufacturerOrigin ? [formData.manufacturerOrigin] : []}
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
        selectedItems={formData.importerRegistrant ? [formData.importerRegistrant] : []}
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
        selectedItems={formData.distributor ? [formData.distributor] : []}
        onConfirmItems={(items) =>
          onFormFieldChange("distributor", items[0] || null)
        }
      />
    </div>
  );
}
