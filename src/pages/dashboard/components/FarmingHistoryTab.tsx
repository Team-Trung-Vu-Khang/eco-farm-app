import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Workflow,
  ClipboardList,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  farmingProgress,
  realtimeStatus,
  weeklyTaskTrend,
} from "../constants";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(140, 15%, 88%)",
  borderRadius: "8px",
  fontSize: "12px",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Mock database for plans material consumption (API simulation)
const planConsumptionDatabase: Record<
  string,
  {
    planName: string;
    details: {
      category: string;
      field: string;
      value: string;
      items: string[];
    }[];
  }
> = {
  "plan-1": {
    planName: "Kế hoạch Bón phân Sầu riêng Ri6 - Đợt 3 (Khu vực B1)",
    details: [
      { category: "Thuốc BVTV (kg)", field: "pesticide", value: "0 kg", items: ["Không sử dụng"] },
      {
        category: "Phân bón (kg)",
        field: "fertilizer",
        value: "800 kg",
        items: [
          "Phân bón NPK 16-16-8 Đầu Trâu: 500 kg (Bón gốc)",
          "Phân hữu cơ hoai mục: 300 kg (Bón bổ sung dinh dưỡng)",
        ],
      },
      { category: "Máy móc (ngày)", field: "machinery", value: "3 ngày", items: ["Máy kéo Kubota: 2 ngày", "Máy phun phân bón tự hành: 1 ngày"] },
      { category: "Vật tư khác", field: "others", value: "15 bao / sọt", items: ["Bao tải chứa phân bón: 15 cái", "Dụng cụ xới đất mini: 5 bộ"] },
    ],
  },
  "plan-2": {
    planName: "Kế hoạch Phun thuốc BVTV Sầu Riêng Dona - Đợt 2 (Khu vực C1)",
    details: [
      {
        category: "Thuốc BVTV (kg)",
        field: "pesticide",
        value: "65 kg",
        items: [
          "Thuốc trừ bệnh sinh học Bio-Shield: 40 kg (Phun phòng ngừa thối thân)",
          "Thuốc diệt côn trùng thảo mộc Pest-Guard: 25 kg (Trị rầy phấn trắng)",
        ],
      },
      { category: "Phân bón (kg)", field: "fertilizer", value: "0 kg", items: ["Không sử dụng"] },
      { category: "Máy móc (ngày)", field: "machinery", value: "5 ngày", items: ["Máy phun thuốc hạt siêu mịn (UAV drone): 2 ngày", "Bình phun thuốc áp lực cao: 3 ngày"] },
      { category: "Vật tư khác", field: "others", value: "12 chai", items: ["Chai nhựa chứa dung dịch pha: 12 cái", "Đồ bảo hộ phun thuốc: 5 bộ"] },
    ],
  },
  "plan-3": {
    planName: "Kế hoạch Cải tạo đất Vùng C2 (Khu vực C2)",
    details: [
      { category: "Thuốc BVTV (kg)", field: "pesticide", value: "0 kg", items: ["Không sử dụng"] },
      {
        category: "Phân bón (kg)",
        field: "fertilizer",
        value: "1,500 kg",
        items: [
          "Vôi bột khử chua, hạ phèn: 500 kg (Rải đều bề mặt đất)",
          "Phân hữu cơ vi sinh sinh học Trichoderma: 1,000 kg (Cày lật trộn đều)",
        ],
      },
      { category: "Máy móc (ngày)", field: "machinery", value: "8 ngày", items: ["Máy cày xới đất công nghiệp: 5 ngày", "Xe lu nén đất nhẹ: 3 ngày"] },
      { category: "Vật tư khác", field: "others", value: "30 bao", items: ["Bạt phủ giữ ẩm nylon: 10 cuộn (100m/cuộn)", "Bao tải đựng mùn cưa: 20 bao"] },
    ],
  },
  "plan-4": {
    planName: "Kế hoạch Thu hoạch Sầu Riêng Monthon - Đợt 1 (Khu vực A1)",
    details: [
      { category: "Thuốc BVTV (kg)", field: "pesticide", value: "0 kg", items: ["Không sử dụng"] },
      { category: "Phân bón (kg)", field: "fertilizer", value: "0 kg", items: ["Không sử dụng"] },
      { category: "Máy móc (ngày)", field: "machinery", value: "12 ngày", items: ["Xe tải vận chuyển nông sản 2.5 tấn: 4 ngày", "Thiết bị đo độ chín bằng hồng ngoại: 8 ngày"] },
      { category: "Vật tư khác", field: "others", value: "200 sọt", items: ["Sọt nhựa chứa sầu riêng VietGAP: 150 cái", "Găng tay bảo hộ thu hoạch: 30 đôi", "Tem nhãn truy xuất nguồn gốc QR: 2,000 chiếc"] },
    ],
  },
};

