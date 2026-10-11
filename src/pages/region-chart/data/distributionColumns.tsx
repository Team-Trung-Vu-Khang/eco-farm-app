import { CodeBadge } from "@/components/CodeBadge";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plot, Region } from "../constants";
import type { FarmAreaResponse } from "@/features/farm/types/farm.type";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { MapPinned, Mountain, Ruler, Trees } from "lucide-react";

export function createRegionDistributionColumns(
  onOpenDetail: (id: number) => void,
): Column<Region>[] {
  return [
    {
      key: "code",
      label: "Mã vùng",
      mobilePriority: "secondary",
      render: (value, row) => (
        <button type="button" onClick={() => onOpenDetail(row.id)}>
          <CodeBadge value={value} />
        </button>
      ),
    },
    { key: "name", label: "Tên vùng", mobilePriority: "primary" },
    { key: "area", label: "Diện tích (ha)", mobilePriority: "secondary" },
    {
      key: "address",
      label: "Địa chỉ",
      width: "360px",
      mobilePriority: "secondary",
      render: (value) => {
        const address = (value as string) || "-";
        return (
          <span className="block max-w-[360px] truncate" title={address}>
            {address}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      mobilePriority: "badge",
      render: (value) => {
        return (
          <RegionChartStatusBadge status={value as "active" | "inactive"} />
        );
      },
    },
  ];
}

export function createAreaDistributionColumns(
  onOpenDetail: (id: number) => void,
): Column<FarmAreaResponse>[] {
  return [
    {
      key: "code",
      label: "Mã khu vực",
      mobilePriority: "secondary",
      render: (value, row) => (
        <button type="button" onClick={() => onOpenDetail(row.id)}>
          <CodeBadge value={value} />
        </button>
      ),
    },
    { key: "name", label: "Tên khu vực", mobilePriority: "primary" },
    {
      key: "region",
      label: "Thuộc vùng",
      mobilePriority: "secondary",
      render: (_, row) => row.region?.name || "-",
    },
    { key: "acreage", label: "Diện tích (ha)", mobilePriority: "secondary" },
    {
      key: "status",
      label: "Trạng thái",
      mobilePriority: "badge",
      render: (value) => {
        return (
          <RegionChartStatusBadge status={value as "active" | "inactive"} />
        );
      },
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
      mobilePriority: "secondary",
      render: (value, row) => (
        <button type="button" onClick={() => onOpenDetail(row.id)}>
          <CodeBadge value={value} />
        </button>
      ),
    },
    { key: "name", label: "Tên lô", mobilePriority: "primary" },
    { key: "area", label: "Diện tích (ha)", mobilePriority: "secondary" },
    { key: "contour", label: "Đường bình độ", mobilePriority: "secondary" },
    { key: "altitude", label: "Độ cao (m)", mobilePriority: "secondary" },
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
      mobilePriority: "secondary",
      render: (value, row) => (
        <button type="button" onClick={() => onOpenDetail(row.id)}>
          <CodeBadge value={value} />
        </button>
      ),
    },
    {
      key: "name",
      label: "Tên lô",
      mobilePriority: "primary",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Trees className="h-4 w-4 text-green-600" />
          <span className="font-bold text-foreground">{value as string}</span>
        </div>
      ),
    },
    {
      key: "regionName",
      label: "Vùng trồng",
      mobilePriority: "secondary",
      render: (value) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinned className="h-4 w-4 text-primary" />
          <span className="line-clamp-2">{value as string}</span>
        </div>
      ),
    },
    {
      key: "areaName",
      label: "Khu vực",
      mobilePriority: "badge",
      render: (value) => (
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {value as string}
        </span>
      ),
    },
    {
      key: "area",
      label: "Diện tích (ha)",
      mobilePriority: "secondary",
      render: (value) => (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Ruler className="h-4 w-4 text-emerald-600" />
          {value as number}
        </div>
      ),
    },
    {
      key: "altitude",
      label: "Độ cao",
      mobilePriority: "secondary",
      render: (value) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Mountain className="h-4 w-4 text-slate-500" />
          {value as number} m
        </div>
      ),
    },
    {
      key: "contour",
      label: "Đường bình độ",
      mobilePriority: "secondary",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {(value as string) || "-"}
        </span>
      ),
    },
  ];
}
