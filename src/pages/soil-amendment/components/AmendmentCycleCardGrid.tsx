import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowRight,
  Clock,
  Edit,
  Sprout,
  Trash2,
} from "lucide-react";
import { getActivityConfig } from "../data/amendmentCycleData";
import type { AmendmentCycle } from "../types/amendment-cycle";

interface AmendmentCycleCardGridProps {
  cycles: AmendmentCycle[];
  onDelete: (cycle: AmendmentCycle) => void;
  onEdit: (cycle: AmendmentCycle) => void;
  onViewDetail: (cycle: AmendmentCycle) => void;
}

export function AmendmentCycleCardGrid({
  cycles,
  onDelete,
  onEdit,
  onViewDetail,
}: AmendmentCycleCardGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cycles.map((cycle) => (
        <Card
          key={cycle.id}
          className="group relative flex flex-col overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-[100px] bg-primary/5 transition-transform group-hover:scale-110" />

          <CardHeader className="relative z-10 pb-4">
            <div className="mb-2 flex items-start justify-between">
              <Badge variant="secondary" className="font-mono">
                {cycle.type.toUpperCase()}
              </Badge>
              <div className="flex items-center rounded bg-secondary/50 px-2 py-1 text-xs font-semibold text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {cycle.duration}
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-primary">
              {cycle.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 flex flex-1 flex-col">
            <div className="mb-6">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Áp dụng khi
              </div>
              <div
                className={`inline-block rounded-md px-3 py-1.5 text-sm font-medium ${cycle.conditionColor}`}
              >
                {cycle.condition}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Hoạt động chính
              </div>
              <ul className="space-y-2">
                {cycle.activities.slice(0, 3).map((activity, index) => {
                  const { color, icon: Icon } = getActivityConfig(activity.type);

                  return (
                    <li
                      key={`${cycle.id}-${index}`}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <div className={`mt-0.5 shrink-0 rounded-full p-1 ${color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="line-clamp-1">{activity.text}</span>
                    </li>
                  );
                })}
                {cycle.activities.length > 3 && (
                  <li className="pl-6 text-xs italic text-muted-foreground">
                    + {cycle.activities.length - 3} hoạt động khác
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-6 border-t border-dashed pt-4">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                <Sprout className="h-4 w-4" />
                {cycle.outcome}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                className="group/btn flex-1 hover:bg-primary/5 hover:text-primary"
                onClick={() => onViewDetail(cycle)}
              >
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-primary"
                  onClick={() => onEdit(cycle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(cycle)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
