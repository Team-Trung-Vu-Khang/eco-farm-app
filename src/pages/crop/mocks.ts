import type { Crop } from "./types";
import { initialEditorValue } from "../docs/mocks";

export const CROP_HIERARCHY: Record<string, Record<string, string[]>> = {
  "Cây ăn quả": {
    "Sầu riêng": ["Ri6", "Dona", "Musang King"],
    Xoài: ["Cát Chu", "Cát Hòa Lộc", "Tượng"],
    "Thanh long": ["Ruột đỏ", "Ruột trắng"],
    Bưởi: ["Da xanh", "Năm Roi"],
  },
  "Cây công nghiệp": {
    "Cà phê": ["Robusta", "Arabica", "Cherry"],
    "Hồ tiêu": ["Vĩnh Linh", "Lộc Ninh"],
    "Cao su": ["RRIV 124", "PB 260"],
  },
  "Cây lương thực": {
    Lúa: ["OM5451", "ST25", "Đài Thơm 8", "IR50404"],
    Bắp: ["LVN10", "NK66", "CP511"],
    "Khoai lang": ["Nhật", "Lệ Cần"],
  },
  "Rau màu": {
    Ớt: ["Chỉ thiên", "Sừng trâu"],
    "Cà chua": ["Số 9", "Bi", "Savio"],
    "Dưa leo": ["NS 172", "Happy 02"],
  },
  "Cây gia vị": {
    Gừng: ["Trâu", "Sẻ"],
    Sả: ["Chanh", "Dịu"],
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
    harvestMethod: "Thu hoạch bằng tay",
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
    harvestMethod: "Thu hái từng trái, dùng kéo cắt cuống",
  },
  {
    id: 3,
    code: "TREE003",
    illustration:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200",
    name: "Xoài Cát Chu",
    cropType: "Xoài",
    cropGroup: "Cây ăn trái",
    harvestMethod: "Thu hoạch bằng kéo, tránh dập trái",
  },
  {
    id: 4,
    code: "TREE004",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj3D221UbqA5WhiVpyqe8pZWwNpCfrTDSS5kJDrKERG4k3qIAf95vosUl8R_rWKD2bMyWRmTz7psbp4n8J4mFcFefz4v7dVhFRh7hhm9SagIA6PYUf&s=10&ec=121507562",
    name: "Thanh long ruột đỏ",
    cropType: "Thanh long",
    cropGroup: "Cây ăn trái",
    harvestMethod: "Thu hái bằng tay, dùng kéo cắt cuống",
  },
  {
    id: 5,
    code: "TREE005",
    illustration:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=200",
    name: "Cà phê Robusta",
    cropType: "Cà phê",
    cropGroup: "Cây công nghiệp",
    harvestMethod: "Hái chọn quả chín, phơi hoặc sấy",
  },
  {
    id: 6,
    code: "TREE006",
    illustration: "https://giongcamau.vn/uploads/shops/2017_03/om5451-copy.jpg",
    name: "Lúa OM5451",
    cropType: "Lúa",
    cropGroup: "Cây lương thực",
    harvestMethod: "Gặt máy hoặc thủ công",
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
  { label: "Cây con", value: "Cây con" },
  { label: "Sinh trưởng mạnh", value: "Sinh trưởng mạnh" },
  { label: "Ra hoa", value: "Ra hoa" },
  { label: "Kết trái", value: "Kết trái" },
  { label: "Thu hoạch", value: "Thu hoạch" },
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
    varietyName: "Hạt giống Sầu riêng Ri6",
    varietyCode: "SR-RI6-001",
    supplier: "Trung tâm Giống cây trồng Miền Tây",
    origin: "Việt Nam",
    germinationRate: "95%",
    yield: "15-20 tấn/ha",
  },
  {
    id: "s2",
    illustration:
      "https://nongsantaynguyen.net/wp-content/uploads/2017/04/sau-rieng-dona-sau-rieng-thai-lan.jpg",
    varietyName: "Hạt giống Sầu riêng Dona",
    varietyCode: "SR-DONA-002",
    supplier: "Công ty Mekong Seed",
    origin: "Thái Lan",
    germinationRate: "92%",
    yield: "18-25 tấn/ha",
  },
  {
    id: "s3",
    illustration:
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/sau_Musa_King_01_0ea1377077.jpg",
    varietyName: "Hạt giống Sầu riêng Musang King",
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
    varietyName: "Hạt giống Sầu riêng Black Thorn",
    varietyCode: "SR-BT-004",
    supplier: "Green Farm Agritech",
    origin: "Malaysia",
    germinationRate: "88%",
    yield: "8-10 tấn/ha",
  },
];
