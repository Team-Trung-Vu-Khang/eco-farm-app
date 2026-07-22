export const AQUACULTURE_LOCATIONS = [
  {
    id: "pond-1",
    name: "Khu ao nuôi tôm thẻ - Bạc Liêu",
    crop: "Tôm thẻ",
    variety: "Litopenaeus vannamei",
    zones: [
      {
        id: "pond-zone-1-1",
        name: "Ao số 1",
        plots: [
          {
            id: "pond-1-1-1",
            name: "Ô nuôi A1",
            area: 1200,
            status: "ready",
            soilType: "Ao lót bạt",
            slope: "Mực nước ổn định",
          },
          {
            id: "pond-1-1-2",
            name: "Ô nuôi A2",
            area: 1500,
            status: "active",
            soilType: "Ao lót bạt",
            slope: "Mực nước ổn định",
          },
        ],
      },
    ],
  },
  {
    id: "pond-2",
    name: "Khu ao nuôi cá tra - An Giang",
    crop: "Cá tra",
    variety: "Pangasius hypophthalmus",
    zones: [
      {
        id: "pond-zone-2-1",
        name: "Ao số 2",
        plots: [
          {
            id: "pond-2-1-1",
            name: "Ô nuôi B1",
            area: 1800,
            status: "resting",
            soilType: "Ao đất",
            slope: "Hệ thống sục khí",
          },
          {
            id: "pond-2-1-2",
            name: "Ô nuôi B2",
            area: 2000,
            status: "ready",
            soilType: "Ao đất",
            slope: "Hệ thống sục khí",
          },
        ],
      },
    ],
  },
  {
    id: "pond-3",
    name: "Khu bè nuôi cá rô phi - Đồng Tháp",
    crop: "Cá rô phi",
    variety: "Oreochromis niloticus",
    zones: [
      {
        id: "pond-zone-3-1",
        name: "Bè nuôi C1",
        plots: [
          {
            id: "pond-3-1-1",
            name: "Ô nuôi C1",
            area: 900,
            status: "active",
            soilType: "Bè lưới",
            slope: "Dòng chảy nhẹ",
          },
          {
            id: "pond-3-1-2",
            name: "Ô nuôi C2",
            area: 950,
            status: "ready",
            soilType: "Bè lưới",
            slope: "Dòng chảy nhẹ",
          },
        ],
      },
    ],
  },
];

export const AQUACULTURE_MATERIAL_TYPES = [
  { value: "Thức ăn thủy sản", label: "Thức ăn thủy sản" },
  { value: "Thuốc thú y thủy sản", label: "Thuốc thú y thủy sản" },
  { value: "Con giống", label: "Con giống thủy sản" },
  { value: "Dụng cụ", label: "Dụng cụ nuôi trồng" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const AQUACULTURE_MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Thức ăn thủy sản": [
    { value: "Cám nổi 32%", label: "Cám nổi 32%", unit: "kg" },
    { value: "Cám nổi 35%", label: "Cám nổi 35%", unit: "kg" },
    { value: "Cám chìm 28%", label: "Cám chìm 28%", unit: "kg" },
    { value: "Bổ sung vitamin C", label: "Vitamin C", unit: "kg" },
    { value: "Men tiêu hóa", label: "Men tiêu hóa", unit: "gói" },
    { value: "Khoáng premix", label: "Khoáng premix", unit: "kg" },
  ],
  "Thuốc thú y thủy sản": [
    { value: "BKC", label: "BKC khử trùng ao", unit: "lít" },
    { value: "Iodine", label: "Iodine sát khuẩn", unit: "lít" },
    { value: "Vôi CaO", label: "Vôi CaO xử lý ao", unit: "kg" },
    { value: "Chlorine", label: "Chlorine diệt khuẩn", unit: "kg" },
    { value: "Vitamin tổng hợp", label: "Vitamin tổng hợp", unit: "kg" },
    { value: "Sổ ký sinh", label: "Thuốc sổ ký sinh", unit: "chai" },
  ],
  "Con giống": [
    { value: "Tôm post 12", label: "Tôm post 12", unit: "vạn con" },
    { value: "Tôm post 15", label: "Tôm post 15", unit: "vạn con" },
    { value: "Cá tra giống", label: "Cá tra giống", unit: "nghìn con" },
    { value: "Cá rô phi giống", label: "Cá rô phi giống", unit: "nghìn con" },
  ],
  "Dụng cụ": [
    { value: "Máy sục khí", label: "Máy sục khí", unit: "cái" },
    { value: "Quạt nước", label: "Quạt nước", unit: "cái" },
    { value: "Lưới vớt", label: "Lưới vớt", unit: "cái" },
    { value: "Máy đo pH", label: "Máy đo pH", unit: "cái" },
    { value: "Máy đo oxy", label: "Máy đo oxy", unit: "cái" },
    { value: "Vợt thu hoạch", label: "Vợt thu hoạch", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Muối khoáng", label: "Muối khoáng", unit: "bao" },
    { value: "Chế phẩm sinh học", label: "Chế phẩm sinh học", unit: "chai" },
    { value: "Túi đựng mẫu nước", label: "Túi đựng mẫu nước", unit: "cái" },
    { value: "Bạt che ao", label: "Bạt che ao", unit: "cuộn" },
    { value: "Dây rút", label: "Dây rút", unit: "bó" },
  ],
};

export const AQUACULTURE_MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn thủy sản": ["kg", "bao", "tấn"],
  "Thuốc thú y thủy sản": ["lít", "ml", "chai", "kg", "gói"],
  "Con giống": ["vạn con", "nghìn con", "con"],
  "Dụng cụ": ["cái", "bộ", "hộp"],
  "Vật tư khác": ["kg", "cái", "cuộn", "bó", "bao", "chai"],
};

export const AQUACULTURE_TASK_OPTIONS = [
  { value: "Cải tạo ao", label: "Cải tạo ao" },
  { value: "Cấp nước", label: "Cấp nước" },
  { value: "Gây màu nước", label: "Gây màu nước" },
  { value: "Thả giống", label: "Thả giống" },
  { value: "Cho ăn", label: "Cho ăn" },
  { value: "Theo dõi pH", label: "Theo dõi pH" },
  { value: "Theo dõi oxy", label: "Theo dõi oxy" },
  { value: "Chăm sóc tăng trưởng", label: "Chăm sóc tăng trưởng" },
  { value: "Thay nước", label: "Thay nước" },
  { value: "Bổ sung khoáng", label: "Bổ sung khoáng" },
  { value: "Siphon đáy", label: "Siphon đáy" },
  { value: "Phòng bệnh", label: "Phòng bệnh" },
  { value: "Thu hoạch", label: "Thu hoạch" },
  { value: "Vệ sinh ao", label: "Vệ sinh ao" },
];

export const AQUACULTURE_LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
