import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  PieChart as PieChartIcon,
  Award,
  Sprout,
  MapPin,
  List,
  TrendingUp,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  cropVarietyHarvestShare,
  topFarmersByVarietyData,
  type CropVarietyHarvestItem,
  type TopFarmerHarvestItem,
} from "../constants";

const MONTHS_12 = [
  "T10/25",
  "T11/25",
  "T12/25",
  "T01/26",
  "T02/26",
  "T03/26",
  "T04/26",
  "T05/26",
  "T06/26",
  "T07/26",
  "T08/26",
  "T09/26",
];

const LINE_COLORS = [
  "#f59e0b", // Amber (Top 1)
  "#059669", // Emerald (Top 2)
  "#2563eb", // Blue (Top 3)
  "#8b5cf6", // Purple (Top 4)
  "#ec4899", // Pink (Top 5)
  "#06b6d4", // Cyan (Top 6)
  "#f97316", // Orange (Top 7)
  "#84cc16", // Lime (Top 8)
  "#6366f1", // Indigo (Top 9)
  "#64748b", // Slate (Top 10)
];

export function CropVarietyHarvestBlock() {
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>("st25");
  const [rightViewMode, setRightViewMode] = useState<"list" | "chart">("list");

  const selectedVariety: CropVarietyHarvestItem =
    cropVarietyHarvestShare.find((v) => v.id === selectedVarietyId) ||
    cropVarietyHarvestShare[0];

  const topFarmersList: TopFarmerHarvestItem[] =
    topFarmersByVarietyData[selectedVarietyId] || [];

  const topFarmersForChart = useMemo(() => {
    return topFarmersList.slice(0, 10);
  }, [topFarmersList]);

  const chart12MData = useMemo(() => {
    return MONTHS_12.map((m, mIdx) => {
      const row: Record<string, any> = { month: m };
      topFarmersForChart.forEach((farmer, fIdx) => {
        const base = farmer.yieldTons / 12;
        const sineWave =
          Math.sin(((mIdx + fIdx * 2.5) / 12) * Math.PI * 2) * 0.4;
        const trend = (mIdx / 12) * 0.25;
        const val = Math.max(1, Math.round(base * (1 + sineWave + trend)));
        row[farmer.farmerName] = val;
      });
      return row;
    });
  }, [topFarmersForChart]);

  return (
    <Card className="flex flex-col shadow-sm border-slate-200/80 rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-bold text-base text-slate-800 leading-tight">
              Phân bổ Sản lượng Thu hoạch theo Giống cây trồng
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Thống kê tổng thể cho Quản trị viên &amp; Hợp tác xã theo từng
              giống cây
            </p>
          </div>
        </div>

        {/* Selected Crop Variety Badge / Dropdown using Library Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Chọn giống cây:
          </span>
          <Select
            value={selectedVarietyId}
            onValueChange={(val) => setSelectedVarietyId(val)}
          >
            <SelectTrigger className="w-[260px] text-xs font-bold text-emerald-800 bg-emerald-50 border-emerald-200 rounded-xl focus:ring-emerald-500 shadow-2xs">
              <SelectValue placeholder="Chọn giống cây" />
            </SelectTrigger>
            <SelectContent>
              {cropVarietyHarvestShare.map((v) => (
                <SelectItem
                  key={v.id}
                  value={v.id}
                  className="text-xs font-medium"
                >
                  {v.name} ({v.sharePercent}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (lg:col-span-4): Crop Variety Donut Chart & Legend */}
          <div className="lg:col-span-4 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tỷ lệ sản lượng (% Tổng)
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] bg-white font-semibold text-slate-600"
              >
                6 Giống chính
              </Badge>
            </div>

            {/* Donut Chart Canvas */}
            <div className="h-[210px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropVarietyHarvestShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={86}
                    paddingAngle={3}
                    dataKey="sharePercent"
                    onClick={(entry) => setSelectedVarietyId(entry.id)}
                    cursor="pointer"
                  >
                    {cropVarietyHarvestShare.map((item) => (
                      <Cell
                        key={`variety-cell-${item.id}`}
                        fill={item.color}
                        stroke={
                          item.id === selectedVarietyId ? "#059669" : "#ffffff"
                        }
                        strokeWidth={item.id === selectedVarietyId ? 3 : 1}
                        style={{
                          filter:
                            item.id === selectedVarietyId
                              ? "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))"
                              : "none",
                          transform:
                            item.id === selectedVarietyId
                              ? "scale(1.04)"
                              : "scale(1)",
                          transformOrigin: "center center",
                          transition: "all 0.2s ease-in-out",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: any) => [
                      `${value}% (${props.payload.totalYieldTons} tấn - ${props.payload.totalAreaHa} ha)`,
                      props.payload.name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Overlay Stats */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tổng sản lượng
                </span>
                <span className="text-base font-black text-slate-800 leading-none mt-0.5">
                  3.560
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                  tấn nông sản
                </span>
              </div>
            </div>

            {/* Variety Legend List */}
            <div className="space-y-1 max-h-[220px] overflow-y-auto p-0.5 text-xs">
              {cropVarietyHarvestShare.map((item) => {
                const isSelected = item.id === selectedVarietyId;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedVarietyId(item.id)}
                    className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm font-semibold ring-2 ring-emerald-600/30"
                        : "hover:bg-slate-100 text-slate-700 bg-white/60 border border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                      {isSelected ? (
                        <span className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center bg-white shadow-xs">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </span>
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-200 shadow-2xs"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <span
                        className="truncate text-[11px] font-medium leading-tight"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1">
                      <span className="font-bold text-[11px]">
                        {item.totalYieldTons}t
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected
                            ? "text-emerald-100 font-normal"
                            : "text-slate-400"
                        }`}
                      >
                        ({item.sharePercent}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-8): Top Farmers breakdown chart & list with View Switcher */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header info of selected variety */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2 py-0.5">
                    {selectedVariety.code}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-800">
                    {selectedVariety.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Tổng diện tích:{" "}
                  <span className="font-bold text-slate-800">
                    {selectedVariety.totalAreaHa} ha
                  </span>{" "}
                  | Số nông hộ tham gia:{" "}
                  <span className="font-bold text-slate-800">
                    {selectedVariety.totalFarmersCount} hộ
                  </span>
                </p>
              </div>

              <div className="bg-white px-3 py-2 rounded-xl border border-emerald-200/60 shadow-2xs shrink-0 text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sản lượng dòng giống
                </p>
                <p className="text-sm font-black text-emerald-600">
                  {selectedVariety.totalYieldTons.toLocaleString("vi-VN")} tấn
                </p>
              </div>
            </div>

            {/* Top Farmers Ranking / 12M Growth Chart Section */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pb-1">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>
                    {rightViewMode === "list"
                      ? "Xếp hạng Top Nông hộ dẫn đầu sản lượng"
                      : "Tăng trưởng Sản lượng (12 Tháng gần nhất)"}
                  </span>
                </div>

                {/* View Switcher Controls */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRightViewMode("list")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      rightViewMode === "list"
                        ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Xem dạng danh sách"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Danh sách</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightViewMode("chart")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      rightViewMode === "chart"
                        ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Xem biểu đồ đường 12 tháng"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Biểu đồ 12 tháng</span>
                  </button>
                </div>
              </div>

              {topFarmersList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Chưa có thông tin xếp hạng nông hộ cho giống cây này.
                </div>
              ) : rightViewMode === "list" ? (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {topFarmersList.map((farmer) => {
                    const isTop1 = farmer.rank === 1;
                    const isTop2 = farmer.rank === 2;
                    const isTop3 = farmer.rank === 3;
                    const yieldPerHa = (
                      farmer.yieldTons / farmer.areaHa
                    ).toFixed(1);

                    return (
                      <div
                        key={farmer.id}
                        className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-xl px-3.5 py-2.5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:shadow-xs"
                      >
                        {/* Left Info: Rank badge + Name + Location & Area & Productivity */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank Badge */}
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                              isTop1
                                ? "bg-amber-400 text-amber-950 border-amber-500 shadow-2xs"
                                : isTop2
                                  ? "bg-slate-200 text-slate-800 border-slate-300"
                                  : isTop3
                                    ? "bg-amber-700 text-amber-100 border-amber-800"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {farmer.rank}
                          </span>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                              {farmer.farmerName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {farmer.location}
                              </span>
                              <span>•</span>
                              <span>{farmer.areaHa} ha</span>
                              <span>•</span>
                              <span className="text-slate-600 font-medium">
                                Năng suất: {yieldPerHa} tấn/ha
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Info: Single total yield display + Contribution percent badge */}
                        <div className="text-right shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1 pt-1.5 sm:pt-0">
                          <div className="text-xs font-black text-slate-900">
                            {farmer.yieldTons}t{" "}
                            <span className="text-[10px] font-medium text-slate-400">
                              ({farmer.sharePercent}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Line Chart View for 12 Months Growth Comparison */
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pb-1 border-b border-slate-100">
                    <span>So sánh sản lượng hàng tháng (Tấn)</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      Top 10 Nông hộ / HTX
                    </span>
                  </div>
                  <div className="h-[340px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chart12MData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="#64748b"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          unit="t"
                        />
                        <Tooltip
                          wrapperStyle={{ zIndex: 1000 }}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
                            fontSize: "12px",
                            fontWeight: 600,
                            zIndex: 1000,
                          }}
                          formatter={(val: number, name: string) => [
                            `${val} tấn`,
                            name,
                          ]}
                        />
                        <Legend
                          align="center"
                          verticalAlign="bottom"
                          wrapperStyle={{ paddingTop: "10px", zIndex: 1 }}
                          iconType="circle"
                          formatter={(value: string) => (
                            <span className="text-[11px] font-semibold text-slate-700 ml-1 mr-2 truncate max-w-[150px] inline-block align-middle">
                              {value}
                            </span>
                          )}
                        />
                        {topFarmersForChart.map((farmer, fIdx) => (
                          <Line
                            key={farmer.id}
                            type="monotone"
                            dataKey={farmer.farmerName}
                            name={farmer.farmerName}
                            stroke={LINE_COLORS[fIdx % LINE_COLORS.length]}
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
