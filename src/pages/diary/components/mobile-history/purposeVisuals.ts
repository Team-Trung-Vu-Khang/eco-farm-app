import type { FarmPlanPurpose } from "@/features/farm-daily-diary";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";
import {
  getPurposeVisual,
  PURPOSE_VISUAL_MAP,
  type PurposeVisual,
} from "../../constants/history-form.constants";

export interface MobilePurposeVisual extends PurposeVisual {
  label: string;
}

export const MOBILE_PURPOSE_VISUALS: Record<
  FarmPlanPurpose,
  MobilePurposeVisual
> = Object.fromEntries(
  Object.entries(PURPOSE_VISUAL_MAP).map(([key, visual]) => [
    key,
    {
      ...visual,
      label:
        FARM_PLAN_PURPOSE_LABELS[key as FarmPlanPurpose] || "Nhật ký nông vụ",
    },
  ]),
) as Record<FarmPlanPurpose, MobilePurposeVisual>;

export function getMobilePurposeVisual(
  purpose?: FarmPlanPurpose | string | null,
): MobilePurposeVisual {
  const visual = getPurposeVisual(purpose);
  const upper = (purpose?.toUpperCase() ?? "OTHER") as FarmPlanPurpose;
  const label = FARM_PLAN_PURPOSE_LABELS[upper] || "Nhật ký nông vụ";
  return {
    ...visual,
    label,
  };
}
