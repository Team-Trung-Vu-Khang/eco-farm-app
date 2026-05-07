import {
  Badge,
  Checkbox,
  cn,
  Skeleton,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MoreHorizontal,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type FC } from "react";
import type { MaterialItem, WHOClass } from "../types/types";
import { CATEGORIES } from "../constants/categories";

interface MaterialTableProps {
  materials: MaterialItem[];
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onRowClick?: (item: MaterialItem) => void;
  // Pagination props
  page: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const getToxicityConfig = (tier: WHOClass | undefined) => {
  switch (tier) {
    case "I":
      return { label: "Cực độc", color: "bg-red-500", text: "text-red-700" };
    case "II":
      return {
        label: "Độc cao",
        color: "bg-orange-500",
        text: "text-orange-700",
      };
    case "III":
      return {
        label: "Nguy hiểm",
        color: "bg-blue-500",
        text: "text-blue-700",
      };
    case "IV":
      return {
        label: "Cẩn trọng",
        color: "bg-emerald-500",
        text: "text-emerald-700",
      };
    default:
      return {
        label: "An toàn",
        color: "bg-slate-400",
        text: "text-slate-700",
      };
  }
};

export const MaterialTable: FC<MaterialTableProps> = ({
  materials,
  isLoading,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onRowClick,
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6 bg-white flex-1 rounded-2xl border border-slate-100 p-6">
        <div className="flex flex-col gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <Skeleton className="h-10 w-10 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 bg-slate-200" />
                <Skeleton className="h-3 w-1/2 bg-slate-200/50" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getDetailUrl = (item: MaterialItem) => {
    return `/${item.category.toLowerCase()}/${item.originalId}`;
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="overflow-auto split-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
            <tr className="border-b border-slate-100">
              <th className="p-4 w-12">
                <Checkbox
                  checked={
                    materials.length > 0 &&
                    selectedIds.length === materials.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Vật tư
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Loại
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Thông số
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Độ độc (P)
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="p-4 w-24 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-8">
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {materials.map((item) => {
              const tox = getToxicityConfig(item.toxicityClass);
              const isSelected = selectedIds.includes(item.id);
              const categoryConfig = CATEGORIES.find((c) => c.id === item.category);
              const Icon = categoryConfig?.icon || ShieldAlert;

              return (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "group transition-all duration-200 cursor-pointer",
                    isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/80",
                  )}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(item.id)}
                    />
                  </td>
                  <td className="p-4 w-[300px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-all shadow-sm shrink-0 border border-slate-200/50">
                        <Icon size={20} className={categoryConfig?.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                          {item.code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="secondary"
                      className="font-bold text-[10px] uppercase tracking-tighter bg-slate-100 text-slate-600"
                    >
                      {item.subCategory}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <ShieldAlert size={14} className="text-slate-400" />
                      {item.manufacturer || "N/A"}
                    </div>
                  </td>
                  <td className="p-4">
                    {item.category === "Pesticide" ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("w-2 h-2 rounded-full", tox.color)}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                          Class {item.toxicityClass}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={cn(
                        "rounded-full px-2 font-black text-[9px] uppercase tracking-widest",
                        item.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {item.status === "active" ? "Hoạt động" : "Ngưng"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Hiển thị {(page - 1) * pageSize + 1} -{" "}
          {Math.min(page * pageSize, totalCount)} trên {totalCount} vật tư
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 px-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Simple pagination logic: show first, last, and pages around current
              if (
                totalPages <= 7 ||
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      page === pageNum
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-110 z-10"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary",
                    )}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && page > 3) ||
                (pageNum === totalPages - 1 && page < totalPages - 2)
              ) {
                return (
                  <span key={pageNum} className="text-slate-300 text-xs px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
