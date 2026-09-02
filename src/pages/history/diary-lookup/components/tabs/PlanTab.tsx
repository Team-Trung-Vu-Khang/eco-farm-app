import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList, MapPin, Target, Timer } from "lucide-react";
import { formatDate } from "../../constants";
import type { DiaryEntry, DiaryPlanRef } from "../../types";

const PLAN_STATUS: Record<DiaryPlanRef["status"], { label: string; cls: string }> = {
  DRAFT: { label: "Bản nháp", cls: "bg-slate-50 text-slate-600 border-slate-200" },
  ACTIVE: { label: "Đang triển khai", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Đã hoàn thành", cls: "bg-green-50 text-green-700 border-green-200" },
};

export function PlanTab({ entry }: { entry: DiaryEntry }) {
  const { plan } = entry;
  const status = PLAN_STATUS[plan.status];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-slate-400 font-bold">
                {plan.code}
              </span>
              <Badge variant="outline" className={`text-[10px] font-bold ${status.cls}`}>
                {status.label}
              </Badge>
            </div>
            <h4 className="font-bold text-slate-800 mt-0.5">{plan.name}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" /> Mục đích kế hoạch
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{plan.purpose}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ngày bắt đầu
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(plan.plannedStartDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ngày kết thúc
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(plan.plannedEndDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
            <Timer className="h-3 w-3" /> Thời lượng
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {plan.durationDays} ngày
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> Phạm vi áp dụng
        </p>
        <p className="text-sm font-semibold text-slate-800">{plan.scopeNote}</p>
      </div>
    </div>
  );
}
