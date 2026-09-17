import { AdminOrgStatsBlock } from "../components/AdminOrgStatsBlock";
import { AdminActiveFarmerReportBlock } from "../components/AdminActiveFarmerReportBlock";
import { CropVarietyHarvestBlock } from "../components/CropVarietyHarvestBlock";
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

export function AdminDashboardView({ isLoading }: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Organizations (Admin view) */}
      <AdminOrgStatsBlock isLoading={isLoading} />

      {/* 2. Admin Active Farmer Report Block (Donut chart, CSV downloads, Top 20 Active Farmers) */}
      <AdminActiveFarmerReportBlock />

      {/* 3. Donut Chart & Top Farmers Chart: Sản lượng thu hoạch theo Giống cây trồng */}
      <CropVarietyHarvestBlock />

      {/* 4. Recent Diary Entries & Upcoming Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDiaryEntries />
        <UpcomingTasks />
      </div>
    </div>
  );
}

