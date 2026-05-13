import { BarChart3, ClipboardList, Leaf, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReportResult } from "../types";

interface ChartDatum {
  name: string;
  value: number;
  fill: string;
}

interface ReportOverviewChartsProps {
  result: ReportResult;
  taskStatusChartData: ChartDatum[];
  planPurposeChartData: ChartDatum[];
}

export function ReportOverviewCharts({
  result,
  taskStatusChartData,
  planPurposeChartData,
}: ReportOverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-primary" />
            Xu hướng sản lượng và công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="yield"
                  name="Sản lượng"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  name="Công việc"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Leaf className="w-5 h-5 text-primary" />
            Vật tư theo kỳ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="materials"
                  name="Nhóm vật tư"
                  fill="#0f766e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-primary" />
            Vùng diện tích sản lượng và vật tư
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData}>
                <defs>
                  <linearGradient
                    id="yieldGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="materialGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="yield"
                  name="Sản lượng"
                  stroke="#16a34a"
                  fill="url(#yieldGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="materials"
                  name="Nhóm vật tư"
                  stroke="#0f766e"
                  fill="url(#materialGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="w-5 h-5 text-primary" />
            Cơ cấu trạng thái công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          {taskStatusChartData.length === 0 ? (
            <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Chưa có dữ liệu công việc trong phạm vi báo cáo.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={taskStatusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={104}
                    paddingAngle={3}
                    label
                  >
                    {taskStatusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-primary" />
            Mục đích kế hoạch theo phạm vi báo cáo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {planPurposeChartData.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Không có kế hoạch trong phạm vi đã chọn.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={planPurposeChartData}
                  layout="vertical"
                  margin={{ left: 24, right: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    fontSize={12}
                    width={110}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name="Số kế hoạch" radius={[0, 4, 4, 0]}>
                    {planPurposeChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
