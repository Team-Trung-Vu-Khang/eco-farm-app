import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface SidebarFilterProps {
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  filterArea: string;
  setFilterArea: (val: string) => void;
  regionOptions: FilterOption[];
  areaOptions: FilterOption[];
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filterRegion,
  setFilterRegion,
  filterArea,
  setFilterArea,
  regionOptions,
  areaOptions,
}) => {
  return (
    <div className="absolute left-16 top-3 z-[1000] w-[min(520px,calc(100%-5rem))]">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-slate-500">
            Vùng trồng
          </Label>
          <Select
            value={filterRegion}
            onValueChange={(value) => {
              setFilterRegion(value);
              setFilterArea("all");
            }}
          >
            <SelectTrigger className="w-full bg-white pr-2">
              <span
                style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  minWidth: 0,
                  textAlign: "left",
                }}
              >
                <SelectValue placeholder="Tất cả" />
              </span>
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectItem value="all">Tất cả</SelectItem>
              {regionOptions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-slate-500">
            Khu vực
          </Label>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-full bg-white pr-2">
              <span
                style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  minWidth: 0,
                  textAlign: "left",
                }}
              >
                <SelectValue placeholder="Tất cả" />
              </span>
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectItem value="all">Tất cả</SelectItem>
              {areaOptions.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
