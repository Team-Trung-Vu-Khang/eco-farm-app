import {
  Badge,
  Checkbox,
  cn,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ShieldAlert, Eye, Lock } from "lucide-react";
import { useMemo, type FC } from "react";
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
  onPageSizeChange?: (pageSize: number) => void;
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
  onPageSizeChange,
}) => {
  const columns: Column<MaterialItem>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Vật tư",
        render: (_, row) => {
          const categoryConfig = CATEGORIES.find((c) => c.id === row.category);
          const Icon = categoryConfig?.icon || ShieldAlert;
          const isMaster = row.source === "MASTER";

          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200/50">
                <Icon size={18} className={categoryConfig?.color} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold truncate leading-tight text-slate-900 cursor-pointer hover:text-primary hover:underline"
                  onClick={() => onRowClick?.(row)}
                  title={row.name}
                >
                  {row.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {row.code}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-1 py-0 h-4 font-extrabold uppercase",
                      isMaster
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-blue-200 bg-blue-50 text-blue-700",
                    )}
                  >
                    {isMaster ? "Hệ thống" : "Cá nhân"}
                  </Badge>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "subCategory",
        label: "Loại",
        render: (value) => (
          <Badge
            variant="secondary"
            className="font-bold text-[10px] uppercase tracking-tighter bg-slate-100 text-slate-600"
          >
            {value}
          </Badge>
        ),
      },
      {
        key: "manufacturer",
        label: "Thông số / Nhà SX",
        render: (value) => (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldAlert size={14} className="text-slate-400" />
            {value || "N/A"}
          </div>
        ),
      },
      {
        key: "toxicityClass",
        label: "Độ độc (P)",
        render: (_, row) => {
          if (row.category !== "Pesticide") {
            return <span className="text-slate-300">—</span>;
          }
          const tox = getToxicityConfig(row.toxicityClass);
          return (
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", tox.color)} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                Class {row.toxicityClass}
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (value) => (
          <Badge
            className={cn(
              "rounded-full px-2 font-black text-[9px] uppercase tracking-widest",
              value === "active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500",
            )}
          >
            {value === "active" ? "Hoạt động" : "Ngưng"}
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Chi tiết",
        align: "right",
        render: (_, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRowClick?.(row);
            }}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center gap-1 text-xs font-bold"
            title="Xem chi tiết"
          >
            <Eye size={14} />
            <span>Xem</span>
          </button>
        ),
      },
    ],
    [selectedIds, onToggleSelection, onRowClick],
  );

  return (
    <div className="flex-1 shadow-sm flex flex-col">
      <DataTable
        columns={columns}
        data={materials}
        searchable={false} // Hide default DataTable search bar
        pageSize={pageSize}
        currentIndex={page}
        totalElements={totalCount}
        totalPages={totalPages}
        onIndexChange={(newIndex) => onPageChange(newIndex)}
        onPageSize={(size) => {
          if (onPageSizeChange) {
            onPageSizeChange(size);
          } else {
            onPageChange(1);
          }
        }}
        onRowClick={(row) => onRowClick?.(row)}
        loading={isLoading}
      />
    </div>
  );
};
