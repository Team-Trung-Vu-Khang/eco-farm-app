import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Search,
  Calendar,
  Info,
  TrendingUp,
  TrendingDown,
  User,
  ExternalLink,
  ShieldCheck,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// Mock Nông hộ profiles
const farmerProfiles = [
  { id: "f-1", name: "Hợp tác xã Sầu riêng Monthon Phong Điền", activeDate: "2026-03-12", updatesCount: 54, location: "Cần Thơ", status: "Active" },
  { id: "f-2", name: "Nông hộ Nguyễn Văn A", activeDate: "2026-04-05", updatesCount: 42, location: "Bến Tre", status: "Active" },
  { id: "f-3", name: "Nông hộ Trần Thị B", activeDate: "2026-04-20", updatesCount: 38, location: "Vĩnh Long", status: "Active" },
  { id: "f-4", name: "Hợp tác xã Mít Thái Bình Minh", activeDate: "2026-05-01", updatesCount: 61, location: "Vĩnh Long", status: "Active" },
  { id: "f-5", name: "Nông hộ Lê Văn C", activeDate: "2026-05-15", updatesCount: 22, location: "Tiền Giang", status: "Inactive" },
  { id: "f-6", name: "Nông hộ Phạm Văn D", activeDate: "2026-06-10", updatesCount: 15, location: "Đồng Tháp", status: "Active" },
];

// Mock database for environmental chemical consumption
const chemicalConsumptionData: Record<
  string,
  Record<string, { month: string; amount: number }[]>
