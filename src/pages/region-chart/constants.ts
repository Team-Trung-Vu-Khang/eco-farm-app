export const PROVINCES = [
  { id: "binh-phuoc", name: "Bình Phước" },
  { id: "dong-nai", name: "Đồng Nai" },
  { id: "dak-lak", name: "Đắk Lắk" },
  { id: "lam-dong", name: "Lâm Đồng" },
];

export const DISTRICTS = [
  { id: "dong-xoai", name: "Đồng Xoài" },
  { id: "bu-dang", name: "Bù Đăng" },
  { id: "di-linh", name: "Di Linh" },
  { id: "da-lat", name: "Đà Lạt" },
];

export const ENTERPRISES = [
  {
    id: "ent-1",
    name: "Công ty Nông nghiệp Xanh",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "ent-2",
    name: "Hợp tác xã Hữu cơ",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "farmer-1",
    name: "Nông hộ Nguyễn Văn A",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
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
  id: string; // Keep as string for nested IDs
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

export interface RegionCrop {
  id: string;
  name: string;
  variety: string;
  status: string;
  plantedDate?: string;
  seedType?: string;
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
  cropVarieties?: RegionCrop[];
  ward?: string;
}

export const MOCK_REGIONS: Region[] = [
  {
    id: 1,
    code: "REG-001",
    name: "Vùng lúa chất lượng cao An Giang Alpha",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Ấp Vĩnh Thành, xã Định Mỹ",
    enterpriseId: "1",
    area: 50.5,
    landType: "DAT002",
    terrain: "DH001",
    note: "Vùng trồng lúa chất lượng cao, áp dụng tưới ngập khô xen kẽ và quản lý dịch hại tổng hợp IPM.",
    status: "active",
    createdAt: "2024-01-15",
    ward: "Xã Định Mỹ",
    coordinates: [
      { lat: 10.285, lng: 105.252 },
      { lat: 10.289, lng: 105.255 },
      { lat: 10.286, lng: 105.259 },
      { lat: 10.281, lng: 105.255 },
    ],
    cropVarieties: [
      {
        id: "cv-001",
        name: "Lúa",
        variety: "ST25",
        status: "tillering",
        plantedDate: "2024-05-15",
        seedType: "Giống xác nhận cấp 1",
      },
      {
        id: "cv-002",
        name: "Lúa",
        variety: "OM5451",
        status: "heading",
        plantedDate: "2024-04-20",
        seedType: "Giống nguyên chủng",
      },
    ],
    subAreas: [
      {
        id: "sub-1-1",
        code: "AREA-001",
        name: "Khu A - Lúa ST25",
        regionId: 1,
        area: 20.0,
        landType: "DAT002",
        terrain: "DH001",
        status: "active",
        createdAt: "2024-01-15",
        plots: [
          {
            id: "plot-1-1",
            code: "PLOT-1-1",
            name: "Lô A1 - ST25",
            area: 8.5,
            altitude: 4,
            contour: "1m",
            coordinates: [
              { lat: 10.285, lng: 105.252 },
              { lat: 10.286, lng: 105.254 },
              { lat: 10.284, lng: 105.255 },
              { lat: 10.283, lng: 105.253 },
            ],
          },
          {
            id: "plot-1-2",
            code: "PLOT-1-2",
            name: "Lô A2 - OM5451",
            area: 11.5,
            altitude: 4,
            contour: "1m",
            coordinates: [
              { lat: 10.286, lng: 105.254 },
              { lat: 10.288, lng: 105.256 },
              { lat: 10.286, lng: 105.258 },
              { lat: 10.284, lng: 105.255 },
            ],
          },
        ],
        coordinates: [
          { lat: 10.285, lng: 105.252 },
          { lat: 10.288, lng: 105.256 },
          { lat: 10.285, lng: 105.257 },
          { lat: 10.282, lng: 105.253 },
        ],
      },
      {
        id: "sub-1-2",
        code: "AREA-002",
        name: "Khu B - Lúa OM18",
        regionId: 1,
        area: 15.5,
        landType: "DAT002",
        terrain: "DH001",
        status: "active",
        createdAt: "2024-01-15",
        plots: [
          {
            id: "plot-1-3",
            code: "PLOT-1-3",
            name: "Lô B1 - OM18",
            area: 15.5,
            altitude: 4,
            contour: "1m",
            coordinates: [
              { lat: 10.285, lng: 105.257 },
              { lat: 10.288, lng: 105.259 },
              { lat: 10.282, lng: 105.26 },
              { lat: 10.283, lng: 105.258 },
            ],
          },
        ],
        coordinates: [
          { lat: 10.285, lng: 105.257 },
          { lat: 10.288, lng: 105.259 },
          { lat: 10.282, lng: 105.26 },
          { lat: 10.283, lng: 105.258 },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "REG-002",
    name: "Cánh đồng lúa hữu cơ Đồng Tháp",
    provinceId: "dong-nai",
    districtId: "thong-nhat",
    address: "Xã Mỹ Đông, huyện Tháp Mười",
    enterpriseId: "2",
    area: 120.0,
    landType: "DAT001",
    terrain: "DH001",
    note: "Chuyên canh lúa hữu cơ đạt chuẩn GlobalGAP, sử dụng phân hữu cơ và thiên địch sinh học.",
    status: "active",
    createdAt: "2024-02-10",
    ward: "Xã Mỹ Đông",
    coordinates: [
      { lat: 10.579, lng: 105.682 },
      { lat: 10.59, lng: 105.688 },
      { lat: 10.595, lng: 105.706 },
      { lat: 10.581, lng: 105.711 },
      { lat: 10.573, lng: 105.695 },
    ],
    subAreas: [
      {
        id: "sub-2-1",
        code: "AREA-003",
        name: "Khu lúa hữu cơ Japonica",
        regionId: 2,
        area: 40,
        landType: "DAT001",
        terrain: "DH001",
        status: "active",
        createdAt: "2024-02-10",
        plots: [
          {
            id: "plot-2-1",
            code: "PLOT-2-1",
            name: "Lô C1 - Japonica",
            area: 40,
            altitude: 3,
            contour: "1m",
            coordinates: [
              { lat: 10.579, lng: 105.682 },
              { lat: 10.59, lng: 105.688 },
              { lat: 10.585, lng: 105.698 },
              { lat: 10.576, lng: 105.692 },
            ],
          },
        ],
        coordinates: [
          { lat: 10.579, lng: 105.682 },
          { lat: 10.59, lng: 105.688 },
          { lat: 10.585, lng: 105.698 },
          { lat: 10.576, lng: 105.692 },
        ],
      },
    ],
  },
  {
    id: 3,
    code: "REG-003",
    name: "Vùng lúa Kiên Giang xuất khẩu",
    provinceId: "dak-lak",
    districtId: "bu-dang",
    address: "Km 15, tuyến kênh Tân Hiệp",
    enterpriseId: "1",
    area: 200.5,
    landType: "DAT002",
    terrain: "DH003",
    note: "Vùng lúa xuất khẩu, luân canh lúa - màu, đang tạm ngưng để cải tạo đất sau vụ Đông Xuân.",
    status: "inactive",
    createdAt: "2023-11-05",
    ward: "N/A",
    coordinates: [
      { lat: 10.12, lng: 105.18 },
      { lat: 10.14, lng: 105.19 },
      { lat: 10.15, lng: 105.22 },
      { lat: 10.13, lng: 105.24 },
      { lat: 10.11, lng: 105.21 },
    ],
    subAreas: [],
  },
  {
    id: 4,
    code: "REG-004",
    name: "Ruộng lúa sinh thái Tư Sang",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Ấp 2, xã Vọng Đông",
    enterpriseId: "5",
    area: 15.0,
    landType: "DAT006",
    terrain: "DH002",
    note: "Mô hình lúa - cá kết hợp du lịch trải nghiệm mùa gặt.",
    status: "active",
    createdAt: "2024-01-20T08:00:00Z",
    coordinates: [
      { lat: 10.337, lng: 105.215 },
      { lat: 10.342, lng: 105.217 },
      { lat: 10.345, lng: 105.225 },
      { lat: 10.339, lng: 105.23 },
    ],
    subAreas: [],
  },
  {
    id: 5,
    code: "REG-005",
    name: "Khu Phức hợp Giống lúa Công nghệ cao",
    provinceId: "dong-nai",
    districtId: "long-thanh",
    address: "Khu sản xuất giống lúa Long Thành",
    enterpriseId: "1",
    area: 500.0,
    landType: "DAT001",
    terrain: "DH001",
    note: "Dự án trọng điểm về nghiên cứu, khảo nghiệm và sản xuất giống lúa chất lượng cao.",
    status: "active",
    createdAt: "2024-01-01",
    coordinates: [
      { lat: 10.63, lng: 105.58 },
      { lat: 10.66, lng: 105.59 },
      { lat: 10.67, lng: 105.62 },
      { lat: 10.64, lng: 105.63 },
      { lat: 10.62, lng: 105.61 },
    ],
    subAreas: [],
  },
  {
    id: 10,
    code: "REG-DL-10",
    name: "Vùng lúa mùa Cao Lãnh",
    provinceId: "lam-dong",
    districtId: "di-linh",
    address: "Huyện Cao Lãnh, Đồng Tháp",
    enterpriseId: "1",
    area: 120.0,
    landType: "DAT002",
    terrain: "DH003",
    note: "Vùng trũng ven kênh, chuyên canh lúa mùa và sản xuất giống lúa thơm.",
    status: "active",
    createdAt: "2024-02-15T08:00:00Z",
    coordinates: [
      { lat: 10.48, lng: 105.63 },
      { lat: 10.48, lng: 105.64 },
      { lat: 10.47, lng: 105.64 },
      { lat: 10.47, lng: 105.63 },
    ],
    subAreas: [],
  },
  {
    id: 11,
    code: "REG-CD-11",
    name: "Vùng lúa thơm Tân Hưng",
    provinceId: "lam-dong",
    districtId: "da-lat",
    address: "Xã Hưng Điền, huyện Tân Hưng",
    enterpriseId: "1",
    area: 85.5,
    landType: "DAT002",
    terrain: "DH003",
    note: "Vùng sản xuất lúa thơm, kiểm soát nước theo kênh nội đồng và truy xuất nguồn gốc từng lô.",
    status: "active",
    createdAt: "2024-02-20T08:00:00Z",
    coordinates: [
      { lat: 10.77, lng: 105.78 },
      { lat: 10.77, lng: 105.79 },
      { lat: 10.76, lng: 105.79 },
      { lat: 10.76, lng: 105.78 },
    ],
    subAreas: [],
  },
];

export interface Plot {
  id: string;
  code: string;
  name: string;
  area: number;
  coordinates: Coordinate[];
  contour: string; // contours
  altitude: number;
}

export const MOCK_PLOTS: Plot[] = [
  {
    id: "plot-1-1",
    code: "PLOT-1-1",
    name: "Lô A1 - ST25",
    area: 8.5,
    altitude: 4,
    contour: "1m",
    coordinates: [
      { lat: 10.284, lng: 105.251 },
      { lat: 10.286, lng: 105.255 },
      { lat: 10.282, lng: 105.257 },
      { lat: 10.28, lng: 105.253 },
    ],
  },
  {
    id: "plot-1-2",
    code: "PLOT-1-2",
    name: "Lô A2 - OM5451",
    area: 10.0,
    altitude: 4,
    contour: "1m",
    coordinates: [
      { lat: 10.286, lng: 105.255 },
      { lat: 10.29, lng: 105.264 },
      { lat: 10.285, lng: 105.264 },
      { lat: 10.282, lng: 105.257 },
    ],
  },
  {
    id: "plot-2-1",
    code: "PLOT-2-1",
    name: "Lô B1 - Japonica",
    area: 7.5,
    altitude: 3,
    contour: "1m",
    coordinates: [
      { lat: 10.283, lng: 105.264 },
      { lat: 10.285, lng: 105.271 },
      { lat: 10.28, lng: 105.273 },
      { lat: 10.28, lng: 105.267 },
    ],
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
    name: "Khu vực A - Lúa chất lượng cao",
    regionId: 1,
    area: 25.5,
    landType: "red-soil",
    terrain: "flat",
    status: "active",
    createdAt: "2024-02-01",
    coordinates: [
      { lat: 10.284, lng: 105.251 },
      { lat: 10.29, lng: 105.264 },
      { lat: 10.283, lng: 105.264 },
      { lat: 10.278, lng: 105.257 },
    ],
    plots: [
      {
        id: "plot-1-1",
        code: "PLOT-1-1",
        name: "Lô A1 - ST25",
        area: 8.5,
        altitude: 4,
        contour: "1m",
        coordinates: [
          { lat: 10.284, lng: 105.251 },
          { lat: 10.286, lng: 105.255 },
          { lat: 10.282, lng: 105.257 },
          { lat: 10.28, lng: 105.253 },
        ],
      },
      {
        id: "plot-1-2",
        code: "PLOT-1-2",
        name: "Lô A2 - OM5451",
        area: 10.0,
        altitude: 4,
        contour: "1m",
        coordinates: [
          { lat: 10.286, lng: 105.255 },
          { lat: 10.29, lng: 105.264 },
          { lat: 10.285, lng: 105.264 },
          { lat: 10.282, lng: 105.257 },
        ],
      },
      {
        id: "plot-1-3",
        code: "PLOT-1-3",
        name: "Lô A3 - OM18",
        area: 7.0,
        altitude: 4,
        contour: "1m",
        coordinates: [
          { lat: 10.282, lng: 105.257 },
          { lat: 10.285, lng: 105.264 },
          { lat: 10.283, lng: 105.264 },
          { lat: 10.278, lng: 105.257 },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "AREA-002",
    name: "Khu vực B - Lúa hữu cơ",
    regionId: 1,
    area: 15.0,
    landType: "red-soil",
    terrain: "flat",
    status: "active",
    createdAt: "2024-02-05",
    coordinates: [
      { lat: 10.283, lng: 105.264 },
      { lat: 10.287, lng: 105.277 },
      { lat: 10.276, lng: 105.271 },
      { lat: 10.28, lng: 105.267 },
    ],
    plots: [
      {
        id: "plot-2-1",
        code: "PLOT-2-1",
        name: "Lô B1 - Japonica",
        area: 7.5,
        altitude: 3,
        contour: "1m",
        coordinates: [
          { lat: 10.283, lng: 105.264 },
          { lat: 10.285, lng: 105.271 },
          { lat: 10.28, lng: 105.273 },
          { lat: 10.28, lng: 105.267 },
        ],
      },
      {
        id: "plot-2-2",
        code: "PLOT-2-2",
        name: "Lô B2 - Nàng Hoa 9",
        area: 7.5,
        altitude: 3,
        contour: "1m",
        coordinates: [
          { lat: 10.285, lng: 105.271 },
          { lat: 10.287, lng: 105.277 },
          { lat: 10.276, lng: 105.271 },
          { lat: 10.28, lng: 105.273 },
        ],
      },
    ],
  },
];
export interface Plant {
  id: string;
  code: string;
  name: string; // e.g., "Sầu riêng Dona", "Bơ 034"
  type?: string; // "fruit", "industrial", etc. (Optional, moving towards notes)
  status?: "healthy" | "warning" | "critical" | "removed"; // (Optional)
  height?: string;
  age?: string; // Legacy string age
  ageValue?: string; // New numeric age value
  ageUnit?: "days" | "months" | "years"; // New age unit
  canopy?: string; // (Optional)
  rootSpread?: string; // (Optional)
  plantedDate: string;
  coordinate: Coordinate;
  plotId: string;
  cultivationRegionId?: string; // Link to the cultivation area configuration
  enterpriseId?: string;
  regionName?: string;
  areaName?: string;
  note?: string; // New field for extra info
}

export const MOCK_PLANTS: Plant[] = [
  {
    id: "1",
    code: "PL-001",
    name: "Lúa ST25",
    type: "Cây lương thực",
    status: "healthy",
    height: "0.75",
    ageValue: "65",
    ageUnit: "days",
    age: "65 ngày sau sạ",
    canopy: "0.35",
    rootSpread: "0.18",
    plantedDate: "2024-05-15",
    coordinate: { lat: 10.286, lng: 105.255 },
    plotId: "plot-1-2",
    regionName: "Vùng lúa chất lượng cao An Giang Alpha",
    areaName: "Khu vực A - Lúa chất lượng cao",
    note: "Ruộng sinh trưởng tốt, đang giai đoạn làm đòng, đã bón phân đợt 2.",
  },
  {
    id: "2",
    code: "PL-002",
    name: "Lúa OM5451",
    type: "Cây lương thực",
    status: "healthy",
    height: "0.68",
    ageValue: "58",
    ageUnit: "days",
    age: "58 ngày sau sạ",
    canopy: "0.32",
    rootSpread: "0.16",
    plantedDate: "2024-05-20",
    coordinate: { lat: 10.288, lng: 105.261 },
    plotId: "plot-1-2",
    regionName: "Vùng lúa chất lượng cao An Giang Alpha",
    areaName: "Khu vực A - Lúa chất lượng cao",
  },
  {
    id: "3",
    code: "PL-003",
    name: "Lúa Japonica",
    type: "Cây lương thực",
    status: "warning",
    height: "0.62",
    ageValue: "52",
    ageUnit: "days",
    age: "52 ngày sau sạ",
    canopy: "0.3",
    rootSpread: "0.15",
    plantedDate: "2024-05-25",
    coordinate: { lat: 10.283, lng: 105.269 },
    plotId: "plot-2-1",
    regionName: "Vùng lúa chất lượng cao An Giang Alpha",
    areaName: "Khu vực B - Lúa hữu cơ",
    note: "Một số điểm có dấu hiệu vàng lá, cần kiểm tra mực nước và rầy nâu.",
  },
];
