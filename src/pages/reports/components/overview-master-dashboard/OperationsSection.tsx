import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  Clock,
  PlayCircle,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { type TreeNode } from "../../constants/mockReportData";

interface OperationsSectionProps {
  selectedLocation: TreeNode | null;
}

interface StatDetails {
  total: number;
  pending: number;
  inProgress: number;
}

const planTypeStats: Record<string, StatDetails> = {
  all: { total: 27, pending: 4, inProgress: 8 },
  "Bón phân": { total: 8, pending: 2, inProgress: 4 },
  "Phun thuốc": { total: 6, pending: 1, inProgress: 2 },
  "Thu hoạch": { total: 5, pending: 1, inProgress: 1 },
  "Làm đất": { total: 4, pending: 0, inProgress: 1 },
  Khác: { total: 4, pending: 0, inProgress: 0 },
};

const taskTypeStats: Record<string, StatDetails> = {
  all: { total: 51, pending: 12, inProgress: 24 },
  "Nhổ cỏ": { total: 12, pending: 3, inProgress: 6 },
  "Tưới nước": { total: 10, pending: 2, inProgress: 5 },
  "Bao trái": { total: 14, pending: 4, inProgress: 6 },
  "Phát hoang": { total: 8, pending: 2, inProgress: 4 },
  Khác: { total: 7, pending: 1, inProgress: 3 },
};

export const OperationsSection: React.FC<OperationsSectionProps> = ({
  selectedLocation,
}) => {
  const [activePlanTab, setActivePlanTab] = useState("all");
  const [activeTaskTab, setActiveTaskTab] = useState("all");

  const multiplier = useMemo(() => {
    if (!selectedLocation) return 1;
    if (selectedLocation.type === "region") return 0.6;
    if (selectedLocation.type === "area") return 0.3;
    return 0.15;
  }, [selectedLocation]);

  const planStats = useMemo(() => {
    const base = planTypeStats[activePlanTab] || planTypeStats.all;
    return {
      total: Math.max(1, Math.round(base.total * multiplier)),
      pending: Math.round(base.pending * multiplier),
      inProgress: Math.round(base.inProgress * multiplier),
    };
  }, [activePlanTab, multiplier]);

  const taskStats = useMemo(() => {
    const base = taskTypeStats[activeTaskTab] || taskTypeStats.all;
    return {
      total: Math.max(1, Math.round(base.total * multiplier)),
      pending: Math.round(base.pending * multiplier),
      inProgress: Math.round(base.inProgress * multiplier),
    };
  }, [activeTaskTab, multiplier]);

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
        {/* Block A: Plans */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-emerald-600" />
              <span>Kế hoạch sản xuất</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Tabs for Plan Types */}
            <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
              {Object.keys(planTypeStats).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivePlanTab(type)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activePlanTab === type
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {type === "all" ? "Tất cả" : type}
                </button>
              ))}
            </div>

            {/* Stats Indicator Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-center space-y-1">
                <FileText className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Tổng số
                </p>
                <p className="text-xl font-display font-extrabold text-slate-750 font-mono">
                  {planStats.total}
                </p>
              </div>

              <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-100/50 text-center space-y-1">
                <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                  Chờ triển khai
                </p>
                <p className="text-xl font-display font-extrabold text-amber-600 font-mono">
                  {planStats.pending}
                </p>
              </div>

              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 text-center space-y-1">
                <PlayCircle className="w-4 h-4 text-blue-500 mx-auto" />
                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                  Đang triển khai
                </p>
                <p className="text-xl font-display font-extrabold text-blue-600 font-mono">
                  {planStats.inProgress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block B: Tasks */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-blue-600" />
              <span>Công việc canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Tabs for Task Types */}
            <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
              {Object.keys(taskTypeStats).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTaskTab(type)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTaskTab === type
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {type === "all" ? "Tất cả" : type}
                </button>
              ))}
            </div>

            {/* Stats Indicator Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-center space-y-1">
                <Briefcase className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Tổng số
                </p>
                <p className="text-xl font-display font-extrabold text-slate-750 font-mono">
                  {taskStats.total}
                </p>
              </div>

              <div className="p-3 bg-slate-100/50 rounded-xl border border-slate-100 text-center space-y-1">
                <Clock className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Chờ làm
                </p>
                <p className="text-xl font-display font-extrabold text-slate-700 font-mono">
                  {taskStats.pending}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50 text-center space-y-1">
                <PlayCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                  Đang làm
                </p>
                <p className="text-xl font-display font-extrabold text-emerald-700 font-mono">
                  {taskStats.inProgress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
