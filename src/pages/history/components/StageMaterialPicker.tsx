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

  return (
    <div className="space-y-3">
      {allocations.length > 0 && (
        <div className="space-y-2.5">
          {allocations.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${
                      a.isPlanned
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-sm text-slate-850 truncate">
                    {a.materialName}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {a.isPlanned && a.quantity && (
                    <span className="text-xs font-medium text-slate-400">
                      KH: {a.quantity} {a.unit}
                    </span>
                  )}
                  {!a.isPlanned && (
                    <button
                      type="button"
                      onClick={() => onRemoveMaterial(a.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xóa vật tư này"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-slate-600 shrink-0">
                  Thực tế ({a.unit || "đơn vị"}):
                </span>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="h-10 text-sm bg-white border-slate-200 focus:border-green-500 focus:ring-green-500/20 flex-1 font-semibold text-slate-800"
                  value={a.actualQuantity ?? ""}
                  onChange={(e) =>
                    onUpdateActualQuantity?.(a.id, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3">
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
            <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
              <SelectValue placeholder="Loại..." />
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

        <div className="col-span-4">
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
            <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
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

        <div className="col-span-3">
          <Input
            type="number"
            placeholder="Số lượng"
            className="h-9 text-xs bg-white border-slate-200"
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
        </div>

        <div className="col-span-2">
          <Select
            value={newItem.unitBaseId}
            onValueChange={(val) => setNewItem({ ...newItem, unitBaseId: val })}
          >
            <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
              <SelectValue
                placeholder={isEquipment ? "Cái / Chiếc" : "Đơn vị..."}
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
        size="sm"
        className="h-9 w-full bg-slate-900 hover:bg-slate-800 font-bold text-xs gap-1"
        onClick={handleAdd}
      >
        <Plus className="w-3.5 h-3.5" />
        Thêm vật tư
      </Button>
    </div>
  );
}
