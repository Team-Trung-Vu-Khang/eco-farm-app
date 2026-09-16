import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Stethoscope, Sprout } from "lucide-react";

interface CropStatsBlockProps {
  data?: {
    totalTrees: number;
    healthyTrees: number;
    sickTrees: number;
    treatingTrees: number;
  };
  isLoading?: boolean;
}

export function CropStatsBlock({ data, isLoading }: CropStatsBlockProps) {
  const total = data?.totalTrees ? data.totalTrees.toLocaleString("vi-VN") : "15.420";
  const sick = data?.sickTrees !== undefined ? data.sickTrees.toLocaleString("vi-VN") : "350";
  const treating = data?.treatingTrees !== undefined ? data.treatingTrees.toLocaleString("vi-VN") : "270";

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Cây trồng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Tổng cây trồng canh tác"
          value={isLoading ? "..." : total}
          change="Tất cả loại cây"
          changeType="neutral"
          icon={Sprout}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Số lượng cây mắc bệnh"
          value={isLoading ? "..." : sick}
          change="Cần xử lý ngay"
          changeType="negative"
          icon={Activity}
          iconColor="bg-red-100 text-red-600"
        />
        <StatsCard
          title="Số lượng cây đang điều trị"
          value={isLoading ? "..." : treating}
          change="Cần theo dõi tiến trình"
          changeType="neutral"
          icon={Stethoscope}
          iconColor="bg-blue-100 text-blue-600"
        />
      </div>
    </div>
  );
}
