import { useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  Link2,
  MapPin,
  RefreshCw,
  User,
} from "lucide-react";
import { useLocation } from "wouter";
import type { FarmTaskResponse, FarmTaskStatus } from "@/features/farm-task";
import { MOCK_TASKS } from "./mock/history.mock";

// ─── Helpers ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

function isOverdue(task: FarmTaskResponse): boolean {
  return (
    task.status !== "DONE" &&
    task.status !== "CANCELLED" &&
    task.endDate < TODAY
  );
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getScopeLabel(task: FarmTaskResponse): string {
  const parts: string[] = [];
  if (task.region?.name) parts.push(task.region.name);
  if (task.area?.name) parts.push(task.area.name);
  if (task.plot?.name) parts.push(task.plot.name);
  return parts.join(" › ") || "—";
}

type TabKey = "newest" | "updated" | "overdue";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "newest", label: "Được giao mới nhất", icon: CalendarCheck },
  { key: "updated", label: "Vừa mới cập nhật", icon: RefreshCw },
  { key: "overdue", label: "Đã quá hạn", icon: AlertTriangle },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlanDiaryPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("newest");

  const overdueCount = useMemo(() => MOCK_TASKS.filter(isOverdue).length, []);

  const displayedTasks = useMemo<FarmTaskResponse[]>(() => {
    const list = [...MOCK_TASKS];
    switch (activeTab) {
      case "overdue":
        return list
          .filter(isOverdue)
          .sort((a, b) => a.endDate.localeCompare(b.endDate));
      case "updated":
        return list.sort((a, b) =>
          (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
        );
      case "newest":
      default:
        return list.sort((a, b) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
        );
    }
  }, [activeTab]);

  // Stats calculation
  const stats = useMemo(() => {
    const all = MOCK_TASKS;
    return {
      total: all.length,
      doing: all.filter((t) => t.status === "DOING").length,
      done: all.filter((t) => t.status === "DONE").length,
      overdue: all.filter(isOverdue).length,
    };
  }, []);

  // Table Columns Definition
  const taskColumns = useMemo<Column<FarmTaskResponse>[]>(
    () => [
      {
        key: "name",
        label: "Nhiệm vụ / Kế hoạch",
        render: (_value, row) => (
          <div className="flex items-start gap-2.5 min-w-[240px]">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isOverdue(row) || activeTab === "overdue"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[11px] text-slate-400 font-bold">
                  {row.code}
                </span>
                {row.taskCategory && (
                  <span className="inline-block rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                    {row.taskCategory.name}
                  </span>
                )}
              </div>
              <p className="font-bold text-slate-800 text-[13px] leading-snug mt-0.5">
                {row.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {row.workflow?.name || "—"}
                {row.plan ? ` • ${row.plan.name}` : ""}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "scope",
        label: "Vùng canh tác",
        render: (_value, row) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{getScopeLabel(row)}</span>
          </div>
        ),
      },
      {
        key: "startDate",
        label: "Thời gian thực hiện",
        render: (_value, row) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{formatDate(row.startDate)}</span>
            <span className="text-slate-300">→</span>
            <span className="font-medium">{formatDate(row.endDate)}</span>
          </div>
        ),
      },
      {
        key: "personnel",
        label: "Người thực hiện",
        render: (_value, row) => {
          if (!row.personnel || row.personnel.length === 0)
            return <span className="text-xs text-slate-300 italic">Chưa giao</span>;
          return (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold">
                {row.personnel
                  .slice(0, 2)
                  .map((p) => p.fullName || `#${p.id}`)
                  .join(", ")}
                {row.personnel.length > 2 ? ` (+${row.personnel.length - 2})` : ""}
              </span>
            </div>
          );
        },
      },
      {
        key: "supplyLines",
        label: "Vật tư",
        render: (_value, row) => (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Link2 className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">{row.supplyLines.length}</span>
            <span className="text-slate-400">loại</span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (_value, row) => {
          if (isOverdue(row)) {
            return (
              <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-bold">
                Quá hạn
              </Badge>
            );
          }
          const statusMap: Record<FarmTaskStatus, { label: string; cls: string }> = {
            TODO: { label: "Chờ thực hiện", cls: "bg-slate-50 text-slate-600 border-slate-200" },
            DOING: { label: "Đang thực hiện", cls: "bg-blue-50 text-blue-700 border-blue-200" },
            DONE: { label: "Hoàn thành", cls: "bg-green-50 text-green-700 border-green-200" },
            CANCELLED: { label: "Đã hủy", cls: "bg-slate-50 text-slate-400 border-slate-200" },
          };
          const info = statusMap[row.status] ?? statusMap.TODO;
          return (
            <Badge variant="outline" className={`text-[10px] font-bold ${info.cls}`}>
              {info.label}
            </Badge>
          );
        },
      },
      {
        key: "id",
        label: "Hành động",
        render: (_value, row) => (
          <Button
            type="button"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/diary/plan/${row.id}`);
            }}
            className={`h-8 px-3 rounded-lg text-xs font-bold gap-1 ${
              isOverdue(row) || activeTab === "overdue"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Ghi nhật ký
            <ArrowRight className="h-3 w-3" />
          </Button>
        ),
      },
    ],
    [activeTab, setLocation],
  );

  return (
    <PageWrapper
      title="Nhật ký theo kế hoạch"
      description="Danh sách công việc theo kế hoạch đã được phân công"
      actions={
        <Button
          variant="outline"
          className="h-10 rounded-lg px-4 text-sm gap-2"
          onClick={() => setLocation("/history")}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      {/* ── Stat Blocks ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Tổng công việc",
            value: stats.total,
            icon: ClipboardList,
            bg: "bg-green-100",
            iconCls: "text-green-600",
            valCls: "text-slate-800",
            borderCls: "border-slate-100",
          },
          {
            label: "Đang thực hiện",
            value: stats.doing,
            icon: RefreshCw,
            bg: "bg-blue-100",
            iconCls: "text-blue-600",
            valCls: "text-blue-600",
            borderCls: "border-slate-100",
          },
          {
            label: "Hoàn thành",
            value: stats.done,
            icon: CalendarCheck,
            bg: "bg-emerald-100",
            iconCls: "text-emerald-600",
            valCls: "text-emerald-600",
            borderCls: "border-slate-100",
          },
          {
            label: "Quá hạn",
            value: stats.overdue,
            icon: AlertTriangle,
            bg: "bg-orange-100",
            iconCls: "text-orange-600",
            valCls: "text-orange-600",
            borderCls: "border-orange-100",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.borderCls} bg-white shadow-sm p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    {s.label}
                  </p>
                  <p className={`text-3xl font-extrabold leading-none ${s.valCls}`}>
                    {s.value}
                  </p>
                </div>
                <div
                  className={`h-10 w-10 rounded-xl ${s.bg} ${s.iconCls} flex items-center justify-center shrink-0`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabs Filter ── */}
      <div className="flex gap-2 flex-wrap mb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isOrangeTab = tab.key === "overdue";
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                isActive
                  ? isOrangeTab
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-green-400 bg-green-50 text-green-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.key === "overdue" && overdueCount > 0 && (
                <span className="ml-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">
                  {overdueCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Table Data ── */}
      <DataTable<FarmTaskResponse>
        columns={taskColumns}
        data={displayedTasks}
        searchable
        searchPlaceholder="Tìm kiếm công việc theo tên, mã..."
        onView={(row) => setLocation(`/diary/plan/${row.id}`)}
      />
    </PageWrapper>
  );
}
