import { useFarmDailyDiaryEntries } from "@/features/farm-daily-diary";
import { MobileDiaryCard } from "@/shared/components";
import dayjs from "dayjs";
import { ChevronRight, Loader2, NotebookPen } from "lucide-react";
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
    <section className="space-y-2.5">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-base font-bold text-slate-900">Nhật ký gần đây</h2>
        <Link
          href="/diary/daily-history"
          className="text-xs font-semibold text-primary flex items-center hover:underline"
        >
          Xem tất cả <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center gap-2 text-sm text-slate-500 rounded-2xl border border-slate-100 bg-white">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Đang tải
          nhật ký...
        </div>
      ) : isError ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
          Không tải được nhật ký
        </p>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
          <p className="text-sm text-slate-500">Chưa có nhật ký nào</p>
          <Link
            href="/diary/incident"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <NotebookPen className="h-4 w-4" /> Ghi nhật ký đầu tiên
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry) => (
            <MobileDiaryCard
              key={entry.id}
              entry={entry}
              actionType="chevron"
            />
          ))}
        </div>
      )}
    </section>
  );
}
