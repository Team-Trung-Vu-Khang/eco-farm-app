import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, TrendingUp } from "lucide-react";

import { DashboardZoneNode } from "../hooks/useDashboardData";

interface CultivationAreaStatsBlockProps {
  zoneTreeData?: DashboardZoneNode[];
  isLoading?: boolean;
}

export function CultivationAreaStatsBlock({ zoneTreeData, isLoading }: CultivationAreaStatsBlockProps) {
  const totalArea = zoneTreeData
    ? zoneTreeData.reduce((acc, z) => acc + (z.totalAreaHa || 0), 0)
    : 1250;
  const zoneCount = zoneTreeData ? zoneTreeData.length : 85;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Vùng trồng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="Tổng diện tích đang canh tác"
          value={isLoading ? "..." : `${totalArea.toLocaleString("vi-VN")} ha`}
          change={`Sầu riêng & Cây ăn quả - ${zoneCount} vùng trồng`}
          changeType="positive"
          icon={MapPin}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Tổng diện tích đang cải tạo"
          value={isLoading ? "..." : "80 ha"}
          change="Cải tạo đất - 8 vùng - 25 khu vực"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-orange-100 text-orange-600"
        />
      </div>
    </div>
  );
}
