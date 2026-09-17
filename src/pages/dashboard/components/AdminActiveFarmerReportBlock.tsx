import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Award,
  Download,
  Info,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  FileCheck2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  top20ActiveFarmersData,
  inactiveFarmersData,
  type Top20ActiveFarmerItem,
} from "../constants";

const MONTH_OPTIONS = [
  { value: "2026-09", label: "Tháng 09/2026" },
  { value: "2026-08", label: "Tháng 08/2026" },
  { value: "2026-07", label: "Tháng 07/2026" },
  { value: "2026-06", label: "Tháng 06/2026" },
  { value: "2026-05", label: "Tháng 05/2026" },
  { value: "2026-04", label: "Tháng 04/2026" },
  { value: "2026-03", label: "Tháng 03/2026" },
  { value: "2026-02", label: "Tháng 02/2026" },
  { value: "2026-01", label: "Tháng 01/2026" },
  { value: "2025-12", label: "Tháng 12/2025" },
  { value: "2025-11", label: "Tháng 11/2025" },
  { value: "2025-10", label: "Tháng 10/2025" },
];

const ACTIVE_PIE_DATA = [
  { name: "Active (Đạt chuẩn)", value: 126, color: "#10b981" }, // Emerald
  { name: "Không Active (Chưa đạt)", value: 24, color: "#cbd5e1" }, // Slate
];

