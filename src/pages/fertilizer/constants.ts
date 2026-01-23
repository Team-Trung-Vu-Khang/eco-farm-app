// Defines constants, interfaces for Fertilizer Domain

export interface Fertilizer {
  id: number;
  code: string;
  name: string;
  type: string;
  nutrientContent: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const initialFertilizers: Fertilizer[] = [
  {
    id: 1,
    code: "PB001",
    name: "NPK 20-20-15 Đầu Trâu",
    type: "Phân vô cơ",
    nutrientContent: "N: 20%, P: 20%, K: 15%",
    description: "Phân bón NPK cao cấp, kích thích ra rễ, đẻ nhánh",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    code: "PB002",
    name: "Phân hữu cơ vi sinh Sông Gianh",
    type: "Phân hữu cơ",
    nutrientContent: "Hữu cơ: 15%, Axit Humic: 2.5%",
    description: "Cải tạo đất, cung cấp mùn hữu cơ",
    status: "active",
    createdAt: "2024-01-21",
  },
  {
    id: 3,
    code: "PB003",
    name: "Đạm Phú Mỹ",
    type: "Phân đơn",
    nutrientContent: "N: 46%",
    description: "Giúp cây sinh trưởng nhanh, lá xanh tốt",
    status: "active",
    createdAt: "2024-01-22",
  },
];

export const fertilizerTypes = [
  "Phân vô cơ",
  "Phân hữu cơ",
  "Phân vi sinh",
  "Phân bón lá",
  "Phân đơn",
  "Phân phức hợp",
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
