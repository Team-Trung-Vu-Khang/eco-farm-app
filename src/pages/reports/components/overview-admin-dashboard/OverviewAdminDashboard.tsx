import {
  Badge,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  HelpCircle,
  Info,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  mockAdminUnits,
  type AdminUnitReport,
} from "../../constants/mockAdminUnits";
import { mockGeneralStats } from "../../constants/mockReportData";
import { AdminHealthSection } from "./AdminHealthSection";
import { AdminMaterialSection } from "./AdminMaterialSection";
import { AdminOperationsSection } from "./AdminOperationsSection";
import { AdminPersonnelSection } from "./AdminPersonnelSection";
import { EntitySidebar, type CorporateEntity } from "./EntitySidebar";

export const OverviewAdminDashboard: React.FC = () => {
  // ─── States (Phần mới) ─────────────────────────────────────────────────────
  const [selectedMonth, setSelectedMonth] = useState<string>("8");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Drawer & Lightbox states
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [activeUnit, setActiveUnit] = useState<AdminUnitReport | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // ─── States (Phần cũ) ──────────────────────────────────────────────────────
  const [selectedEntity, setSelectedEntity] = useState<CorporateEntity | null>(
    null,
  );

  // ─── Process Data (Phần mới) ────────────────────────────────────────────────
  const unitsData = useMemo(() => {
    // Dynamic data adjustment based on month selection for mock richness
    const seed = parseInt(selectedMonth, 10) + parseInt(selectedYear, 10);
    return mockAdminUnits.map((unit) => {
      // Scale activeDays & updates dynamically to simulate monthly changes
      const scaleFactor = ((seed % 5) + 6) / 10; // 0.6 to 1.0

      const adjustedActiveDays = Math.max(
        0,
        Math.round(unit.activeDays * scaleFactor),
      );
      const adjustedUpdateCount = Math.max(
        0,
        Math.round(unit.updateCount * scaleFactor),
      );
      const adjustedMaterialUpdateCount = Math.max(
        0,
        Math.round(unit.materialUpdateCount * scaleFactor),
      );
      const adjustedDistinctDaysCount = Math.max(
        0,
        Math.round(unit.distinctDaysCount * scaleFactor),
      );

      // Re-evaluate isActive based on custom criteria
      const isActive =
        adjustedUpdateCount >= 2 &&
        adjustedDistinctDaysCount >= 2 &&
        adjustedMaterialUpdateCount >= 1;

      // Adjust dates in updates to match current selection
      const adjustedUpdates = unit.updates.map((up) => {
        const timePart = up.timestamp.split(" ")[1];
        const dayPart = up.id.split("-").pop() || "01";
        const paddedDay = dayPart.padStart(2, "0");
        const paddedMonth = selectedMonth.padStart(2, "0");
        return {
          ...up,
          timestamp: `${selectedYear}-${paddedMonth}-${paddedDay} ${timePart}`,
        };
      });

      return {
        ...unit,
        activeDays: adjustedActiveDays,
        updateCount: adjustedUpdateCount,
        materialUpdateCount: adjustedMaterialUpdateCount,
        distinctDaysCount: adjustedDistinctDaysCount,
        isActive,
        updates: adjustedUpdates,
      };
    });
  }, [selectedMonth, selectedYear]);

  // ─── KPI Calculations (Phần mới) ───────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = unitsData.length;
    const activeCount = unitsData.filter((u) => u.isActive).length;
    const activeRate = total > 0 ? (activeCount / total) * 100 : 0;

    const evidenceCount = unitsData.filter((u) => u.hasEvidence).length;
    const evidenceRate = total > 0 ? (evidenceCount / total) * 100 : 0;

    return {
      total,
      activeCount,
      activeRate: activeRate.toFixed(1),
      evidenceCount,
      evidenceRate: evidenceRate.toFixed(1),
    };
  }, [unitsData]);

  // Filter list by search & status
  const filteredUnits = useMemo(() => {
    return unitsData.filter((unit) => {
      const matchesSearch =
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && unit.isActive) ||
        (statusFilter === "inactive" && !unit.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [unitsData, searchTerm, statusFilter]);

  // ─── Calculations (Phần cũ) ────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!selectedEntity) {
      return {
        regions: mockGeneralStats.regionsCount,
        areas: mockGeneralStats.areasCount,
        plots: mockGeneralStats.plotsCount,
      };
    }

    if (selectedEntity.id === "ecofarm") {
      return {
        regions: 2,
        areas: 5,
        plots: 15,
      };
    }

    if (selectedEntity.id === "hoabinh") {
      return {
        regions: 2,
        areas: 7,
        plots: 21,
      };
    }

    return {
      regions: 1,
      areas: 2,
      plots: 5,
    };
  }, [selectedEntity]);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const openDrawer = (unit: AdminUnitReport) => {
    setActiveUnit(unit);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveUnit(null);
  };

  const renderProgressCircle = (percentage: number) => {
    const radius = 24;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <svg className="w-14 h-14 transform -rotate-90 select-none shrink-0">
        <circle
          cx="28"
          cy="28"
          r={radius}
          className="stroke-slate-100"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          className="stroke-emerald-600 transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* =======================================================================
          MỚI: PHÂN KHU GIÁM SÁT HOẠT ĐỘNG CẬP NHẬT
          ======================================================================= */}
      <div className="space-y-6">
        {/* Title & Month/Year Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4.5 rounded-xl border border-slate-100 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Nhật ký hoạt động nông nghiệp
            </h2>
            <p className="text-xs text-slate-500">
              Giám sát mức độ hoạt động và tính minh bạch minh chứng của các đơn
              vị
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-32">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9.5">
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={String(i + 1)}
                      className="text-xs"
                    >
                      Tháng {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-28">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9.5">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025" className="text-xs">
                    2025
                  </SelectItem>
                  <SelectItem value="2026" className="text-xs">
                    2026
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 2 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Active Rate */}
          <Card className="border border-slate-100 shadow-xs bg-white rounded-xl relative overflow-hidden transition-all hover:shadow-sm">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider font-display">
                    Tỷ lệ Đơn vị Active
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer">
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs p-3 space-y-1.5 bg-slate-900 text-white rounded-lg shadow-xl leading-relaxed z-[100]">
                      <p className="font-bold text-emerald-400">
                        Điều kiện để Đơn vị được tính là Active:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Cập nhật canh tác ≥ 2 lần/tháng</li>
                        <li>Cập nhật trên ≥ 2 ngày khác nhau</li>
                        <li>Cập nhật sử dụng vật tư ≥ 1 lần/tháng</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight font-display">
                    {kpis.activeRate}%
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    ({kpis.activeCount}/{kpis.total} đơn vị)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Các đơn vị duy trì tần suất nhật ký canh tác & vật tư đều đặn
                  trong tháng.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                {renderProgressCircle(parseFloat(kpis.activeRate))}
                <span className="absolute text-xs font-bold text-emerald-600 font-mono">
                  {kpis.activeCount}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Evidence Rate */}
          <Card className="border border-slate-100 shadow-xs bg-white rounded-xl relative overflow-hidden transition-all hover:shadow-sm">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider font-display">
                    Tỷ lệ Đơn vị có bằng chứng
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer">
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs p-3 space-y-1.5 bg-slate-900 text-white rounded-lg shadow-xl leading-relaxed z-[100]">
                      <p className="font-bold text-emerald-400">
                        Đơn vị có bằng chứng:
                      </p>
                      <p>
                        Có tải lên hình ảnh hoặc video thực tế trong nhật ký
                        canh tác tháng này.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight font-display">
                    {kpis.evidenceRate}%
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    ({kpis.evidenceCount}/{kpis.total} đơn vị)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Mức độ minh bạch với minh chứng cụ thể cho công tác vận hành
                  nông nghiệp.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                {renderProgressCircle(parseFloat(kpis.evidenceRate))}
                <span className="absolute text-xs font-bold text-emerald-600 font-mono">
                  {kpis.evidenceCount}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider font-display">
              Bảng tra cứu hoạt động nông hộ & hợp tác xã
            </h3>

            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm tên hoặc mã đơn vị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9.5 text-xs bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 w-full"
                />
              </div>

              <div className="sm:w-48 shrink-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9.5">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      Tất cả trạng thái
                    </SelectItem>
                    <SelectItem value="active" className="text-xs">
                      Đang hoạt động
                    </SelectItem>
                    <SelectItem value="inactive" className="text-xs">
                      Tạm ngưng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                    Đơn vị thành viên
                  </th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                    Ngày hoạt động
                  </th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                    Cập nhật canh tác
                  </th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                    Trạng thái
                  </th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                    Bằng chứng hình ảnh
                  </th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider font-display text-right">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <tr
                      key={unit.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                            {unit.name}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                            MÃ: {unit.code}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {unit.activeDays} ngày
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {unit.updateCount} lần
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            ({unit.materialUpdateCount} lần vật tư)
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {unit.isActive ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-medium text-[11px] px-2.5 py-0.5 shadow-none rounded-full">
                            Đang hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-transparent font-medium text-[11px] px-2.5 py-0.5 shadow-none rounded-full">
                            Tạm ngưng
                          </Badge>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        {unit.hasEvidence ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                            <CheckCircle className="w-4.5 h-4.5" />
                            <span>Có hình ảnh</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <XCircle className="w-4.5 h-4.5 opacity-60" />
                            <span>Không có</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => openDrawer(unit)}
                          disabled={unit.updates.length === 0}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition-all ${
                            unit.updates.length === 0
                              ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400"
                              : "bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-700 cursor-pointer active:scale-97 shadow-xs"
                          }`}
                        >
                          <span>Xem lịch sử</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 px-5 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-750">
                            Không tìm thấy đơn vị nào
                          </p>
                          <p className="text-xs text-slate-400">
                            Thử thay đổi từ khóa tìm kiếm hoặc điều kiện lọc
                            trạng thái.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ─── Đường phân tách phân khu ─── */}
      {/* <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest text-slate-400 font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            Cơ cấu hạ tầng & Báo cáo chi tiết
          </span>
        </div>
      </div> */}

      {/* =======================================================================
          CŨ: PHÂN KHU BÁO CÁO HẠ TẦNG VÀ CHI TIẾT
          ======================================================================= */}
      <div className="space-y-6">
        {/* 3 KPI Cards cũ */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Phân bổ theo vùng trồng
                </p>
                <p className="text-3xl font-display font-extrabold text-slate-800">
                  {stats.regions}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Vùng canh tác trọng điểm
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Map className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Phân bổ khu vực
                </p>
                <p className="text-3xl font-display font-extrabold text-slate-800">
                  {stats.areas}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Phân khu chức năng
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Grid className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xs relative overflow-hidden bg-white rounded-xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Phân bổ lô
                </p>
                <p className="text-3xl font-display font-extrabold text-slate-800">
                  {stats.plots}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Đơn vị canh tác nhỏ nhất
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <SproutIcon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Layout 2 cột cũ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 lg:sticky lg:top-6 shrink-0">
            <EntitySidebar
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <AdminHealthSection selectedEntity={selectedEntity} />
            <AdminMaterialSection selectedEntity={selectedEntity} />
            <AdminOperationsSection selectedEntity={selectedEntity} />
            <AdminPersonnelSection selectedEntity={selectedEntity} />
          </div>
        </div>
      </div>

      {/* ─── 4. Timeline Sidebar Drawer (Mới) ─── */}
      {drawerOpen && activeUnit && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={closeDrawer}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 ease-in-out border-l flex flex-col h-full animate-in slide-in-from-right duration-300">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-850 font-display uppercase">
                    Nhật ký: {activeUnit.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    MÃ: {activeUnit.code} • CẬP NHẬT: {activeUnit.updateCount}{" "}
                    LẦN
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="relative border-l border-slate-200 ml-3.5 space-y-8 pb-6">
                  {activeUnit.updates.map((update) => (
                    <div key={update.id} className="relative pl-7">
                      <span className="absolute -left-3.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                      </span>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[11px] text-slate-450 border-b border-slate-200/50 pb-2">
                          <span className="font-mono font-bold">
                            {update.timestamp}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <User className="w-3 h-3 text-slate-400" />
                            {update.actor}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-800">
                            {update.action}
                          </h4>
                          <p className="text-xs text-slate-605 leading-relaxed">
                            {update.details}
                          </p>
                        </div>

                        {update.images && update.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {update.images.map((img, i) => (
                              <button
                                key={i}
                                onClick={() => setLightboxImage(img)}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 cursor-zoom-in transition-all group shrink-0"
                              >
                                <img
                                  src={img}
                                  alt="Bằng chứng hoạt động"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. Image Lightbox Zoom (Mới) ─── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center animate-in zoom-in-95 duration-200">
            <img
              src={lightboxImage}
              alt="Ảnh bằng chứng phóng to"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewAdminDashboard;
