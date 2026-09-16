import { AdminOrgStatsBlock } from "../components/AdminOrgStatsBlock";
import { CultivationAreaStatsBlock } from "../components/CultivationAreaStatsBlock";
import { CropStatsBlock } from "../components/CropStatsBlock";
import { TaskStatsBlock } from "../components/TaskStatsBlock";
import { FarmerHarvestShareChart } from "../components/FarmerHarvestShareChart";
import { RecentDiaryEntries } from "../components/RecentDiaryEntries";
import { UpcomingTasks } from "../components/UpcomingTasks";
import type { DashboardZoneNode } from "../hooks/useDashboardData";

interface AdminDashboardViewProps {
  zoneTreeData?: DashboardZoneNode[];
  cropHealthMetrics?: {
    totalTrees: number;
    healthyTrees: number;
    sickTrees: number;
    treatingTrees: number;
  };
  taskStats?: {
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    total: number;
  };
  isLoading?: boolean;
}

export function AdminDashboardView({
  zoneTreeData,
  cropHealthMetrics,
  taskStats,
  isLoading,
}: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Organizations (Admin view) */}
      <AdminOrgStatsBlock isLoading={isLoading} />

      {/* 2. Cultivation Area Summary */}
      <CultivationAreaStatsBlock
        zoneTreeData={zoneTreeData}
        isLoading={isLoading}
      />

      {/* 3. Crop Stats (Tổng cây, Đang bệnh, Đang điều trị) */}
      <CropStatsBlock data={cropHealthMetrics} isLoading={isLoading} />

      {/* 4. Task Stats (Đã hoàn thành, Đang triển khai, Chờ triển khai) */}
      <TaskStatsBlock data={taskStats} isLoading={isLoading} />

      {/* 5. Donut Chart: Tỷ lệ sản lượng thu hoạch theo nông hộ (Top 20 + Khác) */}
      <FarmerHarvestShareChart />

      {/* 6. Recent Diary Entries & Upcoming Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDiaryEntries />
        <UpcomingTasks />
      </div>
    </div>
  );
}
