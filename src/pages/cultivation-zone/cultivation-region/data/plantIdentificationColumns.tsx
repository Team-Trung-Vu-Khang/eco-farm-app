import { Link } from "wouter";
import { MapPin } from "lucide-react";
import type { Plant } from "@/pages/region-chart/constants";
import type { Region } from "@/pages/region-chart/constants";

const getPlantLocationLabel = (
  plant: Plant,
  regions: Region[],
  getAreaById: (id: string) => { area: unknown; region: Region } | undefined,
  getPlotById: (
    id: string,
  ) => { plot: { name: string }; area: { name: string }; region: Region } | undefined,
) => {
  if (!plant.plotId) return null;

  const plotData = getPlotById(plant.plotId);
  if (plotData) {
    return {
      regionName: plotData.region.name,
      cultivationLabel: `${plotData.area.name} / ${plotData.plot.name}`,
    };
  }

  const areaData = getAreaById(plant.plotId);
  if (areaData) {
    return {
      regionName: areaData.region.name,
      cultivationLabel: (areaData.area as { name: string }).name,
    };
  }

  const regionData = regions.find(
    (region) => String(region.id) === String(plant.plotId),
  );
  if (regionData) {
    return {
      regionName: regionData.name,
      cultivationLabel: regionData.name,
    };
  }

  return null;
};

export const getPlantIdentificationColumns = (
  regions: Region[],
  getAreaById: (id: string) => { area: unknown; region: Region } | undefined,
  getPlotById: (
    id: string,
  ) => { plot: { name: string }; area: { name: string }; region: Region } | undefined,
) => [
  {
    key: "code",
    label: "Mã định danh",
    render: (value: string, row: Plant) => (
      <Link href={`/plant-identification/${row.id}`}>
        <a className="font-mono font-bold text-primary hover:underline cursor-pointer">
          {value ?? row.id}
        </a>
      </Link>
    ),
  },
  {
    key: "height",
    label: "C.Cao (m)",
    render: (value: string) => value || "-",
  },
  {
    key: "ageValue",
    label: "Độ tuổi",
    render: (_: unknown, row: Plant) => {
      if (!row.ageValue) return row.age || "-";
      const unitLabel = {
        days: "ngày",
        months: "tháng",
        years: "năm",
      }[row.ageUnit || "years"];
      return `${row.ageValue} ${unitLabel}`;
    },
  },
  {
    key: "coordinate",
    label: "Tạo độ",
    render: (_: unknown, row: Plant) => (
      <span className="text-muted-foreground italic text-xs font-mono">
        {row.coordinate?.lat} / {row.coordinate?.lng}
      </span>
    ),
  },
  {
    key: "regionName",
    label: "Vị trí địa lý",
    render: (_: unknown, row: Plant) => {
      const location = getPlantLocationLabel(row, regions, getAreaById, getPlotById);
      return location ? (
        <span>{location.regionName}</span>
      ) : (
        <span className="text-muted-foreground italic text-xs">Chưa xác định</span>
      );
    },
  },
  {
    key: "areaName",
    label: "Vị trí canh tác",
    render: (_: unknown, row: Plant) => {
      const location = getPlantLocationLabel(row, regions, getAreaById, getPlotById);
      return location ? (
        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
          <MapPin className="w-2.5 h-2.5" />
          {location.cultivationLabel}
        </span>
      ) : (
        <span className="text-muted-foreground italic text-xs">Chưa xác định</span>
      );
    },
  },
  {
    key: "note",
    label: "Ghi chú",
    render: (value: string) => (
      <span
        className="text-muted-foreground italic text-xs block max-w-50 truncate"
        title={value}
      >
        {value || "-"}
      </span>
    ),
  },
];
