import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, CheckSquare, Clock } from "lucide-react";

interface TaskStatsBlockProps {
  data?: {
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    total: number;
  };
  isLoading?: boolean;
}

export function TaskStatsBlock({ data, isLoading }: TaskStatsBlockProps) {
  const completed = data?.completed !== undefined ? data.completed.toLocaleString("vi-VN") : "1.245";
  const inProgress = data?.inProgress !== undefined ? data.inProgress.toLocaleString("vi-VN") : "85";
  const pending = data?.pending !== undefined ? data.pending.toLocaleString("vi-VN") : "42";

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Công việc
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Đã hoàn thành"
          value={isLoading ? "..." : completed}
          change="Công việc hoàn thành"
          changeType="positive"
          icon={CheckSquare}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Đang triển khai"
          value={isLoading ? "..." : inProgress}
          change="Công việc đang xử lý"
          changeType="neutral"
          icon={Clock}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatsCard
          title="Chờ triển khai"
          value={isLoading ? "..." : pending}
          change="Công việc đang chờ"
          changeType="neutral"
          icon={Briefcase}
          iconColor="bg-slate-100 text-slate-600"
        />
      </div>
    </div>
  );
}
