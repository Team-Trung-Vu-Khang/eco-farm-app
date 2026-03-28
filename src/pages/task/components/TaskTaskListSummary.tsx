import {
  Badge,
  Card,
  CardContent,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar as CalendarIcon,
  ClipboardList,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import type { MaterialAllocation, TaskAllocation } from "../../plan/types";
import type { TaskSelectionSummaryGroup } from "../types/form";

interface TaskTaskListSummaryProps {
  tasks: TaskAllocation[];
  materials: MaterialAllocation[];
  getSelectionSummary: (
    selections: TaskAllocation["geographicalSelections"] | undefined,
  ) => TaskSelectionSummaryGroup[];
}

export function TaskTaskListSummary({
  tasks,
  materials,
  getSelectionSummary,
}: TaskTaskListSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          Danh sách công việc chi tiết
        </h4>
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 font-bold px-2 py-0"
        >
          {tasks.length} công việc
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/30">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-slate-400 italic">
              Chưa có công việc nào được cấu hình
            </p>
          </CardContent>
        </Card>
      ) : (
        tasks.map((task, taskIdx) => (
          <Card
            key={task.id ?? taskIdx}
            className="border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {taskIdx + 1}
                </div>
                <span className="font-bold text-slate-800 truncate">
                  {task.name}
                </span>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Nhân sự
                    </p>
                    <p className="text-xs font-semibold text-slate-700 leading-snug">
                      {task.labor || "Chưa phân công"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Thời gian
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      {task.duration || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {task.geographicalSelections &&
                task.geographicalSelections.length > 0 && (
                  <div className="flex items-start gap-2.5 pt-3 border-t border-slate-50">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">
                        Phạm vi thực hiện
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {getSelectionSummary(task.geographicalSelections).map(
                          (group) => (
                            <div
                              key={group.regionId}
                              className="flex flex-wrap gap-1"
                            >
                              {group.items.map((item, i) => (
                                <Badge
                                  key={`${item.id}-${i}`}
                                  className={cn(
                                    "text-[10px] px-2 py-0 border-none font-medium h-5",
                                    item.type === "region"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : item.type === "area"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-amber-50 text-amber-700",
                                  )}
                                >
                                  {item.name}
                                  {item.parentName && (
                                    <span className="opacity-50 ml-1 font-normal">
                                      ({item.parentName})
                                    </span>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {materials.filter((material) => material.taskId === task.id)
                .length > 0 && (
                <div className="pt-3 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
                    Vật tư sử dụng
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {materials
                      .filter((material) => material.taskId === task.id)
                      .map((material, materialIdx) => (
                        <div
                          key={material.id ?? materialIdx}
                          className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-lg px-2.5 py-1.5"
                        >
                          <span className="text-xs text-slate-600 font-medium truncate mr-2">
                            {material.materialName}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-white text-slate-900 border-slate-200 text-[10px] font-bold shrink-0"
                          >
                            {material.quantity} {material.unit}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
