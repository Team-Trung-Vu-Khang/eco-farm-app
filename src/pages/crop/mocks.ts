import type { Crop } from "./types";
import { initialEditorValue } from "../docs/mocks";

export const CROP_HIERARCHY: Record<string, Record<string, string[]>> = {
  "Cây ăn quả": {
    "Sầu riêng": [
      "Ri6",
      "Monthong (Thái)",
      "Musang King",
      "Chuồng Bò",
      "Black Thorn (Gai đen)",
      "Dona",
      "Sáu Hữu",
      "Khổ qua xanh",
      "Cái Mơn",
    ],
  },
};

export const categories = Object.keys(CROP_HIERARCHY);

export { initialEditorValue };

export const initialData: Crop[] = [
  {
    id: 1,
    code: "TREE001",
    illustration:
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/sauriengri6/sauriengri62.jpg.webp",
    name: "Sầu riêng Ri6",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Đông Nam Á (Malaysia, Indonesia)",
      tempRange: "24 - 30°C",
      humidityRange: "75 - 85%",
      phRange: "5.5 - 6.5",
      plantingDensity: "Khoảng cách 8m x 8m (150-160 cây/ha)",
      watering: "Trung bình 200 lít/cây/ngày (giai đoạn quả lớn)",
    },
    seedInfo: {
      supplier: "Trung tâm Giống cây trồng Miền Tây",
      importDate: "20/12/2023",
      importLink: "https://example.com/imports/SR001",
      contractId: "HD-2023-SR-001",
      documents: [
        { name: "Chứng nhận nguồn gốc.pdf", url: "#" },
        { name: "Hướng dẫn kỹ thuật.pdf", url: "#" },
      ],
    },
    statusInfo: {
      area: "Khu vực A",
      location: "Phân khu 1",
      lote: "Lô 05",
      owner: "Đặng Văn Hùng - Nông hộ",
      plantDate: "15/01/2024",
      age: "0 năm - 2 tháng",
      status: "Tốt, sinh trưởng ổn định",
      responsiblePerson: {
        executor: "Lê Văn An",
        manager: "Trần Thế Bằng",
        inspector: "Nguyễn Văn Cường",
      },
    },
    farmingHistory: [
      {
        id: "fh1",
        time: "10/03/2024",
        action: "Bón phân đợt 1",
        executor: "Lê Văn An",
        manager: "Trần Thế Bằng",
        inspector: "Nguyễn Văn Cường",
      },
      {
        id: "fh2",
        time: "01/03/2024",
        action: "Tưới nước định kỳ",
        executor: "Phạm Văn Bình",
        manager: "Trần Thế Bằng",
        inspector: "Nguyễn Văn Cường",
      },
    ],
    diseaseHistory: [
      {
        id: "dh1",
        startTime: "15/02/2024",
        diseaseName: "Rầy phấn trắng",
        note: "Phát hiện ở mặt sau lá",
        treatmentTime: "17/02/2024",
        treatmentProcess: [
          {
            milestone: "Phát hiện",
            date: "15/02/2024",
            description: "Số lượng rầy ít, rải rác",
          },
          {
            milestone: "Xử lý thuốc",
            date: "17/02/2024",
            description: "Phun thuốc BVTV hữu cơ",
          },
          {
            milestone: "Kiểm tra lại",
            date: "20/02/2024",
            description: "Đã hết rầy hoàn toàn",
          },
        ],
        materialsUsed: [
          { name: "Thuốc trừ rầy hữu cơ", quantity: "500", unit: "ml" },
          { name: "Máy phun sương", quantity: "1", unit: "máy" },
        ],
      },
    ],
    harvestHistory: [
      {
        id: "hh1",
        time: "15/03/2023",
        yield: "1.2 tấn",
        harvester: "Đội thu hoạch số 1",
      },
    ],
    iotData: {
      current: [
        { label: "Nhiệt độ", value: "28.5", unit: "°C", trend: "stable" },
        { label: "Độ ẩm không khí", value: "75", unit: "%", trend: "up" },
        { label: "Độ ẩm đất", value: "60", unit: "%", trend: "stable" },
        { label: "Ánh sáng", value: "12000", unit: "lux", trend: "down" },
      ],
      history3Days: [
        { label: "Nhiệt độ TB", value: "27.8", unit: "°C" },
        { label: "Độ ẩm không khí TB", value: "72", unit: "%" },
      ],
      history1Week: [
        { label: "Nhiệt độ TB", value: "27.5", unit: "°C" },
        { label: "Độ ẩm không khí TB", value: "70", unit: "%" },
      ],
      history1Month: [
        { label: "Nhiệt độ TB", value: "28.2", unit: "°C" },
        { label: "Độ ẩm không khí TB", value: "68", unit: "%" },
      ],
    },
  },
  {
    id: 2,
    code: "TREE002",
    illustration:
      "https://nongsantaynguyen.net/wp-content/uploads/2017/04/sau-rieng-dona-sau-rieng-thai-lan.jpg",
    name: "Sầu riêng Dona",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus (Monthong)",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Thái Lan",
      tempRange: "24 - 32°C",
      humidityRange: "70 - 80%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 9m (120-130 cây/ha)",
      watering: "Yêu cầu thoát nước tốt, tưới nuôi trái 250L/cây/ngày",
    },
  },
  {
    id: 3,
    code: "TREE003",
    illustration:
      "https://cdn.tgdd.vn/2021/05/CookProductThumb/thumb2-620x620-11.jpg",
    name: "Sầu riêng Ri6",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus (Ri6)",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Vĩnh Long (Việt Nam)",
      tempRange: "24 - 30°C",
      humidityRange: "75 - 80%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 8m (156 cây/ha)",
      watering: "Tưới đều đặn, giữ ẩm nhưng không ngập úng",
    },
  },
  {
    id: 4,
    code: "TREE004",
    illustration:
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20nuoc%20ngoai/sauriengmonthong/monthong2.png.webp",
    name: "Sầu riêng Monthong (Thái)",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus (Monthong)",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Thái Lan",
      tempRange: "24 - 32°C",
      humidityRange: "70 - 80%",
      phRange: "5.0 - 6.5",
      plantingDensity: "8m x 8m hoặc 9m x 9m",
      watering: "Cần nhiều nước giai đoạn nuôi quả",
    },
  },
  {
    id: 5,
    code: "TREE005",
    illustration:
      "https://sauriengoi.vn/wp-content/uploads/2023/08/SAU-RIENG-MUSANG-KING-1-1.jpg",
    name: "Sầu riêng Musang King",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus (D197)",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Malaysia",
      tempRange: "22 - 30°C",
      humidityRange: "75 - 85%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 8m hoặc 8m x 9m",
      watering: "Yêu cầu thoát nước tốt, tưới nhẹ thường xuyên",
    },
  },
  {
    id: 6,
    code: "TREE006",
    illustration:
      "https://cdn.tgdd.vn/2021/05/CookProductThumb/SRVuong-620x620.jpg",
    name: "Sầu riêng Chuồng Bò",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus (Chuồng Bò)",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Việt Nam (Cai Lậy, Tiền Giang)",
      tempRange: "25 - 30°C",
      humidityRange: "70 - 85%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 8m",
      watering: "Tưới giữ ẩm, tránh khô hạn kéo dài",
    },
  },
  {
    id: 7,
    code: "CROP007",
    illustration:
      "https://cdn.tgdd.vn/Files/2021/08/17/1375787/dau-nanh-la-gi-cong-dung-va-cac-loai-dau-nanh-pho-bien-202108171018318625.jpg",
    name: "Đậu nành miền Nam",
    cropType: "Đậu nành",
    cropGroup: "Hạt ngũ cốc",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Glycine max",
      family: "Họ Đậu (Fabaceae)",
      origin: "Đông Á",
      tempRange: "20 - 30°C",
      humidityRange: "60 - 70%",
      phRange: "6.0 - 7.0",
      plantingDensity: "40cm x 10cm",
      watering: "Tưới đều giai đoạn ra hoa kết trái",
    },
  },
  {
    id: 8,
    code: "CROP008",
    illustration: "https://giongcamau.vn/uploads/shops/2017_03/om5451-copy.jpg",
    name: "Lúa mùa OM5451",
    cropType: "Lúa",
    cropGroup: "Cây lương thực",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Oryza sativa",
      family: "Họ Hòa thảo (Poaceae)",
      origin: "Đông Nam Á",
      tempRange: "25 - 35°C",
      humidityRange: "80 - 90%",
      phRange: "5.5 - 6.5",
      plantingDensity: "20cm x 15cm",
      watering: "Luôn giữ mức nước ngập chân",
    },
  },
];

