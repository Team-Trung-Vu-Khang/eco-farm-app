import { type FC, type ReactNode } from "react";
import { Search, Filter, PanelLeftOpen } from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface MaterialSearchBarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onApply: () => void;
  isAdvancedFilterOpen: boolean;
  onToggleAdvancedFilter: () => void;
  advancedFilterPanel: ReactNode;
}

export const MaterialSearchBar: FC<MaterialSearchBarProps> = ({
  isSidebarCollapsed,
  onToggleSidebar,
  searchValue,
  onSearchChange,
  onApply,
  isAdvancedFilterOpen,
  onToggleAdvancedFilter,
  advancedFilterPanel,
}) => {
  return (
    <div className="bg-white border-b p-4 z-20 shadow-sm">
      <div className="w-full flex flex-col md:flex-row gap-4 items-center">
        {/* Integrated Sidebar Toggle */}
        {isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary hover:bg-slate-50 hover:border-primary/30 transition-all shrink-0 shadow-sm"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}

        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            placeholder="Tìm kiếm vật tư theo tên, mã, hoạt chất..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-10 text-sm transition-all"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={onToggleAdvancedFilter}
            className={cn(
              "px-4 h-10 font-bold rounded-md transition-all text-sm flex items-center gap-2 border",
              isAdvancedFilterOpen
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
            )}
          >
            <Filter size={18} />
            Bộ lọc nâng cao
          </button>
          <button
            onClick={onApply}
            className="px-6 h-10 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 text-sm"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {isAdvancedFilterOpen && advancedFilterPanel}
    </div>
  );
};
