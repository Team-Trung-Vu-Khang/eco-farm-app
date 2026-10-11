import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Input,
  cn,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Package, CheckCircle2, Loader2 } from "lucide-react";
import {
  getSupplyTypeOptions,
  useRemoteSupplySearch,
} from "@/shared/hooks/useRemoteSupplySearch";
import type {
  DomainCode,
  SupplyType,
  SupplyItemResponse,
} from "@/features/farm-supply";

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
  const isMobile = useIsMobile();
  const typeOptions = getSupplyTypeOptions(domainCode);
  const selectedTypeOption = typeOptions.find(
    (opt) => opt.value === selectedType,
  );

  const {
    items: searchedMaterials,
    totalElements,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useRemoteSupplySearch(domainCode, selectedType, searchValue);

  // Trigger fetchNextPage when user scrolls near bottom of list
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const handleSelectItem = (item: SupplyItemResponse) => {
    onSelectMaterial(item);
    setSearchValue("");
    onOpenChange(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setSearchValue("");
    onOpenChange(val);
  };

  const renderItemsList = (isMobileView: boolean) => {
    if (searchedMaterials.length === 0) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-1",
            isMobileView ? "h-full min-h-[220px]" : "h-[260px]",
          )}
        >
          <Package className="w-8 h-8 text-slate-300 stroke-1" />
          <p className="text-xs font-medium">
            {isFetching ? "Đang tìm kiếm..." : "Không tìm thấy vật tư phù hợp"}
          </p>
          <p className="text-[11px] text-slate-400">
            Thử thay đổi từ khóa tìm kiếm
          </p>
        </div>
      );
    }

    return (
      <div
        className={
          isMobileView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 gap-2"
        }
      >
        {searchedMaterials.map((item) => {
          const isSelected = String(item.id) === selectedMaterialId;

          return (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={cn(
                isMobileView
                  ? "px-3.5 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                  : "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5",
                isSelected
                  ? "bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100",
              )}
            >
              <div
                className={
                  isMobileView
                    ? "contents"
                    : "flex items-start justify-between gap-2"
                }
              >
                <span
                  className={
                    isMobileView
                      ? "min-w-0 flex-1 text-sm font-semibold text-slate-900 break-words line-clamp-2"
                      : "text-xs font-bold text-slate-900 line-clamp-2"
                  }
                >
                  {item.name}
                </span>
                {isSelected && (
                  <CheckCircle2
                    className={cn(
                      "w-4 h-4 text-emerald-600 shrink-0",
                      isMobileView ? "order-last" : "mt-0.5",
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Bottom Status / Loader Indicator */}
        <div className="col-span-full py-2 flex items-center justify-center text-xs text-slate-400 min-h-[36px]">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang tải thêm vật tư...</span>
            </div>
          ) : hasNextPage ? (
            <span className="text-[11px] text-slate-400">
              Cuộn xuống để xem thêm
            </span>
          ) : searchedMaterials.length > 20 ? (
            <span className="text-[11px] text-slate-400">
              Đã hiển thị tất cả vật tư
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[82dvh] max-h-[85dvh] flex flex-col rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-slate-200 bg-white shadow-2xl focus:outline-none"
        >
          {/* Visual pull bar */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2 shrink-0" />

          {/* Header */}
          <SheetHeader className="shrink-0 text-left pb-3 border-b border-slate-100 pr-8">
            <SheetTitle className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Package className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Chọn {selectedTypeOption?.label.toLowerCase() || "vật tư"}
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Search Bar */}
          <div className="shrink-0 pt-3">
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
          </div>

          {/* Results Header */}
          <div className="shrink-0 flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 pt-2 pb-1">
            <span>
              Hiển thị {searchedMaterials.length}
              {totalElements > 0 ? ` / ${totalElements}` : ""} vật tư
            </span>
            {isFetching && !isFetchingNextPage && (
              <span className="text-emerald-600 animate-pulse font-medium flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Đang tìm kiếm...
              </span>
            )}
          </div>

          {/* Scrollable List container taking up the fixed remaining height */}
          <div
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5 mt-1"
          >
            {renderItemsList(true)}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="flex items-center justify-between gap-2 text-slate-900 font-bold text-base">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
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
            <span>
              Hiển thị {searchedMaterials.length}
              {totalElements > 0 ? ` / ${totalElements}` : ""} vật tư
            </span>
            {isFetching && !isFetchingNextPage && (
              <span className="text-emerald-600 animate-pulse font-medium flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Đang tìm kiếm...
              </span>
            )}
          </div>

          {/* Supply Items Scrollable Container */}
          <div
            onScroll={handleScroll}
            className="h-[320px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-2 scrollbar-thin"
          >
            {renderItemsList(false)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
