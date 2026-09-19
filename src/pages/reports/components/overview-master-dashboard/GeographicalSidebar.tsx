import React, { useState, useMemo } from "react";
import {
  Search,
  Layers,
  FolderOpen,
  Leaf,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useQuery } from "@tanstack/react-query";
import { regionApi, areaApi } from "@/features/farm/api/farm.api";
import type { TreeNode } from "../../constants/mockReportData";

interface GeographicalSidebarProps {
  selectedLocation: TreeNode | null;
  onSelectLocation: (node: TreeNode | null) => void;
}

const STALE_TIME = 5 * 60 * 1000;

/** Lazy-load khu vực (areas) của 1 region khi expand */
function useRegionAreas(regionId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["farm", "sidebar", "regions", regionId, "areas"],
    queryFn: () =>
      regionApi.getAreasByRegionId(regionId!, { status: "ACTIVE", size: 100 }),
    staleTime: STALE_TIME,
    enabled: enabled && !!regionId,
  });
}

/** Lazy-load lô (plots) của 1 area khi expand */
function useAreaPlots(areaId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["farm", "sidebar", "areas", areaId, "plots"],
    queryFn: () =>
      areaApi.getPlotsByAreaId(areaId!, { status: "ACTIVE", size: 100 }),
    staleTime: STALE_TIME,
    enabled: enabled && !!areaId,
  });
}

// ─── Sub-components cho Area row (cần fetch plots khi expand) ────────────────

interface AreaRowProps {
  areaId: number;
  areaName: string;
  nodeId: string;
  depth: number;
  selectedLocation: TreeNode | null;
  onSelectLocation: (node: TreeNode | null) => void;
  searchActive: boolean;
}

