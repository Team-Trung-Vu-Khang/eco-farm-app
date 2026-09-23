import {
  useDashboardAlertItems,
  type DashboardAlertTone,
} from "@/pages/dashboard/hooks/useDashboardAlertItems";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  FileWarning,
  PackageMinus,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const TONE_STYLES: Record<DashboardAlertTone, string> = {
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
};

const ALERT_ICONS: Record<string, LucideIcon> = {
  certificate: ShieldAlert,
  supply: PackageMinus,
  contract: FileWarning,
};

/** Chuông thông báo trên header mobile — thay cho khối "Cảnh báo" ở dashboard */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { items, attentionCount, isLoading } = useDashboardAlertItems();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          attentionCount > 0
            ? `Thông báo (${attentionCount} mới)`
            : "Thông báo"
        }
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 active:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {attentionCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {attentionCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80dvh] overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Thông báo</SheetTitle>
            <SheetDescription>
              {isLoading
                ? "Đang kiểm tra..."
                : attentionCount > 0
                  ? `${attentionCount} mục cần bạn xử lý`
                  : "Mọi thứ đang ổn"}
            </SheetDescription>
          </SheetHeader>

          <ul className="mt-4 space-y-2">
            {items.map((item) => {
              const Icon = item.needsAttention
                ? (ALERT_ICONS[item.key] ?? Bell)
                : CheckCircle2;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setLocation(item.href);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-3 text-left active:bg-slate-50",
                      item.needsAttention
                        ? "border-slate-200 bg-white"
                        : "border-transparent bg-slate-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        item.needsAttention
                          ? TONE_STYLES[item.tone]
                          : "bg-emerald-50 text-emerald-600",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          item.needsAttention
                            ? "text-slate-900"
                            : "text-slate-500",
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isLoading ? "Đang kiểm tra..." : item.description}
                      </p>
                    </div>
                    {item.needsAttention && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
