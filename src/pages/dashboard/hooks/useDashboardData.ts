import {
  useFarmerDashboardData,
  type DashboardPlotNode,
  type DashboardAreaNode,
  type DashboardScopeNode,
  type DashboardZoneNode,
} from "./useFarmerDashboardData";

export {
  useFarmerDashboardData,
  type DashboardPlotNode,
  type DashboardAreaNode,
  type DashboardScopeNode,
  type DashboardZoneNode,
};

// Re-export useDashboardData as an alias to useFarmerDashboardData for backwards compatibility
export function useDashboardData(options?: { enabled?: boolean }) {
  return useFarmerDashboardData(options);
}
