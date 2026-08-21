import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MapPin,
  TreePine,
  Truck,
  HelpCircle,
  TrendingUp,
  TrendingDown,
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

export function OverviewTab() {
  const totalCropHealth = cropHealthData.reduce((s, d) => s + d.value, 0);

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
    </div>
  );
}
