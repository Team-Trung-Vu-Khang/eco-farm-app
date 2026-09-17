import React from "react";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
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
        {selectedUnit && (
          <Badge
            variant="outline"
            className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Đang xem chi tiết
          </Badge>
        )}
      </div>

      {/* Internal Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto split-scrollbar pr-1 space-y-3">
        <GeographyScopeTree
          zone={selectedZone}
          selectedUnit={selectedUnit}
          onSelectUnit={(type, data) => onSelectUnit({ type, data })}
        />
        <p className="text-[11px] text-slate-400 italic text-center pt-1">
          Nhấp vào tên đơn vị để xem trên bản đồ hoặc nhấn biểu tượng quản lý chi tiết
        </p>
      </div>
    </div>
  );
}
