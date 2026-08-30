import { Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React from "react";
import { RemoteSearchSelect, type RemoteSelectOption } from "./RemoteSearchSelect";

interface SidebarFilterProps {
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  filterArea: string;
  setFilterArea: (val: string) => void;
  regionOptions: RemoteSelectOption[];
  areaOptions: RemoteSelectOption[];
  selectedRegionLabel?: string;
  selectedAreaLabel?: string;
  regionSearch: string;
  onRegionSearchChange: (keyword: string) => void;
  areaSearch: string;
  onAreaSearchChange: (keyword: string) => void;
  isRegionSearching?: boolean;
  isAreaSearching?: boolean;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filterRegion,
  setFilterRegion,
  filterArea,
  setFilterArea,
  regionOptions,
  areaOptions,
  selectedRegionLabel,
  selectedAreaLabel,
  regionSearch,
  onRegionSearchChange,
  areaSearch,
  onAreaSearchChange,
  isRegionSearching,
  isAreaSearching,
}) => {
  return (
    <div className="absolute left-16 top-3 z-[1000] w-[min(520px,calc(100%-5rem))]">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-slate-500">
            Vùng trồng
          </Label>
          <RemoteSearchSelect
            value={filterRegion}
            onChange={(value) => {
              setFilterRegion(value);
              setFilterArea("all");
            }}
            options={regionOptions}
            selectedLabel={selectedRegionLabel}
            searchValue={regionSearch}
            onSearchChange={onRegionSearchChange}
            loading={isRegionSearching}
            hideAllOption
            searchPlaceholder="Tìm vùng trồng..."
            emptyText="Không tìm thấy vùng trồng"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-slate-500">
            Khu vực
          </Label>
          <RemoteSearchSelect
            value={filterArea}
            onChange={setFilterArea}
            options={areaOptions}
            selectedLabel={selectedAreaLabel}
            searchValue={areaSearch}
            onSearchChange={onAreaSearchChange}
            loading={isAreaSearching}
            searchPlaceholder="Tìm khu vực..."
            emptyText="Không tìm thấy khu vực"
          />
        </div>
      </div>
    </div>
  );
};
