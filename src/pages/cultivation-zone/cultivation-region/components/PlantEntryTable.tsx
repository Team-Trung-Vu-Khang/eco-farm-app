import {
  Badge,
  cn,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { type PlantEntry } from "./types";
import {
  PLANT_HEALTH_STATUS_LABELS,
  PLANT_HEALTH_STATUS_STYLES,
} from "./types";

/** Hình dạng tối thiểu của một đơn vị canh tác (Lô/Khu vực/Vùng) */
interface GeographicalUnitLike {
  id: string;
  name?: string;
  level?: number;
}

type PlantRowStatus = "ok" | "unplaced" | "out-of-boundary" | "no-variety";

const getPlantRowStatus = (plant: PlantEntry): PlantRowStatus => {
  if (!plant.plotId) return "unplaced";
  if (plant.isInvalidBoundary) return "out-of-boundary";
  if (!plant.productionVariantId && !plant.subjectVariantId) return "no-variety";
  return "ok";
};

/** Dòng dữ liệu cho DataTable (DataTable yêu cầu field `id`) */
interface PlantRow {
  id: string;
  rowNumber: number;
  status: PlantRowStatus;
  plotName: string;
  varietyLabel: string;
  healthLabel: string;
  healthStyle: string;
  subjectLabel: string;
  heightLabel: string;
  ageLabel: string;
  plantedDateLabel: string;
  coordLabel: string;
}

interface PlantEntryTableProps {
  plants: PlantEntry[];
  /** Toàn bộ cây (kể cả khi `plants` đã bị lọc) — dùng để đánh số thứ tự ổn định */
  allPlants?: PlantEntry[];
  geographicalUnits: GeographicalUnitLike[];
  canRemove?: boolean;
  onEdit: (entryId: string) => void;
  onRemove: (entryId: string) => void;
}

export const PlantEntryTable = ({
  plants,
  allPlants,
  geographicalUnits,
  canRemove = true,
  onEdit,
  onRemove,
}: PlantEntryTableProps) => {
  const rows: PlantRow[] = useMemo(
    () =>
      plants.map((plant) => {
        const sortIndex = (allPlants || plants).findIndex(
          (p) => p.entryId === plant.entryId,
        );
        const unit = geographicalUnits.find((u) => u.id === plant.plotId);
        const status = getPlantRowStatus(plant);
        return {
          id: plant.entryId,
          rowNumber: sortIndex >= 0 ? sortIndex + 1 : plants.indexOf(plant) + 1,
          status,
          plotName: unit?.name || "",
          varietyLabel: plant.productionVariantName || "",
          subjectLabel: plant.subjectVariantName || "",
          healthLabel: plant.healthStatus
            ? PLANT_HEALTH_STATUS_LABELS[plant.healthStatus]
            : "",
          healthStyle:
            (plant.healthStatus &&
              PLANT_HEALTH_STATUS_STYLES[plant.healthStatus]) ||
            "",
          heightLabel: plant.height ? `${plant.height}` : "",
          ageLabel: plant.ageValue
            ? `${plant.ageValue} ${
                plant.ageUnit === "years"
                  ? "năm"
                  : plant.ageUnit === "months"
                    ? "tháng"
                    : "ngày"
              }`
            : "",
          plantedDateLabel: plant.plantedDate
            ? new Date(plant.plantedDate).toLocaleDateString("vi-VN")
            : "",
          coordLabel: `${plant.coordinate.lat.toFixed(5)}, ${plant.coordinate.lng.toFixed(5)}`,
        };
      }),
    [plants, allPlants, geographicalUnits],
  );

  const columns: Column<PlantRow>[] = [
    {
      key: "rowNumber",
      label: "#",
      width: "48px",
      render: (_, row) => (
        <span className="text-xs font-bold text-slate-400">{row.rowNumber}</span>
      ),
    },
    {
      key: "plotName",
      label: "Vị trí",
      render: (_, row) =>
        row.status === "unplaced" ? (
          <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs">
            <TriangleAlert className="w-3.5 h-3.5" />
            Chưa định vị
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs">
            {row.status === "out-of-boundary" && (
              <TriangleAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
            )}
            <span className="font-semibold text-slate-700 truncate max-w-32">
              {row.plotName}
            </span>
          </div>
        ),
    },
    {
      key: "varietyLabel",
      label: "Giống cây",
      render: (_, row) =>
        row.varietyLabel ? (
          <span className="text-blue-700 font-medium text-xs">
            {row.varietyLabel}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    {
      key: "subjectLabel",
      label: "Hạt giống",
      render: (_, row) =>
        row.subjectLabel ? (
          <span className="text-emerald-700 text-xs">{row.subjectLabel}</span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    {
      key: "healthLabel",
      label: "Hiện trạng",
      render: (_, row) =>
        row.healthLabel ? (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-semibold",
              row.healthStyle || "border-slate-200 bg-slate-50 text-slate-600",
            )}
          >
            {row.healthLabel}
          </Badge>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    {
      key: "heightLabel",
      label: "Cao (m)",
      render: (_, row) => (
        <span className="text-right text-xs text-slate-600">
          {row.heightLabel || "—"}
        </span>
      ),
    },
    {
      key: "ageLabel",
      label: "Tuổi",
      render: (_, row) => (
        <span className="text-center text-xs text-slate-600">
          {row.ageLabel || "—"}
        </span>
      ),
    },
    {
      key: "plantedDateLabel",
      label: "Ngày trồng",
      render: (_, row) => (
        <span className="text-xs text-slate-600 whitespace-nowrap">
          {row.plantedDateLabel || "—"}
        </span>
      ),
    },
    {
      key: "coordLabel",
      label: "Tọa độ",
      render: (_, row) => (
        <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
          {row.coordLabel || "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchable
      searchPlaceholder="Tìm theo số, lô, ghi chú..."
      onEdit={(row) => onEdit(row.id)}
      onDelete={canRemove ? (row) => onRemove(row.id) : undefined}
    />
  );
};