import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarRange, MapPin, Sprout } from "lucide-react";
import { formatDate, getDomainLabel } from "../../constants";
import type { DiaryEntry } from "../../types";

const DOMAIN_BADGE: Record<DiaryEntry["workflow"]["domainCode"], string> = {
  CROP: "bg-green-50 text-green-700 border-green-200",
  LIVESTOCK: "bg-amber-50 text-amber-700 border-amber-200",
  AQUACULTURE: "bg-sky-50 text-sky-700 border-sky-200",
};

export function SeasonTab({ entry }: { entry: DiaryEntry }) {
  const { workflow } = entry;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-slate-400 font-bold">
                {workflow.code}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold ${DOMAIN_BADGE[workflow.domainCode]}`}
              >
                {getDomainLabel(workflow.domainCode)}
              </Badge>
            </div>
            <h4 className="font-bold text-slate-800 mt-0.5">{workflow.name}</h4>
            <p className="text-xs text-slate-500 mt-1">{workflow.scopeLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
            <CalendarRange className="h-3.5 w-3.5" /> Bắt đầu
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(workflow.plannedStartDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
            <CalendarRange className="h-3.5 w-3.5" /> Kết thúc
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(workflow.plannedEndDate)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> Vị trí áp dụng nhật ký
        </p>
        <p className="text-sm font-semibold text-slate-800">
          {[entry.region, entry.area, entry.plot].filter(Boolean).join(" › ")}
        </p>
      </div>
    </div>
  );
}
