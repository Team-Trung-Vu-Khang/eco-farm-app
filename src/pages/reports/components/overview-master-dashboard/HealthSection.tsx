import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Beef,
  Fish,
  Loader2,
  Search,
  Sprout,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TreeNode } from "../../constants/mockReportData";
import {
  useProductionVariants,
  useVariantCard,
} from "@/features/farm/hooks/useFarmReport";
import type { VariantCardResponse } from "@/features/farm/types/farm-report.type";
import { useDebounce } from "@/shared/hooks/useDebounce";

// ─── Domain → API domainCode mapping ─────────────────────────────────────────
// URL param "aqua" maps to BE domainCode "AQUACULTURE" (consistent with the rest of the codebase)

const DOMAIN_CODE_MAP: Record<string, string> = {
  crops: "CROP",
  livestock: "LIVESTOCK",
  aqua: "AQUACULTURE",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (val: number) =>
  new Intl.NumberFormat("vi-VN").format(val);

const formatKg = (val: number | null | undefined) =>
  val == null ? "—" : `${formatNumber(val)} kg`;

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface HealthSectionProps {
  selectedLocation: TreeNode | null;
  domainType: "crops" | "livestock" | "aqua";
  locationFilter: { regionId?: number; areaId?: number; plotId?: number };
}

// ─── Single variant card (fetches its own data) ───────────────────────────────

interface VariantCardProps {
  variantCode: string;
  variantName: string;
  domainCode: string;
  locationFilter: { regionId?: number; areaId?: number; plotId?: number };
  IconComponent: React.ElementType;
  text: ReturnType<typeof getTexts>;
}

function getTexts(domainType: "crops" | "livestock" | "aqua") {
  switch (domainType) {
    case "livestock":
      return {
        title: "Danh sách vật nuôi chính",
        search: "Tìm kiếm tên vật nuôi...",
        scale: "Quy mô chăn nuôi",
        health: "Sức khỏe vật nuôi",
        subLegend: "chuồng/trại",
        remaining: "Số lượng chờ xuất bán/thu hoạch",
      };
    case "aqua":
      return {
        title: "Danh sách thủy hải sản chính",
        search: "Tìm kiếm tên thủy sản...",
        scale: "Quy mô nuôi trồng",
        health: "Sức khỏe thủy sản",
        subLegend: "ao",
        remaining: "Diện tích chờ thu hoạch",
      };
    default:
      return {
        title: "Danh sách cây trồng chính",
        search: "Tìm kiếm tên cây trồng...",
        scale: "Quy mô canh tác",
        health: "Sức khỏe cây trồng",
        subLegend: "lô",
        remaining: "Diện tích chờ thu hoạch",
      };
  }
}

/** Render trend badge (changePercent) */
const TrendBadge: React.FC<{ value: number | null }> = ({ value }) => {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <span
      className={`flex items-center text-xs font-bold ${up ? "text-emerald-600" : "text-rose-600"}`}
    >
      {up ? (
        <TrendingUp className="w-3.5 h-3.5" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5" />
      )}
      <span>{Math.abs(value)}%</span>
    </span>
  );
};

