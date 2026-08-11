export const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng nuôi trồng thủy sản Tôm thẻ Vannamei - Bình Phước",
    crop: "Tôm thẻ",
    variety: "Vannamei",
    zones: [
      {
        id: "zone-1-1",
        name: "Khu vực A1",
        plots: [
          {
            id: "plot-1-1-1",
            name: "Ô ao A1-01",
            area: 1.5,
            status: "ready",
            soilType: "Ao lót bạt có hệ thống quạt nước",
            slope: "Sục khí chủ động",
          },
          {
            id: "plot-1-1-2",
            name: "Ô ao A1-02",
            area: 2.0,
            status: "active",
            soilType: "Ao đất cải tạo",
            slope: "Quạt nước và siphon đáy",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng nuôi trồng thủy sản Tôm sú - Cà Mau",
    crop: "Tôm sú",
    variety: "Tôm sú",
    zones: [
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Ao quảng canh A2-01",
            area: 1.2,
            status: "resting",
            soilType: "Ao quảng canh cải tiến",
            slope: "Đang nghỉ vụ",
          },
          {
            id: "plot-1-2-2",
            name: "Ao quảng canh A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Ao nuôi tôm sú thương phẩm",
            slope: "Sẵn sàng thả giống",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng nuôi trồng thủy sản Cá tra - An Giang",
    crop: "Cá tra",
    variety: "Cá tra thương phẩm",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Ao cá tra B1-01",
            area: 2.5,
            status: "active",
            soilType: "Ao cá tra thâm canh",
            slope: "Cấp thoát nước chủ động",
          },
          {
            id: "plot-2-1-2",
            name: "Ao cá tra B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Ao ương cá giống",
            slope: "Sẵn sàng chuyển cỡ",
          },
        ],
      },
    ],
  },
];

