import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, User, Users } from "lucide-react";

interface AdminOrgStatsBlockProps {
  isLoading?: boolean;
}

export function AdminOrgStatsBlock({ isLoading }: AdminOrgStatsBlockProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Doanh nghiệp / Nông hộ / Hợp tác xã
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Tổng doanh nghiệp"
          value={isLoading ? "..." : "45"}
          change="Tổng 850 ha"
          changeType="neutral"
          icon={Building2}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Tổng hợp tác xã"
          value={isLoading ? "..." : "12"}
          change="Tổng 1,200 ha"
          changeType="neutral"
          icon={Users}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatsCard
          title="Tổng nông hộ"
          value={isLoading ? "..." : "99"}
          change="Tổng 300 ha"
          changeType="neutral"
          icon={User}
          iconColor="bg-sky-100 text-sky-600"
        />
      </div>
    </div>
  );
}
