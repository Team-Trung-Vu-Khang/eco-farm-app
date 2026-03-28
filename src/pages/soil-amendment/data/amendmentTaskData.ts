import type { ColumnFilterOption } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Clock,
  FlaskConical,
  Package,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const mockAmendmentPlans = [
  {
    id: 1,
    name: "Cải tạo đất nhiễm mặn Vùng A",
    code: "CT001",
    zone: "Vùng A - Cà Mau",
  },
  {
    id: 2,
    name: "Xử lý đất chua phèn Vùng B",
    code: "CT002",
    zone: "Vùng B - Long An",
  },
  {
    id: 3,
    name: "Phục hồi đất bạc màu Vùng C",
    code: "CT003",
    zone: "Vùng C - Đồng Nai",
  },
];

export const mockAmendmentMethods = [
  "Bón vôi khử chua",
  "Rửa mặn",
  "Bón phân hữu cơ",
  "Trồng cây phân xanh",
  "Cày xới sâu",
  "Tưới ngập cải tạo",
  "Bón phân vi sinh",
  "Bón thạch cao",
];

export const mockPersonnel = [
  { id: 1, name: "Nguyễn Văn A", code: "NV001" },
  { id: 2, name: "Trần Thị B", code: "NV002" },
  { id: 3, name: "Lê Văn C", code: "NV003" },
  { id: 4, name: "Phạm Văn D", code: "NV004" },
];

export const mockTeams = [
  { id: 1, name: "Đội Cải tạo đất", code: "TEAM-CT" },
  { id: 2, name: "Đội Kỹ thuật", code: "TEAM-KT" },
  { id: 3, name: "Đội Vận hành", code: "TEAM-VH" },
];

export const mockRegions = [
  {
    id: 1,
    name: "Miền Nam",
    zones: [
      { id: 1, name: "Vùng A - Cà Mau", code: "ZONE-A" },
      { id: 2, name: "Vùng B - Long An", code: "ZONE-B" },
      { id: 3, name: "Vùng C - Đồng Nai", code: "ZONE-C" },
      { id: 4, name: "Vùng D - Tiền Giang", code: "ZONE-D" },
    ],
  },
  {
    id: 2,
    name: "Miền Trung",
    zones: [
      { id: 5, name: "Vùng E - Quảng Nam", code: "ZONE-E" },
      { id: 6, name: "Vùng F - Đà Nẵng", code: "ZONE-F" },
      { id: 7, name: "Vùng G - Huế", code: "ZONE-G" },
    ],
  },
  {
    id: 3,
    name: "Miền Bắc",
    zones: [
      { id: 8, name: "Vùng H - Hà Nội", code: "ZONE-H" },
      { id: 9, name: "Vùng I - Hải Phòng", code: "ZONE-I" },
      { id: 10, name: "Vùng K - Thái Bình", code: "ZONE-K" },
    ],
  },
];

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent":
      return {
        label: "Khẩn cấp",
        variant: "destructive" as const,
        className: "bg-red-600 hover:bg-red-700",
      };
    case "high":
      return {
        label: "Cao",
        variant: "destructive" as const,
        className: "bg-orange-500 hover:bg-orange-600",
      };
    case "medium":
      return {
        label: "Trung bình",
        variant: "default" as const,
        className: "",
      };
    case "low":
      return {
        label: "Thấp",
        variant: "outline" as const,
        className: "border-slate-300 text-slate-600",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        className: "",
      };
  }
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        label: "Chờ thực hiện",
        variant: "outline" as const,
        className: "border-amber-200 bg-amber-50 text-amber-600",
      };
    case "in_progress":
      return {
        label: "Đang thực hiện",
        variant: "default" as const,
        className: "bg-blue-600 hover:bg-blue-700",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        variant: "secondary" as const,
        className: "bg-green-100 text-green-700",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        variant: "destructive" as const,
        className: "",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        className: "",
      };
  }
};

