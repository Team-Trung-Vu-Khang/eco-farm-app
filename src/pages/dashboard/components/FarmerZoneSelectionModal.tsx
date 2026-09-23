import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, Search, Building2, Check } from "lucide-react";
import type { DashboardZoneNode } from "../hooks/useDashboardData";

interface FarmerZoneSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchZoneQuery: string;
  onSearchChange: (query: string) => void;
  filteredZones: DashboardZoneNode[];
  selectedZone: DashboardZoneNode | null;
  onSelectZone: (zoneId: string) => void;
}

function DesktopZoneSelectionModal({
  isOpen,
  onOpenChange,
  searchZoneQuery,
  onSearchChange,
  filteredZones,
  selectedZone,
  onSelectZone,
}: FarmerZoneSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-[92vw] rounded-3xl p-6 bg-white shadow-2xl border-none">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-800">
                Chọn Vùng Canh Tác Nông Hộ
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Danh sách tất cả các vùng canh tác thuộc quyền sở hữu của Nông hộ
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Search input in Dialog */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vùng, mô tả..."
              value={searchZoneQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-slate-50 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Zone List Grid */}
          <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
            {filteredZones.length > 0 ? (
              filteredZones.map((zone) => {
                const isSelected = selectedZone ? zone.id === selectedZone.id : false;
                return (
                  <button
                    key={zone.id}
                    onClick={() => onSelectZone(zone.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all border pt-3.5 first:pt-3.5 ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 pr-2">
                        <div
                          className={`text-xs font-bold ${isSelected ? "text-emerald-950" : "text-slate-800"}`}
                        >
                          {zone.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>{zone.description}</span>
                          <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border">
                            {zone.totalAreaHa} ha
                          </span>
                          <span className="text-emerald-700 font-medium">
                            {zone.areas.length} khu vực
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                Không tìm thấy vùng canh tác phù hợp
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Điện thoại: bản gọn — tiêu đề ngắn, mỗi vùng 1 hàng */
function MobileZoneSelectionModal({
  isOpen,
  onOpenChange,
  searchZoneQuery,
  onSearchChange,
  filteredZones,
  selectedZone,
  onSelectZone,
}: FarmerZoneSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[92vw] gap-3 rounded-3xl p-4 sm:p-5 bg-white shadow-2xl border-none">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2.5 pr-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-800">
              Chọn vùng canh tác
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          {/* text-base trên điện thoại để iOS không tự phóng to khi focus */}
          <input
            type="text"
            placeholder="Tìm theo tên, mô tả..."
            value={searchZoneQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 text-base sm:text-sm bg-slate-50 pl-9 pr-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="max-h-[50dvh] sm:max-h-[360px] overflow-y-auto space-y-2 -mx-1 px-1">
          {filteredZones.length > 0 ? (
            filteredZones.map((zone) => {
              const isSelected = selectedZone ? zone.id === selectedZone.id : false;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onSelectZone(zone.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-white hover:bg-slate-50 active:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${isSelected ? "text-emerald-900" : "text-slate-800"}`}
                    >
                      {zone.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {zone.totalAreaHa} ha · {zone.areas.length} khu vực
                      {zone.description ? ` · ${zone.description}` : ""}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              Không tìm thấy vùng canh tác phù hợp
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FarmerZoneSelectionModal(props: FarmerZoneSelectionModalProps) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <MobileZoneSelectionModal {...props} />
  ) : (
    <DesktopZoneSelectionModal {...props} />
  );
}
