import type { SupplyType } from "@/features/farm-supply/types";

export const SUPPLY_TYPE: SupplyType = "by_product";

export const SUPPLY_GROUP_CATALOG = "by-product-groups" as const;

export const commonHashtags = [
  "PhuPham",
  "NongNghiepSach",
  "PhuPhamHuuCo",
  "TuanHoanNongNghiep",
  "TaiNguyenNongNghiep",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Nông nghiệp Chế biến Phụ phẩm", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];
