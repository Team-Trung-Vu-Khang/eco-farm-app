import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plot, Region, SubArea } from "../constants";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { Hash, MapPinned, Mountain, Ruler, Trees } from "lucide-react";

export function createRegionDistributionColumns(
  onOpenDetail: (id: number) => void,
): Column<Region>[] {
  return [
    {
      key: "code",
      label: "Mã vùng",
      render: (value, row) => (
        <span
          onClick={() => onOpenDetail(row.id)}
          className="cursor-pointer font-medium text-primary hover:underline"
        >
          {value}
        </span>
      ),
    },
    { key: "name", label: "Tên vùng" },
    { key: "area", label: "Diện tích (ha)" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <RegionChartStatusBadge status={value as "active" | "inactive"} />
      ),
    },
  ];
}

export function createAreaDistributionColumns(
  regions: Region[],
  onOpenDetail: (id: string) => void,
): Column<SubArea>[] {
  return [
    {
      key: "code",
      label: "Mã khu vực",
      render: (value, row) => (
        <span
          className="cursor-pointer font-medium text-primary hover:underline"
          onClick={() => onOpenDetail(row.id)}
        >
          {value}
        </span>
      ),
    },
    { key: "name", label: "Tên khu vực" },
    {
      key: "regionId",
      label: "Thuộc vùng",
      render: (value) => regions.find((region) => region.id === value)?.name || value,
    },
    { key: "area", label: "Diện tích (ha)" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <RegionChartStatusBadge status={value as "active" | "inactive"} />
      ),
    },
  ];
}

export function createPlotDistributionColumns(
  onOpenDetail: (id: string) => void,
): Column<Plot>[] {
  return [
    {
      key: "code",
      label: "Mã lô",
      render: (value, row) => (
        <span
          className="cursor-pointer font-medium text-primary hover:underline"
          onClick={() => onOpenDetail(row.id)}
        >
          {value}
        </span>
      ),
    },
    { key: "name", label: "Tên lô" },
    { key: "area", label: "Diện tích (ha)" },
    { key: "contour", label: "Đường bình độ" },
    { key: "altitude", label: "Độ cao (m)" },
  ];
}

export interface PlotDistributionRow extends Plot {
  regionName: string;
  areaName: string;
}

export function createPlotDistributionRichColumns(
  onOpenDetail: (id: string) => void,
): Column<PlotDistributionRow>[] {
  return [
    {
      key: "code",
      label: "Mã lô",
      render: (value, row) => (
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          onClick={() => onOpenDetail(row.id)}
        >
          <Hash className="h-3 w-3 opacity-60" />
          {value}
        </button>
      ),
    },
    {
      key: "name",
      label: "Tên lô",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Trees className="h-4 w-4 text-green-600" />
          <span className="font-bold text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: "regionName",
      label: "Vùng trồng",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinned className="h-4 w-4 text-primary" />
          <span className="line-clamp-2">{value}</span>
        </div>
      ),
    },
    {
      key: "areaName",
      label: "Khu vực",
      render: (value: string) => (
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {value}
        </span>
      ),
    },
    {
      key: "area",
      label: "Diện tích (ha)",
      render: (value: number) => (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Ruler className="h-4 w-4 text-emerald-600" />
          {value}
        </div>
      ),
    },
    {
      key: "altitude",
      label: "Độ cao",
      render: (value: number) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Mountain className="h-4 w-4 text-slate-500" />
          {value} m
        </div>
      ),
    },
    {
      key: "contour",
      label: "Đường bình độ",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value || "-"}</span>
      ),
    },
  ];
}
