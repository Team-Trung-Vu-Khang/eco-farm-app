export const ANIMAL_LOCATIONS = [
  {
    id: "farm-1",
    name: "Trại heo thịt Duroc - Bình Phước",
    crop: "Heo thịt",
    variety: "Duroc",
    zones: [
      {
        id: "barn-1-1",
        name: "Khu chuồng A1",
        plots: [
          {
            id: "pen-1-1-1",
            name: "Ô chuồng A1-01",
            area: 120,
            status: "ready",
            soilType: "Chuồng kín",
            slope: "Thông thoáng",
          },
          {
            id: "pen-1-1-2",
            name: "Ô chuồng A1-02",
            area: 140,
            status: "active",
            soilType: "Chuồng kín",
            slope: "Thông thoáng",
          },
        ],
      },
    ],
  },
  {
    id: "farm-2",
    name: "Trại gà đẻ Hy-Line - Đồng Nai",
    crop: "Gà đẻ",
    variety: "Hy-Line Brown",
    zones: [
      {
        id: "barn-2-1",
        name: "Khu chuồng B1",
        plots: [
          {
            id: "pen-2-1-1",
            name: "Ô chuồng B1-01",
            area: 80,
            status: "resting",
            soilType: "Chuồng lồng",
            slope: "Nhiệt độ ổn định",
          },
          {
            id: "pen-2-1-2",
            name: "Ô chuồng B1-02",
            area: 90,
            status: "ready",
            soilType: "Chuồng lồng",
            slope: "Nhiệt độ ổn định",
          },
        ],
      },
    ],
  },
  {
    id: "farm-3",
    name: "Trang trại bò thịt BBB - Long An",
    crop: "Bò thịt",
    variety: "Brahman",
    zones: [
      {
        id: "barn-3-1",
        name: "Khu chuồng C1",
        plots: [
          {
            id: "pen-3-1-1",
            name: "Ô chuồng C1-01",
            area: 200,
            status: "active",
            soilType: "Chuồng hở",
            slope: "Khô thoáng",
          },
          {
            id: "pen-3-1-2",
            name: "Ô chuồng C1-02",
            area: 220,
            status: "ready",
            soilType: "Chuồng hở",
            slope: "Khô thoáng",
          },
        ],
      },
    ],
  },
];

