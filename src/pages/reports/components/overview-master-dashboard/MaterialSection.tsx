import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ShieldAlert,
  Wrench,
  Layers,
  Leaf,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Info,
  Loader2,
} from "lucide-react";
import type { TreeNode } from "../../constants/mockReportData";
import { useSupplyConsumption } from "@/features/farm/hooks/useFarmReport";
import type { SupplyType } from "@/features/farm/types/farm-report.type";

interface MaterialSectionProps {
  selectedLocation: TreeNode | null;
  locationFilter: { regionId?: number; areaId?: number; plotId?: number };
}

// ─── Map supplyType → label tiếng Việt (BE không trả label) ─────────────────

const SUPPLY_LABEL: Record<SupplyType, string> = {
  MEDICINE: "Thuốc BVTV canh tác",
  FERTILIZER: "Phân bón chất lượng cao",
  BIOLOGICAL: "Chế phẩm sinh học",
  EQUIPMENT: "Máy móc & thiết bị",
  MATERIAL: "Vật tư canh tác khác",
};

const SUPPLY_ICON: Record<SupplyType, React.ReactNode> = {
  MEDICINE: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  FERTILIZER: <Leaf className="w-4 h-4 text-emerald-500" />,
  BIOLOGICAL: <FlaskConical className="w-4 h-4 text-purple-500" />,
  EQUIPMENT: <Wrench className="w-4 h-4 text-amber-500" />,
  MATERIAL: <Layers className="w-4 h-4 text-sky-500" />,
};

const formatNumber = (val: number) =>
  new Intl.NumberFormat("en-US").format(val);

// ─── Single supply card ───────────────────────────────────────────────────────

interface SupplyCardProps {
  supplyType: SupplyType;
  locationFilter: { regionId?: number; areaId?: number; plotId?: number };
}

const SupplyCard: React.FC<SupplyCardProps> = ({
  supplyType,
  locationFilter,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, isLoading } = useSupplyConsumption({
    supplyType,
    ...locationFilter,
    comparePreviousPeriod: true,
    size: 3,
    date: today,
  });

  const title = SUPPLY_LABEL[supplyType];
  const icon = SUPPLY_ICON[supplyType];

  if (isLoading) {
    return (
      <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between rounded-xl">
        <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="text-slate-400">{icon}</div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex items-center justify-center h-28">
          <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const totals = data?.totals ?? [];
  const items = data?.items?.content ?? [];

  return (
    <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between rounded-xl">
      <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="text-slate-400">{icon}</div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {totals.length === 0 && items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">
            Chưa có dữ liệu tiêu thụ
          </p>
        ) : (
          <>
            {/* Totals — mỗi nhóm đơn vị hiển thị riêng 1 dòng */}
            {totals.map((t, i) => {
              const hasChange = t.changePercent != null;
              const isUp = (t.changePercent ?? 0) >= 0;
              return (
                <div key={i} className="flex items-baseline justify-between">
                  <span className="text-2xl font-display font-extrabold text-slate-800 font-mono">
                    {t.quantity != null ? formatNumber(t.quantity) : "—"}{" "}
                    <span className="text-xs text-slate-400 font-sans font-medium">
                      {t.unit.code}
                    </span>
                  </span>

                  {hasChange && (
                    <div className="flex flex-col items-end">
                      <span
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold ${
                          isUp
                            ? "text-rose-600 bg-rose-50"
                            : "text-emerald-600 bg-emerald-50"
                        }`}
                      >
                        {isUp ? (
                          <TrendingUp className="w-3 h-3 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 shrink-0" />
                        )}
                        <span>{Math.abs(t.changePercent!)}%</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium mt-1">
                        % so với cùng kỳ gần nhất
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sub-items with progress bars */}
            {items.length > 0 && (
              <div className="space-y-2.5 border-t border-slate-50 pt-3">
                {items.map((item, index) => {
                  const pct = item.shareOfCategoryPercent ?? 0;
                  const itemUp = (item.changePercent ?? 0) >= 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span className="truncate">{item.supplyItemName}</span>
                        <div className="flex items-center gap-1.5 font-mono text-slate-650 shrink-0">
                          <span>
                            {item.quantity != null
                              ? formatNumber(item.quantity)
                              : "—"}{" "}
                            {item.unit.code} ({Math.round(pct)}%)
                          </span>
                          {item.changePercent != null && (
                            <div className="relative group flex items-center">
                              <span
                                className={`px-1 py-0.5 rounded text-[8px] font-bold font-sans cursor-help ${
                                  itemUp
                                    ? "text-rose-600 bg-rose-50/50 border border-rose-100/50"
                                    : "text-emerald-600 bg-emerald-50/50 border border-emerald-100/50"
                                }`}
                              >
                                {itemUp ? "+" : "-"}
                                {Math.abs(item.changePercent)}%
                              </span>
                              <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-slate-850 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 font-sans font-semibold">
                                {itemUp ? "Tăng" : "Giảm"}{" "}
                                {Math.abs(item.changePercent)}% so với cùng kỳ
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(pct, 100)}%` }}
                          className={`${
                            pct > 80 ? "bg-rose-500" : "bg-emerald-500"
                          } h-full rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Main MaterialSection ─────────────────────────────────────────────────────

const SUPPLY_TYPES: SupplyType[] = [
  "MEDICINE",
  "FERTILIZER",
  "BIOLOGICAL",
  "EQUIPMENT",
  "MATERIAL",
];

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  selectedLocation: _selectedLocation,
  locationFilter,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/80">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Giám sát tiêu thụ vật tư nông nghiệp
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Khối lượng phân bón, thuốc bảo vệ thực vật & khấu hao máy móc thiết
            bị
          </p>
        </div>

        <div className="flex items-start gap-2 bg-emerald-50/30 border border-emerald-100/60 rounded-lg px-3 py-2 text-[10px] text-emerald-800 font-medium md:max-w-md">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Chỉ số <strong>% trong ngoặc đơn ( )</strong> thể hiện tỷ trọng tiêu
            thụ của từng vật tư so với tổng cùng đơn vị trong nhóm chính.
          </span>
        </div>
      </div>

      {/* 4 supply cards — each fetches its own data in parallel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUPPLY_TYPES.map((type) => (
          <SupplyCard
            key={type}
            supplyType={type}
            locationFilter={locationFilter}
          />
        ))}
      </div>
    </div>
  );
};
