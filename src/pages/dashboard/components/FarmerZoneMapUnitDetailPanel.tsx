import React from "react";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin } from "lucide-react";
import type { DashboardZoneNode } from "../hooks/useDashboardData";
import { GeographyScopeTree } from "./GeographyScopeTree";

export interface SelectedUnitState {
  type: "region" | "area" | "plot";
  data: any;
}

interface FarmerZoneMapUnitDetailPanelProps {
  selectedZone: DashboardZoneNode | null;
  selectedUnit: SelectedUnitState | null;
  onSelectUnit: (unit: SelectedUnitState | null) => void;
  onNavigateToDetail?: () => void;
  className?: string;
}

export function FarmerZoneMapUnitDetailPanel({
  selectedZone,
  selectedUnit,
  onSelectUnit,
  className = "",
}: FarmerZoneMapUnitDetailPanelProps) {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      {/* Header Inside Panel */}
      <div className="flex items-center justify-between border-b pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
            Phạm vi địa lý cây trồng
          </span>
        </div>
      </div>

      {/* Vùng canh tác Header Card */}
      {selectedZone ? (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center gap-2.5 shrink-0 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block leading-none mb-0.5">
              Vùng canh tác
            </span>
            <span className="text-xs font-black text-slate-900 truncate block">
              {selectedZone.name}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 text-xs font-bold text-center mb-3">
          Chưa chọn vùng canh tác. Vui lòng chọn vùng canh tác ở trên!
        </div>
      )}

      {/* Internal Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto split-scrollbar pr-1 space-y-3">
        <GeographyScopeTree
          zone={selectedZone}
          selectedUnit={selectedUnit}
          onSelectUnit={(type, data) => onSelectUnit({ type, data })}
        />
        <p className="text-[11px] text-slate-400 italic text-center pt-1">
          Nhấp vào tên đơn vị để xem trên bản đồ hoặc nhấn biểu tượng quản lý
          chi tiết
        </p>
      </div>
    </div>
  );
}