export const ANIMAL_MATERIAL_TYPES = [
  { value: "Thức ăn chăn nuôi", label: "Thức ăn chăn nuôi" },
  { value: "Thuốc thú y", label: "Thuốc thú y" },
  { value: "Con giống", label: "Con giống vật nuôi" },
  { value: "Dụng cụ chăn nuôi", label: "Dụng cụ chăn nuôi" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const ANIMAL_MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Thức ăn chăn nuôi": [
    { value: "Cám heo tăng trọng", label: "Cám heo tăng trọng", unit: "kg" },
    { value: "Cám gà đẻ", label: "Cám gà đẻ", unit: "kg" },
    { value: "Cám bò vỗ béo", label: "Cám bò vỗ béo", unit: "kg" },
    { value: "Cỏ ủ chua", label: "Cỏ ủ chua", unit: "kg" },
    { value: "Premix vitamin", label: "Premix vitamin", unit: "kg" },
    { value: "Muối khoáng", label: "Muối khoáng", unit: "kg" },
    { value: "Bột bắp", label: "Bột bắp", unit: "kg" },
    { value: "Khô đậu nành", label: "Khô đậu nành", unit: "kg" },
  ],
  "Thuốc thú y": [
    { value: "Vaccine tụ huyết trùng", label: "Vaccine tụ huyết trùng", unit: "liều" },
    { value: "Vaccine tai xanh", label: "Vaccine tai xanh", unit: "liều" },
    { value: "Vaccine Newcastle", label: "Vaccine Newcastle", unit: "liều" },
    { value: "Men tiêu hóa", label: "Men tiêu hóa", unit: "gói" },
    { value: "Điện giải", label: "Điện giải", unit: "gói" },
    { value: "Sát trùng chuồng trại", label: "Dung dịch sát trùng chuồng trại", unit: "lít" },
    { value: "Thuốc ký sinh", label: "Thuốc ký sinh", unit: "chai" },
    { value: "Kháng sinh", label: "Kháng sinh thú y", unit: "chai" },
  ],
  "Con giống": [
    { value: "Heo Duroc", label: "Heo giống Duroc", unit: "con" },
    { value: "Heo Landrace", label: "Heo giống Landrace", unit: "con" },
    { value: "Heo Yorkshire", label: "Heo giống Yorkshire", unit: "con" },
    { value: "Gà Hy-Line", label: "Gà giống Hy-Line", unit: "con" },
    { value: "Gà Lương Phượng", label: "Gà giống Lương Phượng", unit: "con" },
    { value: "Bò Brahman", label: "Bò giống Brahman", unit: "con" },
    { value: "Bò Droughtmaster", label: "Bò giống Droughtmaster", unit: "con" },
  ],
  "Dụng cụ chăn nuôi": [
    { value: "Máng ăn", label: "Máng ăn", unit: "cái" },
    { value: "Máng uống", label: "Máng uống tự động", unit: "cái" },
    { value: "Quạt thông gió", label: "Quạt thông gió", unit: "cái" },
    { value: "Đèn sưởi", label: "Đèn sưởi chuồng úm", unit: "cái" },
    { value: "Cân đàn", label: "Cân đàn điện tử", unit: "cái" },
    { value: "Bình phun sát trùng", label: "Bình phun sát trùng", unit: "cái" },
    { value: "Khay trứng", label: "Khay trứng", unit: "cái" },
    { value: "Lưới chắn côn trùng", label: "Lưới chắn côn trùng", unit: "m2" },
  ],
  "Vật tư khác": [
    { value: "Trấu", label: "Trấu lót nền", unit: "bao" },
    { value: "Mùn cưa", label: "Mùn cưa lót nền", unit: "bao" },
    { value: "Xịt khử mùi", label: "Chế phẩm khử mùi", unit: "chai" },
    { value: "Bao đựng thức ăn", label: "Bao đựng thức ăn", unit: "cái" },
    { value: "Găng tay", label: "Găng tay bảo hộ", unit: "đôi" },
    { value: "Ủng bảo hộ", label: "Ủng bảo hộ", unit: "đôi" },
    { value: "Dây buộc", label: "Dây buộc chuồng", unit: "cuộn" },
  ],
};

export const ANIMAL_MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn chăn nuôi": ["kg", "bao", "tấn"],
  "Thuốc thú y": ["lít", "ml", "chai", "liều", "gói"],
  "Con giống": ["con", "lứa"],
  "Dụng cụ chăn nuôi": ["cái", "bộ", "hộp"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "bao", "đôi"],
};

export const ANIMAL_TASK_OPTIONS = [
  { value: "Nhập đàn", label: "Nhập đàn" },
  { value: "Cách ly kiểm dịch", label: "Cách ly kiểm dịch" },
  { value: "Vệ sinh chuồng trại", label: "Vệ sinh chuồng trại" },
  { value: "Khử trùng định kỳ", label: "Khử trùng định kỳ" },
  { value: "Bổ sung thức ăn", label: "Bổ sung thức ăn" },
  { value: "Theo dõi tăng trọng", label: "Theo dõi tăng trọng" },
  { value: "Tiêm phòng", label: "Tiêm phòng" },
  { value: "Phối giống", label: "Phối giống" },
  { value: "Thu gom trứng", label: "Thu gom trứng" },
  { value: "Cân đàn", label: "Cân đàn" },
  { value: "Kiểm tra sức khỏe", label: "Kiểm tra sức khỏe" },
  { value: "Xử lý chất thải", label: "Xử lý chất thải" },
  { value: "Điều chỉnh nhiệt độ chuồng", label: "Điều chỉnh nhiệt độ chuồng" },
  { value: "Xuất chuồng / Xuất bán", label: "Xuất chuồng / Xuất bán" },
];

export const ANIMAL_LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
