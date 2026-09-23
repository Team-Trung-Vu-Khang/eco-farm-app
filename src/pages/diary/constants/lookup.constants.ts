import { Apple, Bug, Droplet, FlaskConical, Layers, MoreHorizontal, Scissors, Sprout, Wrench } from "lucide-react";
import type { DiaryDomainCode, DiaryStatus, DiaryWorkType } from "../types/lookup.types";

export const WORK_TYPE_CONFIG: Record<
  DiaryWorkType,
  { label: string; icon: typeof Layers; badgeCls: string; iconCls: string }
> = {
  cultivation: {
    label: "Canh tác",
    icon: Layers,
    badgeCls: "bg-blue-50 text-blue-700 border-blue-200",
    iconCls: "bg-blue-100 text-blue-600",
  },
  "facility-upgrade": {
    label: "Nâng cấp CSVC",
    icon: Wrench,
    badgeCls: "bg-slate-50 text-slate-700 border-slate-200",
    iconCls: "bg-slate-200 text-slate-700",
  },
  treatment: {
    label: "Điều trị",
    icon: Bug,
    badgeCls: "bg-red-50 text-red-700 border-red-200",
    iconCls: "bg-red-100 text-red-600",
  },
  amendment: {
    label: "Cải tạo đất",
    icon: Sprout,
    badgeCls: "bg-green-50 text-green-700 border-green-200",
    iconCls: "bg-green-100 text-green-600",
  },
  harvest: {
    label: "Thu hoạch",
    icon: Apple,
    badgeCls: "bg-orange-50 text-orange-700 border-orange-200",
    iconCls: "bg-orange-100 text-orange-600",
  },
  nutrition: {
    label: "Dinh dưỡng",
    icon: FlaskConical,
    badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconCls: "bg-emerald-100 text-emerald-600",
  },
  "plant-care": {
    label: "Chăm sóc cây",
    icon: Sprout,
    badgeCls: "bg-teal-50 text-teal-700 border-teal-200",
    iconCls: "bg-teal-100 text-teal-600",
  },
  "pest-disease": {
    label: "Sâu bệnh hại",
    icon: Bug,
    badgeCls: "bg-amber-50 text-amber-700 border-amber-200",
    iconCls: "bg-amber-100 text-amber-600",
  },
  "weed-control": {
    label: "Cỏ dại",
    icon: Scissors,
    badgeCls: "bg-lime-50 text-lime-700 border-lime-200",
    iconCls: "bg-lime-100 text-lime-600",
  },
  irrigation: {
    label: "Tưới tiêu",
    icon: Droplet,
    badgeCls: "bg-sky-50 text-sky-700 border-sky-200",
    iconCls: "bg-sky-100 text-sky-600",
  },
  other: {
    label: "Khác",
    icon: MoreHorizontal,
    badgeCls: "bg-gray-50 text-gray-700 border-gray-200",
    iconCls: "bg-gray-100 text-gray-600",
  },
};

export const STATUS_CONFIG: Record<DiaryStatus, { label: string; cls: string }> = {
  TODO: { label: "Chờ thực hiện", cls: "bg-slate-50 text-slate-600 border-slate-200" },
  DOING: { label: "Đang thực hiện", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  DONE: { label: "Hoàn thành", cls: "bg-green-50 text-green-700 border-green-200" },
  CANCELLED: { label: "Đã hủy", cls: "bg-slate-50 text-slate-400 border-slate-200" },
};

export function getDomainLabel(domainCode: DiaryDomainCode) {
  if (domainCode === "LIVESTOCK") return "Vụ nuôi";
  if (domainCode === "AQUACULTURE") return "Vụ nuôi thủy sản";
  return "Vụ mùa";
}

export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
