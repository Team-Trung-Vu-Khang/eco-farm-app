export const PROVINCES = [
  { id: "binh-phuoc", name: "Bến Tre" },
  { id: "dong-nai", name: "Trà Vinh" },
  { id: "dak-lak", name: "Tiền Giang" },
  { id: "lam-dong", name: "Vĩnh Long" },
];

export const DISTRICTS = [
  { id: "dong-xoai", name: "Mỏ Cày Nam" },
  { id: "bu-dang", name: "Châu Thành" },
  { id: "di-linh", name: "Càng Long" },
  { id: "da-lat", name: "Cái Bè" },
];

export const ENTERPRISES = [
  {
    id: "ent-1",
    name: "Công ty Dừa Xanh Mekong",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "ent-2",
    name: "Hợp tác xã Dừa Hữu cơ",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "farmer-1",
    name: "Nông hộ Trồng dừa Nguyễn Văn A",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
];

export const LAND_TYPES = [
  { id: "red-soil", name: "Đất phù sa ven sông" },
  { id: "alluvial", name: "Đất phù sa ngọt" },
  { id: "grey-soil", name: "Đất cát pha phù sa" },
];

export const TERRAIN_TYPES = [
  { id: "flat", name: "Bằng phẳng" },
  { id: "hill", name: "Gò thấp" },
  { id: "slope", name: "Ven kênh rạch" },
];

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SubArea {
  id: string;
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
  coordinates: Coordinate[];
  subAreas: SubArea[];
  createdAt: string;
  cropVarieties?: RegionCrop[];
  ward?: string;
}

export const MOCK_REGIONS: Region[] = [
  {
    id: 1,
    code: "REG-001",
    name: "Vùng Dừa Bến Tre Alpha",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Ấp Phước Hòa, Xã Định Thủy",
    enterpriseId: "1",
    area: 50.5,
    landType: "DAT002",
    terrain: "DH001",
    note: "Vùng trồng thử nghiệm dừa xiêm xanh, áp dụng hệ thống tưới nhỏ giọt và quản lý dinh dưỡng hữu cơ.",
    status: "active",
    createdAt: "2024-01-15",
    ward: "Xã Định Thủy",
    coordinates: [
      { lat: 11.559, lng: 107.133 },
      { lat: 11.562, lng: 107.135 },
      { lat: 11.559, lng: 107.138 },
      { lat: 11.555, lng: 107.135 },
    ],
    cropVarieties: [
      {
        id: "cv-001",
        name: "Dừa",
        variety: "Dừa xiêm xanh",
        status: "flowering",
        plantedDate: "2020-05-15",
        seedType: "Cây giống nuôi cấy mô",
      },
      {
        id: "cv-002",
        name: "Dừa",
        variety: "Dừa dứa",
        status: "harvesting",
        plantedDate: "2019-11-20",
        seedType: "Cây giống tuyển chọn",
      },
    ],
    subAreas: [
      {
        id: "sub-1-1",
        code: "AREA-001",
        name: "Khu A - Dừa xiêm xanh",
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
            name: "Lô A1 - Dừa xiêm xanh",
            area: 8.5,
            altitude: 150,
            contour: "100m",
            coordinates: [
              { lat: 11.559, lng: 107.133 },
              { lat: 11.56, lng: 107.134 },
              { lat: 11.558, lng: 107.135 },
              { lat: 11.557, lng: 107.134 },
            ],
          },
          {
            id: "plot-1-2",
            code: "PLOT-1-2",
            name: "Lô A2 - Dừa dứa",
            area: 11.5,
            altitude: 145,
            contour: "90m",
            coordinates: [
              { lat: 11.56, lng: 107.134 },
              { lat: 11.561, lng: 107.136 },
              { lat: 11.559, lng: 107.137 },
              { lat: 11.558, lng: 107.135 },
            ],
          },
        ],
        coordinates: [
          { lat: 11.559, lng: 107.133 },
          { lat: 11.561, lng: 107.136 },
          { lat: 11.558, lng: 107.136 },
          { lat: 11.556, lng: 107.134 },
        ],
      },
      {
        id: "sub-1-2",
        code: "AREA-002",
        name: "Khu B - Dừa dứa",
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
            name: "Lô B1 - Dừa dứa",
            area: 15.5,
            altitude: 155,
            contour: "110m",
            coordinates: [
              { lat: 11.558, lng: 107.136 },
              { lat: 11.56, lng: 107.138 },
              { lat: 11.555, lng: 107.138 },
              { lat: 11.556, lng: 107.137 },
            ],
          },
        ],
        coordinates: [
          { lat: 11.558, lng: 107.136 },
          { lat: 11.56, lng: 107.138 },
          { lat: 11.555, lng: 107.138 },
          { lat: 11.556, lng: 107.137 },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "REG-002",
    name: "Nông trại Dừa Hữu cơ Trà Vinh",
    provinceId: "dong-nai",
    districtId: "thong-nhat",
    address: "Xã Hòa Lợi, Huyện Châu Thành",
    enterpriseId: "2",
    area: 120.0,
    landType: "DAT001",
    terrain: "DH001",
    note: "Chuyên canh dừa hữu cơ đạt chuẩn GlobalGAP, phục vụ chế biến nước dừa và cơm dừa.",
    status: "active",
    createdAt: "2024-02-10",
    ward: "Xã Hòa Lợi",
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
        name: "Vườn dừa hữu cơ ven kênh",
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
            name: "Lô C1 - Dừa hữu cơ",
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
    name: "Vùng Dừa Công nghiệp Tiền Giang",
    provinceId: "dak-lak",
    districtId: "bu-dang",
    address: "Ven sông Tiền, Huyện Châu Thành",
    enterpriseId: "1",
    area: 200.5,
    landType: "DAT002",
    terrain: "DH003",
    note: "Dừa công nghiệp phục vụ chế biến dầu dừa, nước cốt dừa và sản phẩm xuất khẩu.",
    status: "inactive",
    createdAt: "2023-11-05",
    ward: "N/A",
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
    name: "Vườn Dừa Tư Sang",
    provinceId: "binh-phuoc",
    districtId: "dong-xoai",
    address: "Ấp 2, Xã An Thạnh",
    enterpriseId: "5",
    area: 15.0,
    landType: "DAT006",
    terrain: "DH002",
    note: "Mô hình vườn dừa kết hợp du lịch sinh thái và trải nghiệm thu hoạch dừa.",
    status: "active",
    createdAt: "2024-01-20T08:00:00Z",
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
    name: "Khu Phức hợp Dừa Công nghệ cao",
    provinceId: "dong-nai",
    districtId: "long-thanh",
    address: "Khu nông nghiệp công nghệ cao ven sông",
    enterpriseId: "1",
    area: 500.0,
    landType: "DAT001",
    terrain: "DH001",
    note: "Dự án trọng điểm về giống dừa chất lượng cao, chế biến sâu và truy xuất nguồn gốc.",
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
  {
    id: 10,
    code: "REG-DL-10",
    name: "Vùng Dừa Hữu cơ Càng Long",
    provinceId: "lam-dong",
    districtId: "di-linh",
    address: "Huyện Càng Long, Trà Vinh",
    enterpriseId: "1",
    area: 120.0,
    landType: "DAT002",
    terrain: "DH003",
    note: "Vùng đất phù sa, hệ thống kênh rạch thuận lợi cho chuyên canh dừa hữu cơ.",
    status: "active",
    createdAt: "2024-02-15T08:00:00Z",
    coordinates: [
      { lat: 11.53, lng: 108.04 },
      { lat: 11.53, lng: 108.05 },
      { lat: 11.52, lng: 108.05 },
      { lat: 11.52, lng: 108.04 },
    ],
    subAreas: [],
  },
  {
    id: 11,
    code: "REG-CD-11",
    name: "Vùng Dừa Xiêm Cái Bè",
    provinceId: "lam-dong",
    districtId: "da-lat",
    address: "Xã Hòa Khánh, Huyện Cái Bè",
    enterpriseId: "1",
    area: 85.5,
    landType: "DAT002",
    terrain: "DH003",
    note: "Vùng chuyên canh dừa xiêm nước ngọt, phục vụ thị trường trái tươi và nước dừa đóng chai.",
    status: "active",
    createdAt: "2024-02-20T08:00:00Z",
    coordinates: [
      { lat: 11.85, lng: 108.54 },
      { lat: 11.85, lng: 108.55 },
      { lat: 11.84, lng: 108.55 },
      { lat: 11.84, lng: 108.54 },
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
  contour: string;
  altitude: number;
}

export const MOCK_PLOTS: Plot[] = [
  {
    id: "plot-1-1",
    code: "PLOT-1-1",
    name: "Lô A1 - Dừa xiêm xanh",
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
    code: "PLOT-1-2",
    name: "Lô A2 - Dừa dứa",
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
    code: "PLOT-2-1",
    name: "Lô B1 - Dừa ta",
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
    name: "Khu vực A - Dừa xiêm",
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
        code: "PLOT-1-1",
        name: "Lô A1 - Dừa xiêm xanh",
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
        code: "PLOT-1-2",
        name: "Lô A2 - Dừa dứa",
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
        code: "PLOT-1-3",
        name: "Lô A3 - Dừa sáp",
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
    name: "Khu vực B - Dừa ta",
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
        code: "PLOT-2-1",
        name: "Lô B1 - Dừa ta",
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
        code: "PLOT-2-2",
        name: "Lô B2 - Dừa sáp",
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
  name: string;
  type?: string;
  status?: "healthy" | "warning" | "critical" | "removed";
  height?: string;
  age?: string;
  ageValue?: string;
  ageUnit?: "days" | "months" | "years";
  canopy?: string;
  rootSpread?: string;
  plantedDate: string;
  coordinate: Coordinate;
  plotId: string;
  cultivationRegionId?: string;
  enterpriseId?: string;
  regionName?: string;
  areaName?: string;
  note?: string;
}

export const MOCK_PLANTS: Plant[] = [
  {
    id: "1",
    code: "PL-001",
    name: "Dừa xiêm xanh",
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
    regionName: "Vùng Dừa Bến Tre Alpha",
    areaName: "Khu vực A - Dừa xiêm",
    note: "Cây phát triển tốt, tàu lá xanh đều, đã bón phân hữu cơ định kỳ.",
  },
  {
    id: "2",
    code: "PL-002",
    name: "Dừa dứa",
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
    regionName: "Vùng Dừa Bến Tre Alpha",
    areaName: "Khu vực A - Dừa xiêm",
  },
  {
    id: "3",
    code: "PL-003",
    name: "Dừa ta",
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
    regionName: "Vùng Dừa Bến Tre Alpha",
    areaName: "Khu vực B - Dừa ta",
    note: "Một số tàu lá hơi vàng, cần kiểm tra độ mặn và hệ thống tưới.",
  },
];
