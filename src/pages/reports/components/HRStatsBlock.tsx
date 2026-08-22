import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { mockHRStats } from "../constants/mockReportData";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-lg text-xs animate-in fade-in duration-100">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>
            Số lượng: <strong className="text-slate-800 font-mono">{payload[0].value} người</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function HRStatsBlock() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {/* Chart 1: Nhân sự theo Phòng ban */}
      <Card className="border border-slate-100 shadow-xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-800">
            Thống kê nhân sự theo Phòng ban
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockHRStats.departments}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" horizontal={false} />
                <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(226, 232, 240, 0.3)" }} />
                <Bar
                  dataKey="value"
                  fill="hsl(142, 60%, 40%)"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Nhân sự theo Chức vụ */}
      <Card className="border border-slate-100 shadow-xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-800">
            Thống kê nhân sự theo Chức vụ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockHRStats.positions}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" horizontal={false} />
                <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(226, 232, 240, 0.3)" }} />
                <Bar
                  dataKey="value"
                  fill="hsl(38, 92%, 50%)"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
