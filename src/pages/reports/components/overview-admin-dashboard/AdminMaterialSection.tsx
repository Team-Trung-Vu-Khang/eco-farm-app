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
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";
import { useSupplyConsumption } from "@/features/farm/hooks/useFarmReport";
import type { SupplyType } from "@/features/farm/types/farm-report.type";

interface AdminMaterialSectionProps {
  selectedWorkspace?: WorkspaceRecord | null;
  selectedEntity?: WorkspaceRecord | null;
}

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "0";
  return new Intl.NumberFormat("vi-VN").format(val);
};

const SUPPLY_LABEL: Record<SupplyType, string> = {
  MEDICINE: "Thuốc BVTV canh tác",
  FERTILIZER: "Phân bón chất lượng cao",
  BIOLOGICAL_PRODUCT: "Chế phẩm sinh học",
  EQUIPMENT: "Máy móc & thiết bị",
  MATERIAL: "Vật tư canh tác khác",
};

const SUPPLY_ICON: Record<SupplyType, React.ReactNode> = {
  MEDICINE: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  FERTILIZER: <Leaf className="w-4 h-4 text-emerald-500" />,
  BIOLOGICAL_PRODUCT: <FlaskConical className="w-4 h-4 text-purple-500" />,
  EQUIPMENT: <Wrench className="w-4 h-4 text-amber-500" />,
  MATERIAL: <Layers className="w-4 h-4 text-sky-500" />,
};

const SupplyCard: React.FC<{
  supplyType: SupplyType;
  workspaceId?: number | string;
}> = ({ supplyType, workspaceId }) => {
  const { data, isLoading } = useSupplyConsumption(
    {
      supplyType,
      comparePreviousPeriod: true,
    },
    { workspaceId },
  );

  if (isLoading) {
    return (
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl p-5 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </Card>
    );
  }

  const totals = data?.totals || [];
  const primaryTotal = totals[0];
  const items = data?.items?.content || [];

  const mainQuantity = primaryTotal?.quantity;
  const changePercent = primaryTotal?.changePercent;
  const unitName = primaryTotal?.unit?.name || "đơn vị";

  return (
    <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between rounded-xl">
      <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {SUPPLY_LABEL[supplyType]}
        </CardTitle>
        <div className="text-slate-400">{SUPPLY_ICON[supplyType]}</div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Main metric and trend */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-display font-extrabold text-slate-800 font-mono">
            {formatNumber(mainQuantity)}{" "}
            <span className="text-xs text-slate-400 font-sans font-medium">
              {unitName}
            </span>
          </span>

          {changePercent !== null && changePercent !== undefined && (
            <div className="flex flex-col items-end">
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold ${
                  changePercent >= 0
                    ? "text-rose-600 bg-rose-50"
                    : "text-emerald-600 bg-emerald-50"
                }`}
              >
                {changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                <span>{Math.abs(changePercent)}%</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium mt-1">
                so với cùng kỳ
              </span>
            </div>
          )}
        </div>

        {/* Sub-groups with progress bars */}
        {items.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-50">
            Chưa có dữ liệu chi tiết
          </div>
        ) : (
          <div className="space-y-2.5 border-t border-slate-50 pt-3">
            {items.slice(0, 5).map((item) => {
              const pct = item.shareOfCategoryPercent ?? 0;
              return (
                <div key={item.supplyItemId} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="truncate">{item.supplyItemName}</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-650 shrink-0">
                      <span>
                        {formatNumber(item.quantity)} {item.unit?.name || ""} ({pct}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
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
      </CardContent>
    </Card>
  );
};

export const AdminMaterialSection: React.FC<AdminMaterialSectionProps> = ({
  selectedWorkspace,
  selectedEntity,
}) => {
  const currentWorkspace = selectedWorkspace ?? selectedEntity;

  const supplyTypes: SupplyType[] = [
    "MEDICINE",
    "FERTILIZER",
    "BIOLOGICAL_PRODUCT",
    "EQUIPMENT",
    "MATERIAL",
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/80">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Giám sát tiêu thụ vật tư nông nghiệp
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Tổng hợp dữ liệu tiêu thụ phân bón, thuốc BVTV, chế phẩm sinh học & thiết bị
            {currentWorkspace ? ` cho ${currentWorkspace.name}` : ""}
          </p>
        </div>

        <div className="flex items-start gap-2 bg-emerald-50/30 border border-emerald-100/60 rounded-lg px-3 py-2 text-[10px] text-emerald-800 font-medium md:max-w-md">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Chỉ số <strong>% trong ngoặc</strong> thể hiện tỷ trọng tiêu thụ so với tổng nhóm chính.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supplyTypes.map((st) => (
          <SupplyCard
            key={st}
            supplyType={st}
            workspaceId={currentWorkspace?.id}
          />
        ))}
      </div>
    </div>
  );
};
