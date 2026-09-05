import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link2, Plus, X, Search, ChevronRight } from "lucide-react";
import { getSupplyTypeOptions } from "@/shared/hooks/useRemoteSupplySearch";
import type {
  DomainCode,
  SupplyType,
  SupplyItemResponse,
} from "@/features/farm-supply";
import { SupplySearchDialog } from "./SupplySelectorDialog";

export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  actualQuantity?: string;
  unit: string;
  unitMode?: "PACKAGING" | "BASIC";
  packagingSpecLabel?: string;
  supplyItemId?: number;
  unitBaseId?: number;
  isPlanned?: boolean;
  isDirty?: boolean;
}

export function StageMaterialPicker({
  stageKey,
  allocations,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateActualQuantity,
  domainCode,
}: {
  stageKey: string;
  allocations: MaterialAllocation[];
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
  onUpdateActualQuantity?: (id: number, val: string) => void;
  domainCode: DomainCode;
}) {
  const typeOptions = getSupplyTypeOptions(domainCode);
  const [selectedType, setSelectedType] = useState<SupplyType>(
    typeOptions[1]?.value || typeOptions[0]?.value || "fertilizer",
  );
  const [selectedMaterial, setSelectedMaterial] =
    useState<SupplyItemResponse | null>(null);
  const [qty, setQty] = useState("");
  const [selectedUnitKey, setSelectedUnitKey] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedTypeOption = typeOptions.find(
    (option) => option.value === selectedType,
  );

  const isEquipment = selectedType === "equipment";

  // Dynamic unit options for selected material
  const unitOptions = useMemo(() => {
    if (isEquipment) {
      return [
        {
          key: "equipment",
          label: "Cái / Chiếc",
          unitMode: "BASIC" as const,
          unitLabel: "Cái / Chiếc",
          unitBaseId: 6,
          packagingSpecLabel: undefined,
        },
      ];
    }
    if (!selectedMaterial) return [];

    const variants = selectedMaterial.packagingVariants || [];
    if (variants.length > 0) {
      const options: Array<{
        key: string;
        label: string;
        unitMode: "PACKAGING" | "BASIC";
        unitLabel: string;
        unitBaseId?: number;
        packagingSpecLabel?: string;
      }> = [];

      variants.forEach((v, idx) => {
        const rawBasicName = v.unitBase?.name || "kg";
        const basicName =
          rawBasicName.replace(/\s*\([^)]*\)/g, "").trim() || rawBasicName;
        const packTypeName = v.packagingType?.name || "Quy cách";
        const qty = v.containedQuantity || 1;
        const specLabel = `${packTypeName} ${qty} ${basicName}`;

        options.push({
          key: `pack-${v.unitBase?.id ?? idx}`,
          label: specLabel,
          unitMode: "PACKAGING",
          unitLabel: packTypeName,
          unitBaseId: v.unitBase?.id,
          packagingSpecLabel: specLabel,
        });

        options.push({
          key: `basic-${v.unitBase?.id ?? idx}`,
          label: basicName,
          unitMode: "BASIC",
          unitLabel: basicName,
          unitBaseId: v.unitBase?.id,
          packagingSpecLabel: undefined,
        });
      });
      return options;
    }

    return [
      {
        key: "basic-default",
        label: "kg",
        unitMode: "BASIC" as const,
        unitLabel: "kg",
        unitBaseId: 1,
        packagingSpecLabel: undefined,
      },
    ];
  }, [selectedMaterial, isEquipment]);

  const selectedUnitOption = unitOptions.find(
    (opt) => opt.key === selectedUnitKey,
  );

  const handleSelectMaterial = (item: SupplyItemResponse) => {
    setSelectedMaterial(item);
    let defaultUnitKey = "";
    if (selectedType === "equipment") {
      defaultUnitKey = "equipment";
    } else if (item.packagingVariants && item.packagingVariants.length > 0) {
      const v = item.packagingVariants[0];
      defaultUnitKey = `pack-${v.unitBase?.id ?? 0}`;
    } else {
      defaultUnitKey = "basic-default";
    }
    setSelectedUnitKey(defaultUnitKey);
  };

  const handleAdd = () => {
    if (!selectedMaterial || !qty || !selectedUnitOption) return;

    onAddMaterial({
      stageId: stageKey,
      materialType: selectedTypeOption?.label || selectedType,
      materialName: selectedMaterial.name,
      quantity: qty,
      unit: selectedUnitOption.unitLabel,
      unitMode: selectedUnitOption.unitMode,
      packagingSpecLabel: selectedUnitOption.packagingSpecLabel,
      supplyItemId: selectedMaterial.id,
      unitBaseId: selectedUnitOption.unitBaseId,
      isPlanned: false,
      isDirty: true,
    });

    // Reset inputs
    setSelectedMaterial(null);
    setQty("");
    setSelectedUnitKey("");
  };

  const stageAllocations = allocations.filter((a) => a.stageId === stageKey);

  return (
    <div className="space-y-4">
      {/* List of allocated materials for this stage */}
      {stageAllocations.length > 0 && (
        <div className="space-y-3">
          {stageAllocations.map((a) => {
            const displayUnit =
              a.unitMode === "PACKAGING" && a.packagingSpecLabel
                ? a.packagingSpecLabel
                : a.unit || "kg";

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-slate-900 truncate block">
                        {a.materialName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.quantity && (
                      <span className="text-xs font-semibold text-slate-400">
                        KH: {a.quantity} {displayUnit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">
                    Thực tế:
                  </span>
                  <div className="relative flex-1 flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      clearable={false}
                      placeholder="0"
                      className="h-10 text-sm bg-white border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl font-bold text-slate-900"
                      value={a.actualQuantity ?? ""}
                      onChange={(e) =>
                        onUpdateActualQuantity?.(a.id, e.target.value)
                      }
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">
                      {displayUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveMaterial(a.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      title="Xóa vật tư này"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Form thêm vật tư (UI cũ 4 cột) */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Col 1: Loại vật tư */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Loại vật tư
            </span>
            <Select
              value={selectedType}
              onValueChange={(v) => {
                setSelectedType(v as SupplyType);
                setSelectedMaterial(null);
                setSelectedUnitKey("");
              }}
            >
              <SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Loại vật tư..." />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Col 2: Tên vật tư (Mở Dialog chọn khi click) */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tên vật tư
            </span>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="w-full h-10 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl font-medium text-xs flex items-center justify-between text-left transition-all group"
            >
              <span className="truncate flex items-center gap-1.5 text-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-green-600 transition-colors" />
                <span
                  className={
                    selectedMaterial
                      ? "font-bold text-slate-900"
                      : "text-slate-400"
                  }
                >
                  {selectedMaterial
                    ? selectedMaterial.name
                    : `Chọn ${selectedTypeOption?.label.toLowerCase() || "vật tư"}...`}
                </span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Col 3: Số lượng */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Số lượng
            </span>
            <Input
              type="number"
              min={0}
              clearable={false}
              placeholder="Nhập số lượng..."
              className="h-10 text-xs bg-white border-slate-200 rounded-xl font-medium"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          {/* Col 4: Đơn vị tính */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Đơn vị tính
            </span>
            <Select
              disabled={!selectedMaterial}
              value={selectedUnitKey}
              onValueChange={(val) => setSelectedUnitKey(val)}
            >
              <SelectTrigger
                className={`w-full h-10 text-xs rounded-xl font-medium ${
                  !selectedMaterial
                    ? "bg-slate-50 opacity-60 cursor-not-allowed border-slate-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <SelectValue
                  placeholder={
                    !selectedMaterial ? "Chưa chọn vật tư" : "Chọn đơn vị..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="button"
          disabled={!selectedMaterial || !qty || !selectedUnitOption}
          className="h-10 w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 font-bold text-xs gap-1.5 text-white rounded-xl shadow-2xs mt-1 cursor-pointer"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Thêm vật tư
        </Button>
      </div>

      {/* Dialog Tìm kiếm & Chọn Vật Tư */}
      <SupplySearchDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        domainCode={domainCode}
        selectedType={selectedType}
        selectedMaterialId={selectedMaterial ? String(selectedMaterial.id) : ""}
        onSelectMaterial={handleSelectMaterial}
      />
    </div>
  );
}