export const MATERIAL_TYPES = [
  { value: "Thức ăn thủy sản", label: "Thức ăn thủy sản" },
  { value: "Chế phẩm thủy sản", label: "Chế phẩm thủy sản" },
  { value: "Giống", label: "Giống đối tượng nuôi" },
  { value: "Nông cụ", label: "Thiết bị ao nuôi" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Thức ăn thủy sản": [
    { value: "shrimp-feed", label: "Thức ăn tôm thẻ giai đoạn tăng trọng", unit: "bao" },
    { value: "pangasius-feed", label: "Thức ăn cá tra dạng viên", unit: "bao" },
    { value: "tilapia-feed", label: "Thức ăn cá rô phi thương phẩm", unit: "bao" },
    { value: "protein-booster", label: "Thức ăn bổ sung đạm", unit: "kg" },
    { value: "fermented-soy", label: "Đậu nành lên men", unit: "kg" },
    { value: "mineral-premix", label: "Premix khoáng - vitamin thủy sản", unit: "kg" },
    { value: "aqua-calcium", label: "Khoáng canxi thủy sản", unit: "kg" },
    { value: "green-feed", label: "Thức ăn xanh bổ sung", unit: "kg" },
    { value: "molasses-probiotic", label: "Rỉ mật ủ vi sinh", unit: "lít" },
    { value: "digestive-probiotic", label: "Men vi sinh đường ruột", unit: "gói" },
  ],
  "Chế phẩm thủy sản": [
    { value: "water-probiotic", label: "Chế phẩm vi sinh xử lý nước", unit: "kg" },
    { value: "mineral-pond", label: "Chế phẩm khoáng tạt ao", unit: "kg" },
    { value: "ph-stabilizer", label: "Chế phẩm ổn định pH", unit: "kg" },
    { value: "pond-disinfectant", label: "Thuốc sát trùng ao nuôi", unit: "lít" },
    { value: "stress-reducer", label: "Vitamin C giảm stress", unit: "gói" },
    {
      value: "aqua-treatment",
      label: "Thuốc thủy sản theo phác đồ kỹ thuật",
      unit: "chai",
    },
    { value: "ems-prevention", label: "Chế phẩm phòng bệnh gan tụy", unit: "gói" },
    { value: "parasite-control", label: "Chế phẩm xử lý ký sinh trùng", unit: "chai" },
    { value: "aqua-probiotic", label: "Men vi sinh đường ruột", unit: "gói" },
    { value: "water-mineral", label: "Khoáng tạt ổn định môi trường", unit: "bao" },
  ],
  Giống: [
    { value: "Tôm thẻ Vannamei", label: "Giống Tôm thẻ Vannamei", unit: "con" },
    {
      value: "Tôm sú",
      label: "Giống Tôm sú",
      unit: "con",
    },
    { value: "Cá tra giống", label: "Giống Cá tra", unit: "con" },
    { value: "Cá tra thương phẩm", label: "Cá tra thương phẩm", unit: "con" },
    { value: "Cá rô phi Rô phi đỏ", label: "Giống Cá rô phi Rô phi đỏ", unit: "con" },
    { value: "Cá chép", label: "Giống Cá chép", unit: "con" },
    { value: "Cá lóc", label: "Giống Cá lóc", unit: "con" },
    { value: "Cá diêu hồng", label: "Giống Cá diêu hồng", unit: "con" },
    { value: "Cua biển", label: "Giống Cua biển", unit: "con" },
    { value: "Ếch Thái", label: "Giống Ếch Thái", unit: "con" },
  ],
  "Nông cụ": [
    { value: "auto-feeder", label: "Máy cho ăn tự động", unit: "cái" },
    { value: "aerator", label: "Máy sục khí ao ương", unit: "cái" },
    { value: "biomass-scale", label: "Cân điện tử kiểm tra sinh khối", unit: "cái" },
    { value: "water-test-kit", label: "Bộ test nhanh môi trường nước", unit: "bộ" },
    { value: "pond-sprayer", label: "Máy phun xử lý ao", unit: "cái" },
    { value: "paddle-wheel", label: "Quạt nước ao nuôi", unit: "cái" },
    { value: "nursery-net", label: "Vèo ương giống", unit: "bộ" },
    { value: "seine-net", label: "Lưới kéo thu hoạch", unit: "bộ" },
    { value: "Ủng bảo hộ", label: "Ủng cao su bảo hộ", unit: "đôi" },
    { value: "feeding-boat", label: "Thuyền cho ăn", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "pond-liner", label: "Bạt lót ao", unit: "m2" },
    { value: "water-coloring", label: "Chất gây màu nước", unit: "bao" },
    { value: "dolomite", label: "Vôi Dolomite xử lý ao", unit: "kg" },
    { value: "feed-bag", label: "Bao chứa thức ăn dự phòng", unit: "cái" },
    { value: "batch-tag", label: "Thẻ đánh dấu lô giống", unit: "cái" },
    { value: "pond-logbook", label: "Sổ theo dõi vụ nuôi", unit: "quyển" },
    { value: "pond-net", label: "Lưới chắn ao nuôi", unit: "m2" },
    { value: "oxygen-tank", label: "Thùng oxy vận chuyển giống", unit: "cái" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn thủy sản": ["kg", "tấn", "bao", "lít", "can", "chai"],
  "Chế phẩm thủy sản": ["lít", "ml", "chai", "gói", "can", "phi", "liều"],
  Giống: ["con", "lứa", "lô"],
  "Nông cụ": ["cái", "bộ", "hộp", "đôi"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "thùng", "bao"],
};

export const TASK_OPTIONS = [
  { value: "Vệ sinh sát trùng ao", label: "Vệ sinh sát trùng ao" },
  { value: "Chuẩn bị ao nuôi", label: "Chuẩn bị ao nuôi" },
  { value: "Thả giống", label: "Thả giống" },
  { value: "Kiểm tra cỡ giống", label: "Kiểm tra cỡ giống" },
  { value: "Cho ăn theo khẩu phần", label: "Cho ăn theo khẩu phần" },
  { value: "Quản lý oxy hòa tan", label: "Quản lý oxy hòa tan" },
  { value: "Tạt chế phẩm định kỳ", label: "Tạt chế phẩm định kỳ" },
  { value: "Kiểm tra sức khỏe thủy sản", label: "Kiểm tra sức khỏe thủy sản" },
  { value: "Phân cỡ", label: "Phân cỡ" },
  { value: "Thay nước định kỳ", label: "Thay nước định kỳ" },
  { value: "Kiểm tra sàng ăn", label: "Kiểm tra sàng ăn" },
  { value: "Kiểm tra sàng ăn và quạt nước", label: "Kiểm tra sàng ăn và quạt nước" },
  { value: "Xử lý bùn đáy", label: "Xử lý bùn đáy" },
  { value: "Thu hoạch đợt 1", label: "Thu hoạch đợt 1" },
  { value: "Thu hoạch đợt 2", label: "Thu hoạch đợt 2" },
  { value: "Vệ sinh sau thu hoạch", label: "Vệ sinh sau thu hoạch" },
  { value: "Ghi nhận tỷ lệ sống", label: "Ghi nhận tỷ lệ sống" },
  { value: "Bảo dưỡng hệ thống ao", label: "Bảo dưỡng hệ thống ao" },
];

export const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
