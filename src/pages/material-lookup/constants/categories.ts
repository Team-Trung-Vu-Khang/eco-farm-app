import { Sprout, Box, Settings, FlaskConical } from "lucide-react";
import { type CategoryOption } from "../types/types";

export const CATEGORIES: CategoryOption[] = [
  {
    id: "Pesticide",
    name: "Thuốc BVTV",
    icon: FlaskConical,
    color: "text-emerald-500",
  },
  {
    id: "Fertilizer",
    name: "Phân bón",
    icon: Sprout,
    color: "text-blue-500",
  },
  {
    id: "Material",
    name: "Vật tư tiêu hao",
    icon: Box,
    color: "text-amber-500",
  },
  {
    id: "Equipment",
    name: "Thiết bị & Công cụ",
    icon: Settings,
    color: "text-slate-500",
  },
];