export const MATERIAL_TYPES = [
  {
    id: "pesticide",
    label: "Thuốc BVTV",
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    id: "fertilizer",
    label: "Phân bón",
    icon: FlaskConical,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    id: "tool",
    label: "Dụng cụ - Máy móc",
    icon: Wrench,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    id: "other",
    label: "Vật tư khác",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
] as const;

export const MATERIAL_OPTIONS = {
  pesticide: [
    { value: "Anvil 5SC", label: "Anvil 5SC (Trừ nấm)", unit: "lít" },
    { value: "Confidor", label: "Confidor (Trừ sâu)", unit: "lít" },
    { value: "Radiant", label: "Radiant (Trừ sâu)", unit: "lít" },
    { value: "Trichoderma", label: "Trichoderma (Nấm đối kháng)", unit: "lít" },
  ],
  fertilizer: [
    { value: "Vôi bột", label: "Vôi bột (Xử lý pH)", unit: "kg" },
    { value: "Lân nung chảy", label: "Lân nung chảy (Khử phèn)", unit: "kg" },
    {
      value: "Phân chuồng hoai mục",
      label: "Phân chuồng hoai mục",
      unit: "kg",
    },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Kali Humate", label: "Kali Humate (Giảm mặn)", unit: "lít" },
    { value: "NPK 20-20-15", label: "NPK 20-20-15", unit: "kg" },
    { value: "Ure", label: "Phân Ure", unit: "kg" },
  ],
  tool: [
    { value: "Máy cắt cỏ", label: "Máy cắt cỏ", unit: "cái" },
    { value: "Bình xịt điện", label: "Bình xịt điện 20L", unit: "cái" },
    { value: "Kéo cắt cành", label: "Kéo cắt cành", unit: "cái" },
    { value: "Cuốc", label: "Cuốc", unit: "cái" },
    { value: "Xẻng", label: "Xẻng", unit: "cái" },
  ],
  other: [
    { value: "Túi bao trái", label: "Túi bao trái sầu riêng", unit: "cái" },
    { value: "Dây cột", label: "Dây nilon đen", unit: "kg" },
    { value: "Bạt phủ", label: "Bạt phủ đất", unit: "m2" },
  ],
};

export const MATERIAL_UNITS = {
  pesticide: ["lít", "ml", "chai", "gói", "can"],
  fertilizer: ["kg", "tấn", "bao", "lít", "can"],
  tool: ["cái", "bộ", "hộp"],
  other: ["kg", "cái", "cuộn", "m", "m2", "thùng"],
};

export const amendmentTaskFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Chờ thực hiện", value: "pending" },
      { label: "Đang thực hiện", value: "in_progress" },
      { label: "Hoàn thành", value: "completed" },
      { label: "Đã hủy", value: "cancelled" },
    ],
  },
  {
    key: "priority",
    label: "Độ ưu tiên",
    options: [
      { label: "Khẩn cấp", value: "urgent" },
      { label: "Cao", value: "high" },
      { label: "Trung bình", value: "medium" },
      { label: "Thấp", value: "low" },
    ],
  },
  {
    key: "assignedType",
    label: "Loại phân công",
    options: [
      { label: "Cá nhân", value: "individual" },
      { label: "Đội nhóm", value: "team" },
    ],
  },
  {
    key: "method",
    label: "Phương pháp",
    options: mockAmendmentMethods.map((method) => ({
      label: method,
      value: method,
    })),
  },
] as {
  key: string;
  label: string;
  options: ColumnFilterOption[];
}[];

export const amendmentTaskStatsMeta: Array<{
  icon: LucideIcon;
  key: "pending" | "inProgress" | "completed" | "totalArea";
  label: string;
  tone: string;
}> = [
  {
    key: "pending",
    label: "Chờ thực hiện",
    icon: Clock,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    key: "inProgress",
    label: "Đang thực hiện",
    icon: AlertCircle,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: CheckCircle2,
    tone: "bg-green-50 text-green-600",
  },
  {
    key: "totalArea",
    label: "Tổng diện tích",
    icon: Sprout,
    tone: "bg-emerald-50 text-emerald-600",
  },
];
