import React, { useState } from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Download,
  Bell,
  RefreshCw,
  FileSpreadsheet,
  FilePdf,
} from "lucide-react";
import { useReportContext } from "../context/ReportContext";
import { Link } from "wouter";

interface ReportLayoutProps {
  domain: string;
  module: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  children: React.ReactNode;
}

export const ReportLayout: React.FC<ReportLayoutProps> = ({
  domain,
  module,
  onRefresh,
  isRefreshing,
  children,
}) => {
  const { dateRange, setDateRange } = useReportContext();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Get nice Vietnamese labels
  const getDomainLabel = (d: string) => {
    switch (d) {
      case "crops":
        return "Canh tác trồng trọt";
      case "livestock":
        return "Canh tác chăn nuôi";
      case "aqua":
        return "Canh tác nuôi trồng thủy sản";
      default:
        return d;
    }
  };

  const getModuleLabel = (m: string) => {
    switch (m) {
      case "overview":
        return "Tổng quan";
      case "plan-work":
        return "Kế hoạch - công việc";
      case "harvest":
        return "Thu hoạch";
      case "materials":
        return "Vật tư";
      case "inventory":
        return "Tồn kho";
      default:
        return m;
    }
  };

  const handleDatePresetChange = (val: string) => {
    const end = new Date().toISOString().split("T")[0];
    let start = "";
    if (val === "7days") {
      start = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0];
    } else if (val === "30days") {
      start = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
    } else if (val === "thisMonth") {
      start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
    } else {
      start = "2025-01-01";
    }
    setDateRange({ startDate: start, endDate: end, preset: val });
  };

  // Mock Alerts list
  const mockAlerts = [
    { id: 1, text: "Vượt định mức phân bón tại Lô A1-01", type: "error" },
    { id: 2, text: "Cảnh báo sâu bệnh đạo ôn trên bưởi da xanh", type: "warning" },
    { id: 3, text: "Nhiệt độ ao nuôi thủy sản quá cao đợt nắng nóng", type: "info" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Báo cáo - Thống kê</span>
            <span>/</span>
            <span className="text-emerald-600 font-bold">{getDomainLabel(domain)}</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-slate-800">
            {getModuleLabel(module)}
          </h1>
        </div>

        {/* Global actions & shared filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Date Filter Presets */}
          <div className="w-48">
            <Select value={dateRange.preset} onValueChange={handleDatePresetChange}>
              <SelectTrigger className="w-full text-xs font-semibold bg-white border border-slate-205 h-9 rounded-lg shadow-xs">
                <SelectValue placeholder="Lọc thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="thisMonth">Tháng này</SelectItem>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`h-9 w-9 border border-slate-205 rounded-lg bg-white text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* Smart Alerts Dialog Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="h-9 w-9 border border-slate-205 rounded-lg bg-white text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer relative"
              title="Cảnh báo thông minh"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-extrabold border-2 border-white">
                3
              </span>
            </Button>
            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-100 shadow-xl z-50 p-3 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Smart Alerts ({mockAlerts.length})
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs font-semibold ${
                        alert.type === "error"
                          ? "bg-rose-50 border-rose-100 text-rose-800"
                          : alert.type === "warning"
                          ? "bg-amber-50 border-amber-100 text-amber-800"
                          : "bg-blue-50 border-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </Button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-100 shadow-xl z-50 p-1">
                <button
                  onClick={() => {
                    window.print();
                    setExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-rose-500" />
                  <span>Xuất file PDF</span>
                </button>
                <button
                  onClick={() => {
                    alert("Đang trích xuất Excel...");
                    setExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Xuất file Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
