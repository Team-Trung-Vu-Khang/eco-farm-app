import type { DomainCode } from "@/features/farm-supply/types";
import { Apple, Bug, Layers, Sprout, Wrench } from "lucide-react";

export const WORK_TYPE_OPTIONS = [
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
    activeClass: "border-emerald-500 bg-emerald-50/50 text-emerald-700",
    iconClass: "bg-emerald-600 text-white",
  },
] as const;

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
    { label: "g (Gram)", value: "g" },
    { label: "kg (Kilogram)", value: "kg" },
    { label: "Tạ (100 kg)", value: "tạ" },
    { label: "Tấn (1.000 kg)", value: "tấn" },
    { label: "ml (Mililit / cc)", value: "ml" },
    { label: "l / L (Lít)", value: "l" },
  ];
}
