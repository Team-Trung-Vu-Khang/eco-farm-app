import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { DashboardAlerts } from "./components/DashboardAlerts";
import { AdminDashboardView } from "./views/AdminDashboardView";
import { FarmerDashboardView } from "./views/FarmerDashboardView";
import { useDashboardData } from "./hooks/useDashboardData";
import { Building2, UserCheck, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [roleView, setRoleView] = useState<"admin" | "farmer">("admin");
  const { zoneTreeData, cropHealthMetrics, taskStats, isLoading, refetchAll } =
    useDashboardData();

  return (
    <PageWrapper
      title="Dashboard"
      description="Tổng quan hệ thống quản lý nông trại"
    >
      <div className="space-y-6">
        {/* Công tắc chuyển đổi Role View cho mục đích kiểm thử */}
        <div className="flex items-center justify-between bg-slate-100/80 p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Chế độ hiển thị kiểm thử:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchAll()}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-white transition-all border border-transparent hover:border-slate-200"
              title="Tải lại dữ liệu API"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`}
              />
            </button>
            <div className="flex items-center bg-white p-1 rounded-lg border shadow-sm gap-1">
              <button
                onClick={() => setRoleView("admin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  roleView === "admin"
                    ? "bg-emerald-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Góc nhìn Admin (Doanh nghiệp/HTX)</span>
              </button>
              <button
                onClick={() => setRoleView("farmer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  roleView === "farmer"
                    ? "bg-emerald-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Góc nhìn Nông hộ (Vùng canh tác Nông hộ)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Khối Cảnh báo di chuyển lên vị trí trên cùng theo yêu cầu */}
        {roleView === "admin" ? <></> : <DashboardAlerts />}

        {/* 2. Render View tương ứng với Role View với dữ liệu API thực tế */}
        {roleView === "admin" ? (
          <AdminDashboardView
            zoneTreeData={zoneTreeData}
            cropHealthMetrics={cropHealthMetrics}
            taskStats={taskStats}
            isLoading={isLoading}
          />
        ) : (
          <FarmerDashboardView
            zoneTreeData={zoneTreeData}
            cropHealthMetrics={cropHealthMetrics}
            taskStats={taskStats}
            isLoading={isLoading}
          />
        )}
      </div>
    </PageWrapper>
  );
}
