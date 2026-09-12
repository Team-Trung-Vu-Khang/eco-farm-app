import React from "react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  History,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { FarmTaskResponse } from "@/features/farm-task";
import type { MockTaskItem } from "../../types/diary.types";

interface PersonnelItem {
  role?: string;
  fullName?: string;
  name?: string;
}

interface PlannedTaskDetailCardProps {
  task: (FarmTaskResponse | MockTaskItem) & {
    manager?: { name?: string; fullName?: string };
    inspector?: { name?: string; fullName?: string };
    personnel?: PersonnelItem[];
  };
  planObjective?: string;
}

export function PlannedTaskDetailCard({
  task,
}: PlannedTaskDetailCardProps) {
  if (!task) return null;

  const stageOrCategoryName =
    task.stage?.name ||
    task.taskCategory?.name ||
    (typeof task.taskCategory === "string" ? task.taskCategory : undefined);

  const completion =
    typeof task.progressPercent === "number"
      ? task.progressPercent
      : typeof task.lastCompletionPercentage === "number"
        ? task.lastCompletionPercentage
        : undefined;

  const updatedCount =
    typeof task.updatedCount === "number" && task.updatedCount > 0
      ? task.updatedCount
      : undefined;

  const personnelList: PersonnelItem[] = Array.isArray(task.personnel) ? task.personnel : [];
  const manager =
    personnelList.find((p) => p.role === "MANAGER") ||
    (task.manager?.name ? task.manager : undefined);
  const inspector =
    personnelList.find((p) => p.role === "QUALITY_INSPECTOR") ||
    (task.inspector?.name ? task.inspector : undefined);

  const hasManager = Boolean(manager?.fullName || manager?.name);
  const hasInspector = Boolean(inspector?.fullName || inspector?.name);
  const hasPersonnelGrid = hasManager || hasInspector;

  return (
    <Card className="border border-green-200/80 bg-gradient-to-br from-green-50/40 via-white to-slate-50/50 shadow-xs rounded-2xl overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="pb-3 border-b border-green-100 bg-white/80">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            {stageOrCategoryName && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-[10px] font-bold"
                >
                  Hạng mục: {stageOrCategoryName}
                </Badge>
              </div>
            )}
            <CardTitle className="text-base font-extrabold text-slate-900 leading-snug">
              {task.code ? `${task.code} - ${task.name}` : task.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 text-xs">
        {/* Thông số cập nhật nhật ký & Tiến độ hiện tại */}
        {(updatedCount !== undefined || completion !== undefined) && (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            {updatedCount !== undefined ? (
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-500" />
                <span>Lịch sử cập nhật trước đó:</span>
                <span className="font-bold text-slate-800">
                  {updatedCount} đợt
                </span>
              </div>
            ) : (
              <div />
            )}

            {completion !== undefined && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>Tiến độ hiện tại:</span>
                <span className="font-bold text-green-700">{completion}%</span>
              </div>
            )}
          </div>
        )}

        {/* Thông tin Quản lý & Kiểm định */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-150 bg-white p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Thông tin quản lý
              </span>
              {hasManager ? (
                <>
                  <p className="font-bold text-slate-800 truncate text-xs">
                    {manager.fullName || manager.name}
                  </p>
                  {manager.role && manager.role !== "MANAGER" && (
                    <p className="text-[10px] text-slate-500 truncate">
                      {manager.role}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 font-medium italic">
                  Chưa phân bổ
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-150 bg-white p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Kiểm định chất lượng
              </span>
              {hasInspector ? (
                <>
                  <p className="font-bold text-slate-800 truncate text-xs">
                    {inspector.fullName || inspector.name}
                  </p>
                  {inspector.role && inspector.role !== "QUALITY_INSPECTOR" && (
                    <p className="text-[10px] text-slate-500 truncate">
                      {inspector.role}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 font-medium italic">
                  Chưa phân bổ
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
