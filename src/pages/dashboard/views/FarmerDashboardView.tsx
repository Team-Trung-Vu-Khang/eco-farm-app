import { FarmerZoneMapBlock } from "../components/FarmerZoneMapBlock";
import { CropStatsBlock } from "../components/CropStatsBlock";
import { TaskStatsBlock } from "../components/TaskStatsBlock";
import { YieldChart } from "../components/YieldChart";
import { RecentDiaryEntries } from "../components/RecentDiaryEntries";
import { UpcomingTasks } from "../components/UpcomingTasks";
import type { DashboardZoneNode } from "../hooks/useDashboardData";

interface FarmerDashboardViewProps {
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

export function FarmerDashboardView({
  zoneTreeData,
  cropHealthMetrics,
  taskStats,
  isLoading,
}: FarmerDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Farmer Zone Map & Hierarchy Tree Block */}
      <FarmerZoneMapBlock zoneTreeData={zoneTreeData} isLoading={isLoading} />

      {/* 2. Crop Stats (Tổng cây, Đang bệnh, Đang điều trị) */}
      <CropStatsBlock data={cropHealthMetrics} isLoading={isLoading} />

      {/* 3. Task Stats (Đã hoàn thành, Đang triển khai, Chờ triển khai) */}
      <TaskStatsBlock data={taskStats} isLoading={isLoading} />

      {/* 4. Biểu đồ Tăng trưởng & Sản lượng Thu hoạch Nông hộ qua các tháng */}
      <div className="grid grid-cols-1 gap-6">
        <YieldChart />
      </div>

      {/* 5. Recent Diary Entries & Upcoming Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDiaryEntries />
        <UpcomingTasks />
      </div>
    </div>
  );
}


