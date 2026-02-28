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
    note: "Vùng trồng thử nghiệm sầu riêng, áp dụng công nghệ tưới nhỏ giọt Israel.",
    status: "active",
    createdAt: "2024-01-15",
    coordinates: [
      { lat: 11.546, lng: 106.892 },
      { lat: 11.552, lng: 106.905 },
      { lat: 11.549, lng: 106.918 },
      { lat: 11.538, lng: 106.912 },
      { lat: 11.535, lng: 106.898 },
    ],
    cropVarieties: [
      {
        id: "cv-001",
        name: "Sầu riêng",
        variety: "Dona Malaysia",
        status: "flowering",
        plantedDate: "2020-05-15",
        seedType: "Hạt giống F1",
      },
      {
        id: "cv-002",
        name: "Sầu riêng",
        variety: "Ri6 Thái Lan",
        status: "harvesting",
        plantedDate: "2019-11-20",
        seedType: "Cây giống ghép",
      },
    ],
    subAreas: [
      {
        id: "sub-1-1",
        code: "AREA-001",
        name: "Khu A - Sầu riêng Dona",
        regionId: 1,
        area: 20.0,
        landType: "red-soil",
        terrain: "flat",
        status: "active",
        createdAt: "2024-01-15",
        plots: [
          {
            id: "plot-1-1",
            name: "Lô A1 - Dona",
            area: 8.5,
            altitude: 150,
            contour: "100m",
            coordinates: [
              { lat: 11.546, lng: 106.892 },
              { lat: 11.548, lng: 106.896 },
              { lat: 11.544, lng: 106.898 },
              { lat: 11.542, lng: 106.894 },
            ],
          },
          {
            id: "plot-1-2",
            name: "Lô A2 - Dona",
            area: 11.5,
            altitude: 145,
            contour: "90m",
            coordinates: [
              { lat: 11.548, lng: 106.896 },
              { lat: 11.552, lng: 106.905 },
              { lat: 11.547, lng: 106.905 },
              { lat: 11.544, lng: 106.898 },
            ],
          },
        ],
        coordinates: [
          { lat: 11.546, lng: 106.892 },
          { lat: 11.552, lng: 106.905 },
          { lat: 11.545, lng: 106.905 },
          { lat: 11.54, lng: 106.898 },
        ],
      },
      {
        id: "sub-1-2",
        code: "AREA-002",
        name: "Khu B - Sầu riêng Musang King",
        regionId: 1,
        area: 15.5,
        landType: "red-soil",
        terrain: "flat",
        status: "active",
        createdAt: "2024-01-15",
        plots: [
          {
            id: "plot-1-3",
            name: "Lô B1 - Musang King",
            area: 15.5,
            altitude: 155,
            contour: "110m",
            coordinates: [
              { lat: 11.545, lng: 106.905 },
              { lat: 11.549, lng: 106.918 },
              { lat: 11.538, lng: 106.912 },
              { lat: 11.542, lng: 106.908 },
            ],
          },
        ],
        coordinates: [
          { lat: 11.545, lng: 106.905 },
          { lat: 11.549, lng: 106.918 },
          { lat: 11.538, lng: 106.912 },
          { lat: 11.542, lng: 106.908 },
        ],
      },
    ],
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
    note: "Chuyên canh rau màu hữu cơ đạt chuẩn GlobalGAP.",
    status: "active",
    createdAt: "2024-02-10",
    coordinates: [
      { lat: 10.957, lng: 107.22 },
      { lat: 10.97, lng: 107.225 },
      { lat: 10.975, lng: 107.245 },
      { lat: 10.96, lng: 107.25 },
      { lat: 10.952, lng: 107.235 },
    ],
    subAreas: [
      {
        id: "sub-2-1",
        code: "AREA-003",
        name: "Vườn rau thủy canh",
        regionId: 2,
        area: 40,
        landType: "alluvial",
        terrain: "flat",
        status: "active",
        createdAt: "2024-02-10",
        plots: [
          {
            id: "plot-2-1",
            name: "Lô C1 - Thủy canh",
            area: 40,
            altitude: 10,
            contour: "5m",
            coordinates: [
              { lat: 10.957, lng: 107.22 },
              { lat: 10.97, lng: 107.225 },
              { lat: 10.965, lng: 107.235 },
              { lat: 10.955, lng: 107.23 },
            ],
          },
        ],
        coordinates: [
          { lat: 10.957, lng: 107.22 },
          { lat: 10.97, lng: 107.225 },
          { lat: 10.965, lng: 107.235 },
          { lat: 10.955, lng: 107.23 },
        ],
      },
    ],
  },
  {
    id: 3,
    code: "REG-003",
    name: "Đồi Cà phê Buôn Ma Thuột",
    provinceId: "dak-lak",
    districtId: "bu-dang",
    address: "Km 15, Quốc lộ 14",
    enterpriseId: "ent-1",
    area: 200.5,
    landType: "red-soil",
    terrain: "hill",
    note: "Cà phê Robusta xuất khẩu, địa hình đồi núi dốc.",
    status: "inactive",
    createdAt: "2023-11-05",
    coordinates: [
      { lat: 12.66, lng: 108.02 },
      { lat: 12.68, lng: 108.03 },
      { lat: 12.69, lng: 108.06 },
      { lat: 12.67, lng: 108.08 },
      { lat: 12.65, lng: 108.05 },
    ],
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
    note: "Mô hình VAC kết hợp du lịch sinh thái.",
    status: "active",
    createdAt: "2024-03-20",
    coordinates: [
      { lat: 11.51, lng: 106.85 },
      { lat: 11.515, lng: 106.852 },
      { lat: 11.518, lng: 106.86 },
      { lat: 11.512, lng: 106.865 },
    ],
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
    note: "Dự án trọng điểm quốc gia về giống cây trồng.",
    status: "active",
    createdAt: "2024-01-01",
    coordinates: [
      { lat: 10.75, lng: 106.95 },
      { lat: 10.78, lng: 106.96 },
      { lat: 10.79, lng: 106.99 },
      { lat: 10.76, lng: 107.0 },
      { lat: 10.74, lng: 106.98 },
    ],
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
    id: "plot-1-1",
    name: "Lô A1 - Musang King",
    area: 8.5,
    altitude: 150,
    contour: "100m",
    coordinates: [
      { lat: 11.546, lng: 106.892 },
      { lat: 11.548, lng: 106.896 },
      { lat: 11.544, lng: 106.898 },
      { lat: 11.542, lng: 106.894 },
    ],
  },
  {
    id: "plot-1-2",
    name: "Lô A2 - Ri6",
    area: 10.0,
    altitude: 145,
    contour: "90m",
    coordinates: [
      { lat: 11.548, lng: 106.896 },
      { lat: 11.552, lng: 106.905 },
      { lat: 11.547, lng: 106.905 },
      { lat: 11.544, lng: 106.898 },
    ],
  },
  {
    id: "plot-2-1",
    name: "Lô B1 - Bơ 034",
    area: 7.5,
    altitude: 130,
    contour: "80m",
    coordinates: [
      { lat: 11.545, lng: 106.905 },
      { lat: 11.547, lng: 106.912 },
      { lat: 11.542, lng: 106.914 },
      { lat: 11.542, lng: 106.908 },
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
    name: "Khu vực A - Sầu riêng",
    regionId: 1,
    area: 25.5,
    landType: "red-soil",
    terrain: "flat",
    status: "active",
    createdAt: "2024-02-01",
    coordinates: [
      { lat: 11.546, lng: 106.892 },
      { lat: 11.552, lng: 106.905 },
      { lat: 11.545, lng: 106.905 },
      { lat: 11.54, lng: 106.898 },
    ],
    plots: [
      {
        id: "plot-1-1",
        name: "Lô A1 - Musang King",
        area: 8.5,
        altitude: 150,
        contour: "100m",
        coordinates: [
          { lat: 11.546, lng: 106.892 },
          { lat: 11.548, lng: 106.896 },
          { lat: 11.544, lng: 106.898 },
          { lat: 11.542, lng: 106.894 },
        ],
      },
      {
        id: "plot-1-2",
        name: "Lô A2 - Ri6",
        area: 10.0,
        altitude: 145,
        contour: "90m",
        coordinates: [
          { lat: 11.548, lng: 106.896 },
          { lat: 11.552, lng: 106.905 },
          { lat: 11.547, lng: 106.905 },
          { lat: 11.544, lng: 106.898 },
        ],
      },
      {
        id: "plot-1-3",
        name: "Lô A3 - Dona",
        area: 7.0,
        altitude: 140,
        contour: "85m",
        coordinates: [
          { lat: 11.544, lng: 106.898 },
          { lat: 11.547, lng: 106.905 },
          { lat: 11.545, lng: 106.905 },
          { lat: 11.54, lng: 106.898 },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "AREA-002",
    name: "Khu vực B - Bơ sáp",
    regionId: 1,
    area: 15.0,
    landType: "red-soil",
    terrain: "flat",
    status: "active",
    createdAt: "2024-02-05",
    coordinates: [
      { lat: 11.545, lng: 106.905 },
      { lat: 11.549, lng: 106.918 },
      { lat: 11.538, lng: 106.912 },
      { lat: 11.542, lng: 106.908 },
    ],
    plots: [
      {
        id: "plot-2-1",
        name: "Lô B1 - Bơ 034",
        area: 7.5,
        altitude: 130,
        contour: "80m",
        coordinates: [
          { lat: 11.545, lng: 106.905 },
          { lat: 11.547, lng: 106.912 },
          { lat: 11.542, lng: 106.914 },
          { lat: 11.542, lng: 106.908 },
        ],
      },
      {
        id: "plot-2-2",
        name: "Lô B2 - Bơ Booth",
        area: 7.5,
        altitude: 135,
        contour: "85m",
        coordinates: [
          { lat: 11.547, lng: 106.912 },
          { lat: 11.549, lng: 106.918 },
          { lat: 11.538, lng: 106.912 },
          { lat: 11.542, lng: 106.914 },
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
  cultivationAreaId?: string; // Link to the cultivation area configuration
  enterpriseId?: string;
  regionName?: string;
  areaName?: string;
  note?: string; // New field for extra info
}

export const MOCK_PLANTS: Plant[] = [
  {
    id: "1",
    code: "PL-001",
    name: "Sầu riêng Dona",
    type: "Cây ăn trái",
    status: "healthy",
    height: "2.5",
    ageValue: "3",
    ageUnit: "years",
    age: "3 năm 2 tháng",
    canopy: "1.8",
    rootSpread: "1.2",
    plantedDate: "2021-10-15",
    coordinate: { lat: 11.548, lng: 106.896 },
    plotId: "plot-1-2",
    regionName: "Vùng Bình Phước Alpha",
    areaName: "Khu vực A - Sầu riêng",
    note: "Cây phát triển tốt, đã bón phân định kỳ.",
  },
  {
    id: "2",
    code: "PL-002",
    name: "Sầu riêng Ri6",
    type: "Cây ăn trái",
    status: "healthy",
    height: "1.8",
    ageValue: "1",
    ageUnit: "years",
    age: "1 năm 6 tháng",
    canopy: "1.2",
    rootSpread: "0.8",
    plantedDate: "2021-10-15",
    coordinate: { lat: 11.55, lng: 106.902 },
    plotId: "plot-1-2",
    regionName: "Vùng Bình Phước Alpha",
    areaName: "Khu vực A - Sầu riêng",
  },
  {
    id: "3",
    code: "PL-003",
    name: "Bơ 034",
    type: "Cây ăn trái",
    status: "warning",
    height: "3.2",
    ageValue: "4",
    ageUnit: "years",
    age: "4 năm 1 tháng",
    canopy: "2.5",
    rootSpread: "2.0",
    plantedDate: "2020-03-10",
    coordinate: { lat: 11.545, lng: 106.91 },
    plotId: "plot-2-1",
    regionName: "Vùng Bình Phước Alpha",
    areaName: "Khu vực B - Bơ sáp",
    note: "Lá hơi vàng, cần kiểm tra lại hệ thống tưới.",
  },
];
