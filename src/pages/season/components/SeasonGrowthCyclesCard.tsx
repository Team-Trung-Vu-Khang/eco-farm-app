import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, Plus, Sprout, Trash2 } from "lucide-react";
import type { GrowthCycle } from "../../growth-cycle/types/types";
import { getCropImage } from "../utils/utils";

function parseDuration(durationStr: string): {
  years: string;
  months: string;
  days: string;
} {
  const str = String(durationStr || "");
  const yearMatch = str.match(/(\d+)\s*năm/);
  const monthMatch = str.match(/(\d+)\s*tháng/);
  const dayMatch = str.match(/(\d+)\s*ngày/);
  return {
    years: yearMatch ? yearMatch[1] : "",
    months: monthMatch ? monthMatch[1] : "",
    days: dayMatch
      ? dayMatch[1]
      : !yearMatch && !monthMatch && !isNaN(Number(str)) && Number(str) > 0
        ? str
        : "",
  };
}

function formatDurationDisplay(durationStr: string): string {
  const { years, months, days } = parseDuration(String(durationStr || ""));
  const parts = [];
  if (years && parseInt(years) > 0) parts.push(`${years} năm`);
  if (months && parseInt(months) > 0) parts.push(`${months} tháng`);
  if (days && parseInt(days) > 0) parts.push(`${days} ngày`);
  return parts.length > 0 ? parts.join(" ") : "-";
}

function computeCycleDuration(stages: GrowthCycle["stages"]): string {
  let hasDays = false;
  let hasMonths = false;
  let hasYears = false;
  let sumYears = 0;
  let sumMonths = 0;
  let sumDays = 0;

  stages.forEach((stage) => {
    const { years, months, days } = parseDuration(String(stage.duration || ""));
    const str = String(stage.duration || "");
    if (str.includes("năm")) hasYears = true;
    if (str.includes("tháng")) hasMonths = true;
    if (
      str.includes("ngày") ||
      (!str.includes("năm") &&
        !str.includes("tháng") &&
        !isNaN(Number(str)) &&
        Number(str) > 0)
    )
      hasDays = true;
    if (years) sumYears += parseInt(years);
    if (months) sumMonths += parseInt(months);
    if (days) sumDays += parseInt(days);
  });

  if (hasDays) return `${sumYears * 365 + sumMonths * 30 + sumDays} ngày`;
  if (hasMonths) return `${sumYears * 12 + sumMonths} tháng`;
  if (hasYears) return `${sumYears} năm`;
  return "-";
}

interface SeasonGrowthCyclesCardProps {
  growthCycleIds: string[];
  onAddCycle: () => void;
  onRemoveCycle: (cycleId: string) => void;
  selectedCycles: GrowthCycle[];
  selectedStages: Record<string, Record<string, string | number>>;
  disabled?: boolean;
  disabledReason?: string;
}

export function SeasonGrowthCyclesCard({
  growthCycleIds,
  onAddCycle,
  onRemoveCycle,
  selectedCycles,
  selectedStages,
  disabled = false,
  disabledReason,
}: SeasonGrowthCyclesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-100 p-2 text-green-700">
              <Sprout className="h-5 w-5" />
            </div>
            <CardTitle>Chu kỳ sinh trưởng áp dụng</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-auto">
              Đã chọn: {growthCycleIds.length}
            </Badge>
            <div title={disabled ? disabledReason : undefined}>
              <Button
                size="sm"
                className="h-8 font-bold"
                onClick={onAddCycle}
                disabled={disabled}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {selectedCycles.length > 0 ? (
            selectedCycles.map((cycle) => {
              const selectedStageMap = selectedStages[cycle.id] || {};
              const selectedStageData =
                cycle.stages?.filter((stage) => !!selectedStageMap[stage.id]) ||
                [];

              return (
                <div
                  key={cycle.id}
                  className="group flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={getCropImage(cycle.cropName)} />
                        <AvatarFallback>
                          {cycle.cropName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-bold leading-tight text-slate-800">
                          {cycle.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{cycle.cropName}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>
                            {cycle.stages
                              ? computeCycleDuration(cycle.stages)
                              : "-"}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="font-medium text-green-600">
                            {Object.keys(selectedStageMap).length}/
                            {cycle.stages?.length || 0} giai đoạn
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => onRemoveCycle(cycle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedStageData.length > 0 && (
                    <div className="pl-14">
                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Giai đoạn áp dụng
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedStageData.map((stage) => (
                            <Badge
                              key={stage.id}
                              variant="secondary"
                              className="border-slate-200 bg-white font-normal text-slate-700 shadow-sm"
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                              {stage.name} (
                              {formatDurationDisplay(
                                String(selectedStageMap[stage.id] || ""),
                              )}
                              )
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border-2 border-dashed bg-muted/20 py-10 text-center">
              <Layers className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">
                Chưa có chu kỳ nào được chọn.
              </p>
              {disabled && disabledReason ? (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  ⚠ {disabledReason}
                </p>
              ) : (
                <Button
                  variant="link"
                  className="mt-2 font-bold text-green-700"
                  onClick={onAddCycle}
                  disabled={disabled}
                >
                  + Chọn chu kỳ từ thư viện
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
