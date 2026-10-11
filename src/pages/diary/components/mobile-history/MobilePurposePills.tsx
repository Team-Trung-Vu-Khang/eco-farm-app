import type { FarmPlanPurpose } from "@/features/farm-daily-diary";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { MOBILE_PURPOSE_VISUALS } from "./purposeVisuals";

export interface PurposeOption {
  label: string;
  value?: FarmPlanPurpose;
}

const MOBILE_PURPOSE_PILL_OPTIONS: PurposeOption[] = [
  { label: "Tất cả", value: undefined },
  { label: MOBILE_PURPOSE_VISUALS.NUTRITION.label, value: "NUTRITION" },
  { label: MOBILE_PURPOSE_VISUALS.PLANT_CARE.label, value: "PLANT_CARE" },
  { label: MOBILE_PURPOSE_VISUALS.PEST_DISEASE.label, value: "PEST_DISEASE" },
  { label: MOBILE_PURPOSE_VISUALS.IRRIGATION.label, value: "IRRIGATION" },
  { label: MOBILE_PURPOSE_VISUALS.WEED_CONTROL.label, value: "WEED_CONTROL" },
  { label: MOBILE_PURPOSE_VISUALS.HARVEST.label, value: "HARVEST" },
  {
    label: MOBILE_PURPOSE_VISUALS.SOIL_IMPROVEMENT.label,
    value: "SOIL_IMPROVEMENT",
  },
  { label: MOBILE_PURPOSE_VISUALS.OTHER.label, value: "OTHER" },
];

export interface MobilePurposePillsProps {
  selectedPurpose?: FarmPlanPurpose;
  onSelectPurpose: (purpose?: FarmPlanPurpose) => void;
}

export function MobilePurposePills({
  selectedPurpose,
  onSelectPurpose,
}: MobilePurposePillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 scroll-smooth">
      {MOBILE_PURPOSE_PILL_OPTIONS.map((item) => {
        const isActive = selectedPurpose === item.value;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelectPurpose(item.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs transition-all active:scale-95 shadow-2xs cursor-pointer",
              isActive
                ? "bg-emerald-600 font-bold text-white shadow-emerald-600/20 shadow-sm"
                : "bg-slate-100 font-medium text-slate-700 hover:bg-slate-200/70 border border-slate-200/50",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
