import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MapPin,
  TreePine,
  Truck,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  BarChart4,
  Table2,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  cropHealthData,
  harvestComparison,
  harvestSummary,
  overviewStats,
} from "../constants";

// Mock database for location consumption API simulation
const locationConsumptionData = [
  { locationId: "p1", name: "Lô A1-01", pesticide: 120, fertilizer: 450, machinery: 14, others: 55 },
  { locationId: "p2", name: "Lô A1-02", pesticide: 80, fertilizer: 300, machinery: 10, others: 40 },
  { locationId: "p3", name: "Lô A1-03", pesticide: 150, fertilizer: 550, machinery: 18, others: 70 },
  { locationId: "p4", name: "Lô A1-04", pesticide: 100, fertilizer: 380, machinery: 12, others: 50 },
  { locationId: "p5", name: "Lô A2-01", pesticide: 95, fertilizer: 350, machinery: 11, others: 45 },
  { locationId: "p6", name: "Lô A2-02", pesticide: 110, fertilizer: 420, machinery: 13, others: 52 },
  { locationId: "p7", name: "Lô A2-03", pesticide: 75, fertilizer: 280, machinery: 9, others: 35 },
  { locationId: "p8", name: "Lô A3-01", pesticide: 130, fertilizer: 490, machinery: 15, others: 60 },
  { locationId: "p9", name: "Lô A3-02", pesticide: 65, fertilizer: 240, machinery: 8, others: 30 },
  { locationId: "p10", name: "Lô A3-03", pesticide: 140, fertilizer: 520, machinery: 16, others: 65 },
  { locationId: "p11", name: "Lô A3-04", pesticide: 85, fertilizer: 310, machinery: 10, others: 38 },
  { locationId: "p12", name: "Lô A3-05", pesticide: 105, fertilizer: 390, machinery: 12, others: 48 },
  { locationId: "p13", name: "Lô B1-01", pesticide: 200, fertilizer: 750, machinery: 22, others: 90 },
  { locationId: "p14", name: "Lô B1-02", pesticide: 180, fertilizer: 680, machinery: 20, others: 82 },
  { locationId: "p15", name: "Lô B1-03", pesticide: 150, fertilizer: 570, machinery: 17, others: 68 },
  { locationId: "p16", name: "Lô B2-01", pesticide: 125, fertilizer: 460, machinery: 14, others: 56 },
  { locationId: "p17", name: "Lô B2-02", pesticide: 145, fertilizer: 530, machinery: 16, others: 64 },
  { locationId: "p18", name: "Lô B2-03", pesticide: 165, fertilizer: 610, machinery: 19, others: 75 },
  { locationId: "p19", name: "Lô B2-04", pesticide: 90, fertilizer: 340, machinery: 11, others: 42 },
  { locationId: "p20", name: "Lô C1-01", pesticide: 250, fertilizer: 950, machinery: 28, others: 110 },
  { locationId: "p21", name: "Lô C1-02", pesticide: 220, fertilizer: 830, machinery: 25, others: 98 },
  { locationId: "p22", name: "Lô C1-03", pesticide: 185, fertilizer: 690, machinery: 21, others: 82 },
  { locationId: "p23", name: "Lô C1-04", pesticide: 205, fertilizer: 760, machinery: 23, others: 92 },
  { locationId: "p24", name: "Lô C2-01", pesticide: 155, fertilizer: 580, machinery: 18, others: 70 },
  { locationId: "p25", name: "Lô C2-02", pesticide: 125, fertilizer: 470, machinery: 14, others: 55 },
  { locationId: "p26", name: "Lô C2-03", pesticide: 105, fertilizer: 390, machinery: 12, others: 45 },
  { locationId: "p27", name: "Lô C3-01", pesticide: 80, fertilizer: 300, machinery: 9, others: 36 },
  { locationId: "p28", name: "Lô C3-02", pesticide: 115, fertilizer: 420, machinery: 13, others: 50 },
  { locationId: "p29", name: "Lô C3-03", pesticide: 135, fertilizer: 500, machinery: 15, others: 62 },
  { locationId: "p30", name: "Lô C3-04", pesticide: 90, fertilizer: 350, machinery: 11, others: 40 },
  { locationId: "p31", name: "Lô C3-05", pesticide: 70, fertilizer: 270, machinery: 8, others: 32 },
  { locationId: "p32", name: "Lô D1-01", pesticide: 310, fertilizer: 1150, machinery: 32, others: 140 },
  { locationId: "p33", name: "Lô D1-02", pesticide: 290, fertilizer: 1080, machinery: 30, others: 130 },
  { locationId: "p34", name: "Lô D2-01", pesticide: 190, fertilizer: 700, machinery: 20, others: 85 },
  { locationId: "p35", name: "Lô D2-02", pesticide: 230, fertilizer: 850, machinery: 24, others: 100 },
  { locationId: "p36", name: "Lô D2-03", pesticide: 160, fertilizer: 590, machinery: 17, others: 72 },
];

interface OverviewTabProps {
  farmingFilter?: {
    selectedPlots: string[];
    dateFrom: string;
    dateTo: string;
  };
}

function formatNumber(n: number) {
  return n.toLocaleString("vi-VN");
}

function formatArea(m2: number) {
  if (m2 >= 10000) {
    return `${(m2 / 10000).toFixed(1)} ha`;
  }
  return `${formatNumber(m2)} m2`;
}

