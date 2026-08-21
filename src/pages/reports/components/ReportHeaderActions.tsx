import { useState } from "react";
import {
  Bell,
  RefreshCw,
  Printer,
  Download,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ReportHeaderActionsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function ReportHeaderActions({ onRefresh, isRefreshing }: ReportHeaderActionsProps) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const mockAlerts = [
    {
      id: 1,
      type: "pest",
      title: "Phát hiện sâu bệnh hại",
      desc: "Vùng sầu riêng Monthon A1 xuất hiện rầy phấn trắng mật độ nhẹ.",
      time: "10 phút trước",
    },
    {
      id: 2,
      type: "limit",
      title: "Vượt định mức vật tư",
      desc: "Lô B1-02 sử dụng lượng phân bón NPK vượt 12% so với kế hoạch đợt 3.",
      time: "2 giờ trước",
    },
  ];

  const handleExport = (type: "pdf" | "excel") => {
    setExportOpen(false);
    toast.success(`Đang xuất file báo cáo dạng ${type.toUpperCase()}...`, {
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      description: "File của bạn sẽ được tải xuống tự động sau giây lát.",
    });
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Smart Alerts */}
      <div className="relative">
        <button
          onClick={() => {
            setAlertsOpen(!alertsOpen);
            setExportOpen(false);
          }}
          className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 transition-all cursor-pointer relative"
          title="Smart Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
        </button>

        {alertsOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-850">Cảnh báo thông minh</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                2 mới
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="p-3 hover:bg-slate-50/50 transition-colors flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">{alert.title}</p>
                    <p className="text-[11px] text-slate-500 leading-normal">{alert.desc}</p>
                    <span className="text-[9px] text-slate-400 block">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Làm mới */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 transition-all cursor-pointer ${
          isRefreshing ? "opacity-60" : ""
        }`}
        title="Làm mới dữ liệu"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </button>

      {/* In */}
      <button
        onClick={() => window.print()}
        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 transition-all cursor-pointer"
        title="In báo cáo"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* Xuất file */}
      <div className="relative">
        <button
          onClick={() => {
            setExportOpen(!exportOpen);
            setAlertsOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition-all cursor-pointer shadow-sm"
          title="Xuất file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất báo cáo</span>
        </button>

        {exportOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 py-1">
            <button
              onClick={() => handleExport("pdf")}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Xuất file PDF</span>
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Xuất file Excel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
