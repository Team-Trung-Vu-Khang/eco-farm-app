import {
  Clock,
  Droplets,
  Leaf,
  Pickaxe,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type {
  Activity,
  ActivityType,
  AmendmentCycle,
  AmendmentCycleFormData,
} from "../types/amendment-cycle";

export const PREDEFINED_ACTIVITIES: Activity[] = [
  { text: "Bón phân hữu cơ", type: "biological" },
  { text: "Bón phân chuồng hoai mục", type: "biological" },
  { text: "Bón vôi bột", type: "chemical" },
  { text: "Cày xới đất", type: "mechanical" },
  { text: "Phơi ải đất", type: "mechanical" },
  { text: "Trồng cây họ đậu", type: "biological" },
  { text: "Tưới tràn rửa mặn", type: "chemical" },
  { text: "Sử dụng chế phẩm IMO", type: "biological" },
  { text: "Che phủ bằng rơm rạ", type: "mechanical" },
  { text: "Làm rãnh thoát nước", type: "mechanical" },
];

export const INITIAL_AMENDMENT_CYCLES: AmendmentCycle[] = [
  {
    id: "1",
    type: "short",
    title: "Ngắn hạn",
    duration: "1 vụ – 1 năm",
    condition: "Đất thoái hóa nhẹ",
    conditionColor: "bg-green-100 text-green-800",
    activities: [
      { text: "Bón phân hữu cơ, phân chuồng hoai", type: "biological" },
      { text: "Bón vôi (đất chua)", type: "chemical" },
      { text: "Cày xới, phơi ải", type: "mechanical" },
      { text: "Luân canh cây trồng", type: "biological" },
    ],
    outcome: "Hiệu quả thấy rõ sau 1–2 vụ",
  },
  {
    id: "2",
    type: "medium",
    title: "Trung hạn",
    duration: "2–3 năm",
    condition: "Đất bạc màu, chai cứng",
    conditionColor: "bg-yellow-100 text-yellow-800",
    activities: [
      { text: "Tăng hữu cơ + vi sinh", type: "biological" },
      { text: "Trồng cây họ đậu cải tạo đất", type: "biological" },
      { text: "Hạn chế phân hóa học", type: "other" },
      { text: "Che phủ đất (rơm rạ, cây phủ xanh)", type: "mechanical" },
    ],
    outcome: "Đất tơi xốp dần, hệ vi sinh phục hồi",
  },
  {
    id: "3",
    type: "long",
    title: "Dài hạn",
    duration: "5–7 năm hoặc hơn",
    condition: "Đất thoái hóa nặng / nhiễm mặn – phèn",
    conditionColor: "bg-red-100 text-red-800",
    activities: [
      { text: "Cải tạo tổng hợp", type: "other" },
      { text: "Rửa mặn, hạ phèn", type: "chemical" },
      { text: "Phytoremediation (cây hấp thụ độc)", type: "biological" },
      { text: "Quản lý nước và canh tác bền vững", type: "mechanical" },
    ],
    outcome: "Cần theo dõi và lặp lại định kỳ",
  },
];

export const createEmptyAmendmentCycleForm =
  (): AmendmentCycleFormData => ({
    title: "",
    type: "short",
    duration: "",
    condition: "",
    outcome: "",
    activities: [],
  });

export const getCycleConditionColor = (
  type: AmendmentCycle["type"] | undefined,
) => {
  switch (type) {
    case "short":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "long":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export const getActivityConfig = (
  type: ActivityType,
): { color: string; icon: LucideIcon; label: string } => {
  switch (type) {
    case "biological":
      return {
        icon: Sprout,
        color: "text-green-600 bg-green-100",
        label: "Sinh học",
      };
    case "chemical":
      return {
        icon: Droplets,
        color: "text-blue-600 bg-blue-100",
        label: "Hóa học",
      };
    case "mechanical":
      return {
        icon: Pickaxe,
        color: "text-amber-600 bg-amber-100",
        label: "Cơ giới",
      };
    default:
      return {
        icon: Leaf,
        color: "text-slate-600 bg-slate-100",
        label: "Khác",
      };
  }
};

export const amendmentCycleIntroduction = {
  description:
    "“Chu kỳ cải tạo đất” là khoảng thời gian và các bước lặp lại để phục hồi, nâng cao độ phì nhiêu – cấu trúc – sinh học của đất sau khi bị thoái hóa do canh tác, ô nhiễm hoặc sử dụng không hợp lý.",
  icon: Clock,
  title: "Thông tin chung",
};
