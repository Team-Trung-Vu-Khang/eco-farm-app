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
            name: "Ô chuồng A1-01",
            area: 1.5,
            status: "ready",
            soilType: "Chuồng kín có đệm lót sinh học",
            slope: "Thông gió chủ động",
          },
          {
            id: "plot-1-1-2",
            name: "Ô chuồng A1-02",
            area: 2.0,
            status: "active",
            soilType: "Chuồng bán kín",
            slope: "Quạt hút và làm mát",
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
            name: "Ô chuồng A2-01",
            area: 1.2,
            status: "resting",
            soilType: "Chuồng cách ly sau vệ sinh",
            slope: "Đang nghỉ đàn",
          },
          {
            id: "plot-1-2-2",
            name: "Ô chuồng A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Chuồng nuôi tăng trọng",
            slope: "Sẵn sàng nhập đàn",
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
            name: "Dãy chuồng B1-01",
            area: 2.5,
            status: "active",
            soilType: "Chuồng gà đẻ nhiều tầng",
            slope: "Thu trứng bán tự động",
          },
          {
            id: "plot-2-1-2",
            name: "Dãy chuồng B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Chuồng hậu bị",
            slope: "Sẵn sàng chuyển đàn",
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
    { value: "Cam heo thit", label: "Cám heo thịt tăng trọng", unit: "bao" },
    { value: "Cam ga de", label: "Cám gà đẻ cao sản", unit: "bao" },
    { value: "Thuc an bo vo beo", label: "Thức ăn bò vỗ béo", unit: "bao" },
    { value: "Bot ngo", label: "Bột ngô phối trộn", unit: "kg" },
    { value: "Ba dau nanh", label: "Bã đậu nành", unit: "kg" },
    { value: "Premix khoang", label: "Premix khoáng - vitamin", unit: "kg" },
    { value: "Bot da canxi", label: "Bột đá canxi cho gà đẻ", unit: "kg" },
    { value: "Co u chua", label: "Cỏ ủ chua", unit: "tấn" },
    { value: "Ri mat", label: "Rỉ mật bổ sung năng lượng", unit: "lít" },
    { value: "Men tieu hoa", label: "Men tiêu hóa trộn thức ăn", unit: "gói" },
  ],
  "Thuốc thú y": [
    { value: "Vaccine dich ta heo", label: "Vaccine dịch tả heo", unit: "liều" },
    { value: "Vaccine tu huyet trung", label: "Vaccine tụ huyết trùng", unit: "liều" },
    { value: "Vaccine Newcastle", label: "Vaccine Newcastle", unit: "liều" },
    { value: "Thuoc sat trung", label: "Thuốc sát trùng chuồng trại", unit: "lít" },
    { value: "Dien giai", label: "Điện giải - vitamin tổng hợp", unit: "gói" },
    {
      value: "Khang sinh phac do",
      label: "Kháng sinh theo phác đồ thú y",
      unit: "chai",
    },
    { value: "Thuoc cau trung", label: "Thuốc phòng cầu trùng", unit: "gói" },
    { value: "Thuoc tay ky sinh", label: "Thuốc tẩy ký sinh trùng", unit: "chai" },
    { value: "Men vi sinh", label: "Men vi sinh đường ruột", unit: "gói" },
    { value: "Thuoc ha sot", label: "Thuốc hạ sốt thú y", unit: "chai" },
  ],
  Giống: [
    { value: "Heo thịt Yorkshire", label: "Giống Heo thịt Yorkshire", unit: "con" },
    {
      value: "Heo thịt Duroc",
      label: "Giống Heo thịt Duroc",
      unit: "con",
    },
    { value: "Gà đẻ Lương Phượng", label: "Giống Gà đẻ Lương Phượng", unit: "con" },
    { value: "Gà đẻ Hy-Line", label: "Giống Gà đẻ Hy-Line", unit: "con" },
    { value: "Bò thịt Brahman", label: "Giống Bò thịt Brahman", unit: "con" },
    { value: "Bò thịt Angus", label: "Giống Bò thịt Angus", unit: "con" },
    { value: "Dê Boer", label: "Giống Dê Boer", unit: "con" },
    { value: "Vịt Grimaud", label: "Giống Vịt Grimaud", unit: "con" },
    { value: "Cút đẻ", label: "Giống Cút đẻ", unit: "con" },
    { value: "Thỏ New Zealand", label: "Giống Thỏ New Zealand", unit: "con" },
  ],
  "Nông cụ": [
    { value: "Mang an", label: "Máng ăn tự động", unit: "cái" },
    { value: "Mang uong", label: "Máng uống núm tự động", unit: "cái" },
    { value: "Den suoi", label: "Đèn sưởi úm con giống", unit: "cái" },
    { value: "Can dien tu", label: "Cân điện tử theo dõi tăng trọng", unit: "cái" },
    { value: "Binh sat trung", label: "Bình phun sát trùng", unit: "cái" },
    { value: "May phun khu trung", label: "Máy phun khử trùng chuồng", unit: "cái" },
    { value: "Quat thong gio", label: "Quạt thông gió chuồng trại", unit: "cái" },
    { value: "Long um", label: "Lồng úm con giống", unit: "bộ" },
    { value: "Ủng bảo hộ", label: "Ủng cao su bảo hộ", unit: "đôi" },
    { value: "Xe day thuc an", label: "Xe đẩy thức ăn", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Dem lot sinh hoc", label: "Đệm lót sinh học", unit: "bao" },
    { value: "Chat don chuong", label: "Chất độn chuồng", unit: "bao" },
    { value: "Voi sat trung", label: "Vôi sát trùng nền chuồng", unit: "kg" },
    { value: "Bao thuc an", label: "Bao chứa thức ăn dự phòng", unit: "cái" },
    { value: "The tai", label: "Thẻ tai định danh vật nuôi", unit: "cái" },
    { value: "So theo doi dan", label: "Sổ theo dõi đàn", unit: "quyển" },
    { value: "Luoi chan con trung", label: "Lưới chắn côn trùng", unit: "m2" },
    { value: "Thung van chuyen", label: "Thùng vận chuyển con giống", unit: "cái" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn": ["kg", "tấn", "bao", "lít", "can", "chai"],
  "Thuốc thú y": ["lít", "ml", "chai", "gói", "can", "phi", "liều"],
  Giống: ["con", "đàn", "lô"],
  "Nông cụ": ["cái", "bộ", "hộp", "đôi"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "thùng", "bao"],
};

export const TASK_OPTIONS = [
  { value: "Vệ sinh sát trùng chuồng", label: "Vệ sinh sát trùng chuồng" },
  { value: "Chuẩn bị ô chuồng", label: "Chuẩn bị ô chuồng" },
  { value: "Nhập đàn", label: "Nhập đàn" },
  { value: "Cân đầu kỳ", label: "Cân đầu kỳ" },
  { value: "Cho ăn theo khẩu phần", label: "Cho ăn theo khẩu phần" },
  { value: "Bổ sung nước uống", label: "Bổ sung nước uống" },
  { value: "Tiêm phòng định kỳ", label: "Tiêm phòng định kỳ" },
  { value: "Kiểm tra sức khỏe đàn", label: "Kiểm tra sức khỏe đàn" },
  { value: "Phân đàn", label: "Phân đàn" },
  { value: "Thay đệm lót", label: "Thay đệm lót" },
  { value: "Thu gom trứng", label: "Thu gom trứng" },
  { value: "Kiểm tra máng ăn uống", label: "Kiểm tra máng ăn uống" },
  { value: "Xử lý chất thải", label: "Xử lý chất thải" },
  { value: "Xuất bán đợt 1", label: "Xuất bán đợt 1" },
  { value: "Xuất bán đợt 2", label: "Xuất bán đợt 2" },
  { value: "Vệ sinh sau xuất bán", label: "Vệ sinh sau xuất bán" },
  { value: "Ghi nhận hao hụt", label: "Ghi nhận hao hụt" },
  { value: "Bảo dưỡng hệ thống chuồng", label: "Bảo dưỡng hệ thống chuồng" },
];

export const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
