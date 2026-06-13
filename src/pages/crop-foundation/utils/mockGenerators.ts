import type {
  SeedInfo,
  CropFoundationStatus,
  FarmingHistoryItem,
  DiseaseHistoryItem,
  HarvestHistoryItem,
  IoTData,
} from "../types/types";

export const generateSeedInfo = (): SeedInfo => ({
  supplier: "Công ty Giống cây trồng Miền Tây",
  importDate: new Date(
    2024,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toLocaleDateString("vi-VN"),
  importLink: "#",
  contractId: `HĐ-${Math.floor(Math.random() * 9000) + 1000}`,
  documents: [
    { name: "Giấy chứng nhận kiểm dịch thực vật.pdf", url: "#" },
    { name: "Hợp đồng nhập khẩu giống.pdf", url: "#" },
  ],
});

export const generateCropFoundationStatus = (): CropFoundationStatus => ({
  area: `Khu ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
  location: `Lô ${Math.floor(Math.random() * 20) + 1}`,
  lote: `LOTE-${Math.floor(Math.random() * 900) + 100}`,
  owner: "Nông trại Eco Farm",
  plantDate: new Date(
    2022,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  ).toLocaleDateString("vi-VN"),
  age: `${Math.floor(Math.random() * 3) + 1} năm ${Math.floor(Math.random() * 12)} tháng`,
  status: ["Tốt", "Rất tốt", "Khỏe mạnh"][Math.floor(Math.random() * 3)],
  responsiblePerson: {
    executor: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"][
      Math.floor(Math.random() * 3)
    ],
    manager: ["Phạm Văn D", "Hoàng Thị E"][Math.floor(Math.random() * 2)],
    inspector: ["Vũ Văn F", "Đỗ Thị G"][Math.floor(Math.random() * 2)],
  },
});

export const generateFarmingHistory = (): FarmingHistoryItem[] => {
  const activities = [
    "Bón phân",
    "Tưới nước",
    "Xới đất",
    "Phun thuốc",
    "Tỉa cành",
  ];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `fh-${i + 1}`,
    time: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString("vi-VN"),
    action: activities[Math.floor(Math.random() * activities.length)],
    executor: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"][
      Math.floor(Math.random() * 3)
    ],
    manager: ["Phạm Văn D", "Hoàng Thị E"][Math.floor(Math.random() * 2)],
    inspector: ["Vũ Văn F", "Đỗ Thị G"][Math.floor(Math.random() * 2)],
  }));
};

export const generateDiseaseHistory = (): DiseaseHistoryItem[] => {
  const diseases = ["Bệnh thán thư", "Bệnh đốm lá", "Sâu đục thân"];
  return Array.from({ length: 2 }, (_, i) => ({
    id: `dh-${i + 1}`,
    startTime: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString("vi-VN"),
    diseaseName: diseases[Math.floor(Math.random() * diseases.length)],
    note: "Phát hiện sớm, diện tích ảnh hưởng nhỏ",
    treatmentTime: `${Math.floor(Math.random() * 10) + 5} ngày`,
    treatmentProcess: [
      {
        milestone: "Phát hiện",
        date: "01/02/2024",
        description: "Kiểm tra định kỳ phát hiện dấu hiệu bệnh",
      },
      {
        milestone: "Xử lý",
        date: "02/02/2024",
        description: "Phun thuốc chuyên dụng",
      },
      {
        milestone: "Theo dõi",
        date: "05/02/2024",
        description: "Kiểm tra lại, tình trạng cải thiện",
      },
    ],
    materialsUsed: [
      { name: "Thuốc trừ nấm", quantity: "2", unit: "lít" },
      { name: "Phân bón lá", quantity: "1", unit: "kg" },
    ],
  }));
};

export const generateHarvestHistory = (): HarvestHistoryItem[] => {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `hh-${i + 1}`,
    time: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString("vi-VN"),
    yield: `${(Math.random() * 500 + 100).toFixed(1)} kg`,
    harvester: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"][
      Math.floor(Math.random() * 3)
    ],
  }));
};

export const generateIoTData = (): IoTData => ({
  current: [
    {
      label: "Nhiệt độ",
      value: (Math.random() * 5 + 25).toFixed(1),
      unit: "°C",
      trend: "stable",
    },
    {
      label: "Độ ẩm",
      value: (Math.random() * 10 + 70).toFixed(0),
      unit: "%",
      trend: "up",
    },
    {
      label: "pH đất",
      value: (Math.random() * 1 + 5.5).toFixed(1),
      unit: "",
      trend: "stable",
    },
    {
      label: "Ánh sáng",
      value: (Math.random() * 20000 + 30000).toFixed(0),
      unit: "lux",
      trend: "down",
    },
  ],
  history3Days: [
    {
      label: "Nhiệt độ",
      value: (Math.random() * 5 + 25).toFixed(1),
      unit: "°C",
    },
    { label: "Độ ẩm", value: (Math.random() * 10 + 70).toFixed(0), unit: "%" },
  ],
  history1Week: [
    {
      label: "Nhiệt độ",
      value: (Math.random() * 5 + 25).toFixed(1),
      unit: "°C",
    },
    { label: "Độ ẩm", value: (Math.random() * 10 + 70).toFixed(0), unit: "%" },
  ],
  history1Month: [
    {
      label: "Nhiệt độ",
      value: (Math.random() * 5 + 25).toFixed(1),
      unit: "°C",
    },
    { label: "Độ ẩm", value: (Math.random() * 10 + 70).toFixed(0), unit: "%" },
  ],
});
