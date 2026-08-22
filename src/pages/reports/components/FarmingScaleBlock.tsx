import { useState, useEffect, useMemo, useCallback } from "react";
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
  TrendingUp,
  TrendingDown,
  Sprout,
  Map,
  Grid,
  Search,
  XCircle,
} from "lucide-react";
import { mockGeneralStats, mockCrops } from "../constants/mockReportData";

export function FarmingScaleBlock() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State to manage unit for each crop card: "area" (ha) or "qty" (cây)
  const [unitMode, setUnitMode] = useState<Record<string, "area" | "qty">>(
    mockCrops.reduce((acc, c) => ({ ...acc, [c.id]: "area" }), {}),
  );

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Unit toggle handler (Callback optimized)
  const toggleUnit = useCallback((id: string, mode: "area" | "qty") => {
    setUnitMode((prev) => ({ ...prev, [id]: mode }));
  }, []);

  // Search input change handler (Callback optimized)
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  // Reset filters (Callback optimized)
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
  }, []);

  // Filter crops list (Memoized)
  const filteredCrops = useMemo(() => {
    return mockCrops.filter((crop) => {
      // 1. Filter by search query
      const matchesSearch = crop.name
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Filter by status
      if (statusFilter === "all") return true;
      if (statusFilter === "good") return crop.status.good > 0;
      if (statusFilter === "treating") return crop.status.treating > 0;
      if (statusFilter === "disease") return crop.status.disease > 0;
      if (statusFilter === "harvesting") return crop.status.harvesting > 0;

      return true;
    });
  }, [debouncedQuery, statusFilter]);

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Thống kê quy mô chung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ theo vùng trồng
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {mockGeneralStats.regionsCount}
              </p>
              <p className="text-xs text-slate-550 font-medium">
                Vùng canh tác trọng điểm
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Map className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ khu vực
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {mockGeneralStats.areasCount}
              </p>
              <p className="text-xs text-slate-550 font-medium">
                Phân khu chức năng
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Grid className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Phân bổ lô
              </p>
              <p className="text-3xl font-display font-extrabold text-slate-800">
                {mockGeneralStats.plotsCount}
              </p>
              <p className="text-xs text-slate-550 font-medium">
                Đơn vị canh tác nhỏ nhất
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Sprout className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crops Section */}
      <div className="space-y-4">
        {/* Header & Crop Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Danh sách cây trồng chính</span>
          </h3>

          {/* Crop Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px]">
            {/* Search Input using standard HTML input for absolute reliability */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên cây trồng..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-sm font-semibold pl-9 pr-4 py-2 border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white h-9"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full text-xs bg-white border border-slate-205 rounded-lg h-9">
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

        {/* Crops List (Empty State or Responsive Grid) */}
        {filteredCrops.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <XCircle className="w-12 h-12 text-slate-350 animate-bounce" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-700">
                Không tìm thấy cây trồng
              </p>
              <p className="text-sm text-slate-400 max-w-sm">
                Không tìm thấy loại cây trồng nào khớp với từ khóa tìm kiếm hoặc
                bộ lọc trạng thái của bạn.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold bg-slate-200/80 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-all shadow-xs"
            >
              Thiết lập lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCrops.map((crop) => {
              const mode = unitMode[crop.id] || "area";
              const status = crop.status;
              const harvest = crop.harvest;

              return (
                <Card
                  key={crop.id}
                  className="border border-slate-100 hover:border-slate-200 transition-all shadow-xs bg-white flex flex-col justify-between"
                >
                  {/* Card Header */}
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
                          Quy mô quản lý
                        </p>
                      </div>
                    </div>

                    {/* Switch unit Mode */}
                    <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-150 shrink-0">
                      <button
                        onClick={() => toggleUnit(crop.id, "area")}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          mode === "area"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Diện tích (ha)
                      </button>
                      <button
                        onClick={() => toggleUnit(crop.id, "qty")}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          mode === "qty"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Số lượng (cây)
                      </button>
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="p-5 space-y-5">
                    {/* Số liệu quy mô chính */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-slate-500 font-medium">
                        Diện tích canh tác
                      </span>
                      <span className="text-2xl font-display font-extrabold text-slate-850">
                        {mode === "area"
                          ? `${crop.area} ha`
                          : `${formatNumber(crop.quantity)} cây`}
                      </span>
                    </div>

                    {/* Sức khỏe cây trồng */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Sức khỏe cây trồng</span>
                        <span>{status.total} lô tổng</span>
                      </div>

                      {/* Progress bar phân khúc màu sắc */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${(status.good / status.total) * 100}%`,
                          }}
                          className="bg-emerald-500 h-full border-r-2 border-white last:border-r-0"
                          title="Tốt"
                        />
                        <div
                          style={{
                            width: `${(status.treating / status.total) * 100}%`,
                          }}
                          className="bg-amber-400 h-full border-r-2 border-white last:border-r-0"
                          title="Đang điều trị"
                        />
                        <div
                          style={{
                            width: `${(status.disease / status.total) * 100}%`,
                          }}
                          className="bg-rose-500 h-full border-r-2 border-white last:border-r-0"
                          title="Phát hiện sâu bệnh"
                        />
                        <div
                          style={{
                            width: `${(status.harvesting / status.total) * 100}%`,
                          }}
                          className="bg-sky-500 h-full border-r-2 border-white last:border-r-0"
                          title="Đang thu hoạch"
                        />
                      </div>

                      {/* Chú thích màu sắc */}
                      <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-slate-500">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">Tốt ({status.good})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">
                            Đang xử lý bệnh hại ({status.treating})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="truncate">
                            Chờ xử lý bệnh hại ({status.disease})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                          <span className="truncate">
                            Thu hoạch ({status.harvesting})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Năng suất & Thu hoạch */}
                    <div className="border-t border-slate-50 pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Tổng sản lượng */}
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
                                harvest.isYieldUp
                                  ? "text-emerald-600"
                                  : "text-rose-600"
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

                        {/* Thu hoạch gần nhất */}
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
                                harvest.isRecentUp
                                  ? "text-emerald-600"
                                  : "text-rose-600"
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

                      {/* Quy mô còn lại */}
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
      </div>
    </div>
  );
}
