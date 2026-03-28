import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from "lucide-react";

export const TASK_STATUS_FILTER_OPTIONS = [
  { label: "Chờ thực hiện", value: "pending" },
  { label: "Đang thực hiện", value: "in-progress" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Quá hạn", value: "overdue" },
] as const;

export const TASK_PRIORITY_FILTER_OPTIONS = [
  { label: "Cao", value: "high" },
  { label: "Trung bình", value: "medium" },
  { label: "Thấp", value: "low" },
] as const;

export const TASK_ASSIGNED_TYPE_FILTER_OPTIONS = [
  { label: "Cá nhân", value: "individual" },
  { label: "Đội nhóm", value: "team" },
] as const;

export const TASK_WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export interface TaskStatConfig {
  key: "pending" | "inProgress" | "completed" | "overdue";
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

export const TASK_STAT_CONFIG: TaskStatConfig[] = [
  {
    key: "pending",
    label: "Chờ thực hiện",
    icon: Clock,
    iconClassName: "bg-amber-100 text-amber-600",
  },
  {
    key: "inProgress",
    label: "Đang thực hiện",
    icon: CalendarIcon,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: CheckCircle2,
    iconClassName: "bg-green-100 text-green-600",
  },
  {
    key: "overdue",
    label: "Quá hạn",
    icon: AlertCircle,
    iconClassName: "bg-red-100 text-red-600",
  },
];
