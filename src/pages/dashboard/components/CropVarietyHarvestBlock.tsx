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
  Alert,
  AlertTitle,
  AlertDescription,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  PieChart as PieChartIcon,
  Award,
  Sprout,
  MapPin,
  List,
  TrendingUp,
  Calendar,
  Loader2,
  ShieldAlert,
  Info,
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
  useAdminHarvestByVariant,
  useAdminHarvestByVariantDetail,
} from "@/features/farm/hooks/useAdminDashboard";

import dayjs from "dayjs";

const CURRENT_MONTH = dayjs().format("YYYY-MM");
const DEFAULT_FROM_MONTH = dayjs().subtract(11, "month").format("YYYY-MM");
const MONTH_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const month = dayjs().subtract(i, "month");
  return { value: month.format("YYYY-MM"), label: month.format("MM/YYYY") };
});

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

const DONUT_COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#94a3b8", // Slate for OTHER
];

function getMonthDiff(fromStr: string, toStr: string): number {
  const [fYear, fMonth] = fromStr.split("-").map(Number);
  const [tYear, tMonth] = toStr.split("-").map(Number);
  return (tYear - fYear) * 12 + (tMonth - fMonth) + 1;
}

function formatBucketLabel(bucketStart: string): string {
  if (!bucketStart) return "";
  const parts = bucketStart.split("-");
  if (parts.length >= 2) {
    return `T${parts[1]}/${parts[0].slice(2)}`;
  }
  return bucketStart;
}

