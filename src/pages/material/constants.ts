export interface Material {
  id: number;
  code: string;
  name: string;
  type: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const initialMaterials: Material[] = [
  {
    id: 1,
    code: "VL001",
    name: "Màng phủ nông nghiệp",
    type: "Vật tư tiêu hao",
    description: "Màng phủ PE đen/bạc, khổ 1m, dày 15 mic",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "VL002",
    name: "Ống tưới nhỏ giọt 16mm",
    type: "Thiết bị tưới",
    description: "Khoảng cách lỗ 20cm, lưu lượng 2L/h",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    code: "VL003",
    name: "Khay ươm hạt 105 lỗ",
    type: "Dụng cụ ươm",
    description: "Nhựa PE bền, tái sử dụng được",
    status: "active",
    createdAt: "2024-01-18",
  },
];

export const materialTypes = [
  "Vật tư tiêu hao",
  "Dụng cụ lao động",
  "Thiết bị tưới",
  "Vật liệu nhà màng",
  "Bao bì đóng gói",
  "Khác",
];

export const commonHashtags = [
  "TietKiemChiPhi",
  "BenBi",
  "ThanThienMoiTruong",
  "CongNgheCao",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Nhựa Rạng Đông", type: "enterprise" },
  { id: "sup2", name: "Đại lý Vật tư Nông nghiệp A", type: "enterprise" },
  { id: "sup3", name: "HTX Dịch vụ Nông nghiệp", type: "enterprise" },
  { id: "sup4", name: "Cửa hàng Thiết bị tưới B", type: "enterprise" },
];

export const units = ["Cái", "Cuộn", "Mét", "Kg", "Bộ", "Thùng"];
