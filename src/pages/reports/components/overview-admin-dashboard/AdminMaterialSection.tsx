import React, { useMemo } from "react";
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
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import { type CorporateEntity } from "./EntitySidebar";
import {
  mockTreeViewData,
  type TreeNode,
  type ConsumptionDetail,
} from "../../constants/mockReportData";

interface AdminMaterialSectionProps {
  selectedEntity: CorporateEntity | null;
}

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("en-US").format(val);
};

const subGroupTrends: Record<string, { trend: number; isIncrease: boolean }> = {
  "Thuốc trừ sâu sinh học": { trend: 8, isIncrease: true },
  "Thuốc diệt nấm bệnh": { trend: 5, isIncrease: false },
  "Thuốc trừ cỏ sinh học": { trend: 12, isIncrease: true },
  "Phân bón hữu cơ vi sinh": { trend: 15, isIncrease: true },
  "Phân NPK cao cấp": { trend: 4, isIncrease: false },
  "Phân Lân & Kali": { trend: 6, isIncrease: true },
  "Máy cày & Máy phay đất": { trend: 10, isIncrease: true },
  "Hệ thống tưới tự động": { trend: 3, isIncrease: true },
  "Máy phun thuốc tự hành": { trend: 15, isIncrease: true },
  "Màng phủ nông nghiệp": { trend: 2, isIncrease: false },
  "Lưới chắn côn trùng": { trend: 8, isIncrease: true },
  "Dây cột giàn leo": { trend: 5, isIncrease: true },
};