export function AdminActiveFarmerReportBlock() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  // CSV Exporter Helper Function
  const exportToCSV = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) return;
    const separator = ",";
    const keys = Object.keys(rows[0]);
    const csvContent =
      "\uFEFF" + // BOM for UTF-8 Excel support
      keys.join(separator) +
      "\n" +
      rows
        .map((row: any) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              cell = cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator),
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadActiveTop20 = () => {
    const formattedData = top20ActiveFarmersData.map((f) => ({
      "Xếp hạng": f.rank,
      "Mã Nông trại (Farm ID)": f.farmId,
      "Tên Nông hộ / HTX": f.farmerName,
      "Địa bàn": f.location,
      "Ngày hoạt động gần nhất": f.lastActiveDate,
      "Loại hoạt động chính": f.activityType,
      "Số lượt nhập nhật ký vật tư": f.validDiaryUpdatesCount,
      "Số ngày hoạt động": f.activeDaysCount,
      "Tần suất hoạt động": f.frequency,
      "Trạng thái": "Active (Đạt chuẩn)",
    }));
    exportToCSV("Danh_Sach_Top20_Nong_Ho_Active", formattedData);
  };

  const handleDownloadInactive = () => {
    const formattedData = inactiveFarmersData.map((f) => ({
      "Mã Nông trại (Farm ID)": f.farmId,
      "Tên Nông hộ / HTX": f.farmerName,
      "Địa bàn": f.location,
      "Số điện thoại liên hệ": f.phone,
      "Ngày cập nhật gần nhất": f.lastActiveDate,
      "Lý do chưa Active": f.reason,
      "Ghi chú cho đội Mevi":
        "Cần gọi điện đôn đốc nhập dữ liệu vật tư thực tế",
    }));
    exportToCSV("Danh_Sach_Nong_Ho_Chua_Active_Can_Thuc_Day", formattedData);
  };

  return (
    <Card className="shadow-sm border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          {/* Left Side: Title & Info + Month Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0 shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-bold text-base text-slate-800 leading-tight">
                    Báo cáo Tình hình Hoạt động Nông hộ (Active Farmers)
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger className="cursor-pointer inline-flex items-center">
                      <Info className="w-4 h-4 text-slate-400 hover:text-emerald-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-medium leading-relaxed bg-slate-900 text-white p-3 rounded-xl shadow-xl">
                      <p className="font-bold text-emerald-400 mb-1">
                        Quy chuẩn Nông hộ Active:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px]">
                        <li>
                          Có <strong>≥ 2 ngày</strong> hoạt động cập nhật khác
                          nhau trong tháng.
                        </li>
                        <li>
                          Có <strong>≥ 1 lần</strong> nhập dữ liệu thực tế (số
                          liệu sử dụng vật tư: phân bón, thuốc BVTV...).
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Theo dõi mức độ tuân thủ cập nhật nhật ký &amp; minh chứng vật
                  tư thực tế
                </p>
              </div>
            </div>

            {/* Month Selector sitting on the Left side */}
            <div className="shrink-0 sm:ml-1">
              <Select
                value={selectedMonth}
                onValueChange={(val) => setSelectedMonth(val)}
              >
                <SelectTrigger className="w-[170px] h-8 text-xs font-bold text-slate-700 bg-white border-slate-200 rounded-lg focus:ring-emerald-500 shadow-2xs gap-1.5 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem
                      key={m.value}
                      value={m.value}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Side: The 2 CSV Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 justify-start sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadActiveTop20}
              className="text-xs font-semibold h-8 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 text-slate-700 rounded-lg gap-1.5 cursor-pointer shadow-2xs"
              title="Tải về danh sách Top 20 Nông hộ Active (.CSV)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Tải Top 20 Active (.CSV)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInactive}
              className="text-xs font-semibold h-8 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-300 text-amber-800 rounded-lg gap-1.5 cursor-pointer shadow-2xs"
              title="Tải về danh sách Nông hộ chưa Active để đội Mevi đôn đốc (.CSV)"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Tải DS Inactive (.CSV)</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (lg:col-span-4): Donut Chart & Active Standards */}
          <div className="lg:col-span-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tỷ lệ Active{" "}
                {MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label ||
                  `Tháng ${selectedMonth}`}
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                84.0% Active
              </Badge>
            </div>

            {/* Donut Chart Canvas */}
            <div className="h-[200px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ACTIVE_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={84}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ACTIVE_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-active-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: number, name: string) => [
                      `${val} Hộ (${((val / 150) * 100).toFixed(1)}%)`,
                      name,
                    ]}
                    wrapperStyle={{ zIndex: 1000 }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      fontWeight: 600,
                      zIndex: 1000,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tổng nông hộ
                </span>
                <span className="text-xl font-black text-slate-800 leading-none mt-0.5">
                  150
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                  đơn vị giám sát
                </span>
              </div>
            </div>

            {/* Active Rule Breakdown Info Card */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold border-b border-slate-100 pb-1.5">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active đạt chuẩn
                </span>
                <span className="font-bold text-slate-900">126 hộ (84%)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Chưa Active
                </span>
                <span className="font-bold text-amber-700">24 hộ (16%)</span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg">
                💡 <strong>Điều kiện Active:</strong> ≥ 2 ngày hoạt động/tháng
                &amp; ≥ 1 lần nhập số liệu vật tư thực tế.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-8): Top 20 Active Farmers List & Details */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Xếp hạng Top 20 Nông hộ Active nhất trong tháng</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                20 Hộ dẫn đầu
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {top20ActiveFarmersData.map((farmer: Top20ActiveFarmerItem) => {
                const isTop1 = farmer.rank === 1;
                const isTop2 = farmer.rank === 2;
                const isTop3 = farmer.rank === 3;

                return (
                  <div
                    key={farmer.id}
                    className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-xl p-3 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs"
                  >
                    {/* Left: Rank & Farm ID & Name & Location & Last Active Date & Activity */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Rank Badge */}
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border mt-0.5 ${
                          isTop1
                            ? "bg-amber-400 text-amber-950 border-amber-500 shadow-2xs"
                            : isTop2
                              ? "bg-slate-200 text-slate-800 border-slate-300"
                              : isTop3
                                ? "bg-amber-700 text-amber-100 border-amber-800"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {farmer.rank}
                      </span>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                            {farmer.farmId}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                            {farmer.farmerName}
                          </h4>
                          <span className="flex items-center gap-0.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {farmer.location}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium">
                          <span>
                            Hoạt động gần nhất:{" "}
                            <strong className="text-slate-800 font-mono">
                              {farmer.lastActiveDate}
                            </strong>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold truncate max-w-[240px]">
                            {farmer.activityType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Stats: Required 3 fields (Valid diary updates, Active days, Frequency) */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-right">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs font-black text-slate-800 justify-end">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {farmer.validDiaryUpdatesCount} lần nhật ký
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          <strong className="text-slate-700">
                            {farmer.activeDaysCount} ngày
                          </strong>{" "}
                          hoạt động ({farmer.frequency})
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
