import { useMemo, useState } from "react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Clock,
  History,
  Link2,
  PackageOpen,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import type { TaskHistoryItem } from "../mock/history.mock";

function formatDate(isoString: string) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const timeStr = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${timeStr} ${dateStr}`;
}

function getStatusBadge(status: string) {
  if (status === "COMPLETED") {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold gap-1 text-[11px]"
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Hoàn thành
      </Badge>
    );
  }
  if (status === "DOING") {
    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200 font-semibold gap-1 text-[11px]"
      >
        <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
        Đang thực hiện
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-slate-50 text-slate-600 border-slate-200 font-semibold text-[11px]"
    >
      Chưa thực hiện
    </Badge>
  );
}

export function UpdateDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: TaskHistoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [dialogSearchQuery, setDialogSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!task) return [];
    if (!dialogSearchQuery.trim()) return task.historyLogs;
    const q = dialogSearchQuery.toLowerCase().trim();
    return task.historyLogs.filter((log) => {
      const matchNote = log.note.toLowerCase().includes(q);
      const matchUser = log.updaterName.toLowerCase().includes(q);
      const matchRole = log.updaterRole?.toLowerCase().includes(q);
      const matchSupplies = log.supplies?.some(
        (s) =>
          s.name.toLowerCase().includes(q) || s.unit.toLowerCase().includes(q),
      );
      const matchDate = formatDate(log.updatedAt).toLowerCase().includes(q);
      return matchNote || matchUser || matchRole || matchSupplies || matchDate;
    });
  }, [task, dialogSearchQuery]);

  if (!task) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setDialogSearchQuery("");
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <DialogHeader className="pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 font-bold"
            >
              <Link2 className="w-3 h-3 mr-1" />
              Theo kế hoạch
            </Badge>
            <span className="text-xs font-mono font-bold text-slate-400">
              {task.taskCode}
            </span>
          </div>
          <DialogTitle className="text-lg font-extrabold text-slate-900 mt-1">
            {task.taskName}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 space-y-1">
            {task.workflowName && (
              <span className="block truncate font-medium text-slate-600">
                <span className="text-slate-400">Quy trình:</span>{" "}
                {task.workflowName}
              </span>
            )}
            {task.planName && (
              <span className="block truncate font-medium text-slate-600">
                <span className="text-slate-400">Kế hoạch:</span>{" "}
                {task.planName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Top Control Bar inside Dialog */}
        <div className="pt-3 pb-2 space-y-3 shrink-0">
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <History className="w-4 h-4 text-green-600" />
              Tổng số lần cập nhật nhật ký:
            </span>
            <Badge className="bg-green-600 text-white font-bold px-2.5 py-0.5 rounded-lg text-xs">
              {task.historyLogs.length} đợt
            </Badge>
          </div>

          {/* Search Box inside Dialog */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm theo nội dung, người cập nhật, vật tư..."
              value={dialogSearchQuery}
              onChange={(e) => setDialogSearchQuery(e.target.value)}
              className="h-9 text-xs bg-slate-50 border-slate-200 pl-10 rounded-xl focus:bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Scrollable Timeline Container */}
        <div className="flex-1 overflow-y-auto pr-2 pt-2 min-h-0 space-y-5">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              Không tìm thấy nhật ký cập nhật nào khớp từ khóa "
              {dialogSearchQuery}".
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {filteredLogs.map((log, idx) => (
                <div key={log.id} className="relative group">
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-6 top-1 h-5 w-5 rounded-full border-2 bg-white flex items-center justify-center ${
                      idx === 0
                        ? "border-green-600 text-green-600 shadow-sm"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        idx === 0 ? "bg-green-600" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-2xs space-y-3 hover:border-slate-300 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {log.updaterName}
                          </span>
                          {log.updaterRole && (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              {log.updaterRole}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatDate(log.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.completionPercent !== undefined && (
                          <span className="text-xs font-extrabold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg">
                            {log.completionPercent}% hoàn thành
                          </span>
                        )}
                        {getStatusBadge(log.status)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      {log.note}
                    </p>

                    {/* Allocated actual supplies */}
                    {log.supplies && log.supplies.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <PackageOpen className="w-3.5 h-3.5 text-amber-600" />
                          Vật tư đã sử dụng ({log.supplies.length}):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {log.supplies.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between text-xs bg-amber-50/50 border border-amber-100 rounded-xl px-3 py-1.5"
                            >
                              <span className="font-semibold text-slate-800 truncate">
                                {s.name}
                              </span>
                              <span className="font-bold text-slate-700 text-[11px] shrink-0 ml-2">
                                Thực tế: {s.actualQty} {s.unit}
                                {s.plannedQty && (
                                  <span className="text-slate-400 font-normal ml-1">
                                    (KH: {s.plannedQty})
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
