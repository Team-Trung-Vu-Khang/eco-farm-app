import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Workflow,
  ClipboardList,
  CheckSquare,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  farmingProgress,
  realtimeStatus,
  weeklyTaskTrend,
} from "../constants";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(140, 15%, 88%)",
  borderRadius: "8px",
  fontSize: "12px",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FarmingHistoryTab() {
  const daysSince = realtimeStatus.daysSinceUpdate;
  const isStale = daysSince > 0;
  const staleColor =
    daysSince > 3
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const staleIconColor = daysSince > 3 ? "text-red-600" : "text-amber-600";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Trạng thái cập nhật Real-time
            </CardTitle>
            {isStale && (
              <Badge
                variant="outline"
                className={`text-xs ${staleColor}`}
              >
                <AlertTriangle className={`mr-1 h-3 w-3 ${staleIconColor}`} />
                Đã {daysSince} ngày chưa cập nhật
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Cập nhật lần cuối:{" "}
              <span className="font-medium text-foreground">
                {formatDateTime(realtimeStatus.lastUpdated)}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Công việc hoàn thành gần nhất
              </div>
              <p className="text-sm font-medium">
                {realtimeStatus.lastCompletedTask}
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Công việc phát sinh gần nhất
              </div>
              <p className="text-sm font-medium">
                {realtimeStatus.lastCreatedTask}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Tiến độ canh tác
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {farmingProgress.workflows.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {farmingProgress.workflows.total}
                </span>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  Xem sơ đồ <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
              <span>
                Hoàn thành:{" "}
                <span className="font-medium text-green-500">
                  {farmingProgress.workflows.completed}
                </span>
              </span>
              <span>•</span>
              <span>
                Còn lại:{" "}
                <span className="font-medium">
                  {farmingProgress.workflows.total -
                    farmingProgress.workflows.completed}
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {farmingProgress.plans.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-green-700">
                  {farmingProgress.plans.completed}
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  Hoàn thành
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-amber-700">
                  {farmingProgress.plans.pending}
                </p>
                <p className="text-xs font-medium text-amber-600 mt-1">
                  Chờ triển khai
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-blue-700">
                  {farmingProgress.plans.inProgress}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  Đang triển khai
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {farmingProgress.tasks.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-green-700">
                  {farmingProgress.tasks.completed}
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  Hoàn thành
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-amber-700">
                  {farmingProgress.tasks.pending}
                </p>
                <p className="text-xs font-medium text-amber-600 mt-1">
                  Chờ triển khai
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-blue-700">
                  {farmingProgress.tasks.inProgress}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  Đang triển khai
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Xu hướng hoàn thành công việc (5 tuần gần nhất)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyTaskTrend}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(140, 15%, 88%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
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
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Hoàn thành"
                  stroke="hsl(142, 70%, 45%)"
                  fill="hsl(142, 70%, 45%)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Phát sinh"
                  stroke="hsl(38, 92%, 50%)"
                  fill="hsl(38, 92%, 50%)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
