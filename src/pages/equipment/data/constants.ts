import type { Equipment } from "../types";
export type { Equipment };

export const initialEquipments: Equipment[] = [
  {
    id: 1,
    code: "TB001",
    name: "Máy cày Kubota L5018",
    technologyLevelId: "motorized_machinery",
    valueChainId: "land_prep",
    financialManagementId: "fixed_assets",
    status: "active",
    description: "Máy cày 50HP, chuyên dùng làm đất",
    maintainanceInterval: "300 giờ hoạt động",
    createdAt: "2023-11-15",
  },
  {
    id: 2,
    code: "TB002",
    name: "Drone phun thuốc DJI Agras T40",
    technologyLevelId: "smart_devices",
    valueChainId: "care_monitoring",
    financialManagementId: "fixed_assets",
    status: "active",
    description: "Drone phun thuốc, gieo hạt, tải trọng 40kg",
    maintainanceInterval: "100 chuyến bay",
    createdAt: "2023-12-20",
  },
  {
    id: 3,
    code: "TB003",
    name: "Hệ thống tưới tự động Israel",
    technologyLevelId: "smart_devices",
    valueChainId: "care_monitoring",
    financialManagementId: "fixed_assets",
    status: "maintenance",
    description: "Hệ thống tưới nhỏ giọt kết hợp châm phân",
    maintainanceInterval: "3 tháng",
    createdAt: "2024-01-05",
  },
];

export const technologyLevelOptions = [
  { id: "hand_tools", label: "Dụng cụ thủ công (Hand Tools)" },
  { id: "motorized_machinery", label: "Máy móc cơ giới (Motorized Machinery)" },
  { id: "smart_devices", label: "Thiết bị Công nghệ cao / IoT" },
];

export const valueChainOptions = [
  { id: "land_prep", label: "Làm đất / Cải tạo ao" },
  { id: "planting", label: "Gieo trồng / Xuống giống" },
  { id: "care_monitoring", label: "Chăm sóc & Theo dõi" },
  { id: "harvesting", label: "Thu hoạch" },
  { id: "post_harvest", label: "Sơ chế & Bảo quản" },
];

export const financialManagementOptions = [
  { id: "consumables", label: "Vật tư / Dụng cụ tiêu hao" },
  { id: "fixed_assets", label: "Tài sản cố định / Công cụ dụng cụ lâu bền" },
];

export const maintenanceIntervals = [
  "Hàng ngày",
  "Hàng tuần",
  "Hàng tháng",
  "3 tháng",
  "6 tháng",
  "1 năm",
  "Theo giờ hoạt động",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Kubota Việt Nam", type: "enterprise" },
  { id: "sup2", name: "DJI Store Vietnam", type: "enterprise" },
  { id: "sup3", name: "Nhà cung cấp Hai Lúa", type: "enterprise" },
];

export const units = ["Cái", "Bộ", "Hệ thống", "Chiếc"];
