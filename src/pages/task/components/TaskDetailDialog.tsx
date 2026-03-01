import {
  Calendar as CalendarIcon,
  Package,
  ChevronRight,
  ClipboardList,
  FileCheck,
  Sprout,
  Users,
  MapPin,
  Clock,
  Layout,
  User,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  Badge,
  Card,
  ScrollArea,
  cn,
} from "@tankhang1/eco-shared-ui";
import { type Task } from "../../../stores/useTaskStore";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const priorityConfig = {
    high: {
      label: "Cao",
      color: "bg-rose-500",
      text: "text-rose-600",
      bg: "bg-rose-50",
    },
    medium: {
      label: "Thường",
      color: "bg-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
    low: {
      label: "Thấp",
      color: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  };

  const statusConfig = {
    pending: {
      label: "Chờ thực hiện",
      color: "bg-slate-400",
      text: "text-slate-600",
      bg: "bg-slate-50",
    },
    "in-progress": {
      label: "Đang làm",
      color: "bg-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    completed: {
      label: "Hoàn thành",
      color: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    overdue: {
      label: "Quá hạn",
      color: "bg-rose-600",
      text: "text-rose-600",
      bg: "bg-rose-50",
    },
  };

  const currentPriority = priorityConfig[task.priority];
  const currentStatus = statusConfig[task.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px]">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Layout className="w-32 h-32" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  "px-3 py-1 font-black uppercase text-[10px] tracking-widest border-none",
                  currentStatus.color,
                )}
              >
                {currentStatus.label}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/20 text-white/60 font-mono"
              >
                {task.code}
              </Badge>
            </div>

            <h2 className="text-3xl font-black tracking-tight">{task.name}</h2>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold">{task.startDate}</span>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-sm font-bold">{task.endDate}</span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10",
                  currentPriority.bg.replace("bg-", "bg-white/"),
                )}
              >
                <div
                  className={cn("w-2 h-2 rounded-full", currentPriority.color)}
                />
                <span
                  className={cn(
                    "text-xs font-black uppercase",
                    currentPriority.text.replace("text-", "text-"),
                  )}
                >
                  Ưu tiên: {currentPriority.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh] p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Source & Objective */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                  <Info className="w-4 h-4" />
                  Thông tin chi tiết
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none shadow-sm bg-white rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Căn cứ/Kế hoạch
                    </p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {task.plan}
                    </p>
                  </Card>
                  <Card className="border-none shadow-sm bg-white rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Giai đoạn thực hiện
                    </p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {task.stage}
                    </p>
                  </Card>
                </div>
              </section>

              {/* Description */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                  <ClipboardList className="w-4 h-4" />
                  Mô tả công việc
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm leading-relaxed text-slate-600 italic">
                  {task.description ||
                    "Không có mô tả chi tiết cho công việc này."}
                </div>
              </section>

              {/* Materials */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                  <Package className="w-4 h-4" />
                  Vật tư phân bổ ({task.materials?.length || 0})
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {task.materials && task.materials.length > 0 ? (
                    task.materials.map((m) => (
                      <div
                        key={m.id}
                        className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-50 group hover:border-emerald-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">
                              {m.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              {m.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-600">
                            {m.quantity}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                            {m.unit}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <p className="text-slate-400 text-sm italic">
                        Không sử dụng vật tư trong nhiệm vụ này
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* Assignees */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                  <Users className="w-4 h-4" />
                  Thực hiện
                </div>
                <div className="space-y-3">
                  {task.assignedTo.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white overflow-hidden">
                        {task.assignedType === "team" ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {task.assignedType === "team"
                            ? "Đội nhóm"
                            : "Thành viên"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Stats or Metadata */}
              <div className="bg-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <FileCheck className="w-24 h-24" />
                </div>
                <h4 className="font-black text-emerald-300 text-[10px] uppercase tracking-widest mb-4">
                  Nhật ký hệ thống
                </h4>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60">Ngày tạo</span>
                    <span className="font-bold">{task.createdAt}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60">Cập nhật</span>
                    <span className="font-bold">Hôm nay</span>
                  </div>
                  <div className="pt-2">
                    <Badge className="w-full justify-center bg-white/20 hover:bg-white/30 border-none text-white py-1.5 flex items-center gap-2">
                      <Sprout className="w-3 h-3" />
                      Canh tác hữu cơ
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
