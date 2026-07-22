import useVarietyStore from "@/stores/useVarietyStore";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, FileText, Hash, Layers } from "lucide-react";
import { Link } from "wouter";
import { CROP_OPTIONS } from "@/constants/crops";
import {
  animalBreedOptions,
  animalCycleOptions,
} from "./cycleSelectionData";
import type { Season } from "../types/types";

function resolveSeasonType(season: Season) {
  return season.seasonType ?? "plant";
}

function resolveSeasonTargetLabel(season: Season) {
  const seasonType = resolveSeasonType(season);

  if (seasonType === "animal") {
    const primary = animalCycleOptions.find(
      (option) => option.id === season.cropId || option.name === season.cropId,
    );
    const breed = season.varietyId
      ? animalBreedOptions.find((option) => option.id === season.varietyId)
      : undefined;

    if (season.scope === "variety") {
      return breed?.name || season.varietyId || primary?.name || season.cropId || "Chưa xác định";
    }

    return primary?.name || season.cropId || "Chưa xác định";
  }

  const crop = CROP_OPTIONS.find(
    (item) => item.id === season.cropId || item.name === season.cropId,
  );
  const variety = season.varietyId
    ? useVarietyStore.getState().getVarietyById(season.varietyId)
    : null;

  if (season.scope === "variety") {
    return variety?.varietyName || season.varietyId || crop?.name || season.cropId || "Chưa xác định";
  }

  return crop?.name || season.cropId || "Chưa xác định";
}
export const seasonColumns: Column<Season>[] = [
  {
    key: "code",
    label: "Mã mùa vụ",
    render: (value) => (
      <div className="flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
        <Hash className="h-3 w-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên mùa vụ",
    render: (value, item) => (
      <Link href={`/season/${item.id}`}>
        <div className="cursor-pointer font-semibold text-primary hover:underline">
          {value}
        </div>
      </Link>
    ),
  },
  {
    key: "duration",
    label: "Thời gian",
    render: (_, item) => {
      // Tính tổng thời gian từ các giai đoạn đã chọn trong selectedStages
      const stageDurations = Object.values(item.selectedStages || {}).flatMap(
        (stageMap) => Object.values(stageMap),
      );

      let hasDays = false;
      let hasMonths = false;
      let hasYears = false;
      let sumYears = 0;
      let sumMonths = 0;
      let sumDays = 0;

      stageDurations.forEach((dur) => {
        const str = String(dur || "");
        if (str.includes("năm")) hasYears = true;
        if (str.includes("tháng")) hasMonths = true;

        const yearMatch = str.match(/(\d+)\s*năm/);
        const monthMatch = str.match(/(\d+)\s*tháng/);
        const dayMatch = str.match(/(\d+)\s*ngày/);

        if (yearMatch) sumYears += parseInt(yearMatch[1]);
        if (monthMatch) sumMonths += parseInt(monthMatch[1]);
        if (dayMatch) {
          hasDays = true;
          sumDays += parseInt(dayMatch[1]);
        } else if (
          !yearMatch &&
          !monthMatch &&
          !isNaN(Number(str)) &&
          Number(str) > 0
        ) {
          hasDays = true;
          sumDays += Number(str);
        }
      });

      let displayStr = "-";
      if (stageDurations.length > 0) {
        if (hasDays) {
          displayStr = `${sumYears * 365 + sumMonths * 30 + sumDays} ngày`;
        } else if (hasMonths) {
          displayStr = `${sumYears * 12 + sumMonths} tháng`;
        } else if (hasYears) {
          displayStr = `${sumYears} năm`;
        }
      }

      return (
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {displayStr}
          </span>
        </div>
      );
    },
  },
  {
    key: "applyFor",
    label: "Áp dụng cho",
    render: (_value: string[], season) => {
      return (
        <div className="flex w-fit items-center gap-3 rounded-md border border-green-200 bg-green-100 px-2 py-1 font-mono text-xs font-bold text-green-600">
          {resolveSeasonTargetLabel(season)}
        </div>
      );
    },
  },
  {
    key: "stages",
    label: "Giai đoạn",
    render: (_, item) => {
      const stageCount = Object.values(item.selectedStages || {}).reduce(
        (count, stages) => count + Object.keys(stages).length,
        0,
      );

      return (
        <Badge
          variant="outline"
          className="gap-1.5 border-purple-200 bg-purple-50 text-purple-700"
        >
          <Layers className="h-3 w-3" />
          {stageCount} giai đoạn
        </Badge>
      );
    },
  },
  {
    key: "documents",
    label: "Tài liệu",
    render: (value: Document[]) =>
      value.length > 0 ? (
        <Badge
          variant="outline"
          className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700"
        >
          <FileText className="h-3 w-3" />
          {value.length} tài liệu
        </Badge>
      ) : null,
  },
];
