import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Clock, PlayCircle, Briefcase, Loader2 } from "lucide-react";
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";
import {
  useProductionPlanStats,
  useTaskNameStats,
} from "@/features/farm/hooks/useFarmReport";
import type { FarmPlanPurpose } from "@/features/farm/types/farm-report.type";

interface AdminOperationsSectionProps {
  selectedWorkspace?: WorkspaceRecord | null;
  selectedEntity?: WorkspaceRecord | null;
}

const planPurposeTabs: { label: string; value: FarmPlanPurpose | "ALL" }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Canh tác", value: "CULTIVATION" },
  { label: "Bón phân / Dinh dưỡng", value: "NUTRITION" },
  { label: "Phòng trừ sâu bệnh", value: "PEST_DISEASE" },
  { label: "Chăm sóc", value: "PLANT_CARE" },
  { label: "Thu hoạch", value: "HARVEST" },
  { label: "Tưới nước", value: "IRRIGATION" },
];

const taskTabs = [
  { label: "Tất cả công việc", value: undefined },
  { label: "Nhổ cỏ", value: "Nhổ cỏ" },
  { label: "Tưới nước", value: "Tưới nước" },
  { label: "Bón phân", value: "Bón phân" },
  { label: "Bao trái", value: "Bao trái" },
  { label: "Phun thuốc", value: "Phun thuốc" },
];

export const AdminOperationsSection: React.FC<AdminOperationsSectionProps> = ({
  selectedWorkspace,
  selectedEntity,
}) => {
  const currentWorkspace = selectedWorkspace ?? selectedEntity;

  const [activePlanTab, setActivePlanTab] = useState<FarmPlanPurpose | "ALL">("ALL");
  const [activeTaskTab, setActiveTaskTab] = useState<string | undefined>(undefined);

  // Fetch production plan stats with explicit workspaceId option
  const {
    totalCount: planTotal,
    items: planItems,
    isLoading: isPlanLoading,
  } = useProductionPlanStats(
    { purpose: activePlanTab === "ALL" ? undefined : activePlanTab },
    { workspaceId: currentWorkspace?.id },
  );

  // Calculate aggregated plan counts
  const planPending = planItems.reduce((acc, curr) => acc + (curr.pendingCount || 0), 0);
  const planInProgress = planItems.reduce((acc, curr) => acc + (curr.inProgressCount || 0), 0);

  // Fetch task stats with explicit workspaceId option
  const {
    totalCount: taskTotal,
    pendingCount: taskPending,
    inProgressCount: taskInProgress,
    isLoading: isTaskLoading,
  } = useTaskNameStats(
    { name: activeTaskTab },
    { workspaceId: currentWorkspace?.id },
  );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Hoạt động & Vận hành
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Báo cáo thực tế tiến độ kế hoạch sản xuất và công việc canh tác
          {currentWorkspace ? ` - ${currentWorkspace.name}` : ""}
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
            <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
              {planPurposeTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActivePlanTab(tab.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activePlanTab === tab.value
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isPlanLoading ? (
              <div className="py-8 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-center space-y-1">
                  <FileText className="w-4 h-4 text-slate-400 mx-auto" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Tổng số
                  </p>
                  <p className="text-xl font-display font-extrabold text-slate-750 font-mono">
                    {planTotal}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-100/50 text-center space-y-1">
                  <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                  <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                    Chờ triển khai
                  </p>
                  <p className="text-xl font-display font-extrabold text-amber-600 font-mono">
                    {planPending}
                  </p>
                </div>

                <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 text-center space-y-1">
                  <PlayCircle className="w-4 h-4 text-blue-500 mx-auto" />
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                    Đang triển khai
                  </p>
                  <p className="text-xl font-display font-extrabold text-blue-600 font-mono">
                    {planInProgress}
                  </p>
                </div>
              </div>
            )}
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
            <div className="flex border-b border-slate-100 pb-2 overflow-x-auto gap-2 scrollbar-none">
              {taskTabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTaskTab(tab.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeTaskTab === tab.value
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isTaskLoading ? (
              <div className="py-8 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-center space-y-1">
                  <Briefcase className="w-4 h-4 text-slate-400 mx-auto" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Tổng số
                  </p>
                  <p className="text-xl font-display font-extrabold text-slate-750 font-mono">
                    {taskTotal}
                  </p>
                </div>

                <div className="p-3 bg-slate-100/50 rounded-xl border border-slate-100 text-center space-y-1">
                  <Clock className="w-4 h-4 text-slate-400 mx-auto" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Chờ làm
                  </p>
                  <p className="text-xl font-display font-extrabold text-slate-700 font-mono">
                    {taskPending}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50 text-center space-y-1">
                  <PlayCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                    Đang làm
                  </p>
                  <p className="text-xl font-display font-extrabold text-emerald-700 font-mono">
                    {taskInProgress}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
