import { useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  FileText,
  History,
  Layers,
  PackageOpen,
  Plus,
  Search,
  Sprout,
  User,
  Zap,
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import {
  MOCK_PLANS,
  MOCK_TASKS,
  MOCK_TASKS_LIST,
  MOCK_UPDATE_HISTORY,
  MOCK_WORKFLOWS,
  type TaskHistoryItem,
} from "./mock/history.mock";
import { WorkflowScopeMapModal } from "./components/WorkflowScopeMapModal";

function formatDate(isoString?: string) {
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

function getWorkTypeBadge(catName?: string) {
  const name = (catName || "").toLowerCase();
  if (name.includes("thu hoạch") || name.includes("harvest")) {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-xl"
      >
        <Zap className="w-3.5 h-3.5 text-amber-600" />
        Thu hoạch
      </Badge>
    );
  }
  if (name.includes("cải tạo")) {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-xl"
      >
        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
        Cải tạo đất
      </Badge>
    );
  }
  if (name.includes("điều trị") || name.includes("thuốc")) {
    return (
      <Badge
        variant="outline"
        className="bg-rose-50 text-rose-700 border-rose-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-xl"
      >
        <Layers className="w-3.5 h-3.5 text-rose-600" />
        Phun thuốc / Điều trị
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-purple-50 text-purple-700 border-purple-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-xl"
    >
      <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
      Canh tác
    </Badge>
  );
}

export default function UpdateHistoryDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [, setLocation] = useLocation();
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Find task item from MOCK_UPDATE_HISTORY or fallback
  const taskHistoryItem: TaskHistoryItem | undefined = useMemo(() => {
    if (!taskId) return undefined;
    const found = MOCK_UPDATE_HISTORY.find(
      (item) =>
        String(item.id) === String(taskId) ||
        item.taskCode.toLowerCase() === String(taskId).toLowerCase(),
    );
    if (found) return found;

    // Fallback search from MOCK_TASKS_LIST or MOCK_TASKS
    const taskObj =
      MOCK_TASKS_LIST.find((t) => String(t.id) === String(taskId)) ||
      MOCK_TASKS.find((t) => String(t.id) === String(taskId));

    if (taskObj) {
      const planObj = MOCK_PLANS.find(
        (p) =>
          String(p.id) === String((taskObj as any).planId || taskObj.plan?.id),
      );
      const workflowObj = MOCK_WORKFLOWS.find(
        (w) =>
          String(w.id) ===
          String(planObj?.workflowId || (taskObj as any).workflow?.id || "38"),
      );

      return {
        id: taskObj.id,
        taskCode: taskObj.code,
        taskName: taskObj.name,
        origin: "PLANNED",
        workflowCode: workflowObj?.code || "WKF-0000035",
        workflowName: workflowObj
          ? `${workflowObj.code} - ${workflowObj.name}`
          : "Vụ mùa chuẩn",
        workflowId: workflowObj?.id || 38,
        planCode: planObj?.code || "PLN-3801",
        planName: planObj?.name || "Kế hoạch Canh tác",
        planId: planObj?.id || 3801,
        taskCategoryName: (taskObj as any).taskCategory?.name || "Canh tác",
        latestUpdate: {
          id: `upd-${taskObj.id}-1`,
          updatedAt: taskObj.updatedAt || new Date().toISOString(),
          updaterName: "Người cập nhật",
          updaterRole: "Kỹ thuật viên",
          completionPercent: 60,
          status: "DOING",
          note:
            taskObj.description ||
            taskObj.note ||
            "Đã cập nhật tiến độ công việc.",
          supplies: [],
        },
        historyLogs: [
          {
            id: `upd-${taskObj.id}-1`,
            updatedAt: taskObj.updatedAt || new Date().toISOString(),
            updaterName: "Người cập nhật",
            updaterRole: "Kỹ thuật viên",
            completionPercent: 60,
            status: "DOING",
            note:
              taskObj.description ||
              taskObj.note ||
              "Đã cập nhật tiến độ công việc.",
            supplies: [],
          },
        ],
      };
    }

    return undefined;
  }, [taskId]);

  // Find workflow item for map scope modal
  const selectedWorkflow = useMemo(() => {
    if (!taskHistoryItem?.workflowId) return MOCK_WORKFLOWS[0];
    return (
      MOCK_WORKFLOWS.find(
        (w) => String(w.id) === String(taskHistoryItem.workflowId),
      ) || MOCK_WORKFLOWS[0]
    );
  }, [taskHistoryItem]);

  // Filter history logs inside this task
  const filteredLogs = useMemo(() => {
    if (!taskHistoryItem) return [];
    if (!logSearchQuery.trim()) return taskHistoryItem.historyLogs;
    const q = logSearchQuery.toLowerCase().trim();
    return taskHistoryItem.historyLogs.filter((log) => {
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
  }, [taskHistoryItem, logSearchQuery]);

  // Aggregated supplies used across all history logs
  const aggregatedSupplies = useMemo(() => {
    if (!taskHistoryItem) return [];
    const map = new Map<
      string,
      {
        name: string;
        plannedQty?: string;
        actualQtyTotal: number;
        unit: string;
      }
    >();

    taskHistoryItem.historyLogs.forEach((log) => {
      (log.supplies || []).forEach((s) => {
        const key = s.name.toLowerCase();
        const existing = map.get(key);
        const actualNum = parseFloat(s.actualQty) || 0;
        if (existing) {
          existing.actualQtyTotal += actualNum;
        } else {
          map.set(key, {
            name: s.name,
            plannedQty: s.plannedQty,
            actualQtyTotal: actualNum,
            unit: s.unit,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [taskHistoryItem]);

  // Aggregated harvest total across all history logs
  const aggregatedHarvest = useMemo(() => {
    if (!taskHistoryItem) return [];
    const map = new Map<
      string,
      { targetLabel: string; quantityTotal: number; unit: string }
    >();

    taskHistoryItem.historyLogs.forEach((log) => {
      (log.harvestDetails || []).forEach((h) => {
        const key = `${h.targetLabel}_${h.unit}`.toLowerCase();
        const existing = map.get(key);
        const qtyNum = parseFloat(h.quantity) || 0;
        if (existing) {
          existing.quantityTotal += qtyNum;
        } else {
          map.set(key, {
            targetLabel: h.targetLabel,
            quantityTotal: qtyNum,
            unit: h.unit,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [taskHistoryItem]);

  const currentPercent = taskHistoryItem?.latestUpdate?.completionPercent ?? 60;

  if (!taskHistoryItem) {
    return (
      <PageWrapper
        title="Không tìm thấy nhật ký công việc"
        description="Rất tiếc, công việc dự kiến bạn tìm kiếm không tồn tại hoặc đã bị xóa."
        actions={
          <Button
            variant="outline"
            className="h-10 px-4 text-sm gap-2"
            onClick={() => setLocation("/diary/update")}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại danh sách
          </Button>
        }
      >
        <div className="py-20 text-center space-y-4">
          <p className="text-slate-500 font-medium">
            Mã nhật ký công việc <code className="font-bold">{taskId}</code>{" "}
            không có dữ liệu.
          </p>
          <Button
            className="text-white font-bold px-6 py-2"
            onClick={() => setLocation("/diary/update")}
          >
            Trở về Lịch sử cập nhật
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`[${taskHistoryItem.taskCode}] ${taskHistoryItem.taskName}`}
      description="Xem chi tiết các lần ghi nhận nhật ký của bản thân đối với hạng mục dự kiến này"
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-4 text-sm font-semibold gap-2 border-slate-200 hover:bg-slate-50 cursor-pointer"
            onClick={() => setLocation("/diary/update")}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button
            className="h-10 px-4 text-sm font-bold text-white gap-2 cursor-pointer"
            onClick={() => setLocation(`/diary/plan/${taskHistoryItem.id}`)}
          >
            <Plus className="h-4 w-4" />
            Cập nhật đợt mới
          </Button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── CỘT TRÁI (COL 8): THÔNG TIN HẠNG MỤC DỰ KIẾN & NỘI DUNG NHẬT KÝ ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Thông tin hạng mục công việc dự kiến */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {taskHistoryItem.taskCode}
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {taskHistoryItem.taskName}
                    </h2>
                  </div>
                </div>

                <div>{getWorkTypeBadge(taskHistoryItem.taskCategoryName)}</div>
              </div>

              {/* Grid Thông tin Vụ mùa & Kế hoạch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vụ mùa / Vụ nuôi */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-green-600" />
                    Vụ mùa / Vụ nuôi
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">
                    {taskHistoryItem.workflowName || "Vụ mùa canh tác"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Mã vụ:{" "}
                    <span className="font-mono font-bold text-slate-700">
                      {taskHistoryItem.workflowCode ||
                        selectedWorkflow?.code ||
                        "WKF-0000035"}
                    </span>
                  </p>
                </div>

                {/* Kế hoạch */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Kế hoạch sản xuất
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">
                    {taskHistoryItem.planName || "Kế hoạch canh tác"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Mã kế hoạch:{" "}
                    <span className="font-mono font-bold text-slate-700">
                      {taskHistoryItem.planCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Bản đồ phạm vi Mùa vụ */}
              {selectedWorkflow && (
                <WorkflowScopeMapModal workflow={selectedWorkflow} />
              )}

              {/* Tiến độ hoàn thành hiện tại */}
              <div className="space-y-2 rounded-xl border border-green-100 bg-green-50/40 p-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Tiến độ hoàn thành hạng mục hiện tại
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${
                        currentPercent === 100
                          ? "text-green-700 bg-green-100 border-green-200"
                          : "text-amber-700 bg-amber-100 border-amber-200"
                      }`}
                    >
                      {currentPercent}% hoàn thành
                    </span>
                    {100 - currentPercent > 0 && (
                      <span className="text-xs font-semibold text-slate-400">
                        (Còn lại: {100 - currentPercent}%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentPercent}%` }}
                  />
                </div>
              </div>

              {/* Tổng hợp Vật tư ghi nhận thực tế */}
              {aggregatedSupplies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <PackageOpen className="w-4 h-4 text-amber-600" />
                    Tổng hợp vật tư đã sử dụng qua các đợt cập nhật (
                    {aggregatedSupplies.length}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aggregatedSupplies.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-amber-50/50 border border-amber-100 rounded-xl px-3.5 py-2"
                      >
                        <span className="font-bold text-slate-800 truncate">
                          {s.name}
                        </span>
                        <span className="font-extrabold text-amber-700 text-xs shrink-0 ml-2">
                          Thực tế: {s.actualQtyTotal} {s.unit}
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

              {/* Tổng hợp sản lượng Thu hoạch tích lũy */}
              {aggregatedHarvest.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Tổng sản lượng thu hoạch tích lũy (
                    {aggregatedHarvest.length} đối tượng):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aggregatedHarvest.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/90 rounded-xl px-3.5 py-2"
                      >
                        <span className="font-bold text-slate-800 truncate">
                          {h.targetLabel}
                        </span>
                        <span className="font-extrabold text-amber-700 text-xs shrink-0 ml-2">
                          {h.quantityTotal} {h.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Lịch sử các lần ghi nhận nhật ký của bản thân (Timeline Audit) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Lịch sử ghi nhận nhật ký của bản thân
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tổng số{" "}
                      <span className="font-bold text-slate-800">
                        {taskHistoryItem.historyLogs.length} đợt
                      </span>{" "}
                      cập nhật nhật ký được ghi nhận
                    </p>
                  </div>
                </div>

                {/* Search Box trong danh sách đợt nhật ký */}
                <div className="relative sm:w-64">
                  <Input
                    type="text"
                    placeholder="Tìm theo nội dung, vật tư, ngày..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="h-9 text-xs bg-slate-50 border-slate-200 pl-10 rounded-xl focus:bg-white"
                  />
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Timeline Items */}
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  Không tìm thấy đợt nhật ký nào khớp từ khóa "{logSearchQuery}
                  ".
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {filteredLogs.map((log, idx) => (
                    <div key={log.id} className="relative group">
                      {/* Timeline node marker */}
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

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 hover:border-slate-300 transition-all">
                        {/* Header đợt nhật ký */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {log.updaterName}
                              </span>
                              {log.updaterRole && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
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
                              <span
                                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${
                                  log.completionPercent === 100
                                    ? "text-green-700 bg-green-50 border-green-200"
                                    : "text-amber-700 bg-amber-50 border-amber-200"
                                }`}
                              >
                                {log.completionPercent}% hoàn thành
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Nội dung báo cáo đợt đó */}
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            Nội dung cập nhật đợt này:
                          </p>
                          <p className="text-xs text-slate-700 font-normal leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            {log.note}
                          </p>
                        </div>

                        {/* Vật tư đã ghi nhận đợt đó */}
                        {log.supplies && log.supplies.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                              <PackageOpen className="w-3.5 h-3.5 text-amber-600" />
                              Vật tư sử dụng đợt này ({log.supplies.length}):
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

                        {/* Sản lượng Thu hoạch ghi nhận đợt đó */}
                        {log.harvestDetails &&
                          log.harvestDetails.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-amber-600" />
                                Sản lượng thu hoạch đợt này (
                                {log.harvestDetails.length} đối tượng):
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {log.harvestDetails.map((h) => (
                                  <div
                                    key={h.id}
                                    className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-1.5"
                                  >
                                    <span className="font-semibold text-slate-800 truncate">
                                      {h.targetLabel}
                                    </span>
                                    <span className="font-extrabold text-amber-700 text-xs shrink-0 ml-2">
                                      {h.quantity} {h.unit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Hình ảnh bằng chứng đợt đó */}
                        {log.images && log.images.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-green-600" />
                              Hình ảnh bằng chứng đợt này ({
                                log.images.length
                              }{" "}
                              ảnh):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {log.images.map((imgUrl, i) => (
                                <div
                                  key={i}
                                  className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:border-green-500 transition-all cursor-pointer"
                                  onClick={() => setPreviewImage(imgUrl)}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Bằng chứng ${i + 1}`}
                                    className="w-16 h-16 object-cover group-hover:scale-105 transition-transform"
                                  />
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
          </div>

          {/* ── CỘT PHẢI (COL 4): TỔNG QUAN THỐNG KÊ & THAO TÁC ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card Tổng quan thông số đợt cập nhật */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-green-600" />
                Tổng quan nhật ký công việc
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    Mã công việc:
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {taskHistoryItem.taskCode}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    Tổng số đợt ghi nhận:
                  </span>
                  <span className="font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                    {taskHistoryItem.historyLogs.length} đợt
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    Lần cập nhật mới nhất:
                  </span>
                  <span className="font-bold text-slate-700">
                    {formatDate(taskHistoryItem.latestUpdate?.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-slate-500 font-medium">
                    Người cập nhật gần nhất:
                  </span>
                  <span className="font-bold text-slate-800">
                    {taskHistoryItem.latestUpdate?.updaterName}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Thao tác nhanh */}
            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-green-900 font-bold text-xs">
                <Plus className="w-4 h-4 text-green-600" />
                Cập nhật thêm đợt nhật ký mới
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn muốn tiếp tục ghi nhận tiến độ hoặc vật tư cho hạng mục công
                việc dự kiến này?
              </p>
              <Button
                className="w-full h-10 font-bold text-white shadow-md shadow-green-600/20 cursor-pointer"
                onClick={() => setLocation(`/diary/plan/${taskHistoryItem.id}`)}
              >
                Cập nhật nhật ký ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Phóng to Xem Hình Ảnh Bằng Chứng */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-4 bg-slate-900 border-slate-800 rounded-2xl overflow-hidden text-white">
          <div className="relative flex flex-col items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Phóng to hình ảnh bằng chứng"
                className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