export const cropTypeOptions = Object.values(CROP_HIERARCHY).flatMap((group) =>
  Object.keys(group).map((type) => ({ label: type, value: type })),
);

export const growthCycleOptions = [
  { label: "Ngắn ngày", value: "Ngắn ngày" },
  { label: "Dài ngày", value: "Dài ngày" },
  { label: "Lâu năm", value: "Lâu năm" },
];

export const harvestMethodOptions = [
  { label: "Thu hoạch thủ công (Hái tay)", value: "manual" },
  { label: "Thu hoạch bằng máy", value: "machine" },
  { label: "Hái lượm", value: "gathering" },
];

export const stageOptions = [
  { label: "Gieo hạt", value: "Gieo hạt" },
  { label: "Nảy mầm", value: "Nảy mầm" },
  { label: "Cây con", value: "Cây con" },
  { label: "Ra lá", value: "Ra lá" },
  { label: "Phân cành", value: "Phân cành" },
  { label: "Sinh trưởng mạnh", value: "Sinh trưởng mạnh" },
  { label: "Ra hoa", value: "Ra hoa" },
  { label: "Nở hoa", value: "Nở hoa" },
  { label: "Thụ phấn", value: "Thụ phấn" },
  { label: "Đậu quả", value: "Đậu quả" },
  { label: "Kết trái", value: "Kết trái" },
  { label: "Phát triển quả", value: "Phát triển quả" },
  { label: "Chín", value: "Chín" },
  { label: "Thu hoạch", value: "Thu hoạch" },
  { label: "Ngủ đông", value: "Ngủ đông" },
  { label: "Hồi phục", value: "Hồi phục" },
];

