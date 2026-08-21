import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { AdminFarmerDashboard } from "@/pages/dashboard/components/AdminFarmerDashboard";
import { ReportHeaderActions } from "./components/ReportHeaderActions";

export default function FarmerReportPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((k) => k + 1);
    }, 400);
  };

  return (
    <PageWrapper
      title="Báo cáo Nông hộ"
      description="Báo cáo tuân thủ canh tác, sử dụng phân bón/thuốc BVTV của các hộ liên kết"
      actions={<ReportHeaderActions onRefresh={handleRefresh} isRefreshing={isRefreshing} />}
    >
      <AdminFarmerDashboard key={refreshKey} />
    </PageWrapper>
  );
}
