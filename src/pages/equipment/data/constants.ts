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

    // New Fields
    sku: "TB001",
    machineName: "Máy cày Kubota L5018",
    model: "L5018",
    productImage: "",
    manufacturer: "Kubota",
    countryOfOrigin: "Nhật Bản",
    manufactureYear: 2022,
    technologyLevelGroup: "motorized_machinery",
    assetManagementGroup: "fixed_assets",
    valueChainGroup: ["land_prep"],
    machineType: ["Máy cày", "Máy cơ giới"],
    powerCapacity: "50 HP",
    workingCapacity: "0.5 ha/giờ",
    fuelEnergyType: "Dầu diesel",
    dimensions: "3200 × 1495 × 2050 mm",
    weight: "1490 kg",
    otherSpecifications: "Động cơ Diesel 4 thì, 3 xi lanh trực tiếp",
    fuelConsumptionRate: "4.5 lít/giờ",
    maintenanceSchedule: "300 giờ hoạt động",
    mainAccessories: "Dàn xới xoay, lưỡi cày 3 chảo",
    manufacturerOrigin: ["Kubota - Nhật Bản"],
    importerRegistrant: ["Công ty Kubota Việt Nam"],
    distributor: ["Đại lý Kubota Bình Minh"],
    referencePrice: "420.000.000 đ",
    packagingSpecs: ["Kiện nguyên chiếc"],
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

    // New Fields
    sku: "TB002",
    machineName: "Drone phun thuốc DJI Agras T40",
    model: "Agras T40",
    productImage: "",
    manufacturer: "DJI",
    countryOfOrigin: "Trung Quốc",
    manufactureYear: 2023,
    technologyLevelGroup: "smart_devices",
    assetManagementGroup: "fixed_assets",
    valueChainGroup: ["care_monitoring"],
    machineType: ["Drone", "Máy phun thuốc"],
    powerCapacity: "12 kW",
    workingCapacity: "21 ha/giờ",
    fuelEnergyType: "Pin",
    dimensions: "2800 × 3125 × 640 mm",
    weight: "38 kg (không pin)",
    otherSpecifications: "Hệ thống phun ly tâm kép, Radar tránh vật cản",
    fuelConsumptionRate: "0.8 kWh/chuyến",
    maintenanceSchedule: "100 chuyến bay",
    mainAccessories: "Pin dự phòng DB1560, Trạm sạc siêu tốc C10000",
    manufacturerOrigin: ["DJI - Trung Quốc"],
    importerRegistrant: ["Công ty Trách nhiệm hữu hạn DJI Việt Nam"],
    distributor: ["DJI Store Vietnam"],
    referencePrice: "350.000.000 đ",
    packagingSpecs: ["Thùng gỗ bảo vệ"],
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

    // New Fields
    sku: "TB003",
    machineName: "Hệ thống tưới tự động Israel",
    model: "Netafim Drip System",
    productImage: "",
    manufacturer: "Netafim",
    countryOfOrigin: "Israel",
    manufactureYear: 2021,
    technologyLevelGroup: "smart_devices",
    assetManagementGroup: "fixed_assets",
    valueChainGroup: ["care_monitoring"],
    machineType: ["Hệ thống tưới"],
    powerCapacity: "5.5 HP",
    workingCapacity: "10 m3/giờ",
    fuelEnergyType: "Điện",
    dimensions: "N/A",
    weight: "120 kg",
    otherSpecifications: "Bộ điều khiển tưới thông minh Netbeat, đầu bù áp drip",
    fuelConsumptionRate: "3 kWh/giờ",
    maintenanceSchedule: "3 tháng",
    mainAccessories: "Bộ lọc đĩa tự động xả ngược, châm phân Venturi",
    manufacturerOrigin: ["Netafim - Israel"],
    importerRegistrant: ["Công ty CP Công nghệ tưới Khang Thịnh"],
    distributor: ["Đại lý tưới tự động Miền Nam"],
    referencePrice: "85.000.000 đ",
    packagingSpecs: ["Thùng gỗ", "Pallet linh kiện"],
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

export const fuelEnergyTypeOptions = [
  "Dầu diesel",
  "Xăng",
  "Điện",
  "Pin",
  "Năng lượng mặt trời",
  "Khác",
];

export const machineTypeOptions = [
  "Máy cày",
  "Máy kéo",
  "Máy gặt đập liên hợp",
  "Máy bơm",
  "Máy phun thuốc",
  "Drone",
  "Hệ thống tưới",
  "Máy xay xát",
  "Máy sấy",
  "Hệ thống cho ăn tự động",
  "Quạt tạo oxy",
  "Máy sục khí",
  "Hệ thống lọc nước",
  "Thiết bị khác",
];

export const packagingSpecsPresets = [
  "Thùng gỗ nguyên kiện",
  "Đóng thùng gỗ",
  "Pallet kiện gỗ",
  "Thùng carton",
  "Hộp xốp bảo vệ",
  "Đai nẹp kiện hàng",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Kubota Việt Nam", type: "enterprise" },
  { id: "sup2", name: "DJI Store Vietnam", type: "enterprise" },
  { id: "sup3", name: "Nhà cung cấp Hai Lúa", type: "enterprise" },
  { id: "sup4", name: "Netafim Israel Vietnam", type: "enterprise" },
];

export const units = ["Cái", "Bộ", "Hệ thống", "Chiếc", "Dàn", "Trạm"];
