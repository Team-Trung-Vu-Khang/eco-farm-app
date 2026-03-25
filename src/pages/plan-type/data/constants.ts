import type { PlanType, PlanTypeFormData } from "../types/types";

export const CATEGORY_LABELS: Record<string, string> = {
  cultivation: "Canh tác & Sản xuất",
  processing: "Sơ chế & Chế biến",
  distribution: "Phân phối & Tiêu thụ",
  financial: "Tài chính & Kế toán",
  other: "Khác",
};

export const emptyPlanTypeFormData: PlanTypeFormData = {
  code: "",
  name: "",
  category: "cultivation",
  description: "",
  color: "#3b82f6",
};

export const initialPlanTypes: PlanType[] = [
  {
    id: 1,
    code: "KHCT",
    name: "Kế hoạch canh tác",
    category: "cultivation",
    description:
      "Lập kế hoạch gieo trồng, chăm sóc và thu hoạch cho từng vụ mùa.",
    color: "#10b981",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "KHCTD",
    name: "Kế hoạch cải tạo đất",
    category: "cultivation",
    description: "Các hoạt động xử lý đất, bón lót trước khi xuống giống.",
    color: "#f59e0b",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "KHBVTV",
    name: "Kế hoạch bảo vệ thực vật",
    category: "cultivation",
    description: "Lịch phun thuốc, phòng trừ sâu bệnh hại theo giai đoạn.",
    color: "#ef4444",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "KHTH",
    name: "Kế hoạch thu hoạch",
    category: "cultivation",
    description: "Dự kiến thời gian, nhân sự và phương tiện thu hoạch.",
    color: "#3b82f6",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "KHSC",
    name: "Kế hoạch sơ chế",
    category: "processing",
    description: "Quy trình làm sạch, phân loại và đóng gói sau thu hoạch.",
    color: "#8b5cf6",
    createdAt: "2024-01-14",
  },
];
