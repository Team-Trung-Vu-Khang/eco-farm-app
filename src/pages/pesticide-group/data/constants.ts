import type {
  PesticideCategoryFormData,
  PesticideCategoryItem,
  PesticideToxicityFormData,
  PesticideToxicityItem,
} from "../types";

export const initialPesticidePurposes: PesticideCategoryItem[] = [
  {
    id: 1,
    code: "INSECTICIDE",
    name: "Thuốc trừ sâu",
    description: "Phòng trừ sâu, nhện, rầy, sâu cuốn lá, sâu đục thân",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "FUNGICIDE",
    name: "Thuốc trừ bệnh",
    description: "Phòng trừ nấm, vi khuẩn, virus gây bệnh",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "HERBICIDE",
    name: "Thuốc trừ cỏ",
    description: "Diệt cỏ dại",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "RODENTICIDE",
    name: "Thuốc trừ chuột",
    description: "Diệt chuột",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "MOLLUSCICIDE",
    name: "Thuốc trừ ốc",
    description: "Diệt ốc sên, ốc bươu vàng",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "PGR",
    name: "Thuốc điều hòa sinh trưởng",
    description:
      "Kích thích hoặc ức chế sinh trưởng cây trồng (làm trái to, ra hoa trái vụ)",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "ATTRACTANT",
    name: "Chất dẫn dụ côn trùng",
    description: "Thu hút côn trùng để bẫy",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "ADJUVANT",
    name: "Chất hỗ trợ",
    description: "Tăng hiệu quả bám dính, lan tỏa của thuốc (chất trải)",
    status: "active",
    createdAt: "2024-01-17",
  },
  {
    id: 9,
    code: "OTHER",
    name: "Các nhóm khác",
    description:
      "Thuốc trừ mối, thuốc bảo quản lâm sản, thuốc khử trùng kho, thuốc xử lý hạt giống, thuốc bảo quản nông sản sau thu hoạch",
    status: "active",
    createdAt: "2024-01-18",
  },
];

export const initialPesticideOrigins: PesticideCategoryItem[] = [
  {
    id: 1,
    code: "CHEMICAL",
    name: "Thuốc hóa học",
    description:
      "Hóa học tổng hợp: Clo hữu cơ, phospho hữu cơ, carbamat, pyrethroid, neonicotinoid",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "BIOLOGICAL",
    name: "Thuốc sinh học",
    description:
      "Từ vi sinh vật, nấm, vi khuẩn (Bacillus thuringiensis), tinh dầu thực vật, pheromone",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "NATURAL",
    name: "Thuốc thảo mộc / Tự nhiên",
    description: "Chiết xuất neem, tỏi ớt, các nguồn thực vật tự nhiên",
    status: "active",
    createdAt: "2024-01-12",
  },
];

export const initialPesticideToxicities: PesticideToxicityItem[] = [
  {
    id: 1,
    code: "WHO_IA",
    name: "Rất độc",
    whoClass: "Ia",
    colorBand: "#EF4444",
    ld50Range: "LD50 < 5 mg/kg (rắn) hoặc < 20 mg/kg (lỏng)",
    description: "Nhóm Ia - Băng màu đỏ - Cực kỳ nguy hiểm",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "WHO_IB",
    name: "Độc",
    whoClass: "Ib",
    colorBand: "#DC2626",
    ld50Range: "LD50 5-50 mg/kg (rắn) hoặc 20-200 mg/kg (lỏng)",
    description: "Nhóm Ib - Băng màu đỏ - Rất nguy hiểm",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "WHO_II",
    name: "Nguy hiểm",
    whoClass: "II",
    colorBand: "#FBBF24",
    ld50Range: "LD50 50-500 mg/kg (rắn) hoặc 200-2000 mg/kg (lỏng)",
    description: "Nhóm II - Băng màu vàng - Cần thận trọng",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "WHO_III",
    name: "Cẩn thận",
    whoClass: "III",
    colorBand: "#3B82F6",
    ld50Range: "LD50 > 500 mg/kg",
    description: "Nhóm III - Băng màu xanh da trời - Độc tính trung bình",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "WHO_IV",
    name: "Ít độc / An toàn tương đối",
    whoClass: "IV",
    colorBand: "#10B981",
    ld50Range: "LD50 rất cao",
    description: "Nhóm IV - Băng màu xanh lá - Tương đối an toàn",
    status: "active",
    createdAt: "2024-01-14",
  },
];

export const emptyPesticideCategoryFormData: PesticideCategoryFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};

export const emptyPesticideToxicityFormData: PesticideToxicityFormData = {
  code: "",
  name: "",
  whoClass: "III",
  colorBand: "#3B82F6",
  ld50Range: "",
  description: "",
  status: "active",
};
