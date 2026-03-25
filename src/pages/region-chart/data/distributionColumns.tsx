import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Plot, Region, SubArea } from "../constants";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";

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
