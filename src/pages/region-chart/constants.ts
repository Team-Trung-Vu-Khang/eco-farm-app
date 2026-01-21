export const PROVINCES = [
  { id: "binh-phuoc", name: "Bình Phước" },
  { id: "dong-nai", name: "Đồng Nai" },
  { id: "dak-lak", name: "Đắk Lắk" },
];

export const DISTRICTS = [
  { id: "dong-xoai", name: "Đồng Xoài" },
  { id: "bu-dang", name: "Bù Đăng" },
];

export const ENTERPRISES = [
  { id: "ent-1", name: "Công ty Nông nghiệp Xanh" },
  { id: "ent-2", name: "Hợp tác xã Hữu cơ" },
  { id: "farmer-1", name: "Nông hộ Nguyễn Văn A" },
];

export const LAND_TYPES = [
  { id: "red-soil", name: "Đất đỏ Bazan" },
  { id: "alluvial", name: "Đất phù sa" },
  { id: "grey-soil", name: "Đất xám" },
];

export const TERRAIN_TYPES = [
  { id: "flat", name: "Bằng phẳng" },
  { id: "hill", name: "Đồi núi" },
  { id: "slope", name: "Dốc" },
];

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SubArea {
  id: string;
  name: string;
  area: number;
  landType: string;
  coordinates: Coordinate[]; // Rectangle corners
}

export interface Region {
  id: number;
  code: string;
  name: string;
  provinceId: string;
  districtId: string;
  address: string;
  enterpriseId: string;
  area: number;
  landType: string;
  terrain: string;
  note: string;
  status: "active" | "inactive";
  coordinates: Coordinate[]; // Rectangle corners
  subAreas: SubArea[];
  createdAt: string;
}

export const MOCK_REGIONS: Region[] = [
  {
    id: 1,
    code: "REG-001",
    name: "Vùng Bình Phước Alpha",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Khu phố 3, Phường Tân Đồng",
    enterpriseId: "ent-1",
    area: 50.5,
    landType: "red-soil",
    terrain: "flat",
    note: "Vùng trồng thử nghiệm sầu riêng",
    status: "active",
    createdAt: "2024-01-15",
    coordinates: [
      { lat: 11.53, lng: 106.88 },
      { lat: 11.55, lng: 106.91 },
    ],
    subAreas: [],
  },
  {
    id: 2,
    code: "REG-002",
    name: "Nông trại Hữu cơ Đồng Nai",
    provinceId: "dong-nai",
    districtId: "thong-nhat",
    address: "Xã Gia Kiệm, Huyện Thống Nhất",
    enterpriseId: "ent-2",
    area: 120.0,
    landType: "alluvial",
    terrain: "flat",
    note: "Chuyên canh rau màu hữu cơ",
    status: "active",
    createdAt: "2024-02-10",
    coordinates: [
      { lat: 10.957, lng: 107.22 },
      { lat: 10.965, lng: 107.23 },
    ],
    subAreas: [],
  },
  {
    id: 3,
    code: "REG-003",
    name: "Đồi Cà phê Buôn Ma Thuột",
    provinceId: "dak-lak",
    districtId: "bu-dang", // Using existing district id for simplicity or mock new one
    address: "Km 15, Quốc lộ 14",
    enterpriseId: "ent-1",
    area: 200.5,
    landType: "red-soil",
    terrain: "hill",
    note: "Cà phê Robusta xuất khẩu",
    status: "inactive",
    createdAt: "2023-11-05",
    coordinates: [],
    subAreas: [],
  },
  {
    id: 4,
    code: "REG-004",
    name: "Vườn cây ăn trái Tư Sang",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Ấp 2, Xã Tiến Hưng",
    enterpriseId: "farmer-1",
    area: 15.0,
    landType: "grey-soil",
    terrain: "slope",
    note: "Mô hình VAC",
    status: "active",
    createdAt: "2024-03-20",
    coordinates: [],
    subAreas: [],
  },
  {
    id: 5,
    code: "REG-005",
    name: "Khu Phức hợp Nông nghiệp Công nghệ cao",
    provinceId: "dong-nai",
    districtId: "long-thanh",
    address: "KCN Long Thành",
    enterpriseId: "ent-1",
    area: 500.0,
    landType: "alluvial",
    terrain: "flat",
    note: "Dự án trọng điểm",
    status: "active",
    createdAt: "2024-01-01",
    coordinates: [],
    subAreas: [],
  },
];

export interface Plot {
  id: string;
  name: string;
  area: number;
  coordinates: Coordinate[];
  contour: string; // contours
  altitude: number;
}

export const MOCK_PLOTS: Plot[] = [
  {
    id: "PLOT-001",
    name: "Lô 1 - Sầu riêng 6",
    area: 5.0,
    contour: "100m",
    altitude: 150,
    coordinates: [
      { lat: 11.53, lng: 106.88 },
      { lat: 11.535, lng: 106.885 },
    ],
  },
  {
    id: "PLOT-002",
    name: "Lô 2 - Bơ 034",
    area: 3.5,
    contour: "110m",
    altitude: 160,
    coordinates: [],
  },
];

export interface Area {
  id: number;
  code: string;
  name: string;
  regionId: number;
  area: number;
  landType: string;
  terrain: string;
  coordinates: Coordinate[];
  plots: Plot[];
  createdAt: string;
  status: "active" | "inactive";
}

export const MOCK_AREAS: Area[] = [
  {
    id: 1,
    code: "AREA-001",
    name: "Khu vực A - Sầu riêng",
    regionId: 1,
    area: 25.5,
    landType: "red-soil",
    terrain: "flat",
    coordinates: [],
    plots: [],
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 2,
    code: "AREA-002",
    name: "Khu vực B - Bơ sáp",
    regionId: 1,
    area: 15.0,
    landType: "red-soil",
    terrain: "flat",
    coordinates: [],
    plots: [],
    status: "active",
    createdAt: "2024-02-05",
  },
];
