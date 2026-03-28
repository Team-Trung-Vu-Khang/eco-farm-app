import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Beaker, MapPin, Sprout, Users } from "lucide-react";
import type { AmendmentTask } from "../../stores/useAmendmentTaskStore";
import { getPriorityConfig, getStatusConfig } from "../data/amendmentTaskData";

interface AmendmentTaskKanbanProps {
  onViewDetail: (task: AmendmentTask) => void;
  tasks: AmendmentTask[];
}

const kanbanColumns = [
  { id: "pending", title: "Chờ thực hiện", status: "pending" },
  { id: "in_progress", title: "Đang thực hiện", status: "in_progress" },
  { id: "completed", title: "Hoàn thành", status: "completed" },
] as const;

export function AmendmentTaskKanban({
  onViewDetail,
  tasks,
}: AmendmentTaskKanbanProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-3 gap-4">
        {kanbanColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);
          const statusConfig = getStatusConfig(column.status);

          return (
            <div key={column.id} className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={statusConfig.variant}
                    className={statusConfig.className}
                  >
                    {column.title}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    ({columnTasks.length})
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {columnTasks.map((task) => {
                  const priorityConfig = getPriorityConfig(task.priority);

                  return (
                    <Card
                      key={task.id}
                      className="cursor-pointer border-l-4 transition-shadow hover:shadow-md"
                      style={{
                        borderLeftColor:
                          task.priority === "urgent"
                            ? "#dc2626"
                            : task.priority === "high"
                              ? "#f97316"
                              : task.priority === "medium"
                                ? "#3b82f6"
                                : "#94a3b8",
                      }}
                      onClick={() => onViewDetail(task)}
                    >
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="font-mono text-xs text-slate-500">
                            {task.code}
                          </span>
                          <Badge
                            variant={priorityConfig.variant}
                            className={`${priorityConfig.className} text-xs`}
                          >
                            {priorityConfig.label}
                          </Badge>
                        </div>

                        <h4 className="mb-2 line-clamp-2 text-sm font-medium text-slate-900">
                          {task.name}
                        </h4>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Beaker className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{task.method}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{task.zone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Sprout className="h-3 w-3 text-slate-400" />
                            <span>{task.targetArea} ha</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-slate-500">
                          <span>{task.startDate}</span>
                          <span>→</span>
                          <span>{task.endDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-400">
                    Không có công việc
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
