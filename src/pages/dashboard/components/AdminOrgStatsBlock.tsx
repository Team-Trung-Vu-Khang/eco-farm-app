import { useAdminWorkspaceStats } from "@/features/farm/hooks/useAdminDashboard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  StatsCard,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, ShieldAlert, User } from "lucide-react";

interface AdminOrgStatsBlockProps {
  isLoading?: boolean;
}

export function AdminOrgStatsBlock({
  isLoading: parentLoading,
}: AdminOrgStatsBlockProps) {
  const { data, isLoading: apiLoading, error } = useAdminWorkspaceStats();

  const isLoading = parentLoading || apiLoading;

  const isForbidden = (error as any)?.response?.status === 403;

  if (isForbidden) {
    return (
      <Alert
        variant="destructive"
        className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-4"
      >
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm text-amber-800">
            Không có quyền truy cập (403 Forbidden)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-700 mt-0.5">
            Bạn không có quyền truy cập số liệu thống kê quản trị toàn hệ thống.
            Tính năng này chỉ dành cho tài khoản có quyền Admin hệ thống
            (MEVI_ADMIN / MEVI_SUPER_ADMIN).
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  const farmCount = data?.farmHousehold?.count ?? 0;
  const farmHa = data?.farmHousehold?.totalAcreageHa ?? 0;

  const zoneCount = data?.farmHousehold?.totalProductionZones ?? 0;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Nông hộ & Vùng canh tác
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="Tổng số nông hộ"
          value={isLoading ? "..." : farmCount.toLocaleString("vi-VN")}
          changeType="neutral"
          icon={User}
          iconColor="bg-sky-100 text-sky-600"
        />
        <StatsCard
          title="Số lượng vùng canh tác"
          value={isLoading ? "..." : zoneCount.toLocaleString("vi-VN")}
          change={`Tổng ${farmHa.toLocaleString("vi-VN")} ha`}
          changeType="neutral"
          icon={MapPin}
          iconColor="bg-emerald-100 text-emerald-600"
        />
      </div>
    </div>
  );
}
