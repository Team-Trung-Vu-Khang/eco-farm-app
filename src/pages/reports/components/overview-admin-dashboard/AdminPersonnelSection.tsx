import React from "react";
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
import { UserCheck, Loader2, PackageOpen } from "lucide-react";
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";
import { useFarmPositionsMasterData } from "@/features/master-data/hooks/useFarmPositions";

interface AdminPersonnelSectionProps {
  selectedWorkspace?: WorkspaceRecord | null;
  selectedEntity?: WorkspaceRecord | null;
}

export const AdminPersonnelSection: React.FC<AdminPersonnelSectionProps> = ({
  selectedWorkspace,
  selectedEntity,
}) => {
  const currentWorkspace = selectedWorkspace ?? selectedEntity;
  const workspaceId = typeof currentWorkspace?.id === "number" ? currentWorkspace.id : undefined;

  const { items, loading } = useFarmPositionsMasterData({
    workspaceId,
    enabled: true,
  });

  const chartData = (items || [])
    .map((pos) => ({
      name: pos.name,
      value: (pos as any).personnelCount ?? (pos as any).totalPersonnel ?? 1,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
          <span>Cơ cấu nhân sự & Phân bổ chức vụ</span>
        </CardTitle>
        {currentWorkspace && (
          <span className="text-xs text-slate-400 font-medium">
            Workspace: {currentWorkspace.name}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-xs">Đang tải dữ liệu nhân sự...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 space-y-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
            <PackageOpen className="w-8 h-8 text-slate-300" />
            <span className="text-xs">Chưa có dữ liệu phân bổ nhân sự thực tế</span>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Số lượng nhân sự hoạt động theo chức vụ
            </h4>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 40)}>
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 15, right: 35, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
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
        )}
      </CardContent>
    </Card>
  );
};
