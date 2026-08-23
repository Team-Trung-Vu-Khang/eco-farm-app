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
} from "lucide-react";
import {
  mockTreeViewData,
  type TreeNode,
  type ConsumptionDetail,
} from "../../constants/mockReportData";

interface MaterialSectionProps {
  selectedLocation: TreeNode | null;
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

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  selectedLocation,
}) => {
  // Helper to sum up two group lists
  const sumGroups = (
    g1: { name: string; amount: number }[],
    g2: { name: string; amount: number }[],
  ) => {
    return g1.map((item, idx) => ({
      name: item.name,
      amount: item.amount + (g2[idx]?.amount || 0),
    }));
  };

  // Aggregate consumption based on selected location
  const consumption: ConsumptionDetail = useMemo(() => {
    if (selectedLocation) {
      return selectedLocation.consumption;
    }

    // Default: sum Region 1 and Region 2
    const r1 = mockTreeViewData[0].consumption;
    const r2 = mockTreeViewData[1].consumption;

    return {
      pesticide: {
        total: r1.pesticide.total + r2.pesticide.total,
        trend: 12,
        isIncrease: true,
        groups: sumGroups(r1.pesticide.groups, r2.pesticide.groups),
      },
      fertilizer: {
        total: r1.fertilizer.total + r2.fertilizer.total,
        trend: 8,
        isIncrease: false,
        groups: sumGroups(r1.fertilizer.groups, r2.fertilizer.groups),
      },
      equipment: {
        total: r1.equipment.total + r2.equipment.total,
        trend: 5,
        isIncrease: true,
        groups: sumGroups(r1.equipment.groups, r2.equipment.groups),
      },
      other: {
        total: r1.other.total + r2.other.total,
        trend: 2,
        isIncrease: false,
        groups: sumGroups(r1.other.groups, r2.other.groups),
      },
    };
  }, [selectedLocation]);

  // Helper to render detailed consumption card with progress bars (Reused from MaterialConsumptionBlock)
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
                          <span
                            className={`px-1 py-0.5 rounded text-[8px] font-bold font-sans ${subTrendColor}`}
                          >
                            {trendData.isIncrease ? "+" : "-"}
                            {trendData.trend}%
                          </span>
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
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Giám sát tiêu thụ vật tư nông nghiệp
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Khối lượng phân bón, thuốc bảo vệ thực vật & khấu hao máy móc thiết bị
        </p>
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
