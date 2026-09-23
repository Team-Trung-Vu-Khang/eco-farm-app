import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { MOBILE_NAV_ITEMS, isNavItemActive } from "./mobileNav";
import { useEnsureWorkspace } from "./useEnsureWorkspace";

interface MobileAppLayoutProps {
  children: ReactNode;
}

/** Giao diện mobile: header gọn + bottom navigation, thay cho sidebar */
export function MobileAppLayout({ children }: MobileAppLayoutProps) {
  const [location] = useLocation();
  const { workspaces, selectedWorkspaceId } = useEnsureWorkspace();
  const currentWorkspace = workspaces.find(
    (workspace) => String(workspace.id) === String(selectedWorkspaceId),
  );

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sprout className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-slate-900">
            Eco Farm
          </p>
          <p className="truncate text-xs text-slate-500">
            {currentWorkspace?.brandName ||
              currentWorkspace?.name ||
              "Đang tải đơn vị..."}
          </p>
        </div>
      </header>

      {/* Chừa chỗ cho thanh điều hướng nổi + vùng an toàn (thanh home iOS) */}
      <main className="min-w-0 px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40"
      >
        <ul className="grid h-16 grid-cols-5 items-center rounded-[1.75rem] bg-white px-1 shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = isNavItemActive(item, location);
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <li key={item.href} className="relative flex justify-center">
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className="group absolute -top-11 flex flex-col items-center gap-1"
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-white transition-transform duration-200 group-active:scale-90",
                        isActive ? "rotate-0" : "rotate-45",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6 transition-transform duration-200",
                          !isActive && "-rotate-45",
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        isActive ? "text-primary" : "text-slate-600",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-14 w-full flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
                >
                  {/* Vạch sáng phía trên tab đang chọn */}
                  <span
                    className={cn(
                      "absolute -top-1 h-1 rounded-full bg-primary transition-all duration-300",
                      isActive ? "w-6 opacity-100" : "w-0 opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                      isActive
                        ? "-translate-y-0.5 bg-primary/10 text-primary"
                        : "text-slate-400",
                    )}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  </span>
                  <span
                    className={cn(
                      "max-w-full truncate px-0.5 text-[10px] transition-colors",
                      isActive
                        ? "font-bold text-primary"
                        : "font-medium text-slate-500",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