export interface ExtendedSeed {
  id: string;
  illustration: string;
  varietyName: string;
  varietyCode: string;
  supplier: string;
  origin: string;
  germinationRate: string;
  yield: string;
}

export const seedData: ExtendedSeed[] = [
  {
    id: "s1",
    illustration:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/344/228/products/sau-rieng-ri-6.jpg?v=1550116668383",
    varietyName: "Cây giống Sầu riêng Ri6",
    varietyCode: "SR-RI6-001",
    supplier: "Trung tâm Giống cây trồng Miền Tây",
    origin: "Việt Nam",
    germinationRate: "98%",
    yield: "15-20 tấn/ha",
  },
  {
    id: "s2",
    illustration:
      "https://th.bing.com/th/id/OIP.aJ74Pq-741tD1s3X8kRgdgHaE8?rs=1&pid=ImgDetMain",
    varietyName: "Cây giống Sầu riêng Monthong",
    varietyCode: "SR-MON-002",
    supplier: "Công ty Mekong Seed",
    origin: "Thái Lan",
    germinationRate: "95%",
    yield: "18-25 tấn/ha",
  },
  {
    id: "s3",
    illustration:
      "https://sauriengoi.vn/wp-content/uploads/2023/08/SAU-RIENG-MUSANG-KING-1-1.jpg",
    varietyName: "Cây giống Sầu riêng Musang King",
    varietyCode: "SR-MK-003",
    supplier: "Công ty Giống cây trồng Hoàn Cầu",
    origin: "Malaysia",
    germinationRate: "90%",
    yield: "10-12 tấn/ha",
  },
  {
    id: "s4",
    illustration:
      "https://vinadurian.com/wp-content/uploads/2023/11/sau-rieng-black-thorn-05-i.jpg",
    varietyName: "Cây giống Sầu riêng Black Thorn",
    varietyCode: "SR-BT-004",
    supplier: "Green Farm Agritech",
    origin: "Malaysia",
    germinationRate: "88%",
    yield: "8-10 tấn/ha",
  },
  {
    id: "s5",
    illustration:
      "https://cdn.tgdd.vn/2021/05/CookProductThumb/SRVuong-620x620.jpg",
    varietyName: "Cây giống Sầu riêng Chuồng Bò",
    varietyCode: "SR-CB-005",
    supplier: "Vườn ươm Cai Lậy",
    origin: "Việt Nam",
    germinationRate: "92%",
    yield: "12-15 tấn/ha",
  },
  {
    id: "s6",
    illustration:
      "https://nongsantaynguyen.net/wp-content/uploads/2017/04/sau-rieng-dona-sau-rieng-thai-lan.jpg",
    varietyName: "Cây giống Sầu riêng Dona",
    varietyCode: "SR-DONA-006",
    supplier: "Công ty Dona Techno",
    origin: "Việt Nam",
    germinationRate: "96%",
    yield: "15-18 tấn/ha",
  },
];