const AreaRow: React.FC<AreaRowProps> = ({
  areaId,
  areaName,
  nodeId,
  depth,
  selectedLocation,
  onSelectLocation,
  searchActive,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = searchActive ? true : expanded;
  const isSelected = selectedLocation?.id === nodeId;

  const { data: plotsData, isLoading: plotsLoading } = useAreaPlots(
    areaId,
    isExpanded,
  );

  const plots = plotsData?.content ?? [];

  const areaNode: TreeNode = {
    id: nodeId,
    numericId: areaId,
    name: areaName,
    type: "area",
  };

  return (
    <div className="space-y-1">
      <div
        onClick={() => {
          if (selectedLocation?.id === nodeId) {
            onSelectLocation(null);
          } else {
            onSelectLocation(areaNode);
          }
        }}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={`flex items-center gap-2 py-2.5 pr-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
            : "hover:bg-slate-50 text-slate-700 font-medium"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="p-0.5 hover:bg-slate-200/50 rounded-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          {plotsLoading && isExpanded ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        <FolderOpen
          className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
        />
        <span className="text-xs truncate">{areaName}</span>
      </div>

      {isExpanded && plots.length > 0 && (
        <div className="space-y-1">
          {plots.map((plot) => {
            const plotNodeId = `plot-${plot.id}`;
            const plotIsSelected = selectedLocation?.id === plotNodeId;
            const plotNode: TreeNode = {
              id: plotNodeId,
              numericId: plot.id,
              name: plot.name ?? `Lô #${plot.id}`,
              type: "plot",
            };
            return (
              <div
                key={plot.id}
                onClick={() => {
                  if (selectedLocation?.id === plotNodeId) {
                    onSelectLocation(null);
                  } else {
                    onSelectLocation(plotNode);
                  }
                }}
                style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
                className={`flex items-center gap-2 py-2.5 pr-2 rounded-lg cursor-pointer transition-all ${
                  plotIsSelected
                    ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
                    : "hover:bg-slate-50 text-slate-700 font-medium"
                }`}
              >
                <span className="w-4.5" />
                <Leaf
                  className={`w-4 h-4 ${plotIsSelected ? "text-emerald-700" : "text-slate-400"}`}
                />
                <span className="text-xs truncate">
                  {plot.name ?? `Lô #${plot.id}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export const GeographicalSidebar: React.FC<GeographicalSidebarProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [treeSearchQuery, setTreeSearchQuery] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<
    Record<number, boolean>
  >({});

  const { data: regionsData, isLoading: regionsLoading } = useRegions({
    params: { status: "ACTIVE", size: 100 },
  });

  const regions = regionsData?.content ?? [];

  const toggleRegion = (regionId: number) => {
    setExpandedRegions((prev) => ({ ...prev, [regionId]: !prev[regionId] }));
  };

  /** Filter regions/areas by search query (client-side on name) */
  const filteredRegions = useMemo(() => {
    if (!treeSearchQuery.trim()) return regions;
    const q = treeSearchQuery.toLowerCase();
    return regions.filter((r) => r.name?.toLowerCase().includes(q));
  }, [regions, treeSearchQuery]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          Hệ thống vùng trồng
        </h3>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Chọn địa điểm để xem báo cáo chi tiết
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm địa điểm..."
          value={treeSearchQuery}
          onChange={(e) => setTreeSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Tree view content */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1">
        {/* Reset / All Regions Node */}
        <div
          onClick={() => onSelectLocation(null)}
          className={`flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
            selectedLocation === null
              ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
              : "hover:bg-slate-50 text-slate-750 font-medium"
          }`}
        >
          <Layers
            className={`w-4 h-4 ${selectedLocation === null ? "text-emerald-700" : "text-slate-400"}`}
          />
          <span className="text-xs">Tất cả vùng trồng</span>
        </div>

        <div className="border-t border-slate-50 my-2 pt-2 space-y-1">
          {regionsLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Đang tải...</span>
            </div>
          ) : filteredRegions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              {treeSearchQuery
                ? "Không tìm thấy địa điểm"
                : "Chưa có vùng trồng nào"}
            </p>
          ) : (
            filteredRegions.map((region) => {
              const regionNodeId = `region-${region.id}`;
              const isExpanded = treeSearchQuery
                ? true
                : !!expandedRegions[region.id];
              const isSelected = selectedLocation?.id === regionNodeId;

              const regionNode: TreeNode = {
                id: regionNodeId,
                numericId: region.id,
                name: region.name ?? `Vùng #${region.id}`,
                type: "region",
              };

              return (
                <RegionRow
                  key={region.id}
                  region={region}
                  regionNode={regionNode}
                  regionNodeId={regionNodeId}
                  isExpanded={isExpanded}
                  isSelected={isSelected}
                  selectedLocation={selectedLocation}
                  onSelectLocation={onSelectLocation}
                  onToggle={() => toggleRegion(region.id)}
                  searchActive={!!treeSearchQuery}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RegionRow sub-component (lazy-loads areas) ───────────────────────────────

interface RegionRowProps {
  region: { id: number; name?: string };
  regionNode: TreeNode;
  regionNodeId: string;
  isExpanded: boolean;
  isSelected: boolean;
  selectedLocation: TreeNode | null;
  onSelectLocation: (node: TreeNode | null) => void;
  onToggle: () => void;
  searchActive: boolean;
}

const RegionRow: React.FC<RegionRowProps> = ({
  region,
  regionNode,
  regionNodeId,
  isExpanded,
  isSelected,
  selectedLocation,
  onSelectLocation,
  onToggle,
  searchActive,
}) => {
  const { data: areasData, isLoading: areasLoading } = useRegionAreas(
    region.id,
    isExpanded,
  );

  const areas = areasData?.content ?? [];

  return (
    <div className="space-y-1">
      <div
        onClick={() => {
          if (selectedLocation?.id === regionNodeId) {
            onSelectLocation(null);
          } else {
            onSelectLocation(regionNode);
          }
        }}
        style={{ paddingLeft: "8px" }}
        className={`flex items-center gap-2 py-2.5 pr-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
            : "hover:bg-slate-50 text-slate-700 font-medium"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-0.5 hover:bg-slate-200/50 rounded-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          {areasLoading && isExpanded ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        <Layers
          className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
        />
        <span className="text-xs truncate">
          {region.name ?? `Vùng #${region.id}`}
        </span>
      </div>

      {isExpanded && areas.length > 0 && (
        <div className="space-y-1">
          {areas.map((area) => (
            <AreaRow
              key={area.id}
              areaId={area.id}
              areaName={area.name ?? `Khu vực #${area.id}`}
              nodeId={`area-${area.id}`}
              depth={1}
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
              searchActive={searchActive}
            />
          ))}
        </div>
      )}
    </div>
  );
};