/** Single VariantCard — calls API 3.2 for its own data */
const VariantCard: React.FC<VariantCardProps> = ({
  variantCode,
  variantName,
  domainCode,
  locationFilter,
  IconComponent,
  text,
}) => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const { data, isLoading } = useVariantCard({
    variantCode,
    domainCode,
    ...locationFilter,
    date: today,
  });

  /** Build recharts data from health.byPlot */
  const chartData = useMemo(() => {
    if (!data?.health?.byPlot?.length) return [];
    return data.health.byPlot.map((p) => ({
      name: p.plotName,
      good: p.healthyCount ?? 0,
      treating: p.treatingCount,
      disease: p.diseasedCount ?? 0,
      harvesting: p.harvestedCount ?? 0,
    }));
  }, [data]);

  const totalHealthy = data?.health.healthyCount;
  const totalTreating = data?.health.treatingCount ?? 0;
  const totalDiseased = data?.health.diseasedCount;
  const totalHarvested = data?.health.harvestedCount;

  return (
    <Card className="border border-slate-100 hover:border-slate-200 transition-all shadow-xs bg-white flex flex-col justify-between rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-5 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              {variantName}
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Quy mô quản lý</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          </div>
        ) : !data ? (
          <p className="text-xs text-slate-400 text-center py-4">
            Không có dữ liệu
          </p>
        ) : (
          <>
            {/* Quy mô canh tác */}
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-500 font-medium">
                {text.scale}
              </span>
              <span className="text-2xl font-display font-extrabold text-slate-855">
                {data.cultivationScale.quantity != null
                  ? `${formatNumber(data.cultivationScale.quantity)}${data.cultivationScale.unit ? ` ${data.cultivationScale.unit}` : ""}`
                  : "—"}
              </span>
            </div>

            {/* Sức khỏe — BarChart theo lô */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-655">
                <span>{text.health}</span>
                <span>
                  {chartData.length} {text.subLegend} đang trồng
                </span>
              </div>

              {chartData.length > 0 ? (
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
                          tick={{
                            fontSize: 8,
                            fill: "#94a3b8",
                            fontWeight: "600",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 8,
                            fill: "#94a3b8",
                            fontWeight: "600",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(value: any, name: any) => {
                            const nameMap: Record<string, string> = {
                              good: "Tốt",
                              treating: "Đang xử lý bệnh hại",
                              disease: "Chờ xử lý bệnh hại",
                              harvesting: "Đang thu hoạch/bán",
                            };
                            return [value, nameMap[name] || name];
                          }}
                          labelFormatter={(label, items) =>
                            items?.[0]?.payload?.name || label
                          }
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
              ) : (
                <div className="h-16 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-slate-100">
                  Chưa có dữ liệu theo lô
                </div>
              )}

              {/* Legend */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-150/40">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Tốt ({totalHealthy ?? "—"})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">Xử lý ({totalTreating})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate">
                    Bệnh ({totalDiseased ?? "—"})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span className="truncate">
                    Thu hoạch ({totalHarvested ?? "—"})
                  </span>
                </div>
              </div>
            </div>

            {/* Năng suất */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Tổng sản lượng (năm)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-slate-800 font-mono">
                      {formatKg(data.totalHarvest?.quantityKg)}
                    </span>
                    <TrendBadge
                      value={data.totalHarvest?.changePercent ?? null}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Sản lượng gần nhất (tháng)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-slate-800 font-mono">
                      {formatKg(data.latestHarvest?.quantityKg)}
                    </span>
                    <TrendBadge
                      value={data.latestHarvest?.changePercent ?? null}
                    />
                  </div>
                </div>
              </div>

              {/* Chờ thu hoạch — ẩn nếu null */}
              {data.pendingHarvest.quantity != null && (
                <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-semibold">
                    {text.remaining}:
                  </span>
                  <span className="font-extrabold text-slate-700">
                    {data.pendingHarvest.quantity}{" "}
                    {data.pendingHarvest.unit ?? ""}
                    {data.pendingHarvest.percentageOfCultivationScale !=
                      null && (
                      <span className="text-slate-400 font-normal ml-1">
                        ({data.pendingHarvest.percentageOfCultivationScale}% quy
                        mô)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Main HealthSection ───────────────────────────────────────────────────────

export const HealthSection: React.FC<HealthSectionProps> = ({
  selectedLocation: _selectedLocation,
  domainType,
  locationFilter,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page] = useState(0);

  const debouncedSearch = useDebounce(searchInput, 300);
  const domainCode = DOMAIN_CODE_MAP[domainType] ?? "CROP";
  const text = getTexts(domainType);

  const IconComponent = useMemo(() => {
    if (domainType === "livestock") return Beef;
    if (domainType === "aqua") return Fish;
    return Sprout;
  }, [domainType]);

  const { items, isLoading, total } = useProductionVariants({
    domainCode,
    ...locationFilter,
    search: debouncedSearch || undefined,
    page,
    size: 20,
  });

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        <CardContent className="p-5 space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <IconComponent className="w-4.5 h-4.5 text-emerald-600" />
              <span>{text.title}</span>
              {!isLoading && total > 0 && (
                <span className="text-xs font-normal text-slate-400 lowercase">
                  ({total} giống)
                </span>
              )}
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={text.search}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white h-9 font-medium"
                />
              </div>

              {/* Status Filter — client-side only (API doesn't support health status filter) */}
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full text-xs bg-white border border-slate-105 rounded-lg h-9">
                    <SelectValue placeholder="Lọc trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="treating">
                      Đang xử lý bệnh hại
                    </SelectItem>
                    <SelectItem value="data">Có dữ liệu sản lượng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <XCircle className="w-12 h-12 text-slate-300 animate-bounce" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">
                  Chưa có thông tin
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  {debouncedSearch
                    ? "Không tìm thấy giống nào khớp với từ khóa."
                    : "Chưa có giống nào được gán cho vùng này."}
                </p>
              </div>
              {(debouncedSearch || statusFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold bg-slate-200/80 hover:bg-slate-200 text-slate-750 rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  Thiết lập lại bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {items.map((variant) => (
                <VariantCard
                  key={variant.id}
                  variantCode={variant.code}
                  variantName={variant.name}
                  domainCode={variant.domainCode}
                  locationFilter={locationFilter}
                  IconComponent={IconComponent}
                  text={text}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
