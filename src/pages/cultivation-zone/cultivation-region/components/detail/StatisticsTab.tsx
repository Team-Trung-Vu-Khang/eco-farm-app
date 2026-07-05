import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  DataTable,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  CartesianGrid,
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { CultivationRegionDetails } from "../../useCultivationRegionDetail";

interface StatisticsTabProps {
  details: CultivationRegionDetails;
}

export const StatisticsTab = ({ details }: StatisticsTabProps) => {
  return (
    <div className="space-y-6 overflow-hidden">
      {details ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">
                    Tổng SL thu hoạch
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {details.harvestStats.totalVolume.toLocaleString()}
                    </div>
                    <span className="text-sm font-bold text-slate-400">
                      kg
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Toàn vùng canh tác
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-green-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                    {details.harvestStats.lastChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">
                    SL thu hoạch gần nhất
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {details.harvestStats.lastVolume.toLocaleString()}
                    </div>
                    <span className="text-sm font-bold text-slate-400">
                      kg
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    {details.harvestStats.lastChange >= 0
                      ? "Tăng"
                      : "Giảm"}{" "}
                    {details.harvestStats.lastChange}% so với đợt trước
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-orange-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                    {details.harvestStats.avgChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">
                    SL trung bình mỗi đợt
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {details.harvestStats.avgVolume.toLocaleString()}
                    </div>
                    <span className="text-sm font-bold text-slate-400">
                      kg
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" />
                    {details.harvestStats.avgChange >= 0
                      ? "Tăng"
                      : "Giảm"}{" "}
                    {Math.abs(details.harvestStats.avgChange)}% so với trung
                    bình
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart & Table */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Biểu đồ năng suất thu hoạch
                    </CardTitle>
                    <CardDescription>
                      Theo dõi biến động sản lượng qua các đợt thu hoạch
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      Năm 2024
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                <div className="h-80 w-full px-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={details.harvestBatches
                        .slice()
                        .reverse()
                        .map((batch) => ({
                          batch: `Batch ${batch.id.slice(-3)}`,
                          date: new Date(batch.date).toLocaleDateString(
                            "vi-VN",
                            { month: "numeric", day: "numeric" },
                          ),
                          volume: batch.volume,
                        }))}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(140, 15%, 88%)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(140, 10%, 45%)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="hsl(140, 10%, 45%)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(140, 15%, 88%)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        }}
                        itemStyle={{ fontWeight: "bold" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="volume"
                        name="Sản lượng"
                        stroke="hsl(142, 70%, 45%)"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "white",
                          strokeWidth: 2,
                          stroke: "hsl(142, 70%, 45%)",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "hsl(142, 70%, 45%)",
                          strokeWidth: 0,
                        }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Danh sách các đợt thu hoạch
                    </CardTitle>
                    <CardDescription>
                      Chi tiết các lần thu hoạch thành phẩm
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <DataTable
                  columns={[
                    {
                      key: "date",
                      label: "Ngày thu hoạch",
                      render: (val: string) => (
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(val).toLocaleDateString("vi-VN")}
                        </div>
                      ),
                    },
                    {
                      key: "volume",
                      label: "Sản lượng",
                      render: (val: number) => (
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-slate-900">
                            {val.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            kg
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "quality",
                      label: "Chất lượng",
                      render: (val: string) => (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-bold text-[10px] px-2 py-0 h-5 border-none",
                            val === "Loại A"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600",
                          )}
                        >
                          {val}
                        </Badge>
                      ),
                    },
                    {
                      key: "staff",
                      label: "Người phụ trách",
                      render: (val: string) => (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {val.charAt(0)}
                          </div>
                          <span className="text-sm text-slate-600">
                            {val}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "notes",
                      label: "Ghi chú",
                      render: (val: string) => (
                        <span className="text-xs text-slate-400 truncate max-w-50 block">
                          {val || "-"}
                        </span>
                      ),
                    },
                  ]}
                  data={details.harvestBatches}
                />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          Không có dữ liệu thống kê
        </div>
      )}
    </div>
  );
};
