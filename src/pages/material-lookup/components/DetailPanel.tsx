import { type FC, type ReactNode } from "react";
import { Activity, ExternalLink, X } from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  detailUrl: string | null;
  children: ReactNode;
}

export const DetailPanel: FC<DetailPanelProps> = ({
  isOpen,
  onClose,
  detailUrl,
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-white border rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
        isOpen
          ? "w-[400px] opacity-100 translate-x-0"
          : "w-0 opacity-0 translate-x-10 pointer-events-none",
      )}
    >
      <div className="px-5 pt-5 pb-4 border-b bg-slate-50/60 flex items-center justify-between shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          Thông tin chi tiết
        </h3>
        <div className="flex items-center gap-1">
          {detailUrl && (
            <button
              onClick={() => window.open(detailUrl, "_blank")}
              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1.5"
              title="Mở trang chi tiết (Tab mới)"
            >
              <span className="text-[10px] font-bold uppercase tracking-tight">
                Chi tiết
              </span>
              <ExternalLink size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto split-scrollbar p-6">
        {children}
      </div>
    </div>
  );
};
