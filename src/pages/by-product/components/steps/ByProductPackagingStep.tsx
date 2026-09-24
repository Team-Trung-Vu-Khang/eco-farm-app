import { useState } from "react";
import { farmSupplyApi } from "@/features/farm-supply";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X } from "lucide-react";
import type { ByProductFormData } from "../../types/types";
import { PartnerSelectorDialog } from "@/components/organizations/PartnerSelectorDialog";

interface ByProductPackagingStepProps {
  formData: ByProductFormData;
  updateField: (
    field: keyof ByProductFormData,
    value: ByProductFormData[keyof ByProductFormData],
  ) => void;
}

export function ByProductPackagingStep({
  formData,
  updateField,
}: ByProductPackagingStepProps) {
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

  const [manufacturerDialogOpen, setManufacturerDialogOpen] = useState(false);
  const [importerDialogOpen, setImporterDialogOpen] = useState(false);
  const [distributorDialogOpen, setDistributorDialogOpen] = useState(false);

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
      updateField("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
  };

  const removePackagingSpec = (value: string) => {
    updateField(
      "packagingSpecs",
      packagingSpecsArr.filter((v) => v !== value),
    );
  };

  return (
    <div className="space-y-6">
      {/* Quy cách đóng gói */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base text-slate-800">
          Cấu hình Quy cách đóng gói &amp; Đơn vị
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl text-xs font-medium gap-1">
            <button
              type="button"
              onClick={() => setConfigMode("SPEC")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                configMode === "SPEC"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quy cách đầy đủ (Bao 50kg, Khối...)
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
              Chỉ chọn Đơn vị cơ bản (kg, bao, tấn...)
            </button>
          </div>
        </div>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-3">
            {configMode === "SPEC" ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4 space-y-1.5">
                  <Label className="text-xs text-slate-600">Đóng gói theo</Label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đóng gói..." />
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
                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-slate-600">Dung tích / Số lượng</Label>
                  <Input
                    type="number"
                    placeholder="VD: 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-slate-600">Đơn vị đo</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đơn vị..." />
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
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    onClick={addPackagingSpec}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9 space-y-1.5">
                  <Label className="text-xs text-slate-600">Đơn vị cơ bản</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn đơn vị cơ bản..." />
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
                <div className="sm:col-span-3">
                  <Button
                    type="button"
                    onClick={addPackagingSpec}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {packagingSpecsArr.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {packagingSpecsArr.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-2 rounded-lg"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removePackagingSpec(spec)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Giá tham khảo */}
      <div className="space-y-2">
        <Label>Giá tham khảo (VNĐ)</Label>
        <Input
          value={formData.referencePrice}
          onChange={(e) => updateField("referencePrice", e.target.value)}
          placeholder="VD: 120.000 đ / bao 50kg"
        />
      </div>

      {/* Tổ chức sản xuất / Phân phối */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base text-slate-800">
          Tổ chức Sản xuất &amp; Phân phối
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nhà sản xuất / Nguồn gốc</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => setManufacturerDialogOpen(true)}
            >
              <span className="truncate">
                {formData.manufacturerOrigin?.name || "Chọn nhà sản xuất..."}
              </span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Đơn vị đăng ký / Nhập khẩu</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => setImporterDialogOpen(true)}
            >
              <span className="truncate">
                {formData.importerRegistrant?.name || "Chọn đơn vị nhập khẩu..."}
              </span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Nhà phân phối</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => setDistributorDialogOpen(true)}
            >
              <span className="truncate">
                {formData.distributor?.name || "Chọn nhà phân phối..."}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs chọn đối tác */}
      <PartnerSelectorDialog
        open={manufacturerDialogOpen}
        onOpenChange={setManufacturerDialogOpen}
        onSelect={(org) => updateField("manufacturerOrigin", org)}
        title="Chọn Nhà sản xuất"
      />
      <PartnerSelectorDialog
        open={importerDialogOpen}
        onOpenChange={setImporterDialogOpen}
        onSelect={(org) => updateField("importerRegistrant", org)}
        title="Chọn Đơn vị đăng ký / Nhập khẩu"
      />
      <PartnerSelectorDialog
        open={distributorDialogOpen}
        onOpenChange={setDistributorDialogOpen}
        onSelect={(org) => updateField("distributor", org)}
        title="Chọn Nhà phân phối"
      />
    </div>
  );
}
