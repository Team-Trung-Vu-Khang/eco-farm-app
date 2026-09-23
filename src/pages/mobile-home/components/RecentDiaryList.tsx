import { useFarmDailyDiaryEntries } from "@/features/farm-daily-diary";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";
import dayjs from "dayjs";
import { Camera, ChevronRight, Loader2, NotebookPen } from "lucide-react";
import { Link } from "wouter";

const RECENT_DIARY_LIMIT = 5;

export function RecentDiaryList() {
  const { data, isLoading, isError } = useFarmDailyDiaryEntries({
    params: { page: 0, size: RECENT_DIARY_LIMIT },
  });
  const entries = [...(data?.content ?? [])].sort(
    (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
  );

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Nhật ký gần đây
        </h2>
        <Link
          href="/diary/daily-history"
          className="text-xs font-semibold text-primary"
        >
          Xem tất cả
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải nhật ký...
        </div>
      ) : isError ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
          Không tải được nhật ký
        </p>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
          <p className="text-sm text-slate-500">Chưa có nhật ký nào</p>
          <Link
            href="/diary/incident"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <NotebookPen className="h-4 w-4" /> Ghi nhật ký đầu tiên
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/diary/update/${entry.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 active:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <NotebookPen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {FARM_PLAN_PURPOSE_LABELS[entry.purpose] ?? entry.purpose}
                    </p>
                    {entry.photos.length > 0 && (
                      <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-slate-500">
                        <Camera className="h-3 w-3" /> {entry.photos.length}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {entry.description ||
                      entry.workflow?.name ||
                      entry.code}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {dayjs(entry.createdAt).format("HH:mm DD/MM/YYYY")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
