import type { Material } from "../types/types";

export const initialMaterials: Material[] = [
  {
    id: 1,
    code: "VL001",
    name: "Màng phủ nông nghiệp",
    type: "Vật tư tiêu hao",
    description: "Màng phủ PE đen/bạc, khổ 1m, dày 15 mic",
    status: "active",
    createdAt: "2024-01-15",
    materialGroupId: "consumables",
    manufacturerOrigin: ["Công ty Nhựa Rạng Đông - Việt Nam"],
    importerRegistrant: ["Công ty TNHH Nhựa Hòa Phát"],
    distributor: ["Đại lý Bình Minh"],
    packagingSpecs: ["Cuộn màng PE"],
  },
  {
    id: 2,
    code: "VL002",
    name: "Ống tưới nhỏ giọt 16mm",
    type: "Thiết bị tưới",
    description: "Khoảng cách lỗ 20cm, lưu lượng 2L/h",
    status: "active",
    createdAt: "2024-01-16",
    materialGroupId: "fixed_assets",
    manufacturerOrigin: ["Netafim - Israel"],
    importerRegistrant: ["Công ty TNHH Khang Thịnh"],
    distributor: ["DJI Store Vietnam"],
    packagingSpecs: ["Cuộn 500m"],
  },
  {
    id: 3,
    code: "VL003",
    name: "Khay ươm hạt 105 lỗ",
    type: "Dụng cụ ươm",
    description: "Nhựa PE bền, tái sử dụng được",
    status: "active",
    createdAt: "2024-01-18",
    materialGroupId: "hand_tools",
    manufacturerOrigin: ["Việt Nam"],
    importerRegistrant: [],
    distributor: ["Cửa hàng Vật tư Nông nghiệp Hòa Phát"],
    packagingSpecs: ["Kiện 50 cái"],
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

export const mockMaterialSuppliers = [
  {
    id: "sup1",
    name: "Công ty Nhựa Rạng Đông",
    type: "enterprise",
    quantity: "50",
    unit: "Cuộn",
    packaging: "Cuộn 1000m",
  },
  {
    id: "sup2",
    name: "Đại lý VTNN Hòa Phát",
    type: "enterprise",
    quantity: "20",
    unit: "Cuộn",
    packaging: "Cuộn 500m",
  },
];

// Unified Material Groups categorized by aspect
export const materialGroups = [
  {
    category: "Mức độ công nghệ",
    options: [
      { id: "hand_tools", label: "Dụng cụ thủ công (Hand Tools)" },
      { id: "motorized_machinery", label: "Máy móc cơ giới (Motorized Machinery)" },
      { id: "smart_devices", label: "Thiết bị Công nghệ cao / IoT" },
    ]
  },
  {
    category: "Chuỗi giá trị",
    options: [
      { id: "land_prep", label: "Làm đất / Cải tạo ao" },
      { id: "planting", label: "Gieo trồng / Xuống giống" },
      { id: "care_monitoring", label: "Chăm sóc & Theo dõi" },
      { id: "harvesting", label: "Thu hoạch" },
      { id: "post_harvest", label: "Sơ chế & Bảo quản (Sau thu hoạch)" },
    ]
  },
  {
    category: "Khía cạnh tài chính & Quản lý tài sản",
    options: [
      { id: "consumables", label: "Vật tư / Dụng cụ tiêu hao" },
      { id: "fixed_assets", label: "Tài sản cố định / Công cụ dụng cụ lâu bền" },
    ]
  }
];

export const getMaterialGroupLabel = (id?: string) => {
  if (!id) return "Chưa phân nhóm";
  for (const cat of materialGroups) {
    const found = cat.options.find(o => o.id === id);
    if (found) return found.label;
  }
  return id;
};

// Packaging Presets for Materials
export const packagingSpecsPresets = [
  "1 Thùng / Thùng",
  "1 Bao / Bao",
  "1 Cuộn / Cuộn",
  "1 Hộp / Hộp",
  "1 Chai / Chai",
  "50 cái / Kiện",
  "500 m / Cuộn",
];
