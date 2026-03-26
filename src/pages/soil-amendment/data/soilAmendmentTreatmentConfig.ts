import { Sprout, Target, TrendingUp, type LucideIcon } from "lucide-react";

export const getTreatmentIntensityConfig = (intensity: string) => {
  switch (intensity) {
    case "light":
      return { label: "Nhẹ", color: "bg-blue-500" };
    case "medium":
      return { label: "Trung bình", color: "bg-yellow-500" };
    case "deep":
      return { label: "Sâu", color: "bg-red-500" };
    default:
      return { label: "Không xác định", color: "bg-gray-500" };
  }
};

export const getTreatmentStatusConfig = (status: string) => {
  switch (status) {
    case "planning":
      return { label: "Đang lập", color: "bg-blue-500" };
    case "in_progress":
      return { label: "Đang thực hiện", color: "bg-green-500" };
    case "completed":
      return { label: "Hoàn thành", color: "bg-gray-500" };
    case "cancelled":
      return { label: "Đã hủy", color: "bg-red-500" };
    default:
      return { label: "Không xác định", color: "bg-gray-500" };
  }
};

export const treatmentStatCards: Array<{
  icon: LucideIcon;
  key: "planning" | "inProgress" | "completed";
  label: string;
  wrapperClassName: string;
  iconClassName: string;
  textClassName: string;
}> = [
  {
    key: "planning",
    label: "Đang lập kế hoạch",
    icon: Target,
    wrapperClassName: "border-blue-100 bg-gradient-to-r from-blue-50 to-white",
    iconClassName: "bg-blue-100/50 text-blue-600 ring-1 ring-blue-200",
    textClassName: "text-blue-700",
  },
  {
    key: "inProgress",
    label: "Đang thực hiện",
    icon: TrendingUp,
    wrapperClassName: "border-green-100 bg-gradient-to-r from-green-50 to-white",
    iconClassName: "bg-green-100/50 text-green-600 ring-1 ring-green-200",
    textClassName: "text-green-700",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: Sprout,
    wrapperClassName: "border-gray-100 bg-gradient-to-r from-gray-50 to-white",
    iconClassName: "bg-gray-100/50 text-gray-600 ring-1 ring-gray-200",
    textClassName: "text-gray-700",
  },
];
