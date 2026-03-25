import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { SoilMetricAnalysis } from "../types";

interface SoilMetricStatusBadgeProps {
  analysis: SoilMetricAnalysis;
}

export function SoilMetricStatusBadge({
  analysis,
}: SoilMetricStatusBadgeProps) {
  if (analysis.status === "good") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-green-200 bg-green-50 text-green-700"
      >
        <CheckCircle2 className="h-3 w-3" />
        Tốt
      </Badge>
    );
  }

  if (analysis.status === "warning") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-red-200 bg-red-50 text-amber-700"
      >
        <AlertCircle className="h-3 w-3" />
        Cảnh báo
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 border-amber-200 bg-amber-50 text-red-700"
    >
      <AlertCircle className="h-3 w-3" />
      Xấu
    </Badge>
  );
}
