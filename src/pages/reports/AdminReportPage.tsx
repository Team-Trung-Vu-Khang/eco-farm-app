import React, { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { ReportHeaderActions } from "./components/ReportHeaderActions";
import { Skeleton } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { OverviewAdminDashboard } from "./components/overview-admin-dashboard/OverviewAdminDashboard";

export const AdminReportPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850); // Premium skeleton animation time

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const renderSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      {/* 3 top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 h-28 flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-1/3 bg-slate-200" />
            <Skeleton className="h-8 w-1/2 bg-slate-200" />
            <Skeleton className="h-3 w-2/3 bg-slate-200/60" />
          </div>
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 h-80 bg-white border border-slate-100 rounded-xl p-4">
          <Skeleton className="h-5 w-1/2 bg-slate-200 mb-4" />
          <Skeleton className="h-10 w-full bg-slate-200 rounded-lg mb-2" />
          <Skeleton className="h-10 w-full bg-slate-200 rounded-lg mb-2" />
        </div>
        <div className="col-span-9 space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 h-60 flex flex-col justify-between">
            <Skeleton className="h-5 w-1/3 bg-slate-200" />
            <Skeleton className="h-2 w-full bg-slate-200" />
            <Skeleton className="h-2 w-5/6 bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageWrapper
      title="Báo cáo Quản trị Admin"
      description="Báo cáo tổng hợp quy mô canh tác, tiêu thụ vật tư, kế hoạch vận hành và nhân sự phân bổ theo Đơn vị thành viên."
      actions={
        <ReportHeaderActions
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />
      }
    >
      {isLoading ? renderSkeleton() : <OverviewAdminDashboard />}
    </PageWrapper>
  );
};

export default AdminReportPage;
