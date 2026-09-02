import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, Clock, History, User } from "lucide-react";
import { formatDate, formatDateTime, STATUS_CONFIG } from "../../constants";
import type { DiaryEntry } from "../../types";

function diffDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

export function TimeTab({ entry }: { entry: DiaryEntry }) {
  const status = STATUS_CONFIG[entry.status];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Ngày bắt đầu
          </p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {formatDate(entry.startDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Ngày kết thúc
          </p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {formatDate(entry.endDate)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Thời lượng thực hiện
          </span>
        </div>
        <span className="text-sm font-black text-slate-800">
          {diffDays(entry.startDate, entry.endDate)} ngày
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trạng thái hiện tại
        </span>
        <Badge variant="outline" className={`text-[10px] font-bold ${status.cls}`}>
          {status.label}
        </Badge>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <History className="h-3.5 w-3.5" /> Lịch sử cập nhật
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Ngày tạo nhật ký</span>
          <span className="font-semibold text-slate-700">
            {formatDateTime(entry.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Cập nhật gần nhất</span>
          <span className="font-semibold text-slate-700">
            {formatDateTime(entry.updatedAt)}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> Người thực hiện
        </p>
        {entry.personnel.length > 0 ? (
          <div className="space-y-1.5">
            {entry.personnel.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-slate-50 rounded-lg border border-slate-100 px-3 py-2 text-xs"
              >
                <span className="font-semibold text-slate-700">{p.fullName}</span>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold bg-white border-slate-200 text-slate-500"
                >
                  {p.role === "SUPERVISOR" ? "Giám sát" : "Thực hiện"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Chưa phân công nhân sự.</p>
        )}
      </div>
    </div>
  );
}
