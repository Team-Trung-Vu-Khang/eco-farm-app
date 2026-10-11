import { ENABLE_NEW_PURPOSE_ENUMS } from "@/shared/constants/farm.constants";
import type { DomainCode } from "@/features/farm-supply/types";
import type { FarmPlanPurpose } from "@/features/farm-workflow/types/farm-workflow.type";
import {
  Apple,
  Bug,
  Droplet,
  FlaskConical,
  Layers,
  MoreHorizontal,
  Scissors,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const OLD_WORK_TYPE_OPTIONS = [
  {
    value: "cultivation",
    label: "Canh tác",
    icon: Layers,
    activeClass: "border-blue-500 bg-blue-50/50 text-blue-700",
    iconClass: "bg-blue-500 text-white",
  },
  {
    value: "facility-upgrade",
    label: "Nâng cấp CSVC",
    icon: Wrench,
    activeClass: "border-slate-500 bg-slate-50/80 text-slate-700",
    iconClass: "bg-slate-700 text-white",
  },
  {
    value: "treatment",
    label: "Điều trị",
    icon: Bug,
    activeClass: "border-red-500 bg-red-50/50 text-red-700",
    iconClass: "bg-red-500 text-white",
  },
  {
    value: "amendment",
    label: "Cải tạo đất",
    icon: Sprout,
    activeClass: "border-emerald-500 bg-emerald-50/50 text-emerald-700",
    iconClass: "bg-emerald-500 text-white",
  },
  {
    value: "harvest",
    label: "Thu hoạch",
    icon: Apple,
    activeClass: "border-orange-500 bg-orange-50/50 text-orange-700",
    iconClass: "bg-orange-600 text-white",
  },
] as const;

export const NEW_WORK_TYPE_OPTIONS = [
  {
    value: "nutrition",
    label: "Dinh dưỡng",
    icon: FlaskConical,
    activeClass: "border-emerald-500 bg-emerald-50/50 text-emerald-700",
    iconClass: "bg-emerald-500 text-white",
  },
  {
    value: "plant-care",
    label: "Chăm sóc cây",
    icon: Sprout,
    activeClass: "border-teal-500 bg-teal-50/50 text-teal-700",
    iconClass: "bg-teal-500 text-white",
  },
  {
    value: "pest-disease",
    label: "Sâu bệnh hại",
    icon: Bug,
    activeClass: "border-amber-500 bg-amber-50/50 text-amber-700",
    iconClass: "bg-amber-500 text-white",
  },
  {
    value: "weed-control",
    label: "Cỏ dại",
    icon: Scissors,
    activeClass: "border-lime-500 bg-lime-50/50 text-lime-700",
    iconClass: "bg-lime-500 text-white",
  },
  {
    value: "irrigation",
    label: "Tưới tiêu",
    icon: Droplet,
    activeClass: "border-sky-500 bg-sky-50/50 text-sky-700",
    iconClass: "bg-sky-500 text-white",
  },
  {
    value: "harvest",
    label: "Thu hoạch",
    icon: Apple,
    activeClass: "border-orange-500 bg-orange-50/50 text-orange-700",
    iconClass: "bg-orange-600 text-white",
  },
  {
    value: "other",
    label: "Khác",
    icon: MoreHorizontal,
    activeClass: "border-gray-500 bg-gray-50/50 text-gray-700",
    iconClass: "bg-gray-500 text-white",
  },
] as const;

export const WORK_TYPE_OPTIONS = ENABLE_NEW_PURPOSE_ENUMS
  ? NEW_WORK_TYPE_OPTIONS
  : OLD_WORK_TYPE_OPTIONS;

/** Map FarmPlanPurpose → workType của form "Loại công việc" (cover đủ 11 enum). */
export const PURPOSE_TO_WORK_TYPE_MAP: Record<FarmPlanPurpose, string> = {
  CULTIVATION: "cultivation",
  FACILITY_UPGRADE: "facility-upgrade",
  TREATMENT: "treatment",
  SOIL_IMPROVEMENT: "amendment",
  HARVEST: "harvest",
  NUTRITION: "nutrition",
  PLANT_CARE: "plant-care",
  PEST_DISEASE: "pest-disease",
  WEED_CONTROL: "weed-control",
  IRRIGATION: "irrigation",
  OTHER: "other",
};

export interface PurposeVisual {
  Icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
}

/**
 * Bản đồ hiển thị chuẩn hóa theo 11 enum của FarmPlanPurpose:
 * Đồng bộ tuyệt đối với biểu tượng và bảng màu của WORK_TYPE_OPTIONS.
 */
export const PURPOSE_VISUAL_MAP: Record<FarmPlanPurpose, PurposeVisual> = {
  NUTRITION: {
    Icon: FlaskConical,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/70",
  },
  PLANT_CARE: {
    Icon: Sprout,
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200/70",
  },
  PEST_DISEASE: {
    Icon: Bug,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200/70",
  },
  WEED_CONTROL: {
    Icon: Scissors,
    bg: "bg-lime-50",
    text: "text-lime-700",
    border: "border-lime-200/70",
  },
  IRRIGATION: {
    Icon: Droplet,
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200/70",
  },
  HARVEST: {
    Icon: Apple,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200/70",
  },
  CULTIVATION: {
    Icon: Layers,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200/70",
  },
  FACILITY_UPGRADE: {
    Icon: Wrench,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  TREATMENT: {
    Icon: Bug,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200/70",
  },
  SOIL_IMPROVEMENT: {
    Icon: Sprout,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/70",
  },
  OTHER: {
    Icon: MoreHorizontal,
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

const DEFAULT_PURPOSE_VISUAL: PurposeVisual = {
  Icon: MoreHorizontal,
  bg: "bg-gray-100",
  text: "text-gray-600",
  border: "border-gray-200",
};

export function getPurposeVisual(
  purpose?: FarmPlanPurpose | string | null,
): PurposeVisual {
  if (!purpose) return DEFAULT_PURPOSE_VISUAL;

  // 1. Khớp chính xác với enum FarmPlanPurpose
  if (purpose in PURPOSE_VISUAL_MAP) {
    return PURPOSE_VISUAL_MAP[purpose as FarmPlanPurpose];
  }

  // 2. Khớp theo chuỗi viết hoa của enum (ví dụ "nutrition" -> "NUTRITION")
  const upper = purpose.toUpperCase() as FarmPlanPurpose;
  if (upper in PURPOSE_VISUAL_MAP) {
    return PURPOSE_VISUAL_MAP[upper];
  }

  // 3. Khớp theo workType của form ("amendment" -> "SOIL_IMPROVEMENT", "facility-upgrade" -> "FACILITY_UPGRADE")
  const matchedEnum = (
    Object.keys(PURPOSE_TO_WORK_TYPE_MAP) as FarmPlanPurpose[]
  ).find((key) => PURPOSE_TO_WORK_TYPE_MAP[key] === purpose.toLowerCase());
  if (matchedEnum && PURPOSE_VISUAL_MAP[matchedEnum]) {
    return PURPOSE_VISUAL_MAP[matchedEnum];
  }

  return DEFAULT_PURPOSE_VISUAL;
}

export function getWorkflowLabel(domainCode?: DomainCode | string) {
  if (domainCode === "LIVESTOCK") return "Vụ nuôi";
  if (domainCode === "AQUACULTURE") return "Vụ nuôi thủy sản";
  return "Vụ mùa";
}

export function getWorkflowSubtitle(domainCode?: DomainCode | string) {
  if (domainCode === "LIVESTOCK" || domainCode === "AQUACULTURE")
    return "Chăn nuôi và nuôi trồng thủy sản";
  return "Vùng trồng";
}

export function getHarvestLabel(scope: "region" | "crop") {
  return scope === "region" ? "Vùng canh tác" : "Cây canh tác";
}

export function getHarvestUnitOptions() {
  return [
    { label: "gam", value: "g" },
    { label: "kg", value: "kg" },
    { label: "Tạ", value: "tạ" },
    { label: "Tấn", value: "tấn" },
    { label: "ml", value: "ml" },
    { label: "l", value: "l" },
  ];
}