export function CropVarietyHarvestBlock() {
  const [fromMonth, setFromMonth] = useState(DEFAULT_FROM_MONTH);
  const [toMonth, setToMonth] = useState(CURRENT_MONTH);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const [selectedVarietyCode, setSelectedVarietyCode] = useState<string>("");
  const [rightViewMode, setRightViewMode] = useState<"list" | "chart">("list");

  // Validate month range changes
  const handleFromMonthChange = (val: string) => {
    if (!val) return;
    const diff = getMonthDiff(val, toMonth);
    if (val > toMonth) {
      setRangeError("Tháng bắt đầu không được lớn hơn tháng kết thúc");
    } else if (diff > 60) {
      setRangeError("Khoảng thời gian chọn tối đa là 60 tháng");
    } else {
      setRangeError(null);
    }
    setFromMonth(val);
  };

  const handleToMonthChange = (val: string) => {
    if (!val) return;
    const diff = getMonthDiff(fromMonth, val);
    if (val > CURRENT_MONTH) {
      setRangeError("Tháng kết thúc không được ở tương lai");
    } else if (fromMonth > val) {
      setRangeError("Tháng kết thúc không được nhỏ hơn tháng bắt đầu");
    } else if (diff > 60) {
      setRangeError("Khoảng thời gian chọn tối đa là 60 tháng");
    } else {
      setRangeError(null);
    }
    setToMonth(val);
  };

  // 1. Fetch Harvest by Variant overview
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useAdminHarvestByVariant({
    domainCode: "CROP",
    fromMonth,
    toMonth,
    top: 5,
  });

  const isForbidden = (overviewError as any)?.response?.status === 403;

  // Filter items for variety selection dropdown (exclude OTHER or items with null variantCode)
  const selectableVariants = useMemo(() => {
    if (!overviewData?.items) return [];
    return overviewData.items.filter(
      (item) => item.variantCode && item.groupKey !== "OTHER",
    );
  }, [overviewData]);

  // Set default selected variety code when data arrives
  const activeVarietyCode =
    selectedVarietyCode || selectableVariants[0]?.variantCode || "";

  // 2. Fetch Harvest Detail for selected variety
  const { data: detailData, isLoading: isDetailLoading } =
    useAdminHarvestByVariantDetail(
      {
        variantCode: activeVarietyCode,
        domainCode: "CROP",
        fromMonth,
        toMonth,
        limit: 10,
      },
      Boolean(activeVarietyCode) && !rangeError,
    );

  // Transform monthly buckets for line chart view
  const chartData = useMemo(() => {
    if (!detailData?.topFarmers || detailData.topFarmers.length === 0)
      return [];

    // Get unique monthly bucket starts from the first farmer
    const firstFarmer = detailData.topFarmers[0];
    if (!firstFarmer.monthly) return [];

    return firstFarmer.monthly.map((mBucket) => {
      const row: Record<string, any> = {
        bucketStart: mBucket.bucketStart,
        monthLabel: formatBucketLabel(mBucket.bucketStart),
      };

      detailData.topFarmers.forEach((farmer) => {
        const bucketMatch = farmer.monthly.find(
          (b) => b.bucketStart === mBucket.bucketStart,
        );
        row[farmer.name] = bucketMatch ? bucketMatch.quantityTon : 0;
      });

      return row;
    });
  }, [detailData]);

  if (isForbidden) {
    return (
      <Alert
        variant="destructive"
        className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-4"
      >
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm text-amber-800">
            Không có quyền truy cập báo cáo Sản lượng theo Giống (403 Forbidden)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-700 mt-0.5">
            Tính năng này yêu cầu quyền Admin hệ thống (MEVI_ADMIN /
            MEVI_SUPER_ADMIN).
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  const items = overviewData?.items ?? [];
  const totalTon = overviewData?.totalTon ?? 0;
  const unresolvedCount = overviewData?.unresolvedCount ?? 0;
  const dataThrough = overviewData?.period?.dataThrough;

  return (
    <Card className="@container flex flex-col shadow-sm border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-3 @max-xl:px-3 @max-xl:pt-3 border-b border-slate-100 bg-slate-50/50 flex flex-col @xl:flex-row @xl:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 @max-xl:w-8 @max-xl:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <Sprout className="w-5 h-5 @max-xl:w-4 @max-xl:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="font-bold text-base @max-xl:text-sm text-slate-800 leading-tight">
                <span className="@xl:hidden">Sản lượng theo Giống</span>
                <span className="hidden @xl:inline">
                  Phân bổ Sản lượng Thu hoạch theo Giống cây trồng
                </span>
              </CardTitle>
              {dataThrough && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold bg-white text-slate-500 border-slate-200"
                >
                  Dữ liệu đến ngày {dataThrough}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 @max-xl:hidden">
              Thống kê sản lượng tổng thể toàn hệ thống cho Quản trị viên theo
              kỳ tháng
            </p>
          </div>
        </div>

        {/* Month Range Selector & Variety Selection Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 @max-xl:gap-2 shrink-0 @max-xl:w-full">
          {/* Month Range Picker (fromMonth - toMonth) */}
          <div className="hidden @xl:flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0" />
            <input
              type="month"
              value={fromMonth}
              max={CURRENT_MONTH}
              onChange={(e) => handleFromMonthChange(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-400 text-xs font-semibold px-0.5">
              –
            </span>
            <input
              type="month"
              value={toMonth}
              max={CURRENT_MONTH}
              onChange={(e) => handleToMonthChange(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Month Range Picker gọn cho màn hình hẹp */}
          <div className="grid w-full grid-cols-2 gap-2 @xl:hidden">
            {(
              [
                {
                  label: "Từ",
                  value: fromMonth,
                  onChange: handleFromMonthChange,
                },
                { label: "Đến", value: toMonth, onChange: handleToMonthChange },
              ] as const
            ).map((field) => (
              <Select
                key={field.label}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-9 w-full gap-1.5 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="font-medium text-slate-400">
                    {field.label}
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem
                      key={m.value}
                      value={m.value}
                      className="cursor-pointer text-xs font-medium"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Variety Dropdown */}
          {selectableVariants.length > 0 && (
            <Select
              value={activeVarietyCode}
              onValueChange={(val) => setSelectedVarietyCode(val)}
            >
              <SelectTrigger className="w-[220px] @max-xl:w-full text-xs font-bold text-emerald-800 bg-emerald-50 border-emerald-200 rounded-xl focus:ring-emerald-500 shadow-2xs">
                <SelectValue placeholder="Chọn giống cây" />
              </SelectTrigger>
              <SelectContent>
                {selectableVariants.map((v) => (
                  <SelectItem
                    key={v.variantCode || v.groupKey}
                    value={v.variantCode!}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {v.groupLabel} ({v.percentage}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      {rangeError && (
        <div className="mx-6 mt-3 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl font-medium flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-red-500" />
          <span>{rangeError}</span>
        </div>
      )}

      <CardContent className="pt-5 pb-6 @max-xl:px-3 @max-xl:pt-3 @max-xl:pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 @max-xl:gap-4 items-start">
          {/* LEFT COLUMN (lg:col-span-4): Crop Variety Donut Chart & Legend */}
          <div className="lg:col-span-4 bg-slate-50/60 p-3.5 @max-xl:p-3 rounded-2xl border border-slate-100 space-y-3.5 @max-xl:space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tỷ lệ sản lượng
                  <span className="hidden @xl:inline"> (% Tổng)</span>
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] bg-white font-semibold text-slate-600"
              >
                {items.length} Nhóm/Giống
              </Badge>
            </div>

            {/* Donut Chart Canvas */}
            <div className="h-[210px] @max-xl:h-[150px] w-full relative flex items-center justify-center">
              {isOverviewLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              ) : items.length === 0 ? (
                <div className="text-xs text-slate-400 font-medium">
                  Không có dữ liệu thu hoạch trong kỳ đã chọn
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={items}
                        cx="50%"
                        cy="50%"
                        innerRadius="48%"
                        outerRadius="82%"
                        paddingAngle={3}
                        dataKey="percentage"
                        onClick={(_, index) => {
                          const entry = items[index];
                          if (entry?.variantCode && entry.groupKey !== "OTHER") {
                            setSelectedVarietyCode(entry.variantCode);
                          }
                        }}
                        cursor="pointer"
                      >
                        {items.map((item, idx) => {
                          const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                          const isSelected =
                            item.variantCode === activeVarietyCode;
                          return (
                            <Cell
                              key={`variety-cell-${item.groupKey}`}
                              fill={color}
                              stroke={isSelected ? "#059669" : "#ffffff"}
                              strokeWidth={isSelected ? 3 : 1}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(
                          value: unknown,
                          _name: unknown,
                          props: any,
                        ) => {
                          const numVal =
                            typeof value === "number"
                              ? value
                              : Number(value) || 0;
                          const qty =
                            props?.payload?.quantityTon != null
                              ? Number(
                                  props.payload.quantityTon,
                                ).toLocaleString("vi-VN")
                              : "0";
                          const label = props?.payload?.groupLabel || "";
                          return [`${numVal}% (${qty} tấn)`, label];
                        }}
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
                      {totalTon.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                      tấn nông sản
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Variety Legend List */}
            <div className="space-y-1 max-h-[220px] overflow-y-auto p-0.5 text-xs">
              {items.map((item, idx) => {
                const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                const isSelected = item.variantCode === activeVarietyCode;
                const isClickable =
                  Boolean(item.variantCode) && item.groupKey !== "OTHER";

                return (
                  <button
                    type="button"
                    key={item.groupKey}
                    disabled={!isClickable}
                    onClick={() => {
                      if (isClickable)
                        setSelectedVarietyCode(item.variantCode!);
                    }}
                    className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm font-semibold ring-2 ring-emerald-600/30"
                        : isClickable
                          ? "hover:bg-slate-100 text-slate-700 bg-white/60 border border-slate-100 cursor-pointer"
                          : "text-slate-500 bg-slate-100/50 border border-slate-100 cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-200 shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="truncate text-[11px] font-medium leading-tight"
                        title={item.groupLabel}
                      >
                        {item.groupLabel}
                      </span>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1">
                      <span className="font-bold text-[11px]">
                        {item.quantityTon.toLocaleString("vi-VN")}t
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected
                            ? "text-emerald-100 font-normal"
                            : "text-slate-400"
                        }`}
                      >
                        ({item.percentage}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {unresolvedCount > 0 && (
              <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 p-2 rounded-lg font-medium">
                * Có <strong>{unresolvedCount}</strong> dòng rollup thu hoạch
                chưa quy đổi được đơn vị tấn (thiếu đơn vị đo lường/khối lượng).
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (lg:col-span-8): Top Farmers breakdown chart & list */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header info of selected variety */}
            {isDetailLoading ? (
              <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-6 text-center">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mx-auto" />
                <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
                  Đang tải thông tin chi tiết giống...
                </span>
              </div>
            ) : detailData ? (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col @xl:flex-row @xl:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2 py-0.5">
                      {detailData.variantCode}
                    </Badge>
                    <h3 className="text-sm font-bold text-slate-800">
                      {detailData.variantName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Tổng diện tích:{" "}
                    <span className="font-bold text-slate-800">
                      {detailData.totalAcreageHa != null
                        ? `${detailData.totalAcreageHa.toLocaleString("vi-VN")} ha`
                        : "—"}
                    </span>{" "}
                    <span className="text-[10px] text-slate-400 italic">
                      (* ước tính)
                    </span>{" "}
                    | Số nông hộ tham gia:{" "}
                    <span className="font-bold text-slate-800">
                      {detailData.participatingCount} hộ
                    </span>
                  </p>
                </div>

                <div className="bg-white px-3 py-2 rounded-xl border border-emerald-200/60 shadow-2xs shrink-0 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Sản lượng dòng giống
                  </p>
                  <p className="text-sm font-black text-emerald-600">
                    {detailData.quantityTon.toLocaleString("vi-VN")} tấn
                  </p>
                </div>
              </div>
            ) : null}

            {/* Top Farmers Ranking / Growth Chart Section */}
            <div className="space-y-2">
              <div className="flex flex-col @xl:flex-row @xl:items-center justify-between gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pb-1">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>
                    {rightViewMode === "list"
                      ? "Xếp hạng Top Nông hộ dẫn đầu sản lượng"
                      : `Tăng trưởng Sản lượng (${fromMonth} đến ${toMonth})`}
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
                    title="Xem biểu đồ đường theo tháng"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Biểu đồ tháng</span>
                  </button>
                </div>
              </div>

              {!detailData?.topFarmers || detailData.topFarmers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Chưa có thông tin thu hoạch cho giống cây này trong kỳ đã
                  chọn.
                </div>
              ) : rightViewMode === "list" ? (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {detailData.topFarmers.map((farmer) => {
                    const isTop1 = farmer.rank === 1;
                    const isTop2 = farmer.rank === 2;
                    const isTop3 = farmer.rank === 3;

                    const areaStr =
                      farmer.acreageHa != null ? `${farmer.acreageHa} ha` : "—";

                    const yieldStr =
                      farmer.yieldTonPerHa != null
                        ? `${farmer.yieldTonPerHa} tấn/ha`
                        : "—";

                    return (
                      <div
                        key={farmer.workspaceId}
                        className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-xl px-3.5 py-2.5 shadow-2xs transition-all flex flex-col @xl:flex-row @xl:items-center justify-between gap-2.5 hover:shadow-xs"
                      >
                        {/* Left Info */}
                        <div className="flex items-center gap-3 min-w-0">
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
                              {farmer.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                              {farmer.province && (
                                <>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    {farmer.province}
                                  </span>
                                  <span>•</span>
                                </>
                              )}
                              <span>Diện tích: {areaStr}</span>
                              <span>•</span>
                              <span className="text-slate-600 font-medium">
                                Năng suất: {yieldStr}{" "}
                                <span className="text-[10px] text-slate-400 italic">
                                  (* ước tính)
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Info */}
                        <div className="text-right shrink-0 flex items-center @xl:flex-col @xl:items-end justify-between @xl:justify-center gap-1 pt-1.5 @xl:pt-0">
                          <div className="text-xs font-black text-slate-900">
                            {farmer.quantityTon.toLocaleString("vi-VN")}t{" "}
                            <span className="text-[10px] font-medium text-slate-400">
                              ({farmer.percentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Line Chart View for Monthly Growth Comparison */
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pb-1 border-b border-slate-100">
                    <span>So sánh sản lượng thu hoạch theo tháng (Tấn)</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      Top {detailData.topFarmers.length} Nông hộ / HTX
                    </span>
                  </div>
                  <div className="h-[340px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="monthLabel"
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
                          formatter={(val: unknown, name: unknown) => {
                            const numVal =
                              typeof val === "number" ? val : Number(val) || 0;
                            return [
                              `${numVal.toLocaleString("vi-VN")} tấn`,
                              String(name ?? ""),
                            ];
                          }}
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
                        {detailData.topFarmers.map((farmer, fIdx) => (
                          <Line
                            key={farmer.workspaceId}
                            type="monotone"
                            dataKey={farmer.name}
                            name={farmer.name}
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
