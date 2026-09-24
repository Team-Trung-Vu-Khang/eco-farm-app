import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";
import { farmSupplyApi } from "@/features/farm-supply";
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
import { useQuery } from "@tanstack/react-query";
import { Building2, DollarSign, Package, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import type { ByProductFormData } from "../../types/types";

interface ByProductSuppliersStepProps {
  formData: ByProductFormData;
  updateField: (
    field: keyof ByProductFormData,
    value: ByProductFormData[keyof ByProductFormData],
  ) => void;
}

export const ByProductSuppliersStep = ({
  formData,
  updateField,
}: ByProductSuppliersStepProps) => {
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

  const packagingList = (packagingTypes ?? []).map((p) => p.name);
  const unitList = (baseUnits ?? []).map((u) => u.name);

  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");
  const [activeModal, setActiveModal] = useState<
    "manufacturerOrigin" | "importerRegistrant" | "distributor" | null
  >(null);

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
          Xuất xứ & Đơn vị cung ứng phụ phẩm
        </h3>

        <div className="space-y-2">
          <Label>Nhà sản xuất / Nơi phát sinh phụ phẩm</Label>
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
                  Bấm để chọn nhà sản xuất / cơ sở sản xuất...
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
        </div>

        <div className="space-y-2">
          <Label>Nhà nhập khẩu / Đơn vị chứng nhận</Label>
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
                  Bấm để chọn đơn vị nhập khẩu / đăng ký...
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
        </div>

        <div className="space-y-2">
          <Label>Nhà phân phối chính trên thị trường</Label>
          <div
            className="flex items-center justify-between border rounded-xl p-3 bg-slate-50 border-dashed border-slate-350 hover:bg-slate-100/50 hover:shadow-xs transition-all cursor-pointer min-h-11"
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
                  Bấm để chọn đơn vị phân phối...
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
            placeholder="VD: 450.000 đ / bao 25kg, 3.500.000 đ / tấn"
          />
        </div>

        {/* Cấu hình Đơn vị Phụ phẩm */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Chế độ cấu hình:
            </span>
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
                Quy cách đầy đủ (Bao 25kg, Khối 1m3...)
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
                Không rõ quy cách (Chỉ chọn đơn vị cơ bản kg, tấn, m3...)
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-end">
            {configMode === "SPEC" ? (
              <>
                <div className="flex-1 space-y-1 min-w-[130px]">
                  <Label className="text-xs text-muted-foreground">
                    Loại đóng gói
                  </Label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Loại (Bao, Tải...)" />
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
                    placeholder="VD: 25, 50"
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
                      <SelectValue placeholder="Đơn vị (kg, tấn...)" />
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
                    <SelectValue placeholder="Chọn đơn vị cơ sở (kg, tấn, m3, bao...)" />
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
        onOpenChange={(open) =>
          setActiveModal(open ? "manufacturerOrigin" : null)
        }
        title="Chọn nhà sản xuất / Nơi phát sinh"
        isMulti={false}
        returnById
        selectedItems={
          formData.manufacturerOrigin ? [formData.manufacturerOrigin] : []
        }
        onConfirmItems={(items) =>
          updateField("manufacturerOrigin", items[0] || null)
        }
      />

      <PartnerSelectorDialog
        open={activeModal === "importerRegistrant"}
        onOpenChange={(open) =>
          setActiveModal(open ? "importerRegistrant" : null)
        }
        title="Chọn nhà nhập khẩu / Đơn vị chứng nhận"
        isMulti={false}
        returnById
        selectedItems={
          formData.importerRegistrant ? [formData.importerRegistrant] : []
        }
        onConfirmItems={(items) =>
          updateField("importerRegistrant", items[0] || null)
        }
      />

      <PartnerSelectorDialog
        open={activeModal === "distributor"}
        onOpenChange={(open) => setActiveModal(open ? "distributor" : null)}
        title="Chọn nhà phân phối"
        isMulti={false}
        returnById
        selectedItems={formData.distributor ? [formData.distributor] : []}
        onConfirmItems={(items) => updateField("distributor", items[0] || null)}
      />
    </div>
  );
};
