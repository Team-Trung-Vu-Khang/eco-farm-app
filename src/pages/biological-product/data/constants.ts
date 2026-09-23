import type { SupplyType } from "@/features/farm-supply/types";

export const SUPPLY_TYPE: SupplyType = "biological";

export const SUPPLY_GROUP_CATALOG = "biological-product-groups" as const;

// ── Presentation only: nhãn hiển thị (không phải nguồn option form) ─────────

/** Nguồn gốc chế phẩm — dùng chỉ để hiển thị nhãn trên columns */
export const originOptions = [
  { id: "microbial", label: "Vi sinh" },
  { id: "botanical", label: "Thảo mộc" },
  { id: "mineral", label: "Khoáng sinh học" },
];

export const commonHashtags = [
  "ChePhamSinhHoc",
  "NongNghiepSach",
  "GiaiPhapSinhHoc",
  "ViSinhNongNghiep",
  "BVCTVAnToan",
];

/** Danh sách nhà cung cấp minh họa — hiển thị tên từ id trên confirmation/detail */
export const suppliers = [
  {
    id: "sup1",
    name: "Công ty Công nghệ Sinh học Nông nghiệp",
    type: "enterprise",
  },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];