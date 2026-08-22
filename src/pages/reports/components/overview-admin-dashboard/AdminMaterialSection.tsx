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
                    <span className="font-mono text-slate-650 shrink-0">
                      {formatNumber(group.amount)} {unit} ({percentage}%)
                    </span>
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
          theo đơn vị
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
