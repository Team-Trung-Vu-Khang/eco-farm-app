import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Sprout, TrendingUp, TrendingDown, Search, XCircle } from "lucide-react";
import { type CorporateEntity } from "./EntitySidebar";
import { type TreeNode, mockTreeViewData } from "../../constants/mockReportData";

interface AdminHealthSectionProps {
  selectedEntity: CorporateEntity | null;
}

// Complete mock data of all plots with health status, size, and crop names
const plotHealthMap: Record<
  string,
  {
    total: number;
    good: number;
    treating: number;
    disease: number;
    harvesting: number;
    size: number;
    cropName: string;
    company: "ecofarm" | "hoabinh" | "mekong";
  }
> = {
  "p-1": { total: 10, good: 7, treating: 2, disease: 1, harvesting: 3, size: 4.5, cropName: "Sầu riêng Ri6", company: "ecofarm" },
  "p-2": { total: 8, good: 6, treating: 1, disease: 1, harvesting: 2, size: 3.2, cropName: "Xoài cát Hòa Lộc", company: "hoabinh" },
  "p-3": { total: 5, good: 4, treating: 1, disease: 0, harvesting: 0, size: 0.8, cropName: "Cà chua hữu cơ", company: "ecofarm" },
  "p-4": { total: 4, good: 3, treating: 0, disease: 1, harvesting: 0, size: 0.5, cropName: "Ớt chuông hữu cơ", company: "hoabinh" },
  "p-5": { total: 6, good: 5, treating: 1, disease: 0, harvesting: 2, size: 5.5, cropName: "Mít Thái", company: "ecofarm" },
  "p-6": { total: 6, good: 5, treating: 0, disease: 1, harvesting: 2, size: 2.8, cropName: "Mít Thái", company: "hoabinh" },
  "p-7": { total: 4, good: 3, treating: 0, disease: 1, harvesting: 1, size: 1.5, cropName: "Bưởi da xanh", company: "ecofarm" },
  "p-8": { total: 5, good: 5, treating: 0, disease: 0, harvesting: 1, size: 6.2, cropName: "Bưởi da xanh", company: "hoabinh" },
};

const plotNameMap: Record<string, string> = {
  "p-1": "Lô B1-01",
  "p-2": "Lô B1-02",
  "p-3": "Lô B2-01",
  "p-4": "Lô B2-02",
  "p-5": "Lô D1-01",
  "p-6": "Lô D1-02",
  "p-7": "Lô D2-01",
  "p-8": "Lô D2-02",
};

interface CropHarvestInfo {
  totalYield: number;
  trendYield: number;
  isYieldUp: boolean;
  recentHarvest: number;
  trendRecent: number;
  isRecentUp: boolean;
  remaining: number;
  remainingQty: number;
  ratio: number;
}

interface CropItem {
  id: string;
  name: string;
  area: number;
  quantity: number;
  harvest: CropHarvestInfo;
  company: "ecofarm" | "hoabinh" | "mekong";
}

const cropItems: CropItem[] = [
  {
    id: "crop-1",
    name: "Sầu riêng Ri6",
    area: 12.5,
    quantity: 3750,
    company: "ecofarm",
    harvest: { totalYield: 24500, trendYield: 15, isYieldUp: true, recentHarvest: 5200, trendRecent: 8, isRecentUp: true, remaining: 4.5, remainingQty: 1350, ratio: 36 },
  },
  {
    id: "crop-2",
    name: "Xoài cát Hòa Lộc",
    area: 8.2,
    quantity: 2460,
    company: "hoabinh",
    harvest: { totalYield: 18500, trendYield: -5, isYieldUp: false, recentHarvest: 3100, trendRecent: 12, isRecentUp: true, remaining: 2.1, remainingQty: 630, ratio: 25 },
  },
  {
    id: "crop-3",
    name: "Mít Thái",
    area: 15.0,
    quantity: 4500,
    company: "hoabinh",
    harvest: { totalYield: 32000, trendYield: 10, isYieldUp: true, recentHarvest: 6400, trendRecent: -3, isRecentUp: false, remaining: 5.0, remainingQty: 1500, ratio: 33 },
  },
  {
    id: "crop-4",
    name: "Bưởi da xanh",
    area: 9.6,
    quantity: 2880,
    company: "hoabinh",
    harvest: { totalYield: 21000, trendYield: 12, isYieldUp: true, recentHarvest: 4100, trendRecent: 5, isRecentUp: true, remaining: 3.2, remainingQty: 960, ratio: 33 },
  },
  {
    id: "crop-5",
    name: "Cà chua hữu cơ",
    area: 0.8,
    quantity: 240,
    company: "ecofarm",
    harvest: { totalYield: 4800, trendYield: 10, isYieldUp: true, recentHarvest: 1200, trendRecent: 6, isRecentUp: true, remaining: 0.3, remainingQty: 90, ratio: 37 },
  },
  {
    id: "crop-6",
    name: "Ớt chuông hữu cơ",
    area: 0.5,
    quantity: 150,
    company: "hoabinh",
    harvest: { totalYield: 3200, trendYield: -2, isYieldUp: false, recentHarvest: 800, trendRecent: 4, isRecentUp: true, remaining: 0.2, remainingQty: 60, ratio: 40 },
  },
];

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("vi-VN").format(val);
};

