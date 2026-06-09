import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { OverviewStats } from "./components/OverviewStats";
import { YieldChart } from "./components/YieldChart";
import { CropAreaChart } from "./components/CropAreaChart";
import { RecentActivities } from "./components/RecentActivities";
import { UpcomingTasks } from "./components/UpcomingTasks";
import { DashboardAlerts } from "./components/DashboardAlerts";

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
