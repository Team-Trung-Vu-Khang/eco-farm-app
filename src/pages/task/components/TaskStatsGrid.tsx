import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { TASK_STAT_CONFIG } from "../data/constants";

interface TaskStats {
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface TaskStatsGridProps {
  stats: TaskStats;
}

export function TaskStatsGrid({ stats }: TaskStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {TASK_STAT_CONFIG.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${item.iconClassName}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">
                  {stats[item.key]}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
