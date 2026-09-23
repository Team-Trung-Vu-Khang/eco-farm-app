import React, { useState } from "react";
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
} from "recharts";
import {
  Sprout,
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
  PackageOpen,
} from "lucide-react";
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";
import {
  useProductionVariants,
  useVariantCard,
} from "@/features/farm/hooks/useFarmReport";

interface AdminHealthSectionProps {
  selectedWorkspace?: WorkspaceRecord | null;
  selectedEntity?: WorkspaceRecord | null;
}

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "0";
  return new Intl.NumberFormat("vi-VN").format(val);
};

const VariantHealthCard: React.FC<{
  variantCode: string;
  domainCode: string;
  workspaceId?: number | string;
}> = ({ variantCode, domainCode, workspaceId }) => {
  const { data, isLoading } = useVariantCard(
    { variantCode, domainCode },
    { workspaceId },
  );

  if (isLoading) {
    return (
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl p-5 flex items-center justify-center min-h-[220px]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </Card>
    );
  }

  if (!data) return null;

  const totalHarvest = data.totalHarvest;
  const latestHarvest = data.latestHarvest;
  const health = data.health || {
    healthyCount: 0,
    treatingCount: 0,
    diseasedCount: 0,
    harvestedCount: 0,
    byPlot: [],
  };

  const chartData = (health.byPlot || []).map((plot) => ({
    name: plot.plotName || plot.plotCode,
    good: plot.healthyCount || 0,
    treating: plot.treatingCount || 0,
    disease: plot.diseasedCount || 0,
    harvesting: plot.harvestedCount || 0,
  }));

  return (
    <Card className="border border-slate-100 hover:border-slate-200 transition-all shadow-xs bg-white flex flex-col justify-between rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-5 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              {data.name}
            </CardTitle>
            <p className="text-xs text-slate-400 font-mono font-medium">
              Mã: {data.code}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Quy mô */}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Quy mô canh tác
          </span>
          <span className="text-2xl font-display font-extrabold text-slate-850">
            {formatNumber(data.cultivationScale?.quantity)}{" "}
            <span className="text-xs font-normal text-slate-500">
              {data.cultivationScale?.unit || "đơn vị"}
            </span>
          </span>
        </div>

        {/* Biểu đồ Sức khỏe lô */}
        {chartData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-650">
              <span>Sức khỏe cây trồng</span>
              <span>{chartData.length} lô đang trồng</span>
            </div>
            <div className="h-28 w-full bg-slate-50/30 rounded-lg p-2 border border-slate-100 overflow-x-auto scrollbar-thin">
              <div
                style={{
                  minWidth:
                    chartData.length * 80 > 350
                      ? `${chartData.length * 80}px`
                      : "100%",
                  height: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f8fafc"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 8, fill: "#94a3b8", fontWeight: "600" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 8, fill: "#94a3b8", fontWeight: "600" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => {
                        const nameMap: Record<string, string> = {
                          good: "Tốt",
                          treating: "Đang xử lý bệnh hại",
                          disease: "Chờ xử lý bệnh hại",
                          harvesting: "Đang thu hoạch",
                        };
                        return [value, nameMap[name] || name];
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #f1f5f9",
                        fontSize: "10px",
                      }}
                    />
                    <Bar dataKey="good" fill="#10b981" />
                    <Bar dataKey="treating" fill="#f59e0b" />
                    <Bar dataKey="disease" fill="#ef4444" />
                    <Bar dataKey="harvesting" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-150/40">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Tốt ({health.healthyCount || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="truncate">
              Xử lý ({health.treatingCount || 0})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">Bệnh ({health.diseasedCount || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
            <span className="truncate">
              Thu hoạch ({health.harvestedCount || 0})
            </span>
          </div>
        </div>

        {/* Năng suất & Thu hoạch */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Tổng sản lượng thu hoạch
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {formatNumber(totalHarvest?.quantityKg)} kg
                </span>
                {totalHarvest?.changePercent !== null &&
                  totalHarvest?.changePercent !== undefined && (
                    <span
                      className={`flex items-center text-xs font-bold ${
                        (totalHarvest.changePercent ?? 0) >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {(totalHarvest.changePercent ?? 0) >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{Math.abs(totalHarvest.changePercent ?? 0)}%</span>
                    </span>
                  )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Thu hoạch gần nhất
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {formatNumber(latestHarvest?.quantityKg)} kg
                </span>
                {latestHarvest?.changePercent !== null &&
                  latestHarvest?.changePercent !== undefined && (
                    <span
                      className={`flex items-center text-xs font-bold ${
                        (latestHarvest.changePercent ?? 0) >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {(latestHarvest.changePercent ?? 0) >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{Math.abs(latestHarvest.changePercent ?? 0)}%</span>
                    </span>
                  )}
              </div>
            </div>
          </div>

          {data.pendingHarvest?.quantity !== null && (
            <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-semibold">
                Chờ thu hoạch:
              </span>
              <span className="font-extrabold text-slate-700">
                {formatNumber(data.pendingHarvest?.quantity)}{" "}
                {data.pendingHarvest?.unit || "kg"}
                {data.pendingHarvest?.percentageOfCultivationScale !== null && (
                  <span className="text-slate-400 font-normal ml-1">
                    ({data.pendingHarvest?.percentageOfCultivationScale}%)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminHealthSection: React.FC<AdminHealthSectionProps> = ({
  selectedWorkspace,
  selectedEntity,
}) => {
  const currentWorkspace = selectedWorkspace ?? selectedEntity;
  const [searchQuery, setSearchQuery] = useState("");

  const { items, isLoading } = useProductionVariants(
    {
      domainCode: "CROP",
      search: searchQuery.trim() || undefined,
    },
    { workspaceId: currentWorkspace?.id },
  );

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardContent className="p-5 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Sprout className="w-4.5 h-4.5 text-emerald-600" />
              <span>Báo cáo sức khỏe & Năng suất cây trồng</span>
            </h3>
            {currentWorkspace && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Workspace:{" "}
                <span className="font-semibold text-slate-700">
                  {currentWorkspace.name}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[320px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cây trồng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white h-9 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
            <span className="text-xs font-medium">
              Đang tải báo cáo sức khỏe cây trồng...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <PackageOpen className="w-12 h-12 text-slate-300" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">
                Chưa có dữ liệu cây trồng
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Không tìm thấy dữ liệu báo cáo sức khỏe cây trồng nào phù hợp
                với bộ lọc hiện tại.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {items.map((item) => (
              <VariantHealthCard
                key={item.id}
                variantCode={item.code}
                domainCode={item.domainCode || "CROP"}
                workspaceId={currentWorkspace?.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
