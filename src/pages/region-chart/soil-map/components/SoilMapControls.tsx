import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Maximize2, Minimize2 } from "lucide-react";
import { METRIC_OPTIONS } from "../utils";
import type { SoilMetric } from "../types";

interface SoilMapControlsProps {
  activeMetric: SoilMetric;
  isFullScreen: boolean;
  onMetricChange: (metric: SoilMetric) => void;
  onToggleFullScreen: () => void;
}

export function SoilMapControls({
  activeMetric,
  isFullScreen,
  onMetricChange,
  onToggleFullScreen,
}: SoilMapControlsProps) {
  return (
    <div className="flex gap-2 rounded-lg border bg-white/50 p-1 shadow-sm backdrop-blur">
      <Select value={activeMetric} onValueChange={onMetricChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Chọn chỉ số" />
        </SelectTrigger>
        <SelectContent>
          {METRIC_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={onToggleFullScreen}>
        {isFullScreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