export const AdminMaterialSection: React.FC<AdminMaterialSectionProps> = ({
  selectedEntity,
}) => {
  // Aggregate consumption based on selected corporate entity
  const consumption: ConsumptionDetail = useMemo(() => {
    let pestTotal = 0;
    let fertTotal = 0;
    let equipTotal = 0;
    let otherTotal = 0;

    const pestGroups = [
      { name: "Thuốc trừ sâu sinh học", amount: 0 },
      { name: "Thuốc diệt nấm bệnh", amount: 0 },
      { name: "Thuốc trừ cỏ sinh học", amount: 0 },
    ];
    const fertGroups = [
      { name: "Phân bón hữu cơ vi sinh", amount: 0 },
      { name: "Phân NPK cao cấp", amount: 0 },
      { name: "Phân Lân & Kali", amount: 0 },
    ];
    const equipGroups = [
      { name: "Máy cày & Máy phay đất", amount: 0 },
      { name: "Hệ thống tưới tự động", amount: 0 },
      { name: "Máy phun thuốc tự hành", amount: 0 },
    ];
    const otherGroups = [
      { name: "Màng phủ nông nghiệp", amount: 0 },
      { name: "Lưới chắn côn trùng", amount: 0 },
      { name: "Dây cột giàn leo", amount: 0 },
    ];

    const traverse = (node: TreeNode) => {
      if (node.type === "plot") {
        if (!selectedEntity || node.company === selectedEntity.id) {
          const c = node.consumption;
          pestTotal += c.pesticide.total;
          fertTotal += c.fertilizer.total;
          equipTotal += c.equipment.total;
          otherTotal += c.other.total;

          c.pesticide.groups.forEach((g, i) => {
            if (pestGroups[i]) pestGroups[i].amount += g.amount;
          });
          c.fertilizer.groups.forEach((g, i) => {
            if (fertGroups[i]) fertGroups[i].amount += g.amount;
          });
          c.equipment.groups.forEach((g, i) => {
            if (equipGroups[i]) equipGroups[i].amount += g.amount;
          });
          c.other.groups.forEach((g, i) => {
            if (otherGroups[i]) otherGroups[i].amount += g.amount;
          });
        }
      } else if (node.children) {
        node.children.forEach(traverse);
      }
    };

    mockTreeViewData.forEach(traverse);

    return {
      pesticide: {
        total: pestTotal,
        trend: 12,
        isIncrease: true,
        groups: pestGroups,
      },
      fertilizer: {
        total: fertTotal,
        trend: 8,
        isIncrease: false,
        groups: fertGroups,
      },
      equipment: {
        total: equipTotal,
        trend: 5,
        isIncrease: true,
        groups: equipGroups,
      },
      other: {
        total: otherTotal,
        trend: 2,
        isIncrease: false,
        groups: otherGroups,
      },
    };
  }, [selectedEntity]);

  // Helper to render consumption card with progress bars (matching Overview Master Dashboard layout)
  const renderDetailCard = (
    title: string,
    icon: React.ReactNode,
    data: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    },
    unit: string,
  ) => {
    const isBad = data.isIncrease;
    const trendColor = isBad
      ? "text-rose-600 bg-rose-50"
      : "text-emerald-600 bg-emerald-50";

    return (
      <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between rounded-xl">
        <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="text-slate-400">{icon}</div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          {/* Main metric and trend */}
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-display font-extrabold text-slate-800 font-mono">
              {formatNumber(data.total)}{" "}
              <span className="text-xs text-slate-400 font-sans font-medium">
                {unit}
              </span>
            </span>

            {/* Trend indicator & label */}
            <div className="flex flex-col items-end">
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold ${trendColor}`}
              >
                {data.isIncrease ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                <span>{Math.abs(data.trend)}%</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium mt-1">
                % so với cùng kỳ gần nhất
              </span>
            </div>
          </div>

          {/* Sub-groups with progress bars */}
          <div className="space-y-2.5 border-t border-slate-50 pt-3">
            {data.groups.map((group, index) => {
              const percentage =
                data.total > 0
                  ? Math.round((group.amount / data.total) * 100)
                  : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="truncate">{group.name}</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-650 shrink-0">
                      <span>
                        {formatNumber(group.amount)} {unit} ({percentage}%)
                      </span>
                      {(() => {
                        const trendData = subGroupTrends[group.name];
                        if (!trendData) return null;
                        const subTrendColor = trendData.isIncrease
                          ? "text-rose-600 bg-rose-50/50 border border-rose-100/50"
                          : "text-emerald-600 bg-emerald-50/50 border border-emerald-100/50";
                        return (
                          <div className="relative group flex items-center">
                            <span
                              className={`px-1 py-0.5 rounded text-[8px] font-bold font-sans cursor-help ${subTrendColor}`}
                            >
                              {trendData.isIncrease ? "+" : "-"}
                              {trendData.trend}%
                            </span>
                            <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-slate-850 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 font-sans font-semibold">
                              {trendData.isIncrease ? "Tăng" : "Giảm"}{" "}
                              {trendData.trend}% so với cùng kỳ gần nhất
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`${
                        percentage > 80 ? "bg-rose-500" : "bg-emerald-500"
                      } h-full rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Legend alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/80">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Giám sát tiêu thụ vật tư nông nghiệp
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Khối lượng phân bón, thuốc bảo vệ thực vật & khấu hao máy móc thiết bị theo đơn vị
          </p>
        </div>

        {/* Legend Box with Border */}
        <div className="flex items-start gap-2 bg-emerald-50/30 border border-emerald-100/60 rounded-lg px-3 py-2 text-[10px] text-emerald-800 font-medium md:max-w-md">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Chỉ số <strong>% trong ngoặc đơn ( )</strong> thể hiện tỷ trọng (tỷ lệ phần trăm) tiêu thụ của từng phân nhóm so với tổng sản lượng của nhóm chính.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDetailCard(
          "Thuốc BVTV canh tác",
          <ShieldAlert className="w-4 h-4 text-rose-500" />,
          consumption.pesticide,
          "kg",
        )}
        {renderDetailCard(
          "Phân bón chất lượng cao",
          <Leaf className="w-4 h-4 text-emerald-500" />,
          consumption.fertilizer,
          "kg",
        )}
        {renderDetailCard(
          "Máy móc & thiết bị",
          <Wrench className="w-4 h-4 text-amber-500" />,
          consumption.equipment,
          "ngày",
        )}
        {renderDetailCard(
          "Vật tư canh tác khác",
          <Layers className="w-4 h-4 text-sky-500" />,
          consumption.other,
          "cuộn/tấm",
        )}
      </div>
    </div>
  );
};
