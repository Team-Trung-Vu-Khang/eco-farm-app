import { Link } from "wouter";
import { ChevronRight, NotebookPen } from "lucide-react";

export function DailyDiaryActionCard() {
  return (
    <Link
      href="/diary/incident"
      className="flex items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-white p-4 shadow-sm active:scale-[0.99] hover:border-primary/40 transition-all group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25 group-active:scale-95 transition-transform">
          <NotebookPen className="h-6 w-6 stroke-[2.2]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors">
            Ghi nhật ký thường nhật
          </h3>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            Ghi nhận công việc, vật tư và ảnh chụp hôm nay
          </p>
        </div>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-400 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-2xs">
        <ChevronRight className="h-5 w-5" />
      </div>
    </Link>
  );
}
