import type { Coordinate } from "../region-chart/constants";

// Crop/Plant detailed information
export interface CropDetail {
  id: string;
  code: string;
  name: string;
  image: string;
  plantedDate: string;
  seedType: string; // Loại hạt giống
  variety: string; // Giống cây
  notes: string;
  status: "healthy" | "diseased" | "harvesting" | "removed";

  // Location information
  regionId: number;
  regionName: string;
  areaId: number;
  areaName: string;
  plotId: string;
  plotName: string;
  rowNumber?: number; // Số hàng
  coordinate: Coordinate;

  // Growth cycle
  growthStage: string; // Giai đoạn sinh trưởng
  expectedHarvestDate: string;
  actualAge: number; // Tuổi cây (tháng)

  // Certifications
  certifications: Certification[];

  // History
  cultivationHistory: CultivationRecord[];
  diseaseHistory: DiseaseRecord[];
  harvestHistory: HarvestRecord[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string; // Đơn vị cấp
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  status: "valid" | "expired" | "pending";
  documentUrl?: string;
}

export interface CultivationRecord {
  id: string;
  date: string;
  activity: string; // Hoạt động: tưới nước, bón phân, cắt tỉa, etc.
  description: string;
  performedBy: string;
  materials?: string; // Vật tư sử dụng
  quantity?: string;
  cost?: number;
  notes?: string;
}

export interface DiseaseRecord {
  id: string;
  date: string;
  diseaseName: string;
  severity: "low" | "medium" | "high";
  affectedArea: string; // Vùng bị ảnh hưởng
  symptoms: string;
  treatment: string;
  treatmentDate: string;
  recoveryStatus: "recovered" | "treating" | "severe";
  images?: string[];
  notes?: string;
}

export interface HarvestRecord {
  id: string;
  date: string;
  quantity: number; // kg
  quality: "A" | "B" | "C";
  price: number; // VND/kg
  totalRevenue: number;
  buyer?: string;
  notes?: string;
}

// Mock data
export const MOCK_CROPS: CropDetail[] = [
  {
    id: "crop-001",
    code: "TREE-001",
    name: "Sầu riêng Dona",
    image: "/images/durian-dona.jpg",
    plantedDate: "2020-05-15",
    seedType: "Hạt giống F1",
    variety: "Dona Malaysia",
    notes: "Cây phát triển tốt, đã cho quả 2 vụ",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 3,
    coordinate: { lat: 11.532, lng: 106.882 },

    growthStage: "Ra hoa",
    expectedHarvestDate: "2024-06-15",
    actualAge: 45, // 45 tháng

    certifications: [
      {
        id: "cert-001",
        name: "VietGAP",
        issuer: "Sở Nông nghiệp Bình Phước",
        issueDate: "2023-01-10",
        expiryDate: "2025-01-10",
        certificateNumber: "VG-BP-2023-001",
        status: "valid",
      },
      {
        id: "cert-002",
        name: "Organic Certificate",
        issuer: "Control Union Vietnam",
        issueDate: "2023-03-15",
        expiryDate: "2024-03-15",
        certificateNumber: "ORG-VN-2023-045",
        status: "expired",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-001",
        date: "2024-01-15",
        activity: "Bón phân",
        description: "Bón phân NPK 16-16-8",
        performedBy: "Nguyễn Văn A",
        materials: "Phân NPK 16-16-8",
        quantity: "2kg/cây",
        cost: 50000,
        notes: "Thời tiết thuận lợi",
      },
      {
        id: "cult-002",
        date: "2024-01-10",
        activity: "Tưới nước",
        description: "Tưới nhỏ giọt tự động",
        performedBy: "Hệ thống tự động",
        quantity: "50L/cây",
        notes: "Độ ẩm đất 65%",
      },
      {
        id: "cult-003",
        date: "2024-01-05",
        activity: "Cắt tỉa",
        description: "Cắt tỉa cành khô, cành yếu",
        performedBy: "Trần Văn B",
        notes: "Tạo tán cây thông thoáng",
      },
    ],

    diseaseHistory: [
      {
        id: "dis-001",
        date: "2023-11-20",
        diseaseName: "Phytophthora",
        severity: "medium",
        affectedArea: "Thân cây, rễ",
        symptoms: "Thân cây có vết nâu, lá vàng rụng",
        treatment: "Xử lý bằng thuốc Ridomil Gold",
        treatmentDate: "2023-11-21",
        recoveryStatus: "recovered",
        notes: "Đã hồi phục sau 2 tuần",
      },
    ],

    harvestHistory: [
      {
        id: "harv-001",
        date: "2023-08-15",
        quantity: 45,
        quality: "A",
        price: 120000,
        totalRevenue: 5400000,
        buyer: "Công ty TNHH Trái cây Xuất khẩu",
        notes: "Chất lượng tốt, giá cao",
      },
      {
        id: "harv-002",
        date: "2023-02-10",
        quantity: 38,
        quality: "A",
        price: 110000,
        totalRevenue: 4180000,
        buyer: "Chợ đầu mối Bình Điền",
        notes: "Vụ đầu tiên",
      },
    ],
  },
  {
    id: "crop-002",
    code: "TREE-002",
    name: "Sầu riêng Ri6",
    image: "/images/durian-ri6.jpg",
    plantedDate: "2019-11-20",
    seedType: "Hạt giống F1",
    variety: "Ri6 Thái Lan",
    notes: "Cây trưởng thành, năng suất cao",
    status: "harvesting",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 5,
    coordinate: { lat: 11.533, lng: 106.883 },

    growthStage: "Thu hoạch",
    expectedHarvestDate: "2024-02-01",
    actualAge: 51,

    certifications: [
      {
        id: "cert-003",
        name: "GlobalGAP",
        issuer: "SGS Vietnam",
        issueDate: "2023-06-01",
        expiryDate: "2025-06-01",
        certificateNumber: "GG-VN-2023-089",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-004",
        date: "2024-01-20",
        activity: "Phun thuốc",
        description: "Phun thuốc trừ sâu sinh học",
        performedBy: "Nguyễn Văn C",
        materials: "Thuốc BT",
        quantity: "20ml/10L nước",
        cost: 30000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-003",
        date: "2023-09-05",
        quantity: 52,
        quality: "A",
        price: 125000,
        totalRevenue: 6500000,
        buyer: "Công ty TNHH Trái cây Xuất khẩu",
      },
    ],
  },
  {
    id: "crop-003",
    code: "TREE-003",
    name: "Bơ 034",
    image: "/images/avocado-034.jpg",
    plantedDate: "2021-03-10",
    seedType: "Cây giống ghép",
    variety: "Bơ 034 Đắk Lắk",
    notes: "Đang điều trị bệnh",
    status: "diseased",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 2,
    areaName: "Khu vực B - Bơ sáp",
    plotId: "PLOT-002",
    plotName: "Lô 2 - Bơ 034",
    rowNumber: 2,
    coordinate: { lat: 11.534, lng: 106.884 },

    growthStage: "Sinh trưởng thân lá",
    expectedHarvestDate: "2024-12-15",
    actualAge: 34,

    certifications: [],

    cultivationHistory: [
      {
        id: "cult-005",
        date: "2024-01-18",
        activity: "Điều trị bệnh",
        description: "Xử lý bệnh thán thư",
        performedBy: "Chuyên gia bảo vệ thực vật",
        materials: "Thuốc Score 250EC",
        quantity: "10ml/10L nước",
        cost: 80000,
      },
    ],

    diseaseHistory: [
      {
        id: "dis-002",
        date: "2024-01-10",
        diseaseName: "Thán thư",
        severity: "high",
        affectedArea: "Lá, cành non",
        symptoms: "Lá có đốm nâu, cành khô",
        treatment: "Phun thuốc Score 250EC, cắt bỏ cành bệnh",
        treatmentDate: "2024-01-18",
        recoveryStatus: "treating",
        notes: "Đang theo dõi",
      },
    ],

    harvestHistory: [],
  },
  {
    id: "crop-004",
    code: "TREE-004",
    name: "Cà phê Robusta",
    image: "/images/coffee-robusta.jpg",
    plantedDate: "2020-08-15",
    seedType: "Hạt giống TR4",
    variety: "Robusta Đắk Lắk",
    notes: "Cây cho năng suất ổn định",
    status: "healthy",

    regionId: 3,
    regionName: "Đồi Cà phê Buôn Ma Thuột",
    areaId: 3,
    areaName: "Khu vực C - Cà phê",
    plotId: "PLOT-003",
    plotName: "Lô 3 - Cà phê Robusta",
    rowNumber: 8,
    coordinate: { lat: 12.667, lng: 108.037 },

    growthStage: "Đậu quả",
    expectedHarvestDate: "2024-03-20",
    actualAge: 41,

    certifications: [
      {
        id: "cert-004",
        name: "Rainforest Alliance",
        issuer: "Rainforest Alliance",
        issueDate: "2023-04-01",
        expiryDate: "2026-04-01",
        certificateNumber: "RA-VN-2023-156",
        status: "valid",
      },
      {
        id: "cert-005",
        name: "UTZ Certified",
        issuer: "UTZ Vietnam",
        issueDate: "2023-05-10",
        expiryDate: "2025-05-10",
        certificateNumber: "UTZ-2023-789",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-006",
        date: "2024-01-12",
        activity: "Bón phân",
        description: "Bón phân NPK chuyên dụng cho cà phê",
        performedBy: "Lê Văn D",
        materials: "Phân NPK 20-10-10",
        quantity: "300g/cây",
        cost: 35000,
      },
      {
        id: "cult-007",
        date: "2024-01-05",
        activity: "Làm cỏ",
        description: "Làm sạch cỏ dại xung quanh gốc",
        performedBy: "Đội làm vườn",
        cost: 20000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-004",
        date: "2023-11-15",
        quantity: 28,
        quality: "A",
        price: 45000,
        totalRevenue: 1260000,
        buyer: "Công ty Cà phê Trung Nguyên",
      },
      {
        id: "harv-005",
        date: "2023-03-20",
        quantity: 25,
        quality: "B",
        price: 38000,
        totalRevenue: 950000,
        buyer: "Hợp tác xã Cà phê",
      },
    ],
  },
  {
    id: "crop-005",
    code: "TREE-005",
    name: "Tiêu Vĩnh Linh",
    image: "/images/pepper.jpg",
    plantedDate: "2021-06-10",
    seedType: "Giống cây giâm",
    variety: "Tiêu Vĩnh Linh",
    notes: "Cây leo phát triển tốt",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 12,
    coordinate: { lat: 11.535, lng: 106.885 },

    growthStage: "Ra hoa",
    expectedHarvestDate: "2024-05-10",
    actualAge: 31,

    certifications: [
      {
        id: "cert-006",
        name: "VietGAP",
        issuer: "Sở Nông nghiệp Bình Phước",
        issueDate: "2023-07-15",
        expiryDate: "2025-07-15",
        certificateNumber: "VG-BP-2023-045",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-008",
        date: "2024-01-16",
        activity: "Cắt tỉa",
        description: "Cắt tỉa cành phụ, tạo dáng cây",
        performedBy: "Phạm Văn E",
        notes: "Cây phát triển tốt",
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-006",
        date: "2023-10-05",
        quantity: 12,
        quality: "A",
        price: 180000,
        totalRevenue: 2160000,
        buyer: "Công ty Gia vị Phú Quốc",
      },
    ],
  },
  {
    id: "crop-006",
    code: "TREE-006",
    name: "Sầu riêng Monthong",
    image: "/images/durian-monthong.jpg",
    plantedDate: "2018-03-25",
    seedType: "Cây giống ghép",
    variety: "Monthong Thái Lan",
    notes: "Cây lớn, cho quả đều",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 1,
    coordinate: { lat: 11.531, lng: 106.881 },

    growthStage: "Quả chín",
    expectedHarvestDate: "2024-02-15",
    actualAge: 70,

    certifications: [
      {
        id: "cert-007",
        name: "VietGAP",
        issuer: "Sở Nông nghiệp Bình Phước",
        issueDate: "2022-12-01",
        expiryDate: "2024-12-01",
        certificateNumber: "VG-BP-2022-123",
        status: "valid",
      },
      {
        id: "cert-008",
        name: "GlobalGAP",
        issuer: "SGS Vietnam",
        issueDate: "2023-02-15",
        expiryDate: "2025-02-15",
        certificateNumber: "GG-VN-2023-234",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-009",
        date: "2024-01-22",
        activity: "Tưới nước",
        description: "Tưới nhỏ giọt",
        performedBy: "Hệ thống tự động",
        quantity: "80L/cây",
      },
      {
        id: "cult-010",
        date: "2024-01-14",
        activity: "Bón phân",
        description: "Bón phân hữu cơ vi sinh",
        performedBy: "Nguyễn Văn A",
        materials: "Phân hữu cơ vi sinh",
        quantity: "5kg/cây",
        cost: 75000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-007",
        date: "2023-08-20",
        quantity: 68,
        quality: "A",
        price: 135000,
        totalRevenue: 9180000,
        buyer: "Siêu thị Big C",
        notes: "Quả to, chất lượng xuất sắc",
      },
      {
        id: "harv-008",
        date: "2023-02-18",
        quantity: 62,
        quality: "A",
        price: 128000,
        totalRevenue: 7936000,
        buyer: "Công ty TNHH Trái cây Xuất khẩu",
      },
      {
        id: "harv-009",
        date: "2022-09-10",
        quantity: 58,
        quality: "B",
        price: 95000,
        totalRevenue: 5510000,
        buyer: "Chợ đầu mối Bình Điền",
      },
    ],
  },
  {
    id: "crop-007",
    code: "TREE-007",
    name: "Xoài Cát Hòa Lộc",
    image: "/images/mango-cat-hoa-loc.jpg",
    plantedDate: "2020-12-05",
    seedType: "Cây giống ghép",
    variety: "Cát Hòa Lộc",
    notes: "Cây phát triển bình thường",
    status: "healthy",

    regionId: 2,
    regionName: "Nông trại Hữu cơ Đồng Nai",
    areaId: 4,
    areaName: "Khu vực D - Xoài",
    plotId: "PLOT-004",
    plotName: "Lô 4 - Xoài Cát",
    rowNumber: 4,
    coordinate: { lat: 10.958, lng: 107.221 },

    growthStage: "Sinh trưởng thân lá",
    expectedHarvestDate: "2024-07-20",
    actualAge: 38,

    certifications: [
      {
        id: "cert-009",
        name: "Organic Certificate",
        issuer: "Control Union Vietnam",
        issueDate: "2023-08-01",
        expiryDate: "2025-08-01",
        certificateNumber: "ORG-VN-2023-167",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-011",
        date: "2024-01-19",
        activity: "Bón phân",
        description: "Bón phân hữu cơ",
        performedBy: "Hoàng Văn F",
        materials: "Phân chuồng ủ hoai",
        quantity: "10kg/cây",
        cost: 40000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [],
  },
  {
    id: "crop-008",
    code: "TREE-008",
    name: "Thanh long Ruột đỏ",
    image: "/images/dragon-fruit.jpg",
    plantedDate: "2022-01-20",
    seedType: "Cành giống",
    variety: "Thanh long Ruột đỏ",
    notes: "Cây non, chưa cho quả",
    status: "healthy",

    regionId: 2,
    regionName: "Nông trại Hữu cơ Đồng Nai",
    areaId: 5,
    areaName: "Khu vực E - Thanh long",
    plotId: "PLOT-005",
    plotName: "Lô 5 - Thanh long",
    rowNumber: 6,
    coordinate: { lat: 10.959, lng: 107.222 },

    growthStage: "Sinh trưởng thân lá",
    expectedHarvestDate: "2024-08-15",
    actualAge: 24,

    certifications: [],

    cultivationHistory: [
      {
        id: "cult-012",
        date: "2024-01-21",
        activity: "Tưới nước",
        description: "Tưới phun sương",
        performedBy: "Hệ thống tự động",
        quantity: "30L/cây",
      },
      {
        id: "cult-013",
        date: "2024-01-10",
        activity: "Cắt tỉa",
        description: "Cắt cành yếu, tạo tán",
        performedBy: "Võ Văn G",
      },
    ],

    diseaseHistory: [],

    harvestHistory: [],
  },
  {
    id: "crop-009",
    code: "TREE-009",
    name: "Sầu riêng Musang King",
    image: "/images/durian-musang-king.jpg",
    plantedDate: "2019-05-10",
    seedType: "Cây giống ghép cao cấp",
    variety: "Musang King Malaysia",
    notes: "Giống cao cấp, giá trị cao",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 2,
    coordinate: { lat: 11.5315, lng: 106.8815 },

    growthStage: "Đậu quả",
    expectedHarvestDate: "2024-04-10",
    actualAge: 56,

    certifications: [
      {
        id: "cert-010",
        name: "Premium Quality",
        issuer: "Hiệp hội Sầu riêng Việt Nam",
        issueDate: "2023-09-01",
        expiryDate: "2025-09-01",
        certificateNumber: "PQ-VN-2023-001",
        status: "valid",
      },
      {
        id: "cert-011",
        name: "GlobalGAP",
        issuer: "SGS Vietnam",
        issueDate: "2023-03-20",
        expiryDate: "2025-03-20",
        certificateNumber: "GG-VN-2023-345",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-014",
        date: "2024-01-20",
        activity: "Bón phân",
        description: "Bón phân chuyên dụng cho sầu riêng cao cấp",
        performedBy: "Chuyên gia canh tác",
        materials: "Phân NPK 15-15-15 + vi lượng",
        quantity: "3kg/cây",
        cost: 120000,
        notes: "Tăng cường dinh dưỡng cho quả",
      },
      {
        id: "cult-015",
        date: "2024-01-12",
        activity: "Phun thuốc",
        description: "Phun thuốc phòng bệnh",
        performedBy: "Nguyễn Văn A",
        materials: "Thuốc sinh học",
        quantity: "15ml/10L",
        cost: 45000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-010",
        date: "2023-10-15",
        quantity: 42,
        quality: "A",
        price: 280000,
        totalRevenue: 11760000,
        buyer: "Siêu thị cao cấp Vinmart",
        notes: "Giá cao nhất trong vùng",
      },
      {
        id: "harv-011",
        date: "2023-04-08",
        quantity: 38,
        quality: "A",
        price: 265000,
        totalRevenue: 10070000,
        buyer: "Nhà hàng cao cấp",
      },
    ],
  },
  {
    id: "crop-010",
    code: "TREE-010",
    name: "Bơ Booth 7",
    image: "/images/avocado-booth7.jpg",
    plantedDate: "2020-09-15",
    seedType: "Cây giống ghép",
    variety: "Booth 7",
    notes: "Cây phát triển tốt",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 2,
    areaName: "Khu vực B - Bơ sáp",
    plotId: "PLOT-002",
    plotName: "Lô 2 - Bơ 034",
    rowNumber: 5,
    coordinate: { lat: 11.5345, lng: 106.8845 },

    growthStage: "Ra hoa",
    expectedHarvestDate: "2024-06-20",
    actualAge: 40,

    certifications: [
      {
        id: "cert-012",
        name: "VietGAP",
        issuer: "Sở Nông nghiệp Bình Phước",
        issueDate: "2023-10-10",
        expiryDate: "2025-10-10",
        certificateNumber: "VG-BP-2023-078",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-016",
        date: "2024-01-17",
        activity: "Tưới nước",
        description: "Tưới nhỏ giọt tự động",
        performedBy: "Hệ thống tự động",
        quantity: "60L/cây",
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-012",
        date: "2023-12-10",
        quantity: 35,
        quality: "A",
        price: 85000,
        totalRevenue: 2975000,
        buyer: "Siêu thị Lotte Mart",
      },
    ],
  },
  {
    id: "crop-011",
    code: "TREE-011",
    name: "Cà phê Arabica",
    image: "/images/coffee-arabica.jpg",
    plantedDate: "2021-02-20",
    seedType: "Hạt giống Catimor",
    variety: "Arabica Cầu Đất",
    notes: "Cây phát triển chậm do thời tiết",
    status: "healthy",

    regionId: 3,
    regionName: "Đồi Cà phê Buôn Ma Thuột",
    areaId: 3,
    areaName: "Khu vực C - Cà phê",
    plotId: "PLOT-003",
    plotName: "Lô 3 - Cà phê Robusta",
    rowNumber: 15,
    coordinate: { lat: 12.668, lng: 108.038 },

    growthStage: "Ra hoa",
    expectedHarvestDate: "2024-11-25",
    actualAge: 35,

    certifications: [
      {
        id: "cert-013",
        name: "Organic Certificate",
        issuer: "Control Union Vietnam",
        issueDate: "2023-11-01",
        expiryDate: "2025-11-01",
        certificateNumber: "ORG-VN-2023-234",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-017",
        date: "2024-01-15",
        activity: "Bón phân",
        description: "Bón phân hữu cơ",
        performedBy: "Lê Văn D",
        materials: "Phân hữu cơ vi sinh",
        quantity: "2kg/cây",
        cost: 28000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [],
  },
  {
    id: "crop-012",
    code: "TREE-012",
    name: "Sầu riêng Kho Qua Xanh",
    image: "/images/durian-kho-qua-xanh.jpg",
    plantedDate: "2022-07-10",
    seedType: "Hạt giống F1",
    variety: "Kho Qua Xanh",
    notes: "Cây non, đang phát triển",
    status: "healthy",

    regionId: 1,
    regionName: "Vùng Bình Phước Alpha",
    areaId: 1,
    areaName: "Khu vực A - Sầu riêng",
    plotId: "PLOT-001",
    plotName: "Lô 1 - Sầu riêng 6",
    rowNumber: 10,
    coordinate: { lat: 11.5325, lng: 106.8825 },

    growthStage: "Sinh trưởng thân lá",
    expectedHarvestDate: "2025-06-15",
    actualAge: 18,

    certifications: [],

    cultivationHistory: [
      {
        id: "cult-018",
        date: "2024-01-18",
        activity: "Bón phân",
        description: "Bón phân NPK cho cây non",
        performedBy: "Nguyễn Văn A",
        materials: "Phân NPK 16-16-8",
        quantity: "1kg/cây",
        cost: 25000,
      },
      {
        id: "cult-019",
        date: "2024-01-08",
        activity: "Làm cỏ",
        description: "Làm sạch cỏ xung quanh gốc",
        performedBy: "Đội làm vườn",
        cost: 15000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [],
  },
  {
    id: "crop-013",
    code: "TREE-013",
    name: "Nhãn Ido",
    image: "/images/longan-ido.jpg",
    plantedDate: "2019-10-05",
    seedType: "Cây giống ghép",
    variety: "Nhãn Ido Thái Lan",
    notes: "Cây cho quả ngọt, năng suất cao",
    status: "harvesting",

    regionId: 2,
    regionName: "Nông trại Hữu cơ Đồng Nai",
    areaId: 6,
    areaName: "Khu vực F - Nhãn",
    plotId: "PLOT-006",
    plotName: "Lô 6 - Nhãn Ido",
    rowNumber: 3,
    coordinate: { lat: 10.96, lng: 107.223 },

    growthStage: "Thu hoạch",
    expectedHarvestDate: "2024-01-30",
    actualAge: 51,

    certifications: [
      {
        id: "cert-014",
        name: "VietGAP",
        issuer: "Sở Nông nghiệp Đồng Nai",
        issueDate: "2023-06-15",
        expiryDate: "2025-06-15",
        certificateNumber: "VG-DN-2023-089",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-020",
        date: "2024-01-10",
        activity: "Phun thuốc",
        description: "Phun thuốc phòng sâu đục quả",
        performedBy: "Trần Văn H",
        materials: "Thuốc Decis 2.5EC",
        quantity: "10ml/10L",
        cost: 35000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [
      {
        id: "harv-013",
        date: "2023-07-20",
        quantity: 85,
        quality: "A",
        price: 55000,
        totalRevenue: 4675000,
        buyer: "Chợ đầu mối Thủ Đức",
      },
    ],
  },
  {
    id: "crop-014",
    code: "TREE-014",
    name: "Chôm chôm Nhãn",
    image: "/images/rambutan.jpg",
    plantedDate: "2020-04-12",
    seedType: "Cây giống ghép",
    variety: "Chôm chôm Nhãn",
    notes: "Cây phát triển bình thường",
    status: "healthy",

    regionId: 2,
    regionName: "Nông trại Hữu cơ Đồng Nai",
    areaId: 7,
    areaName: "Khu vực G - Chôm chôm",
    plotId: "PLOT-007",
    plotName: "Lô 7 - Chôm chôm",
    rowNumber: 7,
    coordinate: { lat: 10.961, lng: 107.224 },

    growthStage: "Đậu quả",
    expectedHarvestDate: "2024-05-25",
    actualAge: 45,

    certifications: [],

    cultivationHistory: [
      {
        id: "cult-021",
        date: "2024-01-14",
        activity: "Tưới nước",
        description: "Tưới phun mưa",
        performedBy: "Hệ thống tự động",
        quantity: "70L/cây",
      },
    ],

    diseaseHistory: [
      {
        id: "dis-003",
        date: "2023-12-05",
        diseaseName: "Bệnh đốm lá",
        severity: "low",
        affectedArea: "Lá già",
        symptoms: "Lá có đốm vàng nhỏ",
        treatment: "Phun thuốc đồng",
        treatmentDate: "2023-12-08",
        recoveryStatus: "recovered",
        notes: "Đã khỏi hoàn toàn",
      },
    ],

    harvestHistory: [
      {
        id: "harv-014",
        date: "2023-11-10",
        quantity: 48,
        quality: "B",
        price: 32000,
        totalRevenue: 1536000,
        buyer: "Chợ địa phương",
      },
    ],
  },
  {
    id: "crop-015",
    code: "TREE-015",
    name: "Măng cụt",
    image: "/images/mangosteen.jpg",
    plantedDate: "2018-11-20",
    seedType: "Cây giống",
    variety: "Măng cụt Miền Tây",
    notes: "Cây lớn, sắp cho quả",
    status: "healthy",

    regionId: 2,
    regionName: "Nông trại Hữu cơ Đồng Nai",
    areaId: 8,
    areaName: "Khu vực H - Măng cụt",
    plotId: "PLOT-008",
    plotName: "Lô 8 - Măng cụt",
    rowNumber: 2,
    coordinate: { lat: 10.962, lng: 107.225 },

    growthStage: "Ra hoa",
    expectedHarvestDate: "2024-09-10",
    actualAge: 62,

    certifications: [
      {
        id: "cert-015",
        name: "Organic Certificate",
        issuer: "Control Union Vietnam",
        issueDate: "2023-12-01",
        expiryDate: "2025-12-01",
        certificateNumber: "ORG-VN-2023-456",
        status: "valid",
      },
    ],

    cultivationHistory: [
      {
        id: "cult-022",
        date: "2024-01-11",
        activity: "Bón phân",
        description: "Bón phân hữu cơ",
        performedBy: "Hoàng Văn F",
        materials: "Phân chuồng ủ hoai",
        quantity: "15kg/cây",
        cost: 60000,
      },
    ],

    diseaseHistory: [],

    harvestHistory: [],
  },
];

export const GROWTH_STAGES = [
  { id: "seedling", name: "Giai đoạn cây con" },
  { id: "vegetative", name: "Sinh trưởng thân lá" },
  { id: "flowering", name: "Ra hoa" },
  { id: "fruiting", name: "Đậu quả" },
  { id: "ripening", name: "Quả chín" },
  { id: "harvesting", name: "Thu hoạch" },
];

export const ACTIVITY_TYPES = [
  { id: "watering", name: "Tưới nước" },
  { id: "fertilizing", name: "Bón phân" },
  { id: "pruning", name: "Cắt tỉa" },
  { id: "spraying", name: "Phun thuốc" },
  { id: "weeding", name: "Làm cỏ" },
  { id: "treatment", name: "Điều trị bệnh" },
  { id: "harvesting", name: "Thu hoạch" },
  { id: "other", name: "Khác" },
];
