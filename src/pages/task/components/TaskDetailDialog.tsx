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
  Shield,
  ClipboardCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  Badge,
  Card,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type Task } from "../../../stores/useTaskStore";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MATERIAL_TYPE_LABELS: Record<string, string> = {
  fertilizer: "Phân bón",
  pesticide: "Thuốc BVTV",
  tool: "Dụng cụ",
  other: "Khác",
};

const MATERIAL_TYPE_COLORS: Record<string, string> = {
  fertilizer: "text-emerald-600 bg-emerald-50",
  pesticide: "text-rose-600 bg-rose-50",
  tool: "text-blue-600 bg-blue-50",
  other: "text-slate-600 bg-slate-50",
};

export default function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const priorityConfig = {
    high: { label: "Cao", color: "bg-rose-500", dot: "bg-rose-400" },
    medium: { label: "Thường", color: "bg-amber-500", dot: "bg-amber-400" },
    low: { label: "Thấp", color: "bg-emerald-500", dot: "bg-emerald-400" },
  };

  const statusConfig = {
    pending: { label: "Chờ thực hiện", color: "bg-slate-400" },
    "in-progress": { label: "Đang thực hiện", color: "bg-blue-500" },
    completed: { label: "Hoàn thành", color: "bg-emerald-500" },
    overdue: { label: "Quá hạn", color: "bg-rose-600" },
  };

  const currentPriority = priorityConfig[task.priority];
  const currentStatus = statusConfig[task.status];

  const hasSupervisors = (task.supervisors?.length ?? 0) > 0;
  const hasInspectors = (task.qualityInspectors?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px]">
        {/* ── HEADER ── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Layout className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            {/* Status + Code badges */}
            <div className="flex items-center gap-3 flex-wrap">
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
              <Badge
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase border-none",
                  currentPriority.color,
                )}
              >
                Ưu tiên: {currentPriority.label}
              </Badge>
            </div>

            <h2 className="text-3xl font-black tracking-tight leading-snug">
              {task.name}
            </h2>

            {/* Date row */}
            <div className="flex flex-wrap gap-3 items-center pt-1">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold">{task.startDate}</span>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-sm font-bold">{task.endDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold opacity-80">
                  {task.plan}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <ScrollArea className="max-h-[70vh] bg-slate-50/50">
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ── LEFT (2/3) ── */}
            <div className="md:col-span-2 space-y-8">
              {/* Thông tin chi tiết */}
              <section className="space-y-4">
                <SectionTitle icon={<Info className="w-4 h-4" />}>
                  Thông tin chi tiết
                </SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none shadow-sm bg-white rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                      Căn cứ / Kế hoạch
                    </p>
                    <p className="font-bold text-slate-800 text-sm flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {task.plan || "—"}
                    </p>
                  </Card>
                  <Card className="border-none shadow-sm bg-white rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                      Giai đoạn thực hiện
                    </p>
                    <p className="font-bold text-slate-800 text-sm flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      {task.stage || "Toàn chu kỳ"}
                    </p>
                  </Card>
                </div>
              </section>

              {/* Mô tả */}
              <section className="space-y-4">
                <SectionTitle icon={<ClipboardList className="w-4 h-4" />}>
                  Mô tả công việc
                </SectionTitle>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm leading-relaxed text-slate-600 italic text-sm">
                  {task.description ||
                    "Không có mô tả chi tiết cho công việc này."}
                </div>
              </section>

              {/* Vật tư */}
              <section className="space-y-4">
                <SectionTitle icon={<Package className="w-4 h-4" />}>
                  Vật tư phân bổ ({task.materials?.length ?? 0})
                </SectionTitle>
                <div className="grid grid-cols-1 gap-3">
                  {task.materials && task.materials.length > 0 ? (
                    task.materials.map((m) => {
                      const matName =
                        (m as any).materialName ?? (m as any).name ?? "—";
                      const matType =
                        (m as any).materialType ??
                        (m as any).materialCategory ??
                        (m as any).type ??
                        "other";
                      const colorCls =
                        MATERIAL_TYPE_COLORS[matType] ??
                        MATERIAL_TYPE_COLORS.other;
                      return (
                        <div
                          key={m.id}
                          className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                colorCls,
                              )}
                            >
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm leading-none mb-1">
                                {matName}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border-none px-2 py-0 h-4"
                              >
                                {MATERIAL_TYPE_LABELS[matType] ?? matType}
                              </Badge>
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
                      );
                    })
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <Package className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm italic">
                        Không sử dụng vật tư trong nhiệm vụ này
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ── RIGHT (1/3) ── */}
            <div className="space-y-6">
              {/* Nhân sự thực hiện */}
              <section className="space-y-3">
                <SectionTitle icon={<Users className="w-4 h-4" />}>
                  Thực hiện
                </SectionTitle>
                <div className="space-y-2">
                  {task.assignedTo.length > 0 ? (
                    task.assignedTo.map((name, idx) => (
                      <PersonRow
                        key={idx}
                        name={name}
                        sub={
                          task.assignedType === "team" ? "Đội nhóm" : "Cá nhân"
                        }
                        icon={
                          task.assignedType === "team" ? (
                            <Users className="w-4 h-4 text-blue-400" />
                          ) : (
                            <User className="w-4 h-4 text-emerald-400" />
                          )
                        }
                      />
                    ))
                  ) : (
                    <EmptyPersonSection label="Chưa phân công" />
                  )}
                </div>
              </section>

              {/* Nhân sự quản lý */}
              <section className="space-y-3">
                <SectionTitle
                  icon={<Shield className="w-4 h-4 text-blue-500" />}
                >
                  Nhân sự quản lý
                </SectionTitle>
                <div className="space-y-2">
                  {hasSupervisors ? (
                    task.supervisors!.map((name, idx) => (
                      <PersonRow
                        key={idx}
                        name={name}
                        sub="Quản lý"
                        icon={<Shield className="w-4 h-4 text-blue-400" />}
                        accentBg="bg-blue-50"
                        accentBorder="border-blue-100"
                      />
                    ))
                  ) : (
                    <EmptyPersonSection label="Chưa có nhân sự quản lý" />
                  )}
                </div>
              </section>

              {/* Kiểm định chất lượng */}
              <section className="space-y-3">
                <SectionTitle
                  icon={<ClipboardCheck className="w-4 h-4 text-violet-500" />}
                >
                  Kiểm định chất lượng
                </SectionTitle>
                <div className="space-y-2">
                  {hasInspectors ? (
                    task.qualityInspectors!.map((name, idx) => (
                      <PersonRow
                        key={idx}
                        name={name}
                        sub="Kiểm định"
                        icon={
                          <ClipboardCheck className="w-4 h-4 text-violet-400" />
                        }
                        accentBg="bg-violet-50"
                        accentBorder="border-violet-100"
                      />
                    ))
                  ) : (
                    <EmptyPersonSection label="Chưa có nhân sự kiểm định" />
                  )}
                </div>
              </section>

              {/* Nhật ký hệ thống */}
              <div className="bg-emerald-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
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
                    <span className="opacity-60">Trạng thái</span>
                    <span className="font-bold">{currentStatus.label}</span>
                  </div>
                  <div className="pt-2">
                    <Badge className="w-full justify-center bg-white/20 hover:bg-white/30 border-none text-white py-1.5 flex items-center gap-2 text-[10px]">
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

/* ───── Helper sub-components ───── */

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
      {icon}
      {children}
    </div>
  );
}

function PersonRow({
  name,
  sub,
  icon,
  accentBg = "bg-slate-100",
  accentBorder = "border-slate-100",
}: {
  name: string;
  sub: string;
  icon: React.ReactNode;
  accentBg?: string;
  accentBorder?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 bg-white rounded-2xl border shadow-sm",
        accentBorder,
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          accentBg,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-black text-slate-800 leading-none mb-0.5">
          {name}
        </p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          {sub}
        </p>
      </div>
    </div>
  );
}

function EmptyPersonSection({ label }: { label: string }) {
  return (
    <div className="py-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
      <p className="text-xs text-slate-400 italic">{label}</p>
    </div>
  );
}
