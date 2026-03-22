import type { Equipment } from "../types";
export type { Equipment };

export const initialEquipments: Equipment[] = [
  {
    id: 1,
    code: "TB001",
    name: "Máy cày Kubota L5018",
    type: "Máy cơ giới",
    status: "active",
    description: "Máy cày 50HP, chuyên dùng làm đất",
    maintainanceInterval: "300 giờ hoạt động",
    createdAt: "2023-11-15",
  },
  {
    id: 2,
    code: "TB002",
    name: "Drone phun thuốc DJI Agras T40",
    type: "Thiết bị bay",
    status: "active",
    description: "Drone phun thuốc, gieo hạt, tải trọng 40kg",
    maintainanceInterval: "100 chuyến bay",
    createdAt: "2023-12-20",
  },
  {
    id: 3,
    code: "TB003",
    name: "Hệ thống tưới tự động Israel",
    type: "Hệ thống tưới",
    status: "maintenance",
    description: "Hệ thống tưới nhỏ giọt kết hợp châm phân",
    maintainanceInterval: "3 tháng",
    createdAt: "2024-01-05",
  },
];

export const equipmentTypes = [
  "Máy cơ giới",
  "Thiết bị bay (Drone)",
  "Hệ thống tưới",
  "Thiết bị cảm biến",
  "Máy thu hoạch",
  "Dụng cụ cầm tay",
  "Khác",
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