function ChangeIndicator({
  current,
  previous,
  label,
}: {
  current: number;
  previous: number;
  label: string;
}) {
  if (previous === 0) return null;
  const pct = (((current - previous) / previous) * 100).toFixed(1);
  const isPositive = current > previous;

  return (
    <p className="flex items-center gap-1 text-xs font-medium">
      {isPositive ? (
        <TrendingUp className="h-3 w-3 text-green-500" />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-500" />
      )}
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {isPositive ? "+" : ""}
        {pct}% {label}
      </span>
    </p>
  );
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(140, 15%, 88%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export function OverviewTab({ farmingFilter }: OverviewTabProps) {
  const totalCropHealth = cropHealthData.reduce((s, d) => s + d.value, 0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(locationConsumptionData.slice(0, 5));
  const [viewType, setViewType] = useState<"chart" | "table">("chart");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const plots = farmingFilter?.selectedPlots || [];
      if (plots.length === 0) {
        setData(locationConsumptionData.slice(0, 5));
      } else {
        const filtered = locationConsumptionData.filter((d) =>
          plots.includes(d.locationId)
        );
        setData(filtered);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [farmingFilter?.selectedPlots]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng diện tích
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-display font-bold">
              {formatArea(overviewStats.totalArea)}
            </p>
            <ChangeIndicator
              current={overviewStats.totalArea}
              previous={overviewStats.previousArea}
              label="so với kỳ trước"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Phân bổ vùng
              </CardTitle>
              <TreePine className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-display font-bold">
              {formatNumber(overviewStats.totalRegions)} vùng
            </p>
            <ChangeIndicator
              current={overviewStats.totalRegions}
              previous={overviewStats.previousRegions}
              label="so với kỳ trước"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                Sức khỏe cây trồng
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Căn cứ theo kế hoạch trước đó, hoặc tổng công việc phát
                    sinh không quá 10 ngày
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cropHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-display font-bold">
                    {totalCropHealth}
                  </p>
                  <p className="text-xs text-muted-foreground">Tổng số cây</p>
                </div>
                {cropHealthData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                Sản lượng thu hoạch
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    So sánh sản lượng thực tế với kế hoạch và đợt trước
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={harvestComparison}
                  margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(140, 15%, 88%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(140, 10%, 45%)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(140, 10%, 45%)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value: string) => (
                      <span className="text-xs font-medium text-slate-600 ml-1">
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="actual"
                    name="Thực tế"
                    fill="hsl(142, 70%, 45%)"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="plan"
                    name="Kế hoạch"
                    fill="hsl(38, 92%, 50%)"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="previous"
                    name="Đợt trước"
                    fill="hsl(210, 40%, 80%)"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng sản lượng đã thu hoạch
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-display font-bold">
              {formatNumber(harvestSummary.totalYield)} {harvestSummary.unit}
            </p>
            <ChangeIndicator
              current={harvestSummary.totalYield}
              previous={harvestSummary.previousTotalYield}
              label="so với kỳ trước"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sản lượng thu hoạch gần nhất
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-display font-bold">
              {formatNumber(harvestSummary.latestYield)} {harvestSummary.unit}
            </p>
            <ChangeIndicator
              current={harvestSummary.latestYield}
              previous={harvestSummary.previousLatestYield}
              label="so với đợt trước"
            />
          </CardContent>
        </Card>
      </div>

      {/* Vật tư tiêu thụ (Theo Địa lý) Widget */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Vật tư tiêu thụ (Theo Địa lý)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {farmingFilter?.selectedPlots && farmingFilter.selectedPlots.length > 0
                ? `Hiển thị lượng vật tư tiêu thụ của ${data.length} lô được chọn`
                : "Hiển thị lượng vật tư tiêu thụ của 5 lô điển hình (Chưa chọn bộ lọc)"}
            </p>
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewType("chart")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewType === "chart"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Xem biểu đồ"
            >
              <BarChart4 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewType === "table"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Xem bảng dữ liệu"
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-[250px] flex items-center justify-center animate-pulse bg-slate-50 rounded-lg">
              <span className="text-xs text-muted-foreground">Đang tải dữ liệu tiêu thụ vật tư...</span>
            </div>
          ) : viewType === "chart" ? (
            <div className="h-[300px]">
              {data.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Không có dữ liệu tiêu thụ cho bộ lọc này.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(140, 10%, 45%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(140, 10%, 45%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value: string) => (
                        <span className="text-xs font-medium text-slate-600 ml-1">
                          {value}
                        </span>
                      )}
                    />
                    <Bar dataKey="pesticide" name="Thuốc BVTV (kg)" fill="hsl(172, 70%, 40%)" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="fertilizer" name="Phân bón (kg)" fill="hsl(142, 70%, 45%)" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="machinery" name="Máy móc (ngày)" fill="hsl(38, 92%, 50%)" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="others" name="Vật tư khác" fill="hsl(217, 91%, 60%)" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Địa điểm / Lô</TableHead>
                    <TableHead className="text-right">Thuốc BVTV (kg)</TableHead>
                    <TableHead className="text-right">Phân bón (kg)</TableHead>
                    <TableHead className="text-right">Máy móc (ngày)</TableHead>
                    <TableHead className="text-right">Vật tư khác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                        Không có dữ liệu tiêu thụ.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row.locationId} className="hover:bg-slate-50/40">
                        <TableCell className="font-medium text-slate-700">{row.name}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(row.pesticide)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(row.fertilizer)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(row.machinery)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(row.others)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
