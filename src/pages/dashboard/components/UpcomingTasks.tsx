import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { upcomingTasks } from "../constants";

export function UpcomingTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Công việc sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <Link
              key={task.id}
              to={task.link}
              className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-primary flex items-center gap-1">
                  {task.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.dueDate}
                </p>
              </div>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {task.priority === "high"
                  ? "Cao"
                  : task.priority === "medium"
                    ? "Trung bình"
                    : "Thấp"}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
