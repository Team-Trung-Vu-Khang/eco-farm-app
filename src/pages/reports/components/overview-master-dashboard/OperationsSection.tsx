import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  Clock,
  PlayCircle,
  Briefcase,
  Loader2,
} from "lucide-react";
import { type TreeNode } from "../../constants/mockReportData";
import {
  useProductionPlanStats,
  useTaskNameRanking,
  useTaskNameStats,
} from "@/features/farm/hooks/useFarmReport";
import type { FarmPlanPurpose } from "@/features/farm/types/farm-report.type";

interface OperationsSectionProps {
  selectedLocation: TreeNode | null;
}

// ─── Map FarmPlanPurpose → label tiếng Việt ──────────────────────────────────

const PLAN_PURPOSE_LABEL: Record<FarmPlanPurpose, string> = {
  CULTIVATION: "Canh tác",
  FACILITY_UPGRADE: "Nâng cấp cơ sở",
  TREATMENT: "Xử lý bệnh",
  SOIL_IMPROVEMENT: "Cải tạo đất",
  HARVEST: "Thu hoạch",
};

// ─── Stat Box ─────────────────────────────────────────────────────────────────

const StatBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | null;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  loading?: boolean;
}> = ({ icon, label, value, colorClass, bgClass, borderClass, loading }) => (
  <div
    className={`p-3 ${bgClass} rounded-xl border ${borderClass} text-center space-y-1`}
  >
    <div className={colorClass + " mx-auto w-fit"}>{icon}</div>
    <p className={`text-[9px] font-bold ${colorClass} uppercase tracking-wider`}>
      {label}
    </p>
    <p className={`text-xl font-display font-extrabold ${colorClass} font-mono`}>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
      ) : (
        (value ?? 0)
      )}
    </p>
  </div>
);

// ─── Block A — Kế hoạch sản xuất ─────────────────────────────────────────────

const PlanBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | FarmPlanPurpose>("all");
  const { items, totalCount, isLoading } = useProductionPlanStats();

  const displayStats = useMemo(() => {
    if (activeTab === "all") {
      return {
        total: totalCount,
        pending: items.reduce((s, i) => s + i.pendingCount, 0),
        inProgress: items.reduce((s, i) => s + i.inProgressCount, 0),
      };
    }
    const found = items.find((i) => i.code === activeTab);
    return {
      total: found?.totalCount ?? 0,
      pending: found?.pendingCount ?? 0,
      inProgress: found?.inProgressCount ?? 0,
    };
  }, [activeTab, items, totalCount]);

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-4">
        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-emerald-600" />
          <span>Kế hoạch sản xuất</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 w-16 bg-slate-100 rounded-lg animate-pulse"
                />
              ))
            : items.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setActiveTab(item.code)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === item.code
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {PLAN_PURPOSE_LABEL[item.code] ?? item.code}
                </button>
              ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            icon={<FileText className="w-4 h-4" />}
            label="Tổng số"
            value={displayStats.total}
            colorClass="text-slate-400"
            bgClass="bg-slate-50/50"
            borderClass="border-slate-100"
            loading={isLoading}
          />
          <StatBox
            icon={<Clock className="w-4 h-4" />}
            label="Chờ triển khai"
            value={displayStats.pending}
            colorClass="text-amber-500"
            bgClass="bg-amber-50/30"
            borderClass="border-amber-100/50"
            loading={isLoading}
          />
          <StatBox
            icon={<PlayCircle className="w-4 h-4" />}
            label="Đang triển khai"
            value={displayStats.inProgress}
            colorClass="text-blue-500"
            bgClass="bg-blue-50/30"
            borderClass="border-blue-100/50"
            loading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Block B — Công việc canh tác ─────────────────────────────────────────────

const TaskBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // API 5.3 — get top N task names for tabs
  const { items: rankingItems, isLoading: rankingLoading } =
    useTaskNameRanking({ size: 10 });

  // Derive excludeNames for "Khác" tab
  const topNames = useMemo(
    () => rankingItems.map((i) => i.name),
    [rankingItems],
  );

  // API 5.2 — stats for current tab
  const statsParams = useMemo(() => {
    if (activeTab === "all") return {};
    if (activeTab === "other") return { excludeNames: topNames };
    return { name: activeTab };
  }, [activeTab, topNames]);

  const { totalCount, pendingCount, inProgressCount, isLoading: statsLoading } =
    useTaskNameStats(statsParams);

  const showOtherTab = rankingItems.length > 0;

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
      <CardHeader className="pb-3 border-b border-slate-50 p-4">
        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <Briefcase className="w-4.5 h-4.5 text-blue-600" />
          <span>Công việc canh tác</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
          {rankingLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 w-16 bg-slate-100 rounded-lg animate-pulse"
                />
              ))
            : rankingItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === item.name
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
          {showOtherTab && (
            <button
              onClick={() => setActiveTab("other")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === "other"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Khác
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            icon={<Briefcase className="w-4 h-4" />}
            label="Tổng số"
            value={totalCount}
            colorClass="text-slate-400"
            bgClass="bg-slate-50/50"
            borderClass="border-slate-100"
            loading={statsLoading}
          />
          <StatBox
            icon={<Clock className="w-4 h-4" />}
            label="Chờ làm"
            value={pendingCount}
            colorClass="text-slate-400"
            bgClass="bg-slate-100/50"
            borderClass="border-slate-100"
            loading={statsLoading}
          />
          <StatBox
            icon={<PlayCircle className="w-4 h-4" />}
            label="Đang làm"
            value={inProgressCount}
            colorClass="text-emerald-500"
            bgClass="bg-emerald-50/30"
            borderClass="border-emerald-100/50"
            loading={statsLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Main OperationsSection ───────────────────────────────────────────────────

export const OperationsSection: React.FC<OperationsSectionProps> = ({
  selectedLocation: _selectedLocation,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Hoạt động & Vận hành
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Theo dõi tiến độ kế hoạch canh tác và công việc chi tiết của nhân sự
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PlanBlock />
        <TaskBlock />
      </div>
    </div>
  );
};
