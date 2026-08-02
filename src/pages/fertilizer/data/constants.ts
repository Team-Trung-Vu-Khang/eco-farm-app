// Defines constants, interfaces for Fertilizer Domain

export interface Fertilizer {
  id: number;
  code: string;
  name: string;
  nutritionalContentId: string;
  originId: string;
  applicationStageId: string;
  physicalFormId: string;
  nutrientContent: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const nutritionalContentOptions = [
  { id: "macronutrients", label: "Nhóm Đa lượng" },
  { id: "secondary_nutrients", label: "Nhóm Trung lượng" },
  { id: "micronutrients", label: "Nhóm Vi lượng" },
];

export const originOptions = [
  { id: "inorganic", label: "Phân Vô cơ" },
  { id: "organic", label: "Phân Hữu cơ" },
  { id: "biological", label: "Phân Sinh học / Vi sinh" },
];

export const applicationStageOptions = [
  { id: "basal_application", label: "Bón lót" },
  { id: "top_dressing", label: "Bón thúc" },
];

export const physicalFormOptions = [
  { id: "soil_application", label: "Phân bón gốc" },
  { id: "foliar_application", label: "Phân bón lá" },
];

export const initialFertilizers: Fertilizer[] = [
  {
    id: 1,
    code: "PB001",
    name: "NPK 20-20-15 Đầu Trâu",
    nutritionalContentId: "macronutrients",
    originId: "inorganic",
    applicationStageId: "top_dressing",
    physicalFormId: "soil_application",
    nutrientContent: "N: 20%, P: 20%, K: 15%",
    description: "Phân bón NPK cao cấp, kích thích ra rễ, đẻ nhánh",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    code: "PB002",
    name: "Phân hữu cơ vi sinh Sông Gianh",
    nutritionalContentId: "macronutrients",
    originId: "organic",
    applicationStageId: "basal_application",
    physicalFormId: "soil_application",
    nutrientContent: "Hữu cơ: 15%, Axit Humic: 2.5%",
    description: "Cải tạo đất, cung cấp mùn hữu cơ",
    status: "active",
    createdAt: "2024-01-21",
  },
  {
    id: 3,
    code: "PB003",
    name: "Phân vi sinh Trichoderma",
    nutritionalContentId: "micronutrients",
    originId: "biological",
    applicationStageId: "basal_application",
    physicalFormId: "soil_application",
    nutrientContent: "Vi sinh vật: 10^8 CFU/g",
    description: "Phòng trừ bệnh đất, kích thích sinh trưởng rễ",
    status: "active",
    createdAt: "2024-01-26",
  },
  {
    id: 4,
    code: "PB004",
    name: "Phân bón lá Canxi Boron",
    nutritionalContentId: "secondary_nutrients",
    originId: "inorganic",
    applicationStageId: "top_dressing",
    physicalFormId: "foliar_application",
    nutrientContent: "Ca: 15%, B: 0.5%",
    description: "Phòng nứt quả, tăng độ cứng vỏ, chống rụng hoa",
    status: "active",
    createdAt: "2024-01-30",
  }
];

export const commonHashtags = [
  "TangTruongNhanh",
  "CaiTaoDat",
  "RaHoaDauQua",
  "AnToanSinhHoc",
  "ChuyenDungCayAnQua",
];

export const suppliers = [
  { id: "sup1", name: "Công ty Phân bón Bình Điền", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Bao", "Gói", "Thùng", "Chai", "Can", "Tấn", "Kg"];
