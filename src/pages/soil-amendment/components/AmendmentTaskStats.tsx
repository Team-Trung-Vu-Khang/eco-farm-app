import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { amendmentTaskStatsMeta } from "../data/amendmentTaskData";

interface AmendmentTaskStatsProps {
  stats: {
    completed: number;
    inProgress: number;
    pending: number;
    totalArea: string;
  };
}

export function AmendmentTaskStats({ stats }: AmendmentTaskStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      {amendmentTaskStatsMeta.map((item) => {
        const Icon = item.icon;
        const value =
          item.key === "totalArea" ? `${stats.totalArea} ha` : stats[item.key];

        return (
          <Card key={item.key} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${item.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs font-medium uppercase text-slate-500">
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
