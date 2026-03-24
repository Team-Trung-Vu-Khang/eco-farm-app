import type { Pesticide } from "../types";

export const initialPesticides: Pesticide[] = [
  {
    id: 1,
    code: "BVTV001",
    name: "Actara 25WG",
    group: "Thuốc trừ sâu",
    form: "WP (bột thấm nước)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Thiamethoxam 25%",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "BVTV002",
    name: "Score 250EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Difenoconazole 25%",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "BVTV003",
    name: "Gramoxone 20SL",
    group: "Thuốc trừ cỏ",
    form: "SL (dạng lỏng)",
    actionType: "Tiếp xúc",
    origin: "Thuốc hóa học",
    activeIngredient: "Paraquat 20%",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "BVTV004",
    name: "Reasgant 3.6EC",
    group: "Thuốc trừ sâu",
    form: "EC (nhũ dầu)",
    actionType: "Tiếp xúc, vị độc",
    origin: "Thuốc sinh học",
    activeIngredient: "Abamectin 3.6%",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "BVTV005",
    name: "Tilt Super 300EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Propiconazole 15% + Difenoconazole 15%",
    status: "inactive",
    createdAt: "2024-01-14",
  },
];

export const pesticideGroups = [
  "Thuốc trừ sâu",
  "Thuốc trừ bệnh",
  "Thuốc trừ cỏ",
  "Thuốc trừ chuột",
  "Thuốc trừ tuyến trùng",
  "Thuốc trừ ốc, nhện, rệp",
];

export const pesticideForms = [
  "WP (bột thấm nước)",
  "EC (nhũ dầu)",
  "SC (huyền phù đậm đặc)",
  "SL (dạng lỏng)",
  "GR (dạng hạt)",
  "WG (hạt phân tán trong nước)",
];

export const actionTypes = [
  "Tiếp xúc",
  "Vị độc",
  "Xông hơi",
  "Nội hấp (lưu dẫn)",
  "Tiếp xúc, vị độc",
];

export const origins = [
  "Thuốc hóa học",
  "Thuốc sinh học",
  "Thuốc thảo mộc",
  "Thuốc khoáng",
];

export const commonHashtags = [
  "HieuQuaCao",
  "AnToan",
  "SinhHoc",
  "PhoRong",
  "DacTriSauCuonLa",
  "DacTriRayNau",
];

export const suppliers = [
  { id: "sup1", name: "Công ty CP Bảo vệ Thực vật 1", type: "enterprise" },
  { id: "sup2", name: "Đại lý VTNN Hòa Phát", type: "enterprise" },
  { id: "sup3", name: "HTX Nông nghiệp Xanh", type: "enterprise" },
  { id: "sup4", name: "Nông hộ Nguyễn Văn A", type: "farmer" },
];

export const units = ["Chai", "Gói", "Thùng", "Can", "Bao"];
