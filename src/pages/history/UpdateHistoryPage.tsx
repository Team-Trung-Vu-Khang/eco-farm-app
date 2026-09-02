import { useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, History, Link2, Plus, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { UpdateDetailDialog } from "./components/UpdateDetailDialog";
import { UpdateHistoryTable } from "./components/UpdateHistoryTable";
import { MOCK_UPDATE_HISTORY, type TaskHistoryItem } from "./mock/history.mock";

export default function UpdateHistoryPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"ALL" | "PLANNED" | "AD_HOC">(
    "ALL",
  );
  const [selectedTaskForDetail, setSelectedTaskForDetail] =
    useState<TaskHistoryItem | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return MOCK_UPDATE_HISTORY.filter((item) => {
      if (activeTab === "PLANNED" && item.origin !== "PLANNED") return false;
      if (activeTab === "AD_HOC" && item.origin !== "AD_HOC") return false;
      return true;
    });
  }, [activeTab]);

  // Statistics summary
  const stats = useMemo(() => {
    const total = MOCK_UPDATE_HISTORY.length;
    const planned = MOCK_UPDATE_HISTORY.filter(
      (i) => i.origin === "PLANNED",
    ).length;
    const adhoc = MOCK_UPDATE_HISTORY.filter(
      (i) => i.origin === "AD_HOC",
    ).length;
    return { total, planned, adhoc };
  }, []);

  return (
    <PageWrapper
      title="Lịch sử cập nhật nhật ký"
      description="Danh sách các công việc có thao tác cập nhật nhật ký mới nhất"
      actions={
        <div className="flex items-center gap-3">
          {/* <Button
            className="h-10 px-4 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md shadow-green-600/20"
            onClick={() => setLocation("/diary/incident")}
          >
            <Plus className="h-4 w-4" />
            Tạo nhật ký mới
          </Button> */}
        </div>
      }
    >
      <div className="space-y-6 pb-12">
        {/* ── Stat Blocks ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Tổng công việc cập nhật",
              value: stats.total,
              icon: History,
              bg: "bg-slate-100",
              iconCls: "text-slate-700",
              valCls: "text-slate-800",
              borderCls: "border-slate-100",
            },
            {
              label: "Theo kế hoạch",
              value: stats.planned,
              icon: Link2,
              bg: "bg-blue-100",
              iconCls: "text-blue-600",
              valCls: "text-blue-600",
              borderCls: "border-slate-100",
            },
            {
              label: "Thường nhật / Phát sinh",
              value: stats.adhoc,
              icon: Zap,
              bg: "bg-purple-100",
              iconCls: "text-purple-600",
              valCls: "text-purple-600",
              borderCls: "border-slate-100",
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
                    <p
                      className={`text-3xl font-extrabold leading-none ${s.valCls}`}
                    >
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
          {[
            { key: "ALL", label: `Tất cả (${stats.total})`, icon: History },
            {
              key: "PLANNED",
              label: `Theo kế hoạch (${stats.planned})`,
              icon: Link2,
            },
            {
              key: "AD_HOC",
              label: `Thường nhật (${stats.adhoc})`,
              icon: Zap,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setActiveTab(tab.key as "ALL" | "PLANNED" | "AD_HOC")
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Table */}
        <UpdateHistoryTable
          data={filteredData}
          onOpenDetail={(task) => setSelectedTaskForDetail(task)}
        />

        {/* Detail Timeline Dialog */}
        <UpdateDetailDialog
          task={selectedTaskForDetail}
          open={!!selectedTaskForDetail}
          onOpenChange={(open) => {
            if (!open) setSelectedTaskForDetail(null);
          }}
        />
      </div>
    </PageWrapper>
  );
}
