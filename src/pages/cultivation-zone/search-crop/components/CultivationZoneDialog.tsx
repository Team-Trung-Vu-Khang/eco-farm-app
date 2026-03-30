import { Button, Dialog, DialogContent, ScrollArea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Region } from "../../../region-chart/constants";
import { useCultivationZoneDialog } from "../hooks/useCultivationZoneDialog";
import { CultivationZoneDialogEmptyState } from "./cultivation-zone-dialog/CultivationZoneDialogEmptyState";
import { CultivationZoneDialogFilterPanel } from "./cultivation-zone-dialog/CultivationZoneDialogFilterPanel";
import { CultivationZoneDialogHeader } from "./cultivation-zone-dialog/CultivationZoneDialogHeader";
import { CultivationZoneRegionCard } from "./cultivation-zone-dialog/CultivationZoneRegionCard";

type CultivationZoneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selections: Region[]) => void;
  initialSelections: Region[];
};

export const CultivationZoneDialog = ({
  open,
  onOpenChange,
  onConfirm,
  initialSelections = [],
}: CultivationZoneDialogProps) => {
  const {
    searchTerm,
    setSearchTerm,
    entFilter,
    setEntFilter,
    provFilter,
    setProvFilter,
    distFilter,
    setDistFilter,
    tempSelections,
    filteredRegions,
    enterprises,
    provinceOptions,
    districtOptions,
    toggleSelection,
    isSelected,
    resetFilters,
    handleConfirm,
  } = useCultivationZoneDialog({
    open,
    onOpenChange,
    onConfirm,
    initialSelections,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl border-none p-0 shadow-2xl">
        <CultivationZoneDialogHeader
          selections={tempSelections}
          onRemoveSelection={toggleSelection}
        />

        <CultivationZoneDialogFilterPanel
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          entFilter={entFilter}
          onEntFilterChange={setEntFilter}
          provFilter={provFilter}
          onProvFilterChange={setProvFilter}
          distFilter={distFilter}
          onDistFilterChange={setDistFilter}
          enterprises={enterprises}
          provinceOptions={provinceOptions}
          districtOptions={districtOptions}
          onResetFilters={resetFilters}
        />

        <ScrollArea className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {filteredRegions.length === 0 ? (
            <CultivationZoneDialogEmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
              {filteredRegions.map((region) => (
                <CultivationZoneRegionCard
                  key={region.id}
                  region={region}
                  enterprise={enterprises.find(
                    (enterprise) =>
                      enterprise.id.toString() === region.enterpriseId.toString(),
                  )}
                  selected={isSelected(region.id)}
                  onToggle={() => toggleSelection(region)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between border-t bg-white p-8">
          <div className="text-sm">
            <span className="font-medium text-slate-400">Đã chọn: </span>
            <span className="text-lg font-black text-primary">
              {tempSelections.length}
            </span>
            <span className="font-medium text-slate-400"> vùng canh tác</span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-2xl border-slate-200 px-8 font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirm}
              className="h-12 rounded-2xl px-10 font-bold shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95"
            >
              Xác nhận lựa chọn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
