import React, { useMemo } from "react";
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
  Tooltip,
  LabelList,
} from "recharts";
import { UserCheck } from "lucide-react";
import { mockHRStats, type TreeNode } from "../../constants/mockReportData";

interface PersonnelSectionProps {
  selectedLocation: TreeNode | null;
}

export const PersonnelSection: React.FC<PersonnelSectionProps> = ({
  selectedLocation,
}) => {
  const multiplier = useMemo(() => {
    if (!selectedLocation) return 1;
    if (selectedLocation.type === "region") return 0.6;
    if (selectedLocation.type === "area") return 0.3;
    return 0.15;
  }, [selectedLocation]);

  const chartData = useMemo(() => {
    return mockHRStats.positions
      .map((pos) => ({
        name: pos.name,
        value: Math.max(1, Math.round(pos.value * multiplier)),
      }))
      .sort((a, b) => b.value - a.value); // Sorted in descending order (highest headcount first)
  }, [multiplier]);

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-4">
        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
          <span>Cơ cấu nhân sự & Phân bổ chức vụ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Biểu đồ số lượng nhân sự
          </h4>
          <div className="w-full">
            {/* Height 300 responsive container wrapper */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 15, right: 35, left: 10, bottom: 5 }}
              >
                {/* Hide grid lines and axis lines for a cleaner look */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                {/* YAxis displays Job titles without truncation (width={150}) */}
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: "600" }}
                  axisLine={false}
                  tickLine={false}
                  width={150}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} người`, "Số lượng"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #f1f5f9",
                  }}
                />
                {/* Bar styled in Indigo with explicit LabelList */}
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fill: "#475569", fontSize: 10, fontWeight: "bold" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
