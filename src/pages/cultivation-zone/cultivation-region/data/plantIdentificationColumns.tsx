import { CodeBadge } from "@/components/CodeBadge";
import { Badge, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import { MapPin } from "lucide-react";
import type { Plant } from "@/pages/region-chart/constants";
import {
  PLANT_HEALTH_STATUS_LABELS,
  PLANT_HEALTH_STATUS_STYLES,
} from "../components/types";

export const plantIdentificationColumns = [
  {
    key: "code",
    label: "Mã định danh",
    render: (value: unknown, row: Plant) => (
      <Link href={`/plant-identification/${row.id}`} className="cursor-pointer">
        <CodeBadge value={(value as string) || `PI-${row.id}`} />
      </Link>
    ),
  },
  {
    key: "variantName",
    label: "Giống & Hạt giống",
    // Response không trả tên loại cây, chỉ có tên giống cây / hạt giống
    render: (_: unknown, row: any) =>
      row.variantName || row.productionVariantName || row.subjectVariantName ? (
        <div>
          {row.productionVariantName && (
            <div className="text-sm font-semibold text-slate-800">
              {row.productionVariantName}
              <span className="ml-1.5 text-[10px] uppercase tracking-wide font-medium text-blue-500">
                Giống cây
              </span>
            </div>
          )}
          {row.subjectVariantName && (
            <div className="text-sm text-slate-600">
              {row.subjectVariantName}
              <span className="ml-1.5 text-[10px] uppercase tracking-wide font-medium text-emerald-500">
                Hạt giống
              </span>
            </div>
          )}
          {/* Fallback cho dữ liệu cũ chỉ có variantName/variantKind */}
          {!row.productionVariantName &&
            !row.subjectVariantName &&
            row.variantName && (
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {row.variantName}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  {row.variantKind === "subject" ? "Hạt giống" : "Giống cây"}
                </div>
              </div>
            )}
        </div>
      ) : (
        <span className="text-xs italic text-slate-400">Chưa có giống</span>
      ),
  },
  {
    key: "healthStatus",
    label: "Hiện trạng",
    render: (_: unknown, row: any) =>
      row.healthStatus ? (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-semibold",
            PLANT_HEALTH_STATUS_STYLES[row.healthStatus] ??
              "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {PLANT_HEALTH_STATUS_LABELS[row.healthStatus] ?? row.healthStatus}
        </Badge>
      ) : (
        <span className="text-xs italic text-slate-400">Chưa đánh giá</span>
      ),
  },
  {
    key: "productionZone",
    label: "Vùng canh tác",
    render: (_: unknown, row: any) => (
      <span className="font-semibold text-slate-800">
        {row.productionZone?.name || row.cultivationZoneName || "—"}
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
  {
    key: "areaName",
    label: "Vị trí cụ thể",
    render: (_: unknown, row: any) => {
      let label = "";
      if (row.scopeType === "PLOT" && row.plotName) {
        label = row.areaName
          ? `${row.areaName} / ${row.plotName}`
          : row.plotName;
      } else if (row.scopeType === "AREA" && row.areaName) {
        label = row.areaName;
      } else if (row.scopeType === "REGION") {
        label = "Cả vùng trồng";
      }

      return label ? (
        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
          <MapPin className="w-2.5 h-2.5 text-green-600" />
          {label}
        </span>
      ) : (
        <span className="text-muted-foreground italic text-xs">
          Chưa xác định
        </span>
      );
    },
  },
  {
    key: "height",
    label: "C.Cao (m)",
    render: (value: unknown) => (value as string) || "—",
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
    render: (value: unknown) => (
      <span
        className="text-muted-foreground italic text-xs block max-w-50 truncate"
        title={value as string}
      >
        {(value as string) || "—"}
      </span>
    ),
  },
];