interface FarmingHistoryTabProps {
  farmingFilter?: {
    selectedPlots: string[];
    dateFrom: string;
    dateTo: string;
  };
}

const planList = [
  { id: "plan-1", name: "Kế hoạch Bón phân Sầu riêng Ri6 - Đợt 3 (Khu vực B1)", category: "fertilizer", categoryLabel: "Bón phân", date: "Tháng 8, 2026" },
  { id: "plan-2", name: "Kế hoạch Phun thuốc BVTV Sầu Riêng Dona - Đợt 2 (Khu vực C1)", category: "pesticide", categoryLabel: "Phun thuốc", date: "Tháng 8, 2026" },
  { id: "plan-3", name: "Kế hoạch Cải tạo đất Vùng C2 (Khu vực C2)", category: "soil", categoryLabel: "Cải tạo đất", date: "Tháng 8, 2026" },
  { id: "plan-4", name: "Kế hoạch Thu hoạch Sầu Riêng Monthon - Đợt 1 (Khu vực A1)", category: "harvest", categoryLabel: "Thu hoạch", date: "Tháng 8, 2026" },
];

export function FarmingHistoryTab({ farmingFilter }: FarmingHistoryTabProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("plan-1");
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(planConsumptionDatabase["plan-1"]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "fertilizer": true,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSearch, setDialogSearch] = useState("");
  const [dialogCategory, setDialogCategory] = useState("all");
  const [tempSelectedPlanId, setTempSelectedPlanId] = useState("plan-1");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPlanData(planConsumptionDatabase[selectedPlanId]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedPlanId]);

  const toggleAccordion = (field: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const daysSince = realtimeStatus.daysSinceUpdate;
  const isStale = daysSince > 0;
  const staleColor =
    daysSince > 3
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const staleIconColor = daysSince > 3 ? "text-red-600" : "text-amber-600";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Trạng thái cập nhật Real-time
            </CardTitle>
            {isStale && (
              <Badge
                variant="outline"
                className={`text-xs ${staleColor}`}
              >
                <AlertTriangle className={`mr-1 h-3 w-3 ${staleIconColor}`} />
                Đã {daysSince} ngày chưa cập nhật
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Cập nhật lần cuối:{" "}
              <span className="font-medium text-foreground">
                {formatDateTime(realtimeStatus.lastUpdated)}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Công việc hoàn thành gần nhất
              </div>
              <p className="text-sm font-medium">
                {realtimeStatus.lastCompletedTask}
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Công việc phát sinh gần nhất
              </div>
              <p className="text-sm font-medium">
                {realtimeStatus.lastCreatedTask}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Tiến độ canh tác
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {farmingProgress.workflows.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {farmingProgress.workflows.total}
                </span>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  Xem sơ đồ <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
              <span>
                Hoàn thành:{" "}
                <span className="font-medium text-green-500">
                  {farmingProgress.workflows.completed}
                </span>
              </span>
              <span>•</span>
              <span>
                Còn lại:{" "}
                <span className="font-medium">
                  {farmingProgress.workflows.total -
                    farmingProgress.workflows.completed}
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {farmingProgress.plans.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-green-700">
                  {farmingProgress.plans.completed}
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  Hoàn thành
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-amber-700">
                  {farmingProgress.plans.pending}
                </p>
                <p className="text-xs font-medium text-amber-600 mt-1">
                  Chờ triển khai
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-blue-700">
                  {farmingProgress.plans.inProgress}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  Đang triển khai
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {farmingProgress.tasks.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-green-700">
                  {farmingProgress.tasks.completed}
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  Hoàn thành
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-amber-700">
                  {farmingProgress.tasks.pending}
                </p>
                <p className="text-xs font-medium text-amber-600 mt-1">
                  Chờ triển khai
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
                <p className="text-2xl font-display font-bold text-blue-700">
                  {farmingProgress.tasks.inProgress}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  Đang triển khai
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Xu hướng hoàn thành công việc (5 tuần gần nhất)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyTaskTrend}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(140, 15%, 88%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  stroke="hsl(140, 10%, 45%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(140, 10%, 45%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-slate-600 ml-1">
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Hoàn thành"
                  stroke="hsl(142, 70%, 45%)"
                  fill="hsl(142, 70%, 45%)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Phát sinh"
                  stroke="hsl(38, 92%, 50%)"
                  fill="hsl(38, 92%, 50%)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Vật tư tiêu thụ (Theo Kế hoạch) Widget */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Vật tư tiêu thụ (Theo Kế hoạch)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tra cứu lượng thuốc, phân bón, máy móc đã phân bổ theo từng kế hoạch canh tác
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0">Chọn kế hoạch:</span>
            <button
              onClick={() => {
                setTempSelectedPlanId(selectedPlanId);
                setDialogOpen(true);
              }}
              className="text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>{planData.planName.length > 35 ? planData.planName.substring(0, 35) + "..." : planData.planName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center animate-pulse bg-slate-50 rounded-lg">
              <span className="text-xs text-muted-foreground">Đang tải dữ liệu tiêu thụ theo kế hoạch...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-100 font-medium">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đang xem: {planData.planName}</span>
              </div>
              <div className="border border-slate-100 rounded-lg overflow-hidden divide-y divide-slate-100">
                {planData.details.map((item) => {
                  const isExpanded = !!expandedItems[item.field];
                  return (
                    <div key={item.field} className="bg-white">
                      <button
                        onClick={() => toggleAccordion(item.field)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-left font-medium text-xs text-slate-700 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <span className="font-semibold text-slate-800">{item.category}</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded-sm">
                            {item.value}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 bg-slate-50/30 border-t border-slate-50/50">
                          <ul className="space-y-1.5 list-disc list-inside">
                            {item.items.map((subItem, index) => (
                              <li key={index} className="text-xs text-slate-600 pl-1 leading-relaxed">
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog chọn kế hoạch */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[500px]">
            {/* Dialog Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                  Chọn kế hoạch canh tác
                </h3>
              </div>
              <button
                onClick={() => {
                  setDialogOpen(false);
                  setDialogSearch("");
                  setDialogCategory("all");
                }}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog Filters */}
            <div className="p-4 border-b border-slate-50 space-y-3 bg-white">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kế hoạch (Tên, vùng trồng...)"
                  value={dialogSearch}
                  onChange={(e) => setDialogSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "fertilizer", label: "Bón phân" },
                  { value: "pesticide", label: "Phun thuốc" },
                  { value: "soil", label: "Cải tạo đất" },
                  { value: "harvest", label: "Thu hoạch" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setDialogCategory(cat.value)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all border cursor-pointer ${
                      dialogCategory === cat.value
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dialog List Content */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/30 divide-y divide-slate-100/50">
              {planList
                .filter((p) => {
                  const matchSearch = p.name.toLowerCase().includes(dialogSearch.toLowerCase());
                  const matchCategory = dialogCategory === "all" || p.category === dialogCategory;
                  return matchSearch && matchCategory;
                })
                .map((plan) => {
                  const isSelected = tempSelectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setTempSelectedPlanId(plan.id);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-emerald-50/40 border border-emerald-100 shadow-xs"
                          : "hover:bg-slate-50/80 border border-transparent"
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <p className="text-xs font-semibold text-slate-800 leading-normal">
                          {plan.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                            {plan.categoryLabel}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{plan.date}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
            </div>

            {/* Dialog Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => {
                  setDialogOpen(false);
                  setDialogSearch("");
                  setDialogCategory("all");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSelectedPlanId(tempSelectedPlanId);
                  setDialogOpen(false);
                  setDialogSearch("");
                  setDialogCategory("all");
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
