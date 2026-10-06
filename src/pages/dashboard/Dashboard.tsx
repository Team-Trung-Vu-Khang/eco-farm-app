import PageWrapper from "@/components/PageWrapper";
import { AdminDashboardView } from "./views/AdminDashboardView";
import { FarmerDashboardView } from "./views/FarmerDashboardView";
import { useFarmerDashboardData } from "./hooks/useFarmerDashboardData";
import { useAdminDashboardData } from "./hooks/useAdminDashboardData";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export default function Dashboard() {
  const { currentUser } = useCurrentUser();
  const isMobile = useIsMobile();
  const userRoles = currentUser?.roleCodes ?? [];
  const isAdminRole = userRoles.some((role) =>
    ["MEVI_SUPER_ADMIN", "MEVI_ADMIN", "MEVI_FARM_ADMIN"].includes(role),
  );

  const roleView: "admin" | "farmer" = isAdminRole ? "admin" : "farmer";

  // Hook 1: Farmer Dashboard Data — Chỉ kích hoạt gọi API khi là góc nhìn Nông hộ (Farmer View)
  const farmerDashboard = useFarmerDashboardData({
    enabled: roleView === "farmer",
  });

  // Hook 2: Admin Dashboard Data — Chỉ kích hoạt gọi API khi là góc nhìn Admin (Admin View)
  const adminDashboard = useAdminDashboardData({
    enabled: roleView === "admin",
  });

  return (
    <PageWrapper
      title={isMobile ? "Tổng quan" : "Dashboard"}
      description={
        isMobile ? undefined : "Tổng quan hệ thống quản lý nông trại"
      }
    >
      <div className={isMobile ? "space-y-4" : "space-y-6"}>
        {/* Render View tương ứng dựa trên roleView */}
        {roleView === "admin" ? (
          <AdminDashboardView isLoading={adminDashboard.isLoading} />
        ) : (
          <FarmerDashboardView
            zoneTreeData={farmerDashboard.zoneTreeData}
            taskStats={farmerDashboard?.taskStats}
            cropHealthMetrics={farmerDashboard?.cropHealthMetrics}
            isLoading={farmerDashboard.isLoading}
          />
        )}
      </div>
    </PageWrapper>
  );
}
