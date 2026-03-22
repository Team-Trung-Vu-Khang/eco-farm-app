import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Package,
  FileCheck,
  Sprout,
  Users,
  MapPin,
  User,
  Info,
  Apple,
  Bug,
  AlertTriangle,
  Play,
  CheckCircle2,
  AlertCircle,
  Circle,
  Search,
  Shield,
  ClipboardCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  Badge,
  ScrollArea,
  cn,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type Task } from "../../../stores/useTaskStore";
import useRegionStore from "../../../stores/useRegionStore";

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
  const { regions } = useRegionStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (!task) return null;

  const priorityConfig = {
    high: { label: "Cao", color: "bg-rose-500", icon: AlertTriangle },
    medium: { label: "Thường", color: "bg-amber-500", icon: AlertCircle },
    low: { label: "Thấp", color: "bg-emerald-500", icon: Info },
  };

  const statusConfig = {
    pending: {
      label: "Chờ thực hiện",
      color: "bg-slate-400 text-white",
      icon: Circle,
    },
    "in-progress": {
      label: "Đang thực hiện",
      color: "bg-blue-500 text-white",
      icon: Play,
    },
    completed: {
      label: "Hoàn thành",
      color: "bg-emerald-500 text-white",
      icon: CheckCircle2,
    },
    overdue: {
      label: "Quá hạn",
      color: "bg-rose-600 text-white",
      icon: AlertCircle,
    },
  };

  const currentPriority = priorityConfig[task.priority];
  const currentStatus = statusConfig[task.status];

  // Deriving objective type for styling (matching logic from TaskEditPage)
  const objectiveConfig: Record<
    string,
    { label: string; icon: any; color: string }
  > = {
    "theo-ke-hoach": {
      label: "Canh tác",
      icon: Sprout,
      color: "text-blue-600 bg-blue-50",
    },
    "thu-hoach": {
      label: "Thu hoạch",
      icon: Apple,
      color: "text-orange-600 bg-orange-50",
    },
    "cai-tao-dat": {
      label: "Cải tạo",
      icon: Sprout,
      color: "text-emerald-600 bg-emerald-50",
    },
    "tri-benh": {
      label: "Điều trị",
      icon: Bug,
      color: "text-rose-600 bg-rose-50",
    },
    "phat-sinh": {
      label: "Phát sinh",
      icon: Info,
      color: "text-amber-600 bg-amber-50",
    },
  };

  const getObjectiveType = () => {
    if (
      !task.plan ||
      task.plan === "N/A" ||
      task.plan === "Công việc phát sinh"
    )
      return "phat-sinh";
    const p = task.plan.toLowerCase();
    if (p.includes("thu hoạch")) return "thu-hoach";
    if (p.includes("cải tạo")) return "cai-tao-dat";
    if (p.includes("trị bệnh") || p.includes("điều trị")) return "tri-benh";
    return "theo-ke-hoach";
  };

  const objType = getObjectiveType();
  const currentObj = objectiveConfig[objType];

  const getSelectionSummary = (selections: any[]) => {
    if (!selections || selections.length === 0) return [];

    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    selections.forEach((sel) => {
      const region = regions.find((r) => String(r.id) === String(sel.regionId));
      if (!region) return;

      let group = summary.find((s) => s.regionId === sel.regionId);
      if (!group) {
        group = {
          regionId: sel.regionId,
          regionName: region.name,
          items: [],
        };
        summary.push(group);
      }

      if (sel.type === "region") {
        group.items.push({
          type: "region",
          id: sel.id,
          name: "Toàn bộ vùng " + region.name,
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        group.items.push({
          type: "area",
          id: sel.id,
          name: "Khu vực " + (area?.name || sel.areaId),
        });
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p: any) => String(p.id) === String(sel.plotId),
        );
        group.items.push({
          type: "plot",
          id: sel.id,
          name: "Lô " + (plot?.name || sel.plotId),
          parentName: area?.name,
        });
      }
    });

    return summary;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-4xl bg-white">
        {/* ── HEADER ── */}
        <div className="p-8 border-b border-slate-100 space-y-8 bg-slate-50/20">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none max-w-2xl">
              {task.name}
            </h2>
            <div className="flex flex-col gap-3 items-end shrink-0">
              <Badge
                className={cn(
                  "px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none shadow-sm flex items-center gap-2",
                  currentPriority.color,
                )}
              >
                <currentPriority.icon className="w-3.5 h-3.5" />
                Ưu tiên: {currentPriority.label}
              </Badge>
              <Badge
                className={cn(
                  "px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none shadow-sm flex items-center gap-2",
                  currentStatus.color,
                )}
              >
                <currentStatus.icon className="w-3.5 h-3.5" />
                Trạng thái: {currentStatus.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Loại hình
              </p>
              <div
                className={cn(
                  "p-3 rounded-2xl flex items-center gap-3 border border-slate-100 bg-white shadow-sm transition-all",
                  currentObj.color,
                )}
              >
                <div className="p-2 rounded-lg bg-white shadow-xs">
                  <currentObj.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight">
                  {currentObj.label}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Bắt đầu
              </p>
              <div className="p-3 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                  <CalendarIcon className="w-4 h-4 text-emerald-500" />
                  {task.startDate}
                </div>
                <div className="text-[10px] text-slate-400 italic ml-6 opacity-60">
                  (Dự kiến: {task.startDate})
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Kết thúc
              </p>
              <div className="p-3 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                  <CalendarIcon className="w-4 h-4 text-rose-500" />
                  {task.endDate}
                </div>
                <div className="text-[10px] text-slate-400 italic ml-6 opacity-60">
                  (Dự kiến: {task.endDate})
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Căn cứ / Kế hoạch
              </p>
              <div className="p-3 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {task.plan || "Phát sinh"}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                    {task.stage || "Toàn chu kỳ"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <ScrollArea className="max-h-[70vh]">
          <div className="p-8 space-y-12">
            {(
              task.tasks || [
                {
                  id: 0,
                  name: task.name,
                  startDate: task.startDate,
                  endDate: task.endDate,
                  geographicalSelections: task.geographicalSelections,
                  labor: task.assignedTo.join(", "),
                },
              ]
            ).map((t: any, idx: number) => {
              const itemMaterials =
                task.materials?.filter(
                  (m) => String((m as any).taskId) === String(t.id),
                ) || [];
              const taskPersonnel = t.labor
                ? t.labor.split(", ").filter(Boolean)
                : [];
              const geoSummary = getSelectionSummary(
                t.geographicalSelections || [],
              );

              return (
                <div
                  key={t.id || idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-100 pb-12 last:border-none last:pb-0"
                >
                  {/* Left Column - Main Details */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-slate-800 leading-tight">
                        {t.name}
                      </h4>

                      <div className="space-y-3">
                        <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Phạm vi thực hiện
                          </div>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {geoSummary.length > 0 ? (
                              geoSummary.map((group) => (
                                <div
                                  key={group.regionId}
                                  className="flex flex-wrap gap-1.5"
                                >
                                  {group.items.map((item, iIdx) => (
                                    <Badge
                                      key={iIdx}
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] py-0 h-5 font-bold border-slate-100",
                                        item.type === "region"
                                          ? "bg-emerald-50 text-emerald-600"
                                          : "bg-blue-50 text-blue-600",
                                      )}
                                    >
                                      {item.name}
                                    </Badge>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">
                                Chưa xác định
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CalendarIcon className="w-4 h-4" />
                          Từ ngày:{" "}
                          <span className="font-bold text-slate-700">
                            {t.startDate || task.startDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CalendarIcon className="w-4 h-4" />
                          Đến ngày:{" "}
                          <span className="font-bold text-slate-700">
                            {t.endDate || task.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {itemMaterials.map((m) => {
                        const matName =
                          (m as any).materialName ?? (m as any).name ?? "—";
                        const matType =
                          (m as any).materialType ??
                          (m as any).materialCategory ??
                          "other";
                        const colorCls =
                          MATERIAL_TYPE_COLORS[matType] ??
                          MATERIAL_TYPE_COLORS.other;
                        return (
                          <div
                            key={m.id}
                            className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3 shadow-sm"
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
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {MATERIAL_TYPE_LABELS[matType] || matType}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-slate-50">
                              <p className="font-bold text-slate-800 text-sm mb-1">
                                {matName}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                  Số lượng:
                                </span>
                                <span className="font-black text-emerald-600 text-sm">
                                  {m.quantity} {m.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {itemMaterials.length === 0 && (
                        <div className="col-span-full py-6 border-2 border-dashed border-slate-50 rounded-2xl text-center">
                          <p className="text-xs text-slate-400 italic">
                            Không phân bổ vật tư cho hạng mục này
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Personnel & Action */}
                  <div className="md:col-span-4 space-y-6">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <SectionTitle icon={<Users className="w-4 h-4" />}>
                          Danh sách nhân sự
                        </SectionTitle>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold bg-slate-100 text-slate-500 border-none"
                        >
                          {taskPersonnel.length +
                            (task.supervisors?.length || 0) +
                            (task.qualityInspectors?.length || 0)}
                        </Badge>
                      </div>

                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          placeholder="Tìm kiếm nhân sự..."
                          className="pl-10 h-10 text-[11px] font-medium border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 overflow-auto max-h-80">
                        {/* Unified Personnel List Construction */}
                        {(() => {
                          const allPersonnel = [
                            ...(task.supervisors || []).map(
                              (pName: string) => ({
                                name: pName,
                                role: "Quản lý",
                                icon: (
                                  <Shield className="w-4 h-4 text-blue-500" />
                                ),
                                bg: "bg-blue-50",
                                border: "border-blue-100",
                              }),
                            ),
                            ...(task.qualityInspectors || []).map(
                              (pName: string) => ({
                                name: pName,
                                role: "Giám sát",
                                icon: (
                                  <ClipboardCheck className="w-4 h-4 text-amber-500" />
                                ),
                                bg: "bg-amber-50",
                                border: "border-amber-100",
                              }),
                            ),
                            ...taskPersonnel.map((pName: string) => ({
                              name: pName,
                              role:
                                task.assignedType === "team"
                                  ? "Đội nhóm"
                                  : "Cá nhân",
                              icon:
                                task.assignedType === "team" ? (
                                  <Users className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <User className="w-4 h-4 text-emerald-500" />
                                ),
                              bg: "bg-emerald-50",
                              border: "border-emerald-100",
                            })),
                          ];

                          const filtered = allPersonnel.filter(
                            (p) =>
                              p.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              p.role
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                          );

                          if (filtered.length === 0) {
                            return (
                              <EmptyPersonSection
                                label={
                                  searchTerm
                                    ? "Không tìm thấy kết quả"
                                    : "Chưa phân công"
                                }
                              />
                            );
                          }

                          return filtered.map((p: any, pIdx: number) => (
                            <PersonRow
                              key={pIdx}
                              name={p.name}
                              sub={p.role}
                              icon={p.icon}
                              accentBg={p.bg}
                              accentBorder={p.border}
                            />
                          ));
                        })()}
                      </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-800">
                          Chi tiết canh tác
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          (Sổ tay ra đồng)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