export const AdminHealthSection: React.FC<AdminHealthSectionProps> = ({ selectedEntity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const processedCrops = useMemo(() => {
    return cropItems
      // Filter by corporate entity if selected
      .filter((crop) => !selectedEntity || crop.company === selectedEntity.id)
      .map((crop) => {
        // Find matching plots for this crop type
        const matchingPlots = Object.entries(plotHealthMap)
          .filter(
            ([id, plot]) =>
              plot.cropName === crop.name &&
              (!selectedEntity || plot.company === selectedEntity.id)
          )
          .map(([id, plot]) => ({
            id,
            name: plotNameMap[id] || id,
            good: plot.good,
            treating: plot.treating,
            disease: plot.disease,
            harvesting: plot.harvesting,
            size: plot.size,
          }));

        // Calculate aggregated totals
        let good = 0;
        let treating = 0;
        let disease = 0;
        let harvesting = 0;

        matchingPlots.forEach((p) => {
          good += p.good;
          treating += p.treating;
          disease += p.disease;
          harvesting += p.harvesting;
        });

        return {
          ...crop,
          good,
          treating,
          disease,
          harvesting,
          chartData: matchingPlots,
        };
      })
      .filter((crop) => crop.chartData.length > 0)
      .filter((crop) => crop.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((crop) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "good") return crop.good > 0;
        if (statusFilter === "treating") return crop.treating > 0;
        if (statusFilter === "disease") return crop.disease > 0;
        if (statusFilter === "harvesting") return crop.harvesting > 0;
        return true;
      });
  }, [selectedEntity, searchQuery, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const getCropUnitMode = (cropId: string): "area" | "qty" => {
    if (cropId === "crop-5" || cropId === "crop-6") {
      return "area";
    }
    return "qty";
  };

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardContent className="p-5 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Sprout className="w-4.5 h-4.5 text-emerald-600" />
            <span>Danh sách cây trồng chính</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên cây trồng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white h-9 font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full text-xs bg-white border border-slate-100 rounded-lg h-9">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="good">Lô đạt chuẩn (Tốt)</SelectItem>
                  <SelectItem value="treating">Đang điều trị bệnh</SelectItem>
                  <SelectItem value="disease">Phát hiện sâu bệnh</SelectItem>
                  <SelectItem value="harvesting">Đang thu hoạch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Crops Grid */}
        {processedCrops.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <XCircle className="w-12 h-12 text-slate-300 animate-bounce" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy cây trồng
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Không tìm thấy loại cây trồng nào khớp với từ khóa tìm kiếm hoặc bộ lọc trạng thái.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold bg-slate-200/80 hover:bg-slate-200 text-slate-750 rounded-lg cursor-pointer transition-all shadow-xs"
            >
              Thiết lập lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {processedCrops.map((crop) => {
              const mode = getCropUnitMode(crop.id);
              const harvest = crop.harvest;

              return (
                <Card
                  key={crop.id}
                  className="border border-slate-100 hover:border-slate-200 transition-all shadow-xs bg-white flex flex-col justify-between rounded-xl"
                >
                  <CardHeader className="pb-3 border-b border-slate-50 p-5 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-slate-800">
                          {crop.name}
                        </CardTitle>
                        <p className="text-xs text-slate-400 font-medium">
                          Quy mô quản lý ({crop.company === "ecofarm" ? "EcoFarm" : "Hòa Bình"})
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
                        {mode === "area"
                          ? `${crop.area} ha`
                          : `${formatNumber(crop.quantity)} cây`}
                      </span>
                    </div>

                    {/* Sức khỏe cây trồng Grouped Bar Chart */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-650">
                        <span>Sức khỏe cây trồng</span>
                        <span>{crop.chartData.length} lô đang trồng</span>
                      </div>
                      <div className="h-28 w-full bg-slate-50/30 rounded-lg p-2 border border-slate-100 overflow-x-auto scrollbar-thin">
                        <div style={{ minWidth: crop.chartData.length * 80 > 350 ? `${crop.chartData.length * 80}px` : "100%", height: "100%" }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={crop.chartData}
                              margin={{
                                top: 5,
                                right: 10,
                                left: -25,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
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
                                labelFormatter={(label, items) => {
                                  return items?.[0]?.payload?.name || label;
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

                    {/* Sub status details legended values */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-150/40">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">Tốt ({crop.good})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">Xử lý ({crop.treating})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="truncate">Bệnh ({crop.disease})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                        <span className="truncate">Thu hoạch ({crop.harvesting})</span>
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
                              {formatNumber(harvest.totalYield)} kg
                            </span>
                            <span
                              className={`flex items-center text-xs font-bold ${
                                harvest.isYieldUp ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {harvest.isYieldUp ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                              )}
                              <span>{harvest.trendYield}%</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Sản lượng thu hoạch gần nhất
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold text-slate-800 font-mono">
                              {formatNumber(harvest.recentHarvest)} kg
                            </span>
                            <span
                              className={`flex items-center text-xs font-bold ${
                                harvest.isRecentUp ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {harvest.isRecentUp ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                              )}
                              <span>{harvest.trendRecent}%</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <span className="text-slate-500 font-semibold">
                          Diện tích chờ thu hoạch:
                        </span>
                        <span className="font-extrabold text-slate-700">
                          {mode === "area"
                            ? `${harvest.remaining} ha`
                            : `${formatNumber(harvest.remainingQty)} cây`}{" "}
                          <span className="text-slate-400 font-normal">
                            ({harvest.ratio}% tổng diện tích canh tác)
                          </span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
