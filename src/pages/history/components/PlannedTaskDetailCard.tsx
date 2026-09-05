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
import type { MockTaskItem } from "../mock/history.mock";

interface PlannedTaskDetailCardProps {
  task: MockTaskItem;
  planObjective?: string;
}

export function PlannedTaskDetailCard({
  task,
}: PlannedTaskDetailCardProps) {
  const completion = task.lastCompletionPercentage ?? 60;
  const updatedCount = task.updatedCount ?? 3;
  const taskCategory = task.taskCategory || "Dự kiến";
  const manager = task.manager || {
    name: "Nguyễn Văn Hùng",
    role: "Kỹ sư Canh tác Trưởng",
  };
  const inspector = task.inspector || {
    name: "Trần Thị Mai",
    role: "Chuyên viên Kiểm định Chất lượng",
  };

  return (
    <Card className="border border-green-200/80 bg-gradient-to-br from-green-50/40 via-white to-slate-50/50 shadow-xs rounded-2xl overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="pb-3 border-b border-green-100 bg-white/80">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 text-[10px] font-bold"
              >
                Hạng mục: {taskCategory}
              </Badge>
            </div>
            <CardTitle className="text-base font-extrabold text-slate-900 leading-snug">
              {task.code ? `${task.code} - ${task.name}` : task.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 text-xs">
        {/* Field: Loại công việc & Hạng mục cấu hình */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Loại công việc hạng mục
            </span>
            <p className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-green-600 shrink-0" />
              {getWorkTypeLabel(task.workType)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Hạng mục công việc
            </span>
            <p className="font-extrabold text-green-700 text-xs flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-green-600 shrink-0" />
              {taskCategory === "Dự kiến"
                ? "Dự kiến (Theo kế hoạch)"
                : "Phát sinh (Ngoài kế hoạch)"}
            </p>
          </div>
        </div> */}

        {/* Nhóm công việc (Mục đích kế hoạch) */}
        {/* <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Nhóm công việc (Mục đích kế hoạch)
          </span>
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-green-600 shrink-0" />
            {objective}
          </p>
        </div> */}

        {/* Thông số cập nhật nhật ký trước đó */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-500" />
            <span>Lịch sử cập nhật trước đó:</span>
            <span className="font-bold text-slate-800">{updatedCount} đợt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>Tiến độ hiện tại:</span>
            <span className="font-bold text-green-700">{completion}%</span>
          </div>
        </div>

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
              <p className="font-bold text-slate-800 truncate text-xs">
                {manager.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {manager.role}
              </p>
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
              <p className="font-bold text-slate-800 truncate text-xs">
                {inspector.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {inspector.role}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
