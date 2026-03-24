export const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng canh tác Sầu riêng Ri6 - Bình Phước",
    crop: "Sầu riêng",
    variety: "Ri6",
    zones: [
      {
        id: "zone-1-1",
        name: "Khu vực A1",
        plots: [
          {
            id: "plot-1-1-1",
            name: "Lô A1-01",
            area: 1.5,
            status: "ready",
            soilType: "Đất đỏ Bazan",
            slope: "3-5%",
          },
          {
            id: "plot-1-1-2",
            name: "Lô A1-02",
            area: 2.0,
            status: "active",
            soilType: "Đất thịt nhẹ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng canh tác Sầu riêng Monthong - Bình Phước",
    crop: "Sầu riêng",
    variety: "Monthong",
    zones: [
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Lô A2-01",
            area: 1.2,
            status: "resting",
            soilType: "Đất đỏ Bazan",
            slope: "5-8%",
          },
          {
            id: "plot-1-2-2",
            name: "Lô A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Đất đỏ Bazan",
            slope: "3-5%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng canh tác Xoài Cát Hòa Lộc - Đồng Nai",
    crop: "Xoài",
    variety: "Xoài Cát Hòa Lộc",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Lô B1-01",
            area: 2.5,
            status: "active",
            soilType: "Đất xám",
            slope: "<3%",
          },
          {
            id: "plot-2-1-2",
            name: "Lô B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Đất phù sa cổ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
];

export const MATERIAL_TYPES = [
  { value: "Phân bón", label: "Phân bón" },
  { value: "Thuốc BVTV", label: "Thuốc BVTV" },
  { value: "Giống", label: "Giống cây trồng" },
  { value: "Nông cụ", label: "Nông cụ & Thiết bị" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Phân bón": [
    { value: "NPK 20-20-15", label: "NPK 20-20-15", unit: "kg" },
    { value: "Uure", label: "Phân Ure (Đạm)", unit: "kg" },
    { value: "Kali Clorua", label: "Kali Clorua (Kali đỏ)", unit: "kg" },
    { value: "Lân Super", label: "Lân Super (Lân Long Thành)", unit: "kg" },
    { value: "DAP", label: "Phân DAP 18-46-0", unit: "kg" },
    { value: "Hữu cơ vi sinh", label: "Phân hữu cơ vi sinh", unit: "kg" },
    { value: "Phân chuồng", label: "Phân chuồng hoai mục", unit: "tấn" },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Canxi Bo", label: "Phân bón lá Canxi Bo", unit: "chai" },
    { value: "MKP", label: "MKP (0-52-34)", unit: "kg" },
  ],
  "Thuốc BVTV": [
    { value: "Abamectin", label: "Abamectin (Trừ sâu/nhện)", unit: "chai" },
    { value: "Mancozeb", label: "Mancozeb (Trừ nấm)", unit: "kg" },
    { value: "Glyphosate", label: "Glyphosate (Trừ cỏ)", unit: "lít" },
    { value: "Imidacloprid", label: "Imidacloprid (Rầy rệp)", unit: "gói" },
    {
      value: "Azoxystrobin",
      label: "Azoxystrobin (Lem lép hạt)",
      unit: "chai",
    },
    { value: "Chlorpyrifos", label: "Chlorpyrifos Ethyl", unit: "chai" },
    { value: "Hexaconazole", label: "Hexaconazole (Anvil)", unit: "lít" },
    { value: "Metalaxyl", label: "Metalaxyl (Trừ nấm đất)", unit: "gói" },
    { value: "Emamectin", label: "Emamectin Benzoate", unit: "chai" },
    { value: "Trichoderma", label: "Nấm Trichoderma", unit: "kg" },
  ],
  Giống: [
    { value: "Sầu riêng Ri6", label: "Giống Sầu riêng Ri6", unit: "cây" },
    {
      value: "Sầu riêng Monthong",
      label: "Giống Sầu riêng Monthong",
      unit: "cây",
    },
    { value: "Xoài Cát Hòa Lộc", label: "Giống Xoài Cát Hòa Lộc", unit: "cây" },
    { value: "Xoài Đài Loan", label: "Giống Xoài Đài Loan", unit: "cây" },
    { value: "Bưởi Da Xanh", label: "Giống Bưởi Da Xanh", unit: "cây" },
    { value: "Cam Sành", label: "Giống Cam Sành", unit: "cây" },
    { value: "Mít Thái", label: "Giống Mít Thái", unit: "cây" },
    { value: "Vú Sữa", label: "Giống Vú Sữa Lò Rèn", unit: "cây" },
    { value: "Chanh Không Hạt", label: "Giống Chanh Không Hạt", unit: "cây" },
    { value: "Na Thái", label: "Giống Na Thái", unit: "cây" },
  ],
  "Nông cụ": [
    { value: "Cuốc", label: "Cuốc làm đất", unit: "cái" },
    { value: "Xẻng", label: "Xẻng xúc đất", unit: "cái" },
    { value: "Kéo cắt cành", label: "Kéo cắt cành chuyên dụng", unit: "cái" },
    { value: "Cưa cầm tay", label: "Cưa cành cầm tay", unit: "cái" },
    { value: "Bình xịt điện", label: "Bình xịt thuốc chạy điện", unit: "cái" },
    { value: "Máy cắt cỏ", label: "Máy cắt cỏ cầm tay", unit: "cái" },
    { value: "Ủng bảo hộ", label: "Ủng cao su bảo hộ", unit: "đôi" },
    { value: "Găng tay", label: "Găng tay làm vườn", unit: "đôi" },
    { value: "Thang nhôm", label: "Thang nhôm rút", unit: "cái" },
    { value: "Xe rùa", label: "Xe rùa đẩy tay", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Bao bì", label: "Bao bì đóng gói", unit: "kg" },
    { value: "Dây buộc", label: "Dây nilon buộc cành", unit: "cuộn" },
    { value: "Túi bao trái", label: "Túi vải bao trái", unit: "cái" },
    { value: "Màng phủ", label: "Màng phủ nông nghiệp", unit: "cuộn" },
    { value: "Cọc tre", label: "Cọc tre chống cây", unit: "cây" },
    { value: "Lưới che nắng", label: "Lưới lan che nắng", unit: "m2" },
    { value: "Khay ươm", label: "Khay nhựa ươm hạt", unit: "cái" },
    { value: "Chậu nhựa", label: "Chậu nhựa trồng cây", unit: "cái" },
    { value: "Xơ dừa", label: "Giá thể xơ dừa", unit: "bao" },
    { value: "Tro trấu", label: "Tro trấu hun", unit: "bao" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Phân bón": ["kg", "tấn", "bao", "lít", "can", "chai"],
  "Thuốc BVTV": ["lít", "ml", "chai", "gói", "can", "phi"],
  Giống: ["cây", "hạt", "kg", "hom"],
  "Nông cụ": ["cái", "bộ", "hộp", "đôi"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "thùng", "bao"],
};

export const TASK_OPTIONS = [
  { value: "Cày xới đất", label: "Cày xới đất" },
  { value: "Bón lót", label: "Bón lót" },
  { value: "Gieo hạt/Trồng cây", label: "Gieo hạt/Trồng cây" },
  { value: "Tưới nước", label: "Tưới nước" },
  { value: "Bón thúc lần 1", label: "Bón thúc lần 1" },
  { value: "Bón thúc lần 2", label: "Bón thúc lần 2" },
  { value: "Bón thúc lần 3", label: "Bón thúc lần 3" },
  { value: "Phun thuốc phòng bệnh", label: "Phun thuốc phòng bệnh" },
  { value: "Phun thuốc trừ sâu", label: "Phun thuốc trừ sâu" },
  { value: "Tỉa cành/tạo tán", label: "Tỉa cành/tạo tán" },
  { value: "Làm cỏ", label: "Làm cỏ" },
  { value: "Tủ gốc giữ ẩm", label: "Tủ gốc giữ ẩm" },
  { value: "Bao trái", label: "Bao trái" },
  { value: "Thu hoạch đợt 1", label: "Thu hoạch đợt 1" },
  { value: "Thu hoạch đợt 2", label: "Thu hoạch đợt 2" },
  { value: "Vệ sinh đồng ruộng", label: "Vệ sinh đồng ruộng" },
  { value: "Kiểm tra sâu bệnh", label: "Kiểm tra sâu bệnh" },
  { value: "Bảo dưỡng hệ thống tưới", label: "Bảo dưỡng hệ thống tưới" },
];

export const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