> = {
  fertilizer: {
    all: [
      { month: "T5", amount: 1200 },
      { month: "T6", amount: 1400 },
      { month: "T7", amount: 1100 },
      { month: "T8", amount: 950 },
      { month: "T9", amount: 1300 }, // Increase -> Up -> Red
    ],
    npk: [
      { month: "T5", amount: 800 },
      { month: "T6", amount: 900 },
      { month: "T7", amount: 700 },
      { month: "T8", amount: 600 },
      { month: "T9", amount: 500 }, // Decrease -> Down -> Green
    ],
    ure: [
      { month: "T5", amount: 300 },
      { month: "T6", amount: 400 },
      { month: "T7", amount: 300 },
      { month: "T8", amount: 250 },
      { month: "T9", amount: 600 }, // Increase -> Up -> Red
    ],
  },
  pesticide: {
    all: [
      { month: "T5", amount: 150 },
      { month: "T6", amount: 180 },
      { month: "T7", amount: 140 },
      { month: "T8", amount: 130 },
      { month: "T9", amount: 95 }, // Decrease -> Down -> Green
    ],
    abamectin: [
      { month: "T5", amount: 60 },
      { month: "T6", amount: 80 },
      { month: "T7", amount: 50 },
      { month: "T8", amount: 40 },
      { month: "T9", amount: 45 }, // Increase -> Up -> Red
    ],
  },
  waste: {
    all: [
      { month: "T5", amount: 80 },
      { month: "T6", amount: 100 },
      { month: "T7", amount: 90 },
      { month: "T8", amount: 85 },
      { month: "T9", amount: 120 }, // Increase -> Up -> Red
    ],
    bottle: [
      { month: "T5", amount: 30 },
      { month: "T6", amount: 45 },
      { month: "T7", amount: 40 },
      { month: "T8", amount: 35 },
      { month: "T9", amount: 32 }, // Decrease -> Down -> Green
    ],
    package: [
      { month: "T5", amount: 50 },
      { month: "T6", amount: 55 },
      { month: "T7", amount: 50 },
      { month: "T8", amount: 50 },
      { month: "T9", amount: 88 }, // Increase -> Up -> Red
    ],
  },
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(140, 15%, 88%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export function AdminFarmerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [filteredFarmers, setFilteredFarmers] = useState(farmerProfiles);

  const [fertilizerFilter, setFertilizerFilter] = useState("all");
  const [pesticideFilter, setPesticideFilter] = useState("all");
  const [wasteFilter, setWasteFilter] = useState("all");

  const [activeHistoryFarmer, setActiveHistoryFarmer] = useState<string | null>(null);

  // Simulated search API
  useEffect(() => {
    const filtered = farmerProfiles.filter((f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFarmers(filtered);
  }, [searchTerm]);

  const getTrendData = (category: string, filter: string) => {
    const list = chemicalConsumptionData[category][filter] || [];
    if (list.length < 2) return { diff: 0, isIncrease: false, percent: "0" };
    const current = list[list.length - 1].amount;
    const prev = list[list.length - 2].amount;
    return {
      diff: current - prev,
      isIncrease: current > prev,
      percent: (((Math.abs(current - prev)) / prev) * 100).toFixed(0),
    };
  };

  const fertTrend = getTrendData("fertilizer", fertilizerFilter);
  const pestTrend = getTrendData("pesticide", pesticideFilter);
  const wasteTrend = getTrendData("waste", wasteFilter);

  return (
    <div className="space-y-6">
      {/* Global Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm Nông hộ / Đơn vị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-medium pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Tháng báo cáo:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Compliance Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compliance 1: Active units */}
        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Tỷ lệ Đơn vị Active trong tháng
              </CardTitle>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs font-medium leading-relaxed">
                    Đơn vị active: Cập nhật công việc ít nhất 2 lần/tháng và cập nhật sử dụng vật tư ít nhất 1 lần/tháng.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-3xl font-display font-bold text-slate-800">84.5%</p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-500 font-medium">5/6 Nông hộ đạt tiêu chuẩn</span>
              </div>
            </div>
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163.3"
                  strokeDashoffset="25.3" // 84.5% of 163.3 (2*pi*26)
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold font-mono text-emerald-600">84%</span>
            </div>
          </CardContent>
        </Card>

        {/* Compliance 2: Has visual evidence */}
        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Tỷ lệ hoạt động có bằng chứng thực hành
              </CardTitle>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs font-medium leading-relaxed">
                    Tỷ lệ nhật ký công việc được cập nhật đính kèm hình ảnh/video thực tế tại vùng trồng.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-3xl font-display font-bold text-slate-800">92.0%</p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-slate-500 font-medium">Báo cáo minh bạch, VietGAP chuẩn</span>
              </div>
            </div>
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163.3"
                  strokeDashoffset="13.1" // 92.0% of 163.3
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold font-mono text-blue-600">92%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tra cứu Nông hộ Section */}
      <Card className="bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            Danh sách Nông hộ & Đơn vị liên kết ({filteredFarmers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFarmers.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs text-slate-400">
                Không tìm thấy đơn vị nào khớp với từ khóa tìm kiếm.
              </div>
            ) : (
              filteredFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="p-4 rounded-xl border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all bg-slate-50/20 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 text-xs leading-relaxed line-clamp-2">
                        {farmer.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] shrink-0 font-bold ${
                          farmer.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {farmer.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-slate-600">
                      <span className="text-muted-foreground">Khu vực:</span>
                      <span className="font-medium text-right text-slate-700">{farmer.location}</span>
                      <span className="text-muted-foreground">Ngày hoạt động:</span>
                      <span className="font-mono text-right text-slate-700">{farmer.activeDate}</span>
                      <span className="text-muted-foreground">Số lần cập nhật:</span>
                      <span className="font-bold text-right text-emerald-600 font-mono">{farmer.updatesCount} lần</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold py-1.5 h-8 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    onClick={() => setActiveHistoryFarmer(farmer.name)}
                  >
                    Xem lịch sử nhật ký
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ Môi trường & Hóa chất */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Phân bón hóa học */}
        <Card className="bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xs font-bold text-slate-800">
                Sử dụng Phân bón Hóa chất
              </CardTitle>
              <div className="flex items-center gap-1">
                {fertTrend.isIncrease ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">Tăng +{fertTrend.percent}% (Xấu)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-500">Giảm -{fertTrend.percent}% (Tốt)</span>
                  </>
                )}
              </div>
            </div>
            <select
              value={fertilizerFilter}
              onChange={(e) => setFertilizerFilter(e.target.value)}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1 focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="all">Tất cả phân</option>
              <option value="npk">NPK 16-16-8</option>
              <option value="ure">Phân Ure</option>
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chemicalConsumptionData.fertilizer[fertilizerFilter] || []}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Khối lượng (kg)"
                    stroke={fertTrend.isIncrease ? "#ef4444" : "#10b981"}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Thuốc BVTV */}
        <Card className="bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xs font-bold text-slate-800">
                Sử dụng Thuốc BVTV
              </CardTitle>
              <div className="flex items-center gap-1">
                {pestTrend.isIncrease ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">Tăng +{pestTrend.percent}% (Xấu)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-500">Giảm -{pestTrend.percent}% (Tốt)</span>
                  </>
                )}
              </div>
            </div>
            <select
              value={pesticideFilter}
              onChange={(e) => setPesticideFilter(e.target.value)}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1 focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="all">Tất cả thuốc</option>
              <option value="abamectin">Abamectin</option>
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chemicalConsumptionData.pesticide[pesticideFilter] || []}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Khối lượng (kg)"
                    stroke={pestTrend.isIncrease ? "#ef4444" : "#10b981"}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Phụ phẩm & Chất thải */}
        <Card className="bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xs font-bold text-slate-800">
                Phụ phẩm & Chất thải
              </CardTitle>
              <div className="flex items-center gap-1">
                {wasteTrend.isIncrease ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">Tăng +{wasteTrend.percent}% (Xấu)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-500">Giảm -{wasteTrend.percent}% (Tốt)</span>
                  </>
                )}
              </div>
            </div>
            <select
              value={wasteFilter}
              onChange={(e) => setWasteFilter(e.target.value)}
              className="text-[10px] font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1 focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="all">Tất cả rác</option>
              <option value="bottle">Vỏ chai nhựa</option>
              <option value="package">Bao bì hóa chất</option>
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chemicalConsumptionData.waste[wasteFilter] || []}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 92%)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(140, 10%, 45%)" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar
                    dataKey="amount"
                    name="Khối lượng (kg)"
                    fill={wasteTrend.isIncrease ? "#ef4444" : "#10b981"}
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Log Dialog (Simulated Modal) */}
      {activeHistoryFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Lịch sử Nhật ký: {activeHistoryFarmer}
                </h3>
              </div>
              <button
                onClick={() => setActiveHistoryFarmer(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <p className="text-xs font-bold text-slate-700">Ngày 18/08/2026 - Bón phân gốc</p>
                <p className="text-xs text-slate-600">Sử dụng 50 kg phân hữu cơ hoai mục cho Lô A1. Đính kèm 1 ảnh bón phân gốc.</p>
                <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">VietGAP chuẩn</Badge>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <p className="text-xs font-bold text-slate-700">Ngày 15/08/2026 - Phun thuốc phòng bệnh</p>
                <p className="text-xs text-slate-600">Sử dụng 2 kg thuốc Bio-Shield ngừa nấm hồng thân cây. Có video phun xịt bằng drone.</p>
                <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700">Minh chứng Video</Badge>
              </div>
              <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                <p className="text-xs font-bold text-slate-700">Ngày 10/08/2026 - Cắt tỉa cành</p>
                <p className="text-xs text-slate-600">Cắt tỉa cành sâu hại tạo độ thoáng cho vườn sầu riêng. Thu gom 15kg cành lá bệnh đem tiêu hủy.</p>
                <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700">Xử lý tại chỗ</Badge>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button
                onClick={() => setActiveHistoryFarmer(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 h-9 cursor-pointer"
              >
                Đồng ý
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
