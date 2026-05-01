import { type FC } from "react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileDown, Edit, Trash2, X } from "lucide-react";

interface FloatingActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onExport: () => void;
  onUpdateStatus: () => void;
}

export const FloatingActionBar: FC<FloatingActionBarProps> = ({
  selectedCount,
  onClear,
  onExport,
  onUpdateStatus,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-r border-slate-800 pr-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
            {selectedCount}
          </div>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Đã chọn</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onExport}
            className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2 font-bold"
          >
            <FileDown size={16} />
            Xuất
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onUpdateStatus}
            className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2 font-bold"
          >
            <Edit size={16} />
            Sửa nhanh
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 font-bold"
          >
            <Trash2 size={16} />
            Xóa
          </Button>
        </div>

        <button
          onClick={onClear}
          className="ml-4 p-1.5 text-slate-500 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
