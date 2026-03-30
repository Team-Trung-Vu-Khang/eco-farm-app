import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  TabsContent,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CropDetailStatisticsProps } from "./types";

export const CropDetailStatisticsTab = ({
  details,
}: CropDetailStatisticsProps) => {
  return (
    <TabsContent value="statistics" className="space-y-6 overflow-hidden">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-blue-500/5 transition-transform duration-500 group-hover:scale-110" />
          <CardContent className="relative z-10 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-slate-500">
                Tổng SL thu hoạch
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black tracking-tight text-slate-900">
                  {details.harvestStats.totalVolume.toLocaleString()}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Toàn vùng canh tác
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-green-500/5 transition-transform duration-500 group-hover:scale-110" />
          <CardContent className="relative z-10 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <Badge className="flex items-center gap-1 rounded-lg border-none bg-green-100 px-2 py-0.5 text-green-700 hover:bg-green-100">
                {details.harvestStats.lastChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
              </Badge>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-slate-500">
                SL thu hoạch gần nhất
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black tracking-tight text-slate-900">
                  {details.harvestStats.lastVolume.toLocaleString()}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                {details.harvestStats.lastChange >= 0 ? "Tăng" : "Giảm"}{" "}
                {details.harvestStats.lastChange}% so với đợt trước
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-orange-500/5 transition-transform duration-500 group-hover:scale-110" />
          <CardContent className="relative z-10 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                <Calendar className="h-6 w-6" />
              </div>
              <Badge className="flex items-center gap-1 rounded-lg border-none bg-orange-100 px-2 py-0.5 text-orange-700 hover:bg-orange-100">
                {details.harvestStats.avgChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
              </Badge>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-slate-500">
                SL trung bình mỗi đợt
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black tracking-tight text-slate-900">
                  {details.harvestStats.avgVolume.toLocaleString()}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-600">
                <TrendingUp className="h-3 w-3" />
                {details.harvestStats.avgChange >= 0 ? "Tăng" : "Giảm"}{" "}
                {Math.abs(details.harvestStats.avgChange)}% so với trung bình
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
          <CardContent className="px-2 pb-6 pt-8">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={details.harvestBatches
                    .slice()
                    .reverse()
                    .map((batch) => ({
                      batch: `Batch ${batch.id.slice(-3)}`,
                      date: new Date(batch.date).toLocaleDateString("vi-VN", {
                        month: "numeric",
                        day: "numeric",
                      }),
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
          <CardHeader className="border-b pb-3">
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
                  render: (value: string) => (
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(value).toLocaleDateString("vi-VN")}
                    </div>
                  ),
                },
                {
                  key: "volume",
                  label: "Sản lượng",
                  render: (value: number) => (
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-slate-900">
                        {value.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        kg
                      </span>
                    </div>
                  ),
                },
                {
                  key: "quality",
                  label: "Chất lượng",
                  render: (value: string) => (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "h-5 border-none px-2 py-0 text-[10px] font-bold",
                        value === "Loại A"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-orange-50 text-orange-600",
                      )}
                    >
                      {value}
                    </Badge>
                  ),
                },
                {
                  key: "staff",
                  label: "Người phụ trách",
                  render: (value: string) => (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        {value.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600">{value}</span>
                    </div>
                  ),
                },
                {
                  key: "notes",
                  label: "Ghi chú",
                  render: (value: string) => (
                    <span className="block max-w-50 truncate text-xs text-slate-400">
                      {value || "-"}
                    </span>
                  ),
                },
              ]}
              data={details.harvestBatches}
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
