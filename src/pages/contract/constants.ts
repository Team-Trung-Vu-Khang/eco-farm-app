// Contract Types
export const contractTypes = [
  { id: "purchase", name: "Hợp đồng mua bán" },
  { id: "service", name: "Hợp đồng dịch vụ" },
  { id: "lease", name: "Hợp đồng thuê" },
  { id: "cooperation", name: "Hợp đồng hợp tác" },
  { id: "other", name: "Loại khác" },
];

// Contract Status
export const contractStatuses = [
  { id: "draft", name: "Bản nháp", color: "gray" },
  { id: "pending", name: "Chờ ký", color: "yellow" },
  { id: "active", name: "Đang hiệu lực", color: "green" },
  { id: "expired", name: "Hết hạn", color: "red" },
  { id: "terminated", name: "Đã chấm dứt", color: "red" },
];

// Commodity Types
export const commodityTypes = [
  { id: "equipment", name: "Máy móc", icon: "🚜" },
  { id: "pesticide", name: "Thuốc bảo vệ thực vật", icon: "🧪" },
  { id: "fertilizer", name: "Phân bón", icon: "🌱" },
  { id: "material", name: "Vật tư", icon: "📦" },
];

// Mock Contracts (for parent contract selection)
export const mockContracts = [
  {
    id: 1,
    code: "HD001",
    name: "Hợp đồng mua phân bón",
    type: "purchase",
    signDate: "2024-01-10",
    status: "active",
  },
  {
    id: 2,
    code: "HD002",
    name: "Hợp đồng thuê máy móc",
    type: "lease",
    signDate: "2024-01-15",
    status: "active",
  },
  {
    id: 3,
    code: "HD003",
    name: "Hợp đồng dịch vụ kỹ thuật",
    type: "service",
    signDate: "2024-02-01",
    status: "active",
  },
];

// Mock Enterprises/Farms
export const mockEnterprises = [
  {
    id: 1,
    code: "DN001",
    name: "Công ty TNHH Nông nghiệp Xanh",
    type: "enterprise",
    address: "123 Đường ABC, TP.HCM",
    taxCode: "0123456789",
    representative: "Nguyễn Văn A",
    phone: "0901234567",
  },
  {
    id: 2,
    code: "NH001",
    name: "Nông hộ Trần Văn B",
    type: "farm",
    address: "456 Đường XYZ, Đồng Nai",
    taxCode: "0987654321",
    representative: "Trần Văn B",
    phone: "0912345678",
  },
  {
    id: 3,
    code: "DN002",
    name: "HTX Nông nghiệp Hữu cơ",
    type: "cooperative",
    address: "789 Đường DEF, Long An",
    taxCode: "0111222333",
    representative: "Lê Thị C",
    phone: "0923456789",
  },
];

// Mock Equipment
export const mockEquipment = [
  {
    id: 1,
    code: "MM001",
    name: "Máy cày đất",
    category: "Máy cày",
    brand: "Kubota",
    model: "L3408",
  },
  {
    id: 2,
    code: "MM002",
    name: "Máy phun thuốc",
    category: "Máy phun",
    brand: "Honda",
    model: "WJR2525",
  },
  {
    id: 3,
    code: "MM003",
    name: "Máy gặt đập liên hợp",
    category: "Máy gặt",
    brand: "Yanmar",
    model: "YH880",
  },
];

// Mock Pesticides
export const mockPesticides = [
  {
    id: 1,
    code: "TBVTV001",
    name: "Thuốc trừ sâu Abamectin 1.8% EC",
    group: "Thuốc trừ sâu",
    activeIngredient: "Abamectin",
  },
  {
    id: 2,
    code: "TBVTV002",
    name: "Thuốc diệt cỏ Glyphosate 480g/l SL",
    group: "Thuốc diệt cỏ",
    activeIngredient: "Glyphosate",
  },
  {
    id: 3,
    code: "TBVTV003",
    name: "Thuốc trừ nấm Mancozeb 80% WP",
    group: "Thuốc trừ nấm",
    activeIngredient: "Mancozeb",
  },
];

// Mock Fertilizers
export const mockFertilizers = [
  {
    id: 1,
    code: "PB001",
    name: "Phân NPK 16-16-8",
    type: "Phân hỗn hợp",
    formula: "16-16-8",
  },
  {
    id: 2,
    code: "PB002",
    name: "Phân Urê 46%",
    type: "Phân đạm",
    formula: "46-0-0",
  },
  {
    id: 3,
    code: "PB003",
    name: "Phân lân Super 16%",
    type: "Phân lân",
    formula: "0-16-0",
  },
];

// Mock Materials
export const mockMaterials = [
  {
    id: 1,
    code: "VT001",
    name: "Màng phủ nông nghiệp",
    category: "Vật tư trồng trọt",
    unit: "kg",
  },
  {
    id: 2,
    code: "VT002",
    name: "Lưới che nắng 70%",
    category: "Vật tư che phủ",
    unit: "m²",
  },
  {
    id: 3,
    code: "VT003",
    name: "Ống tưới nhỏ giọt",
    category: "Vật tư tưới tiêu",
    unit: "m",
  },
];

// Packaging Specifications
export const packagingSpecs = [
  { id: "bottle_100ml", name: "Chai 100ml" },
  { id: "bottle_250ml", name: "Chai 250ml" },
  { id: "bottle_500ml", name: "Chai 500ml" },
  { id: "bottle_1l", name: "Chai 1 lít" },
  { id: "bag_1kg", name: "Bao 1kg" },
  { id: "bag_5kg", name: "Bao 5kg" },
  { id: "bag_10kg", name: "Bao 10kg" },
  { id: "bag_25kg", name: "Bao 25kg" },
  { id: "bag_50kg", name: "Bao 50kg" },
  { id: "box_small", name: "Thùng nhỏ" },
  { id: "box_medium", name: "Thùng vừa" },
  { id: "box_large", name: "Thùng lớn" },
];

// Units
export const units = [
  { id: "kg", name: "Kilogram (kg)" },
  { id: "ton", name: "Tấn (tấn)" },
  { id: "liter", name: "Lít (l)" },
  { id: "bottle", name: "Chai" },
  { id: "bag", name: "Bao" },
  { id: "box", name: "Thùng" },
  { id: "piece", name: "Cái" },
  { id: "set", name: "Bộ" },
  { id: "meter", name: "Mét (m)" },
  { id: "m2", name: "Mét vuông (m²)" },
];
