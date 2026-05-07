import { type FC } from "react";
import { Building2, PanelLeftClose, Layers } from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { MaterialCategory, CategoryOption } from "../types/types";

interface CategorySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentCategories: MaterialCategory[];
  onCategoryChange: (categories: MaterialCategory[]) => void;
  categories: CategoryOption[];
}

export const CategorySidebar: FC<CategorySidebarProps> = ({
  isCollapsed,
  onToggle,
  currentCategories,
  onCategoryChange,
  categories,
}) => {
  const allCategories: MaterialCategory[] = [
    "Pesticide",
    "Fertilizer",
    "Material",
    "Equipment",
  ];

  return (
    <div
      className={cn(
        "bg-white border-r flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-72",
      )}
    >
      <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between min-w-60">
        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-slate-500">
          <Building2 size={14} className="text-primary" />
          Danh mục vật tư
        </h3>
        <button
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto split-scrollbar min-w-60 p-2 space-y-1">
        <button
          onClick={() => onCategoryChange(allCategories)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
            currentCategories.length > 1
              ? "bg-primary/5 border border-primary/10 shadow-sm"
              : "hover:bg-slate-50 border border-transparent",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs",
              currentCategories.length > 1
                ? "bg-white text-primary"
                : "bg-slate-100 text-slate-400 group-hover:bg-white",
            )}
          >
            <Layers size={20} className="text-indigo-500" />
          </div>
          <div className="text-left">
            <p
              className={cn(
                "text-sm font-bold leading-none",
                currentCategories.length > 1
                  ? "text-slate-900"
                  : "text-slate-600",
              )}
            >
              Tất cả vật tư
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
              Xem toàn bộ kho
            </p>
          </div>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange([cat.id])}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
              currentCategories.length === 1 && currentCategories[0] === cat.id
                ? "bg-primary/5 border border-primary/10 shadow-sm"
                : "hover:bg-slate-50 border border-transparent",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs",
                currentCategories.length === 1 &&
                  currentCategories[0] === cat.id
                  ? "bg-white text-primary"
                  : "bg-slate-100 text-slate-400 group-hover:bg-white",
              )}
            >
              <cat.icon size={20} className={cat.color} />
            </div>
            <div className="text-left">
              <p
                className={cn(
                  "text-sm font-bold leading-none",
                  currentCategories.length === 1 &&
                    currentCategories[0] === cat.id
                    ? "text-slate-900"
                    : "text-slate-600",
                )}
              >
                {cat.name}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                Phân loại {cat.id}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
