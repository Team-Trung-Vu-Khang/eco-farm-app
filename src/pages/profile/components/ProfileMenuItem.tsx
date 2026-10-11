import React from "react";
import { ChevronRight } from "lucide-react";

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle?: string | null;
  onClick: () => void;
  isDestructive?: boolean;
  badge?: React.ReactNode;
}

export function ProfileMenuItem({
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  onClick,
  isDestructive = false,
  badge,
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors active:bg-slate-50 focus:outline-none ${
        isDestructive
          ? "hover:bg-red-50/50 text-red-600"
          : "hover:bg-slate-50/80 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor} transition-transform active:scale-95`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isDestructive ? "text-red-600" : "text-slate-900"
            }`}
          >
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {badge}
        {!isDestructive && (
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </div>
    </button>
  );
}
