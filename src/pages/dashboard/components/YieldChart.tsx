import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { TrendingUp } from "lucide-react";
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
import { yieldData } from "../constants";

export function YieldChart() {
  return (
    <Card className="lg:col-span-2 shadow-sm border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0 shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-bold text-base text-slate-800 leading-tight">
              Sản lượng thu hoạch (tấn)
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Diễn biến sản lượng thu hoạch 12 tháng gần nhất (T10/2025 -
              T09/2026)
            </p>
          </div>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold shrink-0 self-start sm:self-auto">
          12 Tháng gần nhất (Đến T09/2026)
        </Badge>
      </CardHeader>
      <CardContent className="pt-5 pb-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={yieldData}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
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
                formatter={(val: number, name: string) => [`${val} Tấn`, name]}
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
              <Line
                type="monotone"
                dataKey="monthon"
                name="Sầu riêng Monthon"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#10b981",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ri6"
                name="Sầu riêng Ri6"
                stroke="#047857"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#047857",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="dona"
                name="Sầu riêng Dona"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#f59e0b",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
