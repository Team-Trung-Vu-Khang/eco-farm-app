import { useFarmDailyDiaryEntries } from "@/features/farm-daily-diary";
import { getPurposeVisual } from "@/pages/diary/constants/history-form.constants";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Camera,
  ChevronRight,
  Loader2,
  NotebookPen,
} from "lucide-react";
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
        <ul className="space-y-2.5">
          {entries.map((entry) => {
            const visual = getPurposeVisual(entry.purpose);
            const VisualIcon = visual.Icon;
            const purposeLabel =
              FARM_PLAN_PURPOSE_LABELS[entry.purpose] || entry.purpose;
            const taskSpecificName = entry.lines?.[0]?.name;
            const title = purposeLabel;
            const timeFormatted = dayjs(entry.createdAt).format(
              "HH:mm · DD/MM/YYYY",
            );
            const isWarning = Boolean(entry.warning);

            return (
              <li key={entry.id}>
                <Link
                  href={`/diary/update/${entry.id}`}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:border-primary/40 active:bg-slate-50 transition-all group"
                >
                  {/* 1. Icon thể hiện loại công việc ở đầu */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${visual.bg} ${visual.text} border ${visual.border}`}
                  >
                    <VisualIcon className="h-5 w-5" />
                  </div>

                  {/* 2. Tiếp theo là tên loại công việc, bên dưới là thời gian */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {title}
                      </p>
                      {/* Nếu nhật ký đó warning === true thì thêm badge thể hiện để user biết */}
                      {isWarning && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200/80">
                          <AlertTriangle className="h-3 w-3" />
                          Cảnh báo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-500 truncate">
                        {timeFormatted}
                      </span>
                      {/* {taskSpecificName && taskSpecificName !== title && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="truncate text-slate-600">
                            {taskSpecificName}
                          </span>
                        </>
                      )} */}
                      {entry.photos && entry.photos.length > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-slate-400">
                            <Camera className="h-3 w-3" />
                            {entry.photos.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 3. Mũi tên điều hướng */}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
