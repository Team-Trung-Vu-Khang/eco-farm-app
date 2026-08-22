import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Tractor,
  TrendingUp,
  BarChart as ReBarChart,
  LineChart as ReLineChart,
  BadgeAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
import { mockDomainData } from "../constants/mockDomainData";

interface HarvestReportProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const HarvestReport: React.FC<HarvestReportProps> = ({ domainType }) => {
  const data = mockDomainData[domainType];

  const getYieldLabel = () => {
    if (domainType === "crops") return "Năng suất trung bình (tấn/ha)";
    if (domainType === "livestock") return "Trọng lượng xuất chuồng (kg/con)";
    return "Năng suất ao nuôi (tấn/ha)";
  };

  const getRecentHarvestLabel = () => {
    if (domainType === "crops") return "Đợt thu hoạch nông sản gần nhất";
    if (domainType === "livestock") return "Đợt xuất bán vật nuôi gần nhất";
    return "Đợt thu hoạch thủy sản gần nhất";
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const harvestColumns = [
    {
      key: "name",
      label: "Chi Tiết Đợt Thu Hoạch",
      render: (val: any) => (
        <span className="font-bold text-slate-700 text-sm block">
          {val as string}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Sản Lượng",
      render: (val: any) => (
        <span className="font-mono font-bold text-emerald-600 text-xs">
          {formatNumber(val as number)} kg
        </span>
      ),
    },
    {
      key: "quality",
      label: "Phân Loại",
      render: (val: any) => (
        <span className="text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
          {val as string}
        </span>
      ),
    },
    {
      key: "size",
      label: "Kích Cỡ (Size)",
      render: (val: any) => (
        <span className="text-slate-655 text-xs font-medium">
          {val as string}
        </span>
      ),
    },
    {
      key: "date",
      label: "Ngày Thu Hoạch",
      render: (val: any) => (
        <span className="font-mono text-xs text-slate-400">
          {val as string}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dynamic charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest Volume Chart */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <ReBarChart className="w-4.5 h-4.5 text-emerald-600" />
              <span>Sản lượng thu hoạch định kỳ (kg)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.harvestData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${formatNumber(value)} kg`, "Sản lượng"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #f1f5f9" }}
                  />
                  <Bar dataKey="yield" fill="#10b981" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="yield" position="top" fill="#6b7280" fontSize={10} formatter={(val: number) => `${formatNumber(val)}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Productivity Trends Chart */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <ReLineChart className="w-4.5 h-4.5 text-blue-600" />
              <span>{getYieldLabel()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yieldTrend} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorNangSuat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}`, "Chỉ số năng suất"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #f1f5f9" }}
                  />
                  <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNangSuat)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Harvest List */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Tractor className="w-4.5 h-4.5 text-emerald-600" />
            <span>{getRecentHarvestLabel()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <DataTable
            columns={harvestColumns}
            data={data.recentHarvests}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm kiếm đợt thu hoạch..."
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
};
