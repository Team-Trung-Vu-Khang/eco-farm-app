import React, { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Combobox,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  MapPin,
  Search,
  Sprout,
  Trash2,
} from "lucide-react";
import { HealthFormFields } from "./HealthFormFields";
import type { HealthStatusType } from "@/features/health-diary/types/health-diary.types";

interface IndividualPlantHealthBlockProps {
  selectedZone: any;
  allZones?: any[];
  onSelectZone?: (zoneId: string) => void;
  onSubmit: (payload: {
    plantCodes: string[];
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => void;
  isSubmitting?: boolean;
}

// Mock database of plant codes for the zone
const MOCK_PLANTS_FOR_ZONE = Array.from({ length: 40 }).map((_, idx) => ({
  code: `TREE-${String(idx + 101).padStart(5, "0")}`,
  regionName: idx < 20 ? "Vùng lúa ST25" : "Vùng trồng cây ăn quả",
  areaName: idx < 15 ? "Khu vực A" : idx < 30 ? "Khu vực B" : "Khu vực C",
  plotName: `Lô ${(idx % 5) + 1}`,
}));

export const IndividualPlantHealthBlock: React.FC<
  IndividualPlantHealthBlockProps
> = ({
  selectedZone,
  allZones = [],
  onSelectZone,
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [selectedPlot, setSelectedPlot] = useState<string>("ALL");
  const [plantSearch, setPlantSearch] = useState("");
  const [selectedPlantCodes, setSelectedPlantCodes] = useState<string[]>([
    "TREE-00101",
    "TREE-00102",
    "TREE-00105",
  ]);

  // Boolean flags for hierarchical level selection tracking
  const isZoneSelected = Boolean(selectedZone && selectedZone.id);
  const isRegionSelected =
    isZoneSelected && selectedRegion !== "ALL" && Boolean(selectedRegion);
  const isAreaSelected =
    isRegionSelected && selectedArea !== "ALL" && Boolean(selectedArea);

  // 1. Zone Combobox Options (Vùng canh tác)
  const zoneOptions = useMemo(() => {
    if (!allZones || allZones.length === 0) {
      if (selectedZone) {
        return [{ value: String(selectedZone.id), label: selectedZone.name }];
      }
      return [];
    }
    return allZones.map((z: any) => ({
      value: String(z.id),
      label: z.name || `Vùng canh tác ${z.id}`,
    }));
  }, [allZones, selectedZone]);

  const handleZoneChange = (zoneId: string) => {
    if (onSelectZone && zoneId) {
      onSelectZone(zoneId);
      setSelectedRegion("ALL");
      setSelectedArea("ALL");
      setSelectedPlot("ALL");
    }
  };

  // 2. Region Combobox Options (Vùng trồng) - Only available when Zone is selected
  const regionsList = useMemo(() => {
    if (!isZoneSelected) return [];
    if (Array.isArray(selectedZone.scopes) && selectedZone.scopes.length > 0) {
      return selectedZone.scopes;
    }
    if (Array.isArray(selectedZone.regions)) return selectedZone.regions;
    return [
      {
        id: "r1",
        name: "Vùng lúa ST25",
        areas: selectedZone.areas || [],
      },
      {
        id: "r2",
        name: "Vùng trồng cây ăn quả",
        areas: [],
      },
    ];
  }, [selectedZone, isZoneSelected]);

  const regionOptions = useMemo(() => {
    if (!isZoneSelected) return [];
    const options = [{ value: "ALL", label: "Tất cả vùng trồng" }];
    regionsList.forEach((r: any) => {
      options.push({
        value: r.name || String(r.id),
        label: r.name,
      });
    });
    return options;
  }, [regionsList, isZoneSelected]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedArea("ALL");
    setSelectedPlot("ALL");
  };

  // 3. Area Combobox Options (Khu vực) - Only available when Region is selected
  const areasList = useMemo(() => {
    if (!isRegionSelected) return [];
    const matchedRegion = regionsList.find(
      (r: any) => (r.name || String(r.id)) === selectedRegion,
    );
    if (
      matchedRegion &&
      Array.isArray(matchedRegion.areas) &&
      matchedRegion.areas.length > 0
    ) {
      return matchedRegion.areas;
    }
    if (Array.isArray(selectedZone?.areas) && selectedZone.areas.length > 0) {
      return selectedZone.areas;
    }
    return [
      { id: "a1", name: "Khu vực A" },
      { id: "a2", name: "Khu vực B" },
      { id: "a3", name: "Khu vực C" },
    ];
  }, [selectedZone, regionsList, selectedRegion, isRegionSelected]);

  const areaOptions = useMemo(() => {
    if (!isRegionSelected) return [];
    const options = [{ value: "ALL", label: "Tất cả khu vực" }];
    areasList.forEach((area: any) => {
      options.push({
        value: area.name || String(area.id),
        label: area.name,
      });
    });
    return options;
  }, [areasList, isRegionSelected]);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    setSelectedPlot("ALL");
  };

  // 4. Plot Combobox Options (Lô) - Only available when Area is selected
  const plotsList = useMemo(() => {
    if (!isAreaSelected) return [];
    const matchedArea = areasList.find(
      (a: any) => (a.name || String(a.id)) === selectedArea,
    );
    if (
      matchedArea &&
      Array.isArray(matchedArea.plots) &&
      matchedArea.plots.length > 0
    ) {
      return matchedArea.plots;
    }
    return [
      { id: "p1", name: "Lô 1" },
      { id: "p2", name: "Lô 2" },
      { id: "p3", name: "Lô 3" },
      { id: "p4", name: "Lô 4" },
      { id: "p5", name: "Lô 5" },
    ];
  }, [areasList, selectedArea, isAreaSelected]);

  const plotOptions = useMemo(() => {
    if (!isAreaSelected) return [];
    const options = [{ value: "ALL", label: "Tất cả lô" }];
    plotsList.forEach((plot: any) => {
      options.push({
        value: plot.name || String(plot.id),
        label: plot.name,
      });
    });
    return options;
  }, [plotsList, isAreaSelected]);

  // Filtered plant list based on 4 cascading levels & search keyword
  const filteredAvailablePlants = useMemo(() => {
    return MOCK_PLANTS_FOR_ZONE.filter((plant) => {
      const matchRegion =
        selectedRegion === "ALL" || plant.regionName === selectedRegion;
      const matchArea =
        selectedArea === "ALL" || plant.areaName === selectedArea;
      const matchPlot =
        selectedPlot === "ALL" || plant.plotName === selectedPlot;
      const matchSearch =
        !plantSearch.trim() ||
        plant.code.toLowerCase().includes(plantSearch.toLowerCase().trim()) ||
        plant.plotName
          .toLowerCase()
          .includes(plantSearch.toLowerCase().trim()) ||
        plant.areaName.toLowerCase().includes(plantSearch.toLowerCase().trim());
      return matchRegion && matchArea && matchPlot && matchSearch;
    });
  }, [selectedRegion, selectedArea, selectedPlot, plantSearch]);

  // Partition into Selected (Đã chọn) and Unselected (Chưa chọn)
  const { selectedTrees, unselectedTrees } = useMemo(() => {
    const selected: typeof MOCK_PLANTS_FOR_ZONE = [];
    const unselected: typeof MOCK_PLANTS_FOR_ZONE = [];
    filteredAvailablePlants.forEach((plant) => {
      if (selectedPlantCodes.includes(plant.code)) {
        selected.push(plant);
      } else {
        unselected.push(plant);
      }
    });
    return { selectedTrees: selected, unselectedTrees: unselected };
  }, [filteredAvailablePlants, selectedPlantCodes]);

  const togglePlantCode = (code: string) => {
    setSelectedPlantCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSelectAllFiltered = () => {
    const newCodes = filteredAvailablePlants.map((p) => p.code);
    setSelectedPlantCodes((prev) =>
      Array.from(new Set([...prev, ...newCodes])),
    );
  };

  const handleClearAllSelected = () => {
    setSelectedPlantCodes([]);
  };

  // Batch upload Excel / CSV plant codes
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mockUploadedCodes = [
      "TREE-00110",
      "TREE-00112",
      "TREE-00115",
      "TREE-00120",
    ];
    setSelectedPlantCodes((prev) =>
      Array.from(new Set([...prev, ...mockUploadedCodes])),
    );
  };

  const handleFormSubmit = (formData: {
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => {
    if (selectedPlantCodes.length === 0) {
      alert("Vui lòng chọn hoặc upload ít nhất 1 mã cây trồng!");
      return;
    }

    onSubmit({
      plantCodes: selectedPlantCodes,
      ...formData,
    });
  };

  const renderTreeCard = (
    plant: (typeof MOCK_PLANTS_FOR_ZONE)[0],
    isSelected: boolean,
  ) => (
    <div
      key={plant.code}
      onClick={() => togglePlantCode(plant.code)}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none",
        isSelected
          ? "bg-emerald-50/80 border-emerald-300 shadow-2xs"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0",
            isSelected
              ? "bg-emerald-600 text-white"
              : "border border-slate-300 bg-white",
          )}
        >
          {isSelected && <CheckCircle2 className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-900 text-xs truncate">
              {plant.code}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 shrink-0 font-bold"
            >
              {plant.plotName}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{plant.areaName || "Vùng canh tác"}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── SINGLE SIMPLIFIED BLOCK: QUẢN LÝ DANH SÁCH CÁ THỂ CÂY TRỒNG ── */}
      <Card className="border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <span>Danh sách cá thể cây trồng</span>
            </CardTitle>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold py-1 px-2.5 rounded-lg"
              >
                Đã chọn: {selectedPlantCodes.length} cây
              </Badge>

              {/* Batch Excel Upload Button */}
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nhập File Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
              </label>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Filter Panel: Search Bar on Top + 4 Cascading Select Filters Below */}
          <div className="space-y-3 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl">
            {/* Top Row: Search Input + Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 min-w-0 w-full">
                <Search className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <Input
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  placeholder="Tìm kiếm theo mã cây, tên lô, khu vực..."
                  className="pl-10 h-9 border-slate-200 focus:border-emerald-500 rounded-lg text-xs bg-white w-full"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 justify-end sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllFiltered}
                  className="text-xs h-9 px-3 rounded-lg font-semibold border-slate-200 bg-white hover:bg-slate-50 shrink-0 whitespace-nowrap"
                >
                  Chọn tất cả
                </Button>
                {selectedPlantCodes.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllSelected}
                    className="text-xs h-9 px-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold shrink-0 whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Bỏ chọn
                  </Button>
                )}
              </div>
            </div>

            {/* Bottom Row: 4 Cascading Select Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/60">
              {/* 1. Vùng canh tác */}
              {/* <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>Vùng canh tác</span>
                </label>
                <Combobox
                  options={zoneOptions}
                  value={String(selectedZone?.id || "")}
                  onChange={(val) => val && handleZoneChange(val)}
                  placeholder="Chọn vùng canh tác..."
                  searchPlaceholder="Tìm vùng canh tác..."
                />
              </div> */}

              {/* 2. Vùng trồng */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" />
                  <span>Vùng trồng</span>
                </label>
                <Combobox
                  options={regionOptions}
                  value={selectedRegion}
                  onChange={(val) => handleRegionChange(val || "ALL")}
                  disabled={!isZoneSelected}
                  placeholder={
                    !isZoneSelected
                      ? "Vui lòng chọn vùng canh tác..."
                      : "Chọn vùng trồng..."
                  }
                  searchPlaceholder="Tìm vùng trồng..."
                />
              </div>

              {/* 3. Khu vực */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>Khu vực</span>
                </label>
                <Combobox
                  options={areaOptions}
                  value={selectedArea}
                  onChange={(val) => handleAreaChange(val || "ALL")}
                  disabled={!isRegionSelected}
                  placeholder={
                    !isZoneSelected
                      ? "Vui lòng chọn vùng canh tác..."
                      : !isRegionSelected
                        ? "Vui lòng chọn vùng trồng..."
                        : "Chọn khu vực..."
                  }
                  searchPlaceholder="Tìm kiếm khu vực..."
                />
              </div>

              {/* 4. Lô */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  <span>Lô đất / Lô trồng</span>
                </label>
                <Combobox
                  options={plotOptions}
                  value={selectedPlot}
                  onChange={(val) => setSelectedPlot(val || "ALL")}
                  disabled={!isAreaSelected}
                  placeholder={
                    !isZoneSelected
                      ? "Vui lòng chọn vùng canh tác..."
                      : !isRegionSelected
                        ? "Vui lòng chọn vùng trồng..."
                        : !isAreaSelected
                          ? "Vui lòng chọn khu vực..."
                          : "Chọn lô..."
                  }
                  searchPlaceholder="Tìm kiếm lô..."
                />
              </div>
            </div>
          </div>

          {/* Plant Items List Container (Partitioned: Selected at top, Unselected below) */}
          <div className="max-h-120 overflow-y-auto p-3 bg-slate-50/50 border border-slate-200 rounded-xl space-y-4">
            {filteredAvailablePlants.length > 0 ? (
              <div className="space-y-4">
                {/* SECTION 1: CÁC CÂY ĐÃ CHỌN */}
                {selectedTrees.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Badge className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        Đã chọn ({selectedTrees.length})
                      </Badge>
                      <div className="h-px bg-emerald-200 flex-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2">
                      {selectedTrees.map((plant) =>
                        renderTreeCard(plant, true),
                      )}
                    </div>
                  </div>
                )}

                {/* SECTION 2: CÁC CÂY CHƯA CHỌN */}
                {unselectedTrees.length > 0 && (
                  <div className="space-y-2">
                    {selectedTrees.length > 0 && (
                      <div className="flex items-center gap-2 px-1 pt-1">
                        <span className="text-xs font-bold text-slate-500">
                          Chưa chọn ({unselectedTrees.length})
                        </span>
                        <div className="h-px bg-slate-200 flex-1" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2">
                      {unselectedTrees.map((plant) =>
                        renderTreeCard(plant, false),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Không tìm thấy cây trồng phù hợp với bộ lọc.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── BLOCK FORM CẬP NHẬT SỨC KHỎE ── */}
      <HealthFormFields
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cập nhật sức khỏe cá thể cây"
      />
    </div>
  );
};
