import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { useFarmHarvestProduction } from "@/features/farm/hooks/useFarmDashboard";

const LINE_COLORS = [
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#047857", // Dark Emerald
  "#d97706", // Dark Amber
  "#1d4ed8", // Dark Blue
  "#64748b", // Slate
];

function formatBucketLabel(bucketStart: string): string {
  if (!bucketStart) return "";
  const parts = bucketStart.split("-");
  if (parts.length >= 2) {
    return `T${parts[1]}/${parts[0].slice(2)}`;
  }
  return bucketStart;
}

export function YieldChart() {
  const fromDate = useMemo(
    () => dayjs().subtract(11, "month").startOf("month").format("YYYY-MM-DD"),
    [],
  );
  const toDate = useMemo(() => dayjs().endOf("month").format("YYYY-MM-DD"), []);

  const { data, isLoading, isFetching, error, refetch } =
    useFarmHarvestProduction({
      periodType: "MONTHLY",
      fromDate,
      toDate,
    });

  const is503Error = (error as any)?.response?.status === 503;
  const series = data?.series;

  // Transform Recharts Data
  const chartData = useMemo(() => {
    if (!series || !Array.isArray(series) || series.length === 0) return [];

    // Collect all unique bucketStarts
    const bucketMap = new Map<string, Record<string, any>>();

    series.forEach((s) => {
      if (Array.isArray(s.points)) {
        s.points.forEach((p) => {
          if (!bucketMap.has(p.bucketStart)) {
            bucketMap.set(p.bucketStart, {
              bucketStart: p.bucketStart,
              monthLabel: formatBucketLabel(p.bucketStart),
            });
          }
          const row = bucketMap.get(p.bucketStart)!;
          // Handle quantityTon OR quantityKg (converted to ton by dividing by 1000)
          const qtyTon =
            p.quantityTon !== undefined
              ? p.quantityTon
              : p.quantityKg !== undefined
                ? p.quantityKg / 1000
                : 0;
          row[s.groupLabel] = qtyTon;
        });
      }
    });

    // Sort buckets chronologically
    return Array.from(bucketMap.values()).sort((a, b) =>
      a.bucketStart.localeCompare(b.bucketStart),
    );
  }, [series]);

  return (
    <Card className="lg:col-span-2 shadow-sm border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0 shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-bold text-base text-slate-800 leading-tight">
              Sản lượng thu hoạch nông hộ (tấn)
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Diễn biến sản lượng thu hoạch 12 tháng gần nhất theo từng giống
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold shrink-0 self-start sm:self-auto">
            12 Tháng gần nhất
          </Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => refetch()}
            className="h-8 text-xs gap-1 border-slate-200 hover:bg-slate-100 cursor-pointer disabled:opacity-60"
            title="Tải lại dữ liệu sản lượng"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-600" : ""}`}
            />
            <span>{isFetching ? "Đang tải..." : "Tải lại"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-4">
        {is503Error ? (
          <div className="p-8 text-center text-slate-600 text-xs bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
            <p className="font-semibold text-slate-800">
              Dịch vụ tổng hợp dữ liệu thu hoạch đang bảo trì tạm thời (HTTP
              503)
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-amber-300 text-amber-900 bg-white hover:bg-amber-100 text-xs gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </Button>
          </div>
        ) : series === null ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
            <Info className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="font-semibold text-slate-700">
              Chưa xác định được đơn vị khối lượng thu hoạch
            </p>
            <p className="text-slate-500 text-[11px]">
              Dữ liệu thu hoạch có chứa mặt hàng thiếu hoặc không quy đổi được
              về tấn.
            </p>
          </div>
        ) : isLoading ? (
          <div className="h-[300px] w-full flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold text-slate-500">
              Đang tải dữ liệu sản lượng...
            </span>
          </div>
        ) : !series || series.length === 0 || chartData.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Không có dữ liệu sản lượng thu hoạch trong 12 tháng gần nhất.
          </div>
        ) : (
          <div className="h-[300px] w-full relative">
            {isFetching && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all">
                <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                <span className="text-xs font-semibold text-slate-600">
                  Đang cập nhật dữ liệu...
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  dy={8}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                  unit=" tấn"
                />
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                  }}
                  formatter={(val: unknown, name: unknown) => {
                    const numVal =
                      typeof val === "number" ? val : Number(val) || 0;
                    return [
                      `${numVal.toLocaleString("vi-VN")} Tấn`,
                      String(name ?? ""),
                    ];
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: string) => (
                    <span className="text-xs font-semibold text-slate-700 ml-1">
                      {value}
                    </span>
                  )}
                />
                {series.map((s, idx) => (
                  <Line
                    key={s.groupKey}
                    type="monotone"
                    dataKey={s.groupLabel}
                    name={s.groupLabel}
                    stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#ffffff",
                      stroke: LINE_COLORS[idx % LINE_COLORS.length],
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
