import { useState, useEffect } from "react";
import {
  X,
  Settings2,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type FilterState,
  filterData,
} from "../../dashboard/constants";

interface SmartFilterDialogProps {
  initialFilter: FilterState;
  onApply: (filter: FilterState) => void;
}

export function SmartFilterDialog({ initialFilter, onApply }: SmartFilterDialogProps) {
  const [open, setOpen] = useState(false);

  // Filter drafts
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("all");
  const [tempSelectedPlots, setTempSelectedPlots] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activePreset, setActivePreset] = useState<string>("custom");

  // Load initial values when dialog opens
  useEffect(() => {
    if (open) {
      setTempSelectedPlots(initialFilter.selectedPlots);
      setDateFrom(initialFilter.dateFrom);
      setDateTo(initialFilter.dateTo);
    }
  }, [open, initialFilter]);

  // Derived options for cascading dropdowns
  const availableRegions = filterData;
  const currentRegion = filterData.find((r) => r.id === selectedRegionId);
  const availableAreas = currentRegion ? currentRegion.areas : [];
  const currentArea = availableAreas.find((a) => a.id === selectedAreaId);
  const availablePlots = currentArea ? currentArea.plots : [];

  // Reset Area & Plot selections when Region changes
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedAreaId("all");
  };

  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
  };

  const togglePlot = (plotId: string) => {
    setTempSelectedPlots((prev) =>
      prev.includes(plotId)
        ? prev.filter((id) => id !== plotId)
        : [...prev, plotId]
    );
  };

  const selectAllVisiblePlots = () => {
    const visibleIds = availablePlots.map((p) => p.id);
    setTempSelectedPlots((prev) => {
      const filtered = prev.filter((id) => !visibleIds.includes(id));
      return [...filtered, ...visibleIds];
    });
  };

  const clearAllPlots = () => {
    setTempSelectedPlots([]);
  };

  // Date Range Presets helper
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    const now = new Date();
    let fromDate: Date | null = null;
    let toDate: Date | null = now;

    if (preset === "7days") {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (preset === "30days") {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (preset === "thisMonth") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (preset === "lastMonth") {
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      toDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (preset === "all") {
      fromDate = null;
      toDate = null;
    }

    const formatDate = (d: Date | null) => {
      if (!d) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setDateFrom(formatDate(fromDate));
    setDateTo(formatDate(toDate));
  };

  const handleApply = () => {
    onApply({
      selectedPlots: tempSelectedPlots,
      dateFrom,
      dateTo,
    });
    setOpen(false);
  };

  // Label summarizing active filters
  const getActiveFilterLabel = () => {
    const plotCount = initialFilter.selectedPlots.length;
    const plotLabel = plotCount > 0 ? `${plotCount} lô` : "Tất cả vùng";
    
    let dateLabel = "Tất cả thời gian";
    if (initialFilter.dateFrom || initialFilter.dateTo) {
      const from = initialFilter.dateFrom ? new Date(initialFilter.dateFrom).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : "...";
      const to = initialFilter.dateTo ? new Date(initialFilter.dateTo).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : "...";
      dateLabel = `${from} - ${to}`;
    }
    return `${plotLabel} • ${dateLabel}`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 font-semibold text-xs text-slate-700 transition-all cursor-pointer shadow-xs"
      >
        <Settings2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Bộ lọc thông minh:</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
          {getActiveFilterLabel()}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Bộ lọc Dữ liệu Thông minh
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              
              {/* Cascading selectors */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Vùng & Lô trồng (Cascading)</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Region */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">1. Chọn vùng</label>
                    <Select
                      value={selectedRegionId}
                      onValueChange={handleRegionChange}
                    >
                      <SelectTrigger className="w-full text-xs bg-white border border-slate-200 rounded-lg">
                        <SelectValue placeholder="Chọn vùng trồng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- Chọn Vùng Trồng (Tất cả) --</SelectItem>
                        {availableRegions.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select Area */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">2. Chọn khu vực</label>
                    <Select
                      value={selectedAreaId}
                      onValueChange={handleAreaChange}
                      disabled={selectedRegionId === "all"}
                    >
                      <SelectTrigger className="w-full text-xs bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:bg-slate-55">
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- Chọn Khu Vực (Tất cả) --</SelectItem>
                        {availableAreas.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Select Plots checkboxes */}
                {selectedAreaId !== "all" && (
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">3. Chọn lô trong {currentArea?.name}:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllVisiblePlots}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          Chọn tất cả lô
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={clearAllPlots}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availablePlots.map((plot) => {
                        const isChecked = tempSelectedPlots.includes(plot.id);
                        return (
                          <label
                            key={plot.id}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                              isChecked
                                ? "bg-emerald-55/10 border-emerald-200 text-emerald-800 font-semibold"
                                : "bg-white border-slate-150 hover:bg-slate-50 text-slate-650"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePlot(plot.id)}
                              className="w-3.5 h-3.5 rounded text-emerald-600 border-slate-350 focus:ring-0 cursor-pointer"
                            />
                            <span>{plot.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Presets and picker */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Bộ lọc Thời gian & Presets</span>
                </h4>

                {/* Preset pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "7days", label: "7 ngày qua" },
                    { id: "30days", label: "30 ngày qua" },
                    { id: "thisMonth", label: "Tháng này" },
                    { id: "lastMonth", label: "Tháng trước" },
                    { id: "all", label: "Tất cả" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                        activePreset === p.id
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250 font-bold"
                          : "bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Custom inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Từ ngày</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setActivePreset("custom");
                      }}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Đến ngày</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setActivePreset("custom");
                      }}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-205 bg-white text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
