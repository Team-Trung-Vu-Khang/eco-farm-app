import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link2, Plus, X } from "lucide-react";
import {
  getSupplyTypeOptions,
  mapSupplyItemToOption,
  useRemoteSupplySearch,
} from "@/shared/hooks/useRemoteSupplySearch";
import type { DomainCode, SupplyType } from "@/features/farm-supply";

export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  actualQuantity?: string;
  unit: string;
  supplyItemId?: number;
  unitBaseId?: number;
  isPlanned?: boolean;
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
  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    unitBaseId: "",
    type:
      getSupplyTypeOptions(domainCode)[1]?.value ||
      getSupplyTypeOptions(domainCode)[0]?.value ||
      "material",
    searchValue: "",
  });

  const typeOptions = getSupplyTypeOptions(domainCode);
  const selectedTypeOption = typeOptions.find(
    (option) => option.value === newItem.type,
  );
  const { items: searchedMaterials, isFetching } = useRemoteSupplySearch(
    domainCode,
    newItem.type,
    newItem.searchValue,
  );
  const selectedMaterial = searchedMaterials.find(
    (item) => String(item.id) === newItem.name,
  );
  const materialOptions = searchedMaterials.map(mapSupplyItemToOption);
  const packagingVariantOptions = selectedMaterial?.packagingVariants || [];
  const selectedPackagingVariant = packagingVariantOptions.find(
    (variant) => String(variant.unitBase?.id) === newItem.unitBaseId,
  );
  const isEquipment = newItem.type === "equipment";
  const selectedUnitBaseId = isEquipment
    ? Number(newItem.unitBaseId || 6)
    : selectedPackagingVariant?.unitBase?.id;
  const selectedUnitLabel = isEquipment
    ? selectedPackagingVariant?.unitBase?.name || "Cái / Chiếc"
    : selectedPackagingVariant?.unitBase?.name ||
      selectedMaterial?.packagingVariants?.[0]?.unitBase?.name ||
      "";

  const handleAdd = () => {
    if (
      !selectedMaterial ||
      !newItem.qty ||
      (!isEquipment && !selectedPackagingVariant?.unitBase)
    )
      return;
    onAddMaterial({
      stageId: stageKey,
      materialType: selectedTypeOption?.label || newItem.type,
      materialName: selectedMaterial.name,
      quantity: newItem.qty,
      unit: selectedUnitLabel,
      supplyItemId: selectedMaterial.id,
      unitBaseId: selectedUnitBaseId,
      isPlanned: false,
    });
    setNewItem({
      name: "",
      qty: "",
      unitBaseId: "",
      type: newItem.type,
      searchValue: "",
    });
  };

  const stageAllocations = allocations.filter((a) => a.stageId === stageKey);

  return (
    <div className="space-y-4">
      {stageAllocations.length > 0 && (
        <div className="space-y-3">
          {stageAllocations.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {a.materialName}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {a.quantity && (
                    <span className="text-xs font-semibold text-slate-400">
                      KH: {a.quantity} {a.unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-slate-600 shrink-0">
                  Thực tế ({a.unit || "kg"}):
                </span>
                <div className="relative flex-1 flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="h-10 text-sm bg-white border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl font-bold text-slate-900"
                    value={a.actualQuantity ?? ""}
                    onChange={(e) =>
                      onUpdateActualQuantity?.(a.id, e.target.value)
                    }
                  />
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
          ))}
        </div>
      )}

      {/* Form thêm vật tư (Layout 2x2 thông thoáng) */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Row 1, Col 1: Loại vật tư */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Loại vật tư
            </span>
            <Select
              value={newItem.type}
              onValueChange={(v) => {
                const type = v as SupplyType;
                setNewItem({
                  ...newItem,
                  type,
                  name: "",
                  unitBaseId: "",
                  searchValue: "",
                });
              }}
            >
              <SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Loại vật tư..." />
              </SelectTrigger>
              <SelectContent>
                {getSupplyTypeOptions(domainCode).map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 1, Col 2: Tên vật tư */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tên vật tư
            </span>
            <Select
              value={newItem.name}
              onValueChange={(val) => {
                const item = searchedMaterials.find((m) => String(m.id) === val);
                setNewItem({
                  ...newItem,
                  name: val,
                  unitBaseId:
                    newItem.type === "equipment"
                      ? "6"
                      : String(item?.packagingVariants?.[0]?.unitBase?.id ?? ""),
                });
              }}
            >
              <SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200 rounded-xl font-medium">
                <SelectValue
                  placeholder={
                    isFetching
                      ? "Đang tải..."
                      : `Chọn ${selectedTypeOption?.label.toLowerCase() || "vật tư"}...`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {materialOptions.length > 0 ? (
                  materialOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-xs text-slate-400">
                    {isFetching
                      ? "Đang tìm kiếm..."
                      : "Không tìm thấy kết quả phù hợp."}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2, Col 1: Số lượng */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Số lượng
            </span>
            <Input
              type="number"
              min={0}
              placeholder="Nhập số lượng..."
              className="h-10 text-xs bg-white border-slate-200 rounded-xl font-medium"
              value={newItem.qty}
              onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
            />
          </div>

          {/* Row 2, Col 2: Đơn vị */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Đơn vị tính
            </span>
            <Select
              disabled={!newItem.name}
              value={newItem.unitBaseId}
              onValueChange={(val) => setNewItem({ ...newItem, unitBaseId: val })}
            >
              <SelectTrigger
                className={`w-full h-10 text-xs rounded-xl font-medium ${
                  !newItem.name
                    ? "bg-slate-50 opacity-60 cursor-not-allowed border-slate-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <SelectValue
                  placeholder={
                    !newItem.name
                      ? "Chưa chọn vật tư"
                      : isEquipment
                        ? "Cái / Chiếc"
                        : "Chọn đơn vị..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {packagingVariantOptions.length > 0 ? (
                  packagingVariantOptions.map((variant) => (
                    <SelectItem
                      key={variant.unitBase?.id ?? variant.unitBase?.name}
                      value={String(variant.unitBase?.id)}
                    >
                      {variant.unitBase?.name ||
                        variant.packagingType?.name ||
                        ""}
                    </SelectItem>
                  ))
                ) : isEquipment ? (
                  <SelectItem value="6">Cái / Chiếc</SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="button"
          className="h-10 w-full bg-slate-900 hover:bg-slate-800 font-bold text-xs gap-1.5 text-white rounded-xl shadow-2xs mt-1"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Thêm vật tư
        </Button>
      </div>
    </div>
  );
}
