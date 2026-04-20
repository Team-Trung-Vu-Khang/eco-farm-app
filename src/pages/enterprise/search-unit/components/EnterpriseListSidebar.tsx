import React from "react";
import { Button, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
} from "lucide-react";

interface Enterprise {
  id: number;
  name: string;
  brandName?: string;
  code: string;
  type: string;
  image?: string;
}

interface EnterpriseListSidebarProps {
  enterprises: Enterprise[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const EnterpriseListSidebar: React.FC<EnterpriseListSidebarProps> = ({
  enterprises,
  selectedId,
  onSelect,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div
      className={cn(
        "relative z-20 transition-all duration-300 border-r bg-white",
        isCollapsed ? "w-0" : "w-80",
      )}
    >
      {/* Content wrapper with overflow hidden */}
      <div
        className={cn(
          "flex flex-col h-full overflow-hidden",
          isCollapsed && "invisible",
        )}
      >
        <div className="p-3 border-b bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Danh sách đơn vị
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-300 hover:text-primary"
            onClick={() => onToggleCollapse(true)}
          >
            <PanelLeftClose size={14} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto split-scrollbar">
          {enterprises.length > 0 ? (
            enterprises.map((enterprise) => (
              <div
                key={enterprise.id}
                className={cn(
                  "p-4 border-b hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
                  selectedId === enterprise.id
                    ? "bg-primary/5 border-l-primary shadow-sm"
                    : "border-l-transparent",
                )}
                onClick={() => onSelect(enterprise.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden shadow-xs">
                    {enterprise.image ? (
                      <img
                        src={enterprise.image}
                        alt={enterprise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-bold text-sm line-clamp-1 transition-colors",
                        selectedId === enterprise.id
                          ? "text-primary"
                          : "text-slate-700",
                      )}
                    >
                      {enterprise.brandName || enterprise.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {enterprise.code} •{" "}
                      {enterprise.type === "enterprise"
                        ? "Doanh nghiệp"
                        : enterprise.type === "cooperative"
                          ? "Hợp tác xã"
                          : "Nông hộ"}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className={cn(
                      "transition-transform",
                      selectedId === enterprise.id
                        ? "text-primary rotate-90 scale-125"
                        : "text-slate-300",
                    )}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                Không tìm thấy đơn vị
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expand Button - Positioned absolutely so it's visible even when width is 0 */}
      <button
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-primary transition-all z-30",
          isCollapsed
            ? "opacity-100 translate-x-0"
            : "opacity-0 invisible translate-x-[-10px]",
        )}
        onClick={() => onToggleCollapse(false)}
      >
        <PanelLeftOpen size={14} />
      </button>
    </div>
  );
};
