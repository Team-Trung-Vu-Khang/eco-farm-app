import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CropAreaChart } from "./components/CropAreaChart";
import { DashboardAlerts } from "./components/DashboardAlerts";
import { OverviewStats } from "./components/OverviewStats";
import { RecentActivities } from "./components/RecentActivities";
import { UpcomingTasks } from "./components/UpcomingTasks";
import { YieldChart } from "./components/YieldChart";

export default function Dashboard() {
  return (
    <AdminLayout
      isDev={true}
      title="Dashboard"
      description="Tổng quan hệ thống quản lý nông trại"
    >
      <div className="space-y-6">
        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <YieldChart />
          <CropAreaChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities />
          <UpcomingTasks />
        </div>

        <DashboardAlerts />
      </div>
    </AdminLayout>
  );
}
