import {
  Target,
  Activity,
} from "lucide-react";

export interface AdvancedFilters {
  classifications?: string[];
  status?: string[];
}

export const POLYGON_COLORS = {
  region: "#3b82f6", // blue
  area: "#10b981",   // emerald
  plot: "#f59e0b",   // orange
};

export const FILTER_GROUP_CONFIG = [
  {
    title: "1. Lĩnh vực kinh doanh",
    icon: Target,
    fields: [
      {
        key: "classifications" as keyof AdvancedFilters,
        label: "Lĩnh vực kinh doanh",
        icon: Target,
      },
    ],
  },
  {
    title: "2. Trạng thái",
    icon: Activity,
    fields: [
      {
        key: "status" as keyof AdvancedFilters,
        label: "Trạng thái vận hành",
        icon: Activity,
      },
    ],
  },
];
