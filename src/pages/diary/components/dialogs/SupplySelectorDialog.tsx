import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Package, CheckCircle2, Layers } from "lucide-react";
import {
  getSupplyTypeOptions,
  useRemoteSupplySearch,
} from "@/shared/hooks/useRemoteSupplySearch";
import type { DomainCode, SupplyType, SupplyItemResponse } from "@/features/farm-supply";

interface SupplySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainCode: DomainCode;
  selectedType: SupplyType;
  selectedMaterialId: string;
  onSelectMaterial: (item: SupplyItemResponse) => void;
}

export function SupplySearchDialog({
  open,
  onOpenChange,
  domainCode,
  selectedType,
  selectedMaterialId,
  onSelectMaterial,
}: SupplySearchDialogProps) {
  const [searchValue, setSearchValue] = useState("");
  const typeOptions = getSupplyTypeOptions(domainCode);
  const selectedTypeOption = typeOptions.find((opt) => opt.value === selectedType);

  const { items: searchedMaterials, isFetching } = useRemoteSupplySearch(
    domainCode,
    selectedType,
    searchValue,
  );

  const handleSelectItem = (item: SupplyItemResponse) => {
    onSelectMaterial(item);
    setSearchValue("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setSearchValue("");
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-xl bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="flex items-center justify-between gap-2 text-slate-900 font-bold text-base">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Chọn {selectedTypeOption?.label.toLowerCase() || "vật tư"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder={`Tìm kiếm tên hoặc mã ${selectedTypeOption?.label.toLowerCase() || "vật tư"}...`}
              className="pl-9 h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-medium focus:bg-white transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
            <span>Danh sách kết quả ({searchedMaterials.length})</span>
            {isFetching && (
              <span className="text-green-600 animate-pulse font-medium">
                Đang tìm kiếm...
              </span>
            )}
          </div>

          {/* Supply Items ScrollArea */}
          <ScrollArea className="h-[280px] rounded-xl border border-slate-200 bg-slate-50/40 p-2">
            {searchedMaterials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchedMaterials.map((item) => {
                  const isSelected = String(item.id) === selectedMaterialId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5",
                        isSelected
                          ? "bg-green-50/90 border-green-500 ring-1 ring-green-500 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-2">
                          {item.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        )}
                      </div>

                      {item.packagingVariants && item.packagingVariants.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 self-start">
                          <Layers className="w-3 h-3" />
                          <span>
                            {item.packagingVariants.length} quy cách đóng gói
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-1">
                <Package className="w-8 h-8 text-slate-300 stroke-1" />
                <p className="text-xs font-medium">
                  {isFetching
                    ? "Đang tìm kiếm..."
                    : "Không tìm thấy vật tư phù hợp"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Thử thay đổi từ khóa tìm kiếm
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
