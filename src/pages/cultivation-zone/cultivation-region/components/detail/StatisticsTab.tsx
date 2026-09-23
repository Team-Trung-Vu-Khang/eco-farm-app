import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
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
import { useProductionZoneHarvestStats } from "@/features/farm/hooks/useProductionZoneHarvestStats";
import { useProductionZoneHarvestChart } from "@/features/farm/hooks/useProductionZoneHarvestChart";
import { useFarmDiaryEntries } from "@/features/farm-daily-diary/hooks/useFarmDiaryEntries";

interface StatisticsTabProps {
  details: CultivationRegionDetails;
  zoneId?: number;
}

export const StatisticsTab = ({ details, zoneId }: StatisticsTabProps) => {
  const [periodType, setPeriodType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  // 1. Fetch 3 Summary Cards Data
  const { data: statsData, isLoading: isStatsLoading } =
    useProductionZoneHarvestStats(zoneId);

  // 2. Fetch Yield Chart Data
  const { data: chartData, isLoading: isChartLoading } =
    useProductionZoneHarvestChart(zoneId, { periodType });

  // 3. Fetch Harvest Diary Entries List (diaryType: DAILY, purpose: HARVEST)
  const { data: diaryData, isLoading: isDiaryLoading } = useFarmDiaryEntries(
    {
      diaryType: "DAILY",
      purpose: ["HARVEST"],
      zoneId: zoneId ?? 0,
      page: 0,
      size: 50,
    },
    { enabled: !!zoneId },
  );

  // Transform Harvest Diary Entries into table rows
  const harvestRows = useMemo(() => {
    if (!diaryData?.content) return [];
    const rows: Array<{
      id: string;
      date: string;
      volume: number | null;
      unit: string;
      staff: string;
      notes: string;
      quality: string;
    }> = [];

    for (const entry of diaryData.content) {
      const date = entry.createdAt;
      const staff = entry.createdByUserId
        ? `User #${entry.createdByUserId}`
        : "_";
      const notes = entry.description || "_";

      if (entry.harvestItems && entry.harvestItems.length > 0) {
        for (let i = 0; i < entry.harvestItems.length; i++) {
          const item = entry.harvestItems[i];
          rows.push({
            id: `${entry.id}-${i}`,
            date,
            volume: item.quantity ?? null,
            unit: item.unitName || item.unit || "kg",
            staff,
            notes,
            quality: "_",
          });
        }
      } else {
        rows.push({
          id: entry.id,
          date,
          volume: null,
          unit: "kg",
          staff,
          notes,
          quality: "_",
        });
      }
    }
    return rows;
  }, [diaryData?.content]);

  // Transform Chart Points
  const chartPoints = useMemo(() => {
    if (!chartData?.points) return [];
    return chartData.points.map((pt) => {
      const dateLabel = pt.bucketStart
        ? new Date(pt.bucketStart).toLocaleDateString("vi-VN", {
            month: "numeric",
            year: periodType === "YEARLY" ? "numeric" : undefined,
            day: periodType === "MONTHLY" ? "numeric" : undefined,
          })
        : pt.bucketStart;

      return {
        date: dateLabel || pt.bucketStart,
        volume: pt.quantityKg ?? 0,
      };
    });
  }, [chartData?.points, periodType]);

  const totalVolumeDisplay =
    statsData?.totalQuantityKg != null
      ? statsData.totalQuantityKg.toLocaleString("vi-VN")
      : details?.harvestStats?.totalVolume != null
        ? details.harvestStats.totalVolume.toLocaleString("vi-VN")
        : "_";

  const latestVolumeDisplay =
    statsData?.latestQuantityKg != null
      ? statsData.latestQuantityKg.toLocaleString("vi-VN")
      : details?.harvestStats?.lastVolume != null
        ? details.harvestStats.lastVolume.toLocaleString("vi-VN")
        : "_";

  const avgVolumeDisplay =
    statsData?.averageQuantityKg != null
      ? statsData.averageQuantityKg.toLocaleString("vi-VN")
      : details?.harvestStats?.avgVolume != null
        ? details.harvestStats.avgVolume.toLocaleString("vi-VN")
        : "_";

  const latestChange =
    statsData?.latestChangePercent ?? details?.harvestStats?.lastChange ?? null;
  const avgChange =
    statsData?.averageChangePercent ?? details?.harvestStats?.avgChange ?? null;
  const batchCount = statsData?.batchCount ?? null;

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Tổng SL thu hoạch */}
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
                  {isStatsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 inline" />
                  ) : (
                    totalVolumeDisplay
                  )}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Toàn vùng canh tác
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: SL thu hoạch gần nhất */}
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-green-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              {latestChange != null ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                  {latestChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(latestChange)}%
                </Badge>
              ) : null}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">
                SL thu hoạch gần nhất
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {isStatsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 inline" />
                  ) : (
                    latestVolumeDisplay
                  )}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                {latestChange != null ? (
                  <>
                    {latestChange >= 0 ? "Tăng" : "Giảm"}{" "}
                    {Math.abs(latestChange)}% so với đợt trước
                  </>
                ) : statsData?.latestAt ? (
                  <>
                    Ngày{" "}
                    {new Date(statsData.latestAt).toLocaleDateString("vi-VN")}
                  </>
                ) : (
                  "_"
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: SL trung bình mỗi đợt */}
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-orange-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              {avgChange != null ? (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                  {avgChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(avgChange)}%
                </Badge>
              ) : null}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">
                SL trung bình mỗi đợt
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {isStatsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 inline" />
                  ) : (
                    avgVolumeDisplay
                  )}
                </div>
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" />
                {avgChange != null ? (
                  <>
                    {avgChange >= 0 ? "Tăng" : "Giảm"} {Math.abs(avgChange)}% so
                    với trung bình
                  </>
                ) : (
                  "_"
                )}
                {batchCount != null && (
                  <span className="text-slate-400 font-normal ml-1">
                    (TB {batchCount} đợt)
                  </span>
                )}
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
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <Button
                  variant={periodType === "MONTHLY" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-bold rounded-lg"
                  onClick={() => setPeriodType("MONTHLY")}
                >
                  Theo Tháng
                </Button>
                <Button
                  variant={periodType === "YEARLY" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-bold rounded-lg"
                  onClick={() => setPeriodType("YEARLY")}
                >
                  Theo Năm
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            {isChartLoading ? (
              <div className="flex items-center justify-center h-80 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tải dữ liệu biểu đồ...</span>
              </div>
            ) : chartData?.points === null ? (
              <div className="flex items-center justify-center h-80 text-xs text-amber-600 italic">
                _
              </div>
            ) : chartPoints.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-xs text-slate-400 italic">
                _
              </div>
            ) : (
              <div className="h-80 w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartPoints}
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
                      name="Sản lượng (kg)"
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
            )}
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
                  Chi tiết các lần thu hoạch thành phẩm từ nhật ký thường nhật
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isDiaryLoading ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tải danh sách các đợt thu hoạch...</span>
              </div>
            ) : (
              <DataTable
                columns={[
                  {
                    key: "date",
                    label: "Ngày thu hoạch",
                    render: (val: string) => (
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {val ? new Date(val).toLocaleDateString("vi-VN") : "_"}
                      </div>
                    ),
                  },
                  {
                    key: "volume",
                    label: "Sản lượng",
                    render: (val: number | null, item: any) => (
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-slate-900">
                          {val != null ? val.toLocaleString("vi-VN") : "_"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {val != null ? item.unit || "kg" : ""}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "quality",
                    label: "Chất lượng",
                    render: (val: string) => (
                      <span className="text-xs text-slate-400">
                        {val || "_"}
                      </span>
                    ),
                  },
                  {
                    key: "staff",
                    label: "Người phụ trách",
                    render: (val: string) => (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {val && val !== "_" ? val.charAt(0) : "U"}
                        </div>
                        <span className="text-sm text-slate-600">
                          {val || "_"}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "notes",
                    label: "Ghi chú",
                    render: (val: string) => (
                      <span className="text-xs text-slate-400 truncate max-w-50 block">
                        {val || "_"}
                      </span>
                    ),
                  },
                ]}
                data={harvestRows}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
