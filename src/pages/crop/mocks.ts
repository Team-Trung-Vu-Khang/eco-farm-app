import type { Crop } from "./types";
import { initialEditorValue } from "../docs/mocks";

export const CROP_HIERARCHY: Record<string, Record<string, string[]>> = {
  "Cây ăn trái (Fruit Trees)": {
    "Sầu riêng": ["Ri6", "Dona", "Musang King", "Chuồng Bò", "Sáu Hữu"],
    "Mắc ca": ["OC", "246", "344", "842", "849"],
    Bơ: ["Bơ 034", "Bơ Booth", "Bơ Hass"],
  },
  "Cây lương thực (Cereal & Grain)": {
    Lúa: ["OM5451", "ST24", "ST25", "Đài Thơm 8", "Nàng Hoa 9"],
    "Ngô (Bắp)": ["NK7328", "CP511", "LVN10", "Bioseed 9698"],
    "Khoai mì (Sắn)": ["KM94", "KM140", "HL-S11", "KM98-5"],
    "Đậu nành": ["DT84", "DT26", "ĐN29", "VNS206"],
  },
  "Cây công nghiệp (Industrial Crops)": {
    "Cà phê": ["Robusta (Vối)", "Arabica (Chè)", "TR4", "TR9"],
    "Cao su": ["RRIV 106", "RRIV 124", "PB 260", "GT 1"],
    "Chè (Trà)": ["PH1", "LDP1", "Kim Tuyên", "Bát Tiên", "Shan Tuyết"],
    "Hồ tiêu": ["Vĩnh Linh", "Lộc Ninh", "Tiêu Sẻ", "Ấn Độ"],
  },
};

export const categories = Object.keys(CROP_HIERARCHY);

export { initialEditorValue };

