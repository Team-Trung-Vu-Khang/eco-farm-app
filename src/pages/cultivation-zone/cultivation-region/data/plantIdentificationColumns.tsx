import { Link } from "wouter";
import { MapPin, Layers } from "lucide-react";
import type { Plant } from "@/pages/region-chart/constants";

export const plantIdentificationColumns = [
  {
    key: "code",
    label: "Mã định danh",
    render: (value: string, row: Plant) => (
      <Link
        href={`/plant-identification/${row.id}`}
        className="font-mono font-bold text-primary hover:underline cursor-pointer"
      >
        {value || `PI-${row.id}`}
      </Link>
    ),
  },
  {
    key: "cultivationZoneName",
    label: "Vùng canh tác",
    render: (_: unknown, row: any) => (
      <span className="font-semibold text-slate-800">
        {row.cultivationZoneName || "—"}
      </span>
    ),
  },
  {
    key: "regionName",
    label: "Vị trí địa lý",
    render: (_: unknown, row: any) =>
      row.regionName ? (
        <span className="text-slate-600 text-sm font-medium">
          {row.regionName}
        </span>
      ) : (
        <span className="text-muted-foreground italic text-xs">
          Chưa xác định
        </span>
      ),
  },
  // {
  //   key: "areaName",
  //   label: "Vị trí canh tác",
  //   render: (_: unknown, row: any) => {
  //     let label = "";
  //     if (row.scopeType === "PLOT" && row.plotName) {
  //       label = row.areaName ? `${row.areaName} / ${row.plotName}` : row.plotName;
  //     } else if (row.scopeType === "AREA" && row.areaName) {
  //       label = row.areaName;
  //     } else if (row.scopeType === "REGION") {
  //       label = "Cả vùng trồng";
  //     }

  //     return label ? (
  //       <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
  //         <MapPin className="w-2.5 h-2.5 text-green-600" />
  //         {label}
  //       </span>
  //     ) : (
  //       <span className="text-muted-foreground italic text-xs">Chưa xác định</span>
  //     );
  //   },
  // },
  {
    key: "height",
    label: "C.Cao (m)",
    render: (value: string) => value || "—",
  },
  {
    key: "ageValue",
    label: "Độ tuổi",
    render: (_: unknown, row: Plant) => {
      if (!row.ageValue) return row.age || "—";
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
    label: "Tọa độ",
    render: (_: unknown, row: Plant) =>
      row.coordinate?.lat ? (
        <span className="text-muted-foreground italic text-xs font-mono">
          {row.coordinate.lat.toFixed(5)} / {row.coordinate.lng.toFixed(5)}
        </span>
      ) : (
        "—"
      ),
  },
  {
    key: "note",
    label: "Ghi chú",
    render: (value: string) => (
      <span
        className="text-muted-foreground italic text-xs block max-w-50 truncate"
        title={value}
      >
        {value || "—"}
      </span>
    ),
  },
];
