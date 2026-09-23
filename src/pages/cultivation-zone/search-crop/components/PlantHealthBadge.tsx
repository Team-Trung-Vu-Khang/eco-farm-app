import type { FarmPlantHealthStatus } from "@/features/farm/types/farm.type";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  PLANT_HEALTH_STATUS_LABELS,
  PLANT_HEALTH_STATUS_STYLES,
} from "../../cultivation-region/components/types";

export function PlantHealthBadge({
  status,
}: {
  status?: FarmPlantHealthStatus | null;
}) {
  if (!status) return null;
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
        PLANT_HEALTH_STATUS_STYLES[status],
      )}
    >
      {PLANT_HEALTH_STATUS_LABELS[status] ?? status}
    </span>
  );
}
