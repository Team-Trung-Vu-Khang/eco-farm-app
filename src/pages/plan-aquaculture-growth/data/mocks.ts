export const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng nuôi tôm thẻ chân trắng - Bạc Liêu",
    crop: "Tôm thẻ chân trắng",
    variety: "Tôm thẻ chân trắng",
    zones: [
      {
        id: "zone-1-1",
        name: "Khu vực A1",
        plots: [
          {
            id: "plot-1-1-1",
            name: "Ao A1-01",
            area: 1.5,
            status: "ready",
            soilType: "Đáy ao lót bạt HDPE",
            slope: "3-5%",
          },
          {
            id: "plot-1-1-2",
            name: "Ao A1-02",
            area: 2.0,
            status: "active",
            soilType: "Đáy ao đất tự nhiên",
            slope: "<3%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng nuôi cá tra - Đồng Tháp",
    crop: "Cá tra",
    variety: "Cá tra giống",
    zones: [
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Ao A2-01",
            area: 1.2,
            status: "resting",
            soilType: "Đáy ao đất tự nhiên",
            slope: "5-8%",
          },
          {
            id: "plot-1-2-2",
            name: "Ao A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Đáy ao đất tự nhiên",
            slope: "3-5%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng nuôi tôm sú - Cà Mau",
    crop: "Tôm sú",
    variety: "Tôm sú giống",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Ao B1-01",
            area: 2.5,
            status: "active",
            soilType: "Đáy ao lót bạt HDPE",
            slope: "<3%",
          },
          {
            id: "plot-2-1-2",
            name: "Ao B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Đáy ao đất tự nhiên",
            slope: "<3%",
          },
        ],
      },
    ],
  },
];

export const MATERIAL_TYPES = [
  { value: "Thức ăn", label: "Thức ăn thủy sản" },
  { value: "Thuốc & Hóa chất", label: "Thuốc & Hóa chất" },
  { value: "Giống", label: "Con giống thủy sản" },
  { value: "Thiết bị", label: "Thiết bị & Máy móc" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

export const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Thức ăn": [
    { value: "Thức ăn công nghiệp 40% đạm", label: "Thức ăn công nghiệp 40% đạm", unit: "bao" },
    { value: "Thức ăn công nghiệp 35% đạm", label: "Thức ăn công nghiệp 35% đạm", unit: "bao" },
    { value: "Thức ăn tươi sống", label: "Thức ăn tươi sống (cá tạp)", unit: "kg" },
    { value: "Premix vitamin", label: "Premix vitamin & khoáng", unit: "kg" },
    { value: "Men vi sinh đường ruột", label: "Men vi sinh đường ruột", unit: "kg" },
  ],
  "Thuốc & Hóa chất": [
    { value: "Vôi CaCO3", label: "Vôi CaCO3 (ổn định pH)", unit: "bao" },
    { value: "Chlorine", label: "Chlorine khử trùng nước", unit: "kg" },
    { value: "Men vi sinh xử lý nước", label: "Men vi sinh xử lý nước", unit: "kg" },
    { value: "Oxy già", label: "Oxy già công nghiệp", unit: "lít" },
    { value: "Kháng sinh Doxycycline", label: "Kháng sinh Doxycycline", unit: "kg" },
    { value: "Formol", label: "Formol sát trùng", unit: "lít" },
    { value: "BKC", label: "BKC diệt khuẩn", unit: "lít" },
    { value: "Khoáng đa vi lượng", label: "Khoáng đa vi lượng", unit: "kg" },
  ],
  Giống: [
    { value: "Tôm thẻ chân trắng giống", label: "Tôm thẻ chân trắng giống", unit: "con" },
    { value: "Tôm sú giống", label: "Tôm sú giống", unit: "con" },
    { value: "Cá tra giống", label: "Cá tra giống", unit: "con" },
    { value: "Cá basa giống", label: "Cá basa giống", unit: "con" },
    { value: "Cá rô phi giống", label: "Cá rô phi giống", unit: "con" },
    { value: "Cua giống", label: "Cua giống", unit: "con" },
    { value: "Ốc hương giống", label: "Ốc hương giống", unit: "con" },
  ],
  "Thiết bị": [
    { value: "Máy sục khí", label: "Máy sục khí (quạt nước)", unit: "cái" },
    { value: "Máy bơm nước", label: "Máy bơm nước", unit: "cái" },
    { value: "Máy đo pH", label: "Máy đo pH cầm tay", unit: "cái" },
    { value: "Máy đo oxy hòa tan", label: "Máy đo oxy hòa tan (DO)", unit: "cái" },
    { value: "Lưới kéo tôm", label: "Lưới kéo tôm/cá", unit: "cái" },
    { value: "Bạt lót ao HDPE", label: "Bạt lót ao HDPE", unit: "m2" },
    { value: "Nhá cho ăn", label: "Nhá kiểm tra thức ăn", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Bao bì", label: "Bao bì đóng gói", unit: "kg" },
    { value: "Dây buộc", label: "Dây buộc lưới", unit: "cuộn" },
    { value: "Ống nhựa PVC", label: "Ống nhựa PVC dẫn nước", unit: "m" },
    { value: "Lưới chắn cua còng", label: "Lưới chắn cua còng", unit: "m" },
    { value: "Đá vôi rải đáy ao", label: "Đá vôi rải đáy ao", unit: "bao" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Thức ăn": ["kg", "bao", "tấn"],
  "Thuốc & Hóa chất": ["kg", "lít", "chai", "gói", "bao"],
  Giống: ["con", "kg"],
  "Thiết bị": ["cái", "bộ", "m2", "m"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2", "thùng", "bao"],
};

export const TASK_OPTIONS = [
  { value: "Cải tạo ao", label: "Cải tạo ao" },
  { value: "Xử lý nước cấp", label: "Xử lý nước cấp" },
  { value: "Thả giống", label: "Thả giống" },
  { value: "Cho ăn sáng", label: "Cho ăn sáng" },
  { value: "Cho ăn chiều", label: "Cho ăn chiều" },
  { value: "Kiểm tra chỉ số môi trường nước", label: "Kiểm tra chỉ số môi trường nước" },
  { value: "Bổ sung men vi sinh", label: "Bổ sung men vi sinh" },
  { value: "Tạt vôi ổn định pH", label: "Tạt vôi ổn định pH" },
  { value: "Kiểm tra sức khỏe vật nuôi", label: "Kiểm tra sức khỏe vật nuôi" },
  { value: "Phòng bệnh", label: "Phòng bệnh" },
  { value: "Trị bệnh", label: "Trị bệnh" },
  { value: "Thay nước ao", label: "Thay nước ao" },
  { value: "Vệ sinh hệ thống sục khí", label: "Vệ sinh hệ thống sục khí" },
  { value: "Xuất bán đợt 1", label: "Xuất bán đợt 1" },
  { value: "Xuất bán đợt 2", label: "Xuất bán đợt 2" },
  { value: "Vệ sinh ao nuôi", label: "Vệ sinh ao nuôi" },
  { value: "Kiểm tra dịch bệnh", label: "Kiểm tra dịch bệnh" },
  { value: "Bảo dưỡng hệ thống sục khí/bơm", label: "Bảo dưỡng hệ thống sục khí/bơm" },
];

export const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];
