import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Sản lượng thu hoạch (tấn)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={yieldData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(140, 15%, 88%)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(140, 15%, 88%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value: string) => (
                  <span className="text-sm font-medium text-slate-600 ml-1">
                    {value}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="monthon"
                name="Monthon"
                stroke="hsl(142, 70%, 45%)"
                strokeWidth={2}
                dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="ri6"
                name="Ri6"
                stroke="hsl(142, 60%, 25%)"
                strokeWidth={2}
                dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="dona"
                name="Dona"
                stroke="hsl(142, 50%, 95%)"
                strokeWidth={2}
                dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
