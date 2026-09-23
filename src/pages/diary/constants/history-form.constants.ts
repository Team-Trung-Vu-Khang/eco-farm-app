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

/**
 * Danh sách hạng mục / công việc gợi ý cho trồng trọt.
 * Chỉ là text gợi ý: user gõ tự do, dropdown hiện các mục khớp để chọn nhanh,
 * nhưng hoàn toàn có thể bỏ qua và nhập nội dung của riêng mình.
 */
export const WORK_TASK_SUGGESTIONS: string[] = [
  // Dinh dưỡng / phân bón
  "Bón phân lót",
  "Bón phân thúc",
  "Bón phân hữu cơ",
  "Bón phân chuồng",
  "Bón phân vô cơ/NPK",
  "Bổ sung đạm",
  "Bổ sung lân",
  "Bổ sung kali",
  "Bổ sung trung, vi lượng",
  "Phun dinh dưỡng qua lá",
  "Bón/phun đạm cá",
  "Bón/phun kali chuối",
  "Phun chế phẩm vi sinh",
  "Kích rễ",
  "Dinh dưỡng nuôi quả",
  "Bổ sung Canxi/Bo",
  "Tạo ngọt/nâng chất lượng quả",
  "Bón phân phục hồi sau thu hoạch",
  // Tạo hình / chăm sóc cây
  "Tỉa cành",
  "Tạo tán",
  "Tỉa chồi",
  "Tỉa lá",
  "Tỉa hoa",
  "Tỉa quả",
  "Kích thích ra hoa",
  "Khoanh vỏ",
  "Chặt rễ",
  "Xiết nước",
  "Bao quả",
  "Chống đỡ cành/quả",
  "Làm giàn",
  "Buộc/cố định cây",
  "Vun gốc",
  "Xới đất",
  "Che phủ gốc",
  "Chăm sóc sau thu hoạch",
  "Chăm sóc cây con",
  // Sâu bệnh
  "Kiểm tra sâu bệnh",
  "Ghi nhận sâu bệnh",
  "Ghi nhận cây bất thường",
  "Bắt sâu thủ công",
  "Cắt bỏ bộ phận bị bệnh",
  "Vệ sinh ổ bệnh",
  "Đặt bẫy côn trùng",
  "Phun thuốc BVTV",
  "Phun thuốc thảo mộc",
  "Phun chế phẩm sinh học",
  "Phun chế phẩm vi sinh phòng bệnh",
  "Xử lý sâu hại",
  "Xử lý nấm bệnh",
  "Xử lý cây bị bệnh",
  "Theo dõi sau xử lý",
  // Cỏ dại
  "Kiểm tra tình trạng cỏ",
  "Nhổ cỏ",
  "Phát cỏ",
  "Cắt cỏ bằng máy",
  "Làm cỏ",
  "Xới đất kết hợp làm cỏ",
  "Che phủ hạn chế cỏ",
  "Phun thuốc diệt cỏ",
  "Thu gom cỏ",
  // Nước tưới
  "Tưới nước",
  "Tưới gốc",
  "Tưới phun",
  "Tưới nhỏ giọt",
  "Duy trì độ ẩm",
  "Kiểm tra độ ẩm đất",
  "Xiết nước/ngừng tưới",
  "Thoát nước",
  "Tiêu úng",
  "Khơi thông rãnh",
  "Dẫn nước vào ruộng",
  "Giữ nước trên ruộng",
  "Tháo nước khỏi ruộng",
  // Làm đất / gieo trồng
  "Chuẩn bị đất",
  "Làm đất",
  "Lên luống",
  "Đào hố",
  "Xử lý đất",
  "Xử lý giống",
  "Ngâm ủ giống",
  "Ươm giống",
  "Gieo hạt",
  "Gieo mạ",
  "Trồng cây",
  "Cấy cây",
  "Trồng dặm",
  "Ghép cây",
  // Theo dõi sinh trưởng
  "Kiểm tra sinh trưởng",
  "Ghi nhận tỷ lệ sống",
  "Ghi nhận ra hoa",
  "Ghi nhận đậu quả",
  "Kiểm tra độ chín",
  // Thu hoạch & sau thu hoạch
  "Thu hoạch",
  "Thu hái",
  "Thu hoạch quả",
  "Thu hoạch lá/búp",
  "Thu hoạch củ/rễ",
  "Thu hoạch hạt",
  "Ghi nhận sản lượng",
  "Phân loại sau thu hoạch",
  "Làm sạch sau thu hoạch",
  "Sơ chế",
  "Phơi",
  "Sấy",
  "Đóng gói",
  "Bảo quản",
  "Xử lý phụ phẩm",
  // Khác
  "Nghỉ đông",
  "Chuẩn bị vụ mới",
  "Công việc khác",
];
