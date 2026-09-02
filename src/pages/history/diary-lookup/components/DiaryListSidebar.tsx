import { Badge, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
} from "lucide-react";
import { formatDate, STATUS_CONFIG, WORK_TYPE_CONFIG } from "../constants";
import type { DiaryEntry } from "../types";

interface DiaryListSidebarProps {
  entries: DiaryEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export function DiaryListSidebar({
  entries,
  selectedId,
  onSelect,
  isCollapsed,
  onToggleCollapse,
}: DiaryListSidebarProps) {
  return (
    <div
      className={cn(
        "relative z-20 transition-all duration-300 border-r bg-white",
        isCollapsed ? "w-0" : "w-96",
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full overflow-hidden",
          isCollapsed && "invisible",
        )}
      >
        <div className="p-3 border-b bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Danh sách nhật ký
          </span>
          <button
            className="h-6 w-6 flex items-center justify-center text-slate-300 hover:text-primary rounded-md"
            onClick={() => onToggleCollapse(true)}
          >
            <PanelLeftClose size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto split-scrollbar">
          {entries.length > 0 ? (
            entries.map((entry) => {
              const workType = WORK_TYPE_CONFIG[entry.workType];
              const status = STATUS_CONFIG[entry.status];
              const isSelected = selectedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "p-4 border-b hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
                    isSelected
                      ? "bg-primary/5 border-l-primary shadow-sm"
                      : "border-l-transparent",
                  )}
                  onClick={() => onSelect(entry.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        workType.iconCls,
                      )}
                    >
                      <workType.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">
                          {entry.code}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("text-[9px] font-bold", workType.badgeCls)}
                        >
                          {workType.label}
                        </Badge>
                      </div>
                      <h4
                        className={cn(
                          "font-bold text-sm line-clamp-2 transition-colors",
                          isSelected ? "text-primary" : "text-slate-700",
                        )}
                      >
                        {entry.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        {entry.workflow.seasonLabel} • {entry.plan.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("text-[9px] font-bold", status.cls)}
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={cn(
                        "transition-transform shrink-0 mt-1",
                        isSelected
                          ? "text-primary rotate-90 scale-125"
                          : "text-slate-300",
                      )}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Không tìm thấy nhật ký</p>
            </div>
          )}
        </div>
      </div>

      <button
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-primary transition-all z-30",
          isCollapsed
            ? "left-0 opacity-100 translate-x-0"
            : "-right-3 opacity-0 invisible translate-x-[-10px]",
        )}
        onClick={() => onToggleCollapse(false)}
      >
        <PanelLeftOpen size={14} />
      </button>
    </div>
  );
}
