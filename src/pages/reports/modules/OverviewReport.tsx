import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Map,
  Sprout,
  Grid,
  Home,
  Activity,
  TrendingDown,
  PieChart as RePieChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { mockDomainData } from "../constants/mockDomainData";

interface OverviewReportProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const OverviewReport: React.FC<OverviewReportProps> = ({
  domainType,
}) => {
  const data = mockDomainData[domainType];

  const getIcon = (type: string) => {
    switch (type) {
      case "map":
        return <Map className="w-5 h-5 text-emerald-600" />;
      case "sprout":
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case "grid":
        return <Grid className="w-5 h-5 text-emerald-600" />;
      case "home":
        return <Home className="w-5 h-5 text-emerald-600" />;
      case "activity":
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case "trending":
        return <TrendingDown className="w-5 h-5 text-rose-500" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.kpis.map((kpi, idx) => (
          <Card
            key={idx}
            className="border border-slate-100 shadow-xs bg-white rounded-xl"
          >
            <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {kpi.title}
              </CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                {getIcon(kpi.iconType)}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-extrabold text-slate-800 font-display">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {kpi.subText}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health / Distribution Donut Chart & Legend */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        <CardHeader className="p-4 border-b border-slate-50">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <RePieChart className="w-4 h-4 text-emerald-600" />
            <span>Phân bổ tình trạng & sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-6 h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.health}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.health.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Tỷ lệ"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend & Info Area */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Trạng thái chi tiết
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.health.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-slate-50 flex items-center gap-3 bg-slate-50/30"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">
                        {item.name}
                      </div>
                      <div className="text-sm font-extrabold text-slate-600 font-mono mt-0.5">
                        {item.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
