export const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng chăn nuôi Heo thịt Yorkshire - Bình Phước",
    crop: "Heo thịt",
    variety: "Yorkshire",
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
            soilType: "Chuồng trại đỏ Bazan",
            slope: "3-5%",
          },
          {
            id: "plot-1-1-2",
            name: "Lô A1-02",
            area: 2.0,
            status: "active",
            soilType: "Chuồng trại thịt nhẹ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng chăn nuôi Heo thịt Duroc - Bình Phước",
    crop: "Heo thịt",
    variety: "Duroc",
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
            soilType: "Chuồng trại đỏ Bazan",
            slope: "5-8%",
          },
          {
            id: "plot-1-2-2",
            name: "Lô A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Chuồng trại đỏ Bazan",
            slope: "3-5%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng chăn nuôi Gà đẻ Lương Phượng - Đồng Nai",
    crop: "Gà đẻ",
    variety: "Gà đẻ Lương Phượng",
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
            soilType: "Chuồng trại xám",
            slope: "<3%",
          },
          {
            id: "plot-2-1-2",
            name: "Lô B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Chuồng trại phù sa cổ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
];

export const MATERIAL_TYPES = [
  { value: "Thức ăn", label: "Thức ăn" },
  { value: "Thuốc thú y", label: "Thuốc thú y" },
  { value: "Giống", label: "Giống vật nuôi" },
  { value: "Nông cụ", label: "Nông cụ & Thiết bị" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Thức ăn": [
    { value: "NPK 20-20-15", label: "NPK 20-20-15", unit: "kg" },
    { value: "Uure", label: "Phân Ure (Đạm)", unit: "kg" },
    { value: "Kali Clorua", label: "Kali Clorua (Kali đỏ)", unit: "kg" },
    { value: "Lân Super", label: "Lân Super (Lân Long Thành)", unit: "kg" },
    { value: "DAP", label: "Phân DAP 18-46-0", unit: "kg" },
    { value: "Hữu cơ vi sinh", label: "Phân hữu cơ vi sinh", unit: "kg" },
    { value: "Phân chuồng", label: "Phân chuồng hoai mục", unit: "tấn" },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Canxi Bo", label: "Thức ăn lá Canxi Bo", unit: "chai" },
    { value: "MKP", label: "MKP (0-52-34)", unit: "kg" },
  ],
  "Thuốc thú y": [
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
    { value: "Metalaxyl", label: "Metalaxyl (Trừ nấm chuồng trại)", unit: "gói" },
    { value: "Emamectin", label: "Emamectin Benzoate", unit: "chai" },
    { value: "Trichoderma", label: "Nấm Trichoderma", unit: "kg" },
  ],
  Giống: [
    { value: "Heo thịt Yorkshire", label: "Giống Heo thịt Yorkshire", unit: "con" },
    {
      value: "Heo thịt Duroc",
      label: "Giống Heo thịt Duroc",
      unit: "con",
    },
    { value: "Gà đẻ Lương Phượng", label: "Giống Gà đẻ Lương Phượng", unit: "con" },
    { value: "Gà đẻ Đài Loan", label: "Giống Gà đẻ Đài Loan", unit: "con" },
    { value: "Bò thịt Brahman", label: "Giống Bò thịt Brahman", unit: "con" },
    { value: "Cam Sành", label: "Giống Cam Sành", unit: "con" },
    { value: "Mít Thái", label: "Giống Mít Thái", unit: "con" },
    { value: "Vú Sữa", label: "Giống Vú Sữa Lò Rèn", unit: "con" },
    { value: "Chanh Không Hạt", label: "Giống Chanh Không Hạt", unit: "con" },
    { value: "Na Thái", label: "Giống Na Thái", unit: "con" },
  ],
  "Nông cụ": [
    { value: "Cuốc", label: "Cuốc làm chuồng trại", unit: "cái" },
    { value: "Xẻng", label: "Xẻng xúc chuồng trại", unit: "cái" },
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
    { value: "Cọc tre", label: "Cọc tre chống cây", unit: "con" },
    { value: "Lưới che nắng", label: "Lưới lan che nắng", unit: "m2" },
    { value: "Khay ươm", label: "Khay nhựa ươm hạt", unit: "cái" },
    { value: "Chậu nhựa", label: "Chậu nhựa trồng cây", unit: "cái" },
    { value: "Xơ dừa", label: "Giá thể xơ dừa", unit: "bao" },
    { value: "Tro trấu", label: "Tro trấu hun", unit: "bao" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn": ["kg", "tấn", "bao", "lít", "can", "chai"],
  "Thuốc thú y": ["lít", "ml", "chai", "gói", "can", "phi"],
  Giống: ["cây", "hạt", "kg", "hom"],
  "Nông cụ": ["cái", "bộ", "hộp", "đôi"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "thùng", "bao"],
};

export const TASK_OPTIONS = [
  { value: "Cày xới chuồng trại", label: "Cày xới chuồng trại" },
  { value: "Bón lót", label: "Bón lót" },
  { value: "Nhập đàn", label: "Nhập đàn" },
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
  { value: "Xuất bán đợt 1", label: "Xuất bán đợt 1" },
  { value: "Xuất bán đợt 2", label: "Xuất bán đợt 2" },
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