export const initialData: Crop[] = [
  {
    id: 1,
    code: "SR-RI6-001",
    illustration:
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/sauriengri6/sauriengri62.jpg.webp",
    name: "Sầu riêng",
    cropType: "Sầu riêng",
    cropGroup: "Cây ăn trái (Fruit Trees)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Durio zibethinus",
      family: "Họ Cẩm quỳ (Malvaceae)",
      origin: "Vĩnh Long (Việt Nam)",
      tempRange: "24 - 30°C",
      humidityRange: "75 - 85%",
      phRange: "5.5 - 6.5",
      plantingDensity: "8m x 8m (150-160 cây/ha)",
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
        ],
        materialsUsed: [
          { name: "Thuốc trừ rầy hữu cơ", quantity: "500", unit: "ml" },
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
      history3Days: [{ label: "Nhiệt độ TB", value: "27.8", unit: "°C" }],
      history1Week: [{ label: "Nhiệt độ TB", value: "27.5", unit: "°C" }],
      history1Month: [{ label: "Nhiệt độ TB", value: "28.2", unit: "°C" }],
    },
  },
  {
    id: 2,
    code: "LUA-OM-002",
    illustration:
      "https://agridrone.vn/wp-content/uploads/2021/04/giong-lua-OM-18-loc-troi-01.jpg",
    name: "Lúa",
    cropType: "Lúa",
    cropGroup: "Cây lương thực (Cereal & Grain)",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Oryza sativa",
      family: "Họ Hòa thảo (Poaceae)",
      origin: "Đồng bằng sông Cửu Long",
      tempRange: "25 - 35°C",
      humidityRange: "80 - 90%",
      phRange: "5.5 - 6.5",
      plantingDensity: "20cm x 15cm",
      watering: "Giữ mức nước ngập chân 3-5cm",
    },
  },
  {
    id: 3,
    code: "MC-OC-003",
    illustration:
      "https://gap.org.vn/wp-content/uploads/2024/08/caymacca_gap3.jpg",
    name: "Mắc ca",
    cropType: "Mắc ca",
    cropGroup: "Cây ăn trái (Fruit Trees)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Macadamia integrifolia",
      family: "Họ Quắn hoa (Proteaceae)",
      origin: "Úc (Thử nghiệm tại Tây Nguyên)",
      tempRange: "20 - 25°C",
      humidityRange: "60 - 70%",
      phRange: "5.0 - 6.5",
      plantingDensity: "6m x 4m (416 cây/ha)",
      watering: "Tưới bổ sung vào mùa khô",
    },
  },
  {
    id: 4,
    code: "KM-94-004",
    illustration:
      "https://storage.googleapis.com/onelife-public/blog.onelife.vn/2023/10/3be26adf-1.png",
    name: "Khoai mì",
    cropType: "Khoai mì (Sắn)",
    cropGroup: "Cây lương thực (Cereal & Grain)",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Manihot esculenta",
      family: "Họ Thầu dầu (Euphorbiaceae)",
      origin: "Thái Lan",
      tempRange: "25 - 30°C",
      humidityRange: "60 - 80%",
      phRange: "4.5 - 6.5",
      plantingDensity: "1m x 0.8m",
      watering: "Chịu hạn tốt, tưới khi đất quá khô",
    },
  },
  {
    id: 5,
    code: "DN-DT84-005",
    illustration:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/390/808/products/thuong-thuc-dau-nanh-theo-phong-cach-singapore-1.jpg?v=1592987555860",
    name: "Đậu nành",
    cropType: "Đậu nành",
    cropGroup: "Cây lương thực (Cereal & Grain)",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Glycine max",
      family: "Họ Đậu (Fabaceae)",
      origin: "Việt Nam",
      tempRange: "20 - 30°C",
      humidityRange: "60 - 70%",
      phRange: "6.0 - 7.0",
      plantingDensity: "40cm x 10cm",
      watering: "Tưới đều giai đoạn ra hoa",
    },
  },
  {
    id: 6,
    code: "CP-ROB-006",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwpgyUZzOe9-8dwoGxhOxZpf_Zfbisx7Pe_w&s",
    name: "Cà phê",
    cropType: "Cà phê",
    cropGroup: "Cây công nghiệp (Industrial Crops)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Coffea canephora",
      family: "Họ Thiến thảo (Rubiaceae)",
      origin: "Trung Phi",
      tempRange: "22 - 26°C",
      humidityRange: "70 - 80%",
      phRange: "5.0 - 6.0",
      plantingDensity: "3m x 3m",
      watering: "Tưới đuổi sau khi bón phân, tưới hoa",
    },
  },
  {
    id: 7,
    code: "NGO-NK-007",
    illustration:
      "https://hatgiongdalat.com/asset/upload/image/hat-giong-ngo-ngot.jpg?v=20190410",
    name: "Ngô",
    cropType: "Ngô",
    cropGroup: "Cây lương thực (Cereal & Grain)",
    harvestMethod: "machine",
    technicalSpecs: {
      scientificName: "Zea mays",
      family: "Họ Hòa thảo (Poaceae)",
      origin: "Mỹ",
      tempRange: "20 - 30°C",
      humidityRange: "65 - 75%",
      phRange: "5.5 - 7.0",
      plantingDensity: "70cm x 25cm",
      watering: "Cần nhiều nước lúc trổ cờ, phun râu",
    },
  },
  {
    id: 8,
    code: "CS-RR-008",
    illustration:
      "https://shondoshoes.com/cdn/shop/articles/cao-su-la-gi.jpg?v=1743394151&width=2048",
    name: "Cao su",
    cropType: "Cao su",
    cropGroup: "Cây công nghiệp (Industrial Crops)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Hevea brasiliensis",
      family: "Họ Thầu dầu (Euphorbiaceae)",
      origin: "Vùng Amazon (Nam Mỹ)",
      tempRange: "25 - 30°C",
      humidityRange: "75 - 85%",
      phRange: "4.5 - 5.5",
      plantingDensity: "6m x 3m (555 cây/ha)",
      watering: "Trung bình, thoát nước tốt",
    },
  },
  {
    id: 9,
    code: "CHE-KT-009",
    illustration: "https://hacoocha.com/wp-content/uploads/tra-la-gi.jpg",
    name: "Chè",
    cropType: "Chè",
    cropGroup: "Cây công nghiệp (Industrial Crops)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Camellia sinensis",
      family: "Họ Chè (Theaceae)",
      origin: "Đài Loan",
      tempRange: "18 - 25°C",
      humidityRange: "80 - 85%",
      phRange: "4.5 - 5.5",
      plantingDensity: "1.2m x 0.4m",
      watering: "Tưới phun sương giữ ẩm",
    },
  },
  {
    id: 10,
    code: "TIEU-VL-010",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQUx_lbM5dshfa9k4WVd_kfgUGEqHeaSetOw&s",
    name: "Hồ tiêu",
    cropType: "Hồ tiêu",
    cropGroup: "Cây công nghiệp (Industrial Crops)",
    harvestMethod: "manual",
    technicalSpecs: {
      scientificName: "Piper nigrum",
      family: "Họ Hồ tiêu (Piperaceae)",
      origin: "Ấn Độ",
      tempRange: "25 - 30°C",
      humidityRange: "70 - 90%",
      phRange: "5.5 - 7.0",
      plantingDensity: "2m x 2m (trụ đơn)",
      watering: "Tưới giữ đất ẩm, không úng nước",
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
      "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/sauriengri6/sauriengri62.jpg.webp",
    varietyName: "Cây giống Sầu riêng Ri6",
    varietyCode: "SR-RI6-001",
    supplier: "Trung tâm Giống cây trồng Miền Tây",
    origin: "Việt Nam",
    germinationRate: "98%",
    yield: "15-20 tấn/ha",
  },
  {
    id: "s2",
    illustration: "https://giongcamau.vn/uploads/shops/2017_03/om5451-copy.jpg",
    varietyName: "Hạt giống Lúa OM5451",
    varietyCode: "LUA-OM5451",
    supplier: "Tập đoàn Lộc Trời",
    origin: "An Giang, Việt Nam",
    germinationRate: "95%",
    yield: "6-8 tấn/ha/vụ",
  },
  {
    id: "s3",
    illustration:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1000",
    varietyName: "Cây giống Cà phê Robusta TR4",
    varietyCode: "CP-TR4",
    supplier: "Viện WASI",
    origin: "Đắk Lắk, Việt Nam",
    germinationRate: "92%",
    yield: "3-5 tấn nhân/ha",
  },
  {
    id: "s4",
    illustration: "https://media.baochinhphu.vn/images/2023/12/30/ngo.jpg",
    varietyName: "Hạt giống Ngô NK7328",
    varietyCode: "NGO-NK7328",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan/Mỹ",
    germinationRate: "96%",
    yield: "10-12 tấn hạt/ha",
  },
  {
    id: "s5",
    illustration: "https://vneconomy.vn/cache/original/2021/04/15/tieu.jpg",
    varietyName: "Hom giống Hồ tiêu Vĩnh Linh",
    varietyCode: "TIEU-VL",
    supplier: "Vườn ươm Lộc Ninh",
    origin: "Quảng Trị, Việt Nam",
    germinationRate: "90%",
    yield: "3-4 tấn/ha",
  },
];
