import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, MapPin, Search, Sprout } from "lucide-react";
import type { CropSubjectVariantItem } from "../../types/history-form.types";

export interface SelectedTreeItem {
  id: string | number;
  codeName?: string;
  label?: string;
  treeCode?: string;
  regionName?: string;
}

interface HarvestTreeSelectorDialogProps {
  selectedTreeIds?: string[];
  selectedItems?: SelectedTreeItem[];
  variants?: CropSubjectVariantItem[];
  onConfirm?: (selectedTrees: CropSubjectVariantItem[]) => void;
  onConfirmSelections?: (selectedTrees: CropSubjectVariantItem[]) => void;
  customTrigger?: React.ReactNode;
}

export function HarvestTreeSelectorDialog({
  selectedTreeIds,
  selectedItems,
  variants = [],
  onConfirm,
  onConfirmSelections,
  customTrigger,
}: HarvestTreeSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [regionQuery, setRegionQuery] = useState<string>("");
  const [variantNameQuery, setVariantNameQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const availableItems = useMemo<CropSubjectVariantItem[]>(() => {
    return variants || [];
  }, [variants]);

  const effectiveSelectedIds = useMemo(() => {
    if (selectedTreeIds && Array.isArray(selectedTreeIds)) {
      return selectedTreeIds.map(String);
    }
    if (selectedItems && Array.isArray(selectedItems)) {
      return selectedItems.map((item) => String(item.id));
    }
    return [];
  }, [selectedTreeIds, selectedItems]);

  const filteredTrees = useMemo(() => {
    return availableItems.filter((item) => {
      const regName = [item.regionName, item.zoneName, (item as any).plotName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (regionQuery.trim()) {
        const query = regionQuery.trim().toLowerCase();
        if (!regName.includes(query)) return false;
      }

      if (variantNameQuery.trim()) {
        const query = variantNameQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchProd = (item.productionSubjectName || "")
          .toLowerCase()
          .includes(query);
        if (!matchName && !matchProd) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchCode = (item.code || "").toLowerCase().includes(query);
        const matchName = item.name.toLowerCase().includes(query);
        const matchProd = (item.productionSubjectName || "")
          .toLowerCase()
          .includes(query);
        if (!matchCode && !matchName && !matchProd && !regName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [availableItems, regionQuery, variantNameQuery, searchQuery]);

  const toggleSelectTree = (id: string | number) => {
    const idStr = String(id);
    setTempSelectedIds((prev) =>
      prev.includes(idStr) ? prev.filter((i) => i !== idStr) : [...prev, idStr],
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredTrees.map((t) => String(t.id));
    const isAllSelected = allFilteredIds.every((id) =>
      tempSelectedIds.includes(id),
    );
    if (isAllSelected) {
      setTempSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      );
    } else {
      setTempSelectedIds((prev) =>
        Array.from(new Set([...prev, ...allFilteredIds])),
      );
    }
  };

  const handleOpen = () => {
    setTempSelectedIds(effectiveSelectedIds);
    setIsOpen(true);
  };

  const handleSave = () => {
    const selectedTrees = availableItems.filter((t) =>
      tempSelectedIds.includes(String(t.id)),
    );
    onConfirm?.(selectedTrees);
    onConfirmSelections?.(selectedTrees);
    setIsOpen(false);
  };

  return (
    <>
      {customTrigger ? (
        <div onClick={handleOpen}>{customTrigger}</div>
      ) : (
        <Button
          type="button"
          onClick={handleOpen}
          variant="outline"
          className="w-full h-11 border-dashed border-green-300 bg-green-50/50 hover:bg-green-100/60 text-green-700 font-bold gap-2 rounded-lg cursor-pointer"
        >
          <Sprout className="w-4 h-4 text-green-600" />
          <span>
            {effectiveSelectedIds.length > 0
              ? `Đã chọn ${effectiveSelectedIds.length} giống cây trồng (Nhấn để thay đổi)`
              : "Chọn danh sách giống cây trồng..."}
          </span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-lg border-none shadow-2xl flex flex-col h-[580px]">
          <DialogHeader className="p-4 px-5 bg-slate-50 border-b shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                <Sprout className="w-5 h-5 text-green-600" />
                Chọn danh sách giống cây trồng
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Tìm kiếm theo Vùng canh tác hoặc Mã / Tên giống cây trồng
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-none font-bold text-xs">
              Đã chọn {tempSelectedIds.length} giống
            </Badge>
          </DialogHeader>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-white border-b space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Filter 1: Tim kiem Vung trong */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lọc theo Vùng canh tác
                </span>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nhập tên Vùng canh tác..."
                    value={regionQuery}
                    onChange={(e) => setRegionQuery(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Filter 2: Loc theo Ten giong */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lọc theo Tên giống
                </span>
                <div className="relative">
                  <Sprout className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nhập tên giống..."
                    value={variantNameQuery}
                    onChange={(e) => setVariantNameQuery(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Search Box & Select All */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm theo Mã giống, Tên giống cây trồng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-lg"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectAll}
                className="h-9 px-3 text-xs font-bold shrink-0 border-slate-200 rounded-lg"
              >
                Chọn tất cả ({filteredTrees.length})
              </Button>
            </div>
          </div>

          {/* Trees List with fixed height container */}
          <ScrollArea className="flex-1 overflow-y-auto p-4">
            {filteredTrees.length > 0 ? (
              <div className="grid gap-2">
                {filteredTrees.map((item) => {
                  const idStr = String(item.id);
                  const isChecked = tempSelectedIds.includes(idStr);
                  const locationLabel =
                    item.zoneName || item.regionName || (item as any).plotName || "Vùng canh tác";

                  return (
                    <div
                      key={idStr}
                      onClick={() => toggleSelectTree(item.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-green-50/80 border-green-300 shadow-2xs"
                          : "bg-white border-slate-150 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? "bg-green-600 text-white"
                              : "border border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-xs truncate">
                              {item.name}
                            </span>
                            {item.productionSubjectName && (
                              <span className="text-[11px] text-slate-500 font-medium">
                                ({item.productionSubjectName})
                              </span>
                            )}
                            {item.code && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 shrink-0 font-bold"
                              >
                                {item.code}
                              </Badge>
                            )}
                            {item.sourceType && (
                              <Badge
                                variant="secondary"
                                className={`text-[10px] font-bold border shrink-0 ${
                                  item.sourceType === "FOUNDATION"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}
                              >
                                {item.sourceType === "FOUNDATION" ? "Foundation" : "Workspace"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {locationLabel}
                            </span>
                            {(item as any).plantedDate && (
                              <>
                                <span>•</span>
                                <span>Trồng ngày: {(item as any).plantedDate}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            ) : (
              <div className="text-center py-12">
                <Sprout className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium text-xs">
                  Không tìm thấy giống cây trồng phù hợp với bộ lọc.
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-lg h-10 px-5 text-xs font-bold"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-lg h-10 px-6 text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
            >
              Xác nhận ({tempSelectedIds.length} mục)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
