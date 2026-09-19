import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
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
  ChevronDown,
  Sparkles,
  Upload,
  X,
  Check,
  Filter,
  AlertTriangle,
  HeartPulse,
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

// ════════════════════════════════════════════════════════════════════════
// ── CENTRALIZED MOCK TREE SERVICE (Dễ dàng gỡ bỏ khi tích hợp API) ──
// ════════════════════════════════════════════════════════════════════════

interface PlantItem {
  code: string;
  cropName: string;
  regionName: string;
  areaName: string;
  plotName: string;
  currentStatus: "GOOD" | "WARNING" | "SICK";
}

// Explicit Plot for testing Empty State UI
const EMPTY_STATE_TEST_PLOT = {
  id: "plot-empty-test",
  name: "Lô Trống (Test Empty State UI)",
};

const STATIC_MOCK_PLANTS: PlantItem[] = [
  // Vùng lúa ST25 -> Khu vực A -> Lô 1, Lô 2, Lô 3
  ...Array.from({ length: 8 }).map((_, idx) => ({
    code: `ST25-A1-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Lúa ST25",
    regionName: "Vùng lúa ST25",
    areaName: "Khu vực A",
    plotName: "Lô 1",
    currentStatus: (idx % 3 === 0
      ? "WARNING"
      : "GOOD") as PlantItem["currentStatus"],
  })),
  ...Array.from({ length: 6 }).map((_, idx) => ({
    code: `ST25-A2-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Lúa ST25",
    regionName: "Vùng lúa ST25",
    areaName: "Khu vực A",
    plotName: "Lô 2",
    currentStatus: "GOOD" as PlantItem["currentStatus"],
  })),
  ...Array.from({ length: 6 }).map((_, idx) => ({
    code: `ST25-A3-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Lúa ST25",
    regionName: "Vùng lúa ST25",
    areaName: "Khu vực A",
    plotName: "Lô 3",
    currentStatus: (idx === 2 ? "SICK" : "GOOD") as PlantItem["currentStatus"],
  })),

  // Vùng lúa ST25 -> Khu vực B -> Lô 4, Lô 5
  ...Array.from({ length: 7 }).map((_, idx) => ({
    code: `ST25-B4-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Lúa ST25",
    regionName: "Vùng lúa ST25",
    areaName: "Khu vực B",
    plotName: "Lô 4",
    currentStatus: (idx < 2
      ? "SICK"
      : idx === 3
        ? "WARNING"
        : "GOOD") as PlantItem["currentStatus"],
  })),
  ...Array.from({ length: 5 }).map((_, idx) => ({
    code: `ST25-B5-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Lúa ST25",
    regionName: "Vùng lúa ST25",
    areaName: "Khu vực B",
    plotName: "Lô 5",
    currentStatus: "GOOD" as PlantItem["currentStatus"],
  })),

  // Vùng trồng cây ăn quả -> Khu vực C -> Lô 1, Lô 2
  ...Array.from({ length: 8 }).map((_, idx) => ({
    code: `XOAI-C1-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Xoài Cát Hòa Lộc",
    regionName: "Vùng trồng cây ăn quả",
    areaName: "Khu vực C",
    plotName: "Lô 1",
    currentStatus: (idx % 2 === 0
      ? "GOOD"
      : "WARNING") as PlantItem["currentStatus"],
  })),
  ...Array.from({ length: 6 }).map((_, idx) => ({
    code: `XOAI-C2-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Xoài Cát Hòa Lộc",
    regionName: "Vùng trồng cây ăn quả",
    areaName: "Khu vực C",
    plotName: "Lô 2",
    currentStatus: "GOOD" as PlantItem["currentStatus"],
  })),

  // Vùng trồng cây ăn quả -> Khu vực D -> Lô 3
  ...Array.from({ length: 6 }).map((_, idx) => ({
    code: `SR6-D3-${String(idx + 1).padStart(3, "0")}`,
    cropName: "Sầu riêng Ri6",
    regionName: "Vùng trồng cây ăn quả",
    areaName: "Khu vực D",
    plotName: "Lô 3",
    currentStatus: (idx === 1 ? "SICK" : "GOOD") as PlantItem["currentStatus"],
  })),
];

// Helper: Guarantee tree list for ANY selected location, except explicit Empty Test Plot
const generateTreesForSelection = (
  selectedRegions: string[],
  selectedAreas: string[],
  selectedPlots: string[],
): PlantItem[] => {
  // 1. Explicit Empty State Test Case:
  // If ONLY "Lô Trống (Test Empty State UI)" is selected, return 0 trees!
  if (
    selectedPlots.length === 1 &&
    selectedPlots[0] === EMPTY_STATE_TEST_PLOT.name
  ) {
    return [];
  }

  // 2. Filter from baseline static mock database
  const matchedStatic = STATIC_MOCK_PLANTS.filter((plant) => {
    const matchRegion =
      selectedRegions.length === 0 ||
      selectedRegions.includes(plant.regionName);
    const matchArea =
      selectedAreas.length === 0 || selectedAreas.includes(plant.areaName);
    const matchPlot =
      selectedPlots.length === 0 || selectedPlots.includes(plant.plotName);
    return matchRegion && matchArea && matchPlot;
  });

  if (matchedStatic.length > 0) {
    return matchedStatic;
  }

  // 3. Dynamic Generator Fallback:
  // Guarantee populated trees for dynamic API selections (e.g., PL-0000019 "Tên lô kiểm thử dữ liệu")
  const generated: PlantItem[] = [];
  const targetRegions =
    selectedRegions.length > 0 ? selectedRegions : ["Vùng sản xuất"];
  const targetAreas =
    selectedAreas.length > 0 ? selectedAreas : ["Khu vực sản xuất"];
  const targetPlots =
    selectedPlots.length > 0 ? selectedPlots : ["Lô sản xuất"];

  targetRegions.forEach((rName) => {
    targetAreas.forEach((aName) => {
      targetPlots.forEach((pName, pIdx) => {
        if (pName === EMPTY_STATE_TEST_PLOT.name) return;
        const count = 6 + (pIdx % 3);
        const prefix =
          pName
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 6)
            .toUpperCase() || "TREE";
        for (let i = 1; i <= count; i++) {
          generated.push({
            code: `${prefix}-${String(i).padStart(3, "0")}`,
            cropName: pName.toLowerCase().includes("lúa")
              ? "Lúa ST25"
              : pName.toLowerCase().includes("xoài")
                ? "Xoài Cát"
                : "Cây nông nghiệp",
            regionName: rName,
            areaName: aName,
            plotName: pName,
            currentStatus:
              i % 3 === 0 ? "WARNING" : i % 5 === 0 ? "SICK" : "GOOD",
          });
        }
      });
    });
  });

  return generated;
};

// ── Custom Popover MultiSelect Component with Badge Tags ──
interface MultiSelectProps {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string; subtext?: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  placeholder: string;
  disabledHint?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onChange,
  disabled = false,
  placeholder,
  disabledHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );
  }, [options, searchTerm]);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    const allVals = options.map((o) => o.value);
    onChange(allVals);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedValues.length;

  // Render text for trigger button (displays item names instead of generic text)
  const displayTriggerText = useMemo(() => {
    if (disabled) return disabledHint || placeholder;
    if (selectedCount === 0) return placeholder;
    const labels = selectedValues.map(
      (val) => options.find((o) => o.value === val)?.label || val,
    );
    return labels.join(", ");
  }, [
    disabled,
    disabledHint,
    placeholder,
    selectedCount,
    selectedValues,
    options,
  ]);

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {icon}
        <span>{label}</span>
        {selectedCount > 0 && (
          <Badge className="bg-emerald-600 text-white text-[9px] px-1.5 py-0 rounded-full font-bold ml-auto">
            {selectedCount}
          </Badge>
        )}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-9 px-3 text-xs font-semibold rounded-lg border flex items-center justify-between transition-all bg-white text-left",
          disabled
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            : selectedCount > 0
              ? "border-emerald-500 text-emerald-900 bg-emerald-50/20 ring-1 ring-emerald-500/20"
              : "border-slate-200 text-slate-700 hover:border-slate-300",
        )}
      >
        <span className="truncate font-semibold">{displayTriggerText}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ml-1",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Selected Items Badge Chips Container below dropdown input */}
      {selectedCount > 0 && !disabled && (
        <div className="flex flex-wrap gap-1 pt-1">
          {selectedValues.map((val) => {
            const labelStr = options.find((o) => o.value === val)?.label || val;
            return (
              <Badge
                key={val}
                variant="outline"
                className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold py-0.5 px-2 rounded-md flex items-center gap-1 shrink-0 max-w-full"
              >
                <span className="truncate max-w-[140px]">{labelStr}</span>
                <X
                  className="w-3 h-3 text-emerald-600 hover:text-emerald-950 cursor-pointer shrink-0 ml-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(val);
                  }}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Popover Content */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-2 text-xs animate-in fade-in zoom-in-95 duration-150 min-w-[200px]">
          {/* Quick Search */}
          {options.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 pt-0.5 px-1">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] text-emerald-600 font-bold hover:underline"
            >
              Chọn tất cả ({options.length})
            </button>
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-red-500 font-semibold hover:underline"
              >
                Bỏ chọn
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isChecked = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors select-none",
                      isChecked
                        ? "bg-emerald-50 text-emerald-900 font-medium"
                        : "hover:bg-slate-50 text-slate-700",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white",
                      )}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate flex-1 font-medium">
                      {option.label}
                    </span>
                    {option.subtext && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {option.subtext}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-slate-400 text-xs">
                Không tìm thấy lựa chọn
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const IndividualPlantHealthBlock: React.FC<
  IndividualPlantHealthBlockProps
> = ({
  selectedZone,
  allZones = [],
  onSelectZone,
  onSubmit,
  isSubmitting = false,
}) => {
  // Multi-select states for filter levels
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);

  // Search keyword & Selected tree codes
  const [plantSearch, setPlantSearch] = useState("");
  const [selectedPlantCodes, setSelectedPlantCodes] = useState<string[]>([
    "ST25-A1-001",
    "ST25-A1-002",
  ]);

  // Refs for internal container scrolling on search
  const plantListContainerRef = useRef<HTMLDivElement>(null);
  const unselectedTreesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      plantSearch.trim().length > 0 &&
      plantListContainerRef.current &&
      unselectedTreesRef.current
    ) {
      const container = plantListContainerRef.current;
      const target = unselectedTreesRef.current;
      const targetTop = target.offsetTop - container.offsetTop;
      container.scrollTo({
        top: Math.max(0, targetTop - 12),
        behavior: "smooth",
      });
    }
  }, [plantSearch]);

  // Excel / CSV / Manual Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState("");

  const isZoneSelected = Boolean(selectedZone && selectedZone.id);

  // ── 1. REGION LEVEL (Vùng trồng) OPTIONS ──
  const regionsList = useMemo(() => {
    if (!isZoneSelected) return [];

    const regionsSet = new Map<string, { id: string; name: string }>();

    // From real API selectedZone
    if (selectedZone) {
      if (
        Array.isArray(selectedZone.scopes) &&
        selectedZone.scopes.length > 0
      ) {
        selectedZone.scopes.forEach((scope: any) => {
          const rName = scope.region?.name || scope.name;
          if (rName)
            regionsSet.set(rName, {
              id: String(scope.id || rName),
              name: rName,
            });
        });
      }
      if (Array.isArray(selectedZone.regions)) {
        selectedZone.regions.forEach((r: any) => {
          if (r.name)
            regionsSet.set(r.name, {
              id: String(r.id || r.name),
              name: r.name,
            });
        });
      }
    }

    // Fallback static regions
    if (regionsSet.size === 0) {
      regionsSet.set("Vùng lúa ST25", { id: "r1", name: "Vùng lúa ST25" });
      regionsSet.set("Vùng trồng cây ăn quả", {
        id: "r2",
        name: "Vùng trồng cây ăn quả",
      });
    }

    return Array.from(regionsSet.values());
  }, [selectedZone, isZoneSelected]);

  const regionOptions = useMemo(() => {
    return regionsList.map((r) => ({
      value: r.name,
      label: r.name,
    }));
  }, [regionsList]);

  // Handle Region Selection change (reset downstream areas & plots if no longer matched)
  const handleRegionChange = (newRegions: string[]) => {
    setSelectedRegions(newRegions);
    setSelectedAreas([]);
    setSelectedPlots([]);
  };

  // ── 2. AREA LEVEL (Khu vực) OPTIONS ──
  // Extracts areas from scope.areas / scope.productionAreas OR static fallback
  const areasList = useMemo(() => {
    if (selectedRegions.length === 0) return [];

    const areasSet = new Map<string, { id: string; name: string }>();

    // A. Extract from real API selectedZone
    if (isZoneSelected && selectedZone) {
      const rawScopes = Array.isArray(selectedZone.scopes)
        ? selectedZone.scopes
        : [];
      rawScopes.forEach((scope: any) => {
        const rName = scope.region?.name || scope.name;
        if (selectedRegions.includes(rName)) {
          const scopeAreas = scope.areas || scope.productionAreas || [];
          scopeAreas.forEach((area: any) => {
            if (area.name)
              areasSet.set(area.name, {
                id: String(area.id || area.name),
                name: area.name,
              });
          });
        }
      });

      const zoneAreas =
        selectedZone.areas || selectedZone.productionAreas || [];
      zoneAreas.forEach((area: any) => {
        if (area.name)
          areasSet.set(area.name, {
            id: String(area.id || area.name),
            name: area.name,
          });
      });
    }

    // B. Fallback from Static MOCK database
    STATIC_MOCK_PLANTS.forEach((plant) => {
      if (selectedRegions.includes(plant.regionName) && plant.areaName) {
        areasSet.set(plant.areaName, {
          id: plant.areaName,
          name: plant.areaName,
        });
      }
    });

    return Array.from(areasSet.values());
  }, [selectedRegions, isZoneSelected, selectedZone]);

  const areaOptions = useMemo(() => {
    return areasList.map((a) => ({
      value: a.name,
      label: a.name,
    }));
  }, [areasList]);

  const handleAreaChange = (newAreas: string[]) => {
    setSelectedAreas(newAreas);
    setSelectedPlots([]);
  };

  // ── 3. PLOT LEVEL (Lô) OPTIONS ──
  // Extracts plots from area.plots OR area.productionUnits (API field) + EMPTY_STATE_TEST_PLOT
  const plotsList = useMemo(() => {
    if (selectedRegions.length === 0) return [];
    if (areasList.length > 0 && selectedAreas.length === 0) return [];

    const plotsSet = new Map<string, { id: string; name: string }>();

    // A. Extract from real API selectedZone (checking area.plots AND area.productionUnits!)
    if (isZoneSelected && selectedZone) {
      const rawScopes = Array.isArray(selectedZone.scopes)
        ? selectedZone.scopes
        : [];
      rawScopes.forEach((scope: any) => {
        const scopeAreas = scope.areas || scope.productionAreas || [];
        scopeAreas.forEach((area: any) => {
          if (selectedAreas.length === 0 || selectedAreas.includes(area.name)) {
            // Checked both plots and productionUnits from API payload!
            const rawPlots = area.plots || area.productionUnits || [];
            rawPlots.forEach((plot: any) => {
              if (plot.name)
                plotsSet.set(plot.name, {
                  id: String(plot.id || plot.name),
                  name: plot.name,
                });
            });
          }
        });
      });

      const zoneAreas =
        selectedZone.areas || selectedZone.productionAreas || [];
      zoneAreas.forEach((area: any) => {
        if (selectedAreas.length === 0 || selectedAreas.includes(area.name)) {
          const rawPlots = area.plots || area.productionUnits || [];
          rawPlots.forEach((plot: any) => {
            if (plot.name)
              plotsSet.set(plot.name, {
                id: String(plot.id || plot.name),
                name: plot.name,
              });
          });
        }
      });
    }

    // B. Fallback from Static MOCK database
    STATIC_MOCK_PLANTS.forEach((plant) => {
      const matchRegion = selectedRegions.includes(plant.regionName);
      const matchArea =
        areasList.length === 0 || selectedAreas.includes(plant.areaName);
      if (matchRegion && matchArea && plant.plotName) {
        plotsSet.set(plant.plotName, {
          id: plant.plotName,
          name: plant.plotName,
        });
      }
    });

    // C. Add Explicit Empty State Test Plot Option
    plotsSet.set(EMPTY_STATE_TEST_PLOT.name, EMPTY_STATE_TEST_PLOT);

    return Array.from(plotsSet.values());
  }, [selectedRegions, selectedAreas, areasList, isZoneSelected, selectedZone]);

  const plotOptions = useMemo(() => {
    return plotsList.map((p) => ({
      value: p.name,
      label: p.name,
    }));
  }, [plotsList]);

  // ── LOCATION FILTER SATISFACTION EVALUATION ──
  const isRegionSatisfied = selectedRegions.length > 0;
  const hasAreaLevel = areasList.length > 0;
  const isAreaSatisfied = !hasAreaLevel || selectedAreas.length > 0;
  const hasPlotLevel = plotsList.length > 0;
  const isPlotSatisfied = !hasPlotLevel || selectedPlots.length > 0;

  const isMatrixSatisfied =
    isZoneSelected && isRegionSatisfied && isAreaSatisfied && isPlotSatisfied;

  // ── GENERATE / FILTER TREES BASED ON SELECTIONS + SEARCH ──
  const filteredAvailablePlants = useMemo(() => {
    if (!isMatrixSatisfied) return [];

    const baseTrees = generateTreesForSelection(
      selectedRegions,
      selectedAreas,
      selectedPlots,
    );

    return baseTrees.filter((plant) => {
      return (
        !plantSearch.trim() ||
        plant.code.toLowerCase().includes(plantSearch.toLowerCase().trim()) ||
        plant.cropName
          .toLowerCase()
          .includes(plantSearch.toLowerCase().trim()) ||
        plant.plotName
          .toLowerCase()
          .includes(plantSearch.toLowerCase().trim()) ||
        plant.areaName
          .toLowerCase()
          .includes(plantSearch.toLowerCase().trim()) ||
        plant.regionName
          .toLowerCase()
          .includes(plantSearch.toLowerCase().trim())
      );
    });
  }, [
    isMatrixSatisfied,
    selectedRegions,
    selectedAreas,
    selectedPlots,
    plantSearch,
  ]);

  // ── SEPARATE SELECTED VS UNSELECTED TREES ──
  const { selectedTrees, unselectedTrees } = useMemo(() => {
    const selected: PlantItem[] = [];
    const unselected: PlantItem[] = [];

    filteredAvailablePlants.forEach((plant) => {
      if (selectedPlantCodes.includes(plant.code)) {
        selected.push(plant);
      } else {
        unselected.push(plant);
      }
    });

    selectedPlantCodes.forEach((code) => {
      if (!selected.some((p) => p.code === code)) {
        const found = STATIC_MOCK_PLANTS.find((p) => p.code === code);
        if (found) {
          selected.push(found);
        } else {
          selected.push({
            code,
            cropName: "Cây tự định nghĩa",
            regionName: "Đã upload",
            areaName: "Tự định nghĩa",
            plotName: "N/A",
            currentStatus: "GOOD",
          });
        }
      }
    });

    return { selectedTrees: selected, unselectedTrees: unselected };
  }, [filteredAvailablePlants, selectedPlantCodes]);

  // ── NESTED GEOGRAPHICAL GROUPING FOR TREES (Region -> Area > Plot) ──
  const groupTreesByHierarchy = (trees: PlantItem[]) => {
    const regionMap = new Map<
      string,
      Map<string, { areaName: string; plotName: string; plants: PlantItem[] }>
    >();

    trees.forEach((plant) => {
      const rName = plant.regionName || "Vùng chưa xác định";
      const subKey = `${plant.areaName}${plant.plotName ? ` › ${plant.plotName}` : ""}`;

      if (!regionMap.has(rName)) {
        regionMap.set(rName, new Map());
      }
      const subMap = regionMap.get(rName)!;
      if (!subMap.has(subKey)) {
        subMap.set(subKey, {
          areaName: plant.areaName,
          plotName: plant.plotName,
          plants: [],
        });
      }
      subMap.get(subKey)!.plants.push(plant);
    });

    return Array.from(regionMap.entries()).map(([regionName, subMap]) => ({
      regionName,
      subGroups: Array.from(subMap.entries()).map(([subKey, data]) => ({
        subKey,
        ...data,
      })),
    }));
  };

  const groupedSelectedTrees = useMemo(
    () => groupTreesByHierarchy(selectedTrees),
    [selectedTrees],
  );

  const groupedUnselectedTrees = useMemo(
    () => groupTreesByHierarchy(unselectedTrees),
    [unselectedTrees],
  );

  // ── HANDLERS ──
  const togglePlantCode = (code: string) => {
    setSelectedPlantCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSelectSubGroup = (plants: PlantItem[]) => {
    const codesToAdd = plants.map((p) => p.code);
    setSelectedPlantCodes((prev) =>
      Array.from(new Set([...prev, ...codesToAdd])),
    );
  };

  const handleDeselectSubGroup = (plants: PlantItem[]) => {
    const codesToRemove = new Set(plants.map((p) => p.code));
    setSelectedPlantCodes((prev) => prev.filter((c) => !codesToRemove.has(c)));
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

  // Excel / Text Upload Process
  const handleProcessUploadedCodes = (rawInput: string) => {
    if (!rawInput.trim()) return;
    const extractedCodes = rawInput
      .split(/[\n,;]+/)
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    if (extractedCodes.length > 0) {
      setSelectedPlantCodes((prev) =>
        Array.from(new Set([...prev, ...extractedCodes])),
      );
      setManualCodeInput("");
      setIsUploadModalOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mockUploaded = [
      "ST25-A1-003",
      "ST25-A1-004",
      "ST25-B4-001",
      "XOAI-C1-005",
    ];
    setSelectedPlantCodes((prev) =>
      Array.from(new Set([...prev, ...mockUploaded])),
    );
    setIsUploadModalOpen(false);
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

  // Sleek Health Status Badge Component
  const renderStatusBadge = (status: PlantItem["currentStatus"]) => {
    switch (status) {
      case "GOOD":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100/70 text-emerald-700 shrink-0 flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Khỏe mạnh
          </span>
        );
      case "WARNING":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-800 shrink-0 flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" />
            Cảnh báo
          </span>
        );
      case "SICK":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 shrink-0 flex items-center gap-0.5">
            <HeartPulse className="w-2.5 h-2.5" />
            Nhiễm bệnh
          </span>
        );
      default:
        return null;
    }
  };

  // Sleek Tree Card Renderer
  const renderTreeCard = (plant: PlantItem, isSelected: boolean) => (
    <div
      key={plant.code}
      onClick={() => togglePlantCode(plant.code)}
      className={cn(
        "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none group",
        isSelected
          ? "bg-emerald-50/90 border-emerald-300 shadow-2xs text-emerald-950"
          : "bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/70 text-slate-800",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          className={cn(
            "w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0",
            isSelected
              ? "bg-emerald-600 text-white"
              : "border border-slate-300 bg-white group-hover:border-emerald-500",
          )}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap justify-between">
            <span className="font-extrabold text-xs tracking-tight truncate">
              {plant.code}
            </span>
            {renderStatusBadge(plant.currentStatus)}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate mt-0.5">
            <span className="font-bold text-slate-600 truncate">
              {plant.cropName}
            </span>
            <span>•</span>
            <span className="truncate">{plant.plotName}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // If Cultivation Zone (Vùng canh tác) is not selected, show guidance view
  if (!isZoneSelected) {
    return (
      <Card className="border border-amber-200/80 bg-linear-to-b from-amber-50/40 via-white to-white rounded-2xl shadow-xs overflow-hidden p-6 sm:p-10 text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs animate-bounce">
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <span>Chưa chọn Vùng canh tác</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vui lòng chọn một{" "}
            <strong className="text-emerald-700 font-bold">
              Vùng canh tác
            </strong>{" "}
            ở góc trên trang trước. Sau đó hệ thống sẽ hiển thị bộ lọc vị trí và
            danh sách cây trồng tương ứng.
          </p>
        </div>

        {/* Visual Step Guidance */}
        <div className="max-w-md mx-auto bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-200/60">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Các bước để hiển thị cây trồng:</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-extrabold text-slate-900">
                  Chọn Vùng canh tác ở góc trên
                </p>
                <p className="text-[11px] text-amber-800">
                  Cần thực hiện bước này đầu tiên
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 opacity-60 px-2">
              <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-slate-800">
                  Lọc vị trí (Vùng trồng → Khu vực → Lô)
                </p>
                <p className="text-[11px] text-slate-500">
                  Lựa chọn các khu vực/lô cụ thể để thu hẹp cây
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 opacity-60 px-2">
              <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-slate-800">
                  Chọn cây & Gửi thông tin nhật ký sức khỏe
                </p>
                <p className="text-[11px] text-slate-500">
                  Đánh dấu danh sách cây và cập nhật tình trạng
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── CARD HEADER & STEP-BY-STEP SELECTION MATRIX UI ── */}
      <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <span>Danh sách cá thể cây trồng</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5 ml-9">
                Chọn lần lượt theo bộ lọc vị trí (Vùng trồng → Khu vực → Lô) để
                hiển thị danh sách cây
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold py-1 px-3 rounded-lg"
              >
                Đã chọn: {selectedPlantCodes.length} cây
              </Badge>

              {/* Upload Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="h-8 text-xs font-semibold px-3 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nhập mã cây / Excel</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* ── STEP-BY-STEP PROGRESS & STATUS INDICATOR BANNER ── */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bộ lọc vị trí cây trồng</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {isMatrixSatisfied ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã xác định vị trí cây trồng
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold">
                    Vui lòng chọn Vùng trồng, Khu vực và Lô đất
                  </span>
                )}
              </div>
            </div>

            {/* Stepper Progress Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {/* Step 1: Vùng trồng */}
              <div
                className={cn(
                  "p-2 rounded-lg border flex items-center gap-2 transition-all",
                  isRegionSatisfied
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                    : isZoneSelected
                      ? "bg-white border-amber-300 text-amber-900 shadow-2xs"
                      : "bg-slate-100 border-slate-200 text-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                    isRegionSatisfied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  1
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">
                    Vùng trồng{" "}
                    {selectedRegions.length > 0 &&
                      `(${selectedRegions.length})`}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">
                    {isRegionSatisfied ? "Đã chọn" : "Bắt buộc chọn"}
                  </p>
                </div>
              </div>

              {/* Step 2: Khu vực */}
              <div
                className={cn(
                  "p-2 rounded-lg border flex items-center gap-2 transition-all",
                  !hasAreaLevel
                    ? "bg-slate-100 border-slate-200 text-slate-400 opacity-60"
                    : isAreaSatisfied
                      ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                      : isRegionSatisfied
                        ? "bg-white border-amber-300 text-amber-900 shadow-2xs"
                        : "bg-slate-100 border-slate-200 text-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                    isAreaSatisfied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  2
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">
                    Khu vực{" "}
                    {selectedAreas.length > 0 && `(${selectedAreas.length})`}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">
                    {!hasAreaLevel
                      ? "Không có khu vực"
                      : isAreaSatisfied
                        ? "Đã chọn"
                        : "Bắt buộc chọn"}
                  </p>
                </div>
              </div>

              {/* Step 3: Lô đất */}
              <div
                className={cn(
                  "p-2 rounded-lg border flex items-center gap-2 transition-all",
                  !hasPlotLevel
                    ? "bg-slate-100 border-slate-200 text-slate-400 opacity-60"
                    : isPlotSatisfied
                      ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                      : isAreaSatisfied
                        ? "bg-white border-amber-300 text-amber-900 shadow-2xs"
                        : "bg-slate-100 border-slate-200 text-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                    isPlotSatisfied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  3
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">
                    Lô đất{" "}
                    {selectedPlots.length > 0 && `(${selectedPlots.length})`}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">
                    {!hasPlotLevel
                      ? "Không có lô"
                      : isPlotSatisfied
                        ? "Đã chọn"
                        : "Bắt buộc chọn"}
                  </p>
                </div>
              </div>

              {/* Step 4: Danh sách cây */}
              <div
                className={cn(
                  "p-2 rounded-lg border flex items-center gap-2 transition-all",
                  isMatrixSatisfied
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
                    : "bg-slate-100 border-slate-200 text-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                    isMatrixSatisfied
                      ? "bg-white text-emerald-700"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  4
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">
                    Danh sách cây
                  </p>
                  <p
                    className={cn(
                      "text-[9px] truncate",
                      isMatrixSatisfied ? "text-emerald-100" : "text-slate-400",
                    )}
                  >
                    {isMatrixSatisfied ? "Sẵn sàng chọn" : "Chưa đủ điều kiện"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cascading MultiSelect Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* 1. Vùng trồng (MultiSelect) */}
              <MultiSelectDropdown
                label="1. Vùng trồng"
                icon={<Sprout className="w-3 h-3 text-emerald-600" />}
                options={regionOptions}
                selectedValues={selectedRegions}
                onChange={handleRegionChange}
                disabled={!isZoneSelected}
                placeholder="Chọn 1 hoặc nhiều vùng trồng..."
                disabledHint="Vui lòng chọn Vùng canh tác bên trên..."
              />

              {/* 2. Khu vực (MultiSelect) */}
              <MultiSelectDropdown
                label="2. Khu vực"
                icon={<Layers className="w-3 h-3 text-emerald-600" />}
                options={areaOptions}
                selectedValues={selectedAreas}
                onChange={handleAreaChange}
                disabled={!isRegionSatisfied || !hasAreaLevel}
                placeholder="Chọn 1 hoặc nhiều khu vực..."
                disabledHint={
                  !isRegionSatisfied
                    ? "Vui lòng chọn Vùng trồng trước..."
                    : "Không có khu vực nào"
                }
              />

              {/* 3. Lô đất (MultiSelect) */}
              <MultiSelectDropdown
                label="3. Lô đất"
                icon={<FileSpreadsheet className="w-3 h-3 text-emerald-600" />}
                options={plotOptions}
                selectedValues={selectedPlots}
                onChange={setSelectedPlots}
                disabled={!isAreaSatisfied || !hasPlotLevel}
                placeholder="Chọn 1 hoặc nhiều lô..."
                disabledHint={
                  !isAreaSatisfied
                    ? "Vui lòng chọn Khu vực trước..."
                    : "Không có lô nào"
                }
              />
            </div>
          </div>

          {/* Search & Actions Bar (Visible when matrix is satisfied) */}
          {isMatrixSatisfied && (
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="relative flex-1 min-w-0 w-full">
                <Search className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <Input
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  placeholder="Tìm kiếm theo mã cây, loại cây, lô, khu vực..."
                  className="pl-10 h-8 border-slate-200 focus:border-emerald-500 rounded-lg text-xs bg-white w-full"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 justify-end sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllFiltered}
                  className="text-xs h-8 px-3 rounded-lg font-semibold border-slate-200 bg-white hover:bg-slate-50 shrink-0 whitespace-nowrap"
                >
                  Chọn tất cả ({filteredAvailablePlants.length})
                </Button>
                {selectedPlantCodes.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllSelected}
                    className="text-xs h-8 px-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold shrink-0 whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Bỏ chọn tất cả
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── PLANT LIST DISPLAY AREA (GEOGRAPHICALLY GROUPED) ── */}
          <div
            ref={plantListContainerRef}
            className="max-h-160 overflow-y-auto p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl space-y-6"
          >
            {/* SECTION A: CÁC CÂY ĐÃ CHỌN (Gom nhóm theo Vùng trồng → Khu vực › Lô) */}
            {selectedTrees.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 pb-1 border-b border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-2xs">
                      Cây đã chọn ({selectedTrees.length})
                    </Badge>
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                      (Đã phân nhóm theo đơn vị vị trí địa lý)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllSelected}
                    className="text-[11px] font-bold text-red-500 hover:underline"
                  >
                    Xóa tất cả cây đã chọn
                  </button>
                </div>

                {/* Hierarchical Grouping for Selected Trees */}
                <div className="space-y-4">
                  {groupedSelectedTrees.map(({ regionName, subGroups }) => (
                    <div
                      key={regionName}
                      className="space-y-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/50"
                    >
                      {/* Region Header Level 1 */}
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                          {regionName}
                        </span>
                        <div className="h-px bg-emerald-200 flex-1" />
                      </div>

                      {/* Sub-groups Level 2 (Area › Plot) */}
                      <div className="space-y-3">
                        {subGroups.map(({ subKey, plants }) => (
                          <div key={subKey} className="space-y-1.5 pl-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="text-[11px] font-bold text-slate-700">
                                  {subKey}
                                </span>
                                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-full">
                                  {plants.length} cây
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeselectSubGroup(plants)}
                                className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
                              >
                                Bỏ chọn nhóm này
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2">
                              {plants.map((plant) =>
                                renderTreeCard(plant, true),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION B: CÁC CÂY CHƯA CHỌN (Gom nhóm theo Vùng trồng → Khu vực › Lô) */}
            {isMatrixSatisfied ? (
              unselectedTrees.length > 0 ? (
                <div ref={unselectedTreesRef} className="space-y-4 scroll-mt-4">
                  <div className="flex items-center gap-2 px-1 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-extrabold text-slate-800">
                      Cây chưa chọn ({unselectedTrees.length})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (Phân nhóm theo Vùng trồng → Khu vực › Lô)
                    </span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  {/* Hierarchical Grouping for Unselected Trees */}
                  <div className="space-y-5">
                    {groupedUnselectedTrees.map(({ regionName, subGroups }) => (
                      <div key={regionName} className="space-y-3">
                        {/* Region Header Level 1 */}
                        <div className="flex items-center gap-2 px-1">
                          <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                            {regionName}
                          </span>
                          <div className="h-px bg-slate-200/80 flex-1" />
                        </div>

                        {/* Sub-groups Level 2 (Area › Plot) */}
                        <div className="space-y-3 pl-2">
                          {subGroups.map(({ subKey, plants }) => (
                            <div key={subKey} className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2 px-1">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="text-xs font-bold text-slate-700">
                                    {subKey}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.2 rounded-full">
                                    {plants.length} cây
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSelectSubGroup(plants)}
                                  className="text-[10px] font-bold text-emerald-600 hover:underline"
                                >
                                  + Chọn tất cả trong lô này
                                </button>
                              </div>

                              {/* Tree Cards Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2 pl-2 border-l-2 border-emerald-500/20">
                                {plants.map((plant) =>
                                  renderTreeCard(plant, false),
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* EMPTY STATE WHEN PLOT HAS NO TREES (E.G. EMPTY TEST PLOT CASE) */
                <div className="p-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Sprout className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">
                    Không tìm thấy cây trồng trong phạm vi này
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Hiện chưa có dữ liệu cá thể cây trồng ở vị trí vừa chọn hoặc
                    tất cả đã được đánh dấu chọn.
                  </p>
                </div>
              )
            ) : (
              /* UNFINISHED FILTER INDICATOR */
              selectedTrees.length === 0 && (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-800">
                      Chưa hiển thị danh sách cây trồng
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Vui lòng hoàn thành chọn theo thứ tự{" "}
                      <span className="font-bold text-emerald-700">
                        Vùng trồng → Khu vực → Lô đất
                      </span>{" "}
                      ở khung bộ lọc phía trên để hiển thị danh sách cây tương
                      ứng. Hoặc bấm{" "}
                      <span className="font-bold text-slate-700">
                        "Nhập mã cây / Excel"
                      </span>{" "}
                      để tải danh sách sẵn có.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── EXCEL & MANUAL PLANT CODES UPLOAD DIALOG ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-800 text-sm">
                  Nhập danh sách mã cây trồng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Cách 1: Tải file Excel / CSV (.xlsx, .csv)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  Bấm để tải file lên
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Hệ thống tự động trích xuất các mã cây có trong file
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Hoặc
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* Option 2: Manual Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Cách 2: Nhập trực tiếp danh sách mã cây
              </label>
              <textarea
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                placeholder="Ví dụ: ST25-A1-001, ST25-A1-002, XOAI-C1-003 (Phân tách bằng dấu phẩy hoặc xuống dòng)"
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs h-9 px-4 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleProcessUploadedCodes(manualCodeInput)}
                className="text-xs h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Thêm vào danh sách chọn
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── BLOCK FORM CẬP NHẬT SỨC KHỎE ── */}
      <HealthFormFields
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cập nhật sức khỏe cá thể cây"
      />
    </div>
  );
};
